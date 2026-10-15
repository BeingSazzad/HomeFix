import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { getCategory, urgencyLabels } from "@/Mockdata";
import { photos } from "@/lib/media";
import type { Job } from "@/types";

export function JobCard({
  job,
  href,
  actionLabel = "View details",
}: {
  job: Job;
  href: string;
  actionLabel?: string;
}) {
  const category = getCategory(job.categorySlug);
  const image = photos.services[job.categorySlug];

  return (
    <Link
      href={href}
      className="group flex overflow-hidden rounded-[20px] bg-white text-title soft-shadow transition-shadow hover:shadow-[0_22px_50px_color-mix(in_srgb,var(--ink)_16%,transparent)]"
    >
      <div className="hidden w-44 shrink-0 bg-cover bg-center sm:block" style={{ backgroundImage: `url(${image})` }} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg">{job.title}</h3>
            <p className="mt-1 text-sm text-copy">
              {category?.name} · {job.city}, {job.state} {job.zip}
            </p>
          </div>
          <StatusBadge status={job.status} />
        </div>
        <p className="mt-3 flex-1 text-sm leading-6 text-copy">{job.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <span>{urgencyLabels[job.urgency]}</span>
          <span>{job.budget ?? "Budget not listed"}</span>
          <span>Posted {job.postedAt}</span>
        </div>
        <span className="mt-4 inline-flex min-h-11 w-fit items-center rounded-[10px] bg-primary px-5 font-display text-sm font-bold text-white group-hover:bg-primary-hover">
          {actionLabel}
        </span>
      </div>
    </Link>
  );
}
