import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Booking,
  ChangeRequest,
  Job,
  JobCompletion,
  OfferStatus,
  PropertyType,
  Quote,
  QuotePriceType,
  Urgency,
} from "@/types";

export type VerifyKey = "identity" | "screening" | "license" | "insurance";
export type VerifyStatus = "idle" | "started" | "done";

const STORAGE_KEY = "lhf-marketplace-v2";

interface MarketplaceState {
  extraJobs: Job[];
  extraQuotes: Quote[];
  quoteOverrides: Record<string, Partial<Quote>>;
  hiredByJob: Record<string, string>;
  bookings: Record<string, Booking>;
  changeRequests: ChangeRequest[];
  completions: Record<string, JobCompletion>;
  membershipActive: boolean;
  verification: Record<VerifyKey, VerifyStatus>;
  hydrated: boolean;
}

const initialState: MarketplaceState = {
  extraJobs: [],
  extraQuotes: [],
  quoteOverrides: {},
  hiredByJob: {},
  bookings: {},
  changeRequests: [],
  completions: {},
  membershipActive: false,
  verification: {
    identity: "idle",
    screening: "idle",
    license: "idle",
    insurance: "idle",
  },
  hydrated: false,
};

function persist(state: MarketplaceState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        extraJobs: state.extraJobs,
        extraQuotes: state.extraQuotes,
        quoteOverrides: state.quoteOverrides,
        hiredByJob: state.hiredByJob,
        bookings: state.bookings,
        changeRequests: state.changeRequests,
        completions: state.completions,
        membershipActive: state.membershipActive,
        verification: state.verification,
      }),
    );
  } catch {
    /* ignore quota */
  }
}

function patchQuote(state: MarketplaceState, quoteId: string, patch: Partial<Quote>) {
  const local = state.extraQuotes.find((q) => q.id === quoteId);
  if (local) {
    Object.assign(local, patch);
    return;
  }
  state.quoteOverrides[quoteId] = { ...(state.quoteOverrides[quoteId] ?? {}), ...patch };
}

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    hydrateMarketplace(state) {
      if (typeof window === "undefined") return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<MarketplaceState>;
          state.extraJobs = saved.extraJobs ?? [];
          state.extraQuotes = saved.extraQuotes ?? [];
          state.quoteOverrides = saved.quoteOverrides ?? {};
          state.hiredByJob = saved.hiredByJob ?? {};
          state.bookings = saved.bookings ?? {};
          state.changeRequests = saved.changeRequests ?? [];
          state.completions = saved.completions ?? {};
          state.membershipActive = Boolean(saved.membershipActive);
          state.verification = saved.verification ?? state.verification;
        }
      } catch {
        /* ignore */
      }
      state.hydrated = true;
    },
    addJob(
      state,
      action: PayloadAction<{
        id?: string;
        title: string;
        categorySlug: string;
        description: string;
        zip: string;
        city?: string;
        state?: string;
        urgency: Urgency;
        budget?: string;
        propertyType?: PropertyType | "";
        homeownerName: string;
        asDraft?: boolean;
      }>,
    ) {
      const payload = action.payload;
      const job: Job = {
        id: payload.id ?? `job-local-${Date.now()}`,
        title: payload.title,
        categorySlug: payload.categorySlug,
        description: payload.description,
        zip: payload.zip,
        city: payload.city || "Austin",
        state: payload.state || "TX",
        urgency: payload.urgency,
        budget: payload.budget || undefined,
        propertyType: payload.propertyType ? payload.propertyType : undefined,
        status: payload.asDraft ? "draft" : "getting_quotes",
        postedAt: new Date().toISOString().slice(0, 10),
        homeownerName: payload.homeownerName,
      };
      state.extraJobs.unshift(job);
      persist(state);
    },
    addQuote(
      state,
      action: PayloadAction<{
        jobId: string;
        proId: string;
        priceType: QuotePriceType;
        amount: number;
        priceMax?: number;
        scope: string;
        exclusions?: string;
        availability: string;
        warranty?: string;
        materialsIncluded?: boolean;
        estimatedDuration?: string;
        proposedSchedule?: string;
        expiresAt?: string;
        paymentTerms?: string;
      }>,
    ) {
      const payload = action.payload;
      state.extraQuotes.unshift({
        id: `quote-local-${Date.now()}`,
        jobId: payload.jobId,
        proId: payload.proId,
        priceType: payload.priceType,
        amount: payload.amount,
        priceMax: payload.priceMax,
        scope: payload.scope,
        exclusions: payload.exclusions,
        availability: payload.availability,
        warranty: payload.warranty,
        materialsIncluded: payload.materialsIncluded,
        estimatedDuration: payload.estimatedDuration,
        proposedSchedule: payload.proposedSchedule,
        expiresAt: payload.expiresAt,
        paymentTerms: payload.paymentTerms,
        status: "pending",
      });
      persist(state);
    },
    /** Accept offer → hire + pending booking (schedule still needed) */
    hireQuote(state, action: PayloadAction<{ jobId: string; quoteId: string }>) {
      const { jobId, quoteId } = action.payload;
      state.hiredByJob[jobId] = quoteId;
      patchQuote(state, quoteId, { status: "accepted" });

      // Decline sibling open offers on the same job
      const allIds = [
        ...state.extraQuotes.filter((q) => q.jobId === jobId).map((q) => q.id),
        ...Object.keys(state.quoteOverrides),
      ];
      // Also mark seed quotes via overrides
      for (const id of new Set(allIds)) {
        if (id === quoteId) continue;
      }
      // Seed + local: any quote for this job that isn't accepted → rejected
      const localSiblings = state.extraQuotes.filter((q) => q.jobId === jobId && q.id !== quoteId);
      localSiblings.forEach((q) => {
        if (q.status === "pending" || q.status === "countered") q.status = "rejected";
      });

      persist(state);
    },
    rejectSiblingOffers(
      state,
      action: PayloadAction<{ jobId: string; acceptedQuoteId: string; seedQuoteIds: string[] }>,
    ) {
      const { jobId, acceptedQuoteId, seedQuoteIds } = action.payload;
      state.extraQuotes.forEach((q) => {
        if (q.jobId === jobId && q.id !== acceptedQuoteId && (q.status === "pending" || q.status === "countered")) {
          q.status = "rejected";
        }
      });
      seedQuoteIds.forEach((id) => {
        if (id === acceptedQuoteId) return;
        const current = state.quoteOverrides[id]?.status;
        if (!current || current === "pending" || current === "countered") {
          patchQuote(state, id, { status: "rejected" });
        }
      });
      persist(state);
    },
    setOfferStatus(state, action: PayloadAction<{ quoteId: string; status: OfferStatus }>) {
      patchQuote(state, action.payload.quoteId, { status: action.payload.status });
      persist(state);
    },
    counterOffer(
      state,
      action: PayloadAction<{ quoteId: string; amount: number; note: string }>,
    ) {
      patchQuote(state, action.payload.quoteId, {
        status: "countered",
        counterAmount: action.payload.amount,
        counterNote: action.payload.note,
      });
      persist(state);
    },
    acceptCounter(state, action: PayloadAction<{ quoteId: string; jobId: string }>) {
      const override = state.quoteOverrides[action.payload.quoteId];
      const local = state.extraQuotes.find((q) => q.id === action.payload.quoteId);
      const amount = local?.counterAmount ?? override?.counterAmount;
      if (amount != null) {
        patchQuote(state, action.payload.quoteId, {
          amount,
          status: "accepted",
          counterAmount: undefined,
          counterNote: undefined,
        });
      } else {
        patchQuote(state, action.payload.quoteId, { status: "accepted" });
      }
      state.hiredByJob[action.payload.jobId] = action.payload.quoteId;
      persist(state);
    },
    confirmBooking(
      state,
      action: PayloadAction<{
        jobId: string;
        quoteId: string;
        proId: string;
        agreedPrice: number;
        scheduledDate: string;
        scheduledTime: string;
        scopeSnapshot: string;
        notes?: string;
      }>,
    ) {
      const p = action.payload;
      state.bookings[p.jobId] = {
        jobId: p.jobId,
        quoteId: p.quoteId,
        proId: p.proId,
        agreedPrice: p.agreedPrice,
        scheduledDate: p.scheduledDate,
        scheduledTime: p.scheduledTime,
        scopeSnapshot: p.scopeSnapshot,
        status: "confirmed",
        notes: p.notes,
      };
      persist(state);
    },
    requestReschedule(
      state,
      action: PayloadAction<{ jobId: string; scheduledDate: string; scheduledTime: string; notes?: string }>,
    ) {
      const booking = state.bookings[action.payload.jobId];
      if (!booking) return;
      booking.scheduledDate = action.payload.scheduledDate;
      booking.scheduledTime = action.payload.scheduledTime;
      booking.notes = action.payload.notes ?? booking.notes;
      booking.status = "confirmed";
      persist(state);
    },
    addChangeRequest(
      state,
      action: PayloadAction<{ jobId: string; amount: number; reason: string }>,
    ) {
      state.changeRequests.unshift({
        id: `cr-${Date.now()}`,
        jobId: action.payload.jobId,
        amount: action.payload.amount,
        reason: action.payload.reason,
        status: "pending",
        createdAt: new Date().toISOString().slice(0, 10),
      });
      persist(state);
    },
    resolveChangeRequest(
      state,
      action: PayloadAction<{ id: string; status: "approved" | "rejected" }>,
    ) {
      const item = state.changeRequests.find((cr) => cr.id === action.payload.id);
      if (!item) return;
      item.status = action.payload.status;
      if (action.payload.status === "approved") {
        const booking = state.bookings[item.jobId];
        if (booking) booking.agreedPrice += item.amount;
      }
      persist(state);
    },
    proMarkComplete(state, action: PayloadAction<{ jobId: string }>) {
      state.completions[action.payload.jobId] = {
        ...(state.completions[action.payload.jobId] ?? { jobId: action.payload.jobId }),
        jobId: action.payload.jobId,
        proMarkedAt: new Date().toISOString(),
      };
      persist(state);
    },
    homeownerConfirmComplete(state, action: PayloadAction<{ jobId: string }>) {
      state.completions[action.payload.jobId] = {
        ...(state.completions[action.payload.jobId] ?? { jobId: action.payload.jobId }),
        jobId: action.payload.jobId,
        homeownerConfirmedAt: new Date().toISOString(),
      };
      persist(state);
    },
    startMembership(state) {
      state.membershipActive = true;
      persist(state);
    },
    setVerification(state, action: PayloadAction<{ key: VerifyKey; status: VerifyStatus }>) {
      state.verification[action.payload.key] = action.payload.status;
      persist(state);
    },
  },
});

export const {
  hydrateMarketplace,
  addJob,
  addQuote,
  hireQuote,
  rejectSiblingOffers,
  setOfferStatus,
  counterOffer,
  acceptCounter,
  confirmBooking,
  requestReschedule,
  addChangeRequest,
  resolveChangeRequest,
  proMarkComplete,
  homeownerConfirmComplete,
  startMembership,
  setVerification,
} = marketplaceSlice.actions;
export default marketplaceSlice.reducer;
