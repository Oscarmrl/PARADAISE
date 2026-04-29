"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import toast from "react-hot-toast";
import { storage } from "@/lib/firebase";
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
  offer_price: string; category_id: string; colors: string; sizes: string;
  is_featured: boolean; is_sale: boolean;
};

function toForm(p?: Product | null): FormData {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    description: p?.description ?? "",
    price: p?.price?.toString() ?? "",
    offer_price: p?.offer_price?.toString() ?? "",
    category_id: p?.category_id?.toString() ?? "",
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

async function uploadImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map(async (file, i) => {
    const storageRef = ref(storage, `productos/${Date.now()}-${i}-${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }));
}

export default function ProductForm({ product, categories, token, onSave, onCancel }: Props) {
  const [form, setForm]         = useState<FormData>(toForm(product));
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [existingImages, setExistingImages] = useState<string[]>(product?.images ?? []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const pendingFilesRef = useRef<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function set(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const added = Array.from(e.target.files);
    const updated = [...pendingFilesRef.current, ...added];
    pendingFilesRef.current = updated;
    setNewFiles([...updated]);
    e.target.value = "";
  }

  function removeExisting(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
    setRemovedImages((prev) => [...prev, url]);
  }

  function removeNew(index: number) {
    const updated = pendingFilesRef.current.filter((_, i) => i !== index);
    pendingFilesRef.current = updated;
    setNewFiles([...updated]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const filesToUpload = pendingFilesRef.current;
      const uploadedUrls = filesToUpload.length > 0 ? await uploadImages(filesToUpload) : [];
      const images = [...existingImages, ...uploadedUrls];

      const body = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description,
        price: parseFloat(form.price),
        offer_price: form.is_sale && form.offer_price ? parseFloat(form.offer_price) : null,
        category_id: form.category_id ? Number(form.category_id) : null,
        images,
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        sizes:  form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
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

      await Promise.allSettled(
        removedImages.map(async (url) => {
          try { await deleteObject(ref(storage, url)); } catch { /* ignorado */ }
        })
      );

      toast.success(product ? "Producto actualizado" : "Producto creado");
      onSave();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Nombre */}
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

      {/* Slug + Precio */}
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
        <Label>Imágenes</Label>

        {/* Previews */}
        {(existingImages.length > 0 || newFiles.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {existingImages.map((url) => (
              <div key={url} className="relative w-20 h-24 flex-shrink-0 group">
                <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => removeExisting(url)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                  ×
                </button>
              </div>
            ))}
            {newFiles.map((file, i) => (
              <div key={i} className="relative w-20 h-24 flex-shrink-0 group overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Botón subir */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            opacity: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn-outline text-xs px-4 py-2"
        >
          + Subir imágenes
          {newFiles.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: "var(--fg)", color: "var(--bg)" }}>
              {newFiles.length}
            </span>
          )}
        </button>
        <p className="text-[10px] mt-1.5" style={{ color: "var(--fg-muted)" }}>
          Se subirán a Firebase Storage al guardar
        </p>
      </div>

      {/* Colores + Tallas */}
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
            onChange={(e) => {
              set("is_sale", e.target.checked);
              if (!e.target.checked) set("offer_price", "");
            }}
            className="admin-checkbox"
          />
          <span className="text-sm" style={{ color: "var(--fg)" }}>En Oferta</span>
        </label>
      </div>

      {/* Precio de oferta (visible solo si is_sale está activo) */}
      {form.is_sale && (
        <div
          className="p-4 rounded-sm space-y-2"
          style={{ backgroundColor: "color-mix(in srgb, #dc2626 8%, var(--surface))", border: "1px solid #dc2626" }}
        >
          <Label>Precio de Oferta *</Label>
          <p className="text-[10px]" style={{ color: "var(--fg-muted)" }}>
            Precio original: <strong>${form.price || "0.00"}</strong> — El precio de oferta se mostrará resaltado en la tienda.
          </p>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.offer_price}
            onChange={(e) => set("offer_price", e.target.value)}
            className="admin-input"
            placeholder="0.00"
          />
        </div>
      )}

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
          {saving
            ? pendingFilesRef.current.length > 0 ? "Subiendo imágenes..." : "Guardando..."
            : product ? "Actualizar producto" : "Crear producto"}
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
