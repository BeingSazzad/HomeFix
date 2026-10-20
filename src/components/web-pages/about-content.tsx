import { BadgeDollarSign, CalendarDays, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatRow } from "@/components/ui/stat-row";
import { PageBanner } from "@/components/layout/page-banner";
import { HomeCta } from "@/components/web-pages/home-cta";
import { photos } from "@/lib/media";

const checks = [
  {
    title: "Free request & quote comparison",
    desc: "Browse profiles, post requests, and compare bids without platform fees",
  },
  {
    title: "Verified credentials & licensing",
    desc: "Active trade licenses and identity clearance confirmed before quoting",
  },
  {
    title: "Strict privacy & no spam calls",
    desc: "Your phone number is protected; contractors message through your request",
  },
  {
    title: "Direct contractor payment",
    desc: "Pay your technician for the agreed repair directly with zero middleman markup",
  },
];

const stats = [
  { value: "$0", label: "Extra platform markup", icon: BadgeDollarSign },
  { value: "$19.99", label: "Flat pro membership / mo", icon: CreditCard },
  { value: "3 mo", label: "Free trial for approved pros", icon: CalendarDays },
];

const roles = [
  {
    title: "Our Role: Match & Protect",
    text: "We organize repair requests, verify contractor licenses, and keep bids structured in one private dashboard.",
    image: photos.services.plumbing,
  },
  {
    title: "For Homeowners",
    text: "Post your repair in under 2 minutes, compare quotes side-by-side, and pay your contractor directly upon completion.",
    image: photos.services.electrical,
  },
  {
    title: "For Independent Pros",
    text: "Win local repair jobs without paying per-lead fees. Keep 100% of your earnings with zero job commissions.",
    image: photos.hero,
  },
];

export function AboutContent() {
  return (
    <>
      <PageBanner
        title="About LocalHomeFix"
        description="Direct connection to vetted local trade pros. Zero middleman markup."
        image={photos.banners.about}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      <section className="bg-white py-12 md:py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Our Mission"
              title="Zero middleman markups. 100% direct communication."
              description="We believe homeowners deserve competitive quotes without aggressive sales calls, and contractors should keep every dollar they earn."
            />
            <ul className="mt-6 space-y-3.5">
              {checks.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-smoke text-primary">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[14.5px] font-semibold leading-tight text-title">
                      {item.title}
                    </p>
                    <p className="mt-0.5 font-sans text-[13px] leading-snug text-[#757575]">
                      {item.desc}
                    </p>
                  </div>
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
            <div className="absolute left-5 top-5 rounded-[12px] bg-primary px-4 py-2.5 text-white shadow-md">
              <p className="font-display text-[26px] font-bold leading-none text-white">$0</p>
              <p className="mt-1 text-xs font-semibold text-white/90">Platform markup</p>
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
            title="A marketplace built for both sides"
            description="Clear expectations, transparent pricing, and zero middleman markups."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {roles.map((role) => (
              <article key={role.title} className="overflow-hidden rounded-[20px] bg-white soft-shadow">
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${role.image})` }} />
                <div className="p-5">
                  <h3 className="text-[18px] font-medium text-title">{role.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#757575]">{role.text}</p>
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
