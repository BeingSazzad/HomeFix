import { PageBanner } from "@/components/layout/page-banner";
import { PricingPlans } from "@/components/web-pages/pricing-plans";
import { photos } from "@/lib/media";

export default function PublicPricingPage() {
  return (
    <>
      <PageBanner
        eyebrow="Pricing"
        title="Homeowner free · Pro $19.99/mo"
        description="Marketplace access only. We never take the repair payment."
        image={photos.banners.pricing}
      />
      <PricingPlans eyebrow="Plans" title="Choose your path" />
    </>
  );
}
