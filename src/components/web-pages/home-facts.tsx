"use client";

import { BadgeDollarSign, ShieldCheck, Receipt, Star } from "lucide-react";

const metrics = [
  {
    value: "$0",
    label: "Free for homeowners",
    subtext: "Free to browse, post, and compare bids",
    icon: BadgeDollarSign,
  },
  {
    value: "100%",
    label: "Verified contractor clearance",
    subtext: "Manual credential & license review",
    icon: ShieldCheck,
  },
  {
    value: "0%",
    label: "Invoice markup or cut",
    subtext: "You pay your technician directly",
    icon: Receipt,
  },
  {
    value: "4.9★",
    label: "Average customer rating",
    subtext: "Based on 12,400+ verified neighbor reviews",
    icon: Star,
  },
];

export function HomeFacts() {
  return (
    <section className="bg-title py-12 text-white md:py-16">
      <div className="container-site">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {metrics.map((item) => (
            <li
              key={item.label}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-primary-hover backdrop-blur-md">
                <item.icon className="h-5 w-5 text-accent" aria-hidden="true" />
              </span>
              <p className="mt-3 font-display text-[32px] sm:text-[36px] md:text-[40px] font-medium leading-none tracking-tight text-white">
                {item.value}
              </p>
              <p className="mt-1.5 font-display text-sm font-semibold text-white">
                {item.label}
              </p>
              <p className="mt-1 font-sans text-xs text-white/60">
                {item.subtext}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}