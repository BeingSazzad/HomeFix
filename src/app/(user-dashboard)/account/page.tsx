"use client";

import { Plus } from "lucide-react";
import { JobCard } from "@/components/shared/job-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { selectJobsForHomeowner } from "@/lib/marketplace";
import { useAppSelector } from "@/redux/hooks";

export default function AccountPage() {
  const user = useAppSelector((state) => state.auth.user);
  const mine = useAppSelector((state) => selectJobsForHomeowner(state, user?.name ?? ""));

  return (
    <div className="space-y-6">
      {/* Consistent Standard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line/70 pb-4 pt-1">
        <div className="flex items-center gap-2.5">
          <h1 className="font-display text-[22px] sm:text-[26px] font-semibold text-title tracking-tight">
            Requests
          </h1>
          <span className="inline-flex items-center rounded-full bg-smoke px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
            {mine.length}
          </span>
        </div>

        <Button href="/account/post-job" size="sm" className="rounded-full self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {mine.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No requests yet"
            description="Post a service request to start receiving itemized quotes from verified local contractors."
            actionLabel="Post a Request"
            href="/account/post-job"
          />
        </div>
      ) : (
        <div className="space-y-3.5">
          {mine.map((job) => (
            <JobCard key={job.id} job={job} href={`/account/jobs/${job.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
