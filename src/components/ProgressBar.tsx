import { useRef, useState } from 'react';

const NUM_LINES = 25;
const BAR_LENGTH = 480;
const CURSOR_SIZE = 40;
const TRAVEL = BAR_LENGTH - CURSOR_SIZE;

type ProgressBarProps = {
  progress: number; // 0–1, drives cursor position continuously
  /**
   * Callback cuando el usuario clickea o arrastra el navegador para pedir un
   * nuevo scroll. `dragging` = true durante drag continuo (usa 'auto' scroll
   * para no chocar contra el smooth); false en el click puntual (usa 'smooth').
   */
  onSeek?: (ratio: number, dragging: boolean) => void;
  vertical?: boolean;
};

/**
 * ProgressBar — indicador Y navegador del scroll de una sección.
 *
 * Diseño heredado de Figma: barra horizontal de 25 líneas + cursor rectangular
 * de 40px que se desliza. En modo vertical, el mismo SVG se rota 90° CW dentro
 * de un contenedor 28×480, así que en pantalla queda como una barra vertical
 * cuyo cursor va del extremo inferior al superior a medida que progress → 1.
 *
 * Interacción:
 *   - Click en cualquier punto de la barra → seek con scroll suave.
 *   - Drag desde cualquier punto → scrub continuo con scroll instantáneo
 *     (pointer capture asegura que sigue funcionando aunque el mouse salga
 *     de la barra).
 *
 * El cursor rectangular tiene pointerEvents=none para que los clicks sobre él
 * caigan directamente en la barra debajo — así no hay "zonas muertas".
 */
export default function ProgressBar({ progress, onSeek, vertical = false }: ProgressBarProps) {
  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  const cursorOffset = safeProgress * TRAVEL;
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function computeRatio(clientX: number, clientY: number): number {
    const el = svgRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    let raw: number;
    if (vertical) {
      // SVG rotado 90° CW: original x=BAR_LENGTH cae en el TOP de la caja
      // rotada, x=0 en el BOTTOM. Queremos que clickear ARRIBA de la barra
      // equivalga a progress alto (fin del contenido); clickear ABAJO a
      // progress bajo (inicio). Esa es la semántica heredada del diseño.
      raw = 1 - (clientY - rect.top) / rect.height;
    } else {
      raw = (clientX - rect.left) / rect.width;
    }
    // Centrar el punto de click con el ancho del cursor — así donde clickeas
    // aterriza el CENTRO del cursor, no su borde izquierdo. Sensación 1:1.
    const halfCursorRatio = CURSOR_SIZE / BAR_LENGTH / 2;
    raw -= halfCursorRatio;
    return Math.max(0, Math.min(1, raw));
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (!onSeek || e.button !== 0) return;
    // Capturamos el pointer para seguir recibiendo movimientos aunque el
    // cursor del sistema salga del área del SVG durante el drag.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop — algunas plataformas rechazan pointerCapture */
    }
    setIsDragging(true);
    onSeek(computeRatio(e.clientX, e.clientY), true);
    e.preventDefault();
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDragging || !onSeek) return;
    onSeek(computeRatio(e.clientX, e.clientY), true);
  }

  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    // Al soltar, un último seek "smooth" para acomodar cualquier residuo
    // de inercia del scroll nativo — hace que la parada se sienta suave.
    if (onSeek) onSeek(computeRatio(e.clientX, e.clientY), false);
  }

  const bar = (
    <svg
      ref={svgRef}
      width={BAR_LENGTH + 1}
      height={28}
      viewBox={`0 0 ${BAR_LENGTH + 1} 28`}
      fill="none"
      className="block"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        cursor: onSeek ? (isDragging ? 'grabbing' : 'pointer') : 'default',
        touchAction: 'none', // evita que el navegador interprete drags como scroll
        userSelect: 'none',
      }}
    >
      {Array.from({ length: NUM_LINES }, (_, i) => {
        const x = (i / (NUM_LINES - 1)) * BAR_LENGTH;
        return (
          <line
            key={i}
            x1={x + 0.5}
            x2={x + 0.5}
            y1="0"
            y2="28"
            stroke="#8A8A85"
            pointerEvents="none"
          />
        );
      })}
      <g
        style={{
          transform: `translateX(${cursorOffset}px)`,
          // Sin transición mientras se arrastra — así el cursor sigue el mouse
          // 1:1 sin lag. En reposo, una micro-transición suaviza los ticks del
          // scroll nativo (~60fps ya se ve nítido, la transición sólo pule).
          transition: isDragging ? 'none' : 'transform 0.08s linear',
          pointerEvents: 'none',
        }}
      >
        <rect
          fill="#FAFAF7"
          height="27"
          stroke="#8A8A85"
          width={CURSOR_SIZE}
          x="0"
          y="0.5"
        />
      </g>
    </svg>
  );

  if (vertical) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: 28, height: BAR_LENGTH }}
      >
        <div className="rotate-90 flex-none" style={{ width: BAR_LENGTH, height: 28 }}>
          {bar}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: BAR_LENGTH + 1, height: 28 }}>
      {bar}
    </div>
  );
}
