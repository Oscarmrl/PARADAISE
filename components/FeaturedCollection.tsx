import Link from "next/link";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/products";

export default async function FeaturedCollection() {
  const products = await getProducts({ featured: true, limit: 3 });

  if (products.length === 0) return null;

  return (
    <section className="py-16" style={{ backgroundColor: "var(--bg)" }}>
      <div className="text-center mb-10">
        <h2
          className="font-[--font-display] text-4xl font-light mb-2"
          style={{ color: "var(--fg)" }}
        >
          Nueva Colección
        </h2>
        <p className="text-xs tracking-wide" style={{ color: "var(--fg-muted)" }}>
          Crea tu look especial con nuestra nueva colección primavera-verano
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <Link href="/productos" className="btn-solid">
          Ver Colección
        </Link>
      </div>
    </section>
  );
}
