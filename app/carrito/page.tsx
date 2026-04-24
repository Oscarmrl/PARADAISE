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
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="font-[--font-display] text-4xl font-light text-[--color-charcoal] mb-4">
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-[--font-display] text-4xl font-light text-[--color-charcoal] mb-10">
        Tu Carrito
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.color}-${item.size}`}
              className="flex gap-6 pb-6 border-b border-[--color-beige-dark]"
            >
              <Link href={`/productos/${item.productId}`} className="relative w-28 h-40 flex-shrink-0 bg-[--color-beige] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-top"
                  sizes="112px"
                />
              </Link>
              <div className="flex-1 space-y-2">
                <Link href={`/productos/${item.productId}`} className="font-[--font-display] text-xl font-light hover:opacity-70 transition-opacity">
                  {item.name}
                </Link>
                <p className="text-xs text-[--color-sand] tracking-wide">
                  Color: {item.color} · Talla: {item.size}
                </p>
                <p className="text-sm">${Number(item.price).toFixed(2)}</p>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center border border-[--color-beige-dark]">
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[--color-beige] transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[--color-beige] transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.color, item.size)}
                    className="text-xs text-[--color-sand] hover:text-[--color-charcoal] transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-xs text-[--color-sand] tracking-widest uppercase hover:text-[--color-charcoal] transition-colors"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Summary */}
        <div className="bg-[--surface] p-6 border border-[--color-beige-dark] h-fit space-y-4">
          <h2 className="font-[--font-display] text-2xl font-light">Resumen</h2>
          <div className="flex justify-between text-sm py-3 border-t border-[--color-beige-dark]">
            <span className="text-[--color-sand]">Subtotal</span>
            <span>${totalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium py-3 border-t border-[--color-beige-dark]">
            <span>Total</span>
            <span>${totalPrice().toFixed(2)}</span>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={clearCart}
            className="block w-full bg-[#4a9e6b] text-white text-center text-xs tracking-widest uppercase py-4 hover:bg-[#3d8a5c] transition-colors"
          >
            🟢 Enviar pedido por WhatsApp
          </a>

          <p className="text-xs text-[--color-sand] text-center leading-relaxed">
            Se abrirá WhatsApp con el resumen de tu pedido. Un asesor te confirmará disponibilidad y método de pago.
          </p>
        </div>
      </div>
    </div>
  );
}
