"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { useRoleAccess } from "@/hooks/use-role-access";
import { addQuote } from "@/redux/slices/marketplaceSlice";
import { useAppDispatch } from "@/redux/hooks";
import type { QuotePriceType } from "@/types";

export function ProQuoteForm({ jobId }: { jobId: string }) {
  const dispatch = useAppDispatch();
  const { access } = useRoleAccess();
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
        availability,
      }),
    );
    setSaved(true);
    event.currentTarget.reset();
  }

  return (
    <Card>
      <h2 className="text-xl">Send a quote</h2>
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
        <p className="mt-2 text-sm text-copy">You can quote. Contact unlocks with clearance + active membership.</p>
      )}
      <form className="mt-5 space-y-4" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Price type">
            <NativeSelect name="priceType" defaultValue="estimate" disabled={locked}>
              <option value="estimate">Estimate</option>
              <option value="fixed">Fixed</option>
              <option value="hourly">Hourly</option>
            </NativeSelect>
          </Field>
          <Field label="Amount">
            <TextField name="amount" type="number" min={1} step={1} placeholder="180" required disabled={locked} />
          </Field>
        </div>
        <Field label="Scope">
          <TextArea name="scope" placeholder="What the quote covers." required disabled={locked} />
        </Field>
        <Field label="Availability">
          <TextField name="availability" placeholder="Thursday afternoon" required disabled={locked} />
        </Field>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        {saved ? <p className="text-sm text-success">Quote saved.</p> : null}
        <Button type="submit" disabled={locked}>
          {locked ? "Locked" : "Save quote"}
        </Button>
      </form>
    </Card>
  );
}
