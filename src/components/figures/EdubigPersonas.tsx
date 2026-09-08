import { useState } from 'react';
import imgCarolina from '@/imports/edubig/persona-carolina.jpg';
import imgTomas from '@/imports/edubig/persona-tomas.jpg';
import imgMartin from '@/imports/edubig/persona-martin.jpg';

/**
 * EdubigPersonas — visor interactivo de los tres user persona oficiales.
 * Click en la ficha (o las flechas / los puntos) para recorrerlos. Diseñado
 * para calzar dentro del marco de figura de 736×460 del ProjectDetail: la
 * lámina va a `contain` y los controles se superponen abajo.
 */
const MONO = "'IBM_Plex_Mono:Medium',sans-serif";
const MONO_R = "'IBM_Plex_Mono:Regular',sans-serif";

const PERSONAS = [
  { img: imgCarolina, name: 'Carolina Muñoz', role: 'La mamá práctica' },
  { img: imgTomas, name: 'Tomás y Francisca', role: 'La pareja investigadora' },
  { img: imgMartin, name: 'Martín Soto', role: 'El estudiante que co-decide' },
];

export default function EdubigPersonas() {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  const n = PERSONAS.length;
  const go = (k: number) => setI(((k % n) + n) % n);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="User persona actual. Click o Enter para ver el siguiente."
      onClick={() => go(i + 1)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go(i + 1);
        } else if (e.key === 'ArrowRight') go(i + 1);
        else if (e.key === 'ArrowLeft') go(i - 1);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
    >
      <img
        src={PERSONAS[i].img}
        alt={`User persona: ${PERSONAS[i].name}, ${PERSONAS[i].role}`}
        draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
      />

      {/* hint hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: 14,
          pointerEvents: 'none',
          opacity: hover ? 1 : 0,
          transition: 'opacity .18s ease',
        }}
      >
        <span style={{ fontFamily: MONO_R, fontSize: 10.5, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#fff', background: 'rgba(15,15,14,.8)', padding: '6px 11px', borderRadius: 100 }}>
          Click → siguiente
        </span>
      </div>

      {/* controles abajo */}
      <div
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 14px', background: 'linear-gradient(180deg,transparent,rgba(250,250,247,.92) 55%)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', gap: 7 }}>
          {PERSONAS.map((p, k) => (
            <button
              key={p.name}
              type="button"
              aria-label={`Ver ${p.name}`}
              onClick={() => go(k)}
              style={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid #dcdbd5', padding: 0, cursor: 'pointer', background: k === i ? '#0f0f0e' : '#dcdbd5' }}
            />
          ))}
        </div>
        <span style={{ fontFamily: MONO_R, fontSize: 11, color: '#3a3a38' }}>
          {PERSONAS[i].name} · {i + 1}/{n}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" aria-label="Anterior" onClick={() => go(i - 1)} style={{ fontFamily: MONO_R, fontSize: 13, border: '1px solid #3a3a38', borderWidth: '1px 3px 3px 1px', background: '#fafaf7', borderRadius: 2, padding: '4px 10px', cursor: 'pointer', color: '#3a3a38' }}>←</button>
          <button type="button" aria-label="Siguiente" onClick={() => go(i + 1)} style={{ fontFamily: MONO_R, fontSize: 13, border: '1px solid #3a3a38', borderWidth: '1px 3px 3px 1px', background: '#fafaf7', borderRadius: 2, padding: '4px 10px', cursor: 'pointer', color: '#3a3a38' }}>→</button>
        </div>
      </div>
    </div>
  );
}
