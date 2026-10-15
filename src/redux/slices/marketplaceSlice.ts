import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Job, Quote, QuotePriceType, Urgency, PropertyType } from "@/types";

export type VerifyKey = "identity" | "screening" | "license" | "insurance";
export type VerifyStatus = "idle" | "started" | "done";

const STORAGE_KEY = "lhf-marketplace";

interface MarketplaceState {
  extraJobs: Job[];
  extraQuotes: Quote[];
  hiredByJob: Record<string, string>;
  membershipActive: boolean;
  verification: Record<VerifyKey, VerifyStatus>;
  hydrated: boolean;
}

const initialState: MarketplaceState = {
  extraJobs: [],
  extraQuotes: [],
  hiredByJob: {},
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
        hiredByJob: state.hiredByJob,
        membershipActive: state.membershipActive,
        verification: state.verification,
      }),
    );
  } catch {
    /* ignore quota */
  }
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
          state.hiredByJob = saved.hiredByJob ?? {};
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
        status: "getting_quotes",
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
        scope: string;
        availability: string;
      }>,
    ) {
      const payload = action.payload;
      state.extraQuotes.unshift({
        id: `quote-local-${Date.now()}`,
        jobId: payload.jobId,
        proId: payload.proId,
        priceType: payload.priceType,
        amount: payload.amount,
        scope: payload.scope,
        availability: payload.availability,
      });
      persist(state);
    },
    hireQuote(state, action: PayloadAction<{ jobId: string; quoteId: string }>) {
      state.hiredByJob[action.payload.jobId] = action.payload.quoteId;
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
  startMembership,
  setVerification,
} = marketplaceSlice.actions;
export default marketplaceSlice.reducer;
