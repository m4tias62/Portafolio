import { useState } from 'react';
import NavBar from '@/components/NavBar';
import Home from '@/pages/Home';
import ProjectDetail from '@/pages/ProjectDetail';

type Page = 'home' | 'projects' | 'about' | 'contact' | 'project-detail';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [scrollTo, setScrollTo] = useState<string | undefined>();

  function navigate(target: Page) {
    if (target === 'project-detail') {
      setPage('project-detail');
      setScrollTo(undefined);
    } else if (target === 'home') {
      setPage('home');
      setScrollTo(undefined);
    } else {
      setPage('home');
      setScrollTo(target);
    }
  }

  function handleProjectClick(_id: number) {
    setPage('project-detail');
    setScrollTo(undefined);
  }

  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <NavBar currentPage={page} onNavigate={navigate} />
      {page === 'project-detail' ? (
        <ProjectDetail />
      ) : (
        <Home onProjectClick={handleProjectClick} scrollTo={scrollTo} />
      )}
    </div>
  );
}
