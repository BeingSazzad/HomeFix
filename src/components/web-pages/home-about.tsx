import { Check, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { cn } from "@/lib/cn";

const points = [
  "Reviewed pros only",
  "Quotes in one place",
  "Browse free — no account needed",
  "Pay the pro directly",
  "Clear pricing — $0 homeowner fee",
  "Pros join after clearance",
];

const trustFaces = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80",
];

export function HomeAbout() {
  return (
    <section className="relative overflow-hidden bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.3] [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--primary)_28%,transparent)_1px,transparent_0)] [background-size:28px_28px]" />

      <div className="container-site relative grid items-center gap-10 pb-6 lg:grid-cols-2 lg:gap-12 lg:pb-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-smoke px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            About us
          </span>

          <h2 className="mt-4 max-w-lg text-[28px] leading-tight text-title md:text-[36px]">
            Local help, without the middleman on the bill
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-7 text-copy">
            LocalHomeFix connects homeowners with reviewed local pros. We organize the request —
            payment stays between you and the professional.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm leading-6 text-copy">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <Check className="h-3 w-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button href="/about">More information</Button>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center">
                {trustFaces.map((src, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={cn(
                      "h-8 w-8 rounded-full border-2 border-surface object-cover",
                      index > 0 && "-ml-2",
                    )}
                  />
                ))}
              </div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-title">
                <Users className="h-4 w-4 text-primary" />
                Trusted by local homeowners
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
          <div
            className="h-[360px] overflow-hidden rounded-[24px] bg-cover bg-center md:h-[420px]"
            style={{ backgroundImage: `url(${photos.trust})` }}
          />
          <div className="absolute right-4 top-4 rounded-[14px] bg-primary px-4 py-3 text-white shadow-md">
            <p className="font-display text-[24px] font-bold leading-none text-white">$0</p>
            <p className="mt-1 text-xs font-semibold text-white/85">Service fee</p>
          </div>
          <div
            className="absolute -bottom-4 left-4 h-24 w-32 overflow-hidden rounded-[14px] border-[3px] border-white bg-cover bg-center shadow-md sm:h-28 sm:w-40"
            style={{ backgroundImage: `url(${photos.trustAlt})` }}
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 soft-shadow">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white">
              <Zap className="h-3.5 w-3.5" />
            </span>
            <p className="font-display text-xs font-bold text-title">Fast & reliable</p>
          </div>
        </div>
      </div>
    </section>
  );
}
