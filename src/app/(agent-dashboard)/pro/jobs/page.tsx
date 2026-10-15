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
    if (job.status === "completed" || job.status === "cancelled" || job.status === "hired") return false;
    return leadActions[job.id] !== "declined";
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px]">Available jobs</h1>
          <p className="mt-1 text-sm text-copy">Quote stays locked until clearance and active membership.</p>
        </div>
      </div>
      <div className="mt-4">
        <ProAccessStrip />
      </div>

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
