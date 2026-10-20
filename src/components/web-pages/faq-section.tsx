"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { faqs as defaultFaqs } from "@/lib/site-content";

export function FaqSection({
  title = "We’ve got answers.",
  description = "Can’t find what you’re looking for? Our team is happy to help.",
  items = defaultFaqs,
  className,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: { q: string; a: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className={cn("bg-surface py-[var(--section-sm)] md:py-[var(--section)]", className)}>
      <div className="container-site grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Left Column: Movers-style bold uppercase display & custom pill button */}
        <div className="lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
            />
            <span>Have questions?</span>
          </div>

          <h2 className="mt-5 font-display text-[34px] sm:text-[42px] md:text-[48px] font-medium uppercase leading-[1.08] tracking-[-0.05em] text-title">
            We’ve got<br />answers.
          </h2>

          <p className="mt-4 max-w-sm font-sans text-[15px] sm:text-[16px] leading-relaxed text-[#757575]">
            {description}
          </p>

          <div className="mt-8">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3.5 rounded-full border border-title bg-white pl-5 pr-2 py-2 font-display text-sm font-medium text-title shadow-xs transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-sm"
            >
              <span>Ask a Question</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-title text-white transition-colors duration-300 group-hover:bg-primary">
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right Column: Clean floating white cards with plus/minus toggles */}
        <div className="space-y-3.5 sm:space-y-4">
          {items.map((item, index) => {
            const active = open === index;
            return (
              <div
                key={item.q}
                className={cn(
                  "overflow-hidden rounded-[20px] bg-white transition-all duration-300",
                  active
                    ? "border border-primary/30 shadow-md ring-1 ring-primary/10"
                    : "border border-line/70 shadow-xs hover:border-line hover:shadow-sm",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(active ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4.5 sm:px-7 sm:py-5 text-left"
                  aria-expanded={active}
                >
                  <span
                    className={cn(
                      "font-display text-[16px] sm:text-[17.5px] font-medium tracking-tight leading-snug transition-colors",
                      active ? "text-primary" : "text-title",
                    )}
                  >
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors",
                      active ? "bg-primary text-white" : "bg-smoke text-title/70 hover:bg-smoke/80",
                    )}
                  >
                    {active ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 ease-out",
                    active ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 sm:px-7 sm:pb-6 pt-0 font-sans text-[14.5px] sm:text-[15px] leading-relaxed text-[#757575]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}