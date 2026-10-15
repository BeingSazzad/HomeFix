import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";

const sections = [
  ["Marketplace role", "LocalHomeFix provides a marketplace where homeowners describe projects and independent professionals offer services. It is not the employer, contractor, agent, or insurer of either party."],
  ["Accounts", "Provide accurate information and use the service only for lawful purposes. Provider claims are not verified until LocalHomeFix confirms them."],
  ["Projects, quotes, and payment", "Homeowners review terms and select a provider. Professionals own their quotes, permits, taxes, and workmanship. LocalHomeFix does not process project payments."],
  ["Background screening", "Provider participation may require a Checkr hosted screening. Do not send SSN, date of birth, government ID, or report contents to LocalHomeFix."],
  ["Acceptable use", "Do not misuse personal information, evade marketplace rules, impersonate others, or submit deceptive content."],
  ["Changes", "Material changes are posted with a new effective date. Questions go through the Contact page."],
];

export default function TermsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Legal"
        title="Terms of Service"
        description="Effective September 10, 2026. The marketplace organizes requests, quotes, and reviews. It does not employ either party or process project payments."
        image={photos.banners.legal}
      />
      <article className="container-site max-w-3xl py-14">
        <div className="space-y-6">
          {sections.map(([title, body]) => (
            <section key={title}>
              <h2 className="text-2xl">{title}</h2>
              <p className="mt-2 leading-7 text-copy">{body}</p>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
