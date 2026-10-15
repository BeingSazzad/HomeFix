"use client";

import { useState } from "react";
import {
  ClipboardList,
  FileCheck2,
  MessagesSquare,
  Search,
  ShieldCheck,
  UserPlus,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBanner } from "@/components/layout/page-banner";
import { ProcessGrid } from "@/components/ui/process-grid";
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
    steps: { n: string; title: string; text: string; icon: LucideIcon }[];
    cta: { href: string; label: string };
    secondary?: { href: string; label: string };
  }
> = {
  homeowner: {
    eyebrow: "Free account",
    title: "From problem to hire",
    summary: "Browse free. Sign up to post. Pay the pro directly.",
    steps: [
      {
        n: "01",
        title: "Post the request",
        text: "Describe the work, location, and timing.",
        icon: ClipboardList,
      },
      {
        n: "02",
        title: "Get quotes",
        text: "Reviewed pros in your area can reply.",
        icon: Search,
      },
      {
        n: "03",
        title: "Compare quotes",
        text: "Quotes and chat stay on the same job.",
        icon: MessagesSquare,
      },
      {
        n: "04",
        title: "Hire and review",
        text: "Pay the pro directly, then leave a review.",
        icon: Wallet,
      },
    ],
    cta: { href: "/signup?next=%2Faccount%2Fpost-job", label: "Create free account" },
    secondary: { href: "/browse-pros", label: "Browse pros first" },
  },
  pro: {
    eyebrow: "3 months free, then $19.99/mo",
    title: "Apply, then quote",
    summary: "Membership for job access — not repair packages.",
    steps: [
      {
        n: "01",
        title: "Apply",
        text: "Business details, area, and screening consent.",
        icon: UserPlus,
      },
      {
        n: "02",
        title: "Get reviewed",
        text: "Admin clearance before public search.",
        icon: ShieldCheck,
      },
      {
        n: "03",
        title: "Start membership",
        text: "Three free months, then $19.99/mo.",
        icon: FileCheck2,
      },
      {
        n: "04",
        title: "Quote and work",
        text: "Quote leads, unlock contact, settle directly.",
        icon: Wrench,
      },
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

      <section className="bg-white py-[var(--section-sm)] md:py-[var(--section)]">
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

          <div role="tabpanel" className="mt-8">
            <ProcessGrid
              badge={journey.eyebrow}
              title={journey.title}
              description={journey.summary}
              items={journey.steps}
              cta={{
                href: journey.cta.href,
                title: journey.cta.label,
                text: journey.secondary?.label
                  ? `Or ${journey.secondary.label.toLowerCase()}.`
                  : "Continue when you are ready.",
                linkLabel: `${journey.cta.label} →`,
              }}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
