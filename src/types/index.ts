export type UserRole = "homeowner" | "pro" | "admin";

/** Job lifecycle — separate from per-offer status */
export type JobStatus =
  | "draft"
  | "active"
  | "getting_quotes"
  | "quotes_in"
  | "hired"
  | "scheduled"
  | "in_progress"
  | "awaiting_confirm"
  | "completed"
  | "cancelled"
  | "disputed";

/** Per-offer status — a job can have many offers */
export type OfferStatus =
  | "pending"
  | "countered"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "expired";

export type QuotePriceType = "fixed" | "estimate" | "hourly" | "time_and_materials";

export type Urgency = "asap" | "this_week" | "two_weeks" | "flexible";

export type PropertyType =
  | "single_family"
  | "condo"
  | "townhome"
  | "apartment"
  | "commercial"
  | "other";

export type ClearanceStatus = "cleared" | "pending" | "rejected" | "suspended";

export type ChangeRequestStatus = "pending" | "approved" | "rejected";

export type BookingStatus = "pending_schedule" | "confirmed" | "reschedule_requested";

export interface Category {
  id: string;
  name: string;
  slug: string;
  summary: string;
  typicalRange: string;
  unit: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  avatar?: string;
}

export interface Professional {
  id: string;
  name: string;
  businessName: string;
  trade: string;
  categorySlug: string;
  city: string;
  state: string;
  zip: string;
  radiusMiles: number;
  yearsInBusiness: string;
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  responseTime: string;
  bio: string;
  clearance: ClearanceStatus;
  licensed: boolean;
  insured: boolean;
  emergency: boolean;
  /** Profile starting price — final job price comes from the offer */
  startingPrice: number;
  /** Short availability note shown on profile */
  availabilityNote: string;
  /** True if they can take work this week */
  availableThisWeek: boolean;
}

export interface Job {
  id: string;
  title: string;
  categorySlug: string;
  description: string;
  zip: string;
  city: string;
  state: string;
  urgency: Urgency;
  budget?: string;
  propertyType?: PropertyType;
  status: JobStatus;
  postedAt: string;
  homeownerName: string;
}

export interface Quote {
  id: string;
  jobId: string;
  proId: string;
  priceType: QuotePriceType;
  amount: number;
  priceMax?: number;
  scope: string;
  /** What’s not included */
  exclusions?: string;
  availability: string;
  warranty?: string;
  materialsIncluded?: boolean;
  estimatedDuration?: string;
  proposedSchedule?: string;
  expiresAt?: string;
  paymentTerms?: string;
  status: OfferStatus;
  /** Homeowner counter-proposal */
  counterAmount?: number;
  counterNote?: string;
}

export interface Booking {
  jobId: string;
  quoteId: string;
  proId: string;
  agreedPrice: number;
  scheduledDate: string;
  scheduledTime: string;
  scopeSnapshot: string;
  status: BookingStatus;
  notes?: string;
}

export interface ChangeRequest {
  id: string;
  jobId: string;
  amount: number;
  reason: string;
  status: ChangeRequestStatus;
  createdAt: string;
}

export interface JobCompletion {
  jobId: string;
  proMarkedAt?: string;
  homeownerConfirmedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: "homeowner" | "pro";
  senderName: string;
  body: string;
  sentAt: string;
  read?: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
    url?: string;
  };
}

export interface MessageThread {
  id: string;
  /** Omit or use dm:proId for direct chats without a job */
  jobId: string;
  jobTitle: string;
  otherParty: string;
  proId?: string;
  unread: number;
  lastMessage: string;
  lastSender: "homeowner" | "pro";
  updatedAt: string;
  messages: ChatMessage[];
  /** True when started from a pro profile, not a job */
  isDirect?: boolean;
}

export interface IntakeDraft {
  problem: string;
  categorySlug: string;
  zip: string;
  title: string;
  summary: string;
  followUps: string[];
}
