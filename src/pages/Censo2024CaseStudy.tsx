import { useEffect, useRef, useState } from 'react';
import ProgressBar, { tickCount } from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';

import propuesta01 from '@/assets/censo/propuesta-01.jpg';
import propuesta02 from '@/assets/censo/propuesta-02.jpg';
import propuesta03 from '@/assets/censo/propuesta-03.jpg';
import oficialNacional from '@/assets/censo/oficial-nacional.jpg';
import proceso19 from '@/assets/censo/proceso-19-feb.png';
import proceso20 from '@/assets/censo/proceso-20-feb.png';

/**
 * Censo2024CaseStudy — case study dedicado del Censo 2024 (rediseñado
 * 2026-09-16 desde una maqueta de Claude Design auditada por el usuario).
 *
 * Es una serie visual, no un producto: tres propuestas de infografía
 * Resultados Generales entregadas al INE, hechas en Globallys en
 * colaboración con Consuelo Correa. 9 stages agrupadas en tres marcos
 * editoriales (I · el encargo, II · el sistema y las propuestas,
 * III · cierre y comparación con lo publicado).
 *
 * Sistema del portafolio conservado (regla del 2026-09-11): NavBar (la
 * pone App), BackButton con label "Volver al listado", regla vertical
 * (ProgressBar) + `pl-[188px]`. Fuentes IBM Plex Mono/Sans con los
 * nombres EXACTOS registrados en `src/index.css`. Todo el CSS propio
 * vive bajo `.c24` para no filtrarse.
 *
 * Adaptaciones específicas del proyecto:
 * - Paleta: magenta Censo `#E5177C` (ancla cromática) + azul institucional
 *   `#1B3A6B` (estructura) + celeste `#29ABE2` (segunda serie).
 * - Encabezado de stage al patrón Edubig/INE: `border-top` completo,
 *   NN/09 a la derecha, título a la izquierda.
 * - Sin regla "Sigue N · …" al pie (lección de los case studies previos).
 * - Sin párrafo de manifiesto final (cierra en la tabla de coincidencias).
 * - Detalles recortados de las propuestas: `overflow:hidden + aspect-ratio
 *   + translateY(-X%)` — el mismo truco que la maqueta usa para ampliar
 *   secciones específicas sin duplicar assets.
 */

// ─── DATA ──────────────────────────────────────────────────────────────────

const META: { k: string; v: string; n: string }[] = [
  { k: 'Proyecto',   v: 'Infografía Resultados Generales', n: 'Censo 2024 · Chile' },
  { k: 'Cliente',    v: 'Instituto Nacional de Estadísticas', n: 'censo2024.cl' },
  { k: 'Estudio',    v: 'Globallys', n: 'En colaboración con Consuelo Correa' },
  { k: 'Entrega',    v: '3 propuestas visuales', n: 'Feb — Mar 2025' },
];

const INDICE: { n: string; t: string }[] = [
  { n: '01', t: 'El encargo llegó como una tabla' },
  { n: '02', t: 'Globallys + Consuelo Correa' },
  { n: '03', t: 'Lo que tenía que caber' },
  { n: '04', t: 'Del azul al pink' },
  { n: '05', t: 'Sistema visual' },
  { n: '06', t: 'Propuesta 01 · Tarjetas sobre blanco' },
  { n: '07', t: 'Propuesta 02 · Versalitas y series' },
  { n: '08', t: 'Propuesta 03 · Ficha regional' },
  { n: '09', t: 'Lo que se publicó' },
];

const ROLES: [string, string][] = [
  ['Estudio', 'Globallys — dirección de la pieza, sistema visual y maquetación en InDesign.'],
  ['Colaboración', 'Consuelo Correa — propuesta editorial, revisión de jerarquías y contrapunto en cada ronda.'],
  ['Contraparte', 'INE — set de indicadores, bocetos de referencia y validación institucional.'],
];

const INVENTARIO: { n: string; t: string; v: string }[] = [
  { n: '01', t: 'Población censada',              v: '17.574.003 en la maqueta · 18.480.432 oficial' },
  { n: '02', t: 'Población por sexo',             v: '8.972.014 mujeres · 8.601.989 hombres' },
  { n: '03', t: 'Razón hombre-mujer',             v: '112,1 hombres por cada 100 mujeres' },
  { n: '04', t: 'Índice de envejecimiento',       v: '92 en la maqueta · 79 oficial' },
  { n: '05', t: 'Distribución por grupo de edades', v: '0–17 · 18–34 · 35–54 · 55+ y pirámide quinquenal' },
  { n: '06', t: 'Comparación con otros censos',   v: '1992 · 2002 · 2017 · 2024' },
  { n: '07', t: 'Hogares',                        v: 'Total, personas por hogar, unipersonales, de personas mayores' },
];

const PALETA: { name: string; hex: string; role: string }[] = [
  { name: 'Magenta Censo',      hex: '#E5177C', role: 'Acento: un solo bloque por lámina.' },
  { name: 'Azul institucional', hex: '#1B3A6B', role: 'Titulares, tablas y estructura.' },
  { name: 'Celeste INE',        hex: '#29ABE2', role: 'Segunda serie en gráficos.' },
  { name: 'Gris azulado',       hex: '#7C97A8', role: 'Etiquetas y subtítulos.' },
  { name: 'Blanco papel',       hex: '#FFFFFF', role: 'Fondo de la lámina.' },
];

const GIRO: { k: string; hex: string; v: string }[] = [
  { k: 'Ejemplo recibido', hex: '#0B6390', v: 'Bocetos del INE en azul institucional: fondo pleno, tarjetas en azul profundo, gráficos naranja y azul marino.' },
  { k: 'Lo que mostraban', hex: '#29ABE2', v: 'Azul sobre azul iguala todos los indicadores. Entre el 19 y el 20 de febrero cambia la retícula, no el problema.' },
  { k: 'Nuestra respuesta', hex: '#E5177C', v: 'Blanco de fondo, azul institucional para estructura y el magenta del Censo reservado al dato principal.' },
];

type Modulo = {
  n: string;
  title: string;
  grado: 'Literal' | 'Adaptado';
  gradoColor: 'pink' | 'azul';
  nuestra: { src: string; aspect: number; ty: string; alt: string; caption: string };
  oficial: { src: string; aspect: number; ty: string; alt: string; caption: string };
  desc: string;
};

const MODULOS: Modulo[] = [
  {
    n: '01', title: 'El dato en magenta', grado: 'Literal', gradoColor: 'pink',
    nuestra: { src: propuesta01, aspect: 2.9, ty: '-7%', alt: 'Propuesta 01: bloque magenta de población censada', caption: 'Propuesta 01' },
    oficial: { src: oficialNacional, aspect: 2.9, ty: '-12%', alt: 'Lámina publicada: bloque magenta de población censada', caption: 'Publicada' },
    desc: 'Rectángulo magenta pleno, etiqueta «Población censada» en blanco sobre la cifra, arriba a la izquierda de la lámina. Misma pieza, solo cambia el número.',
  },
  {
    n: '02', title: 'Donut de población por sexo', grado: 'Literal', gradoColor: 'pink',
    nuestra: { src: propuesta01, aspect: 1.75, ty: '-17%', alt: 'Propuesta 01: donut de población por sexo', caption: 'Propuesta 01' },
    oficial: { src: oficialNacional, aspect: 1.75, ty: '-13%', alt: 'Lámina publicada: donut de población por sexo y por tramos de edad', caption: 'Publicada' },
    desc: 'Anillo de dos gajos en azul institucional y celeste, corte casi a la mitad, con Hombres y Mujeres etiquetados fuera del anillo y el porcentaje en grande. La publicada suma un segundo donut con la misma construcción para los tramos de edad — la solución que en nuestras propuestas resolvía «distribución por grupo de edades».',
  },
  {
    n: '03', title: 'Índice de envejecimiento con pictograma', grado: 'Literal', gradoColor: 'pink',
    nuestra: { src: propuesta03, aspect: 3, ty: '-58%', alt: 'Propuesta 03: índice de envejecimiento y personas por hogar con pictogramas', caption: 'Propuesta 03' },
    oficial: { src: oficialNacional, aspect: 3, ty: '-19%', alt: 'Lámina publicada: índice de envejecimiento y promedio de edad con pictogramas', caption: 'Publicada' },
    desc: 'Icono de línea de dos personas mayores a la izquierda, etiqueta en versalitas azules al centro y el número en grande a la derecha, alineado a la misma línea base. La publicada repite el patrón y le agrega la glosa «por cada 100 personas de 0 a 14 años, hay 79 de 65 o más». El mismo módulo sostiene el promedio de edad.',
  },
  {
    n: '04', title: 'Módulo de hogares', grado: 'Adaptado', gradoColor: 'azul',
    nuestra: { src: propuesta03, aspect: 1.6, ty: '-44%', alt: 'Propuesta 03: módulo de hogares con torta de unipersonales', caption: 'Propuesta 03' },
    oficial: { src: oficialNacional, aspect: 1.6, ty: '-41%', alt: 'Lámina publicada: sección de hogares con donuts de unipersonales y de personas mayores', caption: 'Publicada' },
    desc: 'Los cinco indicadores de hogares — total, personas por hogar, unipersonales, de personas mayores — viajan juntos en una sola tarjeta, con el total en banda destacada y los dos porcentajes como gráficos circulares. La publicada mantiene el grupo y el orden; cambia la torta por donut y el magenta del total por banda azul.',
  },
  {
    n: '05', title: 'La serie histórica como gráfico', grado: 'Adaptado', gradoColor: 'azul',
    nuestra: { src: propuesta02, aspect: 2.2, ty: '-74%', alt: 'Propuesta 02: línea de índice de envejecimiento y barras de población', caption: 'Propuesta 02' },
    oficial: { src: oficialNacional, aspect: 2.2, ty: '-78%', alt: 'Lámina publicada: evolución de censos con burbujas y línea de índice', caption: 'Publicada' },
    desc: 'La propuesta 02 sacó la comparación de la tabla y la convirtió en dos gráficos lado a lado: índice de envejecimiento como línea con marcadores y población como barras, ambos con los cuatro censos en el eje. La publicada usa exactamente esa pareja — línea con valores sobre cada punto, población en burbujas escaladas — y destaca 2024 en celeste.',
  },
];

type Coincidencia = {
  t: string;
  grado: 'Literal' | 'Adaptado' | 'Se soltó' | 'Otro camino';
  color: 'pink' | 'azul' | 'gris';
  nuestra: string;
  oficial: string;
};

const COINCIDENCIAS: Coincidencia[] = [
  { t: 'Bloque magenta del dato principal', grado: 'Literal', color: 'pink',
    nuestra: 'Población censada en rectángulo magenta pleno, arriba a la izquierda, texto blanco.',
    oficial: 'Idéntico, con la cifra definitiva: 18.480.432.' },
  { t: 'Donut de población por sexo', grado: 'Literal', color: 'pink',
    nuestra: 'Anillo de dos gajos, azul institucional y celeste, con Hombres / Mujeres etiquetados y % destacado.',
    oficial: 'Mismo anillo y mismos dos azules; 48,5% y 51,5%.' },
  { t: 'Índice de envejecimiento', grado: 'Literal', color: 'pink',
    nuestra: 'Pictograma de personas mayores + etiqueta en versalitas + número grande a la derecha.',
    oficial: 'Mismo módulo, valor 79 y glosa explicativa bajo la cifra.' },
  { t: 'Promedio de personas por hogar', grado: 'Literal', color: 'pink',
    nuestra: 'Icono de casa con familia, etiqueta en dos líneas y cifra grande (1,5 en maqueta).',
    oficial: 'Mismo módulo dentro de Hogares; 2,8.' },
  { t: 'Hogares unipersonales y de personas mayores', grado: 'Adaptado', color: 'azul',
    nuestra: 'Los dos porcentajes como gráfico circular con etiqueta al pie, en un solo bloque de hogares.',
    oficial: 'Se mantienen juntos y en el mismo orden, resueltos como donuts magenta y naranja: 21,8% y 11,6%.' },
  { t: 'Total de hogares destacado', grado: 'Adaptado', color: 'azul',
    nuestra: 'Cifra en magenta con icono de casa, encabezando el bloque.',
    oficial: '«Hogares censados» en banda azul plena: 6.596.527.' },
  { t: 'Tramos de edad en anillo', grado: 'Adaptado', color: 'azul',
    nuestra: 'Donut segmentado por grupos de edad con globos de porcentaje alrededor.',
    oficial: 'Mismo donut con globos, reagrupado en tres tramos: 0 a 14, 15 a 64, 65 y más.' },
  { t: 'Serie histórica como gráfico', grado: 'Adaptado', color: 'azul',
    nuestra: 'Propuesta 02: línea con marcadores para el índice y barras para la población, cuatro censos en el eje.',
    oficial: 'La misma pareja de gráficos: línea con valores sobre los puntos y población en burbujas, con 2024 destacado.' },
  { t: 'Titular y logos', grado: 'Literal', color: 'pink',
    nuestra: 'Titular en azul institucional a la izquierda, INE y CENSO 2024 alineados al borde derecho.',
    oficial: 'Misma línea superior; el titular pasa a «Resultados nacionales».' },
  { t: 'Marco de tarjeta y etiquetas mono', grado: 'Literal', color: 'pink',
    nuestra: 'Tarjetas de borde fino celeste agrupando módulos, etiquetas en versalitas azules sobre blanco.',
    oficial: 'Mismo recurso como estructura de toda la lámina, con secciones tituladas.' },
  { t: 'Pirámide quinquenal', grado: 'Se soltó', color: 'gris',
    nuestra: 'Media lámina para la pirámide de 17 tramos, hombres y mujeres enfrentados.',
    oficial: 'No aparece: la edad se resume en tres tramos y un promedio de 38,1.' },
  { t: 'Razón hombre-mujer', grado: 'Se soltó', color: 'gris',
    nuestra: 'Módulo con dos pictogramas: por cada 100 mujeres hay 112,1 hombres.',
    oficial: 'Fuera de la lámina; queda solo el reparto porcentual del donut.' },
  { t: 'QR al detalle', grado: 'Se soltó', color: 'gris',
    nuestra: 'QR al pie en las tres propuestas, con marco naranja en la 02.',
    oficial: 'Reemplazado por la URL en texto: www.censo2024.cl.' },
  { t: 'Ficha regional', grado: 'Otro camino', color: 'gris',
    nuestra: 'Plantilla repetible dieciséis veces, con el nombre de región en el bloque magenta.',
    oficial: 'No se publicó como lámina; el detalle por región vive en el explorador del sitio.' },
];

// ─── COMPONENTE ────────────────────────────────────────────────────────────

export default function Censo2024CaseStudy({ onBack }: { onBack: () => void }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      const el = contentRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      setScrollProgress(scrollable > 0 ? Math.max(0, Math.min(1, -top / scrollable)) : 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleSeek(ratio: number, dragging = false) {
    const el = contentRef.current;
    if (!el) return;
    const scrollable = el.getBoundingClientRect().height - window.innerHeight;
    if (scrollable > 0) {
      window.scrollTo({ top: el.offsetTop + ratio * scrollable, behavior: dragging ? 'auto' : 'smooth' });
    }
  }

  return (
    <div className="c24 bg-[#fafaf7] min-h-screen relative">
      <style>{CSS}</style>

      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center max-[900px]:hidden"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical ticks={tickCount(9)} />
      </div>

      <div ref={contentRef} className="c24-content">
        <div className="c24-topbar">
          <BackButton onClick={onBack} label="Volver al listado" />
          <span className="c24-cat-chip" aria-label="Categoría Datos">
            <span className="c24-cat-dot" />Datos
          </span>
        </div>

        {/* ─── HEADER / COVER ─────────────────────────────────────────── */}
        <header className="c24-header">
          <div className="c24-crumbs">
            <span className="c24-crumb c24-crumb-pink">Case study</span>
            <span className="c24-crumb">Globallys</span>
            <span className="c24-crumb dim">·</span>
            <span className="c24-crumb">Censo 2024 — Resultados Generales</span>
          </div>

          <h1 className="c24-h1">Tres propuestas para una sola lámina</h1>

          <div className="c24-hook">
            <div>
              <div className="c24-hooklabel c24-pink">Premisa</div>
              <p>
                Un censo entrega un país convertido en indicadores. La infografía de
                Resultados Generales tenía que caber en una lámina y funcionar dos
                veces: como resumen nacional y como ficha repetible para cada región.
              </p>
            </div>
            <div>
              <div className="c24-hooklabel c24-azul">Promesa</div>
              <p>
                No una infografía, sino un sistema con tres salidas: tarjetas sobre
                blanco, versalitas con series y ficha regional. Misma retícula, misma
                familia tipográfica, tres grados de densidad para que el INE eligiera
                con la pieza puesta.
              </p>
            </div>
          </div>

          <dl className="c24-meta">
            {META.map((m) => (
              <div key={m.k}>
                <dt>{m.k}</dt>
                <dd className="c24-meta-v">{m.v}</dd>
                <dd className="c24-meta-n">{m.n}</dd>
              </div>
            ))}
          </dl>

          <div className="c24-indice">
            <div className="c24-indice-label">Índice · 9 stages</div>
            <div className="c24-indice-grid">
              {INDICE.map((s) => (
                <div className="c24-indice-row" key={s.n}>
                  <span className="c24-pink mono small bold">{s.n}</span>
                  <span>{s.t}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ─── MARCO I ────────────────────────────────────────────────── */}
        <div className="c24-marco">Marco I · El encargo y el material</div>

        {/* ─── STAGE 01 ───────────────────────────────────────────────── */}
        <section className="c24-stage">
          <StageHead n="01" title="El encargo llegó como una tabla" />
          <div className="c24-two">
            <p>
              El Instituto Nacional de Estadísticas necesitaba comunicar los Resultados
              Generales del Censo 2024 en una pieza gráfica: población censada,
              distribución por sexo y edad, envejecimiento, hogares y la comparación
              con los censos de 1992, 2002 y 2017.
            </p>
            <p>
              El material de partida era una planilla de indicadores y unos bocetos de
              referencia. El pedido real, leído entre líneas, era otro: decidir qué se
              mira primero. Una lámina con doce indicadores del mismo tamaño no
              comunica, inventaría.
            </p>
          </div>
        </section>

        {/* ─── STAGE 02 ───────────────────────────────────────────────── */}
        <section className="c24-stage">
          <StageHead n="02" title="Hecho en Globallys, en colaboración con Consuelo Correa" />
          <div className="c24-two">
            <p>
              El proyecto se desarrolló en Globallys en colaboración con{' '}
              <strong>Consuelo Correa</strong>. Trabajamos el mismo set de datos
              alternando roles: quien proponía una lámina recibía la crítica de la otra
              antes de que saliera del estudio.
            </p>
            <p>
              Ese ida y vuelta explica por qué la entrega fueron tres propuestas y no
              una: cada una defiende una jerarquía distinta del mismo contenido, y las
              tres comparten retícula para que la comparación fuera honesta.
            </p>
          </div>

          <div className="c24-roles">
            {ROLES.map(([k, v]) => (
              <div key={k}>
                <div className="mono uc small dim">{k}</div>
                <div className="c24-role-v">{v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── STAGE 03 ───────────────────────────────────────────────── */}
        <section className="c24-stage">
          <StageHead n="03" title="Lo que tenía que caber" />
          <p className="c24-lead">
            Siete bloques obligatorios. Las propuestas se maquetaron con las cifras
            nacionales disponibles en ese momento y con valores de maqueta donde el
            dato aún no estaba cerrado — por eso en las láminas aparece 17.574.003 y
            una comparación con cifras repetidas.
          </p>
          <div className="c24-inv">
            {INVENTARIO.map((i) => (
              <div className="c24-inv-row" key={i.n}>
                <div className="c24-inv-l">
                  <span className="mono small dim">{i.n}</span>
                  <span className="c24-inv-t">{i.t}</span>
                </div>
                <div className="c24-inv-v mono">{i.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── STAGE 04 ───────────────────────────────────────────────── */}
        <section className="c24-stage">
          <StageHead n="04" title="Del azul al pink" accent="azul" />
          <div className="c24-two">
            <p>
              Antes de empezar recibimos ejemplos: bocetos en azul que el equipo del
              INE nos envió para explicar lo que buscaban. <strong>No son propuestas
              nuestras</strong>, son el punto de partida — fondo azul pleno, tarjetas
              en un azul más profundo, gráficos en naranja y azul marino, capturas del
              19 y del 20 de febrero.
            </p>
            <p>
              Leerlos sirvió para dos cosas. La primera: el azul sobre azul deja todos
              los indicadores al mismo nivel, y con doce bloques eso es ruido. La
              segunda: entre una captura y otra se ve el problema real — no era el
              orden de las tarjetas, era el color. De ahí el giro al magenta del
              Censo, pero como acento puntual sobre blanco, no como fondo.
            </p>
          </div>

          <div className="c24-procesos">
            <figure>
              <div className="c24-frame">
                <img src={proceso19} alt="Boceto de referencia en azul, 19 de febrero: fila de tres indicadores" />
              </div>
              <figcaption>
                <span className="mono uc small c24-azul">Fig. 01</span>
                <span>19 feb — ejemplo recibido. Fila de tres: por sexo, razón h-m e índice compiten por el mismo peso.</span>
              </figcaption>
            </figure>
            <figure>
              <div className="c24-frame">
                <img src={proceso20} alt="Boceto de referencia en azul, 20 de febrero: retícula en pares" />
              </div>
              <figcaption>
                <span className="mono uc small c24-azul">Fig. 02</span>
                <span>20 feb — ejemplo recibido. Misma paleta, retícula en pares: cada indicador recibe una tarjeta completa.</span>
              </figcaption>
            </figure>
          </div>

          <div className="c24-giro">
            {GIRO.map((g, i) => (
              <div className="c24-giro-card" key={i}>
                <div className="c24-giro-head">
                  <span className="c24-giro-dot" style={{ background: g.hex }} />
                  <span className="mono uc small dim">{g.k}</span>
                </div>
                <div className="c24-giro-v">{g.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── STAGE 05 ───────────────────────────────────────────────── */}
        <section className="c24-stage">
          <StageHead n="05" title="Sistema visual: el magenta marca, el azul sostiene" />
          <div className="c24-two">
            <p>
              Con esa lectura hecha, el sistema quedó fijado antes de maquetar la
              primera lámina. El magenta del Censo 2024 es el ancla cromática, pero no
              el fondo: se reserva para un solo bloque por lámina — la población
              censada — para que ese número sea lo primero que se vea. Todo lo demás se
              sostiene en el azul institucional del INE y su celeste de apoyo, sobre
              blanco.
            </p>
            <p>
              La tipografía se mantuvo en IBM Plex: Mono para etiquetas, unidades y
              ejes; Sans para titulares y cifras. Una sola familia con dos voces evita
              que una lámina con doce indicadores parezca doce láminas.
            </p>
          </div>

          <div className="c24-paleta">
            {PALETA.map((c) => (
              <div className="c24-swatch" key={c.hex + c.name}>
                <div className="c24-swatch-chip" style={{ background: c.hex, borderBottom: c.hex === '#FFFFFF' ? '1px solid var(--c24-line)' : 'none' }} />
                <div className="c24-swatch-body">
                  <div className="c24-swatch-name">{c.name}</div>
                  <div className="mono small dim">{c.hex}</div>
                  <div className="c24-swatch-role">{c.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="c24-typo">
            <div className="c24-typo-card">
              <div className="mono uc small dim">Etiquetas · IBM Plex Mono</div>
              <div className="c24-typo-mono">Población censada</div>
              <div className="mono small dim c24-typo-note">por cada 100 mujeres · 112,1 hombres</div>
            </div>
            <div className="c24-typo-card">
              <div className="mono uc small dim">Cifras · IBM Plex Sans</div>
              <div className="c24-typo-num">17.574.003</div>
            </div>
          </div>
        </section>

        {/* ─── MARCO II ───────────────────────────────────────────────── */}
        <div className="c24-marco">Marco II · El sistema y las tres propuestas</div>

        {/* ─── STAGE 06 · P1 ──────────────────────────────────────────── */}
        <section className="c24-stage">
          <StageHead n="06" title="Propuesta 01 · Tarjetas sobre blanco" />
          <p className="c24-lead">
            La población censada abre en un bloque magenta pleno, arriba a la
            izquierda, y todo lo demás vive en tarjetas de borde fino sobre blanco. La
            pirámide de edad ocupa media lámina porque es el único gráfico que
            explica el país por sí solo; la comparación entre censos cierra como
            cuatro columnas-año.
          </p>

          <figure className="c24-fig">
            <div className="c24-frame c24-lamina">
              <img src={propuesta01} alt="Propuesta 01: tarjetas sobre blanco con bloque magenta de población censada" />
            </div>
            <figcaption>
              <span className="mono uc small c24-pink">Fig. 03</span>
              <span>Propuesta 01 — lámina completa. Jerarquía por peso de color: un solo bloque magenta, el resto en azul institucional sobre blanco.</span>
            </figcaption>
          </figure>

          <figure className="c24-fig c24-fig-detail">
            <div className="c24-frame c24-detail-frame">
              <div className="c24-detail-crop" style={{ aspectRatio: '2.5' }}>
                <img src={propuesta01} alt="Detalle: bloque magenta de población censada y donut de población por sexo" style={{ transform: 'translateY(-7%)' }} />
              </div>
            </div>
            <figcaption className="c24-fig-detail-cap">Detalle · el único bloque magenta de la lámina y el donut de población por sexo</figcaption>
          </figure>
        </section>

        {/* ─── STAGE 07 · P2 ──────────────────────────────────────────── */}
        <section className="c24-stage">
          <StageHead n="07" title="Propuesta 02 · Versalitas y series" />
          <p className="c24-lead">
            La versión analítica. El titular se monta en una banda azul institucional,
            las etiquetas pasan a versalitas mono y la comparación entre censos deja
            de ser tabla: se convierte en dos gráficos — línea para edad promedio e
            índice de envejecimiento, barras para población. El magenta desaparece de
            la lámina y queda solo en el logo del Censo.
          </p>

          <figure className="c24-fig">
            <div className="c24-frame c24-lamina">
              <img src={propuesta02} alt="Propuesta 02: banda azul de titular, versalitas y gráficos de serie" />
            </div>
            <figcaption>
              <span className="mono uc small c24-pink">Fig. 04</span>
              <span>Propuesta 02 — lámina completa. Misma retícula que la 01, pero el peso lo carga la tipografía y no el color.</span>
            </figcaption>
          </figure>

          <figure className="c24-fig c24-fig-detail">
            <div className="c24-frame c24-detail-frame">
              <div className="c24-detail-crop" style={{ aspectRatio: '2.5' }}>
                <img src={propuesta02} alt="Detalle: gráficos de comparación con otros censos" style={{ transform: 'translateY(-73%)' }} />
              </div>
            </div>
            <figcaption className="c24-fig-detail-cap">Detalle · la comparación entre censos como serie: línea de edad e índice, barras de población (datos de maqueta)</figcaption>
          </figure>
        </section>

        {/* ─── STAGE 08 · P3 ──────────────────────────────────────────── */}
        <section className="c24-stage">
          <StageHead n="08" title="Propuesta 03 · Ficha regional" />
          <p className="c24-lead">
            La que resolvía el encargo doble: una plantilla para rellenar dieciséis
            veces. El nombre de la región toma el bloque magenta — es el dato que
            cambia — y aparece un módulo de hogares completo: total, índice de
            envejecimiento, personas por hogar, unipersonales y de personas mayores.
            Cierra con QR al detalle en el sitio del Censo.
          </p>

          <figure className="c24-fig">
            <div className="c24-frame c24-lamina">
              <img src={propuesta03} alt="Propuesta 03: ficha regional de Arica y Parinacota con módulo de hogares" />
            </div>
            <figcaption>
              <span className="mono uc small c24-pink">Fig. 05</span>
              <span>Propuesta 03 — maquetada con Arica y Parinacota. La misma plantilla admite las dieciséis regiones sin reordenar tarjetas; hogares y comparación con valores de maqueta.</span>
            </figcaption>
          </figure>

          <figure className="c24-fig c24-fig-detail">
            <div className="c24-frame c24-detail-frame">
              <div className="c24-detail-crop" style={{ aspectRatio: '2.2' }}>
                <img src={propuesta03} alt="Detalle: módulo de hogares de la ficha regional" style={{ transform: 'translateY(-44%)' }} />
              </div>
            </div>
            <figcaption className="c24-fig-detail-cap">Detalle · módulo de hogares: torta de unipersonales, total en magenta, índice y personas por hogar con pictogramas</figcaption>
          </figure>
        </section>

        {/* ─── MARCO III ──────────────────────────────────────────────── */}
        <div className="c24-marco">Marco III · Cierre</div>

        {/* ─── STAGE 09 ───────────────────────────────────────────────── */}
        <section className="c24-stage last">
          <StageHead n="09" title="Lo que se publicó" />
          <p className="c24-lead">
            El INE publicó su infografía de Resultados nacionales en{' '}
            <a href="https://censo2024.cl" target="_blank" rel="noopener noreferrer">
              censo2024.cl
            </a>
            , ya con las cifras definitivas: 18.480.432 personas censadas, índice de
            envejecimiento 79 y promedio de edad 38,1. Puesta al lado de nuestras
            propuestas, la continuidad es módulo por módulo: catorce decisiones
            reaparecen, se adaptan o se soltaron.
          </p>

          <figure className="c24-fig">
            <div className="c24-frame c24-compare">
              <div>
                <div className="mono uc small dim c24-compare-head">Propuesta Globallys</div>
                <img src={propuesta01} alt="Propuesta 01 de Globallys" />
              </div>
              <div>
                <div className="mono uc small dim c24-compare-head">Publicado por el INE</div>
                <img src={oficialNacional} alt="Infografía oficial de Resultados nacionales publicada por el INE" />
              </div>
            </div>
            <figcaption>
              <span className="mono uc small c24-pink">Fig. 06</span>
              <span>Comparación lado a lado: la propuesta 01 y la lámina de Resultados nacionales publicada por el INE.</span>
            </figcaption>
          </figure>

          <h3 className="c24-h3">Coincidencias módulo por módulo</h3>
          <p className="c24-lead">
            Puestas una junto a la otra, las correspondencias son más que el color: el
            bloque del dato principal, el donut de población por sexo, el índice de
            envejecimiento con pictograma, el módulo de hogares y la serie histórica
            aparecen en la lámina publicada con la misma solución gráfica que probamos
            en las propuestas.
          </p>

          <div className="c24-modulos">
            {MODULOS.map((m) => (
              <div key={m.n} className="c24-modulo">
                <div className="c24-modulo-head">
                  <span className="mono uc small">{m.n} · {m.title}</span>
                  <span className={'mono uc small ' + (m.gradoColor === 'pink' ? 'c24-pink' : 'c24-azul')}>
                    {m.grado.toLowerCase()}
                  </span>
                </div>
                <div className="c24-modulo-cmp">
                  <div className="c24-modulo-side">
                    <div className="c24-frame c24-detail-frame">
                      <div className="c24-detail-crop" style={{ aspectRatio: String(m.nuestra.aspect) }}>
                        <img src={m.nuestra.src} alt={m.nuestra.alt} style={{ transform: `translateY(${m.nuestra.ty})` }} />
                      </div>
                    </div>
                    <div className="mono uc small dim c24-modulo-lbl">{m.nuestra.caption}</div>
                  </div>
                  <div className="c24-modulo-side">
                    <div className="c24-frame c24-detail-frame">
                      <div className="c24-detail-crop" style={{ aspectRatio: String(m.oficial.aspect) }}>
                        <img src={m.oficial.src} alt={m.oficial.alt} style={{ transform: `translateY(${m.oficial.ty})` }} />
                      </div>
                    </div>
                    <div className="mono uc small dim c24-modulo-lbl">{m.oficial.caption}</div>
                  </div>
                </div>
                <p className="c24-modulo-desc">{m.desc}</p>
              </div>
            ))}
          </div>

          <figcaption className="c24-modulos-cap">
            <span className="mono uc small c24-pink">Fig. 07</span>
            <span>Cinco módulos comparados: recortes de nuestras propuestas junto al mismo módulo en la lámina publicada.</span>
          </figcaption>

          <div className="c24-balance">
            <div className="mono uc small dim c24-balance-head">Balance del sistema · qué pasó con cada decisión</div>
            {COINCIDENCIAS.map((c, i) => (
              <div className="c24-balance-row" key={i}>
                <div className="c24-balance-l">
                  <div className="c24-balance-t">{c.t}</div>
                  <div className={'mono uc small bold c24-balance-grado c24-' + c.color}>{c.grado}</div>
                </div>
                <div className="c24-balance-nuestra">{c.nuestra}</div>
                <div className="c24-balance-oficial">{c.oficial}</div>
              </div>
            ))}
          </div>

          <div className="c24-footer">
            <span>Globallys</span>
            <span>Con Consuelo Correa</span>
            <span>2025</span>
            <span>
              <a href="https://censo2024.cl" target="_blank" rel="noopener noreferrer">censo2024.cl</a>
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── PIEZAS AUXILIARES ────────────────────────────────────────────────────

function StageHead({ n, title, accent = 'pink' }: { n: string; title: string; accent?: 'pink' | 'azul' }) {
  return (
    <div className="c24-stagehead">
      <span className={'mono uc small bold ' + (accent === 'azul' ? 'c24-azul' : 'c24-pink')}>
        {n}/09
      </span>
      <h2 className="c24-stage-title">{title}</h2>
    </div>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────

const CSS = `
.c24{color:var(--c24-ink);
  --c24-ink:#16161A;--c24-body:#2A2A31;--c24-soft:#5A5A63;--c24-dim:#6B6B74;
  --c24-line:rgba(0,0,0,.14);--c24-line-soft:rgba(0,0,0,.09);
  --c24-pink:#E5177C;--c24-azul:#1B3A6B;--c24-celeste:#29ABE2;
  --c24-frame-bg:#F2EFEB;
  --c24-mono:'IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --c24-mono-med:'IBM Plex Mono:Medium','IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --c24-sans:'IBM Plex Sans:Regular',system-ui,-apple-system,sans-serif;
  --c24-max:1000px;}
.c24 *{box-sizing:border-box;}
.c24 .c24-content{padding:32px 80px 96px 188px;font-family:var(--c24-sans);}
@media(max-width:900px){.c24 .c24-content{padding:24px 20px 60px;}}

/* topbar · igual patrón que Edubig / INE */
.c24 .c24-topbar{max-width:var(--c24-max);display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:36px;flex-wrap:wrap;}
.c24 .c24-cat-chip{display:inline-flex;align-items:center;gap:8px;font-family:var(--c24-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#3960a8;border:1px solid rgba(47,107,255,.55);border-radius:2px;padding:6px 10px;}
.c24 .c24-cat-dot{width:6px;height:6px;background:#2f6bff;border-radius:50%;display:inline-block;}

/* utilidades */
.c24 .mono{font-family:var(--c24-mono);font-size:12.5px;}
.c24 .mono.small{font-size:10.5px;letter-spacing:.1em;}
.c24 .mono.uc{text-transform:uppercase;letter-spacing:.14em;}
.c24 .mono.bold{font-family:var(--c24-mono-med);}
.c24 .dim{color:var(--c24-dim);}
.c24 .c24-pink{color:var(--c24-pink);}
.c24 .c24-azul{color:var(--c24-azul);}
.c24 .c24-gris{color:var(--c24-dim);}

/* header / cover */
.c24 .c24-header{max-width:var(--c24-max);padding:clamp(24px,4vw,56px) 0 0;}
.c24 .c24-crumbs{display:flex;flex-wrap:wrap;gap:14px;align-items:baseline;font-family:var(--c24-mono);font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--c24-dim);}
.c24 .c24-crumb-pink{color:var(--c24-pink);}
.c24 .c24-crumb.dim{color:var(--c24-dim);}
.c24 .c24-h1{margin:22px 0 0;font-family:var(--c24-mono-med);font-weight:500;font-size:clamp(34px,6vw,64px);line-height:1.04;letter-spacing:-.025em;text-wrap:balance;max-width:20ch;color:var(--c24-ink);}
.c24 .c24-hook{margin-top:clamp(30px,4vw,44px);display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(20px,3vw,40px);}
.c24 .c24-hooklabel{font-family:var(--c24-mono);font-size:10.5px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;margin-bottom:10px;}
.c24 .c24-hook p{margin:0;font-family:var(--c24-sans);font-size:clamp(15.5px,1.6vw,17px);line-height:1.55;color:var(--c24-body);text-wrap:pretty;}

.c24 .c24-meta{margin:clamp(34px,4.5vw,52px) 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1px;background:var(--c24-line);border:1px solid var(--c24-line);}
.c24 .c24-meta>div{background:#fafaf7;padding:18px 18px 20px;}
.c24 .c24-meta dt{font-family:var(--c24-mono);font-size:10px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--c24-dim);}
.c24 .c24-meta dd{margin:0;}
.c24 .c24-meta .c24-meta-v{margin-top:9px;font-family:var(--c24-sans);font-size:15px;line-height:1.35;font-weight:500;color:var(--c24-ink);}
.c24 .c24-meta .c24-meta-n{margin-top:4px;font-family:var(--c24-sans);font-size:13px;line-height:1.4;color:var(--c24-dim);}

.c24 .c24-indice{margin-top:clamp(34px,4.5vw,52px);border-top:1px solid var(--c24-ink);padding-top:16px;}
.c24 .c24-indice-label{font-family:var(--c24-mono);font-size:10px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--c24-dim);margin-bottom:16px;}
.c24 .c24-indice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px 28px;}
.c24 .c24-indice-row{display:flex;gap:12px;align-items:baseline;font-family:var(--c24-sans);font-size:14px;line-height:1.35;color:var(--c24-body);}

/* marco separador */
.c24 .c24-marco{max-width:var(--c24-max);margin-top:clamp(64px,9vw,120px);font-family:var(--c24-mono);font-size:10.5px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--c24-dim);}

/* stage */
.c24 .c24-stage{max-width:var(--c24-max);margin-top:clamp(28px,5vw,64px);}
.c24 .c24-stage.last{margin-bottom:24px;}
.c24 .c24-stagehead{border-top:1px solid var(--c24-ink);padding-top:14px;display:flex;flex-wrap:wrap;gap:8px 26px;align-items:baseline;}
.c24 .c24-stagehead .mono{flex:none;}
.c24 .c24-stage-title{margin:0;font-family:var(--c24-mono-med);font-size:clamp(23px,3.2vw,32px);line-height:1.12;font-weight:500;letter-spacing:-.015em;color:var(--c24-ink);flex:1 1 320px;min-width:0;}
.c24 .c24-two{margin-top:22px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(20px,3vw,40px);}
.c24 .c24-two p{margin:0;font-family:var(--c24-sans);font-size:16px;line-height:1.62;color:var(--c24-body);text-wrap:pretty;}
.c24 .c24-two p strong{font-weight:500;color:var(--c24-ink);}
.c24 .c24-lead{margin:22px 0 0;font-family:var(--c24-sans);font-size:16px;line-height:1.62;color:var(--c24-body);max-width:64ch;text-wrap:pretty;}
.c24 .c24-lead a{color:var(--c24-pink);text-decoration:none;border-bottom:1px solid rgba(229,23,124,.35);}
.c24 .c24-lead a:hover{color:#B60F60;border-bottom-color:#B60F60;}

/* STAGE 02 · roles */
.c24 .c24-roles{margin-top:26px;border:1px solid var(--c24-line);padding:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;}
.c24 .c24-role-v{margin-top:8px;font-family:var(--c24-sans);font-size:14.5px;line-height:1.5;color:var(--c24-body);}

/* STAGE 03 · inventario */
.c24 .c24-inv{margin-top:24px;border-top:1px solid var(--c24-line);}
.c24 .c24-inv-row{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:14px 24px;padding:14px 0;border-bottom:1px solid var(--c24-line);align-items:baseline;}
.c24 .c24-inv-l{display:flex;gap:12px;align-items:baseline;min-width:0;}
.c24 .c24-inv-l .mono{color:#A0A0A8;flex:none;}
.c24 .c24-inv-t{font-family:var(--c24-sans);font-size:15.5px;line-height:1.4;font-weight:500;color:var(--c24-ink);}
.c24 .c24-inv-v{font-size:13px;line-height:1.45;color:var(--c24-soft);min-width:0;}

/* STAGE 04 · proceso */
.c24 .c24-procesos{margin-top:28px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(16px,2.5vw,28px);}
.c24 .c24-procesos figure{margin:0;}
.c24 .c24-procesos figcaption,.c24 .c24-fig figcaption{margin-top:12px;display:flex;flex-wrap:wrap;gap:6px 12px;font-family:var(--c24-sans);font-size:13.5px;line-height:1.5;color:var(--c24-soft);}
.c24 .c24-procesos figcaption .mono,.c24 .c24-fig figcaption .mono{flex:none;}
.c24 .c24-procesos figcaption>span:last-child,.c24 .c24-fig figcaption>span:last-child{flex:1 1 200px;min-width:0;}
.c24 .c24-giro{margin-top:26px;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;}
.c24 .c24-giro-card{border:1px solid var(--c24-line);padding:18px;}
.c24 .c24-giro-head{display:flex;gap:10px;align-items:center;}
.c24 .c24-giro-dot{width:12px;height:12px;border-radius:50%;flex:none;display:block;}
.c24 .c24-giro-v{margin-top:10px;font-family:var(--c24-sans);font-size:14.5px;line-height:1.5;color:var(--c24-body);}

/* marco de figura */
.c24 .c24-frame{border:1px solid var(--c24-line);background:var(--c24-frame-bg);padding:14px;}
.c24 .c24-frame img{display:block;width:100%;height:auto;}

/* STAGE 05 · paleta */
.c24 .c24-paleta{margin-top:28px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;}
.c24 .c24-swatch{border:1px solid var(--c24-line);}
.c24 .c24-swatch-chip{height:86px;}
.c24 .c24-swatch-body{padding:12px;font-family:var(--c24-sans);}
.c24 .c24-swatch-name{font-size:13.5px;font-weight:500;line-height:1.3;color:var(--c24-ink);}
.c24 .c24-swatch-body .mono{margin-top:4px;font-size:11.5px;}
.c24 .c24-swatch-role{margin-top:6px;font-size:12.5px;line-height:1.4;color:var(--c24-dim);}
.c24 .c24-typo{margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;}
.c24 .c24-typo-card{border:1px solid var(--c24-line);padding:18px;font-family:var(--c24-sans);}
.c24 .c24-typo-mono{margin-top:12px;font-family:var(--c24-mono-med);font-size:13px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--c24-ink);}
.c24 .c24-typo-note{margin-top:6px;font-family:var(--c24-mono);font-size:12px;}
.c24 .c24-typo-num{margin-top:8px;font-family:var(--c24-sans);font-size:38px;font-weight:500;letter-spacing:-.02em;line-height:1;color:var(--c24-ink);}

/* STAGE 06-08 · lámina + detalle */
.c24 .c24-fig{margin:28px 0 0;}
.c24 .c24-fig-detail{margin-top:20px;}
.c24 .c24-lamina{padding:clamp(16px,3vw,32px);display:flex;justify-content:center;}
.c24 .c24-lamina img{max-width:560px;box-shadow:0 1px 4px rgba(0,0,0,.12);}
.c24 .c24-detail-frame{padding:10px;}
.c24 .c24-detail-crop{overflow:hidden;}
.c24 .c24-detail-crop img{display:block;width:100%;height:auto;}
.c24 .c24-fig-detail-cap{margin-top:10px;font-family:var(--c24-mono);font-size:11px;line-height:1.5;color:var(--c24-dim);}

/* STAGE 09 · comparación */
.c24 .c24-compare{padding:clamp(16px,3vw,32px);display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:clamp(16px,2.5vw,28px);align-items:start;}
.c24 .c24-compare img{width:100%;box-shadow:0 1px 4px rgba(0,0,0,.12);}
.c24 .c24-compare-head{margin-bottom:10px;}
.c24 .c24-h3{margin:clamp(40px,5vw,60px) 0 0;font-family:var(--c24-mono-med);font-size:clamp(19px,2.2vw,22px);line-height:1.2;font-weight:500;letter-spacing:-.01em;color:var(--c24-ink);}
.c24 .c24-modulos{margin-top:26px;display:flex;flex-direction:column;gap:22px;}
.c24 .c24-modulo{}
.c24 .c24-modulo-head{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline;margin-bottom:10px;}
.c24 .c24-modulo-cmp{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;}
.c24 .c24-modulo-side{display:flex;flex-direction:column;gap:8px;}
.c24 .c24-modulo-side .c24-frame{padding:8px;}
.c24 .c24-modulo-lbl{font-size:9.5px;letter-spacing:.08em;}
.c24 .c24-modulo-desc{margin:10px 0 0;font-family:var(--c24-sans);font-size:14.5px;line-height:1.55;color:var(--c24-soft);max-width:70ch;text-wrap:pretty;}
.c24 .c24-modulos-cap{margin-top:16px;display:flex;flex-wrap:wrap;gap:6px 12px;font-family:var(--c24-sans);font-size:13.5px;line-height:1.5;color:var(--c24-soft);}
.c24 .c24-modulos-cap .mono{flex:none;}
.c24 .c24-modulos-cap>span:last-child{flex:1 1 260px;min-width:0;}

.c24 .c24-balance{margin-top:clamp(36px,4.5vw,52px);border-top:1px solid var(--c24-ink);padding-top:16px;}
.c24 .c24-balance-head{margin-bottom:6px;}
.c24 .c24-balance-row{display:grid;grid-template-columns:minmax(0,.75fr) minmax(0,1fr) minmax(0,1fr);gap:10px 24px;padding:16px 0;border-bottom:1px solid var(--c24-line);align-items:baseline;}
.c24 .c24-balance-t{font-family:var(--c24-sans);font-size:15px;line-height:1.35;font-weight:500;color:var(--c24-ink);}
.c24 .c24-balance-grado{margin-top:6px;font-size:9.5px;letter-spacing:.14em;}
.c24 .c24-balance-nuestra{font-family:var(--c24-sans);font-size:14.5px;line-height:1.55;color:var(--c24-body);min-width:0;text-wrap:pretty;}
.c24 .c24-balance-oficial{font-family:var(--c24-sans);font-size:14.5px;line-height:1.55;color:var(--c24-soft);min-width:0;text-wrap:pretty;}

.c24 .c24-footer{margin-top:40px;display:flex;flex-wrap:wrap;gap:10px 28px;font-family:var(--c24-mono);font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--c24-dim);}
.c24 .c24-footer a{color:var(--c24-pink);text-decoration:none;border-bottom:1px solid rgba(229,23,124,.35);}
.c24 .c24-footer a:hover{color:#B60F60;border-bottom-color:#B60F60;}

/* responsivo */
@media(max-width:900px){
  .c24 .c24-hook,.c24 .c24-two{grid-template-columns:1fr;}
  .c24 .c24-inv-row{grid-template-columns:1fr;gap:6px;}
  .c24 .c24-balance-row{grid-template-columns:1fr;gap:8px;}
  .c24 .c24-modulo-cmp{grid-template-columns:1fr;}
  .c24 .c24-compare{grid-template-columns:1fr;}
  .c24 .c24-h1{font-size:clamp(28px,7vw,44px);}
}
`;
