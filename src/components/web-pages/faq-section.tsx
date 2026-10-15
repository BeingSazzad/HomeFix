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
    <section id="faq" className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <SectionHeading
          align="center"
          eyebrow={eyebrow}
          title={title}
          description="Browse free. Create an account only to post or apply as a pro."
        />
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-line border-y border-line">
          {faqs.map((item, index) => {
            const active = open === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(active ? -1 : index)}
                  className="flex w-full items-start justify-between gap-4 py-4 text-left"
                  aria-expanded={active}
                >
                  <span className="text-[16px] font-semibold leading-6 text-title">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform",
                      active && "rotate-180 text-primary",
                    )}
                  />
                </button>
                {active ? (
                  <p className="pb-4 text-[16px] leading-7 text-copy">{item.a}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
