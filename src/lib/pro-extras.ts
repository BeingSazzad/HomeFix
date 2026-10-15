import { photos } from "@/lib/media";

export const portfolios: Record<string, { title: string; image: string }[]> = {
  "pro-1": [
    { title: "Kitchen supply line repair", image: photos.services.plumbing },
    { title: "Vanity fixture swap", image: photos.services["appliance-repair"] },
    { title: "Drain reseal", image: photos.heroInset },
  ],
  "pro-2": [
    { title: "Hallway outlet circuit", image: photos.services.electrical },
    { title: "Panel label tidy-up", image: photos.services.hvac },
    { title: "Lighting install", image: photos.services.handyman },
  ],
  "pro-3": [
    { title: "Heat pump service", image: photos.services.hvac },
    { title: "Filter and coil clean", image: photos.trust },
  ],
  "pro-4": [
    { title: "Interior room paint", image: photos.services.painting },
    { title: "Trim refresh", image: photos.services.landscaping },
  ],
};

export const trackerSteps = [
  { key: "posted", label: "Posted", statuses: ["draft", "active", "getting_quotes", "quotes_in", "hired", "scheduled", "in_progress", "completed"] },
  { key: "matched", label: "Matched", statuses: ["getting_quotes", "quotes_in", "hired", "scheduled", "in_progress", "completed"] },
  { key: "discussion", label: "In discussion", statuses: ["quotes_in", "hired", "scheduled", "in_progress", "completed"] },
  { key: "hired", label: "Hired", statuses: ["hired", "scheduled", "in_progress", "completed"] },
  { key: "completed", label: "Completed", statuses: ["completed"] },
] as const;
