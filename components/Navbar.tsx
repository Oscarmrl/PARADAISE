"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useTheme } from "./ThemeProvider";
import SearchBar from "./SearchBar";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Colecciones", href: "/productos" },
  { label: "Ofertas", href: "/ofertas" },
];

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems);
  const openCart = useCartStore((s) => s.openCart);
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        backgroundColor: "color-mix(in srgb, var(--surface) 95%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left: nav links + search icon */}
        <div className="flex items-center gap-5">
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-widest uppercase transition-opacity hover:opacity-60"
                style={{ color: "var(--fg)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <SearchBar />
        </div>

        {/* Center: logo (absolute so it's always truly centered) */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-[--font-display] text-2xl font-light tracking-[0.3em] uppercase pointer-events-auto"
          style={{ color: "var(--fg)" }}
        >
          PARADISE
        </Link>

        {/* Right: theme toggle + cart */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            className="p-1 hover:opacity-60 transition-opacity"
            style={{ color: "var(--fg)" }}
          >
            {theme === "dark" ? (
              /* Sun icon */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              /* Moon icon */
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-1 hover:opacity-60 transition-opacity"
            aria-label="Carrito"
            style={{ color: "var(--fg)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {mounted && totalItems() > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                style={{ backgroundColor: "var(--fg)", color: "var(--bg)" }}
              >
                {totalItems()}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
