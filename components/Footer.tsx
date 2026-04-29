"use client";

import Link from "next/link";

const whatsapp = "50496212458";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Colecciones", href: "/productos" },
  { label: "Ofertas", href: "/ofertas" },
];

const collections = [
  { label: "Vestidos", href: "/productos?categoria=vestidos" },
  { label: "Abrigos", href: "/productos?categoria=abrigos" },
  { label: "Blusas y Tops", href: "/productos?categoria=tops" },
  { label: "Accesorios", href: "/productos?categoria=accesorios" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--surface)", color: "var(--fg-muted)", borderTop: "1px solid var(--border)" }}>
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1 space-y-4">
          <Link
            href="/"
            className="block font-[--font-display] text-2xl font-light tracking-[0.3em] uppercase"
            style={{ color: "var(--fg)" }}
          >
            PARADISE
          </Link>
          <p className="text-xs leading-relaxed">
            Moda femenina con elegancia y estilo. Piezas únicas para cada ocasión.
          </p>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-sm transition-colors hover:opacity-80"
            style={{ border: "1px solid var(--border)", color: "var(--fg)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.112 1.528 5.832L.057 23.617a.5.5 0 0 0 .609.61l5.912-1.547A11.956 11.956 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.537-5.209-1.468l-.374-.223-3.867 1.012 1.012-3.789-.245-.39A9.963 9.963 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            Escríbenos
          </a>
        </div>

        {/* Menu */}
        <div>
          <h4 className="text-[10px] tracking-[0.25em] uppercase mb-5 font-semibold" style={{ color: "var(--fg)" }}>
            Menú
          </h4>
          <ul className="space-y-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs transition-opacity hover:opacity-100" style={{ color: "var(--fg-muted)" }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Collections */}
        <div>
          <h4 className="text-[10px] tracking-[0.25em] uppercase mb-5 font-semibold" style={{ color: "var(--fg)" }}>
            Colecciones
          </h4>
          <ul className="space-y-3">
            {collections.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs transition-opacity hover:opacity-100" style={{ color: "var(--fg-muted)" }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] tracking-[0.25em] uppercase mb-5 font-semibold" style={{ color: "var(--fg)" }}>
            Contacto
          </h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 flex-shrink-0">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 6.29 6.29l.972-.972a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity" style={{ color: "var(--fg-muted)" }}>
                +504 9621-2458
              </a>
            </li>
            <li className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mt-0.5 flex-shrink-0">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span style={{ color: "var(--fg-muted)" }}>hola@paradise.com</span>
            </li>
          </ul>

          {/* Socials */}
          <div className="flex gap-4 mt-6" style={{ color: "var(--fg-muted)" }}>
            {[
              { label: "Instagram", icon: <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg> },
              { label: "Facebook", icon: <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
              { label: "TikTok", icon: <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.27 8.27 0 0 0 4.84 1.55V6.86a4.85 4.85 0 0 1-1.07-.17z"/></svg> },
            ].map(({ label, icon }) => (
              <a key={label} href="#" aria-label={label} className="hover:opacity-100 transition-opacity">
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px]" style={{ color: "var(--fg-muted)" }}>
          <span>© {new Date().getFullYear()} PARADISE. Todos los derechos reservados.</span>
          <div className="flex gap-6">
            <Link href="#" className="hover:opacity-100 transition-opacity">Política de privacidad</Link>
            <Link href="#" className="hover:opacity-100 transition-opacity">Términos de uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
