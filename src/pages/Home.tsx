import { useRef, useState, useEffect, useCallback } from 'react';
import imgPresentation from '@/imports/Prototipo/556ea8de7896ac0e95b5d5e013e9d3d3dd50db21.png';
import ProgressBar from '@/components/ProgressBar';
import CKHeroOverture from '@/components/CKHeroOverture';
import { categories, type Category, type CategoryId } from '@/data/categories';
import { featuredProjects, type Project } from '@/data/projects';

type HomeProps = {
  onCategoryClick: (id: CategoryId) => void;
  onProjectClick: (id: number) => void;
  scrollTo?: string;
};

// Los links de la NavBar (proyectos/sobre mí/contacto) mapean a un índice de
// slide del carrusel horizontal — el Home ya no scrollea en vertical.
// 0 hero · 1 destacados · 2–4 categorías · 5 sobre mí · 6 contacto
const SLIDE_INDEX: Record<string, number> = { projects: 1, about: 5, contact: 6 };

const LINKEDIN_URL = 'https://www.linkedin.com/in/matias-caceres-maureira-9b6051259/';
const CV_URL = '/cv-matias-caceres.pdf';
const EMAIL = 'matiascmaureira3@gmail.com';

function fallbackCopy(text: string) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'absolute';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch { /* noop */ }
  document.body.removeChild(ta);
}

/**
 * CategoryCard — una card por categoría dentro del carrusel.
 *
 * Lenguaje rauno.me: título grande en mono + un disco de acento macizo (sin
 * anillo). El disco deriva magnéticamente hacia el cursor y aparece el afford
 * "Ver proyectos →" al hover. Toda la card es el botón que entra a la
 * CategoryPage.
 */
function CategoryCard({
  category,
  onClick,
  reduced,
  narrow,
}: {
  category: Category;
  onClick: () => void;
  reduced: boolean;
  narrow: boolean;
}) {
  const discRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (reduced || narrow) return;
    const r = e.currentTarget.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    if (discRef.current) {
      discRef.current.style.transform = `translate(${mx * 34}px, ${my * 34}px) scale(1.06)`;
    }
  }
  function onLeave() {
    if (discRef.current) discRef.current.style.transform = '';
  }

  return (
    <button
      data-slide
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={`Ver proyectos de ${category.label}`}
      className={`group relative shrink-0 self-center text-left cursor-pointer bg-white border border-[#dcdbd5] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f0e] ${
        !narrow && !reduced
          ? 'transition-[transform,box-shadow,border-color] duration-500 ease-out hover:scale-[1.02] hover:shadow-[0_18px_60px_rgba(0,0,0,0.13)] hover:border-[#8a8a85] focus-visible:shadow-[0_18px_60px_rgba(0,0,0,0.13)]'
          : ''
      } ${narrow ? 'w-full h-[62vh] min-h-[400px]' : ''}`}
      style={narrow ? undefined : { width: 'min(760px, 64vw)', height: 'min(62vh, 520px)' }}
    >
      <div className="absolute right-0 top-0 bottom-0 w-[62%] flex items-center justify-center pointer-events-none">
        <div
          ref={discRef}
          className="rounded-full transition-transform duration-500 ease-out"
          style={{
            width: narrow ? 'min(48vw, 190px)' : 'min(38vh, 300px)',
            height: narrow ? 'min(48vw, 190px)' : 'min(38vh, 300px)',
            background: category.accentColor,
          }}
        />
      </div>
      <div className="absolute left-[clamp(28px,4vw,56px)] inset-y-0 flex flex-col justify-center gap-[14px] max-w-[52%] z-10 pointer-events-none">
        <h2
          className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[#0f0f0e] leading-[1.02] tracking-[-1px]"
          style={{ fontSize: 'clamp(34px, 4.4vw, 60px)' }}
        >
          {category.label}
        </h2>
        <p
          className={`font-['IBM_Plex_Mono:Regular',sans-serif] text-[13px] tracking-[0.4px] text-[#0f0f0e] inline-flex items-center gap-2 transition-all duration-300 ${
            narrow ? '' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0'
          }`}
        >
          Ver proyectos
          <span className="transition-transform duration-300 group-hover:translate-x-[5px]">→</span>
        </p>
      </div>
    </button>
  );
}

/**
 * Card compacta para el slide «Proyectos destacados». Mismo lenguaje que el
 * ProjectCard de CategoryPage (borde, hover, eyebrow Mono, línea rol · estado)
 * pero dimensionada para que tres quepan en un viewport.
 */
function FeaturedCard({ project, onClick, narrow, reduced }: { project: Project; onClick: () => void; narrow: boolean; reduced: boolean }) {
  const fitClass = project.thumbnailFit === 'contain' ? 'object-contain bg-white' : 'object-cover';
  return (
    <button
      onClick={onClick}
      aria-label={`Ver caso: ${project.title}`}
      className="group flex flex-col text-left cursor-pointer min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f0e] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fafaf7]"
    >
      <div
        className={`w-full relative overflow-hidden bg-[#ebeae4] border border-[#dcdbd5] ${
          !reduced ? 'transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_16px_60px_rgba(0,0,0,0.14)] group-hover:border-[#8a8a85]' : ''
        }`}
        style={narrow ? { aspectRatio: '4 / 3' } : { height: 'min(30vh, 280px)' }}
      >
        {project.thumbnailVideo && !reduced ? (
          <video
            src={project.thumbnailVideo}
            poster={project.thumbnail}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full ${fitClass} pointer-events-none`}
          />
        ) : project.thumbnail ? (
          <img src={project.thumbnail} alt="" draggable={false} className={`absolute inset-0 w-full h-full ${fitClass}`} />
        ) : null}
      </div>
      <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] tracking-[1.43px] leading-[1.47] uppercase text-[#8a8a85] pt-3">
        {project.category} — {project.year}
      </p>
      <p className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[20px] leading-[1.2] tracking-[-0.2px] mt-1 text-[#0f0f0e]">
        {project.title}
        <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-[5px]" aria-hidden="true">→</span>
      </p>
      <p className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[14px] leading-[1.5] mt-1 text-[#3a3a38]">
        {project.description}
      </p>
      {(project.role || project.status) && (
        <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] leading-[1.5] text-[#3a3a38] mt-2">
          {[project.role, project.status].filter(Boolean).join(' · ')}
        </p>
      )}
    </button>
  );
}

/** Hero (escritorio): margen y ancho de la columna de texto. Todos los textos
 *  del hero comparten este ancho, y el velo del fondo se desvanece donde termina. */
const HERO_PAD = 'clamp(28px, 4.5vw, 72px)';
const HERO_COL = 'min(560px, 46vw)';
/** Hero (móvil): alto de la zona donde la viz se ve entera, sobre el titular. */
const HERO_TOP_M = 'clamp(150px, 24vh, 220px)';

export default function Home({ onCategoryClick, onProjectClick, scrollTo }: HomeProps) {
  const featured = featuredProjects();
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [narrow, setNarrow] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | null>(null);

  const copyEmail = useCallback(() => {
    const done = () => {
      setCopied(true);
      if (copiedTimer.current) window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done).catch(() => { fallbackCopy(EMAIL); done(); });
    } else {
      fallbackCopy(EMAIL);
      done();
    }
  }, []);

  const reducedRef = useRef(false);
  const goToRef = useRef<(i: number) => void>(() => {});
  const seekRef = useRef<(ratio: number, dragging: boolean) => void>(() => {});

  // Media queries → estado (layout) + ref (lectura síncrona en el loop).
  useEffect(() => {
    const mqN = window.matchMedia('(max-width: 820px)');
    const mqR = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updN = () => setNarrow(mqN.matches);
    const updR = () => {
      setReduced(mqR.matches);
      reducedRef.current = mqR.matches;
    };
    updN();
    updR();
    mqN.addEventListener('change', updN);
    mqR.addEventListener('change', updR);
    return () => {
      mqN.removeEventListener('change', updN);
      mqR.removeEventListener('change', updR);
    };
  }, []);

  const curIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    const c = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bd = Infinity;
    Array.from(el.querySelectorAll<HTMLElement>(':scope > [data-slide]')).forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - c);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    return best;
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Motor de scroll horizontal — buttery.
  // Una sola verdad: `target`. Cada frame acercamos scrollLeft a target
  // con easing; rueda y drag empujan target, y al quedarse quieto se asienta
  // (settle) al centro del slide más cercano. Drag con inercia por velocidad.
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Móvil: scroll vertical nativo. goTo hace scrollIntoView; sin motor.
    if (narrow) {
      goToRef.current = (idx: number) => {
        const slides = el.querySelectorAll<HTMLElement>(':scope > [data-slide]');
        slides[Math.max(0, Math.min(slides.length - 1, idx))]?.scrollIntoView({
          behavior: reducedRef.current ? 'auto' : 'smooth',
          block: 'start',
        });
      };
      seekRef.current = () => {};
      return;
    }

    const maxScroll = () => el.scrollWidth - el.clientWidth;
    const setProg = () => {
      const m = maxScroll();
      setProgress(m > 0 ? el.scrollLeft / m : 0);
    };

    let target = el.scrollLeft;
    let raf: number | null = null;

    const step = () => {
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 0.4) {
        el.scrollLeft = target;
        setProg();
        raf = null;
        return;
      }
      el.scrollLeft += diff * 0.115;
      setProg();
      raf = requestAnimationFrame(step);
    };
    const run = () => {
      if (raf === null) raf = requestAnimationFrame(step);
    };

    const centers = () =>
      Array.from(el.querySelectorAll<HTMLElement>(':scope > [data-slide]')).map(
        (s) => s.offsetLeft + s.offsetWidth / 2 - el.clientWidth / 2,
      );
    const nearest = (x: number) => {
      const cs = centers();
      let best = cs[0];
      for (const c of cs) if (Math.abs(c - x) < Math.abs(best - x)) best = c;
      return Math.max(0, Math.min(maxScroll(), best));
    };

    let settleTimer: number | undefined;
    const scheduleSettle = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        target = nearest(target);
        run();
      }, 200);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (reducedRef.current) {
        el.scrollLeft += e.deltaY;
        target = el.scrollLeft;
        setProg();
        return;
      }
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY));
      run();
      scheduleSettle();
    };

    // Drag con umbral (no rompe clicks) + inercia por velocidad al soltar.
    let pressed = false;
    let dragging = false;
    let sx = 0;
    let ss = 0;
    let pid: number | null = null;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pressed = true;
      dragging = false;
      sx = e.clientX;
      ss = el.scrollLeft;
      target = el.scrollLeft;
      pid = e.pointerId;
      lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!pressed) return;
      const dx = e.clientX - sx;
      if (!dragging && Math.abs(dx) < 5) return;
      if (!dragging) {
        dragging = true;
        el.style.cursor = 'grabbing';
        try {
          el.setPointerCapture(pid as number);
        } catch {
          /* noop */
        }
      }
      el.scrollLeft = ss - dx;
      target = el.scrollLeft;
      const now = performance.now();
      const dt = now - lastT || 16;
      vel = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastT = now;
      setProg();
    };
    const endPress = () => {
      if (!pressed) return;
      pressed = false;
      if (dragging) {
        el.style.cursor = '';
        try {
          el.releasePointerCapture(pid as number);
        } catch {
          /* noop */
        }
        target = Math.max(0, Math.min(maxScroll(), el.scrollLeft - vel * 220));
        run();
        scheduleSettle();
      }
      dragging = false;
      pid = null;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', endPress);
    el.addEventListener('pointercancel', endPress);
    el.addEventListener('scroll', setProg, { passive: true });
    setProg();

    goToRef.current = (idx: number) => {
      const cs = centers();
      const i = Math.max(0, Math.min(cs.length - 1, idx));
      target = Math.max(0, Math.min(maxScroll(), cs[i]));
      run();
    };
    seekRef.current = (ratio: number, drag: boolean) => {
      const m = maxScroll();
      const x = ratio * m;
      if (drag) {
        if (raf !== null) {
          cancelAnimationFrame(raf);
          raf = null;
        }
        el.scrollLeft = x;
        target = x;
        setProg();
      } else {
        target = nearest(x);
        run();
      }
    };

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', endPress);
      el.removeEventListener('pointercancel', endPress);
      el.removeEventListener('scroll', setProg);
    };
  }, [narrow]);

  // Teclado ← → · Home · End
  useEffect(() => {
    if (narrow) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToRef.current(curIndex() + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToRef.current(curIndex() - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToRef.current(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToRef.current(999);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [narrow, curIndex]);

  // Tab (teclado): si el foco cae en un elemento de un slide fuera de vista,
  // el carrusel se mueve a ese slide para que el foco siempre sea visible.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || narrow) return;
    const onFocusIn = (e: FocusEvent) => {
      const slide = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-slide]');
      if (!slide || slide.parentElement !== el) return;
      const slides = Array.from(el.querySelectorAll<HTMLElement>(':scope > [data-slide]'));
      const idx = slides.indexOf(slide);
      if (idx >= 0 && idx !== curIndex()) goToRef.current(idx);
    };
    el.addEventListener('focusin', onFocusIn);
    return () => el.removeEventListener('focusin', onFocusIn);
  }, [narrow, curIndex]);

  // Navegación desde la NavBar → salta al slide correspondiente.
  useEffect(() => {
    const idx = scrollTo ? SLIDE_INDEX[scrollTo] ?? 0 : 0;
    // pequeño defer para asegurar layout listo tras montar
    const id = window.setTimeout(() => goToRef.current(idx), 0);
    return () => window.clearTimeout(id);
  }, [scrollTo, narrow]);

  const handleSeek = useCallback((ratio: number, dragging: boolean) => {
    seekRef.current(ratio, dragging);
  }, []);

  return (
    <div
      className={
        narrow
          ? 'bg-[#fafaf7]'
          : 'h-[calc(100vh-56px)] overflow-hidden flex flex-col bg-[#fafaf7]'
      }
    >
      {/* Scrubber / regla — solo desktop */}
      {!narrow && (
        <div className="shrink-0 flex items-center justify-center" style={{ height: 52 }}>
          <ProgressBar progress={progress} onSeek={handleSeek} />
        </div>
      )}

      {/* Track del carrusel */}
      <div
        ref={trackRef}
        role={narrow ? undefined : 'region'}
        aria-roledescription={narrow ? undefined : 'carrusel'}
        aria-label={narrow ? undefined : 'Portafolio — usa las flechas ← → para avanzar entre secciones'}
        className={
          narrow
            ? 'flex flex-col gap-[28px] px-5 pt-[24px] pb-[60px]'
            : 'flex-1 flex items-stretch overflow-x-auto overflow-y-hidden select-none cursor-grab'
        }
        style={
          narrow
            ? undefined
            : {
                gap: 'clamp(48px, 7vw, 120px)',
                paddingTop: 'clamp(8px, 2.4vh, 24px)',
                paddingBottom: 'clamp(8px, 2.4vh, 24px)',
                scrollbarWidth: 'none',
              }
        }
      >
        {/* 0 · HERO
            Escritorio: viz p5 a pantalla completa y el texto en una sola columna
            (HERO_COL) sobre un velo que se desvanece donde termina la columna.
            Móvil: la viz ocupa todo el hero y se ve entera arriba; desde el titular
            hacia abajo queda tras un velo que la atenúa, así sigue presente sin
            cortar la lectura. */}
        <section
          aria-roledescription="slide"
          data-slide
          aria-label="Inicio"
          className={`relative shrink-0 overflow-hidden bg-[#fafaf7] ${narrow ? 'w-full flex flex-col' : 'w-full h-full'}`}
        >
          <CKHeroOverture className="absolute inset-0" style={{}} />
          <div
            className={`${narrow ? 'relative' : 'absolute inset-0 justify-center'} z-10 flex flex-col pointer-events-none`}
            style={
              narrow
                ? {
                    paddingTop: HERO_TOP_M,
                    paddingBottom: 8,
                    background: `linear-gradient(180deg, rgba(250,250,247,0) 0, rgba(250,250,247,0.84) calc(${HERO_TOP_M} - 20px), rgba(250,250,247,0.9) 100%)`,
                  }
                : {
                    padding: HERO_PAD,
                    background: `linear-gradient(90deg, rgba(250,250,247,0.94) 0, rgba(250,250,247,0.88) calc(${HERO_PAD} + ${HERO_COL}), rgba(250,250,247,0) calc(${HERO_PAD} + ${HERO_COL} + 16vw))`,
                  }
            }
          >
            <div
              className="flex flex-col"
              style={{ width: narrow ? '100%' : HERO_COL, gap: narrow ? 16 : 'clamp(14px, 2.2vh, 22px)' }}
            >
              <h1
                className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[#0f0f0e] leading-[1.18] tracking-[-0.4px] m-0"
                style={{ fontSize: narrow ? 'clamp(24px, 6.6vw, 30px)' : 'clamp(22px, 2.2vw, 30px)' }}
              >
                Diseñador. Para mí, diseñar es leer entre líneas: entender lo que las personas necesitan antes de decidir
                cómo se ve.
              </h1>
              <p
                className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[#3a3a38] leading-[1.55] m-0"
                style={{ fontSize: 'clamp(15px, 1.1vw, 17px)' }}
              >
                Hoy trabajo en UX/UI y diseño de producto. Colaboro con Globallys, consultora de accesibilidad digital, en
                investigación, benchmark, sistemas de diseño y landing pages; con ellos diseñé la arquitectura de
                información del portal del Censo 2024 del INE. En paralelo, y de forma autónoma, diseño Edubig, una
                plataforma abierta para que las familias chilenas encuentren y comparen colegios.
              </p>
              <p
                className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[#0f0f0e] leading-[1.55] m-0"
                style={{ fontSize: 'clamp(15px, 1.1vw, 17px)' }}
              >
                Busco un rol en UX/UI o Product Design, en Santiago (remoto o presencial) o remoto para equipos
                internacionales.
              </p>
              <p
                className="font-['IBM_Plex_Sans:Italic',sans-serif] italic text-[#8a8a85] leading-[1.45] m-0 pt-[10px] border-t border-[#dcdbd5]"
                style={{ fontSize: 'clamp(12px, 0.9vw, 14px)' }}
              >
                «Diseña quien concibe cursos de acción destinados a cambiar situaciones existentes por otras preferidas.»{' '}
                <span className="font-['IBM_Plex_Mono:Regular',sans-serif] not-italic uppercase tracking-[0.5px] text-[11px]">
                  — Herbert Simon
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* 1 · PROYECTOS DESTACADOS */}
        <section
          aria-roledescription="slide"
          data-slide
          aria-label="Proyectos destacados"
          className={`relative shrink-0 bg-[#fafaf7] ${narrow ? 'w-full' : 'h-full'}`}
          style={narrow ? undefined : { width: 'min(1180px, 88vw)' }}
        >
          <div
            className={`${narrow ? '' : 'absolute inset-0'} flex flex-col justify-center gap-[clamp(18px,3vh,32px)]`}
            style={{ padding: narrow ? '8px 0' : 'clamp(16px, 2.4vw, 40px)' }}
          >
            <h2
              className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[#0f0f0e] leading-[1.1] tracking-[-0.4px]"
              style={{ fontSize: 'clamp(24px, 2.2vw, 32px)' }}
            >
              Proyectos destacados
            </h2>
            <div
              className="grid"
              style={{
                gridTemplateColumns: narrow ? '1fr' : `repeat(${featured.length}, minmax(0, 1fr))`,
                gap: narrow ? 36 : 'clamp(20px, 2.4vw, 40px)',
              }}
            >
              {featured.map(p => (
                <FeaturedCard key={p.id} project={p} narrow={narrow} reduced={reduced} onClick={() => onProjectClick(p.id)} />
              ))}
            </div>
          </div>
        </section>

        {/* 2–4 · CATEGORÍAS */}
        {categories.map((c) => (
          <CategoryCard
            key={c.id}
            category={c}
            reduced={reduced}
            narrow={narrow}
            onClick={() => onCategoryClick(c.id)}
          />
        ))}

        {/* 4 · SOBRE MÍ */}
        <section
          aria-roledescription="slide"
          data-slide
          aria-label="Sobre mí"
          className={`relative shrink-0 bg-[#fafaf7] overflow-hidden ${
            narrow ? 'w-full' : 'h-full'
          }`}
          style={narrow ? undefined : { width: '100%' }}
        >
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1100px] flex flex-col justify-center gap-[22px] overflow-y-auto max-[820px]:static max-[820px]:translate-x-0"
            style={{ padding: 'clamp(28px, 4vw, 56px)' }}
          >
            <div className="flex gap-[clamp(28px,5vw,64px)] items-start flex-wrap">
              <div className="shrink-0 flex flex-col" style={{ width: 260 }}>
                <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] text-[#8a8a85] tracking-[1.43px] leading-[1.47] uppercase">
                  Sobre mí
                </p>
                <h2
                  className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[#0f0f0e] leading-[1.05] tracking-[-0.4px] mt-[6px] mb-[10px]"
                  style={{ fontSize: 'clamp(24px, 2.4vw, 30px)' }}
                >
                  Matías Cáceres
                </h2>
                <div className="relative" style={{ aspectRatio: '540/560' }}>
                  <img
                    alt="Matías Cáceres"
                    src={imgPresentation}
                    className="w-full h-full object-cover object-bottom"
                    style={{ borderWidth: '2px 4px 4px 2px', borderStyle: 'solid', borderColor: '#000' }}
                  />
                </div>
                <p
                  className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] text-black tracking-[1.2px] leading-[1.5] mt-[10px]"
                >
                  Diseñador · Santiago de Chile
                  <br />
                  Universidad Diego Portales
                </p>
              </div>
              <div className="flex-1 min-w-[260px] max-w-[62ch] flex flex-col gap-[clamp(20px,2.4vw,32px)]">
                <blockquote className="pl-[22px] border-l-2 border-[#0f0f0e] max-w-[42ch]">
                  <p
                    className="font-['IBM_Plex_Sans:Italic',sans-serif] italic text-[#0f0f0e] leading-[1.5] text-balance"
                    style={{ fontSize: 'clamp(16px, 1.4vw, 20px)' }}
                  >
                    «Nada en la vida es para temer, todo es para comprender. Ahora es el momento de comprender más, para temer menos.»
                  </p>
                  <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[11px] text-[#3a3a38] tracking-[1.2px] leading-[1.5] mt-3 uppercase">
                    — Marie Curie
                  </p>
                </blockquote>
                <div className="flex flex-col gap-[14px] text-[#3a3a38]">
                  <p className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[15px] leading-[1.65]">
                    Hola! Soy Matías Cáceres, Diseñador titulado por la Universidad Diego Portales.
                    Hoy estoy centrado en el UX/UI, un ámbito que me ha permitido reinterpretar la
                    labor del diseñador en el momento actual del oficio, marcado por la IA. El
                    diseñador ya no es un simple productor de piezas gráficas o interfaces bonitas:
                    la herramienta central, más allá del manejo técnico del software, es la
                    sensibilidad hacia las necesidades del usuario para el que se diseña — la
                    capacidad de leer entre líneas para armar flujos lógicos y visualizaciones de
                    información que realmente sirvan.
                  </p>
                  <p className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[15px] leading-[1.65]">
                    Me considero capaz de adaptarme a cualquier proyecto donde el conocimiento de
                    un diseñador aporte, colaborando con múltiples disciplinas. Ese es, para mí, el
                    superpoder del diseñador: insertarse en casi cualquier espacio para aportar una
                    mirada crítica, creativa y —por qué no— lógica.
                  </p>
                  <p className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[15px] leading-[1.65]">
                    Fuera del ámbito profesional soy curioso por comprender el mundo, hambriento de
                    aprender cosas nuevas y de mejorar. Por eso me pongo siempre retos de
                    aprendizaje: mantener la mente afilada, preparada para los desafíos no solo
                    profesionales sino también de la vida — sobre todo en estos tiempos de cambios
                    de paradigma tecnológicos y sociales. Para mí el aprendizaje no es solo el
                    placer de saber: lo considero también una forma de resistencia frente a un
                    mundo que cambia rápido. Por eso lo cultivo como un hábito.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 · CONTACTO */}
        <section
          aria-roledescription="slide"
          data-slide
          aria-label="Contacto"
          className={`relative shrink-0 bg-[#fafaf7] overflow-hidden ${
            narrow ? 'w-full' : 'h-full'
          }`}
          style={narrow ? undefined : { width: '100%' }}
        >
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1100px] flex flex-col justify-center gap-[24px] overflow-y-auto max-[820px]:static max-[820px]:translate-x-0"
            style={{ padding: 'clamp(28px, 4vw, 56px)' }}
          >
            <h2
              className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[#0f0f0e] leading-[1.1] tracking-[-0.4px]"
              style={{ fontSize: 'clamp(26px, 3vw, 36px)' }}
            >
              Contáctame
            </h2>
            <div
              className="max-w-[640px] bg-[#f2f1ec]"
              style={{ borderWidth: '2px 4px 4px 2px', borderStyle: 'solid', borderColor: '#3a3a38' }}
            >
              <button
                type="button"
                onClick={copyEmail}
                className="w-full grid items-center px-[22px] py-[18px] border-b border-[#dcdbd5] bg-transparent text-left cursor-pointer text-[#0f0f0e] hover:bg-[#eceae3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f0e] focus-visible:ring-inset"
                style={narrow ? { gridTemplateColumns: '1fr auto', rowGap: 6 } : { gridTemplateColumns: '120px 1fr auto' }}
                aria-label={copied ? 'Correo copiado al portapapeles' : `Copiar correo ${EMAIL}`}
              >
                <span className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[12px] tracking-[1.2px] uppercase text-[#3a3a38]">
                  Email
                </span>
                <span className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[17px] text-[#0f0f0e] break-all" style={narrow ? { gridColumn: '1 / -1' } : undefined}>
                  {EMAIL}
                </span>
                <span
                  className={`justify-self-end inline-flex items-center gap-[6px] font-['IBM_Plex_Mono:Medium',sans-serif] text-[12px] tracking-[1px] uppercase transition-colors ${copied ? 'text-[#1fbf75]' : 'text-[#3a3a38]'}`}
                  aria-hidden="true"
                >
                  {copied ? '✓ Copiado' : 'Copiar'}
                </span>
              </button>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="grid items-center px-[22px] py-[18px] border-b border-[#dcdbd5] no-underline text-[#0f0f0e] hover:bg-[#eceae3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f0e] focus-visible:ring-inset"
                style={narrow ? { gridTemplateColumns: '1fr auto', rowGap: 6 } : { gridTemplateColumns: '120px 1fr 40px' }}
              >
                <span className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[12px] tracking-[1.2px] uppercase text-[#3a3a38]">
                  LinkedIn
                </span>
                <span className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[17px] text-[#0f0f0e]" style={narrow ? { gridColumn: '1 / -1' } : undefined}>
                  Perfil de LinkedIn
                </span>
                <span className="justify-self-end font-['IBM_Plex_Mono:Regular',sans-serif] text-[18px]" aria-hidden="true">
                  →
                </span>
              </a>
              <a
                href={CV_URL}
                download
                className="grid items-center px-[22px] py-[18px] no-underline text-[#0f0f0e] hover:bg-[#eceae3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f0e] focus-visible:ring-inset"
                style={narrow ? { gridTemplateColumns: '1fr auto', rowGap: 6 } : { gridTemplateColumns: '120px 1fr 40px' }}
              >
                <span className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[12px] tracking-[1.2px] uppercase text-[#3a3a38]">
                  CV
                </span>
                <span className="font-['IBM_Plex_Sans:Regular',sans-serif] text-[17px] text-[#0f0f0e]" style={narrow ? { gridColumn: '1 / -1' } : undefined}>
                  cv-matias-caceres.pdf
                </span>
                <span className="justify-self-end font-['IBM_Plex_Mono:Regular',sans-serif] text-[18px]" aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>
            <p className="sr-only" role="status" aria-live="polite">
              {copied ? 'Correo copiado al portapapeles' : ''}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

