import { getProductById } from "@/lib/products";
import { notFound } from "next/navigation";
import AddToCartSection from "./AddToCartSection";
import Image from "next/image";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetallePage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="space-y-3">
          {product.images.map((img, i) => (
            <div key={i} className="relative aspect-[3/4] bg-[--color-beige] overflow-hidden">
              <Image
                src={img}
                alt={`${product.name} ${i + 1}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="md:sticky md:top-24 self-start space-y-6">
          <div>
            <p className="text-xs tracking-widest uppercase text-[--color-sand] mb-2">
              {product.category_name}
            </p>
            <h1 className="font-[--font-display] text-4xl font-light text-[--color-charcoal]">
              {product.name}
            </h1>
            <p className="text-2xl mt-3 text-[--color-charcoal]">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          {product.description && (
            <p className="text-sm text-[--color-charcoal]/70 leading-relaxed">
              {product.description}
            </p>
          )}

          <AddToCartSection product={product} />
        </div>
      </div>
    </div>
  );
}
