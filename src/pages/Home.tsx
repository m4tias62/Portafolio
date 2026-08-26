import { useRef, useState, useEffect, useCallback } from 'react';
import imgPresentation from '@/imports/Prototipo/556ea8de7896ac0e95b5d5e013e9d3d3dd50db21.png';
import ProgressBar from '@/components/ProgressBar';
import TrenzaDoradaOverture from '@/components/TrenzaDoradaOverture';

type HomeProps = {
  onProjectClick: (id: number) => void;
  scrollTo?: string;
};

type Project = {
  id: number;
  title: string;
  year: string;
  category: string;
  description: string;
  available: boolean;
};

const projects: Project[] = [
  {
    id: 1,
    title: 'Sistema MIU',
    year: '2024',
    category: 'Diseño generativo',
    description: 'Exploración del sistema MIU de Hofstadter aplicado a tipografía generativa.',
    available: true,
  },
  {
    id: 2,
    title: 'Edubig',
    year: '2025',
    category: 'Product design',
    description: 'Plataforma de decisión escolar para familias de la comuna de Pudahuel.',
    available: false,
  },
  {
    id: 3,
    title: 'Tribu Impulsa',
    year: '2025',
    category: 'Product design',
    description: 'Plataforma chilena de emprendimiento y networking.',
    available: false,
  },
  {
    id: 4,
    title: 'Vivit — Accesibilidad',
    year: '2025',
    category: 'Investigación UX',
    description: 'Benchmark consolidado de mejores prácticas en extensiones de accesibilidad web.',
    available: false,
  },
];


function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const disabled = !project.available;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`flex flex-col items-start shrink-0 group text-left ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
      style={{ width: 520 }}
    >
      <div
        className={`w-full relative overflow-hidden ${
          disabled ? 'bg-[#f2f1ec] border border-[#dcdbd5]' : 'bg-[#ebeae4]'
        }`}
        style={{ height: 420 }}
      >
        {!disabled && (
          <div className="absolute inset-0 border-2 border-[#0f0f0e] opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] text-[#8a8a85]">
            {disabled ? 'En preparación' : project.title}
          </span>
        </div>
      </div>
      <div className="pt-3">
        <p className={`font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] tracking-[1.43px] leading-[1.47] uppercase ${
          disabled ? 'text-[#b6b5b0]' : 'text-[#8a8a85]'
        }`}>
          {project.category} — {project.year}
        </p>
        <p
          className={`font-['IBM_Plex_Sans:Regular',sans-serif] text-[20px] leading-[1.2] tracking-[-0.2px] mt-1 ${
            disabled ? 'text-[#8a8a85]' : 'text-[#0f0f0e]'
          }`}
          style={{ fontVariationSettings: '"wdth" 100' }}
        >
          {project.title}
        </p>
        <p className={`font-['IBM_Plex_Sans:Regular',sans-serif] text-[14px] leading-[1.5] mt-1 max-w-[420px] ${
          disabled ? 'text-[#8a8a85]' : 'text-[#3a3a38]'
        }`}>
          {project.description}
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

  // Smooth wheel-to-horizontal + drag-to-scroll (fluido, sin saltos)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    // -- Wheel con inercia (rueda de mouse vertical → scroll horizontal) --
    let target = el.scrollLeft;
    let rafId: number | null = null;

    const stepToTarget = () => {
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = target;
        rafId = null;
        return;
      }
      el.scrollLeft += diff * 0.18; // damping: valores más bajos = más suave
      rafId = requestAnimationFrame(stepToTarget);
    };

    const onWheel = (e: WheelEvent) => {
      // Trackpad horizontal (dos dedos hacia el lado) ya funciona nativo — dejarlo pasar.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // Rueda vertical: interceptar y traducir a horizontal con inercia.
      e.preventDefault();
      const max = el.scrollWidth - el.clientWidth;
      target = Math.max(0, Math.min(max, target + e.deltaY));
      if (rafId === null) rafId = requestAnimationFrame(stepToTarget);
    };

    // -- Drag para arrastrar el carrusel con el mouse --
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      // Solo botón izquierdo, y no capturar clicks sobre las cards navegables
      if (e.button !== 0) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartScroll = el.scrollLeft;
      target = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      el.scrollLeft = dragStartScroll - dx;
      target = el.scrollLeft;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      el.style.cursor = '';
      el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

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
        <div className="bg-[#fafaf7] border border-[#ebeae4] relative" style={{ minHeight: 460, height: 460 }}>
          <TrenzaDoradaOverture />
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
            className="flex gap-[96px] overflow-x-auto pb-4 select-none cursor-grab"
            style={{ scrollbarWidth: 'none' }}
          >
            {projects.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                onClick={() => {
                  if (p.available) onProjectClick(p.id);
                }}
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
