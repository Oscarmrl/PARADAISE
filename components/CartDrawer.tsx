"use client";

import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { items, isOpen, closeCart, clearCart, removeItem, updateQuantity, totalPrice } = useCartStore();

  const whatsappUrl = buildWhatsAppUrl(
    items.map((i) => ({ name: i.name, color: i.color, size: i.size, quantity: i.quantity, price: i.price }))
  );

  return (
    <>
      {/* Clic fuera del drawer lo cierra, sin overlay visible */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={closeCart} />
      )}

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-sm z-50 shadow-2xl flex flex-col transition-transform duration-300"
        style={{
          backgroundColor: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="font-[--font-display] text-xl font-light tracking-wider" style={{ color: "var(--fg)" }}>
            Tu Carrito
          </h2>
          <button onClick={closeCart} className="hover:opacity-50 transition-opacity" style={{ color: "var(--fg)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {items.length === 0 ? (
            <p className="text-center text-sm mt-10" style={{ color: "var(--fg-muted)" }}>
              Tu carrito está vacío
            </p>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
                <div className="relative w-20 h-28 flex-shrink-0 overflow-hidden" style={{ backgroundColor: "var(--beige)" }}>
                  <Image src={item.image} alt={item.name} fill className="object-cover object-top" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--fg)" }}>{item.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
                    {item.color} · {item.size}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--fg)" }}>${Number(item.price).toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                      className="w-6 h-6 border flex items-center justify-center text-sm hover:opacity-60 transition-opacity"
                      style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                    >−</button>
                    <span className="text-sm" style={{ color: "var(--fg)" }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                      className="w-6 h-6 border flex items-center justify-center text-sm hover:opacity-60 transition-opacity"
                      style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                    >+</button>
                    <button
                      onClick={() => removeItem(item.productId, item.color, item.size)}
                      className="ml-auto text-xs hover:opacity-100 transition-opacity"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 space-y-4" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--fg-muted)" }}>Total</span>
              <span className="font-medium" style={{ color: "var(--fg)" }}>${totalPrice().toFixed(2)}</span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={clearCart}
              className="block w-full text-white text-center text-xs tracking-widest uppercase py-3 transition-opacity hover:opacity-85"
              style={{ backgroundColor: "#4a9e6b" }}
            >
              Enviar pedido por WhatsApp
            </a>
            <Link
              href="/carrito"
              onClick={closeCart}
              className="btn-outline block w-full text-center py-3"
            >
              Ver carrito completo
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
