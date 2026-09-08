import { useRef, useState, useEffect, useCallback } from 'react';
import imgPresentation from '@/imports/Prototipo/556ea8de7896ac0e95b5d5e013e9d3d3dd50db21.png';
import ProgressBar from '@/components/ProgressBar';
import CKHeroOverture from '@/components/CKHeroOverture';
import SocialLinks from '@/components/SocialLinksButtons';
import { categories, type Category, type CategoryId } from '@/data/categories';

type HomeProps = {
  onCategoryClick: (id: CategoryId) => void;
  scrollTo?: string;
};

/**
 * Card de categoría del carrusel del Home. El Home ya no muestra proyectos
 * sueltos: muestra una card grande por categoría (UX-UI, Datos, Editorial),
 * y al entrar se abre la CategoryPage con el carrusel de proyectos de esa
 * categoría. La card lleva un círculo geométrico en el color de acento de la
 * categoría — mismo lenguaje del sistema — y la misma interactividad hover
 * (micro-escala + sombra + borde) que las cards de proyecto.
 */
function CategoryCard({ category, onClick }: { category: Category; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start shrink-0 group text-left cursor-pointer"
      style={{ width: 560 }}
    >
      <div
        className="w-full relative overflow-hidden bg-[#ebeae4] border border-[#dcdbd5] transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_16px_60px_rgba(0,0,0,0.14)] group-hover:border-[#8a8a85]"
        style={{ height: 460 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="240" height="240" viewBox="0 0 240 240" aria-hidden="true">
            <circle cx="120" cy="120" r="106" fill="none" stroke={category.accentColor} strokeWidth="1.25" />
            <circle
              cx="120"
              cy="120"
              r="52"
              fill={category.accentColor}
              className="transition-transform duration-500 ease-out group-hover:scale-110"
              style={{ transformOrigin: '120px 120px' }}
            />
          </svg>
        </div>
        <span className="absolute left-5 top-5 font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] tracking-[1.43px] leading-[1.47] uppercase text-[#8a8a85]">
          {category.labelShort}
        </span>
      </div>
      <div className="pt-3">
        <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] tracking-[1.43px] leading-[1.47] uppercase text-[#8a8a85]">
          Categoría
        </p>
        <p
          className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[24px] leading-[1.2] tracking-[-0.24px] mt-1 text-[#0f0f0e]"
          style={{ fontVariationSettings: '"wdth" 100' }}
        >
          {category.label}
        </p>
        <p className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[14px] leading-[1.5] mt-1 max-w-[460px] text-[#3a3a38]">
          {category.description}
        </p>
      </div>
    </button>
  );
}

export default function Home({ onCategoryClick, scrollTo }: HomeProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contactData, setContactData] = useState({ nombre: '', correo: '', mensaje: '' });
  const [sent, setSent] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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

  // Wheel vertical → scroll horizontal con inercia + drag-to-scroll con umbral
  // (5px) para no romper los clicks de las cards. Misma solución del carrusel
  // de CategoryPage — un solo comportamiento en todo el sitio.
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let target = el.scrollLeft;
    let rafId: number | null = null;

    const stepToTarget = () => {
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = target;
        rafId = null;
        return;
      }
      el.scrollLeft += diff * 0.18;
      rafId = requestAnimationFrame(stepToTarget);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const max = el.scrollWidth - el.clientWidth;
      target = Math.max(0, Math.min(max, target + e.deltaY));
      if (rafId === null) rafId = requestAnimationFrame(stepToTarget);
    };

    const DRAG_THRESHOLD = 5;
    let pressed = false;
    let isDragging = false;
    let pressStartX = 0;
    let pressStartScroll = 0;
    let capturedPointerId: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pressed = true;
      isDragging = false;
      pressStartX = e.clientX;
      pressStartScroll = el.scrollLeft;
      target = el.scrollLeft;
      capturedPointerId = e.pointerId;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!pressed) return;
      const dx = e.clientX - pressStartX;
      if (!isDragging && Math.abs(dx) < DRAG_THRESHOLD) return;
      if (!isDragging) {
        isDragging = true;
        el.style.cursor = 'grabbing';
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* noop */
        }
      }
      el.scrollLeft = pressStartScroll - dx;
      target = el.scrollLeft;
    };
    const endPress = () => {
      if (!pressed) return;
      pressed = false;
      if (isDragging) {
        el.style.cursor = '';
        if (capturedPointerId !== null) {
          try {
            el.releasePointerCapture(capturedPointerId);
          } catch {
            /* noop */
          }
        }
      }
      isDragging = false;
      capturedPointerId = null;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', endPress);
    el.addEventListener('pointercancel', endPress);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endPress);
      el.removeEventListener('pointercancel', endPress);
    };
  }, []);

  function handleSeek(ratio: number, dragging: boolean = false) {
    const el = carouselRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: ratio * max, behavior: dragging ? 'auto' : 'smooth' });
  }

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
          <CKHeroOverture />
        </div>
      </section>

      {/* Proyectos — carrusel de categorías */}
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
            {categories.map(c => (
              <CategoryCard key={c.id} category={c} onClick={() => onCategoryClick(c.id)} />
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
      <footer className="bg-[#fafaf7] border-t border-[#dcdbd5] px-[80px] py-[48px]">
        <div className="flex items-center justify-between gap-[24px] flex-wrap">
          <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] text-[#8a8a85] tracking-[1.43px] leading-[1.47] uppercase">
            Matías Cáceres · Santiago de Chile · {new Date().getFullYear()}
          </p>
          <SocialLinks />
        </div>
      </footer>
    </div>
  );
}
