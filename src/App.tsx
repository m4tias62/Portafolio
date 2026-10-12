import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import Home from '@/pages/Home';
import CategoryPage from '@/pages/CategoryPage';
import ProjectDetail from '@/pages/ProjectDetail';
import { categories, type CategoryId } from '@/data/categories';
import { getProjectById, getProjectBySlug } from '@/data/projects';

type Page = 'home' | 'projects' | 'about' | 'contact' | 'project-detail';

/**
 * Enrutado por hash — cada vista tiene una URL compartible y el botón
 * «atrás» del navegador funciona, sin cambiar la arquitectura de estado:
 *   #/                    → Home
 *   #/ux-ui, #/datos…     → CategoryPage
 *   #/proyecto/<slug>     → ProjectDetail
 * El hash es la fuente de verdad: navegar = escribir el hash; el listener de
 * `hashchange` traduce el hash a estado.
 */
type Route =
  | { view: 'home' }
  | { view: 'category'; categoryId: CategoryId }
  | { view: 'project-detail'; projectId: number };

function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'proyecto' && parts[1]) {
    const p = getProjectBySlug(decodeURIComponent(parts[1]));
    if (p && p.available) return { view: 'project-detail', projectId: p.id };
  }
  const cat = categories.find(c => c.id === parts[0]);
  if (cat) return { view: 'category', categoryId: cat.id };
  return { view: 'home' };
}

function hashFor(route: Route): string {
  if (route.view === 'category') return `#/${route.categoryId}`;
  if (route.view === 'project-detail') {
    const p = getProjectById(route.projectId);
    return p ? `#/proyecto/${p.slug}` : '#/';
  }
  return '#/';
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [scrollTo, setScrollTo] = useState<string | undefined>();

  // Hash → estado (navegación propia, botón atrás/adelante, enlaces pegados).
  useEffect(() => {
    function onHashChange() {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0 });
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Estado → hash. Si el hash ya es el destino no hay `hashchange`, así que se
  // aplica el estado directamente.
  function go(next: Route) {
    const target = hashFor(next);
    if (window.location.hash === target || (target === '#/' && window.location.hash === '')) {
      setRoute(next);
      window.scrollTo({ top: 0 });
    } else {
      window.location.hash = target;
    }
  }

  // Navegación desde la NavBar. Las secciones (proyectos/sobre mí/contacto)
  // viven en el Home: se vuelve al Home y se hace scroll al slide.
  function navigate(target: Page) {
    setScrollTo(target === 'home' ? undefined : target);
    go({ view: 'home' });
  }

  function handleCategoryClick(id: CategoryId) {
    setScrollTo(undefined);
    go({ view: 'category', categoryId: id });
  }

  function handleProjectClick(id: number) {
    setScrollTo(undefined);
    go({ view: 'project-detail', projectId: id });
  }

  function backToCategory() {
    if (route.view !== 'project-detail') return;
    const project = getProjectById(route.projectId);
    go(project ? { view: 'category', categoryId: project.categoryId } : { view: 'home' });
  }

  function backToHome() {
    go({ view: 'home' });
  }

  const navPage: Page = route.view === 'home' ? 'home' : 'project-detail';

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <NavBar currentPage={navPage} onNavigate={navigate} />
      {route.view === 'project-detail' ? (
        <ProjectDetail
          key={route.projectId}
          projectId={route.projectId}
          onBack={backToCategory}
          onProjectClick={handleProjectClick}
        />
      ) : route.view === 'category' ? (
        <CategoryPage
          categoryId={route.categoryId}
          onProjectClick={handleProjectClick}
          onBack={backToHome}
        />
      ) : (
        <Home onCategoryClick={handleCategoryClick} onProjectClick={handleProjectClick} scrollTo={scrollTo} />
      )}
    </div>
  );
}
