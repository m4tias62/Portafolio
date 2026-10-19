import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import ProgressBar, { tickCount } from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import CaseSummary from '@/components/CaseSummary';

import logo from '@/assets/edubig/logo.png';
import tarjeta from '@/assets/edubig/tarjeta-colegio.png';
import bocetoToggle from '@/assets/edubig/boceto-toggle.jpg';
import formalizacionLogo from '@/assets/edubig/formalizacion-logo.png';

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
 * Versión condensada (2026-10-19): 8 etapas pensadas para una lectura de
 * reclutador (portada + En 2 minutos, problema, idea, tres decisiones, del
 * flujo a la pantalla, Comparar a fondo, sistema y forma de trabajo, estado).
 * El detalle del caso anterior (rediseño del 2026-09-14) se conserva en
 * desplegables <details className="eb-det">.
 *
 * Sistema del portafolio conservado (regla del 2026-09-11): NavBar (la pone
 * App), BackButton, regla vertical (ProgressBar) y el indent `pl-[188px]` que
 * usan todos los detalles de proyecto. Fuentes oficiales IBM Plex Mono/Sans.
 * Todo el CSS propio vive bajo `.eb` para no filtrarse al resto del sitio.
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

const FUENTES: { n: string; nombre: string; detalle: string; tono: string }[] = [
  { n: '01', nombre: 'Directorio Mineduc', detalle: 'RBD, dependencia, nivel, copago', tono: '#053061' },
  { n: '02', nombre: 'SIMCE', detalle: 'Agencia de Calidad · 4° y 8° básico', tono: '#2166ac' },
  { n: '03', nombre: 'IDPS', detalle: 'Cinco dimensiones de desarrollo personal y social', tono: '#2166ac' },
  { n: '04', nombre: 'Denuncias Supereduc', detalle: 'Materia y estado de tramitación', tono: '#4393c3' },
  { n: '05', nombre: 'Geolocalización', detalle: 'Distancia real al domicilio', tono: '#4393c3' },
  { n: '06', nombre: 'PAES', detalle: 'Trayectoria de egreso', tono: '#92c5de' },
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

type Eslabon = {
  n: string;
  rol: string;
  frio: string;
  frioGloss: string;
  calido: string;
  calidoGloss: string;
};

const ESLABONES: Eslabon[] = [
  {
    n: '01', rol: 'Origen',
    frio: 'imparcial', frioGloss: 'El dato no toma partido por ningún colegio: solo registra lo que las seis fuentes oficiales publican.',
    calido: 'cuidado', calidoGloss: 'La familia no parte de la curiosidad: parte de querer que a su hijo le vaya bien.',
  },
  {
    n: '02', rol: 'Término medio',
    frio: 'frío', frioGloss: 'Ser imparcial vuelve al dato frío. No consuela, no acompaña, no se adapta a quién pregunta.',
    calido: 'preocupación', calidoGloss: 'Cuidar vuelve a la familia preocupada. La decisión importa, y eso incomoda.',
  },
  {
    n: '03', rol: 'Resultado',
    frio: 'honesto', frioGloss: 'Pero un dato frío es un dato honesto: no promete lo que no puede sostener.',
    calido: 'seguridad', calidoGloss: 'Y una preocupación atendida con un dato honesto termina en seguridad: se puede decidir con esto.',
  },
];

type Decision = {
  n: string;
  ambito: string;
  titulo: string;
  tension: string;
  resolucion: string;
  costo: string;
};

const DECISIONES: Decision[] = [
  {
    n: '01', ambito: 'Arquitectura', titulo: 'Acompañar antes que listar',
    tension: 'Un buscador con filtros asume que la familia ya sabe qué criterios aplicar. La investigación mostró lo contrario: llega sin saber qué preguntar, y una lista de 7.168 colegios filtrable no resuelve eso.',
    resolucion: 'El CTA primario del home es el Test de Calce, no el buscador. La exploración manual queda bajo «o explora por tu cuenta»: disponible, no primera. El recorrido por defecto termina en una shortlist de tres colegios que calzan, no en resultados.',
    costo: 'Se antepone un flujo de cinco preguntas a quien solo quería buscar un nombre, y el producto asume la responsabilidad de haber acotado bien.',
  },
  {
    n: '02', ambito: 'Motor', titulo: 'Motor determinístico, no caja negra',
    tension: 'Un modelo entrenado recomienda mejor en promedio, pero no puede explicar una recomendación concreta a la familia que la recibe.',
    resolucion: 'Reglas explícitas, ponderaciones públicas y metodología consultable desde la propia recomendación.',
    costo: 'Se resigna precisión estadística. El sistema no aprende de lo que hacen los usuarios.',
  },
  {
    n: '03', ambito: 'Contexto', titulo: 'Comparación contra grupo GSE',
    tension: 'Comparar un colegio contra el promedio nacional premia la composición socioeconómica del alumnado y castiga al colegio que trabaja bien en contexto adverso.',
    resolucion: 'Todo indicador se lee contra colegios de grupo socioeconómico similar. Las etiquetas son Sobre, Similar y Bajo respecto de ese grupo, nunca un ranking absoluto.',
    costo: 'Desaparece la respuesta simple a «¿cuál es el mejor colegio de Chile?». La pregunta queda sin contestar a propósito.',
  },
  {
    n: '04', ambito: 'Datos', titulo: 'Series IDPS separadas, nunca un score único',
    tension: 'Clima escolar, autoestima, hábitos y participación miden cosas distintas. Promediarlas produce un número más cómodo y menos cierto.',
    resolucion: 'Las cuatro dimensiones se muestran como series independientes, cada una contra su grupo GSE. El Test de Calce agrupa en Bienestar y Convivencia solo para ponderar, y aun ahí pregunta dónde poner más peso — nunca cuál descartar.',
    costo: 'La familia lee cuatro barras donde otros productos muestran una. Más carga de lectura, menos titular.',
  },
  {
    n: '05', ambito: 'Tono', titulo: 'Nota de legitimación',
    tension: 'El Test de Calce pregunta qué prioriza la familia. Toda pregunta de preferencia implica que hay respuestas mejores que otras, y eso culpabiliza a quien elige distinto.',
    resolucion: 'Cada resultado del test valida explícitamente la combinación elegida antes de mostrar colegios. No hay perfil incorrecto.',
    costo: 'Más texto antes del resultado, y el producto renuncia a la autoridad de decirle a la familia qué debería priorizar.',
  },
];

type Dim = {
  nombre: string;
  que: string;
  valor: string;
  delta: string;
  ancho: string;
  colapso: string;
  anchoColapso: string;
};

const DIMENSIONES: Dim[] = [
  { nombre: 'Clima escolar', que: 'Convivencia · qué tan respetuosa y segura la sienten', valor: '70', delta: '−5', ancho: '70%', colapso: '75', anchoColapso: '75%' },
  { nombre: 'Participación', que: 'Convivencia · pertenencia y formación ciudadana', valor: '74', delta: '−4', ancho: '74%', colapso: '78', anchoColapso: '78%' },
  { nombre: 'Autoestima académica', que: 'Bienestar · confianza y motivación para aprender', valor: '70', delta: '−4', ancho: '70%', colapso: '74', anchoColapso: '74%' },
  { nombre: 'Hábitos de vida saludable', que: 'Bienestar · alimentación, actividad física, autocuidado', valor: '67', delta: '−5', ancho: '67%', colapso: '72', anchoColapso: '72%' },
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

type Hito = { fase: string; estado: string; detalle: string; tono: string };

const HITOS: Hito[] = [
  { fase: 'Prototipo 1 · MVP Pudahuel', estado: 'Hecho', detalle: '57 colegios, solo celular. Del cruce de datos a la última pantalla.', tono: '#2166ac' },
  { fase: 'Análisis heurístico', estado: 'Hecho', detalle: 'WCAG 2.2 AA, heurísticas de Nielsen y arquitectura de información sobre el prototipo 1.', tono: '#4393c3' },
  { fase: 'Prototipo 2 · versión nacional', estado: 'Hecho', detalle: 'Datos (8.250 colegios), flujo (FigJam) y diseño (celular y escritorio) rehechos.', tono: '#d6604d' },
  { fase: 'Testeo con usuarios', estado: 'Fase actual', detalle: 'Probar el prototipo 2 con familias reales.', tono: '#b2181f' },
  { fase: 'Lanzamiento y observatorio', estado: 'Después', detalle: 'Crecer y refinarse con uso real, sin esperar a estar perfecto para salir.', tono: '#8a1a20' },
];

// ─── DATOS DE LA VERSIÓN CONDENSADA (2026-10-19) ──────────────────────────

const FLUJOS: { id: string; titulo: string; url: string; alt: string; nota: string }[] = [
  { id: 'mapa', titulo: '1 · Mapa general', url: v2Flujo1, alt: 'Diagrama 1 · Mapa general del sitio: puntos de entrada, Home, exploración y conexiones con el Test, la ficha y Comparar', nota: 'Cómo se llega al sitio y cómo se conectan la Home, la exploración, el Test, la ficha y Comparar. Azul es nuevo respecto del prototipo 1; violeta, decidido y pendiente.' },
  { id: 'test', titulo: '2 · Test de Calce', url: v2Flujo2, alt: 'Diagrama 2 · Test de Calce: preguntas Q1 a Q5 y el motor con sus dos capas', nota: 'Las cinco preguntas y el motor: descarta, puntúa y ofrece ampliar la distancia si quedan menos de tres colegios.' },
  { id: 'ficha', titulo: '3 · Ficha', url: v2Flujo3, alt: 'Diagrama 3 · Ficha del colegio: cabecera, Lo esencial y módulos en orden fijo', nota: 'Cabecera, «Lo esencial» y los módulos en orden fijo. En violeta, lo decidido que aún no está en el sitio.' },
  { id: 'comparar', titulo: '4 · Comparar', url: v2Flujo4, alt: 'Diagrama 4 · Comparar colegios: entradas, cuántos colegios hay, agregar colegio y grupos en acordeón', nota: 'Cuántos colegios hay, cómo se agrega otro, escritorio o celular y los grupos en orden fijo.' },
];

type DecisionV2 = { n: string; ambito: string; titulo: string; tension: string; resolucion: string; costo: string };

const TRES_DECISIONES: DecisionV2[] = [
  {
    n: '01', ambito: 'Contexto', titulo: 'Comparar con colegios parecidos, no rankear',
    tension: 'Contra el promedio nacional gana el colegio con alumnos de mayor nivel socioeconómico, no el que mejor trabaja.',
    resolucion: 'Cada indicador se lee contra colegios del mismo grupo socioeconómico, con la comparación oficial de la Agencia de Calidad. No hay ranking nacional.',
    costo: 'Desaparece la respuesta a «¿cuál es el mejor colegio de Chile?». La pregunta queda sin contestar a propósito.',
  },
  {
    n: '02', ambito: 'Arquitectura', titulo: 'Acompañar antes que listar',
    tension: 'Un buscador con filtros asume que la familia sabe qué criterios aplicar. La investigación mostró que llega sin saber qué preguntar.',
    resolucion: 'El acceso principal es el Test de Calce: cinco preguntas y tres colegios que calzan, con sus razones a la vista. Explorar y comparar siguen a un toque.',
    costo: 'Se antepone un cuestionario a la búsqueda libre, y el producto asume la responsabilidad de haber acotado bien.',
  },
  {
    n: '03', ambito: 'Datos', titulo: 'Decir solo lo que el dato sostiene',
    tension: 'Un +6 se lee como ventaja aunque, para la Agencia, sea un empate. Y un colegio sin datos tiende a desaparecer.',
    resolucion: 'Verde o mostaza solo cuando la diferencia es significativa; si no, «a la par». El colegio sin datos aparece igual y lo dice. El motor del test usa reglas explícitas, no un modelo opaco.',
    costo: 'Menos titulares llamativos: muchos colegios quedan «a la par».',
  },
];

const PASOS_COMPARAR: { n: string; paso: string; texto: string }[] = [
  { n: '01', paso: 'Referencias', texto: 'Revisé dashboards y tablas comparativas para sacar los patrones que sirven a una familia.' },
  { n: '02', paso: 'Reglas', texto: 'Los convertí en un brief de decisiones cerradas: la misma escala para todos, la referencia siempre rotulada «sus similares», sin coronas ni máximos resaltados y el color nunca solo.' },
  { n: '03', paso: 'Diseño', texto: 'Claude Design generó la propuesta a partir de ese brief y de datos reales de cinco colegios.' },
  { n: '04', paso: 'Código', texto: 'La implementé en el sitio y llevé sus reglas a la ficha y al sistema de interacción completo.' },
];

const CIFRAS: { cifra: string; texto: string }[] = [
  { cifra: '5,74:1', texto: 'contraste del texto secundario. Antes daba 4,49:1 sobre los fondos grises.' },
  { cifra: '3,7:1', texto: 'borde cálido en hover. Antes daba 2,0:1: el estado existía y no se veía.' },
  { cifra: '44 px', texto: 'objetivo táctil mínimo en todo el sitio. WCAG 2.2 pide 24.' },
  { cifra: '0', texto: 'errores de axe-core en Comparar, la ficha y la Home.' },
];

type Pantalla = { url: string; alt: string; pie: string; ancho?: boolean };

const PANTALLAS_MVP: Pantalla[] = [
  { url: scHomeLista, alt: 'MVP de Pudahuel en el celular: lista de colegios con chips de filtro', pie: 'Home con lista y mapa.' },
  { url: scQ1, alt: 'MVP: primera pregunta del Test de Calce, sobre copago', pie: 'Test de Calce, Q1.' },
  { url: scShortlist, alt: 'MVP: shortlist de colegios que calzan, en cards de borde cálido', pie: 'Shortlist de tres colegios.' },
  { url: scFichaTop, alt: 'MVP: ficha de colegio con el resumen «Lo esencial»', pie: 'Ficha con «Lo esencial».' },
];

const PANTALLAS_NACIONAL: Pantalla[] = [
  { url: v2Home, alt: 'Versión nacional en escritorio: Home con el Test de Calce y la tarjeta «¿Dónde buscas colegio?»', pie: 'Home: el Test y la búsqueda por comuna, nombre o ubicación.', ancho: true },
  { url: v2Ficha, alt: 'Versión nacional en escritorio: ficha del Liceo Augusto D Halmar en dos columnas', pie: 'Ficha en dos columnas: identidad fija, módulos a la derecha.', ancho: true },
  { url: v2Q5, alt: 'Versión nacional en el celular: quinta pregunta del Test de Calce', pie: 'Test de Calce, Q5.' },
  { url: v2Shortlist, alt: 'Versión nacional en el celular: shortlist con tres colegios de Ñuñoa', pie: 'Shortlist con las razones del calce.' },
];

// ─── COMPONENTE ────────────────────────────────────────────────────────────

export default function EdubigCaseStudy({ onBack }: { onBack: () => void }) {
  const [pi, setPi] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const video3Ref = useRef<HTMLVideoElement>(null);

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

  // Autoplay al entrar en viewport, silenciado — política de navegadores.
  // Los videos solo corren si están a la vista.
  useEffect(() => {
    const vids = [video1Ref.current, video2Ref.current, video3Ref.current].filter(Boolean) as HTMLVideoElement[];
    if (!vids.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.5 },
    );
    vids.forEach((v) => io.observe(v));
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

  const persona = PERSONAS[pi];

  return (
    <div className="eb bg-[#fafaf7] min-h-screen relative">
      <style>{CSS}</style>

      {/* Regla vertical — misma navegación que el resto de los proyectos */}
      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center max-[900px]:hidden"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical ticks={tickCount(8)} />
      </div>

      <div ref={contentRef} className="eb-content">
        <div className="eb-topbar">
          <BackButton onClick={onBack} label="Volver al listado" />
          <span className="eb-cat-chip" aria-label="Categoría UX-UI">
            <span className="eb-cat-dot" />UX-UI
          </span>
        </div>

        {/* ─── 01 · PORTADA ───────────────────────────────────────────── */}
        <section id="eb-stage-01" className="eb-stage">
          <StageHead n="01" title="Portada" step="01 / 08" />
          <div className="eb-cover">
            <div className="eb-cover-txt">
              <p className="eb-hook-a">
                En Chile, cada colegio queda descrito en seis portales oficiales que no dialogan entre sí.
              </p>
              <h1 className="eb-hook-b">eduBIG los traduce a una decisión.</h1>

              <div className="eb-filete">
                <div className="eb-filete-bar" />
                <div className="eb-filete-row">
                  <span>Dato frío</span><span>Puente</span><span>Familia</span>
                </div>
              </div>

              <p className="eb-lead">
                Plataforma abierta para que las familias chilenas encuentren, exploren y comparen colegios.
                Cada dato se lee contra colegios parecidos, nunca en un ranking.
              </p>

              <dl className="eb-meta">
                <div><dt>Rol</dt><dd>Diseño de producto, datos y sistema, de punta a punta</dd></div>
                <div><dt>Equipo</dt><dd>Israel Rubilar, analista de datos · Matías Cáceres, diseñador</dd></div>
                <div><dt>Escala</dt><dd><span className="mono">57</span> colegios <span className="arrow">→</span> <span className="mono">8.250</span></dd></div>
                <div><dt>Fase actual</dt><dd>Testeo con usuarios del prototipo 2</dd></div>
                <div><dt>Prototipo 2 · nacional</dt><dd><a href="https://edubig-chile.vercel.app/" target="_blank" rel="noopener noreferrer" className="eb-link">edubig-chile.vercel.app ↗</a><br /><span style={{ color: 'var(--eb-dim)', fontSize: 12 }}>8.250 colegios · celular y escritorio</span></dd></div>
                <div><dt>Prototipo 1 · MVP Pudahuel</dt><dd><a href="https://edu-big.vercel.app/" target="_blank" rel="noopener noreferrer" className="eb-link">edu-big.vercel.app ↗</a><br /><span style={{ color: 'var(--eb-dim)', fontSize: 12 }}>57 colegios · solo celular</span></dd></div>
              </dl>
            </div>

            <figure className="eb-fig eb-cover-fig">
              <div className="eb-frame eb-frame-img">
                <img src={v2CompararEsc} alt="Comparar colegios en escritorio: cuatro colegios de Ñuñoa en columnas, cada uno con su color y número, y el bloque «Lo que más cambia entre estos colegios»" />
              </div>
              <figcaption className="eb-fcap">
                <span className="eb-figlabel">Fig. 01 · Comparar colegios, prototipo 2</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <div style={{ margin: '0 0 72px' }}>
          <CaseSummary
            items={[
              { label: 'Problema', text: 'Las familias eligen colegio entre seis portales oficiales que no dialogan entre sí, con datos que nadie les explica cómo leer.' },
              { label: 'Qué hice', text: 'Diseñé y construí Edubig de punta a punta, del cruce de datos a la interfaz: un Test de Calce que devuelve tres colegios afines, una exploración por comuna y un comparador donde cada colegio se mide contra colegios parecidos al suyo.' },
              { label: 'Fase actual', text: 'El prototipo 2 está completo: 8.250 colegios, flujo rehecho en FigJam y diseño para celular y escritorio, todo a partir de un análisis heurístico del prototipo 1 (MVP de Pudahuel). Ahora viene el testeo con usuarios reales.' },
            ]}
            links={[
              { label: 'Tres decisiones', targetId: 'eb-stage-04' },
              { label: 'Del flujo a la pantalla', targetId: 'eb-stage-05' },
              { label: 'Comparar a fondo', targetId: 'eb-stage-06' },
              { label: 'Probar el prototipo 2', href: 'https://edubig-chile.vercel.app/' },
              { label: 'Ver el prototipo 1', href: 'https://edu-big.vercel.app/' },
            ]}
          />
        </div>

        {/* ─── 02 · EL PROBLEMA ───────────────────────────────────────── */}
        <section id="eb-stage-02" className="eb-stage">
          <StageHead n="02" title="El problema" step="02 / 08" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Una familia que elige colegio tiene seis fuentes oficiales a su alcance: el directorio del
                Mineduc, el SIMCE y el IDPS de la Agencia de Calidad, las denuncias de la Superintendencia, la
                ubicación y la PAES. Casi nadie las abre, y quien lo hace encuentra siglas sin explicación.
              </p>
              <p className="p-soft">
                Falta traducción, no información: <em>¿este colegio es un buen lugar para mi hijo?</em>
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">No un séptimo portal ni un ranking. Un traductor.</p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-fuentes-grid">
                <div className="eb-fuentes-col">
                  <div className="eb-fuentes-line" />
                  <span className="eb-col-label">Entrada · seis fuentes oficiales</span>
                  {FUENTES.map((f) => (
                    <div className="eb-fuente-row" key={f.n}>
                      <span className="eb-fnum">{f.n}</span>
                      <span className="eb-fbody">
                        <span className="eb-fnombre">{f.nombre}</span>
                        <span className="eb-fdet">{f.detalle}</span>
                      </span>
                      <span className="eb-fbar" style={{ background: f.tono }} />
                    </div>
                  ))}
                  <div className="eb-fuentes-end" />
                </div>

                <div className="eb-fuentes-mid">
                  <div className="eb-fuentes-conn" />
                  <div className="eb-fuentes-node">
                    <img src={logo} alt="Isologo eduBIG" />
                  </div>
                </div>

                <div className="eb-fuentes-out">
                  <span className="eb-col-label">Salida · una conclusión legible</span>
                  <img src={tarjeta} alt="TarjetaColegio de eduBIG: Colegio Alexander Graham Bell, educación pública, básica, a 850 m, con etiquetas gratuito, programa PIE, SIMCE sobre su GSE, convivencia alta y sin denuncias" className="eb-tarjeta" />
                  <span className="eb-fdet" style={{ maxWidth: 276 }}>Etiquetas con contexto, no un puntaje.</span>
                </div>
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 02 · Seis entradas, una salida</span>
              <p>Las fuentes no se suman en un puntaje: se cruzan y salen como frases que una familia puede usar.</p>
            </figcaption>
          </figure>

          <div className="eb-substage">
            <span className="mono small uc bold">Investigación · tres personas</span>
          </div>
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Tres personas construidas sobre evidencia: informes del BID, datos de la Agencia de Calidad
                y denuncias de la Supereduc. Ninguna salió de mi cabeza.
              </p>
              <p className="p-soft">
                De las tres aparecen cinco dolores que se repiten. El más grave no es de usabilidad ni de
                acceso: es de idioma.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">El dato existe, pero no habla el idioma de la decisión familiar.</p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame" style={{ padding: '26px 30px 30px' }}>
              <div className="eb-persona-tabs" role="tablist" aria-label="Personas">
                {PERSONAS.map((p, i) => (
                  <button
                    key={p.n}
                    type="button"
                    role="tab"
                    aria-selected={i === pi}
                    onClick={() => setPi(i)}
                    className={'eb-persona-tab' + (i === pi ? ' is-active' : '')}
                  >
                    <span className="eb-persona-tabn">{p.n}</span>
                    <span className="eb-persona-tabnombre">{p.nombre}</span>
                  </button>
                ))}
              </div>

              <div className="eb-persona-body">
                <div className="eb-persona-l">
                  <div
                    role="img"
                    aria-label={`Retrato de persona: ${persona.nombre}`}
                    className="eb-persona-retrato"
                    style={{ backgroundImage: `url(${persona.retrato})` }}
                  />
                  <dl className="eb-persona-meta">
                    {persona.meta.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt><dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="eb-persona-r">
                  <div className="eb-persona-title">
                    <span className="mono uc small dim">{persona.comuna} · {persona.perfil}</span>
                    <h3>{persona.nombre}</h3>
                  </div>

                  <blockquote className="eb-persona-quote">
                    <p>{persona.cita}</p>
                  </blockquote>

                  <div className="eb-persona-dolores">
                    <div className="eb-dolor-head">
                      <span>Dolor</span><span>Severidad</span>
                    </div>
                    {persona.dolores.map((d, i) => (
                      <div className="eb-dolor-row" key={i}>
                        <span className="eb-dolor-txt">{d.dolor}</span>
                        <span className="eb-dolor-sev">
                          <span className="eb-dolor-sev-n">{d.sev}</span>
                          <span className="eb-dolor-efecto">{d.efecto}</span>
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="eb-persona-implic">
                    <span className="mono uc small dim">Implicaciones para el diseño</span>
                    {persona.implicaciones.map((i, k) => (
                      <div className="eb-implic-row" key={k}>
                        <span className="eb-implic-dot" />
                        <span>{i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 03 · Tres personas, una card intercambiable</span>
              <p>
                Cada dolor viene con severidad y con el efecto que produce, porque eso es lo que ordenó
                la prioridad: los dos críticos de Carolina — no entiende las siglas, no tiene computador —
                son los que fijaron mobile-first y lenguaje simple antes que cualquier funcionalidad.
                Carolina y Francisca llegan al mismo requisito desde extremos opuestos del eje
                socioeconómico: una no puede leer un puntaje, la otra no confía en uno sin contexto. Las
                dos piden lo mismo — comparación contra colegios equivalentes — y esa coincidencia es la
                que sostiene la decisión 01.
              </p>
            </figcaption>
          </figure>
        </section>

        {/* ─── 03 · LA IDEA ───────────────────────────────────────────── */}
        <section id="eb-stage-03" className="eb-stage">
          <StageHead n="03" title="La idea" step="03 / 08" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                El concepto rector es <strong>un sistema que se traduce en cuidado</strong>: el dato se
                mantiene fiel, pero llega en un idioma que una familia puede usar.
              </p>
              <p className="p-soft">
                Viene de Hofstadter en <em>Gödel, Escher, Bach</em>: una traducción es fiel cuando conserva la
                estructura, aunque cambie el material.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">Un toggle es el mismo sistema en dos estados. Por eso el logo es un toggle.</p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-logo-pair">
              <div className="eb-logo-beat">
                <span className="mono uc small dim">01 · Boceto</span>
                <div className="eb-logo-box"><img src={bocetoToggle} alt="Board manuscrito del proceso: traducción de dato frío a dato cálido, bocetos de toggle" /></div>
                <p className="eb-logo-desc">
                  Buscando cómo dibujar la traducción de <em>dato frío → dato cálido</em> apareció la pregunta
                  al margen: «¿toggles, switches?».
                </p>
              </div>

              <div className="eb-logo-beat divider">
                <span className="mono uc small dim">02 · Formalización</span>
                <div className="eb-logo-box"><img src={formalizacionLogo} alt="Formalización del logo: retícula de construcción del toggle en estados ON y OFF junto al isologo resultante" /></div>
                <p className="eb-logo-desc">
                  El toggle se desarma en retícula: dos estados, un radio, un eje. La marca hereda esa
                  construcción exacta —misma cápsula, mismo círculo desplazado, mismas tangentes— en vez de
                  imitar su apariencia.
                </p>
              </div>
              </div>

              <div className="eb-logo-final">
                <div className="eb-logo-final-box"><img src={logo} alt="Isologo eduBIG final" /></div>
                <div className="eb-logo-final-txt">
                  <span className="mono uc small dim">03 · Isologo</span>
                  <p>
                    <span className="mono cold">011</span> en Pixelify Sans es el dato como sale de la
                    máquina; <span className="mono warm">eB</span> en Work Sans es lo que recibe la familia.
                    El degradado entre ambas es el eje frío–cálido que después ordena el producto.
                  </p>
                </div>
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 04 · Del gesto a la marca</span>
              <p>El isologo no ilustra el concepto: lo ejecuta. Cambia el material, se conserva la estructura.</p>
            </figcaption>
          </figure>

          <details className="eb-det">
            <summary>Ver las dos cadenas del concepto</summary>
            <figure className="eb-fig">
              <div className="eb-frame">
                <div className="eb-eslab-head">
                  <span>
                    <span className="mono uc small">Dato</span>
                    <span className="eb-eslab-sub">Cadena fría</span>
                  </span>
                  <span className="eb-eslab-mid">
                    <span className="mono uc small">Puente</span>
                    <span className="eb-eslab-sub">Posición</span>
                  </span>
                  <span>
                    <span className="mono uc small">Familia</span>
                    <span className="eb-eslab-sub">Cadena cálida</span>
                  </span>
                </div>
                {ESLABONES.map((e) => (
                  <div className="eb-eslab-row" key={e.n}>
                    <div className="eb-eslab-cold">
                      <span className="eb-eslab-key">{e.frio}</span>
                      <span className="eb-eslab-gloss">{e.frioGloss}</span>
                    </div>
                    <div className="eb-eslab-mid-col">
                      <span className="mono small dim">{e.n}</span>
                      <span className="eb-eslab-line" />
                      <span className="eb-eslab-rol">{e.rol}</span>
                    </div>
                    <div className="eb-eslab-warm">
                      <span className="eb-eslab-key">{e.calido}</span>
                      <span className="eb-eslab-gloss">{e.calidoGloss}</span>
                    </div>
                  </div>
                ))}
              </div>
              <figcaption className="eb-fcap">
                <span className="eb-figlabel">Fig. 05 · Dos cadenas, la misma estructura</span>
                <p>
                  Tres eslabones, un origen, un término medio incómodo y un resultado. <em>Frío</em> y{' '}
                  <em>preocupación</em> son los eslabones que un producto amable borraría, y son justamente
                  los que sostienen <em>honesto</em> y <em>seguridad</em>.
                </p>
              </figcaption>
            </figure>
          </details>
        </section>

        {/* ─── 04 · TRES DECISIONES ───────────────────────────────────── */}
        <section id="eb-stage-04" className="eb-stage">
          <StageHead n="04" title="Tres decisiones" step="04 / 08" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Tres decisiones definen el producto. Cada una renuncia a algo que un producto más vendible
                conservaría.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">Si la legibilidad y la honestidad chocan, gana la honestidad. Hacerla legible es trabajo del producto.</p>
            </div>
          </div>

          <div className="eb-decisiones">
            {TRES_DECISIONES.map((d) => (
              <div className="eb-decision" key={d.n}>
                <div className="eb-dec-l">
                  <div className="eb-dec-head">
                    <span className="mono small dim">{d.n}</span>
                    <h3>{d.titulo}</h3>
                  </div>
                  <span className="eb-dec-tag">{d.ambito}</span>
                </div>
                <div className="eb-dec-r">
                  <div className="eb-dec-row">
                    <span className="eb-dec-k dim">Tensión</span>
                    <span className="eb-dec-v soft">{d.tension}</span>
                  </div>
                  <div className="eb-dec-row hilite">
                    <span className="eb-dec-k">Decisión</span>
                    <span className="eb-dec-v">{d.resolucion}</span>
                  </div>
                  <div className="eb-dec-row hilite">
                    <span className="eb-dec-k warn">Costo</span>
                    <span className="eb-dec-v soft">{d.costo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <details className="eb-det">
            <summary>Ver dos decisiones más y por qué el IDPS no se promedia</summary>
            <div className="eb-decisiones">
              {DECISIONES.filter((d) => d.n === '04' || d.n === '05').map((d) => (
                <div className="eb-decision" key={d.n}>
                  <div className="eb-dec-l">
                    <div className="eb-dec-head">
                      <h3>{d.titulo}</h3>
                    </div>
                    <span className="eb-dec-tag">{d.ambito}</span>
                  </div>
                  <div className="eb-dec-r">
                    <div className="eb-dec-row">
                      <span className="eb-dec-k dim">Tensión</span>
                      <span className="eb-dec-v soft">{d.tension}</span>
                    </div>
                    <div className="eb-dec-row hilite">
                      <span className="eb-dec-k">Decisión</span>
                      <span className="eb-dec-v">{d.resolucion}</span>
                    </div>
                    <div className="eb-dec-row hilite">
                      <span className="eb-dec-k warn">Costo</span>
                      <span className="eb-dec-v soft">{d.costo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <figure className="eb-fig">
              <div className="eb-frame">
                <div className="eb-dim-head">
                  <span className="mono uc small">Dimensión IDPS</span>
                  <span className="mono uc small">Colegios similares</span>
                  <span className="mono uc small">Graham Bell · 8° básico</span>
                </div>
                {DIMENSIONES.map((s) => (
                  <div className="eb-dim-row" key={s.nombre}>
                    <span className="eb-dim-name">
                      <span className="mono">{s.nombre}</span>
                      <span className="eb-dim-que">{s.que}</span>
                    </span>
                    <span className="eb-dim-bar">
                      <span className="eb-dim-fill grey" style={{ width: s.anchoColapso }} />
                      <span className="mono small dim">{s.colapso}</span>
                    </span>
                    <span className="eb-dim-bar">
                      <span className="eb-dim-fill dark" style={{ width: s.ancho }} />
                      <span className="mono small">{s.valor}</span>
                      <span className="mono small dim">{s.delta}</span>
                    </span>
                  </div>
                ))}
                <div className="eb-dim-total">
                  <span className="eb-dim-total-l">Colapsado en un score único</span>
                  <span className="eb-dim-bar"><span className="eb-dim-fill grey" style={{ width: '74.8%' }} /><span className="mono small dim">74,8</span></span>
                  <span className="eb-dim-bar"><span className="eb-dim-fill grey" style={{ width: '70.3%' }} /><span className="mono small dim">70,3</span></span>
                </div>
              </div>
              <figcaption className="eb-fcap">
                <span className="eb-figlabel">Fig. 06 · Por qué las cuatro series no se promedian</span>
                <p>
                  Datos de la ficha de Graham Bell, IDPS 8° básico 2025 preliminar. Colapsadas dan{' '}
                  <span className="mono">70,3</span> contra <span className="mono">74,8</span> de sus pares.
                  Separadas muestran cuatro brechas casi iguales —<span className="mono">−5, −4, −4, −5</span>—:
                  un colegio parejo, no uno con un área hundida. El mismo promedio lo daría un colegio con tres
                  dimensiones altas y una colapsada.
                </p>
              </figcaption>
            </figure>
          </details>
        </section>

        {/* ─── 05 · DEL FLUJO A LA PANTALLA ───────────────────────────── */}
        <section id="eb-stage-05" className="eb-stage">
          <StageHead n="05" title="Del flujo a la pantalla" step="05 / 08" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                El <strong>prototipo 1</strong> fue un MVP solo para celular con 57 colegios de Pudahuel,
                construido del cruce de datos a la última pantalla. Funcionó, y con Israel Rubilar decidimos
                llevarlo a todo Chile.
              </p>
              <p className="p-soft">
                El <strong>prototipo 2</strong> salió de un análisis heurístico del primero y cambió en tres
                frentes: datos (de 57 a 8.250 colegios), flujo (rehecho en FigJam antes de programar) y diseño
                (celular y escritorio, Comparar completo y un sistema auditado).
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">La escala nacional rompía supuestos del prototipo 1: sin ubicación por defecto, con colegios sin datos para comparar y con grupos de comparación que cambian según la prueba.</p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-videos">
              <div className="eb-video-item movil">
                <div className="eb-video-head">
                  <span className="eb-version-title">Prototipo 1</span>
                  <span className="mono uc small dim">MVP Pudahuel · celular</span>
                </div>
                <div className="eb-videoframe">
                  <video ref={video2Ref} src="/edubig-navegacion-mvp.mp4" style={{ aspectRatio: '750 / 1522' }} poster="/edubig-navegacion-mvp-poster.jpg" muted controls playsInline preload="metadata" aria-label="Recorrido del prototipo 1, MVP de Pudahuel, en el celular" />
                </div>
              </div>
              <div className="eb-video-item">
                <div className="eb-video-head">
                  <span className="eb-version-title">Prototipo 2</span>
                  <span className="mono uc small dim">Versión nacional · escritorio</span>
                </div>
                <div className="eb-videoframe">
                  <video ref={video3Ref} src="/edubig-navegacion-prototipo2.mp4" style={{ aspectRatio: '1600 / 932' }} poster="/edubig-navegacion-prototipo2-poster.jpg" muted controls playsInline preload="metadata" aria-label="Recorrido del prototipo 2, versión nacional, en escritorio: Test de Calce, shortlist y Comparar" />
                </div>
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 07 · Los dos prototipos, en movimiento</span>
              <p>
                El prototipo 1 recorre el Test de Calce en el celular, con 57 colegios de Pudahuel. El prototipo 2
                hace el mismo camino en escritorio, con el dato nacional, y llega hasta Comparar.
              </p>
            </figcaption>
          </figure>

          <FlujosCarrusel />

          <div className="eb-version">
            <div className="eb-version-head">
              <span className="mono small dim">01</span>
              <span className="eb-version-title">Prototipo 1 · MVP Pudahuel</span>
              <span className="eb-dec-tag">57 colegios · solo celular</span>
              <a href="https://edu-big.vercel.app/" target="_blank" rel="noopener noreferrer" className="eb-link eb-version-link">Abrir el prototipo 1 ↗</a>
            </div>
            <div className="eb-galeria">
              {PANTALLAS_MVP.map((s, i) => (
                <figure className="eb-shot" key={i}>
                  <div role="img" aria-label={s.alt} className="eb-shot-img movil" style={{ backgroundImage: `url(${s.url})` }} />
                  <figcaption>{s.pie}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="eb-version">
            <div className="eb-version-head">
              <span className="mono small dim">02</span>
              <span className="eb-version-title">Prototipo 2 · versión nacional</span>
              <span className="eb-dec-tag">8.250 colegios · celular y escritorio</span>
              <a href="https://edubig-chile.vercel.app/" target="_blank" rel="noopener noreferrer" className="eb-link eb-version-link">Abrir el prototipo 2 ↗</a>
            </div>
            <div className="eb-galeria">
              {PANTALLAS_NACIONAL.map((s, i) => (
                <figure className={'eb-shot' + (s.ancho ? ' ancho' : '')} key={i}>
                  <div role="img" aria-label={s.alt} className={'eb-shot-img ' + (s.ancho ? 'escritorio' : 'movil')} style={{ backgroundImage: `url(${s.url})` }} />
                  <figcaption>{s.pie}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 06 · CASO A FONDO: COMPARAR ────────────────────────────── */}
        <section id="eb-stage-06" className="eb-stage">
          <StageHead n="06" title="Caso a fondo: Comparar" step="06 / 08" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Comparar es la promesa más difícil del producto: poner colegios lado a lado <strong>sin
                declarar un ganador</strong>.
              </p>
              <p className="p-soft">
                El diseño del prototipo 1 mostraba tres columnas con un resumen. Tomás y Francisca necesitaban más:
                ver cada dimensión y entender contra qué se mide cada colegio.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">Cada colegio se compara con colegios parecidos a él, no con los otros de la tabla.</p>
            </div>
          </div>

          <div className="eb-antes-despues">
            <figure className="eb-ad antes">
              <span className="mono uc small dim">Antes · prototipo 1, diseño en Figma, ago-2026</span>
              <div className="eb-ad-moviles">
                <div role="img" aria-label="Prototipo de comparación en el celular: tres colegios en columnas con el resumen «Lo esencial»" className="eb-shot-img movil" style={{ backgroundImage: `url(${scCompTop})` }} />
                <div role="img" aria-label="Prototipo de comparación: cuerpo de la tabla con trayectoria universitaria" className="eb-shot-img movil" style={{ backgroundImage: `url(${scCompCuerpo})` }} />
              </div>
              <figcaption>Tres columnas, un resumen y chips Alto / Medio / Bajo.</figcaption>
            </figure>
            <figure className="eb-ad despues">
              <span className="mono uc small dim">Después · prototipo 2, oct-2026</span>
              <div className="eb-ad-wide">
                <div role="img" aria-label="Comparar en el celular: barra con tres colegios y el bloque «Lo que más cambia»" className="eb-shot-img movil" style={{ backgroundImage: `url(${v2CompararMovil})` }} />
                <img src={v2CompararDetalle} alt="Detalle de Comparar en escritorio: Bienestar con barras de 0 a 100 y la marca de sus similares; Académico con brechas SIMCE en verde, mostaza o gris según la significancia" className="eb-ad-img" />
              </div>
              <figcaption>Hasta 4 colegios en escritorio y 3 en el celular, una dimensión por grupo, cada dato en tres capas: frase, gráfico y número exacto.</figcaption>
            </figure>
          </div>

          <div className="eb-pasos">
            {PASOS_COMPARAR.map((p) => (
              <div className="eb-paso" key={p.n}>
                <span className="mono small dim">{p.n}</span>
                <span className="eb-paso-t">{p.paso}</span>
                <p>{p.texto}</p>
              </div>
            ))}
          </div>

          <div className="eb-reglas">
            <span className="mono uc small dim">Tres reglas que ahora rigen todo el sitio</span>
            <ul>
              <li><strong>Un color fijo por posición</strong>, del 1 al 4, siempre con su número: el color identifica, no juzga.</li>
              <li><strong>«Sus similares» es una marca negra neutra</strong>, no un color más que compita con los colegios.</li>
              <li><strong>Verde o mostaza solo con diferencia significativa</strong>; si no, gris «a la par».</li>
            </ul>
          </div>
        </section>

        {/* ─── 07 · SISTEMA Y FORMA DE TRABAJO ────────────────────────── */}
        <section id="eb-stage-07" className="eb-stage">
          <StageHead n="07" title="Sistema y forma de trabajo" step="07 / 08" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                El análisis heurístico dejó un sistema de diseño auditado contra WCAG 2.2 AA, una sola retícula
                para todo el sitio y los mismos estados en cada control: reposo, hover, foco, activo y
                deshabilitado.
              </p>
              <p className="p-soft">
                La IA trabaja como colaborador dirigido. Yo decido qué se cruza, qué se diseña y con qué
                criterio; la IA escribe y propone; yo valido contra la fuente oficial y el recorrido completo.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">Un contraste que falla no es una infracción formal: es un dato que no se lee.</p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-videoframe">
              <video ref={video1Ref} src="/edubig-proceso-datos.mp4" muted controls playsInline preload="metadata" />
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 09 · El co-work sobre el pipeline</span>
              <p>
                El registro de cómo trabajo con la IA: yo decido qué dato se cruza con qué y en qué orden, la IA
                escribe el código y yo reviso cada resultado contra la fuente oficial. Si un campo queda mal
                cruzado, se nota enseguida en la ficha del colegio. Delego la escritura, no la decisión.
              </p>
            </figcaption>
          </figure>

          <div className="eb-cifras">
            {CIFRAS.map((c) => (
              <div className="eb-cifra" key={c.cifra}>
                <span className="eb-cifra-n">{c.cifra}</span>
                <p>{c.texto}</p>
              </div>
            ))}
          </div>

          <details className="eb-det">
            <summary>Ver la auditoría de contraste y los criterios WCAG</summary>
            <figure className="eb-fig">
              <div className="eb-frame">
                <div className="eb-contraste-head">
                  <span className="mono uc small">Token</span>
                  <span className="mono uc small">Uso en el producto</span>
                  <span className="mono uc small right">Ratio</span>
                  <span className="mono uc small">Veredicto</span>
                </div>
                {CONTRASTE.map((c) => (
                  <div className="eb-contraste-row" key={c.hex}>
                    <span className="eb-contraste-hex">
                      <span className="eb-contraste-chip" style={{ background: c.hex }} />
                      <span className="mono small">{c.hex}</span>
                    </span>
                    <span className="eb-contraste-uso">{c.uso}</span>
                    <span className="mono right">{c.ratio}</span>
                    <span className="eb-contraste-verd">
                      <span className="eb-contraste-dot" style={{ background: c.marca }} />
                      <span style={{ color: c.tintaVeredicto }}>{c.veredicto}</span>
                    </span>
                  </div>
                ))}
                <span className="eb-contraste-nota">
                  Auditoría de sep-2026, ratios contra <span className="mono small">#FFFFFF</span>. En oct-2026
                  se midió todo el texto contra su fondo real y el texto secundario subió de negro al 54 % al 60 %.
                </span>
              </div>
              <figcaption className="eb-fcap">
                <span className="eb-figlabel">Fig. 10 · Auditoría de contraste sobre los tokens</span>
                <p>
                  El hallazgo incómodo: el lado cálido del eje era el más débil. <span className="mono">#f4a582</span>{' '}
                  era el borde en hover, el momento en que el dato cruza a cálido, y no llegaba ni al umbral no
                  textual.
                </p>
              </figcaption>
            </figure>

            <div className="eb-criterios">
              {CRITERIOS.map((k) => (
                <div className="eb-criterio" key={k.sc}>
                  <div className="eb-crit-l">
                    <span className="mono small dim">{k.sc}</span>
                    <span className="eb-crit-name">{k.nombre}</span>
                    <span className="eb-crit-tag" style={{ color: k.tinta, borderColor: k.borde }}>{k.estado}</span>
                  </div>
                  <div className="eb-crit-r">
                    <div className="eb-crit-row">
                      <span className="eb-crit-k dim">Riesgo</span>
                      <span className="eb-crit-v soft">{k.riesgo}</span>
                    </div>
                    <div className="eb-crit-row hilite">
                      <span className="eb-crit-k">Respuesta</span>
                      <span className="eb-crit-v">{k.respuesta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>

          <details className="eb-det">
            <summary>Ver las dos paletas y la card en dos temperaturas</summary>
            <figure className="eb-fig">
              <div className="eb-frame">
                <div className="eb-pals">
                  <div className="eb-pal-col">
                    <div className="eb-pal-title">
                      <span className="mono uc small">Paleta 01 · Eje de traducción</span>
                      <span className="eb-pal-sub">RdBu — ColorBrewer. Ordinal y con dirección.</span>
                    </div>
                    <div className="eb-pal-bar" style={{ background: 'linear-gradient(90deg,#053061,#2166ac,#4393c3,#d1e5f0,#f7f7f7,#fddbc7,#f4a582,#d6604d,#b2181f)' }} />
                    <div className="eb-pal-list">
                      {USOS_EJE.map((u, i) => (
                        <div className="eb-pal-row" key={i}>
                          <span className="eb-pal-swatch" style={{ background: u.tono }} />
                          <span className="eb-pal-txt">
                            <span>{u.estado}</span>
                            <span className="dim">{u.donde}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="eb-pal-col">
                    <div className="eb-pal-title">
                      <span className="mono uc small">Paleta 02 · Colegios en un gráfico</span>
                      <span className="eb-pal-sub">Categórica, de la paleta de Carbon: un color por posición, sin orden ni juicio.</span>
                    </div>
                    <div className="eb-pal-bar-cat">
                      {USOS_CUAL.map((u) => <span key={u.estado} style={{ background: u.tono }} />)}
                    </div>
                    <div className="eb-pal-list">
                      {USOS_CUAL.map((u, i) => (
                        <div className="eb-pal-row" key={i}>
                          <span className="eb-pal-swatch" style={{ background: u.tono }} />
                          <span className="eb-pal-txt">
                            <span>{u.estado}</span>
                            <span className="dim">{u.donde}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="eb-pal-rules">
                  <div>
                    <span className="mono uc small dim">Regla única</span>
                    <span>Si el color responde «¿qué tan traducido está esto?», es RdBu. Si responde «¿cuál de estos colegios es?», es la paleta de posición.</span>
                  </div>
                  <div>
                    <span className="mono uc small dim">Interactivo</span>
                    <span><span className="mono" style={{ color: '#0958D9' }}>#0958D9</span> queda fuera de ambas. Es affordance, no significado: botón, foco, enlace.</span>
                  </div>
                  <div>
                    <span className="mono uc small dim">Tercer encoding</span>
                    <span>Verde y mostaza dicen «sobre» o «bajo sus similares», y solo aparecen cuando la diferencia es significativa.</span>
                  </div>
                </div>
              </div>
              <figcaption className="eb-fcap">
                <span className="eb-figlabel">Fig. 11 · Dos paletas, dos preguntas distintas</span>
                <p>Separarlas es lo que permite que el eje frío–cálido siga significando algo.</p>
              </figcaption>
            </figure>

            <figure className="eb-fig">
              <div className="eb-frame">
                <div className="eb-frames-trad">
                  {FRAMES_TRAD.map((f, i) => (
                    <div className="eb-frame-t" key={i}>
                      <div className="eb-frame-t-head">
                        <span className="eb-frame-t-dot" style={{ background: f.tono }} />
                        <span className="mono uc small">{f.estado}</span>
                      </div>
                      <div role="img" aria-label={f.alt} className="eb-frame-t-img" style={{ backgroundImage: `url(${f.url})` }} />
                      <span className="mono uc small dim">{f.recorte}</span>
                      <p className="eb-frame-t-nota">{f.nota}</p>
                    </div>
                  ))}
                </div>
              </div>
              <figcaption className="eb-fcap">
                <span className="eb-figlabel">Fig. 12 · La misma card, dos temperaturas</span>
                <p>
                  Fría cuando la encontraste tú en una lista; cálida cuando el sistema la trajo para tu familia.
                  En el medio, la pantalla de espera dice <em>Traduciendo tus respuestas</em>.
                </p>
              </figcaption>
            </figure>
          </details>

          <details className="eb-det">
            <summary>Ver qué dirigí, qué generó la IA y cómo validé, capa por capa</summary>
            <figure className="eb-fig">
              <div className="eb-frame" style={{ padding: '8px 34px 34px' }}>
                {CAPAS.map((c) => (
                  <div className="eb-capa-row" key={c.n}>
                    <div className="eb-capa-l">
                      <div className="eb-capa-head">
                        <span className="mono small">{c.n}</span>
                        <span className="eb-capa-name">{c.capa}</span>
                      </div>
                      <span className="eb-capa-stack">{c.stack}</span>
                      <span className="eb-capa-modo">{c.modo}</span>
                    </div>
                    <div className="eb-capa-r">
                      {c.registro.map(([k, v]) => (
                        <div className="eb-capa-reg" key={k}>
                          <span className="eb-reg-k">{k}</span>
                          <span className="eb-reg-v">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <figcaption className="eb-fcap">
                <span className="eb-figlabel">Fig. 13 · Cuatro capas, cuatro modos de dirigir</span>
                <p>
                  El modo lo fija cuánto costaría equivocarse en esa capa: un error en el pipeline ensucia el dato
                  de miles de colegios; uno de frontend se ve y se corrige en el momento.
                </p>
              </figcaption>
            </figure>
          </details>
        </section>

        {/* ─── 08 · ESTADO Y LO QUE SIGUE ─────────────────────────────── */}
        <section id="eb-stage-08" className="eb-stage last">
          <StageHead n="08" title="Fase actual: testeo con usuarios" step="08 / 08" />
          <div className="eb-two">
            <div className="eb-two-l">
              <p className="p-strong">
                Con el prototipo 2 completo, la fase actual es <strong>probarlo con usuarios reales</strong>. Se
                puede recorrer en <a href="https://edubig-chile.vercel.app/" target="_blank" rel="noopener noreferrer" className="eb-link">edubig-chile.vercel.app ↗</a>;
                el prototipo 1 sigue en línea como registro.
              </p>
              <p className="p-soft">
                La validación es una decisión de secuencia: primero el análisis heurístico y de accesibilidad,
                que dio forma al prototipo 2; ahora, las familias.
              </p>
            </div>
            <div className="eb-two-r">
              <p className="eb-pull">Lo que un método conocido puede encontrar no se le pregunta a una familia.</p>
            </div>
          </div>

          <figure className="eb-fig">
            <div className="eb-frame">
              <div className="eb-timeline-bar" />
              <div className="eb-timeline">
                {HITOS.map((h) => (
                  <div className="eb-hito" key={h.fase}>
                    <span className="eb-hito-dot" style={{ background: h.tono }} />
                    <span className="eb-hito-fase">{h.fase}</span>
                    <span className="mono uc small dim">{h.estado}</span>
                    <span className="eb-hito-det">{h.detalle}</span>
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="eb-fcap">
              <span className="eb-figlabel">Fig. 14 · Del prototipo 1 al testeo con usuarios</span>
              <p>La escala cambia; la traducción es la misma.</p>
            </figcaption>
          </figure>

          <details className="eb-det">
            <summary>Ver el método de validación completo</summary>
            <figure className="eb-fig">
              <div className="eb-frame">
                {VALIDACION.map((c) => (
                  <div className="eb-val-row" key={c.n}>
                    <div className="eb-val-l">
                      <span className="mono uc small dim">{c.n}</span>
                      <span className="eb-val-title">{c.titulo}</span>
                      <span className="eb-val-tag" style={{ color: c.tinta, borderColor: c.borde }}>{c.estado}</span>
                      <div className="eb-val-scale">
                        <span className="eb-val-bar" style={{ width: c.ancho, background: c.tono }} />
                        <span className="mono small dim">{c.muestra}</span>
                      </div>
                    </div>
                    <div className="eb-val-r">
                      <p className="eb-val-txt">{c.texto}</p>
                      <div className="eb-val-porque">
                        <span className="mono uc small dim">Por qué</span>
                        <span className="soft">{c.porque}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <figcaption className="eb-fcap">
                <span className="eb-figlabel">Fig. 15 · Tres capas, muestra creciente</span>
                <p>
                  Las dos primeras capas existen para que la tercera no gaste su muestra en encontrar lo que un
                  método conocido encuentra gratis.
                </p>
              </figcaption>
            </figure>
          </details>

          <p className="eb-cierre">
            eduBIG no es un producto terminado. Es un sistema que aprende a traducir.
          </p>
        </section>
      </div>
    </div>
  );
}

// ─── PIEZAS AUXILIARES ────────────────────────────────────────────────────

/** Carrusel de los flujos de FigJam: pestañas, anterior/siguiente y flechas del teclado. */
function FlujosCarrusel() {
  const [i, setI] = useState(0);
  const n = FLUJOS.length;
  const f = FLUJOS[i];
  const ir = (k: number) => setI(Math.max(0, Math.min(n - 1, k)));
  // Con las flechas, el foco acompaña a la pestaña activa si venía desde las pestañas.
  function onKeyDown(e: KeyboardEvent) {
    const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!paso) return;
    e.preventDefault();
    const k = Math.max(0, Math.min(n - 1, i + paso));
    setI(k);
    if ((e.target as HTMLElement).getAttribute('role') === 'tab') {
      requestAnimationFrame(() => document.getElementById(`eb-flujo-tab-${FLUJOS[k].id}`)?.focus());
    }
  }
  return (
    <section className="eb-carr" aria-roledescription="carrusel" aria-label="Flujos del sitio en FigJam" onKeyDown={onKeyDown}>
      <div className="eb-carr-tabs" role="tablist" aria-label="Diagramas">
        {FLUJOS.map((x, k) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            id={`eb-flujo-tab-${x.id}`}
            aria-selected={k === i}
            aria-controls="eb-flujo-panel"
            tabIndex={k === i ? 0 : -1}
            className={'eb-persona-tab' + (k === i ? ' is-active' : '')}
            onClick={() => setI(k)}
          >
            <span className="eb-persona-tabnombre">{x.titulo}</span>
          </button>
        ))}
      </div>

      <div
        id="eb-flujo-panel"
        role="tabpanel"
        aria-roledescription="slide"
        aria-labelledby={`eb-flujo-tab-${f.id}`}
        className="eb-frame eb-carr-view"
      >
        <a href={f.url} target="_blank" rel="noopener noreferrer" className="eb-carr-img" aria-label={`Abrir ${f.titulo} en tamaño completo`}>
          <img src={f.url} alt={f.alt} />
        </a>
      </div>

      <div className="eb-carr-bar">
        <button type="button" className="eb-btn" onClick={() => ir(i - 1)} disabled={i === 0} aria-label="Diagrama anterior">
          <span aria-hidden="true">←</span> Anterior
        </button>
        <span className="mono small dim" aria-live="polite">{i + 1} / {n}</span>
        <button type="button" className="eb-btn" onClick={() => ir(i + 1)} disabled={i === n - 1} aria-label="Diagrama siguiente">
          Siguiente <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="eb-fcap">
        <span className="eb-figlabel">Fig. 08 · Flujo del prototipo 2 en FigJam · {f.titulo}</span>
        <p>
          {f.nota}{' '}
          <a href={f.url} target="_blank" rel="noopener noreferrer" className="eb-link">Abrir en tamaño completo ↗</a>
        </p>
      </div>
    </section>
  );
}


function StageHead({ n, title, step }: { n: string; title: string; step: string }) {
  return (
    <div className="eb-stagehead">
      <span className="mono uc small bold">Etapa {n} · {title}</span>
      <span className="mono uc small dim">{step}</span>
    </div>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────

const CSS = `
.eb{color:var(--eb-ink);
  --eb-ink:#1a1a18;--eb-body:#3d3d38;--eb-dim:#6b6b64;--eb-line:rgba(26,26,24,.16);--eb-line-soft:rgba(26,26,24,.12);
  --eb-cold-3:#053061;--eb-cold-2:#2166ac;--eb-cold-1:#4393c3;--eb-cold-0:#92c5de;
  --eb-warm-0:#fddbc7;--eb-warm-1:#f4a582;--eb-warm-2:#d6604d;--eb-warm-3:#b2181f;
  --eb-int:#0958D9;
  --eb-mono:'IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --eb-mono-med:'IBM Plex Mono:Medium','IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --eb-sans:'IBM Plex Sans:Regular',system-ui,-apple-system,sans-serif;
  --eb-max:1180px;}
.eb *{box-sizing:border-box;}
.eb .eb-content{padding:32px 80px 96px 188px;}
@media(max-width:900px){.eb .eb-content{padding:24px 20px 60px;}}

/* topbar: back + chip de categoría */
.eb .eb-topbar{max-width:var(--eb-max);display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:36px;flex-wrap:wrap;}
.eb .eb-cat-chip{display:inline-flex;align-items:center;gap:8px;font-family:var(--eb-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#4a7a4a;border:1px solid rgba(95,143,95,.55);border-radius:2px;padding:6px 10px;}
.eb .eb-cat-dot{width:6px;height:6px;background:#5f8f5f;border-radius:50%;display:inline-block;}

/* utilidades tipográficas locales */
.eb .mono{font-family:var(--eb-mono);font-size:12.5px;}
.eb .mono.small{font-size:10px;letter-spacing:.1em;}
.eb .mono.uc{text-transform:uppercase;letter-spacing:.12em;}
.eb .mono.bold{font-family:var(--eb-mono-med);font-weight:600;}
.eb .mono.right{text-align:right;}
.eb .mono.cold{color:var(--eb-cold-2);}
.eb .mono.warm{color:var(--eb-warm-3);}
.eb .dim{color:var(--eb-dim);}
.eb .soft{color:var(--eb-body);}
.eb .arrow{color:var(--eb-dim);}

/* stage y encabezado */
.eb .eb-stage{max-width:var(--eb-max);padding:0 0 104px;}
.eb .eb-stage.last{padding-bottom:20px;}
.eb .eb-stagehead{display:flex;align-items:baseline;justify-content:space-between;gap:20px;border-top:1px solid var(--eb-ink);padding-top:12px;flex-wrap:wrap;}
.eb .eb-substage{margin:56px 0 0;border-top:1px solid var(--eb-ink);padding-top:12px;display:flex;align-items:baseline;gap:12px;}

/* layout de dos columnas (párrafos + pull) */
.eb .eb-two{display:flex;flex-wrap:wrap;gap:56px;align-items:flex-start;padding-top:48px;}
.eb .eb-two-l{flex:1 1 380px;display:flex;flex-direction:column;gap:22px;min-width:0;}
.eb .eb-two-r{flex:1 1 300px;min-width:0;border-left:1px solid var(--eb-line);padding-left:26px;}
.eb .p-strong{margin:0;font-family:var(--eb-sans);font-size:17px;line-height:1.62;color:var(--eb-ink);max-width:60ch;text-wrap:pretty;}
.eb .p-soft{margin:0;font-family:var(--eb-sans);font-size:17px;line-height:1.62;color:var(--eb-body);max-width:60ch;text-wrap:pretty;}
.eb .p-strong strong,.eb .p-soft strong{font-weight:600;color:var(--eb-ink);}
.eb .p-strong em,.eb .p-soft em{font-style:italic;color:var(--eb-ink);}
.eb .eb-pull{margin:0;font-family:var(--eb-mono-med);font-weight:500;font-size:clamp(17px,1.55vw,21px);line-height:1.44;letter-spacing:-.01em;color:#141412;text-wrap:pretty;}

/* figuras: marco 1/4/4/1, caption debajo */
.eb .eb-fig{margin:56px 0 0;display:flex;flex-direction:column;gap:14px;}
.eb .eb-frame{border-style:solid;border-color:var(--eb-ink);border-width:1px 4px 4px 1px;background:#f7f7f7;padding:34px;box-sizing:border-box;overflow-x:auto;}
.eb .eb-fcap{display:flex;flex-direction:column;gap:9px;}
.eb .eb-figlabel{font-family:var(--eb-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-dim);}
.eb .eb-fcap p{margin:0;font-family:var(--eb-sans);font-size:13.5px;line-height:1.58;color:var(--eb-body);max-width:74ch;text-wrap:pretty;}
.eb .eb-fcap p em{font-style:italic;color:var(--eb-ink);}

/* STAGE 01 · Cover */
.eb .eb-cover{display:flex;flex-wrap:wrap;gap:56px;align-items:flex-start;padding-top:56px;}
.eb .eb-cover-txt{flex:1 1 420px;min-width:0;display:flex;flex-direction:column;gap:0;}
.eb .eb-hook-a{margin:0;font-family:var(--eb-sans);font-weight:400;font-size:clamp(17px,1.8vw,23px);line-height:1.5;letter-spacing:0;color:var(--eb-body);text-wrap:pretty;max-width:34ch;}
.eb .eb-hook-b{margin:22px 0 0;font-family:var(--eb-mono-med);font-weight:600;font-size:clamp(32px,4.2vw,54px);line-height:1.12;letter-spacing:-.028em;color:#141412;text-wrap:pretty;max-width:16ch;}
.eb .eb-filete{margin:38px 0 0;display:flex;flex-direction:column;gap:7px;}
.eb .eb-filete-bar{height:5px;width:100%;max-width:560px;background:linear-gradient(90deg,#053061 0%,#2166ac 16%,#4393c3 30%,#d1e5f0 43%,#f7f7f7 50%,#fddbc7 60%,#f4a582 71%,#d6604d 85%,#b2181f 100%);}
.eb .eb-filete-row{display:flex;justify-content:space-between;max-width:560px;font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-dim);}
.eb .eb-lead{margin:40px 0 0;font-family:var(--eb-sans);font-size:17px;line-height:1.62;color:var(--eb-body);max-width:58ch;text-wrap:pretty;}
.eb .eb-meta{margin:44px 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(176px,1fr));gap:22px 32px;border-top:1px solid var(--eb-line);padding-top:22px;}
.eb .eb-meta>div{display:flex;flex-direction:column;gap:6px;min-width:0;}
.eb .eb-meta dt{font-family:var(--eb-mono);font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--eb-dim);}
.eb .eb-meta dd{margin:0;font-family:var(--eb-sans);font-size:14px;line-height:1.45;color:var(--eb-ink);}
.eb .eb-fig .eb-frame.eb-frame-logo{padding:34px 30px;display:flex;align-items:center;justify-content:center;}
.eb .eb-frame-logo img{display:block;width:100%;max-width:340px;height:auto;}

/* STAGE 02 · fuentes → nodo → tarjeta */
.eb .eb-fuentes-grid{display:grid;grid-template-columns:minmax(272px,1fr) 132px minmax(252px,.92fr);gap:0;align-items:start;min-width:656px;}
.eb .eb-fuentes-col{position:relative;display:flex;flex-direction:column;gap:0;min-width:0;}
.eb .eb-fuentes-line{position:absolute;top:46px;bottom:13px;right:0;width:1px;background:linear-gradient(180deg,#053061,#2166ac,#4393c3,#92c5de);}
.eb .eb-col-label{font-family:var(--eb-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--eb-dim);padding-bottom:10px;}
.eb .eb-fuente-row{display:grid;grid-template-columns:20px minmax(0,1fr) 28px;gap:12px;align-items:center;border-top:1px solid var(--eb-line-soft);padding:11px 0;}
.eb .eb-fuentes-end{border-top:1px solid var(--eb-line-soft);}
.eb .eb-fnum{font-family:var(--eb-mono);font-size:10px;color:var(--eb-dim);text-align:right;}
.eb .eb-fbody{display:flex;flex-direction:column;gap:2px;min-width:0;}
.eb .eb-fnombre{font-family:var(--eb-mono);font-size:12.5px;color:var(--eb-ink);}
.eb .eb-fdet{font-family:var(--eb-sans);font-size:11.5px;line-height:1.4;color:var(--eb-dim);}
.eb .eb-fbar{height:1px;width:100%;display:block;}
.eb .eb-fuentes-mid{position:relative;align-self:stretch;display:flex;align-items:center;justify-content:center;min-height:200px;}
.eb .eb-fuentes-conn{position:absolute;top:50%;left:0;right:-22px;height:1px;background:linear-gradient(90deg,#4393c3 0%,#4393c3 18%,#f7f7f7 48%,#d6604d 76%,#d6604d 100%);}
.eb .eb-fuentes-node{position:relative;display:flex;align-items:center;justify-content:center;background:#f7f7f7;padding:7px 6px;}
.eb .eb-fuentes-node img{display:block;width:112px;height:auto;}
.eb .eb-fuentes-out{display:flex;flex-direction:column;gap:10px;min-width:0;padding-left:22px;}
.eb .eb-tarjeta{display:block;width:100%;max-width:276px;height:auto;}

/* STAGE 03 · capas */
.eb .eb-capa-row{display:grid;grid-template-columns:minmax(190px,.78fr) minmax(0,1.62fr);gap:34px;align-items:start;border-bottom:1px solid var(--eb-line-soft);padding:26px 0;}
.eb .eb-capa-row:last-child{border-bottom:none;}
.eb .eb-capa-l{display:flex;flex-direction:column;gap:10px;min-width:0;}
.eb .eb-capa-head{display:flex;align-items:baseline;gap:9px;}
.eb .eb-capa-name{font-family:var(--eb-mono-med);font-size:14px;font-weight:500;color:var(--eb-ink);letter-spacing:-.01em;}
.eb .eb-capa-stack{font-family:var(--eb-sans);font-size:12px;line-height:1.4;color:var(--eb-dim);}
.eb .eb-capa-modo{align-self:flex-start;font-family:var(--eb-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-ink);border:1px solid rgba(26,26,24,.34);border-radius:2px;padding:5px 9px;}
.eb .eb-capa-r{display:flex;flex-direction:column;gap:0;min-width:0;}
.eb .eb-capa-reg{display:grid;grid-template-columns:74px minmax(0,1fr);gap:16px;align-items:baseline;padding:7px 0;}
.eb .eb-reg-k{font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-dim);}
.eb .eb-reg-v{font-family:var(--eb-sans);font-size:14.5px;line-height:1.52;color:var(--eb-ink);text-wrap:pretty;}

/* STAGE 04 · personas */
.eb .eb-persona-tabs{display:flex;flex-wrap:wrap;gap:8px;border-bottom:1px solid var(--eb-line);padding-bottom:18px;margin-bottom:26px;}
.eb .eb-persona-tab{display:inline-flex;flex-direction:column;align-items:flex-start;gap:3px;min-height:44px;padding:7px 13px;border-radius:2px;border:1px solid rgba(26,26,24,.28);cursor:pointer;text-align:left;font-family:var(--eb-mono);background:transparent;color:var(--eb-ink);transition:border-color .2s;}
.eb .eb-persona-tab:hover{border-color:var(--eb-ink);}
.eb .eb-persona-tab.is-active{background:var(--eb-ink);border-color:var(--eb-ink);color:#fafaf7;}
.eb .eb-persona-tabn{font-size:9.5px;letter-spacing:.12em;opacity:.72;}
.eb .eb-persona-tabnombre{font-size:12.5px;font-weight:500;letter-spacing:-.01em;}
.eb .eb-persona-body{display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;}
.eb .eb-persona-l{flex:0 1 232px;min-width:186px;display:flex;flex-direction:column;gap:10px;}
.eb .eb-persona-retrato{width:100%;aspect-ratio:1/1;border:1px solid rgba(26,26,24,.2);background-color:#eeeeea;background-size:cover;background-position:center 18%;}
.eb .eb-persona-meta{margin:0;display:flex;flex-direction:column;gap:0;}
.eb .eb-persona-meta>div{display:grid;grid-template-columns:66px minmax(0,1fr);gap:10px;align-items:baseline;border-bottom:1px solid var(--eb-line-soft);padding:7px 0;}
.eb .eb-persona-meta dt{font-family:var(--eb-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-dim);}
.eb .eb-persona-meta dd{margin:0;font-family:var(--eb-sans);font-size:12px;line-height:1.42;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-persona-r{flex:1 1 360px;min-width:0;display:flex;flex-direction:column;gap:22px;}
.eb .eb-persona-title{display:flex;flex-direction:column;gap:7px;}
.eb .eb-persona-title h3{margin:0;font-family:var(--eb-mono);font-size:clamp(20px,2vw,27px);font-weight:500;line-height:1.2;letter-spacing:-.02em;color:#141412;}
.eb .eb-persona-quote{margin:0;padding-left:16px;border-left:2px solid var(--eb-warm-2);}
.eb .eb-persona-quote p{margin:0;font-family:var(--eb-sans);font-size:15.5px;font-style:italic;line-height:1.58;color:var(--eb-ink);max-width:52ch;text-wrap:pretty;}
.eb .eb-persona-dolores{display:flex;flex-direction:column;gap:0;}
.eb .eb-dolor-head{display:grid;grid-template-columns:minmax(0,1fr) 132px;gap:18px;border-bottom:1px solid var(--eb-ink);padding-bottom:8px;font-family:var(--eb-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--eb-ink);}
.eb .eb-dolor-row{display:grid;grid-template-columns:minmax(0,1fr) 132px;gap:18px;align-items:baseline;border-bottom:1px solid var(--eb-line-soft);padding:11px 0;}
.eb .eb-dolor-txt{font-family:var(--eb-sans);font-size:13.5px;line-height:1.5;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-dolor-sev{display:flex;flex-direction:column;gap:2px;}
.eb .eb-dolor-sev-n{font-family:var(--eb-mono-med);font-size:11px;font-weight:600;letter-spacing:.02em;color:var(--eb-ink);}
.eb .eb-dolor-efecto{font-family:var(--eb-sans);font-size:11.5px;line-height:1.35;color:var(--eb-dim);}
.eb .eb-persona-implic{display:flex;flex-direction:column;gap:11px;}
.eb .eb-implic-row{display:grid;grid-template-columns:14px minmax(0,1fr);gap:12px;align-items:baseline;}
.eb .eb-implic-row>span:last-child{font-family:var(--eb-sans);font-size:13.5px;line-height:1.52;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-implic-dot{height:5px;width:5px;border-radius:50%;background:var(--eb-cold-2);display:inline-block;transform:translateY(-3px);}

/* STAGE 05 · eslabones + logo beats */
.eb .eb-eslab-head{display:grid;grid-template-columns:minmax(0,1fr) 120px minmax(0,1fr);gap:24px;border-bottom:1px solid var(--eb-ink);padding-bottom:10px;}
.eb .eb-eslab-head>span{display:flex;flex-direction:column;gap:3px;}
.eb .eb-eslab-head .eb-eslab-mid{text-align:center;}
.eb .eb-eslab-sub{font-family:var(--eb-sans);font-size:11.5px;line-height:1.35;color:var(--eb-dim);}
.eb .eb-eslab-row{display:grid;grid-template-columns:minmax(0,1fr) 120px minmax(0,1fr);gap:24px;align-items:center;border-bottom:1px solid var(--eb-line-soft);padding:20px 0;}
.eb .eb-eslab-cold,.eb .eb-eslab-warm{display:flex;flex-direction:column;gap:6px;min-width:0;padding-left:14px;}
.eb .eb-eslab-cold{border-left:2px solid var(--eb-cold-2);}
.eb .eb-eslab-warm{border-left:2px solid var(--eb-warm-3);}
.eb .eb-eslab-key{font-family:var(--eb-mono-med);font-size:15px;font-weight:500;letter-spacing:-.01em;color:var(--eb-ink);}
.eb .eb-eslab-gloss{font-family:var(--eb-sans);font-size:13px;line-height:1.48;color:var(--eb-body);text-wrap:pretty;}
.eb .eb-eslab-mid-col{display:flex;flex-direction:column;align-items:center;gap:7px;min-width:0;}
.eb .eb-eslab-line{height:1px;width:100%;background:linear-gradient(90deg,var(--eb-cold-2),#f7f7f7 50%,var(--eb-warm-3));}
.eb .eb-eslab-rol{font-family:var(--eb-sans);font-size:10.5px;line-height:1.3;color:var(--eb-dim);text-align:center;}

/* STAGE 05 · logo beats */
.eb .eb-logo-beat{display:flex;flex-direction:column;gap:12px;padding-bottom:30px;}
.eb .eb-logo-beat.divider{border-top:1px solid var(--eb-line-soft);padding:30px 0;}
.eb .eb-logo-box{background:#fff;border:1px solid rgba(26,26,24,.18);padding:12px;box-sizing:border-box;}
.eb .eb-logo-box img{display:block;width:100%;height:auto;}
.eb .eb-logo-desc{margin:0;font-family:var(--eb-sans);font-size:13.5px;line-height:1.55;color:var(--eb-body);max-width:68ch;text-wrap:pretty;}
.eb .eb-logo-desc em{font-style:italic;color:var(--eb-ink);}
.eb .eb-logo-final{display:flex;flex-wrap:wrap;gap:30px;align-items:center;border-top:1px solid var(--eb-line-soft);padding-top:30px;}
.eb .eb-logo-final-box{flex:0 1 300px;min-width:220px;background:#fff;border:1px solid rgba(26,26,24,.18);padding:28px 18px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;}
.eb .eb-logo-final-box img{display:block;width:100%;max-width:250px;height:auto;}
.eb .eb-logo-final-txt{flex:1 1 320px;min-width:0;display:flex;flex-direction:column;gap:12px;}
.eb .eb-logo-final-txt p{margin:0;font-family:var(--eb-sans);font-size:13.5px;line-height:1.55;color:var(--eb-body);max-width:52ch;text-wrap:pretty;}

/* STAGE 06 · decisiones + dimensiones */
.eb .eb-decisiones{margin:48px 0 0;display:flex;flex-direction:column;gap:0;border-top:1px solid var(--eb-ink);}
.eb .eb-decision{display:flex;flex-wrap:wrap;gap:36px;align-items:flex-start;border-bottom:1px solid var(--eb-line);padding:30px 0;}
.eb .eb-dec-l{flex:1 1 260px;min-width:0;display:flex;flex-direction:column;gap:11px;}
.eb .eb-dec-head{display:flex;align-items:baseline;gap:10px;}
.eb .eb-dec-head h3{margin:0;font-family:var(--eb-mono-med);font-size:clamp(16px,1.5vw,19px);font-weight:500;line-height:1.28;letter-spacing:-.015em;color:#141412;text-wrap:pretty;}
.eb .eb-dec-tag{align-self:flex-start;font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-dim);border:1px solid rgba(26,26,24,.28);border-radius:2px;padding:4px 8px;}
.eb .eb-dec-r{flex:2 1 420px;min-width:0;display:flex;flex-direction:column;gap:0;}
.eb .eb-dec-row{display:grid;grid-template-columns:96px minmax(0,1fr);gap:16px;align-items:baseline;padding:0 0 10px;}
.eb .eb-dec-row.hilite{padding:10px 0;border-top:1px solid var(--eb-line-soft);}
.eb .eb-dec-row.hilite:last-child{padding:10px 0 0;}
.eb .eb-dec-k{font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-ink);}
.eb .eb-dec-k.dim{color:var(--eb-dim);}
.eb .eb-dec-k.warn{color:#8a1a20;}
.eb .eb-dec-v{font-family:var(--eb-sans);font-size:14.5px;line-height:1.55;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-dec-v.soft{color:var(--eb-body);}
.eb .eb-dim-head{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr);gap:22px;border-bottom:1px solid var(--eb-ink);padding-bottom:10px;font-family:var(--eb-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--eb-ink);}
.eb .eb-dim-row{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr);gap:22px;align-items:center;border-bottom:1px solid var(--eb-line-soft);padding:16px 0;}
.eb .eb-dim-name{display:flex;flex-direction:column;gap:3px;min-width:0;}
.eb .eb-dim-name .mono{font-size:13.5px;letter-spacing:0;}
.eb .eb-dim-que{font-family:var(--eb-sans);font-size:11.5px;line-height:1.4;color:var(--eb-dim);}
.eb .eb-dim-bar{display:flex;align-items:center;gap:10px;min-width:0;}
.eb .eb-dim-fill{height:8px;display:block;}
.eb .eb-dim-fill.grey{background:#c9c9c2;}
.eb .eb-dim-fill.dark{background:#3d3d38;}
.eb .eb-dim-total{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr);gap:22px;padding-top:14px;}
.eb .eb-dim-total-l{font-family:var(--eb-sans);font-size:12px;line-height:1.45;color:var(--eb-ink);}

/* STAGE 07 · escala + prioridades + video */
.eb .eb-videoframe{border-style:solid;border-color:var(--eb-ink);border-width:1px 4px 4px 1px;overflow:hidden;background:#0f0f0e;display:block;line-height:0;}
.eb .eb-videoframe video{display:block;width:100%;height:auto;}

/* STAGE 08.1 · paletas */
.eb .eb-pals{display:flex;flex-wrap:wrap;gap:34px;align-items:stretch;}
.eb .eb-pal-col{flex:1 1 300px;min-width:0;display:flex;flex-direction:column;gap:14px;}
.eb .eb-pal-title{display:flex;flex-direction:column;gap:4px;}
.eb .eb-pal-sub{font-family:var(--eb-sans);font-size:12px;line-height:1.4;color:var(--eb-dim);}
.eb .eb-pal-bar{height:38px;width:100%;}
.eb .eb-pal-bar-cat{display:flex;height:38px;width:100%;}
.eb .eb-pal-bar-cat>span{flex:1;}
.eb .eb-pal-list{display:flex;flex-direction:column;gap:0;border-top:1px solid var(--eb-line-soft);}
.eb .eb-pal-row{display:grid;grid-template-columns:12px minmax(0,1fr);gap:12px;align-items:start;border-bottom:1px solid var(--eb-line-soft);padding:10px 0;}
.eb .eb-pal-swatch{height:12px;width:12px;margin-top:3px;display:block;}
.eb .eb-pal-txt{display:flex;flex-direction:column;gap:2px;min-width:0;font-family:var(--eb-sans);font-size:13.5px;line-height:1.4;color:var(--eb-ink);}
.eb .eb-pal-txt .dim{font-size:12px;line-height:1.45;}
.eb .eb-pal-rules{margin-top:26px;border-top:1px solid var(--eb-ink);padding-top:16px;display:flex;flex-wrap:wrap;gap:28px;}
.eb .eb-pal-rules>div{flex:1 1 260px;min-width:0;display:flex;flex-direction:column;gap:6px;}
.eb .eb-pal-rules>div>span:last-child{font-family:var(--eb-sans);font-size:13.5px;line-height:1.5;color:var(--eb-ink);text-wrap:pretty;}

/* STAGE 08.1 · frames de traducción */
.eb .eb-frames-trad{display:flex;flex-wrap:wrap;gap:26px;align-items:flex-start;}
.eb .eb-frame-t{flex:1 1 240px;min-width:210px;max-width:300px;display:flex;flex-direction:column;gap:12px;}
.eb .eb-frame-t-head{display:flex;align-items:center;gap:8px;}
.eb .eb-frame-t-dot{height:10px;width:10px;border-radius:50%;display:inline-block;}
.eb .eb-frame-t-img{width:100%;aspect-ratio:390/845;border:1px solid rgba(26,26,24,.2);background-color:#fff;background-size:100% auto;background-repeat:no-repeat;background-position:top center;}
.eb .eb-frame-t-nota{margin:0;font-family:var(--eb-sans);font-size:12.5px;line-height:1.5;color:var(--eb-body);text-wrap:pretty;}
.eb .eb-frame-t-nota em{font-style:italic;color:var(--eb-ink);}

/* STAGE 08.2 · tabla de contraste + criterios */
.eb .eb-contraste-head{display:grid;grid-template-columns:112px minmax(0,1.5fr) 72px minmax(0,1.1fr);gap:20px;border-bottom:1px solid var(--eb-ink);padding-bottom:10px;font-family:var(--eb-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--eb-ink);}
.eb .eb-contraste-row{display:grid;grid-template-columns:112px minmax(0,1.5fr) 72px minmax(0,1.1fr);gap:20px;align-items:center;border-bottom:1px solid var(--eb-line-soft);padding:12px 0;}
.eb .eb-contraste-hex{display:flex;align-items:center;gap:8px;min-width:0;}
.eb .eb-contraste-chip{height:16px;width:16px;flex:none;border:1px solid rgba(26,26,24,.24);}
.eb .eb-contraste-uso{font-family:var(--eb-sans);font-size:13.5px;line-height:1.45;color:var(--eb-body);text-wrap:pretty;}
.eb .eb-contraste-verd{display:flex;align-items:center;gap:8px;min-width:0;font-family:var(--eb-sans);font-size:12.5px;line-height:1.4;text-wrap:pretty;}
.eb .eb-contraste-dot{height:8px;width:8px;flex:none;border-radius:50%;display:inline-block;}
.eb .eb-contraste-nota{display:block;font-family:var(--eb-sans);font-size:11.5px;line-height:1.5;color:var(--eb-dim);padding-top:12px;}
.eb .eb-criterios{margin:52px 0 0;display:flex;flex-direction:column;gap:0;border-top:1px solid var(--eb-ink);}
.eb .eb-criterio{display:flex;flex-wrap:wrap;gap:36px;align-items:flex-start;border-bottom:1px solid var(--eb-line);padding:26px 0;}
.eb .eb-crit-l{flex:1 1 230px;min-width:0;display:flex;flex-direction:column;gap:8px;}
.eb .eb-crit-name{font-family:var(--eb-mono-med);font-size:15px;font-weight:500;letter-spacing:-.01em;color:#141412;text-wrap:pretty;}
.eb .eb-crit-tag{align-self:flex-start;font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;border-width:1px;border-style:solid;border-radius:2px;padding:4px 8px;}
.eb .eb-crit-r{flex:2 1 400px;min-width:0;display:flex;flex-direction:column;gap:0;}
.eb .eb-crit-row{display:grid;grid-template-columns:96px minmax(0,1fr);gap:16px;align-items:baseline;padding:0 0 10px;}
.eb .eb-crit-row.hilite{padding:10px 0 0;border-top:1px solid var(--eb-line-soft);}
.eb .eb-crit-k{font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-ink);}
.eb .eb-crit-k.dim{color:var(--eb-dim);}
.eb .eb-crit-v{font-family:var(--eb-sans);font-size:14.5px;line-height:1.55;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-crit-v.soft{color:var(--eb-body);}

/* STAGE 09 · producto */

/* STAGE 10 · validación */
.eb .eb-val-row{display:flex;flex-wrap:wrap;gap:36px;align-items:flex-start;border-bottom:1px solid var(--eb-line);padding:26px 0;}
.eb .eb-val-row:first-child{border-top:1px solid var(--eb-ink);}
.eb .eb-val-l{flex:1 1 230px;min-width:0;display:flex;flex-direction:column;gap:9px;}
.eb .eb-val-title{font-family:var(--eb-mono-med);font-size:15px;font-weight:500;letter-spacing:-.01em;color:#141412;text-wrap:pretty;}
.eb .eb-val-tag{align-self:flex-start;font-family:var(--eb-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;border-width:1px;border-style:solid;border-radius:2px;padding:4px 8px;}
.eb .eb-val-scale{display:flex;flex-direction:column;gap:6px;padding-top:6px;}
.eb .eb-val-bar{height:7px;display:block;}
.eb .eb-val-r{flex:2 1 400px;min-width:0;display:flex;flex-direction:column;gap:0;}
.eb .eb-val-txt{margin:0 0 12px;font-family:var(--eb-sans);font-size:14.5px;line-height:1.55;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-val-porque{display:grid;grid-template-columns:96px minmax(0,1fr);gap:16px;align-items:baseline;padding:12px 0 0;border-top:1px solid var(--eb-line-soft);font-family:var(--eb-sans);font-size:14.5px;line-height:1.55;}

/* STAGE 11 · timeline y cierre */
.eb .eb-timeline-bar{height:5px;width:100%;border-bottom:1px solid rgba(26,26,24,.22);background:linear-gradient(90deg,#2166ac 0%,#4393c3 26%,#d1e5f0 46%,#fddbc7 56%,#d6604d 78%,#b2181f 100%);}
.eb .eb-timeline{display:flex;gap:0;align-items:stretch;padding-top:0;}
.eb .eb-hito{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:9px;padding:0 18px 0 0;}
.eb .eb-hito-dot{height:14px;width:14px;flex:none;border-radius:50%;margin-top:-4px;}
.eb .eb-hito-fase{font-family:var(--eb-mono-med);font-size:14px;font-weight:500;letter-spacing:-.01em;color:#141412;text-wrap:pretty;}
.eb .eb-hito-det{font-family:var(--eb-sans);font-size:12.5px;line-height:1.5;color:var(--eb-body);text-wrap:pretty;}
.eb .eb-cierre{margin:96px 0 0;font-family:var(--eb-mono-med);font-weight:500;font-size:clamp(24px,3.4vw,44px);line-height:1.24;letter-spacing:-.02em;color:#141412;max-width:24ch;text-wrap:pretty;}

/* responsivo · plegado a una columna */
@media(max-width:900px){
  .eb .eb-two,.eb .eb-cover{gap:32px;}
  .eb .eb-two-r{border-left:none;padding-left:0;border-top:1px solid var(--eb-line);padding-top:22px;}
  .eb .eb-fuentes-grid{grid-template-columns:1fr;min-width:0;}
  .eb .eb-fuentes-line,.eb .eb-fuentes-conn{display:none;}
  .eb .eb-fuentes-mid{min-height:auto;padding:12px 0;}
  .eb .eb-fuentes-out{padding-left:0;}
  .eb .eb-capa-row{grid-template-columns:1fr;gap:16px;}
  .eb .eb-eslab-head,.eb .eb-eslab-row{grid-template-columns:1fr;gap:14px;}
  .eb .eb-eslab-mid-col{align-items:flex-start;}
  .eb .eb-decision,.eb .eb-criterio,.eb .eb-val-row{gap:20px;}
  .eb .eb-timeline{flex-direction:column;gap:24px;padding-top:18px;}
  .eb .eb-hito-dot{margin-top:0;}
  .eb .eb-hito{padding:0;}
  .eb .eb-dim-head,.eb .eb-dim-row,.eb .eb-dim-total{grid-template-columns:1fr;gap:8px;}
  .eb .eb-contraste-head,.eb .eb-contraste-row{grid-template-columns:1fr;gap:6px;}
  .eb .eb-contraste-head .right,.eb .eb-contraste-row .right{text-align:left;}
}

/* ─── Versión condensada (2026-10-19) ─────────────────────────────────── */
.eb .eb-cover-fig{flex:1 1 520px;min-width:0;margin:0;}
.eb .eb-frame-img{padding:0;background:#fff;overflow:hidden;line-height:0;display:block;}
.eb .eb-frame-img img{display:block;width:100%;height:auto;}

/* botón del portafolio (mismo lenguaje que BackButton): desplegables y carrusel */
.eb .eb-btn,.eb .eb-det>summary{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:11px 18px;background:#fff;border-style:solid;border-color:#3a3a38;border-width:1px 4px 4px 1px;font-family:var(--eb-mono-med);font-weight:500;font-size:12px;line-height:1.3;letter-spacing:.12em;text-transform:uppercase;color:#0f0f0e;cursor:pointer;text-align:left;transition:background-color .2s ease,transform .1s ease;}
.eb .eb-btn:hover:not(:disabled),.eb .eb-det>summary:hover{background:#f2f1ec;}
.eb .eb-btn:active:not(:disabled),.eb .eb-det>summary:active{background:#e8e7e1;transform:translate(1px,1px);}
.eb .eb-btn:focus-visible,.eb .eb-det>summary:focus-visible{outline:2px solid #0f0f0e;outline-offset:3px;}
.eb .eb-btn:disabled{cursor:not-allowed;color:#8a8a85;border-color:#c9c8c2;background:#fff;}
.eb .eb-det{margin:40px 0 0;}
.eb .eb-det+.eb-det{margin-top:14px;}
.eb .eb-det>summary{list-style:none;}
.eb .eb-det>summary::-webkit-details-marker{display:none;}
.eb .eb-det>summary::before{content:'+';flex:none;width:12px;font-family:var(--eb-mono);font-size:16px;line-height:1;text-align:center;}
.eb .eb-det[open]>summary::before{content:'−';}
.eb .eb-det[open]{padding-bottom:12px;}
.eb .eb-det>.eb-fig:first-of-type,.eb .eb-det>.eb-decisiones:first-of-type{margin-top:28px;}
.eb .eb-persona-tab:focus-visible{outline:2px solid #0f0f0e;outline-offset:3px;}
.eb .eb-link{color:var(--eb-ink);text-decoration:underline;text-decoration-color:#8a8a85;text-underline-offset:3px;}
.eb .eb-link:hover{text-decoration-color:#0f0f0e;}
.eb .eb-link:focus-visible{outline:2px solid #0f0f0e;outline-offset:2px;}
.eb .eb-version-link{font-family:var(--eb-mono);font-size:12px;margin-left:auto;}

/* los dos prototipos en video */
.eb .eb-videos{display:grid;grid-template-columns:minmax(0,.287fr) minmax(0,1fr);gap:28px;align-items:start;}
.eb .eb-video-item{display:flex;flex-direction:column;gap:12px;min-width:0;}
.eb .eb-video-head{display:flex;flex-direction:column;align-items:flex-start;gap:4px;}

/* carrusel de flujos */
.eb .eb-carr{margin:56px 0 0;display:flex;flex-direction:column;gap:16px;}
.eb .eb-carr-tabs{display:flex;flex-wrap:wrap;gap:8px;}
.eb .eb-carr-view{padding:16px;background:#fff;height:clamp(420px,82vh,900px);display:flex;align-items:center;justify-content:center;overflow:hidden;}
.eb .eb-carr-tabs .eb-persona-tab{min-height:44px;justify-content:center;}
.eb .eb-carr-img{display:flex;width:100%;height:100%;align-items:center;justify-content:center;cursor:zoom-in;}
.eb .eb-carr-img img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;}
.eb .eb-carr-img:focus-visible{outline:2px solid #0f0f0e;outline-offset:4px;}
.eb .eb-carr-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;}

/* MVP y versión nacional */
.eb .eb-version{margin:56px 0 0;border-top:1px solid var(--eb-ink);padding-top:16px;}
.eb .eb-version-head{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-bottom:22px;}
.eb .eb-version-title{font-family:var(--eb-mono-med);font-size:17px;font-weight:500;letter-spacing:-.01em;color:#141412;}
.eb .eb-galeria{display:flex;flex-wrap:wrap;gap:22px;align-items:flex-start;}
.eb .eb-shot{margin:0;flex:0 1 160px;min-width:140px;display:flex;flex-direction:column;gap:10px;}
.eb .eb-shot.ancho{flex:0 1 360px;min-width:260px;}
.eb .eb-logo-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:30px;align-items:start;padding-bottom:30px;}
.eb .eb-logo-pair .eb-logo-beat{padding:0;}
.eb .eb-logo-pair .eb-logo-beat.divider{border-top:none;padding:0;}
.eb .eb-shot-img{width:100%;border:1px solid rgba(26,26,24,.2);background-color:#fff;background-size:100% auto;background-repeat:no-repeat;background-position:top center;}
.eb .eb-shot-img.movil{aspect-ratio:390/845;}
.eb .eb-shot-img.escritorio{aspect-ratio:1440/900;}
.eb .eb-shot figcaption{font-family:var(--eb-sans);font-size:12.5px;line-height:1.45;color:var(--eb-dim);text-wrap:pretty;}

/* Comparar: antes y después, método y reglas */
.eb .eb-antes-despues{margin:56px 0 0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2.3fr);gap:40px;align-items:start;}
.eb .eb-ad{margin:0;display:flex;flex-direction:column;gap:12px;min-width:0;}
.eb .eb-ad-moviles{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.eb .eb-ad-wide{display:grid;grid-template-columns:minmax(0,.4fr) minmax(0,1fr);gap:16px;align-items:start;}
.eb .eb-ad-img{display:block;width:100%;height:auto;border:1px solid rgba(26,26,24,.2);}
.eb .eb-ad figcaption{font-family:var(--eb-sans);font-size:13.5px;line-height:1.55;color:var(--eb-body);max-width:68ch;text-wrap:pretty;}
.eb .eb-ad.antes .eb-shot-img{opacity:.9;}
.eb .eb-pasos{margin:52px 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;}
.eb .eb-paso{border-top:1px solid var(--eb-ink);padding-top:14px;display:flex;flex-direction:column;gap:6px;min-width:0;}
.eb .eb-paso-t{font-family:var(--eb-mono-med);font-size:15px;font-weight:500;letter-spacing:-.01em;color:#141412;}
.eb .eb-paso p{margin:0;font-family:var(--eb-sans);font-size:14px;line-height:1.55;color:var(--eb-body);text-wrap:pretty;}
.eb .eb-reglas{margin:44px 0 0;background:#f7f7f7;border-style:solid;border-color:var(--eb-ink);border-width:1px 4px 4px 1px;padding:24px 28px;}
.eb .eb-reglas ul{margin:14px 0 0;padding-left:20px;display:grid;gap:10px;}
.eb .eb-reglas li{font-family:var(--eb-sans);font-size:15px;line-height:1.55;color:var(--eb-ink);text-wrap:pretty;}
.eb .eb-reglas strong{font-weight:600;}

/* cifras de sistema */
.eb .eb-cifras{margin:48px 0 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));border-top:1px solid var(--eb-ink);border-bottom:1px solid var(--eb-line);}
.eb .eb-cifra{padding:20px 22px 22px 0;display:flex;flex-direction:column;gap:8px;min-width:0;}
.eb .eb-cifra-n{font-family:var(--eb-mono-med);font-weight:600;font-size:clamp(28px,3vw,40px);line-height:1.1;letter-spacing:-.02em;color:#141412;}
.eb .eb-cifra p{margin:0;font-family:var(--eb-sans);font-size:13.5px;line-height:1.5;color:var(--eb-body);max-width:30ch;text-wrap:pretty;}

@media(max-width:900px){
  .eb .eb-antes-despues{grid-template-columns:1fr;gap:32px;}
  .eb .eb-ad-wide{grid-template-columns:1fr;}
  .eb .eb-logo-pair{grid-template-columns:1fr;}
  .eb .eb-carr-view{height:auto;padding:12px;}
  .eb .eb-videos{grid-template-columns:1fr;gap:32px;}
  .eb .eb-video-item.movil{max-width:280px;}
  .eb .eb-carr-img img{max-height:72vh;}
  .eb .eb-ad-wide .eb-shot-img.movil{max-width:240px;}
  .eb .eb-shot{flex:1 1 140px;}
  .eb .eb-shot.ancho{flex:1 1 100%;min-width:0;}
}
`;
