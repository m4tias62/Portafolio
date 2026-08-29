/**
 * SocialLinksButtons
 * ------------------
 * Botón social 32×32 con 4 estados del design system de Matías:
 *   Default        — bg #0A0A0A, ícono blanco.
 *   Hover          — bg #E1E1E1, ícono #0A0A0A.
 *   Pressed        — bg #FFFF00, ícono #0A0A0A.
 *   Focus-visible  — bg #FFFF00, ícono #0A0A0A, ring #0A0A0A separado 2px.
 *
 * Los íconos son SVG inline (color por currentColor) — sin dependencias
 * externas ni requests a servidores. Fuente: paths oficiales simple-icons.
 */

type SocialButtonProps = {
  href: string;
  label: string;
  children: React.ReactNode;
};

function SocialButton({ href, label, children }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={[
        // base
        'inline-flex items-center justify-center',
        'size-[32px] shrink-0',
        'bg-[#0A0A0A] text-white',
        'transition-colors duration-150',
        // hover
        'hover:bg-[#E1E1E1] hover:text-[#0A0A0A]',
        // pressed / active
        'active:bg-[#FFFF00] active:text-[#0A0A0A]',
        // focus-visible (con ring negro separado)
        'outline-none',
        'focus-visible:bg-[#FFFF00] focus-visible:text-[#0A0A0A]',
        'focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafaf7]',
      ].join(' ')}
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function SocialLinks() {
  return (
    <div className="flex gap-[12px]" aria-label="Redes sociales">
      <SocialButton
        href="https://www.instagram.com/m4tyy62/"
        label="Instagram de Matías Cáceres"
      >
        <InstagramIcon />
      </SocialButton>
      <SocialButton
        href="https://www.linkedin.com/in/matias-caceres-maureira-9b6051259/"
        label="LinkedIn de Matías Cáceres"
      >
        <LinkedInIcon />
      </SocialButton>
    </div>
  );
}
