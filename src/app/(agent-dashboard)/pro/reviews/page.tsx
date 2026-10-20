"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  MessageSquare,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextArea, TextField } from "@/components/ui/field";
import { replyToReview, addNotification } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProReviewsPage() {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector((state) =>
    state.features.reviews.filter((item) => item.proId === "pro-1")
  );
  const proProfile = useAppSelector((state) => state.features.proProfile);

  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({});
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "needs-reply" | "replied" | "5-star" | "4-star">("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick reply templates for faster pro workflows
  const quickTemplates = [
    "Thank you for your business! Glad we could help get this resolved.",
    "Appreciate your trust and recommendation. Always here if you need anything!",
    "Thanks for the kind words! We take pride in clean and timely work.",
  ];

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Calculate statistics
  const stats = useMemo(() => {
    if (!reviews.length) {
      return { avg: 5.0, total: 0, repliedCount: 0, needsReplyCount: 0, fiveStarCount: 0, fourStarCount: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / reviews.length).toFixed(1));
    const repliedCount = reviews.filter((r) => Boolean(r.reply)).length;
    const needsReplyCount = reviews.filter((r) => !r.reply).length;
    const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
    const fourStarCount = reviews.filter((r) => r.rating === 4).length;
    return { avg, total: reviews.length, repliedCount, needsReplyCount, fiveStarCount, fourStarCount };
  }, [reviews]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    switch (selectedFilter) {
      case "needs-reply":
        return reviews.filter((r) => !r.reply);
      case "replied":
        return reviews.filter((r) => Boolean(r.reply));
      case "5-star":
        return reviews.filter((r) => r.rating === 5);
      case "4-star":
        return reviews.filter((r) => r.rating === 4);
      default:
        return reviews;
    }
  }, [reviews, selectedFilter]);

  function handlePostReply(reviewId: string) {
    const text = replyDraft[reviewId]?.trim();
    if (!text) return;
    dispatch(replyToReview({ id: reviewId, reply: text }));
    setReplyDraft((prev) => ({ ...prev, [reviewId]: "" }));
    setEditingReplyId(null);
    showToast("Response posted publicly to client review.");
  }

  function handleCopyReviewLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText("https://localhomefix.com/review/ortega-plumbing");
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
      showToast("Direct review invite link copied to clipboard!");
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-title px-4 py-3 text-white shadow-xl text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Title & Quick Review Request Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/70 pb-4 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-[22px] sm:text-[26px] font-semibold text-title tracking-tight">
              Client Reviews &amp; Reputation
            </h1>
            <span className="inline-flex items-center rounded-full bg-smoke px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              {stats.total} Total
            </span>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-muted">
            Manage client reviews, respond to homeowner feedback, and build trust in Austin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            size="sm"
            onClick={() => setShowRequestModal(true)}
            className="shadow-xs text-xs font-semibold"
          >
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            Request a Review
          </Button>
        </div>
      </div>

      {/* 2. Standard Reputation Scorecard (3 KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Overall Rating */}
        <Card className="rounded-[18px] border border-line/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Overall Rating
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-bold text-title">
              {stats.avg.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-muted">out of 5.0</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(stats.avg)
                    ? "fill-amber-400 text-amber-500"
                    : "fill-amber-400/40 text-amber-400/40"
                )}
              />
            ))}
            <span className="ml-1 text-xs font-semibold text-title">
              100% Recommended
            </span>
          </div>
        </Card>

        {/* KPI 2: Response Rate */}
        <Card className="rounded-[18px] border border-line/80 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Response Rate
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl sm:text-4xl font-bold text-title">
              {stats.total > 0 ? Math.round((stats.repliedCount / stats.total) * 100) : 100}%
            </span>
            <span className="text-xs font-medium text-muted">
              ({stats.repliedCount} of {stats.total} replied)
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Average pro reply time: <strong>under 24 hours</strong></span>
          </p>
        </Card>

        {/* KPI 3: Public Review Link */}
        <Card className="rounded-[18px] border border-line/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Direct Review Link
            </p>
            <p className="mt-1.5 text-xs text-copy truncate font-mono bg-smoke px-2.5 py-1.5 rounded-lg border border-line/60">
              localhomefix.com/review/ortega-plumbing
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-line/60">
            <button
              type="button"
              onClick={handleCopyReviewLink}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              <Copy className="h-3 w-3" />
              <span>{linkCopied ? "Copied!" : "Copy Link"}</span>
            </button>
            <Link
              href="/browse-pros/pro-1#sec-reviews"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-title"
            >
              <span>View storefront</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. Filter Tabs Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer",
              selectedFilter === "all"
                ? "bg-title text-white font-semibold shadow-2xs"
                : "bg-white text-muted hover:text-title border border-line/70"
            )}
          >
            All Reviews ({stats.total})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("needs-reply")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer",
              selectedFilter === "needs-reply"
                ? "bg-amber-600 text-white font-semibold shadow-2xs"
                : "bg-white text-muted hover:text-title border border-line/70"
            )}
          >
            {stats.needsReplyCount > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            )}
            Needs Reply ({stats.needsReplyCount})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("replied")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer",
              selectedFilter === "replied"
                ? "bg-title text-white font-semibold shadow-2xs"
                : "bg-white text-muted hover:text-title border border-line/70"
            )}
          >
            Replied ({stats.repliedCount})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("5-star")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer",
              selectedFilter === "5-star"
                ? "bg-title text-white font-semibold shadow-2xs"
                : "bg-white text-muted hover:text-title border border-line/70"
            )}
          >
            5 Stars ({stats.fiveStarCount})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter("4-star")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer",
              selectedFilter === "4-star"
                ? "bg-title text-white font-semibold shadow-2xs"
                : "bg-white text-muted hover:text-title border border-line/70"
            )}
          >
            4 Stars ({stats.fourStarCount})
          </button>
        </div>
      </div>

      {/* 4. Review Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card className="rounded-[20px] border border-line/80 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-title">No reviews match this filter.</p>
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
              Reset to all reviews
            </button>
          </Card>
        ) : (
          filteredReviews.map((review) => {
            const isEditingThis = editingReplyId === review.id;
            const hasReply = Boolean(review.reply) && !isEditingThis;

            return (
              <Card
                key={review.id}
                className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-6 shadow-xs hover:border-line transition-all duration-200"
              >
                {/* Review Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary/15 via-blue-50 to-indigo-100 font-display text-sm font-bold text-primary border border-primary/20">
                      {initials(review.author)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm sm:text-base font-bold text-title">
                          {review.author}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          <Check className="h-3 w-3 stroke-[3]" /> Verified Hire
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        Austin, TX · {review.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars & Numeric Value */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-display text-sm font-bold text-title">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Review Body */}
                <div className="mt-3.5 pl-0 sm:pl-[52px]">
                  <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-[#333]">
                    &ldquo;{review.body}&rdquo;
                  </p>

                  {/* Public Response Thread */}
                  {hasReply ? (
                    <div className="mt-4 rounded-xl border border-line/60 bg-surface/50 p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-white text-[10px] font-bold">
                            P
                          </span>
                          <span className="font-display text-xs font-bold text-title">
                            {proProfile?.businessName ?? "Ortega Plumbing"} (You)
                          </span>
                          <span className="text-[11px] text-muted">· Public response</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReplyId(review.id);
                            setReplyDraft((prev) => ({ ...prev, [review.id]: review.reply || "" }));
                          }}
                          className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-[#444] leading-relaxed pl-7">
                        {review.reply}
                      </p>
                    </div>
                  ) : (
                    /* Response Form (When Needs Reply or Editing) */
                    <div className="mt-4 rounded-xl border border-line/80 bg-surface/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs font-semibold text-title flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-primary" />
                          {isEditingThis ? "Edit your public response:" : "Reply to client feedback:"}
                        </span>
                        {isEditingThis && (
                          <button
                            type="button"
                            onClick={() => setEditingReplyId(null)}
                            className="text-xs text-muted hover:text-title cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* Quick Reply Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-muted text-[10px] uppercase font-semibold">Quick insert:</span>
                        {quickTemplates.map((template, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setReplyDraft((prev) => ({
                                ...prev,
                                [review.id]: template,
                              }))
                            }
                            className="rounded-lg border border-line bg-white px-2 py-0.5 text-xs text-copy hover:border-primary hover:text-primary transition-colors cursor-pointer text-left truncate max-w-xs"
                          >
                            &ldquo;{template.slice(0, 32)}...&rdquo;
                          </button>
                        ))}
                      </div>

                      <TextArea
                        value={replyDraft[review.id] ?? ""}
                        onChange={(event) =>
                          setReplyDraft((prev) => ({ ...prev, [review.id]: event.target.value }))
                        }
                        placeholder={`Write a professional public response to ${review.author}...`}
                        className="min-h-[85px] bg-white text-xs sm:text-sm rounded-xl"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-muted">
                          Your response is visible to all potential clients on your storefront.
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          disabled={!(replyDraft[review.id] ?? "").trim()}
                          onClick={() => handlePostReply(review.id)}
                          className="font-semibold text-xs rounded-xl"
                        >
                          <Send className="h-3 w-3 mr-1.5" />
                          {isEditingThis ? "Update Response" : "Post Public Response"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: REQUEST A REVIEW INVITE                               */}
      {/* ============================================================ */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[22px] border border-line bg-white p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3.5">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-title">
                    Request a Client Review
                  </h3>
                  <p className="text-xs text-muted">Invite past Austin homeowners to review your work</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="text-muted hover:text-title cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-copy">
              <div>
                <label className="block text-xs font-semibold text-title mb-1.5">
                  Your Shareable Review Link
                </label>
                <div className="flex items-center gap-2">
                  <TextField
                    readOnly
                    value="https://localhomefix.com/review/ortega-plumbing"
                    className="font-mono text-xs bg-smoke"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopyReviewLink}
                    className="shrink-0 font-semibold text-xs"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    {linkCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-line/70 bg-surface/50 p-3.5 space-y-2">
                <p className="text-xs font-semibold text-title flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Recommended SMS &amp; Email message:
                </p>
                <p className="text-xs text-muted italic bg-white p-3 rounded-lg border border-line/60 leading-relaxed">
                  &ldquo;Hi! Thanks for choosing Ortega Plumbing for your repair. If you have 30 seconds, sharing your review on LocalHomeFix helps our family business tremendously: https://localhomefix.com/review/ortega-plumbing&rdquo;
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRequestModal(false)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    dispatch(
                      addNotification({
                        title: "Review invite queued",
                        body: "Review invitation sent to recent client.",
                        href: "/pro/reviews",
                        createdAt: "Just now",
                        role: "pro",
                      })
                    );
                    setShowRequestModal(false);
                    showToast("Review invitation sent to client.");
                  }}
                  className="font-semibold text-xs"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Send Invite to Recent Client
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

