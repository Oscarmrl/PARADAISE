import Image from "next/image";
import Link from "next/link";
import { getSetting } from "@/lib/settings";

const DEFAULT_HERO = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=85&auto=format&fit=crop";

export default async function HeroBanner() {
  const heroImage = await getSetting("hero_image") ?? DEFAULT_HERO;

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] overflow-hidden">
      <Image
        src={heroImage}
        alt="Nueva Colección PARADISE"
        fill
        priority
        className="object-cover object-top"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

      <div className="relative h-full flex flex-col justify-center px-12 md:px-24 max-w-3xl">
        <p className="text-white/80 text-xs tracking-[0.4em] uppercase mb-4">
          Nueva Temporada
        </p>
        <h1 className="text-white text-5xl md:text-7xl font-light leading-tight mb-8">
          Nueva Colección<br />Verano
        </h1>
        <Link href="/productos" className="btn-hero w-fit">
          Ver Colección
        </Link>
      </div>

      <div className="absolute bottom-8 right-8 text-white/60 text-xs tracking-widest">
        01 —
      </div>
    </section>
  );
}
