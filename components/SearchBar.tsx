"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); setQuery(""); }
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/productos?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <>
      {/* Search icon — always in navbar, never expands inline */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Buscar"
        className="p-1 hover:opacity-60 transition-opacity"
      >
        {open ? (
          /* X icon when open */
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          /* Magnifier icon */
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        )}
      </button>

      {/* Overlay — drops down BELOW the navbar, full width, never touches logo */}
      <div
        className={`fixed left-0 right-0 top-16 z-40 transition-all duration-200 ease-in-out ${
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
      >
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--fg-muted)", flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué estás buscando?"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--fg)" }}
          />
          {query && (
            <button type="submit" className="text-xs tracking-widest uppercase px-4 py-1.5 transition-colors" style={{ background: "var(--fg)", color: "var(--bg)" }}>
              Buscar
            </button>
          )}
        </form>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 top-16 z-30"
          onClick={() => { setOpen(false); setQuery(""); }}
        />
      )}
    </>
  );
}
