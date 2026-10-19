"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bug,
  CheckCircle2,
  Clock,
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
import { ProRatingBlock } from "@/components/shared/pro-rating-block";
import { SwappableReviewsSection } from "@/components/shared/swappable-reviews-section";
import { photos } from "@/lib/media";
import { portfolios, serviceLines } from "@/lib/pro-extras";
import { signupHref } from "@/lib/role-access";
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

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProProfileContent({ pro }: { pro: Professional }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { access } = useRoleAccess();
  const saved = useAppSelector((state) => state.features.favorites.includes(pro.id));
  const reviews = useAppSelector((state) => state.features.reviews.filter((item) => item.proId === pro.id));
  const cover = photos.services[pro.categorySlug] ?? photos.banner;
  const Icon = icons[pro.categorySlug] ?? Wrench;
  const gallery = portfolios[pro.id] ?? [];
  const specialties = serviceLines[pro.categorySlug] ?? [pro.trade];
  const profilePath = `/browse-pros/${pro.id}`;

  const credentials = [
    pro.clearance === "cleared" ? "Verified" : null,
    pro.licensed ? "License on file" : null,
    pro.insured ? "Insured" : null,
    pro.emergency ? "Urgent jobs" : null,
  ].filter(Boolean) as string[];

  const quoteHref =
    access.audience === "homeowner" ? `/account/post-job?invite=${pro.id}` : null;

  const messageHref =
    access.audience === "homeowner"
      ? `/account/messages?dm=${pro.id}`
      : access.audience === "guest"
        ? signupHref(`/account/messages?dm=${pro.id}`)
        : null;

  function onSave() {
    if (access.audience === "guest") {
      router.push(signupHref(pathname || profilePath));
      return;
    }
    if (!access.canSavePro) return;
    dispatch(toggleFavorite(pro.id));
  }

  return (
    <>
      {/* Trade-correct full-bleed work photo — marketplace trust hero */}
      <section className="relative isolate min-h-[280px] overflow-hidden md:min-h-[340px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={`${pro.trade} work by ${pro.businessName}`}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-title via-title/55 to-title/25" />
        <div className="container-site relative flex min-h-[280px] flex-col justify-end pb-8 pt-10 md:min-h-[340px] md:pb-10">
          <p className="text-[12px] text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-white/35">/</span>
            <Link href="/browse-pros" className="hover:text-white">
              Find a Pro
            </Link>
            <span className="mx-2 text-white/35">/</span>
            <span>{pro.trade}</span>
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[16px] border-2 border-white/40 bg-primary font-display text-xl font-bold text-white shadow-lg md:h-[72px] md:w-[72px] md:text-2xl">
              {initials(pro.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/75">{pro.trade}</p>
              <h1 className="mt-1 font-display text-[32px] font-bold leading-[1.1] text-white md:text-[44px]">
                {pro.businessName}
              </h1>
              <p className="mt-2 text-[15px] text-white/85">
                {pro.name} · {pro.city}, {pro.state} · ~{pro.radiusMiles} mi service area
              </p>
            </div>
            {access.audience !== "pro" ? (
              <button
                type="button"
                onClick={onSave}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-title shadow-sm backdrop-blur",
                  saved && access.canSavePro && "text-error",
                )}
              >
                <Heart className={cn("h-4 w-4", saved && access.canSavePro && "fill-current")} />
                {saved && access.canSavePro ? "Saved" : "Save"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-surface py-8 md:py-12">
        <div className="container-site grid items-start gap-6 lg:grid-cols-[1.45fr_0.75fr] lg:gap-8">
          <div className="space-y-5">
            {/* Proof strip — early, scannable */}
            <article className="rounded-[20px] bg-white p-5 soft-shadow md:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-smoke px-3 py-1.5 text-sm font-semibold text-title">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Verified pro
                </span>
                                {/* DEMO DATA: Swappable rating block */}
                <ProRatingBlock rating={pro.rating} reviewCount={pro.reviewCount} />
                <span className="inline-flex items-center gap-1.5 text-sm text-copy">
                  <MapPin className="h-4 w-4 text-muted" />
                  {pro.city}, {pro.state} {pro.zip}
                </span>
              </div>

              {credentials.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {credentials.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-copy"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
                {[
                  { label: "Jobs done", value: String(pro.jobsCompleted) },
                  { label: "In business", value: pro.yearsInBusiness },
                  { label: "Typical reply", value: pro.responseTime },
                ].map((item) => (
                  <div key={item.label} className="rounded-[14px] bg-surface px-4 py-3">
                    <p className="font-display text-lg font-bold text-title">{item.value}</p>
                    <p className="mt-0.5 text-xs text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </article>

            {/* Portfolio high — Houzz / HomeAdvisor pattern: proof before long bio */}
            {gallery.length ? (
              <article className="rounded-[20px] bg-white p-5 soft-shadow md:p-7">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-[20px] md:text-[22px]">Recent work</h2>
                    <p className="mt-1 text-sm text-muted">Real {pro.trade.toLowerCase()} jobs — not stock from another trade</p>
                  </div>
                  <p className="text-sm text-muted">{gallery.length} projects</p>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {gallery.map((item) => (
                    <figure key={item.title} className="overflow-hidden rounded-[14px] border border-line bg-smoke">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2.5 text-sm font-semibold text-title">{item.title}</figcaption>
                    </figure>
                  ))}
                </div>
              </article>
            ) : null}

            <article className="rounded-[20px] bg-white p-5 soft-shadow md:p-7">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-primary text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[20px] md:text-[22px]">About {pro.businessName}</h2>
                  <p className="mt-1 text-sm text-copy">
                    Run by <span className="font-semibold text-title">{pro.name}</span>
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-7 text-copy">{pro.bio}</p>
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Services</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {specialties.map((line) => (
                    <span
                      key={line}
                      className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-copy"
                    >
                      {line}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-copy">
                <Clock className="h-4 w-4 text-muted" />
                Typical reply: <span className="font-semibold text-title">{pro.responseTime}</span>
              </p>
            </article>

                        {/* DEMO DATA: Swappable customer reviews section � disappears cleanly if 0 reviews */}
            <SwappableReviewsSection
              proName={pro.businessName}
              rating={pro.rating}
              reviewCount={pro.reviewCount}
              reviews={reviews}
            />
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[20px] bg-white soft-shadow">
              <div className="relative h-28 bg-smoke">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-title/35" />
              </div>
              <div className="p-5 md:p-6">
                <h2 className="text-[20px]">{pro.businessName}</h2>
                <p className="mt-1 text-sm text-copy">
                  <span className="font-semibold text-title">{pro.name}</span> · {pro.trade}
                </p>
                <p className="mt-2 text-sm leading-6 text-copy">
                  {access.audience === "pro"
                    ? "Use the job board for leads. Request and save stay on a homeowner account."
                    : "You pay this pro directly — LocalHomeFix never takes the repair payment."}
                </p>

                <div className="mt-4 space-y-2.5 rounded-[14px] bg-surface p-3.5 text-sm text-copy">
                  <p className="flex items-center justify-between gap-2">
                    <span className="text-muted">Starting from</span>
                    <span className="font-display text-lg font-bold text-title">${pro.startingPrice}</span>
                  </p>
                  <p className="text-xs text-muted">Final price is set in the offer.</p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                    {pro.availabilityNote}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    {pro.city}, {pro.state} {pro.zip} · ~{pro.radiusMiles} mi
                  </p>
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                    Reviewed for public listing
                  </p>
                </div>

                <div className="mt-5 space-y-2.5">
                  {quoteHref ? (
                    <Button href={quoteHref} className="w-full">
                      Request a quote
                    </Button>
                  ) : null}
                  {messageHref ? (
                    <Button href={messageHref} variant={quoteHref ? "ghost" : undefined} className="w-full">
                      Message directly
                    </Button>
                  ) : null}
                  {access.audience === "pro" ? (
                    <Button href="/pro/jobs" className="w-full">
                      Go to job board
                    </Button>
                  ) : null}
                  {access.audience === "guest" ? (
                    <p className="text-center text-xs leading-5 text-muted">
                      <Link href="/login" className="font-semibold text-primary hover:underline">
                        Log in
                      </Link>{" "}
                      to request a quote from this pro.
                    </p>
                  ) : null}
                </div>

                <p className="mt-4 text-center text-xs leading-5 text-muted">
                  No repair payment on LocalHomeFix.{" "}
                  <Link href="/how-it-works" className="font-semibold text-primary hover:underline">
                    How it works
                  </Link>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
