"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Briefcase, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, NativeSelect, TextField } from "@/components/ui/field";
import { ProCard } from "@/components/shared/pro-card";
import { categories, professionals } from "@/Mockdata";
import { loginAs } from "@/redux/slices/authSlice";
import {
  setCategory,
  setMaxPrice,
  setMinRating,
  setQuery,
  setSort,
  setZip,
} from "@/redux/slices/filterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { postJobHref } from "@/lib/role-access";

export function BrowseProsClient() {
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
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
      const haystack = `${pro.name} ${pro.businessName} ${pro.trade} ${pro.bio}`.toLowerCase();
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
    <section className="bg-surface py-10 md:py-12">
      <div className="container-site">
        {user?.role === "pro" && (
          <div className="mb-6 rounded-[16px] border border-primary/25 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-xs">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm sm:text-base font-bold text-title">
                      You are viewing as a Professional Contractor
                    </p>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Pro Mode
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#757575]">
                    This directory is for homeowners to find pros. To quote on live customer jobs, visit the Jobs Board.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button href="/pro/jobs" size="sm" className="font-semibold shadow-xs">
                  Available Jobs Board <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
                </Button>
                <Button href="/browse-pros/pro-1" variant="ghost" size="sm">
                  My Storefront
                </Button>
                <button
                  type="button"
                  onClick={() => dispatch(loginAs("homeowner"))}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-smoke px-3 py-1.5 font-display text-xs font-medium text-title hover:bg-white hover:border-primary/40 transition-colors"
                  title="Switch to Homeowner Mode"
                >
                  <Repeat className="h-3.5 w-3.5 text-muted" />
                  <span>Switch to Homeowner</span>
                </button>
              </div>
            </div>
          </div>
        )}

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
              href={postJobHref(user)}
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
            {results.map((pro) => (
              <div key={pro.id} className="min-w-0 flex h-full">
                <ProCard pro={pro} />
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 flex items-center justify-between">
          {user?.role === "pro" ? (
            <Button href="/pro" variant="ghost" size="sm">
              ← Return to Pro Dashboard
            </Button>
          ) : (
            <Button href="/pro-register" variant="ghost" size="sm">
              Are you a contractor? Join the Pro Network ↗
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
