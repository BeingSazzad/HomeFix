import { PageBanner } from "@/components/layout/page-banner";
import { FaqSection } from "@/components/web-pages/faq-section";
import { photos } from "@/lib/media";

export default function FaqPage() {
  return (
    <>
      <PageBanner eyebrow="Help" title="FAQ" image={photos.banners.how} />
      <FaqSection
        title="Common questions"
        description="Find answers to common questions about booking, quoting, and verified trade specialists."
        className="bg-white"
      />
    </>
  );
}
