"use client";

import Link from "next/link";
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
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Services"
            title="What can we help fix?"
            description="Start with a common trade, or browse the full list of home services we cover."
          />
          <Button href="/services" variant="ghost" className="shrink-0">
            View all services
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((category) => (
            <ServiceTile
              key={category.id}
              category={category}
              onSelect={(slug) => router.push(`/browse-pros?category=${slug}`)}
            />
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-copy md:text-left">
          Also covered: appliance repair, handyman, landscaping, painting, pest control, and roofing.{" "}
          <Link href="/services" className="font-semibold text-primary">
            See all nine
          </Link>
        </p>
      </div>
    </section>
  );
}
