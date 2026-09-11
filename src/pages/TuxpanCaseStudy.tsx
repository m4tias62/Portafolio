import { useEffect, useRef, useState } from 'react';
import ProgressBar, { tickCount } from '@/components/ProgressBar';
import BackButton from '@/components/BackButton';
import logo from '@/assets/tuxpan/logo-tuxpan.png';
import hero from '@/assets/tuxpan/tuxpan-thumb.png';
import c1 from '@/assets/tuxpan/e1-01.png';
import c2 from '@/assets/tuxpan/e2-01.png';
import c3 from '@/assets/tuxpan/e3-01.png';
import e1p2 from '@/assets/tuxpan/e1-02.jpg';
import e1p3 from '@/assets/tuxpan/e1-03.jpg';
import e1p4 from '@/assets/tuxpan/e1-04.jpg';
import e1p5 from '@/assets/tuxpan/e1-05.jpg';
import e1p6 from '@/assets/tuxpan/e1-06.jpg';
import e2p2 from '@/assets/tuxpan/e2-02.jpg';
import e2p3 from '@/assets/tuxpan/e2-03.jpg';
import e2p4 from '@/assets/tuxpan/e2-04.jpg';
import e2p5 from '@/assets/tuxpan/e2-05.jpg';
import e2p6 from '@/assets/tuxpan/e2-06.jpg';
import e3p2 from '@/assets/tuxpan/e3-02.jpg';
import e3p3 from '@/assets/tuxpan/e3-03.jpg';
import e3p4 from '@/assets/tuxpan/e3-04.jpg';
import e3p5 from '@/assets/tuxpan/e3-05.jpg';

/**
 * TuxpanCaseStudy — case study editorial dedicado (serie de ebooks TUXPAN).
 *
 * Adapta la maqueta rica de Claude Design al sistema del portafolio: fuentes
 * oficiales (IBM Plex Mono para títulos/rótulos, IBM Plex Sans para cuerpo),
 * fondo cremita y bordes asimétricos, regla vertical + BackButton. Conserva el
 * "mundo" de la marca TUXPAN (azul profundo, turquesa, magenta, degradés y
 * mockups 3D de portada) en los momentos de showcase. Rubik se carga SOLO para
 * el espécimen tipográfico —es la fuente del cliente, mostrada como documento—.
 * Todo el CSS propio vive bajo `.tx`.
 */

type Page = { img: string; cap: string };
type Ebook = {
  n: string;
  accent: string;
  title: string;
  meta: string;
  voice: string;
  bg: string;
  overlay: string;
  coverSide: 'left' | 'right';
  cover: string;
  spine: string;
  desc: string;
  facts: [string, string][];
  pages: Page[];
};

const EBOOKS: Ebook[] = [
  {
    n: '01',
    accent: '#32b4b7',
    title: 'De la Frustración al Crecimiento',
    meta: 'Software a la medida · 6 páginas',
    voice: 'Vocero: Francisco Coca, Subgerente de Nuevos Negocios',
    bg: '#12314a',
    overlay: 'linear-gradient(45deg,rgba(50,180,183,.34) 0%,rgba(28,38,61,0) 62%)',
    coverSide: 'left',
    cover: c1,
    spine: '#2b3a5c',
    desc: 'Degradé corporativo a 45° entre el azul profundo y el turquesa. El titular se parte en dos pesos —premisa sobre promesa— y la ilustración isométrica del banco de marca ocupa el tercio central. El isologotipo blanco cierra abajo, centrado.',
    facts: [
      ['Formato', 'Carta vertical'],
      ['Salida', 'PDF interactivo'],
      ['Revisiones', '3 rondas'],
    ],
    pages: [
      { img: e1p2, cap: 'Apertura con vocero: retrato circular, cita destacada y tres consecuencias en columnas iguales.' },
      { img: e1p3, cap: 'Banda azul con los cuatro síntomas numerados sobre línea punteada; el bloque claro baja el tono.' },
      { img: e1p4, cap: 'Cinco recomendaciones en lista, con el número en magenta como ancla de lectura.' },
      { img: e1p5, cap: 'Caso de éxito: el fondo cambia a azul para separarlo del cuerpo argumental.' },
      { img: e1p6, cap: 'Cierre común a la serie: checklist, llamada a la acción y botón «Agendar reunión».' },
    ],
  },
  {
    n: '02',
    accent: '#bf2c96',
    title: 'Cómo migrar a la nube y no morir en el intento',
    meta: 'Cloud y arquitectura · 6 páginas',
    voice: 'Vocero: Esteban Conejeros, Arquitecto de Software',
    bg: '#2a1b3d',
    overlay: 'linear-gradient(45deg,rgba(39,60,118,.6) 0%,rgba(42,27,61,0) 50%,rgba(191,44,150,.42) 100%)',
    coverSide: 'right',
    cover: c2,
    spine: '#4a2b55',
    desc: 'El segundo título gira el degradé hacia el magenta corporativo y alinea el titular a la izquierda, con la firma del vocero bajo el subtítulo. La ilustración de nube isométrica reutiliza la misma perspectiva que la portada anterior: cambia el color, no el lenguaje.',
    facts: [
      ['Degradé', 'Azul → magenta'],
      ['Marca invitada', 'AWS'],
      ['Dato destacado', '−45% en costos'],
    ],
    pages: [
      { img: e2p2, cap: 'Pregunta de apertura y cuatro síntomas de una mala migración, cada uno con su entrada en negrita.' },
      { img: e2p3, cap: 'Seis recomendaciones numeradas en dos columnas: la página más densa de la serie.' },
      { img: e2p4, cap: 'Caso real a dos columnas —hallazgos e intervención— con iconografía de alerta y visto.' },
      { img: e2p5, cap: 'Ficha técnica de Graviton junto al logo de AWS y los resultados cuantificados.' },
      { img: e2p6, cap: 'Checklist y cierre, con la misma estructura de conversión que los otros dos títulos.' },
    ],
  },
  {
    n: '03',
    accent: '#7ee0e2',
    title: 'El Nuevo Rol de los Chatbots en la Experiencia del Cliente',
    meta: 'IA conversacional · 5 páginas',
    voice: 'Registro analítico, sin vocero',
    bg: '#3a1a48',
    overlay: 'linear-gradient(45deg,rgba(191,44,150,.5) 0%,rgba(74,33,87,0) 52%,rgba(50,180,183,.42) 100%)',
    coverSide: 'left',
    cover: c3,
    spine: '#633072',
    desc: 'El tercer degradé cruza los dos colores de acento de la marca, magenta y turquesa, y cierra la serie. Es el título más analítico: el titular ocupa dos líneas completas y el subtítulo explica el enfoque antes de que aparezca la ilustración.',
    facts: [
      ['Extensión', '5 páginas'],
      ['Registro', 'Analítico'],
      ['Hito citado', 'ELIZA, 1966'],
    ],
    pages: [
      { img: e3p2, cap: 'Contexto histórico y tres síntomas: el bloque de 1966 funciona como nota al margen.' },
      { img: e3p3, cap: 'Cuatro recomendaciones numeradas y la promesa TUXPAN sobre fondo de color.' },
      { img: e3p4, cap: 'Caso en tres bloques: problema, intervención y resultados obtenidos.' },
      { img: e3p5, cap: 'Contraportada: cita de cierre, ilustración, CTA y barra de redes sociales.' },
    ],
  },
];

const PALETTE = ['#1c263d', '#273c76', '#274e7a', '#3864a0', '#32b4b7', '#bf2c96'];
const NEUTRALS = ['#d3d9e2', '#e4eaf2', '#f5f9fc'];
const GRADS: [string, string][] = [
  ['linear-gradient(45deg,#1c263d,#32b4b7)', 'Ebook 01'],
  ['linear-gradient(45deg,#273c76,#bf2c96)', 'Ebook 02'],
  ['linear-gradient(45deg,#bf2c96,#32b4b7)', 'Ebook 03'],
];

export default function TuxpanCaseStudy({ onBack }: { onBack: () => void }) {
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
    <div className="tx bg-[#fafaf7] min-h-screen relative">
      <style>{CSS}</style>

      <div
        className="fixed left-[80px] top-[56px] z-10 flex items-center justify-center max-[900px]:hidden"
        style={{ height: 'calc(100vh - 56px)', width: 28 }}
      >
        <ProgressBar progress={scrollProgress} onSeek={handleSeek} vertical ticks={tickCount(9)} />
      </div>

      <div ref={contentRef} className="tx-content">
        <div style={{ marginBottom: 32 }}>
          <BackButton onClick={onBack} />
        </div>

        {/* Header — formato del portafolio */}
        <header className="tx-flow tx-header">
          <p className="eyebrow">Proyecto 09 · Diseño editorial digital · 2025</p>
          <h1>Ebooks TUXPAN</h1>
          <p className="lead">Serie de tres ebooks para captación de leads B2B.</p>
          <p className="prose">
            El cliente entregó los textos, el Manual Corporativo y el banco de imágenes; el diseño
            editorial —retícula, jerarquía, sistema de página, ilustración y arte final— se desarrolló
            en tres rondas de revisión por título, hasta que los tres se leyeran como una familia.
          </p>

          <div className="tx-hero"><img src={hero} alt="Las tres portadas de la serie de ebooks TUXPAN" /></div>

          <div className="cover-meta">
            <div><span className="label">Diseño</span><span className="val">Matías Cáceres</span></div>
            <div><span className="label">Cliente</span><span className="val">TUXPAN Ingeniería</span></div>
            <div><span className="label">Insumos del cliente</span><span className="val">Contenido · Manual · Imágenes</span></div>
            <div><span className="label">Entregable</span><span className="val">3 ebooks · 17 páginas</span></div>
            <div><span className="label">Iteración</span><span className="val">3 rondas por título</span></div>
          </div>
        </header>

        {/* Encargo / Desafío / Objetivo */}
        <section className="tx-flow sec">
          <div className="trio">
            <div>
              <p className="eyebrow mag">El encargo</p>
              <h3>Tres ebooks, un mismo sistema</h3>
              <p className="prose">TUXPAN necesitaba tres piezas descargables sobre software a medida, migración a la nube y chatbots con IA. Recibí los textos cerrados, el Manual Corporativo y un banco de ilustraciones. El trabajo fue convertir ese material en tres publicaciones que se leyeran como una familia.</p>
            </div>
            <div>
              <p className="eyebrow mag">El desafío</p>
              <h3>Contenido técnico, lector apurado</h3>
              <p className="prose">El material llegó como texto corrido: párrafos largos, listas sin jerarquía y casos de éxito sin separación del cuerpo. El lector —gerentes de TI y de operaciones— hojea antes de leer, así que el argumento tenía que verse antes de leerse.</p>
            </div>
            <div>
              <p className="eyebrow mag">El objetivo</p>
              <h3>Leerse en dos velocidades</h3>
              <p className="prose">Cada página funciona en escaneo rápido —titular, numeración, destacado en magenta— y en lectura detenida. Los tres títulos comparten retícula, tipografía y estructura de cierre, y se diferencian por el degradé de portada.</p>
              <div className="tags">
                <span>Jerarquía escaneable</span>
                <span>Serie reconocible</span>
                <span>Cierre con conversión</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sistema de marca */}
        <section className="tx-flow sec">
          <p className="eyebrow mag">Base</p>
          <h2>Sistema tomado del Manual Corporativo TUXPAN</h2>
          <p className="prose">No inventé una identidad: la interpreté. Paleta, tipografía y uso del isologotipo salen del manual del cliente; la serie los ordena en un sistema de página coherente.</p>

          <div className="brand">
            <div className="brand-col">
              <span className="label">Paleta corporativa</span>
              <div className="sw-row">
                {PALETTE.map((c) => (
                  <div key={c} className="sw"><div className="chip" style={{ background: c }} /><span>{c}</span></div>
                ))}
              </div>
              <div className="sw-row three">
                {NEUTRALS.map((c) => (
                  <div key={c} className="sw"><div className="chip sm" style={{ background: c, border: c === '#f5f9fc' ? '1px solid #dcdbd5' : 'none' }} /><span>{c}</span></div>
                ))}
              </div>
              <span className="label" style={{ marginTop: 22, display: 'block' }}>Degradés a 45°, uno por título</span>
              <div className="sw-row three">
                {GRADS.map(([g, name]) => (
                  <div key={name} className="sw"><div className="chip grad" style={{ background: g }} /><span>{name}</span></div>
                ))}
              </div>
            </div>

            <div className="brand-col">
              <span className="label">Tipografía · Rubik (fuente del cliente)</span>
              <div className="type-row"><span className="tl">Bold · Portada</span><span className="rubik" style={{ fontWeight: 700, fontSize: 40 }}>Crecimiento</span></div>
              <div className="type-row"><span className="tl">Bold · Título</span><span className="rubik" style={{ fontWeight: 700, fontSize: 26 }}>Síntomas comunes</span></div>
              <div className="type-row"><span className="tl">Medium · Destacado</span><span className="rubik" style={{ fontWeight: 500, fontSize: 17, color: '#bf2c96' }}>Con software a la medida</span></div>
              <div className="type-row"><span className="tl">Light · Párrafo</span><span className="rubik" style={{ fontWeight: 300, fontSize: 15, color: '#4a5670' }}>Herramientas diseñadas para la operación real.</span></div>
              <p className="prose" style={{ marginTop: 20 }}>El manual fija Rubik como familia única. La serie resuelve toda la jerarquía con cuatro pesos —Light, Regular, Medium y Bold— sin introducir una segunda familia.</p>
            </div>

            <div className="brand-col">
              <span className="label">Isologotipo</span>
              <div className="iso navy"><img src={logo} alt="Isologotipo TUXPAN en blanco" /></div>
              <div className="iso-two">
                <div className="iso" style={{ background: 'linear-gradient(45deg,#273c76,#bf2c96)' }}><img src={logo} alt="TUXPAN sobre degradé" /></div>
                <div className="iso" style={{ background: 'linear-gradient(45deg,#1c263d,#32b4b7)' }}><img src={logo} alt="TUXPAN sobre degradé" /></div>
              </div>
              <p className="prose">Sobre color y degradés el manual exige el isologotipo <strong>completamente en blanco</strong>. En la serie aparece siempre al pie de portada y contraportada, en un solo tamaño, como firma y no como elemento gráfico.</p>
            </div>
          </div>
        </section>

        {/* Los tres ebooks */}
        {EBOOKS.map((eb) => (
          <section className="tx-flow sec" key={eb.n}>
            <div className="eb-head">
              <div className="eb-head-l">
                <span className="eb-num" style={{ color: eb.accent }}>{eb.n}</span>
                <h2>{eb.title}</h2>
              </div>
              <div className="eb-head-r">{eb.meta}<br />{eb.voice}</div>
            </div>

            <div className="cover-show" style={{ background: eb.bg, flexDirection: eb.coverSide === 'right' ? 'row-reverse' : 'row' }}>
              <div className="cover-ovl" style={{ background: eb.overlay }} />
              <div className="cover-3d">
                <div className="c3d-inner" style={{ transform: eb.coverSide === 'right' ? 'rotateX(4deg) rotateY(16deg)' : 'rotateX(4deg) rotateY(-16deg)' }}>
                  <div className="c3d-spine" style={{ background: eb.spine, [eb.coverSide === 'right' ? 'right' : 'left']: '22px' } as React.CSSProperties} />
                  <img src={eb.cover} alt={`Portada ${eb.title}`} />
                </div>
              </div>
              <div className="cover-txt">
                <span className="eyebrow" style={{ color: eb.accent }}>Portada</span>
                <p>{eb.desc}</p>
                <div className="cover-facts">
                  {eb.facts.map(([k, v]) => (
                    <div key={k}><span className="fk">{k}</span><span className="fv">{v}</span></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pages-wrap">
              <span className="label">Páginas interiores</span>
              <div className="pages">
                {eb.pages.map((p, i) => (
                  <figure className="pg" key={i}>
                    <div className="pg-frame"><img src={p.img} alt={`Página interior ${i + 2}`} /></div>
                    <figcaption>{p.cap}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Proceso */}
        <section className="tx-flow sec">
          <p className="eyebrow mag">Proceso</p>
          <h2>Tres rondas por título, nueve en total</h2>
          <div className="proc">
            <div className="proc-step"><span className="pn">01</span><div><h3>Diagramación</h3><p>Primera propuesta a partir del texto cerrado y del Manual Corporativo.</p></div></div>
            <div className="proc-step"><span className="pn">02</span><div><h3>Revisión con el cliente</h3><p>Ajuste de jerarquía, extensión y selección de imágenes del banco de marca.</p></div></div>
            <div className="proc-step"><span className="pn">03</span><div><h3>Arte final</h3><p>Corrección final y entrega del PDF interactivo con el botón de agendamiento.</p></div></div>
          </div>
        </section>

        <div className="tx-flow tx-end">
          <span className="label">Ebooks TUXPAN · Diagramación, ilustración y arte final · Matías Cáceres</span>
        </div>
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;700&display=swap');
.tx{color:var(--t-ink);
  --t-navy:#1c263d;--t-blue:#273c76;--t-teal:#32b4b7;--t-mag:#bf2c96;
  --t-ink:#1c263d;--t-body:#4a5670;--t-faint:#7a869c;--t-line:#e4eaf2;--t-line2:#d3d9e2;
  --t-mono:'IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --t-mono-med:'IBM Plex Mono:Medium','IBM Plex Mono:Regular',ui-monospace,Menlo,monospace;
  --t-sans:'IBM Plex Sans:Regular',system-ui,-apple-system,sans-serif;
  --t-rubik:'Rubik',system-ui,sans-serif;--t-max:1180px;}
.tx *{box-sizing:border-box;}
.tx .tx-content{padding:48px 80px 48px 188px;}
@media(max-width:900px){.tx .tx-content{padding:32px 24px;}}
.tx .tx-flow{max-width:var(--t-max);}
.tx .sec{max-width:var(--t-max);padding:60px 0;border-top:1px solid var(--t-line);margin-top:8px;}
.tx .eyebrow{font-family:var(--t-mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--t-teal);margin:0 0 16px;display:flex;align-items:center;gap:10px;}
.tx .eyebrow::before{content:"";width:22px;height:2px;background:currentColor;}
.tx .eyebrow.mag{color:var(--t-mag);}
.tx h1{font-family:var(--t-mono);font-weight:400;font-size:clamp(28px,2.6vw,40px);line-height:1.1;margin:0;color:var(--t-ink);}
.tx h2{font-family:var(--t-mono-med);font-weight:500;font-size:clamp(23px,3vw,31px);line-height:1.14;letter-spacing:-.01em;margin:0 0 10px;color:var(--t-ink);}
.tx h3{font-family:var(--t-mono-med);font-weight:500;font-size:18px;line-height:1.25;margin:0 0 8px;color:var(--t-ink);}
.tx .lead{font-family:var(--t-sans);font-size:20px;line-height:1.5;color:var(--t-body);margin:14px 0 6px;}
.tx p{font-family:var(--t-sans);font-size:16px;line-height:1.62;color:var(--t-body);margin:0 0 14px;}
.tx p:last-child{margin-bottom:0;}
.tx .prose{max-width:66ch;}
.tx strong{color:var(--t-ink);font-weight:600;}
.tx .label{font-family:var(--t-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--t-faint);}

/* header */
.tx .tx-header{padding-bottom:8px;}
.tx .tx-hero{margin-top:28px;border-radius:4px;overflow:hidden;border:1px solid var(--t-navy);border-width:1px 4px 4px 1px;}
.tx .tx-hero img{display:block;width:100%;height:auto;}
.tx .cover-meta{margin-top:22px;display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--t-line);border:1px solid var(--t-line);border-radius:3px;overflow:hidden;}
.tx .cover-meta>div{background:#fff;padding:15px 16px;}
.tx .cover-meta .label{display:block;margin-bottom:7px;}
.tx .cover-meta .val{font-family:var(--t-sans);font-size:14px;line-height:1.35;color:var(--t-ink);}

/* trio */
.tx .trio{display:grid;grid-template-columns:repeat(3,1fr);gap:44px;}
.tx .tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px;}
.tx .tags span{font-family:var(--t-mono);font-size:11px;letter-spacing:.04em;color:var(--t-ink);background:var(--t-line);border-radius:999px;padding:8px 14px;}

/* sistema de marca */
.tx .brand{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) 320px;gap:52px;align-items:start;margin-top:26px;}
.tx .sw-row{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0;}
.tx .sw span{font-family:var(--t-mono);font-size:11px;color:var(--t-faint);margin-top:7px;display:block;}
.tx .chip{height:78px;border-radius:2px;}
.tx .chip.sm{height:40px;}
.tx .chip.grad{height:56px;}
.tx .type-row{display:flex;align-items:baseline;gap:18px;padding:13px 0;border-bottom:1px solid var(--t-line);}
.tx .type-row .tl{flex:none;width:112px;font-family:var(--t-mono);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--t-faint);}
.tx .rubik{font-family:var(--t-rubik);color:var(--t-ink);line-height:1.1;}
.tx .iso{border-radius:3px;display:flex;align-items:center;justify-content:center;padding:30px 24px;}
.tx .iso.navy{background:var(--t-navy);margin-bottom:12px;}
.tx .iso img{width:170px;height:auto;display:block;}
.tx .iso-two{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;}
.tx .iso-two .iso{padding:20px 12px;}
.tx .iso-two img{width:104px;}

/* cabecera de cada ebook */
.tx .eb-head{display:flex;align-items:flex-end;justify-content:space-between;gap:32px;border-bottom:2px solid var(--t-navy);padding-bottom:16px;margin-bottom:0;}
.tx .eb-head-l{display:flex;align-items:baseline;gap:20px;min-width:0;}
.tx .eb-num{font-family:var(--t-mono-med);font-weight:500;font-size:clamp(34px,4vw,52px);line-height:.8;letter-spacing:-.02em;flex:none;}
.tx .eb-head h2{margin:0;}
.tx .eb-head-r{font-family:var(--t-mono);font-size:12px;line-height:1.5;color:var(--t-faint);text-align:right;flex:none;}

/* showcase de portada (mundo TUXPAN) */
.tx .cover-show{position:relative;overflow:hidden;border-radius:0 0 4px 4px;display:flex;align-items:center;gap:64px;padding:64px 60px;margin-top:0;}
.tx .cover-ovl{position:absolute;inset:0;pointer-events:none;}
.tx .cover-3d{position:relative;flex:none;perspective:2200px;width:400px;display:flex;justify-content:center;}
.tx .c3d-inner{position:relative;transform-style:preserve-3d;}
.tx .c3d-inner img{position:relative;display:block;width:340px;height:auto;border-radius:2px;box-shadow:0 40px 80px rgba(8,12,24,.55);}
.tx .c3d-spine{position:absolute;top:18px;width:340px;height:calc(100% - 18px);border-radius:2px;transform:translateZ(-30px);}
.tx .cover-txt{position:relative;max-width:520px;}
.tx .cover-txt p{color:#d7deea;font-size:17px;}
.tx .cover-txt .eyebrow{margin-bottom:16px;}
.tx .cover-facts{display:flex;gap:38px;margin-top:26px;border-top:1px solid rgba(255,255,255,.16);padding-top:20px;flex-wrap:wrap;}
.tx .cover-facts .fk{display:block;font-family:var(--t-mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#8a97b0;margin-bottom:7px;}
.tx .cover-facts .fv{font-family:var(--t-mono-med);font-size:16px;color:#fff;}

/* páginas interiores */
.tx .pages-wrap{margin-top:34px;}
.tx .pages-wrap>.label{display:block;margin-bottom:16px;}
.tx .pages{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;}
.tx .pg{margin:0;}
.tx .pg-frame{border:1px solid var(--t-line);border-radius:2px;overflow:hidden;background:#fff;box-shadow:0 8px 22px rgba(28,38,61,.10);}
.tx .pg-frame img{display:block;width:100%;height:auto;}
.tx .pg figcaption{font-family:var(--t-sans);font-size:12.5px;line-height:1.45;color:var(--t-faint);margin-top:10px;}

/* proceso */
.tx .proc{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:18px;}
.tx .proc-step{display:grid;grid-template-columns:44px 1fr;gap:14px;align-items:start;border:1px solid var(--t-line);border-radius:3px;padding:22px 20px;background:#fff;}
.tx .proc-step .pn{font-family:var(--t-mono-med);font-weight:500;font-size:22px;color:var(--t-mag);}
.tx .proc-step p{font-size:14.5px;margin:0;}

.tx .tx-end{margin-top:52px;padding-top:24px;border-top:1px solid var(--t-line);}

@media(max-width:1040px){
  .tx .trio,.tx .brand,.tx .proc{grid-template-columns:1fr;}
  .tx .cover-show{flex-direction:column!important;gap:36px;padding:44px 32px;}
  .tx .pages{grid-template-columns:repeat(2,1fr);}
  .tx .cover-meta{grid-template-columns:repeat(2,1fr);}
  .tx .eb-head{flex-direction:column;align-items:flex-start;gap:10px;}
  .tx .eb-head-r{text-align:left;}
}
`;
