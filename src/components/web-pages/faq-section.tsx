"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { faqs } from "@/lib/site-content";

export function FaqSection({
  eyebrow = "Questions",
  title = "Frequently asked questions",
}: {
  eyebrow?: string;
  title?: string;
}) {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description="Browse first if you want. An account is only for posting a request or applying as a professional."
        />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-line rounded-[20px] bg-white px-2 soft-shadow">
          {faqs.map((item, index) => {
            const active = open === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(active ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  aria-expanded={active}
                >
                  <span className="font-display text-[16px] font-bold text-title">{item.q}</span>
                  <ChevronDown
                    className={cn("h-5 w-5 shrink-0 text-primary transition-transform", active && "rotate-180")}
                  />
                </button>
                {active ? <p className="px-5 pb-5 text-[15px] leading-7 text-copy">{item.a}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
