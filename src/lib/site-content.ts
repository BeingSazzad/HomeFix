export const homeownerFaqs = [
  {
    q: "Do I need an account to browse contractors?",
    a: "No. You can freely explore verified local contractor profiles, read authentic customer reviews, and check past project photos without creating an account. You only need a free account when you're ready to post a job and receive competitive bids.",
  },
  {
    q: "Is it free to get quotes, and am I obligated to hire?",
    a: "Getting quotes is 100% free with zero obligation. You can post your repair request, compare itemized quotes side-by-side from background-checked local specialists, and only hire if you find a pro that matches your budget and schedule.",
  },
  {
    q: "Are contractors licensed, insured, and background-checked?",
    a: "Yes. Trade specialists (electricians, plumbers, HVAC technicians) must hold active state trade licenses and commercial liability insurance. All independent pros pass identity verification and criminal background screening before joining.",
  },
  {
    q: "How do payments work?",
    a: "You agree on the price and pay your contractor directly after the job is completed to your satisfaction—via credit card, check, cash, or digital transfer. LocalHomeFix never holds your funds or charges middleman checkout surcharges.",
  },
  {
    q: "What happens if I'm not satisfied or an issue arises?",
    a: "Contractors provide clear itemized scopes and standard workmanship warranties on their repairs. If questions or discrepancies occur, our customer support team is available to help mediate and ensure a fair resolution.",
  },
  {
    q: "Can I get same-day or emergency repair services?",
    a: "Yes. Many of our local pros offer emergency callouts for burst pipes, electrical shorts, and sudden AC failures. When posting your request, simply select 'Urgent / ASAP' to notify on-duty technicians immediately.",
  },
  {
    q: "How quickly do contractors respond to requests?",
    a: "Most standard repair requests receive their first 2 to 3 itemized quotes within 15 to 45 minutes during normal business hours.",
  },
  {
    q: "What if I'm not sure which trade to pick?",
    a: "Use our 'Describe Issue' tool on the homepage. Just explain what you see, hear, or smell in everyday words, and our system will route it to the right licensed trade (or a trusted handyman).",
  },
];

export const proFaqs = [
  {
    q: "How much does it cost for contractors to join?",
    a: "We offer a 3-month completely free trial. Afterward, membership is a flat $19.99/month. We charge zero percent commission on your completed jobs and never charge per-lead fees.",
  },
  {
    q: "How do I receive leads and job notifications?",
    a: "Once cleared, you will receive real-time notifications whenever a homeowner in your service area posts a request in your trade. You can inspect project photos, descriptions, and urgency before submitting an itemized bid.",
  },
  {
    q: "Do you take a cut of my earnings or charge for leads?",
    a: "No. Unlike other platforms that sell expensive leads to multiple contractors or take a 15–25% cut of every project, LocalHomeFix operates on a transparent, flat monthly membership. You keep 100% of every dollar you charge.",
  },
  {
    q: "What documents do I need to clear verification?",
    a: "Pros must submit proof of relevant state or municipal trade licensing (for plumbing, electrical, and HVAC), current general liability insurance certificate, and complete standard identity screening.",
  },
  {
    q: "How and when do homeowners pay me?",
    a: "Homeowners pay you directly upon job completion using your preferred payment methods (cash, check, card, or direct transfer). LocalHomeFix never withholds your funds or charges checkout fees.",
  },
  {
    q: "Can I pause or cancel my membership anytime?",
    a: "Yes, there are no long-term contracts. You can pause or cancel your subscription at any time directly from your Pro Dashboard settings with one click.",
  },
];

export const faqs = homeownerFaqs;

export type PlanFeature = {
  text: string;
  icon: string;
};

export type PlanItem = {
  id: "homeowner" | "pro" | "pro-annual";
  name: string;
  badge?: string;
  price: string;
  period: string;
  tagline: string;
  href: string;
  cta: string;
  featured: boolean;
  features: PlanFeature[];
};

export const plans: PlanItem[] = [
  {
    id: "homeowner",
    name: "Homeowners",
    badge: "$0 Markup",
    price: "$0",
    period: "/forever",
    tagline: "Free to browse, post, and compare quotes.",
    href: "/login?next=%2Faccount%2Fpost-job",
    cta: "Post a request",
    featured: false,
    features: [
      { text: "Browse verified local contractor profiles", icon: "search" },
      { text: "Post unlimited repair requests", icon: "clipboard" },
      { text: "Compare itemized quotes side-by-side", icon: "layers" },
      { text: "Direct contractor payment upon completion", icon: "shield" },
      { text: "Zero middleman markup or hidden fees", icon: "check" },
    ],
  },
  {
    id: "pro",
    name: "Pro Monthly",
    badge: "🔥 Popular",
    price: "$19.99",
    period: "/per month",
    tagline: "First 3 months completely free. Cancel anytime.",
    href: "/pro-register",
    cta: "Start 3 months free",
    featured: true,
    features: [
      { text: "Keep 100% of your earnings ($0 job cut)", icon: "percent" },
      { text: "Quote unlimited local homeowner requests", icon: "briefcase" },
      { text: "Verified Pro badge on pro listings", icon: "shield" },
      { text: "Direct homeowner chat & scheduling", icon: "message" },
      { text: "Zero bidding fees or pay-per-lead costs", icon: "zap" },
    ],
  },
  {
    id: "pro-annual",
    name: "Pro Annual",
    badge: "Save 25%",
    price: "$14.99",
    period: "/per month",
    tagline: "Billed annually ($179/yr) after 3-month trial.",
    href: "/pro-register",
    cta: "Get started",
    featured: false,
    features: [
      { text: "All Pro Monthly features included", icon: "check" },
      { text: "Priority search placement in pro search", icon: "award" },
      { text: "Featured contractor profile badge", icon: "badgeCheck" },
      { text: "Dedicated priority support line", icon: "phone" },
      { text: "Quarterly job request analytics", icon: "trending" },
    ],
  },
];

