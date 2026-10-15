import Link from "next/link";
import {
  ClipboardList,
  MessagesSquare,
  Search,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

const steps: { n: string; title: string; text: string; icon: LucideIcon }[] = [
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col justify-center rounded-[20px] bg-smoke p-6 md:p-8 xl:min-h-[220px]">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              Working process
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            </span>
            <h2 className="mt-4 text-[28px] leading-tight text-title md:text-[34px]">
              Our simple working process
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-copy">
              Free for homeowners. Pros join after approval.
            </p>
          </div>

          {steps.map((step) => (
            <article
              key={step.n}
              className="relative rounded-[20px] border border-primary/15 bg-white p-6 transition-colors hover:border-primary/40 md:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-smoke text-primary">
                  <step.icon className="h-6 w-6" />
                </span>
                <span className="font-display text-[40px] font-bold leading-none text-primary/20">
                  {step.n}
                </span>
              </div>
              <h3 className="mt-5 text-[18px] font-bold text-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-copy">{step.text}</p>
            </article>
          ))}

          <Link
            href="/how-it-works"
            className={cn(
              "flex flex-col justify-center rounded-[20px] border border-dashed border-primary/30 bg-smoke/60 p-6 text-center transition-colors hover:border-primary hover:bg-smoke md:p-7",
            )}
          >
            <p className="font-display text-lg font-bold text-title">See full paths</p>
            <p className="mt-2 text-sm leading-6 text-copy">
              Separate steps for homeowners and professionals.
            </p>
            <span className="mt-4 font-display text-sm font-bold text-primary">How it works →</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
