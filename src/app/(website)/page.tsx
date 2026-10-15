import { HomeCta } from "@/components/web-pages/home-cta";
import { FaqSection } from "@/components/web-pages/faq-section";
import { HomeHero } from "@/components/web-pages/home-hero";
import { PricingPlans } from "@/components/web-pages/pricing-plans";
import { HomeJobs } from "@/components/web-pages/home-jobs";
import { HomeProcess } from "@/components/web-pages/home-process";
import { HomePros } from "@/components/web-pages/home-pros";
import { HomeServices } from "@/components/web-pages/home-services";
import { HomeTrust } from "@/components/web-pages/home-trust";
import { HomeWhy } from "@/components/web-pages/home-why";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeWhy />
      <HomeTrust />
      <HomeProcess />
      <HomePros />
      <PricingPlans />
      <FaqSection />
      <HomeJobs />
      <HomeCta />
    </>
  );
}
