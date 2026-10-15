import type {
  Category,
  Job,
  MessageThread,
  Professional,
  Quote,
  User,
} from "@/types";

export const categories: Category[] = [
  {
    id: "cat-appliance",
    name: "Appliance Repair",
    slug: "appliance-repair",
    summary: "Repair and maintenance for home appliances.",
    typicalRange: "$75–$350",
    unit: "per job",
  },
  {
    id: "cat-electrical",
    name: "Electrical",
    slug: "electrical",
    summary: "Wiring, outlets, panel upgrades, and lighting.",
    typicalRange: "$100–$500",
    unit: "per job",
  },
  {
    id: "cat-hvac",
    name: "HVAC",
    slug: "hvac",
    summary: "Heating, cooling, and ventilation work.",
    typicalRange: "$150–$800",
    unit: "per job",
  },
  {
    id: "cat-handyman",
    name: "Handyman",
    slug: "handyman",
    summary: "General repairs and small household projects.",
    typicalRange: "$50–$200",
    unit: "per hour",
  },
  {
    id: "cat-landscaping",
    name: "Landscaping",
    slug: "landscaping",
    summary: "Lawn, garden, tree, and outdoor work.",
    typicalRange: "$100–$1,000",
    unit: "per job",
  },
  {
    id: "cat-painting",
    name: "Painting",
    slug: "painting",
    summary: "Interior and exterior painting and finish work.",
    typicalRange: "$200–$1,500",
    unit: "per room",
  },
  {
    id: "cat-pest",
    name: "Pest Control",
    slug: "pest-control",
    summary: "Inspection, treatment, and prevention.",
    typicalRange: "$100–$400",
    unit: "per visit",
  },
  {
    id: "cat-plumbing",
    name: "Plumbing",
    slug: "plumbing",
    summary: "Leaks, fixtures, drains, and pipe work.",
    typicalRange: "$75–$300",
    unit: "per job",
  },
  {
    id: "cat-roofing",
    name: "Roofing",
    slug: "roofing",
    summary: "Repair, replacement, inspection, and gutters.",
    typicalRange: "$300–$5,000",
    unit: "per job",
  },
];

export const demoHomeowner: User = {
  id: "user-home-1",
  name: "Maya Chen",
  email: "maya@example.com",
  role: "homeowner",
  city: "Austin",
  state: "TX",
  zip: "78701",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
};

export const demoProUser: User = {
  id: "user-pro-1",
  name: "Luis Ortega",
  email: "luis@ortegaplumbing.com",
  role: "pro",
  city: "Austin",
  state: "TX",
  zip: "78704",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
};

export const professionals: Professional[] = [
  {
    id: "pro-1",
    name: "Luis Ortega",
    businessName: "Ortega Plumbing",
    trade: "Plumbing",
    categorySlug: "plumbing",
    city: "Austin",
    state: "TX",
    zip: "78704",
    radiusMiles: 25,
    yearsInBusiness: "10+",
    rating: 4.8,
    reviewCount: 36,
    jobsCompleted: 128,
    responseTime: "Usually same day",
    bio: "Residential leak repair, fixture replacement, and drain work. Licensed in Texas.",
    clearance: "cleared",
    licensed: true,
    insured: true,
    emergency: true,
  },
  {
    id: "pro-2",
    name: "Priya Shah",
    businessName: "Shah Electric Co.",
    trade: "Electrical",
    categorySlug: "electrical",
    city: "Austin",
    state: "TX",
    zip: "78702",
    radiusMiles: 30,
    yearsInBusiness: "6–10 years",
    rating: 4.9,
    reviewCount: 22,
    jobsCompleted: 74,
    responseTime: "Within 24 hours",
    bio: "Panel upgrades, lighting, and outlet work for homes and small commercial spaces.",
    clearance: "cleared",
    licensed: true,
    insured: true,
    emergency: false,
  },
  {
    id: "pro-3",
    name: "Dana Whitfield",
    businessName: "Whitfield HVAC",
    trade: "HVAC",
    categorySlug: "hvac",
    city: "Round Rock",
    state: "TX",
    zip: "78664",
    radiusMiles: 40,
    yearsInBusiness: "10+",
    rating: 4.7,
    reviewCount: 41,
    jobsCompleted: 190,
    responseTime: "Next business day",
    bio: "Service and install for heat pumps, furnaces, and ductwork.",
    clearance: "cleared",
    licensed: true,
    insured: true,
    emergency: true,
  },
  {
    id: "pro-4",
    name: "Chris Nguyen",
    businessName: "Northline Painting",
    trade: "Painting",
    categorySlug: "painting",
    city: "Austin",
    state: "TX",
    zip: "78745",
    radiusMiles: 20,
    yearsInBusiness: "3–5 years",
    rating: 4.6,
    reviewCount: 14,
    jobsCompleted: 39,
    responseTime: "Within 2 days",
    bio: "Interior rooms, trim, and small exterior jobs. Clean, scheduled work.",
    clearance: "cleared",
    licensed: false,
    insured: true,
    emergency: false,
  },
];

export const jobs: Job[] = [
  {
    id: "job-1",
    title: "Kitchen sink leak under cabinet",
    categorySlug: "plumbing",
    description:
      "Water leaks under the kitchen sink when the faucet runs. Cabinet base is damp. No known pipe freeze.",
    zip: "78701",
    city: "Austin",
    state: "TX",
    urgency: "this_week",
    budget: "$500–$1,000",
    propertyType: "single_family",
    status: "getting_quotes",
    postedAt: "2026-10-12",
    homeownerName: "Maya Chen",
  },
  {
    id: "job-2",
    title: "Paint the dog house",
    categorySlug: "painting",
    description: "Exterior paint on a wooden dog house. About 4 by 3 feet. Prefer weather-safe paint.",
    zip: "78745",
    city: "Austin",
    state: "TX",
    urgency: "flexible",
    budget: "Under $500",
    propertyType: "single_family",
    status: "active",
    postedAt: "2026-02-09",
    homeownerName: "Jordan Hale",
  },
  {
    id: "job-3",
    title: "Two dead outlets in hallway",
    categorySlug: "electrical",
    description: "Hallway outlets stopped working after a storm. Breaker is on. Need diagnosis and repair.",
    zip: "78702",
    city: "Austin",
    state: "TX",
    urgency: "asap",
    budget: "$500–$1,000",
    propertyType: "townhome",
    status: "quotes_in",
    postedAt: "2026-10-10",
    homeownerName: "Elena Ruiz",
  },
  {
    id: "job-4",
    title: "AC not cooling upstairs",
    categorySlug: "hvac",
    description: "Upstairs rooms stay 8 degrees warmer than downstairs. Filter was changed last month.",
    zip: "78664",
    city: "Round Rock",
    state: "TX",
    urgency: "this_week",
    budget: "$1,000–$5,000",
    propertyType: "single_family",
    status: "hired",
    postedAt: "2026-10-04",
    homeownerName: "Sam Okonkwo",
  },
];

export const quotes: Quote[] = [
  {
    id: "quote-1",
    jobId: "job-1",
    proId: "pro-1",
    priceType: "estimate",
    amount: 180,
    priceMax: 320,
    scope: "Inspect supply lines and P-trap. Replace failed fittings and reseal the drain.",
    availability: "Thursday or Friday this week",
    warranty: "90-day workmanship on the repair",
  },
  {
    id: "quote-2",
    jobId: "job-3",
    proId: "pro-2",
    priceType: "hourly",
    amount: 95,
    scope: "Diagnostic visit first. Parts billed separately if a receptacle is replaced.",
    availability: "Next Monday",
  },
  {
    id: "quote-3",
    jobId: "job-3",
    proId: "pro-2",
    priceType: "fixed",
    amount: 240,
    scope: "Trace the circuit, repair or replace the failed outlet, test adjacent receptacles.",
    availability: "Tomorrow afternoon",
    warranty: "1 year on the electrical repair",
  },
];

export const threads: MessageThread[] = [
  {
    id: "msg-1",
    jobId: "job-1",
    jobTitle: "Kitchen sink leak under cabinet",
    otherParty: "Ortega Plumbing",
    lastMessage: "I can come Thursday between 1 and 3 if that still works.",
    updatedAt: "2026-10-14",
  },
  {
    id: "msg-2",
    jobId: "job-3",
    jobTitle: "Two dead outlets in hallway",
    otherParty: "Shah Electric Co.",
    lastMessage: "Quote sent. Happy to walk through the scope if you have questions.",
    updatedAt: "2026-10-13",
  },
];

export const urgencyLabels: Record<Job["urgency"], string> = {
  asap: "Urgent",
  this_week: "This week",
  two_weeks: "Within 2 weeks",
  flexible: "Flexible",
};

export const statusLabels: Record<Job["status"], string> = {
  draft: "Draft",
  active: "Active",
  getting_quotes: "Getting quotes",
  quotes_in: "Quotes in",
  hired: "Hired",
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function getCategory(slug: string) {
  return categories.find((item) => item.slug === slug);
}

export function getPro(id: string) {
  return professionals.find((item) => item.id === id);
}

export function getJob(id: string) {
  return jobs.find((item) => item.id === id);
}

export const propertyTypeLabels: Record<NonNullable<Job["propertyType"]>, string> = {
  single_family: "Single-family home",
  condo: "Condo",
  townhome: "Townhome",
  apartment: "Apartment",
  commercial: "Commercial",
  other: "Other",
};

export function quotesForJob(jobId: string) {
  return quotes.filter((item) => item.jobId === jobId);
}

export function threadsForJob(jobId: string) {
  return threads.filter((item) => item.jobId === jobId);
}
