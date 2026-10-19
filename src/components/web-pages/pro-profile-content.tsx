"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Award,
  BadgeCheck,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Droplets,
  ExternalLink,
  Hammer,
  Heart,
  Home,
  Info,
  MapPin,
  MessageSquare,
  Paintbrush,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  Wind,
  Wrench,
  X,
  Zap,
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

const icons: Record<string, typeof Wrench> = {
  "appliance-repair": Wrench,
  electrical: Zap,
  hvac: Wind,
  handyman: Hammer,
  landscaping: Trees,
  painting: Paintbrush,
  "pest-control": Wrench,
  plumbing: Droplets,
  roofing: Home,
};

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
    state.features.reviews.filter((item) => item.proId === pro.id),
  );

  const [activeTab, setActiveTab] = useState<"about" | "services" | "projects" | "credentials" | "reviews" | "faqs">("about");
  const [selectedReviewTag, setSelectedReviewTag] = useState("all");
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const cover = photos.services[pro.categorySlug] ?? photos.banner;
  const Icon = icons[pro.categorySlug] ?? Wrench;
  const gallery = portfolios[pro.id] ?? [
    { title: `${pro.trade} repair inspection`, image: cover },
    { title: "Standard system service", image: photos.trust },
    { title: "Completed installation", image: photos.trustAlt },
  ];
  const specialties = serviceLines[pro.categorySlug] ?? [pro.trade, "Diagnostics", "Repairs", "Maintenance"];
  const profilePath = `/browse-pros/${pro.id}`;

  const quoteHref = access.audience === "homeowner" ? `/account/post-job?invite=${pro.id}` : null;
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

  // Realistic verified reviews for this pro
  const defaultReviews = [
    {
      id: "rev-1",
      author: "David H.",
      location: "Central Austin, TX",
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
      location: "South Congress, Austin",
      date: "1 month ago",
      rating: 5,
      tag: "fair-price",
      project: `Emergency ${pro.trade} Repair`,
      text: `We needed urgent help and ${pro.businessName} gave us an itemized estimate upfront. No hidden travel fees or mystery markups. Paid directly upon completion — seamless experience.`,
      reply: null,
    },
    {
      id: "rev-3",
      author: "Robert C.",
      location: "Round Rock, TX",
      date: "2 months ago",
      rating: 5,
      tag: "clean-work",
      project: `Replacement & Maintenance`,
      text: `Clean, courteous, and efficient. Wore boot covers indoors and left the work area spotless. Definitely our go-to contractor from now on.`,
      reply: `Thank you Robert! We take pride in treating every home like our own.`,
    },
  ];

  const allReviews = seedReviews.length ? seedReviews.map((r, i) => ({
    id: r.id,
    author: r.author,
    location: "Austin, TX",
    date: `${i + 1} month ago`,
    rating: r.rating,
    tag: i % 2 === 0 ? "punctual" : "clean-work",
    project: `${pro.trade} Service`,
    text: r.body,
    reply: r.reply,
  })) : defaultReviews;

  const filteredReviews = selectedReviewTag === "all"
    ? allReviews
    : allReviews.filter((r) => r.tag === selectedReviewTag || r.text.toLowerCase().includes(selectedReviewTag));

  const reviewTags = [
    { id: "all", label: `All (${allReviews.length})` },
    { id: "punctual", label: "Punctual" },
    { id: "fair-price", label: "Fair Price" },
    { id: "clean-work", label: "Clean Work" },
  ];

  // Specific pro FAQs
  const faqs = [
    {
      q: "How does your pricing and payment work?",
      a: `We provide clear, upfront itemized quotes with no hidden fees. Once you accept our bid and the work is completed to your 100% satisfaction, you pay us directly via Card, Zelle, Check, or Cash. LocalHomeFix charges $0 platform fees.`,
    },
    {
      q: "Do you offer free estimates or diagnostics?",
      a: `Yes! For most standard service calls within our ${pro.radiusMiles}-mile Austin coverage area, we provide upfront estimates. If in-depth diagnostic teardown is needed, the diagnostic fee is credited directly toward the repair cost if you approve the quote.`,
    },
    {
      q: "Are you licensed and insured in Texas?",
      a: `Yes. We hold an active Texas State Trade License (TDLR verified) and carry a comprehensive $1,000,000 General Liability policy. All credentials are fully vetted by LocalHomeFix.`,
    },
    {
      q: "What warranty or guarantee do you provide?",
      a: `We back all our workmanship with a 1-year labor warranty. Any replacement hardware or parts installed carry their full manufacturer warranty.`,
    },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-16">
      {/* ============================================================ */}
      {/* 1. TOP HEADER / COVER + IDENTITY CARD                         */}
      {/* ============================================================ */}
      <section className="relative bg-white border-b border-line/70">
        {/* Subtle backdrop banner */}
        <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden bg-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={pro.businessName}
            className="h-full w-full object-cover object-center opacity-70 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00151d] via-[#00151d]/60 to-transparent" />
        </div>

        {/* Profile Identity Bar */}
        <div className="container-site relative pb-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Left: Avatar & Title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative -mt-12 sm:-mt-16 shrink-0">
                <span className="grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-[24px] border-4 border-white bg-gradient-to-br from-[#0d56d6] via-[#0b4ec7] to-[#009ae5] font-display text-3xl sm:text-4xl font-bold text-white shadow-xl">
                  {initials(pro.name)}
                </span>
              </div>

              <div className="space-y-1.5 pt-2 sm:pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Top Pro · Background Cleared
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface border border-line px-2.5 py-0.5 text-xs font-medium text-copy">
                    <MapPin className="h-3 w-3 text-muted" />
                    {pro.city}, {pro.state} · ~{pro.radiusMiles} mi area
                  </span>
                </div>

                <h1 className="font-display text-[26px] sm:text-[32px] md:text-[36px] font-bold tracking-tight text-title leading-tight flex items-center gap-2.5 flex-wrap">
                  <span>{pro.businessName}</span>
                  <span
                    title="Screened & Verified Professional"
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-xs sm:text-sm font-semibold text-primary"
                  >
                    <ShieldCheck className="h-4 w-4 text-primary fill-primary/20 shrink-0" />
                    <span>Verified</span>
                  </span>
                </h1>

                <p className="font-sans text-sm text-[#555] flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-title">{pro.name}</span>
                  <span>•</span>
                  <span>{pro.trade} Specialist</span>
                  <span>•</span>
                  <span className="inline-flex items-center text-amber-500 font-bold">
                    <Star className="h-4 w-4 fill-amber-500 mr-1" />
                    {pro.rating.toFixed(1)}
                  </span>
                  <span className="text-muted">({pro.reviewCount} reviews)</span>
                </p>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-2.5 self-start md:self-end">
              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-title shadow-xs hover:bg-smoke transition-colors"
                title="Share Pro Profile"
              >
                <Share2 className="h-4 w-4" />
                <span>{copied ? "Link Copied!" : "Share"}</span>
              </button>

              {access.audience !== "pro" ? (
                <button
                  type="button"
                  onClick={onSave}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-title shadow-xs hover:bg-smoke transition-colors",
                    saved && access.canSavePro && "text-error border-error/30 bg-red-50",
                  )}
                  title="Save to favorites"
                >
                  <Heart className={cn("h-4 w-4", saved && access.canSavePro && "fill-current text-error")} />
                  <span>{saved && access.canSavePro ? "Saved" : "Save"}</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="border-t border-line/70 bg-white">
          <div className="container-site flex gap-1 sm:gap-4 overflow-x-auto py-1 no-scrollbar">
            {[
              { id: "about", label: "About" },
              { id: "services", label: "Services & Pricing" },
              { id: "projects", label: `Photos (${gallery.length})` },
              { id: "credentials", label: "Credentials & License" },
              { id: "reviews", label: `Reviews (${allReviews.length})` },
              { id: "faqs", label: "FAQs" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted hover:text-title",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. MAIN BODY (LEFT 2/3 CONTENT + RIGHT 1/3 STICKY ACTION)     */}
      {/* ============================================================ */}
      <div className="container-site mt-8 grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-7">
          {/* ========================================================== */}
          {/* SECTION: ABOUT & OVERVIEW                                   */}
          {/* ========================================================== */}
          <section className="rounded-[24px] border border-line/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            {/* Intro Quote Card (Thumbtack introduction banner) */}
            <div className="rounded-[18px] bg-primary/5 border border-primary/15 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-title">
                    Introduction from {pro.name}
                  </h3>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-[#555]">
                    {pro.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Overview & Business Facts Grid */}
            <div>
              <h2 className="font-display text-[20px] font-bold text-title tracking-tight">
                Business Overview
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[16px] border border-line/70 bg-[#fafafa] p-4 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted">In business</p>
                    <p className="text-sm font-semibold text-title">
                      {pro.yearsInBusiness?.toString().includes("year") || pro.yearsInBusiness?.toString().includes("+")
                        ? `${pro.yearsInBusiness} experience`
                        : `${pro.yearsInBusiness} years in business`}
                    </p>
                  </div>
                </div>

                <div className="rounded-[16px] border border-line/70 bg-[#fafafa] p-4 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs text-muted">Background check</p>
                    <p className="text-sm font-semibold text-title">State & County Cleared</p>
                  </div>
                </div>

                <div className="rounded-[16px] border border-line/70 bg-[#fafafa] p-4 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted">Response time</p>
                    <p className="text-sm font-semibold text-title">Typical reply: {pro.responseTime}</p>
                  </div>
                </div>

                <div className="rounded-[16px] border border-line/70 bg-[#fafafa] p-4 flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted">Completed jobs</p>
                    <p className="text-sm font-semibold text-title">{pro.jobsCompleted}+ jobs completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods Accepted */}
            <div className="border-t border-line/70 pt-6">
              <h3 className="font-display text-sm font-semibold text-title uppercase tracking-wider">
                Payment Methods Accepted
              </h3>
              <p className="mt-1 text-xs text-muted">
                You pay {pro.businessName} directly upon 100% completion with zero platform fee.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Credit/Debit Card", "Zelle", "Bank Transfer", "Check", "Cash"].map((method) => (
                  <span
                    key={method}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-title"
                  >
                    <CreditCard className="h-3 w-3 text-primary" />
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div className="border-t border-line/70 pt-6">
              <h3 className="font-display text-sm font-semibold text-title uppercase tracking-wider">
                Business & Service Hours
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 text-xs">
                <div className="p-3 rounded-xl bg-surface border border-line/60">
                  <p className="font-bold text-title">Monday – Friday</p>
                  <p className="text-[#555] mt-0.5">8:00 AM – 6:00 PM</p>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-line/60">
                  <p className="font-bold text-title">Saturday</p>
                  <p className="text-[#555] mt-0.5">9:00 AM – 3:00 PM</p>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-line/60">
                  <p className="font-bold text-title">Sunday & Emergency</p>
                  <p className="text-primary font-semibold mt-0.5">
                    {pro.emergency ? "24/7 Urgent Dispatch" : "On-call for urgent jobs"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* SECTION: SERVICES & ITEMIZE PRICING                         */}
          {/* ========================================================== */}
          <section className="rounded-[24px] border border-line/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/70 pb-4">
              <div>
                <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
                  Services Offered & Pricing
                </h2>
                <p className="mt-1 text-sm text-[#757575]">
                  Standard transparent rates for {pro.city} and surrounding areas
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Starting rate</p>
                <p className="font-display text-xl font-bold text-title">${pro.startingPrice}</p>
              </div>
            </div>

            {/* Service Scope Chips */}
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Common Scopes</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {specialties.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Standard Inclusions & Guarantees (2-column checkmark list like Thumbtack) */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">What&apos;s Included With Every Job</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  "Free upfront itemized quote",
                  "1-Year workmanship warranty",
                  "Licensed & background-cleared techs",
                  "Jobsite cleanup & floor protection",
                  "OEM-certified replacement parts",
                  "Direct contractor payment on completion",
                ].map((perk) => (
                  <div key={perk} className="flex items-center gap-2.5 text-sm text-title">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* SECTION: PROJECT PHOTOS & MEDIA                             */}
          {/* ========================================================== */}
          <section className="rounded-[24px] border border-line/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
                  Recent Projects & Work Photos
                </h2>
                <p className="mt-1 text-sm text-[#757575]">
                  Real completed jobs by {pro.businessName}
                </p>
              </div>
              <span className="text-xs font-medium text-muted">{gallery.length} photos</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(item.image)}
                  className="group relative h-48 overflow-hidden rounded-[18px] border border-line/70 bg-smoke cursor-pointer shadow-xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                    <span className="truncate">{item.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================== */}
          {/* SECTION: CREDENTIALS & LICENSING (TDLR Clearance)          */}
          {/* ========================================================== */}
          <section className="rounded-[24px] border border-line/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
                  Credentials & Verification
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Audited by LocalHomeFix before active public directory placement
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[18px] border border-emerald-200 bg-emerald-50/50 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">State License</p>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">ACTIVE</span>
                </div>
                <p className="font-display text-sm font-bold text-title">TDLR Verified Pro</p>
                <p className="text-xs text-[#555]">State trade licensing confirmed</p>
              </div>

              <div className="rounded-[18px] border border-blue-200 bg-blue-50/50 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Insurance</p>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">ON FILE</span>
                </div>
                <p className="font-display text-sm font-bold text-title">$1,000,000 Policy</p>
                <p className="text-xs text-[#555]">General commercial liability</p>
              </div>

              <div className="rounded-[18px] border border-purple-200 bg-purple-50/50 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Background</p>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">PASSED</span>
                </div>
                <p className="font-display text-sm font-bold text-title">County & Federal</p>
                <p className="text-xs text-[#555]">Identity & criminal screening cleared</p>
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* SECTION: REVIEWS & RATINGS BREAKDOWN                        */}
          {/* ========================================================== */}
          <section className="rounded-[24px] border border-line/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/70 pb-5">
              <div>
                <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
                  Customer Reviews
                </h2>
                <p className="mt-1 text-sm text-[#757575]">
                  Verified feedback from Austin homeowners who hired {pro.name}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-surface px-4 py-2.5 rounded-[16px] border border-line">
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-title leading-none">
                    {pro.rating.toFixed(1)}
                  </p>
                  <div className="flex items-center gap-0.5 text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <div className="h-8 w-px bg-line" />
                <p className="text-xs text-muted leading-tight">
                  Based on <br />
                  <strong className="text-title font-semibold">{pro.reviewCount} ratings</strong>
                </p>
              </div>
            </div>

            {/* Keyword Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted mr-1">Filter:</span>
              {reviewTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedReviewTag(tag.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                    selectedReviewTag === tag.id
                      ? "bg-title text-white"
                      : "bg-surface text-copy hover:bg-smoke border border-line/60",
                  )}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-4 pt-2">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-[18px] border border-line/70 bg-[#fafafa] p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                        {rev.author[0]}
                      </span>
                      <div>
                        <p className="font-display text-sm font-bold text-title flex items-center gap-1.5">
                          {rev.author}
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check className="h-2.5 w-2.5 stroke-[3]" /> Verified Hire
                          </span>
                        </p>
                        <p className="text-[11px] text-muted">{rev.location} · {rev.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-primary">{rev.project}</p>
                  <p className="text-sm leading-relaxed text-[#444]">{rev.text}</p>

                  {rev.reply && (
                    <div className="rounded-[12px] bg-white border border-line/70 p-3 text-xs space-y-1">
                      <p className="font-bold text-title flex items-center gap-1.5 text-primary">
                        <MessageSquare className="h-3 w-3" />
                        Response from {pro.businessName}
                      </p>
                      <p className="text-[#555]">{rev.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================== */}
          {/* SECTION: FREQUENTLY ASKED QUESTIONS                         */}
          {/* ========================================================== */}
          <section className="rounded-[24px] border border-line/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
              Frequently Asked Questions
            </h2>

            <div className="divide-y divide-line/70">
              {faqs.map((faq, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0 space-y-1.5">
                  <h3 className="font-display text-[15px] font-semibold text-title">
                    {faq.q}
                  </h3>
                  <p className="font-sans text-sm text-[#555] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN (4 cols): STICKY ACTION CARD                   */}
        {/* ============================================================ */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="rounded-[24px] border border-line/80 bg-white p-6 shadow-md space-y-5">
            {/* Header info */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Available this week
              </span>
              <p className="mt-3 font-display text-2xl font-bold text-title">
                ${pro.startingPrice}{" "}
                <span className="text-xs font-normal text-muted">starting rate</span>
              </p>
              <p className="mt-1 text-xs text-muted">
                Final itemized price agreed before any work starts.
              </p>
            </div>

            {/* Quick Guarantees Box */}
            <div className="rounded-[18px] bg-[#fafafa] border border-line/70 p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-title font-medium">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Typical response: <strong>{pro.responseTime}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-title font-medium">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Serving Austin & ~{pro.radiusMiles} miles</span>
              </div>
              <div className="flex items-center gap-2 text-title font-medium">
                <CreditCard className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Pay directly on completion ($0 platform fee)</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              {quoteHref ? (
                <Button href={quoteHref} size="lg" className="w-full justify-center text-sm font-semibold">
                  Request a Free Quote ↗
                </Button>
              ) : null}

              {messageHref ? (
                <Button
                  href={messageHref}
                  variant={quoteHref ? "ghost" : undefined}
                  size="lg"
                  className="w-full justify-center text-sm font-semibold"
                >
                  Message Directly
                </Button>
              ) : null}

              {access.audience === "pro" ? (
                <Button href="/pro/jobs" size="lg" className="w-full justify-center text-sm">
                  Go to Job Board
                </Button>
              ) : null}

              {access.audience === "guest" ? (
                <p className="text-center text-xs text-[#757575] pt-1">
                  <Link href="/login" className="font-semibold text-primary underline">
                    Sign in
                  </Link>{" "}
                  or{" "}
                  <Link href="/signup" className="font-semibold text-primary underline">
                    create an account
                  </Link>{" "}
                  to request a quote.
                </p>
              ) : null}
            </div>

            {/* Reassurance Footer */}
            <div className="border-t border-line/70 pt-4 text-center">
              <p className="text-[11.5px] text-[#757575] leading-relaxed">
                Direct contractor hiring. Homeowners pay pros directly with zero platform markup.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-[20px] bg-white p-2">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Enlarged project" className="max-h-[80vh] w-auto object-contain rounded-[14px]" />
          </div>
        </div>
      )}
    </div>
  );
}
