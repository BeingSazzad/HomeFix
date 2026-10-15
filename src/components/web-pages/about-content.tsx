import { BadgeDollarSign, CalendarDays, Check, CreditCard, FileText, Handshake, MapPin, MessagesSquare, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatRow } from "@/components/ui/stat-row";
import { PageBanner } from "@/components/layout/page-banner";
import { HomeCta } from "@/components/web-pages/home-cta";
import { photos } from "@/lib/media";

const checks = [
  "Homeowners browse without an account and pay LocalHomeFix nothing",
  "Professionals apply, finish screening, then wait for administrator clearance",
  "Contact is shared only after clearance and an active trial or subscription",
  "Scope, contract, schedule, and payment stay between the two sides",
];

const stats = [
  { value: "$0", label: "Homeowner project fee", icon: BadgeDollarSign },
  { value: "9", label: "Catalog trades", icon: Wrench },
  { value: "$19.99", label: "Membership / month", icon: CreditCard },
  { value: "3", label: "Free months after approval", icon: CalendarDays },
];

const roles = [
  {
    title: "A marketplace, not a contractor",
    text: "LocalHomeFix organizes requests, quotes, messages, and completed-job reviews. It is not the employer, agent, or insurer of either party.",
    image: photos.services.plumbing,
  },
  {
    title: "Homeowners stay off the platform bill",
    text: "Describe the work, compare quotes, and keep the thread on one request. The repair payment is agreed with the professional.",
    image: photos.services.electrical,
  },
  {
    title: "Professionals pay for access",
    text: "After clearance, membership is $19.99 a month with three free months. Screening and marketplace clearance are separate decisions.",
    image: photos.hero,
  },
];

const steps = [
  { n: "01", icon: FileText, title: "Explain the job", text: "Share the details that help a professional understand the work." },
  { n: "02", icon: MapPin, title: "See who is cleared", text: "Public profiles are limited to providers who finished administrator review." },
  { n: "03", icon: MessagesSquare, title: "Compare with context", text: "Quotes, messages, and the completed-job review stay on the same request." },
  { n: "04", icon: Handshake, title: "Agree directly", text: "You set scope, schedule, contract, and payment with the professional." },
];

export function AboutContent() {
  return (
    <>
      <PageBanner
        eyebrow="About"
        title="LocalHomeFix Inc."
        description="A marketplace for homeowner requests, provider quotes, project messages, and completed-job reviews."
        image={photos.banners.about}
      />

      <section className="bg-white py-16 md:py-20">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="The company" title="One record of the work" />
            <ul className="mt-8 space-y-4">
              {checks.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-smoke text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[15px] leading-7 text-copy">{item}</span>
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
              <p className="font-display text-[34px] font-bold leading-none text-white">$0</p>
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
          <SectionHeading align="center" eyebrow="Who uses it" title="Three sides of the same request" />
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

      <section className="bg-white py-16 md:py-20">
        <div className="container-site">
          <SectionHeading align="center" eyebrow="The flow" title="How a request moves" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => (
              <article key={step.n} className="rounded-[14px] bg-smoke p-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-primary">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-bold text-primary">{step.n}</span>
                </div>
                <h3 className="mt-4 text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-copy">{step.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/signup">Create a request</Button>
          </div>
        </div>
      </section>

      <HomeCta />
    </>
  );
}
