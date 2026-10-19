"use client";

import { Star, MessageSquare } from "lucide-react";
import type { ReviewItem } from "@/redux/slices/featuresSlice";

interface SwappableReviewsSectionProps {
  proName: string;
  rating?: number;
  reviewCount?: number;
  reviews?: ReviewItem[];
}

/**
 * DEMO DATA COMPONENT:
 * Swappable customer reviews section.
 * When a pro has 0 reviews (or reviews array is empty),
 * this entire section renders null so no empty box or layout gap remains.
 */
export function SwappableReviewsSection({
  proName,
  rating,
  reviewCount,
  reviews = [],
}: SwappableReviewsSectionProps) {
  // HIDDEN STATE: If pro has 0 reviews, disappear completely
  if (!reviewCount || reviewCount <= 0 || reviews.length === 0) {
    return null;
  }

  return (
    <article className="rounded-[20px] bg-white p-5 soft-shadow md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-line pb-4">
        <div>
          <h2 className="text-[20px] font-bold text-title md:text-[22px]">
            Customer reviews
          </h2>
          <p className="mt-1 text-xs text-muted">
            Verified feedback from homeowners who hired {proName}
          </p>
        </div>
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-title">
          <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
          <span>{rating?.toFixed(1) ?? "5.0"} average</span>
          <span className="font-normal text-muted">({reviewCount})</span>
        </p>
      </div>

      <ul className="mt-5 space-y-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-[14px] border border-line bg-surface p-4 transition-colors hover:border-border"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-sm font-bold text-title">
                {review.author}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-title">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
                <span>{review.rating.toFixed(1)}</span>
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-copy">{review.body}</p>
            {review.reply ? (
              <div className="mt-3 rounded-[10px] bg-white p-3 text-sm text-copy border border-line/60">
                <p className="flex items-center gap-1.5 font-semibold text-title text-xs uppercase tracking-wider text-primary">
                  <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
                  Response from {proName}
                </p>
                <p className="mt-1 text-sm text-copy">{review.reply}</p>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </article>
  );
}
