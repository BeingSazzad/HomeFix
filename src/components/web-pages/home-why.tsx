"use client";

import { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  Handshake,
  MessagesSquare,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const reasons = [
  {
    icon: Search,
    title: "Browse without signing up",
    text: "Anyone can read public pro profiles. Create an account only when you want to post a job or apply as a professional.",
  },
  {
    icon: ShieldCheck,
    title: "Only reviewed pros appear",
    text: "A pro shows up in search after an administrator finishes review. Background screening is a separate step from that listing decision.",
  },
  {
    icon: MessagesSquare,
    title: "Quotes and chat on one job",
    text: "Every quote, message, and post-job review stays attached to the same request so nothing gets scattered across emails.",
  },
  {
    icon: BadgeDollarSign,
    title: "Free for homeowners",
    text: "You pay LocalHomeFix nothing for the repair. Professionals pay $19.99 a month after three free months.",
  },
  {
    icon: Handshake,
    title: "Pay the pro directly",
    text: "Price, schedule, contract, and the repair bill stay between you and the professional. There is no job checkout on this site.",
  },
  {
    icon: Wrench,
    title: "Nine home services",
    text: "Appliance repair, electrical, HVAC, handyman, landscaping, painting, pest control, plumbing, and roofing.",
  },
];

export function HomeWhy() {
  const scroller = useRef<HTMLDivElement>(null);

  function move(direction: -1 | 1) {
    const node = scroller.current;
    if (!node) return;
    const card = node.querySelector("article");
    const amount = (card?.clientWidth ?? 340) + 20;
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Why LocalHomeFix"
            title="We organize the job. Pros do the work."
            description="Post once, compare quotes from reviewed locals, and settle payment with the pro — not through LocalHomeFix."
          />
          <div className="flex flex-col items-end gap-2">
            <p className="hidden text-[12px] font-semibold uppercase tracking-wide text-muted sm:block">
              More reasons
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Show previous reasons"
                onClick={() => move(-1)}
                className="grid h-12 w-12 place-items-center rounded-[10px] bg-primary text-white hover:bg-primary-hover"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Show next reasons"
                onClick={() => move(1)}
                className="grid h-12 w-12 place-items-center rounded-[10px] bg-primary text-white hover:bg-primary-hover"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scroller}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reasons.map((item) => (
            <article
              key={item.title}
              className="w-[min(100%,340px)] shrink-0 snap-start rounded-[20px] bg-white p-6 soft-shadow sm:w-[calc(50%-10px)] xl:w-[calc(33.333%-14px)]"
            >
              <span className="grid h-14 w-14 place-items-center rounded-[10px] bg-primary text-white">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-[20px]">{item.title}</h3>
              <p className="mt-3 text-[16px] leading-7 text-copy">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
