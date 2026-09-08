import { useEffect, useRef, useState } from 'react';
import BackButton from '@/components/BackButton';
import cImg from '@/imports/edubig/persona-carolina.jpg';
import tImg from '@/imports/edubig/persona-tomas.jpg';
import mImg from '@/imports/edubig/persona-martin.jpg';
import bocetos from '@/imports/edubig/bocetos.png';
import logo from '@/imports/edubig/logo.png';
import logoConstru from '@/imports/edubig/logo-construccion.jpg';
import ficha1 from '@/imports/edubig/ficha-1.png';
import ficha2 from '@/imports/edubig/ficha-2.png';
import homeMockup from '@/imports/edubig/home-mockup.png';

/**
 * EdubigCaseStudy — case study dedicado de Edubig.
 *
 * Portado fiel al artifact afinado y aprobado (712d4ed7): mantiene el lenguaje
 * del portafolio (IBM Plex Mono/Sans, #fafaf7, acento verde UX-UI, marcos
 * asimétricos 1/4/4/1). Piezas interactivas nativas: visor de personas y toggle
 * del logo. Diagramas dibujados en SVG/CSS. Assets y videos reales del repo.
 *
 * Todo el CSS vive bajo `.eb` para no filtrarse al resto del sitio.
 */

const PERSONAS = [
  {
    img: cImg,
    name: 'Carolina Muñoz',
    role: 'La mamá práctica · NSE bajo-medio · Pudahuel',
    quote:
      '«No me vengan con siglas ni números raros: solo necesito saber si es gratis, si le queda a una micro y si va a estar tranquilo.»',
    facts: [
      ['Edad', '36 años'],
      ['Ocupación', 'Auxiliar de aseo'],
      ['Familia', 'Madre soltera, 2 hijos'],
      ['Dispositivo', 'Android, sin computador'],
    ],
    priority:
      'Proximidad, gratuidad y convivencia. Necesita un dato legible primero, no la metodología. Se queda en el primer registro del sistema.',
  },
  {
    img: tImg,
    name: 'Tomás & Francisca',
    role: 'La pareja investigadora · NSE medio-alto · Providencia',
    quote:
      '«Un ranking general no nos dice nada. Necesitamos comparar datos objetivos en el tiempo frente a colegios equivalentes.»',
    facts: [
      ['Edad', '39 y 37 años'],
      ['Ocupación', 'Ing. comercial · psicóloga'],
      ['Familia', '1 hija entrando a 1° básico'],
      ['Alfab. digital', 'Alta · planillas, informes'],
    ],
    priority:
      'Comparación rigurosa, proyecto educativo y bienestar medible (IDPS). Bajan hasta el tercer registro: la metodología. El comparador es su feature killer.',
  },
  {
    img: mImg,
    name: 'Martín Soto',
    role: 'El estudiante que co-decide · Paine',
    quote:
      '«Solo quiero ver desde el teléfono si este colegio me prepara para la PAES y si tiene buen ambiente, sin páginas complicadas.»',
    facts: [
      ['Edad', '16 años · III° medio'],
      ['Familia', 'Vive con madre y abuela'],
      ['Dispositivo', 'Android · único de la casa'],
      ['Alfab. digital', 'Nativo · estándar TikTok'],
    ],
    priority:
      'Resultados PAES, ambiente e identidad del colegio. Valora velocidad y tono: si tarda más de 3 segundos, se fue.',
  },
];

const BRECHA = [
  { n: 'A. Graham Bell', v: 31 },
  { n: 'Brasilia', v: 12 },
  { n: 'Alborada', v: 4 },
  { n: 'Los Andes', v: -9 },
  { n: 'San Daniel', v: -24, warn: true },
];

export default function EdubigCaseStudy({ onBack }: { onBack: () => void }) {
  const [pi, setPi] = useState(0);
  const [on, setOn] = useState(false);
  const [progress, setProgress] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const persona = PERSONAS[pi];
  const next = () => setPi((i) => (i + 1) % PERSONAS.length);
  const prev = () => setPi((i) => (i - 1 + PERSONAS.length) % PERSONAS.length);

  return (
    <div className="eb" ref={rootRef}>
      <style>{CSS}</style>

      <div className="progress-wrap"><div className="progress-bar" style={{ width: progress + '%' }} /></div>

      <div className="shell" style={{ paddingTop: 28 }}>
        <BackButton onClick={onBack} />
      </div>

      {/* ===================== COVER ===================== */}
      <div className="shell">
        <section className="stage" style={{ borderTop: 'none', paddingTop: 40, paddingBottom: 56 }}>
          <div className="cover-top">
            <span className="isologo">
              <span className="cap blue">011</span>
              <span className="cap coral"><span>eB</span></span>
            </span>
            <span className="state-chip">En proceso · MVP validado</span>
          </div>

          <p className="eyebrow">UX-UI · Product Design · Data-viz</p>
          <h1>Edubig</h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: 600 }}>Un sistema que se traduce en cuidado.</p>
          <p style={{ maxWidth: 600, marginTop: 14 }}>
            Plataforma abierta de datos escolares para familias chilenas. Traduce cinco fuentes oficiales
            fragmentadas —Mineduc, SIMCE, IDPS, Supereduc, DEMRE— en una decisión clara, sin caer en el
            ranking crudo.
          </p>

          <div className="cover-body">
            <div className="device">
              <img src={homeMockup} alt="Home de Edubig en móvil" />
            </div>
            <div className="cover-meta">
              <div><span className="label">Rol</span><span className="val">Producto, diseño, sistema, motor y datos</span></div>
              <div><span className="label">Equipo</span><span className="val">Dirijo la colaboración: Israel (datos) · Claude (par técnico)</span></div>
              <div><span className="label">Stack</span><span className="val">Figma · Python · Next.js · Vercel · Claude</span></div>
              <div><span className="label">Estado</span><span className="val">MVP Pudahuel completo · migración a Chile nacional (7.168 colegios) en curso</span></div>
            </div>
          </div>
          <div className="callout" style={{ marginTop: 24 }}>
            <p><strong>Design Thinking iterativo:</strong> este case study documenta un ciclo vivo, no un proyecto cerrado. Se re-está construyendo el dataset base para pasar de una comuna a todo el país, y luego testear con familias reales.</p>
          </div>
        </section>
      </div>

      {/* ===================== SÍNTESIS ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Síntesis</p>
        <h2>La respuesta primero</h2>
        <p className="lead">Pirámide de Minto, para quien escanea en 60 segundos.</p>
        <div className="tldr">
          <div><span className="n">01</span><div><h3>El problema</h3><p>Elegir colegio en Chile obliga a cruzar cinco portales oficiales que no se conectan y a interpretar rankings que correlacionan más con nivel socioeconómico que con calidad pedagógica.</p></div></div>
          <div><span className="n">02</span><div><h3>La solución</h3><p>Una plataforma nacional con tres promesas al mismo nivel: comparar colegios lado a lado, recomendar vía test de calce, y explorar el universo por métrica con contexto GSE. Motor determinístico y trazable.</p></div></div>
          <div><span className="n">03</span><div><h3>La postura</h3><p>Anti-ranking. Ningún número aparece sin su contexto GSE: cada colegio se lee contra el promedio de sus similares, no contra el sistema entero. Es una decisión ética defendida con evidencia.</p></div></div>
        </div>
      </div></section></div>

      {/* ===================== CONTEXTO ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Contexto</p>
        <h2>Cinco portales, cero traducción</h2>
        <p>Para entender un colegio hoy, una familia debe cruzar —como mínimo— cinco fuentes oficiales que no dialogan entre sí. La familia hace de integrador manual.</p>
        <div className="sources">
          <div className="source"><div className="nm">Mineduc</div><div className="sub">Datos administrativos · directorio nacional</div></div>
          <div className="source"><div className="nm">SIMCE</div><div className="sub">Rendimiento académico por área</div></div>
          <div className="source"><div className="nm">IDPS</div><div className="sub">Desarrollo integral · clima, autoestima, hábitos</div></div>
          <div className="source"><div className="nm">Supereduc</div><div className="sub">Denuncias y sanciones</div></div>
          <div className="source"><div className="nm">DEMRE</div><div className="sub">Trayectoria universitaria</div></div>
        </div>
        <div className="callout warm" style={{ marginTop: 20 }}>
          <p>Ninguna fuente se conecta con las otras. Los rankings públicos lo simplifican todo a un número que correlaciona con NSE, no con calidad pedagógica — el propio DEMRE prohíbe usar la PAES para rankear colegios.</p>
        </div>
      </div></section></div>

      {/* ===================== ROL & MÉTODO ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Rol y método</p>
        <h2>Diseñador dirigiendo un equipo colaborativo</h2>
        <p>Producto, diseño y sistema son míos. Datos y frontend se ejecutan con colaboradores dirigidos. La complejidad técnica se delega; el criterio, nunca.</p>
        <div className="grid2" style={{ marginTop: 8 }}>
          <div className="mini">
            <span className="label">Qué dirijo y ejecuto</span>
            <ul className="ticks">
              <li>Concepto rector, principios y trade-offs de producto</li>
              <li>Investigación con evidencia secundaria (BID, Agencia de Calidad, benchmark internacional)</li>
              <li>Sistema de diseño en Figma con tokens propios</li>
              <li>Motor de scoring determinístico (dos capas)</li>
              <li>Estructura del pipeline de datos y esquema del dataset</li>
            </ul>
          </div>
          <div className="mini">
            <span className="label">Con quién colaboro</span>
            <h3 style={{ marginTop: 12 }}>Israel Rubilar · analista de datos</h3>
            <p>Coordinador de Análisis Institucional (U. Alberto Hurtado). Cierra el schema del dataset nacional y aporta autoridad reputacional al lanzamiento.</p>
            <h3 style={{ marginTop: 14 }}>Claude · par técnico dirigido</h3>
            <p>Acelera la implementación: scripts de Figma, pipeline de datos, frontend en Next.js. Cada decisión de producto pasa por mi juicio y queda en la bitácora.</p>
          </div>
        </div>
        <div className="callout" style={{ marginTop: 20 }}><p>El red flag no es delegar la ejecución — es delegar el criterio. Ese es el que retengo.</p></div>
      </div></section></div>

      {/* ===================== INVESTIGACIÓN · PERSONAS ===================== */}
      <div className="shell"><section className="stage">
        <div className="col">
          <p className="eyebrow">Investigación</p>
          <h2>Personas basadas en evidencia real</h2>
          <p>Las personas de Edubig no son inventadas. NN/g advierte que los personas inventados son «prueba poco convincente»: aquí cada afirmación es trazable a una fuente pública.</p>
          <div className="evid">
            <div><div className="es">BID</div><div className="en">Preferencias parentales · admisión centralizada</div><div className="ed">NSE bajo prioriza proximidad y atributos no académicos; NSE alto, calidad y proyecto.</div></div>
            <div><div className="es">Agencia de Calidad</div><div className="en">Voces de los Apoderados 2018 · n = 590.601</div><div className="ed">55,8% espera carrera universitaria; 77% cree que sus hijos están protegidos de violencia.</div></div>
            <div><div className="es">Estudio SIMCE</div><div className="en">Comprensión de reportes · métodos mixtos</div><div className="ed">La mayoría interpreta mal la información básica del reporte, aunque lo califican como claro.</div></div>
            <div><div className="es">Benchmark internacional</div><div className="en">GreatSchools · Niche · Ofsted · ERO</div><div className="ed">Las plataformas exitosas combinan geolocalización + contexto + multidimensionalidad.</div></div>
          </div>
          <p className="pv-lead">Tres personas, un mismo dato leído a tres profundidades. Recorre las fichas →</p>
        </div>

        <div className="pv">
          <div className="pv-stage">
            <div className="ppanel">
              <div className="pph"><img src={persona.img} alt={persona.name} /></div>
              <div className="ppb">
                <div className="ppname">{persona.name}</div>
                <div className="pprole">{persona.role}</div>
                <p className="ppquote">{persona.quote}</p>
                <div className="ppfacts">
                  {persona.facts.map(([k, v]) => (
                    <div key={k}><span className="label">{k}</span>{v}</div>
                  ))}
                </div>
                <div className="pppri"><span className="label">Qué prioriza</span><p>{persona.priority}</p></div>
              </div>
            </div>
          </div>
          <div className="pv-controls">
            <div className="pv-dots">
              {PERSONAS.map((p, i) => (
                <button
                  key={p.name}
                  className={'pv-dot' + (i === pi ? ' active' : '')}
                  aria-label={'Ver ' + p.name}
                  aria-current={i === pi}
                  onClick={() => setPi(i)}
                />
              ))}
              <span className="pv-name">{persona.name} · {pi + 1} / {PERSONAS.length}</span>
            </div>
            <div className="pv-nav">
              <button className="pv-btn" onClick={prev} aria-label="Persona anterior">←</button>
              <button className="pv-btn" onClick={next} aria-label="Persona siguiente">→</button>
            </div>
          </div>
        </div>
      </section></div>

      {/* ===================== INSIGHT ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Insight</p>
        <h2>Diseñar para «el usuario promedio» es diseñar para nadie</h2>
        <p>Los tres personas comparten cinco dolores transversales, pero cada uno los sufre distinto. El sistema debe operar en tres registros simultáneos.</p>
        <div className="pains">
          <div className="pain"><span className="pn">01</span><div><span className="ph">Gap de comprensión</span><div className="pd">Ver un dato no equivale a entenderlo. Aun con reportes «claros», los padres interpretan mal la información básica.</div></div></div>
          <div className="pain"><span className="pn">02</span><div><span className="ph">Fragmentación de fuentes</span><div className="pd">Cinco portales que no se conectan. La familia hace de integrador manual.</div></div></div>
          <div className="pain"><span className="pn">03</span><div><span className="ph">Sesgo de ranking</span><div className="pd">Los listados públicos simplifican calidad a un número que oculta el contexto socioeconómico.</div></div></div>
          <div className="pain"><span className="pn">04</span><div><span className="ph">Exclusión digital</span><div className="pd">Los portales estatales no funcionan bien en móvil ni en baja alfabetización: excluyen a quien más los necesita.</div></div></div>
          <div className="pain"><span className="pn">05</span><div><span className="ph">Ansiedad de decisión</span><div className="pd">Elegir colegio se percibe irreversible. Las familias quieren sentirse seguras, no solo informadas.</div></div></div>
        </div>
        <div className="callout" style={{ marginTop: 20 }}><p>Carolina se queda en el primer registro (etiqueta legible); Tomás y Francisca bajan al tercero (metodología); Martín valora velocidad y tono. Un mismo dato, tres profundidades.</p></div>
      </div></section></div>

      {/* ===================== CONCEPTO ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Concepto</p>
        <h2>Un sistema que se traduce en cuidado</h2>
        <p>La traducción es el verbo rector, anclado en el concepto de isomorfismo de Hofstadter: un puente fiel a los dos lados sin aplanar ninguno.</p>
        <div className="chain3">
          <div className="cc input"><div className="cch">Dato · input</div><p className="w">Imparcial</p><div className="a">↓</div><p className="w">Frío</p><div className="a">↓</div><p className="w">Honesto</p></div>
          <div className="cc bridge"><div className="cch">Puente · Edubig</div><p className="w">Accesible</p><div className="a">↓</div><p className="w">Comprensible</p><div className="a">↓</div><p className="w">Informado</p></div>
          <div className="cc output"><div className="cch">Familia · output</div><p className="w">Cuidado</p><div className="a">↓</div><p className="w">Preocupación</p><div className="a">↓</div><p className="w">Seguridad</p></div>
        </div>
        <div className="resolve">Un sistema que se traduce en cuidado</div>
        <div className="palette">
          {['#053061', '#2166ac', '#4393c3', '#92c5de', '#d1e5f0', '#f7f7f7', '#fddbc7', '#f4a582', '#d6604d', '#b2181f', '#67001f'].map((c) => (
            <div key={c} className="p" style={{ background: c }} />
          ))}
        </div>
        <p className="figcap">Escala RdBu (ColorBrewer) como identidad del sistema: frío para el dato imparcial, cálido para el cuidado familiar. El principio anti-ranking se deriva de aquí — una traducción fiel es fiel a los dos lados.</p>
      </div></section></div>

      {/* ===================== DEL CONCEPTO AL LOGOTIPO ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Del concepto al logotipo</p>
        <h2>La traducción, hecha forma</h2>
        <p>Si el sistema traduce, la marca debía traducir también. La exploración fue del dato frío al dato cálido, y pasó por el gesto de un <em>toggle switch</em>: el interruptor que enciende la traducción.</p>

        <div className="logo-beats">
          <figure className="frame-fig">
            <div className="frame"><img src={bocetos} alt="Bocetos de exploración del logotipo de Edubig" /></div>
            <figcaption className="figcap">Bocetos de exploración — del dato frío al dato cálido, del switch ON/OFF a las dos cápsulas. El logotipo nace del mismo concepto que el producto, no de un ejercicio aparte.</figcaption>
          </figure>

          <div className="toggle-demo">
            <span className="label">El gesto, en vivo</span>
            <button className={'tg' + (on ? ' is-on' : '')} aria-pressed={on} onClick={() => setOn((v) => !v)} aria-label="Alternar dato frío / cálido">
              <span className="tg-track"><span className="tg-knob">{on ? 'eB' : '011'}</span></span>
            </button>
            <div className={'tg-state' + (on ? ' on' : '')}>{on ? 'Dato cálido · traducido' : 'Dato frío · sin traducir'}</div>
            <p className="figcap" style={{ marginTop: 14 }}>Acciónalo: el mismo gesto de frío a cálido que da forma al isologo — y un guiño al chip de filtro del propio producto.</p>
          </div>
        </div>

        <figure className="frame-fig" style={{ marginTop: 24 }}>
          <div className="frame"><img src={logoConstru} alt="Construcción del logotipo de Edubig" /></div>
          <figcaption className="figcap">De la metáfora a la forma: la retícula del toggle define las dos cápsulas del isologo — 011 en tipo pixel sobre azul frío (el dato), eB en serif sobre coral cálido (la traducción). El objeto de interfaz se vuelve marca.</figcaption>
        </figure>
      </div></section></div>

      {/* ===================== FRAMING · PROMESAS ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Framing</p>
        <h2>Tres promesas al mismo nivel</h2>
        <p>Comparar, recomendar y explorar. Ninguna subordinada a las otras — la línea superior las mantiene en el mismo plano.</p>
        <div className="promises"><div className="promise-grid">
          <div className="promise"><div className="dot" /><h3>Comparar</h3><p>Dos o tres colegios lado a lado con semáforo semántico y visualización honesta. La familia entra con nombres y sale con distinciones claras.</p><span className="tag">Módulo comparación · viz cualitativa</span></div>
          <div className="promise"><div className="dot" /><h3>Recomendar</h3><p>Test de calce Q1–Q5 que devuelve una shortlist por afinidad. Reglas transparentes en dos capas: filtros duros + scoring ponderado.</p><span className="tag">Test de Calce · motor determinístico</span></div>
          <div className="promise"><div className="dot" /><h3>Explorar</h3><p>Universo ordenable por la métrica que el usuario elige, siempre con contexto GSE. Nunca «top 10 absolutos» — sí «colegios sobre su grupo similar».</p><span className="tag">Exploración libre · contexto GSE</span></div>
        </div></div>
      </div></section></div>

      {/* ===================== DECISIONES ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Decisiones de diseño</p>
        <h2>Tres decisiones que un reclutador va a preguntar</h2>
        <p>Cada una es un rechazo explícito, una elección y un trade-off asumido. La postura documentada vale más que las pantallas pulidas.</p>
        {[
          { k: '01', t: 'Anti-ranking como postura', no: 'El ranking absoluto. Simplifica calidad a un número que correlaciona con NSE; genera ansiedad y distorsiona la decisión.', yes: 'Fit contextual multidimensional: cada colegio se compara solo contra su grupo GSE, en cinco dimensiones separadas (SIMCE + IDPS).', tr: 'Más fricción cognitiva. Se compensa con disclosure progresivo: primero el insight legible, luego el gráfico, después la metodología.' },
          { k: '02', t: 'Comparar contra pares, no contra el sistema', no: 'Escalas absolutas nacionales, que castigan a los establecimientos vulnerables por su contexto y no por su desempeño real.', yes: 'Gráfico de brecha vs. GSE similar, con escala universal de ±56 puntos (rango real del universo). La lectura vuelve honesta.', tr: 'Grupos de referencia pequeños se vuelven volátiles: se resuelve con una advertencia visible, no ocultando el dato.' },
          { k: '03', t: 'Motor determinístico, no modelo opaco', no: 'Un modelo de recomendación cerrado. En una decisión de alta carga emocional, la trazabilidad genera confianza; la magia, no.', yes: 'Dos capas de reglas transparentes: filtros duros no-negociables + suma ponderada de cinco dimensiones. Cada recomendación se audita paso a paso.', tr: 'Menos «wow», más responsabilidad: la familia entiende por qué aparece cada colegio, y el motor no discrimina sin que yo lo sepa.' },
        ].map((d) => (
          <div className="decision" key={d.k}>
            <div className="dhead"><span className="label">Decisión {d.k}</span><h3>{d.t}</h3></div>
            <div className="drow"><span className="rk no">Rechacé</span><span className="rv">{d.no}</span></div>
            <div className="drow"><span className="rk yes">Elegí</span><span className="rv">{d.yes}</span></div>
            <div className="drow"><span className="rk trade">Trade-off</span><span className="rv">{d.tr}</span></div>
          </div>
        ))}
      </div></section></div>

      {/* ===================== INGENIERÍA DE DATOS ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Ingeniería de datos · co-work con IA</p>
        <h2>De cuatro fuentes oficiales a un JSON maestro</h2>
        <p>El pipeline y el motor de scoring son infraestructura. Los construí dirigiendo a Claude como par técnico: yo defino el esquema y las reglas, la IA acelera la ejecución. Cada paso queda trazado.</p>
        <figure className="frame-fig">
          <div className="frame video-frame wide"><video src="/edubig-proceso-datos.mp4" controls playsInline preload="metadata" /></div>
          <figcaption className="figcap">Video 01 · Ingeniería de datos — proceso de limpieza y unificación de fuentes, mostrando el co-work con IA.</figcaption>
        </figure>
        <div className="pipe">
          <div className="node"><div className="nt">4 fuentes</div><div className="nd">SIMCE · IDPS · denuncias · directorio</div></div>
          <div className="arw">→</div>
          <div className="node hi"><div className="nt">Limpieza + normalización</div><div className="nd">Python dirigido · reglas y esquema definidos por mí</div></div>
          <div className="arw">→</div>
          <div className="node"><div className="nt">JSON maestro</div><div className="nd">57 colegios · 88 columnas · MVP Pudahuel</div></div>
        </div>
        <div className="callout" style={{ marginTop: 20 }}><p>Expansión en curso: se invirtió el flujo del pipeline — ahora yo entrego la estructura (schema de 340 campos) e Israel rellena el dataset sobre esa forma. Meta: 7.168 colegios de todo Chile sin romper el esquema del sitio en cada iteración.</p></div>
      </div></section></div>

      {/* ===================== VISUALIZACIÓN DE DATOS ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Visualización de datos</p>
        <h2>El sistema de datos se vuelve visible</h2>
        <p>La visualización no decora las conclusiones: las sostiene. Dos piezas cargan el peso — el gráfico de brecha y el sistema de tres carriles de color.</p>

        <div className="brecha">
          <div className="brecha-head"><span className="label">Brecha SIMCE · vs. colegios similares (mismo GSE)</span><span className="label">escala universal ±56 pts</span></div>
          <div className="brecha-rows">
            {BRECHA.map((r) => (
              <div className="brow" key={r.n}>
                <div className="bname">{r.n}{r.warn && <span className="warnchip">grupo pequeño</span>}</div>
                <div className="btrack">
                  <div className="baxis" />
                  <div
                    className={'bbar ' + (r.v >= 0 ? 'pos' : 'neg')}
                    style={r.v >= 0
                      ? { left: '50%', width: (Math.abs(r.v) / 56) * 50 + '%' }
                      : { right: '50%', width: (Math.abs(r.v) / 56) * 50 + '%' }}
                  />
                  <span className={'bval ' + (r.v >= 0 ? 'pos' : 'neg')} style={r.v >= 0 ? { left: `calc(50% + ${(Math.abs(r.v) / 56) * 50}% + 8px)` } : { right: `calc(50% + ${(Math.abs(r.v) / 56) * 50}% + 8px)` }}>{r.v > 0 ? '+' + r.v : r.v}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="brecha-scale"><span>−56</span><span>−28</span><span>0 · promedio de similares</span><span>+28</span><span>+56</span></div>
          <p className="figcap"><span className="dotlg pos" /> sobre su grupo GSE · <span className="dotlg neg" /> bajo su grupo GSE. El signo del dato manda: verde/mostaza, nunca el coral de identidad.</p>
        </div>

        <h3 style={{ marginTop: 30 }}>Tres carriles semánticos que no se mezclan</h3>
        <p style={{ marginTop: 4 }}>Cada uso de color pertenece a un carril. Nunca a dos.</p>
        <div className="rails">
          <div className="rail">
            <div className="rlab"><span className="label">Carril A</span><span className="rn">Identidad</span></div>
            <div><div className="swatches"><div className="sw" style={{ background: '#2166ac' }} /><div className="sw" style={{ background: '#92c5de' }} /><div className="sw" style={{ background: '#f7f7f7' }} /><div className="sw" style={{ background: '#f4a582' }} /><div className="sw" style={{ background: '#d6604d' }} /></div><div className="rdesc">Frío ↔ cálido (RdBu). Logo, hero, chip de filtro, cards del test. Reservado a identidad y navegación — nunca codifica dato.</div></div>
          </div>
          <div className="rail">
            <div className="rlab"><span className="label">Carril B</span><span className="rn">Semáforo</span></div>
            <div><div className="swatches series"><div className="sw" style={{ background: '#198038' }}><span>positivo</span></div><div className="sw" style={{ background: '#8a6d00' }}><span>negativo</span></div></div><div className="rdesc">Verde y mostaza (deliberadamente distinto del coral). Solo donde el signo del dato es la información: brecha SIMCE.</div></div>
          </div>
          <div className="rail">
            <div className="rlab"><span className="label">Carril C</span><span className="rn">Data-viz</span></div>
            <div><div className="swatches series"><div className="sw" style={{ background: '#198038' }}><span>este</span></div><div className="sw" style={{ background: '#4a62d1' }}><span>similares</span></div><div className="sw" style={{ background: '#a56eff' }}><span>nacional</span></div></div><div className="rdesc">Categorías, no valoración: series comparadas en Bienestar (IDPS) y Comparación. Codifican identidad de serie, no juicio.</div></div>
          </div>
        </div>
        <div className="callout" style={{ marginTop: 20 }}><p>Contraste verificado numéricamente (WCAG 2.2 AA, mínimo 5.74:1). Redundancia 1.4.1: el color nunca codifica juicio solo — elevación, borde y label textual comunican en paralelo.</p></div>
      </div></section></div>

      {/* ===================== EL PRODUCTO EN USO ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">El producto en uso</p>
        <h2>Test de Calce y ficha de colegio</h2>
        <p>El producto es que una madre entienda cinco dimensiones sin ser experta en política educativa. Dos superficies lo resuelven: el quiz de fit y la ficha con disclosure progresivo.</p>
        <div className="use-grid">
          <figure className="frame-fig">
            <div className="frame video-frame tall"><video src="/edubig-navegacion-mvp.mp4" autoPlay muted loop playsInline preload="metadata" /></div>
            <figcaption className="figcap">Video 02 · Recorrido — el Test de Calce en uso, de la Q1 a la shortlist.</figcaption>
          </figure>
          <div className="patterns">
            <span className="label">Patrones contra el sesgo de deseabilidad social</span>
            <h3>Auto-advance</h3><p>Sin botón «Continuar»: la respuesta es la acción.</p>
            <h3>Nota de legitimación</h3><p>Bloque neutral que valida todas las respuestas en preguntas de alto riesgo de deseabilidad social.</p>
            <h3>Reencuadre lingüístico</h3><p>«Importar» (valor moral) → «necesitar/preferir» (necesidad práctica). Reduce el sesgo de respuesta correcta.</p>
            <h3>Ficha · disclosure progresivo</h3><p>Cuatro módulos en orden fijo (Seguridad → Bienestar → Académico → Trayectoria U.) para que la comparación entre colegios sea posible.</p>
          </div>
        </div>
        <div className="use-fichas">
          <figure className="frame-fig"><div className="frame"><img src={ficha1} alt="Ficha de colegio de Edubig — parte 1" /></div></figure>
          <figure className="frame-fig"><div className="frame"><img src={ficha2} alt="Ficha de colegio de Edubig — parte 2" /></div></figure>
        </div>
      </div></section></div>

      {/* ===================== ESTADO ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Estado del proyecto</p>
        <h2>MVP validado · camino a lo nacional</h2>
        <p>Honestidad sobre qué está probado, qué falta y cuál es el camino. Design Thinking es iterativo: este es el ciclo en el que estoy hoy.</p>
        <div className="grid2" style={{ marginTop: 8 }}>
          <div className="mini">
            <span className="label">Lo validado en el MVP</span>
            <ul className="checklist">
              <li>Motor de scoring recorrido end-to-end con los tres perfiles sobre 57 colegios.</li>
              <li>Auditoría de UX writing en la ficha con heurísticas de Nielsen.</li>
              <li>Verificación WCAG 2.2 AA con cálculo numérico de contraste.</li>
              <li>Sistema de color reorganizado en tres carriles sin colisiones.</li>
            </ul>
          </div>
          <div className="mini warm-mini">
            <span className="label">El gap principal</span>
            <p>Aún no hay testing con familias reales. Sin al menos una ronda documentada, el case study se lee como «concepto bonito» y no como trabajo listo para producir. Es la pieza que hoy decide contrataciones en Product Design — y la próxima del ciclo.</p>
          </div>
        </div>
        <h3 style={{ marginTop: 26 }}>Roadmap inmediato</h3>
        <div className="roadmap">
          <div className="rmi"><span className="rmn">01</span><div><h3>Cerrar el schema con Israel</h3><p>Planilla de 340 campos entregada; en revisión colaborativa hasta cerrar el dataset de 7.168 colegios.</p></div></div>
          <div className="rmi"><span className="rmn">02</span><div><h3>Migrar el frontend al schema nacional</h3><p>Adaptar lib/data y lib/types en Next.js. Recalibrar el motor del quiz con el universo nuevo.</p></div></div>
          <div className="rmi"><span className="rmn">03</span><div><h3>Testear con 5–8 familias</h3><p>Tareas reales sobre el prototipo. Hallazgos por severidad + iteraciones antes/después.</p></div></div>
        </div>
      </div></section></div>

      {/* ===================== APRENDIZAJES ===================== */}
      <div className="shell"><section className="stage"><div className="col">
        <p className="eyebrow">Aprendizajes</p>
        <h2>Lo que me llevo de Edubig</h2>
        <div className="learns">
          <div><h3>La postura es diseño</h3><p>Rechazar el ranking fue la decisión más difícil de defender y la que más me enseñó a argumentar. Los trade-offs documentados valen más que las pantallas pulidas.</p></div>
          <div><h3>Datos como medio, no fin</h3><p>El pipeline y el motor son infraestructura. El producto es que una madre entienda cinco dimensiones sin ser experta en política educativa.</p></div>
          <div><h3>Dirigir equipo colaborativo</h3><p>Israel aporta rigor de datos, Claude acelera implementación, yo tomo cada decisión de producto. El red flag no es delegar — es delegar el criterio.</p></div>
        </div>
      </div></section></div>

      <div className="shell"><div className="eb-footer"><span className="label">Edubig · Case study · Matías Cáceres · 2026</span></div></div>
    </div>
  );
}

const CSS = `
.eb{background:var(--eb-bg);color:var(--eb-strong);font-family:var(--eb-sans);font-size:17px;line-height:1.62;-webkit-font-smoothing:antialiased;
  --eb-bg:#fafaf7;--eb-surface:#f2f1ec;--eb-surface-2:#ebeae4;--eb-border:#dcdbd5;--eb-border-soft:#ebeae4;--eb-faint:#8a8a85;--eb-medium:#3a3a38;--eb-strong:#0f0f0e;--eb-accent:#5f8f5f;--eb-accent-deep:#456b45;--eb-rdbu-01:#053061;--eb-rdbu-02:#2166ac;--eb-rdbu-09:#d6604d;--eb-exito:#1e6a2e;--eb-advert:#8a6d00;
  --eb-mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;--eb-sans:'IBM Plex Sans',system-ui,-apple-system,sans-serif;--eb-col:680px;--eb-wide:940px;}
.eb *{box-sizing:border-box;}
.eb .progress-wrap{position:fixed;top:56px;left:0;right:0;height:3px;background:transparent;z-index:40;}
.eb .progress-bar{height:100%;width:0;background:var(--eb-accent);}
.eb .shell{max-width:var(--eb-wide);margin:0 auto;padding:0 24px;}
.eb .col{max-width:var(--eb-col);margin:0 auto;}
.eb .stage{padding:74px 0;border-top:1px solid var(--eb-border-soft);}
.eb .stage:first-of-type{border-top:none;}
.eb .eyebrow{font-family:var(--eb-mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--eb-accent-deep);margin:0 0 20px;display:flex;align-items:center;gap:10px;}
.eb .eyebrow::before{content:"";width:22px;height:1px;background:var(--eb-accent);}
.eb h1{font-family:var(--eb-mono);font-weight:500;font-size:clamp(44px,8vw,76px);line-height:.98;letter-spacing:-.02em;margin:0;text-wrap:balance;}
.eb h2{font-family:var(--eb-mono);font-weight:500;font-size:clamp(26px,4vw,34px);line-height:1.1;letter-spacing:-.01em;margin:0 0 8px;text-wrap:balance;}
.eb h3{font-family:var(--eb-mono);font-weight:500;font-size:19px;line-height:1.25;margin:0 0 6px;letter-spacing:-.005em;}
.eb .lead{font-size:20px;line-height:1.5;color:var(--eb-medium);margin:0 0 4px;}
.eb p{margin:0 0 18px;color:var(--eb-medium);}
.eb p:last-child{margin-bottom:0;}
.eb strong{color:var(--eb-strong);font-weight:600;}
.eb em{font-style:italic;}
.eb .label{font-family:var(--eb-mono);font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--eb-faint);}
.eb .figcap{font-family:var(--eb-mono);font-size:11.5px;letter-spacing:.04em;color:var(--eb-faint);margin-top:12px;line-height:1.5;}
.eb .frame{border:1px solid var(--eb-medium);border-width:1px 4px 4px 1px;border-radius:3px;background:var(--eb-surface);overflow:hidden;}
.eb .frame img{display:block;width:100%;height:auto;}
.eb .frame-fig{margin:0;}
.eb .video-frame{position:relative;background:#0f0f0e;}
.eb .video-frame video{display:block;width:100%;height:auto;background:#0f0f0e;}
.eb .video-frame.tall{max-width:300px;margin:0 auto;}
.eb .cover-top{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:30px;}
.eb .isologo{display:inline-flex;gap:5px;align-items:center;}
.eb .cap{width:34px;height:34px;border-radius:100px;display:flex;align-items:center;justify-content:center;font-family:var(--eb-mono);font-weight:600;font-size:14px;color:#fff;}
.eb .cap.blue{background:var(--eb-rdbu-02);}
.eb .cap.coral{background:var(--eb-rdbu-09);}
.eb .cap.coral span{font-family:Georgia,serif;}
.eb .state-chip{display:inline-flex;align-items:center;gap:7px;font-family:var(--eb-mono);font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--eb-accent-deep);background:rgba(95,143,95,.1);border:1px solid rgba(95,143,95,.35);padding:4px 10px;border-radius:100px;}
.eb .state-chip::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--eb-accent);}
.eb .cover-body{display:flex;gap:36px;align-items:flex-start;flex-wrap:wrap;margin-top:26px;}
.eb .device{width:236px;flex:none;border:8px solid var(--eb-strong);border-radius:30px;overflow:hidden;background:var(--eb-strong);box-shadow:0 24px 48px -24px rgba(15,15,14,.4);}
.eb .device img{display:block;width:100%;height:auto;}
.eb .cover-meta{flex:1;min-width:280px;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--eb-border);border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;}
.eb .cover-meta>div{background:var(--eb-bg);padding:16px 18px;}
.eb .cover-meta .label{margin-bottom:7px;display:block;}
.eb .cover-meta .val{font-size:14.5px;line-height:1.35;color:var(--eb-strong);}
.eb .tldr{display:grid;gap:1px;background:var(--eb-border);border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;margin-top:8px;}
.eb .tldr>div{background:var(--eb-bg);padding:22px 24px;display:grid;grid-template-columns:38px 1fr;gap:16px;align-items:start;}
.eb .tldr .n{font-family:var(--eb-mono);font-size:13px;color:var(--eb-faint);padding-top:3px;}
.eb .callout{border-left:3px solid var(--eb-accent);background:var(--eb-surface);padding:16px 20px;border-radius:0 3px 3px 0;}
.eb .callout p{margin:0;color:var(--eb-medium);font-size:15.5px;}
.eb .callout.warm{border-left-color:var(--eb-rdbu-09);}
.eb .grid2{display:grid;grid-template-columns:1fr 1fr;gap:22px;}
.eb .mini{border:1px solid var(--eb-border);border-radius:3px;padding:20px 22px;background:var(--eb-bg);}
.eb .mini.warm-mini{border-left:3px solid var(--eb-rdbu-09);}
.eb .mini .label{display:block;margin-bottom:12px;}
.eb ul.ticks,.eb ul.checklist{list-style:none;padding:0;margin:0;}
.eb ul.ticks li,.eb ul.checklist li{position:relative;padding-left:24px;margin-bottom:10px;font-size:15px;color:var(--eb-medium);line-height:1.45;}
.eb ul.ticks li::before{content:"";position:absolute;left:0;top:8px;width:7px;height:7px;border-radius:50%;background:var(--eb-accent);}
.eb ul.checklist li::before{content:"";position:absolute;left:0;top:3px;width:14px;height:14px;border:1.5px solid var(--eb-exito);border-radius:3px;background:linear-gradient(45deg,transparent 45%,var(--eb-exito) 45%,var(--eb-exito) 55%,transparent 55%),linear-gradient(-45deg,transparent 45%,var(--eb-exito) 45%,var(--eb-exito) 55%,transparent 55%);}
.eb .sources{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-top:8px;}
.eb .source{border:1px solid var(--eb-border);border-radius:3px;padding:14px 12px;background:var(--eb-bg);}
.eb .source .nm{font-family:var(--eb-mono);font-size:14px;color:var(--eb-strong);margin-bottom:5px;}
.eb .source .sub{font-size:12px;line-height:1.35;color:var(--eb-faint);}
.eb .evid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--eb-border);border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;margin-top:8px;}
.eb .evid>div{background:var(--eb-bg);padding:18px 20px;}
.eb .evid .es{font-family:var(--eb-mono);font-size:13.5px;color:var(--eb-strong);margin-bottom:4px;}
.eb .evid .en{font-size:11px;color:var(--eb-faint);font-family:var(--eb-mono);margin-bottom:8px;}
.eb .evid .ed{font-size:13.5px;line-height:1.45;color:var(--eb-medium);}
.eb .pv-lead{font-family:var(--eb-mono);font-size:13px;color:var(--eb-accent-deep);margin-top:20px;}
.eb .pv{max-width:var(--eb-wide);margin:22px auto 0;}
.eb .pv-stage{border:1px solid var(--eb-medium);border-width:1px 4px 4px 1px;border-radius:4px;overflow:hidden;background:var(--eb-surface);}
.eb .ppanel{display:grid;grid-template-columns:300px 1fr;}
.eb .pph{background:var(--eb-surface);border-right:1px solid var(--eb-border);}
.eb .pph img{display:block;width:100%;height:100%;object-fit:cover;object-position:center 22%;}
.eb .ppb{padding:26px 30px;}
.eb .ppname{font-family:var(--eb-mono);font-weight:500;font-size:22px;letter-spacing:-.01em;color:var(--eb-strong);}
.eb .pprole{font-family:var(--eb-mono);font-size:11px;letter-spacing:.05em;color:var(--eb-faint);text-transform:uppercase;margin:6px 0 16px;}
.eb .ppquote{font-size:16px;font-style:italic;line-height:1.5;color:var(--eb-medium);border-left:2px solid var(--eb-accent);padding-left:14px;margin:0 0 18px;}
.eb .ppfacts{display:grid;grid-template-columns:1fr 1fr;gap:12px 20px;padding:16px 0;border-top:1px solid var(--eb-border-soft);border-bottom:1px solid var(--eb-border-soft);}
.eb .ppfacts>div{font-size:13.5px;color:var(--eb-strong);line-height:1.35;}
.eb .ppfacts .label{display:block;margin-bottom:3px;}
.eb .pppri{margin-top:16px;}
.eb .pppri .label{display:block;margin-bottom:4px;}
.eb .pppri p{font-size:14px;margin:0;color:var(--eb-medium);}
.eb .pv-controls{display:flex;align-items:center;justify-content:space-between;margin-top:14px;gap:12px;flex-wrap:wrap;}
.eb .pv-dots{display:flex;gap:8px;align-items:center;}
.eb .pv-dot{width:9px;height:9px;border-radius:50%;background:var(--eb-border);border:1px solid var(--eb-border);padding:0;cursor:pointer;}
.eb .pv-dot.active{background:var(--eb-accent);border-color:var(--eb-accent);}
.eb .pv-name{font-family:var(--eb-mono);font-size:12px;color:var(--eb-faint);margin-left:4px;}
.eb .pv-nav{display:flex;gap:8px;}
.eb .pv-btn{font-family:var(--eb-mono);font-size:15px;line-height:1;border:1px solid var(--eb-medium);border-width:1px 3px 3px 1px;background:var(--eb-bg);border-radius:2px;padding:7px 13px;cursor:pointer;color:var(--eb-medium);}
.eb .pv-btn:hover{color:var(--eb-strong);}
.eb .pains{display:grid;margin-top:8px;border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;}
.eb .pain{display:grid;grid-template-columns:34px 1fr;gap:16px;padding:15px 20px;border-top:1px solid var(--eb-border-soft);background:var(--eb-bg);}
.eb .pain:first-child{border-top:none;}
.eb .pain .pn{font-family:var(--eb-mono);font-size:12px;color:var(--eb-faint);padding-top:2px;}
.eb .pain .ph{font-family:var(--eb-mono);font-size:14px;color:var(--eb-strong);}
.eb .pain .pd{font-size:13.5px;color:var(--eb-medium);line-height:1.45;}
.eb .chain3{display:grid;grid-template-columns:1fr 1fr 1fr;border:1px solid var(--eb-border);border-radius:4px 4px 0 0;overflow:hidden;margin-top:8px;}
.eb .chain3 .cc{padding:24px 18px;text-align:center;border-left:1px solid rgba(255,255,255,.5);}
.eb .chain3 .cc:first-child{border-left:none;}
.eb .chain3 .cc.input{background:linear-gradient(180deg,#eef5f9,#e3eef5);}
.eb .chain3 .cc.bridge{background:#fbfbf9;}
.eb .chain3 .cc.output{background:linear-gradient(180deg,#fbeee9,#f7e1d9);}
.eb .chain3 .cch{font-family:var(--eb-mono);font-size:11px;letter-spacing:.11em;text-transform:uppercase;margin-bottom:16px;}
.eb .chain3 .input .cch{color:var(--eb-rdbu-01);}
.eb .chain3 .bridge .cch{color:var(--eb-strong);}
.eb .chain3 .output .cch{color:var(--eb-rdbu-09);}
.eb .chain3 .w{font-family:var(--eb-mono);font-size:15px;color:var(--eb-strong);margin:0;}
.eb .chain3 .a{color:var(--eb-faint);font-size:12px;margin:5px 0;}
.eb .resolve{background:var(--eb-strong);color:var(--eb-bg);text-align:center;padding:20px;border-radius:0 0 4px 4px;font-family:var(--eb-mono);font-weight:500;font-size:clamp(16px,2.6vw,23px);letter-spacing:-.01em;}
.eb .palette{display:flex;border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;margin-top:18px;}
.eb .palette .p{flex:1;height:42px;}
.eb .logo-beats{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start;margin-top:8px;}
.eb .toggle-demo{border:1px solid var(--eb-border);border-radius:4px;background:var(--eb-surface);padding:30px 26px;text-align:center;}
.eb .toggle-demo .label{display:block;margin-bottom:18px;}
.eb .tg{border:none;background:none;padding:0;cursor:pointer;display:inline-block;line-height:0;}
.eb .tg-track{display:block;width:134px;height:62px;border-radius:100px;position:relative;background:linear-gradient(90deg,#2166ac,#67a9cf);box-shadow:inset 0 1px 3px rgba(0,0,0,.18);transition:background .45s ease;}
.eb .tg.is-on .tg-track{background:linear-gradient(90deg,#2166ac,#d1e5f0 42%,#fddbc7 58%,#d6604d);}
.eb .tg-knob{position:absolute;top:5px;left:5px;width:52px;height:52px;border-radius:50%;background:#fff;box-shadow:0 2px 7px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-family:var(--eb-mono);font-weight:600;font-size:12px;color:var(--eb-rdbu-02);transition:left .45s cubic-bezier(.6,.2,.1,1),color .45s ease;}
.eb .tg.is-on .tg-knob{left:77px;color:var(--eb-rdbu-09);}
.eb .tg-state{font-family:var(--eb-mono);font-size:12px;letter-spacing:.09em;text-transform:uppercase;margin-top:18px;color:var(--eb-rdbu-02);}
.eb .tg-state.on{color:var(--eb-rdbu-09);}
.eb .promises{position:relative;margin-top:8px;}
.eb .promises::before{content:"";position:absolute;top:0;left:8%;right:8%;height:1px;background:var(--eb-accent);}
.eb .promise-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;padding-top:26px;}
.eb .promise .dot{width:9px;height:9px;border-radius:50%;background:var(--eb-accent);margin-bottom:14px;}
.eb .promise .tag{font-family:var(--eb-mono);font-size:10.5px;letter-spacing:.08em;color:var(--eb-faint);text-transform:uppercase;margin-top:12px;display:block;}
.eb .decision{border:1px solid var(--eb-border);border-radius:4px;overflow:hidden;margin-top:22px;}
.eb .decision .dhead{padding:16px 20px;background:var(--eb-surface);border-bottom:1px solid var(--eb-border);}
.eb .decision .dhead .label{color:var(--eb-accent-deep);}
.eb .decision .dhead h3{margin:6px 0 0;}
.eb .decision .drow{display:grid;grid-template-columns:120px 1fr;gap:18px;padding:16px 20px;border-top:1px solid var(--eb-border-soft);}
.eb .decision .drow:first-of-type{border-top:none;}
.eb .decision .rk{font-family:var(--eb-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding-top:2px;}
.eb .rk.no{color:var(--eb-rdbu-09);}
.eb .rk.yes{color:var(--eb-exito);}
.eb .rk.trade{color:var(--eb-advert);}
.eb .decision .rv{font-size:15px;line-height:1.5;color:var(--eb-medium);}
.eb .pipe{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:14px;margin-top:22px;}
.eb .pipe .node{border:1px solid var(--eb-border);border-radius:3px;padding:16px;text-align:center;background:var(--eb-bg);}
.eb .pipe .node .nt{font-family:var(--eb-mono);font-size:13px;color:var(--eb-strong);margin-bottom:4px;}
.eb .pipe .node .nd{font-size:11.5px;color:var(--eb-faint);line-height:1.35;}
.eb .pipe .node.hi{border-color:var(--eb-accent);background:rgba(95,143,95,.06);}
.eb .pipe .arw{font-family:var(--eb-mono);color:var(--eb-faint);font-size:18px;text-align:center;}
.eb .brecha{border:1px solid var(--eb-border);border-radius:4px;padding:22px;margin-top:8px;background:var(--eb-bg);}
.eb .brecha-head{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:20px;}
.eb .brecha-rows{display:flex;flex-direction:column;gap:14px;}
.eb .brow{display:grid;grid-template-columns:150px 1fr;gap:16px;align-items:center;}
.eb .bname{font-family:var(--eb-mono);font-size:13px;color:var(--eb-strong);display:flex;flex-direction:column;gap:3px;}
.eb .warnchip{font-family:var(--eb-mono);font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--eb-advert);}
.eb .btrack{position:relative;height:26px;}
.eb .baxis{position:absolute;left:50%;top:-2px;bottom:-2px;width:1px;background:var(--eb-medium);}
.eb .bbar{position:absolute;top:4px;bottom:4px;border-radius:2px;}
.eb .bbar.pos{background:var(--eb-exito);}
.eb .bbar.neg{background:var(--eb-advert);}
.eb .bval{position:absolute;top:50%;transform:translateY(-50%);font-family:var(--eb-mono);font-size:12px;font-variant-numeric:tabular-nums;}
.eb .bval.pos{color:var(--eb-exito);}
.eb .bval.neg{color:var(--eb-advert);}
.eb .brecha-scale{display:flex;justify-content:space-between;margin-top:12px;padding-left:166px;font-family:var(--eb-mono);font-size:10px;color:var(--eb-faint);}
.eb .dotlg{display:inline-block;width:9px;height:9px;border-radius:2px;vertical-align:middle;}
.eb .dotlg.pos{background:var(--eb-exito);}
.eb .dotlg.neg{background:var(--eb-advert);}
.eb .rails{border:1px solid var(--eb-border);border-radius:4px;padding:4px 20px;margin-top:14px;background:var(--eb-bg);}
.eb .rail{display:grid;grid-template-columns:150px 1fr;gap:20px;padding:18px 0;border-top:1px solid var(--eb-border-soft);align-items:center;}
.eb .rail:first-child{border-top:none;}
.eb .rail .rlab .label{display:block;margin-bottom:3px;}
.eb .rail .rlab .rn{font-family:var(--eb-mono);font-size:14px;color:var(--eb-strong);}
.eb .swatches{display:flex;border-radius:3px;overflow:hidden;height:34px;border:1px solid var(--eb-border);}
.eb .swatches.series{gap:8px;border:none;height:auto;}
.eb .swatches .sw{flex:1;}
.eb .swatches.series .sw{border-radius:3px;height:34px;display:flex;align-items:flex-end;padding:5px 8px;}
.eb .swatches.series .sw span{font-family:var(--eb-mono);font-size:10px;color:#fff;}
.eb .rail .rdesc{font-size:13px;color:var(--eb-medium);line-height:1.45;margin-top:8px;}
.eb .use-grid{display:grid;grid-template-columns:320px 1fr;gap:28px;margin-top:8px;align-items:start;}
.eb .patterns .label{display:block;margin-bottom:12px;}
.eb .patterns h3{margin-top:14px;}
.eb .patterns h3:first-of-type{margin-top:0;}
.eb .use-fichas{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:24px;}
.eb .roadmap{margin-top:8px;}
.eb .rmi{display:grid;grid-template-columns:32px 1fr;gap:16px;padding:16px 0;border-top:1px solid var(--eb-border-soft);}
.eb .rmi:first-child{border-top:none;}
.eb .rmi .rmn{font-family:var(--eb-mono);font-size:13px;color:var(--eb-accent-deep);padding-top:2px;}
.eb .learns{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--eb-border);border:1px solid var(--eb-border);border-radius:3px;overflow:hidden;margin-top:8px;}
.eb .learns>div{background:var(--eb-bg);padding:22px;}
.eb .eb-footer{padding:60px 0;text-align:center;border-top:1px solid var(--eb-border-soft);}
@media(max-width:820px){
  .eb .cover-meta{grid-template-columns:1fr;}
  .eb .sources{grid-template-columns:repeat(2,1fr);}
  .eb .grid2,.eb .logo-beats,.eb .use-grid,.eb .use-fichas,.eb .evid{grid-template-columns:1fr;}
  .eb .promise-grid,.eb .learns{grid-template-columns:1fr;}
  .eb .ppanel{grid-template-columns:1fr;}
  .eb .pph{border-right:none;border-bottom:1px solid var(--eb-border);}
  .eb .pph img{max-height:340px;}
  .eb .ppfacts{grid-template-columns:1fr;}
  .eb .chain3{grid-template-columns:1fr;}
  .eb .pipe{grid-template-columns:1fr;}
  .eb .pipe .arw{transform:rotate(90deg);}
  .eb .brow{grid-template-columns:1fr;gap:6px;}
  .eb .brecha-scale{padding-left:0;}
  .eb .rail{grid-template-columns:1fr;gap:10px;}
}
@media(prefers-reduced-motion:reduce){.eb .tg-track,.eb .tg-knob{transition:none;}}
`;
