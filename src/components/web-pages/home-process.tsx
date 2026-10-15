import { ClipboardList, MessagesSquare, Search, Wallet } from "lucide-react";
import { ProcessGrid } from "@/components/ui/process-grid";

const steps = [
  {
    n: "01",
    title: "Describe the job",
    text: "Share the problem, location, and timing so matching pros can respond.",
    icon: ClipboardList,
  },
  {
    n: "02",
    title: "Browse reviewed pros",
    text: "Only cleared professionals appear in public search.",
    icon: Search,
  },
  {
    n: "03",
    title: "Compare quotes",
    text: "Quotes and chat stay on one request so you can decide clearly.",
    icon: MessagesSquare,
  },
  {
    n: "04",
    title: "Pay the pro",
    text: "Agree on price and pay the professional directly — not through us.",
    icon: Wallet,
  },
];

export function HomeProcess() {
  return (
    <section className="bg-white py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <ProcessGrid
          badge="Working process"
          title="Our simple working process"
          description="Free for homeowners. Pros join after approval."
          items={steps}
        />
      </div>
    </section>
  );
}
