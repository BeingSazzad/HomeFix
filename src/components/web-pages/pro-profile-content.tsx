"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Award,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
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
import { portfolios, serviceLines } from "@/lib/pro-extras";
import { signupHref } from "@/lib/role-access";
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

  const [activeTab, setActiveTab] = useState<"services" | "projects" | "reviews" | "about" | "faqs">("services");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedReviewTag, setSelectedReviewTag] = useState("all");
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const proProfile = useAppSelector((state) => state.features.proProfile);
  const isDemoPro = pro.id === "pro-1";

  const effectiveBusinessName = isDemoPro && proProfile?.businessName ? proProfile.businessName : pro.businessName;
  const effectiveBio = isDemoPro && proProfile?.bio ? proProfile.bio : pro.bio;
  const effectiveStartingPrice = isDemoPro && proProfile?.startingPrice ? proProfile.startingPrice : pro.startingPrice;
  const effectiveResponseTime = isDemoPro && proProfile?.responseTime ? proProfile.responseTime : pro.responseTime;

  const displaySpecialOffer = isDemoPro && proProfile?.specialOffer?.active ? proProfile.specialOffer : null;
  const displayServices = isDemoPro && proProfile?.services?.length ? proProfile.services : null;
  const displayHours = isDemoPro && proProfile?.businessHours ? proProfile.businessHours : null;
  const displayPayments = isDemoPro && proProfile?.acceptedPayments?.length ? proProfile.acceptedPayments : null;

  const cover = photos.services[pro.categorySlug] ?? photos.banner;
  const gallery = isDemoPro && proProfile?.portfolio?.length
    ? proProfile.portfolio
    : (portfolios[pro.id] ?? [
        { title: `${pro.trade} repair inspection`, image: cover },
        { title: "Standard system service", image: photos.trust },
        { title: "Completed installation", image: photos.trustAlt },
      ]);
  const specialties = serviceLines[pro.categorySlug] ?? [pro.trade, "Diagnostics", "Repairs", "Maintenance"];
  const profilePath = `/browse-pros/${pro.id}`;

  const quoteHref = access.audience === "homeowner"
    ? `/account/post-job?invite=${pro.id}`
    : `/signup?next=/account/post-job?invite=${pro.id}`;
  const messageHref =
    access.audience === "homeowner"
      ? `/account/messages?dm=${pro.id}`
      : access.audience === "guest"
      ? signupHref(`/account/messages?dm=${pro.id}`)
      : null;

  function onSave() {
    if (access.audience === "guest") {
      router.push(signupHref(pathname || profilePath));
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
  const defaultReviews = [
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
      location: "Verified Neighbor",
      date: "1 month ago",
      rating: 5,
      tag: "fair-price",
      project: `Urgent ${pro.trade} Repair`,
      text: `We needed urgent help and ${pro.businessName} gave us an itemized estimate upfront. No hidden travel fees or mystery markups. Paid directly upon completion — seamless experience.`,
      reply: null,
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
  ];

  const allReviews = seedReviews.length
    ? seedReviews.map((r, i) => ({
        id: r.id,
        author: r.author,
        location: `${pro.city}, ${pro.state}`,
        date: `${i + 1} month ago`,
        rating: r.rating,
        tag: i % 2 === 0 ? "punctual" : "clean-work",
        project: `${pro.trade} Service`,
        text: r.body,
        reply: r.reply,
      }))
    : defaultReviews;

  const filteredReviews =
    selectedReviewTag === "all"
      ? allReviews
      : allReviews.filter(
          (r) => r.tag === selectedReviewTag || r.text.toLowerCase().includes(selectedReviewTag)
        );

  const reviewTags = [
    { id: "all", label: `All (${allReviews.length})` },
    { id: "punctual", label: "Punctual" },
    { id: "fair-price", label: "Fair Price" },
    { id: "clean-work", label: "Clean Work" },
  ];

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
          <span className="truncate font-semibold text-title">{effectiveBusinessName}</span>
        </div>
      </nav>

      {/* 2. REFINED COMPACT COVER HERO */}
      <section className="relative h-28 sm:h-36 md:h-40 w-full overflow-hidden bg-gradient-to-r from-title via-slate-900 to-primary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={pro.businessName}
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
                <div className="flex items-center gap-2.5">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title leading-tight">
                    {effectiveBusinessName}
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified Pro
                  </span>
                </div>

                {/* Clean, Non-repetitive Meta Line */}
                <div className="font-sans text-xs sm:text-sm text-copy flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-title">{pro.name}</span>
                  <span className="text-muted/60">·</span>
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

          {/* Unified Credentials Stat Strip (No Clutter, Clean Metrics) */}
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

            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>
                Responds <strong>{effectiveResponseTime.toLowerCase()}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>TDLR Licensed &amp; $1M Insured</span>
            </div>
          </div>
        </div>

        {/* 4. SUB-NAVIGATION TAB RIBBON */}
        <div className="sticky top-[74px] z-30 border-t border-line/70 bg-white/95 backdrop-blur-md shadow-xs">
          <div className="container-site flex items-center justify-between gap-4">
            <div className="flex gap-2 sm:gap-6 overflow-x-auto py-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: "sec-services", tabId: "services", label: "Services & Rates" },
                { id: "sec-projects", tabId: "projects", label: `Recent Work (${gallery.length})` },
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
            {/* Promotional Offer Banner (Clean & Subtle) */}
            {displaySpecialOffer && (
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs">
                    {displaySpecialOffer.discount}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-emerald-950">
                      {displaySpecialOffer.title}
                    </h3>
                    <p className="text-xs text-emerald-800/80 leading-relaxed">
                      First-time residential customers · Applied directly to initial quote
                    </p>
                  </div>
                </div>

                {quoteHref && (
                  <Button
                    href={quoteHref}
                    size="sm"
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shrink-0 self-start sm:self-auto"
                  >
                    Claim Offer
                  </Button>
                )}
              </div>
            )}

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
                          Request quote →
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
          {/* SECTION 2: RECENT WORK & PROJECT PHOTOS                     */}
          {/* ============================================================ */}
          <section id="sec-projects" className="scroll-mt-[135px] border-b border-line/60 pb-10 sm:pb-12 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl sm:text-[22px] font-semibold text-title tracking-tight">
                  Recent Work &amp; Photos
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-muted">
                  Completed residential projects by {effectiveBusinessName}
                </p>
              </div>
              <span className="text-xs font-medium text-muted">{gallery.length} photos</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(item.image)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-smoke cursor-pointer shadow-2xs border border-line/60"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                    <span className="truncate">{item.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 3: VERIFIED CUSTOMER REVIEWS                        */}
          {/* ============================================================ */}
          <section id="sec-reviews" className="scroll-mt-[135px] border-b border-line/60 pb-10 sm:pb-12 space-y-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="font-display text-xl sm:text-[22px] font-semibold text-title tracking-tight">
                  Customer Reviews
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-muted">
                  Feedback from verified homeowners in Austin
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold text-title">
                  {pro.rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                  ))}
                </div>
                <span className="text-xs text-muted">({pro.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-muted mr-1">Filter:</span>
              {reviewTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedReviewTag(tag.id)}
                  className={cn(
                    "rounded-full px-3 py-0.5 text-xs font-medium transition-colors",
                    selectedReviewTag === tag.id
                      ? "bg-title text-white font-semibold"
                      : "bg-surface text-copy hover:bg-smoke border border-line/60"
                  )}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <div className="divide-y divide-line/60 pt-1">
              {filteredReviews.map((rev) => (
                <div key={rev.id} className="py-5 first:pt-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-title">
                        {rev.author}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <Check className="h-3 w-3 stroke-[3]" /> Verified Hire
                      </span>
                      <span className="text-xs text-muted">• {rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <p className="font-sans text-xs sm:text-sm leading-relaxed text-copy">{rev.text}</p>

                  {rev.reply && (
                    <div className="border-l-2 border-primary/30 pl-3.5 py-1 mt-2.5 space-y-0.5">
                      <p className="text-xs font-semibold text-primary">
                        Response from {effectiveBusinessName}
                      </p>
                      <p className="text-xs text-muted">{rev.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 4: ABOUT & CREDENTIALS                              */}
          {/* ============================================================ */}
          <section id="sec-about" className="scroll-mt-[135px] border-b border-line/60 pb-10 sm:pb-12 space-y-5">
            <div>
              <h2 className="font-display text-xl sm:text-[22px] font-semibold text-title tracking-tight">
                About &amp; Credentials
              </h2>
              <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-copy">
                {effectiveBio}
              </p>
            </div>

            {/* Clean Key Info Strip (No giant grey boxes) */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs pt-1">
              <div className="rounded-2xl border border-line/70 bg-white p-4 space-y-1.5 shadow-2xs">
                <p className="font-semibold text-title text-xs flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Business Hours
                </p>
                <p className="text-copy text-xs">
                  <strong>Mon – Fri:</strong> {displayHours?.weekdays ?? "7:30 AM – 6:00 PM"}
                </p>
                <p className="text-copy text-xs">
                  <strong>Sat:</strong> {displayHours?.saturday ?? "8:00 AM – 4:00 PM"}
                </p>
                <p className="text-primary font-medium text-[11px] pt-1">
                  24/7 emergency dispatch for urgent leaks
                </p>
              </div>

              <div className="rounded-2xl border border-line/70 bg-white p-4 space-y-1.5 shadow-2xs">
                <p className="font-semibold text-title text-xs flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                  Accepted Payment Methods
                </p>
                <p className="text-copy text-xs leading-relaxed">
                  {displayPayments ? displayPayments.join(", ") : "Credit/Debit Card, Zelle, Bank ACH, Check, Cash"}
                </p>
                <p className="text-muted text-[11px] pt-1">
                  Paid directly upon 100% completed inspection
                </p>
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
          <div className="rounded-2xl border border-line/80 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            {/* Price & Overview */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl sm:text-3xl font-bold text-title">
                  ${effectiveStartingPrice}
                </span>
                <span className="text-xs text-muted font-medium">starting rate</span>
              </div>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                Upfront itemized estimate agreed before work begins.
              </p>
            </div>

            {/* Essential Highlights (Concise, no repetitive bullet noise) */}
            <div className="space-y-2 pt-3 border-t border-line/60 text-xs text-title">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Serving {pro.city} &amp; {pro.radiusMiles}-mile radius</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Next available: Tomorrow</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>1-Year Workmanship Warranty</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {quoteHref ? (
                <Button
                  href={quoteHref}
                  size="lg"
                  className="w-full justify-center text-xs sm:text-sm font-semibold rounded-xl shadow-xs"
                >
                  Request a Free Quote ↗
                </Button>
              ) : null}

              {messageHref ? (
                <Button
                  href={messageHref}
                  variant="ghost"
                  size="lg"
                  className="w-full justify-center text-xs sm:text-sm font-semibold rounded-xl"
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                  Message Directly
                </Button>
              ) : null}
            </div>

            {/* Clean Trust Footnote */}
            <p className="pt-2 text-center text-[11px] text-muted border-t border-line/50">
              Direct contractor hiring · Zero booking fees
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
