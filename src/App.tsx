import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Home from '@/pages/Home';
import CategoryPage from '@/pages/CategoryPage';
import ProjectDetail from '@/pages/ProjectDetail';
import { type CategoryId } from '@/data/categories';
import { getProjectById } from '@/data/projects';

type Page = 'home' | 'projects' | 'about' | 'contact' | 'project-detail';
type View = 'home' | 'category' | 'project-detail';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [scrollTo, setScrollTo] = useState<string | undefined>();
  const [categoryId, setCategoryId] = useState<CategoryId>('ux-ui');
  const [projectId, setProjectId] = useState<number>(1);

  // Navegación desde la NavBar. Las secciones (proyectos/sobre mí/contacto)
  // viven en el Home, así que cualquier destino que no sea el detalle vuelve
  // al Home y hace scroll a la sección correspondiente.
  function navigate(target: Page) {
    if (target === 'home') {
      setView('home');
      setScrollTo(undefined);
    } else {
      setView('home');
      setScrollTo(target);
    }
    window.scrollTo({ top: 0 });
  }

  function handleCategoryClick(id: CategoryId) {
    setCategoryId(id);
    setView('category');
    setScrollTo(undefined);
    window.scrollTo({ top: 0 });
  }

  function handleProjectClick(id: number) {
    setProjectId(id);
    setView('project-detail');
    setScrollTo(undefined);
    window.scrollTo({ top: 0 });
  }

  function backToCategory() {
    const project = getProjectById(projectId);
    if (project) setCategoryId(project.categoryId);
    setView('category');
    window.scrollTo({ top: 0 });
  }

  function backToHome() {
    setView('home');
    window.scrollTo({ top: 0 });
  }

  const navPage: Page = view === 'home' ? 'home' : 'project-detail';

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <NavBar currentPage={navPage} onNavigate={navigate} />
      {view === 'project-detail' ? (
        <ProjectDetail projectId={projectId} onBack={backToCategory} />
      ) : view === 'category' ? (
        <CategoryPage
          categoryId={categoryId}
          onProjectClick={handleProjectClick}
          onBack={backToHome}
        />
      ) : (
        <Home onCategoryClick={handleCategoryClick} scrollTo={scrollTo} />
      )}
    </div>
  );
}
