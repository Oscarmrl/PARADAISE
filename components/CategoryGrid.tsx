import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/products";

export default async function CategoryGrid() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  // Orden DB (alfabético): Accesorios[0], Abrigos[1], Blusas[2], Vestidos[3]
  const c0 = categories[3]; // Vestidos   → columna izquierda alta
  const c1 = categories[0]; // Accesorios → arriba centro
  const c2 = categories[2]; // Blusas     → arriba derecha
  const c3 = categories[1]; // Abrigos    → franja inferior ancha

  return (
    <section className="w-full">
      {/*
        Layout mosaico (igual al reference):
        | Vestidos (tall left)  | Abrigos (top-right)  | Blusas (top-far-right) |
        | Vestidos (tall left)  | Accesorios (bottom, spans 2 cols)            |
      */}
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "340px 280px",
        }}
      >
        {/* Left — tall spanning 2 rows */}
        {c0 && (
          <Link
            href={`/productos?categoria=${c0.slug}`}
            className="group relative overflow-hidden bg-[--color-beige]"
            style={{ gridColumn: "1", gridRow: "1 / 3" }}
          >
            {c0.image_url && (
              <Image
                src={c0.image_url}
                alt={c0.name}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="33vw"
              />
            )}
            <span className="absolute top-4 left-4 text-white text-[10px] tracking-[0.2em] uppercase">
              {c0.name}
            </span>
          </Link>
        )}

        {/* Top-middle */}
        {c1 && (
          <Link
            href={`/productos?categoria=${c1.slug}`}
            className="group relative overflow-hidden bg-[--color-beige]"
            style={{ gridColumn: "2", gridRow: "1" }}
          >
            {c1.image_url && (
              <Image
                src={c1.image_url}
                alt={c1.name}
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                sizes="33vw"
              />
            )}
            <span className="absolute top-4 left-4 text-white text-[10px] tracking-[0.2em] uppercase">
              {c1.name}
            </span>
          </Link>
        )}

        {/* Top-right */}
        {c2 && (
          <Link
            href={`/productos?categoria=${c2.slug}`}
            className="group relative overflow-hidden bg-[--color-beige]"
            style={{ gridColumn: "3", gridRow: "1" }}
          >
            {c2.image_url && (
              <Image
                src={c2.image_url}
                alt={c2.name}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="33vw"
              />
            )}
            <span className="absolute top-4 left-4 text-white text-[10px] tracking-[0.2em] uppercase">
              {c2.name}
            </span>
          </Link>
        )}

        {/* Bottom — spans middle + right */}
        {c3 && (
          <Link
            href={`/productos?categoria=${c3.slug}`}
            className="group relative overflow-hidden bg-[--color-beige]"
            style={{ gridColumn: "2 / 4", gridRow: "2" }}
          >
            {c3.image_url && (
              <Image
                src={c3.image_url}
                alt={c3.name}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="66vw"
              />
            )}
            <span className="absolute top-4 left-4 text-white text-[10px] tracking-[0.2em] uppercase">
              {c3.name}
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
