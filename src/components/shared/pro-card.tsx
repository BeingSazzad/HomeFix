"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, MapPin, ShieldCheck, Star } from "lucide-react";
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
        "group flex h-full min-w-0 w-full flex-col overflow-hidden rounded-[14px] border border-line bg-white",
        className,
      )}
    >
      <div className="relative h-44 overflow-hidden bg-smoke">
        <span
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
        <span
          title="Verified"
          aria-label="Verified"
          className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-primary"
        >
          <ShieldCheck className="h-4 w-4" />
        </span>
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
            "absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white",
            saved && access.canSavePro ? "text-error" : "text-muted",
            access.audience === "pro" && "opacity-50",
          )}
          onClick={onSave}
        >
          <Heart className={cn("h-3.5 w-3.5", saved && access.canSavePro && "fill-current")} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[18px] leading-snug text-title group-hover:text-primary">{pro.businessName}</h3>
        <p className="mt-1 text-sm font-semibold text-primary">{pro.trade}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-copy">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted" />
          {pro.city}, {pro.state}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-copy">
          <Star className="h-3.5 w-3.5 shrink-0 text-accent" />
          {pro.rating.toFixed(1)}
          <span className="text-muted">· {pro.reviewCount} reviews</span>
        </p>
        <p className="mt-auto pt-3 text-sm font-semibold text-title">
          From ${pro.startingPrice}
          <span className="ml-1.5 font-normal text-muted">
            {pro.availableThisWeek ? "· open this week" : "· book ahead"}
          </span>
        </p>
      </div>
    </Link>
  );
}
