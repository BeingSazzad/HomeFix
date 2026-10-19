"use client";

import { ClipboardList, MessagesSquare, Search, Wallet, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Describe your job",
    text: "Detail the repair, your preferred timing, and attach photos in under 2 minutes.",
    icon: ClipboardList,
    tag: "2 Min Form",
  },
  {
    step: "02",
    title: "Receive local bids",
    text: "Verified Austin contractors review your details and send clear, itemized price estimates.",
    icon: Search,
    tag: "No Cold Calls",
  },
  {
    step: "03",
    title: "Compare clear bids",
    text: "Inspect labor, parts, estimated arrival times, and verified neighbor reviews in one place.",
    icon: MessagesSquare,
    tag: "Zero Pressure",
  },
  {
    step: "04",
    title: "Hire & pay directly",
    text: "Schedule your visit and pay your technician directly once you are 100% satisfied with the work.",
    icon: Wallet,
    tag: "$0 Platform Fee",
  },
];

export function HomeProcess() {
  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            align="center"
            eyebrow="How it works"
            title="From broken to fixed in 4 easy steps"
            description="Get upfront bids, hire with complete confidence, and pay your pro directly upon completion."
          />
        </div>

        <div className="mt-14 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group relative flex flex-col justify-between rounded-[24px] border border-line bg-white p-7 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-2xl font-bold tracking-tight text-title/25 group-hover:text-primary/30 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <div className="mt-7">
                    <span className="inline-block rounded-full bg-smoke px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                      {item.tag}
                    </span>
                    <h3 className="mt-3.5 font-display text-[19px] sm:text-[20px] font-medium tracking-tight leading-snug text-title">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 font-sans text-sm leading-[24px] text-[#757575]">
                      {item.text}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-line/60 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Step {index + 1} of 4</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 sm:mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/signup?next=%2Faccount%2Fpost-job" size="lg">
            Post your request free ↗
          </Button>
          <Button href="/how-it-works" variant="ghost" size="lg">
            Learn about our vetting standards
          </Button>
        </div>
      </div>
    </section>
  );
}