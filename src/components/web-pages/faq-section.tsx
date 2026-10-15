"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { faqs as defaultFaqs } from "@/lib/site-content";

const supportFaces = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80",
];

export function FaqSection({
  title = "Frequently asked questions",
  description = "Find quick answers about browsing, posting, pricing, and verification.",
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
      <div className="container-site grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div className="lg:sticky lg:top-28">
          <h2 className="text-[28px] leading-tight md:text-[36px]">{title}</h2>
          <p className="mt-3 max-w-md text-[15px] leading-6 text-copy">{description}</p>

          <div className="mt-8 rounded-[20px] bg-primary p-5 text-white md:p-6">
            <div className="flex items-center">
              {supportFaces.map((src, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={cn(
                    "h-10 w-10 rounded-full border-2 border-primary object-cover",
                    index > 0 && "-ml-2.5",
                  )}
                />
              ))}
              <span className="-ml-2.5 grid h-10 w-10 place-items-center rounded-full border-2 border-primary bg-white/20 font-display text-[11px] font-bold text-white">
                +You
              </span>
            </div>
            <p className="mt-4 font-display text-lg font-bold text-white">Still have questions?</p>
            <p className="mt-1 text-sm leading-6 text-white/80">Reach out and our team will guide you.</p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-display text-sm font-bold text-primary transition-colors hover:bg-white/90"
            >
              Talk to our team
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-white">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const active = open === index;
            const n = index + 1;
            return (
              <div
                key={item.q}
                className={cn(
                  "overflow-hidden rounded-[16px] border transition-colors",
                  active
                    ? "border-primary bg-primary text-white soft-shadow"
                    : "border-line bg-white hover:border-primary/40",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(active ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left md:px-5"
                  aria-expanded={active}
                >
                  <span
                    className={cn(
                      "font-display text-[15px] font-semibold leading-6 md:text-[16px]",
                      active ? "text-white" : "text-title",
                    )}
                  >
                    {n}. {item.q}
                  </span>
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                      active ? "bg-white/20 text-white" : "bg-smoke text-primary",
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
                    <p className="px-4 pb-4 text-[14px] leading-6 text-white/85 md:px-5 md:pb-5 md:pr-14">
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
