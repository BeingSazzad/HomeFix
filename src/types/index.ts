export type UserRole = "homeowner" | "pro" | "admin";

export type JobStatus =
  | "draft"
  | "active"
  | "getting_quotes"
  | "quotes_in"
  | "hired"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

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
  availability: string;
  warranty?: string;
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
  jobId: string;
  jobTitle: string;
  otherParty: string;
  proId?: string;
  unread: number;
  lastMessage: string;
  lastSender: "homeowner" | "pro";
  updatedAt: string;
  messages: ChatMessage[];
}

export interface IntakeDraft {
  problem: string;
  categorySlug: string;
  zip: string;
  title: string;
  summary: string;
  followUps: string[];
}
