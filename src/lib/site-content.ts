export const faqs = [
  {
    q: "Do I need an account to browse?",
    a: "No. Anyone can open public pro profiles. Create a free homeowner account to post a job, or apply separately if you are a professional.",
  },
  {
    q: "Who pays LocalHomeFix?",
    a: "Homeowners pay LocalHomeFix nothing for the repair. After administrator approval, professionals pay $19.99 a month. The first three months are free.",
  },
  {
    q: "When can a pro see my phone or email?",
    a: "Only after that pro is approved and has an active free trial or paid membership. Finishing a background check alone is not enough.",
  },
  {
    q: "Does LocalHomeFix take the repair payment?",
    a: "No. You agree on price, schedule, and payment directly with the professional. There is no job checkout on this site.",
  },
  {
    q: "What does “reviewed” or “cleared” mean?",
    a: "An administrator finished a marketplace review so the pro can appear in public search. It is not a guarantee of the work, and it is separate from identity or background screening.",
  },
  {
    q: "How do I post a request?",
    a: "Create a free homeowner account, describe the job, and submit. Quotes, messages, and your review after the work all stay on that same request.",
  },
  {
    q: "What happens after I apply as a pro?",
    a: "Complete screening, wait for administrator approval, then start the free trial. Job-board access and homeowner contact unlock with clearance plus an active membership.",
  },
  {
    q: "Which trades are listed?",
    a: "Nine services: appliance repair, electrical, HVAC, handyman, landscaping, painting, pest control, plumbing, and roofing.",
  },
];

export const plans = [
  {
    id: "homeowner" as const,
    name: "Homeowner",
    price: "Free",
    period: "",
    tagline: "No project fee · no membership",
    href: "/signup?next=%2Faccount%2Fpost-job",
    cta: "Create a request",
    featured: false,
    features: [
      "Browse listings without an account",
      "Post a request after you sign up",
      "Compare quotes on one job",
      "Keep messages and the review together",
      "Pay the professional directly",
    ],
    limits: [
      "No paid homeowner tiers or repair packages",
      "Cannot quote jobs or unlock pro contact tools",
    ],
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
      "Apply, finish screening, then wait for clearance",
      "See matching jobs after approval",
      "Contact details unlock with an active trial or membership",
      "No project commission through LocalHomeFix",
    ],
    limits: [
      "Not a Bronze/Silver/Gold repair package ladder",
      "Paused or cancelled membership locks contact again",
    ],
  },
];
