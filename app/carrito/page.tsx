"use client";

import { useCartStore } from "@/store/cart";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();

  const whatsappUrl = buildWhatsAppUrl(
    items.map((i) => ({
      name: i.name,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
      price: i.price,
    }))
  );

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="font-[--font-display] text-3xl sm:text-4xl font-light text-[--color-charcoal] mb-4">
          Tu carrito está vacío
        </h1>
        <p className="text-[--color-sand] text-sm mb-8">
          Explora nuestra colección y agrega las piezas que te enamoren.
        </p>
        <Link
          href="/productos"
          className="inline-block bg-[--fg] text-[--bg] text-xs tracking-widest uppercase px-10 py-3 hover:opacity-70 transition-opacity"
        >
          Ver colección
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-[--font-display] text-3xl sm:text-4xl font-light text-[--color-charcoal] mb-6 sm:mb-10">
        Tu Carrito
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-5">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="flex gap-3 sm:gap-5 pb-5 border-b border-[--color-beige-dark]"
            >
              {/* Imagen */}
              <Link
                href={`/productos/${item.productId}`}
                className="relative w-20 h-28 sm:w-28 sm:h-40 flex-shrink-0 bg-[--color-beige] overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 80px, 112px"
                />
              </Link>

              {/* Contenido */}
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                {/* Nombre + precio total */}
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/productos/${item.productId}`}
                    className="font-[--font-display] text-base sm:text-xl font-light hover:opacity-70 transition-opacity leading-tight min-w-0"
                    style={{ color: "var(--fg)" }}
                  >
                    {item.name}
                  </Link>
                  <span className="text-sm font-medium flex-shrink-0" style={{ color: "var(--fg)" }}>
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Color y talla */}
                <p className="text-xs tracking-wide truncate" style={{ color: "var(--fg-muted)" }}>
                  {item.color} · {item.size}
                </p>

                {/* Precio unitario */}
                <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                  ${Number(item.price).toFixed(2)} c/u
                </p>

                {/* Controles cantidad + eliminar */}
                <div className="flex items-center gap-3 mt-auto pt-1">
                  <div className="flex items-center border border-[--color-beige-dark]">
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-[--color-beige] transition-colors text-sm"
                      style={{ color: "var(--fg)" }}
                    >
                      −
                    </button>
                    <span className="w-7 sm:w-8 text-center text-xs sm:text-sm" style={{ color: "var(--fg)" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-[--color-beige] transition-colors text-sm"
                      style={{ color: "var(--fg)" }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.color, item.size)}
                    className="text-xs hover:opacity-100 transition-opacity"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-xs tracking-widest uppercase hover:opacity-100 transition-opacity"
            style={{ color: "var(--fg-muted)" }}
          >
            Vaciar carrito
          </button>
        </div>

        {/* Summary */}
        <div
          className="p-5 sm:p-6 h-fit space-y-4"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <h2 className="font-[--font-display] text-2xl font-light" style={{ color: "var(--fg)" }}>
            Resumen
          </h2>
          <div className="flex justify-between text-sm py-3" style={{ borderTop: "1px solid var(--border)", color: "var(--fg)" }}>
            <span style={{ color: "var(--fg-muted)" }}>Subtotal</span>
            <span>${totalPrice().toFixed(2)}</span>
          </div>
          <div
            className="flex justify-between text-sm font-medium py-3"
            style={{ borderTop: "1px solid var(--border)", color: "var(--fg)" }}
          >
            <span>Total</span>
            <span>${totalPrice().toFixed(2)}</span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={clearCart}
            className="block w-full text-center text-white text-xs tracking-widest uppercase py-4 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#4a9e6b" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.556 4.112 1.528 5.832L.057 23.617a.5.5 0 0 0 .609.61l5.912-1.547A11.956 11.956 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.537-5.209-1.468l-.374-.223-3.867 1.012 1.012-3.789-.245-.39A9.963 9.963 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Enviar pedido por WhatsApp
            </span>
          </a>

          <p className="text-xs text-center leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            Se abrirá WhatsApp con el resumen de tu pedido. Un asesor te confirmará disponibilidad y método de pago.
          </p>
        </div>
      </div>
    </div>
  );
}
