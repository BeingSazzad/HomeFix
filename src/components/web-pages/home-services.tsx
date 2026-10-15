"use client";

import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { ServiceTile } from "@/components/shared/service-tile";
import { categories } from "@/Mockdata";
import type { Category } from "@/types";

/** Homepage shows a short sample; full catalog lives on /services */
const featuredSlugs = ["plumbing", "electrical", "hvac"] as const;

export function HomeServices() {
  const router = useRouter();
  const featured = featuredSlugs
    .map((slug) => categories.find((item) => item.slug === slug))
    .filter((item): item is Category => Boolean(item));

  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Services"
            title="What can we help fix?"
            description="Common trades first — see all nine on Services."
          />
          <div className="mt-4">
            <Button href="/services" variant="ghost" className="shrink-0">
              View all
            </Button>
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((category) => (
            <ServiceTile
              key={category.id}
              category={category}
              onSelect={(slug) => router.push(`/browse-pros?category=${slug}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
