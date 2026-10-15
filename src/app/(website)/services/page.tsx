import { PageBanner } from "@/components/layout/page-banner";
import { ServicesCatalog } from "@/components/web-pages/services-catalog";
import { photos } from "@/lib/media";

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Services"
        title="Home services we connect you with"
        description="Nine trades. Browse reviewed local pros in each category — free to look around, no account required."
        image={photos.banners.pros}
      />
      <ServicesCatalog />
    </>
  );
}
