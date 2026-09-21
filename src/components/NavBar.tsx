import { useState } from 'react';

type Page = 'home' | 'projects' | 'about' | 'contact' | 'project-detail';

type NavBarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  theme?: 'light' | 'dark';
};

const links: { label: string; page: Page }[] = [
  { label: 'Inicio', page: 'home' },
  { label: 'Proyectos', page: 'projects' },
  { label: 'Sobre mí', page: 'about' },
  { label: 'Contacto', page: 'contact' },
];

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  const [open, setOpen] = useState(false);

  const isLinkActive = (page: Page) =>
    currentPage === page || (page === 'projects' && currentPage === 'project-detail');

  const go = (page: Page) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-[#fafaf7] border-b border-[#ebeae4] px-5 md:px-[80px]"
      style={{ height: 56 }}
    >
      <div className="flex items-center justify-between h-full">
        <button
          className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[14px] text-[#0f0f0e] leading-[1.5] whitespace-nowrap cursor-pointer"
          onClick={() => go('home')}
        >
          <span className="md:hidden">Matías Cáceres</span>
          <span className="hidden md:inline">Matías Cáceres - Diseñador</span>
        </button>

        {/* Links — desktop */}
        <div className="hidden md:flex gap-[24px] items-center">
          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => go(page)}
              className={`font-['IBM_Plex_Mono:Regular',sans-serif] text-[14px] leading-[1.5] whitespace-nowrap cursor-pointer transition-colors ${
                isLinkActive(page) ? 'text-[#0f0f0e]' : 'text-[#8a8a85] hover:text-[#3a3a38]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Botón hamburguesa — solo móvil */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="nav-mobile-menu"
          className="md:hidden flex items-center justify-center h-11 w-11 -mr-2 cursor-pointer text-[#0f0f0e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f0e]"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {open ? (
              <>
                <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="3" y1="15" x2="19" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Panel desplegable — solo móvil */}
      {open && (
        <div
          id="nav-mobile-menu"
          className="md:hidden absolute left-0 right-0 top-full bg-[#fafaf7] border-b border-[#ebeae4] flex flex-col divide-y divide-[#ebeae4] shadow-[0_10px_28px_rgba(0,0,0,0.07)]"
        >
          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => go(page)}
              className={`font-['IBM_Plex_Mono:Regular',sans-serif] text-[15px] leading-[1.5] text-left px-5 py-[15px] cursor-pointer transition-colors ${
                isLinkActive(page) ? 'text-[#0f0f0e]' : 'text-[#8a8a85] hover:text-[#3a3a38]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
