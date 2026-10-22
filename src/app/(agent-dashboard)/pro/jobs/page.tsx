"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  EyeOff,
  Filter,
  Layers,
  MapPin,
  RotateCcw,
  Search,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { categories, getCategory } from "@/Mockdata";
import { photos } from "@/lib/media";
import { selectAllJobs } from "@/lib/marketplace";
import { useRoleAccess } from "@/hooks/use-role-access";
import { setLeadAction } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

type TabKey = "all" | "saved" | "urgent" | "matches";
type SortKey = "newest" | "budget-high" | "urgent";

export default function ProJobsPage() {
  const dispatch = useAppDispatch();
  const { access } = useRoleAccess();
  const leadActions = useAppSelector((state) => state.features.leadActions);
  const allJobsRaw = useAppSelector(selectAllJobs);

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    undoJobId?: string;
  } | null>(null);

  // Pro trade (Luis Ortega is Master Plumber)
  const myTradeSlug = "plumbing";

  // Filter out completed / cancelled jobs
  const openJobs = useMemo(() => {
    return allJobsRaw.filter((job) => {
      const closed = [
        "completed",
        "cancelled",
        "hired",
        "scheduled",
        "in_progress",
        "awaiting_confirm",
        "disputed",
        "draft",
      ].includes(job.status);
      return !closed;
    });
  }, [allJobsRaw]);

  // Tab counts based on open jobs
  const counts = useMemo(() => {
    const activeNonDeclined = openJobs.filter(
      (job) => leadActions[job.id] !== "declined"
    );
    return {
      all: activeNonDeclined.length,
      saved: openJobs.filter((job) => leadActions[job.id] === "saved").length,
      urgent: activeNonDeclined.filter((job) => job.urgency === "asap").length,
      matches: activeNonDeclined.filter(
        (job) => job.categorySlug === myTradeSlug
      ).length,
    };
  }, [openJobs, leadActions, myTradeSlug]);

  // Filtered & sorted jobs
  const filteredJobs = useMemo(() => {
    return openJobs
      .filter((job) => {
        const action = leadActions[job.id] ?? "open";

        // Tab filter
        if (activeTab === "all") {
          if (action === "declined") return false;
        } else if (activeTab === "saved") {
          if (action !== "saved") return false;
        } else if (activeTab === "urgent") {
          if (action === "declined" || job.urgency !== "asap") return false;
        } else if (activeTab === "matches") {
          if (action === "declined" || job.categorySlug !== myTradeSlug)
            return false;
        }

        // Category filter
        if (selectedCategory !== "all" && job.categorySlug !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const categoryName = getCategory(job.categorySlug)?.name.toLowerCase() ?? "";
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchDesc = job.description.toLowerCase().includes(q);
          const matchCity = job.city.toLowerCase().includes(q);
          const matchZip = job.zip.includes(q);
          const matchCat = categoryName.includes(q);
          if (!matchTitle && !matchDesc && !matchCity && !matchZip && !matchCat) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "urgent") {
          const urgencyOrder: Record<string, number> = {
            asap: 1,
            this_week: 2,
            flexible: 3,
          };
          return (urgencyOrder[a.urgency] ?? 9) - (urgencyOrder[b.urgency] ?? 9);
        }
        if (sortBy === "budget-high") {
          // Approximate extraction of max budget
          const getBudgetValue = (bStr?: string) => {
            if (!bStr) return 0;
            if (bStr.includes("5,000")) return 5000;
            if (bStr.includes("1,000")) return 1000;
            if (bStr.includes("500")) return 500;
            return 100;
          };
          return getBudgetValue(b.budget) - getBudgetValue(a.budget);
        }
        // Default newest
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      });
  }, [openJobs, activeTab, selectedCategory, searchQuery, sortBy, leadActions, myTradeSlug]);

  const handleToggleSave = (jobId: string, currentAction: string) => {
    const nextAction = currentAction === "saved" ? "open" : "saved";
    dispatch(setLeadAction({ jobId, action: nextAction }));
    setToastMessage({
      text: nextAction === "saved" ? "Lead saved to your bookmarked list" : "Lead removed from saved list",
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleHideLead = (jobId: string) => {
    dispatch(setLeadAction({ jobId, action: "declined" }));
    setToastMessage({
      text: "Lead passed and removed from feed",
      undoJobId: jobId,
    });
    setTimeout(() => setToastMessage(null), 6000);
  };

  const handleUndo = (jobId: string) => {
    dispatch(setLeadAction({ jobId, action: "open" }));
    setToastMessage({ text: "Lead restored to your feed" });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Distinct trade pill styles
  const getCategoryTheme = (slug: string) => {
    switch (slug) {
      case "plumbing":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "electrical":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "painting":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "hvac":
        return "bg-cyan-50 text-cyan-800 border-cyan-200/80";
      case "roofing":
        return "bg-orange-50 text-orange-800 border-orange-200/80";
      case "landscaping":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/80";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/70 pb-5 pt-1">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-[22px] sm:text-[26px] font-semibold text-title tracking-tight">
              Available Jobs
            </h1>
            <span className="inline-flex items-center rounded-full bg-smoke px-3 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              {counts.all} active
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Direct repair requests from verified Austin homeowners. Review requirements and submit itemized quotes.
          </p>
        </div>

        {/* Trade Match Quick Stats */}
        <div className="hidden md:flex items-center gap-3 rounded-xl border border-line/70 bg-white px-3.5 py-2 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider">Your Trade</p>
            <p className="text-xs font-semibold text-title">Plumbing ({counts.matches} matched)</p>
          </div>
        </div>
      </div>

      {/* Toast Bar with Undo */}
      {toastMessage && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-title px-4 py-3 text-white shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage.text}</span>
          </div>
          {toastMessage.undoJobId && (
            <button
              type="button"
              onClick={() => {
                if (toastMessage.undoJobId) handleUndo(toastMessage.undoJobId);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-light hover:underline ml-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Undo
            </button>
          )}
        </div>
      )}

      {/* Modern Segmented Lead Tabs */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="inline-flex min-w-full sm:min-w-0 items-center gap-1.5 rounded-2xl border border-line/80 bg-smoke/80 p-1.5 shadow-2xs backdrop-blur-xs">
          {/* Tab 1: All Leads */}
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2 font-display text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "bg-white text-title shadow-xs border border-line/50"
                : "text-muted hover:text-title hover:bg-white/40 border border-transparent"
            }`}
          >
            <Layers className={`h-4 w-4 ${activeTab === "all" ? "text-primary" : "text-muted"}`} />
            <span>All Leads</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors ${
                activeTab === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-muted border border-line/60"
              }`}
            >
              {counts.all}
            </span>
          </button>

          {/* Tab 2: Trade Matches */}
          <button
            type="button"
            onClick={() => setActiveTab("matches")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2 font-display text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "matches"
                ? "bg-white text-title shadow-xs border border-line/50"
                : "text-muted hover:text-title hover:bg-white/40 border border-transparent"
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${activeTab === "matches" ? "text-emerald-600" : "text-muted"}`} />
            <span>Trade Matches</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors ${
                activeTab === "matches"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-surface text-muted border border-line/60"
              }`}
            >
              {counts.matches}
            </span>
          </button>

          {/* Tab 3: Urgent (24h) */}
          <button
            type="button"
            onClick={() => setActiveTab("urgent")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2 font-display text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "urgent"
                ? "bg-white text-title shadow-xs border border-line/50"
                : "text-muted hover:text-title hover:bg-white/40 border border-transparent"
            }`}
          >
            <Zap className={`h-4 w-4 ${activeTab === "urgent" ? "text-amber-500 fill-amber-500" : "text-muted"}`} />
            <span>Urgent (24h)</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors ${
                activeTab === "urgent"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-surface text-muted border border-line/60"
              }`}
            >
              {counts.urgent}
            </span>
          </button>

          {/* Tab 4: Saved for Later */}
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2 font-display text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "saved"
                ? "bg-white text-title shadow-xs border border-line/50"
                : "text-muted hover:text-title hover:bg-white/40 border border-transparent"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${activeTab === "saved" ? "text-primary fill-primary/20" : "text-muted"}`} />
            <span>Saved for Later</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold transition-colors ${
                activeTab === "saved"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-muted border border-line/60"
              }`}
            >
              {counts.saved}
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by title, issue, or Austin zip code..."
            className="w-full rounded-xl border border-line/80 bg-white py-2 pl-9 pr-8 text-xs sm:text-sm text-title placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-title"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Trade Filter Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-line/80 bg-white py-2 pl-3 pr-8 text-xs sm:text-sm font-medium text-title focus:border-primary focus:outline-none shadow-2xs cursor-pointer"
            >
              <option value="all">All Trades</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="rounded-xl border border-line/80 bg-white py-2 pl-3 pr-8 text-xs sm:text-sm font-medium text-title focus:border-primary focus:outline-none shadow-2xs cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="urgent">Urgency (ASAP first)</option>
              <option value="budget-high">Highest Budget</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content State Handling */}
      {!access.canSeeJobBoard ? (
        <div className="mt-8">
          <EmptyState
            title="Clearance required"
            description="Complete contractor application review before the live job board opens."
            actionLabel="Open application"
            href="/pro/application"
          />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-line/80 bg-white p-10 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-smoke text-muted mb-3">
            {activeTab === "saved" ? (
              <Bookmark className="h-6 w-6 text-primary" />
            ) : activeTab === "urgent" ? (
              <Zap className="h-6 w-6 text-amber-500" />
            ) : (
              <Filter className="h-6 w-6 text-muted" />
            )}
          </div>
          <h3 className="font-display text-base font-semibold text-title">
            {activeTab === "saved"
              ? "No saved leads yet"
              : activeTab === "urgent"
              ? "No urgent 24h leads right now"
              : searchQuery
              ? "No leads match your search"
              : "No leads currently open"}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-muted max-w-sm mx-auto">
            {activeTab === "saved"
              ? "Bookmark interesting jobs in the All Leads tab to save them for quote prep later."
              : searchQuery
              ? "Try clearing your search query or trade filter to see more available homeowner jobs."
              : "New home repair requests are posted daily. Check back soon or set up alerts."}
          </p>
          {(activeTab !== "all" || searchQuery || selectedCategory !== "all") && (
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Reset all filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Standard Job Cards */
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const action = leadActions[job.id] ?? "open";
            const category = getCategory(job.categorySlug);
            const image = photos.services[job.categorySlug] || photos.heroInset;
            const isSaved = action === "saved";
            const isTradeMatch = job.categorySlug === myTradeSlug;

            return (
              <div
                key={job.id}
                className="group relative rounded-2xl border border-line/80 bg-white p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:border-primary/40 hover:shadow-md"
              >
                {/* Top Badge Strip & Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-line/40">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category Tag */}
                    <span
                      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border ${getCategoryTheme(
                        job.categorySlug
                      )}`}
                    >
                      {category?.name ?? "General Repair"}
                    </span>

                    {/* Trade Match Badge */}
                    {isTradeMatch && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/80">
                        <CheckCircle2 className="h-3 w-3" />
                        Trade Match
                      </span>
                    )}

                    {/* Urgency Badge */}
                    {job.urgency === "asap" ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200/80">
                        <Zap className="h-3 w-3 fill-rose-500" />
                        Urgent · ASAP
                      </span>
                    ) : job.urgency === "this_week" ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200/80">
                        <Clock className="h-3 w-3 text-muted" />
                        This week
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200/60">
                        <Calendar className="h-3 w-3 text-emerald-600" />
                        Flexible timing
                      </span>
                    )}
                  </div>

                  {/* Bookmark and Pass Buttons (Seamlessly inside the card) */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleSave(job.id, action)}
                      title={isSaved ? "Remove from saved" : "Save for later"}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        isSaved
                          ? "bg-primary/10 text-primary border border-primary/30 font-semibold"
                          : "text-muted hover:text-title hover:bg-smoke border border-line/60"
                      }`}
                    >
                      <Bookmark
                        className={`h-3.5 w-3.5 ${
                          isSaved ? "fill-primary text-primary" : "text-muted"
                        }`}
                      />
                      <span>{isSaved ? "Saved" : "Save"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHideLead(job.id)}
                      title="Hide this lead from your feed"
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted hover:text-rose-600 hover:bg-rose-50 border border-line/60 hover:border-rose-200 transition-all"
                    >
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Pass</span>
                    </button>
                  </div>
                </div>

                {/* Main Job Body */}
                <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                  {/* Service Thumbnail */}
                  <Link
                    href={`/pro/jobs/${job.id}`}
                    className="relative hidden sm:block h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-line/60 shadow-2xs group-hover:border-primary/40 transition-colors"
                  >
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${image})` }}
                      aria-hidden
                    />
                  </Link>

                  {/* Details Column */}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/pro/jobs/${job.id}`}
                      className="group-hover:text-primary transition-colors block"
                    >
                      <h2 className="font-display text-[17px] sm:text-[19px] font-bold text-title leading-snug">
                        {job.title}
                      </h2>
                    </Link>

                    {/* Metadata Strip */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted">
                      <span className="inline-flex items-center gap-1 text-title font-medium">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        {job.city}, {job.state} {job.zip}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{job.propertyType?.replace("_", " ") ?? "Residential"}</span>
                      {job.budget && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-smoke px-2 py-0.5 font-semibold text-primary border border-primary/20">
                            <DollarSign className="h-3 w-3 shrink-0" />
                            {job.budget}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Problem Description */}
                    <p className="mt-2.5 font-sans text-xs sm:text-sm leading-relaxed text-copy line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Footer Strip with Homeowner context and Primary CTA */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3.5 border-t border-line/50">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="inline-flex items-center gap-1 font-medium text-title">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {(job.homeownerName || "H").charAt(0)}
                      </span>
                      {job.homeownerName || "Homeowner"}
                    </span>
                    <span>•</span>
                    <span>Posted {job.postedAt}</span>
                  </div>

                  <Button
                    href={`/pro/jobs/${job.id}`}
                    size="sm"
                    className="rounded-xl px-4 py-2 font-semibold shadow-xs hover:shadow transition-all group/btn self-end sm:self-auto"
                  >
                    <span>{access.canSubmitQuote ? "View & Submit Quote" : "View Job Details"}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
