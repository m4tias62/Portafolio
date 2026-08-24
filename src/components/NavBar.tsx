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

export default function NavBar({ currentPage, onNavigate, theme = 'light' }: NavBarProps) {
  const isDark = theme === 'dark';

  return (
    <nav
      className={`sticky top-0 z-50 w-full px-[80px] ${isDark ? 'bg-[#fafaf7]' : 'bg-[#fafaf7]'} border-b border-[#ebeae4]`}
      style={{ height: 56 }}
    >
      <div className="flex items-center justify-between h-full">
        <button
          className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[14px] text-[#0f0f0e] leading-[1.5] whitespace-nowrap cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          Matías Cáceres - Diseñador
        </button>
        <div className="flex gap-[24px] items-center">
          {links.map(({ label, page }) => {
            const isActive =
              currentPage === page ||
              (page === 'projects' && currentPage === 'project-detail');
            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`font-['IBM_Plex_Mono:Regular',sans-serif] text-[14px] leading-[1.5] whitespace-nowrap cursor-pointer transition-colors ${
                  isActive ? 'text-[#0f0f0e]' : 'text-[#8a8a85] hover:text-[#3a3a38]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
