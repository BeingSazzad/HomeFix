import { photos } from "@/lib/media";

type PortfolioItem = { title: string; image: string };

function shots(slug: string, titles: string[]): PortfolioItem[] {
  const pool = photos.portfolio[slug] ?? [photos.services[slug]].filter(Boolean);
  return titles.map((title, i) => ({
    title,
    image: pool[i % pool.length] ?? photos.services[slug],
  }));
}

/** Portfolio must match each pro’s trade — never mix plumber shots into HVAC, etc. */
export const portfolios: Record<string, PortfolioItem[]> = {
  "pro-1": shots("plumbing", [
    "Kitchen supply line repair",
    "Under-sink drain reseal",
    "Vanity fixture install",
  ]),
  "pro-2": shots("electrical", [
    "Hallway outlet circuit",
    "Panel tidy & labeling",
    "Interior lighting install",
  ]),
  "pro-3": shots("hvac", [
    "Outdoor heat pump service",
    "Condenser line maintenance",
    "Rooftop AC unit tune-up",
  ]),
  "pro-4": shots("painting", [
    "Interior room paint",
    "Trim and door refresh",
    "Clean edge wall finish",
  ]),
};

export const serviceLines: Record<string, string[]> = {
  plumbing: ["Leak repair", "Fixtures", "Drains", "Water heaters"],
  electrical: ["Outlets & switches", "Lighting", "Panels", "Troubleshooting"],
  hvac: ["Heat pumps", "AC service", "Furnaces", "Ductwork"],
  painting: ["Interior rooms", "Trim", "Cabinets", "Small exteriors"],
  handyman: ["Mounting", "Repairs", "Installs", "Punch lists"],
  landscaping: ["Beds", "Mulch", "Small hardscape", "Seasonal tidy"],
  roofing: ["Inspections", "Repairs", "Flashing", "Gutter ties"],
  "appliance-repair": ["Washer/dryer", "Dishwasher", "Fridge", "Range"],
  "pest-control": ["Inspection", "Treatment", "Follow-up", "Prevention"],
};

export const trackerSteps = [
  {
    key: "posted",
    label: "Posted",
    statuses: [
      "draft",
      "active",
      "getting_quotes",
      "quotes_in",
      "hired",
      "scheduled",
      "in_progress",
      "awaiting_confirm",
      "completed",
    ],
  },
  {
    key: "matched",
    label: "Matched",
    statuses: [
      "getting_quotes",
      "quotes_in",
      "hired",
      "scheduled",
      "in_progress",
      "awaiting_confirm",
      "completed",
    ],
  },
  {
    key: "discussion",
    label: "Offers",
    statuses: ["quotes_in", "hired", "scheduled", "in_progress", "awaiting_confirm", "completed"],
  },
  {
    key: "hired",
    label: "Booked",
    statuses: ["hired", "scheduled", "in_progress", "awaiting_confirm", "completed"],
  },
  {
    key: "progress",
    label: "In progress",
    statuses: ["in_progress", "awaiting_confirm", "completed"],
  },
  { key: "completed", label: "Completed", statuses: ["completed"] },
] as const;
