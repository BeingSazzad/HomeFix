import { BadgeDollarSign, CalendarDays, CreditCard } from "lucide-react";
import { StatRow } from "@/components/ui/stat-row";

/** Three clear pricing facts — no filler metrics */
const facts = [
  { value: "$0", label: "Homeowner fee to LocalHomeFix", icon: BadgeDollarSign },
  { value: "$19.99", label: "Pro membership per month", icon: CreditCard },
  { value: "3 mo", label: "Free for pros after approval", icon: CalendarDays },
];

export function HomeFacts() {
  return (
    <section className="bg-white py-[var(--section-sm)]">
      <div className="container-site">
        <StatRow items={facts} />
      </div>
    </section>
  );
}
