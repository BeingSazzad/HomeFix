import Link from "next/link";
import { Check, MessageSquare, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";

const features = [
  { icon: ShieldCheck, title: "Reviewed pros only" },
  { icon: MessageSquare, title: "Quotes in one place" },
];

const points = [
  "Browse free — no account needed",
  "Post a request when you are ready",
  "Pay the pro directly",
  "Pros join after clearance",
];

export function HomeAbout() {
  return (
    <section className="relative overflow-hidden bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--primary)_28%,transparent)_1px,transparent_0)] [background-size:28px_28px]" />

      <div className="container-site relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            About us
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
          </span>

          <h2 className="mt-4 max-w-lg text-[28px] leading-tight text-title md:text-[36px]">
            Local help, without the middleman on the bill
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-7 text-copy">
            LocalHomeFix connects homeowners with reviewed local pros. We organize the request —
            payment stays between you and the professional.
          </p>

          <div className="mt-6 grid gap-3 rounded-[16px] border border-primary/25 bg-white p-4 sm:grid-cols-2">
            {features.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-smoke text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <p className="font-display text-sm font-bold text-title">{item.title}</p>
              </div>
            ))}
          </div>

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

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button href="/about">More information</Button>
            <div className="flex items-center gap-3">
              <div className="flex">
                {["MC", "JH", "ER"].map((initials, index) => (
                  <span
                    key={initials}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-surface bg-primary font-display text-[10px] font-bold text-white"
                    style={{ marginLeft: index === 0 ? 0 : -8 }}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-title">
                <Users className="h-4 w-4 text-primary" />
                Trusted by local homeowners
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            className="aspect-[4/5] overflow-hidden rounded-[24px] bg-cover bg-center md:aspect-[5/6]"
            style={{ backgroundImage: `url(${photos.trust})` }}
          />
          <div className="absolute -right-2 top-6 rounded-[16px] bg-primary px-4 py-3 text-white shadow-lg md:right-4 md:px-5 md:py-4">
            <p className="font-display text-[28px] font-bold leading-none text-white md:text-[32px]">$0</p>
            <p className="mt-1 text-xs font-semibold leading-snug text-white/85">
              Homeowner
              <br />
              fee
            </p>
          </div>
          <div
            className="absolute -bottom-4 right-4 h-28 w-40 overflow-hidden rounded-[16px] border-4 border-primary bg-cover bg-center md:-bottom-6 md:right-8 md:h-32 md:w-48"
            style={{ backgroundImage: `url(${photos.trustAlt})` }}
          />
          <Link
            href="/how-it-works"
            className="absolute bottom-6 left-4 rounded-full bg-white px-4 py-2 font-display text-xs font-bold text-primary soft-shadow md:left-6"
          >
            How it works →
          </Link>
        </div>
      </div>
    </section>
  );
}
