"use client";

import { useRouter } from "next/navigation";
import { ServiceTile } from "@/components/shared/service-tile";
import { Button } from "@/components/ui/button";
import { categories } from "@/Mockdata";

import { SectionHeading } from "@/components/ui/section-heading";
import { useAppSelector } from "@/redux/hooks";
import { postJobHref } from "@/lib/role-access";

export function ServicesCatalog() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Browse Pros"
            title="All home services"
            description="Pick a trade to browse reviewed pros nearby with verified work history and direct messaging."
          />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <ServiceTile
              key={category.id}
              category={category}
              onSelect={(slug) => router.push(`/browse-pros?category=${slug}`)}
            />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/browse-pros">Browse all pros</Button>
          <Button href={postJobHref(user)} variant="ghost">
            Post a request
          </Button>
        </div>
      </div>
    </section>
  );
}
