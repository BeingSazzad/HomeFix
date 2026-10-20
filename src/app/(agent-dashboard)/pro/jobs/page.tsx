"use client";

import { JobCard } from "@/components/shared/job-card";
import { ProAccessStrip } from "@/components/shared/pro-access-strip";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { selectAllJobs } from "@/lib/marketplace";
import { useRoleAccess } from "@/hooks/use-role-access";
import { setLeadAction } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function ProJobsPage() {
  const dispatch = useAppDispatch();
  const { access } = useRoleAccess();
  const leadActions = useAppSelector((state) => state.features.leadActions);
  const jobs = useAppSelector(selectAllJobs).filter((job) => {
    const closed = [
      "completed",
      "cancelled",
      "hired",
      "scheduled",
      "in_progress",
      "awaiting_confirm",
      "disputed",
      "draft",
    ].includes(job.status);
    if (closed) return false;
    return leadActions[job.id] !== "declined";
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line/70 pb-4 pt-1">
        <div className="flex items-center gap-2.5">
          <h1 className="font-display text-[22px] sm:text-[26px] font-semibold text-title tracking-tight">
            Available Jobs
          </h1>
          <span className="inline-flex items-center rounded-full bg-smoke px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
            {jobs.length}
          </span>
        </div>
      </div>
      <ProAccessStrip />

      {!access.canSeeJobBoard ? (
        <div className="mt-8">
          <EmptyState
            title="Clearance required"
            description="Finish application review before the job board opens."
            actionLabel="Open application"
            href="/pro/application"
          />
        </div>
      ) : jobs.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No open jobs" description="Check back when homeowners post." />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {jobs.map((job) => {
            const action = leadActions[job.id] ?? "open";
            return (
              <div key={job.id} className="space-y-2">
                <JobCard
                  job={job}
                  href={`/pro/jobs/${job.id}`}
                  viewer="pro"
                  actionLabel={access.canSubmitQuote ? "View and quote" : "View"}
                />
                <div className="flex flex-wrap gap-2 pl-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => dispatch(setLeadAction({ jobId: job.id, action: "saved" }))}
                  >
                    {action === "saved" ? "Saved" : "Save for later"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => dispatch(setLeadAction({ jobId: job.id, action: "declined" }))}
                  >
                    Hide
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
