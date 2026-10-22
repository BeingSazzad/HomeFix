"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  DollarSign,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";
import { postJobHref } from "@/lib/role-access";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";

export function AboutContent() {
  const user = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"mission" | "vision">("mission");

  return (
    <div className="bg-white text-title min-h-screen">
      {/* ========================================================================= */}
      {/* STANDARD SITE BANNER WITH BACKGROUND IMAGE AND BREADCRUMBS                */}
      {/* ========================================================================= */}
      <PageBanner
        eyebrow="About"
        title="About Us"
        description="Connecting Austin homeowners directly with verified local trade professionals."
        image={photos.banners.about}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO SHOWCASE (100% Consistent with Global Design System)      */}
      {/* ========================================================================= */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 bg-white border-b border-line/60">
        <div className="container-site">
          {/* Eyebrow: Global Design System standard with blue ring indicator */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
              />
              <span>Who We Are</span>
            </div>
          </div>

          {/* Heading: Global Design System standard (font-geist, font-medium, Title Case, no all-caps) */}
          <div className="mt-3.5 text-center max-w-3xl mx-auto">
            <h2 className="font-geist text-[32px] sm:text-[40px] md:text-[46px] font-medium leading-[1.14] tracking-[-1.5px] sm:tracking-[-2px] md:tracking-[-2.5px] !text-black">
              Keeping Homes Running{" "}
              <span className="text-primary font-medium">Smoothly</span> with Expert Local Pros
            </h2>
            <p className="mt-4 max-w-2xl mx-auto font-['Inter_Display',Inter,sans-serif] text-[16px] sm:text-[18px] font-normal leading-[25px] tracking-[-0.18px] text-[#757575]">
              Austin&apos;s direct home services platform dedicated to master craftsmanship, upfront transparent pricing, and vetted local trade pros who treat your home with genuine care.
            </p>
          </div>

          {/* Wide Hero Showcase Image Banner */}
          <div className="mt-8 sm:mt-12 relative h-[280px] sm:h-[420px] md:h-[500px] w-full overflow-hidden rounded-[24px] sm:rounded-[32px] border border-line/70 shadow-sm group">
            <Image
              src="/images/about/hero.jpg"
              alt="LocalHomeFix verified trade technicians collaborating on a residential service project"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: TRUSTED SOLUTIONS (Interactive Mission / Vision)              */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-line/60">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Column: Heading, Interactive Tabs, Checklist */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
                />
                <span>Our Approach</span>
              </div>

              {/* Title */}
              <h2 className="mt-3.5 font-geist text-[30px] sm:text-[38px] md:text-[42px] font-medium leading-[1.14] tracking-[-1.5px] sm:tracking-[-2px] !text-black">
                Trusted Home Service{" "}
                <span className="text-primary font-medium">Solutions</span> for Every Home
              </h2>

              {/* Interactive Tabs: Our Mission vs Our Vision (Title case, font-geist, font-medium) */}
              <div className="mt-7 flex items-center gap-6 border-b border-line/80 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("mission")}
                  className={cn(
                    "relative pb-2 font-geist text-[15px] sm:text-[16px] font-medium tracking-tight transition-colors cursor-pointer",
                    activeTab === "mission"
                      ? "text-primary"
                      : "text-[#757575] hover:text-title"
                  )}
                >
                  Our Mission
                  {activeTab === "mission" && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-primary rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("vision")}
                  className={cn(
                    "relative pb-2 font-geist text-[15px] sm:text-[16px] font-medium tracking-tight transition-colors cursor-pointer",
                    activeTab === "vision"
                      ? "text-primary"
                      : "text-[#757575] hover:text-title"
                  )}
                >
                  Our Vision
                  {activeTab === "vision" && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-primary rounded-full" />
                  )}
                </button>
              </div>

              {/* Tab Description Copy */}
              <div className="mt-5 min-h-[96px]">
                {activeTab === "mission" ? (
                  <p className="font-['Inter_Display',Inter,sans-serif] text-[15px] sm:text-[16px] leading-[1.65] text-[#555] animate-fadeIn">
                    At LocalHomeFix, our mission is to eliminate predatory middleman fees and restore direct, transparent relationships between homeowners and vetted local trade pros. We provide a protected, commission-free platform where quality work and fair compensation thrive together.
                  </p>
                ) : (
                  <p className="font-['Inter_Display',Inter,sans-serif] text-[15px] sm:text-[16px] leading-[1.65] text-[#555] animate-fadeIn">
                    To build the nation&apos;s most trusted and transparent neighborhood home services ecosystem—where every homeowner enjoys complete pricing clarity, independent trade contractors keep 100% of their earnings, and every repair is backed by genuine accountability.
                  </p>
                )}
              </div>

              {/* 4 Feature Checkmarks (2x2 Grid) */}
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { label: "Fast & reliable service" },
                  { label: "Certified & licensed pros" },
                  { label: "Transparent initial pricing" },
                  { label: "100% workmanship guarantee" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    </span>
                    <span className="font-geist text-[14px] sm:text-[14.5px] font-medium text-title">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Call to Action Button */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/browse-pros" size="lg">
                  Browse Verified Pros ↗
                </Button>
                <Link
                  href="/how-it-works"
                  className="font-geist text-sm font-medium text-[#555] hover:text-primary transition-colors px-2 py-2"
                >
                  See how it works ↗
                </Link>
              </div>
            </div>

            {/* Right Column: High-Res Photo */}
            <div className="lg:col-span-6 relative pb-6 lg:pb-0">
              <div className="relative h-[320px] sm:h-[440px] md:h-[480px] w-full overflow-hidden rounded-[24px] sm:rounded-[30px] border border-line/70 shadow-sm group">
                <Image
                  src="/images/about/solutions.jpg"
                  alt="Certified home repair technician inspecting digital blueprints and work order specifications"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>

              {/* Floating $0 Fee Pill Badge */}
              <div className="absolute top-5 right-5 rounded-[16px] bg-primary px-4 py-3 text-white shadow-xl">
                <p className="font-geist text-[24px] font-bold leading-none">$0</p>
                <p className="mt-0.5 text-[11px] font-medium text-white/90">
                  Platform Fee
                </p>
              </div>

              {/* Floating Pro Testimonial Badge */}
              <div className="absolute -bottom-4 left-4 sm:left-6 rounded-[18px] border border-line/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-md max-w-[280px]">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1.5 font-geist text-xs font-semibold text-title">5.0</span>
                </div>
                <p className="mt-1 font-sans text-[12px] leading-snug text-[#555]">
                  &ldquo;Direct communication saved us $450 on our water heater replacement.&rdquo;
                </p>
                <p className="mt-1 font-geist text-[11px] font-medium text-title">
                  — Austin Homeowner in Travis Heights
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: WHY CHOOSE US (Global Design System Typography)                */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-surface/50 border-b border-line/60">
        <div className="container-site">
          {/* Header Row: Title on Left, Description on Right */}
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
                />
                <span>Why Choose LocalHomeFix</span>
              </div>
              <h2 className="mt-3.5 font-geist text-[30px] sm:text-[38px] md:text-[42px] font-medium leading-[1.14] tracking-[-1.5px] sm:tracking-[-2px] !text-black">
                Why Choose LocalHomeFix for{" "}
                <span className="text-primary font-medium">Your Home Repairs</span>
              </h2>
            </div>
            <div className="md:col-span-5 md:pb-1">
              <p className="font-['Inter_Display',Inter,sans-serif] text-[15px] sm:text-[16px] leading-[1.65] text-[#757575]">
                Traditional lead generation directories sell your private phone number to dozens of contractors who spam you for weeks. LocalHomeFix restores honesty with private, direct connections and fair pricing.
              </p>
            </div>
          </div>

          {/* 2-Column Body: Left Image Box + Right 3 Numbered Feature Cards */}
          <div className="mt-10 sm:mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left Column: Craftsman Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[340px] sm:h-[440px] md:h-[480px] w-full overflow-hidden rounded-[24px] sm:rounded-[30px] border border-line/80 shadow-sm group">
                <Image
                  src="/images/about/craftsman.jpg"
                  alt="Austin master craftsman repairing residential woodwork and fixtures"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>

            {/* Right Column: 3 Numbered Feature Items (Clean, unboxed editorial list) */}
            <div className="lg:col-span-7 flex flex-col divide-y divide-line/70">
              {[
                {
                  number: "01",
                  title: "Skilled & certified contractors",
                  desc: "Every technician in our network is thoroughly vetted for active Texas trade licensing, minimum $1M general liability insurance, and passed criminal background checks before submitting quotes.",
                  icon: Wrench,
                },
                {
                  number: "02",
                  title: "Transparent & fair pricing",
                  desc: "Upfront, itemized estimates directly from the professional. Zero platform commissions, zero hidden markups, and direct payments so technicians keep 100% of what they earn.",
                  icon: DollarSign,
                },
                {
                  number: "03",
                  title: "24/7 emergency & rapid response",
                  desc: "Urgent leaks, electrical outages, or HVAC breakdowns can't wait. Our broadcast dispatch alerts on-duty Austin specialists for rapid dispatch—often on-site within hours.",
                  icon: Zap,
                },
              ].map((feature, idx) => {
                return (
                  <div
                    key={feature.number}
                    className={cn(
                      "flex items-start gap-4 sm:gap-5",
                      idx === 0 ? "pb-6 sm:pb-7" : idx === 2 ? "pt-6 sm:pt-7" : "py-6 sm:py-7",
                    )}
                  >
                    {/* Number Badge */}
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="font-geist text-[14px] sm:text-[15px] font-semibold">{feature.number}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-geist text-[17px] sm:text-[18px] font-medium text-title tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 font-['Inter_Display',Inter,sans-serif] text-[14px] sm:text-[15px] leading-[1.6] text-[#666]">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: CALL TO ACTION (Global Design System Typography)               */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-title text-white relative overflow-hidden">
        {/* Background Glow */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="container-site relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 font-geist text-[13px] font-medium tracking-tight text-white/90">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-white"
            />
            <span>Ready to get started?</span>
          </div>
          <h2 className="mt-3.5 font-geist text-[24px] sm:text-[30px] md:text-[36px] lg:text-[42px] font-medium leading-[1.15] tracking-[-1px] sm:tracking-[-1.5px] text-white whitespace-normal sm:whitespace-nowrap">
            Experience Stress-Free{" "}
            <span className="text-secondary font-medium">Home Repairs</span> Today
          </h2>
          <p className="mt-3.5 font-['Inter_Display',Inter,sans-serif] text-[15px] sm:text-[17px] leading-relaxed text-white/85 max-w-xl mx-auto">
            Post your project in under 2 minutes, get quotes from verified Austin contractors, and keep full control over your home.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Button href={postJobHref(user)} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white">
              Post a Job for Free ↗
            </Button>
            <Button
              href="/signup?role=pro"
              variant="onDark"
              size="lg"
              className="w-full sm:w-auto"
            >
              Join as a Contractor ↗
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
