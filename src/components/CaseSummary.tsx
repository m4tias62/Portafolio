/**
 * CaseSummary — bloque «En 2 minutos» al inicio de los case studies largos.
 * Tres líneas (Problema / Qué hice / Estado o Resultado) + enlaces a las
 * etapas clave. Los enlaces internos hacen scroll por id (no usan href="#…"
 * porque el hash está reservado para el enrutado de App.tsx).
 * Estilo base del portafolio: IBM Plex, tinta #0f0f0e, marco 1/4/4/1.
 */
type SummaryItem = { label: string; text: string };
type SummaryLink = { label: string; targetId?: string; href?: string };

type CaseSummaryProps = {
  items: SummaryItem[];
  links?: SummaryLink[];
  className?: string;
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
}

const linkClass =
  "font-['IBM_Plex_Mono:Regular',sans-serif] text-[13px] text-[#0f0f0e] underline underline-offset-[3px] decoration-[#8a8a85] hover:decoration-[#0f0f0e] cursor-pointer bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f0e] focus-visible:ring-offset-2";

export default function CaseSummary({ items, links = [], className = '' }: CaseSummaryProps) {
  return (
    <aside
      aria-label="Resumen del caso en 2 minutos"
      className={`bg-white text-[#0f0f0e] ${className}`}
      style={{ borderWidth: '1px 4px 4px 1px', borderStyle: 'solid', borderColor: '#3a3a38', padding: 'clamp(20px, 3vw, 36px)' }}
    >
      <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] tracking-[1.43px] leading-[1.47] uppercase text-[#8a8a85] m-0">
        En 2 minutos
      </p>
      <dl className="m-0 mt-[18px] grid gap-[14px]">
        {items.map(item => (
          <div key={item.label} className="grid gap-[4px] min-[821px]:grid-cols-[150px_1fr] min-[821px]:gap-[24px]">
            <dt className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[12px] tracking-[1px] uppercase text-[#3a3a38] pt-[3px]">
              {item.label}
            </dt>
            <dd className="m-0 font-['IBM_Plex_Sans:Regular',sans-serif] text-[16px] leading-[1.55] text-[#0f0f0e] max-w-[68ch]">
              {item.text}
            </dd>
          </div>
        ))}
      </dl>
      {links.length > 0 && (
        <nav aria-label="Ir a una etapa" className="mt-[20px] pt-[16px] border-t border-[#dcdbd5] flex flex-wrap items-baseline gap-x-[18px] gap-y-[8px]">
          <span className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] tracking-[1.43px] uppercase text-[#8a8a85]">Ir a</span>
          {links.map(l =>
            l.href ? (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass} style={{ color: '#0f0f0e' }}>
                {l.label} ↗
              </a>
            ) : (
              <button key={l.label} type="button" onClick={() => l.targetId && scrollToId(l.targetId)} className={linkClass}>
                {l.label}
              </button>
            ),
          )}
        </nav>
      )}
    </aside>
  );
}
