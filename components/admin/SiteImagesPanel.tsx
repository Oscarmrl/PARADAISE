"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import toast from "react-hot-toast";
import { storage } from "@/lib/firebase";
import type { Category } from "@/lib/products";

interface Props {
  token: string;
  heroImage: string;
  categories: Category[];
  onUpdate: () => void;
}

async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

function ImageUploadRow({
  label,
  current,
  onSave,
}: {
  label: string;
  current: string;
  onSave: (url: string) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const path = label === "Banner principal" ? "productos/banner" : "productos/categorias";

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await toast.promise(
      (async () => {
        const url = await uploadFile(file, path);
        await onSave(url);
        // Eliminar imagen anterior de Storage si era de Firebase
        if (current?.includes("firebasestorage")) {
          try { await deleteObject(ref(storage, current)); } catch { /* ignorado */ }
        }
      })(),
      {
        loading: "Subiendo imagen...",
        success: "Imagen actualizada",
        error: "Error al subir imagen",
      }
    );
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="flex items-center gap-4 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
      {/* Thumbnail */}
      <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden rounded-sm" style={{ backgroundColor: "var(--beige)" }}>
        {current && (
          <Image src={current} alt={label} fill className="object-cover" sizes="96px" />
        )}
      </div>

      {/* Info + botón */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: "var(--fg)" }}>{label}</p>
        <p className="text-xs truncate mt-0.5" style={{ color: "var(--fg-muted)" }}>
          {current ? "Imagen cargada" : "Sin imagen"}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ position: "absolute", opacity: 0, width: "1px", height: "1px", pointerEvents: "none" }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="btn-outline text-xs px-4 py-2 flex-shrink-0 disabled:opacity-50"
      >
        {uploading ? "Subiendo..." : "Cambiar"}
      </button>
    </div>
  );
}

export default function SiteImagesPanel({ token, heroImage, categories, onUpdate }: Props) {
  async function saveSetting(key: string, value: string) {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) throw new Error("Error al guardar");
    onUpdate();
  }

  async function saveCategoryImage(id: number, url: string) {
    const res = await fetch(`/api/categorias?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ image_url: url }),
    });
    if (!res.ok) throw new Error("Error al guardar");
    onUpdate();
  }

  return (
    <div
      className="mb-8 rounded-sm p-5"
      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <h2 className="font-[--font-display] text-xl font-light mb-1" style={{ color: "var(--fg)" }}>
        Imágenes del sitio
      </h2>
      <p className="text-xs mb-5" style={{ color: "var(--fg-muted)" }}>
        Cambia el banner principal y las imágenes de cada categoría en el mosaico de inicio.
      </p>

      <ImageUploadRow
        label="Banner principal"
        current={heroImage}
        onSave={(url) => saveSetting("hero_image", url)}
      />

      {categories.map((cat) => (
        <ImageUploadRow
          key={cat.id}
          label={`Categoría: ${cat.name}`}
          current={cat.image_url ?? ""}
          onSave={(url) => saveCategoryImage(cat.id, url)}
        />
      ))}
    </div>
  );
}
