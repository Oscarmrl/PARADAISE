import { getProducts, getCategories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const { q, categoria } = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts({ search: q, categorySlug: categoria }),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-[--font-display] text-4xl md:text-5xl font-light text-[--color-charcoal] mb-2">
          {q ? `Resultados para "${q}"` : "Todas las piezas"}
        </h1>
        <p className="text-sm text-[--color-sand]">{products.length} productos</p>
      </div>

      {/* Category filters */}
      <div className="flex gap-3 flex-wrap mb-10">
        <Link
          href="/productos"
          className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
            !categoria
              ? "bg-[--color-charcoal] text-white border-[--color-charcoal]"
              : "border-[--color-sand] text-[--color-sand] hover:border-[--color-charcoal] hover:text-[--color-charcoal]"
          }`}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/productos?categoria=${cat.slug}${q ? `&q=${q}` : ""}`}
            className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors ${
              categoria === cat.slug
                ? "bg-[--color-charcoal] text-white border-[--color-charcoal]"
                : "border-[--color-sand] text-[--color-sand] hover:border-[--color-charcoal] hover:text-[--color-charcoal]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-[--color-sand] text-lg font-[--font-display]">
            No se encontraron productos
          </p>
          <Link href="/productos" className="text-xs tracking-widest uppercase underline mt-4 inline-block">
            Ver todo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
