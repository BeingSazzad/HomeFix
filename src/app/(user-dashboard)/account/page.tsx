"use client";

import { JobCard } from "@/components/shared/job-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { selectJobsForHomeowner } from "@/lib/marketplace";
import { useAppSelector } from "@/redux/hooks";

export default function AccountPage() {
  const user = useAppSelector((state) => state.auth.user);
  const mine = useAppSelector((state) => selectJobsForHomeowner(state, user?.name ?? ""));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px]">Your requests</h1>
          <p className="mt-1 text-sm text-copy">Quotes, messages, and status stay on each job.</p>
        </div>
        <Button href="/account/post-job" size="sm">
          New request
        </Button>
      </div>
      {mine.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No requests yet"
            description="Post a job and reviewed pros can send quotes."
            actionLabel="Post a request"
            href="/account/post-job"
          />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {mine.map((job) => (
            <JobCard key={job.id} job={job} href={`/account/jobs/${job.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
