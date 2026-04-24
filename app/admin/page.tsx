"use client";

import { useEffect, useState, useCallback } from "react";
import PasswordGate from "@/components/admin/PasswordGate";
import ProductForm from "@/components/admin/ProductForm";
import type { Product, Category } from "@/lib/products";

export default function AdminPage() {
  const [token, setToken]           = useState<string | null>(null);
  const [products, setProducts]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing]       = useState<Product | null | "new">(null);
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([fetch("/api/productos"), fetch("/api/categorias")]);
      setProducts(await pRes.json());
      setCategories(await cRes.json());
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/productos/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadData();
  }

  if (!token) return <PasswordGate onSuccess={(t) => setToken(t)} />;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8" style={{ color: "var(--fg)" }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[--font-display] text-3xl md:text-4xl font-light" style={{ color: "var(--fg)" }}>
            Panel Admin
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
            PARADISE — Gestión de productos
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setEditing("new")} className="btn-solid px-5 py-2.5 text-xs">
            + Nuevo
          </button>
          <button
            onClick={() => { sessionStorage.removeItem("admin_token"); setToken(null); }}
            className="btn-outline px-5 py-2.5 text-xs"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Modal form */}
      {editing !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-start justify-center overflow-y-auto sm:py-8 sm:px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        >
          {/* Sheet en móvil (sube desde abajo), modal centrado en desktop */}
          <div
            className="w-full sm:max-w-2xl sm:rounded-sm shadow-2xl flex flex-col max-h-[92dvh]"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
          >
            {/* Modal header fijo */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2 className="font-[--font-display] text-xl font-light" style={{ color: "var(--fg)" }}>
                {editing === "new" ? "Nuevo Producto" : "Editar Producto"}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="hover:opacity-50 transition-opacity p-1"
                style={{ color: "var(--fg)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Contenido scrollable */}
            <div className="overflow-y-auto flex-1 px-5 py-5">
              <ProductForm
                product={editing === "new" ? null : editing}
                categories={categories}
                token={token}
                onSave={() => { setEditing(null); loadData(); }}
                onCancel={() => setEditing(null)}
              />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm py-10 text-center" style={{ color: "var(--fg-muted)" }}>Cargando...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-sm py-10" style={{ color: "var(--fg-muted)" }}>
          No hay productos. Crea el primero.
        </p>
      ) : (
        <>
          {/* ── MOBILE: cards ── */}
          <div className="flex flex-col gap-3 md:hidden">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-sm p-4 space-y-2"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {/* Name + price row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: "var(--fg)" }}>{p.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
                      {p.category_name ?? "Sin categoría"} · ID {p.id}
                    </p>
                  </div>
                  <p className="text-sm font-semibold flex-shrink-0" style={{ color: "var(--fg)" }}>
                    ${Number(p.price).toFixed(2)}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex gap-2">
                  {p.is_featured && (
                    <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}>
                      Destacado
                    </span>
                  )}
                  {p.is_sale && (
                    <span className="text-[10px] tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: "#fee2e2", color: "#c0392b" }}>
                      Oferta
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
                  <button
                    onClick={() => setEditing(p)}
                    className="text-xs underline hover:opacity-60 transition-opacity pt-2"
                    style={{ color: "var(--fg)" }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-xs underline hover:opacity-60 transition-opacity pt-2"
                    style={{ color: "#c0392b" }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── DESKTOP: table ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["ID", "Nombre", "Categoría", "Precio", "Destacado", "Oferta", "Acciones"].map((h) => (
                    <th key={h} className="text-left text-xs tracking-widest uppercase py-3 px-3" style={{ color: "var(--fg-muted)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="admin-row">
                    <td className="py-3 px-3" style={{ color: "var(--fg-muted)" }}>{p.id}</td>
                    <td className="py-3 px-3 font-medium" style={{ color: "var(--fg)" }}>{p.name}</td>
                    <td className="py-3 px-3" style={{ color: "var(--fg-muted)" }}>{p.category_name ?? "—"}</td>
                    <td className="py-3 px-3" style={{ color: "var(--fg)" }}>${Number(p.price).toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span style={{ color: p.is_featured ? "#16a34a" : "var(--fg-muted)" }}>
                        {p.is_featured ? "✓" : "—"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span style={{ color: p.is_sale ? "#c0392b" : "var(--fg-muted)" }}>
                        {p.is_sale ? "✓" : "—"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-4">
                        <button onClick={() => setEditing(p)} className="text-xs underline hover:opacity-60 transition-opacity" style={{ color: "var(--fg)" }}>
                          Editar
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-xs underline hover:opacity-60 transition-opacity" style={{ color: "#c0392b" }}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
