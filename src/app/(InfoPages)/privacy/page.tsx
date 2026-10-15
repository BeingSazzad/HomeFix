import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";

const sections = [
  ["Information we collect", "Account details, requests, quotes, messages, reviews, provider credentials, optional location, and device or security data."],
  ["How we use it", "To operate accounts and projects, match homeowners and providers, prevent fraud, and verify eligibility."],
  ["Screening", "Checkr collects screening identifiers on its own site. LocalHomeFix keeps normalized state and audit records, not report contents."],
  ["Sharing", "We share information as needed with the other party on a project, payment and identity vendors, and authorities when required. Personal information is not sold."],
  ["Your choices", "Update account information, control optional location access, and request access or deletion where applicable."],
  ["Children", "The service is not directed to children under 18."],
];

export default function PrivacyPage() {
  return (
    <>
      <PageBanner
        eyebrow="Legal"
        title="Privacy Policy"
        description="Effective September 10, 2026. How LocalHomeFix collects, uses, and shares information on the marketplace."
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
