import { jobs as seedJobs, quotes as seedQuotes } from "@/Mockdata";
import type { RootState } from "@/redux/store";
import type { Job, JobStatus, Quote } from "@/types";

export function selectAllJobs(state: RootState): Job[] {
  const hired = state.marketplace.hiredByJob;
  const overrides = state.features.jobStatusOverride;
  const completions = state.marketplace.completions;
  const bookings = state.marketplace.bookings;

  return [...state.marketplace.extraJobs, ...seedJobs].map((job) => {
    let status: JobStatus = overrides[job.id] ?? job.status;

    if (status === "cancelled" || status === "disputed" || status === "completed") {
      return { ...job, status };
    }

    const completion = completions[job.id];
    if (completion?.homeownerConfirmedAt) {
      status = "completed";
    } else if (completion?.proMarkedAt) {
      status = "awaiting_confirm";
    } else if (bookings[job.id]?.status === "confirmed" && hired[job.id]) {
      if (status === "hired" || status === "getting_quotes" || status === "quotes_in" || status === "active") {
        status = "scheduled";
      }
    } else if (hired[job.id]) {
      if (status !== "scheduled" && status !== "in_progress" && status !== "awaiting_confirm") {
        status = "hired";
      }
    }

    return { ...job, status };
  });
}

export function selectJob(state: RootState, id: string) {
  return selectAllJobs(state).find((job) => job.id === id);
}

export function selectAllQuotes(state: RootState): Quote[] {
  const overrides = state.marketplace.quoteOverrides;
  const merge = (quote: Quote): Quote => {
    const patch = overrides[quote.id] ?? {};
    return {
      ...quote,
      ...patch,
      status: patch.status ?? quote.status ?? "pending",
    };
  };
  return [...state.marketplace.extraQuotes.map(merge), ...seedQuotes.map(merge)];
}

export function selectQuotesForJob(state: RootState, jobId: string) {
  return selectAllQuotes(state).filter((quote) => quote.jobId === jobId);
}

export function selectJobsForHomeowner(state: RootState, name: string) {
  return selectAllJobs(state).filter((job) => job.homeownerName === name);
}

export function selectBooking(state: RootState, jobId: string) {
  return state.marketplace.bookings[jobId];
}

export function selectChangeRequests(state: RootState, jobId: string) {
  return state.marketplace.changeRequests.filter((cr) => cr.jobId === jobId);
}

export function selectCompletion(state: RootState, jobId: string) {
  return state.marketplace.completions[jobId];
}
