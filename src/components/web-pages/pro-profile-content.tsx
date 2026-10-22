"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  MessageSquare,
  Share2,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { serviceLines } from "@/lib/pro-extras";
import { loginHref } from "@/lib/role-access";
import { toggleFavorite } from "@/redux/slices/featuresSlice";
import { useRoleAccess } from "@/hooks/use-role-access";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Professional } from "@/types";
import { cn } from "@/lib/cn";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProProfileContent({ pro }: { pro: Professional }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { access } = useRoleAccess();
  const saved = useAppSelector((state) => state.features.favorites.includes(pro.id));
  const seedReviews = useAppSelector((state) =>
    state.features.reviews.filter((item) => item.proId === pro.id)
  );

  const [activeTab, setActiveTab] = useState<"services" | "reviews" | "about" | "faqs">("services");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedReviewTag, setSelectedReviewTag] = useState("all");
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const proProfile = useAppSelector((state) => state.features.proProfile);
  const isDemoPro = pro.id === "pro-1";

  const effectiveBio = isDemoPro && proProfile?.bio ? proProfile.bio : pro.bio;
  const effectiveStartingPrice = isDemoPro && proProfile?.startingPrice ? proProfile.startingPrice : pro.startingPrice;

  const displayServices = isDemoPro && proProfile?.services?.length ? proProfile.services : null;

  const cover = photos.services[pro.categorySlug] ?? photos.banner;
  const specialties = serviceLines[pro.categorySlug] ?? [pro.trade, "Diagnostics", "Repairs", "Maintenance"];
  const profilePath = `/browse-pros/${pro.id}`;

  const quoteHref = access.audience === "homeowner"
    ? `/account/post-job?invite=${pro.id}`
    : loginHref({ next: `/account/post-job?invite=${pro.id}` });
  const messageHref =
    access.audience === "homeowner"
      ? `/account/messages?dm=${pro.id}`
      : access.audience === "guest"
      ? loginHref({ next: `/account/messages?dm=${pro.id}` })
      : null;

  function onSave() {
    if (access.audience === "guest") {
      router.push(loginHref({ next: pathname || profilePath }));
      return;
    }
    if (!access.canSavePro) return;
    dispatch(toggleFavorite(pro.id));
  }

  function onShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Realistic verified reviews
  const defaultReviews = useMemo(
    () => [
      {
        id: "rev-1",
        author: "David H.",
        location: `${pro.city}, ${pro.state}`,
        date: "2 weeks ago",
        rating: 5,
        tag: "punctual",
        project: `${pro.trade} Diagnostics & Service`,
        text: `${pro.name} arrived right on time, explained the issue clearly without trying to upsell unnecessary work, and resolved it in under 2 hours. Extremely professional and fair pricing!`,
        reply: `Thanks David! Always glad to help keep things running smoothly. Appreciate your trust! — ${pro.name}`,
      },
      {
        id: "rev-2",
        author: "Sarah M.",
        location: `${pro.city}, ${pro.state}`,
        date: "1 month ago",
        rating: 5,
        tag: "fair-price",
        project: `Urgent ${pro.trade} Repair`,
        text: `We needed urgent help and ${pro.name} gave us an itemized estimate upfront. No hidden travel fees or mystery markups. Paid directly upon completion — seamless experience.`,
        reply: undefined,
      },
      {
        id: "rev-3",
        author: "Robert C.",
        location: "Local Homeowner",
        date: "2 months ago",
        rating: 5,
        tag: "clean-work",
        project: `Replacement & Maintenance`,
        text: `Clean, courteous, and efficient. Wore boot covers indoors and left the work area spotless. Definitely our go-to contractor from now on.`,
        reply: `Thank you Robert! We take pride in treating every home like our own.`,
      },
      {
        id: "rev-4",
        author: "Michael T.",
        location: `${pro.city}, ${pro.state}`,
        date: "3 months ago",
        rating: 5,
        tag: "punctual",
        project: `Annual System Inspection`,
        text: `Outstanding communication from booking to finish. Arrived right inside the promised arrival window and provided helpful preventive tips.`,
        reply: undefined,
      },
    ],
    [pro.city, pro.state, pro.trade, pro.name]
  );

  const allReviews = useMemo(() => {
    const userMapped = seedReviews.map((r, i) => ({
      id: r.id,
      author: r.author,
      location: `${pro.city}, ${pro.state}`,
      date: `${i + 1} month ago`,
      rating: r.rating,
      tag: i % 2 === 0 ? "clean-work" : "fair-price",
      project: `${pro.trade} Service`,
      text: r.body,
      reply: r.reply ?? undefined,
    }));

    // Merge so seedReviews (e.g. Elena Ruiz) are first, followed by verified default reviews
    const combined = [...userMapped];
    for (const def of defaultReviews) {
      if (!combined.some((item) => item.text.trim() === def.text.trim() || item.id === def.id)) {
        combined.push(def);
      }
    }
    return combined;
  }, [seedReviews, defaultReviews, pro.city, pro.state, pro.trade]);

  const filteredReviews = useMemo(() => {
    if (selectedReviewTag === "all") return allReviews;
    return allReviews.filter((r) => r.tag === selectedReviewTag);
  }, [allReviews, selectedReviewTag]);

  const reviewTags = useMemo(() => {
    const punctualCount = allReviews.filter((r) => r.tag === "punctual").length;
    const fairPriceCount = allReviews.filter((r) => r.tag === "fair-price").length;
    const cleanWorkCount = allReviews.filter((r) => r.tag === "clean-work").length;

    return [
      { id: "all", label: `All (${allReviews.length})` },
      { id: "punctual", label: `Punctual (${punctualCount})` },
      { id: "fair-price", label: `Fair Price (${fairPriceCount})` },
      { id: "clean-work", label: `Clean Work (${cleanWorkCount})` },
    ];
  }, [allReviews]);

  // Service list with category filter
  const servicesList = useMemo(() => {
    if (!displayServices || displayServices.length === 0) return [];
    if (selectedCategoryFilter === "all") return displayServices;
    return displayServices.filter((s) =>
      s.name.toLowerCase().includes(selectedCategoryFilter.toLowerCase())
    );
  }, [displayServices, selectedCategoryFilter]);

  const faqs = [
    {
      q: "How does pricing and payment work?",
      a: "You receive a clear, upfront itemized estimate before any work begins. Once the job is completed to your satisfaction, you pay the contractor directly via Card, Zelle, Check, or Cash with zero platform markups.",
    },
    {
      q: "Do you offer free estimates or diagnostics?",
      a: `For standard repairs within our ${pro.radiusMiles}-mile service area, we provide transparent upfront estimates. If a comprehensive diagnostic teardown is needed, the diagnostic fee is credited directly toward your repair cost upon approval.`,
    },
    {
      q: "Are you licensed and insured in Texas?",
      a: "Yes. Active Texas State Trade License (TDLR verified) and $1,000,000 General Liability coverage. All credentials are fully verified by LocalHomeFix.",
    },
    {
      q: "What warranty do you provide?",
      a: "We back all workmanship with a 1-year labor warranty. All replacement hardware and parts carry their full manufacturer warranty.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. BREADCRUMBS BAR */}
      <nav aria-label="Breadcrumb" className="border-b border-line/60 bg-surface/40 py-2">
        <div className="container-site flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="transition hover:text-primary">
            Home
          </Link>
          <span className="text-line">/</span>
          <Link href="/browse-pros" className="transition hover:text-primary">
            Find Pros
          </Link>
          <span className="text-line">/</span>
          <Link
            href={`/browse-pros?category=${pro.categorySlug}`}
            className="capitalize transition hover:text-primary"
          >
            {pro.trade}
          </Link>
          <span className="text-line">/</span>
          <span className="truncate font-semibold text-title">{pro.name}</span>
        </div>
      </nav>

      {/* 2. REFINED COMPACT COVER HERO */}
      <section className="relative h-28 sm:h-36 md:h-40 w-full overflow-hidden bg-gradient-to-r from-title via-slate-900 to-primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={pro.name}
          className="h-full w-full object-cover object-center opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </section>

      {/* 3. PROFILE IDENTITY HEADER */}
      <section className="border-b border-line/60 bg-white">
        <div className="container-site relative pb-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            {/* Avatar & Profile Meta */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-5">
              <div className="relative -mt-10 sm:-mt-12 shrink-0">
                <span className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-primary to-blue-700 font-display text-2xl sm:text-3xl font-bold text-white shadow-md">
                  {initials(pro.name)}
                </span>
                <span
                  title="Screened & Verified Professional"
                  className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-600 text-white shadow-xs ring-2 ring-white"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="space-y-1 pt-1 sm:pt-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title leading-tight">
                  {pro.name}
                </h1>

                {/* Clean, Non-repetitive Meta Line */}
                <div className="font-sans text-xs sm:text-sm text-copy flex flex-wrap items-center gap-2">
                  <span className="font-medium text-primary">
                    {pro.trade} Specialist
                  </span>
                  <span className="text-muted/60">·</span>
                  <button
                    type="button"
                    onClick={() => scrollToSection("sec-reviews")}
                    className="inline-flex items-center font-bold text-title hover:text-primary transition"
                  >
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500 mr-1" />
                    {pro.rating.toFixed(1)}
                    <span className="font-normal text-muted ml-1">({pro.reviewCount} reviews)</span>
                  </button>
                  <span className="text-muted/60">·</span>
                  <span className="inline-flex items-center text-muted">
                    <MapPin className="h-3.5 w-3.5 mr-1 shrink-0 text-muted" />
                    {pro.city}, {pro.state} (~{pro.radiusMiles} mi radius)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Share & Save) */}
            <div className="flex items-center gap-2 self-start md:self-end">
              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-title shadow-xs hover:bg-smoke transition-colors"
                title="Share Pro Profile"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{copied ? "Link Copied!" : "Share"}</span>
              </button>

              {access.audience !== "pro" ? (
                <button
                  type="button"
                  onClick={onSave}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-title shadow-xs hover:bg-smoke transition-colors",
                    saved && access.canSavePro && "text-error border-error/30 bg-red-50"
                  )}
                  title="Save to favorites"
                >
                  <Heart className={cn("h-3.5 w-3.5", saved && access.canSavePro && "fill-current text-error")} />
                  <span>{saved && access.canSavePro ? "Saved" : "Save"}</span>
                </button>
              ) : null}
            </div>
          </div>

          {/* Unified Credentials Stat Strip (Clean, focused metrics) */}
          <div className="mt-5 pt-4 border-t border-line/60 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-title">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                <strong>{pro.yearsInBusiness}</strong> in business
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                <strong>{pro.jobsCompleted}+</strong> completed jobs
              </span>
            </div>
          </div>
        </div>

        {/* 4. SUB-NAVIGATION TAB RIBBON */}
        <div className="sticky top-[74px] z-30 border-t border-line/70 bg-white/95 backdrop-blur-md shadow-xs">
          <div className="container-site flex items-center justify-between gap-4">
            <div className="flex gap-2 sm:gap-6 overflow-x-auto py-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: "sec-services", tabId: "services", label: "Services & Rates" },
                { id: "sec-reviews", tabId: "reviews", label: `Reviews (${allReviews.length})` },
                { id: "sec-about", tabId: "about", label: "About & Credentials" },
                { id: "sec-faqs", tabId: "faqs", label: "FAQs" },
              ].map((tab) => (
                <button
                  key={tab.tabId}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.tabId as typeof activeTab);
                    scrollToSection(tab.id);
                  }}
                  className={cn(
                    "shrink-0 px-2 py-3 text-xs sm:text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
                    activeTab === tab.tabId
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted hover:text-title"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. MAIN CONTENT LAYOUT */}
      <div className="container-site mt-8 sm:mt-10 grid gap-10 lg:grid-cols-12 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-10 sm:space-y-12">
          {/* ============================================================ */}
          {/* SECTION 1: SERVICES & UPFRONT RATES                         */}
          {/* ============================================================ */}
          <section id="sec-services" className="scroll-mt-[135px] border-b border-line/60 pb-10 sm:pb-12 space-y-6">

            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="font-display text-xl sm:text-[22px] font-semibold text-title tracking-tight">
                  Services &amp; Upfront Rates
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-muted">
                  Guaranteed upfront pricing agreed before work begins · No hidden travel fees
                </p>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-title">
                Starting from <span className="font-display text-lg sm:text-xl font-bold text-title">${effectiveStartingPrice}</span>
              </p>
            </div>

            {/* Specialties / Service Categories Filter */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter("all")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  selectedCategoryFilter === "all"
                    ? "bg-title text-white font-semibold"
                    : "bg-surface border border-line/70 text-copy hover:bg-smoke"
                )}
              >
                All Services
              </button>
              {specialties.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(item)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    selectedCategoryFilter === item
                      ? "bg-title text-white font-semibold"
                      : "bg-surface border border-line/70 text-copy hover:bg-smoke"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Itemized Services Grid */}
            {servicesList.length > 0 ? (
              <div className="grid gap-3.5 sm:grid-cols-2 pt-1">
                {servicesList.map((srv) => (
                  <div
                    key={srv.id}
                    className="group rounded-2xl border border-line/80 bg-white p-4 sm:p-5 shadow-2xs hover:border-primary/40 hover:shadow-xs transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-display text-sm sm:text-[15px] font-bold text-title group-hover:text-primary transition-colors">
                          {srv.name}
                        </h3>
                        <span className="font-display text-sm sm:text-base font-bold text-primary shrink-0">
                          ${srv.price}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted leading-relaxed line-clamp-2">
                        {srv.description || "Standard inspection, repairs, and verified parts installation."}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-line/50 flex items-center justify-between text-[11px] text-muted">
                      <span>Rate: {srv.unit}</span>
                      {quoteHref && (
                        <Link
                          href={`${quoteHref}&service=${encodeURIComponent(srv.name)}`}
                          className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          Request quote ↗
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-line/60 bg-surface/30 p-6 text-center text-xs text-muted">
                No specific services match this filter. Select &ldquo;All Services&rdquo; to view full offerings.
              </div>
            )}
          </section>


          {/* ============================================================ */}
          {/* SECTION 3: VERIFIED CUSTOMER REVIEWS                        */}
          {/* ============================================================ */}
          <section id="sec-reviews" className="scroll-mt-[135px] border-b border-line/60 pb-10 sm:pb-12 space-y-6">
            <div>
              <h2 className="font-display text-xl sm:text-[22px] font-semibold text-title tracking-tight">
                Customer Reviews
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-muted">
                Feedback from verified homeowners in {pro.city} &amp; surrounding areas
              </p>
            </div>

            {/* Modern Review Scorecard Banner */}
            <div className="grid gap-6 rounded-2xl border border-line/70 bg-surface/30 p-5 sm:p-6 sm:grid-cols-12 sm:items-center">
              {/* Score summary */}
              <div className="sm:col-span-5 flex items-center gap-4 border-b border-line/60 pb-5 sm:border-b-0 sm:pb-0 sm:border-r sm:pr-6">
                <div className="font-display text-4xl sm:text-5xl font-extrabold text-title tracking-tight">
                  {pro.rating.toFixed(1)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-title">
                    Based on {pro.reviewCount} verified ratings
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    100% of homeowners recommend
                  </p>
                </div>
              </div>

              {/* Progress bars */}
              <div className="sm:col-span-7 space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-14 text-[11px] font-medium text-muted">5 stars</span>
                  <div className="h-2 flex-1 rounded-full bg-line/80 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: "95%" }} />
                  </div>
                  <span className="w-8 text-right text-[11px] font-medium text-muted">95%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-14 text-[11px] font-medium text-muted">4 stars</span>
                  <div className="h-2 flex-1 rounded-full bg-line/80 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: "5%" }} />
                  </div>
                  <span className="w-8 text-right text-[11px] font-medium text-muted">5%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-14 text-[11px] font-medium text-muted">1-3 stars</span>
                  <div className="h-2 flex-1 rounded-full bg-line/80 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: "0%" }} />
                  </div>
                  <span className="w-8 text-right text-[11px] font-medium text-muted">0%</span>
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-medium text-muted mr-1">Filter:</span>
              {reviewTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedReviewTag(tag.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    selectedReviewTag === tag.id
                      ? "bg-title text-white font-semibold"
                      : "bg-surface text-copy hover:bg-smoke border border-line/70"
                  )}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-3.5 pt-2">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-line/70 bg-white p-5 space-y-3 shadow-2xs hover:border-line transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-smoke font-display text-xs font-bold text-title border border-line/60">
                        {initials(rev.author)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-semibold text-title">
                            {rev.author}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            <ShieldCheck className="h-3 w-3" />
                            Verified Homeowner
                          </span>
                        </div>
                        <p className="text-xs text-muted mt-0.5">
                          {rev.location} · {rev.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                      ))}
                    </div>
                  </div>

                  {rev.project && (
                    <span className="inline-block rounded-md bg-smoke px-2.5 py-1 text-[11px] font-medium text-copy/90 border border-line/50">
                      {rev.project}
                    </span>
                  )}

                  <p className="font-sans text-xs sm:text-sm leading-relaxed text-copy">
                    {rev.text}
                  </p>

                  {rev.reply && (
                    <div className="rounded-xl bg-surface/60 border border-line/60 p-3.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-xs font-bold text-title">
                          Response from {pro.name}
                        </span>
                        <span className="text-[10px] text-muted">· Verified Pro</span>
                      </div>
                      <p className="text-xs text-copy/90 leading-relaxed">
                        {rev.reply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 4: ABOUT & CREDENTIALS                              */}
          {/* ============================================================ */}
          <section id="sec-about" className="scroll-mt-[135px] border-b border-line/60 pb-10 sm:pb-12 space-y-6">
            <div>
              <h2 className="font-display text-xl sm:text-[22px] font-semibold text-title tracking-tight">
                About &amp; Credentials
              </h2>
              <p className="mt-2.5 font-sans text-sm leading-relaxed text-copy max-w-3xl">
                {effectiveBio}
              </p>
            </div>

            {/* Standard Verified Credentials Grid (Replaces arbitrary business hours & payment boxes) */}
            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <div className="flex items-start gap-3.5 rounded-2xl border border-line/70 bg-white p-4 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-display text-sm font-semibold text-title">
                    State Trade License
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Active &amp; verified with Texas TDLR licensing board
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-line/70 bg-white p-4 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Award className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-display text-sm font-semibold text-title">
                    General Liability Insurance
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    $1,000,000 policy coverage verified &amp; certificate on file
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-line/70 bg-white p-4 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-display text-sm font-semibold text-title">
                    Background Checked
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Identity, trade certification, and public records verified
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-line/70 bg-white p-4 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-display text-sm font-semibold text-title">
                    1-Year Workmanship Warranty
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    All completed labor backed by written contractor guarantee
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 5: FREQUENTLY ASKED QUESTIONS                       */}
          {/* ============================================================ */}
          <section id="sec-faqs" className="scroll-mt-[135px] space-y-4">
            <h2 className="font-display text-xl sm:text-[22px] font-semibold text-title tracking-tight">
              Frequently Asked Questions
            </h2>

            <div className="divide-y divide-line/60">
              {faqs.map((faq, i) => (
                <div key={i} className="py-3.5 first:pt-1 space-y-1">
                  <h3 className="font-display text-sm sm:text-[15px] font-semibold text-title">
                    {faq.q}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-muted leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): ELEVATED STICKY ACTION CARD */}
        <aside className="lg:col-span-4 lg:sticky lg:top-[135px]">
          <div className="rounded-2xl border border-line/80 bg-white p-5 sm:p-6 shadow-md space-y-5">
            {/* Price & Upfront Guarantee Header */}
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-bold text-title tracking-tight">
                    ${effectiveStartingPrice}
                  </span>
                  <span className="text-xs font-medium text-muted">starting estimate</span>
                </div>
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/70">
                  Upfront Pricing
                </span>
              </div>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Itemized estimate agreed before any work begins.
              </p>
            </div>

            {/* Clean Key Specs (Unboxed, Senior Product Designer layout) */}
            <div className="space-y-2.5 pt-3.5 border-t border-line/60 text-xs">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-muted flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  Service Area
                </span>
                <span className="font-semibold text-title text-right">
                  {pro.city} (~{pro.radiusMiles} mi)
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <span className="text-muted flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  Availability
                </span>
                <span className="font-semibold text-emerald-700 text-right">
                  {pro.availableThisWeek ? "Available This Week" : "Book 3–5 Days"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {quoteHref ? (
                <Button
                  href={quoteHref}
                  size="md"
                  className="w-full justify-center shadow-xs"
                >
                  Request a Free Quote ↗
                </Button>
              ) : null}

              {messageHref ? (
                <Button
                  href={messageHref}
                  variant="ghost"
                  size="md"
                  className="w-full justify-center"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message Directly ↗
                </Button>
              ) : null}
            </div>

            {/* Single, Reassuring Trust Footnote */}
            <p className="pt-2 text-center text-[11px] text-muted border-t border-line/50">
              Direct contractor hiring · Zero booking markup
            </p>
          </div>
        </aside>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl overflow-hidden rounded-2xl bg-black">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/40"
              aria-label="Close image"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Enlarged project" className="max-h-[80vh] w-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
