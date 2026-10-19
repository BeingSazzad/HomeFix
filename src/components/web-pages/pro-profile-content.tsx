"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Award,
  Calendar,
  Check,
  Clock,
  CreditCard,
  Droplets,
  ExternalLink,
  Hammer,
  Heart,
  Home,
  MapPin,
  MessageSquare,
  Paintbrush,
  Share2,
  ShieldCheck,
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

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
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
      project: `Urgent ${pro.trade} Repair`,
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
    <div className="bg-white min-h-screen pb-20">
      {/* ============================================================ */}
      {/* 1. TOP COVER BANNER                                          */}
      {/* ============================================================ */}
      <section className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden bg-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={pro.businessName}
          className="h-full w-full object-cover object-center opacity-70 filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00151d] via-[#00151d]/60 to-transparent" />
      </section>

      {/* ============================================================ */}
      {/* 2. PROFILE IDENTITY HEADER                                   */}
      {/* ============================================================ */}
      <section className="border-b border-line/60 bg-white">
        <div className="container-site relative pb-6 pt-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative -mt-12 sm:-mt-16 shrink-0">
                <span className="grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-[24px] border-4 border-white bg-gradient-to-br from-[#0d56d6] via-[#0b4ec7] to-[#009ae5] font-display text-3xl sm:text-4xl font-bold text-white shadow-xl">
                  {initials(pro.name)}
                </span>
              </div>

              <div className="space-y-1.5 pt-2 sm:pt-4">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-[26px] sm:text-[32px] md:text-[34px] font-bold tracking-tight text-title leading-tight inline-flex items-center gap-2">
                    <span>{pro.businessName}</span>
                    <span title="Screened & Verified Professional" className="inline-block -mt-0.5 align-middle">
                      <ShieldCheck
                        className="h-5 w-5 sm:h-6 sm:w-6 text-primary fill-primary/15"
                        aria-label="Verified Pro"
                      />
                    </span>
                  </h1>
                </div>

                <p className="font-sans text-sm text-[#555] flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-title">{pro.name}</span>
                  <span className="text-muted">•</span>
                  <span>{pro.trade} Specialist</span>
                  <span className="text-muted">•</span>
                  <span className="inline-flex items-center text-amber-500 font-bold">
                    <Star className="h-4 w-4 fill-amber-500 mr-1" />
                    {pro.rating.toFixed(1)}
                  </span>
                  <span className="text-muted">({pro.reviewCount} reviews)</span>
                  <span className="text-muted">•</span>
                  <span className="inline-flex items-center text-muted">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {pro.city}, {pro.state} (~{pro.radiusMiles} mi area)
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
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

        {/* Tab Ribbon - Understated, clean underline tabs */}
        <div className="border-t border-line/60 bg-white">
          <div className="container-site flex gap-2 sm:gap-6 overflow-x-auto py-0 no-scrollbar">
            {[
              { id: "sec-about", tabId: "about", label: "About" },
              { id: "sec-services", tabId: "services", label: "Services & Pricing" },
              { id: "sec-projects", tabId: "projects", label: `Photos (${gallery.length})` },
              { id: "sec-credentials", tabId: "credentials", label: "Credentials" },
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
                  "shrink-0 px-2 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
                  activeTab === tab.tabId
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
      {/* 3. MAIN CONTENT: CLEAN EDITORIAL FLOW + SINGLE RIGHT CARD     */}
      {/* ============================================================ */}
      <div className="container-site mt-10 grid gap-12 lg:grid-cols-12 items-start">
        {/* Left Column (8 cols): Flowing without noisy nested boxes */}
        <div className="lg:col-span-8 space-y-12">
          {/* ========================================================== */}
          {/* SECTION: ABOUT & OVERVIEW                                   */}
          {/* ========================================================== */}
          <section id="sec-about" className="border-b border-line/60 pb-12 space-y-6">
            <div>
              <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
                About {pro.name}
              </h2>
              <p className="mt-3 font-sans text-[15px] sm:text-[16px] leading-relaxed text-[#444]">
                {pro.bio}
              </p>
            </div>

            {/* Clean Highlights Strip - No grey boxes, just clean icons & typographic rhythm */}
            <div className="pt-2 flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-title">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <strong>
                    {pro.yearsInBusiness?.toString().includes("year") || pro.yearsInBusiness?.toString().includes("+")
                      ? pro.yearsInBusiness
                      : `${pro.yearsInBusiness} Years`}
                  </strong>{" "}
                  in business
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>State & County Cleared</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Replies: <strong>{pro.responseTime}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary shrink-0" />
                <span><strong>{pro.jobsCompleted}+</strong> completed jobs</span>
              </div>
            </div>

            {/* Working Hours & Payment - Minimalist inline notes */}
            <div className="pt-4 grid gap-4 sm:grid-cols-2 text-xs border-t border-line/40">
              <div>
                <p className="font-semibold text-muted uppercase tracking-wider">Business Hours</p>
                <p className="mt-1 text-title">
                  <strong>Mon – Fri:</strong> 8:00 AM – 6:00 PM · <strong>Sat:</strong> 9:00 AM – 3:00 PM
                </p>
                <p className="mt-0.5 text-primary font-medium">
                  {pro.emergency ? "24/7 Urgent Dispatch Available" : "Emergency on-call for urgent calls"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-muted uppercase tracking-wider">Accepted Direct Payments</p>
                <p className="mt-1 text-title">
                  Credit/Debit Card, Zelle, Bank Transfer, Check, or Cash
                </p>
                <p className="mt-0.5 text-muted">
                  Paid directly upon 100% completion ($0 platform fee)
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* SECTION: SERVICES & ITEMIZE PRICING                         */}
          {/* ========================================================== */}
          <section id="sec-services" className="border-b border-line/60 pb-12 space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
                  Services Offered
                </h2>
                <p className="mt-1 text-sm text-[#757575]">
                  Standard transparent rates for {pro.city} and surrounding communities
                </p>
              </div>
              <p className="text-sm font-semibold text-title">
                Starting from <span className="font-display text-xl font-bold text-title">${pro.startingPrice}</span>
              </p>
            </div>

            {/* Scope Chips */}
            <div className="flex flex-wrap gap-2">
              {specialties.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-surface border border-line px-3.5 py-1 text-xs font-medium text-title"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* What's Included Checklist - Airy 2-column checklist, no container boxes */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                What&apos;s Included With Every Service Call
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm text-[#333]">
                {[
                  "Free upfront itemized quote",
                  "1-Year workmanship warranty",
                  "Licensed & background-cleared techs",
                  "Jobsite cleanup & floor protection",
                  "OEM-certified replacement parts",
                  "Direct contractor payment on completion",
                ].map((perk) => (
                  <div key={perk} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* SECTION: PROJECT PHOTOS                                     */}
          {/* ========================================================== */}
          <section id="sec-projects" className="border-b border-line/60 pb-12 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
                  Recent Work & Projects
                </h2>
                <p className="mt-1 text-sm text-[#757575]">
                  Completed jobs by {pro.businessName}
                </p>
              </div>
              <span className="text-xs font-medium text-muted">{gallery.length} photos</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(item.image)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-smoke cursor-pointer shadow-xs"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                    <span className="truncate">{item.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================== */}
          {/* SECTION: CREDENTIALS & LICENSING                            */}
          {/* ========================================================== */}
          <section id="sec-credentials" className="border-b border-line/60 pb-12 space-y-5">
            <div>
              <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
                Credentials & Verification
              </h2>
              <p className="mt-1 text-sm text-[#757575]">
                Screened and audited by LocalHomeFix before active directory approval
              </p>
            </div>

            {/* Clean 3-item row - Minimalist, high trust, no loud box fills */}
            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>State License Active</span>
                </div>
                <p className="font-display text-sm font-bold text-title">TDLR Verified Pro</p>
                <p className="text-xs text-muted">Texas state trade licensing confirmed</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Insurance On File</span>
                </div>
                <p className="font-display text-sm font-bold text-title">$1,000,000 Policy</p>
                <p className="text-xs text-muted">General commercial liability coverage</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>Background Cleared</span>
                </div>
                <p className="font-display text-sm font-bold text-title">County & Federal</p>
                <p className="text-xs text-muted">Identity and criminal screening cleared</p>
              </div>
            </div>
          </section>

          {/* ========================================================== */}
          {/* SECTION: REVIEWS                                            */}
          {/* ========================================================== */}
          <section id="sec-reviews" className="border-b border-line/60 pb-12 space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
                  Customer Reviews
                </h2>
                <p className="mt-1 text-sm text-[#757575]">
                  Verified feedback from homeowners who hired {pro.name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-title">
                  {pro.rating.toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-xs text-muted">({pro.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted mr-1">Filter:</span>
              {reviewTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedReviewTag(tag.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    selectedReviewTag === tag.id
                      ? "bg-title text-white font-semibold"
                      : "bg-surface text-copy hover:bg-smoke border border-line/60",
                  )}
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Reviews List - Clean border-b dividers, no heavy card rectangles */}
            <div className="divide-y divide-line/60 pt-2">
              {filteredReviews.map((rev) => (
                <div key={rev.id} className="py-6 first:pt-2 space-y-2.5">
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
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <p className="font-sans text-sm leading-relaxed text-[#444]">
                    {rev.text}
                  </p>

                  {rev.reply && (
                    <div className="border-l-2 border-primary/30 pl-4 py-1 mt-3 space-y-0.5">
                      <p className="text-xs font-semibold text-primary">
                        Response from {pro.businessName}
                      </p>
                      <p className="text-xs text-[#555]">{rev.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================== */}
          {/* SECTION: FREQUENTLY ASKED QUESTIONS                         */}
          {/* ========================================================== */}
          <section id="sec-faqs" className="space-y-5">
            <h2 className="font-display text-[22px] font-bold text-title tracking-tight">
              Frequently Asked Questions
            </h2>

            <div className="divide-y divide-line/60">
              {faqs.map((faq, i) => (
                <div key={i} className="py-4 first:pt-1 space-y-1">
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
        {/* RIGHT COLUMN (4 cols): THE SINGLE ELEVATED ACTION CARD       */}
        {/* ============================================================ */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="rounded-[24px] border border-line/80 bg-white p-6 shadow-md space-y-5">
            {/* Price & Overview */}
            <div>
              <p className="font-display text-2xl font-bold text-title">
                ${pro.startingPrice}{" "}
                <span className="text-xs font-normal text-muted">starting rate</span>
              </p>
              <p className="mt-1 text-xs text-muted">
                Final itemized price agreed before any work starts.
              </p>
            </div>

            {/* Quick Guarantees (Clean list, no boxes inside boxes) */}
            <div className="space-y-2 pt-2 border-t border-line/60 text-xs text-title">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Typical response: <strong>{pro.responseTime}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span>Serving Austin & ~{pro.radiusMiles} miles</span>
              </div>
              <div className="flex items-center gap-2">
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
            <div className="border-t border-line/60 pt-4 text-center">
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
