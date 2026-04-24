import HeroBanner from "@/components/HeroBanner";
import BenefitsBar from "@/components/BenefitsBar";
import FeaturedCollection from "@/components/FeaturedCollection";
import CategoryGrid from "@/components/CategoryGrid";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <BenefitsBar />
      <FeaturedCollection />
      <CategoryGrid />
    </>
  );
}
