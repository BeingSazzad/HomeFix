import { HomeCta } from "@/components/web-pages/home-cta";
import { HomeFacts } from "@/components/web-pages/home-facts";
import { HomeHero } from "@/components/web-pages/home-hero";
import { HomeProcess } from "@/components/web-pages/home-process";
import { HomePros } from "@/components/web-pages/home-pros";
import { HomeServices } from "@/components/web-pages/home-services";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeServices />
      <HomeProcess />
      <HomeFacts />
      <HomePros />
      <HomeCta />
    </>
  );
}
