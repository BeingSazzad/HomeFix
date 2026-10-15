import { PageBanner } from "@/components/layout/page-banner";
import { LegalSections } from "@/components/web-pages/legal-sections";
import { photos } from "@/lib/media";

const sections = [
  {
    title: "Information we collect",
    body: "Account details, requests, quotes, messages, reviews, provider credentials, optional location, and device or security data.",
  },
  {
    title: "How we use it",
    body: "To operate accounts and projects, match homeowners and providers, prevent fraud, and verify eligibility.",
  },
  {
    title: "Screening",
    body: "Checkr collects screening identifiers on its own site. LocalHomeFix keeps normalized state and audit records, not report contents.",
  },
  {
    title: "Sharing",
    body: "We share information as needed with the other party on a project, payment and identity vendors, and authorities when required. Personal information is not sold.",
  },
  {
    title: "Your choices",
    body: "Update account information, control optional location access, and request access or deletion where applicable.",
  },
  {
    title: "Children",
    body: "The service is not directed to children under 18.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageBanner
        align="center"
        eyebrow="Legal"
        title="Privacy Policy"
        description="Effective September 10, 2026. How LocalHomeFix collects, uses, and shares information on the marketplace."
        image={photos.banners.legal}
      />
      <LegalSections sections={sections} />
    </>
  );
}
