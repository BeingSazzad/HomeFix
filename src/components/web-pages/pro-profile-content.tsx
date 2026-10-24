"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Award,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
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
import {
  serviceLines,
  tradeDefaultServices,
  tradeDefaultReviews,
} from "@/lib/pro-extras";
import { loginHref } from "@/lib/role-access";
import { toggleFavorite } from "@/redux/slices/featuresSlice";
import { useRoleAccess } from "@/hooks/use-role-access";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Professional } from "@/types";
import { GuaranteeCard } from "@/components/shared/guarantee-protection";
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

  const [activeTab, setActiveTab] = useState<"about" | "services" | "reviews" | "faqs">("about");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedReviewTag, setSelectedReviewTag] = useState("all");
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [bioExpanded, setBioExpanded] = useState(false);

  const proProfile = useAppSelector((state) => state.features.proProfile);
  const isDemoPro = pro.id === "pro-1";

  const defaultBio =
    pro.categorySlug === "house-cleaning"
      ? "We’re a full-time, professional cleaning team serving both residential and commercial clients. Our experience includes recurring home cleanings, Airbnb turnovers, apartment move-in/move-out services, and office or commercial property cleaning."
      : pro.bio && pro.bio.length > 50
      ? pro.bio
      : "We’re a full-time, professional team serving both residential and commercial clients across the Austin metro area. Our experience includes recurring property care, urgent service calls, certified diagnostics, and complete installation services with guaranteed workmanship.";

  const effectiveBio = isDemoPro && proProfile?.bio ? proProfile.bio : defaultBio;
  const isBioLong = effectiveBio.length > 420;
  const effectiveStartingPrice = isDemoPro && proProfile?.startingPrice ? proProfile.startingPrice : pro.startingPrice;

  const replyTime = useMemo(() => {
    if (pro.emergency) return "~15 mins";
    const lower = (pro.responseTime || "").toLowerCase();
    if (lower.includes("min")) {
      const match = lower.match(/\d+/);
      return match ? `~${match[0]} mins` : "~15 mins";
    }
    if (/\b1\s*hour/.test(lower) || lower.includes("under 1")) return "~15 mins";
    if (/\b2\s*hour/.test(lower)) return "~20 mins";
    if (/\b3\s*hour/.test(lower)) return "~25 mins";
    if (/\b4\s*hour/.test(lower)) return "~30 mins";
    const idNum = pro.id.replace(/\D/g, "");
    const num = idNum ? parseInt(idNum, 10) : 1;
    const mins = [15, 20, 15, 20, 25, 15][num % 6] || 15;
    return `~${mins} mins`;
  }, [pro.id, pro.responseTime, pro.emergency]);

  const categoryServices = tradeDefaultServices[pro.categorySlug] ?? tradeDefaultServices.plumbing ?? [];
  const displayServices = isDemoPro && proProfile?.services?.length ? proProfile.services : categoryServices;

  const businessHours = isDemoPro && proProfile?.businessHours ? proProfile.businessHours : {
    weekdays: "7:30 AM – 6:00 PM",
    saturday: pro.emergency ? "8:00 AM – 4:00 PM" : "9:00 AM – 1:00 PM",
    sunday: pro.emergency ? "Emergency dispatch only" : "Closed",
  };

  const similarJobsCount = Math.max(7, Math.round(pro.jobsCompleted * 0.12));

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

  // Realistic trade-verified reviews
  const tradeReviewGen = tradeDefaultReviews[pro.categorySlug] ?? tradeDefaultReviews.plumbing;
  const defaultReviews = useMemo(
    () => tradeReviewGen(pro.name, pro.city),
    [tradeReviewGen, pro.name, pro.city]
  );

  const allReviews = useMemo(() => {
    type ReviewEntry = {
      id: string;
      author: string;
      location: string;
      date: string;
      rating: number;
      tag: "punctual" | "fair-price" | "clean-work";
      project: string;
      text: string;
      reply?: string;
    };

    const userMapped: ReviewEntry[] = seedReviews.map((r, i) => ({
      id: r.id,
      author: r.author,
      location: `${pro.city}, ${pro.state}`,
      date: `${i + 1} month ago`,
      rating: r.rating,
      tag: (i % 2 === 0 ? "clean-work" : "fair-price") as "clean-work" | "fair-price" | "punctual",
      project: `${pro.trade} Service`,
      text: r.body,
      reply: r.reply ?? undefined,
    }));

    // Merge so seedReviews (e.g. Elena Ruiz) are first, followed by verified default reviews
    const combined: ReviewEntry[] = [...userMapped];
    for (const def of defaultReviews) {
      if (!combined.some((item) => item.text.trim() === def.text.trim() || item.id === def.id)) {
        combined.push({
          ...def,
          location: def.location || `${pro.city}, ${pro.state}`,
        });
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

  // Service list with category & specialty filter
  const servicesList = useMemo(() => {
    if (!displayServices || displayServices.length === 0) return [];
    if (selectedCategoryFilter === "all") return displayServices;
    const q = selectedCategoryFilter.toLowerCase();
    return displayServices.filter((s) => {
      const cat = ("category" in s && typeof s.category === "string" ? s.category : "").toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        cat.includes(q)
      );
    });
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
      q: `Are you licensed and insured in ${pro.state}?`,
      a: pro.licensed
        ? `Yes. Active state trade licensing and $1,000,000 General Liability coverage. All credentials are fully verified by LocalHomeFix.`
        : `Yes. Active $1,000,000 General Liability insurance coverage. We strictly comply with all local municipal guidelines and safety standards.`,
    },
    {
      q: "What warranty do you provide on completed work?",
      a: "We back all completed labor with a 1-year contractor workmanship warranty. All replacement hardware, parts, and equipment carry their full manufacturer warranty.",
    },
    {
      q: "How quickly can you start or dispatch?",
      a: pro.emergency
        ? `We offer priority same-day emergency dispatch across ${pro.city} and standard appointments within 24–48 hours.`
        : `Standard service calls are usually booked within 24–48 hours, with flexible morning and afternoon arrival windows.`,
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
        </div>

        {/* 4. SUB-NAVIGATION TAB RIBBON */}
        <div className="sticky top-[74px] z-30 border-t border-line/70 bg-white/95 backdrop-blur-md shadow-xs">
          <div className="container-site flex items-center justify-between gap-4">
            <div className="flex gap-2 sm:gap-6 overflow-x-auto py-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: "sec-about", tabId: "about", label: "About" },
                { id: "sec-services", tabId: "services", label: "Services & Rates" },
                { id: "sec-reviews", tabId: "reviews", label: `Reviews (${allReviews.length})` },
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
          {/* SECTION 1: ABOUT & OVERVIEW                                  */}
          {/* ============================================================ */}
          <section id="sec-about" className="scroll-mt-[135px] border-b border-line/60 pb-10 sm:pb-12 space-y-6">
            <div>
              <h2 className="font-display text-xl sm:text-[22px] font-semibold text-title tracking-tight">
                About
              </h2>
              <div className="mt-2.5 max-w-3xl">
                <p
                  className={cn(
                    "font-sans text-sm sm:text-[15px] leading-relaxed text-copy transition-all duration-200 whitespace-pre-line",
                    isBioLong && !bioExpanded && "line-clamp-3 sm:line-clamp-4"
                  )}
                >
                  {effectiveBio}
                </p>
                {isBioLong && (
                  <button
                    type="button"
                    onClick={() => setBioExpanded(!bioExpanded)}
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
                  >
                    <span>{bioExpanded ? "Show less" : "Read more"}</span>
                    {bioExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Professional Highlights & Operations (Unboxed, Clean Senior Architecture) */}
            <div className="pt-6 border-t border-line/60 grid gap-8 md:grid-cols-12 md:items-start">
              {/* Left Column (7 cols): Verified Highlights */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted">
                    Contractor Highlights
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Verified Professional</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-1">
                  {/* Hired Times */}
                  <div className="flex items-start gap-2.5">
                    <Award className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-display text-sm font-semibold text-title">
                        Hired {pro.jobsCompleted || 65} times
                      </p>
                      <p className="text-xs text-muted">Verified local bookings</p>
                    </div>
                  </div>

                  {/* Local Jobs */}
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-display text-sm font-semibold text-title">
                        {similarJobsCount} local jobs
                      </p>
                      <p className="text-xs text-muted">Completed near {pro.city}</p>
                    </div>
                  </div>

                  {/* Background Checked */}
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-display text-sm font-semibold text-title flex items-center gap-1.5">
                        Background checked
                        <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[2.5]" />
                      </p>
                      <p className="text-xs text-muted">Identity &amp; record verified</p>
                    </div>
                  </div>

                  {/* Years in Business */}
                  <div className="flex items-start gap-2.5">
                    <Calendar className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-display text-sm font-semibold text-title">
                        {pro.yearsInBusiness
                          ? pro.yearsInBusiness.includes("year")
                            ? pro.yearsInBusiness
                            : `${pro.yearsInBusiness} in business`
                          : "1+ years in business"}
                      </p>
                      <p className="text-xs text-muted">Trade experience</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Licensed, background-screened &amp; backed by HomeFix Guarantee</span>
                </div>
              </div>

              {/* Right Column (5 cols): Business Hours & Response */}
              <div className="md:col-span-5 md:pl-6 md:border-l md:border-line/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    Business Hours
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open today
                  </span>
                </div>

                {businessHours ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 text-copy border-b border-line/30">
                      <span className="text-muted">Monday – Friday</span>
                      <span className="font-medium text-title">{businessHours.weekdays}</span>
                    </div>
                    <div className="flex justify-between py-1 text-copy border-b border-line/30">
                      <span className="text-muted">Saturday</span>
                      <span className="font-medium text-title">{businessHours.saturday}</span>
                    </div>
                    <div className="flex justify-between py-1 text-copy border-b border-line/30">
                      <span className="text-muted">Sunday</span>
                      <span
                        className={cn(
                          "font-medium",
                          pro.emergency ? "text-amber-700 font-semibold" : "text-muted"
                        )}
                      >
                        {businessHours.sunday}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted">Business hours available upon inquiry.</p>
                )}

                <div className="flex items-center justify-between pt-1 text-xs text-muted">
                  <span>Typical response time</span>
                  <span className="font-semibold text-title">{pro.responseTime || "Usually under 1 hour"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 2: SERVICES & UPFRONT RATES                         */}
          {/* ============================================================ */}
          <section id="sec-services" className="scroll-mt-[135px] border-b border-line/60 pb-10 sm:pb-12 space-y-6">

            <div>
              <h2 className="font-display text-xl sm:text-[22px] font-semibold text-title tracking-tight">
                Services &amp; Upfront Rates
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-muted">
                Guaranteed upfront pricing agreed before work begins · No hidden travel fees
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
                        <h4 className="font-display text-sm font-semibold text-title">
                          {rev.author}
                        </h4>
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
          {/* SECTION 4: FREQUENTLY ASKED QUESTIONS                       */}
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
        <aside className="lg:col-span-4 lg:sticky lg:top-[135px] space-y-3.5">
          <div className="rounded-2xl border border-line/80 bg-white p-5 sm:p-6 shadow-md space-y-5">
            {/* Price & Response Speed Header */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-bold text-title tracking-tight">
                    ${effectiveStartingPrice}
                  </span>
                  <span className="text-xs font-medium text-muted">starting estimate</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 border border-emerald-200/80 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Replies in {replyTime}
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

          {/* LocalHomeFix Guarantee Trust Card (Placed below the box, without price) */}
          <GuaranteeCard variant="compact" />
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
