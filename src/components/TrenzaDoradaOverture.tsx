import { useEffect, useRef } from 'react';
import p5 from 'p5';

/**
 * TrenzaDoradaOverture
 * --------------------
 * Sistema axonométrico de tres estratos (K, I, U) para el hero.
 * Traducción alegórica del pensamiento de Hofstadter (GEB):
 *
 *   K — plano mecánico / axiomático (grilla, agentes M-Mode)
 *   I — membrana de interpretación (canales cian/magenta)
 *   U — plano conceptual (átomos indecidibles)
 *
 * Eventos JOOTSing (Jumping Out Of The System): un agente K elige
 * mecánicamente una dirección hacia afuera de la grilla → sube por I,
 * cruza el interior, asciende hasta U, captura un átomo, y desciende
 * como hilo dorado. El impacto queda como memoria persistente.
 *
 * Contemplativa: sin controles, sin dev panel — el sistema respira solo.
 * Portada del hero-first HTML "trenza-dorada" de Matías, adaptada al
 * frame del site (no fullscreen).
 */

type P5Instance = p5;

type Params = {
  seed: number;
  gridSize: number;
  agentCount: number;
  agentSpeed: number;
  jootsChance: number;
  atomCount: number;
  atomDriftAmp: number;
  threadMax: number;
  cBase: string;
  cCyan: string;
  cMagenta: string;
  cGold: string;
  cBg: string;
};

const DEFAULTS: Params = {
  seed: 12345,
  gridSize: 20,
  agentCount: 14,
  agentSpeed: 0.6,
  jootsChance: 0.35,
  atomCount: 42,
  atomDriftAmp: 0.9,
  threadMax: 22,
  cBase: '#141413',
  cCyan: '#4a9db8',
  cMagenta: '#b56d9b',
  cGold: '#c9955b',
  cBg: '#fafaf7', // integrado al fondo del site
};

export default function TrenzaDoradaOverture({
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
      // Proyección isométrica estricta (30°)
      const ISO_COS = Math.cos(Math.PI / 6);
      const ISO_SIN = Math.sin(Math.PI / 6);

      // Alturas z relativas al planeSize
      let I_Z = 0;
      let U_Z = 0;

      let cellSize = 0;
      let originX = 0;
      let originY = 0;
      let planeSize = 0;

      // Estado
      let agents: Agent[] = [];
      let atoms: UAtom[] = [];
      let events: TransitionEvent[] = [];
      let waves: ImpactWave[] = [];
      let threads: PersistentThread[] = [];
      let localTime = 0;

      // ─────────────────────────────────────────
      // Proyección
      // ─────────────────────────────────────────
      const iso = (x: number, y: number, z: number) => ({
        x: (x - y) * ISO_COS + originX,
        y: (x + y) * ISO_SIN - z + originY,
      });

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // ─────────────────────────────────────────
      // Layout responsivo — usa el tamaño DEL CONTENEDOR (no window)
      // ─────────────────────────────────────────
      function computeLayout() {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        // Proyección isométrica: ISO_SIN = 0.5, ISO_COS ≈ 0.866
        // Volumen vertical  = punto(K, esquina lejana) − punto(U, esquina cercana)
        //                   = planeSize + U_Z
        //                   con U_Z = 0.76·planeSize → altoVol = 1.76·planeSize
        // Volumen horizontal = 2·planeSize·ISO_COS ≈ 1.732·planeSize
        //
        // Padding para que respire dentro del frame del hero.
        const padV = h * 0.06;
        const padH = w * 0.05;
        const maxByHeight = (h - padV * 2) / 1.76;
        const maxByWidth = (w - padH * 2) / 1.732;
        planeSize = Math.max(140, Math.min(maxByWidth, maxByHeight));
        cellSize = planeSize / params.gridSize;
        I_Z = planeSize * 0.38;
        U_Z = planeSize * 0.76;
        originX = w / 2;
        // Centrar el volumen: el centro vertical del volumen (entre esquina más
        // alta de U y esquina más baja de K) es originY + (planeSize − U_Z)/2.
        // Igualamos al centro del frame.
        originY = h / 2 - (planeSize - U_Z) / 2;
      }

      // ─────────────────────────────────────────
      // Búsquedas / triggers
      // ─────────────────────────────────────────
      const findNearestAtom = (wx: number, wy: number) => {
        let best: UAtom | null = null;
        let bestDist = Infinity;
        for (const a of atoms) {
          const d = p.dist(wx, wy, a.wx, a.wy);
          if (d < bestDist) {
            bestDist = d;
            best = a;
          }
        }
        return best;
      };

      const triggerAscend = (gx: number, gy: number) => {
        events.push(new TransitionEvent(gx, gy));
      };

      // ═══════════════════════════════════════════════════════
      // Agente M-Mode
      // ═══════════════════════════════════════════════════════
      class Agent {
        gx: number; gy: number;
        tgx: number; tgy: number;
        progress: number;
        pauseFrames: number;

        constructor() {
          this.gx = Math.floor(p.random(params.gridSize));
          this.gy = Math.floor(p.random(params.gridSize));
          this.tgx = this.gx;
          this.tgy = this.gy;
          this.progress = 1;
          this.pauseFrames = Math.floor(p.random(40));
        }

        pickTarget() {
          const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
          for (let i = dirs.length - 1; i > 0; i--) {
            const j = Math.floor(p.random(i + 1));
            [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
          }
          const valid: number[][] = [];
          let outwardChoiceMade = false;

          for (const [dx, dy] of dirs) {
            const nx = this.gx + dx;
            const ny = this.gy + dy;
            if (nx >= 0 && nx < params.gridSize && ny >= 0 && ny < params.gridSize) {
              valid.push([dx, dy]);
            } else {
              outwardChoiceMade = true;
            }
          }

          // JOOTSing: el agente eligió mecánicamente salir → salto metasistémico
          if (outwardChoiceMade && p.random() < params.jootsChance && events.length < 2) {
            triggerAscend(this.gx, this.gy);
          }

          if (valid.length > 0) {
            const [dx, dy] = valid[Math.floor(p.random(valid.length))];
            this.tgx = this.gx + dx;
            this.tgy = this.gy + dy;
            this.progress = 0;
          }
        }

        update() {
          if (this.pauseFrames > 0) { this.pauseFrames--; return; }
          if (this.progress >= 1) {
            this.gx = this.tgx;
            this.gy = this.tgy;
            this.pickTarget();
            this.pauseFrames = Math.floor(p.random(6, 24));
          } else {
            this.progress += params.agentSpeed * 0.025;
          }
        }

        display() {
          const t = Math.min(this.progress, 1);
          const wx = p.lerp(this.gx, this.tgx, t) * cellSize;
          const wy = p.lerp(this.gy, this.tgy, t) * cellSize;
          p.noStroke();
          const c = p.color(params.cBase);
          c.setAlpha(230);
          p.fill(c);
          const s = cellSize * 0.26;
          const corners = [
            iso(wx - s, wy - s, 0),
            iso(wx + s, wy - s, 0),
            iso(wx + s, wy + s, 0),
            iso(wx - s, wy + s, 0),
          ];
          p.beginShape();
          for (const cc of corners) p.vertex(cc.x, cc.y);
          p.endShape(p.CLOSE);
        }
      }

      // ═══════════════════════════════════════════════════════
      // Átomo U-Mode
      // ═══════════════════════════════════════════════════════
      class UAtom {
        baseWx: number; baseWy: number;
        wx: number; wy: number;
        zJitter: number;
        pulsePhase: number; pulseSpeed: number;
        noiseOffset: number;
        activation: number;
        activationDecay: number;

        constructor() {
          this.baseWx = p.random(planeSize * 0.05, planeSize * 0.95);
          this.baseWy = p.random(planeSize * 0.05, planeSize * 0.95);
          this.wx = this.baseWx;
          this.wy = this.baseWy;
          this.zJitter = p.random(-planeSize * 0.03, planeSize * 0.03);
          this.pulsePhase = p.random(p.TWO_PI);
          this.pulseSpeed = p.random(0.012, 0.024);
          this.noiseOffset = p.random(1000);
          this.activation = 0;
          this.activationDecay = 0;
        }

        update() {
          const n1 = p.noise(this.baseWx * 0.008, this.baseWy * 0.008, localTime * 0.0015 + this.noiseOffset);
          const n2 = p.noise(this.baseWx * 0.008 + 400, this.baseWy * 0.008 + 400, localTime * 0.0015 + this.noiseOffset);
          const amp = cellSize * params.atomDriftAmp;
          this.wx = this.baseWx + (n1 - 0.5) * amp * 2;
          this.wy = this.baseWy + (n2 - 0.5) * amp * 2;
          if (this.activationDecay > 0) {
            this.activationDecay--;
            this.activation = this.activationDecay / 100;
          } else {
            this.activation = 0;
          }
        }

        activate() {
          this.activationDecay = 100;
          this.activation = 1;
        }

        display() {
          const pt = iso(this.wx, this.wy, U_Z + this.zJitter);
          const pulse = 0.5 + 0.5 * Math.sin(localTime * this.pulseSpeed + this.pulsePhase);
          const haloR = cellSize * (0.5 + pulse * 0.3 + this.activation * 1.2);
          p.noStroke();
          for (let i = 3; i >= 1; i--) {
            const c = this.activation > 0.1 ? p.color(params.cGold) : p.color(params.cBase);
            c.setAlpha((14 + pulse * 8 + this.activation * 40) / i);
            p.fill(c);
            p.circle(pt.x, pt.y, haloR * i);
          }
          const cCore = this.activation > 0.1 ? p.color(params.cGold) : p.color(params.cBase);
          cCore.setAlpha(150 + pulse * 50 + this.activation * 100);
          p.fill(cCore);
          const coreR = 2.2 + pulse * 0.8 + this.activation * 3;
          p.circle(pt.x, pt.y, coreR);
        }

        drawShadow() {
          const pShadow = iso(this.wx, this.wy, 0);
          const pulse = 0.5 + 0.5 * Math.sin(localTime * this.pulseSpeed + this.pulsePhase);
          const c = this.activation > 0.1 ? p.color(params.cGold) : p.color(params.cBase);
          c.setAlpha(18 + pulse * 12 + this.activation * 50);
          p.noStroke();
          p.fill(c);
          p.circle(pShadow.x, pShadow.y, 2 + this.activation * 3);
        }
      }

      // ═══════════════════════════════════════════════════════
      // Evento de transición K → I → U → descenso dorado → K
      // ═══════════════════════════════════════════════════════
      type Phase = 'ascend1' | 'traverse' | 'ascend2' | 'concept' | 'descend' | 'impact' | 'done';

      class TransitionEvent {
        originWx: number; originWy: number;
        exitWx: number; exitWy: number;
        hue: 'cyan' | 'magenta';
        bulge: number;
        phase: Phase = 'ascend1';
        age = 0;
        capturedAtom: UAtom | null = null;
        landWx: number; landWy: number;

        constructor(gx: number, gy: number) {
          this.originWx = gx * cellSize + cellSize / 2;
          this.originWy = gy * cellSize + cellSize / 2;
          this.exitWx = p.random(planeSize * 0.2, planeSize * 0.8);
          this.exitWy = p.random(planeSize * 0.2, planeSize * 0.8);
          this.hue = p.random() < 0.5 ? 'cyan' : 'magenta';
          this.bulge = (p.random() - 0.5) * cellSize * 3;
          this.landWx = this.exitWx;
          this.landWy = this.exitWy;
        }

        hueColor() {
          return this.hue === 'cyan' ? params.cCyan : params.cMagenta;
        }

        update() {
          this.age++;
          switch (this.phase) {
            case 'ascend1':
              if (this.age > 50) { this.phase = 'traverse'; this.age = 0; }
              break;
            case 'traverse':
              if (this.age > 55) { this.phase = 'ascend2'; this.age = 0; }
              break;
            case 'ascend2':
              if (this.age > 45) {
                this.capturedAtom = findNearestAtom(this.exitWx, this.exitWy);
                if (this.capturedAtom) this.capturedAtom.activate();
                this.phase = 'concept';
                this.age = 0;
              }
              break;
            case 'concept':
              if (this.capturedAtom && this.age % 30 === 0) this.capturedAtom.activate();
              if (this.age > 100) {
                this.phase = 'descend';
                this.age = 0;
                if (this.capturedAtom) {
                  this.landWx = p.constrain(this.capturedAtom.wx, 0, planeSize);
                  this.landWy = p.constrain(this.capturedAtom.wy, 0, planeSize);
                }
              }
              break;
            case 'descend':
              if (this.age > 55) {
                this.phase = 'impact';
                this.age = 0;
                waves.push(new ImpactWave(this.landWx, this.landWy));
                threads.push(new PersistentThread(this.originWx, this.originWy, this.landWx, this.landWy));
                while (threads.length > params.threadMax) threads.shift();
              }
              break;
            case 'impact':
              if (this.age > 25) this.phase = 'done';
              break;
          }
        }

        display() {
          // K → I
          if (this.phase === 'ascend1') {
            const t = easeOutCubic(this.age / 50);
            drawGlowRay(this.originWx, this.originWy, 0, this.originWx, this.originWy, p.lerp(0, I_Z, t), this.hueColor(), 3, 1.0);
            drawKPulse(this.originWx, this.originWy, this.age / 50, this.hueColor());
          } else if (['traverse', 'ascend2', 'concept', 'descend'].includes(this.phase)) {
            drawGlowRay(this.originWx, this.originWy, 0, this.originWx, this.originWy, I_Z, this.hueColor(), 2, 0.35);
          }

          // Enrutamiento I
          if (this.phase === 'traverse') {
            const t = easeInOutCubic(this.age / 55);
            drawIRouting(this.originWx, this.originWy, this.exitWx, this.exitWy, t, this.hueColor(), 1.0, this.bulge);
          } else if (['ascend2', 'concept', 'descend'].includes(this.phase)) {
            drawIRouting(this.originWx, this.originWy, this.exitWx, this.exitWy, 1, this.hueColor(), 0.35, this.bulge);
          }

          // I → U
          if (this.phase === 'ascend2') {
            const t = easeOutCubic(this.age / 45);
            drawGlowRay(this.exitWx, this.exitWy, I_Z, this.exitWx, this.exitWy, p.lerp(I_Z, U_Z, t), this.hueColor(), 3, 1.0);
          } else if (['concept', 'descend'].includes(this.phase)) {
            drawGlowRay(this.exitWx, this.exitWy, I_Z, this.exitWx, this.exitWy, U_Z, this.hueColor(), 2, 0.35);
          }

          // Fase concept — guía dorada punteada
          if (this.phase === 'concept' && this.capturedAtom) {
            const atom = this.capturedAtom;
            const p1 = iso(atom.wx, atom.wy, U_Z);
            const p2 = iso(atom.wx, atom.wy, 0);
            const c = p.color(params.cGold);
            c.setAlpha(50 + 30 * Math.sin(this.age * 0.15));
            p.stroke(c);
            p.strokeWeight(0.8);
            (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 5]);
            p.line(p1.x, p1.y, p2.x, p2.y);
            (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);
            const cellSquare = cellSize * 0.5;
            const kCorners = [
              iso(atom.wx - cellSquare, atom.wy - cellSquare, 0),
              iso(atom.wx + cellSquare, atom.wy - cellSquare, 0),
              iso(atom.wx + cellSquare, atom.wy + cellSquare, 0),
              iso(atom.wx - cellSquare, atom.wy + cellSquare, 0),
            ];
            c.setAlpha(60);
            p.noFill();
            p.stroke(c);
            p.strokeWeight(0.7);
            p.beginShape();
            for (const kc of kCorners) p.vertex(kc.x, kc.y);
            p.endShape(p.CLOSE);
          }

          // Descenso dorado
          if (this.phase === 'descend') {
            const t = easeInOutCubic(this.age / 55);
            const currentZ = p.lerp(U_Z, 0, t);
            drawGlowRay(this.landWx, this.landWy, U_Z, this.landWx, this.landWy, currentZ, params.cGold, 4, 1.0);
            const tipP = iso(this.landWx, this.landWy, currentZ);
            p.noStroke();
            const c = p.color(params.cGold);
            for (let i = 4; i >= 1; i--) {
              c.setAlpha(45 / i);
              p.fill(c);
              p.circle(tipP.x, tipP.y, i * 7);
            }
            c.setAlpha(255);
            p.fill(c);
            p.circle(tipP.x, tipP.y, 4);
          }
        }
      }

      // ═══════════════════════════════════════════════════════
      // Onda de impacto
      // ═══════════════════════════════════════════════════════
      class ImpactWave {
        wx: number; wy: number;
        age = 0;
        maxAge = 55;
        constructor(wx: number, wy: number) { this.wx = wx; this.wy = wy; }
        update() { this.age++; return this.age < this.maxAge; }
        display() {
          const t = this.age / this.maxAge;
          const eased = easeOutCubic(t);
          const maxRadius = cellSize * 6.5;
          const c = p.color(params.cGold);
          for (let ring = 0; ring < 3; ring++) {
            const r = maxRadius * eased * (1 - ring * 0.28);
            if (r <= 0) continue;
            const alpha = (1 - t) * (200 - ring * 55);
            if (alpha <= 0) continue;
            c.setAlpha(alpha);
            p.noFill();
            p.stroke(c);
            p.strokeWeight(1.2);
            const corners = [
              iso(this.wx - r, this.wy - r, 0),
              iso(this.wx + r, this.wy - r, 0),
              iso(this.wx + r, this.wy + r, 0),
              iso(this.wx - r, this.wy + r, 0),
            ];
            p.beginShape();
            for (const cc of corners) p.vertex(cc.x, cc.y);
            p.endShape(p.CLOSE);
          }
          const cp = iso(this.wx, this.wy, 0);
          c.setAlpha((1 - t) * 220);
          p.noStroke();
          p.fill(c);
          p.circle(cp.x, cp.y, (1 - t) * 8);
        }
      }

      // ═══════════════════════════════════════════════════════
      // Hilo persistente
      // ═══════════════════════════════════════════════════════
      class PersistentThread {
        ax: number; ay: number; bx: number; by: number;
        alpha = 0;
        targetAlpha = 28;
        constructor(ax: number, ay: number, bx: number, by: number) {
          this.ax = ax; this.ay = ay; this.bx = bx; this.by = by;
        }
        update() { if (this.alpha < this.targetAlpha) this.alpha += 0.6; }
        display() {
          const c = p.color(params.cBase);
          c.setAlpha(this.alpha);
          p.stroke(c);
          p.strokeWeight(0.4);
          const a0 = iso(this.ax, this.ay, 0);
          const aU = iso(this.ax, this.ay, U_Z);
          const b0 = iso(this.bx, this.by, 0);
          const bU = iso(this.bx, this.by, U_Z);
          p.line(a0.x, a0.y, aU.x, aU.y);
          p.line(b0.x, b0.y, bU.x, bU.y);
          c.setAlpha(this.alpha * 0.55);
          p.stroke(c);
          const aI = iso(this.ax, this.ay, I_Z);
          const bI = iso(this.bx, this.by, I_Z);
          p.line(aI.x, aI.y, bI.x, bI.y);
          p.noStroke();
          c.setAlpha(this.alpha * 1.6);
          p.fill(c);
          p.circle(a0.x, a0.y, 2);
          p.circle(b0.x, b0.y, 2.4);
        }
      }

      // ─────────────────────────────────────────
      // Helpers de dibujo
      // ─────────────────────────────────────────
      const drawGlowRay = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, colorStr: string, thickness: number, alphaMult: number) => {
        const p1 = iso(x1, y1, z1);
        const p2 = iso(x2, y2, z2);
        const c = p.color(colorStr);
        for (let i = 4; i >= 1; i--) {
          c.setAlpha(16 * alphaMult / i);
          p.stroke(c);
          p.strokeWeight(thickness * i * 1.2);
          p.line(p1.x, p1.y, p2.x, p2.y);
        }
        c.setAlpha(230 * alphaMult);
        p.stroke(c);
        p.strokeWeight(Math.max(0.8, thickness * 0.5));
        p.line(p1.x, p1.y, p2.x, p2.y);
      };

      const drawKPulse = (wx: number, wy: number, t: number, colorStr: string) => {
        const c = p.color(colorStr);
        c.setAlpha((1 - t) * 180);
        p.noFill();
        p.stroke(c);
        p.strokeWeight(1.4);
        const s = cellSize * (0.5 + t * 0.9);
        const corners = [
          iso(wx - s, wy - s, 0),
          iso(wx + s, wy - s, 0),
          iso(wx + s, wy + s, 0),
          iso(wx - s, wy + s, 0),
        ];
        p.beginShape();
        for (const cc of corners) p.vertex(cc.x, cc.y);
        p.endShape(p.CLOSE);
      };

      const drawIRouting = (x1: number, y1: number, x2: number, y2: number, progress: number, colorStr: string, alphaMult: number, bulge: number) => {
        const dx = x2 - x1, dy = y2 - y1;
        const mag = Math.sqrt(dx * dx + dy * dy);
        if (mag < 0.001) return;
        const perpNx = -dy / mag;
        const perpNy = dx / mag;
        const cx1 = x1 + dx * 0.33 + perpNx * bulge;
        const cy1 = y1 + dy * 0.33 + perpNy * bulge;
        const cx2 = x1 + dx * 0.67 + perpNx * bulge;
        const cy2 = y1 + dy * 0.67 + perpNy * bulge;
        const segments = 32;
        const c = p.color(colorStr);
        const endT = Math.max(0, Math.min(1, progress));

        for (let glow = 3; glow >= 1; glow--) {
          c.setAlpha(14 * alphaMult / glow);
          p.stroke(c);
          p.strokeWeight(1.3 * glow);
          p.noFill();
          p.beginShape();
          for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * endT;
            const bx = Math.pow(1 - t, 3) * x1 + 3 * Math.pow(1 - t, 2) * t * cx1 + 3 * (1 - t) * t * t * cx2 + Math.pow(t, 3) * x2;
            const by = Math.pow(1 - t, 3) * y1 + 3 * Math.pow(1 - t, 2) * t * cy1 + 3 * (1 - t) * t * t * cy2 + Math.pow(t, 3) * y2;
            const pt = iso(bx, by, I_Z);
            p.vertex(pt.x, pt.y);
          }
          p.endShape();
        }
        c.setAlpha(210 * alphaMult);
        p.stroke(c);
        p.strokeWeight(1.1);
        p.noFill();
        p.beginShape();
        for (let i = 0; i <= segments; i++) {
          const t = (i / segments) * endT;
          const bx = Math.pow(1 - t, 3) * x1 + 3 * Math.pow(1 - t, 2) * t * cx1 + 3 * (1 - t) * t * t * cx2 + Math.pow(t, 3) * x2;
          const by = Math.pow(1 - t, 3) * y1 + 3 * Math.pow(1 - t, 2) * t * cy1 + 3 * (1 - t) * t * t * cy2 + Math.pow(t, 3) * y2;
          const pt = iso(bx, by, I_Z);
          p.vertex(pt.x, pt.y);
        }
        p.endShape();

        if (endT < 1) {
          const t = endT;
          const bx = Math.pow(1 - t, 3) * x1 + 3 * Math.pow(1 - t, 2) * t * cx1 + 3 * (1 - t) * t * t * cx2 + Math.pow(t, 3) * x2;
          const by = Math.pow(1 - t, 3) * y1 + 3 * Math.pow(1 - t, 2) * t * cy1 + 3 * (1 - t) * t * t * cy2 + Math.pow(t, 3) * y2;
          const pt = iso(bx, by, I_Z);
          p.noStroke();
          c.setAlpha(220 * alphaMult);
          p.fill(c);
          p.circle(pt.x, pt.y, 5);
        }
      };

      // Andamiaje: postes verticales K↔I↔U en las esquinas
      const drawCornerPosts = () => {
        const c = p.color(params.cBase);
        c.setAlpha(35);
        p.stroke(c);
        p.strokeWeight(0.6);
        const s = planeSize;
        const cornersK = [[0, 0], [s, 0], [s, s], [0, s]];
        for (const [cx, cy] of cornersK) {
          const p0 = iso(cx, cy, 0);
          const pU = iso(cx, cy, U_Z);
          p.line(p0.x, p0.y, pU.x, pU.y);
          c.setAlpha(90);
          p.noStroke();
          p.fill(c);
          const pI = iso(cx, cy, I_Z);
          p.circle(p0.x, p0.y, 3);
          p.circle(pI.x, pI.y, 2.4);
          p.circle(pU.x, pU.y, 2.4);
          c.setAlpha(35);
          p.stroke(c);
          p.noFill();
        }
      };

      const drawKPlane = () => {
        const c = p.color(params.cBase);
        c.setAlpha(25);
        p.stroke(c);
        p.strokeWeight(0.5);
        p.noFill();
        for (let i = 0; i <= params.gridSize; i++) {
          const u = i * cellSize;
          const p1 = iso(0, u, 0);
          const p2 = iso(planeSize, u, 0);
          p.line(p1.x, p1.y, p2.x, p2.y);
          const p3 = iso(u, 0, 0);
          const p4 = iso(u, planeSize, 0);
          p.line(p3.x, p3.y, p4.x, p4.y);
        }
        c.setAlpha(150);
        p.stroke(c);
        p.strokeWeight(1.2);
        const corners = [iso(0, 0, 0), iso(planeSize, 0, 0), iso(planeSize, planeSize, 0), iso(0, planeSize, 0)];
        p.beginShape();
        for (const pt of corners) p.vertex(pt.x, pt.y);
        p.endShape(p.CLOSE);
      };

      const drawIPlane = () => {
        const c = p.color(params.cBase);
        c.setAlpha(35);
        p.noStroke();
        p.fill(c);
        for (let i = 0; i <= params.gridSize; i += 4) {
          for (let j = 0; j <= params.gridSize; j += 4) {
            const pt = iso(i * cellSize, j * cellSize, I_Z);
            p.circle(pt.x, pt.y, 1.4);
          }
        }
        c.setAlpha(60);
        p.stroke(c);
        p.strokeWeight(0.6);
        p.noFill();
        const corners = [
          iso(0, 0, I_Z), iso(planeSize, 0, I_Z),
          iso(planeSize, planeSize, I_Z), iso(0, planeSize, I_Z),
        ];
        p.beginShape();
        for (const pt of corners) p.vertex(pt.x, pt.y);
        p.endShape(p.CLOSE);
      };

      const drawUPlane = () => {
        const c = p.color(params.cBase);
        c.setAlpha(45);
        p.stroke(c);
        p.strokeWeight(0.5);
        p.noFill();
        const corners = [
          iso(0, 0, U_Z), iso(planeSize, 0, U_Z),
          iso(planeSize, planeSize, U_Z), iso(0, planeSize, U_Z),
        ];
        p.beginShape();
        for (const pt of corners) p.vertex(pt.x, pt.y);
        p.endShape(p.CLOSE);
      };

      // ─────────────────────────────────────────
      // Setup + Draw
      // ─────────────────────────────────────────
      const initializeSystem = () => {
        p.randomSeed(params.seed);
        p.noiseSeed(params.seed);
        computeLayout();

        agents = [];
        atoms = [];
        events = [];
        waves = [];
        threads = [];
        localTime = 0;

        for (let i = 0; i < params.agentCount; i++) agents.push(new Agent());
        for (let i = 0; i < params.atomCount; i++) atoms.push(new UAtom());

        // Pre-poblar hilos para dar sensación de sistema "en curso"
        for (let i = 0; i < 4; i++) {
          const th = new PersistentThread(
            p.random(planeSize), p.random(planeSize),
            p.random(planeSize), p.random(planeSize),
          );
          th.alpha = th.targetAlpha;
          threads.push(th);
        }
        p.loop();
      };

      p.setup = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        const c = p.createCanvas(w, h);
        c.parent(host);
        p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
        initializeSystem();
      };

      p.draw = () => {
        p.background(params.cBg);
        localTime++;
        drawCornerPosts();
        for (const t of threads) { t.update(); t.display(); }
        for (const a of atoms) a.drawShadow();
        drawKPlane();
        waves = waves.filter(w => { w.display(); return w.update(); });
        for (const a of agents) { a.update(); a.display(); }
        drawIPlane();
        events = events.filter(e => { e.update(); e.display(); return e.phase !== 'done'; });
        drawUPlane();
        for (const a of atoms) { a.update(); a.display(); }
      };
    };

    const inst = new p5(sketch, host);
    instanceRef.current = inst;

    // Redraw en resize del contenedor
    let lastW = host.clientWidth;
    let lastH = host.clientHeight;
    const ro = new ResizeObserver(() => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (w === lastW && h === lastH) return;
      lastW = w; lastH = h;
      inst.resizeCanvas(w, h);
      // Recalcular layout preservando estado — para simplicidad, reiniciamos
      // (los hilos que quedan son parte del "estado en curso"; aquí perdemos)
      // TODO: reflow sin reset.
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
      aria-label="Trenza Dorada — sistema axonométrico K/I/U con eventos JOOTSing"
      role="img"
      className={className ?? 'w-full h-full'}
      style={style ?? { minHeight: 460 }}
    />
  );
}
