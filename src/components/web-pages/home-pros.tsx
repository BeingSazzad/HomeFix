"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ProCard } from "@/components/shared/pro-card";
import { professionals } from "@/Mockdata";

export function HomePros() {
  const list = professionals.filter((pro) => pro.clearance === "cleared");
  const scroller = useRef<HTMLDivElement>(null);

  function scrollBy(dir: -1 | 1) {
    const el = scroller.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Local professionals"
            title="Pros you can browse today"
            description="Reviewed pros only. Free to look — no account needed."
          />
        </div>

        <div className="relative mt-8">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-primary shadow-md hover:bg-smoke md:grid"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-primary shadow-md hover:bg-smoke md:grid"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scroller}
            className="-mx-1 flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {list.map((pro) => (
              <ProCard key={pro.id} pro={pro} className="w-[260px] shrink-0 sm:w-[280px]" />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button href="/browse-pros" variant="ghost">
            Browse all
          </Button>
        </div>
      </div>
    </section>
  );
}
