"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

interface ProRatingBlockProps {
  rating?: number;
  reviewCount?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * DEMO DATA COMPONENT:
 * Swappable rating block. When a pro has 0 reviews (or undefined),
 * this component renders null so the whole rating row disappears
 * without breaking the container layout.
 */
export function ProRatingBlock({
  rating,
  reviewCount,
  className,
  size = "md",
}: ProRatingBlockProps) {
  // HIDDEN STATE: If 0 reviews or no reviews recorded, hide entirely
  if (!reviewCount || reviewCount <= 0) {
    return null;
  }

  const starSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const formattedRating = (rating ?? 5.0).toFixed(1);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold text-title",
        textSizes[size],
        className,
      )}
      aria-label={`${formattedRating} out of 5 stars from ${reviewCount} reviews`}
    >
      <Star
        className={cn(
          starSizes[size],
          "shrink-0 fill-accent text-accent",
        )}
        aria-hidden="true"
      />
      <span>{formattedRating}</span>
      <span className="font-normal text-muted">- {reviewCount} reviews</span>
    </span>
  );
}