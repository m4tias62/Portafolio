/**
 * EdubigDecisions — tres decisiones de diseño de Edubig, cada una como un
 * rechazo explícito, una elección y un trade-off asumido. Se desprenden de la
 * exploración y definición del concepto. Calza en 736×460 (tres columnas).
 */
const MONO = "'IBM_Plex_Mono:Medium',sans-serif";
const MONO_R = "'IBM_Plex_Mono:Regular',sans-serif";
const SANS = "'IBM_Plex_Sans:Regular',sans-serif";

const DECISIONS: { title: string; no: string; si: string; tr: string }[] = [
  {
    title: 'Anti-ranking como postura',
    no: 'El ranking absoluto: simplifica calidad a un número que correlaciona con NSE.',
    si: 'Fit contextual: cada colegio vs. su grupo GSE, en cinco dimensiones.',
    tr: 'Más fricción, resuelta con disclosure progresivo.',
  },
  {
    title: 'Comparar contra pares',
    no: 'Escalas absolutas nacionales, que castigan el contexto y no el desempeño.',
    si: 'Brecha vs. GSE similar, escala universal de ±56 puntos.',
    tr: 'Grupos pequeños volátiles: advertencia visible, no ocultar el dato.',
  },
  {
    title: 'Motor determinístico',
    no: 'Un modelo opaco: en una decisión emocional, la magia no da confianza.',
    si: 'Dos capas de reglas transparentes, auditables paso a paso.',
    tr: 'Menos «wow», más responsabilidad y trazabilidad.',
  },
];

function Row({ k, v, color }: { k: string; v: string; color: string }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontFamily: MONO_R, fontSize: 9.5, letterSpacing: '0.6px', textTransform: 'uppercase', color }}>{k}</div>
      <div style={{ fontFamily: SANS, fontSize: 11.5, color: '#3a3a38', lineHeight: 1.35 }}>{v}</div>
    </div>
  );
}

export default function EdubigDecisions() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fafaf7', padding: 22, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
      {DECISIONS.map((d, i) => (
        <div key={d.title} style={{ border: '1px solid #dcdbd5', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#f2f1ec', padding: '12px 14px', borderBottom: '1px solid #dcdbd5' }}>
            <div style={{ fontFamily: MONO_R, fontSize: 9.5, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#8a8a85' }}>{`Decisión 0${i + 1}`}</div>
            <div style={{ fontFamily: MONO_R, fontSize: 13, color: '#0f0f0e', marginTop: 3, lineHeight: 1.2 }}>{d.title}</div>
          </div>
          <div style={{ padding: '10px 14px 14px' }}>
            <Row k="Rechacé" v={d.no} color="#d6604d" />
            <Row k="Elegí" v={d.si} color="#1e6a2e" />
            <Row k="Trade-off" v={d.tr} color="#8a6d00" />
          </div>
        </div>
      ))}
    </div>
  );
}
