import { FaqSection } from "@/components/web-pages/faq-section";
import { HomeAbout } from "@/components/web-pages/home-about";
import { HomeCta } from "@/components/web-pages/home-cta";
import { HomeFacts } from "@/components/web-pages/home-facts";
import { HomeHero } from "@/components/web-pages/home-hero";
import { HomeProcess } from "@/components/web-pages/home-process";
import { HomePros } from "@/components/web-pages/home-pros";
import { HomeServices } from "@/components/web-pages/home-services";
import { HomeTestimonials } from "@/components/web-pages/home-testimonials";
import { HomeWhyChoose } from "@/components/web-pages/home-why-choose";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeServices />
      <HomeProcess />
      <HomeWhyChoose />
      <HomeFacts />
      <HomePros />
      <HomeTestimonials />
      <FaqSection />
      <HomeCta />
    </>
  );
}
