import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function OfertasPage() {
  const products = await getProducts({ onSale: true });

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--fg-muted)" }}>
          Descuentos exclusivos
        </p>
        <h1 className="font-[--font-display] text-4xl md:text-5xl font-light tracking-wide" style={{ color: "var(--fg)" }}>
          Ofertas
        </h1>
        <div className="mx-auto mt-4 h-px w-16" style={{ backgroundColor: "var(--border)" }} />
        {products.length > 0 && (
          <p className="mt-4 text-sm" style={{ color: "var(--fg-muted)" }}>
            {products.length} {products.length === 1 ? "producto en oferta" : "productos en oferta"}
          </p>
        )}
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-[--font-display] text-2xl font-light mb-3" style={{ color: "var(--fg-muted)" }}>
            No hay ofertas disponibles
          </p>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Vuelve pronto, estamos preparando descuentos especiales.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
