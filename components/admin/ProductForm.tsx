"use client";

import { useState } from "react";
import type { Product, Category } from "@/lib/products";

interface Props {
  product?: Product | null;
  categories: Category[];
  token: string;
  onSave: () => void;
  onCancel: () => void;
}

type FormData = {
  name: string; slug: string; description: string; price: string;
  category_id: string; images: string; colors: string; sizes: string;
  is_featured: boolean; is_sale: boolean;
};

function toForm(p?: Product | null): FormData {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    description: p?.description ?? "",
    price: p?.price?.toString() ?? "",
    category_id: p?.category_id?.toString() ?? "",
    images: p?.images?.join("\n") ?? "",
    colors: p?.colors?.join(", ") ?? "",
    sizes: p?.sizes?.join(", ") ?? "",
    is_featured: p?.is_featured ?? false,
    is_sale: p?.is_sale ?? false,
  };
}

function slugify(t: string) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] tracking-widest uppercase block mb-1.5 font-medium" style={{ color: "var(--fg-muted)" }}>
      {children}
    </label>
  );
}

export default function ProductForm({ product, categories, token, onSave, onCancel }: Props) {
  const [form, setForm]     = useState<FormData>(toForm(product));
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  function set(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description,
        price: parseFloat(form.price),
        category_id: form.category_id ? Number(form.category_id) : null,
        images:  form.images.split("\n").map((s) => s.trim()).filter(Boolean),
        colors:  form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        sizes:   form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        is_featured: form.is_featured,
        is_sale: form.is_sale,
      };
      const res = await fetch(
        product ? `/api/productos/${product.id}` : "/api/productos",
        {
          method: product ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error("Error al guardar");
      onSave();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Nombre — full width */}
      <div>
        <Label>Nombre *</Label>
        <input
          value={form.name}
          onChange={(e) => { set("name", e.target.value); if (!product) set("slug", slugify(e.target.value)); }}
          required
          className="admin-input"
          placeholder="Ej. Vestido Largo Elegante"
        />
      </div>

      {/* Slug + Precio — 2 cols en sm+ , apilados en móvil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Slug</Label>
          <input
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="admin-input"
            placeholder="vestido-largo-elegante"
          />
        </div>
        <div>
          <Label>Precio *</Label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            required
            className="admin-input"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Categoría */}
      <div>
        <Label>Categoría</Label>
        <select
          value={form.category_id}
          onChange={(e) => set("category_id", e.target.value)}
          className="admin-input"
        >
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Descripción */}
      <div>
        <Label>Descripción</Label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className="admin-input resize-none"
          placeholder="Describe el producto..."
        />
      </div>

      {/* Imágenes */}
      <div>
        <Label>Imágenes (una URL por línea)</Label>
        <textarea
          value={form.images}
          onChange={(e) => set("images", e.target.value)}
          rows={3}
          placeholder="https://images.unsplash.com/..."
          className="admin-input resize-none"
        />
      </div>

      {/* Colores + Tallas — 2 cols en sm+, apilados en móvil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Colores (separados por coma)</Label>
          <input
            value={form.colors}
            onChange={(e) => set("colors", e.target.value)}
            placeholder="Negro, Blanco, Beige"
            className="admin-input"
          />
        </div>
        <div>
          <Label>Tallas (separadas por coma)</Label>
          <input
            value={form.sizes}
            onChange={(e) => set("sizes", e.target.value)}
            placeholder="XS, S, M, L, XL"
            className="admin-input"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div
        className="flex flex-wrap gap-6 py-3 px-4 rounded-sm"
        style={{ backgroundColor: "var(--beige)", border: "1px solid var(--border)" }}
      >
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => set("is_featured", e.target.checked)}
            className="admin-checkbox"
          />
          <span className="text-sm" style={{ color: "var(--fg)" }}>Destacado</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_sale}
            onChange={(e) => set("is_sale", e.target.checked)}
            className="admin-checkbox"
          />
          <span className="text-sm" style={{ color: "var(--fg)" }}>En Oferta</span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs px-3 py-2 rounded-sm" style={{ color: "#c0392b", backgroundColor: "#fee2e2" }}>
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="btn-solid flex-1 py-3 disabled:opacity-50"
        >
          {saving ? "Guardando..." : product ? "Actualizar producto" : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline px-6 py-3"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
