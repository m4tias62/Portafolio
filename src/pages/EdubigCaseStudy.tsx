import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import ProgressBar, { tickCount } from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';

import logo from '@/assets/edubig/logo.png';
import bocetoToggle from '@/assets/edubig/boceto-toggle.jpg';
import formalizacionLogo from '@/assets/edubig/formalizacion-logo.png';
import fotoColegio from '@/assets/edubig/colegio-graham-bell-foto.jpg';

import personaCarolina from '@/assets/edubig/persona-carolina.png';
import personaMartin from '@/assets/edubig/persona-martin.png';
import personaTomas from '@/assets/edubig/persona-tomas-francisca.png';

import scHomeLista from '@/assets/edubig/screen-home-lista.jpg';
import scFichaTop from '@/assets/edubig/screen-ficha-top.jpg';
import scQ1 from '@/assets/edubig/screen-q1.jpg';
import scLoading from '@/assets/edubig/screen-loading.jpg';
import scShortlist from '@/assets/edubig/screen-shortlist.jpg';
import scCompTop from '@/assets/edubig/screen-comparacion-top.jpg';
import scCompCuerpo from '@/assets/edubig/screen-comparacion-cuerpo.jpg';

import v2CompararEsc from '@/assets/edubig/v2-comparar-escritorio.jpg';
import v2CompararDetalle from '@/assets/edubig/v2-comparar-detalle.jpg';
import v2CompararMovil from '@/assets/edubig/v2-comparar-movil.jpg';
import v2Home from '@/assets/edubig/v2-home-escritorio.jpg';
import v2Ficha from '@/assets/edubig/v2-ficha-escritorio.jpg';
import v2Shortlist from '@/assets/edubig/v2-shortlist-movil.jpg';
import v2Q5 from '@/assets/edubig/v2-test-q5-movil.jpg';
import v2Flujo1 from '@/assets/edubig/v2-flujo-1-mapa.jpg';
import v2Flujo2 from '@/assets/edubig/v2-flujo-2-test.jpg';
import v2Flujo3 from '@/assets/edubig/v2-flujo-3-ficha.jpg';
import v2Flujo4 from '@/assets/edubig/v2-flujo-4-comparar.jpg';

/**
 * EdubigCaseStudy — case study dedicado de Edubig.
 *
 * Rediseño 2026-10-20: traspaso de la maqueta de Claude Design
 * (`Claude outputs/edubig-rediseno/03-maqueta-edubig.html`). Ocho etapas con el
 * titular de cada etapa como h2, grilla de 12 columnas (máx. 1180 px) y cinco
 * proporciones cerradas para los medios: escritorio 16:10, celular 9:19,5,
 * diagrama 2:1 o 3:2 y cuadrado 1:1. Los bitmaps antiguos de 300×650 px nunca
 * se muestran a más de 150 px de ancho.
 *
 * Diferencias con la maqueta:
 *   - NavBar, regla vertical (ProgressBar) y «Siguiente proyecto» son los
 *     componentes compartidos del portafolio, no copias locales.
 *   - Los videos de los prototipos son grabaciones nuevas dentro de una maqueta
 *     de dispositivo sobre blanco: van juntos en un panel blanco a ancho completo,
 *     con la misma altura (celular 1:2, escritorio 16:10).
 *   - La foto de la tarjeta del colegio es un recorte de la tarjeta original
 *     (294×139 px, se muestra a ≤ 270 px) en vez de un placeholder.
 *   - El video del pipeline usa su propio poster.
 *
 * Fuentes oficiales del portafolio: 'IBM Plex Mono:Regular' / 'IBM Plex Mono:Medium'
 * y 'IBM Plex Sans:Regular' (nombres registrados en index.css). Todo el CSS vive
 * bajo `.eb` para no filtrarse al resto del sitio.
 */

// ─── DATA ──────────────────────────────────────────────────────────────────

type Persona = {
  n: string;
  nombre: string;
  comuna: string;
  perfil: string;
  cita: string;
  retrato: string;
  meta: [string, string][];
  dolores: { dolor: string; sev: string; efecto: string }[];
  implicaciones: string[];
};

const PERSONAS: Persona[] = [
  {
    n: '01',
    nombre: 'Carolina Muñoz',
    comuna: 'Pudahuel',
    perfil: 'La mamá práctica',
    retrato: personaCarolina,
    cita: '«A mí no me vengan con siglas ni números raros que no entiendo; solo necesito saber si el colegio es gratis, si a mi hijo le queda a una pura micro y si va a estar tranquilo sin que nadie me lo ande molestando».',
    meta: [
      ['Edad', '36 años'],
      ['Trabajo', 'Auxiliar de aseo'],
      ['Familia', 'Madre soltera, 2 hijos (8 y 14)'],
      ['Equipo', 'Android, sin computador en casa'],
    ],
    dolores: [
      { dolor: 'No entiende el lenguaje técnico: GSE, IDPS, SIMCE y RBD son siglas sin significado para ella.', sev: 'Crítica', efecto: 'Bloquea el uso' },
      { dolor: 'No tiene computador: toda su navegación es en celular y los portales oficiales no están optimizados para móvil.', sev: 'Crítica', efecto: 'Bloquea el acceso' },
      { dolor: 'Información fragmentada: comparar dos colegios exige abrir cuatro portales distintos.', sev: 'Alta', efecto: 'Genera abandono' },
      { dolor: 'Presión de tiempo: el SAE tiene plazos rígidos y no tiene semanas para investigar.', sev: 'Alta', efecto: 'Genera ansiedad' },
      { dolor: 'Desconfianza de «los números»: sabe que los rankings pueden engañar, pero no tiene herramientas para evaluar por sí misma.', sev: 'Media', efecto: 'Genera inseguridad' },
    ],
    implicaciones: [
      'Lenguaje simple primero, técnico después. Nunca «IDPS: 78»; sí «Bienestar escolar: alto — los estudiantes reportan sentirse seguros y acompañados».',
      'Filtro de gratuidad como primer nivel, no enterrado en filtros avanzados.',
      'Mapa como interfaz principal de búsqueda: la proximidad es su criterio número uno y necesita verla espacialmente.',
    ],
  },
  {
    n: '02',
    nombre: 'Tomás y Francisca',
    comuna: 'Providencia',
    perfil: 'La pareja investigadora',
    retrato: personaTomas,
    cita: '«Un ranking general o un puntaje aislado no nos dice nada. Necesitamos comparar datos objetivos en el tiempo frente a colegios equivalentes, para evaluar tanto la exigencia académica como el bienestar socioemocional de nuestra hija».',
    meta: [
      ['Edad', '39 y 37 años'],
      ['Trabajo', 'Ingeniero comercial · psicóloga clínica'],
      ['Familia', '1 hija (5 años, entrando a 1° básico)'],
      ['Equipo', 'Alfabetización digital alta; planillas propias'],
    ],
    dolores: [
      { dolor: 'La comparación es manual y agotadora: horas cruzando datos de cuatro fuentes en su propia planilla.', sev: 'Crítica', efecto: 'Es su dolor central' },
      { dolor: 'Desconfianza de rankings simplistas: han visto listados de «mejores colegios» que contradicen lo que ven en terreno.', sev: 'Alta', efecto: 'Genera escepticismo' },
      { dolor: 'Incertidumbre de interpretación: Francisca leyó el IDPS, pero no sabe si 72 en clima escolar es bueno para un colegio de ese GSE.', sev: 'Alta', efecto: 'Genera parálisis' },
      { dolor: 'Tensión de pareja: Tomás se inclina por el mejor SIMCE, Francisca por el mejor IDPS, y no tienen cómo ponderar ambas dimensiones.', sev: 'Alta', efecto: 'Genera ansiedad' },
    ],
    implicaciones: [
      'El comparador es su feature killer: tiene que funcionar impecable para este perfil.',
      'Etiquetas contextuales obligatorias. «72 en clima escolar» no dice nada; «sobre el promedio de colegios de su mismo GSE» lo cambia todo.',
      'Link a metodología siempre visible: si no pueden verificar la fuente, no confían — y sin confianza no usan.',
    ],
  },
  {
    n: '03',
    nombre: 'Martín Soto',
    comuna: 'Paine',
    perfil: 'El estudiante que co-decide',
    retrato: personaMartin,
    cita: '«Solo quiero ver desde el teléfono si este colegio de verdad me prepara para sacar buen puntaje en la PAES y si tiene un buen ambiente, sin tener que navegar por páginas complicadas ni leer informes eternos».',
    meta: [
      ['Edad', '16 años'],
      ['Curso', 'Estudiante de III° medio'],
      ['Familia', 'Vive con su madre y su abuela'],
      ['Equipo', 'Android, el único dispositivo de la casa'],
    ],
    dolores: [
      { dolor: 'Las plataformas están diseñadas para adultos: el tono y la complejidad lo expulsan. No se siente el usuario esperado.', sev: 'Crítica', efecto: 'Abandona rápido' },
      { dolor: 'No encuentra rápido lo que le importa: tarda quince minutos en ver resultados PAES en el portal DEMRE.', sev: 'Alta', efecto: 'Genera frustración' },
      { dolor: 'No tiene con quién hablar de esto: su madre no maneja los datos y el orientador no tiene tiempo.', sev: 'Media', efecto: 'Genera aislamiento' },
    ],
    implicaciones: [
      'Velocidad de carga como requisito, no como optimización: su estándar lo fija TikTok, no el portal del ministerio.',
      'Módulo PAES arriba en la ficha de colegios de media, no al final.',
      'Proyecto educativo como identidad, no como documento: «foco en ciencias, taller de robótica, selección de fútbol», no un PDF de veinte páginas.',
    ],
  },
];

type Capa = {
  n: string;
  capa: string;
  stack: string;
  modo: string;
  registro: [string, string][];
};

const CAPAS: Capa[] = [
  {
    n: '01', capa: 'Pipeline de datos', stack: 'Python · Pandas · seis datasets oficiales', modo: 'Modo pedagógico',
    registro: [
      ['Dirigí', 'La escritura del código y el orden en que se cruzan los seis datasets.'],
      ['Generó', 'La explicación del porqué antes del cómo. No entra una línea que no pueda reconstruir solo.'],
      ['Validé', 'Contra las fuentes oficiales, campo por campo.'],
    ],
  },
  {
    n: '02', capa: 'Diseño en Figma', stack: 'Wireframes de media y alta fidelidad · Figma con MCP', modo: 'Modo iterativo',
    registro: [
      ['Dirigí', 'El criterio y la mejora. Los wireframes de media y alta fidelidad, los estados de cada componente y los recorridos completos quedan cerrados acá, antes de que exista una línea de frontend: este archivo es la especificación.'],
      ['Generó', 'Wireframes de partida sobre los que trabajo encima. Su valor es la velocidad de iteración, no la propuesta: acortan el costo de descartar una dirección.'],
      ['Validé', 'Contra los cinco dolores de la investigación, pantalla por pantalla.'],
    ],
  },
  {
    n: '03', capa: 'Frontend', stack: 'Next.js 14 App Router · Tailwind', modo: 'Modo delegado',
    registro: [
      ['Dirigí', 'Reglas de negocio y edge cases: qué pasa cuando un colegio no tiene SIMCE publicado.'],
      ['Generó', 'La implementación contra especificación.'],
      ['Validé', 'El recorrido completo, no el componente aislado.'],
    ],
  },
  {
    n: '04', capa: 'Sistema de diseño', stack: 'tailwind.config.ts · globals.css · web-app/', modo: 'Auditoría',
    registro: [
      ['Dirigí', 'El alcance: qué código se audita y contra qué criterio.'],
      ['Generó', 'La revisión contra WCAG 2.2 AA y los tokens corregidos.'],
      ['Validé', 'Ratio de contraste y objetivo táctil, uno por uno.'],
    ],
  },
];

const USOS_EJE: { tono: string; estado: string; donde: string }[] = [
  { tono: '#2166ac', estado: 'Frío · dato sin traducir', donde: 'Card en estado default dentro de la lista general. Todavía no sabe nada de ti.' },
  { tono: '#d6604d', estado: 'Cálido · en foco', donde: 'Hover sobre la card: cruza al lado cálido porque revela más información que la lista. Era #f4a582 hasta la auditoría de contraste de la etapa 08.2' },
  { tono: '#d6604d', estado: 'Cálido · traducido', donde: 'Cards de la shortlist que devuelve el Test de Calce, armadas contra las necesidades declaradas.' },
  { tono: '#b2181f', estado: 'Cálido · extremo', donde: 'Isologo y marca. El punto de llegada de la traducción.' },
];

const USOS_CUAL: { tono: string; estado: string; donde: string }[] = [
  { tono: '#007d79', estado: 'Colegio 1', donde: 'El primero que agregó la familia. 4,99:1 sobre blanco.' },
  { tono: '#6929c4', estado: 'Colegio 2', donde: 'Cada colegio conserva su color mientras siga en la comparación.' },
  { tono: '#d3354f', estado: 'Colegio 3', donde: 'El máximo en el celular.' },
  { tono: '#012749', estado: 'Colegio 4', donde: 'Solo en escritorio.' },
  { tono: '#1F1F1F', estado: 'Sus similares', donde: 'Marca neutra: la referencia no compite con los colegios.' },
];

type FrameTraduccion = {
  estado: string;
  tono: string;
  url: string;
  alt: string;
  recorte: string;
  nota: string;
};

const FRAMES_TRAD: FrameTraduccion[] = [
  {
    estado: 'Frío · exploración manual', tono: '#2166ac',
    url: scHomeLista,
    alt: 'Home mobile con lista de colegios en cards de borde azul',
    recorte: 'Vista superior · corta tras la primera card',
    nota: 'La lista general. Cards de borde frío: el colegio está ahí porque tú lo buscaste, no porque el sistema lo eligió para ti.',
  },
  {
    estado: 'Puente · el traductor operando', tono: '#9a9a92',
    url: scLoading,
    alt: 'Pantalla de carga con el texto Traduciendo tus respuestas',
    recorte: 'Pantalla completa',
    nota: '«Traduciendo tus respuestas… Estamos comparando tus prioridades con los colegios de tu comuna.» El concepto rector como microcopy funcional.',
  },
  {
    estado: 'Cálido · resultado traducido', tono: '#d6604d',
    url: scShortlist,
    alt: 'Shortlist de tres colegios que calzan, en cards de borde cálido',
    recorte: 'Vista superior · corta tras la primera card',
    nota: 'Misma card, borde cálido y chips de calce. «Estos son los colegios que calzan con tu familia»: el dato ya pasó por las cinco respuestas.',
  },
];

type Contraste = {
  hex: string;
  uso: string;
  ratio: string;
  veredicto: string;
  marca: string;
  tintaVeredicto: string;
};

const CONTRASTE: Contraste[] = [
  { hex: '#1F1F1F', uso: 'Texto principal de ficha y comparación', ratio: '16,5:1', veredicto: 'AA y AAA', marca: '#3d3d38', tintaVeredicto: '#1a1a18' },
  { hex: '#b2181f', uso: 'Extremo cálido del eje. Isologo y acentos de texto', ratio: '6,9:1', veredicto: 'AA texto normal', marca: '#3d3d38', tintaVeredicto: '#1a1a18' },
  { hex: '#0958D9', uso: 'Botones, foco, enlaces', ratio: '6,2:1', veredicto: 'AA texto normal', marca: '#3d3d38', tintaVeredicto: '#1a1a18' },
  { hex: '#2166ac', uso: 'Extremo frío. Bordes de card en lista y barras de pares', ratio: '5,9:1', veredicto: 'AA texto normal', marca: '#3d3d38', tintaVeredicto: '#1a1a18' },
  { hex: '#767676', uso: 'Texto secundario, notas de fuente', ratio: '4,6:1', veredicto: 'AA justo. No bajar de 4,5', marca: '#9a9a92', tintaVeredicto: '#1a1a18' },
  { hex: '#d6604d', uso: 'Cálido medio. Borde de card en shortlist', ratio: '3,7:1', veredicto: 'Solo no textual y texto grande', marca: '#9a9a92', tintaVeredicto: '#1a1a18' },
  { hex: '#4393c3', uso: 'Frío medio. Barras de visualización', ratio: '3,4:1', veredicto: 'Solo no textual', marca: '#9a9a92', tintaVeredicto: '#1a1a18' },
  { hex: '#f4a582', uso: 'Cálido claro. Era el borde de card en hover', ratio: '2,0:1', veredicto: 'Falla incluso como no textual', marca: '#b2181f', tintaVeredicto: '#8a1a20' },
];

type Criterio = {
  sc: string;
  nombre: string;
  estado: string;
  tinta: string;
  borde: string;
  riesgo: string;
  respuesta: string;
};

const CRITERIOS: Criterio[] = [
  {
    sc: 'SC 1.4.1', nombre: 'Uso del color', estado: 'Corregido', tinta: '#1a1a18', borde: 'rgba(26,26,24,0.34)',
    riesgo: 'El eje frío–cálido codifica de dónde vino el dato. Si esa es la única señal, quien no distingue azul de rojo pierde la diferencia entre un colegio que encontró navegando y uno que el sistema le trajo.',
    respuesta: 'La temperatura nunca va sola: la shortlist se anuncia por encabezado («Estos son los colegios que calzan con tu familia») y cada card cálida suma chips de calce que no existen en la lista general.',
  },
  {
    sc: 'SC 1.4.11', nombre: 'Contraste no textual', estado: 'Token retirado', tinta: '#8a1a20', borde: 'rgba(178,24,31,0.44)',
    riesgo: 'El borde de hover en #f4a582 daba 2,0:1 contra blanco. El estado existía en el sistema y era invisible en la pantalla.',
    respuesta: 'El hover pasa a #d6604d (3,7:1) y suma elevación, de modo que el cruce a cálido se sostiene sin depender de un tono que no llega al umbral.',
  },
  {
    sc: 'SC 2.5.8', nombre: 'Tamaño del objetivo', estado: 'Cumple', tinta: '#1a1a18', borde: 'rgba(26,26,24,0.34)',
    riesgo: 'El Test de Calce se responde con una mano, caminando. Opciones chicas o pegadas producen respuestas equivocadas en un cuestionario que después arma la shortlist.',
    respuesta: 'Las opciones son bloques de ancho completo con 44px de alto mínimo y separación propia. El umbral 2.2 pide 24px: el producto lo duplica porque el error no es cosmético, contamina el resultado.',
  },
];

type CapaVal = {
  n: string;
  titulo: string;
  estado: string;
  tinta: string;
  borde: string;
  muestra: string;
  ancho: string;
  tono: string;
  texto: string;
  porque: string;
};

const VALIDACION: CapaVal[] = [
  {
    n: 'Capa 01', titulo: 'Testeo temprano cerrado', estado: 'Cerrada', tinta: '#1a1a18', borde: 'rgba(26,26,24,0.34)',
    muestra: '3 familias', ancho: '12%', tono: '#2166ac',
    texto: 'Tres sesiones tempranas con familias sobre un proto-prototipo que ya no se parece al producto actual. Sirvieron para descartar rumbo, no para validar pantallas.',
    porque: 'Validar iteraciones intermedias produce ruido —falsos positivos por novedad, falsos negativos por incompletitud— y ese ruido habría contaminado las cinco decisiones fuertes que vinieron después.',
  },
  {
    n: 'Capa 02', titulo: 'Análisis heurístico del prototipo 1', estado: 'Cerrada', tinta: '#1a1a18', borde: 'rgba(26,26,24,0.34)',
    muestra: 'Métodos, no personas', ancho: '38%', tono: '#4393c3',
    texto: 'Contraste y objetivos táctiles en WCAG 2.2 AA, heurísticas de Nielsen sobre el recorrido completo, arquitectura de información revisada y un solo nombre para cada cosa —«colegios similares» en todas las pantallas—. De este análisis salieron los cambios del prototipo 2 en datos, flujo y diseño.',
    porque: 'Lo que un método conocido puede encontrar no se le pregunta a una familia. Hacerle gastar una sesión en un problema que una heurística detecta sola es gastar su tiempo y el mío.',
  },
  {
    n: 'Capa 03', titulo: 'Testeo con usuarios reales', estado: 'Fase actual', tinta: '#8a1a20', borde: 'rgba(178,24,31,0.44)',
    muestra: 'Familias reales', ancho: '100%', tono: '#b2181f',
    texto: 'Con el prototipo 2 completo, la fase actual es probarlo con usuarios reales. Israel publica sobre educación chilena para una audiencia directa de familias que buscan colegio.',
    porque: 'Las dos capas anteriores dejaron resuelto lo que un método conocido encuentra solo. Así, el testeo gasta la atención de las familias en lo que solo ellas pueden mostrar.',
  },
];

const SEV: Record<string, string> = { 'Crítica': '#b2181f', 'Alta': '#d6604d', 'Media': '#8a8a85' };

type Flujo = { id: string; titulo: string; url: string; modo: 'fit' | 'scroll'; alt: string; nota: string };

const FLUJOS: Flujo[] = [
  { id: 'mapa', titulo: '1 · Mapa general', url: v2Flujo1, modo: 'fit', alt: 'Diagrama 1 · Mapa general del sitio: puntos de entrada, Home, exploración y conexiones con el Test, la ficha y Comparar', nota: 'Cómo se llega al sitio y cómo se conectan la Home, la exploración, el Test, la ficha y Comparar. Azul es nuevo respecto del prototipo 1; violeta, decidido y pendiente.' },
  { id: 'test', titulo: '2 · Test de Calce', url: v2Flujo2, modo: 'scroll', alt: 'Diagrama 2 · Test de Calce: preguntas Q1 a Q5 y el motor con sus dos capas', nota: 'Las cinco preguntas y el motor: descarta, puntúa y ofrece ampliar la distancia si quedan menos de tres colegios.' },
  { id: 'ficha', titulo: '3 · Ficha', url: v2Flujo3, modo: 'scroll', alt: 'Diagrama 3 · Ficha del colegio: cabecera, Lo esencial y módulos en orden fijo', nota: 'Cabecera, «Lo esencial» y los módulos en orden fijo. En violeta, lo decidido que aún no está en el sitio.' },
  { id: 'comparar', titulo: '4 · Comparar', url: v2Flujo4, modo: 'scroll', alt: 'Diagrama 4 · Comparar colegios: entradas, cuántos colegios hay, agregar colegio y grupos en acordeón', nota: 'Cuántos colegios hay, cómo se agrega otro, escritorio o celular y los grupos en orden fijo.' },
];

/** Variables CSS en línea (`--ar`, `--tl`, `--dec-c`…). */
const cv = (o: Record<string, string | number>) => o as CSSProperties;

/** Scroll a una etapa por id. El hash está reservado para el enrutado de App.tsx. */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
}

/** Flechas del teclado entre pestañas: mueve la selección y el foco. */
function tabKeys(e: KeyboardEvent, i: number, n: number, set: (k: number) => void, idOf: (k: number) => string) {
  const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
  if (!d) return;
  e.preventDefault();
  const k = Math.max(0, Math.min(n - 1, i + d));
  set(k);
  requestAnimationFrame(() => document.getElementById(idOf(k))?.focus());
}

// ─── COMPONENTE ────────────────────────────────────────────────────────────

export default function EdubigCaseStudy({ onBack }: { onBack: () => void }) {
  const [pi, setPi] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Mismo motor de progreso/scroll que ProjectDetail — navegador consistente.
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

  const p = PERSONAS[pi];

  return (
    <div className="eb min-h-screen relative">
      <style>{CSS}</style>

      {/* Regla vertical — misma navegación que el resto de los proyectos */}
      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center max-[900px]:hidden"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical ticks={tickCount(8)} />
      </div>

      <div ref={contentRef} className="eb-content">
        <div className="eb-wrap">
          <div className="eb-topbar">
            <BackButton onClick={onBack} label="Volver al listado" />
            <span className="eb-cat" aria-label="Categoría UX-UI"><i aria-hidden="true" />UX-UI</span>
          </div>

          {/* ═══ 01 · PORTADA (protagonista) ═══════════════════════════════ */}
          <section className="eb-stage is-hero" id="eb-stage-01" aria-labelledby="eb-h-01">
            <StageHead n="01" title="Portada" />

            <div className="eb-grid">
              <div className="c-1-7">
                <p className="eb-hook">En Chile, cada colegio queda descrito en seis portales oficiales que no dialogan entre sí.</p>
                <h1 className="eb-h1" id="eb-h-01">eduBIG los traduce a una decisión.</h1>
                <div className="eb-filete" aria-hidden="true"><i /><div><span>Dato frío</span><span>Puente</span><span>Familia</span></div></div>
                <p className="eb-lead">Plataforma abierta para que las familias chilenas encuentren, exploren y comparen colegios. Cada dato se lee contra colegios parecidos, nunca en un ranking.</p>
              </div>
              <dl className="eb-ficha c-8-12">
                <div><dt>Rol</dt><dd>Diseño de producto, datos y sistema, de punta a punta</dd></div>
                <div><dt>Equipo</dt><dd>Israel Rubilar, analista de datos · Matías Cáceres, diseñador</dd></div>
                <div><dt>Escala</dt><dd><span className="eb-mono">57</span> colegios → <span className="eb-mono">8.250</span></dd></div>
                <div><dt>Fase actual</dt><dd>Testeo con usuarios del prototipo 2</dd></div>
                <div className="is-proto"><dt>Prototipo 2 · nacional</dt><dd><a className="eb-link eb-link-ext" href="https://edubig-chile.vercel.app/" target="_blank" rel="noopener noreferrer">edubig-chile.vercel.app ↗</a><small>8.250 colegios · celular y escritorio</small></dd></div>
                <div><dt>Prototipo 1 · MVP Pudahuel</dt><dd><a className="eb-link eb-link-ext" href="https://edu-big.vercel.app/" target="_blank" rel="noopener noreferrer">edu-big.vercel.app ↗</a><small>57 colegios · solo celular</small></dd></div>
              </dl>
            </div>

            <div className="eb-grid eb-cover-row">
              <figure className="eb-fig c-1-8">
                <div className="eb-frame eb-hero">
                  <div className="eb-media eb-media-desktop">
                    <img src={v2CompararEsc} alt="Comparar colegios en escritorio: cuatro colegios de Ñuñoa en columnas, cada uno con su color y número, y el bloque «Lo que más cambia entre estos colegios»" />
                  </div>
                </div>
                <figcaption className="eb-cap"><span className="eb-label">Fig. 01 · Comparar colegios, prototipo 2</span></figcaption>
              </figure>

              <aside className="eb-2min c-9-12" aria-label="Resumen del caso en 2 minutos">
                <span className="eb-label">En 2 minutos</span>
                <dl>
                  <div><dt>Problema</dt><dd>Las familias eligen colegio entre seis portales oficiales que no dialogan entre sí, con datos que nadie les explica cómo leer.</dd></div>
                  <div><dt>Qué hice</dt><dd>Diseñé y construí Edubig de punta a punta, del cruce de datos a la interfaz: un Test de Calce que devuelve tres colegios afines, una exploración por comuna y un comparador donde cada colegio se mide contra colegios parecidos al suyo.</dd></div>
                  <div><dt>Fase actual</dt><dd>El prototipo 2 está completo: 8.250 colegios, flujo rehecho en FigJam y diseño para celular y escritorio, todo a partir de un análisis heurístico del prototipo 1 (MVP de Pudahuel). Ahora viene el testeo con usuarios reales.</dd></div>
                </dl>
                <nav aria-label="Ir a una etapa">
                  <span className="eb-label" style={{ marginRight: 2 }}>Ir a</span>
                  <button type="button" onClick={() => scrollToId('eb-stage-04')}>Tres decisiones</button>
                  <button type="button" onClick={() => scrollToId('eb-stage-05')}>Del flujo a la pantalla</button>
                  <button type="button" onClick={() => scrollToId('eb-stage-06')}>Comparar a fondo</button>
                  <a href="https://edubig-chile.vercel.app/" target="_blank" rel="noopener noreferrer">Probar el prototipo 2 ↗</a>
                  <a href="https://edu-big.vercel.app/" target="_blank" rel="noopener noreferrer">Ver el prototipo 1 ↗</a>
                </nav>
              </aside>
            </div>
          </section>

          {/* ═══ 02 · EL PROBLEMA ══════════════════════════════════════════ */}
          <section className="eb-stage" id="eb-stage-02" aria-labelledby="eb-h-02">
            <StageHead n="02" title="El problema" />

            <div className="eb-grid eb-intro">
              <div className="eb-intro-h">
                <h2 className="eb-h2" id="eb-h-02">Falta traducción, no información: <em>¿este colegio es un buen lugar para mi hijo?</em></h2>
              </div>
              <div className="eb-intro-t">
                <p className="eb-p">Una familia que elige colegio tiene seis fuentes oficiales a su alcance: el directorio del Mineduc, el SIMCE y el IDPS de la Agencia de Calidad, las denuncias de la Superintendencia, la ubicación y la PAES. Casi nadie las abre, y quien lo hace encuentra siglas sin explicación.</p>
                <p className="eb-remate">No un séptimo portal ni un ranking. Un traductor.</p>
              </div>
            </div>

            <figure className="eb-fig">
              <div className="eb-frame eb-diag">
                <div className="eb-src">
                  <span className="eb-label">Entrada · seis fuentes oficiales</span>
                  <ol>
                    <li><span>01</span><span><b>Directorio Mineduc</b><small>RBD, dependencia, nivel, copago</small></span><i style={{ background: '#053061' }} /></li>
                    <li><span>02</span><span><b>SIMCE</b><small>Agencia de Calidad · 4° y 8° básico</small></span><i style={{ background: '#2166ac' }} /></li>
                    <li><span>03</span><span><b>IDPS</b><small>Cinco dimensiones de desarrollo personal y social</small></span><i style={{ background: '#2166ac' }} /></li>
                    <li><span>04</span><span><b>Denuncias Supereduc</b><small>Materia y estado de tramitación</small></span><i style={{ background: '#4393c3' }} /></li>
                    <li><span>05</span><span><b>Geolocalización</b><small>Distancia real al domicilio</small></span><i style={{ background: '#4393c3' }} /></li>
                    <li><span>06</span><span><b>PAES</b><small>Trayectoria de egreso</small></span><i style={{ background: '#92c5de' }} /></li>
                  </ol>
                </div>
                <div className="eb-node"><img src={logo} alt="Isologo eduBIG" /></div>
                <div className="eb-out">
                  <span className="eb-label">Salida · una conclusión legible</span>
                  <TarjetaColegio />
                  <small className="eb-out-note">Etiquetas con contexto, no un puntaje.</small>
                </div>
              </div>
              <figcaption className="eb-cap">
                <span className="eb-label">Fig. 02 · Seis entradas, una salida</span>
                <p>Las fuentes no se suman en un puntaje: se cruzan y salen como frases que una familia puede usar.</p>
              </figcaption>
            </figure>

            <div className="eb-sub"><span>Investigación · tres personas</span></div>
            <div className="eb-grid eb-intro">
              <div className="eb-intro-h"><h3 className="eb-h3">El dato existe, pero no habla el idioma de la decisión familiar.</h3></div>
              <div className="eb-intro-t">
                <p className="eb-p">Tres personas construidas sobre evidencia: informes del BID, datos de la Agencia de Calidad y denuncias de la Supereduc. Ninguna salió de mi cabeza.</p>
                <p className="eb-p">De las tres aparecen cinco dolores que se repiten. El más grave no es de usabilidad ni de acceso: es de idioma.</p>
              </div>
            </div>

            <figure className="eb-fig">
              <div className="eb-thin eb-persona">
                <div className="eb-tabs eb-persona-tabs" role="tablist" aria-label="Personas">
                  {PERSONAS.map((x, k) => (
                    <button
                      key={x.n}
                      type="button"
                      role="tab"
                      id={`eb-ptab-${k}`}
                      className="eb-tab"
                      aria-selected={k === pi}
                      aria-controls="eb-persona-panel"
                      tabIndex={k === pi ? 0 : -1}
                      onClick={() => setPi(k)}
                      onKeyDown={(e) => tabKeys(e, pi, PERSONAS.length, setPi, (j) => `eb-ptab-${j}`)}
                    >
                      <small>{x.n}</small>{x.nombre}
                    </button>
                  ))}
                </div>
                <div className="eb-persona-body" role="tabpanel" id="eb-persona-panel" aria-labelledby={`eb-ptab-${pi}`} tabIndex={0}>
                  <div className="eb-persona-id">
                    <div className="eb-media eb-media-square">
                      <img src={p.retrato} alt={`Retrato de persona: ${p.nombre}`} style={{ objectPosition: 'center 18%' }} />
                    </div>
                    <dl className="eb-meta-list">
                      {p.meta.map(([k, v]) => (
                        <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                      ))}
                    </dl>
                  </div>
                  <div className="eb-persona-main">
                    <header>
                      <span className="eb-label">{p.comuna} · {p.perfil}</span>
                      <h3 className="eb-h3" style={{ marginTop: 6 }}>{p.nombre}</h3>
                    </header>
                    <blockquote>{p.cita}</blockquote>
                    <div className="eb-dolores">
                      <div className="eb-dol-h"><span>Dolor</span><span>Severidad</span></div>
                      {p.dolores.map((d) => (
                        <div className="eb-dol-r" key={d.dolor}>
                          <span>{d.dolor}</span>
                          <span className="eb-sev" style={cv({ '--sev': SEV[d.sev] })}><b>{d.sev}</b><small>{d.efecto}</small></span>
                        </div>
                      ))}
                    </div>
                    <div className="eb-implic">
                      <span className="eb-label">Implicaciones para el diseño</span>
                      {p.implicaciones.map((t) => (
                        <div className="eb-implic-i" key={t}><span>{t}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <figcaption className="eb-cap">
                <span className="eb-label">Fig. 03 · Tres personas, una card intercambiable</span>
                <p>Cada dolor viene con severidad y con el efecto que produce, porque eso es lo que ordenó la prioridad: los dos críticos de Carolina — no entiende las siglas, no tiene computador — son los que fijaron mobile-first y lenguaje simple antes que cualquier funcionalidad. Carolina y Francisca llegan al mismo requisito desde extremos opuestos del eje socioeconómico: una no puede leer un puntaje, la otra no confía en uno sin contexto. Las dos piden lo mismo — comparación contra colegios equivalentes — y esa coincidencia es la que sostiene la decisión 01.</p>
              </figcaption>
            </figure>
          </section>

          {/* ═══ 03 · LA IDEA ══════════════════════════════════════════════ */}
          <section className="eb-stage" id="eb-stage-03" aria-labelledby="eb-h-03">
            <StageHead n="03" title="La idea" />

            <div className="eb-grid eb-intro">
              <div className="eb-intro-h"><h2 className="eb-h2" id="eb-h-03">Un toggle es el mismo sistema en dos estados. Por eso el logo es un toggle.</h2></div>
              <div className="eb-intro-t">
                <p className="eb-p">El concepto rector es <strong>un sistema que se traduce en cuidado</strong>: el dato se mantiene fiel, pero llega en un idioma que una familia puede usar.</p>
                <p className="eb-p">Viene de Hofstadter en <em>Gödel, Escher, Bach</em>: una traducción es fiel cuando conserva la estructura, aunque cambie el material.</p>
              </div>
            </div>

            <figure className="eb-fig">
              {/* Tira de 3 celdas de igual altura: 1:1 + 2:1 + 1:1 (flex por proporción) */}
              <div className="eb-row eb-beats">
                <div className="eb-beat" style={cv({ '--ar': 1 })}>
                  <div className="eb-media eb-media-square"><img src={bocetoToggle} alt="Board manuscrito del proceso: traducción de dato frío a dato cálido, bocetos de toggle" /></div>
                  <div className="eb-beat-rail" style={{ background: '#2166ac' }} />
                  <div className="eb-beat-n"><b>01 · Boceto</b></div>
                  <p>Buscando cómo dibujar la traducción de <em>dato frío → dato cálido</em> apareció la pregunta al margen: «¿toggles, switches?».</p>
                </div>
                <div className="eb-beat" style={cv({ '--ar': 2 })}>
                  <div className="eb-media eb-media-wide"><img src={formalizacionLogo} alt="Formalización del logo: retícula de construcción del toggle en estados ON y OFF junto al isologo resultante" style={{ objectPosition: 'center' }} /></div>
                  <div className="eb-beat-rail" style={{ background: 'linear-gradient(90deg,#2166ac,#f7f7f7 50%,#d6604d)' }} />
                  <div className="eb-beat-n"><b>02 · Formalización</b></div>
                  <p>El toggle se desarma en retícula: dos estados, un radio, un eje. La marca hereda esa construcción exacta —misma cápsula, mismo círculo desplazado, mismas tangentes— en vez de imitar su apariencia.</p>
                </div>
                <div className="eb-beat" style={cv({ '--ar': 1 })}>
                  <div className="eb-media eb-media-square eb-logo-cell" style={{ background: '#fff' }}><img src={logo} alt="Isologo eduBIG final" /></div>
                  <div className="eb-beat-rail" style={{ background: '#b2181f' }} />
                  <div className="eb-beat-n"><b>03 · Isologo</b></div>
                  <p><span className="eb-mono eb-cold">011</span> en Pixelify Sans es el dato como sale de la máquina; <span className="eb-mono eb-warm">eB</span> en Work Sans es lo que recibe la familia. El degradado entre ambas es el eje frío–cálido que después ordena el producto.</p>
                </div>
              </div>
              <figcaption className="eb-cap">
                <span className="eb-label">Fig. 04 · Del gesto a la marca</span>
                <p>El isologo no ilustra el concepto: lo ejecuta. Cambia el material, se conserva la estructura.</p>
              </figcaption>
            </figure>

            <Det title="Ver las dos cadenas del concepto" sub="Fig. 05 · tres eslabones, cadena fría y cadena cálida">
              <figure className="eb-fig">
                <div className="eb-chain is-head">
                  <div className="k c"><span className="eb-label">Dato</span><span>Cadena fría</span></div>
                  <div className="m"><span className="eb-label">Puente</span>Posición</div>
                  <div className="k w"><span className="eb-label">Familia</span><span>Cadena cálida</span></div>
                </div>
                <div className="eb-chain"><div className="k c"><b>imparcial</b><span>El dato no toma partido por ningún colegio: solo registra lo que las seis fuentes oficiales publican.</span></div><div className="m"><span className="eb-mono">01</span><i />Origen</div><div className="k w"><b>cuidado</b><span>La familia no parte de la curiosidad: parte de querer que a su hijo le vaya bien.</span></div></div>
                <div className="eb-chain"><div className="k c"><b>frío</b><span>Ser imparcial vuelve al dato frío. No consuela, no acompaña, no se adapta a quién pregunta.</span></div><div className="m"><span className="eb-mono">02</span><i />Término medio</div><div className="k w"><b>preocupación</b><span>Cuidar vuelve a la familia preocupada. La decisión importa, y eso incomoda.</span></div></div>
                <div className="eb-chain"><div className="k c"><b>honesto</b><span>Pero un dato frío es un dato honesto: no promete lo que no puede sostener.</span></div><div className="m"><span className="eb-mono">03</span><i />Resultado</div><div className="k w"><b>seguridad</b><span>Y una preocupación atendida con un dato honesto termina en seguridad: se puede decidir con esto.</span></div></div>
                <figcaption className="eb-cap">
                  <span className="eb-label">Fig. 05 · Dos cadenas, la misma estructura</span>
                  <p>Tres eslabones, un origen, un término medio incómodo y un resultado. <em>Frío</em> y <em>preocupación</em> son los eslabones que un producto amable borraría, y son justamente los que sostienen <em>honesto</em> y <em>seguridad</em>.</p>
                </figcaption>
              </figure>
            </Det>
          </section>

          {/* ═══ 04 · TRES DECISIONES (protagonista) ═══════════════════════ */}
          <section className="eb-stage" id="eb-stage-04" aria-labelledby="eb-h-04">
            <StageHead n="04" title="Tres decisiones" />

            <div className="eb-grid eb-intro is-wide">
              <div className="eb-intro-h"><h2 className="eb-h2" id="eb-h-04">Si la legibilidad y la honestidad chocan, gana la honestidad. Hacerla legible es trabajo del producto.</h2></div>
              <div className="eb-intro-t"><p className="eb-p">Tres decisiones definen el producto. Cada una renuncia a algo que un producto más vendible conservaría.</p></div>
            </div>

            <div className="eb-frame eb-decs">
              <Decision n="01" color="#2166ac" tag="Contexto" titulo="Comparar con colegios parecidos, no rankear"
                tension="Contra el promedio nacional gana el colegio con alumnos de mayor nivel socioeconómico, no el que mejor trabaja."
                decision="Cada indicador se lee contra colegios del mismo grupo socioeconómico, con la comparación oficial de la Agencia de Calidad. No hay ranking nacional."
                costo="Desaparece la respuesta a «¿cuál es el mejor colegio de Chile?». La pregunta queda sin contestar a propósito." />
              <Decision n="02" color="#92c5de" tag="Arquitectura" titulo="Acompañar antes que listar"
                tension="Un buscador con filtros asume que la familia sabe qué criterios aplicar. La investigación mostró que llega sin saber qué preguntar."
                decision="El acceso principal es el Test de Calce: cinco preguntas y tres colegios que calzan, con sus razones a la vista. Explorar y comparar siguen a un toque."
                costo="Se antepone un cuestionario a la búsqueda libre, y el producto asume la responsabilidad de haber acotado bien." />
              <Decision n="03" color="#d6604d" tag="Datos" titulo="Decir solo lo que el dato sostiene"
                tension="Un +6 se lee como ventaja aunque, para la Agencia, sea un empate. Y un colegio sin datos tiende a desaparecer."
                decision="Verde o mostaza solo cuando la diferencia es significativa; si no, «a la par». El colegio sin datos aparece igual y lo dice. El motor del test usa reglas explícitas, no un modelo opaco."
                costo="Menos titulares llamativos: muchos colegios quedan «a la par»." />
            </div>

            <Det title="Ver dos decisiones más y por qué el IDPS no se promedia" sub="Decisiones 04 y 05 · Fig. 06 · cuatro series IDPS contra sus similares">
              <div className="eb-decs is-2 eb-thin">
                <Decision n="04" color="#4393c3" tag="Datos" titulo="Series IDPS separadas, nunca un score único"
                  tension="Clima escolar, autoestima, hábitos y participación miden cosas distintas. Promediarlas produce un número más cómodo y menos cierto."
                  decision="Las cuatro dimensiones se muestran como series independientes, cada una contra su grupo GSE. El Test de Calce agrupa en Bienestar y Convivencia solo para ponderar, y aun ahí pregunta dónde poner más peso — nunca cuál descartar."
                  costo="La familia lee cuatro barras donde otros productos muestran una. Más carga de lectura, menos titular." />
                <Decision n="05" color="#f4a582" tag="Tono" titulo="Nota de legitimación"
                  tension="El Test de Calce pregunta qué prioriza la familia. Toda pregunta de preferencia implica que hay respuestas mejores que otras, y eso culpabiliza a quien elige distinto."
                  decision="Cada resultado del test valida explícitamente la combinación elegida antes de mostrar colegios. No hay perfil incorrecto."
                  costo="Más texto antes del resultado, y el producto renuncia a la autoridad de decirle a la familia qué debería priorizar." />
              </div>

              <figure className="eb-fig">
                <div className="eb-thin eb-idps">
                  <div className="eb-idps-r is-h"><span className="eb-label">Dimensión IDPS</span><span className="eb-label">Colegios similares</span><span className="eb-label">Graham Bell · 8° básico</span></div>
                  <IdpsRow nombre="Clima escolar" det="Convivencia · qué tan respetuosa y segura la sienten" sim={75} col={70} />
                  <IdpsRow nombre="Participación" det="Convivencia · pertenencia y formación ciudadana" sim={78} col={74} />
                  <IdpsRow nombre="Autoestima académica" det="Bienestar · confianza y motivación para aprender" sim={74} col={70} />
                  <IdpsRow nombre="Hábitos de vida saludable" det="Bienestar · alimentación, actividad física, autocuidado" sim={72} col={67} />
                  <div className="eb-idps-r is-t">
                    <span><b>Colapsado en un score único</b></span>
                    <span className="eb-bar"><i className="g" style={{ width: 'calc(74.8% * .8)' }} />74,8</span>
                    <span className="eb-bar"><i className="g" style={{ width: 'calc(70.3% * .8)' }} />70,3</span>
                  </div>
                </div>
                <figcaption className="eb-cap">
                  <span className="eb-label">Fig. 06 · Por qué las cuatro series no se promedian</span>
                  <p>Datos de la ficha de Graham Bell, IDPS 8° básico 2025 preliminar. Colapsadas dan <span className="eb-mono">70,3</span> contra <span className="eb-mono">74,8</span> de sus pares. Separadas muestran cuatro brechas casi iguales —<span className="eb-mono">−5, −4, −4, −5</span>—: un colegio parejo, no uno con un área hundida. El mismo promedio lo daría un colegio con tres dimensiones altas y una colapsada.</p>
                </figcaption>
              </figure>
            </Det>
          </section>

          {/* ═══ 05 · DEL FLUJO A LA PANTALLA ══════════════════════════════ */}
          <section className="eb-stage" id="eb-stage-05" aria-labelledby="eb-h-05">
            <StageHead n="05" title="Del flujo a la pantalla" />

            <div className="eb-grid eb-intro">
              <div className="eb-intro-h"><h2 className="eb-h2 is-long" id="eb-h-05">La escala nacional rompía supuestos del prototipo 1: sin ubicación por defecto, con colegios sin datos para comparar y con grupos de comparación que cambian según la prueba.</h2></div>
              <div className="eb-intro-t">
                <p className="eb-p">El <strong>prototipo 1</strong> fue un MVP solo para celular con 57 colegios de Pudahuel, construido del cruce de datos a la última pantalla. Funcionó, y con Israel Rubilar decidimos llevarlo a todo Chile.</p>
                <p className="eb-p">El <strong>prototipo 2</strong> salió de un análisis heurístico del primero y cambió en tres frentes: datos (de 57 a 8.250 colegios), flujo (rehecho en FigJam antes de programar) y diseño (celular y escritorio, Comparar completo y un sistema auditado).</p>
              </div>
            </div>

            {/* Fig. 07 · dos videos en un panel blanco, misma altura: celular 1:2 + escritorio 16:10 */}
            <figure className="eb-fig">
              <div className="eb-frame eb-vids">
                <div className="eb-row is-stack">
                  <div style={cv({ '--ar': 0.5 })}>
                    <div className="eb-row-head"><b>Prototipo 1 · celular</b><span className="eb-label">MVP Pudahuel</span></div>
                    <VideoBox
                      className="eb-vbox is-phone"
                      src="/edubig-navegacion-mvp.mp4"
                      poster="/edubig-navegacion-mvp-poster.jpg"
                      label="Recorrido del prototipo 1, MVP de Pudahuel, en el celular"
                      playLabel="Reproducir el recorrido del prototipo 1"
                      boton="Ver"
                    />
                  </div>
                  <div style={cv({ '--ar': 1.6 })}>
                    <div className="eb-row-head"><b>Prototipo 2 · escritorio</b><span className="eb-label">Versión nacional</span></div>
                    <VideoBox
                      className="eb-vbox is-laptop"
                      src="/edubig-navegacion-prototipo2.mp4"
                      poster="/edubig-navegacion-prototipo2-poster.jpg"
                      label="Recorrido del prototipo 2, versión nacional, en escritorio: Test de Calce, shortlist y Comparar"
                      playLabel="Reproducir el recorrido del prototipo 2"
                      boton="Ver recorrido"
                    />
                  </div>
                </div>
              </div>
              <figcaption className="eb-cap">
                <span className="eb-label">Fig. 07 · Los dos prototipos, en movimiento</span>
                <p>El prototipo 1 recorre el Test de Calce en el celular, con 57 colegios de Pudahuel. El prototipo 2 hace el mismo camino en escritorio, con el dato nacional, y llega hasta Comparar.</p>
              </figcaption>
            </figure>

            <FlujoVisor />

            {/* Capturas: P2 es la tira principal (alta resolución); P1 queda como registro pequeño (≤150 px) */}
            <div className="eb-shots">
              <div>
                <div className="eb-ver-h">
                  <span className="eb-mono">02</span><b>Prototipo 2 · versión nacional</b><span className="eb-tag">8.250 colegios · celular y escritorio</span>
                  <a className="eb-link eb-link-ext" href="https://edubig-chile.vercel.app/" target="_blank" rel="noopener noreferrer">Abrir el prototipo 2 ↗</a>
                </div>
                <div className="eb-row is-tight is-scroll">
                  <Shot ar={1.6} cls="eb-media-desktop" src={v2Home} alt="Versión nacional en escritorio: Home con el Test de Calce y la tarjeta «¿Dónde buscas colegio?»" pie="Home: el Test y la búsqueda por comuna, nombre o ubicación." />
                  <Shot ar={1.6} cls="eb-media-desktop" src={v2Ficha} alt="Versión nacional en escritorio: ficha del Liceo Augusto D Halmar en dos columnas" pie="Ficha en dos columnas: identidad fija, módulos a la derecha." />
                  <Shot ar={0.4615} cls="eb-media-phone" src={v2Q5} alt="Versión nacional en el celular: quinta pregunta del Test de Calce" pie="Test de Calce, Q5." />
                  <Shot ar={0.4615} cls="eb-media-phone" src={v2Shortlist} alt="Versión nacional en el celular: shortlist con tres colegios de Ñuñoa" pie="Shortlist con las razones del calce." />
                </div>
              </div>

              <div className="eb-p1-wrap">
                <div className="eb-ver-h">
                  <span className="eb-mono">01</span><b>Prototipo 1 · MVP Pudahuel</b><span className="eb-tag">57 colegios · solo celular</span>
                  <a className="eb-link eb-link-ext" href="https://edu-big.vercel.app/" target="_blank" rel="noopener noreferrer">Abrir el prototipo 1 ↗</a>
                </div>
                <div className="eb-p1-strip">
                  <LowShot src={scHomeLista} alt="MVP de Pudahuel en el celular: lista de colegios con chips de filtro" pie="Home con lista y mapa." />
                  <LowShot src={scQ1} alt="MVP: primera pregunta del Test de Calce, sobre copago" pie="Test de Calce, Q1." />
                  <LowShot src={scShortlist} alt="MVP: shortlist de colegios que calzan, en cards de borde cálido" pie="Shortlist de tres colegios." />
                  <LowShot src={scFichaTop} alt="MVP: ficha de colegio con el resumen «Lo esencial»" pie="Ficha con «Lo esencial»." />
                </div>
              </div>
            </div>
          </section>

          {/* ═══ 06 · CASO A FONDO: COMPARAR (protagonista) ════════════════ */}
          <section className="eb-stage" id="eb-stage-06" aria-labelledby="eb-h-06">
            <StageHead n="06" title="Caso a fondo: Comparar" />

            <div className="eb-grid eb-intro is-wide">
              <div className="eb-intro-h"><h2 className="eb-h2" id="eb-h-06">Cada colegio se compara con colegios parecidos a él, no con los otros de la tabla.</h2></div>
              <div className="eb-intro-t">
                <p className="eb-p">Comparar es la promesa más difícil del producto: poner colegios lado a lado <strong>sin declarar un ganador</strong>.</p>
                <p className="eb-p">El diseño del prototipo 1 mostraba tres columnas con un resumen. Tomás y Francisca necesitaban más: ver cada dimensión y entender contra qué se mide cada colegio.</p>
              </div>
            </div>

            {/* Antes / Después: misma altura de medio (325 px = 150 px × 19,5/9), mismo encuadre de celular */}
            <div className="eb-ad">
              <figure className="eb-fig eb-ad-col is-before">
                <span className="eb-label">Antes · prototipo 1, diseño en Figma, ago-2026</span>
                <div className="eb-ad-before">
                  <div className="eb-media eb-media-phone is-lowres is-150"><img src={scCompTop} alt="Prototipo de comparación en el celular: tres colegios en columnas con el resumen «Lo esencial»" /></div>
                  <div className="eb-media eb-media-phone is-lowres is-150"><img src={scCompCuerpo} alt="Prototipo de comparación: cuerpo de la tabla con trayectoria universitaria" /></div>
                </div>
                <figcaption>Tres columnas, un resumen y chips Alto / Medio / Bajo.</figcaption>
              </figure>
              <figure className="eb-fig eb-ad-col is-after">
                <span className="eb-label">Después · prototipo 2, oct-2026</span>
                <div className="eb-frame eb-ad-after">
                  <div className="eb-row is-tight">
                    <div style={cv({ '--ar': 0.4615 })}><div className="eb-media eb-media-phone"><img src={v2CompararMovil} alt="Comparar en el celular: barra con tres colegios y el bloque «Lo que más cambia»" /></div></div>
                    <div style={cv({ '--ar': 1.6 })}>
                      <a className="eb-media eb-media-desktop is-zoom" href={v2CompararDetalle} target="_blank" rel="noopener noreferrer" aria-label="Abrir el detalle de Comparar en tamaño completo">
                        <img src={v2CompararDetalle} alt="Detalle de Comparar en escritorio: Bienestar con barras de 0 a 100 y la marca de sus similares; Académico con brechas SIMCE en verde, mostaza o gris según la significancia" />
                      </a>
                    </div>
                  </div>
                </div>
                <figcaption>Hasta 4 colegios en escritorio y 3 en el celular, una dimensión por grupo, cada dato en tres capas: frase, gráfico y número exacto.</figcaption>
              </figure>
            </div>

            <ol className="eb-steps">
              <li className="eb-step"><span className="eb-mono">01</span><b>Referencias</b><p>Revisé dashboards y tablas comparativas para sacar los patrones que sirven a una familia.</p></li>
              <li className="eb-step"><span className="eb-mono">02</span><b>Reglas</b><p>Los convertí en un brief de decisiones cerradas: la misma escala para todos, la referencia siempre rotulada «sus similares», sin coronas ni máximos resaltados y el color nunca solo.</p></li>
              <li className="eb-step"><span className="eb-mono">03</span><b>Diseño</b><p>Claude Design generó la propuesta a partir de ese brief y de datos reales de cinco colegios.</p></li>
              <li className="eb-step"><span className="eb-mono">04</span><b>Código</b><p>La implementé en el sitio y llevé sus reglas a la ficha y al sistema de interacción completo.</p></li>
            </ol>

            <div className="eb-rules">
              <span className="eb-label">Tres reglas que ahora rigen todo el sitio</span>
              <div className="eb-rules-g">
                <div className="eb-thin eb-rule">
                  <div className="eb-rule-vis" aria-hidden="true">
                    <span className="eb-pos" style={{ background: '#007d79' }}>1</span><span className="eb-pos" style={{ background: '#6929c4' }}>2</span><span className="eb-pos" style={{ background: '#d3354f' }}>3</span><span className="eb-pos" style={{ background: '#012749' }}>4</span>
                  </div>
                  <p><strong>Un color fijo por posición</strong>, del 1 al 4, siempre con su número: el color identifica, no juzga.</p>
                </div>
                <div className="eb-thin eb-rule">
                  <div className="eb-rule-vis" aria-hidden="true"><span className="eb-simbar"><i /><b /></span><span>sus similares</span></div>
                  <p><strong>«Sus similares» es una marca negra neutra</strong>, no un color más que compita con los colegios.</p>
                </div>
                <div className="eb-thin eb-rule">
                  <div className="eb-rule-vis" aria-hidden="true">
                    <span className="eb-sig" style={{ color: '#1e6b2e', borderColor: '#1e6b2e' }}>+33 ↑</span>
                    <span className="eb-sig" style={{ color: '#7a5c00', borderColor: '#7a5c00' }}>−34 ↓</span>
                    <span className="eb-sig" style={{ color: '#5f5f5a', borderColor: '#a3a39d' }}>= a la par</span>
                  </div>
                  <p><strong>Verde o mostaza solo con diferencia significativa</strong>; si no, gris «a la par».</p>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ 07 · SISTEMA Y FORMA DE TRABAJO ═══════════════════════════ */}
          <section className="eb-stage" id="eb-stage-07" aria-labelledby="eb-h-07">
            <StageHead n="07" title="Sistema y forma de trabajo" />

            <div className="eb-grid eb-intro">
              <div className="eb-intro-h"><h2 className="eb-h2" id="eb-h-07">Un contraste que falla no es una infracción formal: es un dato que no se lee.</h2></div>
              <div className="eb-intro-t">
                <p className="eb-p">El análisis heurístico dejó un sistema de diseño auditado contra WCAG 2.2 AA, una sola retícula para todo el sitio y los mismos estados en cada control: reposo, hover, foco, activo y deshabilitado.</p>
                <p className="eb-p">La IA trabaja como colaborador dirigido. Yo decido qué se cruza, qué se diseña y con qué criterio; la IA escribe y propone; yo valido contra la fuente oficial y el recorrido completo.</p>
              </div>
            </div>

            <div className="eb-grid eb-sys">
              <figure className="eb-fig c-1-7">
                {/* Excepción documentada: 16:9 por ser una grabación de pantalla */}
                <div className="eb-frame">
                  <VideoBox
                    className="eb-media eb-media-169"
                    src="/edubig-proceso-datos.mp4"
                    poster="/edubig-proceso-datos-poster.jpg"
                    label="Registro del co-work con la IA sobre el pipeline de datos"
                    playLabel="Reproducir el registro del co-work sobre el pipeline"
                    boton="Ver el pipeline"
                  />
                </div>
                <figcaption className="eb-cap">
                  <span className="eb-label">Fig. 09 · El co-work sobre el pipeline</span>
                  <p>El registro de cómo trabajo con la IA: yo decido qué dato se cruza con qué y en qué orden, la IA escribe el código y yo reviso cada resultado contra la fuente oficial. Si un campo queda mal cruzado, se nota enseguida en la ficha del colegio. Delego la escritura, no la decisión.</p>
                </figcaption>
              </figure>
              <div className="c-8-12">
                <div className="eb-kpis" role="list">
                  <div className="eb-kpi" role="listitem"><b>5,74:1</b><p>contraste del texto secundario. Antes daba 4,49:1 sobre los fondos grises.</p></div>
                  <div className="eb-kpi" role="listitem"><b>3,7:1</b><p>borde cálido en hover. Antes daba 2,0:1: el estado existía y no se veía.</p></div>
                  <div className="eb-kpi" role="listitem"><b>44 px</b><p>objetivo táctil mínimo en todo el sitio. WCAG 2.2 pide 24.</p></div>
                  <div className="eb-kpi" role="listitem"><b>0</b><p>errores de axe-core en Comparar, la ficha y la Home.</p></div>
                </div>
              </div>
            </div>

            <div className="eb-dets">
              <Det title="Ver la auditoría de contraste y los criterios WCAG" sub="Fig. 10 · 8 tokens medidos · 3 criterios WCAG 2.2">
                <figure className="eb-fig">
                  <div className="eb-tbl-wrap">
                    <table className="eb-tbl">
                      <thead><tr><th>Token</th><th>Uso en el producto</th><th className="r">Ratio</th><th>Veredicto</th></tr></thead>
                      <tbody>
                        {CONTRASTE.map((t) => (
                          <tr key={t.hex}>
                            <td className="eb-mono"><i className="eb-sw" style={{ background: t.hex }} />{t.hex}</td>
                            <td>{t.uso}</td>
                            <td className="r">{t.ratio}</td>
                            <td style={t.tintaVeredicto !== '#1a1a18' ? { color: t.tintaVeredicto } : undefined}><i className="eb-dot" style={{ background: t.marca }} />{t.veredicto}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="eb-row-cap" style={{ color: 'var(--eb-mute-text)' }}>Auditoría de sep-2026, ratios contra <span className="eb-mono">#FFFFFF</span>. En oct-2026 se midió todo el texto contra su fondo real y el texto secundario subió de negro al 54 % al 60 %.</p>
                  <figcaption className="eb-cap">
                    <span className="eb-label">Fig. 10 · Auditoría de contraste sobre los tokens</span>
                    <p>El hallazgo incómodo: el lado cálido del eje era el más débil. <span className="eb-mono">#f4a582</span> era el borde en hover, el momento en que el dato cruza a cálido, y no llegaba ni al umbral no textual.</p>
                  </figcaption>
                </figure>
                <div>
                  {CRITERIOS.map((c) => (
                    <div className="eb-crit" key={c.sc}>
                      <div className="eb-crit-l"><span className="eb-mono eb-tiny">{c.sc}</span><b>{c.nombre}</b><span className={'eb-tag' + (c.tinta === '#8a1a20' ? ' is-warm' : '')}>{c.estado}</span></div>
                      <div>
                        <div className="eb-kv"><span>Riesgo</span><span className="eb-soft">{c.riesgo}</span></div>
                        <div className="eb-kv"><span>Respuesta</span><span>{c.respuesta}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Det>

              <Det title="Ver las dos paletas y la card en dos temperaturas" sub="Fig. 11 · eje RdBu y paleta de posición · Fig. 12 · tres estados de la card">
                <figure className="eb-fig">
                  <div className="eb-pals">
                    <div>
                      <span className="eb-label" style={{ color: 'var(--eb-ink)' }}>Paleta 01 · Eje de traducción</span>
                      <div className="eb-row-cap" style={{ marginTop: 4 }}>RdBu — ColorBrewer. Ordinal y con dirección.</div>
                      <div className="eb-pal-bar" style={{ background: 'linear-gradient(90deg,#053061,#2166ac,#4393c3,#d1e5f0,#f7f7f7,#fddbc7,#f4a582,#d6604d,#b2181f)' }} />
                      {USOS_EJE.map((r) => (
                        <div className="eb-pal-r" key={r.estado}><i style={{ background: r.tono }} /><span>{r.estado}<span>{r.donde}</span></span></div>
                      ))}
                    </div>
                    <div>
                      <span className="eb-label" style={{ color: 'var(--eb-ink)' }}>Paleta 02 · Colegios en un gráfico</span>
                      <div className="eb-row-cap" style={{ marginTop: 4 }}>Categórica, de la paleta de Carbon: un color por posición, sin orden ni juicio.</div>
                      <div className="eb-pal-cat">{USOS_CUAL.map((r) => <i key={r.estado} style={{ background: r.tono }} />)}</div>
                      {USOS_CUAL.map((r) => (
                        <div className="eb-pal-r" key={r.estado}><i style={{ background: r.tono }} /><span>{r.estado}<span>{r.donde}</span></span></div>
                      ))}
                    </div>
                  </div>
                  <div className="eb-pal-rules" style={{ marginTop: 20 }}>
                    <div><span className="eb-label">Regla única</span><span>Si el color responde «¿qué tan traducido está esto?», es RdBu. Si responde «¿cuál de estos colegios es?», es la paleta de posición.</span></div>
                    <div><span className="eb-label">Interactivo</span><span><span className="eb-mono" style={{ color: '#0958D9' }}>#0958D9</span> queda fuera de ambas. Es affordance, no significado: botón, foco, enlace.</span></div>
                    <div><span className="eb-label">Tercer encoding</span><span>Verde y mostaza dicen «sobre» o «bajo sus similares», y solo aparecen cuando la diferencia es significativa.</span></div>
                  </div>
                  <figcaption className="eb-cap">
                    <span className="eb-label">Fig. 11 · Dos paletas, dos preguntas distintas</span>
                    <p>Separarlas es lo que permite que el eje frío–cálido siga significando algo.</p>
                  </figcaption>
                </figure>

                <figure className="eb-fig">
                  <div className="eb-temp">
                    {FRAMES_TRAD.map((t) => (
                      <div key={t.estado}>
                        <div className="eb-media eb-media-phone is-lowres is-140"><img src={t.url} alt={t.alt} loading="lazy" /></div>
                        <div>
                          <span className="eb-label" style={{ color: 'var(--eb-ink)' }}><i className="eb-dot" style={{ background: t.tono }} />{t.estado}</span>
                          <p className="eb-label" style={{ marginTop: 8 }}>{t.recorte}</p>
                          <p>{t.nota}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <figcaption className="eb-cap">
                    <span className="eb-label">Fig. 12 · La misma card, dos temperaturas</span>
                    <p>Fría cuando la encontraste tú en una lista; cálida cuando el sistema la trajo para tu familia. En el medio, la pantalla de espera dice <em>Traduciendo tus respuestas</em>.</p>
                  </figcaption>
                </figure>
              </Det>

              <Det title="Ver qué dirigí, qué generó la IA y cómo validé, capa por capa" sub="Fig. 13 · pipeline, Figma, frontend y sistema de diseño">
                <figure className="eb-fig">
                  <div>
                    {CAPAS.map((c) => (
                      <div className="eb-capa" key={c.n}>
                        <div className="eb-capa-l">
                          <span className="eb-mono eb-tiny">{c.n}</span>
                          <b>{c.capa}</b>
                          <span className="eb-row-cap" style={{ margin: 0, color: 'var(--eb-mute-text)' }}>{c.stack}</span>
                          <span className="eb-tag">{c.modo}</span>
                        </div>
                        <div>
                          {c.registro.map(([k, v]) => (
                            <div className="eb-kv" key={k}><span>{k}</span><span>{v}</span></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <figcaption className="eb-cap">
                    <span className="eb-label">Fig. 13 · Cuatro capas, cuatro modos de dirigir</span>
                    <p>El modo lo fija cuánto costaría equivocarse en esa capa: un error en el pipeline ensucia el dato de miles de colegios; uno de frontend se ve y se corrige en el momento.</p>
                  </figcaption>
                </figure>
              </Det>
            </div>
          </section>

          {/* ═══ 08 · FASE ACTUAL (cierre) ═════════════════════════════════ */}
          <section className="eb-stage last" id="eb-stage-08" aria-labelledby="eb-h-08">
            <StageHead n="08" title="Fase actual: testeo con usuarios" />

            <div className="eb-grid eb-intro">
              <div className="eb-intro-h"><h2 className="eb-h2" id="eb-h-08">Lo que un método conocido puede encontrar no se le pregunta a una familia.</h2></div>
              <div className="eb-intro-t">
                <p className="eb-p">Con el prototipo 2 completo, la fase actual es <strong>probarlo con usuarios reales</strong>. Se puede recorrer en <a className="eb-link" href="https://edubig-chile.vercel.app/" target="_blank" rel="noopener noreferrer">edubig-chile.vercel.app ↗</a>; el prototipo 1 sigue en línea como registro.</p>
                <p className="eb-p">La validación es una decisión de secuencia: primero el análisis heurístico y de accesibilidad, que dio forma al prototipo 2; ahora, las familias.</p>
              </div>
            </div>

            <figure className="eb-fig">
              <div className="eb-frame">
                <div className="eb-tl-bar" aria-hidden="true" />
                <div className="eb-tl">
                  <ol>
                    <li style={cv({ '--tl': '#2166ac' })}><span className="eb-st">Hecho</span><b>Prototipo 1 · MVP Pudahuel</b><p>57 colegios, solo celular. Del cruce de datos a la última pantalla.</p></li>
                    <li style={cv({ '--tl': '#4393c3' })}><span className="eb-st">Hecho</span><b>Análisis heurístico</b><p>WCAG 2.2 AA, heurísticas de Nielsen y arquitectura de información sobre el prototipo 1.</p></li>
                    <li style={cv({ '--tl': '#d6604d' })}><span className="eb-st">Hecho</span><b>Prototipo 2 · versión nacional</b><p>Datos (8.250 colegios), flujo (FigJam) y diseño (celular y escritorio) rehechos.</p></li>
                    <li style={cv({ '--tl': '#b2181f' })} className="is-now" aria-current="step"><span className="eb-st is-now">Fase actual</span><b>Testeo con usuarios</b><p>Probar el prototipo 2 con familias reales.</p></li>
                    <li style={cv({ '--tl': '#8a1a20' })}><span className="eb-st is-next">Después</span><b>Lanzamiento y observatorio</b><p>Crecer y refinarse con uso real, sin esperar a estar perfecto para salir.</p></li>
                  </ol>
                </div>
              </div>
              <figcaption className="eb-cap">
                <span className="eb-label">Fig. 14 · Del prototipo 1 al testeo con usuarios</span>
                <p>La escala cambia; la traducción es la misma.</p>
              </figcaption>
            </figure>

            <Det title="Ver el método de validación completo" sub="Fig. 15 · tres capas, de 3 familias a familias reales">
              <figure className="eb-fig">
                <div>
                  {VALIDACION.map((v) => (
                    <div className="eb-val" key={v.n}>
                      <div className="eb-val-l">
                        <span className="eb-label">{v.n}</span>
                        <b>{v.titulo}</b>
                        <span className={'eb-tag' + (v.tinta === '#8a1a20' ? ' is-warm' : '')}>{v.estado}</span>
                        <span className="eb-scale"><span><i style={{ width: v.ancho, background: v.tono }} /></span><span className="eb-mono">{v.muestra}</span></span>
                      </div>
                      <div>
                        <p className="eb-p" style={{ fontSize: 15 }}>{v.texto}</p>
                        <div className="eb-kv"><span>Por qué</span><span className="eb-soft">{v.porque}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <figcaption className="eb-cap">
                  <span className="eb-label">Fig. 15 · Tres capas, muestra creciente</span>
                  <p>Las dos primeras capas existen para que la tercera no gaste su muestra en encontrar lo que un método conocido encuentra gratis.</p>
                </figcaption>
              </figure>
            </Det>

            <p className="eb-close">eduBIG no es un producto terminado. Es un sistema que aprende a traducir.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── PIEZAS AUXILIARES ────────────────────────────────────────────────────

function StageHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="eb-stagehead">
      <span>Etapa {n} · {title}</span>
      <span>{n} / 08</span>
    </div>
  );
}

/** Plegable visible: icono +/− en marco firma, título, una línea de qué contiene y estado. */
function Det({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <details className="eb-det">
      <summary>
        <span className="eb-det-ico" aria-hidden="true" />
        <span className="eb-det-t"><b>{title}</b><small>{sub}</small></span>
        <span className="eb-det-state" aria-hidden="true" />
      </summary>
      <div className="eb-det-body">{children}</div>
    </details>
  );
}

function Decision(props: { n: string; color: string; tag: string; titulo: string; tension: string; decision: string; costo: string }) {
  return (
    <article className="eb-dec" style={cv({ '--dec-c': props.color })}>
      <div className="eb-dec-top"><span className="eb-dec-n">{props.n}</span><span className="eb-tag">{props.tag}</span></div>
      <h3>{props.titulo}</h3>
      <div className="eb-dec-row"><span className="eb-label">Tensión</span><p>{props.tension}</p></div>
      <div className="eb-dec-row is-dec"><span className="eb-label">Decisión</span><p>{props.decision}</p></div>
      <div className="eb-dec-row is-cost"><span className="eb-label">Costo</span><p>{props.costo}</p></div>
    </article>
  );
}

function IdpsRow({ nombre, det, sim, col }: { nombre: string; det: string; sim: number; col: number }) {
  return (
    <div className="eb-idps-r">
      <span><b>{nombre}</b><small>{det}</small></span>
      <span className="eb-bar"><i className="g" style={{ width: `calc(${sim}% * .8)` }} />{sim}</span>
      <span className="eb-bar"><i style={{ width: `calc(${col}% * .8)` }} />{col} <span style={{ color: 'var(--eb-mute-text)' }}>−{sim - col}</span></span>
    </div>
  );
}

/** Tarjeta del colegio reconstruida en HTML (antes: tarjeta-colegio.png, 350×469 px). */
function TarjetaColegio() {
  return (
    <article className="eb-colegio" aria-label="Tarjeta de colegio de eduBIG: Colegio Alexander Graham Bell">
      <h4>Colegio Alexander Graham Bell</h4>
      <div className="eb-media eb-media-wide"><img src={fotoColegio} alt="Fachada del Colegio Alexander Graham Bell" /></div>
      <ul>
        <li><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" /><path d="M10 5.5H7.2a1.3 1.3 0 0 0 0 2.6h1.6a1.3 1.3 0 0 1 0 2.6H6M8 4v1.5M8 10.7V12" /></svg>Educación pública</li>
        <li><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4h8M6 8h8M6 12h8M2.5 3v2.5M2 12.5h1.6L2 10.4a.8.8 0 1 1 1.5-.5" /></svg>Básica</li>
        <li><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 3.5 5.5 2l5 1.8 4-1.3v10l-4 1.5-5-1.8-4 1.3zM5.5 2v10M10.5 3.8v10" /></svg>A 850 m de tu casa</li>
      </ul>
      <div className="eb-chips">
        <span>Gratuito</span><span>Con programa PIE</span><span>SIMCE sobre su GSE</span><span>Convivencia alta</span><span>Sin denuncias</span>
      </div>
      <div className="eb-colegio-cta" aria-hidden="true"><span>Ver ficha</span><span>Comparar</span></div>
    </article>
  );
}

/** Captura de alta resolución en una fila de alto parejo; abre el original. */
function Shot({ ar, cls, src, alt, pie }: { ar: number; cls: string; src: string; alt: string; pie: string }) {
  return (
    <figure className="eb-fig" style={cv({ '--ar': ar })}>
      <a className={`eb-media ${cls} is-zoom`} href={src} target="_blank" rel="noopener noreferrer" aria-label={`Abrir en tamaño completo: ${pie}`}>
        <img src={src} alt={alt} loading="lazy" />
      </a>
      <figcaption className="eb-row-cap">{pie}</figcaption>
    </figure>
  );
}

/** Captura antigua de 300×650 px: nunca a más de 110 px de ancho. */
function LowShot({ src, alt, pie }: { src: string; alt: string; pie: string }) {
  return (
    <figure>
      <div className="eb-media eb-media-phone is-lowres"><img src={src} alt={alt} loading="lazy" /></div>
      <figcaption className="eb-row-cap">{pie}</figcaption>
    </figure>
  );
}

/**
 * Video con poster y botón. Se reproduce silenciado y en bucle al entrar en
 * pantalla (50 %) y se pausa al salir; con «reducir movimiento» no hay autoplay.
 * Los controles aparecen solo mientras se reproduce.
 */
function VideoBox(props: { className: string; src: string; poster: string; label: string; playLabel: string; boton: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    const v = vRef.current;
    if (!box || !v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())),
      { threshold: 0.5 },
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={boxRef} className={`${props.className} eb-vid${playing ? ' is-playing' : ''}`}>
      <video
        ref={vRef}
        src={props.src}
        poster={props.poster}
        muted
        loop
        playsInline
        preload="metadata"
        controls={playing}
        aria-label={props.label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button type="button" className="eb-play" aria-label={props.playLabel} onClick={() => vRef.current?.play().catch(() => {})}>
        {props.boton}
      </button>
    </div>
  );
}

/**
 * Visor de los flujos de FigJam: pestañas en un riel vertical y ventana 3:2.
 * El mapa (apaisado) se ajusta entero; los flujos altos se recorren con scroll
 * interno a 760 px de ancho, legibles.
 */
function FlujoVisor() {
  const [i, setI] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const scRef = useRef<HTMLDivElement>(null);
  const n = FLUJOS.length;
  const f = FLUJOS[i];

  function ir(k: number) {
    const j = Math.max(0, Math.min(n - 1, k));
    setI(j);
    setScrolled(false);
    if (scRef.current) scRef.current.scrollTop = 0;
  }

  return (
    <figure className="eb-fig eb-grid eb-viewer" style={{ marginTop: 'var(--s-6)' }} aria-roledescription="carrusel" aria-label="Flujos del sitio en FigJam">
      <div className="c-1-3 eb-viewer-rail">
        <div className="eb-tabs eb-tabs-v" role="tablist" aria-label="Diagramas" aria-orientation="vertical">
          {FLUJOS.map((x, k) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              id={`eb-ftab-${x.id}`}
              className="eb-tab"
              aria-selected={k === i}
              aria-controls="eb-flow-win"
              tabIndex={k === i ? 0 : -1}
              onClick={() => ir(k)}
              onKeyDown={(e) => tabKeys(e, i, n, ir, (j) => `eb-ftab-${FLUJOS[j].id}`)}
            >
              {x.titulo}
            </button>
          ))}
        </div>
        <div className="eb-viewer-bar">
          <button type="button" className="eb-btn" onClick={() => ir(i - 1)} disabled={i === 0} aria-label="Diagrama anterior"><span aria-hidden="true">←</span></button>
          <output aria-live="polite">{i + 1} / {n}</output>
          <button type="button" className="eb-btn" onClick={() => ir(i + 1)} disabled={i === n - 1} aria-label="Diagrama siguiente"><span aria-hidden="true">→</span></button>
        </div>
        <figcaption className="eb-cap">
          <span className="eb-label">Fig. 08 · Flujo del prototipo 2 en FigJam · {f.titulo}</span>
          <p>
            {f.nota}{' '}
            <a className="eb-link" href={f.url} target="_blank" rel="noopener noreferrer">Abrir en tamaño completo ↗</a>
          </p>
        </figcaption>
      </div>
      <div className="c-4-12">
        <div
          className={'eb-win eb-thin' + (scrolled ? ' is-scrolled' : '')}
          id="eb-flow-win"
          data-mode={f.modo}
          role="tabpanel"
          aria-roledescription="slide"
          aria-labelledby={`eb-ftab-${f.id}`}
        >
          <div
            className="eb-win-scroll"
            ref={scRef}
            tabIndex={0}
            aria-label="Diagrama; desplázate para recorrerlo"
            onScroll={(e) => { if (!scrolled && e.currentTarget.scrollTop > 40) setScrolled(true); }}
          >
            <img src={f.url} alt={f.alt} />
          </div>
          <div className="eb-win-hint" aria-hidden="true">Desplázate dentro del diagrama ↓</div>
          <a className="eb-btn eb-win-open" href={f.url} target="_blank" rel="noopener noreferrer" aria-label="Abrir el diagrama en tamaño completo">↗</a>
        </div>
      </div>
    </figure>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────

const CSS = `
/* ── 0 · Tokens (":root" del scope) ───────────────────────────────────── */
.eb{
  /* superficies y tinta del portafolio */
  --eb-bg:#fafaf7; --eb-surface:#ffffff; --eb-surface-2:#f2f1ec;
  --eb-ink:#0f0f0e; --eb-ink-2:#3a3a38; --eb-mute:#8a8a85;
  --eb-mute-text:#5f5f5a; /* #8a8a85 da 3,3:1 sobre #fafaf7: se usa solo en elementos no textuales; las etiquetas pequeñas usan esta variante (6,3:1) */
  --eb-line:#ebeae4; --eb-line-2:#dcdbd5;
  --eb-frame:1px 4px 4px 1px;            /* marco firma */
  /* paleta propia de eduBIG (ColorBrewer RdBu) — solo datos, acentos y filete */
  --eb-cold-3:#053061; --eb-cold-2:#2166ac; --eb-cold-1:#4393c3; --eb-cold-0:#92c5de;
  --eb-warm-0:#fddbc7; --eb-warm-1:#f4a582; --eb-warm-2:#d6604d; --eb-warm-3:#b2181f;
  --eb-int:#0958D9; --eb-ux:#1fbf75;
  --eb-filete:linear-gradient(90deg,#053061 0%,#2166ac 16%,#4393c3 30%,#92c5de 43%,#f7f7f7 50%,#fddbc7 60%,#f4a582 71%,#d6604d 85%,#b2181f 100%);
  /* tipografía */
  --eb-mono:'IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --eb-mono-med:'IBM Plex Mono:Medium','IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --eb-sans:'IBM Plex Sans:Regular',system-ui,sans-serif;
  --eb-h2:clamp(28px,2.6vw,40px);
  /* grilla */
  --eb-max:1180px; --eb-cols:12; --eb-gap:24px; --eb-indent:188px; --eb-side:80px;
  /* proporciones (las únicas permitidas) */
  --ar-desktop:16/10; --ar-phone:9/19.5; --ar-wide:2/1; --ar-wide-32:3/2; --ar-square:1/1;
  /* ritmo vertical */
  --s-1:8px; --s-2:16px; --s-3:24px; --s-4:32px; --s-5:48px; --s-6:64px; --s-7:96px;
  background:var(--eb-bg); color:var(--eb-ink); font-family:var(--eb-sans);
  -webkit-font-smoothing:antialiased;
}
.eb *{box-sizing:border-box;}
.eb img,.eb video{display:block;max-width:100%;}
.eb a{color:inherit;}
.eb :focus-visible{outline:2px solid var(--eb-int);outline-offset:3px;}

/* ── 2 · Contenedor y grilla de 12 columnas ───────────────────────────── */
.eb .eb-content{padding:32px var(--eb-side) 96px var(--eb-indent);}
.eb .eb-wrap{max-width:var(--eb-max);}
.eb .eb-grid{display:grid;grid-template-columns:repeat(var(--eb-cols),minmax(0,1fr));column-gap:var(--eb-gap);row-gap:var(--s-4);}
.eb .c-1-4{grid-column:1/5}.eb .c-1-5{grid-column:1/6}.eb .c-1-6{grid-column:1/7}.eb .c-1-7{grid-column:1/8}.eb .c-1-8{grid-column:1/9}.eb .c-1-9{grid-column:1/10}.eb .c-1-10{grid-column:1/11}
.eb .c-10-12{grid-column:10/13}.eb .c-4-12{grid-column:4/13}.eb .c-1-3{grid-column:1/4}
.eb .eb-side-cap{align-items:end;}
.eb .eb-side-cap > .eb-cap{margin-top:0;}
.eb .c-5-12{grid-column:5/13}.eb .c-6-12{grid-column:6/13}.eb .c-7-12{grid-column:7/13}.eb .c-8-12{grid-column:8/13}.eb .c-9-12{grid-column:9/13}.eb .c-full{grid-column:1/-1}

.eb .eb-topbar{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:var(--s-5);}
.eb .eb-cat{display:inline-flex;align-items:center;gap:8px;font:500 11px/1 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;color:var(--eb-ink);border:1px solid var(--eb-ux);border-radius:2px;padding:7px 10px;}
.eb .eb-cat i{width:7px;height:7px;border-radius:50%;background:var(--eb-ux);}

/* ── 3 · Etapas: encabezado, titulares, texto ─────────────────────────── */
.eb .eb-stage{padding-bottom:72px;scroll-margin-top:72px;}
.eb .eb-stage.is-hero{padding-bottom:var(--s-6);}
.eb .eb-stagehead{display:flex;justify-content:space-between;align-items:baseline;gap:20px;border-top:1px solid var(--eb-ink);padding-top:12px;margin-bottom:var(--s-4);}
.eb .eb-stagehead span{font:500 11px/1.3 var(--eb-mono-med);letter-spacing:.14em;text-transform:uppercase;}
.eb .eb-stagehead span + span{font-weight:400;color:var(--eb-mute-text);}
.eb .eb-h2{margin:0;font:500 var(--eb-h2)/1.1 var(--eb-mono-med);letter-spacing:-.02em;color:var(--eb-ink);text-wrap:balance;}
.eb .eb-h2.is-long{font-size:clamp(22px,2vw,30px);line-height:1.2;}
.eb .eb-h3{margin:0;font:500 clamp(20px,1.7vw,26px)/1.2 var(--eb-mono-med);letter-spacing:-.015em;text-wrap:balance;}
.eb .eb-sub{display:flex;align-items:baseline;gap:12px;border-top:1px solid var(--eb-line-2);padding-top:12px;margin:var(--s-6) 0 var(--s-4);font:500 11px/1.3 var(--eb-mono-med);letter-spacing:.14em;text-transform:uppercase;}
.eb .eb-p{margin:0;font:400 17px/1.6 var(--eb-sans);color:var(--eb-ink-2);max-width:62ch;text-wrap:pretty;}
.eb .eb-p + .eb-p{margin-top:var(--s-2);}
.eb .eb-p strong{font-weight:600;color:var(--eb-ink);}
.eb .eb-p em{color:var(--eb-ink);}
.eb .eb-remate{margin:var(--s-3) 0 0;padding-left:14px;border-left:3px solid var(--eb-ink);font:500 16px/1.45 var(--eb-mono-med);color:var(--eb-ink);}
.eb .eb-label{font:500 11px/1.3 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;color:var(--eb-mute-text);}
.eb .eb-mono{font-family:var(--eb-mono);}
.eb .eb-cold{color:var(--eb-cold-2);} .eb .eb-warm{color:var(--eb-warm-3);}
/* intro de etapa: titular (7 col) + texto (5 col) */
.eb .eb-intro{align-items:start;margin-bottom:40px;}
.eb .eb-intro .eb-intro-h{grid-column:1/8;}
.eb .eb-intro .eb-intro-t{grid-column:8/13;}
/* variante protagonista: titular ancho arriba, texto abajo */
.eb .eb-intro.is-wide{align-items:end;}
.eb .eb-intro.is-wide .eb-intro-h{grid-column:1/9;}
.eb .eb-intro.is-wide .eb-intro-t{grid-column:9/13;}
.eb .eb-intro.is-wide .eb-h2{font-size:clamp(30px,3vw,44px);}
.eb .eb-intro.is-wide .eb-p{font-size:16px;}

.eb .eb-link{color:var(--eb-int);text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px;}
.eb .eb-link:hover{text-decoration-thickness:2px;}
.eb .eb-link-ext{display:inline-flex;align-items:center;min-height:44px;font:500 13px/1.3 var(--eb-mono-med);}

/* ── 4 · Figuras y sistema de medios ──────────────────────────────────── */
.eb .eb-fig{margin:0;}
.eb .eb-cap{margin-top:12px;display:grid;grid-template-columns:minmax(0,1fr);gap:6px;max-width:78ch;}
.eb .eb-cap .eb-label{color:var(--eb-mute-text);}
.eb .eb-cap p{margin:0;font:400 14px/1.55 var(--eb-sans);color:var(--eb-ink-2);text-wrap:pretty;}
/* marco firma: solo 1 figura protagonista por etapa */
.eb .eb-frame{border:solid var(--eb-ink-2);border-width:var(--eb-frame);background:var(--eb-surface);}
/* borde fino para medios secundarios */
.eb .eb-thin{border:1px solid var(--eb-line-2);background:var(--eb-surface);}

/* módulos de medio: definen proporción; la imagen se recorta con cover anclado arriba */
.eb .eb-media{position:relative;overflow:hidden;background:var(--eb-surface-2);border:1px solid var(--eb-line-2);margin:0;}
.eb .eb-media > img,.eb .eb-media > video{width:100%;height:100%;object-fit:cover;object-position:top center;}
.eb .eb-media-desktop{aspect-ratio:var(--ar-desktop);}
.eb .eb-media-phone{aspect-ratio:var(--ar-phone);border-radius:10px;}
.eb .eb-media-wide{aspect-ratio:var(--ar-wide);}
.eb .eb-media-wide-32{aspect-ratio:var(--ar-wide-32);}
.eb .eb-media-square{aspect-ratio:var(--ar-square);}
.eb .eb-media.is-contain > img,.eb .eb-media.is-contain > video{object-fit:contain;object-position:center;}
.eb .eb-media.is-pad > img{padding:12%;}
/* bitmaps de baja resolución (300×650): ancho máximo 150 px CSS */
.eb .eb-media-phone.is-lowres{width:110px;flex:none;}
.eb .eb-media-phone.is-lowres.is-150{width:150px;}
.eb .eb-media-phone.is-lowres.is-140{width:140px;}
.eb .eb-media.is-zoom{cursor:zoom-in;}
.eb a.eb-media{display:block;}
.eb a.eb-media:hover{border-color:var(--eb-ink-2);}

/* fila de alto parejo: cada ítem crece según su proporción (--ar = ancho/alto),
   así todos los medios de la fila quedan con la misma altura, sin alturas en px */
.eb .eb-row{display:flex;gap:var(--eb-gap);align-items:flex-start;}
.eb .eb-row > *{flex:var(--ar) 1 0;min-width:0;}
.eb .eb-row.is-tight{gap:12px;}
.eb .eb-row-cap{margin-top:8px;font:400 13px/1.45 var(--eb-sans);color:var(--eb-ink-2);text-wrap:pretty;}
.eb .eb-row-head{display:flex;flex-direction:column;gap:4px;margin-bottom:10px;min-height:38px;}
.eb .eb-row-head b{font:500 13px/1.2 var(--eb-mono-med);letter-spacing:-.01em;}

/* placeholder: proporción exacta + etiqueta, nunca una imagen inventada */

/* ── 5 · Plegables (patrón visible) ───────────────────────────────────── */
.eb .eb-det{margin-top:var(--s-4);border:1px solid var(--eb-line-2);background:var(--eb-surface);}
.eb .eb-det > summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:16px;align-items:center;min-height:72px;padding:12px 20px 12px 14px;}
.eb .eb-det > summary::-webkit-details-marker{display:none;}
.eb .eb-det-ico{width:44px;height:44px;display:grid;place-items:center;border:solid var(--eb-ink-2);border-width:var(--eb-frame);font:500 20px/1 var(--eb-mono-med);transition:background .15s;}
.eb .eb-det-ico::before{content:"+";}
.eb .eb-det[open] .eb-det-ico::before{content:"−";}
.eb .eb-det-t{display:grid;gap:4px;}
.eb .eb-det-t b{font:500 15px/1.3 var(--eb-mono-med);letter-spacing:-.01em;color:var(--eb-ink);}
.eb .eb-det-t small{font:400 13px/1.4 var(--eb-sans);color:var(--eb-mute-text);}
.eb .eb-det-state{font:500 11px/1 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;color:var(--eb-mute-text);}
.eb .eb-det-state::before{content:"Abrir";}
.eb .eb-det[open] .eb-det-state::before{content:"Cerrar";}
.eb .eb-det > summary:hover{background:var(--eb-surface-2);}
.eb .eb-det > summary:hover .eb-det-ico{background:var(--eb-surface);}
.eb .eb-det[open] > summary{border-bottom:1px solid var(--eb-line-2);}
.eb .eb-det-body{padding:var(--s-4) var(--s-4) var(--s-4);display:grid;gap:var(--s-5);}
.eb .eb-dets{display:grid;gap:12px;margin-top:var(--s-4);}
.eb .eb-dets .eb-det{margin-top:0;}

/* ── 6 · Botones, pestañas y chips ───────────────────────────────────── */
.eb .eb-tabs{display:flex;flex-wrap:wrap;gap:8px;}
.eb .eb-tab{min-height:44px;padding:8px 14px;display:inline-flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;border:1px solid var(--eb-line-2);border-radius:2px;background:var(--eb-surface);color:var(--eb-ink);font:500 13px/1.2 var(--eb-mono-med);cursor:pointer;text-align:left;transition:border-color .15s,background .15s;}
.eb .eb-tab small{font:400 10px/1 var(--eb-mono);letter-spacing:.12em;color:var(--eb-mute-text);}
.eb .eb-tab:hover{border-color:var(--eb-ink-2);}
.eb .eb-tab[aria-selected="true"]{background:var(--eb-ink);border-color:var(--eb-ink);color:var(--eb-bg);}
.eb .eb-tab[aria-selected="true"] small{color:#c9c8c2;}
.eb .eb-btn{min-height:44px;min-width:44px;padding:0 16px;display:inline-flex;align-items:center;gap:8px;border:solid var(--eb-ink-2);border-width:var(--eb-frame);background:var(--eb-surface);font:500 12px/1 var(--eb-mono-med);letter-spacing:.08em;text-transform:uppercase;color:var(--eb-ink);cursor:pointer;}
.eb .eb-btn:hover{background:var(--eb-surface-2);}
.eb .eb-btn:active{transform:translate(1px,1px);}
.eb .eb-btn:disabled{opacity:.4;cursor:not-allowed;}
.eb .eb-tag{display:inline-flex;align-items:center;gap:6px;font:500 10.5px/1 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;color:var(--eb-ink);border:1px solid var(--eb-line-2);border-radius:2px;padding:6px 8px;background:var(--eb-surface);white-space:nowrap;}

/* ── 7 · Etapa 01 · Portada ───────────────────────────────────────────── */
.eb .eb-hook{margin:0;font:400 clamp(18px,1.6vw,22px)/1.45 var(--eb-sans);color:var(--eb-ink-2);max-width:36ch;text-wrap:pretty;}
.eb .eb-h1{margin:18px 0 0;font:600 clamp(36px,4vw,56px)/1.06 var(--eb-mono-med);letter-spacing:-.035em;max-width:15ch;text-wrap:balance;}
.eb .eb-filete{margin-top:var(--s-4);max-width:560px;}
.eb .eb-filete i{display:block;height:6px;background:var(--eb-filete);}
.eb .eb-filete div{display:flex;justify-content:space-between;margin-top:7px;font:500 10.5px/1 var(--eb-mono-med);letter-spacing:.14em;text-transform:uppercase;color:var(--eb-mute-text);}
.eb .eb-lead{margin:var(--s-4) 0 0;font:400 17px/1.6 var(--eb-sans);color:var(--eb-ink-2);max-width:54ch;text-wrap:pretty;}
.eb .eb-ficha{margin:0;display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--eb-ink);align-self:end;}
.eb .eb-ficha > div{padding:12px 16px 12px 0;border-bottom:1px solid var(--eb-line-2);display:grid;gap:5px;align-content:start;}
.eb .eb-ficha > div:nth-child(odd){padding-right:16px;border-right:1px solid var(--eb-line-2);}
.eb .eb-ficha > div:nth-child(even){padding-left:16px;}
.eb .eb-ficha dt{font:500 10px/1.2 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;color:var(--eb-mute-text);}
.eb .eb-ficha dd{margin:0;font:400 14px/1.45 var(--eb-sans);color:var(--eb-ink);}
.eb .eb-ficha dd .eb-mono{font-size:13px;}
.eb .eb-ficha dd small{display:block;font-size:12px;color:var(--eb-mute-text);}
.eb .eb-ficha .eb-link-ext{min-height:0;padding:2px 0;}
.eb .eb-ficha .is-proto{background:linear-gradient(90deg,rgba(9,88,217,.05),transparent);}
.eb .eb-cover-row{margin-top:var(--s-5);align-items:stretch;}
.eb .eb-2min{padding:clamp(20px,2.2vw,28px);display:flex;flex-direction:column;gap:16px;background:var(--eb-surface);border:1px solid var(--eb-line-2);border-top:3px solid var(--eb-ink);}
.eb .eb-2min dl{margin:0;display:grid;gap:14px;}
.eb .eb-2min dt{font:500 11px/1.2 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;color:var(--eb-ink-2);}
.eb .eb-2min dd{margin:4px 0 0;font:400 15px/1.55 var(--eb-sans);color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-2min nav{margin-top:auto;padding-top:14px;border-top:1px solid var(--eb-line-2);display:flex;flex-wrap:wrap;gap:0 16px;align-items:center;}
.eb .eb-2min nav a{font:500 12.5px/1.2 var(--eb-mono-med);color:var(--eb-ink);text-decoration:underline;text-decoration-color:var(--eb-mute);text-underline-offset:3px;min-height:36px;display:inline-flex;align-items:center;}
.eb .eb-2min nav a:hover{text-decoration-color:var(--eb-ink);}
.eb .eb-hero{padding:0;}
.eb .eb-hero .eb-media{border:0;}

/* ── 8 · Etapa 02 · Diagrama y tarjeta reconstruida ───────────────────── */
.eb .eb-diag{padding:clamp(20px,2.6vw,36px);display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--eb-gap);align-items:center;}
.eb .eb-src{grid-column:1/6;position:relative;}
.eb .eb-src ol{list-style:none;margin:10px 0 0;padding:0;border-top:1px solid var(--eb-line-2);}
.eb .eb-src li{display:grid;grid-template-columns:22px minmax(0,1fr) 36px;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--eb-line);}
.eb .eb-src li > span:first-child{font:400 11px/1 var(--eb-mono);color:var(--eb-mute-text);}
.eb .eb-src b{display:block;font:500 13.5px/1.3 var(--eb-mono-med);}
.eb .eb-src small{display:block;font:400 12.5px/1.4 var(--eb-sans);color:var(--eb-mute-text);}
.eb .eb-src li i{height:2px;display:block;}
.eb .eb-node{grid-column:6/8;position:relative;display:flex;align-items:center;justify-content:center;align-self:stretch;}
.eb .eb-node::before{content:"";position:absolute;left:-12px;right:-12px;top:50%;height:2px;background:linear-gradient(90deg,#4393c3,#f7f7f7 50%,#d6604d);}
.eb .eb-node::after{content:"";position:absolute;left:-12px;top:calc(50% - 116px);height:232px;width:2px;background:linear-gradient(180deg,#053061,#4393c3,#92c5de);}
.eb .eb-node img{position:relative;width:120px;height:auto;background:var(--eb-surface);padding:8px;}
.eb .eb-out{grid-column:8/13;display:grid;gap:10px;justify-items:start;}
.eb .eb-out > .eb-label + *{margin-top:2px;}
/* TarjetaColegio en HTML (sustituye tarjeta-colegio.png, 350 px) */
.eb .eb-colegio{width:100%;max-width:300px;background:#fff;border:2px solid #d6604d;border-radius:10px;padding:14px;display:grid;gap:10px;font-family:var(--eb-sans);color:#1f1f1f;box-shadow:0 2px 0 rgba(214,96,77,.18);}
.eb .eb-colegio h4{margin:0;font:600 15px/1.3 var(--eb-sans);}
.eb .eb-colegio .eb-media{border-radius:4px;}
.eb .eb-colegio ul{list-style:none;margin:0;padding:0;display:grid;gap:5px;font-size:13.5px;}
.eb .eb-colegio li{display:flex;gap:8px;align-items:center;}
.eb .eb-colegio svg{width:14px;height:14px;flex:none;stroke:#1f1f1f;fill:none;stroke-width:1.5;}
.eb .eb-chips{display:flex;flex-wrap:wrap;gap:5px;}
.eb .eb-chips span{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;line-height:1;border:1px solid #767676;border-radius:3px;padding:5px 7px;}
.eb .eb-chips svg{width:11px;height:11px;}
.eb .eb-colegio-cta{display:flex;gap:8px;}
.eb .eb-colegio-cta span{flex:1;min-height:40px;display:flex;align-items:center;justify-content:center;font:600 13.5px/1 var(--eb-sans);border-radius:3px;}
.eb .eb-colegio-cta span:first-child{background:#0958D9;color:#fff;}
.eb .eb-colegio-cta span:last-child{border:2px solid #0958D9;color:#0958D9;}

/* personas */
.eb .eb-persona{padding:clamp(18px,2.2vw,28px);}
.eb .eb-persona-tabs{padding-bottom:18px;margin-bottom:24px;border-bottom:1px solid var(--eb-line-2);}
.eb .eb-persona-body{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:var(--eb-gap);row-gap:24px;align-items:start;}
.eb .eb-persona-id{grid-column:1/4;display:grid;gap:12px;}
.eb .eb-persona-id .eb-media{max-width:200px;}
.eb .eb-meta-list{margin:0;}
.eb .eb-meta-list > div{display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;padding:7px 0;border-bottom:1px solid var(--eb-line);}
.eb .eb-meta-list dt{font:500 10px/1.5 var(--eb-mono-med);letter-spacing:.1em;text-transform:uppercase;color:var(--eb-mute-text);}
.eb .eb-meta-list dd{margin:0;font:400 13px/1.45 var(--eb-sans);}
.eb .eb-persona-main{grid-column:4/13;display:grid;grid-template-columns:repeat(9,minmax(0,1fr));column-gap:var(--eb-gap);row-gap:22px;}
.eb .eb-persona-main > header,.eb .eb-persona-main > blockquote{grid-column:1/-1;}
.eb .eb-persona-main blockquote{margin:0;padding-left:16px;border-left:3px solid var(--eb-warm-2);font:italic 400 16px/1.55 var(--eb-sans);max-width:64ch;}
.eb .eb-dolores{grid-column:1/7;}
.eb .eb-implic{grid-column:7/10;display:grid;gap:10px;align-content:start;}
.eb .eb-dol-h,.eb .eb-dol-r{display:grid;grid-template-columns:minmax(0,1fr) 108px;gap:14px;}
.eb .eb-dol-h{padding-bottom:8px;border-bottom:1px solid var(--eb-ink);font:500 10px/1 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;}
.eb .eb-dol-r{padding:10px 0;border-bottom:1px solid var(--eb-line);align-items:baseline;}
.eb .eb-dol-r > span:first-child{font:400 13.5px/1.5 var(--eb-sans);}
.eb .eb-sev{display:grid;gap:2px;}
.eb .eb-sev b{display:flex;align-items:center;gap:6px;font:500 11.5px/1.2 var(--eb-mono-med);}
.eb .eb-sev b::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--sev);}
.eb .eb-sev small{font:400 12px/1.3 var(--eb-sans);color:var(--eb-mute-text);}
.eb .eb-implic-i{display:grid;grid-template-columns:12px minmax(0,1fr);gap:10px;font:400 13.5px/1.5 var(--eb-sans);}
.eb .eb-implic-i::before{content:"";width:6px;height:6px;margin-top:8px;background:var(--eb-cold-2);}

/* ── 9 · Etapa 03 · tira de tres momentos ─────────────────────────────── */
.eb .eb-beat-n{display:flex;gap:10px;align-items:baseline;margin:14px 0 6px;}
.eb .eb-beat-n b{font:500 11px/1 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;}
.eb .eb-beat p{margin:0;font:400 14px/1.55 var(--eb-sans);color:var(--eb-ink-2);text-wrap:pretty;}
.eb .eb-beat .eb-media{background:var(--eb-surface);}
.eb .eb-logo-cell{display:flex;align-items:center;justify-content:center;}
.eb .eb-logo-cell img{width:78%;height:auto;}
.eb .eb-beat-rail{height:6px;background:var(--eb-filete);margin-top:-1px;}
/* cadenas (plegable) */
.eb .eb-chain{display:grid;grid-template-columns:minmax(0,1fr) 120px minmax(0,1fr);gap:24px;align-items:center;padding:18px 0;border-bottom:1px solid var(--eb-line);}
.eb .eb-chain.is-head{border-bottom:1px solid var(--eb-ink);padding-top:0;align-items:end;}
.eb .eb-chain .k{display:grid;gap:5px;padding-left:14px;}
.eb .eb-chain .k.c{border-left:3px solid var(--eb-cold-2);} .eb .eb-chain .k.w{border-left:3px solid var(--eb-warm-3);}
.eb .eb-chain .k b{font:500 15px/1.2 var(--eb-mono-med);}
.eb .eb-chain .k span{font:400 13.5px/1.5 var(--eb-sans);color:var(--eb-ink-2);}
.eb .eb-chain .m{display:grid;gap:6px;justify-items:center;text-align:center;font:400 11px/1.3 var(--eb-sans);color:var(--eb-mute-text);}
.eb .eb-chain .m i{height:2px;width:100%;background:linear-gradient(90deg,#2166ac,#f7f7f7 50%,#b2181f);}

/* ── 10 · Etapa 04 · Tres decisiones ──────────────────────────────────── */
.eb .eb-decs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:auto auto auto auto auto;}
.eb .eb-dec{display:grid;grid-template-rows:subgrid;grid-row:span 5;padding:28px clamp(18px,2vw,28px) 28px;border-left:1px solid var(--eb-line-2);row-gap:16px;}
.eb .eb-dec:first-child{border-left:0;}
.eb .eb-dec-top{display:flex;justify-content:space-between;align-items:flex-start;}
.eb .eb-dec-n{font:500 56px/0.9 var(--eb-mono-med);letter-spacing:-.05em;color:var(--eb-ink);}
.eb .eb-dec-n::after{content:"";display:block;height:4px;width:44px;margin-top:12px;background:var(--dec-c);}
.eb .eb-dec h3{margin:0;font:500 clamp(19px,1.55vw,23px)/1.2 var(--eb-mono-med);letter-spacing:-.015em;text-wrap:balance;}
.eb .eb-dec-row{display:grid;gap:6px;align-content:start;}
.eb .eb-dec-row p{margin:0;font:400 14.5px/1.55 var(--eb-sans);color:var(--eb-ink-2);text-wrap:pretty;}
.eb .eb-dec-row.is-dec p{color:var(--eb-ink);font-size:15.5px;}
.eb .eb-dec-row.is-dec{padding-left:12px;border-left:3px solid var(--eb-ink);}
.eb .eb-dec-row.is-cost{background:var(--eb-surface-2);padding:12px 14px;align-self:end;}
.eb .eb-dec-row.is-cost .eb-label{color:var(--eb-warm-3);}
/* decisiones extra (plegable) */
.eb .eb-decs.is-2{grid-template-columns:repeat(2,minmax(0,1fr));}
/* IDPS */
.eb .eb-idps{padding:24px;}
.eb .eb-idps-r{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:center;padding:12px 0;border-bottom:1px solid var(--eb-line);}
.eb .eb-idps-r.is-h{border-bottom:1px solid var(--eb-ink);padding-top:0;}
.eb .eb-idps-r.is-t{border-bottom:0;border-top:1px dashed var(--eb-mute);margin-top:6px;}
.eb .eb-idps-r b{display:block;font:500 13px/1.3 var(--eb-mono-med);}
.eb .eb-idps-r small{display:block;font:400 12px/1.4 var(--eb-sans);color:var(--eb-mute-text);}
.eb .eb-bar{display:flex;align-items:center;gap:8px;font:400 12px/1 var(--eb-mono);}
.eb .eb-bar i{height:10px;background:var(--eb-ink);flex:none;}
.eb .eb-bar i.g{background:#b9b8b2;}
.eb .eb-scale{display:grid;gap:6px;width:100%;}
.eb .eb-scale > span:first-child{display:block;height:8px;background:var(--eb-line);}
.eb .eb-scale i{display:block;height:8px;}
.eb .eb-scale .eb-mono{font-size:11.5px;color:var(--eb-mute-text);}
.eb .eb-bar i.track{flex:1;background:var(--eb-line);position:relative;height:10px;}

/* ── 11 · Etapa 05 · videos, visor de flujos, capturas ────────────────── */
.eb .eb-vid{position:relative;}
.eb .eb-vid video{background:var(--eb-surface-2);}
.eb .eb-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);min-height:48px;padding:0 18px;display:inline-flex;align-items:center;gap:10px;border:solid var(--eb-ink-2);border-width:var(--eb-frame);background:rgba(255,255,255,.94);font:500 12px/1 var(--eb-mono-med);letter-spacing:.1em;text-transform:uppercase;color:var(--eb-ink);cursor:pointer;}
.eb .eb-play::before{content:"";width:0;height:0;border-left:10px solid var(--eb-ink);border-top:6px solid transparent;border-bottom:6px solid transparent;}
.eb .eb-play:hover{background:#fff;}
.eb .eb-vid.is-playing .eb-play{opacity:0;pointer-events:none;}
.eb .eb-vid-state{position:absolute;left:10px;top:10px;font:500 10px/1 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;background:rgba(255,255,255,.92);padding:5px 7px;border:1px solid var(--eb-line-2);}

.eb .eb-viewer-top{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:12px;}
.eb .eb-viewer{align-items:start;}
.eb .eb-viewer-rail{display:grid;gap:18px;align-content:start;}
.eb .eb-tabs-v{flex-direction:column;flex-wrap:nowrap;}
.eb .eb-tabs-v .eb-tab{width:100%;}
.eb .eb-viewer-rail .eb-viewer-bar{margin-top:0;}
.eb .eb-viewer-rail .eb-cap{margin-top:0;padding-top:14px;border-top:1px solid var(--eb-line-2);}
.eb .eb-win-open{position:absolute;right:12px;top:12px;padding:0;justify-content:center;font-size:16px;text-decoration:none;}
.eb .eb-win{position:relative;aspect-ratio:var(--ar-wide-32);overflow:hidden;background:var(--eb-surface);}
.eb .eb-win-scroll{position:absolute;inset:0;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;}
.eb .eb-win[data-mode="fit"] .eb-win-scroll{overflow:hidden;}
.eb .eb-win[data-mode="fit"] img{width:100%;height:100%;object-fit:contain;}
.eb .eb-win[data-mode="scroll"] img{width:min(100%,760px);height:auto;margin:0 auto;}
.eb .eb-win-hint{position:absolute;left:0;right:0;bottom:0;height:84px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:12px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,0),#fff 75%);font:500 11px/1 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;color:var(--eb-ink-2);transition:opacity .2s;}
.eb .eb-win[data-mode="fit"] .eb-win-hint,.eb .eb-win.is-scrolled .eb-win-hint{opacity:0;}
.eb .eb-viewer-bar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:12px;}
.eb .eb-viewer-bar output{font:400 12px/1 var(--eb-mono);color:var(--eb-mute-text);}

.eb .eb-shots{margin-top:var(--s-6);display:grid;grid-template-columns:minmax(0,1fr);gap:var(--s-5);}
.eb .eb-ver-h{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin-bottom:14px;padding-top:12px;border-top:1px solid var(--eb-line-2);}
.eb .eb-ver-h b{font:500 16px/1.2 var(--eb-mono-med);letter-spacing:-.01em;}
.eb .eb-ver-h .eb-mono{font-size:11px;color:var(--eb-mute-text);}
.eb .eb-ver-h .eb-link-ext{margin-left:auto;}
.eb .eb-p1-wrap{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:var(--eb-gap);align-items:start;border-top:1px solid var(--eb-line-2);}
.eb .eb-p1-wrap .eb-ver-h{border-top:0;flex-direction:column;align-items:flex-start;}
.eb .eb-p1-wrap .eb-ver-h .eb-link-ext{margin-left:0;}
.eb .eb-p1-wrap .eb-p1-strip{padding-top:12px;}
.eb .eb-p1{display:grid;grid-template-columns:auto minmax(0,1fr);gap:var(--eb-gap);align-items:end;}
.eb .eb-p1-strip{display:flex;gap:12px;}
.eb .eb-p1-strip figure{margin:0;width:110px;}
.eb .eb-p1-note{font:400 13px/1.5 var(--eb-sans);color:var(--eb-mute-text);max-width:38ch;}

/* ── 12 · Etapa 06 · Comparar ─────────────────────────────────────────── */
.eb .eb-ad{--eb-lowres-h:calc(150px * 19.5 / 9);justify-content:start;grid-template-columns:auto auto;display:grid;gap:var(--eb-gap);align-items:stretch;}
.eb .eb-ad-col{display:flex;flex-direction:column;}
.eb .eb-ad-col > .eb-label{display:flex;align-items:center;gap:8px;min-height:34px;margin-bottom:10px;}
.eb .eb-ad-col.is-after > .eb-label{color:var(--eb-ink);}
.eb .eb-ad-col.is-after > .eb-label::before{content:"";width:8px;height:8px;background:var(--eb-ink);}
.eb .eb-ad-col.is-before > .eb-label::before{content:"";width:8px;height:8px;border:1px solid var(--eb-mute);}
.eb .eb-ad-before{display:flex;gap:12px;padding:16px;background:var(--eb-surface-2);border:1px solid var(--eb-line-2);}
.eb .eb-ad-after{padding:16px;}
.eb .eb-ad-after .eb-row{align-items:stretch;width:calc(var(--eb-lowres-h) * (0.4615 + 1.6) + 12px);}
.eb .eb-ad-col figcaption{margin-top:10px;font:400 13.5px/1.5 var(--eb-sans);color:var(--eb-ink-2);max-width:56ch;}
.eb .eb-ad-col.is-before figcaption{max-width:32ch;}
.eb .eb-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--eb-gap);margin-top:var(--s-6);counter-reset:s;}
.eb .eb-step{position:relative;padding-top:20px;border-top:1px solid var(--eb-ink);}
.eb .eb-step::before{content:"";position:absolute;top:-5px;left:0;width:9px;height:9px;background:var(--eb-ink);}
.eb .eb-step .eb-mono{font-size:11px;color:var(--eb-mute-text);}
.eb .eb-step b{display:block;margin:6px 0 8px;font:500 17px/1.2 var(--eb-mono-med);}
.eb .eb-step p{margin:0;font:400 14px/1.55 var(--eb-sans);color:var(--eb-ink-2);text-wrap:pretty;}
.eb .eb-rules{margin-top:var(--s-6);}
.eb .eb-rules-g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--eb-gap);margin-top:14px;}
.eb .eb-rule{padding:20px;display:grid;gap:16px;align-content:start;}
.eb .eb-rule p{margin:0;font:400 14.5px/1.55 var(--eb-sans);color:var(--eb-ink-2);}
.eb .eb-rule p strong{color:var(--eb-ink);font-weight:600;}
.eb .eb-rule-vis{height:56px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--eb-line);padding-bottom:16px;}
.eb .eb-pos{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;color:#fff;font:600 12px/1 var(--eb-sans);}
.eb .eb-simbar{position:relative;flex:1;height:12px;background:var(--eb-line);}
.eb .eb-simbar i{position:absolute;left:0;top:0;bottom:0;width:62%;background:#007d79;}
.eb .eb-simbar b{position:absolute;left:70%;top:-6px;bottom:-6px;width:3px;background:#1f1f1f;}
.eb .eb-simbar + span{font:400 11px/1.2 var(--eb-sans);color:var(--eb-mute-text);white-space:nowrap;}
.eb .eb-sig{font:500 12px/1 var(--eb-sans);padding:6px 8px;border:1px solid;border-radius:3px;white-space:nowrap;}

/* ── 13 · Etapa 07 · video + tablero de métricas ──────────────────────── */
.eb .eb-sys{align-items:start;}
.eb .eb-kpis{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--eb-ink);}
.eb .eb-kpi{padding:18px 16px 18px 0;border-bottom:1px solid var(--eb-line-2);display:grid;gap:8px;align-content:start;}
.eb .eb-kpi:nth-child(odd){border-right:1px solid var(--eb-line-2);}
.eb .eb-kpi:nth-child(even){padding-left:16px;}
.eb .eb-kpi b{font:500 clamp(30px,2.8vw,44px)/1 var(--eb-mono-med);letter-spacing:-.04em;}
.eb .eb-kpi p{margin:0;font:400 13.5px/1.5 var(--eb-sans);color:var(--eb-ink-2);text-wrap:pretty;}
.eb .eb-kpi:nth-child(1) b::after,.eb .eb-kpi:nth-child(2) b::after{content:"";display:block;height:3px;width:32px;margin-top:10px;background:var(--eb-cold-2);}
.eb .eb-kpi:nth-child(3) b::after,.eb .eb-kpi:nth-child(4) b::after{content:"";display:block;height:3px;width:32px;margin-top:10px;background:var(--eb-warm-2);}
.eb .eb-kpi-cap{margin-top:12px;}
/* tablas de plegables */
.eb .eb-tbl{width:100%;border-collapse:collapse;font:400 13.5px/1.45 var(--eb-sans);}
.eb .eb-tbl th{text-align:left;font:500 10px/1.2 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;padding:0 12px 8px 0;border-bottom:1px solid var(--eb-ink);}
.eb .eb-tbl td{padding:10px 12px 10px 0;border-bottom:1px solid var(--eb-line);vertical-align:baseline;}
.eb .eb-tbl .r{text-align:right;font-family:var(--eb-mono);}
.eb .eb-sw{display:inline-block;width:14px;height:14px;vertical-align:-2px;margin-right:8px;border:1px solid rgba(0,0,0,.12);}
.eb .eb-crit,.eb .eb-capa,.eb .eb-val{display:grid;grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:var(--eb-gap);padding:18px 0;border-bottom:1px solid var(--eb-line);}
.eb .eb-crit:last-child,.eb .eb-capa:last-child,.eb .eb-val:last-child{border-bottom:0;}
.eb .eb-crit-l,.eb .eb-capa-l,.eb .eb-val-l{display:grid;gap:8px;align-content:start;justify-items:start;}
.eb .eb-crit-l b,.eb .eb-capa-l b,.eb .eb-val-l b{font:500 15px/1.25 var(--eb-mono-med);}
.eb .eb-kv{display:grid;grid-template-columns:84px minmax(0,1fr);gap:14px;padding:5px 0;font:400 14px/1.55 var(--eb-sans);}
.eb .eb-kv > span:first-child{font:500 10px/2 var(--eb-mono-med);letter-spacing:.1em;text-transform:uppercase;color:var(--eb-mute-text);}
.eb .eb-pals{display:grid;grid-template-columns:1fr 1fr;gap:var(--eb-gap);}
.eb .eb-pal-bar{height:14px;margin:10px 0 12px;}
.eb .eb-pal-cat{display:flex;gap:3px;margin:10px 0 12px;}
.eb .eb-pal-cat i{flex:1;height:14px;}
.eb .eb-pal-r{display:grid;grid-template-columns:18px minmax(0,1fr);gap:10px;padding:7px 0;border-bottom:1px solid var(--eb-line);font:400 13px/1.45 var(--eb-sans);}
.eb .eb-pal-r i{width:14px;height:14px;margin-top:3px;}
.eb .eb-pal-r span span{display:block;color:var(--eb-mute-text);}
.eb .eb-pal-rules{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--eb-gap);padding-top:16px;border-top:1px solid var(--eb-line-2);}
.eb .eb-pal-rules div{display:grid;gap:6px;font:400 13.5px/1.5 var(--eb-sans);}
.eb .eb-temp{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--eb-gap);}
.eb .eb-temp > div{display:grid;grid-template-columns:140px minmax(0,1fr);gap:14px;align-items:start;}
.eb .eb-temp p{margin:6px 0 0;font:400 13px/1.5 var(--eb-sans);color:var(--eb-ink-2);}
.eb .eb-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;}

/* ── 14 · Etapa 08 · Línea de tiempo + cierre ─────────────────────────── */
.eb .eb-tl{padding:28px clamp(18px,2.4vw,32px) 24px;}
.eb .eb-tl-bar{height:6px;background:var(--eb-filete);}
.eb .eb-tl ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:var(--eb-gap);}
.eb .eb-tl li{position:relative;padding-top:26px;display:grid;gap:8px;align-content:start;}
.eb .eb-tl li::before{content:"";position:absolute;top:-8px;left:0;width:14px;height:14px;border-radius:50%;background:var(--tl);border:2px solid #fff;box-shadow:0 0 0 1px var(--eb-ink-2);}
.eb .eb-tl li b{font:500 14px/1.3 var(--eb-mono-med);}
.eb .eb-tl li p{margin:0;font:400 13.5px/1.5 var(--eb-sans);color:var(--eb-ink-2);}
.eb .eb-st{justify-self:start;font:500 10px/1 var(--eb-mono-med);letter-spacing:.12em;text-transform:uppercase;padding:5px 7px;border:1px solid var(--eb-line-2);color:var(--eb-ink-2);}
.eb .eb-st.is-now{background:var(--eb-ink);color:#fff;border-color:var(--eb-ink);}
.eb .eb-st.is-next{border-style:dashed;}
.eb .eb-tl li.is-now{background:linear-gradient(180deg,rgba(178,24,31,.06),transparent 70%);margin:-6px -10px 0;padding:32px 10px 10px;}
.eb .eb-tl li.is-now::before{top:-2px;left:10px;width:18px;height:18px;}
.eb .eb-close{margin:0;padding-top:var(--s-4);border-top:1px solid var(--eb-ink);font:500 clamp(26px,2.6vw,40px)/1.15 var(--eb-mono-med);letter-spacing:-.025em;max-width:24ch;text-wrap:balance;}

/* ── 16 · Responsive ──────────────────────────────────────────────────── */
@media (max-width:1080px){
  .eb{--eb-indent:140px;--eb-side:40px;}
  .eb .eb-decs{grid-template-columns:1fr;grid-template-rows:none;}
  .eb .eb-dec{grid-row:auto;grid-template-rows:none;border-left:0;border-top:1px solid var(--eb-line-2);}
  .eb .eb-dec:first-child{border-top:0;}
  .eb .eb-dec-row.is-cost{align-self:start;}
  .eb .eb-tl ol{grid-template-columns:repeat(3,minmax(0,1fr));row-gap:28px;}
}
@media (max-width:900px){
  .eb{--eb-indent:20px;--eb-side:20px;--eb-gap:16px;}
  .eb .eb-content{padding:24px 20px 64px;}
  .eb .eb-grid{grid-template-columns:minmax(0,1fr);}
  .eb .eb-grid > *{grid-column:1/-1!important;}
  .eb .eb-stage{padding-bottom:var(--s-6);}
  .eb .eb-stagehead{margin-bottom:var(--s-4);}
  .eb .eb-ficha{grid-template-columns:1fr;}
  .eb .eb-ficha > div:nth-child(n){padding:10px 0;border-right:0;}
  .eb .eb-diag{grid-template-columns:1fr;row-gap:24px;}
  .eb .eb-src,.eb .eb-node,.eb .eb-out{grid-column:1/-1;}
  .eb .eb-node{min-height:120px;}
  .eb .eb-node::before{left:50%;right:auto;top:0;bottom:0;width:2px;height:auto;background:linear-gradient(180deg,#4393c3,#f7f7f7 50%,#d6604d);}
  .eb .eb-node::after{display:none;}
  .eb .eb-out{justify-items:center;}
  .eb .eb-persona-body,.eb .eb-persona-main{grid-template-columns:1fr;}
  .eb .eb-persona-id,.eb .eb-persona-main,.eb .eb-dolores,.eb .eb-implic{grid-column:1/-1;}
  .eb .eb-persona-id{grid-template-columns:120px minmax(0,1fr);align-items:start;}
  .eb .eb-persona-tabs{flex-wrap:nowrap;overflow-x:auto;}
  .eb .eb-tab{flex:none;}
  /* filas de alto parejo → apiladas o en tira con scroll horizontal controlado */
  .eb .eb-row.is-stack{flex-direction:column;}
  .eb .eb-row.is-stack > *{flex:none;width:100%;}
  .eb .eb-row.is-stack .eb-media-phone{width:min(260px,70%);margin:0 auto;}
  .eb .eb-row.is-scroll{overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:10px;margin-right:-20px;padding-right:20px;}
  .eb .eb-row.is-scroll > *{flex:none;width:calc(300px * var(--ar));scroll-snap-align:start;}
  .eb .eb-beats{overflow-x:auto;scroll-snap-type:x mandatory;margin-right:-20px;padding:0 20px 10px 0;}
  .eb .eb-beats > *{flex:none;width:calc(200px * var(--ar));scroll-snap-align:start;}
  .eb .eb-tabs-v{flex-direction:row;overflow-x:auto;}
  .eb .eb-tabs-v .eb-tab{width:auto;flex:none;}
  .eb .eb-viewer-rail{order:2;}
  .eb .eb-win{aspect-ratio:var(--ar-phone);max-height:72vh;width:100%;}
  .eb .eb-win[data-mode="fit"]{aspect-ratio:var(--ar-wide-32);}
  .eb .eb-p1{grid-template-columns:1fr;}
  .eb .eb-p1-wrap{grid-template-columns:1fr;}
  .eb .eb-ver-h .eb-link-ext{margin-left:0;}
  .eb .eb-tag{white-space:normal;}
  .eb .eb-ad-before{padding:12px;}
  .eb .eb-media-phone.is-lowres.is-150{width:min(150px,42vw);}
  .eb .eb-p1-strip{overflow-x:auto;scroll-snap-type:x mandatory;}
  .eb .eb-p1-strip figure{flex:none;scroll-snap-align:start;}
  .eb .eb-ad{grid-template-columns:1fr;}
  .eb .eb-ad-before{justify-content:center;}
  .eb .eb-ad-after .eb-row{flex-direction:column;width:auto;}
  .eb .eb-ad-after .eb-row > *{flex:none;width:100%;}
  .eb .eb-ad-after .eb-media-phone{width:150px;margin:0 auto;}
  .eb .eb-steps,.eb .eb-rules-g,.eb .eb-pals,.eb .eb-pal-rules,.eb .eb-temp,.eb .eb-decs.is-2{grid-template-columns:1fr;}
  .eb .eb-crit,.eb .eb-capa,.eb .eb-val{grid-template-columns:1fr;gap:10px;}
  .eb .eb-chain{grid-template-columns:1fr;gap:10px;}
  .eb .eb-chain .m{justify-items:start;text-align:left;}
  .eb .eb-tl ol{grid-template-columns:1fr;row-gap:22px;}
  .eb .eb-tl li{padding:0 0 0 30px;}
  .eb .eb-tl li::before{top:2px;left:0;}
  .eb .eb-tl li.is-now{margin:0;padding:10px 10px 10px 40px;}
  .eb .eb-tl li.is-now::before{top:10px;left:10px;}
  .eb .eb-tl-bar{display:none;}
  .eb .eb-idps-r{grid-template-columns:1fr;gap:8px;}
  .eb .eb-det-body{padding:20px 16px;}
  .eb .eb-tbl-wrap{overflow-x:auto;}
}
@media (prefers-reduced-motion:reduce){.eb *{transition:none!important;}}

/* ── 17 · Ajustes del traspaso a React ────────────────────────────────── */
.eb .eb-2min nav button{font:500 12.5px/1.2 var(--eb-mono-med);color:var(--eb-ink);text-decoration:underline;text-decoration-color:var(--eb-mute);text-underline-offset:3px;min-height:36px;display:inline-flex;align-items:center;background:none;border:0;padding:0;cursor:pointer;}
.eb .eb-2min nav button:hover{text-decoration-color:var(--eb-ink);}
.eb .eb-out-note{font:400 13px/1.4 var(--eb-sans);color:var(--eb-mute-text);}
.eb .eb-tiny{font-size:11px;color:var(--eb-mute-text);}
.eb .eb-soft{color:var(--eb-ink-2);}
.eb .eb-tag.is-warm{color:#8a1a20;border-color:rgba(178,24,31,.44);}
.eb .eb-steps{list-style:none;padding:0;margin-bottom:0;}
.eb .eb-frame > .eb-media{border:0;}
.eb .eb-stage.last{padding-bottom:0;}
.eb .eb-close{margin-top:var(--s-6);}
/* videos de los prototipos: maqueta de dispositivo sobre blanco, misma altura */
.eb .eb-vids{padding:clamp(14px,2vw,24px);background:#fff;}
.eb .eb-vids .eb-row-head{min-height:0;}
.eb .eb-vbox{position:relative;overflow:hidden;background:#fff;}
.eb .eb-vbox > video{width:100%;height:100%;object-fit:contain;background:#fff;}
.eb .eb-vbox.is-phone{aspect-ratio:1/2;}
.eb .eb-vbox.is-laptop{aspect-ratio:16/10;}
.eb .eb-media-169{aspect-ratio:16/9;}
@media (max-width:900px){
  .eb .eb-vids .eb-row.is-stack{gap:28px;}
  .eb .eb-vids .eb-row.is-stack .eb-vbox.is-phone{width:min(240px,64%);margin:0 auto;}
}
`;
