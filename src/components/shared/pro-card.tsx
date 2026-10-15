"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bug,
  Droplets,
  Hammer,
  Heart,
  Home,
  MapPin,
  Paintbrush,
  ShieldCheck,
  Star,
  Trees,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { loginHref, signupHref } from "@/lib/role-access";
import { toggleFavorite } from "@/redux/slices/featuresSlice";
import { useRoleAccess } from "@/hooks/use-role-access";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Professional } from "@/types";
import { cn } from "@/lib/cn";

const icons: Record<string, typeof Wrench> = {
  "appliance-repair": Wrench,
  electrical: Zap,
  hvac: Wind,
  handyman: Hammer,
  landscaping: Trees,
  painting: Paintbrush,
  "pest-control": Bug,
  plumbing: Droplets,
  roofing: Home,
};

export function ProCard({ pro }: { pro: Professional }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { access } = useRoleAccess();
  const saved = useAppSelector((state) => state.features.favorites.includes(pro.id));
  const image = photos.services[pro.categorySlug];
  const Icon = icons[pro.categorySlug] ?? Wrench;
  const facts = [
    pro.licensed ? "License on file" : null,
    pro.insured ? "Insured" : null,
    pro.emergency ? "Urgent jobs" : null,
  ].filter(Boolean);
  const href = `/browse-pros/${pro.id}`;

  const primaryCta =
    access.audience === "pro"
      ? { href: "/pro/jobs", label: "Browse jobs" }
      : access.audience === "homeowner"
        ? { href: "/account/post-job", label: "Request a quote" }
        : { href: signupHref("/account/post-job"), label: "Create account to request" };

  function onSave() {
    if (access.audience === "guest") {
      router.push(loginHref({ role: "homeowner", next: pathname || href }));
      return;
    }
    if (!access.canSavePro) return;
    dispatch(toggleFavorite(pro.id));
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white">
      <div className="relative h-56 overflow-hidden bg-smoke">
        <Link href={href} className="absolute inset-0 block">
          <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
        </Link>
        <span
          title="Verified"
          aria-label="Verified"
          className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white text-primary"
        >
          <ShieldCheck className="h-4 w-4" />
        </span>
        <button
          type="button"
          aria-label={
            access.audience === "pro"
              ? "Saving pros is for homeowners"
              : saved
                ? "Remove from saved"
                : "Save professional"
          }
          title={
            access.audience === "guest"
              ? "Sign in as homeowner to save"
              : access.audience === "pro"
                ? "Homeowner-only action"
                : undefined
          }
          className={cn(
            "absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white",
            saved && access.canSavePro ? "text-error" : "text-muted",
            access.audience === "pro" && "opacity-50",
          )}
          onClick={onSave}
        >
          <Heart className={cn("h-4 w-4", saved && access.canSavePro && "fill-current")} />
        </button>
        <span className="absolute bottom-4 left-4 grid h-14 w-14 place-items-center rounded-[10px] bg-primary text-white">
          <Icon className="h-6 w-6" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Link href={href}>
          <h3 className="text-[24px] text-title hover:text-primary">{pro.businessName}</h3>
        </Link>
        <p className="mt-1 text-sm font-semibold text-primary">{pro.trade}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-copy">
          <MapPin className="h-4 w-4 shrink-0 text-muted" />
          {pro.city}, {pro.state}
        </p>
        <p className="mt-4 flex items-center gap-1.5 text-sm text-copy">
          <Star className="h-4 w-4 shrink-0 text-accent" />
          {pro.rating.toFixed(1)}
          <span className="text-muted">
            · {pro.reviewCount} reviews · {pro.jobsCompleted} jobs
          </span>
        </p>
        {facts.length ? <p className="mt-3 text-[12px] text-muted">{facts.join(" · ")}</p> : null}
        <div className="mt-auto flex flex-col gap-2 pt-5">
          <Button href={href} variant="ghost" className="w-full">
            View profile
          </Button>
          <Button href={primaryCta.href} className="w-full">
            {primaryCta.label}
          </Button>
        </div>
      </div>
    </article>
  );
}
