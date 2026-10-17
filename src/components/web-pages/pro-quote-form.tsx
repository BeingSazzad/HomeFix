"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { useRoleAccess } from "@/hooks/use-role-access";
import { addQuote, acceptCounter, setOfferStatus } from "@/redux/slices/marketplaceSlice";
import { addNotification, setJobStatus } from "@/redux/slices/featuresSlice";
import { selectQuotesForJob } from "@/lib/marketplace";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { QuotePriceType } from "@/types";

export function ProQuoteForm({ jobId }: { jobId: string }) {
  const dispatch = useAppDispatch();
  const { access } = useRoleAccess();
  const quotes = useAppSelector((state) => selectQuotesForJob(state, jobId));
  const myCounters = quotes.filter((q) => q.proId === "pro-1" && q.status === "countered");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const locked = !access.canSubmitQuote;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) {
      setError(access.blockedReason ?? "Membership required to quote.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount"));
    const scope = String(data.get("scope") ?? "").trim();
    const availability = String(data.get("availability") ?? "").trim();
    const exclusions = String(data.get("exclusions") ?? "").trim();
    const estimatedDuration = String(data.get("duration") ?? "").trim();
    const proposedSchedule = String(data.get("schedule") ?? "").trim();
    const expiresAt = String(data.get("expires") ?? "").trim();
    const paymentTerms = String(data.get("paymentTerms") ?? "").trim();
    const materialsIncluded = data.get("materials") === "yes";

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (scope.length < 8) {
      setError("Describe what the quote covers.");
      return;
    }
    if (!availability) {
      setError("Add your availability.");
      return;
    }
    setError("");
    dispatch(
      addQuote({
        jobId,
        proId: "pro-1",
        priceType: String(data.get("priceType") ?? "estimate") as QuotePriceType,
        amount,
        scope,
        exclusions: exclusions || undefined,
        availability,
        materialsIncluded,
        estimatedDuration: estimatedDuration || undefined,
        proposedSchedule: proposedSchedule || undefined,
        expiresAt: expiresAt || undefined,
        paymentTerms: paymentTerms || "Pay the professional directly after the work.",
        warranty: String(data.get("warranty") ?? "").trim() || undefined,
      }),
    );
    dispatch(setJobStatus({ jobId, status: "quotes_in" }));
    dispatch(
      addNotification({
        title: "New offer",
        body: "A professional sent a quote on your request.",
        href: `/account/jobs/${jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );
    setSaved(true);
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-4">
      {myCounters.map((quote) => (
        <Card key={quote.id}>
          <h2 className="text-lg">Homeowner counter</h2>
          <p className="mt-2 text-sm text-copy">
            They proposed <span className="font-semibold text-title">${quote.counterAmount}</span>
            {quote.counterNote ? ` — “${quote.counterNote}”` : ""}. Your original was ${quote.amount}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                dispatch(acceptCounter({ quoteId: quote.id, jobId }));
                dispatch(setJobStatus({ jobId, status: "hired" }));
                dispatch(
                  addNotification({
                    title: "Counter accepted",
                    body: "Confirm a schedule on the job to finish booking.",
                    href: `/account/jobs/${jobId}`,
                    createdAt: "Just now",
                    role: "homeowner",
                  }),
                );
              }}
            >
              Accept counter
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => dispatch(setOfferStatus({ quoteId: quote.id, status: "rejected" }))}
            >
              Decline
            </Button>
          </div>
        </Card>
      ))}

      <Card>
        <h2 className="text-xl">Send an offer</h2>
        {locked ? (
          <p className="mt-2 text-sm text-copy">
            {access.blockedReason}{" "}
            <Link href="/pro/pricing" className="font-semibold text-primary">
              Membership
            </Link>
          </p>
        ) : access.canSeeContact ? (
          <p className="mt-2 text-sm text-copy">
            Contact unlocked: Maya Chen · (512) 555-0142 · maya@example.com
          </p>
        ) : (
          <p className="mt-2 text-sm text-copy">
            You can quote. Contact unlocks with clearance + active membership.
          </p>
        )}
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Price type">
              <NativeSelect name="priceType" defaultValue="estimate" disabled={locked}>
                <option value="estimate">Estimate</option>
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
                <option value="time_and_materials">Time & materials</option>
              </NativeSelect>
            </Field>
            <Field label="Total / rate ($)">
              <TextField name="amount" type="number" min={1} step={1} placeholder="180" required disabled={locked} />
            </Field>
          </div>
          <Field label="Work scope">
            <TextArea name="scope" placeholder="What you will do on site." required disabled={locked} />
          </Field>
          <Field label="Exclusions (optional)">
            <TextField name="exclusions" placeholder="What is not included" disabled={locked} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Materials included?">
              <NativeSelect name="materials" defaultValue="yes" disabled={locked}>
                <option value="yes">Yes</option>
                <option value="no">No — billed separately</option>
              </NativeSelect>
            </Field>
            <Field label="Estimated duration">
              <TextField name="duration" placeholder="1–2 hours" disabled={locked} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Availability window">
              <TextField name="availability" placeholder="Thursday afternoon" required disabled={locked} />
            </Field>
            <Field label="Proposed date/time">
              <TextField name="schedule" placeholder="Thu 1–3 PM" disabled={locked} />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Offer expires">
              <TextField name="expires" type="date" disabled={locked} />
            </Field>
            <Field label="Warranty (optional)">
              <TextField name="warranty" placeholder="90-day workmanship" disabled={locked} />
            </Field>
          </div>
          <Field label="Payment terms">
            <TextField
              name="paymentTerms"
              placeholder="Pay the pro directly after the visit"
              defaultValue="Pay the professional directly after the work."
              disabled={locked}
            />
          </Field>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          {saved ? <p className="text-sm text-success">Offer sent.</p> : null}
          <Button type="submit" disabled={locked}>
            {locked ? "Locked" : "Send offer"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
