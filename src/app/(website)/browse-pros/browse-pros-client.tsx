"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, NativeSelect, TextField } from "@/components/ui/field";
import { ProCard } from "@/components/shared/pro-card";
import { categories, professionals } from "@/Mockdata";
import { setCategory, setQuery, setSort, setZip } from "@/redux/slices/filterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function BrowseProsClient() {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const category = filters.category || params.get("category") || "";
  const zip = filters.zip || params.get("zip") || "";

  const results = useMemo(() => {
    const list = professionals.filter((pro) => {
      const matchesCategory = !category || pro.categorySlug === category;
      const matchesZip = !zip || pro.zip.startsWith(zip.slice(0, 3));
      const haystack = `${pro.businessName} ${pro.trade} ${pro.bio}`.toLowerCase();
      const matchesQuery = !filters.query || haystack.includes(filters.query.toLowerCase());
      return matchesCategory && matchesZip && matchesQuery && pro.clearance === "cleared";
    });
    return [...list].sort((a, b) => {
      if (filters.sort === "reviews") return b.reviewCount - a.reviewCount;
      if (filters.sort === "jobs") return b.jobsCompleted - a.jobsCompleted;
      return b.rating - a.rating;
    });
  }, [category, filters.query, filters.sort, zip]);

  return (
    <section className="bg-surface py-12">
      <div className="container-site">
        <div className="grid gap-3 rounded-[14px] bg-white p-5 soft-shadow md:grid-cols-4">
          <Field label="Search">
            <TextField
              value={filters.query}
              onChange={(event) => dispatch(setQuery(event.target.value))}
              placeholder="Name or service"
            />
          </Field>
          <Field label="Category">
            <NativeSelect
              value={category}
              onChange={(event) => dispatch(setCategory(event.target.value))}
            >
              <option value="">All services</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="ZIP">
            <TextField
              value={zip}
              onChange={(event) => dispatch(setZip(event.target.value))}
              placeholder="78701"
            />
          </Field>
          <Field label="Sort">
            <NativeSelect
              value={filters.sort}
              onChange={(event) => dispatch(setSort(event.target.value as typeof filters.sort))}
            >
              <option value="rated">Highest rated</option>
              <option value="reviews">Most reviews</option>
              <option value="jobs">Most jobs completed</option>
            </NativeSelect>
          </Field>
        </div>
        <p className="mt-4 text-sm text-muted">{results.length} professionals in this view</p>
        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No cleared providers match this view"
              description="Try another service or ZIP. If you already have a draft, you can post the request and wait for quotes."
              actionLabel="Post a request"
              href="/signup"
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((pro) => (
              <ProCard key={pro.id} pro={pro} />
            ))}
          </div>
        )}
        <div className="mt-8">
          <Button href="/pro-register" variant="ghost" size="sm">
            Start a provider application
          </Button>
        </div>
      </div>
    </section>
  );
}
