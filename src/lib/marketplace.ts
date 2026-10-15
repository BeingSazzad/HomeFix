import { jobs as seedJobs, quotes as seedQuotes } from "@/Mockdata";
import type { RootState } from "@/redux/store";
import type { Job, JobStatus, Quote } from "@/types";

export function selectAllJobs(state: RootState): Job[] {
  const hired = state.marketplace.hiredByJob;
  const overrides = state.features.jobStatusOverride;
  return [...state.marketplace.extraJobs, ...seedJobs].map((job) => {
    let status: JobStatus = overrides[job.id] ?? job.status;
    if (hired[job.id] && status !== "completed" && status !== "cancelled") {
      status = status === "scheduled" || status === "in_progress" ? status : "hired";
    }
    return { ...job, status };
  });
}

export function selectJob(state: RootState, id: string) {
  return selectAllJobs(state).find((job) => job.id === id);
}

export function selectAllQuotes(state: RootState): Quote[] {
  return [...state.marketplace.extraQuotes, ...seedQuotes];
}

export function selectQuotesForJob(state: RootState, jobId: string) {
  return selectAllQuotes(state).filter((quote) => quote.jobId === jobId);
}

export function selectJobsForHomeowner(state: RootState, name: string) {
  return selectAllJobs(state).filter((job) => job.homeownerName === name);
}
