import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { getCategory, urgencyLabels } from "@/Mockdata";
import { photos } from "@/lib/media";
import type { Job } from "@/types";

export function JobCard({
  job,
  href,
  actionLabel = "View",
  viewer = "homeowner",
}: {
  job: Job;
  href: string;
  actionLabel?: string;
  viewer?: "homeowner" | "pro";
}) {
  const category = getCategory(job.categorySlug);
  const image = photos.services[job.categorySlug];
  const isPro = viewer === "pro";
  const meta = [
    category?.name,
    isPro ? `${job.city}, ${job.state}` : `${job.city}, ${job.state} ${job.zip}`,
    urgencyLabels[job.urgency],
    job.budget,
  ].filter(Boolean);

  return (
    <Link
      href={href}
      className="group flex gap-4 rounded-[16px] border border-line bg-white p-4 transition-colors hover:border-primary/40 sm:p-5"
    >
      <div
        className="hidden h-20 w-20 shrink-0 rounded-[12px] bg-cover bg-center sm:block"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-[18px] leading-snug group-hover:text-primary">{job.title}</h3>
          <StatusBadge status={job.status} />
        </div>
        <p className="mt-1.5 text-sm text-muted">{meta.join(" · ")}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-copy">{job.description}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 font-display text-sm font-bold text-primary">
          {actionLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </Link>
  );
}
