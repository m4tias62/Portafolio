/**
 * EdubigSources — figura de contexto: cinco portales oficiales que no se
 * conectan entre sí, y que la familia debe integrar a mano. Calza en 736×460.
 */
const MONO = "'IBM_Plex_Mono:Medium',sans-serif";
const MONO_R = "'IBM_Plex_Mono:Regular',sans-serif";
const SANS = "'IBM_Plex_Sans:Regular',sans-serif";

const SOURCES: [string, string][] = [
  ['Mineduc', 'Directorio nacional'],
  ['SIMCE', 'Rendimiento académico'],
  ['IDPS', 'Desarrollo integral'],
  ['Supereduc', 'Denuncias y sanciones'],
  ['DEMRE', 'Trayectoria universitaria'],
];

export default function EdubigSources() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fafaf7', padding: 26, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
        {SOURCES.map(([n, d]) => (
          <div key={n} style={{ border: '1px solid #dcdbd5', borderRadius: 3, padding: '14px 10px', background: '#fff', minHeight: 92 }}>
            <div style={{ fontFamily: MONO_R, fontSize: 13, color: '#0f0f0e', marginBottom: 6 }}>{n}</div>
            <div style={{ fontFamily: SANS, fontSize: 11.5, color: '#8a8a85', lineHeight: 1.35 }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontFamily: MONO_R, fontSize: 12, color: '#8a8a85' }}>cinco fuentes que no dialogan &nbsp;→&nbsp; la familia hace de integrador manual</div>
      <div style={{ borderLeft: '3px solid #d6604d', background: '#f2f1ec', padding: '12px 16px', borderRadius: '0 3px 3px 0' }}>
        <span style={{ fontFamily: SANS, fontSize: 13.5, color: '#3a3a38', lineHeight: 1.5 }}>
          Los rankings públicos lo reducen todo a un número que correlaciona con nivel socioeconómico, no con calidad pedagógica.
        </span>
      </div>
    </div>
  );
}
