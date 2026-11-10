// Tipado mínimo del custom element <model-viewer> (Google Model Viewer),
// cargado como script global en index.html (public/vendor/model-viewer.min.js).
// No es un paquete npm en este proyecto — solo se declara el elemento JSX.
// React 19 resuelve JSX.IntrinsicElements vía el namespace React.JSX
// (jsx-runtime automático), por eso se aumenta el módulo 'react' y no
// el namespace global JSX directamente.
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'shadow-intensity'?: string | number;
        'auto-rotate-delay'?: string | number;
        'interaction-prompt'?: string;
        exposure?: string | number;
        'environment-image'?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'interaction' | 'manual';
      };
    }
  }
}

export {};
