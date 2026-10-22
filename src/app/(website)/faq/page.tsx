import { PageBanner } from "@/components/layout/page-banner";
import { FaqSection } from "@/components/web-pages/faq-section";
import { photos } from "@/lib/media";

export default function FaqPage() {
  return (
    <>
      <PageBanner
        eyebrow="Help & FAQ"
        title="Frequently Asked Questions"
        description="Find clear answers to common questions about booking, quoting, payments, and contractor verification."
        image={photos.banners.how}
      />
      <FaqSection
        title="Common questions"
        description="Find answers to common questions about booking, quoting, and verified trade specialists."
        className="bg-white"
      />
    </>
  );
}
