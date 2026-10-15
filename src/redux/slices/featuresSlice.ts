import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { JobStatus } from "@/types";

export type LeadAction = "saved" | "declined" | "scheduled" | "open";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
  role: "homeowner" | "pro" | "all";
}

export interface SavedAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface ReviewItem {
  id: string;
  jobId: string;
  proId: string;
  author: string;
  rating: number;
  body: string;
  createdAt: string;
  reply?: string;
}

export interface InvoiceItem {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "upcoming" | "failed";
}

interface FeaturesState {
  favorites: string[];
  notifications: AppNotification[];
  addresses: SavedAddress[];
  reviews: ReviewItem[];
  leadActions: Record<string, LeadAction>;
  jobPhotos: Record<string, string[]>;
  jobStatusOverride: Record<string, JobStatus>;
  invitedPros: Record<string, string[]>;
  twoFactorOn: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  membershipPaused: boolean;
  membershipCancelled: boolean;
  trialDaysLeft: number;
  invoices: InvoiceItem[];
  applicationDraft: Record<string, string>;
  applicationStatus: "draft" | "submitted" | "needs_info" | "rejected" | "cleared";
  rejectionReason: string;
  contactUnlocked: boolean;
}

const seedNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "New quote",
    body: "Ortega Plumbing sent a quote on your kitchen sink request.",
    href: "/account/jobs/job-1",
    createdAt: "Oct 14 · 2:20 PM",
    read: false,
    role: "homeowner",
  },
  {
    id: "n2",
    title: "Message reply",
    body: "Shah Electric Co. replied on the hallway outlets job.",
    href: "/account/messages",
    createdAt: "Oct 13 · 6:42 PM",
    read: false,
    role: "homeowner",
  },
  {
    id: "n3",
    title: "New open request",
    body: "A plumbing job near 78701 matches your trade.",
    href: "/pro/jobs/job-1",
    createdAt: "Oct 14 · 9:00 AM",
    read: false,
    role: "pro",
  },
  {
    id: "n4",
    title: "Membership reminder",
    body: "Your free trial has days left. Review membership terms anytime.",
    href: "/pro/pricing",
    createdAt: "Oct 12 · 10:00 AM",
    read: true,
    role: "pro",
  },
];

const initialState: FeaturesState = {
  favorites: [],
  notifications: seedNotifications,
  addresses: [
    {
      id: "addr-1",
      label: "Home",
      street: "418 West 5th Street",
      city: "Austin",
      state: "TX",
      zip: "78701",
    },
  ],
  reviews: [
    {
      id: "rev-1",
      jobId: "job-past-1",
      proId: "pro-1",
      author: "Maya Chen",
      rating: 5,
      body: "Fixed the leak the same afternoon. Clean work and clear price.",
      createdAt: "Sep 2026",
      reply: "Thanks Maya — glad the cabinet dried out cleanly.",
    },
    {
      id: "rev-2",
      jobId: "job-past-2",
      proId: "pro-1",
      author: "Jordan Hale",
      rating: 4,
      body: "Showed up on time and explained the fittings before replacing them.",
      createdAt: "Aug 2026",
    },
    {
      id: "rev-3",
      jobId: "job-past-3",
      proId: "pro-2",
      author: "Elena Ruiz",
      rating: 5,
      body: "Diagnosed the dead outlets quickly and left the hallway tidy.",
      createdAt: "Sep 2026",
    },
  ],
  leadActions: {},
  jobPhotos: {},
  jobStatusOverride: {},
  invitedPros: {},
  twoFactorOn: false,
  emailVerified: false,
  phoneVerified: false,
  membershipPaused: false,
  membershipCancelled: false,
  trialDaysLeft: 67,
  invoices: [
    { id: "inv-1", date: "Sep 10, 2026", amount: "$0.00", status: "paid" },
    { id: "inv-2", date: "Oct 10, 2026", amount: "$0.00", status: "paid" },
    { id: "inv-3", date: "Jan 10, 2027", amount: "$19.99", status: "upcoming" },
  ],
  applicationDraft: {},
  /** Demo pro starts cleared so job-board gates focus on membership. New applications reset to submitted. */
  applicationStatus: "cleared",
  rejectionReason: "",
  contactUnlocked: false,
};

const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.favorites = state.favorites.includes(id)
        ? state.favorites.filter((item) => item !== id)
        : [...state.favorites, id];
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const note = state.notifications.find((item) => item.id === action.payload);
      if (note) note.read = true;
    },
    markAllNotificationsRead(state, action: PayloadAction<"homeowner" | "pro">) {
      state.notifications.forEach((item) => {
        if (item.role === action.payload || item.role === "all") item.read = true;
      });
    },
    addNotification(state, action: PayloadAction<Omit<AppNotification, "id" | "read">>) {
      state.notifications.unshift({
        ...action.payload,
        id: `n-${Date.now()}`,
        read: false,
      });
    },
    addAddress(state, action: PayloadAction<Omit<SavedAddress, "id">>) {
      state.addresses.push({ ...action.payload, id: `addr-${Date.now()}` });
    },
    removeAddress(state, action: PayloadAction<string>) {
      state.addresses = state.addresses.filter((item) => item.id !== action.payload);
    },
    setLeadAction(state, action: PayloadAction<{ jobId: string; action: LeadAction }>) {
      state.leadActions[action.payload.jobId] = action.payload.action;
    },
    setJobPhotos(state, action: PayloadAction<{ jobId: string; photos: string[] }>) {
      state.jobPhotos[action.payload.jobId] = action.payload.photos;
    },
    setJobStatus(state, action: PayloadAction<{ jobId: string; status: JobStatus }>) {
      state.jobStatusOverride[action.payload.jobId] = action.payload.status;
    },
    invitePro(state, action: PayloadAction<{ jobId: string; proId: string }>) {
      const list = state.invitedPros[action.payload.jobId] ?? [];
      if (!list.includes(action.payload.proId)) {
        state.invitedPros[action.payload.jobId] = [...list, action.payload.proId];
      }
    },
    addReview(state, action: PayloadAction<Omit<ReviewItem, "id">>) {
      state.reviews.unshift({ ...action.payload, id: `rev-${Date.now()}` });
    },
    replyToReview(state, action: PayloadAction<{ id: string; reply: string }>) {
      const review = state.reviews.find((item) => item.id === action.payload.id);
      if (review) review.reply = action.payload.reply;
    },
    setTwoFactor(state, action: PayloadAction<boolean>) {
      state.twoFactorOn = action.payload;
    },
    setEmailVerified(state, action: PayloadAction<boolean>) {
      state.emailVerified = action.payload;
    },
    setPhoneVerified(state, action: PayloadAction<boolean>) {
      state.phoneVerified = action.payload;
    },
    setMembershipPaused(state, action: PayloadAction<boolean>) {
      state.membershipPaused = action.payload;
      if (action.payload) {
        state.membershipCancelled = false;
        state.contactUnlocked = false;
      }
    },
    setMembershipCancelled(state, action: PayloadAction<boolean>) {
      state.membershipCancelled = action.payload;
      if (action.payload) {
        state.membershipPaused = false;
        state.contactUnlocked = false;
      }
    },
    saveApplicationDraft(state, action: PayloadAction<Record<string, string>>) {
      state.applicationDraft = { ...state.applicationDraft, ...action.payload };
      state.applicationStatus = "draft";
    },
    submitApplication(state) {
      state.applicationStatus = "submitted";
      state.rejectionReason = "";
      state.contactUnlocked = false;
    },
    setApplicationNeedsInfo(state, action: PayloadAction<string>) {
      state.applicationStatus = "needs_info";
      state.rejectionReason = action.payload;
      state.contactUnlocked = false;
    },
    setApplicationCleared(state) {
      state.applicationStatus = "cleared";
      state.rejectionReason = "";
    },
    setApplicationRejected(state, action: PayloadAction<string>) {
      state.applicationStatus = "rejected";
      state.rejectionReason = action.payload;
      state.contactUnlocked = false;
    },
    unlockContact(state) {
      state.contactUnlocked = true;
    },
    lockContact(state) {
      state.contactUnlocked = false;
    },
  },
});

export const {
  toggleFavorite,
  markNotificationRead,
  markAllNotificationsRead,
  addNotification,
  addAddress,
  removeAddress,
  setLeadAction,
  setJobPhotos,
  setJobStatus,
  invitePro,
  addReview,
  replyToReview,
  setTwoFactor,
  setEmailVerified,
  setPhoneVerified,
  setMembershipPaused,
  setMembershipCancelled,
  saveApplicationDraft,
  submitApplication,
  setApplicationNeedsInfo,
  setApplicationCleared,
  setApplicationRejected,
  unlockContact,
  lockContact,
} = featuresSlice.actions;

export default featuresSlice.reducer;
