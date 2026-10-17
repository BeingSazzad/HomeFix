"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, NativeSelect, TextField } from "@/components/ui/field";
import { ProCard } from "@/components/shared/pro-card";
import { categories, professionals } from "@/Mockdata";
import {
  setCategory,
  setMaxPrice,
  setMinRating,
  setQuery,
  setSort,
  setZip,
} from "@/redux/slices/filterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function BrowseProsClient() {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const category = filters.category || params.get("category") || "";
  const location = filters.zip || params.get("zip") || params.get("location") || "";

  const results = useMemo(() => {
    const locationQ = location.trim().toLowerCase();
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
    const minRating = filters.minRating ? Number(filters.minRating) : null;

    const list = professionals.filter((pro) => {
      const matchesCategory = !category || pro.categorySlug === category;
      const locationHaystack = `${pro.zip} ${pro.city} ${pro.state}`.toLowerCase();
      const matchesLocation =
        !locationQ ||
        locationHaystack.includes(locationQ) ||
        (/^\d+$/.test(locationQ) && pro.zip.startsWith(locationQ.slice(0, 3)));
      const haystack = `${pro.businessName} ${pro.trade} ${pro.bio}`.toLowerCase();
      const matchesQuery = !filters.query || haystack.includes(filters.query.toLowerCase());
      const matchesPrice = maxPrice == null || !Number.isFinite(maxPrice) || pro.startingPrice <= maxPrice;
      const matchesRating = minRating == null || !Number.isFinite(minRating) || pro.rating >= minRating;
      return (
        matchesCategory &&
        matchesLocation &&
        matchesQuery &&
        matchesPrice &&
        matchesRating &&
        pro.clearance === "cleared"
      );
    });

    return [...list].sort((a, b) => {
      if (filters.sort === "reviews") return b.reviewCount - a.reviewCount;
      if (filters.sort === "jobs") return b.jobsCompleted - a.jobsCompleted;
      if (filters.sort === "price_low") return a.startingPrice - b.startingPrice;
      if (filters.sort === "price_high") return b.startingPrice - a.startingPrice;
      return b.rating - a.rating;
    });
  }, [category, filters, location]);

  return (
    <section className="bg-surface py-12">
      <div className="container-site">
        <div className="grid gap-3 rounded-[14px] bg-white p-5 soft-shadow md:grid-cols-3 lg:grid-cols-6">
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
          <Field label="Location">
            <TextField
              value={location}
              onChange={(event) => dispatch(setZip(event.target.value))}
              placeholder="ZIP or city"
            />
          </Field>
          <Field label="Max starting $">
            <TextField
              type="number"
              min={0}
              value={filters.maxPrice}
              onChange={(event) => dispatch(setMaxPrice(event.target.value))}
              placeholder="e.g. 150"
            />
          </Field>
          <Field label="Min rating">
            <NativeSelect
              value={filters.minRating}
              onChange={(event) => dispatch(setMinRating(event.target.value))}
            >
              <option value="">Any</option>
              <option value="4.5">4.5+</option>
              <option value="4.7">4.7+</option>
              <option value="4.8">4.8+</option>
            </NativeSelect>
          </Field>
          <Field label="Sort">
            <NativeSelect
              value={filters.sort}
              onChange={(event) => dispatch(setSort(event.target.value as typeof filters.sort))}
            >
              <option value="rated">Highest rated</option>
              <option value="reviews">Most reviews</option>
              <option value="jobs">Most jobs completed</option>
              <option value="price_low">Starting price ↑</option>
              <option value="price_high">Starting price ↓</option>
            </NativeSelect>
          </Field>
        </div>
        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No reviewed professionals match this view"
              description="Try another service, price, or location — or post a request for offers."
              actionLabel="Post a request"
              href="/signup?next=%2Faccount%2Fpost-job"
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
            {results.map((pro) => (
              <div key={pro.id} className="min-w-0">
                <ProCard pro={pro} />
              </div>
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
