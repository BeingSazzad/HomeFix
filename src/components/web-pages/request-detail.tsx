import Link from "next/link";
import { QuoteCard } from "@/components/shared/quote-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { photos } from "@/lib/media";
import {
  getCategory,
  getJob,
  propertyTypeLabels,
  quotesForJob,
  threadsForJob,
  urgencyLabels,
} from "@/Mockdata";

export function RequestDetail({
  id,
  backHref,
  backLabel,
  inboxHref,
}: {
  id: string;
  backHref: string;
  backLabel: string;
  inboxHref?: string;
}) {
  const job = getJob(id);
  if (!job) return null;

  const category = getCategory(job.categorySlug);
  const quotes = quotesForJob(job.id);
  const messages = threadsForJob(job.id);
  const image = photos.services[job.categorySlug];
  const facts = [
    { label: "Posted", value: job.postedAt },
    { label: "Timing", value: urgencyLabels[job.urgency] },
    { label: "Budget", value: job.budget ?? "Not listed" },
    {
      label: "Property",
      value: job.propertyType ? propertyTypeLabels[job.propertyType] : "Not listed",
    },
  ];

  return (
    <div className="space-y-5">
      <Link href={backHref} className="inline-flex font-display text-sm font-semibold text-primary">
        ← {backLabel}
      </Link>

      <div className="overflow-hidden rounded-[20px] bg-white soft-shadow">
        <div className="h-56 bg-cover bg-center md:h-72" style={{ backgroundImage: `url(${image})` }} />
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-primary">
                {category?.name}
              </p>
              <h1 className="mt-2 text-[28px] md:text-[32px]">{job.title}</h1>
              <p className="mt-2 text-sm text-copy">
                {job.city}, {job.state} {job.zip}
              </p>
            </div>
            <StatusBadge status={job.status} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {facts.map((item) => (
              <div key={item.label} className="rounded-[14px] bg-smoke px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.label}</p>
                <p className="mt-1 font-display text-sm font-bold text-title">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <h2 className="text-xl">About this request</h2>
        <p className="mt-3 text-[15px] leading-7 text-copy">{job.description}</p>
      </Card>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl">Quotes</h2>
          <p className="text-sm text-muted">
            {quotes.length} {quotes.length === 1 ? "quote" : "quotes"}
          </p>
        </div>
        {quotes.length === 0 ? (
          <Card className="mt-3">
            <p className="text-sm text-copy">No quotes yet. Cleared professionals can still send one.</p>
          </Card>
        ) : (
          <div className="mt-3 grid gap-3">
            {quotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl">Messages</h2>
        {messages.length === 0 ? (
          <Card className="mt-3">
            <p className="text-sm text-copy">No messages on this request yet.</p>
          </Card>
        ) : (
          <div className="mt-3 grid gap-3">
            {messages.map((thread) => (
              <Card key={thread.id}>
                <p className="font-display text-sm font-bold text-title">{thread.otherParty}</p>
                <p className="mt-2 text-sm leading-6 text-copy">{thread.lastMessage}</p>
                <p className="mt-2 text-xs text-muted">{thread.updatedAt}</p>
              </Card>
            ))}
          </div>
        )}
        {inboxHref ? (
          <div className="mt-4">
            <Button href={inboxHref} variant="ghost" size="sm">
              Open all messages
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
