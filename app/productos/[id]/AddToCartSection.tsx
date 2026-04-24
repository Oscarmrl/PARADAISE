"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
}

export default function AddToCartSection({ product }: Props) {
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [size, setSize]   = useState(product.sizes[0]  ?? "");
  const [qty, setQty]     = useState(1);
  const { addItem, openCart } = useCartStore();

  const image = product.images?.[0] ?? "";

  function handleAddToCart() {
    addItem({ productId: product.id, name: product.name, price: Number(product.price), image, color, size, quantity: qty });
    openCart();
  }

  const whatsappUrl = buildWhatsAppUrl([{ name: product.name, color, size, quantity: qty, price: Number(product.price) }]);

  /* Estilos para botones de selector */
  const selectedStyle  = { backgroundColor: "var(--fg)", color: "var(--bg)", borderColor: "var(--fg)" } as const;
  const idleStyle      = { borderColor: "var(--border)", color: "var(--fg)" } as const;
  const hoverClass     = "transition-opacity hover:opacity-70";

  return (
    <div className="space-y-5">

      {/* Color selector */}
      {product.colors.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--fg-muted)" }}>
            Color: <span style={{ color: "var(--fg)", fontWeight: 500 }}>{color}</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`text-xs px-3 py-2 border ${hoverClass}`}
                style={color === c ? selectedStyle : idleStyle}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      {product.sizes.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--fg-muted)" }}>
            Talla: <span style={{ color: "var(--fg)", fontWeight: 500 }}>{size}</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`text-xs w-12 h-10 border ${hoverClass}`}
                style={size === s ? selectedStyle : idleStyle}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <p className="text-xs tracking-widest uppercase" style={{ color: "var(--fg-muted)" }}>
          Cantidad
        </p>
        <div className="flex items-center border" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-lg transition-opacity hover:opacity-50"
            style={{ color: "var(--fg)" }}
          >
            −
          </button>
          <span className="w-10 text-center text-sm" style={{ color: "var(--fg)" }}>{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-10 flex items-center justify-center text-lg transition-opacity hover:opacity-50"
            style={{ color: "var(--fg)" }}
          >
            +
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleAddToCart}
          className="btn-solid w-full py-4 text-center"
        >
          Agregar al carrito
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center text-xs tracking-widest uppercase py-4 transition-opacity hover:opacity-85 text-white"
          style={{ backgroundColor: "#4a9e6b" }}
        >
          Comprar por WhatsApp
        </a>
      </div>
    </div>
  );
}
