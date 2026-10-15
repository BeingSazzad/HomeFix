import { BadgeDollarSign, CalendarDays, Check, CreditCard, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { StatRow } from "@/components/ui/stat-row";
import { photos } from "@/lib/media";

const points = [
  "Only reviewed professionals appear in public search",
  "Background screening and listing approval stay separate decisions",
  "Your request keeps quotes, messages, and the final review together",
  "Homeowners pay LocalHomeFix $0 — pros pay for marketplace access",
];

const stats = [
  { value: "$0", label: "What homeowners pay us", icon: BadgeDollarSign },
  { value: "9", label: "Home service trades", icon: Wrench },
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
          <SectionHeading
            eyebrow="What you get"
            title="A clear place for the job — not a middleman on the bill"
            description="LocalHomeFix helps you find and talk to local pros. The repair payment stays between you and the professional you choose."
          />
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-smoke text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-[16px] leading-7 text-copy">{point}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/how-it-works">See the full flow</Button>
          </div>
        </div>
      </div>
      <div className="container-site mt-16">
        <StatRow items={stats} />
      </div>
    </section>
  );
}
