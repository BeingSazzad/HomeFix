import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { professionals } from "@/Mockdata";

export function HomePros() {
  const list = professionals.filter((pro) => pro.clearance === "cleared").slice(0, 4);

  return (
    <section className="bg-white py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <SectionHeading align="center" eyebrow="Professionals" title="Cleared local providers" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {list.map((pro) => (
            <Link key={pro.id} href="/signup" className="group text-center">
              <div
                className="mx-auto h-40 w-40 rounded-full bg-cover bg-center ring-8 ring-smoke transition-transform duration-300 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${photos.services[pro.categorySlug]})` }}
              />
              <h3 className="mt-5 text-[20px]">{pro.businessName}</h3>
              <p className="mt-1 text-sm font-semibold text-primary">{pro.trade}</p>
              <p className="text-sm text-copy">
                {pro.city}, {pro.state}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/browse-pros">Find a pro</Button>
        </div>
      </div>
    </section>
  );
}
