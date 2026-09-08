/**
 * EdubigChain — figura de concepto de Edubig. Tres columnas (Dato / Puente /
 * Familia) que se resuelven en "un sistema que se traduce en cuidado", con la
 * paleta RdBu (identidad del sistema). Dibujada para calzar en el marco de
 * figura de 736×460 del ProjectDetail.
 */
const MONO = "'IBM_Plex_Mono:Medium',sans-serif";
const MONO_R = "'IBM_Plex_Mono:Regular',sans-serif";
const RDBU = ['#053061', '#2166ac', '#4393c3', '#92c5de', '#d1e5f0', '#f7f7f7', '#fddbc7', '#f4a582', '#d6604d', '#b2181f', '#67001f'];

const COLS: { key: string; label: string; words: string[]; bg: string; lc: string }[] = [
  { key: 'input', label: 'Dato · input', words: ['Imparcial', 'Frío', 'Honesto'], bg: 'linear-gradient(180deg,#eef5f9,#e3eef5)', lc: '#053061' },
  { key: 'bridge', label: 'Puente · Edubig', words: ['Accesible', 'Comprensible', 'Informado'], bg: '#fbfbf9', lc: '#0f0f0e' },
  { key: 'output', label: 'Familia · output', words: ['Cuidado', 'Preocupación', 'Seguridad'], bg: 'linear-gradient(180deg,#fbeee9,#f7e1d9)', lc: '#d6604d' },
];

export default function EdubigChain() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fafaf7', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', border: '1px solid #dcdbd5', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
        {COLS.map((c, i) => (
          <div key={c.key} style={{ background: c.bg, padding: '16px 12px', textAlign: 'center', borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,.5)' }}>
            <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '1px', textTransform: 'uppercase', color: c.lc, marginBottom: 10 }}>{c.label}</div>
            {c.words.map((w, j) => (
              <div key={w}>
                <div style={{ fontFamily: MONO_R, fontSize: 14, color: '#0f0f0e' }}>{w}</div>
                {j < c.words.length - 1 && <div style={{ color: '#8a8a85', fontSize: 11, margin: '3px 0' }}>↓</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ background: '#0f0f0e', color: '#fafaf7', textAlign: 'center', padding: '14px 10px', borderRadius: '0 0 4px 4px', fontFamily: MONO_R, fontSize: 18, letterSpacing: '-0.2px' }}>
        Un sistema que se traduce en cuidado
      </div>
      <div style={{ display: 'flex', border: '1px solid #dcdbd5', borderRadius: 3, overflow: 'hidden', marginTop: 2 }}>
        {RDBU.map(c => (<div key={c} style={{ flex: 1, height: 26, background: c }} />))}
      </div>
      <div style={{ fontFamily: MONO_R, fontSize: 11, color: '#8a8a85', lineHeight: 1.4 }}>
        Escala RdBu como identidad: frío para el dato imparcial, cálido para el cuidado. El anti-ranking se deriva de aquí.
      </div>
    </div>
  );
}
