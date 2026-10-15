import { Badge } from "@/components/ui/badge";
import { getPro } from "@/Mockdata";
import type { Quote } from "@/types";

const priceLabels = {
  fixed: "Fixed",
  estimate: "Estimate",
  hourly: "Hourly",
  time_and_materials: "Time & materials",
};

export function QuoteCard({ quote }: { quote: Quote }) {
  const pro = getPro(quote.proId);
  const price =
    quote.priceMax != null
      ? `$${quote.amount}–$${quote.priceMax}`
      : `$${quote.amount}${quote.priceType === "hourly" ? "/hr" : ""}`;

  return (
    <article className="rounded-[14px] border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg">{pro?.businessName ?? "Provider"}</h3>
          <p className="text-sm text-copy">{pro?.trade}</p>
        </div>
        <Badge>{priceLabels[quote.priceType]}</Badge>
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-title">{price}</p>
      <p className="mt-2 text-sm leading-6 text-copy">{quote.scope}</p>
      <p className="mt-3 text-sm text-copy">Available: {quote.availability}</p>
      {quote.warranty ? <p className="mt-1 text-sm text-copy">Warranty: {quote.warranty}</p> : null}
    </article>
  );
}
