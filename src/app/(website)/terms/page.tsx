import { PageBanner } from "@/components/layout/page-banner";
import { LegalSections } from "@/components/web-pages/legal-sections";
import { photos } from "@/lib/media";

const sections = [
  {
    title: "Marketplace role",
    body: "LocalHomeFix provides a marketplace where homeowners describe projects and independent professionals offer services. It is not the employer, contractor, agent, or insurer of either party.",
  },
  {
    title: "Accounts",
    body: "Provide accurate information and use the service only for lawful purposes. Provider claims are not verified until LocalHomeFix confirms them.",
  },
  {
    title: "Projects, quotes, and payment",
    body: "Homeowners review terms and select a provider. Professionals own their quotes, permits, taxes, and workmanship. LocalHomeFix does not process project payments.",
  },
  {
    title: "Background screening",
    body: "Provider participation may require a Checkr hosted screening. Do not send SSN, date of birth, government ID, or report contents to LocalHomeFix.",
  },
  {
    title: "Acceptable use",
    body: "Do not misuse personal information, evade marketplace rules, impersonate others, or submit deceptive content.",
  },
  {
    title: "Changes",
    body: "Material changes are posted with a new effective date. Questions go through the Contact page.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageBanner eyebrow="Legal" title="Terms & Conditions" image={photos.banners.legal} />
      <LegalSections sections={sections} />
    </>
  );
}
