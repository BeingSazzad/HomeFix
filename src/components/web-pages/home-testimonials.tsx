"use client";

import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * DEMO DATA:
 * Placeholder homeowner testimonials.
 * Designed as a swappable component with hidden state:
 * If testimonials array is empty, renders null so the section cleanly disappears.
 */
const DEMO_TESTIMONIALS = [
  {
    name: "Maya Chen",
    place: "Austin, TX",
    trade: "Plumbing repair",
    rating: 5,
    initials: "MC",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=450&q=80",
    body: "Posted my leaking water heater at 8 AM. By 9:30 AM I had three itemized quotes. The plumber arrived on time, completed the repair cleanly, and I paid him directly via card. Zero hassle.",
  },
  {
    name: "Jordan Hale",
    place: "Round Rock, TX",
    trade: "Electrical rewire",
    rating: 5,
    initials: "JH",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=450&q=80",
    body: "Most lead sites sell your phone number to 10 companies who blow up your phone for days. On LocalHomeFix, pros only messaged through the request. Completely stress-free.",
  },
  {
    name: "Elena Ruiz",
    place: "Cedar Park, TX",
    trade: "HVAC maintenance",
    rating: 5,
    initials: "ER",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&h=450&q=80",
    body: "The side-by-side quote comparison made it effortless to see who included parts and a labor guarantee. What the technician quoted was exactly what I paid.",
  },
];

export function HomeTestimonials({
  items = DEMO_TESTIMONIALS,
}: {
  items?: typeof DEMO_TESTIMONIALS;
}) {
  // HIDDEN STATE: If 0 testimonials, hide the entire section without breaking layout
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Reviews & Stories"
            title="Home repair is about trust"
            description="Hear from homeowners we've helped. Their stories prove our promise of a stress-free experience."
          />
        </div>

        <ul className="mt-12 sm:mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.name}
              className="flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-line bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                {item.photo ? (
                  <div className="overflow-hidden rounded-[18px] bg-smoke">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : null}

                <div className="mt-5 flex items-center justify-between">
                  <div
                    className="flex items-center gap-0.5"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-accent text-accent"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <Quote className="h-5 w-5 shrink-0 text-primary/25" aria-hidden="true" />
                </div>

                <p className="mt-3.5 font-['Inter_Display',Inter,sans-serif] text-[15px] sm:text-[15.5px] leading-[25px] tracking-[-0.15px] text-[#4a5568]">
                  &ldquo;{item.body}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-line/60 pt-4">
                <div className="min-w-0 flex-1">
                  <p className="font-geist text-[15px] font-medium text-black leading-tight">
                    {item.name}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-[#757575]">
                    {item.place} • {item.trade}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}