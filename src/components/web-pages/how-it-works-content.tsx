"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageBanner } from "@/components/layout/page-banner";
import { FaqSection } from "@/components/web-pages/faq-section";
import { roleFeatures } from "@/lib/product-model";
import { photos } from "@/lib/media";
import { cn } from "@/lib/cn";

type TabKey = "homeowner" | "pro";

const tabs: { key: TabKey; label: string }[] = [
  { key: "homeowner", label: "Homeowners" },
  { key: "pro", label: "Professionals" },
];

const journeys: Record<
  TabKey,
  {
    eyebrow: string;
    title: string;
    summary: string;
    steps: { title: string; text: string }[];
    cta: { href: string; label: string };
    secondary?: { href: string; label: string };
  }
> = {
  homeowner: {
    eyebrow: "Free account",
    title: "From problem to hire",
    summary: "Browse free. Sign up only to post. You pay the pro directly — never LocalHomeFix for the repair.",
    steps: [
      {
        title: "Post the request",
        text: "Describe the work, add photos if you have them, and set timing and budget.",
      },
      {
        title: "Get quotes from reviewed pros",
        text: "Pros who serve your ZIP and finished admin review can send quotes on your request.",
      },
      {
        title: "Compare on one thread",
        text: "Quotes and messages stay on the same job. Cleared members can unlock contact to discuss details.",
      },
      {
        title: "Hire, pay the pro, leave a review",
        text: "Agree scope and payment with the pro. After the work, review them on that same request.",
      },
    ],
    cta: { href: "/signup?next=%2Faccount%2Fpost-job", label: "Create free account" },
    secondary: { href: "/browse-pros", label: "Browse pros first" },
  },
  pro: {
    eyebrow: "$19.99 / month after 3 free months",
    title: "Apply, get reviewed, then quote",
    summary: "One membership for marketplace access — not repair packages. Contact unlocks only with clearance plus an active trial.",
    steps: [
      {
        title: "Apply",
        text: "Business details, service area, insurance confirmation, and Checkr screening consent.",
      },
      {
        title: "Get reviewed",
        text: "An administrator reviews credentials before you appear in public search or see the job board.",
      },
      {
        title: "Start membership",
        text: "Three free months after approval, then $19.99 a month. Pause or cancel anytime.",
      },
      {
        title: "Quote and work",
        text: "Open matched jobs, send a quote, unlock homeowner contact, and settle payment with the homeowner.",
      },
    ],
    cta: { href: "/pro-register", label: "Apply as a pro" },
    secondary: { href: "/pricing", label: "See membership" },
  },
};

export function HowItWorksContent() {
  const [tab, setTab] = useState<TabKey>("homeowner");
  const journey = journeys[tab];
  const limits = roleFeatures[tab];

  return (
    <div>
      <PageBanner
        eyebrow="How it works"
        title="One clear path for each role"
        description="Pick Homeowner or Professional. LocalHomeFix organizes the request — it never takes the repair payment."
        image={photos.banners.how}
      />

      <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
        <div className="container-site max-w-3xl">
          <div
            role="tablist"
            aria-label="Choose your role"
            className="grid grid-cols-2 overflow-hidden rounded-[10px] border border-line bg-white"
          >
            {tabs.map((item) => {
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.key)}
                  className={cn(
                    "min-h-[52px] font-display text-sm font-bold transition-colors",
                    active ? "bg-primary text-white" : "bg-white text-title hover:text-primary",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div role="tabpanel" className="mt-10">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.16em] text-primary">
              {journey.eyebrow}
            </p>
            <h2 className="mt-3 text-[32px] leading-tight md:text-[40px]">{journey.title}</h2>
            <p className="mt-3 text-[16px] leading-7 text-copy">{journey.summary}</p>

            <ol className="mt-10 space-y-5">
              {journey.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 pt-1">
                    <h3 className="text-[18px]">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-copy">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 text-sm text-copy">
              <span className="font-semibold text-title">Lands on: </span>
              {limits.landsOn}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={journey.cta.href}>{journey.cta.label}</Button>
              {journey.secondary ? (
                <Button href={journey.secondary.href} variant="ghost">
                  {journey.secondary.label}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <FaqSection />
    </div>
  );
}
