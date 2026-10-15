"use client";

import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceTile } from "@/components/shared/service-tile";
import { categories } from "@/Mockdata";

export function HomeServices() {
  const router = useRouter();

  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <SectionHeading eyebrow="Services" title="Nine local trades" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
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
