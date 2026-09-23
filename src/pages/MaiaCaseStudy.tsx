import { useEffect, useRef, useState } from 'react';
import BackButton from '@/components/BackButton';
import ProgressBar, { tickCount } from '@/components/ProgressBar';

// ── Retratos y terreno (B&N) ─────────────────────────────────────────────
import heroPortada from '@/assets/maia/hero-portada.jpg';
import manosManuela from '@/assets/maia/manos-manuela-telefono.jpg';
import retratoUsuaria05 from '@/assets/maia/retrato-usuaria-05.jpg';
import sesionMariaPudahuel from '@/assets/maia/sesion-maria-pudahuel.jpg';
import cierreAcompanamiento from '@/assets/maia/cierre-acompanamiento.jpg';
// ── Diagramas ────────────────────────────────────────────────────────────
import brechaDigital from '@/assets/maia/brecha-digital.jpg';
import mapaEtnografico from '@/assets/maia/mapa-etnografico.jpg';
import sweller from '@/assets/maia/sweller-carga-cognitiva.jpg';
import chc from '@/assets/maia/chc-inteligencia.jpg';
import flujoComunidad from '@/assets/maia/flujo-comunidad.png';
import flujoSesionProtocolo from '@/assets/maia/flujo-sesion-protocolo.png';
import flujoHito01 from '@/assets/maia/flujo-hito-01.png';
import flujoHito02 from '@/assets/maia/flujo-hito-02.png';
import flujoHito03 from '@/assets/maia/flujo-hito-03.png';
import flujoHito04 from '@/assets/maia/flujo-hito-04.png';
import flujoHito05 from '@/assets/maia/flujo-hito-05.png';
import flujoErrorTarea from '@/assets/maia/flujo-error-tarea.png';
// ── Sistema MAIA ─────────────────────────────────────────────────────────
import testeoFormulario from '@/assets/maia/testeo-formulario-respuesta.jpg';
import testeoEvaluador from '@/assets/maia/testeo-evaluador-registro.jpg';
import testeoContexto from '@/assets/maia/testeo-contexto-terreno.jpg';
import screensAsistente from '@/assets/maia/screens-asistente-abstracto.png';
import screensZonaError from '@/assets/maia/screens-zona-error.png';
// ── Soporte físico — fotos del prototipo real ─────────────────────────────

/**
 * MaiaCaseStudy — case study dedicado de MAIA (memoria de título · 2026-09-22).
 *
 * REESTRUCTURADO 2026-09-22: la versión anterior (11 stages) incluía una
 * bitácora completa de las 5 exploraciones proyectuales y un benchmark de
 * referentes que no forman parte de la narrativa con la que Matías defendió
 * la memoria. Esta versión (9 stages) se reconstruye a partir de la
 * presentación de defensa (MAIA.pptx, 28 slides) y prioriza lo que el case
 * study necesita demostrar: investigación etnográfica y bibliográfica de
 * alto nivel, testeo sistemático en terreno, y diseño participativo — no
 * una crónica de prototipos descartados. Las exploraciones quedan
 * comprimidas a una sola mención (Stage 05) y los referentes se eliminaron.
 *
 * Sigue el patrón editorial de Edubig: hook + pull-quote lateral, figuras
 * enmarcadas (borde asimétrico 1/4/4/1), regla "Sigue" removida por pedido
 * del usuario (redundante). IDENTIDAD DEL PORTAFOLIO: NavBar (la pone App),
 * BackButton "Volver al listado", ProgressBar vertical del portafolio en
 * la izquierda, indent `pl-[188px]` en el main — mismo sistema que Edubig,
 * Enorme, Tuxpan, Sitemap INE. Fuentes oficiales IBM Plex Mono/Sans
 * (nombres registrados en src/index.css). Todo el CSS propio bajo `.mm`.
 *
 * Paleta del case study (matches el libro de la memoria): cremita #fafaf7,
 * navy #003366, verde #00695c, naranja #d84315. El chip verde de categoría
 * UX-UI #5f8f5f solo aparece en el topbar (identidad del portafolio).
 */

const CSS = `
.mm {
  --mm-cream:#fafaf7; --mm-navy:#003366; --mm-green:#00695c;
  --mm-orange:#d84315; --mm-ink:#1a1a1a; --mm-rule:#dcdbd5;
  --mm-mute:#57574f; --mm-accent:#d84315;
  --fw: 1px 4px 4px 1px;
  --f-mono: 'IBM Plex Mono:Regular','IBM Plex Mono',ui-monospace,monospace;
  --f-mono-m: 'IBM Plex Mono:Medium','IBM Plex Mono',ui-monospace,monospace;
  --f-sans: 'IBM Plex Sans:Regular','IBM Plex Sans',system-ui,sans-serif;
  --f-sans-i: 'IBM Plex Sans:Italic','IBM Plex Sans',system-ui,sans-serif;
  background: var(--mm-cream); color: var(--mm-ink);
  font-family: var(--f-sans); -webkit-font-smoothing: antialiased;
  text-wrap: pretty; min-height: 100vh;
}
.mm *, .mm *::before, .mm *::after { box-sizing: border-box; }
.mm a { color: var(--mm-navy); text-decoration: none; }
.mm a:hover { color: var(--mm-orange); }

/* Content wrapper — mismo patrón que Edubig (padding 188px izq. para la regla vertical) */
.mm .mm-content { max-width: 1320px; margin: 0 auto; padding: 32px 80px 96px 188px; }
.mm .mm-main { min-width: 0; }

/* Topbar del portafolio + chip UX-UI */
.mm .mm-topbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 20px; margin-bottom: 36px; flex-wrap: wrap;
}
.mm .mm-chip {
  font: 500 10.5px/1 var(--f-mono-m); letter-spacing: .14em;
  text-transform: uppercase; color: #fff; background: #5f8f5f;
  padding: 6px 11px; border-radius: 999px;
}

/* Hero */
.mm .mm-hero { padding: 64px 0 0; }
.mm .mm-hero-eyebrow {
  margin: 0; font: 500 10.5px/1 var(--f-mono-m); letter-spacing: .2em;
  text-transform: uppercase; color: var(--mm-accent);
}
.mm .mm-hero-title {
  margin: 18px 0 0; font: 500 clamp(46px,8vw,104px)/0.95 var(--f-mono-m);
  letter-spacing: -.02em; color: var(--mm-navy);
}
.mm .mm-hero-sub {
  margin: 20px 0 0; max-width: 52ch;
  font: 400 clamp(17px,2vw,21px)/1.5 var(--f-sans); color: var(--mm-ink);
}
.mm .mm-hero-meta-line {
  margin: 14px 0 0; max-width: 62ch;
  font: 400 14px/1.6 var(--f-sans); color: var(--mm-mute);
}

/* Frame — figura enmarcada 1/4/4/1 sobre blanco */
.mm .mm-figure { margin: 44px 0 0; }
.mm .mm-frame {
  border-style: solid; border-color: var(--mm-ink);
  border-width: var(--fw); background: #fff; padding: 7px;
}
.mm .mm-frame.thin { border-width: 1px; padding: 4px; }
.mm .mm-frame.thin-6 { border-width: 1px; padding: 6px; }
.mm .mm-frame img { display: block; width: 100%; height: auto; }
.mm .mm-frame-cover { aspect-ratio: 16/9; overflow: hidden; background: var(--mm-cream); }
.mm .mm-frame-cover img { width: 100%; height: 100%; object-fit: contain; object-position: center; }
.mm figcaption {
  margin: 10px 0 0; font: 400 11.5px/1.5 var(--f-mono); color: var(--mm-mute);
  max-width: 74ch;
}
.mm figcaption.tight { margin: 9px 0 0; font-size: 11px; }

/* Meta grid */
.mm .mm-meta {
  margin: 52px 0 0; display: grid;
  grid-template-columns: repeat(auto-fit,minmax(210px,1fr));
  gap: 26px 32px; border-top: 1px solid var(--mm-navy); padding-top: 26px;
}
.mm .mm-meta dt {
  font: 500 9.5px/1 var(--f-mono-m); letter-spacing: .16em;
  text-transform: uppercase; color: var(--mm-mute);
}
.mm .mm-meta dd { margin: 8px 0 0; font: 400 14px/1.5 var(--f-sans); }

/* Brief (Encargo/Desafío/Objetivo) */
.mm .mm-brief {
  margin: 56px 0 0; display: grid;
  grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
  gap: 32px; border-top: 1px solid var(--mm-rule); padding-top: 30px;
}
.mm .mm-brief h3 {
  margin: 0; font: 500 11px/1 var(--f-mono-m); letter-spacing: .16em;
  text-transform: uppercase; color: var(--mm-accent);
}
.mm .mm-brief p { margin: 14px 0 0; font: 400 14.5px/1.65 var(--f-sans); color: var(--mm-ink); }
.mm .mm-brief em { font-family: var(--f-sans-i); }

/* Stage head */
.mm .mm-stage { scroll-margin-top: 84px; padding: 72px 0 0; }
.mm .mm-stagehead {
  border-top: 1px solid var(--mm-navy); padding-top: 14px;
  display: flex; justify-content: space-between; align-items: baseline; gap: 24px;
}
.mm .mm-stagehead .stage-label {
  font: 500 10.5px/1 var(--f-mono-m); letter-spacing: .18em;
  text-transform: uppercase; color: var(--mm-accent);
}
.mm .mm-stagehead .stage-count {
  font: 400 10.5px/1 var(--f-mono); letter-spacing: .1em; color: var(--mm-mute);
}
.mm .mm-stage h2 {
  margin: 16px 0 0; font: 500 clamp(26px,3.4vw,40px)/1.15 var(--f-mono-m);
  letter-spacing: -.01em; color: var(--mm-navy);
}
.mm .mm-stage h3 { margin: 12px 0 0; font: 500 22px/1.2 var(--f-mono-m); color: var(--mm-navy); }
.mm .mm-stage h4 { margin: 0; font: 500 16px/1.3 var(--f-mono-m); color: var(--mm-navy); }

/* Two-col hook + quote */
.mm .mm-two {
  margin: 32px 0 0; display: grid;
  grid-template-columns: minmax(0,1.1fr) minmax(0,.9fr);
  gap: 44px; align-items: start;
}
.mm .mm-hook {
  margin: 0; font: 400 clamp(19px,2.3vw,25px)/1.35 var(--f-sans); color: var(--mm-ink);
  max-width: 90%;
}
.mm .mm-quote {
  margin: 0; border-left: 3px solid var(--mm-accent); padding-left: 20px;
}
.mm .mm-quote p {
  margin: 0; font-family: var(--f-sans-i); font-weight: 400;
  font-size: 15.5px; line-height: 1.6; color: var(--mm-ink);
}
.mm .mm-quote cite {
  display: block; margin: 10px 0 0; font: 400 10.5px/1.4 var(--f-mono);
  letter-spacing: .1em; text-transform: uppercase; color: var(--mm-mute);
  font-style: normal;
}

/* Cuerpo */
.mm .mm-body { margin: 30px 0 0; max-width: 66ch; }
.mm .mm-body p { margin: 0; font: 400 15.5px/1.7 var(--f-sans); }
.mm .mm-body p + p { margin-top: 14px; }
.mm .mm-body strong { font-weight: 600; }
.mm .mm-body em { font-family: var(--f-sans-i); }

/* Triptych 2col */
.mm .mm-triptych { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px; align-items: start; }
.mm .mm-triptych.wide { grid-template-columns: minmax(0,1.3fr) minmax(0,1fr); }
.mm .mm-triptych.g3 { grid-template-columns: repeat(3,minmax(0,1fr)); }

/* Render en video del soporte + fila simétrica de fotos reales (Stage 05) */
.mm .mm-render-video { margin: 32px 0 0; }
.mm .mm-render-video .mm-videoframe {
  border-style: solid; border-color: var(--mm-ink); border-width: var(--fw);
  background: #0f0f0e; overflow: hidden; line-height: 0;
}
.mm .mm-render-video video { display: block; width: 100%; height: auto; }


/* App screens */
.mm .mm-appscreens {
  margin: 26px 0 0; display: grid;
  grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 18px;
}

/* Cuatro celdas de cierre */
.mm .mm-quad {
  margin: 32px 0 0; display: grid;
  grid-template-columns: repeat(auto-fit,minmax(250px,1fr));
  gap: 1px; background: var(--mm-rule); border: 1px solid var(--mm-rule);
}
.mm .mm-quad-cell { background: var(--mm-cream); padding: 22px; }
.mm .mm-quad-cell h4 { margin: 0; font: 500 15px/1.3 var(--f-mono-m); color: var(--mm-navy); }
.mm .mm-quad-cell p { margin: 10px 0 0; font: 400 14px/1.6 var(--f-sans); }

/* Matriz de sistematizacion y decisiones de diseno (Stage 07) */
.mm .mm-matrix {
  margin: 32px 0 0; display: flex; flex-direction: column;
  gap: 1px; background: var(--mm-rule); border: 1px solid var(--mm-rule);
}
.mm .mm-matrix-row { background: var(--mm-cream); padding: 24px 26px; }
.mm .mm-matrix-head {
  display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap;
  margin: 0 0 22px;
}
.mm .mm-matrix-head .n { font: 500 13px/1 var(--f-mono-m); color: var(--mm-mute); }
.mm .mm-matrix-head h4 { margin: 0; font: 600 16.5px/1.3 var(--f-sans); color: var(--mm-navy); }
.mm .mm-matrix-head .tag {
  font: 400 11.5px/1 var(--f-mono-m); color: var(--mm-mute);
  border: 1px solid var(--mm-rule); padding: 3px 8px; border-radius: 999px;
}
.mm .mm-matrix-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 22px; }
.mm .mm-matrix-cell .lbl {
  display: block; margin: 0 0 6px; font: 500 10.5px/1 var(--f-mono-m);
  letter-spacing: .06em; text-transform: uppercase; color: var(--mm-mute);
}
.mm .mm-matrix-cell p { margin: 0; font: 400 13.5px/1.6 var(--f-sans); }
.mm .mm-matrix-cell.decision { padding-left: 14px; border-left: 2px solid var(--mm-navy); }
.mm .mm-matrix-cell.decision .lbl { color: var(--mm-navy); }
.mm .mm-matrix-cell.decision p { font-weight: 500; }

/* Semaforo */
.mm .mm-sem {
  margin: 20px 0 0; display: grid;
  grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px;
}
.mm .mm-sem-cell { border: 1px solid var(--mm-rule); padding: 14px; }
.mm .mm-sem-dot { display: block; width: 12px; height: 12px; border-radius: 999px; }
.mm .mm-sem-cell .lbl {
  display: block; margin-top: 10px; font: 500 12px/1.2 var(--f-mono-m); color: var(--mm-navy);
}
.mm .mm-sem-cell .val { display: block; margin-top: 4px; font: 400 13px/1.4 var(--f-sans); }

/* Honesty box */
.mm .mm-honesty { margin: 36px 0 0; border: 1px solid var(--mm-navy); padding: 26px; }
.mm .mm-honesty-eyebrow {
  font: 500 10px/1 var(--f-mono-m); letter-spacing: .16em;
  text-transform: uppercase; color: var(--mm-navy);
}

/* Fading list (5 hitos) */
.mm .mm-fading {
  margin: 28px 0 0; padding: 0; list-style: none;
  border-top: 1px solid var(--mm-rule);
}
.mm .mm-fading li {
  display: grid; grid-template-columns: 34px minmax(0,1fr);
  gap: 18px; border-bottom: 1px solid var(--mm-rule); padding: 20px 0;
}
.mm .mm-fading .fn { font: 500 13px/1.4 var(--f-mono-m); color: var(--mm-mute); }
.mm .mm-fading .fn.done { color: var(--mm-green); }
.mm .mm-fading p { margin: 7px 0 0; font: 400 14px/1.6 var(--f-sans); max-width: 60ch; }
.mm .mm-fbar { margin: 12px 0 0; display: flex; height: 6px; background: var(--mm-rule); }
.mm .mm-fbar > span { display: block; height: 100%; }
.mm .mm-fbar .a { background: var(--mm-navy); }
.mm .mm-fbar .c { background: var(--mm-green); }
.mm .mm-flegend {
  margin: 6px 0 0; display: flex; justify-content: space-between;
  font: 400 9.5px/1 var(--f-mono); letter-spacing: .08em;
  text-transform: uppercase; color: var(--mm-mute);
}

/* Sub-block dentro de una stage */
.mm .mm-subblock {
  margin: 24px 0 0; border-left: 3px solid var(--mm-rule); padding-left: 20px; max-width: 64ch;
}
.mm .mm-subblock .eyebrow {
  font: 500 10px/1 var(--f-mono-m); letter-spacing: .16em;
  text-transform: uppercase; color: var(--mm-mute);
}
.mm .mm-subblock h4 { margin-top: 10px; }
.mm .mm-subblock p { margin: 8px 0 0; font: 400 14.5px/1.65 var(--f-sans); }
.mm .mm-subblock p + p { margin-top: 8px; }

.mm .mm-eyebrow-green {
  font: 500 10.5px/1 var(--f-mono-m); letter-spacing: .16em;
  text-transform: uppercase; color: var(--mm-green);
}

/* Footer del case study */
.mm .mm-footer {
  margin: 80px 0 0; border-top: 1px solid var(--mm-navy);
  padding: 28px 0 90px; display: flex; flex-wrap: wrap; gap: 20px;
  justify-content: space-between; align-items: baseline;
}
.mm .mm-footer .fend {
  font: 500 11px/1 var(--f-mono-m); letter-spacing: .14em;
  text-transform: uppercase; color: var(--mm-mute);
}
.mm .mm-footer .fend + p {
  margin: 10px 0 0; font: 400 14px/1.6 var(--f-sans); max-width: 56ch;
}

/* Responsive */
@media (max-width: 1080px) {
  .mm .mm-content { padding: 24px 20px 60px; }
}
@media (max-width: 880px) {
  .mm .mm-two { grid-template-columns: minmax(0,1fr) !important; gap: 20px !important; }
  .mm .mm-triptych, .mm .mm-triptych.wide, .mm .mm-triptych.g3 { grid-template-columns: minmax(0,1fr) !important; }
  .mm .mm-hook { max-width: 100%; }
  .mm .mm-quote { border-left-width: 2px !important; }
  .mm .mm-matrix-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px; }
  .mm .mm-fading li { grid-template-columns: 28px minmax(0,1fr); gap: 14px; }
}
@media (max-width: 640px) {
  .mm .mm-content { padding: 20px 16px 48px; }
  .mm .mm-hero { padding: 40px 0 0; }
  .mm .mm-meta, .mm .mm-quad, .mm .mm-brief, .mm .mm-sem { grid-template-columns: minmax(0,1fr) !important; }
  .mm .mm-appscreens { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .mm .mm-matrix-row { padding: 20px; }
  .mm .mm-matrix-grid { grid-template-columns: minmax(0,1fr); gap: 16px; }
  .mm .mm-subblock { padding-left: 16px; }
  .mm .mm-honesty { padding: 20px; }
  .mm .mm-fading li { grid-template-columns: 24px minmax(0,1fr); gap: 10px; padding: 16px 0; }
  .mm .mm-fading .fn { font-size: 12px; }
  .mm .mm-body { max-width: 100%; }
  .mm .mm-stagehead { gap: 12px; }
  .mm figcaption { font-size: 10.5px; }
  .mm .mm-footer { margin-top: 48px; }
  .mm .mm-stage h2 { font-size: clamp(22px,6vw,32px); }
}
@media (max-width: 480px) {
  .mm .mm-hero-title { font-size: clamp(40px,12vw,64px); }
  .mm .mm-stage { padding-top: 48px; }
  .mm .mm-figure { margin: 28px 0 0; }
  .mm .mm-appscreens { grid-template-columns: minmax(0,1fr); }
  .mm .mm-subblock { padding-left: 12px; border-left-width: 2px; }
  .mm .mm-honesty { padding: 16px; }
  .mm .mm-fading li { padding: 14px 0; }
  .mm .mm-frame { padding: 5px; }
  .mm .mm-footer { padding: 20px 0 48px; }
  .mm .mm-quad-cell { padding: 18px; }
  .mm .mm-matrix-head { margin-bottom: 16px; }
  .mm .mm-matrix-row { padding: 16px; }
}
`;

// ── Datos: Matriz de sistematización y decisiones de diseño (Stage 07) ───
const MATRIZ_TESTEO = [
  {
    n: '01', dim: 'Valor del soporte físico', tag: 'concepto "refugio"',
    evidencia: '9 de 10 usuarios prefirieron la Opción B (solo tablet + soporte pequeño) en el escenario hipotético de poder tenerlo. 7 de 9 mostraron indiferencia total hacia la estructura de madera durante el uso.',
    observacion: 'Los usuarios centraron su atención exclusivamente en la pantalla. La madera no fue utilizada como apoyo corporal ni generó la sensación de "refugio" esperada (solo una persona se apoyó, y declaró estar muy enferma y cansada).',
    inferencia: 'La estructura envolvente actual no constituye un "refugio" para el usuario; se percibe como un elemento accesorio que no aporta valor funcional ni emocional. El verdadero valor está en la interacción, no en el mueble.',
    decision: 'Pivote de diseño industrial: eliminar el mueble de gran formato y diseñar un soporte de mesa ergonómico y minimalista, portátil para espacios comunitarios, que mantenga las propiedades anti-ansiedad y táctiles de la madera sin ser invasivo.',
  },
  {
    n: '02', dim: 'Rol del asistente virtual', tag: 'confianza',
    evidencia: '6 de 9 usuarios esperaron instrucciones de la app ante un error o duda, en vez de mirar al evaluador. 6 de 9 pasaron de "ansiedad alta" a "me atrevería" en el post-test.',
    observacion: 'Conexión emocional positiva (sonrisas, asentimientos): el usuario valida a la "voz" como su tutor. Sin embargo, 3 usuarios interrumpieron al asistente antes de que terminara de hablar.',
    inferencia: 'El refugio es psicológico y reside en el asistente virtual — la ansiedad disminuye por el acompañamiento de voz. La interrupción indica que los diálogos pueden ser muy largos para la paciencia del usuario.',
    decision: 'Mejora de UX writing: sintetizar los guiones del asistente (más concretos y directos), manteniendo el tono empático ya validado como exitoso.',
  },
  {
    n: '03', dim: 'Gestión del error y navegación', tag: '',
    evidencia: 'Observación crítica: los toques erróneos ocurren en cualquier parte de la pantalla, no solo sobre botones desactivados.',
    observacion: 'Los usuarios intentan interactuar con elementos no activos o con el fondo. La falta de feedback en esas zonas genera incertidumbre momentánea.',
    inferencia: 'El sistema es rígido ante el error imprevisto — el usuario necesita contención inmediata cuando se desvía del "camino feliz" para no frustrarse.',
    decision: 'Nueva funcionalidad: la Zona de Error Universal, una capa transparente sobre toda la interfaz que, ante cualquier toque erróneo, activa una respuesta amable del asistente reorientando al botón correcto.',
  },
  {
    n: '04', dim: 'Accesibilidad y límites del sistema', tag: '',
    evidencia: 'Puntajes polarizados en legibilidad y audio: los usuarios con discapacidad severa (visión/audición) evaluaron con nota 1 o 2.',
    observacion: 'Un usuario no pudo interactuar por barrera física; otros se acercaban mucho a la pantalla o al parlante.',
    inferencia: 'MAIA tiene límites claros frente a un deterioro cognitivo o sensorial severo. La experiencia auditiva del parlante de la tablet es insuficiente en entornos comunitarios con ruido ambiente.',
    decision: 'Integración de hardware: incorporar audífonos de cintillo (over-ear) al kit para aislamiento y mejora auditiva, más un aumento de contraste y tamaño en los indicadores visuales clave.',
  },
  {
    n: '05', dim: 'Permanencia y continuidad', tag: 'phygital',
    evidencia: '3 usuarios mencionaron explícitamente la seguridad digital como un tema de interés o preocupación.',
    observacion: 'La experiencia con la app es efímera: al apagarse la tablet, el usuario se queda sin nada en las manos — crítica levantada por uno de los evaluadores durante el testeo.',
    inferencia: 'Existe una necesidad latente de conservar el conocimiento, sobre todo en seguridad digital: el usuario requiere un objeto físico que dé permanencia a lo aprendido y sirva de consulta posterior.',
    decision: 'Nuevo elemento físico: diseñar el folleto de seguridad digital, que reemplaza al mueble como el componente tangible del sistema y aporta continuidad real a la experiencia.',
  },
];

// ── Datos: 5 hitos de delegación (Stage 08) ──────────────────────────────
const HITOS = [
  { n: '01', t: 'Sesión de Modelado Inmersivo',
    d: 'El autor facilita la sesión completa como referente empírico: la comunidad observa el método en uso real.',
    autor: 100, comu: 0, done: false },
  { n: '02', t: 'Inducción Metodológica',
    d: 'Traspaso del método al líder comunitario con el Manual de Gestión Territorial como soporte.',
    autor: 75, comu: 25, done: false },
  { n: '03', t: 'Co-facilitación Mediada',
    d: 'El líder asume la contención emocional del grupo; el autor supervisa solo lo técnico.',
    autor: 50, comu: 50, done: false },
  { n: '04', t: 'Delegación Supervisada',
    d: 'El líder dirige la sesión completa; el autor observa y registra métricas sin intervenir.',
    autor: 25, comu: 75, done: false },
  { n: '05', t: 'Operación Autónoma',
    d: 'La comunidad enseña a la comunidad. El andamiaje se retira por completo y MAIA queda como puente temporal hacia el uso de dispositivos comerciales, no como una nueva dependencia.',
    autor: 0, comu: 100, done: true },
];

// ── Datos: diagramas de flujo por hito (Stage 08 · detalle operativo) ────
const HITO_FLUJOS = [
  { n: '01', fig: '08e', t: 'Sesión de Modelado Inmersivo', src: flujoHito01,
    alt: 'Diagrama de flujo del Hito 01: primera sesión dirigida por el autor, entrega del manual de delegación y proceso de delegación.' },
  { n: '02', fig: '08f', t: 'Inducción Metodológica', src: flujoHito02,
    alt: 'Diagrama de flujo del Hito 02: capacitación del autor al monitor delegado en protocolo de instalación, guía afectiva, tablero de medición y entrega del folleto.' },
  { n: '03', fig: '08g', t: 'Co-facilitación Mediada', src: flujoHito03,
    alt: 'Diagrama de flujo del Hito 03: sesión en conjunto que bifurca según si actúa el autor (aspectos técnicos) o el delegado (contención emocional).' },
  { n: '04', fig: '08h', t: 'Delegación Supervisada', src: flujoHito04,
    alt: 'Diagrama de flujo del Hito 04: sesión dirigida casi en su totalidad por el delegado, con el autor en observación no participante.' },
  { n: '05', fig: '08i', t: 'Operación Autónoma', src: flujoHito05,
    alt: 'Diagrama de flujo del Hito 05: implementación autónoma del kit, interacción y acompañamiento con registro de métricas, y entrega del folleto de seguridad digital.' },
];

type Props = { onBack: () => void };

export default function MaiaCaseStudy({ onBack }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const folletoVideoRef = useRef<HTMLVideoElement>(null);

  // El render lleva audio (la voz de MAIA guiando al usuario), así que no
  // puede autoplayearse silenciado: el navegador bloquea el autoplay con
  // sonido sin gesto del usuario. Solo pausamos al salir del viewport.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) v.pause();
        });
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // Autoplay del render del folleto al entrar en viewport, silenciado —
  // este clip no lleva audio relevante, así que sí puede autoplayearse.
  useEffect(() => {
    const v = folletoVideoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // ── Scroll progress para la ProgressBar del portafolio ────────────────
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSeek = (p: number) => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: h * p, behavior: 'smooth' });
  };

  return (
    <div ref={rootRef} className="mm">
      <style>{CSS}</style>

      {/* Regla vertical — misma navegación que el resto de los proyectos */}
      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center max-[1080px]:hidden"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical ticks={tickCount(9)} />
      </div>

      <div ref={rootRef} className="mm-content">
        <div className="mm-topbar">
          <BackButton onClick={onBack} label="Volver al listado" />
          <span className="mm-chip">UX-UI</span>
        </div>
        <main className="mm-main">

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <section className="mm-hero">
            <p className="mm-hero-eyebrow">Memoria de título · 2025–2026</p>
            <h1 className="mm-hero-title">MAIA</h1>
            <p className="mm-hero-sub">
              Sistema de alfabetización digital para adultos mayores con analfabetismo funcional
              digital y ansiedad tecnológica, en el poniente de Santiago.
            </p>
            <p className="mm-hero-meta-line">
              Exclusión tecnológica — Desafíos para la inclusión de los adultos mayores con
              analfabetismo funcional en el uso de las TIC. Escuela de Diseño FaAAD, Universidad
              Diego Portales.
            </p>

            <figure className="mm-figure">
              <div className="mm-frame mm-frame-cover">
                <img src={heroPortada} alt="Portada del proyecto MAIA — collage etnográfico con tratamiento navy sobre las usuarias del proyecto." />
              </div>
              <figcaption>Fig. 00 · Portada MAIA — usuarias del testeo etnográfico en Pudahuel y Cerro Navia. Archivo del autor.</figcaption>
            </figure>

            <dl className="mm-meta">
              <div><dt>Categoría</dt><dd>UX-UI</dd></div>
              <div><dt>Rol</dt><dd>Diseñador · Investigador · Autor de la memoria</dd></div>
              <div><dt>Contexto</dt><dd>Memoria de título · Escuela de Diseño FaAAD UDP</dd></div>
              <div><dt>Guías</dt><dd>Sergio Majluf · Simón Gallardo</dd></div>
              <div><dt>Duración</dt><dd>2 semestres (2025–2026)</dd></div>
              <div><dt>Herramientas</dt><dd>Figma, Google AI Studio, observación etnográfica participativa, prototipado en madera y cartón</dd></div>
              <div><dt>Territorios</dt><dd>Pudahuel, Cerro Navia, Lo Prado — poniente de la Región Metropolitana, Chile</dd></div>
              <div><dt>Colaboración territorial</dt><dd>Junta “Las Dorcas” — Iglesia en Cerro Navia</dd></div>
            </dl>

            <div className="mm-brief">
              <div>
                <h3>Encargo</h3>
                <p>Memoria de título de Diseño en la Facultad de Arquitectura, Arte y Diseño de la Universidad Diego Portales.</p>
              </div>
              <div>
                <h3>Desafío</h3>
                <p>La exclusión digital en la cuarta edad no se explica por acceso: Chile tiene alta cobertura de internet y dispositivos. El problema es la <em>calidad del uso</em>. La brecha ya no es territorial, es generacional y cognitiva.</p>
              </div>
              <div>
                <h3>Objetivo</h3>
                <p>Desarrollar un sistema de andamiaje cognitivo y aprendizaje protegido, adaptado a los modelos mentales de adultos mayores con analfabetismo funcional digital y ansiedad tecnológica en sectores vulnerables del poniente de Santiago.</p>
              </div>
            </div>
          </section>

          {/* ── Stage 01 · El problema ─────────────────────────────────── */}
          <section className="mm-stage" id="stage-01">
            <div className="mm-stagehead">
              <span className="stage-label">Stage 01</span>
              <span className="stage-count">01 / 09</span>
            </div>
            <h2>La exclusión invisible</h2>
            <div className="mm-two">
              <p className="mm-hook">La brecha digital en la cuarta edad no es un problema de conexión. Es un problema de sentido.</p>
              <blockquote className="mm-quote">
                <p>“Casi 6 de cada 10 hogares desconectados en Chile están liderados por una persona mayor de 60 años.”</p>
                <cite>Biblioteca del Congreso Nacional, 2024</cite>
              </blockquote>
            </div>
            <div className="mm-body">
              <p>Hoy la ciudadanía se ejerce a través de las pantallas, y ese proceso de digitalización de la sociedad ha generado una exclusión digital específica en los adultos mayores. Cabrero y Ruiz-Palmero (2018) proponen entender la brecha digital en tres niveles —acceso, uso y calidad de uso— y no como un fenómeno único. Chile ya resolvió en gran parte el primero: según Subtel (2024), el 96,5 % del país tiene acceso a internet.</p>
              <p>Lo que persiste bajo la superficie es el <strong>analfabetismo digital funcional</strong>: la persona puede manipular las TIC —tocar la pantalla, abrir una app— pero no comprende la lógica procedimental que hay detrás de la interfaz. Es distinto del analfabetismo digital básico (incapacidad prácticamente total de uso) y concentra su mayor severidad en el poniente de Santiago: Pudahuel, Cerro Navia y Lo Prado.</p>
            </div>
            <figure className="mm-figure">
              <div className="mm-frame">
                <img src={brechaDigital} alt="Brecha digital en tres niveles: 96,5 % de Chile tiene acceso a internet, pero uso y calidad de uso permanecen bajo la superficie del iceberg." />
              </div>
              <figcaption>Fig. 01 · Brecha digital en tres niveles. Datos: Subtel (2024) · Cabrero y Ruiz-Palmero (2018). Elaboración propia.</figcaption>
            </figure>
          </section>

          {/* ── Stage 02 · Metodología etnográfica ─────────────────────── */}
          <section className="mm-stage" id="stage-02">
            <div className="mm-stagehead"><span className="stage-label">Stage 02</span><span className="stage-count">02 / 09</span></div>
            <h2>Metodología etnográfica — descender a la biografía</h2>
            <div className="mm-two">
              <p className="mm-hook">Visibilizar la experiencia cotidiana del analfabetismo digital funcional, no solo medirla.</p>
              <blockquote className="mm-quote">
                <p>“El obstáculo no está en la alfabetización básica, sino en la comprensión funcional del entorno digital.”</p>
                <cite>Reflexión sobre Pedro (68), intentando activar permisos en su teléfono</cite>
              </blockquote>
            </div>
            <div className="mm-body">
              <p>Metodología autoetnográfica (Chang, 2008; Ellis, Adams &amp; Bochner, 2011), con el objetivo declarado de visibilizar las experiencias cotidianas del analfabetismo digital funcional para generar conocimiento cualitativo. Observación participativa de <strong>María (66, madre)</strong>, <strong>Pedro (68, padre)</strong> y <strong>Manuela (83, abuela)</strong>, triangulando diarios de campo, entrevistas semi-estructuradas y registro audiovisual.</p>
              <p>Marco ético: uso de nombres reales con consentimiento explícito. La cercanía como valor y como riesgo — reflexividad explícita para evitar la autoindulgencia del investigador.</p>
            </div>
            <div className="mm-triptych" style={{ marginTop: 32 }}>
              <figure>
                <div className="mm-frame">
                  <img src={sesionMariaPudahuel} alt="Sesión etnográfica: una mujer mayor le muestra a un hombre mayor cómo usar el teléfono en el living de su casa, foto B&N." />
                </div>
                <figcaption>Fig. 02a · Sesión etnográfica en casa — el aprendizaje mediado por un par, no por un manual. Archivo del autor.</figcaption>
              </figure>
              <figure>
                <div className="mm-frame">
                  <img src={manosManuela} alt="Detalle de manos ancianas sosteniendo un celular con la app Caja Vecina en pantalla, foto B&N cerrada." />
                </div>
                <figcaption>Fig. 02b · Manos sobre la interfaz cotidiana — Caja Vecina como frontera entre lo posible y lo comprensible. Archivo del autor.</figcaption>
              </figure>
            </div>

            <h3 style={{ marginTop: 40 }}>De la biografía a los tres ejes</h3>
            <blockquote className="mm-quote" style={{ marginTop: 18, maxWidth: '66ch' }}>
              <p>“Porque somos tontos y tenemos que depender de otras personas.”</p>
              <cite>María, tras no poder resolver un problema con una máquina de su negocio</cite>
            </blockquote>
            <div className="mm-body">
              <p>Análisis inductivo de los testimonios recopilados: del cruce entre evidencia bruta y patrones de conducta emergen tres ejes conceptuales que estructuran el resto del proyecto — <strong>Comprensión Fragmentada</strong> (confusión ante interfaces no adaptadas), <strong>Dependencia Dolorosa</strong> (pedir ayuda constante erosiona la autoestima) y <strong>Necesidad de Autonomía</strong> (existe una voluntad latente de aprender, no un rechazo).</p>
            </div>
            <figure className="mm-figure">
              <div className="mm-frame">
                <img src={mapaEtnografico} alt="Mapa de Significados y Categorización: testimonios crudos → patrones → tres ejes." />
              </div>
              <figcaption>Fig. 02c · Mapa de Significados y Categorización. De la evidencia bruta a los tres ejes del problema. Elaboración propia.</figcaption>
            </figure>
          </section>

          {/* ── Stage 03 · Fundamento teórico ──────────────────────────── */}
          <section className="mm-stage" id="stage-03">
            <div className="mm-stagehead"><span className="stage-label">Stage 03</span><span className="stage-count">03 / 09</span></div>
            <h2>La ansiedad tecnológica no es una anécdota</h2>
            <div className="mm-two">
              <p className="mm-hook">La parálisis no es aptitud. Es indefensión aprendida.</p>
              <blockquote className="mm-quote">
                <p>“El usuario asume que la dificultad radica en su propia incapacidad y no en la complejidad del sistema.”</p>
                <cite>Aplicación de Seligman, 1975, al contexto digital</cite>
              </blockquote>
            </div>
            <div className="mm-body">
              <p>Marco teórico. Ansiedad computacional (Brosnan, 1998), carga cognitiva intrínseca vs. extrínseca (Sweller, 1988), indefensión aprendida (Seligman, 1975), autoeficacia percibida (Bandura, 1997) e inteligencia cristalizada vs. fluida (Cattell-Horn-Carroll). El ciclo de indefensión —acción, fallo, culpa— explica por qué un usuario se retira de una tarea digital antes de intentarla de nuevo.</p>
              <p>El paradigma de la Neurodiversidad (Walker, 2014) aplicado a la vejez: no es un déficit a curar, es una variación cognitiva que el entorno debe acomodar. De aquí se define el <em>vacío de implementación</em>: el desajuste entre la arquitectura de la información de los servicios actuales y la arquitectura neurobiológica del adulto mayor.</p>
            </div>
            <div className="mm-triptych" style={{ marginTop: 44 }}>
              <figure>
                <div className="mm-frame">
                  <img src={sweller} alt="Diagrama de la teoría de Sweller: interfaces saturadas exceden la memoria de trabajo y bloquean el aprendizaje." />
                </div>
                <figcaption>Fig. 03a · Teoría de la carga cognitiva (Sweller, 1988) — el aprendizaje falla cuando la demanda de la memoria de trabajo supera la capacidad de procesamiento. Elaboración propia.</figcaption>
              </figure>
              <figure>
                <div className="mm-frame">
                  <img src={chc} alt="Gráfico de la teoría Cattell-Horn-Carroll: la inteligencia fluida decae con la edad; la cristalizada se acumula y estabiliza; su cruce es donde emerge la exclusión digital funcional." />
                </div>
                <figcaption>Fig. 03b · Cattell-Horn-Carroll — la exclusión digital funcional emerge en el cruce entre inteligencia fluida en declive e inteligencia cristalizada intacta. Elaboración propia.</figcaption>
              </figure>
            </div>
          </section>

          {/* ── Stage 04 · El usuario ──────────────────────────────────── */}
          <section className="mm-stage" id="stage-04">
            <div className="mm-stagehead"><span className="stage-label">Stage 04</span><span className="stage-count">04 / 09</span></div>
            <h2>El Navegante Condicionado</h2>
            <div className="mm-two">
              <p className="mm-hook">No es “analfabeto digital”. Vive una <em>inclusión condicionada</em>.</p>
              <blockquote className="mm-quote">
                <p>“Adulto mayor 60+ de sectores populares con escolaridad incompleta, dispositivos que subutiliza y una indefensión aprendida que confunde con incapacidad propia.”</p>
                <cite>Arquetipo del usuario objetivo</cite>
              </blockquote>
            </div>
            <div className="mm-body">
              <p>Construcción del perfil objetivo. Demografía (60+, C3/D, Pudahuel · Cerro Navia · Lo Prado), psicografía (tensión entre necesidad y miedo, aprendizaje por dependencia de un “tutor informal”, motivación latente). Posee dispositivos, pero el miedo al “error irreversible” y una dependencia dolorosa erosionan su autonomía — el arquetipo del <strong>Navegante Condicionado</strong> no rechaza la tecnología por desinterés, sino como mecanismo de defensa ante la frustración.</p>
            </div>
            <figure className="mm-figure">
              <div className="mm-frame">
                <img src={retratoUsuaria05} alt="Retrato B&N de una mujer mayor sentada en su casa manejando su teléfono, con el ceño concentrado." />
              </div>
              <figcaption>Fig. 04 · Retrato del Navegante Condicionado — la usuaria concentrada frente a la interfaz, en su propio hogar. Archivo del autor.</figcaption>
            </figure>
          </section>

          {/* ── Stage 05 · El concepto ─────────────────────────────────── */}
          <section className="mm-stage" id="stage-05">
            <div className="mm-stagehead"><span className="stage-label">Stage 05</span><span className="stage-count">05 / 09</span></div>
            <h2>El concepto — andamiaje cognitivo y calma háptica</h2>
            <div className="mm-two">
              <p className="mm-hook">La solución no es enseñar a usar una app. Es construir un ecosistema donde equivocarse no cueste nada.</p>
              <blockquote className="mm-quote">
                <p>“El contacto táctil con madera inhibe el sistema nervioso simpático, actuando como un amortiguador sensorial que reduce la ansiedad antes de la interacción.”</p>
                <cite>Basado en la psicofisiología ambiental de Burnard y Kutnar, 2022</cite>
              </blockquote>
            </div>
            <div className="mm-body">
              <p>MAIA se define como un ecosistema de andamiaje cognitivo para la cuarta edad que combina la <strong>calma háptica de la madera</strong> con una <strong>interfaz empática</strong>, permitiendo que el usuario “aprenda haciendo” sin riesgos reales — apoyado en la inteligencia cristalizada que el Stage 03 identificó como intacta.</p>
              <p>Esta síntesis llegó después de cinco iteraciones de prototipo — de tarjetas NFC sin pantalla a un tutorial en video, a un simulador con voz robótica — cada una descartada por una razón distinta hasta llegar al soporte físico y la app protegida que se describen a continuación. El hallazgo más determinante de ese proceso: un primer soporte tipo mueble fue rechazado por el 77 % de las usuarias testeadas por “innecesariamente grande”, lo que derivó en la mesa portátil de madera natural actual.</p>
            </div>
            <figure className="mm-render-video">
              <div className="mm-videoframe">
                <video ref={videoRef} src="/maia-soporte-render.mp4" poster="/maia-soporte-render-poster.jpg" controls playsInline preload="metadata" />
              </div>
              <figcaption>Fig. 05 · Render del soporte — vista de 360°, con la voz de MAIA guiando al usuario. Con audio. Archivo del autor.</figcaption>
            </figure>

          </section>

          {/* ── Stage 06 · Criterios de diseño ─────────────────────────── */}
          <section className="mm-stage" id="stage-06">
            <div className="mm-stagehead"><span className="stage-label">Stage 06</span><span className="stage-count">06 / 09</span></div>
            <h2>Criterios de diseño</h2>
            <div className="mm-two">
              <p className="mm-hook">Cada decisión de interfaz responde a una cita, no a una convención de UI.</p>
              <blockquote className="mm-quote">
                <p>“Lo que para el sistema es una mejora de seguridad, para el adulto mayor con analfabetismo digital funcional es una barrera de acceso a sus propios recursos.”</p>
                <cite>Sobre la norma 538 de la CMF y la eliminación de la tarjeta de coordenadas</cite>
              </blockquote>
            </div>

            <div className="mm-subblock">
              <span className="eyebrow">Asistente por voz — “la nieta sustituta”</span>
              <p>Según Stigall et al. (2024), el asistente de voz funciona como una herramienta compensatoria que sortea las barreras de la interfaz gráfica tradicional, evitando saturar la memoria de trabajo visual (Sweller) o la motricidad fina. Su identidad sonora es cercana y empática, no técnica: sustituye la ayuda del tutor informal familiar sin la carga emocional de tener que pedirla.</p>
            </div>

            <div className="mm-subblock">
              <span className="eyebrow">Estrategia curricular — qué tareas se enseñan y por qué</span>
              <p><strong>Redes sociales:</strong> la Teoría de la Selectividad Socioemocional (Carstensen) postula que en la vejez las metas se reorientan hacia la gratificación emocional y el mantenimiento de vínculos significativos. No saber usar WhatsApp equivale a un exilio emocional de la propia red de apoyo.</p>
              <p><strong>Banca digital:</strong> la norma 538 de la CMF obliga a las instituciones financieras a implementar autenticación reforzada, eliminando métodos estáticos como la tarjeta de coordenadas. Una mejora de seguridad para el sistema se convierte en una barrera de acceso para el usuario.</p>
            </div>

            <div className="mm-subblock">
              <span className="eyebrow">Simulación e inteligencia cristalizada</span>
              <p><strong>Fractura de la indefensión aprendida:</strong> el entorno simulado elimina el miedo al “error irreversible”, transformando la falla de una catástrofe personal en un hito de aprendizaje. <strong>Andamiaje cognitivo dinámico</strong> (Vygotsky): el sistema actúa como soporte temporal que gestiona la carga cognitiva. <strong>Entrenamiento en invariantes de interacción:</strong> no se busca la memorización visual-estática, sino la decodificación de la lógica procedimental detrás de la arquitectura digital.</p>
            </div>

            <div className="mm-appscreens">
              <figure style={{ margin: 0 }}>
                <div className="mm-frame thin-6"><img src={screensAsistente} alt="Asistente visual abstracto en tres estados." /></div>
                <figcaption className="tight">Fig. 06a · Asistente abstracto, sin rostro — evita carga cognitiva extrínseca.</figcaption>
              </figure>
              <figure style={{ margin: 0 }}>
                <div className="mm-frame thin-6"><img src={screensZonaError} alt="Zona de Error Universal — dedos señalando la interfaz." /></div>
                <figcaption className="tight">Fig. 06b · Zona de Error Universal — cualquier toque fuera de los botones activa una guía, no un error.</figcaption>
              </figure>
            </div>

            <figure className="mm-figure">
              <div className="mm-frame thin">
                <img src={flujoErrorTarea} alt="Diagrama de flujo: se da una instrucción y, si no se cumple correctamente, la simulación permite la equivocación y MAIA redirige por voz en vez de marcar error." />
              </div>
              <figcaption>Fig. 06c · La lógica detrás de la Zona de Error — la simulación permite equivocarse; MAIA redirige por voz en lugar de marcar una falla. Elaboración propia.</figcaption>
            </figure>

            <div className="mm-two" style={{ marginTop: 40 }}>
              <div>
                <h3>El folleto y la seguridad digital</h3>
                <div className="mm-body" style={{ marginTop: 14, maxWidth: '58ch' }}>
                  <p>Un objeto de papel que el usuario conserva en su casa: bastón de autonomía cuando el sistema ya no está presente. Explica la arquitectura de seguridad con la analogía de “La Casa” —la cuenta es la puerta, la contraseña es la llave, el segundo factor es el pestillo— y entrega un protocolo de tres tiempos frente a cualquier situación sospechosa, más el teléfono central 1212 para reportar fraude.</p>
                </div>
                <div className="mm-sem">
                  <div className="mm-sem-cell"><span className="mm-sem-dot" style={{ background: '#d84315' }} /><span className="lbl">Rojo</span><span className="val">Respire</span></div>
                  <div className="mm-sem-cell"><span className="mm-sem-dot" style={{ background: '#b07d12' }} /><span className="lbl">Amarillo</span><span className="val">Mire</span></div>
                  <div className="mm-sem-cell"><span className="mm-sem-dot" style={{ background: '#00695c' }} /><span className="lbl">Verde</span><span className="val">Llame</span></div>
                </div>
              </div>
              <figure style={{ margin: 0 }}>
                <div className="mm-videoframe">
                  <video ref={folletoVideoRef} src="/maia-folleto-render.mp4" poster="/maia-folleto-render-poster.jpg" muted loop controls playsInline preload="metadata" />
                </div>
                <figcaption>Fig. 06d · Folleto Método MAIA — exterior, interior y despliegue. Archivo del autor.</figcaption>
              </figure>
            </div>

            <div className="mm-subblock" style={{ marginTop: 32 }}>
              <span className="eyebrow">Decisiones de interfaz — ergonomía visual y motriz</span>
              <p><strong>Paleta cálida compensatoria:</strong> tonos cálidos y tierras que mitigan la fatiga visual producida por la brunescencia del cristalino (filtro amarillo natural del ojo senescente). <strong>Contraste AAA:</strong> radio de luminancia superior a 7:1 para compensar la miosis senil. <strong>Tipografía:</strong> Atkinson Hyperlegible para diferenciar caracteres ambiguos, Source Sans 3 para el escaneo visual rápido. <strong>Botones:</strong> tamaño considerablemente mayor al estándar (44×44 px) para compensar la falta de motricidad fina. <strong>Ángulo de interacción (40°–50°):</strong> estabiliza temblores involuntarios y evita la fatiga muscular del brazo.</p>
              <p style={{ marginTop: 10 }}><em>Benchmark:</em> comparación con los portales corporativos y memorias institucionales de BancoEstado (2024), Caja Los Héroes (2024), Banco Santander (2024) y Banco de Chile (2025) para calibrar el nivel de fricción real que enfrenta el usuario al hacer banca digital.</p>
            </div>

            <div className="mm-honesty">
              <span className="mm-honesty-eyebrow">Estado del sistema</span>
              <div className="mm-body" style={{ marginTop: 14, maxWidth: '72ch' }}>
                <p>MAIA opera hoy como <strong>prototipo de alta fidelidad</strong>: la app vive en Figma y el hardware es una unidad artesanal. No es un producto en producción y el case study no lo presenta como tal.</p>
                <p>La decisión de no construir un dispositivo propio —la ruta Raspberry Pi Zero 2 W con sensores estaba evaluada— fue estratégica: la curva técnica desviaba el foco del proyecto desde el usuario hacia la máquina. El costo estimado del sistema quedó en <strong>$40.000 CLP</strong>, frente a los $100.000 CLP del plan ideal descartado.</p>
              </div>
            </div>
          </section>

          {/* ── Stage 07 · Testeo sistemático ──────────────────────────── */}
          <section className="mm-stage" id="stage-07">
            <div className="mm-stagehead"><span className="stage-label">Stage 07</span><span className="stage-count">07 / 09</span></div>
            <h2>Testeo sistemático — “Las Dorcas” en Cerro Navia</h2>
            <div className="mm-two">
              <p className="mm-hook">La confianza no se pide. Se hereda de quien ya la tiene.</p>
              <blockquote className="mm-quote">
                <p>“El vínculo se estableció a través de la pastora del recinto, accediendo a la junta semanal ‘Las Dorcas’. Este espacio constituye un nodo de confianza fundamental.”</p>
                <cite>Metodología de campo</cite>
              </blockquote>
            </div>
            <div className="mm-body">
              <p>El <strong>acceso mediado como decisión metodológica.</strong> Inmersión etnográfica situada: integrar la evaluación dentro de la dinámica natural del grupo, no imponer un aula ajena.</p>
              <p><strong>Protocolo de validación sistemático</strong> (anexo de la memoria) — instrumento de medición con secciones de diagnóstico basal, ejecución/observación de tareas (KPIs), observación transversal del hardware, y post-test de autonomía percibida. <strong>El monitor humano como agente de validación emocional</strong> (no técnico) — figura de apoyo que reduce la soledad frente a la máquina.</p>
              <p>El protocolo aplicado en terreno arrojó resultados concretos: el <strong>66 %</strong> de las usuarias con ansiedad tecnológica alta se dispuso a intentar la tarea de forma autónoma tras la sesión con MAIA. Ese mismo instrumento fue el que detectó el rechazo del 77 % al soporte tipo mueble en una iteración temprana, evidencia de que el testeo sistemático —no la intuición del diseñador— fue lo que reorientó el proyecto.</p>
            </div>

            <div className="mm-subblock" style={{ marginTop: 32 }}>
              <span className="eyebrow">Matriz de sistematización y decisiones de diseño</span>
              <p>Cada fila cruza la evidencia cuantitativa del instrumento con la observación de conducta en terreno, para llegar a una decisión proyectual trazable — el registro completo detrás de cada pivote narrado en este caso de estudio.</p>
            </div>
            <div className="mm-matrix">
              {MATRIZ_TESTEO.map(row => (
                <div className="mm-matrix-row" key={row.n}>
                  <div className="mm-matrix-head">
                    <span className="n">{row.n}</span>
                    <h4>{row.dim}</h4>
                    {row.tag && <span className="tag">{row.tag}</span>}
                  </div>
                  <div className="mm-matrix-grid">
                    <div className="mm-matrix-cell">
                      <span className="lbl">Evidencia cuantitativa</span>
                      <p>{row.evidencia}</p>
                    </div>
                    <div className="mm-matrix-cell">
                      <span className="lbl">Observación cualitativa</span>
                      <p>{row.observacion}</p>
                    </div>
                    <div className="mm-matrix-cell">
                      <span className="lbl">Inferencia</span>
                      <p>{row.inferencia}</p>
                    </div>
                    <div className="mm-matrix-cell decision">
                      <span className="lbl">Decisión proyectual</span>
                      <p>{row.decision}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mm-triptych g3" style={{ marginTop: 40 }}>
              <figure>
                <div className="mm-frame">
                  <img src={testeoFormulario} alt="Formulario de testeo respondido a mano por una usuaria, incluyendo su justificación para preferir el soporte portable." />
                </div>
                <figcaption>Fig. 07a · Instrumento respondido en terreno. Archivo del autor.</figcaption>
              </figure>
              <figure>
                <div className="mm-frame">
                  <img src={testeoEvaluador} alt="El autor registrando resultados en el instrumento de medición durante una sesión de testeo." />
                </div>
                <figcaption>Fig. 07b · Registro de resultados en vivo. Archivo del autor.</figcaption>
              </figure>
              <figure>
                <div className="mm-frame">
                  <img src={testeoContexto} alt="El autor revisando el protocolo de testeo en el salón comunitario donde se realizaron las sesiones." />
                </div>
                <figcaption>Fig. 07c · El contexto: sesiones realizadas en el salón de la comunidad. Archivo del autor.</figcaption>
              </figure>
            </div>
          </section>

          {/* ── Stage 08 · Estrategia de implementación ────────────────── */}
          <section className="mm-stage" id="stage-08">
            <div className="mm-stagehead"><span className="stage-label">Stage 08</span><span className="stage-count">08 / 09</span></div>
            <h2>Estrategia de implementación — la solución se hereda</h2>
            <div className="mm-two">
              <p className="mm-hook">La verdadera escala del proyecto no está en el kit. Está en cómo se entrega.</p>
              <blockquote className="mm-quote">
                <p>“El sistema se despliega mediante el Kit MAIA, una unidad itinerante que se transporta y opera en espacios de alta significación emocional y social — juntas de vecinos, clubes de adultos mayores, comunidades eclesiales.”</p>
                <cite>Modelo de gestión e implementación</cite>
              </blockquote>
            </div>
            <div className="mm-body">
              <p>El proyecto no termina en el objeto: termina en un protocolo social. La estrategia de <strong>capilaridad comunitaria</strong> inserta el Kit MAIA en la infraestructura de confianza que ya existe en el territorio —la junta, el club, la iglesia— en lugar de competir con ella.</p>
            </div>

            <figure className="mm-figure">
              <div className="mm-frame thin">
                <img src={flujoComunidad} alt="Diagrama de flujo: conexión con comunidades, traslado del kit, primera sesión de uso, entrega del Kit MAIA y proceso de delegación." />
              </div>
              <figcaption>Fig. 08a · Cómo entra el Kit MAIA al territorio — de la conexión con la comunidad a la entrega. Elaboración propia.</figcaption>
            </figure>

            <div className="mm-subblock" style={{ marginTop: 32 }}>
              <span className="eyebrow">El Monitor — el nieto sustituto</span>
              <p>El monitor no es un técnico: es un apoyo afectivo. La dinámica es simple — recibe al usuario, acomoda el soporte de madera y observa en silencio. La regla de oro ante cualquier duda es “Escuchemos juntos”: nunca hace la tarea por el usuario, sino que lo invita a escuchar de nuevo a la asistente virtual.</p>
            </div>

            <figure className="mm-figure">
              <div className="mm-frame thin">
                <img src={flujoSesionProtocolo} alt="Diagrama de flujo de la primera sesión: instalación del soporte, bienvenida, preguntas de ansiedad pre-interacción, interacción monitor/usuaria con registro de KPIs y entrega del folleto de seguridad." />
              </div>
              <figcaption>Fig. 08b · Protocolo de la primera sesión — el rol del monitor frente a la interacción usuaria/app. Elaboración propia.</figcaption>
            </figure>

            <div className="mm-body" style={{ marginTop: 24 }}>
              <p>La transferencia del método al monitor se organiza en cinco hitos de delegación, con retiro progresivo del andamiaje (<em>fading</em>) y el Manual de Gestión Territorial como insumo de traspaso.</p>
            </div>

            <ol className="mm-fading">
              {HITOS.map(h => {
                const flujo = HITO_FLUJOS.find(hf => hf.n === h.n);
                return (
                  <li key={h.n}>
                    <span className={`fn ${h.done ? 'done' : ''}`}>{h.n}</span>
                    <div>
                      <h4>{h.t}</h4>
                      <p>{h.d}</p>
                      <div className="mm-fbar">
                        <span className="a" style={{ flex: h.autor }} />
                        <span className="c" style={{ flex: h.comu }} />
                      </div>
                      <div className="mm-flegend"><span>Autor {h.autor}%</span><span>Comunidad {h.comu}%</span></div>
                      {flujo && (
                        <figure className="mm-figure" style={{ marginTop: 16 }}>
                          <div className="mm-frame thin">
                            <img src={flujo.src} alt={flujo.alt} />
                          </div>
                          <figcaption>Fig. {flujo.fig} · Hito {flujo.n} — {flujo.t}. Elaboración propia.</figcaption>
                        </figure>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>




          </section>

          {/* ── Stage 09 · Cierre ───────────────────────────────────────── */}
          <section className="mm-stage" id="stage-09">
            <div className="mm-stagehead"><span className="stage-label">Stage 09</span><span className="stage-count">09 / 09</span></div>
            <h2>Cierre</h2>
            <div className="mm-two">
              <p className="mm-hook">Este proyecto no resolvió la brecha digital. Enseñó a mirarla de cerca.</p>
              <blockquote className="mm-quote">
                <p>“Tal vez la verdadera barrera nunca fue la edad del usuario, sino la falta de empatía del entorno.”</p>
                <cite>Reflexión final de la memoria</cite>
              </blockquote>
            </div>
            <div className="mm-quad">
              <div className="mm-quad-cell">
                <h4>La primacía de lo emocional</h4>
                <p>La barrera principal no es capacidad cognitiva: es parálisis por indefensión. Cualquier interfaz que ignore eso llega tarde.</p>
              </div>
              <div className="mm-quad-cell">
                <h4>El diseño como andamiaje sensible</h4>
                <p>Una interfaz inclusiva apalanca la inteligencia cristalizada del usuario en lugar de exigirle la fluida.</p>
              </div>
              <div className="mm-quad-cell">
                <h4>La autonomía como proceso</h4>
                <p>El 66 % de disposición autónoma no es una métrica de éxito definitivo: es una brújula para el siguiente ciclo.</p>
              </div>
              <div className="mm-quad-cell">
                <h4>Honestidad sobre el estado</h4>
                <p>MAIA es un prototipo de alta fidelidad, no un producto. La memoria priorizó profundidad de investigación y validación por sobre el pulido de la interfaz gráfica.</p>
              </div>
            </div>
            <div className="mm-body">
              <p>Esa última decisión es también el aprendizaje más valioso del proceso: el trabajo en terreno, la escucha y la iteración con la comunidad pesan más que un pixel perfecto —y, al mismo tiempo, un sistema mejor resuelto gráficamente habría comunicado mejor lo que ya estaba bien pensado. Las dos cosas son verdad.</p>
              <p>Lo que queda para la práctica UX/UI: el rigor de la etnografía como base de cualquier decisión, la humildad de iterar <em>con</em> y no <em>para</em> el usuario, la disciplina de validar cada hipótesis con testeo sistemático en terreno, y la ambición de que un producto trascienda su interfaz para insertarse en una infraestructura social que ya existe.</p>
            </div>
            <figure className="mm-figure">
              <div className="mm-frame mm-frame-cover">
                <img src={cierreAcompanamiento} alt="El autor entregando el folleto de seguridad digital a una usuaria durante una sesión de testeo." />
              </div>
              <figcaption>Fig. 09 · Registro de testeo en terreno. Archivo del autor.</figcaption>
            </figure>
          </section>

          {/* ── Footer ────────────────────────────────────────────────── */}
          <footer className="mm-footer">
            <div>
              <p className="fend">Fin del case study</p>
              <p>Memoria de título · Escuela de Diseño FaAAD UDP · Guías Sergio Majluf y Simón Gallardo · 2025–2026.</p>
            </div>

          </footer>

        </main>
      </div>
    </div>
  );
}
