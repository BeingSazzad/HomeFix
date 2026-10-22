"use client";

import {
  ShieldCheck,
  Receipt,
  Tag,
  Wallet,
  CircleSlash,
  Lock,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { cn } from "@/lib/cn";

const approachFeatures = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    subtitle: "Screened trade licenses & verified records",
    iconColor: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    icon: Receipt,
    title: "Clear, Itemized Quotes",
    subtitle: "Detailed line-item pricing upfront",
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    icon: Tag,
    title: "100% Free for Homeowners",
    subtitle: "Zero platform fees or hidden booking costs",
    iconColor: "text-sky-600 bg-sky-50 border-sky-100",
  },
  {
    icon: Wallet,
    title: "Pay Contractors Directly",
    subtitle: "Settle securely after inspecting finished work",
    iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    icon: CircleSlash,
    title: "No Middleman Fees",
    subtitle: "Direct contractor rates with zero commissions",
    iconColor: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    icon: Lock,
    title: "Your Privacy Protected",
    subtitle: "No contact spam or shared homeowner info",
    iconColor: "text-teal-600 bg-teal-50 border-teal-100",
  },
];

export function HomeAbout() {
  return (
    <section className="relative overflow-x-clip bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site relative z-[1] grid items-center gap-10 pb-4 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
            />
            <span>Our Approach</span>
          </div>

          <h2 className="mt-3.5 font-geist text-[32px] font-medium leading-[1.15] tracking-[-1.5px] sm:text-[40px] sm:leading-[46px] sm:tracking-[-2px] md:text-[48px] md:leading-[54px] md:tracking-[-2.88px] !text-black">
            Quality Home Repairs, Without Extra Fees
          </h2>

          <p className="mt-4 max-w-xl font-['Inter_Display',Inter,sans-serif] text-[18px] font-normal leading-[25px] tracking-[-0.18px] text-[#757575]">
            Find trusted local professionals, compare clear quotes, and pay contractors directly. No pushy sales calls or hidden markups.
          </p>

          {/* Senior Product Design: Compact, Structured Benefit Cards */}
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {approachFeatures.map((item) => (
              <div
                key={item.title}
                className="group flex items-start gap-3 rounded-2xl border border-line/70 bg-white/75 p-3.5 transition-all duration-200 hover:border-primary/50 hover:bg-white hover:shadow-xs"
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-colors",
                    item.iconColor
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-geist text-[13.5px] font-semibold text-title leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-muted leading-tight">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-9">
            <Button href="/about">
              Learn more ↗
            </Button>
          </div>
        </div>

        <div className="relative z-[1] mx-auto w-full max-w-[480px] lg:max-w-none">
          <div
            className="h-[380px] overflow-hidden rounded-[28px] bg-cover bg-center shadow-lg md:h-[440px]"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80)` }}
          />

          {/* Floating Pill: $0 Fee */}
          <div className="absolute right-4 top-4 z-10 rounded-[18px] bg-primary p-3.5 text-white shadow-lg">
            <p className="font-display text-[22px] font-bold leading-none text-white">$0</p>
            <p className="mt-1 text-xs font-semibold text-white/90">Platform Fee</p>
          </div>

          {/* Floating Thumbnail */}
          <div
            className="absolute -bottom-4 left-4 z-10 h-24 w-32 overflow-hidden rounded-[18px] border-4 border-white bg-cover bg-center shadow-2xl sm:h-28 sm:w-40"
            style={{ backgroundImage: `url(${photos.trustAlt})` }}
          />

          {/* Floating Badge */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2.5 rounded-full border border-black/5 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white">
              <Clock className="h-3.5 w-3.5 text-white" />
            </span>
            <p className="font-display text-xs font-bold text-title">Fast local response</p>
          </div>
        </div>
      </div>
    </section>
  );
}