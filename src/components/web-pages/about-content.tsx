import { BadgeDollarSign, CalendarDays, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatRow } from "@/components/ui/stat-row";
import { PageBanner } from "@/components/layout/page-banner";
import { HomeCta } from "@/components/web-pages/home-cta";
import { photos } from "@/lib/media";

const checks = [
  "Homeowners browse free and never pay LocalHomeFix for the repair",
  "Professionals apply, finish screening, then wait for administrator review",
  "Phone and email unlock only after approval plus an active trial or membership",
  "Scope, schedule, contract, and payment stay between homeowner and pro",
];

const stats = [
  { value: "$0", label: "Homeowner fee to LocalHomeFix", icon: BadgeDollarSign },
  { value: "$19.99", label: "Pro membership per month", icon: CreditCard },
  { value: "3 mo", label: "Free for pros after approval", icon: CalendarDays },
];

const roles = [
  {
    title: "We organize the job. Pros do the work.",
    text: "LocalHomeFix keeps requests, quotes, messages, and reviews in one place. We are not the employer, agent, or insurer of either party.",
    image: photos.services.plumbing,
  },
  {
    title: "Homeowners: free to post and compare",
    text: "Describe the work, compare quotes, and keep the conversation on one request. You pay the professional directly — not a platform project fee.",
    image: photos.services.electrical,
  },
  {
    title: "Professionals: one membership for access",
    text: "After review, membership is $19.99 a month with three free months. Screening and marketplace approval are separate decisions.",
    image: photos.hero,
  },
];

export function AboutContent() {
  return (
    <>
      <PageBanner
        eyebrow="About"
        title="LocalHomeFix Inc."
        description="A marketplace where homeowners post jobs, reviewed pros send quotes, and payment stays between both sides."
        image={photos.banners.about}
      />

      <section className="bg-white py-16 md:py-20">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="The company"
              title="One place for the request — not the repair bill"
              description="We help homeowners and local pros find each other. We do not take the project payment."
            />
            <ul className="mt-8 space-y-4">
              {checks.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-smoke text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[16px] leading-7 text-copy">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/how-it-works">How it works</Button>
            </div>
          </div>
          <div className="relative min-h-[420px]">
            <div
              className="h-[380px] overflow-hidden rounded-[20px] bg-cover bg-center md:h-[460px]"
              style={{ backgroundImage: `url(${photos.trust})` }}
            />
            <div
              className="absolute -bottom-6 right-0 hidden h-48 w-44 overflow-hidden rounded-[20px] border-8 border-white bg-cover bg-center lg:block"
              style={{ backgroundImage: `url(${photos.trustAlt})` }}
            />
            <div className="absolute left-5 top-5 rounded-[10px] bg-primary px-5 py-4 text-white">
              <p className="font-display text-[36px] font-bold leading-none text-white">$0</p>
              <p className="mt-1 text-sm font-semibold text-white">homeowner project fee</p>
            </div>
          </div>
        </div>
        <div className="container-site mt-16">
          <StatRow items={stats} />
        </div>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="container-site">
          <SectionHeading
            align="center"
            eyebrow="Who uses it"
            title="Homeowners, professionals, and the marketplace"
            description="Each side has a clear role. LocalHomeFix connects them without selling repair packages."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {roles.map((role) => (
              <article key={role.title} className="overflow-hidden rounded-[20px] bg-white soft-shadow">
                <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${role.image})` }} />
                <div className="p-6">
                  <h3 className="text-[20px]">{role.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-copy">{role.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HomeCta />
    </>
  );
}
