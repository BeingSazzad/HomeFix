import { BadgeDollarSign, CalendarDays, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatRow } from "@/components/ui/stat-row";
import { PageBanner } from "@/components/layout/page-banner";
import { HomeCta } from "@/components/web-pages/home-cta";
import { photos } from "@/lib/media";

const checks = [
  "Homeowners browse and post free — no project fee",
  "Pros apply, screen, then wait for admin review",
  "Contact unlocks only with clearance + membership",
  "Payment stays between homeowner and pro",
];

const stats = [
  { value: "$0", label: "Homeowner fee", icon: BadgeDollarSign },
  { value: "$19.99", label: "Pro membership / mo", icon: CreditCard },
  { value: "3 mo", label: "Free after approval", icon: CalendarDays },
];

const roles = [
  {
    title: "We organize the job",
    text: "Requests, quotes, and messages in one place. We are not the repair contractor.",
    image: photos.services.plumbing,
  },
  {
    title: "Homeowners",
    text: "Post free, compare quotes, pay the pro directly.",
    image: photos.services.electrical,
  },
  {
    title: "Professionals",
    text: "$19.99/mo after 3 free months. Screening and clearance are separate.",
    image: photos.hero,
  },
];

export function AboutContent() {
  return (
    <>
      <PageBanner
        eyebrow="About"
        title="About us"
        description="Homeowners post. Reviewed pros quote. You pay the pro directly."
        image={photos.banners.about}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="The company"
              title="We connect. You pay the pro."
              description="Requests and quotes in one place. No project fee from us."
            />
            <ul className="mt-6 space-y-3">
              {checks.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-smoke text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[15px] leading-6 text-copy">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button href="/how-it-works">How it works</Button>
            </div>
          </div>
          <div className="relative min-h-[360px]">
            <div
              className="h-[320px] overflow-hidden rounded-[20px] bg-cover bg-center md:h-[400px]"
              style={{ backgroundImage: `url(${photos.trust})` }}
            />
            <div
              className="absolute -bottom-6 right-0 hidden h-44 w-40 overflow-hidden rounded-[20px] border-8 border-white bg-cover bg-center lg:block"
              style={{ backgroundImage: `url(${photos.trustAlt})` }}
            />
            <div className="absolute left-5 top-5 rounded-[10px] bg-primary px-4 py-3 text-white">
              <p className="font-display text-[32px] font-bold leading-none text-white">$0</p>
              <p className="mt-1 text-sm font-semibold text-white">homeowner fee</p>
            </div>
          </div>
        </div>
        <div className="container-site mt-12">
          <StatRow items={stats} />
        </div>
      </section>

      <section className="bg-surface py-12 md:py-16">
        <div className="container-site">
          <SectionHeading
            align="center"
            eyebrow="Who uses it"
            title="Homeowners and professionals"
            description="Clear roles. No repair packages for sale."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {roles.map((role) => (
              <article key={role.title} className="overflow-hidden rounded-[20px] bg-white soft-shadow">
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${role.image})` }} />
                <div className="p-5">
                  <h3 className="text-[18px]">{role.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-copy">{role.text}</p>
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
