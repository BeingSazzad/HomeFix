import { PageBanner } from "@/components/layout/page-banner";
import { ServicesCatalog } from "@/components/web-pages/services-catalog";
import { photos } from "@/lib/media";

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Services"
        title="Our services"
        description="Nine trades. Browse free — no account needed."
        image={photos.banners.pros}
      />
      <ServicesCatalog />
    </>
  );
}
