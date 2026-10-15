import { BadgeDollarSign, CalendarDays, Check, CreditCard, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { StatRow } from "@/components/ui/stat-row";
import { photos } from "@/lib/media";

const points = [
  "Public listings appear only after administrator review",
  "Screening and marketplace clearance stay separate",
  "The request, quotes, messages, and review stay connected",
  "Homeowners pay LocalHomeFix nothing for the project",
];

const stats = [
  { value: "$0", label: "Homeowner project fee", icon: BadgeDollarSign },
  { value: "9", label: "Catalog trades", icon: Wrench },
  { value: "$19.99", label: "Pro membership / month", icon: CreditCard },
  { value: "3", label: "Free months after approval", icon: CalendarDays },
];

export function HomeTrust() {
  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <div
            className="h-[420px] overflow-hidden rounded-[20px] bg-cover bg-center md:h-[500px]"
            style={{ backgroundImage: `url(${photos.trust})` }}
          />
          <div
            className="absolute -bottom-8 right-6 hidden h-44 w-40 overflow-hidden rounded-[20px] border-8 border-white bg-cover bg-center lg:block"
            style={{ backgroundImage: `url(${photos.trustAlt})` }}
          />
        </div>
        <div>
          <SectionHeading eyebrow="The marketplace" title="From first note to finished review" />
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-smoke text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-[15px] leading-7 text-copy">{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/how-it-works">How it works</Button>
          </div>
        </div>
      </div>
      <div className="container-site mt-16">
        <StatRow items={stats} />
      </div>
    </section>
  );
}
