import { PageBanner } from "@/components/layout/page-banner";
import { PricingPlans } from "@/components/web-pages/pricing-plans";
import { photos } from "@/lib/media";

export default function PublicPricingPage() {
  return (
    <>
      <PageBanner
        eyebrow="Pricing"
        title="Simple pricing"
        description="Homeowners free. Pros $19.99/mo after 3 free months."
        image={photos.banners.pricing}
      />
      <PricingPlans eyebrow="Plans" title="Choose your path" />
    </>
  );
}
