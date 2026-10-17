"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextField } from "@/components/ui/field";
import { getPro, offerStatusLabels } from "@/Mockdata";
import {
  confirmBooking,
  counterOffer,
  hireQuote,
  rejectSiblingOffers,
  setOfferStatus,
} from "@/redux/slices/marketplaceSlice";
import { addNotification, setJobStatus } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Quote } from "@/types";

const priceLabels = {
  fixed: "Fixed",
  estimate: "Estimate",
  hourly: "Hourly",
  time_and_materials: "Time & materials",
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
  const [showCounter, setShowCounter] = useState(false);
  const [counterAmt, setCounterAmt] = useState(String(Math.round(quote.amount * 0.9)));
  const [counterNote, setCounterNote] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("09:00");
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
        body: `You hired ${pro?.businessName ?? "the pro"}. Confirm a date to lock the booking.`,
        href: `/account/jobs/${quote.jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );
    setShowBooking(true);
    setMsg("Offer accepted — pick a schedule to confirm booking.");
  }

  function decline() {
    dispatch(setOfferStatus({ quoteId: quote.id, status: "rejected" }));
    setMsg("Offer declined.");
  }

  function submitCounter() {
    const amount = Number(counterAmt);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMsg("Enter a valid counter amount.");
      return;
    }
    dispatch(
      counterOffer({
        quoteId: quote.id,
        amount,
        note: counterNote.trim() || "Homeowner counter-proposal",
      }),
    );
    dispatch(
      addNotification({
        title: "Counter sent",
        body: `You proposed $${amount} to ${pro?.businessName ?? "the pro"}.`,
        href: `/account/jobs/${quote.jobId}`,
        createdAt: "Just now",
        role: "pro",
      }),
    );
    setShowCounter(false);
    setMsg("Counter sent to the pro.");
  }

  function lockBooking() {
    if (!bookDate) {
      setMsg("Choose a date.");
      return;
    }
    dispatch(
      confirmBooking({
        jobId: quote.jobId,
        quoteId: quote.id,
        proId: quote.proId,
        agreedPrice: quote.amount,
        scheduledDate: bookDate,
        scheduledTime: bookTime,
        scopeSnapshot: quote.scope,
      }),
    );
    dispatch(setJobStatus({ jobId: quote.jobId, status: "scheduled" }));
    dispatch(
      addNotification({
        title: "Booking confirmed",
        body: `${bookDate} at ${bookTime} · $${quote.amount}. Pay the pro directly when work is done.`,
        href: `/account/jobs/${quote.jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );
    setShowBooking(false);
    setMsg("Booking confirmed.");
  }

  return (
    <article
      className={`rounded-[14px] border bg-white p-5 ${
        selected ? "border-primary ring-1 ring-primary/30" : "border-line"
      } ${closed ? "opacity-70" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg">{pro?.businessName ?? "Provider"}</h3>
          <p className="text-sm text-copy">{pro?.trade}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Badge>{hired ? "Hired" : priceLabels[quote.priceType]}</Badge>
          <Badge tone={quote.status === "accepted" ? "green" : quote.status === "countered" ? "amber" : "slate"}>
            {offerStatusLabels[quote.status] ?? quote.status}
          </Badge>
        </div>
      </div>

      <p className="mt-4 font-display text-2xl font-bold text-title">{price}</p>
      <p className="mt-2 text-sm leading-6 text-copy">{quote.scope}</p>

      <dl className="mt-3 grid gap-1.5 text-sm text-copy sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted">Availability</dt>
          <dd>{quote.availability}</dd>
        </div>
        {quote.proposedSchedule ? (
          <div>
            <dt className="text-xs text-muted">Proposed schedule</dt>
            <dd>{quote.proposedSchedule}</dd>
          </div>
        ) : null}
        {quote.estimatedDuration ? (
          <div>
            <dt className="text-xs text-muted">Duration</dt>
            <dd>{quote.estimatedDuration}</dd>
          </div>
        ) : null}
        {quote.materialsIncluded != null ? (
          <div>
            <dt className="text-xs text-muted">Materials</dt>
            <dd>{quote.materialsIncluded ? "Included" : "Not included"}</dd>
          </div>
        ) : null}
        {quote.expiresAt ? (
          <div>
            <dt className="text-xs text-muted">Offer expires</dt>
            <dd>{quote.expiresAt}</dd>
          </div>
        ) : null}
        {quote.warranty ? (
          <div>
            <dt className="text-xs text-muted">Warranty</dt>
            <dd>{quote.warranty}</dd>
          </div>
        ) : null}
      </dl>

      {quote.exclusions ? (
        <p className="mt-2 text-sm text-muted">
          <span className="font-semibold text-copy">Not included: </span>
          {quote.exclusions}
        </p>
      ) : null}
      {quote.paymentTerms ? (
        <p className="mt-1 text-sm text-muted">{quote.paymentTerms}</p>
      ) : null}

      {quote.status === "countered" && quote.counterAmount != null ? (
        <div className="mt-3 rounded-[10px] bg-smoke px-3 py-2 text-sm text-copy">
          <p className="font-semibold text-title">Your counter: ${quote.counterAmount}</p>
          {quote.counterNote ? <p className="mt-0.5">{quote.counterNote}</p> : null}
          <p className="mt-1 text-xs text-muted">Waiting for the pro to respond.</p>
        </div>
      ) : null}

      {canHire && !hiredId && !closed && quote.status !== "countered" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={accept}>
            Accept offer
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setShowCounter((v) => !v)}>
            Counter
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={decline}>
            Decline
          </Button>
          {compareMode && onToggleCompare ? (
            <Button type="button" size="sm" variant="ghost" onClick={onToggleCompare}>
              {selected ? "Remove from compare" : "Compare"}
            </Button>
          ) : null}
        </div>
      ) : null}

      {showCounter ? (
        <div className="mt-4 space-y-3 rounded-[12px] border border-line bg-surface p-3">
          <Field label="Your proposed total ($)">
            <TextField
              type="number"
              min={1}
              value={counterAmt}
              onChange={(e) => setCounterAmt(e.target.value)}
            />
          </Field>
          <Field label="Note to pro">
            <TextArea
              value={counterNote}
              onChange={(e) => setCounterNote(e.target.value)}
              placeholder="Happy to book if we land near this number…"
            />
          </Field>
          <Button type="button" size="sm" onClick={submitCounter}>
            Send counter
          </Button>
        </div>
      ) : null}

      {(hired || showBooking) && !booking ? (
        <div className="mt-4 space-y-3 rounded-[12px] border border-primary/20 bg-smoke/60 p-3">
          <p className="text-sm font-semibold text-title">Confirm booking</p>
          <p className="text-xs text-muted">
            Lock date and time. You still pay the pro directly — LocalHomeFix never takes the repair payment.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Date">
              <TextField type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)} />
            </Field>
            <Field label="Time">
              <TextField type="time" value={bookTime} onChange={(e) => setBookTime(e.target.value)} />
            </Field>
          </div>
          <Button type="button" size="sm" onClick={lockBooking}>
            Confirm schedule
          </Button>
        </div>
      ) : null}

      {hired && booking ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-success">
            Booked · {booking.scheduledDate} at {booking.scheduledTime} · ${booking.agreedPrice}
          </p>
          <Link href="/account/messages" className="inline-flex font-display text-sm font-bold text-primary">
            Open messages →
          </Link>
        </div>
      ) : null}

      {msg ? <p className="mt-3 text-sm text-success">{msg}</p> : null}
    </article>
  );
}
