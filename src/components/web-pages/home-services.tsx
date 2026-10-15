"use client";

import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ServiceTile } from "@/components/shared/service-tile";
import { categories } from "@/Mockdata";
import type { Category } from "@/types";

/** Homepage shows a short sample; full catalog lives on /services */
const featuredSlugs = ["plumbing", "electrical", "hvac", "handyman"] as const;

export function HomeServices() {
  const router = useRouter();
  const featured = featuredSlugs
    .map((slug) => categories.find((item) => item.slug === slug))
    .filter((item): item is Category => Boolean(item));

  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Services"
            title="What can we help fix?"
            description="Common trades first — see all nine on Services."
          />
          <Button href="/services" variant="ghost" className="hidden shrink-0 sm:inline-flex">
            View all
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((category) => (
            <ServiceTile
              key={category.id}
              category={category}
              onSelect={(slug) => router.push(`/browse-pros?category=${slug}`)}
            />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button href="/services" variant="ghost">
            View all
          </Button>
        </div>
      </div>
    </section>
  );
}
