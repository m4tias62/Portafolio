/**
 * EdubigColorRails — sistema de color de Edubig en tres carriles que no se
 * mezclan (identidad / semáforo / data-viz). Calza en 736×460.
 */
const MONO = "'IBM_Plex_Mono:Medium',sans-serif";
const MONO_R = "'IBM_Plex_Mono:Regular',sans-serif";
const SANS = "'IBM_Plex_Sans:Regular',sans-serif";

const RAILS: { letter: string; name: string; cols: string[]; desc: string; labels?: string[] }[] = [
  { letter: 'A', name: 'Identidad', cols: ['#2166ac', '#67a9cf', '#d1e5f0', '#f7f7f7', '#fddbc7', '#ef8a62', '#d6604d'], desc: 'Frío ↔ cálido (RdBu). Logo, hero, navegación. Nunca codifica dato.' },
  { letter: 'B', name: 'Semáforo', cols: ['#1e6a2e', '#8a6d00'], desc: 'Solo donde el signo del dato es la información: brecha SIMCE.', labels: ['positivo', 'negativo'] },
  { letter: 'C', name: 'Data-viz', cols: ['#198038', '#4a62d1', '#a56eff'], desc: 'Categorías, no valoración: series comparadas en Bienestar y Comparación.', labels: ['este colegio', 'similares', 'nacional'] },
];

export default function EdubigColorRails() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fafaf7', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
      <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#8a8a85', marginBottom: 6 }}>Tres carriles de color que no se mezclan</div>
      {RAILS.map((r, ri) => (
        <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 18, alignItems: 'center', padding: '12px 0', borderTop: ri === 0 ? 'none' : '1px solid #ebeae4' }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#8a8a85' }}>{`Carril ${r.letter}`}</div>
            <div style={{ fontFamily: MONO_R, fontSize: 14, color: '#0f0f0e' }}>{r.name}</div>
          </div>
          <div>
            <div style={{ display: 'flex', gap: r.labels ? 6 : 0, borderRadius: 3, overflow: r.labels ? 'visible' : 'hidden', border: r.labels ? 'none' : '1px solid #dcdbd5' }}>
              {r.cols.map((c, ci) => (
                <div key={ci} style={{ flex: 1, height: 30, background: c, borderRadius: r.labels ? 3 : 0, display: 'flex', alignItems: 'flex-end', padding: r.labels ? '4px 7px' : 0 }}>
                  {r.labels && <span style={{ fontFamily: MONO_R, fontSize: 9.5, color: '#fff' }}>{r.labels[ci]}</span>}
                </div>
              ))}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: '#3a3a38', lineHeight: 1.4, marginTop: 6 }}>{r.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
