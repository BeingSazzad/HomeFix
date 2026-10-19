export const faqs = [
  {
    q: "Do I need an account to browse contractors?",
    a: "No. Anyone can search verified local contractors, view ratings, and check past project photos for free. You only need a free account when you're ready to post a job and receive competitive quotes.",
  },
  {
    q: "How does LocalHomeFix make money?",
    a: "Homeowners pay $0. We don't take booking fees, retainers, or percentages of your invoice. Independent contractors pay a simple $19.99/month membership after a 3-month free trial to quote unlimited local jobs.",
  },
  {
    q: "Will I get spammed with sales calls?",
    a: "Never. Unlike lead-generation sites that sell your number to 10 companies, we keep your personal phone and email private. Pros review your request and send itemized quotes directly through your secure account.",
  },
  {
    q: "How do payments work?",
    a: "You agree on the price and pay your contractor directly via card, check, cash, or digital transfer when the job is completed to your satisfaction. We never hold your money or charge middleman checkout fees.",
  },
  {
    q: "What does the Verified badge mean?",
    a: "Every verified contractor has submitted proof of state trade licensing, active business registration, and passed our background review before being cleared to receive customer requests.",
  },
  {
    q: "How quickly do contractors respond?",
    a: "Most requests receive their first 2 to 3 itemized quotes within 15 to 45 minutes during business hours.",
  },
  {
    q: "What if I'm not sure which trade to pick?",
    a: "Use our 'Describe Issue' tool on the homepage. Just explain what you see, hear, or smell in everyday words, and our system will route it to the right licensed trade (or a trusted handyman).",
  },
  {
    q: "Which areas do you currently serve?",
    a: "We currently serve greater Austin, TX, including Round Rock, Cedar Park, Pflugerville, Westlake, Bee Cave, Buda, and Lakeway.",
  },
];

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
    href: "/signup?next=%2Faccount%2Fpost-job",
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
      { text: "Quote unlimited Austin homeowner requests", icon: "briefcase" },
      { text: "Verified Austin Pro badge on directory", icon: "shield" },
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
      { text: "Priority search placement in directory", icon: "award" },
      { text: "Featured contractor profile badge", icon: "sparkles" },
      { text: "Dedicated local Austin support line", icon: "phone" },
      { text: "Quarterly job request analytics", icon: "trending" },
    ],
  },
];

