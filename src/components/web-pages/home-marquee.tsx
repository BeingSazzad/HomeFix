"use client";

import Link from "next/link";

const tickerItems = [
  { label: "Plumbing", href: "/browse-pros?category=plumbing" },
  { label: "Electrical Work", href: "/browse-pros?category=electrical" },
  { label: "AC & Heating", href: "/browse-pros?category=hvac" },
  { label: "Roof Repair", href: "/browse-pros?category=roofing" },
  { label: "Appliance Repair", href: "/browse-pros?category=appliance-repair" },
  { label: "Water Heaters", href: "/browse-pros?category=plumbing" },
  { label: "Painting & Drywall", href: "/browse-pros?category=painting" },
  { label: "Handyman Help", href: "/browse-pros?category=handyman" },
  { label: "Drain Cleaning", href: "/browse-pros?category=plumbing" },
  { label: "Pressure Washing", href: "/browse-pros?category=landscaping" },
  { label: "Gutter Cleaning", href: "/browse-pros?category=roofing" },
  { label: "Lawn & Yard Care", href: "/browse-pros?category=landscaping" },
];

export function HomeMarquee() {
  return (
    <div
      aria-label="Popular home repair services ticker"
      className="relative flex h-14 sm:h-16 w-full items-center overflow-hidden border-y border-white/20 bg-gradient-to-r from-[#0a42aa] via-[#0d56d6] via-45% to-[#0178be] text-white shadow-xs"
    >
      {/* Edge gradient masks for seamless overflow fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0a42aa] to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0178be] to-transparent sm:w-28" />

      {/* Infinite scrolling track (duplicated twice for seamless loop) */}
      <div className="flex animate-marquee select-none items-center">
        {tickerItems.map((item, i) => (
          <div key={`set-1-${i}`} className="flex items-center shrink-0">
            <Link
              href={item.href}
              className="px-5 sm:px-7 font-display text-[16px] sm:text-[17px] font-semibold tracking-tight text-white/95 transition-all hover:text-white hover:scale-105 inline-flex items-center"
            >
              {item.label}
            </Link>
            {/* Crisp white glowing dot separator */}
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              aria-hidden="true"
            />
          </div>
        ))}

        {tickerItems.map((item, i) => (
          <div key={`set-2-${i}`} className="flex items-center shrink-0">
            <Link
              href={item.href}
              className="px-5 sm:px-7 font-display text-[16px] sm:text-[17px] font-semibold tracking-tight text-white/95 transition-all hover:text-white hover:scale-105 inline-flex items-center"
            >
              {item.label}
            </Link>
            {/* Crisp white glowing dot separator */}
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  );
}