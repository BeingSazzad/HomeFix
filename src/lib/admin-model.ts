/**
 * Admin is operations — not a marketplace participant.
 * They keep the public directory clean and handle risk.
 */

export const adminLandsOn = "/admin";

export const adminCan = [
  "Review pro applications (approve, request info, reject)",
  "See why a listing is or is not public",
  "Suspend or restore a cleared listing",
  "Open and resolve job disputes",
  "Oversee requests without contacting homeowners",
  "See membership state (trial / paid / paused) — not repair payments",
];

export const adminCannot = [
  "Quote, message, or hire on a job",
  "Take repair payments (there are none on-platform)",
  "Appear in Find a Pro",
  "Bypass homeowner privacy on a live request",
];

/** Daily ops order — queue first, then risk, then directory. */
export const adminLoop = [
  "Sign in as staff",
  "Clear the application queue",
  "Handle open disputes",
  "Suspend unsafe listings",
  "Check marketplace pulse",
] as const;

export const decisionRules = {
  approve:
    "License + insurance look current, identity check passed, trade matches the docs. Listing can go public after clearance.",
  needs_info:
    "Something is missing or unclear. Write a specific reviewer note the pro can act on.",
  reject:
    "Credentials cannot be verified, or the applicant is not eligible. They can resubmit with new docs.",
  suspend:
    "Use after clearance if insurance lapses, a dispute is serious, or the listing should leave Find a Pro.",
};
