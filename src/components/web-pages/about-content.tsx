"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Check,
  Clock,
  Wrench,
  Zap,
  DollarSign,
  Award,
  ArrowRight,
  Lock,
  Users,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { cn } from "@/lib/cn";

export function AboutContent() {
  const [activeTab, setActiveTab] = useState<"mission" | "vision">("mission");

  return (
    <div className="bg-[#fbfcfd] text-title min-h-screen">
      {/* ========================================================================= */}
      {/* SECTION 1: EDITORIAL HERO BANNER (Matches Reference Top Showcase)         */}
      {/* ========================================================================= */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 bg-white border-b border-line/60">
        <div className="container-site">
          {/* Centered Eyebrow Pill */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 font-display text-[12px] sm:text-[13px] font-bold tracking-[0.14em] text-primary uppercase bg-primary/5 px-3.5 py-1 rounded-full border border-primary/20">
              <span className="inline-block h-3 w-1 rounded-full bg-primary" />
              <span>WHO WE ARE</span>
            </div>
          </div>

          {/* Centered Editorial Headline */}
          <div className="mt-5 text-center max-w-4xl mx-auto">
            <h1 className="font-display text-[32px] sm:text-[46px] md:text-[56px] lg:text-[62px] font-bold leading-[1.08] tracking-[-0.035em] text-title uppercase">
              KEEPING HOMES RUNNING <br className="hidden sm:inline" />
              <span className="text-primary">SMOOTHLY</span> WITH EXPERT LOCAL PROS
            </h1>
            <p className="mt-4 sm:mt-5 max-w-2xl mx-auto font-sans text-[15px] sm:text-[17px] md:text-[18px] leading-[1.6] text-[#666]">
              Austin&apos;s direct home services platform dedicated to master craftsmanship, upfront transparent pricing, and vetted local trade pros who treat your home with genuine care.
            </p>
          </div>

          {/* Wide Hero Showcase Image (High-Res Realistic Trade Pros Banner) */}
          <div className="mt-8 sm:mt-12 relative h-[300px] sm:h-[440px] md:h-[520px] w-full overflow-hidden rounded-[24px] sm:rounded-[32px] border border-line/80 shadow-md group">
            <Image
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1800&q=80"
              alt="LocalHomeFix verified trade technicians collaborating on a residential service project"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            {/* Bottom floating trust banner inside hero */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto flex flex-wrap items-center gap-3 rounded-[18px] border border-white/20 bg-white/95 px-4 py-3 sm:px-6 sm:py-3.5 shadow-xl backdrop-blur-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-[14px] sm:text-[15px] font-bold text-title leading-tight">
                  100% Austin Trade Verified
                </p>
                <p className="font-sans text-[12px] text-[#666]">
                  Active Texas state licensing & criminal background clearance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: TRUSTED SOLUTIONS + MISSION / VISION (Matches Reference Mid)  */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-line/60">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Column: Heading, Interactive Tabs, Checklist */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 font-display text-[12px] sm:text-[13px] font-bold tracking-[0.14em] text-primary uppercase">
                <span className="inline-block h-3.5 w-1 rounded-full bg-primary" />
                <span>WHO WE ARE</span>
              </div>

              {/* Title */}
              <h2 className="mt-3.5 font-display text-[30px] sm:text-[40px] md:text-[46px] font-bold leading-[1.12] tracking-[-0.03em] text-title uppercase">
                TRUSTED HOME SERVICE <br />
                <span className="text-primary">SOLUTIONS</span> FOR EVERY HOME.
              </h2>

              {/* Interactive Tabs: OUR MISSION vs OUR VISION */}
              <div className="mt-7 flex items-center gap-6 border-b border-line/80 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("mission")}
                  className={cn(
                    "relative pb-2 font-display text-[15px] sm:text-[16px] font-bold tracking-tight transition-colors cursor-pointer",
                    activeTab === "mission"
                      ? "text-primary"
                      : "text-[#888] hover:text-title"
                  )}
                >
                  OUR MISSION
                  {activeTab === "mission" && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-primary rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("vision")}
                  className={cn(
                    "relative pb-2 font-display text-[15px] sm:text-[16px] font-bold tracking-tight transition-colors cursor-pointer",
                    activeTab === "vision"
                      ? "text-primary"
                      : "text-[#888] hover:text-title"
                  )}
                >
                  OUR VISION
                  {activeTab === "vision" && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[2.5px] bg-primary rounded-full" />
                  )}
                </button>
              </div>

              {/* Tab Description Copy */}
              <div className="mt-5 min-h-[96px]">
                {activeTab === "mission" ? (
                  <p className="font-sans text-[15px] sm:text-[16px] leading-[1.65] text-[#555] animate-fadeIn">
                    At LocalHomeFix, our mission is to eliminate predatory middleman fees and restore direct, transparent relationships between homeowners and vetted local trade pros. We provide a protected, commission-free platform where quality work and fair compensation thrive together.
                  </p>
                ) : (
                  <p className="font-sans text-[15px] sm:text-[16px] leading-[1.65] text-[#555] animate-fadeIn">
                    To build the nation&apos;s most trusted and transparent neighborhood home services ecosystem—where every homeowner enjoys complete pricing clarity, independent trade contractors keep 100% of their earnings, and every repair is backed by genuine accountability.
                  </p>
                )}
              </div>

              {/* 4 Feature Checkmarks (2x2 Grid) */}
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { label: "Fast & Reliable Service", sub: "Dispatched in < 15 min" },
                  { label: "Certified Trade Experts", sub: "100% verified licenses" },
                  { label: "Transparent Initial Pricing", sub: "Zero surprise fees" },
                  { label: "100% Workmanship Guarantee", sub: "$1,000 protection" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span className="font-display text-[14px] sm:text-[14.5px] font-semibold text-title">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Call to Action Button */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/browse-pros" size="lg">
                  Browse Verified Pros
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Link
                  href="/how-it-works"
                  className="font-display text-sm font-semibold text-[#555] hover:text-primary transition-colors px-2 py-2"
                >
                  See How It Works →
                </Link>
              </div>
            </div>

            {/* Right Column: High-Res Photo (Matches Reference Tablet/Tech Shot) */}
            <div className="lg:col-span-6 relative pb-6 lg:pb-0">
              <div className="relative h-[320px] sm:h-[440px] md:h-[500px] w-full overflow-hidden rounded-[24px] sm:rounded-[30px] border border-line/70 shadow-md group">
                <Image
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"
                  alt="Certified home repair technician inspecting digital blueprints and work order specifications"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>

              {/* Floating $0 Fee Pill Badge */}
              <div className="absolute top-5 right-5 rounded-[16px] bg-primary px-4 py-3 text-white shadow-xl">
                <p className="font-display text-[26px] font-bold leading-none">$0</p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/90 uppercase tracking-wider">
                  Platform Markup
                </p>
              </div>

              {/* Floating Pro Testimonial Badge */}
              <div className="absolute -bottom-4 left-4 sm:left-6 rounded-[18px] border border-line/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-md max-w-[280px]">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1.5 font-display text-xs font-bold text-title">5.0</span>
                </div>
                <p className="mt-1 font-sans text-[12px] leading-snug text-[#555]">
                  &ldquo;Direct communication saved us $450 on our water heater replacement.&rdquo;
                </p>
                <p className="mt-1 font-display text-[11px] font-bold text-title">
                  — Austin Homeowner in Travis Heights
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: WHY CHOOSE US (Matches Reference Bottom 3-Step Grid)           */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-surface/60 border-b border-line/60">
        <div className="container-site">
          {/* Header Row: Title on Left, Description on Right */}
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 font-display text-[12px] sm:text-[13px] font-bold tracking-[0.14em] text-primary uppercase">
                <span className="inline-block h-3.5 w-1 rounded-full bg-primary" />
                <span>WHY US</span>
              </div>
              <h2 className="mt-3 font-display text-[28px] sm:text-[38px] md:text-[44px] font-bold leading-[1.12] tracking-[-0.03em] text-title uppercase">
                WHY CHOOSE LOCALHOMEFIX FOR <br />
                <span className="text-primary">YOUR HOME NEEDS</span>
              </h2>
            </div>
            <div className="md:col-span-5 md:pb-1">
              <p className="font-sans text-[15px] sm:text-[16px] leading-[1.65] text-[#666]">
                Traditional lead generation directories sell your private phone number to dozens of contractors who spam you for weeks. LocalHomeFix restores honesty with private, direct connections and fair pricing.
              </p>
            </div>
          </div>

          {/* 2-Column Body: Left Image Box + Right 3 Numbered Feature Cards */}
          <div className="mt-10 sm:mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left Column: Big Craftsman Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[380px] sm:h-[460px] md:h-[520px] w-full overflow-hidden rounded-[24px] sm:rounded-[30px] border border-line/80 shadow-md group">
                <Image
                  src="/images/why-choose/pro-craftsman.jpg"
                  alt="Austin master craftsman repairing residential woodwork and fixtures"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Overlaid Bottom Card */}
                <div className="absolute bottom-5 left-5 right-5 rounded-[18px] bg-title/85 p-4 text-white backdrop-blur-md border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display text-[15px] font-bold text-white">
                        Austin Pro Network
                      </p>
                      <p className="text-[12px] text-white/80">
                        Plumbing • Electrical • HVAC • Roofing
                      </p>
                    </div>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white">
                      <Sparkles className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Numbered Feature Cards (Matches Reference Exact Layout) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {[
                {
                  number: "01",
                  title: "SKILLED & CERTIFIED CONTRACTORS",
                  desc: "Every technician in our network is thoroughly vetted for active Texas trade licensing, minimum $1M general liability insurance, and passed criminal background checks before submitting quotes.",
                  icon: Wrench,
                },
                {
                  number: "02",
                  title: "TRANSPARENT & FAIR PRICING",
                  desc: "Upfront, itemized estimates directly from the professional. Zero platform commissions, zero hidden markups, and direct payments so technicians keep 100% of what they earn.",
                  icon: DollarSign,
                },
                {
                  number: "03",
                  title: "24/7 EMERGENCY & SAME-DAY RESPONSE",
                  desc: "Urgent leaks, electrical outages, or HVAC breakdowns can't wait. Our broadcast dispatch alerts on-duty Austin specialists for rapid dispatch—often on-site within hours.",
                  icon: Zap,
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.number}
                    className="group relative flex flex-col sm:flex-row items-start gap-4 sm:gap-5 rounded-[22px] border border-line/70 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                  >
                    {/* Number / Icon Badge */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <span className="font-display text-[16px] font-bold">{feature.number}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-display text-[17px] sm:text-[18px] font-bold text-title tracking-tight uppercase group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 font-sans text-[14px] sm:text-[14.5px] leading-[1.6] text-[#666]">
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
      {/* SECTION 4: REAL NUMBERS & COMMUNITY IMPACT STATS                         */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white border-b border-line/60">
        <div className="container-site">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "$0", label: "Extra Platform Markup", sub: "100% of your payment goes to the pro" },
              { value: "100%", label: "Direct Pro Payments", sub: "Zero middleman job cuts or commissions" },
              { value: "< 15 min", label: "Average Quote Response", sub: "Rapid local contractor response" },
              { value: "4.9 / 5", label: "Austin Satisfaction Score", sub: "Based on 1,400+ verified repairs" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col rounded-[20px] border border-line/60 bg-surface/30 p-5 sm:p-6"
              >
                <p className="font-display text-[32px] sm:text-[40px] font-bold text-title tracking-tight leading-none">
                  {stat.value}
                </p>
                <p className="mt-2.5 font-display text-[14px] sm:text-[15px] font-bold text-title leading-snug">
                  {stat.label}
                </p>
                <p className="mt-1 font-sans text-[12px] text-[#757575] leading-normal">
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: OUR CORE PILLARS (Bento Grid)                                  */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-surface/50 border-b border-line/60">
        <div className="container-site">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 font-display text-[12px] sm:text-[13px] font-bold tracking-[0.14em] text-primary uppercase">
              <span className="inline-block h-3.5 w-1 rounded-full bg-primary" />
              <span>HOW WE PROTECT YOU</span>
            </div>
            <h2 className="mt-3 font-display text-[28px] sm:text-[38px] md:text-[44px] font-bold leading-[1.12] tracking-[-0.03em] text-title uppercase">
              OUR GUIDING <span className="text-primary">PRINCIPLES</span>
            </h2>
            <p className="mt-3 font-sans text-[15px] sm:text-[16px] text-[#666]">
              Built with purpose to fix what has been broken in the home maintenance industry for decades.
            </p>
          </div>

          <div className="mt-10 sm:mt-12 grid gap-6 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="rounded-[24px] border border-line/80 bg-white p-7 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-[18px] font-bold text-title uppercase tracking-tight">
                Strict Homeowner Privacy
              </h3>
              <p className="mt-2.5 font-sans text-[14px] leading-[1.65] text-[#666]">
                Your phone number and physical address remain completely hidden until you choose to award a work order. No robo-call aggregators or aggressive sales calls.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-[24px] border border-line/80 bg-white p-7 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-[18px] font-bold text-title uppercase tracking-tight">
                Fair Pro Economics
              </h3>
              <p className="mt-2.5 font-sans text-[14px] leading-[1.65] text-[#666]">
                Independent contractors shouldn&apos;t have to pay $80 for shared leads or lose 20% of their hard-earned labor to middlemen. We believe in fair, flat memberships.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-[24px] border border-line/80 bg-white p-7 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-[18px] font-bold text-title uppercase tracking-tight">
                $1,000 Protection Commitment
              </h3>
              <p className="mt-2.5 font-sans text-[14px] leading-[1.65] text-[#666]">
                Every repair completed on LocalHomeFix is backed by our direct property resolution support. If craftsmanship does not meet standard trade codes, we step in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: HIGH-IMPACT CALL TO ACTION                                      */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-title text-white relative overflow-hidden">
        {/* Background Glow */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="container-site relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            READY TO GET STARTED?
          </div>
          <h2 className="mt-4 font-display text-[30px] sm:text-[42px] md:text-[48px] font-bold leading-[1.15] tracking-tight text-white uppercase">
            EXPERIENCE STRESS-FREE <br />
            <span className="text-primary">HOME REPAIRS</span> TODAY
          </h2>
          <p className="mt-4 font-sans text-[15px] sm:text-[17px] leading-relaxed text-white/80 max-w-xl mx-auto">
            Post your project in under 2 minutes, get quotes from verified Austin contractors, and keep full control over your home.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Button href="/account/post-job" size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white">
              Post a Job for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              href="/signup?role=pro"
              variant="onDark"
              size="lg"
              className="w-full sm:w-auto"
            >
              Join as a Contractor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
