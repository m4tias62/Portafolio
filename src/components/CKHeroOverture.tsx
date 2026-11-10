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
 *
 * Interacción (2026-11-10):
 *   Obertura   — los ejes se trazan de izquierda a derecha, los anclajes
 *                aparecen en barrido y la primera convergencia dorada llega
 *                a los ~2 s (antes, a los 9 s).
 *   Cursor     — con mouse o lápiz, los anclajes cercanos se encienden y los
 *                tres más próximos tienden arcos hacia el cursor, que se
 *                marca con un anillo dorado. El tacto no lo activa.
 *   Pausa      — el sistema se detiene cuando el hero sale de pantalla.
 *   Con prefers-reduced-motion queda un único cuadro estático, sin cursor.
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
  anchorInterval: [40, 95],
  arcInterval: [35, 80],
  convergenceInterval: [240, 420],
  maxAnchors: 95,
  maxArcs: 34,
  spreadBias: 0.55,
  neighborBias: 0.68,
};

const NUM_AXES = 5;

// Paleta editorial (alineada con la del site)
const PAL = {
  bg: '#fafaf7',
  axis: [15, 15, 14, 0.07] as [number, number, number, number],
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

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Cursor: radio en que los anclajes se encienden y radio en que tienden arcos.
const NEAR_RADIUS = 170;
const TETHER_RADIUS = 240;
const TETHER_COUNT = 3;

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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Último puntero (mouse/lápiz) en coordenadas de pantalla. Se cruza con el
    // rect del host en cada cuadro, así sigue siendo correcto si el carrusel
    // se mueve con el cursor quieto.
    const pointer = { has: false, clientX: 0, clientY: 0 };
    let onScreen = true;

    const sketch = (p: P5Instance) => {
      let axes: Axis[] = [];
      let anchors: Anchor[] = [];
      let arcs: Arc[] = [];
      let convergences: ConvergenceEvent[] = [];
      let localTime = 0;
      let nextAnchorFrame = 0;
      let nextArcFrame = 0;
      let nextConvergenceFrame = 0;
      let firstConvergence = true;

      // ══════════════════════════════════════════════════════
      // Axis — línea horizontal apenas visible
      // ══════════════════════════════════════════════════════
      class Axis {
        y: number;
        idx: number;
        reveal = 0; // 0..1 — trazo de entrada, escalonado por eje
        constructor(y: number, idx: number) {
          this.y = y;
          this.idx = idx;
        }
        update() {
          if (this.reveal < 1 && localTime > this.idx * 6) this.reveal = Math.min(1, this.reveal + 1 / 36);
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
          ctx.lineTo(this.xStart() + this.xRange() * easeOut(this.reveal), this.y);
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
        birthDelay = 0; // cuadros antes de aparecer (barrido de la obertura)
        near = 0; // 0..1 — cercanía suavizada al cursor
        tether = 0; // 0..1 — progreso del arco tendido hacia el cursor
        bend: number; // curvatura propia del arco al cursor (no tiembla)

        constructor(x: number, axisIdx: number) {
          this.x = x;
          this.axisIdx = axisIdx;
          this.bend = p.random(-1, 1);
        }
        y() { return axes[this.axisIdx].y; }
        visible() { return this.birthDelay <= 0; }
        update() {
          this.age++;
          if (this.birthDelay > 0) {
            this.birthDelay--;
            return;
          }
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
          if (!this.visible()) return;
          const alpha = Math.min(1, this.birthAnim * this.ageAlpha() + this.near * 0.4);
          const y = this.y();
          const ctx = p.drawingContext as CanvasRenderingContext2D;
          if (this.near > 0.02) {
            ctx.strokeStyle = rgba(PAL.anchor, 0.2 * this.near);
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.arc(this.x, y, this.baseRadius + 4 + this.near * 5, 0, Math.PI * 2);
            ctx.stroke();
          }
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
          ctx.arc(this.x, y, this.baseRadius + this.goldPhase * 0.8 + this.near * 2.2, 0, Math.PI * 2);
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
        delay = 0; // cuadros antes de empezar a trazarse (obertura)
        emergenceDuration = 70;
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
        update() {
          if (this.delay > 0) {
            this.delay--;
            return;
          }
          this.age++;
        }
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
          if (this.delay > 0) return;
          const alpha = this.phaseAlpha();
          if (alpha <= 0.005) return;
          const progress = this.drawProgress();
          const segments = 48;
          const endSeg = Math.floor(segments * progress);
          const ctx = p.drawingContext as CanvasRenderingContext2D;
          ctx.strokeStyle = rgba(PAL.arc, alpha * 0.42);
          ctx.lineWidth = 0.8;
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

        constructor(originAnchors: Anchor[], focalX: number, focalAxisIdx: number, fast = false) {
          // La primera convergencia de la obertura es más corta (~2 s en total).
          if (fast) this.waitDuration = 72;
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
            arc.emergenceDuration = fast ? 64 : 95;
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
        const shown = anchors.filter(a => a.visible());
        if (shown.length < 2) return;
        const recent = shown.slice(-Math.min(40, shown.length));
        const origin = recent[Math.floor(p.random(recent.length))];
        let target: Anchor | undefined;
        if (p.random() < params.neighborBias) {
          const candidates = shown.filter(a =>
            a !== origin && a.axisIdx !== origin.axisIdx && Math.abs(a.x - origin.x) < 300,
          );
          if (candidates.length > 0) {
            const adj = candidates.filter(a => Math.abs(a.axisIdx - origin.axisIdx) === 1);
            const pool = adj.length > 0 && p.random() < 0.6 ? adj : candidates;
            target = pool[Math.floor(p.random(pool.length))];
          }
        }
        if (!target) {
          const otherAxis = shown.filter(a => a !== origin && a.axisIdx !== origin.axisIdx);
          if (otherAxis.length === 0) return;
          target = otherAxis[Math.floor(p.random(otherAxis.length))];
        }
        arcs.push(new Arc(origin, target));
        capArcs();
      }

      function tryConvergence() {
        if (localTime < nextConvergenceFrame) return;
        // La primera reintenta pronto si aún no hay suficientes anclajes visibles.
        nextConvergenceFrame = firstConvergence
          ? localTime + 12
          : localTime + Math.floor(p.random(params.convergenceInterval[0], params.convergenceInterval[1]));
        // La primera ocurre donde se ve: en escritorio el texto vela la mitad
        // izquierda (foco en el ~40 % derecho); en celular, solo la franja
        // superior queda despejada (foco en el primer eje).
        const wide = p.width > 820;
        const pool = anchors
          .filter(a => a.visible() && (!firstConvergence || !wide || a.x > p.width * 0.45))
          .slice(-50);
        if (pool.length < (firstConvergence ? 6 : 10)) return;
        const usedAxes = new Set<number>(firstConvergence && !wide ? [0] : []);
        const chosen: Anchor[] = [];
        for (let attempt = 0; attempt < 40 && chosen.length < 4; attempt++) {
          const cand = pool[Math.floor(p.random(pool.length))];
          if (!usedAxes.has(cand.axisIdx)) {
            chosen.push(cand);
            usedAxes.add(cand.axisIdx);
          }
        }
        if (chosen.length < 3) return;
        if (firstConvergence && !wide) usedAxes.delete(0);
        const avail = axes.map((_, i) => i).filter(i => !usedAxes.has(i));
        if (avail.length === 0) return;
        const focalAxisIdx = firstConvergence && !wide ? 0 : avail[Math.floor(p.random(avail.length))];
        let avgX = 0;
        for (const c of chosen) avgX += c.x;
        avgX /= chosen.length;
        const focalX = p.constrain(
          avgX + (p.random() - 0.5) * 80,
          firstConvergence && wide ? p.width * 0.6 : axes[focalAxisIdx].xStart() + 50,
          axes[focalAxisIdx].xEnd() - 50,
        );
        convergences.push(new ConvergenceEvent(chosen, focalX, focalAxisIdx, firstConvergence));
        if (firstConvergence) {
          firstConvergence = false;
          nextConvergenceFrame = localTime + Math.floor(p.random(params.convergenceInterval[0], params.convergenceInterval[1]));
        }
      }

      // ─────────────────────────────────────────
      // Cursor: cercanía de anclajes + arcos tendidos hacia el cursor
      // ─────────────────────────────────────────
      const cur = { x: 0, y: 0, s: 0 };
      function updateCursor() {
        let inside = false;
        let tx = cur.x;
        let ty = cur.y;
        if (pointer.has) {
          const r = host.getBoundingClientRect();
          tx = pointer.clientX - r.left;
          ty = pointer.clientY - r.top;
          inside = tx >= 0 && ty >= 0 && tx <= r.width && ty <= r.height;
        }
        if (inside && cur.s < 0.02) {
          cur.x = tx;
          cur.y = ty;
        } else if (inside) {
          cur.x += (tx - cur.x) * 0.22;
          cur.y += (ty - cur.y) * 0.22;
        }
        cur.s += ((inside ? 1 : 0) - cur.s) * 0.08;

        // Los TETHER_COUNT anclajes visibles más cercanos dentro del radio.
        const ranked: { a: Anchor; d: number }[] = [];
        for (const a of anchors) {
          if (!a.visible()) continue;
          const d = Math.hypot(a.x - cur.x, a.y() - cur.y);
          const nearTarget = cur.s * Math.pow(Math.max(0, 1 - d / NEAR_RADIUS), 2);
          a.near += (nearTarget - a.near) * 0.12;
          if (d < TETHER_RADIUS) ranked.push({ a, d });
        }
        ranked.sort((m, n) => m.d - n.d);
        const tethered = new Set(cur.s > 0.05 ? ranked.slice(0, TETHER_COUNT).map(r => r.a) : []);
        for (const a of anchors) {
          const target = tethered.has(a) ? 1 : 0;
          a.tether += (target - a.tether) * (target > a.tether ? 0.07 : 0.12);
          if (a.tether < 0.002) a.tether = 0;
        }
      }

      function drawCursor() {
        if (cur.s < 0.01) return;
        const ctx = p.drawingContext as CanvasRenderingContext2D;
        let maxT = 0;
        for (const a of anchors) {
          if (a.tether <= 0.01) continue;
          maxT = Math.max(maxT, a.tether);
          const ox = a.x;
          const oy = a.y();
          const dx = cur.x - ox;
          const dy = cur.y - oy;
          const len = Math.hypot(dx, dy) || 1;
          const cx = (ox + cur.x) / 2 + (-dy / len) * a.bend * len * 0.25;
          const cy = (oy + cur.y) / 2 + (dx / len) * a.bend * len * 0.25;
          const prog = easeOut(a.tether);
          const segs = 32;
          const end = Math.max(1, Math.floor(segs * prog));
          ctx.strokeStyle = rgba(PAL.arc, 0.4 * a.tether * cur.s);
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          for (let i = 1; i <= end; i++) {
            const t = (i / segs);
            const it = 1 - t;
            ctx.lineTo(it * it * ox + 2 * it * t * cx + t * t * cur.x, it * it * oy + 2 * it * t * cy + t * t * cur.y);
          }
          ctx.stroke();
        }
        // Anillo dorado en el cursor: el foco que «propone» el visitante.
        ctx.strokeStyle = rgba(PAL.gold, 0.6 * cur.s * (0.35 + 0.65 * maxT));
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.arc(cur.x, cur.y, 6 + maxT * 3, 0, Math.PI * 2);
        ctx.stroke();
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
        nextAnchorFrame = 100;
        nextArcFrame = 190;
        nextConvergenceFrame = 70;
        firstConvergence = true;

        // Obertura: los anclajes iniciales aparecen en barrido de izquierda a
        // derecha (~1 s) mientras se trazan los ejes.
        for (let i = 0; i < 32; i++) {
          const pos = pickSpreadPosition();
          const a = new Anchor(pos.x, pos.axisIdx);
          const ax = axes[pos.axisIdx];
          a.birthDelay = Math.floor(6 + ((pos.x - ax.xStart()) / ax.xRange()) * 48 + p.random(0, 10));
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
          // Se trazan uno tras otro durante la obertura (~1–2,5 s).
          arc.delay = 60 + i * 14;
          arcs.push(arc);
        }
        if (onScreen && !reducedMotion) p.loop();
        else p.noLoop();
      }

      p.setup = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        const c = p.createCanvas(w, h);
        c.parent(host);
        p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
        initializeSystem();
        // prefers-reduced-motion: se simula el sistema fuera de pantalla hasta
        // una composición madura y se deja un único cuadro estático.
        if (reducedMotion) {
          for (let i = 0; i < 420; i++) p.draw();
          p.noLoop();
        } else if (!onScreen) {
          p.draw();
        }
      };

      p.draw = () => {
        const ctx = p.drawingContext as CanvasRenderingContext2D;
        ctx.fillStyle = PAL.bg;
        ctx.fillRect(0, 0, p.width, p.height);

        localTime++;
        tryAnchor();
        tryArc();
        tryConvergence();

        if (!reducedMotion) updateCursor();

        for (const ax of axes) { ax.update(); ax.draw(); }
        for (const a of arcs) { a.update(); a.draw(); }
        arcs = arcs.filter(a => a.isAlive());
        for (const c of convergences) { c.update(); c.draw(); }
        convergences = convergences.filter(c => c.isAlive());
        if (!reducedMotion) drawCursor();
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

    // Puntero: solo mouse o lápiz (el tacto se usa para desplazarse).
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointer.has = true;
      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;
    };
    const onPointerOut = () => { pointer.has = false; };
    if (!reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerOut);
    }

    // Pausa cuando el hero sale de pantalla (carrusel o scroll en celular).
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (reducedMotion) return;
      if (onScreen) inst.loop();
      else inst.noLoop();
    });
    io.observe(host);

    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerOut);
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
