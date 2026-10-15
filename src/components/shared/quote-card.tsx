"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPro } from "@/Mockdata";
import { hireQuote } from "@/redux/slices/marketplaceSlice";
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
}: {
  quote: Quote;
  canHire?: boolean;
}) {
  const dispatch = useAppDispatch();
  const hiredId = useAppSelector((state) => state.marketplace.hiredByJob[quote.jobId]);
  const pro = getPro(quote.proId);
  const hired = hiredId === quote.id;
  const price =
    quote.priceMax != null
      ? `$${quote.amount}–$${quote.priceMax}`
      : `$${quote.amount}${quote.priceType === "hourly" ? "/hr" : ""}`;

  function accept() {
    dispatch(hireQuote({ jobId: quote.jobId, quoteId: quote.id }));
    dispatch(setJobStatus({ jobId: quote.jobId, status: "hired" }));
    dispatch(
      addNotification({
        title: "Quote accepted",
        body: `You hired ${pro?.businessName ?? "the pro"}. Message them to set schedule and payment.`,
        href: "/account/messages",
        createdAt: "Just now",
        role: "homeowner",
      }),
    );
  }

  return (
    <article className="rounded-[14px] border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg">{pro?.businessName ?? "Provider"}</h3>
          <p className="text-sm text-copy">{pro?.trade}</p>
        </div>
        <Badge>{hired ? "Hired" : priceLabels[quote.priceType]}</Badge>
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-title">{price}</p>
      <p className="mt-2 text-sm leading-6 text-copy">{quote.scope}</p>
      <p className="mt-3 text-sm text-copy">Available: {quote.availability}</p>
      {quote.warranty ? <p className="mt-1 text-sm text-copy">Warranty: {quote.warranty}</p> : null}
      {canHire && !hiredId ? (
        <div className="mt-4">
          <Button type="button" size="sm" onClick={accept}>
            Accept quote
          </Button>
        </div>
      ) : null}
      {hired ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-success">
            Hired. Agree on schedule and payment directly with the pro.
          </p>
          <Link href="/account/messages" className="inline-flex font-display text-sm font-bold text-primary">
            Open messages →
          </Link>
        </div>
      ) : null}
    </article>
  );
}
