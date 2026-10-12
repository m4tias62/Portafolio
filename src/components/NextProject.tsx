import { categories, getCategoryById } from '@/data/categories';
import { projectsByCategory, type Project } from '@/data/projects';

/**
 * NextProject — banda al pie de cada case study con el siguiente proyecto.
 * Orden = el mismo que ve el visitante en los listados: categorías en el orden
 * de categories.ts y, dentro de cada una, proyectos navegables en el orden de
 * projects.ts. Al llegar al último vuelve al primero.
 */
export function nextProjectOf(currentId: number): Project | undefined {
  const ordered = categories.flatMap(c => projectsByCategory(c.id));
  if (ordered.length < 2) return undefined;
  const i = ordered.findIndex(p => p.id === currentId);
  return ordered[(i + 1) % ordered.length];
}

type NextProjectProps = {
  currentId: number;
  onProjectClick: (id: number) => void;
};

export default function NextProject({ currentId, onProjectClick }: NextProjectProps) {
  const next = nextProjectOf(currentId);
  if (!next) return null;
  const category = getCategoryById(next.categoryId);

  return (
    <nav aria-label="Siguiente proyecto" className="bg-[#fafaf7] border-t border-[#dcdbd5]">
      <div className="px-5 py-[40px] min-[821px]:pl-[188px] min-[821px]:pr-[80px] min-[821px]:py-[64px]">
        <button
          onClick={() => onProjectClick(next.id)}
          className="group w-full text-left cursor-pointer flex flex-col gap-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f0e] focus-visible:ring-offset-8 focus-visible:ring-offset-[#fafaf7]"
        >
          <span className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] text-[#8a8a85] tracking-[1.43px] leading-[1.47] uppercase inline-flex items-center gap-[10px]">
            Siguiente proyecto
            {category && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-[6px]">
                  <span
                    aria-hidden="true"
                    className="inline-block rounded-full"
                    style={{ width: 8, height: 8, background: category.accentColor }}
                  />
                  {category.labelShort}
                </span>
              </>
            )}
          </span>
          <span
            className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[#0f0f0e] leading-[1.1] inline-flex items-baseline gap-[14px]"
            style={{ fontSize: 'clamp(28px, 2.6vw, 40px)' }}
          >
            {next.title}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-[8px]">
              →
            </span>
          </span>
          <span className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[15px] leading-[1.5] text-[#3a3a38] max-w-[60ch]">
            {next.description}
          </span>
          {(next.role || next.status) && (
            <span className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] leading-[1.5] text-[#3a3a38]">
              {[next.role, next.status].filter(Boolean).join(' · ')}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
