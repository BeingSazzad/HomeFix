import Link from "next/link";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { professionals } from "@/Mockdata";

export function HomePros() {
  const list = professionals.filter((pro) => pro.clearance === "cleared").slice(0, 4);

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
          <div className="mt-4">
            <Button href="/browse-pros" variant="ghost" className="shrink-0">
              Browse all
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((pro) => {
            const image = photos.services[pro.categorySlug];
            return (
              <Link
                key={pro.id}
                href={`/browse-pros/${pro.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-white"
              >
                <div className="relative h-44 overflow-hidden bg-smoke">
                  <span
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                  <span
                    title="Verified"
                    aria-label="Verified"
                    className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-primary"
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start gap-1.5">
                    <h3 className="min-w-0 flex-1 text-[18px] leading-snug group-hover:text-primary">
                      {pro.businessName}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-primary">{pro.trade}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-copy">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-muted" />
                    {pro.city}, {pro.state}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-copy">
                    <Star className="h-3.5 w-3.5 shrink-0 text-accent" />
                    {pro.rating.toFixed(1)}
                    <span className="text-muted">· {pro.reviewCount} reviews</span>
                  </p>
                  <span className="mt-auto pt-4 font-display text-sm font-bold text-primary">
                    View profile →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
