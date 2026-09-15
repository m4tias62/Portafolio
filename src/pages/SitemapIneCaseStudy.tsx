import { useEffect, useRef, useState } from 'react';
import ProgressBar, { tickCount } from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';

import sitemapTreeCrop from '@/assets/sitemap-ine/sitemap-tree-crop.jpg';

/**
 * SitemapIneCaseStudy — case study dedicado del rediseño del sitemap del
 * portal Censo 2024 del INE (rediseñado 2026-09-15 desde una maqueta de
 * Claude Design auditada por el usuario en contenido y forma).
 *
 * Ajustes de writing sobre la maqueta original: tono más técnico y menos
 * literario (menos frases-eslogan), y se retiró el párrafo de cierre que
 * al autor no le convenció.
 *
 * Estructura: 10 stages numeradas. Cada stage con encabezado Mono chico
 * `Stage NN · Título · NN/10`, dos columnas (cuerpo + pull-quote), figura
 * enmarcada 1/4/4/1 con `Fig. NN` al pie. Sin la regla "Sigue" al final —
 * la aprendizaje que dejó el rediseño de Edubig se aplica desde el arranque.
 *
 * Sistema del portafolio conservado (regla del 2026-09-11): NavBar (la pone
 * App), BackButton con label "Volver al listado", regla vertical
 * (ProgressBar) + `pl-[188px]`. Fuentes IBM Plex Mono/Sans con los nombres
 * EXACTOS registrados en `src/index.css`.
 *
 * Todo el CSS propio vive bajo `.si` para no filtrarse al resto del sitio.
 */

// ─── DATA ──────────────────────────────────────────────────────────────────

const META: [string, string][] = [
  ['Rol', 'Diseñador UX en Globallys'],
  ['Cliente', 'Instituto Nacional de Estadísticas'],
  ['Alcance', 'Fase 1 de 4 · un entregable de doce'],
  ['Entregable', 'Documento de arquitectura de la información (sitemap propuesto)'],
];

type L1 = { n: string; k: string; d: string };
const L1_ROUTES: L1[] = [
  { n: '01', k: 'Inicio', d: 'deja de ser un menú con doce puertas y pasa a ser una entrada con jerarquía.' },
  { n: '02', k: 'Resultados', d: 'abre a la tríada dashboard + mapa + descarga.' },
  { n: '03', k: 'Documentación', d: 'centraliza metodología, cuestionarios y boletines para eliminar duplicidades entre secciones.' },
  { n: '04', k: 'Sobre el Censo', d: 'agrupa lo institucional.' },
  { n: '05', k: 'Noticias', d: 'queda como canal de actualidad, no como archivo.' },
];

const OLD_MENU_WIDTHS = [88, 62, 74, 95, 58, 80, 68, 91, 55, 77, 64, 84];

type FaseItem = { t: string; mark: string; mine?: boolean };
type Fase = { k: string; dur: string; items: FaseItem[] };

const FASES: Fase[] = [
  {
    k: 'Fase 1 · Arquitectura de información', dur: '2 semanas',
    items: [
      { t: 'Documento de arquitectura de la información (sitemap propuesto)', mark: 'Mi entregable', mine: true },
      { t: 'Wireframes navegables de baja fidelidad', mark: '' },
      { t: 'Informe de hallazgos del card sorting y co-diseño', mark: '' },
      { t: 'Informe de recomendaciones de accesibilidad temprana', mark: '' },
    ],
  },
  {
    k: 'Fase 2 · Sistema de diseño en plantillas clave', dur: '1 semana',
    items: [
      { t: '5 pantallas en mediana fidelidad con el KIT UI', mark: '' },
      { t: 'Versiones responsive para móvil', mark: '' },
      { t: 'Anotaciones de accesibilidad para desarrollo', mark: '' },
    ],
  },
  {
    k: 'Fase 3 · Vistas nuevas y búsqueda', dur: '2 semanas',
    items: [
      { t: 'Pantallas en alta fidelidad', mark: '' },
      { t: 'Propuesta de componentes e íconos nuevos', mark: '' },
      { t: 'Documento técnico: buscador interno y chatbot', mark: '' },
    ],
  },
  {
    k: 'Fase 4 · Presentación ejecutiva', dur: '1 semana',
    items: [
      { t: 'Presentación ejecutiva final', mark: '' },
      { t: 'Informe de impacto del rediseño UX/UI', mark: '' },
    ],
  },
];

const MIS_ACTIVIDADES: [string, string][] = [
  ['Mapeo de recursos actuales y futuros', 'Inventario de contenidos del portal: qué existe, qué se publica después y dónde está repetido.'],
  ['Evaluación de duplicidades, jerarquías y flujos', 'Qué se solapa, qué nivel le corresponde a cada cosa y por dónde se llega a los resultados.'],
];

type Bench = {
  pais: string; inicio: string; h1: string; clicks: string;
  visor: string; mapa: string; descarga: string; breadcrumb: string;
  buena: string; riesgo: string; isFocus?: boolean;
};

const BENCH: Bench[] = [
  { pais: 'Bolivia',    inicio: 'Home',    h1: 'NO', clicks: '1', visor: 'Embebido', mapa: 'Externo',   descarga: 'Índice de enlaces',        breadcrumb: 'NO', buena: 'Orden en los tabulados',                    riesgo: 'Sin H1 ni breadcrumb' },
  { pais: 'Paraguay',   inicio: 'Home',    h1: 'SÍ', clicks: '1', visor: 'Embebido', mapa: 'No',        descarga: 'PDF',                       breadcrumb: 'SÍ', buena: 'Integra video y gráficos',                  riesgo: 'Página única pesada; sin mapas ni microdatos' },
  { pais: 'Brasil',     inicio: 'Landing', h1: 'SÍ', clicks: '1', visor: 'Externo',  mapa: 'Integrado', descarga: 'Microdatos',                breadcrumb: 'SÍ', buena: 'H1 claro; microdatos disponibles',          riesgo: 'Visualizador externo; datos duplicados' },
  { pais: 'Uruguay',    inicio: 'Landing', h1: 'SÍ', clicks: '2', visor: 'Embebido', mapa: 'Integrado', descarga: 'Microdatos y diccionarios', breadcrumb: 'SÍ', buena: 'Dashboard y geoportal integrados',          riesgo: 'Pantallas sin H1' },
  { pais: 'Costa Rica', inicio: 'Landing', h1: 'SÍ', clicks: '1', visor: 'Externo',  mapa: 'No',        descarga: 'PDF',                       breadcrumb: 'SÍ', buena: 'Breadcrumb y H1; info centralizada',        riesgo: 'Sin paneles 2022; tecnología antigua' },
  { pais: 'Ecuador',    inicio: 'Home',    h1: 'NO', clicks: '3', visor: 'Externo',  mapa: 'Externo',   descarga: 'Tabulados y hojas de cálculo', breadcrumb: 'NO', buena: 'Recursos variados; orden en tabulados',  riesgo: 'Muchos clics; recursos dispersos' },
  { pais: 'Chile',      inicio: 'Home',    h1: 'SÍ', clicks: '2', visor: 'Externo',  mapa: 'Externo',   descarga: 'Sí',                        breadcrumb: 'SÍ', buena: 'H1 visible; recursos claros',               riesgo: 'Breadcrumb incompleto; sin microdatos', isFocus: true },
  { pais: 'Argentina',  inicio: 'Home',    h1: 'SÍ', clicks: '2', visor: 'Externo',  mapa: 'Integrado', descarga: 'Microdatos y tabulados',    breadcrumb: 'SÍ', buena: 'Índice de descargas; microdatos',           riesgo: 'Resultados duplicados; navegación poco integrada' },
];

type Metric = { k: string; big: string; unit: string; bar: string; note: string };
const METRICS: Metric[] = [
  { k: 'Umbral de éxito por tarea', big: '80%', unit: 'o más, en 3 clicks', bar: '80%', note: 'Criterio de aceptación propuesto en el kit, no resultado medido.' },
  { k: 'Umbral de confusión por etiqueta', big: '30%', unit: 'máximo por etiqueta', bar: '30%', note: 'Sobre ese umbral, la etiqueta se renombra o se reubica de nivel.' },
];

type ProtoStep = { n: string; k: string; d: string; arrow: string };
const PROTOCOLO: ProtoStep[] = [
  { n: '01', k: 'Card sorting abierto', d: 'Mín. 2 perfiles, 5 personas por perfil.', arrow: '→' },
  { n: '02', k: 'Árbol candidato', d: 'La propuesta entregada como hipótesis a probar.', arrow: '→' },
  { n: '03', k: 'Tareas de validación', d: 'Misma batería en cada versión del árbol.', arrow: '→' },
  { n: '04', k: 'Ajuste de etiquetas', d: 'Sobre 30% de confusión: renombrar o reubicar.', arrow: '' },
];

const REGLAS: [string, string][] = [
  ['01', 'Máximo seis o siete ítems por menú.'],
  ['02', 'Nombres cortos, orientados a tarea, no a área organizacional.'],
  ['03', 'Breadcrumb que refleje la jerarquía real, no atajos.'],
  ['04', 'La tríada de Resultados siempre visible como entradas pares de L2.'],
  ['05', 'Descargas con tipo, peso y fecha declarados antes del clic — no descubierto después.'],
];

type ConsRow = { menu: string; h1: string; url: string; bc: string };
const CONSISTENCIA: ConsRow[] = [
  { menu: 'Resultados › Dashboard de indicadores', h1: 'Dashboard de indicadores Censo 2024', url: '/resultados-dashboard/',       bc: 'Inicio › Resultados › Dashboard de indicadores › Resultados principales' },
  { menu: 'Resultados › Descargar tablas',         h1: 'Descargar tablas',                    url: '/resultados/descargas',          bc: 'Inicio › Resultados › Descargar tablas' },
  { menu: 'Censo › Etapas previas',                h1: 'Participación intercultural',          url: '/participacion-intercultural/',   bc: 'Inicio › Censo › Etapas previas › Participación intercultural' },
];

type WcagFrente = { n: string; k: string; t: string };
const WCAG: WcagFrente[] = [
  { n: '01', k: 'Estructura semántica',     t: 'Un H1 por página, jerarquía H2/H3 consistente; listas y tablas con roles y cabeceras.' },
  { n: '02', k: 'Navegación por teclado',   t: 'Foco visible en todos los controles: menús, filtros, pestañas y tablas.' },
  { n: '03', k: 'Contraste AA sostenido',   t: 'En todos los estados, incluidos hover y focus.' },
  { n: '04', k: 'Alt text obligatorio',     t: 'En toda imagen no decorativa.' },
  { n: '05', k: 'Enlaces descriptivos',     t: 'Nunca «ver más» suelto: el texto del enlace declara su destino.' },
  { n: '06', k: 'Aviso explícito',          t: 'Cuando un embebido abre en pestaña nueva o cuando una descarga es pesada.' },
];

type TimelineItem = { n: string; k: string; s: string; done: boolean };
const TIMELINE: TimelineItem[] = [
  { n: '01', k: 'Inventario de contenidos',    s: 'Mío · hecho',           done: true },
  { n: '02', k: 'Duplicidades y jerarquías',    s: 'Mío · hecho',           done: true },
  { n: '03', k: 'Árbol + reglas + kit',         s: 'Mío · entregado',       done: true },
  { n: '04', k: 'Card sorting y validación',    s: 'Fuera de mi alcance',   done: false },
  { n: '05', k: 'Fases 2 a 4',                  s: 'Fuera de mi alcance',   done: false },
  { n: '06', k: 'Implementación',               s: 'Fuera de mi alcance',   done: false },
];

// ─── COMPONENTE ────────────────────────────────────────────────────────────

export default function SitemapIneCaseStudy({ onBack }: { onBack: () => void }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const el = e.target as HTMLVideoElement;
        if (e.isIntersecting) el.play().catch(() => {}); else el.pause();
      }),
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
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
    <div className="si bg-[#fafaf7] min-h-screen relative">
      <style>{CSS}</style>

      {/* Regla vertical — misma navegación que el resto de los proyectos */}
      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center max-[900px]:hidden"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical ticks={tickCount(10)} />
      </div>

      <div ref={contentRef} className="si-content">
        <div className="si-topbar">
          <BackButton onClick={onBack} label="Volver al listado" />
          <span className="si-cat-chip" aria-label="Categoría UX-UI">
            <span className="si-cat-dot" />UX-UI
          </span>
        </div>

        {/* ─── STAGE 01 · COVER ────────────────────────────────────────── */}
        <section className="si-stage">
          <StageHead n="01" title="Sitemap INE" step="01 / 10" />
          <p className="si-cover-premise">
            El rediseño del portal del Censo 2024 se planificó en cuatro fases y doce entregables.
            Mi alcance fue uno.
          </p>
          <h1 className="si-cover-h1">Propuse el árbol del portal del Censo.</h1>
          <p className="si-cover-lead">
            Documento de arquitectura de la información — el sitemap propuesto — para el portal
            Censo 2024 del Instituto Nacional de Estadísticas. Un entregable de la Fase 1, como
            diseñador UX en Globallys · 2025. Las fases siguientes y la implementación del sitio
            no pasaron por mí.
          </p>

          <dl className="si-meta">
            {META.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>

          <div className="si-cover-tree">
            <span className="si-l0">Inicio (L0)</span>
            <span className="si-l0-line-v" />
            <span className="si-l0-line-h" />
            <div className="si-l1-row">
              {L1_ROUTES.map((r) => (
                <div className="si-l1-slot" key={r.k}>
                  <span className="si-l1-line-v" />
                  <span className="si-l1-node">{r.k}</span>
                  <span className="mono uc small dim">L1</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STAGE 02 · LA PREGUNTA ─────────────────────────────────── */}
        <section className="si-stage">
          <StageHead n="02" title="La pregunta" step="02 / 10" />
          <div className="si-two">
            <div className="si-two-l">
              <p>
                El portal anterior arrastraba capas acumuladas censo tras censo: menús de doce
                ítems, publicaciones duplicadas entre secciones, arquitectura calcada de la
                estructura interna del organismo — no de las preguntas de la ciudadanía.
              </p>
              <p>
                El inventario de contenidos lo dejó a la vista: el problema no era falta de
                contenido, sino distancia entre cómo el INE se organiza por dentro y cómo alguien
                afuera busca un dato.
              </p>
              <p>
                El documento no propuso más contenido. Propuso un árbol nuevo que asume que del
                otro lado hay preguntas, no organigramas.
              </p>
            </div>
            <aside className="si-two-r">
              <p className="si-pull">
                Una arquitectura de información que espeja el organigrama le pide al visitante que
                conozca el organismo antes de encontrar el dato.
              </p>
              <p className="mono uc small dim">Morville &amp; Rosenfeld</p>
            </aside>
          </div>

          <figure className="si-fig">
            <div className="si-frame">
              <div className="si-antes-despues">
                <div className="si-ad-col">
                  <span className="mono uc small dim">Antes · menú de 12 ítems</span>
                  <div className="si-old-menu">
                    {OLD_MENU_WIDTHS.map((w, i) => (
                      <div className="si-old-row" key={i}>
                        <span className="mono small dim">{String(i + 1).padStart(2, '0')}</span>
                        <span className="si-old-bar" style={{ maxWidth: `${w}%` }} />
                      </div>
                    ))}
                  </div>
                  <p className="si-ad-note">
                    Doce puertas al mismo nivel, ordenadas por área organizacional. Publicaciones
                    repetidas en dos y tres secciones.
                  </p>
                </div>
                <div className="si-ad-col">
                  <span className="mono uc small blue">Después · 5 rutas orientadas a tarea</span>
                  <div className="si-new-menu">
                    {L1_ROUTES.map((r) => (
                      <div className="si-new-row" key={r.k}>
                        <span className="mono small dim">{r.n}</span>
                        <span className="mono blue">{r.k}</span>
                      </div>
                    ))}
                  </div>
                  <p className="si-ad-note">
                    Cinco entradas que nombran la tarea del visitante, no el área que produce el
                    contenido.
                  </p>
                </div>
              </div>
            </div>
            <figcaption className="si-fcap">
              <span className="si-figlabel">Fig. 01 · Del organigrama a la pregunta</span>
              <p>
                Estructura anterior contra la propuesta. El conteo de ítems no es el problema en
                sí: el problema es que ninguno de los doce responde una pregunta formulada desde
                afuera.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 03 · EL ALCANCE ──────────────────────────────────── */}
        <section className="si-stage">
          <StageHead n="03" title="El alcance, dicho antes que nada" step="03 / 10" />
          <div className="si-two">
            <div className="si-two-l">
              <p>
                El proyecto se planificó en cuatro fases: arquitectura de información, aplicación
                del sistema de diseño a plantillas clave, vistas nuevas con recomendaciones de
                búsqueda, y presentación ejecutiva.
              </p>
              <p>
                Como diseñador UX en Globallys hice <strong>un entregable de la Fase 1: el documento
                de arquitectura de la información con el sitemap propuesto.</strong> Dos semanas de
                trabajo.
              </p>
              <p>
                Dentro de esa fase mis actividades fueron dos: el <strong>mapeo de recursos actuales
                y futuros</strong> — el inventario de contenidos — y la <strong>evaluación de
                duplicidades, jerarquías y flujos de navegación</strong>. De ahí salió el árbol.
              </p>
              <p>
                No hice los wireframes, no conduje el taller de co-diseño ni el card sorting con
                usuarios, no diseñé plantillas ni vistas nuevas, no escribí las recomendaciones de
                buscador, no presenté el cierre y no implementé el sitio. Todo lo que viene en las
                stages siguientes cabe dentro de ese entregable — y nada más.
              </p>
            </div>
            <aside className="si-two-r">
              <p className="si-pull">
                El perímetro del trabajo se declara antes que su contenido: una fase, un
                entregable, dos semanas.
              </p>
            </aside>
          </div>

          <figure className="si-fig">
            <div className="si-frame">
              <div className="si-fases">
                {FASES.map((f) => (
                  <div className="si-fase" key={f.k}>
                    <span className="mono blue si-fase-k">{f.k}</span>
                    <span className="mono uc small dim">{f.dur}</span>
                    <div className="si-fase-items">
                      {f.items.map((d, i) => (
                        <div className={'si-fase-item' + (d.mine ? ' is-mine' : '')} key={i}>
                          <span className="si-fase-dot" />
                          <div>
                            <div className="si-fase-t">{d.t}</div>
                            {d.mark && <div className="mono uc small acc si-fase-mark">{d.mark}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="si-mis-actividades">
                <span className="mono uc small acc">Mis actividades dentro de la Fase 1</span>
                <div className="si-actividades-grid">
                  {MIS_ACTIVIDADES.map(([k, d]) => (
                    <div className="si-actividad" key={k}>
                      <div className="mono si-actividad-k">{k}</div>
                      <div className="si-actividad-d">{d}</div>
                    </div>
                  ))}
                  <div className="si-actividad-out">
                    <span className="mono dim">→</span>
                    <div className="mono blue">Documento de arquitectura de la información<br />(sitemap propuesto)</div>
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="si-fcap">
              <span className="si-figlabel">Fig. 02 · Doce entregables, uno mío</span>
              <p>
                El plan completo del rediseño con mi entregable marcado, y las dos actividades de
                la fase que me tocaron. Lo demás lo hicieron otras personas del equipo de Globallys
                y del INE, en fases que no me tocaron.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 04 · BENCHMARK ───────────────────────────────────── */}
        <section className="si-stage">
          <StageHead n="04" title="Benchmark regional" step="04 / 10" />
          <div className="si-two">
            <div className="si-two-l">
              <p>
                La fase partió con un benchmark regional de ocho portales estadísticos: Bolivia,
                Paraguay, Brasil, Uruguay, Costa Rica, Ecuador, Argentina y Chile — este último
                auditado como un caso más, no como el punto de partida.
              </p>
              <p>
                Cada portal se auditó con las mismas columnas: tipo de inicio, H1 visible, clicks
                al primer resultado, tipo de visualizador, mapa/geoportal, descarga de datos,
                breadcrumb. La grilla se cerró con dos columnas de opinión — buenas prácticas y
                riesgos —, para no salir con puros datos y ninguna postura.
              </p>
              <p>
                De ahí emergió la tríada <strong>dashboard + mapa interactivo + descarga de
                tabulados</strong> como el patrón dominante, y quedaron mapeadas las carencias que
                Chile debía cubrir. La grilla entró al trabajo como insumo: contra ella se contrastó
                el inventario de recursos del portal para decidir qué tenía que existir en el árbol.
              </p>
            </div>
            <aside className="si-two-r">
              <p className="si-pull">
                Una grilla sin columna de opinión es un inventario. Con opinión, es un argumento.
              </p>
            </aside>
          </div>

          <figure className="si-fig">
            <div className="si-frame si-frame-tight">
              <div className="si-bench-wrap">
                <div className="si-bench">
                  <div className="si-bench-head">
                    <span className="si-bench-c pais">País</span>
                    <span className="si-bench-c ini">Tipo de inicio</span>
                    <span className="si-bench-c h1">H1</span>
                    <span className="si-bench-c clicks">Clicks</span>
                    <span className="si-bench-c visor">Visualizador</span>
                    <span className="si-bench-c mapa">Mapa / geoportal</span>
                    <span className="si-bench-c desc">Descarga</span>
                    <span className="si-bench-c bc">Breadcrumb</span>
                    <span className="si-bench-c op blue">Buena práctica</span>
                    <span className="si-bench-c op acc">Riesgo</span>
                  </div>
                  {BENCH.map((b) => (
                    <div className="si-bench-row" key={b.pais}>
                      <span className={'si-bench-c pais mono ' + (b.isFocus ? 'acc' : 'blue')}>{b.pais}</span>
                      <span className="si-bench-c ini">{b.inicio}</span>
                      <span className="si-bench-c h1 mono">{b.h1}</span>
                      <span className="si-bench-c clicks mono">{b.clicks}</span>
                      <span className="si-bench-c visor">{b.visor}</span>
                      <span className="si-bench-c mapa">{b.mapa}</span>
                      <span className="si-bench-c desc">{b.descarga}</span>
                      <span className="si-bench-c bc mono">{b.breadcrumb}</span>
                      <span className="si-bench-c op blue">{b.buena}</span>
                      <span className="si-bench-c op acc">{b.riesgo}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="si-bench-foot">
                <span className="mono uc small dim">Patrón dominante</span>
                <span className="mono blue">dashboard + mapa interactivo + descarga de tabulados</span>
              </div>
            </div>
            <figcaption className="si-fcap">
              <span className="si-figlabel">Fig. 03 · Grilla de auditoría regional</span>
              <p>
                Ocho portales por siete columnas de auditoría más las dos de opinión. La grilla es
                el insumo con el que se justificó la tríada de Resultados.{' '}
                <a href="https://docs.google.com/spreadsheets/d/1lYmXGqdN25I1GN9sEPuowuBiaNa-zEkgNpA8tIMmYQU/edit?gid=565267240#gid=565267240" target="_blank" rel="noopener noreferrer">
                  Benchmark completo en Sheets
                </a>.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 05 · LOS UMBRALES ────────────────────────────────── */}
        <section className="si-stage">
          <StageHead n="05" title="Los umbrales que propuse" step="05 / 10" />
          <div className="si-two">
            <div className="si-two-l">
              <p>
                El documento no entregó solo un árbol. Entregó también el instrumento para
                refutarlo: un kit de validación con los criterios de aceptación escritos <em>antes</em> de
                la prueba.
              </p>
              <p>
                80% o más de éxito por tarea en tres clicks. Cualquier etiqueta con más de 30% de
                confusión se renombra o se reubica.
              </p>
              <p>
                Escribir el umbral antes de testear evita defender una etiqueta por gusto. El card
                sorting con usuarios y la validación del árbol estaban planificados en la Fase 1;
                no los conduje yo y no tengo resultados que reportar. Mi parte fue dejar la
                propuesta y la vara con la que se mide.
              </p>
            </div>
            <aside className="si-two-r">
              <p className="si-pull">
                Una propuesta sin umbral es una opinión. El umbral es lo que la vuelve refutable.
              </p>
            </aside>
          </div>

          <figure className="si-fig">
            <div className="si-frame si-frame-blue">
              <div className="si-metrics">
                {METRICS.map((q) => (
                  <div className="si-metric" key={q.k}>
                    <span className="mono uc small si-metric-k">{q.k}</span>
                    <span className="si-metric-big">{q.big}</span>
                    <span className="mono si-metric-unit">{q.unit}</span>
                    <div className="si-metric-track"><div className="si-metric-fill" style={{ width: q.bar }} /></div>
                    <p className="si-metric-note">{q.note}</p>
                  </div>
                ))}
              </div>
              <div className="si-protocolo">
                <span className="mono uc small si-protocolo-k">Protocolo propuesto en el kit</span>
                <div className="si-protocolo-row">
                  {PROTOCOLO.map((f) => (
                    <div className="si-protocolo-step" key={f.n}>
                      <span className="mono small si-step-n">{f.n}</span>
                      <span className="si-step-line" />
                      <span className="mono si-step-k">{f.k}</span>
                      <span className="si-step-d">{f.d}</span>
                      {f.arrow && <span className="si-step-arrow">{f.arrow}</span>}
                    </div>
                  ))}
                </div>
                <p className="mono small si-protocolo-note">Instrumento entregado, no ejecutado por mí.</p>
              </div>
            </div>
            <figcaption className="si-fcap">
              <span className="si-figlabel">Fig. 04 · Criterios de aceptación, no resultados</span>
              <p>
                Los dos umbrales del kit de validación y el protocolo que el documento propone para
                aplicarlos. Son la vara, no la medición: no hay porcentajes de test que pueda
                reportar como míos.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 06 · EL ÁRBOL ────────────────────────────────────── */}
        <section className="si-stage">
          <StageHead n="06" title="El árbol" step="06 / 10" />
          <div className="si-two">
            <div className="si-two-l">
              <p>
                El árbol propuesto colapsa la maraña anterior en cinco rutas de nivel 1:{' '}
                <strong>Inicio, Resultados, Documentación, Sobre el Censo y Noticias.</strong>
              </p>
              <ul className="si-l1-list">
                {L1_ROUTES.map((r) => (
                  <li key={r.k}>
                    <span className="si-l1-dash">—</span>
                    <span><strong className="mono">{r.k}</strong> {r.d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="si-two-r">
              <p className="si-pull">
                El criterio fue duro: responder «¿dónde encuentro los resultados?», «¿cómo descargo
                los datos?» o «¿cuál fue la metodología?» sin navegar más de dos niveles.
              </p>
              <p className="mono uc small dim">Krug · no me hagas pensar</p>
            </aside>
          </div>

          <figure className="si-fig">
            <div className="si-frame si-frame-tree">
              <img src={sitemapTreeCrop} alt="Árbol completo del sitemap propuesto para el portal Censo 2024: Inicio (L0) abre a Resultados, Documentación, Sobre el Censo y Noticias en L1, con sus subniveles L2, L3 y L4." />
            </div>
            <figcaption className="si-fcap">
              <span className="si-figlabel">Fig. 05 · Árbol propuesto L0→L4</span>
              <p>
                Cinco rutas de nivel 1 — Inicio, Resultados, Documentación, Sobre el Censo,
                Noticias — con la tríada de Resultados como entradas pares de L2 y los breadcrumbs
                escritos en el mismo diagrama. Dibujado en MIRO; se recorre en horizontal.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 07 · REGLAS DE CONSISTENCIA ──────────────────────── */}
        <section className="si-stage">
          <StageHead n="07" title="Reglas de consistencia" step="07 / 10" />
          <div className="si-two">
            <div className="si-two-l">
              <p>
                Un sitemap no basta: hay que asegurar que menú, H1, URL y breadcrumb digan lo
                mismo con distintas formas. Un usuario que llega desde Google, otro que navega por
                menú y otro que revisa un breadcrumb tienen que llegar al mismo nombre para la
                misma página.
              </p>
              <p>El documento cierra con un playbook de reglas.</p>
              <div className="si-reglas">
                {REGLAS.map(([n, t]) => (
                  <div className="si-regla-row" key={n}>
                    <span className="mono small acc">{n}</span>
                    <p>{t}</p>
                  </div>
                ))}
              </div>
            </div>
            <aside className="si-two-r">
              <p className="si-pull">
                Tipo, peso y fecha declarados antes del clic. La información que evita una sorpresa
                vive antes del clic, no después.
              </p>
            </aside>
          </div>

          <figure className="si-fig">
            <div className="si-frame si-frame-tight">
              <div className="si-cons-wrap">
                <div className="si-cons">
                  <div className="si-cons-head">
                    <span className="si-cons-c menu">Menú</span>
                    <span className="si-cons-c h1">H1</span>
                    <span className="si-cons-c url">URL</span>
                    <span className="si-cons-c bc">Breadcrumb</span>
                  </div>
                  {CONSISTENCIA.map((c, i) => (
                    <div className="si-cons-row" key={i}>
                      <span className="si-cons-c menu mono blue">{c.menu}</span>
                      <span className="si-cons-c h1">{c.h1}</span>
                      <span className="si-cons-c url mono">{c.url}</span>
                      <span className="si-cons-c bc mono">{c.bc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <figcaption className="si-fcap">
              <span className="si-figlabel">Fig. 06 · Menú = H1 = URL = breadcrumb</span>
              <p>
                Tres páginas con sus cuatro nombres alineados, tal como quedaron escritas en el
                árbol. Es lo que convierte el sitemap en algo verificable: si una fila no cuadra,
                la página se renombra.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 08 · ACCESIBILIDAD ───────────────────────────────── */}
        <section className="si-stage">
          <StageHead n="08" title="Accesibilidad WCAG 2.2 AA" step="08 / 10" />
          <div className="si-two">
            <div className="si-two-l">
              <p>
                WCAG 2.2 AA era el piso declarado del proyecto, y la accesibilidad no podía quedar
                para el final. Mi parte no fue auditarla: fue escribirla como condición de la
                arquitectura, en la última página del kit, antes de que existiera una sola
                plantilla.
              </p>
            </div>
            <aside className="si-two-r">
              <p className="si-pull">
                WCAG 2.2 AA no entró como auditoría de cierre. Entró como condición de la
                propuesta.
              </p>
            </aside>
          </div>

          <figure className="si-fig">
            <div className="si-frame">
              <div className="si-wcag">
                {WCAG.map((w) => (
                  <div className="si-wcag-cell" key={w.n}>
                    <div className="si-wcag-head">
                      <span className="mono small acc">{w.n}</span>
                      <span className="mono blue si-wcag-k">{w.k}</span>
                    </div>
                    <p>{w.t}</p>
                  </div>
                ))}
              </div>
              <p className="mono small dim si-wcag-note">
                Seis frentes propuestos al portal, documentados en la página 5 del kit de
                validación.
              </p>
            </div>
            <figcaption className="si-fcap">
              <span className="si-figlabel">Fig. 07 · Los frentes de accesibilidad</span>
              <p>
                No es una auditoría con hallazgos: es la lista de condiciones que el documento le
                pide a cada plantilla del portal antes de diseñarla.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 09 · LO QUE QUEDÓ EN PRODUCCIÓN ──────────────────── */}
        <section className="si-stage">
          <StageHead n="09" title="Lo que quedó en producción" step="09 / 10" />
          <div className="si-two">
            <div className="si-two-l">
              <p>
                El portal publicado en{' '}
                <a href="https://censo2024.ine.gob.cl/" target="_blank" rel="noopener noreferrer" className="mono">censo2024.ine.gob.cl</a>{' '}
                tiene hoy cuatro secciones de nivel 1 — <strong>Inicio, Resultados, Censo y
                Noticias</strong> —, con Documentación absorbida dentro de Censo.
              </p>
              <p>
                Eso se parece a lo que propuse: la misma tríada en Resultados, la consolidación
                que el documento recomendaba, una L1 menos. No puedo atribuirme la implementación:
                no la hice ni acompañé las fases siguientes, y entre un documento entregado y un
                sitio publicado hay decisiones de equipo, de desarrollo y de plazo que no pasaron
                por mi escritorio.
              </p>
              <p>
                Lo honesto es dejar las dos cosas al lado: el árbol que entregué y el árbol que
                está arriba. La comparación la puede hacer cualquiera, y por eso el enlace va
                abierto.
              </p>
            </div>
            <aside className="si-two-r">
              <p className="si-pull">
                No es mi implementación. Es mi propuesta, comparable con lo que hoy está publicado.
              </p>
            </aside>
          </div>

          <figure className="si-fig">
            <div className="si-videoframe">
              <video ref={videoRef} src="/sitemap-ine-recorrido.mp4" muted controls playsInline preload="metadata" />
            </div>
            <figcaption className="si-fcap">
              <span className="si-figlabel">Fig. 08 · El portal publicado, como punto de comparación</span>
              <p>
                Recorrido por el sitio en operación. No es el entregable ni su resultado
                atribuible: es la referencia contra la cual mirar la propuesta.{' '}
                <a href="https://censo2024.ine.gob.cl/" target="_blank" rel="noopener noreferrer">
                  Verificar en censo2024.ine.gob.cl
                </a>.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── STAGE 10 · EL BORDE DEL ENTREGABLE ─────────────────────── */}
        <section className="si-stage last">
          <StageHead n="10" title="El borde del entregable" step="10 / 10" />
          <div className="si-two">
            <div className="si-two-l">
              <p>
                Hice el documento de arquitectura: benchmark regional, árbol propuesto de L0 a L4,
                reglas de consistencia y el kit con los umbrales de validación y los frentes de
                accesibilidad. Dos semanas, un entregable, Fase 1.
              </p>
              <p>
                No hice wireframes, taller de co-diseño, card sorting, plantillas UI, vistas
                nuevas, recomendaciones de buscador, presentación ejecutiva ni implementación.
              </p>
              <p>
                Lo que queda abierto no es mi pendiente: es el de quien tome el documento. Correr
                la validación con los umbrales escritos, y revisar el árbol contra el uso real del
                portal. El test predice; la analítica confirma o refuta.
              </p>
            </div>
            <aside className="si-two-r">
              <p className="si-pull">
                El test predice. La analítica confirma o refuta. Ninguna de las dos la corrí yo.
              </p>
            </aside>
          </div>

          <figure className="si-fig">
            <div className="si-frame">
              <div className="si-timeline">
                {TIMELINE.map((s) => (
                  <div className="si-timeline-step" key={s.n}>
                    <span className="mono uc small dim">{s.n}</span>
                    <div className="si-timeline-mark">
                      <span className={'si-timeline-dot ' + (s.done ? 'done' : 'pending')} />
                      <span className="si-timeline-line" />
                    </div>
                    <span className="mono si-timeline-k">{s.k}</span>
                    <span className={'si-timeline-s ' + (s.done ? 'dim' : 'acc')}>{s.s}</span>
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="si-fcap">
              <span className="si-figlabel">Fig. 09 · Tres hechos y tres fuera de alcance</span>
              <p>
                Puntos rellenos: dentro del entregable. Huecos: fuera de alcance.
              </p>
            </figcaption>
          </figure>
        </section>
      </div>
    </div>
  );
}

// ─── PIEZAS AUXILIARES ────────────────────────────────────────────────────

function StageHead({ n, title, step }: { n: string; title: string; step: string }) {
  return (
    <div className="si-stagehead">
      <span className="mono uc small acc bold">Stage {n}</span>
      <span className="mono uc small dim">·</span>
      <span className="mono uc small">{title}</span>
      <span className="si-stagehead-rule" />
      <span className="mono uc small dim">{step}</span>
    </div>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────

const CSS = `
.si{color:var(--si-ink);
  --si-ink:#1a1a18;--si-body:#3c3934;--si-soft:#57544c;--si-dim:#6d6a62;
  --si-line:rgba(26,26,24,.14);--si-line-soft:rgba(26,26,24,.12);
  --si-acc:#C4251A;--si-blue:#1f3d5c;
  --si-frame-bg:#f4f2ec;
  --si-mono:'IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --si-mono-med:'IBM Plex Mono:Medium','IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --si-sans:'IBM Plex Sans:Regular',system-ui,-apple-system,sans-serif;
  --si-max:1000px;}
.si *{box-sizing:border-box;}
.si .si-content{padding:32px 80px 96px 188px;}
@media(max-width:900px){.si .si-content{padding:24px 20px 60px;}}

/* topbar */
.si .si-topbar{max-width:var(--si-max);display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:36px;flex-wrap:wrap;}
.si .si-cat-chip{display:inline-flex;align-items:center;gap:8px;font-family:var(--si-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#4a7a4a;border:1px solid rgba(95,143,95,.55);border-radius:2px;padding:6px 10px;}
.si .si-cat-dot{width:6px;height:6px;background:#5f8f5f;border-radius:50%;display:inline-block;}

/* utilidades */
.si .mono{font-family:var(--si-mono);font-size:12.5px;}
.si .mono.small{font-size:10px;letter-spacing:.1em;}
.si .mono.uc{text-transform:uppercase;letter-spacing:.12em;}
.si .mono.bold{font-family:var(--si-mono-med);}
.si .dim{color:var(--si-dim);}
.si .blue{color:var(--si-blue);}
.si .acc{color:var(--si-acc);}

/* stages */
.si .si-stage{max-width:var(--si-max);padding:clamp(48px,7vw,96px) 0;border-top:1px solid var(--si-line);}
.si .si-stage:first-of-type{padding-top:clamp(56px,9vw,120px);border-top:none;}
.si .si-stage.last{padding-bottom:24px;}
.si .si-stagehead{display:flex;align-items:baseline;gap:12px;margin-bottom:clamp(26px,3.4vw,40px);flex-wrap:nowrap;}
.si .si-stagehead-rule{flex:1 1 auto;height:1px;background:var(--si-line);}

/* dos columnas · cuerpo + pull-quote */
.si .si-two{display:flex;flex-wrap:wrap;gap:clamp(24px,3.4vw,48px);margin-bottom:clamp(32px,4vw,56px);}
.si .si-two-l{flex:1 1 380px;min-width:0;display:flex;flex-direction:column;gap:16px;}
.si .si-two-l p{margin:0;font-family:var(--si-sans);font-size:15.5px;line-height:1.66;color:var(--si-body);text-wrap:pretty;}
.si .si-two-l p strong{font-weight:500;color:var(--si-ink);}
.si .si-two-l p em{font-style:italic;color:var(--si-ink);}
.si .si-two-l a{color:#0958D9;border-bottom:1px solid rgba(9,88,217,.32);text-decoration:none;}
.si .si-two-l a:hover{color:var(--si-ink);border-bottom-color:var(--si-ink);}
.si .si-two-r{flex:1 1 230px;min-width:0;max-width:330px;border-left:1px solid var(--si-acc);padding-left:22px;}
.si .si-pull{margin:0;font-family:var(--si-mono);font-size:13px;line-height:1.62;color:var(--si-ink);text-wrap:pretty;}
.si .si-two-r p+p{margin-top:14px;}

/* figuras — marco 1/4/4/1 sobre cremita */
.si .si-fig{margin:0;display:flex;flex-direction:column;gap:14px;}
.si .si-frame{border:1px solid var(--si-ink);border-right-width:4px;border-bottom-width:4px;background:var(--si-frame-bg);padding:clamp(22px,3vw,38px);}
.si .si-frame-tight{padding:clamp(16px,2vw,24px);}
.si .si-frame-blue{background:var(--si-blue);padding:clamp(26px,3.6vw,48px) clamp(22px,3vw,40px);color:#fafaf7;}
.si .si-frame-tree{background:#fdfdfb;overflow-x:auto;overflow-y:hidden;padding:0;}
.si .si-frame-tree img{display:block;width:2200px;max-width:none;height:auto;}
.si .si-fcap{display:flex;flex-direction:column;gap:7px;}
.si .si-figlabel{font-family:var(--si-mono);font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--si-ink);}
.si .si-fcap p{margin:0;font-family:var(--si-sans);font-size:13px;line-height:1.55;color:var(--si-dim);max-width:74ch;text-wrap:pretty;}
.si .si-fcap a{color:#0958D9;border-bottom:1px solid rgba(9,88,217,.32);text-decoration:none;}
.si .si-fcap a:hover{color:var(--si-ink);border-bottom-color:var(--si-ink);}

/* STAGE 01 · Cover */
.si .si-cover-premise{max-width:56ch;margin:0 0 clamp(22px,3vw,34px);font-family:var(--si-sans);font-size:clamp(14.5px,1.3vw,16px);line-height:1.6;color:var(--si-soft);}
.si .si-cover-h1{margin:0;font-family:var(--si-mono-med);font-weight:500;font-size:clamp(32px,5.6vw,62px);line-height:1.04;letter-spacing:-.022em;color:var(--si-ink);max-width:22ch;}
.si .si-cover-lead{max-width:64ch;margin:clamp(26px,3.4vw,40px) 0 0;font-family:var(--si-sans);font-size:clamp(15px,1.35vw,17px);line-height:1.62;color:var(--si-body);}
.si .si-meta{display:flex;flex-wrap:wrap;gap:1px;margin:clamp(40px,5vw,64px) 0 0;background:var(--si-line);border:1px solid var(--si-line);}
.si .si-meta>div{flex:1 1 200px;min-width:0;background:#fafaf7;padding:18px 20px 20px;}
.si .si-meta dt{font-family:var(--si-mono);font-size:9.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--si-dim);margin-bottom:9px;}
.si .si-meta dd{margin:0;font-family:var(--si-sans);font-size:14px;line-height:1.45;color:var(--si-ink);}

.si .si-cover-tree{margin-top:clamp(44px,6vw,80px);border:1px solid var(--si-ink);border-right-width:4px;border-bottom-width:4px;background:var(--si-frame-bg);padding:clamp(24px,3.4vw,44px) clamp(20px,3vw,40px);display:flex;flex-direction:column;align-items:center;gap:0;overflow:hidden;}
.si .si-l0{font-family:var(--si-mono);font-size:11px;letter-spacing:.08em;color:#fafaf7;background:var(--si-blue);padding:7px 16px 6px;}
.si .si-l0-line-v{width:1px;height:26px;background:rgba(26,26,24,.28);display:block;}
.si .si-l0-line-h{width:100%;height:1px;background:rgba(26,26,24,.28);display:block;}
.si .si-l1-row{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;width:100%;}
.si .si-l1-slot{flex:0 1 auto;display:flex;flex-direction:column;align-items:center;}
.si .si-l1-line-v{width:1px;height:22px;background:rgba(26,26,24,.28);display:block;}
.si .si-l1-node{font-family:var(--si-mono);font-size:11.5px;letter-spacing:.02em;color:var(--si-blue);border:1px solid rgba(31,61,92,.5);padding:6px 12px 5px;background:#fafaf7;white-space:nowrap;}
.si .si-l1-slot .mono{margin-top:7px;}

/* STAGE 02 · Antes/Después */
.si .si-antes-despues{display:flex;flex-wrap:wrap;gap:1px;background:rgba(26,26,24,.16);}
.si .si-ad-col{flex:1 1 260px;min-width:0;background:var(--si-frame-bg);padding:clamp(18px,2.4vw,28px);display:flex;flex-direction:column;gap:14px;}
.si .si-old-menu{display:flex;flex-direction:column;gap:6px;}
.si .si-old-row{display:flex;align-items:center;gap:10px;}
.si .si-old-row .mono{width:16px;}
.si .si-old-bar{flex:1 1 auto;height:9px;background:rgba(26,26,24,.13);display:block;}
.si .si-new-menu{display:flex;flex-direction:column;gap:9px;}
.si .si-new-row{display:flex;align-items:center;gap:10px;}
.si .si-new-row .mono:first-child{width:16px;}
.si .si-ad-note{margin:6px 0 0;font-family:var(--si-sans);font-size:12.5px;line-height:1.55;color:var(--si-dim);}

/* STAGE 03 · Fases */
.si .si-fases{display:flex;flex-wrap:wrap;gap:1px;background:rgba(26,26,24,.16);}
.si .si-fase{flex:1 1 240px;min-width:0;background:var(--si-frame-bg);padding:18px 20px 22px;display:flex;flex-direction:column;gap:6px;}
.si .si-fase-k{font-size:11.5px;letter-spacing:.02em;}
.si .si-fase-items{display:flex;flex-direction:column;gap:9px;margin-top:8px;}
.si .si-fase-item{display:flex;gap:9px;align-items:flex-start;}
.si .si-fase-dot{flex:0 0 7px;width:7px;height:7px;margin-top:5px;background:transparent;border:1px solid rgba(26,26,24,.3);display:block;}
.si .si-fase-item.is-mine .si-fase-dot{background:var(--si-acc);border-color:var(--si-acc);}
.si .si-fase-t{font-family:var(--si-sans);font-size:12.5px;line-height:1.45;color:var(--si-dim);}
.si .si-fase-item.is-mine .si-fase-t{color:var(--si-ink);}
.si .si-fase-mark{margin-top:5px;}
.si .si-mis-actividades{margin-top:clamp(20px,2.6vw,30px);padding-top:18px;border-top:1px solid var(--si-line);display:flex;flex-direction:column;gap:16px;}
.si .si-actividades-grid{display:flex;flex-wrap:wrap;align-items:stretch;gap:14px;}
.si .si-actividad{flex:1 1 260px;min-width:0;border-left:1px solid var(--si-acc);padding-left:16px;}
.si .si-actividad-k{font-size:12px;line-height:1.4;color:var(--si-ink);}
.si .si-actividad-d{margin-top:6px;font-family:var(--si-sans);font-size:12px;line-height:1.5;color:var(--si-dim);}
.si .si-actividad-out{flex:1 1 200px;min-width:0;display:flex;align-items:center;gap:12px;padding-left:2px;}
.si .si-actividad-out .mono:first-child{font-size:14px;}
.si .si-actividad-out .mono.blue{font-size:12px;line-height:1.4;}

/* STAGE 04 · Benchmark */
.si .si-bench-wrap{overflow-x:auto;padding-bottom:14px;}
.si .si-bench{min-width:max-content;}
.si .si-bench-head,.si .si-bench-row{display:flex;gap:1px;background:rgba(26,26,24,.2);border-bottom:1px solid var(--si-line);}
.si .si-bench-c{background:var(--si-frame-bg);padding:10px 12px;font-family:var(--si-sans);font-size:11.5px;line-height:1.45;color:var(--si-soft);}
.si .si-bench-head .si-bench-c{padding:10px 12px;font-family:var(--si-mono);font-size:9.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--si-dim);}
.si .si-bench-head .si-bench-c.op.blue{color:var(--si-blue);}
.si .si-bench-head .si-bench-c.op.acc{color:var(--si-acc);}
.si .si-bench-c.pais{flex:0 0 108px;}
.si .si-bench-c.ini{flex:0 0 104px;}
.si .si-bench-c.h1{flex:0 0 56px;}
.si .si-bench-c.clicks{flex:0 0 66px;}
.si .si-bench-c.visor{flex:0 0 106px;}
.si .si-bench-c.mapa{flex:0 0 120px;}
.si .si-bench-c.desc{flex:0 0 172px;}
.si .si-bench-c.bc{flex:0 0 100px;}
.si .si-bench-c.op{flex:0 0 190px;}
.si .si-bench-row .si-bench-c.mono{font-family:var(--si-mono);font-size:12px;}
.si .si-bench-row .si-bench-c.op.blue{color:var(--si-blue);}
.si .si-bench-row .si-bench-c.op.acc{color:#8c2f22;}
.si .si-bench-foot{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px;margin-top:18px;padding-top:14px;border-top:1px solid var(--si-line);}
.si .si-bench-foot .mono.blue{font-size:12.5px;}

/* STAGE 05 · Umbrales */
.si .si-metrics{display:flex;flex-wrap:wrap;gap:1px;background:rgba(250,250,247,.22);}
.si .si-metric{flex:1 1 280px;min-width:0;background:var(--si-blue);padding:clamp(4px,1vw,10px) clamp(14px,2vw,26px) clamp(8px,1.2vw,14px);display:flex;flex-direction:column;gap:0;}
.si .si-metric-k{color:rgba(250,250,247,.62);margin-bottom:14px;}
.si .si-metric-big{font-family:var(--si-mono-med);font-weight:500;font-size:clamp(40px,6.4vw,74px);line-height:1;letter-spacing:-.03em;color:#fafaf7;}
.si .si-metric-unit{font-size:13px;line-height:1.5;color:#f0c9c4;margin-top:12px;}
.si .si-metric-track{margin-top:20px;height:6px;background:rgba(250,250,247,.18);}
.si .si-metric-fill{height:6px;background:var(--si-acc);}
.si .si-metric-note{margin:12px 0 0;font-family:var(--si-sans);font-size:12.5px;line-height:1.55;color:rgba(250,250,247,.72);}
.si .si-protocolo{margin-top:clamp(24px,3.2vw,38px);padding-top:18px;border-top:1px solid rgba(250,250,247,.22);display:flex;flex-direction:column;gap:16px;}
.si .si-protocolo-k{color:rgba(250,250,247,.62);}
.si .si-protocolo-row{display:flex;flex-wrap:wrap;gap:20px;padding-bottom:16px;}
.si .si-protocolo-step{flex:1 1 176px;min-width:0;display:flex;flex-direction:column;gap:9px;position:relative;}
.si .si-step-n{color:rgba(250,250,247,.45);}
.si .si-step-line{height:1px;background:rgba(250,250,247,.32);}
.si .si-step-k{font-size:11.5px;line-height:1.4;color:#fafaf7;padding-top:2px;}
.si .si-step-d{font-family:var(--si-sans);font-size:11px;line-height:1.45;color:rgba(250,250,247,.66);}
.si .si-step-arrow{position:absolute;right:-14px;top:32px;font-family:var(--si-mono);font-size:12px;color:rgba(250,250,247,.4);}
.si .si-protocolo-note{color:#f0c9c4;}

/* STAGE 06 · Árbol como lista */
.si .si-l1-list{list-style:none;margin:4px 0;padding:0;display:flex;flex-direction:column;gap:11px;}
.si .si-l1-list li{display:flex;gap:12px;}
.si .si-l1-dash{font-family:var(--si-mono);font-size:14px;color:var(--si-acc);line-height:1.5;}
.si .si-l1-list li>span:last-child{font-family:var(--si-sans);font-size:15px;line-height:1.6;color:var(--si-body);}
.si .si-l1-list strong{font-family:var(--si-mono);font-weight:500;font-size:.92em;color:var(--si-ink);}

/* STAGE 07 · Consistencia */
.si .si-reglas{display:flex;flex-direction:column;gap:1px;background:rgba(26,26,24,.14);border-top:1px solid var(--si-line);border-bottom:1px solid var(--si-line);margin-top:4px;}
.si .si-regla-row{background:#fafaf7;display:flex;gap:14px;padding:13px 2px;}
.si .si-regla-row .mono{padding-top:3px;letter-spacing:.06em;}
.si .si-regla-row p{margin:0;font-family:var(--si-sans);font-size:14px;line-height:1.55;color:var(--si-body);}
.si .si-cons-wrap{overflow-x:auto;padding-bottom:14px;}
.si .si-cons{min-width:max-content;}
.si .si-cons-head,.si .si-cons-row{display:flex;gap:1px;background:rgba(26,26,24,.2);border-bottom:1px solid var(--si-line);}
.si .si-cons-c{background:var(--si-frame-bg);padding:13px 12px;font-family:var(--si-sans);font-size:12px;line-height:1.45;color:var(--si-ink);}
.si .si-cons-head .si-cons-c{padding:10px 12px;font-family:var(--si-mono);font-size:9.5px;letter-spacing:.11em;text-transform:uppercase;color:var(--si-dim);}
.si .si-cons-c.menu{flex:0 0 206px;}
.si .si-cons-c.h1{flex:0 0 196px;}
.si .si-cons-c.url{flex:0 0 178px;word-break:break-all;}
.si .si-cons-c.bc{flex:0 0 256px;}
.si .si-cons-row .si-cons-c.menu.mono{font-family:var(--si-mono);font-size:11.5px;color:var(--si-blue);}
.si .si-cons-row .si-cons-c.url.mono{font-family:var(--si-mono);font-size:11px;color:var(--si-soft);}
.si .si-cons-row .si-cons-c.bc.mono{font-family:var(--si-mono);font-size:11px;color:var(--si-soft);line-height:1.5;}

/* STAGE 08 · WCAG */
.si .si-wcag{display:flex;flex-wrap:wrap;gap:1px;background:rgba(26,26,24,.16);}
.si .si-wcag-cell{flex:1 1 250px;min-width:0;background:var(--si-frame-bg);padding:18px 20px 20px;display:flex;flex-direction:column;gap:9px;}
.si .si-wcag-head{display:flex;align-items:baseline;gap:9px;}
.si .si-wcag-k{font-size:12px;letter-spacing:.01em;}
.si .si-wcag-cell p{margin:0;font-family:var(--si-sans);font-size:13px;line-height:1.55;color:var(--si-soft);}
.si .si-wcag-note{margin:clamp(18px,2.4vw,28px) 0 0;padding-top:14px;border-top:1px solid var(--si-line);font-size:11.5px;line-height:1.6;max-width:72ch;}

/* STAGE 09 · Video */
.si .si-videoframe{border:1px solid var(--si-ink);border-right-width:4px;border-bottom-width:4px;overflow:hidden;background:#0f0f0e;display:block;line-height:0;}
.si .si-videoframe video{display:block;width:100%;height:auto;}

/* STAGE 10 · Timeline */
.si .si-timeline{display:flex;flex-wrap:wrap;gap:0;}
.si .si-timeline-step{flex:1 1 152px;min-width:140px;padding-right:14px;display:flex;flex-direction:column;gap:9px;}
.si .si-timeline-mark{display:flex;align-items:center;gap:0;margin-bottom:2px;}
.si .si-timeline-dot{flex:0 0 9px;width:9px;height:9px;border-radius:50%;display:block;}
.si .si-timeline-dot.done{background:var(--si-blue);}
.si .si-timeline-dot.pending{border:1px solid var(--si-acc);background:transparent;}
.si .si-timeline-line{flex:1 1 auto;height:1px;background:rgba(26,26,24,.22);}
.si .si-timeline-k{font-family:var(--si-mono);font-size:12px;line-height:1.35;color:var(--si-ink);}
.si .si-timeline-s{font-family:var(--si-sans);font-size:11px;line-height:1.4;}
.si .si-timeline-s.dim{color:var(--si-dim);}
.si .si-timeline-s.acc{color:var(--si-acc);}

/* responsivo */
@media(max-width:900px){
  .si .si-two-r{border-left:none;padding-left:0;border-top:1px solid var(--si-acc);padding-top:22px;max-width:none;}
  .si .si-antes-despues,.si .si-fases,.si .si-wcag{flex-direction:column;}
  .si .si-timeline{flex-direction:column;gap:16px;}
  .si .si-cover-tree{padding:20px 16px;}
  .si .si-frame-tree img{width:1400px;}
}
`;
