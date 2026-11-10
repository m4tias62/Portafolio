import { useRef, useState, useEffect, useCallback } from 'react';
import ProgressBar, { tickCount } from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import { getCategoryById, type CategoryId } from '@/data/categories';
import { projectsByCategory, type Project } from '@/data/projects';

type CategoryPageProps = {
  categoryId: CategoryId;
  onProjectClick: (id: number) => void;
  onBack: () => void;
};

/**
 * Card individual del carrusel de proyectos — igual visual y comportamiento
 * que la que vive en Home hoy, movida acá porque ahora los proyectos viven
 * dentro de la vista de categoría (Home = carrusel de categorías, no de proyectos).
 */
function ProjectCard({ project, onClick, narrow }: { project: Project; onClick: () => void; narrow: boolean }) {
  const disabled = !project.available;
  const hasThumbnail = Boolean(project.thumbnail);
  const hasVideo = Boolean(project.thumbnailVideo);
  const fitClass = project.thumbnailFit === 'contain' ? 'object-contain' : 'object-cover';
  const boxBg = project.thumbnailFit === 'contain' ? 'bg-white' : disabled ? 'bg-[#f2f1ec]' : 'bg-[#ebeae4]';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`${narrow ? 'hm-rise' : 'hm-feat'} flex flex-col items-start shrink-0 group text-left ${narrow ? 'w-full' : ''} ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f0e] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fafaf7]`}
      style={{ width: narrow ? '100%' : 520 }}
    >
      {/*
        Interactividad — la misma de los destacados de la Home (ver «Home ·
        interacción» en index.css):
        · escritorio (.hm-feat): la card entra y sale con el scroll del carrusel;
          en hover o con foco crece completa (ancho y alto, sin recortar la
          imagen) y las otras se achican y pierden color. Los «En preparación»
          no crecen, pero sí se atenúan cuando otra está activa.
        · celular (.hm-rise): crece al entrar al viewport y se achica al salir.
      */}
      <div
        className={`hm-feat-thumb w-full relative overflow-hidden ${boxBg} border border-[#dcdbd5] ${
          narrow && !disabled
            ? 'transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_16px_60px_rgba(0,0,0,0.14)] group-hover:border-[#8a8a85]'
            : ''
        }`}
        style={narrow ? { aspectRatio: '520 / 420' } : { height: 420 }}
      >
        {hasVideo && !disabled && (
          <video
            src={project.thumbnailVideo}
            poster={project.thumbnail}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full ${fitClass} pointer-events-none`}
          />
        )}
        {!hasVideo && hasThumbnail && !disabled && (
          <img
            src={project.thumbnail}
            alt={project.title}
            draggable={false}
            className={`absolute inset-0 w-full h-full ${fitClass}`}
          />
        )}
        {(!hasThumbnail && !hasVideo) || disabled ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] text-[#8a8a85]">
              {disabled ? 'En preparación' : project.title}
            </span>
          </div>
        ) : null}
      </div>
      <div className="hm-feat-text pt-3">
        <p
          className={`font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] tracking-[1.43px] leading-[1.47] uppercase ${
            disabled ? 'text-[#b6b5b0]' : 'text-[#8a8a85]'
          }`}
        >
          {project.category} — {project.year}
        </p>
        <p
          className={`font-['IBM_Plex_Sans:Regular',sans-serif] text-[20px] leading-[1.2] tracking-[-0.2px] mt-1 ${
            disabled ? 'text-[#8a8a85]' : 'text-[#0f0f0e]'
          }`}
          style={{ fontVariationSettings: '"wdth" 100' }}
        >
          {project.title}
          {!disabled && (
            <span
              className={`hm-feat-arrow inline-block ml-2 ${narrow ? 'transition-transform duration-300 group-hover:translate-x-[5px]' : ''}`}
              aria-hidden="true"
            >
              →
            </span>
          )}
        </p>
        <p
          className={`font-['IBM_Plex_Sans:Regular',sans-serif] text-[14px] leading-[1.5] mt-1 max-w-[420px] ${
            disabled ? 'text-[#8a8a85]' : 'text-[#3a3a38]'
          }`}
        >
          {project.description}
        </p>
        {!disabled && (project.role || project.status) && (
          <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] leading-[1.5] text-[#3a3a38] mt-2 max-w-[460px]">
            {[project.role, project.status].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </button>
  );
}

export default function CategoryPage({ categoryId, onProjectClick, onBack }: CategoryPageProps) {
  const category = getCategoryById(categoryId);
  const projects = projectsByCategory(categoryId);
  const [scrollProgress, setScrollProgress] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)');
    const upd = () => setNarrow(mq.matches);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  // Progreso del carrusel horizontal
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
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || narrow) return;

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
      // Mejor práctica: el scroll vertical pertenece a la PÁGINA (para ver toda
      // la sección). El carrusel se recorre con arrastre, la regla, el swipe
      // horizontal del trackpad (deltaX, nativo) y Shift+rueda como atajo.
      const horizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (horizontalIntent) return; // lo maneja overflow-x-auto nativo
      if (!e.shiftKey) return; // rueda vertical → deja scrollear la página
      e.preventDefault();
      const max = el.scrollWidth - el.clientWidth;
      target = Math.max(0, Math.min(max, target + e.deltaY));
      if (rafId === null) rafId = requestAnimationFrame(stepToTarget);
    };

    // Drag con umbral (5px) para no romper clicks — misma solución del bug del carrusel
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
    const endPress = (e: PointerEvent) => {
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
  }, [narrow]);

  function handleSeek(ratio: number, dragging: boolean = false) {
    const el = carouselRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: ratio * max, behavior: dragging ? 'auto' : 'smooth' });
  }

  if (!category) {
    return (
      <div className="bg-[#fafaf7] min-h-screen px-[80px] py-[48px]">
        <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[14px] text-[#8a8a85]">
          Categoría no encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#fafaf7] min-h-screen">
      {/* Header: botón Volver + título de la categoría, nada más.
          Sin conteo, sin bajada — la card ya comunica de qué se trata. */}
      <section className="px-[80px] py-[48px] max-[820px]:px-5 max-[820px]:py-[28px] border-b border-[#8a8a85]">
        <div className="mb-[32px] max-[820px]:mb-[20px]">
          <BackButton onClick={onBack} label="Volver al listado" />
        </div>
        <p
          className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[#0f0f0e] leading-[1.1]"
          style={{ fontSize: 'clamp(26px, 3.2vw, 48px)' }}
        >
          {category.label}
        </p>
      </section>

      {/* Carrusel de proyectos */}
      <section className="px-[80px] py-[48px] max-[820px]:px-5 max-[820px]:py-[28px]">
        <div className="flex flex-col gap-[48px] max-[820px]:gap-[28px]">
          {!narrow && (
            <div className="flex justify-center">
              <ProgressBar progress={scrollProgress} onSeek={handleSeek} ticks={tickCount(projects.length)} />
            </div>
          )}
          {/* Escritorio: el carrusel recorta lo que sobresale (overflow-x),
              así que lleva un margen interno (compensado con margen negativo)
              para que la card que crece en hover y su sombra no se corten. */}
          <div
            ref={carouselRef}
            className={
              narrow
                ? 'flex flex-col gap-[28px]'
                : 'hm-feat-grid flex gap-[96px] overflow-x-auto select-none cursor-grab'
            }
            style={
              narrow
                ? undefined
                : ({
                    scrollbarWidth: 'none',
                    '--hm-gap': '96px',
                    padding: '32px 40px 48px',
                    margin: '-32px -40px -32px',
                  } as React.CSSProperties)
            }
          >
            {projects.length === 0 ? (
              <p className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[17px] text-[#8a8a85] italic">
                No hay proyectos en esta categoría todavía.
              </p>
            ) : (
              projects.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  narrow={narrow}
                  onClick={() => {
                    if (p.available) onProjectClick(p.id);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
