import {
  BadgeDollarSign,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const reasons: { n: string; title: string; text: string; icon: LucideIcon }[] = [
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
  {
    n: "05",
    title: "Clear roles",
    text: "Homeowners hire free. Pros unlock contact with clearance and membership.",
    icon: UserCheck,
  },
];

export function HomeWhyChoose() {
  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col justify-center rounded-[20px] bg-white p-6 md:p-8 xl:min-h-[220px]">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              Why choose us
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            </span>
            <h2 className="mt-4 text-[28px] leading-tight text-title md:text-[34px]">
              Why homeowners choose LocalHomeFix
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-copy">
              A clear marketplace — not a middleman on the bill.
            </p>
          </div>

          {reasons.map((item) => (
            <article
              key={item.n}
              className="relative rounded-[20px] border border-primary/15 bg-white p-6 transition-colors hover:border-primary/40 md:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-smoke text-primary">
                  <item.icon className="h-6 w-6" />
                </span>
                <span className="font-display text-[40px] font-bold leading-none text-primary/20">
                  {item.n}
                </span>
              </div>
              <h3 className="mt-5 text-[18px] font-bold text-title">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-copy">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
