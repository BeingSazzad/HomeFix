"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Package,
  Shield,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, NativeSelect, TextField } from "@/components/ui/field";
import { getPro, offerStatusLabels } from "@/Mockdata";
import {
  confirmBooking,
  hireQuote,
  rejectSiblingOffers,
  setOfferStatus,
} from "@/redux/slices/marketplaceSlice";
import { addNotification, setJobStatus } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Quote } from "@/types";
import { cn } from "@/lib/cn";

const priceLabels: Record<string, string> = {
  fixed: "Fixed Price",
  estimate: "Estimate",
  hourly: "Hourly",
  time_and_materials: "Time & Materials",
};

export function QuoteCard({
  quote,
  canHire = false,
  compareMode = false,
  selected = false,
  onToggleCompare,
}: {
  quote: Quote;
  canHire?: boolean;
  compareMode?: boolean;
  selected?: boolean;
  onToggleCompare?: () => void;
}) {
  const dispatch = useAppDispatch();
  const hiredId = useAppSelector((state) => state.marketplace.hiredByJob[quote.jobId]);
  const booking = useAppSelector((state) => state.marketplace.bookings[quote.jobId]);
  const pro = getPro(quote.proId);
  const hired = hiredId === quote.id;
  const closed = quote.status === "rejected" || quote.status === "withdrawn" || quote.status === "expired";
  const [showBooking, setShowBooking] = useState(false);
  const [bookDate, setBookDate] = useState("");
  const [arrivalWindow, setArrivalWindow] = useState("10:00 AM – 12:00 PM (Late Morning)");
  const [msg, setMsg] = useState("");

  const price =
    quote.priceMax != null
      ? `$${quote.amount}–$${quote.priceMax}`
      : `$${quote.amount}${quote.priceType === "hourly" ? "/hr" : ""}`;

  function accept() {
    dispatch(hireQuote({ jobId: quote.jobId, quoteId: quote.id }));
    dispatch(
      rejectSiblingOffers({
        jobId: quote.jobId,
        acceptedQuoteId: quote.id,
        seedQuoteIds: ["quote-1", "quote-2", "quote-3"],
      }),
    );
    dispatch(setJobStatus({ jobId: quote.jobId, status: "hired" }));
    dispatch(
      addNotification({
        title: "Offer accepted",
        body: `You hired ${pro?.name ?? pro?.businessName ?? "the pro"}. Confirm your appointment arrival window below.`,
        href: `/account/jobs/${quote.jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );
    setShowBooking(true);
    setMsg("Offer accepted — select a date and 2-hour arrival window to lock your appointment.");
  }

  function decline() {
    dispatch(setOfferStatus({ quoteId: quote.id, status: "rejected" }));
    setMsg("Quote declined.");
  }

  function lockBooking() {
    if (!bookDate) {
      setMsg("Please choose an appointment date.");
      return;
    }
    dispatch(
      confirmBooking({
        jobId: quote.jobId,
        quoteId: quote.id,
        proId: quote.proId,
        agreedPrice: quote.amount,
        scheduledDate: bookDate,
        scheduledTime: arrivalWindow,
        arrivalWindow,
        scopeSnapshot: quote.scope,
      }),
    );
    dispatch(setJobStatus({ jobId: quote.jobId, status: "scheduled" }));
    dispatch(
      addNotification({
        title: "Booking confirmed",
        body: `${bookDate} (${arrivalWindow}) · $${quote.amount}. Direct contractor payment on completion.`,
        href: `/account/jobs/${quote.jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );
    setShowBooking(false);
    setMsg("Booking confirmed successfully.");
  }

  return (
    <article
      className={cn(
        "rounded-2xl border bg-white p-5 sm:p-6 transition-all duration-200",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-sm"
          : "border-line shadow-xs hover:border-line/90 hover:shadow-sm",
        hired && "border-success/40 bg-success/[0.01]",
        closed && !hired && "opacity-65 bg-stone-50/70 border-stone-200"
      )}
    >
      {/* Top Header: Contractor Info & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-display text-base font-bold text-primary">
            {pro?.name ? pro.name.charAt(0) : pro?.businessName ? pro.businessName.charAt(0) : "P"}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-semibold leading-tight text-title truncate">
                {pro?.name ?? "Provider"}
              </h3>
              {pro?.clearance === "cleared" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Pro
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="font-medium text-stone-700">{pro?.trade}</span>
              {pro?.rating ? (
                <span className="inline-flex items-center gap-1 font-semibold text-title">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  {pro.rating.toFixed(1)}
                  {pro.reviewCount ? (
                    <span className="font-normal text-muted">({pro.reviewCount})</span>
                  ) : null}
                </span>
              ) : null}
              {pro?.yearsInBusiness ? (
                <span className="text-stone-500">{pro.yearsInBusiness} in business</span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto shrink-0">
          <span className="rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
            {priceLabels[quote.priceType] ?? "Fixed Price"}
          </span>
          <Badge
            tone={
              hired
                ? "green"
                : quote.status === "accepted"
                ? "green"
                : quote.status === "rejected"
                ? "slate"
                : "amber"
            }
          >
            {hired
              ? "Hired"
              : quote.status === "rejected"
              ? "Declined"
              : offerStatusLabels[quote.status] ?? quote.status}
          </Badge>
        </div>
      </div>

      {/* Prominent Price Banner */}
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-primary/15 bg-smoke/80 px-4 py-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Quote Amount
          </span>
          <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-title">
            {price}
          </div>
        </div>
        {quote.paymentTerms ? (
          <span className="text-xs font-medium text-stone-600 self-center">
            {quote.paymentTerms}
          </span>
        ) : null}
      </div>

      {/* Scope of Work */}
      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Scope of Work
        </h4>
        <p className="mt-1.5 text-sm leading-relaxed text-stone-700">
          {quote.scope}
        </p>
      </div>

      {/* Structured Terms Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
        {quote.availability && (
          <div className="flex items-center gap-2 rounded-lg border border-stone-200/70 bg-stone-50 px-3 py-2">
            <Clock className="h-3.5 w-3.5 shrink-0 text-stone-500" />
            <div className="min-w-0">
              <span className="block text-[10px] font-medium uppercase text-muted">Availability</span>
              <span className="block truncate font-semibold text-stone-800">{quote.availability}</span>
            </div>
          </div>
        )}

        {quote.proposedSchedule && (
          <div className="flex items-center gap-2 rounded-lg border border-stone-200/70 bg-stone-50 px-3 py-2">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <span className="block text-[10px] font-medium uppercase text-muted">Proposed Schedule</span>
              <span className="block truncate font-semibold text-stone-800">{quote.proposedSchedule}</span>
            </div>
          </div>
        )}

        {quote.estimatedDuration && (
          <div className="flex items-center gap-2 rounded-lg border border-stone-200/70 bg-stone-50 px-3 py-2">
            <Clock className="h-3.5 w-3.5 shrink-0 text-stone-500" />
            <div className="min-w-0">
              <span className="block text-[10px] font-medium uppercase text-muted">Est. Duration</span>
              <span className="block truncate font-semibold text-stone-800">{quote.estimatedDuration}</span>
            </div>
          </div>
        )}

        {quote.materialsIncluded != null && (
          <div className="flex items-center gap-2 rounded-lg border border-stone-200/70 bg-stone-50 px-3 py-2">
            <Package className="h-3.5 w-3.5 shrink-0 text-stone-500" />
            <div className="min-w-0">
              <span className="block text-[10px] font-medium uppercase text-muted">Materials</span>
              <span className="block truncate font-semibold text-stone-800">
                {quote.materialsIncluded ? "Materials Included" : "Materials Not Included"}
              </span>
            </div>
          </div>
        )}

        {quote.warranty && (
          <div className="flex items-center gap-2 rounded-lg border border-stone-200/70 bg-stone-50 px-3 py-2">
            <Shield className="h-3.5 w-3.5 shrink-0 text-success" />
            <div className="min-w-0">
              <span className="block text-[10px] font-medium uppercase text-muted">Warranty</span>
              <span className="block truncate font-semibold text-stone-800">{quote.warranty}</span>
            </div>
          </div>
        )}

        {quote.expiresAt && (
          <div className="flex items-center gap-2 rounded-lg border border-stone-200/70 bg-stone-50 px-3 py-2">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            <div className="min-w-0">
              <span className="block text-[10px] font-medium uppercase text-muted">Offer Expires</span>
              <span className="block truncate font-semibold text-stone-800">{quote.expiresAt}</span>
            </div>
          </div>
        )}
      </div>

      {quote.exclusions && (
        <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
          <span className="shrink-0 font-semibold text-stone-700">Not included:</span>
          <span>{quote.exclusions}</span>
        </p>
      )}

      {/* Action Buttons: Accept & Reject Only */}
      {canHire && !hiredId && !closed ? (
        <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-line/70 pt-4">
          <Button
            type="button"
            size="sm"
            onClick={accept}
            className="font-semibold shadow-xs"
          >
            <Check className="mr-1.5 h-4 w-4" />
            Accept Quote
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={decline}
            className="font-medium text-stone-600 hover:bg-error/10 hover:text-error"
          >
            <X className="mr-1.5 h-4 w-4" />
            Reject
          </Button>
          {compareMode && onToggleCompare ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onToggleCompare}
              className={cn(
                "ml-auto font-medium",
                selected
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-stone-600 hover:bg-stone-100"
              )}
            >
              {selected ? "✓ Comparing" : "Compare"}
            </Button>
          ) : null}
        </div>
      ) : null}

      {/* Booking Form (Triggers immediately upon Accept) */}
      {(hired || showBooking) && !booking ? (
        <div className="mt-5 space-y-3.5 rounded-xl border border-primary/30 bg-smoke/70 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-title">
              <Calendar className="h-4 w-4 text-primary" />
              Confirm appointment schedule
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> $1,000 Guarantee
            </span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Select an arrival window. Contractors confirm exact arrival within this 2-hour timeframe. Direct settlement on 100% completion with zero platform markup.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Appointment Date">
              <TextField type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)} />
            </Field>
            <Field label="2-Hour Arrival Window">
              <NativeSelect
                value={arrivalWindow}
                onChange={(e) => setArrivalWindow(e.target.value)}
              >
                <option value="8:00 AM – 10:00 AM (Early Morning)">8:00 AM – 10:00 AM (Early Morning)</option>
                <option value="10:00 AM – 12:00 PM (Late Morning)">10:00 AM – 12:00 PM (Late Morning)</option>
                <option value="1:00 PM – 3:00 PM (Early Afternoon)">1:00 PM – 3:00 PM (Early Afternoon)</option>
                <option value="3:00 PM – 5:00 PM (Late Afternoon)">3:00 PM – 5:00 PM (Late Afternoon)</option>
                <option value="Flexible (Anytime during business hours)">Flexible (Anytime during business hours)</option>
              </NativeSelect>
            </Field>
          </div>
          <div className="pt-1 flex items-center gap-3">
            <Button type="button" size="sm" onClick={lockBooking} className="rounded-full">
              Confirm Schedule &amp; Lock Booking
            </Button>
          </div>
        </div>
      ) : null}

      {/* Booked Confirmation Notice */}
      {hired && booking ? (
        <div className="mt-5 rounded-xl border border-success/30 bg-success/[0.05] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-success">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Booked for {booking.scheduledDate} at {booking.scheduledTime} · ${booking.agreedPrice}
          </div>
          <p className="mt-1 text-xs text-stone-600">
            Work is confirmed. Coordinate directly with {pro?.name ?? "your contractor"} through messaging.
          </p>
          <div className="mt-3">
            <Link
              href="/account/messages"
              className="inline-flex items-center gap-1 font-display text-sm font-bold text-primary hover:underline"
            >
              Open messages ↗
            </Link>
          </div>
        </div>
      ) : null}

      {msg ? <p className="mt-3 text-xs font-medium text-primary">{msg}</p> : null}
    </article>
  );
}
