/**
 * EdubigProcess — proceso de Design Thinking iterativo (Empatizar → Definir →
 * Idear → Prototipar → Testear) con nota de en qué punto del ciclo está hoy
 * el proyecto. Calza en 736×460.
 */
const MONO = "'IBM_Plex_Mono:Medium',sans-serif";
const MONO_R = "'IBM_Plex_Mono:Regular',sans-serif";
const SANS = "'IBM_Plex_Sans:Regular',sans-serif";

const STEPS = ['Empatizar', 'Definir', 'Idear', 'Prototipar', 'Testear'];

export default function EdubigProcess() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fafaf7', padding: 26, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center', border: '1px solid #dcdbd5', background: i <= 1 ? '#f2f1ec' : '#fff', borderRadius: 3, padding: '18px 6px' }}>
              <div style={{ fontFamily: MONO_R, fontSize: 10, color: '#b6b5b0', marginBottom: 6 }}>{`0${i + 1}`}</div>
              <div style={{ fontFamily: MONO_R, fontSize: 13, color: '#0f0f0e' }}>{s}</div>
            </div>
            {i < STEPS.length - 1 && <span style={{ color: '#8a8a85', padding: '0 5px', fontFamily: MONO_R }}>→</span>}
          </div>
        ))}
      </div>
      <div style={{ borderLeft: '3px solid #5f8f5f', background: '#f2f1ec', padding: '14px 18px', borderRadius: '0 3px 3px 0' }}>
        <span style={{ fontFamily: SANS, fontSize: 13.5, color: '#3a3a38', lineHeight: 1.5 }}>
          Proceso iterativo, no lineal. Hoy Edubig está de vuelta en <b style={{ color: '#0f0f0e', fontWeight: 600 }}>Definir</b> e <b style={{ color: '#0f0f0e', fontWeight: 600 }}>Idear</b>: se rehace el dataset base para ampliar de Pudahuel a todo Chile, y luego volver a Prototipar y Testear con familias reales.
        </span>
      </div>
    </div>
  );
}
