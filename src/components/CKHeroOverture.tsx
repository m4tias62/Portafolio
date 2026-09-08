import { useEffect, useRef } from 'react';
import p5 from 'p5';

/**
 * CKHeroOverture
 * --------------
 * Obertura contemplativa para el hero — sistema C-K (Casey Reas · T4).
 *
 * Vocabulario reducido:
 *   Axis          — línea horizontal apenas visible (5 ejes).
 *   Anchor        — proposición discreta sobre un eje.
 *   Arc           — hipótesis: curva parabólica entre dos anclajes de ejes distintos.
 *   Convergence   — 3-4 arcos convergen sobre un foco → nace un anclaje dorado.
 *
 * Emergencia por acumulación y superposición. Sin controles, sin dev panel —
 * el sistema respira solo. Adaptado desde ckhero.html estándalone al frame
 * del hero del site (no fullscreen), con fondo integrado al site (#fafaf7).
 */

type P5Instance = p5;

type Params = {
  seed: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  anchorInterval: [number, number];
  arcInterval: [number, number];
  convergenceInterval: [number, number];
  maxAnchors: number;
  maxArcs: number;
  spreadBias: number;
  neighborBias: number;
};

const DEFAULTS: Params = {
  seed: 12345,
  marginTop: 0.08,
  marginBottom: 0.08,
  marginLeft: 0.04,
  marginRight: 0.04,
  anchorInterval: [55, 130],
  arcInterval: [45, 105],
  convergenceInterval: [420, 780],
  maxAnchors: 95,
  maxArcs: 34,
  spreadBias: 0.55,
  neighborBias: 0.68,
};

const NUM_AXES = 5;

// Paleta editorial (alineada con la del site)
const PAL = {
  bg: '#fafaf7',
  axis: [15, 15, 14, 0.055] as [number, number, number, number],
  anchor: [15, 15, 14] as [number, number, number],
  arc: [15, 15, 14] as [number, number, number],
  gold: [201, 149, 91] as [number, number, number],
};

function rgba(
  arr: readonly number[],
  a?: number,
): string {
  const alpha = a !== undefined ? a : arr[3] !== undefined ? arr[3] : 1;
  return `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${alpha})`;
}

export default function CKHeroOverture({
  seed,
  className,
  style,
}: {
  seed?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const host = containerRef.current;
    const params: Params = { ...DEFAULTS, seed: seed ?? DEFAULTS.seed };

    const sketch = (p: P5Instance) => {
      let axes: Axis[] = [];
      let anchors: Anchor[] = [];
      let arcs: Arc[] = [];
      let convergences: ConvergenceEvent[] = [];
      let localTime = 0;
      let nextAnchorFrame = 0;
      let nextArcFrame = 0;
      let nextConvergenceFrame = 0;

      // ══════════════════════════════════════════════════════
      // Axis — línea horizontal apenas visible
      // ══════════════════════════════════════════════════════
      class Axis {
        y: number;
        idx: number;
        constructor(y: number, idx: number) {
          this.y = y;
          this.idx = idx;
        }
        xStart() { return p.width * params.marginLeft; }
        xEnd() { return p.width * (1 - params.marginRight); }
        xRange() { return this.xEnd() - this.xStart(); }
        randomX() { return this.xStart() + p.random() * this.xRange(); }
        draw() {
          const ctx = p.drawingContext as CanvasRenderingContext2D;
          ctx.strokeStyle = rgba(PAL.axis);
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(this.xStart(), this.y);
          ctx.lineTo(this.xEnd(), this.y);
          ctx.stroke();
        }
      }

      // ══════════════════════════════════════════════════════
      // Anchor — proposición discreta sobre un eje
      // ══════════════════════════════════════════════════════
      class Anchor {
        x: number;
        axisIdx: number;
        age = 0;
        birthAnim = 0;
        goldPhase = 0;
        baseRadius = 2.1;

        constructor(x: number, axisIdx: number) {
          this.x = x;
          this.axisIdx = axisIdx;
        }
        y() { return axes[this.axisIdx].y; }
        update() {
          this.age++;
          if (this.birthAnim < 1) this.birthAnim = Math.min(1, this.birthAnim + 0.045);
          if (this.goldPhase > 0) this.goldPhase = Math.max(0, this.goldPhase - 0.008);
        }
        ageAlpha() {
          const fadeStart = 1200;
          const fadeEnd = 3400;
          if (this.age < fadeStart) return 1;
          const t = Math.min(1, (this.age - fadeStart) / (fadeEnd - fadeStart));
          return 1 - t * 0.55;
        }
        draw() {
          const alpha = this.birthAnim * this.ageAlpha();
          const y = this.y();
          const ctx = p.drawingContext as CanvasRenderingContext2D;
          if (this.goldPhase > 0.01) {
            for (let i = 5; i >= 1; i--) {
              ctx.fillStyle = rgba(PAL.gold, (0.12 * this.goldPhase) / i);
              ctx.beginPath();
              ctx.arc(this.x, y, i * 8, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          const col = this.goldPhase > 0.01 ? PAL.gold : PAL.anchor;
          ctx.fillStyle = rgba(col, alpha * (0.85 + this.goldPhase * 0.15));
          ctx.beginPath();
          ctx.arc(this.x, y, this.baseRadius + this.goldPhase * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ══════════════════════════════════════════════════════
      // Arc — hipótesis (curva parabólica entre dos anclajes)
      // ══════════════════════════════════════════════════════
      class Arc {
        origin: Anchor | FocalAnchor;
        target: Anchor | FocalAnchor;
        age = 0;
        emergenceDuration = 85;
        holdDuration = 460;
        fadeDuration = 320;
        maxAge = this.emergenceDuration + this.holdDuration + this.fadeDuration;
        cx = 0;
        cy = 0;

        constructor(originAnchor: Anchor | FocalAnchor, targetAnchor: Anchor | FocalAnchor) {
          this.origin = originAnchor;
          this.target = targetAnchor;
          this.computeControl();
        }
        computeControl() {
          const ox = this.origin.x;
          const oy = this.origin.y();
          const tx = this.target.x;
          const ty = this.target.y();
          const midX = (ox + tx) / 2;
          const midY = (oy + ty) / 2;
          const dx = tx - ox;
          const dy = ty - oy;
          const perpX = -dy;
          const perpY = dx;
          const perpMag = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
          const magnitude = Math.pow(p.random(), 1.6) * 140 + 20;
          const sign = p.random() < 0.5 ? -1 : 1;
          const bulge = sign * magnitude;
          this.cx = midX + (perpX / perpMag) * bulge;
          this.cy = midY + (perpY / perpMag) * bulge;
        }
        pointAt(t: number) {
          const it = 1 - t;
          return {
            x: it * it * this.origin.x + 2 * it * t * this.cx + t * t * this.target.x,
            y: it * it * this.origin.y() + 2 * it * t * this.cy + t * t * this.target.y(),
          };
        }
        update() { this.age++; }
        phaseAlpha() {
          if (this.age < this.emergenceDuration) return this.age / this.emergenceDuration;
          if (this.age < this.emergenceDuration + this.holdDuration) return 1;
          if (this.age < this.maxAge) {
            const t = (this.age - this.emergenceDuration - this.holdDuration) / this.fadeDuration;
            return 1 - t;
          }
          return 0;
        }
        drawProgress() {
          if (this.age < this.emergenceDuration) return this.age / this.emergenceDuration;
          return 1;
        }
        draw() {
          const alpha = this.phaseAlpha();
          if (alpha <= 0.005) return;
          const progress = this.drawProgress();
          const segments = 48;
          const endSeg = Math.floor(segments * progress);
          const ctx = p.drawingContext as CanvasRenderingContext2D;
          ctx.strokeStyle = rgba(PAL.arc, alpha * 0.32);
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          const p0 = this.pointAt(0);
          ctx.moveTo(p0.x, p0.y);
          for (let i = 1; i <= endSeg; i++) {
            const pt = this.pointAt(i / segments);
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
          if (progress < 1 && progress > 0.05) {
            const head = this.pointAt(progress);
            ctx.fillStyle = rgba(PAL.arc, alpha * 0.75);
            ctx.beginPath();
            ctx.arc(head.x, head.y, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        isAlive() { return this.age < this.maxAge; }
      }

      // Anclaje focal virtual usado por convergencias (no vive en anchors[])
      type FocalAnchor = { x: number; y: () => number };

      // ══════════════════════════════════════════════════════
      // ConvergenceEvent — 3-4 arcos convergen → nuevo anclaje dorado
      // ══════════════════════════════════════════════════════
      class ConvergenceEvent {
        focalX: number;
        focalAxisIdx: number;
        focalY: number;
        age = 0;
        stage: 'converging' | 'flash' | 'done' = 'converging';
        stageAge = 0;
        waitDuration = 100;
        flashDuration = 90;
        arcs: Arc[] = [];

        constructor(originAnchors: Anchor[], focalX: number, focalAxisIdx: number) {
          this.focalX = focalX;
          this.focalAxisIdx = focalAxisIdx;
          this.focalY = axes[focalAxisIdx].y;
          const focalAnchor: FocalAnchor = { x: focalX, y: () => this.focalY };
          for (const origin of originAnchors) {
            const arc = new Arc(origin, focalAnchor);
            // Bulge consistente para convergencia limpia (sobrescribe el random del constructor)
            const ox = arc.origin.x;
            const oy = arc.origin.y();
            const tx = focalX;
            const ty = this.focalY;
            const midX = (ox + tx) / 2;
            const midY = (oy + ty) / 2;
            const dx = tx - ox;
            const dy = ty - oy;
            const perpX = -dy;
            const perpY = dx;
            const perpMag = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
            const bulge = (p.random() - 0.5) * 30;
            arc.cx = midX + (perpX / perpMag) * bulge;
            arc.cy = midY + (perpY / perpMag) * bulge;
            arc.emergenceDuration = 95;
            arcs.push(arc);
            this.arcs.push(arc);
          }
        }
        update() {
          this.age++;
          this.stageAge++;
          if (this.stage === 'converging' && this.age > this.waitDuration) {
            this.stage = 'flash';
            this.stageAge = 0;
            const newAnchor = new Anchor(this.focalX, this.focalAxisIdx);
            newAnchor.goldPhase = 1;
            newAnchor.birthAnim = 1;
            anchors.push(newAnchor);
            capAnchors();
          }
          if (this.stage === 'flash' && this.stageAge > this.flashDuration) {
            this.stage = 'done';
          }
        }
        draw() {
          if (this.stage !== 'flash') return;
          const t = this.stageAge / this.flashDuration;
          const ctx = p.drawingContext as CanvasRenderingContext2D;
          const r = 3 + t * 26;
          ctx.strokeStyle = rgba(PAL.gold, (1 - t) * 0.5);
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.arc(this.focalX, this.focalY, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        isAlive() { return this.stage !== 'done'; }
      }

      // ─────────────────────────────────────────
      // Selección de posiciones con sesgo de dispersión
      // ─────────────────────────────────────────
      function pickSpreadPosition() {
        if (anchors.length < 8 || p.random() > params.spreadBias) {
          const axisIdx = Math.floor(p.random(axes.length));
          return { x: axes[axisIdx].randomX(), axisIdx };
        }
        let best: { x: number; axisIdx: number } | null = null;
        let bestMinDist = -1;
        for (let attempt = 0; attempt < 6; attempt++) {
          const axisIdx = Math.floor(p.random(axes.length));
          const x = axes[axisIdx].randomX();
          const y = axes[axisIdx].y;
          let minD = Infinity;
          for (const a of anchors) {
            const d = p.dist(x, y, a.x, a.y());
            if (d < minD) minD = d;
          }
          if (minD > bestMinDist) {
            bestMinDist = minD;
            best = { x, axisIdx };
          }
        }
        return best!;
      }

      function capAnchors() {
        while (anchors.length > params.maxAnchors) anchors.shift();
      }
      function capArcs() {
        while (arcs.length > params.maxArcs) arcs.shift();
      }

      // ─────────────────────────────────────────
      // Triggers
      // ─────────────────────────────────────────
      function tryAnchor() {
        if (localTime < nextAnchorFrame) return;
        nextAnchorFrame = localTime + Math.floor(p.random(params.anchorInterval[0], params.anchorInterval[1]));
        const pos = pickSpreadPosition();
        anchors.push(new Anchor(pos.x, pos.axisIdx));
        capAnchors();
      }

      function tryArc() {
        if (localTime < nextArcFrame) return;
        nextArcFrame = localTime + Math.floor(p.random(params.arcInterval[0], params.arcInterval[1]));
        if (anchors.length < 2) return;
        const recent = anchors.slice(-Math.min(40, anchors.length));
        const origin = recent[Math.floor(p.random(recent.length))];
        let target: Anchor | undefined;
        if (p.random() < params.neighborBias) {
          const candidates = anchors.filter(a =>
            a !== origin && a.axisIdx !== origin.axisIdx && Math.abs(a.x - origin.x) < 300,
          );
          if (candidates.length > 0) {
            const adj = candidates.filter(a => Math.abs(a.axisIdx - origin.axisIdx) === 1);
            const pool = adj.length > 0 && p.random() < 0.6 ? adj : candidates;
            target = pool[Math.floor(p.random(pool.length))];
          }
        }
        if (!target) {
          const otherAxis = anchors.filter(a => a !== origin && a.axisIdx !== origin.axisIdx);
          if (otherAxis.length === 0) return;
          target = otherAxis[Math.floor(p.random(otherAxis.length))];
        }
        arcs.push(new Arc(origin, target));
        capArcs();
      }

      function tryConvergence() {
        if (localTime < nextConvergenceFrame) return;
        nextConvergenceFrame = localTime + Math.floor(p.random(params.convergenceInterval[0], params.convergenceInterval[1]));
        if (anchors.length < 10) return;
        const usedAxes = new Set<number>();
        const chosen: Anchor[] = [];
        const pool = anchors.slice(-50);
        for (let attempt = 0; attempt < 40 && chosen.length < 4; attempt++) {
          const cand = pool[Math.floor(p.random(pool.length))];
          if (!usedAxes.has(cand.axisIdx)) {
            chosen.push(cand);
            usedAxes.add(cand.axisIdx);
          }
        }
        if (chosen.length < 3) return;
        const avail = axes.map((_, i) => i).filter(i => !usedAxes.has(i));
        if (avail.length === 0) return;
        const focalAxisIdx = avail[Math.floor(p.random(avail.length))];
        let avgX = 0;
        for (const c of chosen) avgX += c.x;
        avgX /= chosen.length;
        const focalX = p.constrain(
          avgX + (p.random() - 0.5) * 80,
          axes[focalAxisIdx].xStart() + 50,
          axes[focalAxisIdx].xEnd() - 50,
        );
        convergences.push(new ConvergenceEvent(chosen, focalX, focalAxisIdx));
      }

      // ─────────────────────────────────────────
      // Layout: ejes distribuidos verticalmente en el frame del hero
      // ─────────────────────────────────────────
      function computeAxes() {
        axes = [];
        const topY = p.height * params.marginTop;
        const bottomY = p.height * (1 - params.marginBottom);
        const spacing = (bottomY - topY) / (NUM_AXES - 1);
        for (let i = 0; i < NUM_AXES; i++) {
          axes.push(new Axis(topY + i * spacing, i));
        }
      }

      function initializeSystem() {
        p.randomSeed(params.seed);
        p.noiseSeed(params.seed);
        computeAxes();
        anchors = [];
        arcs = [];
        convergences = [];
        localTime = 0;
        nextAnchorFrame = 40;
        nextArcFrame = 90;
        nextConvergenceFrame = 550;

        // Pre-poblar composición inicial
        for (let i = 0; i < 32; i++) {
          const pos = pickSpreadPosition();
          const a = new Anchor(pos.x, pos.axisIdx);
          a.birthAnim = 1;
          a.age = Math.floor(p.random(150, 600));
          anchors.push(a);
        }
        for (let i = 0; i < 8; i++) {
          const origin = anchors[Math.floor(p.random(anchors.length))];
          const others = anchors.filter(a => a !== origin && a.axisIdx !== origin.axisIdx);
          if (others.length === 0) continue;
          const nearby = others.filter(a => Math.abs(a.x - origin.x) < 300);
          const pool = nearby.length > 0 ? nearby : others;
          const target = pool[Math.floor(p.random(pool.length))];
          const arc = new Arc(origin, target);
          arc.age = Math.floor(p.random(arc.emergenceDuration + 20, arc.emergenceDuration + arc.holdDuration * 0.6));
          arcs.push(arc);
        }
        p.loop();
      }

      p.setup = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        const c = p.createCanvas(w, h);
        c.parent(host);
        p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
        initializeSystem();
      };

      p.draw = () => {
        const ctx = p.drawingContext as CanvasRenderingContext2D;
        ctx.fillStyle = PAL.bg;
        ctx.fillRect(0, 0, p.width, p.height);

        localTime++;
        tryAnchor();
        tryArc();
        tryConvergence();

        for (const ax of axes) ax.draw();
        for (const a of arcs) { a.update(); a.draw(); }
        arcs = arcs.filter(a => a.isAlive());
        for (const c of convergences) { c.update(); c.draw(); }
        convergences = convergences.filter(c => c.isAlive());
        for (const a of anchors) { a.update(); a.draw(); }
      };
    };

    const inst = new p5(sketch, host);
    instanceRef.current = inst;

    // Redraw + recompute layout cuando el contenedor cambia
    let lastW = host.clientWidth;
    let lastH = host.clientHeight;
    const ro = new ResizeObserver(() => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      inst.resizeCanvas(w, h);
      // El sistema se reinicia para recomputar ejes y no dejar anclajes fuera de rango.
      (inst as unknown as { setup?: () => void }).setup?.();
    });
    ro.observe(host);

    return () => {
      ro.disconnect();
      inst.remove();
      instanceRef.current = null;
    };
  }, [seed]);

  return (
    <div
      ref={containerRef}
      aria-label="C-K · sistema de anclajes, arcos y convergencias — obertura editorial"
      role="img"
      className={className ?? 'w-full h-full'}
      style={style ?? { minHeight: 460 }}
    />
  );
}
