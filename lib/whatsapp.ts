export interface WhatsAppItem {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export function buildWhatsAppUrl(items: WhatsAppItem[]): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  const lines = items.map(
    (item) =>
      `• ${item.name} — Color: ${item.color}, Talla: ${item.size}, Cant: ${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`
  );

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const message = [
    "Hola PARADISE! 🌸 Me gustaría ordenar:",
    "",
    ...lines,
    "",
    `Total: $${total.toFixed(2)}`,
    "",
    "¿Está disponible?",
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
