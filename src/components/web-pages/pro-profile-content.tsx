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
import { PageBanner } from "@/components/layout/page-banner";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { portfolios } from "@/lib/pro-extras";
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

export function ProProfileContent({ pro }: { pro: Professional }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { access } = useRoleAccess();
  const saved = useAppSelector((state) => state.features.favorites.includes(pro.id));
  const reviews = useAppSelector((state) => state.features.reviews.filter((item) => item.proId === pro.id));
  const image = photos.services[pro.categorySlug];
  const Icon = icons[pro.categorySlug] ?? Wrench;
  const gallery = portfolios[pro.id] ?? [];
  const profilePath = `/browse-pros/${pro.id}`;

  const credentials = [
    pro.clearance === "cleared" ? "Verified" : null,
    pro.licensed ? "License on file" : null,
    pro.insured ? "Insured" : null,
    pro.emergency ? "Urgent jobs" : null,
  ].filter(Boolean) as string[];

  const stats = [
    { label: "Jobs done", value: String(pro.jobsCompleted) },
    { label: "In business", value: pro.yearsInBusiness },
    { label: "Typical reply", value: pro.responseTime },
  ];

  const primaryCta =
    access.audience === "pro"
      ? { href: "/pro/jobs", label: "Go to job board" }
      : access.audience === "homeowner"
        ? { href: "/account/post-job", label: "Request a quote" }
        : { href: signupHref("/account/post-job"), label: "Create account to request" };

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
      <PageBanner
        eyebrow={pro.trade}
        title={pro.businessName}
        description={`${pro.city}, ${pro.state} · Serves about ${pro.radiusMiles} miles`}
        image={image}
      />

      <section className="bg-surface py-8 md:py-12">
        <div className="container-site grid items-start gap-6 lg:grid-cols-[1.45fr_0.75fr] lg:gap-8">
          <div className="space-y-5">
            <article className="rounded-[20px] bg-white p-5 soft-shadow md:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-smoke px-3 py-1.5 text-sm font-semibold text-title">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Verified pro
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-title">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  {pro.rating.toFixed(1)}
                  <span className="font-normal text-muted">· {pro.reviewCount} reviews</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-copy">
                  <MapPin className="h-4 w-4 text-muted" />
                  {pro.city}, {pro.state}
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

              <div className="mt-6 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-[14px] bg-surface px-4 py-3">
                    <p className="font-display text-lg font-bold text-title">{item.value}</p>
                    <p className="mt-0.5 text-xs text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[20px] bg-white p-5 soft-shadow md:p-7">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-primary text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[20px] md:text-[22px]">About {pro.businessName}</h2>
                  <p className="mt-1 text-sm font-semibold text-primary">{pro.trade}</p>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-7 text-copy">{pro.bio}</p>
              <p className="mt-4 flex items-center gap-2 text-sm text-copy">
                <Clock className="h-4 w-4 text-muted" />
                Typical reply: <span className="font-semibold text-title">{pro.responseTime}</span>
              </p>
            </article>

            {gallery.length ? (
              <article className="rounded-[20px] bg-white p-5 soft-shadow md:p-7">
                <div className="flex items-end justify-between gap-3">
                  <h2 className="text-[20px] md:text-[22px]">Portfolio</h2>
                  <p className="text-sm text-muted">{gallery.length} projects</p>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {gallery.map((item) => (
                    <div key={item.title} className="overflow-hidden rounded-[14px] border border-line">
                      <div
                        className="aspect-[4/3] bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <p className="px-3 py-2.5 text-sm font-semibold text-title">{item.title}</p>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}

            <article className="rounded-[20px] bg-white p-5 soft-shadow md:p-7">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-[20px] md:text-[22px]">Customer reviews</h2>
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-title">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  {pro.rating.toFixed(1)} average
                </p>
              </div>

              {reviews.length === 0 ? (
                <p className="mt-4 text-sm text-copy">No written reviews yet.</p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {reviews.map((review) => (
                    <li key={review.id} className="rounded-[14px] border border-line bg-surface p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-display text-sm font-bold text-title">{review.author}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-title">
                          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-copy">{review.body}</p>
                      {review.reply ? (
                        <p className="mt-3 rounded-[10px] bg-white px-3 py-2 text-sm text-copy">
                          <span className="font-semibold text-title">Pro reply: </span>
                          {review.reply}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-[20px] bg-white p-5 soft-shadow md:p-6">
              <h2 className="text-[20px]">
                {access.audience === "pro" ? "Pro account" : "Request a quote"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-copy">
                {access.audience === "pro"
                  ? "Use the job board for leads. Request and save stay on a homeowner account."
                  : "Create a request for this trade. You pay the pro directly — not LocalHomeFix."}
              </p>

              <div className="mt-4 space-y-2.5 rounded-[14px] bg-surface p-3.5 text-sm text-copy">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  {pro.city}, {pro.state} {pro.zip}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-primary" />
                  Replies {pro.responseTime.toLowerCase()}
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                  Reviewed for public listing
                </p>
              </div>

              <div className="mt-5 space-y-2.5">
                <Button href={primaryCta.href} className="w-full">
                  {primaryCta.label}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  disabled={access.audience === "pro"}
                  onClick={onSave}
                >
                  <Heart className={cn("h-4 w-4", saved && access.canSavePro && "fill-current text-error")} />
                  {access.audience === "pro" ? "Save (homeowner only)" : saved ? "Saved" : "Save pro"}
                </Button>
                <Button href="/browse-pros" variant="ghost" className="w-full">
                  Back to listings
                </Button>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-muted">
                No repair payment on LocalHomeFix.{" "}
                <Link href="/how-it-works" className="font-semibold text-primary hover:underline">
                  How it works
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
