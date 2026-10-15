import { PageBanner } from "@/components/layout/page-banner";
import { FaqSection } from "@/components/web-pages/faq-section";
import { PricingPlans } from "@/components/web-pages/pricing-plans";
import { photos } from "@/lib/media";

export default function PublicPricingPage() {
  return (
    <>
      <PageBanner
        eyebrow="Pricing"
        title="Access plans, not repair packages"
        description="LocalHomeFix charges professionals for marketplace access only. Homeowners never pay a platform project fee."
        image={photos.banners.pricing}
      />
      <PricingPlans eyebrow="Plans" title="Choose how you use LocalHomeFix" />
      <FaqSection title="Pricing questions" />
    </>
  );
}
