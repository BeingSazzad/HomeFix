"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, MapPin, ShieldCheck } from "lucide-react";
import { ProRatingBlock } from "@/components/shared/pro-rating-block";
import { photos } from "@/lib/media";
import { signupHref } from "@/lib/role-access";
import { toggleFavorite } from "@/redux/slices/featuresSlice";
import { useRoleAccess } from "@/hooks/use-role-access";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Professional } from "@/types";
import { cn } from "@/lib/cn";

export function ProCard({
  pro,
  className,
}: {
  pro: Professional;
  className?: string;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { access } = useRoleAccess();
  const saved = useAppSelector((state) => state.features.favorites.includes(pro.id));
  const image = photos.services[pro.categorySlug];
  const href = `/browse-pros/${pro.id}`;

  function onSave(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (access.audience === "guest") {
      router.push(signupHref(pathname || href));
      return;
    }
    if (!access.canSavePro) return;
    dispatch(toggleFavorite(pro.id));
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full min-w-0 w-full flex-col overflow-hidden rounded-[22px] border border-line/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      <div className="relative h-44 overflow-hidden bg-smoke">
        <span
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save professional"}
          title={
            access.audience === "guest"
              ? "Create an account to save"
              : access.audience === "pro"
                ? "Homeowner-only action"
                : undefined
          }
          disabled={access.audience === "pro"}
          className={cn(
            "absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white shadow-xs",
            saved && access.canSavePro ? "text-error" : "text-muted",
            access.audience === "pro" && "opacity-50",
          )}
          onClick={onSave}
        >
          <Heart className={cn("h-3.5 w-3.5", saved && access.canSavePro && "fill-current")} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[18px] sm:text-[19px] font-medium tracking-tight leading-snug text-title transition-colors group-hover:text-primary min-h-[46px] line-clamp-2">
          <span>{pro.businessName}</span>
          <span title="Screened & Verified Professional" className="inline-block ml-1.5 -mt-0.5 align-middle">
            <ShieldCheck
              className="h-4 w-4 text-primary fill-primary/15"
              aria-label="Verified Pro"
            />
          </span>
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-smoke px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-primary">
            {pro.trade}
          </span>
          <span className="flex items-center gap-1 font-sans text-xs text-[#757575]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#757575]" />
            {pro.city}, {pro.state}
          </span>
        </div>

        {/* DEMO DATA: Swappable rating block. Hidden when reviewCount === 0 */}
        <div className="mt-3">
          <ProRatingBlock
            rating={pro.rating}
            reviewCount={pro.reviewCount}
            size="sm"
          />
        </div>

        <div className="mt-5 border-t border-line/60 pt-3.5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[15px] font-semibold text-title">
              From ${pro.startingPrice}
            </span>
            <span className="font-sans text-xs font-medium text-primary group-hover:underline">
              View profile →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
