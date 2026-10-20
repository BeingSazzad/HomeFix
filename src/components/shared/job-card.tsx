import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { getCategory, urgencyLabels } from "@/Mockdata";
import { photos } from "@/lib/media";
import type { Job } from "@/types";

export function JobCard({
  job,
  href,
  actionLabel = "View Request",
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
      className="group flex gap-4 rounded-[18px] border border-line/80 bg-white p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div
        className="hidden h-24 w-24 shrink-0 rounded-[14px] bg-cover bg-center sm:block border border-line/50"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-display text-[17px] sm:text-[18px] font-bold text-title leading-snug transition-colors group-hover:text-primary">
            {job.title}
          </h3>
          <StatusBadge status={job.status} />
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          {category?.name ? (
            <span className="font-medium text-primary bg-smoke px-2 py-0.5 rounded-md">
              {category.name}
            </span>
          ) : null}
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted" />
            {isPro ? `${job.city}, ${job.state}` : `${job.city}, ${job.state} ${job.zip}`}
          </span>
          <span>•</span>
          <span>{urgencyLabels[job.urgency]}</span>
          {job.budget ? (
            <>
              <span>•</span>
              <span className="font-medium text-title">{job.budget}</span>
            </>
          ) : null}
        </div>

        <p className="mt-2 line-clamp-2 font-sans text-xs sm:text-sm leading-relaxed text-[#555]">
          {job.description}
        </p>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-line/40">
          <span className="text-[11px] text-muted">Posted {job.postedAt}</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
            {actionLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
