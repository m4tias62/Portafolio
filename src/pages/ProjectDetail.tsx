import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import ProgressBar from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import EdubigCaseStudy from '@/pages/EdubigCaseStudy';
import MdaDataBar from '@/components/figures/MdaDataBar';
import { getProjectById, type FigureKey, type Stage } from '@/data/projects';

type ProjectDetailProps = {
  projectId: number;
  onBack: () => void;
};

/**
 * Estilo de marco compartido para todos los contenedores de figura del
 * detalle: borde asimétrico (1px arriba/izquierda, 4px abajo/derecha) sobre
 * #3a3a38, sobre fondo blanco/#f2f1ec. Es el mismo lenguaje que la caja de
 * contacto y el BackButton — coherencia editorial en todo el sistema.
 */
const FIGURE_FRAME_STYLE = {
  borderWidth: '1px 4px 4px 1px',
  borderStyle: 'solid',
  borderColor: '#3a3a38',
} as const;

/**
 * Calcula las dimensiones del contenedor de figura según el aspect ratio
 * declarado en la etapa. Tres bandas + una excepción ultra-wide:
 *   - aspect >= 2.5  → ultra-wide (full-bleed, ver FigureImage)
 *   - aspect >= 1.4  → landscape ancho (736 de ancho)
 *   - 0.85 – 1.4     → square-ish (560 de ancho, para láminas cuadradas)
 *   - aspect < 0.85  → portrait (520, más angosto para no dominar la fila)
 * El alto se deriva del aspect para que la imagen no se recorte al usar
 * object-cover — cuando el aspect declarado matchea el aspect real de la
 * imagen, ambas dimensiones y el contenido calzan sin bandas ni recortes.
 * Default: 736×460 (aspect 1.6) — el marco horizontal clásico.
 */
const DEFAULT_ASPECT = 736 / 460;
/** Ancho de la columna reservada para la figura — fijo para TODA etapa de
 *  dos columnas, sin importar si la figura es portrait, cuadrada o landscape.
 *  La figura vive dentro a su ancho natural (portrait/square dejan espacio en
 *  blanco a su derecha). El objetivo: que el borde izquierdo del texto caiga
 *  en la misma línea vertical en absolutamente todas las etapas. Grilla. */
const FIGURE_COLUMN_WIDTH = 736;
/** Separación única entre figura y texto — 108px. Se usa igual en horizontal
 *  (layout de dos columnas) y en vertical (etapa ultra-wide: figura arriba,
 *  texto abajo). Una sola constante = ritmo idéntico en todo el proyecto. */
const FIGURE_TEXT_GAP = 108;
/** Umbral de "ultra-wide" — a partir de aquí la etapa se renderiza en layout
 *  vertical (figura full-width arriba, texto abajo desplazado a la columna
 *  derecha) para que diagramas horizontales como el árbol de sitemap
 *  (3850×1038, aspect 3.71) rindan a tamaño natural sin scroll horizontal. */
export const ULTRA_WIDE_ASPECT = 2.5;
/** Offset horizontal desde donde arranca el texto en las etapas de dos
 *  columnas (ancho de columna de figura + gap). Se aplica también a las
 *  etapas ultra-wide como padding-left para que el borde izquierdo del texto
 *  caiga en la misma línea vertical — consistencia rítmica al hacer scroll. */
const STAGE_TEXT_LEFT_OFFSET = FIGURE_COLUMN_WIDTH + FIGURE_TEXT_GAP;

function getFigureDimensions(aspect?: number): { width: number; height: number } {
  const a = aspect ?? DEFAULT_ASPECT;
  let width: number;
  if (a >= 1.4) width = 736;
  else if (a >= 0.85) width = 560;
  else width = 520;
  return { width, height: Math.round(width / a) };
}

/** Test compartido con el renderer de etapas — misma regla en todos lados. */
function isUltraWideStage(stage: Stage): boolean {
  return (stage.figureAspect ?? DEFAULT_ASPECT) >= ULTRA_WIDE_ASPECT;
}

/**
 * Registro de figuras custom — gráficos y diagramas dibujados como componentes
 * React en vez de fotos. Cuando `stage.figureKey` coincide con una clave de
 * este map, se renderiza ese componente dentro del hueco de figura y se ignora
 * `stage.image`. Es la puerta por la que entran gráficos SVG editoriales
 * (barras de porcentajes, diagramas de relación, esquemas técnicos).
 */
const FIGURE_REGISTRY: Record<FigureKey, ComponentType> = {
  'mda-data-bar': MdaDataBar,
};

/** Pie de foto — SIEMPRE ceñido al ancho de la caja de figura que lo contiene
 *  (el <p> hereda el ancho del wrapper), nunca al ancho de la columna. Regla
 *  básica: el texto de una imagen no puede exceder el largo de la imagen. */
function Caption({ text }: { text: string }) {
  return (
    <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] text-[#8a8a85] leading-[1.5] mt-3">
      {text}
    </p>
  );
}

/**
 * Bloque de figura. Devuelve, según el tipo de etapa:
 *   - Ultra-wide (aspect >= 2.5): figura full-bleed + caption al mismo ancho.
 *   - Resto (figureKey / video / image / placeholder): la caja de figura a su
 *     ancho natural (520/560/736) envuelta en la columna reservada de 736. La
 *     caja + su caption viven en un wrapper del ancho REAL de la figura, así
 *     el caption nunca se pasa del largo de la imagen. El wrapper de 736 solo
 *     reserva la grilla para que el texto de al lado arranque siempre en la
 *     misma X.
 */
function FigureImage({ stage }: { stage: Stage }) {
  const { width, height } = getFigureDimensions(stage.figureAspect);

  // Ultra-wide (foto) — full-bleed. El layout de la etapa la apila arriba del
  // texto. Imagen a alto nativo, caption al ancho completo de la imagen.
  if (stage.image && isUltraWideStage(stage)) {
    return (
      <div className="w-full">
        <div
          className="bg-[#f2f1ec] relative overflow-hidden"
          style={{ ...FIGURE_FRAME_STYLE }}
        >
          <img
            src={stage.image}
            alt={stage.imageCaption ?? stage.label}
            className="w-full h-auto block"
            draggable={false}
          />
        </div>
        {stage.imageCaption && <Caption text={stage.imageCaption} />}
      </div>
    );
  }

  // Caja de figura + ancho real + caption según el tipo de etapa.
  let figureBox: ReactNode;
  let figureWidth = width;
  let caption: string | null = stage.imageCaption ?? null;

  if (stage.figureKey && FIGURE_REGISTRY[stage.figureKey]) {
    // Figura custom (SVG). Ocupa la columna completa (736×460).
    const Figure = FIGURE_REGISTRY[stage.figureKey];
    figureWidth = FIGURE_COLUMN_WIDTH;
    figureBox = (
      <div
        className="bg-[#f2f1ec] relative overflow-hidden"
        style={{ width: FIGURE_COLUMN_WIDTH, height: 460, ...FIGURE_FRAME_STYLE }}
      >
        <Figure />
      </div>
    );
  } else if (stage.video) {
    // Video en loop mudo. Usa stage.image como poster mientras carga.
    figureBox = (
      <div
        className="bg-[#0f0f0e] relative overflow-hidden"
        style={{ width, height, ...FIGURE_FRAME_STYLE }}
      >
        <video
          src={stage.video}
          poster={stage.image}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
    );
  } else if (stage.image) {
    // Foto real, banda no ultra-wide.
    figureBox = (
      <div
        className="bg-[#f2f1ec] relative overflow-hidden"
        style={{ width, height, ...FIGURE_FRAME_STYLE }}
      >
        <img
          src={stage.image}
          alt={stage.imageCaption ?? stage.label}
          className="w-full h-full object-cover"
        />
      </div>
    );
  } else {
    // Placeholder tenue — aún no hay foto para la etapa.
    figureBox = (
      <div
        className="bg-[#f2f1ec] relative flex items-center justify-center"
        style={{ width, height, ...FIGURE_FRAME_STYLE }}
      >
        <span className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[12px] text-[#8a8a85]">
          Figura {stage.id}
        </span>
      </div>
    );
    caption = `Figura ${stage.id}. Descripción de la imagen.`;
  }

  return (
    // Columna reservada (736) → wrapper al ancho real de la figura → caja +
    // caption. El caption queda ceñido a `figureWidth`, no a la columna.
    <div className="shrink-0" style={{ width: FIGURE_COLUMN_WIDTH }}>
      <div style={{ width: figureWidth }}>
        {figureBox}
        {caption && <Caption text={caption} />}
      </div>
    </div>
  );
}

/**
 * Bloque de texto a la derecha de la figura (o abajo, en el caso ultra-wide,
 * donde el padre lo desplaza con padding-left para alinearlo a la grilla).
 * Ancho fijo 326 para que el ritmo tipográfico sea idéntico en todas las
 * etapas. Cuando la etapa es `variant: 'quote'` el texto se presenta en
 * itálica editorial. Cuando declara `link`, se agrega un enlace externo abajo.
 */
function StageText({ stage }: { stage: Stage }) {
  const isQuote = stage.variant === 'quote';
  return (
    <div className="flex flex-col gap-[20px] pt-8" style={{ width: 326 }}>
      <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] text-[#8a8a85] tracking-[1.43px] leading-[1.47] uppercase">
        {stage.label}
      </p>
      <p
        className={
          isQuote
            ? "font-['IBM_Plex_Sans:Italic',sans-serif] text-[20px] text-[#0f0f0e] leading-[1.6] italic text-balance"
            : "font-['IBM_Plex_Sans:Regular',sans-serif] text-[17px] text-black leading-[1.7]"
        }
        style={{ fontVariationSettings: '"wdth" 100' }}
      >
        {stage.text}
      </p>
      {stage.link && (
        <a
          href={stage.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[12px] text-[#0f0f0e] underline underline-offset-4 decoration-[#8a8a85] hover:decoration-[#0f0f0e] tracking-[0.5px] w-fit transition-colors"
        >
          {stage.link.label ?? stage.link.url} →
        </a>
      )}
    </div>
  );
}

export default function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const project = getProjectById(projectId);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Track page scroll to drive the vertical progress bar
  useEffect(() => {
    function onScroll() {
      const el = contentRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const scrollable = height - viewH;
      const progress = scrollable > 0 ? Math.max(0, Math.min(1, -top / scrollable)) : 0;
      setScrollProgress(progress);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [projectId]);

  // Seek: click o drag en la barra vertical mueve el scroll del detalle.
  // `dragging=true` durante scrub continuo → scroll instantáneo (auto).
  // `dragging=false` en click puntual o al soltar → scroll suave.
  function handleSeek(ratio: number, dragging: boolean = false) {
    const el = contentRef.current;
    if (!el) return;
    const { height } = el.getBoundingClientRect();
    const viewH = window.innerHeight;
    const scrollable = height - viewH;
    if (scrollable > 0) {
      const targetTop = el.offsetTop + ratio * scrollable;
      window.scrollTo({ top: targetTop, behavior: dragging ? 'auto' : 'smooth' });
    }
  }

  if (project && project.slug === 'edubig') {
    return <EdubigCaseStudy onBack={onBack} />;
  }

  if (!project) {
    return (
      <div className="bg-[#fafaf7] min-h-screen px-[80px] py-[48px]">
        <p className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[14px] text-[#8a8a85]">
          Proyecto no encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#fafaf7] min-h-screen relative">
      {/* Vertical progress bar — fixed on left */}
      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical />
      </div>

      {/* Content */}
      <div ref={contentRef} className="pl-[188px] pr-[80px] py-[48px]">
        <div className="mb-[32px]">
          <BackButton onClick={onBack} />
        </div>
        <div className="mb-[48px]">
          <p className="font-['IBM_Plex_Mono:Medium',sans-serif] text-[11px] text-[#8a8a85] tracking-[1.43px] leading-[1.47] uppercase mb-2">
            {project.headerLabel} · {project.category} · {project.year}
          </p>
          <p
            className="font-['IBM_Plex_Mono:Regular',sans-serif] text-[#0f0f0e] leading-[1.1]"
            style={{ fontSize: 'clamp(28px, 2.6vw, 40px)' }}
          >
            {project.title}
          </p>
        </div>

        <div className="flex flex-col gap-[80px]">
          {project.stages.map(stage => {
            // Etapas ultra-wide se apilan (figura full-bleed arriba, texto
            // abajo). El gap vertical es el mismo FIGURE_TEXT_GAP que separa
            // figura y texto en las etapas de dos columnas — un solo ritmo.
            // El texto se desplaza con padding-left al offset de la grilla
            // para que su borde izquierdo caiga en la misma X que el resto.
            if (isUltraWideStage(stage)) {
              return (
                <div
                  key={stage.id}
                  id={`stage-${stage.id}`}
                  className="flex flex-col"
                  style={{ gap: FIGURE_TEXT_GAP }}
                >
                  <FigureImage stage={stage} />
                  <div style={{ paddingLeft: STAGE_TEXT_LEFT_OFFSET }}>
                    <StageText stage={stage} />
                  </div>
                </div>
              );
            }
            // Etapa de dos columnas: figura (columna reservada de 736) a la
            // izquierda, texto a la derecha, separados por FIGURE_TEXT_GAP.
            return (
              <div
                key={stage.id}
                id={`stage-${stage.id}`}
                className="flex items-start"
                style={{ gap: FIGURE_TEXT_GAP }}
              >
                <FigureImage stage={stage} />
                <StageText stage={stage} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
