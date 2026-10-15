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
    title: "Browse first",
    text: "Read public listings without an account. Sign in only to post a request or apply as a professional.",
  },
  {
    icon: ShieldCheck,
    title: "Cleared listings",
    text: "A profile is public only after administrator review. Screening and clearance stay separate.",
  },
  {
    icon: MessagesSquare,
    title: "One connected request",
    text: "Quotes, messages, and the completed-job review stay on the same job.",
  },
  {
    icon: BadgeDollarSign,
    title: "No homeowner project fee",
    text: "Homeowners pay LocalHomeFix nothing for the repair. Pros pay $19.99 a month after three free months.",
  },
  {
    icon: Handshake,
    title: "Payment stays between you",
    text: "Scope, contract, schedule, and the repair bill stay with the professional. There is no job checkout here.",
  },
  {
    icon: Wrench,
    title: "Nine catalog trades",
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
            eyebrow="Why choose us"
            title="A marketplace, not a contractor"
            description="LocalHomeFix organizes the request. It does not do the repair or take the project payment."
          />
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous reasons"
              onClick={() => move(-1)}
              className="grid h-12 w-12 place-items-center rounded-[10px] bg-primary text-white hover:bg-primary-hover"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next reasons"
              onClick={() => move(1)}
              className="grid h-12 w-12 place-items-center rounded-[10px] bg-primary text-white hover:bg-primary-hover"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
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
              <p className="mt-3 text-[15px] leading-7 text-copy">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
