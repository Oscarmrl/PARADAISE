import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

interface Props {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: Props) {
  const image =
    product.images?.[0] ??
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&auto=format&fit=crop";

  return (
    <Link href={`/productos/${product.id}`} className="group block">
      <div
        className={`relative overflow-hidden bg-[--color-beige] ${
          compact ? "aspect-[2/3]" : "aspect-[3/4]"
        }`}
      >
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes={compact ? "280px" : "(max-width: 768px) 50vw, 33vw"}

        />
        {product.is_sale && (
          <span className="absolute top-2 left-2 text-white text-[9px] tracking-widest uppercase px-2 py-0.5" style={{ backgroundColor: "#dc2626" }}>
            Oferta
          </span>
        )}
      </div>
      <div className={`mt-2 space-y-0.5 ${compact ? "text-center" : ""}`}>
        <h3
          className={`font-[--font-display] font-light text-[--color-charcoal] group-hover:opacity-60 transition-opacity ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          {product.name}
        </h3>
        {!compact && (
          <p className="text-xs text-[--color-sand] tracking-wide">
            {product.category_name ?? ""}
          </p>
        )}
        {product.is_sale && product.offer_price ? (
          <div className={`flex items-center gap-2 flex-wrap ${compact ? "justify-center" : ""}`}>
            <span className={`font-medium ${compact ? "text-xs" : "text-sm"}`} style={{ color: "#dc2626" }}>
              ${Number(product.offer_price).toFixed(2)}
            </span>
            <span className={`line-through ${compact ? "text-[10px]" : "text-xs"}`} style={{ color: "var(--fg-muted)" }}>
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
        ) : (
          <p className={`text-[--color-charcoal]/80 ${compact ? "text-xs" : "text-sm"}`}>
            ${Number(product.price).toFixed(2)}
          </p>
        )}
      </div>
    </Link>
  );
}
