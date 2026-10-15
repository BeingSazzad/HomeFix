import { PageBanner } from "@/components/layout/page-banner";
import { FaqSection } from "@/components/web-pages/faq-section";
import { photos } from "@/lib/media";

export default function FaqPage() {
  return (
    <>
      <PageBanner eyebrow="Help" title="FAQ" image={photos.banners.how} />
      <FaqSection
        title="Common questions"
        description="Still unsure? Talk to our team — no account needed to write us."
        className="bg-white"
      />
    </>
  );
}
