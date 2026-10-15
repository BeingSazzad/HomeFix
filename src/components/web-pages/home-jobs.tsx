import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { getCategory, jobs } from "@/Mockdata";

export function HomeJobs() {
  return (
    <section className="bg-white py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Jobs" title="Open requests" />
          <Button href="/browse-jobs" variant="ghost">
            Browse jobs
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {jobs.map((job) => {
            const category = getCategory(job.categorySlug);
            return (
              <Link
                key={job.id}
                href="/login"
                className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-white soft-shadow"
              >
                <div className="relative h-44 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${photos.services[job.categorySlug]})` }}
                  />
                  <div className="absolute inset-0 bg-title/20" />
                </div>
                <div className="flex flex-1 flex-col border-t-2 border-transparent p-5 transition-colors group-hover:border-primary">
                  <p className="text-sm font-semibold text-primary">{category?.name}</p>
                  <h3 className="mt-2 text-[18px]">{job.title}</h3>
                  <p className="mt-2 text-sm text-copy">
                    {job.city}, {job.state} {job.zip}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
