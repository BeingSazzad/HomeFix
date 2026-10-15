export const faqs = [
  {
    q: "Do I need an account to browse?",
    a: "No. Anyone can read public listings. You only create an account to post a request or apply as a professional.",
  },
  {
    q: "Who pays LocalHomeFix?",
    a: "Homeowners are not charged a project fee. After administrator clearance, professionals pay $19.99 a month. The first three months are free.",
  },
  {
    q: "When can a pro see my contact details?",
    a: "Only after administrator clearance and an active trial or subscription. Screening alone is not enough.",
  },
  {
    q: "Does LocalHomeFix take the repair payment?",
    a: "No. Scope, contract, schedule, and payment stay between you and the professional. There is no checkout for the job on this site.",
  },
  {
    q: "What does a cleared listing mean?",
    a: "An administrator finished review. It is not a guarantee of the work, and it is not the same decision as identity or Checkr screening.",
  },
  {
    q: "How do I post a request?",
    a: "Create a homeowner account, describe the job, and submit. Quotes, messages, and the completed-job review stay on that request.",
  },
  {
    q: "What happens after I apply as a pro?",
    a: "You complete screening, then wait for administrator clearance. A public listing and job-board access start only after that review, plus an active trial or membership.",
  },
  {
    q: "Which trades are listed?",
    a: "Nine catalog trades: appliance repair, electrical, HVAC, handyman, landscaping, painting, pest control, plumbing, and roofing.",
  },
];

export const plans = [
  {
    name: "Homeowner",
    price: "Free",
    period: "",
    tagline: "No project fee",
    href: "/signup",
    cta: "Create a request",
    featured: false,
    features: [
      "Browse listings without an account",
      "Post a request after you sign up",
      "Compare quotes on one job",
      "Keep messages and the review together",
      "Pay the professional directly",
    ],
  },
  {
    name: "Professional",
    price: "$19.99",
    period: "/month",
    tagline: "3 months free after approval",
    href: "/pro-register",
    cta: "Apply as a pro",
    featured: true,
    features: [
      "Apply, finish screening, then wait for clearance",
      "See matching jobs after approval",
      "Contact details unlock with an active trial or membership",
      "No project commission through LocalHomeFix",
    ],
  },
];
