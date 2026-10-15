export const faqs = [
  {
    q: "Do I need an account to browse?",
    a: "No. Anyone can browse reviewed pros. Create a free homeowner account only when you want to post a request.",
  },
  {
    q: "Who pays LocalHomeFix?",
    a: "Homeowners pay $0 to LocalHomeFix. Pros pay $19.99/mo after three free months following clearance.",
  },
  {
    q: "When can a pro see my phone or email?",
    a: "Only after that pro is cleared and has an active free trial or paid membership.",
  },
  {
    q: "Does LocalHomeFix take the repair payment?",
    a: "No. You agree on price and pay the professional directly. There is no job checkout on this site.",
  },
  {
    q: "What does the verified badge mean?",
    a: "An administrator approved the pro for public search. It is not a guarantee of the work quality.",
  },
  {
    q: "How do I post a request?",
    a: "Sign up free, describe the job, and submit. Quotes, messages, and your review stay on that request.",
  },
  {
    q: "What happens after I apply as a pro?",
    a: "Complete screening, wait for admin clearance, then start the free trial to quote and unlock contact.",
  },
  {
    q: "Which trades are listed?",
    a: "Nine: appliance repair, electrical, HVAC, handyman, landscaping, painting, pest control, plumbing, and roofing.",
  },
];

export const plans = [
  {
    id: "homeowner" as const,
    name: "Homeowner",
    price: "Free",
    period: "",
    tagline: "No project fee",
    href: "/signup?next=%2Faccount%2Fpost-job",
    cta: "Create a request",
    featured: false,
    features: [
      "Browse without an account",
      "Post after you sign up",
      "Compare quotes on one job",
      "Pay the pro directly",
    ],
    limits: ["No repair packages or paid tiers"],
  },
  {
    id: "pro" as const,
    name: "Professional",
    price: "$19.99",
    period: "/month",
    tagline: "3 months free after clearance",
    href: "/pro-register",
    cta: "Apply as a pro",
    featured: true,
    features: [
      "Apply, screen, then clearance",
      "See matching jobs after approval",
      "Contact unlocks with membership",
      "No project commission",
    ],
    limits: ["Paused membership locks contact"],
  },
];
