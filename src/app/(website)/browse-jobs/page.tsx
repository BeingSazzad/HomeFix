"use client";

import { useMemo, useState } from "react";
import { Field, NativeSelect, TextField } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/empty-state";
import { PageBanner } from "@/components/layout/page-banner";
import { JobCard } from "@/components/shared/job-card";
import { categories, jobs } from "@/Mockdata";
import { photos } from "@/lib/media";
import { useAppSelector } from "@/redux/hooks";

export default function BrowseJobsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const results = useMemo(
    () =>
      jobs.filter((job) => {
        const matchesCategory = !category || job.categorySlug === category;
        const haystack = `${job.title} ${job.description}`.toLowerCase();
        return matchesCategory && (!query || haystack.includes(query.toLowerCase()));
      }),
    [category, query],
  );

  return (
    <>
      <PageBanner
        eyebrow="Jobs"
        title="Find jobs near you"
        description="Approved professionals with an active membership can see homeowner contact details."
        image={photos.banners.jobs}
      />
      <section className="bg-surface py-12">
        <div className="container-site">
          <div className="grid gap-3 rounded-[14px] bg-white p-4 md:grid-cols-2">
            <Field label="Search">
              <TextField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Leak, painting, outlet…" />
            </Field>
            <Field label="Category">
              <NativeSelect value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">All services</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          {results.length === 0 ? (
            <div className="mt-6">
              <EmptyState title="No jobs in this view" description="Adjust the filters or check back later." />
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {results.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  href={user?.role === "pro" ? `/pro/jobs/${job.id}` : "/login"}
                  actionLabel={user?.role === "pro" ? "View details" : "Log in to quote"}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
