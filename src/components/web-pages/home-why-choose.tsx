import { BadgeDollarSign, MessageSquare, ShieldCheck, Wallet } from "lucide-react";
import { ProcessGrid } from "@/components/ui/process-grid";

const reasons = [
  {
    n: "01",
    title: "Free for homeowners",
    text: "Browse and post at $0. LocalHomeFix never charges you a project fee.",
    icon: BadgeDollarSign,
  },
  {
    n: "02",
    title: "Reviewed pros only",
    text: "Public search shows cleared professionals after screening and admin review.",
    icon: ShieldCheck,
  },
  {
    n: "03",
    title: "Quotes in one place",
    text: "Compare offers and messages on the same request — no scattered threads.",
    icon: MessageSquare,
  },
  {
    n: "04",
    title: "Pay the pro directly",
    text: "Agree on price yourself. We do not take the repair payment.",
    icon: Wallet,
  },
];

export function HomeWhyChoose() {
  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <ProcessGrid
          badge="Why choose us"
          title="Why homeowners choose LocalHomeFix"
          description="A clear marketplace — not a middleman on the bill."
          items={reasons}
          introClassName="bg-white"
        />
      </div>
    </section>
  );
}
