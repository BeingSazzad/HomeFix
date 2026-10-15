"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageBanner } from "@/components/layout/page-banner";
import { FaqSection } from "@/components/web-pages/faq-section";
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
    summary: "Browse free. Sign up to post. Pay the pro directly.",
    steps: [
      { title: "Post the request", text: "Describe the work, ZIP, and timing." },
      { title: "Get quotes", text: "Reviewed pros in your area can reply." },
      { title: "Compare quotes", text: "Quotes and chat stay on the same job." },
      { title: "Hire and review", text: "Pay the pro directly, then leave a review." },
    ],
    cta: { href: "/signup?next=%2Faccount%2Fpost-job", label: "Create free account" },
    secondary: { href: "/browse-pros", label: "Browse pros first" },
  },
  pro: {
    eyebrow: "3 months free, then $19.99/mo",
    title: "Apply, then quote",
    summary: "Membership for job access — not repair packages.",
    steps: [
      { title: "Apply", text: "Business details, area, and screening consent." },
      { title: "Get reviewed", text: "Admin clearance before public search." },
      { title: "Start membership", text: "Three free months, then $19.99/mo." },
      { title: "Quote and work", text: "Quote leads, unlock contact, settle directly." },
    ],
    cta: { href: "/pro-register", label: "Apply as a pro" },
    secondary: { href: "/pricing", label: "See membership" },
  },
};

export function HowItWorksContent() {
  const [tab, setTab] = useState<TabKey>("homeowner");
  const journey = journeys[tab];

  return (
    <div>
      <PageBanner
        eyebrow="How it works"
        title="How it works"
        description="Pick your role. We never take the repair payment."
        image={photos.banners.how}
      />

      <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
        <div className="container-site">
          <div className="mx-auto max-w-xl">
            <div
              role="tablist"
              aria-label="Choose your role"
              className="grid grid-cols-2 overflow-hidden rounded-full border border-line bg-white p-1"
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
                      "min-h-[44px] rounded-full font-display text-sm font-bold transition-colors",
                      active ? "bg-primary text-white" : "bg-transparent text-title hover:text-primary",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div role="tabpanel" className="mx-auto mt-10 max-w-3xl text-center">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.16em] text-primary">
              {journey.eyebrow}
            </p>
            <h2 className="mt-2 text-[28px] leading-tight md:text-[36px]">{journey.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-6 text-copy">{journey.summary}</p>
          </div>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {journey.steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[16px] border border-line bg-white px-5 py-6 text-center"
              >
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary font-display text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-[17px] leading-snug">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-copy">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={journey.cta.href}>{journey.cta.label}</Button>
            {journey.secondary ? (
              <Button href={journey.secondary.href} variant="ghost">
                {journey.secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
      </section>
      <FaqSection className="bg-surface" />
    </div>
  );
}
