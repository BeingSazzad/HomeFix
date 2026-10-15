import Link from "next/link";
import { Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { cn } from "@/lib/cn";

const points = [
  "Reviewed pros only",
  "Quotes in one place",
  "Browse free — no account needed",
  "Post a request when you are ready",
  "Pay the pro directly",
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
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--primary)_28%,transparent)_1px,transparent_0)] [background-size:28px_28px]" />

      <div className="container-site relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            About us
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
          </span>

          <h2 className="mt-3 max-w-lg text-[26px] leading-tight text-title md:text-[32px]">
            Local help, without the middleman on the bill
          </h2>
          <p className="mt-2 max-w-md text-[14px] leading-6 text-copy">
            LocalHomeFix connects homeowners with reviewed local pros. We organize the request —
            payment stays between you and the professional.
          </p>

          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm leading-6 text-copy">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-white">
                  <Check className="h-3 w-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4">
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

        <div className="relative mx-auto w-full max-w-[480px] lg:max-w-[440px] lg:justify-self-end">
          <div
            className="h-[340px] overflow-hidden rounded-[20px] bg-cover bg-center sm:h-[380px] md:h-[400px]"
            style={{ backgroundImage: `url(${photos.trust})` }}
          />
          <div className="absolute right-4 top-4 rounded-[14px] bg-primary px-3.5 py-3 text-white shadow-md">
            <p className="font-display text-[26px] font-bold leading-none text-white">$0</p>
            <p className="mt-1 text-xs font-semibold leading-snug text-white/85">Homeowner fee</p>
          </div>
          <div
            className="absolute -bottom-4 right-4 h-24 w-32 overflow-hidden rounded-[14px] border-[3px] border-primary bg-cover bg-center sm:h-28 sm:w-40"
            style={{ backgroundImage: `url(${photos.trustAlt})` }}
          />
          <Link
            href="/how-it-works"
            className="absolute bottom-4 left-4 rounded-full bg-white px-3.5 py-2 font-display text-xs font-bold text-primary soft-shadow"
          >
            How it works →
          </Link>
        </div>
      </div>
    </section>
  );
}
