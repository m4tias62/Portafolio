import { useRef, useState, useEffect, useCallback } from 'react';
import imgPresentation from '@/imports/Prototipo/556ea8de7896ac0e95b5d5e013e9d3d3dd50db21.png';
import ProgressBar from '@/components/ProgressBar';

type HomeProps = {
  onProjectClick: (id: number) => void;
  scrollTo?: string;
};

const projects = [
  {
    id: 1,
    title: 'Sistema MIU',
    year: '2024',
    category: 'Diseño generativo',
    description: 'Exploración del sistema MIU de Hofstadter aplicado a tipografía generativa.',
  },
  {
    id: 2,
    title: 'Cartografía Sonora',
    year: '2023',
    category: 'Visualización de datos',
    description: 'Mapeo visual de paisajes sonoros urbanos en Santiago de Chile.',
  },
  {
    id: 3,
    title: 'Memoria Viva',
    year: '2023',
    category: 'Identidad',
    description: 'Sistema de identidad para archivo de memoria histórica.',
  },
  {
    id: 4,
    title: 'Umbral',
    year: '2022',
    category: 'Tipografía',
    description: 'Familia tipográfica variable diseñada para entornos de alta legibilidad.',
  },
  {
    id: 5,
    title: 'Atlas de Ruido',
    year: '2022',
    category: 'Editorial',
    description: 'Publicación que cartografía la contaminación acústica en zonas metropolitanas.',
  },
];

function MiuDisplay() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 w-full">
      <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[32px] text-[#0f0f0e] leading-normal">
        MI
      </p>
      <div className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[16px] text-[#3a3a38] text-center leading-relaxed">
        <p className="whitespace-pre">MII{'         '}MIU</p>
        <p className="whitespace-pre">​</p>
        <p className="whitespace-pre">MIIII{'    '}MIUIU{'    '}MIIU</p>
        <p className="whitespace-pre">​</p>
        <p className="whitespace-pre">MUIIU{'  '}MIIIIII{'  '}MIIUIIU{'  '}MIIIU</p>
      </div>
      <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[24px] text-[#8a8a85] leading-normal">
        MU
      </p>
      <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] text-[#8a8a85] leading-[1.5]">
        [Placeholder: sistema MIU generado en p5.js — MU permanece afuera del árbol]
      </p>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: typeof projects[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start shrink-0 cursor-pointer group text-left"
      style={{ width: 520 }}
    >
      <div
        className="w-full bg-[#d9d9d9] relative overflow-hidden"
        style={{ height: 420 }}
      >
        <div className="absolute inset-0 border-2 border-[#0f0f0e] opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] text-[#8a8a85]">
            {project.title}
          </span>
        </div>
      </div>
      <div className="pt-3">
        <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] text-[#8a8a85] tracking-[1.43px] leading-[1.47] uppercase">
          {project.category} — {project.year}
        </p>
        <p
          className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[20px] text-[#0f0f0e] leading-[1.2] tracking-[-0.2px] mt-1"
          style={{ fontVariationSettings: '"wdth" 100' }}
        >
          {project.title}
        </p>
      </div>
    </button>
  );
}

export default function Home({ onProjectClick, scrollTo }: HomeProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contactData, setContactData] = useState({ nombre: '', correo: '', mensaje: '' });
  const [sent, setSent] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Track horizontal scroll of the carousel
  const handleCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleCarouselScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleCarouselScroll);
  }, [handleCarouselScroll]);

  // Seek: click on progress bar scrolls the carousel
  function handleSeek(ratio: number) {
    const el = carouselRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: ratio * max, behavior: 'smooth' });
  }

  // Section scroll-to from nav
  useEffect(() => {
    if (!scrollTo) return;
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      projects: projectsRef,
      about: aboutRef,
      contact: contactRef,
    };
    refs[scrollTo]?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [scrollTo]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="bg-[#fafaf7] min-h-screen">
      {/* Hero */}
      <section className="px-[80px] pb-2">
        <div className="bg-[#fafaf7] border border-[#ebeae4] relative" style={{ minHeight: 460 }}>
          <MiuDisplay />
        </div>
      </section>

      {/* Projects */}
      <section ref={projectsRef} id="projects" className="px-[80px] py-[48px] border-t border-b border-[#8a8a85]">
        <div className="pb-[24px]">
          <p
            className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[32px] text-[#0f0f0e] leading-[1.2] tracking-[-0.32px]"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            Proyectos
          </p>
        </div>
        <div className="flex flex-col gap-[48px]">
          <div className="flex justify-center">
            <ProgressBar progress={scrollProgress} onSeek={handleSeek} />
          </div>
          <div
            ref={carouselRef}
            className="flex gap-[96px] overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {projects.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => onProjectClick(p.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Me */}
      <section ref={aboutRef} id="about" className="px-[80px] py-[48px] border-b border-[#8a8a85]">
        <div className="mb-[16px]">
          <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] text-[#8a8a85] tracking-[1.43px] leading-[1.47]">
            Sobre mí
          </p>
          <p
            className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[32px] text-[#0f0f0e] leading-[1.2] tracking-[-0.32px]"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            Matías Cáceres
          </p>
        </div>
        <div className="flex gap-[79px] items-center flex-wrap">
          <div className="shrink-0" style={{ width: 217 }}>
            <div className="relative" style={{ aspectRatio: '540/522' }}>
              <img
                alt="Matías Cáceres"
                src={imgPresentation}
                className="w-full h-full object-cover object-bottom"
                style={{ borderWidth: '2.249px 4.497px 4.497px 2.249px', borderStyle: 'solid', borderColor: '#000' }}
              />
            </div>
            <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] text-black tracking-[1.43px] leading-[1.47] mt-3">
              Diseñador_Universidad Diego Portales_Santiago_De_Chile
            </p>
          </div>
          <div className="flex-1 min-w-[280px] max-w-[400px] p-2">
            <blockquote className="pl-[24px] border-l-2 border-[#0f0f0e]" style={{ minHeight: 80 }}>
              <p
                className="font-['IBM_Plex_Sans:Italic',sans-serif] text-[20px] text-[#0f0f0e] leading-[1.6] italic text-balance"
                style={{ fontVariationSettings: '"wdth" 100' }}
              >
                Las restricciones no limitan el diseño: lo definen. La solución nunca reside en la aplicación mecánica de una fórmula, sino en el criterio para conectar lo que las reglas del sistema no pueden prever.
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section ref={contactRef} id="contact" className="px-[80px] py-[48px]">
        <div style={{ maxWidth: 628 }}>
          <p
            className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[32px] text-[#0f0f0e] leading-[1.2] tracking-[-0.32px] mb-[16px]"
            style={{ fontVariationSettings: '"wdth" 100' }}
          >
            Contáctame
          </p>
          {sent ? (
            <div className="bg-[#f2f1ec] p-[24px]" style={{ borderWidth: '2px 4px 4px 2px', borderStyle: 'solid', borderColor: '#3a3a38' }}>
              <p className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[17px] text-[#0f0f0e] leading-[1.7]" style={{ fontVariationSettings: '"wdth" 100' }}>
                Gracias por escribir. Te responderé pronto.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSend}
              className="bg-[#f2f1ec] flex flex-col gap-[16px] p-[16px]"
              style={{ borderWidth: '2px 4px 4px 2px', borderStyle: 'solid', borderColor: '#3a3a38' }}
            >
              {(['nombre', 'correo', 'mensaje'] as const).map(field => (
                <div key={field} className="flex flex-col gap-[8px]">
                  <label
                    className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[20px] text-black leading-[1.6] capitalize"
                    style={{ fontVariationSettings: '"wdth" 100' }}
                  >
                    {field === 'correo' ? 'Correo' : field === 'mensaje' ? 'Mensaje' : 'Nombre'}
                  </label>
                  {field === 'mensaje' ? (
                    <textarea
                      required
                      value={contactData.mensaje}
                      onChange={e => setContactData(d => ({ ...d, mensaje: e.target.value }))}
                      className="bg-[#dcdbd5] border-[#3a3a38] outline-none px-3 py-2 h-[171px] font-['IBM_Plex_Sans:Regular',sans-serif] text-[14px] text-[#0f0f0e] resize-none w-full"
                      style={{ borderWidth: '0.5px', borderStyle: 'solid' }}
                    />
                  ) : (
                    <input
                      type={field === 'correo' ? 'email' : 'text'}
                      required
                      value={contactData[field]}
                      onChange={e => setContactData(d => ({ ...d, [field]: e.target.value }))}
                      className="bg-[#dcdbd5] border-[#3a3a38] outline-none px-3 h-[41px] font-['IBM_Plex_Sans:Regular',sans-serif] text-[14px] text-[#0f0f0e] w-full"
                      style={{ borderWidth: '0.5px', borderStyle: 'solid' }}
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="self-start font-['IBM_Plex_Mono:Regular',sans-serif] text-[14px] text-[#fafaf7] bg-[#0f0f0e] px-[24px] py-[10px] hover:bg-[#3a3a38] transition-colors"
              >
                Enviar
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e1e1e] px-[80px] py-[64px]">
        <div className="flex items-center justify-between">
          <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[14px] text-[#8a8a85] leading-[1.5]">
            Matías Cáceres — Diseñador
          </p>
          <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] text-[#8a8a85] leading-[1.5]">
            Santiago de Chile · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
