"use client";

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
import { PageBanner } from "@/components/layout/page-banner";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { portfolios } from "@/lib/pro-extras";
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
  const badges = [
    pro.licensed ? "License on file" : null,
    pro.insured ? "Insured" : null,
    pro.emergency ? "Accepts urgent jobs" : null,
  ].filter(Boolean);
  const profilePath = `/browse-pros/${pro.id}`;
  const primaryCta =
    access.audience === "pro"
      ? { href: "/pro/jobs", label: "Go to job board" }
      : access.audience === "homeowner"
        ? { href: "/account/post-job", label: "Create a request" }
        : { href: signupHref(profilePath), label: "Sign up to request" };

  return (
    <>
      <PageBanner
        eyebrow={pro.trade}
        title={pro.businessName}
        description={`${pro.city}, ${pro.state} · Serves about ${pro.radiusMiles} miles`}
        image={image}
      />
      <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
        <div className="container-site grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            <article className="rounded-[20px] bg-white p-6 soft-shadow md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  title="Verified"
                  aria-label="Verified"
                  className="grid h-8 w-8 place-items-center rounded-full bg-smoke text-primary"
                >
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-copy">
                  <Star className="h-4 w-4 text-accent" />
                  {pro.rating.toFixed(1)} · {pro.reviewCount} reviews
                </span>
              </div>

              <div className="mt-6 flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[10px] bg-primary text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[24px]">About</h2>
                  <p className="mt-2 text-[16px] leading-7 text-copy">{pro.bio}</p>
                  {badges.length ? <p className="mt-3 text-sm text-muted">{badges.join(" · ")}</p> : null}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-5 text-sm text-copy">
                <p>
                  <span className="font-semibold text-title">{pro.jobsCompleted}</span> jobs done
                </p>
                <p>
                  <span className="font-semibold text-title">{pro.yearsInBusiness}</span> years in business
                </p>
                <p>
                  Typical reply: <span className="font-semibold text-title">{pro.responseTime}</span>
                </p>
              </div>
            </article>

            {gallery.length ? (
              <div>
                <h2 className="text-[24px]">Portfolio</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {gallery.map((item) => (
                    <div key={item.title} className="overflow-hidden rounded-[14px] bg-white">
                      <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                      <p className="px-3 py-2 text-sm font-semibold text-title">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <h2 className="text-[24px]">Reviews</h2>
              {reviews.length === 0 ? (
                <p className="mt-3 text-sm text-copy">No written reviews yet.</p>
              ) : (
                <div className="mt-5 space-y-5">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-t border-line pt-5 first:border-0 first:pt-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-display text-sm font-bold text-title">{review.author}</p>
                        <p className="text-sm font-semibold text-primary">{review.rating.toFixed(1)} / 5</p>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-copy">{review.body}</p>
                      {review.reply ? (
                        <p className="mt-2 text-sm text-copy">
                          <span className="font-semibold text-title">Pro reply: </span>
                          {review.reply}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-[20px] bg-white p-6 soft-shadow md:p-8">
            <h2 className="text-[24px]">
              {access.audience === "pro" ? "You’re signed in as a pro" : "Request a quote"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-copy">
              {access.audience === "pro"
                ? "Use the job board for leads. Homeowner request and save stay on a homeowner account."
                : "Post a job for this trade. You pay the pro directly — not LocalHomeFix."}
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-copy">
              <MapPin className="h-4 w-4 text-muted" />
              {pro.city}, {pro.state} {pro.zip}
            </p>
            <div className="mt-6 space-y-3">
              <Button href={primaryCta.href} className="w-full">
                {primaryCta.label}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={access.audience === "pro"}
                onClick={() => {
                  if (access.audience === "guest") {
                    router.push(loginHref({ role: "homeowner", next: pathname || profilePath }));
                    return;
                  }
                  if (!access.canSavePro) return;
                  dispatch(toggleFavorite(pro.id));
                }}
              >
                <Heart className={cn("h-4 w-4", saved && access.canSavePro && "fill-current text-error")} />
                {access.audience === "pro" ? "Save (homeowner only)" : saved ? "Saved" : "Save pro"}
              </Button>
              <Button href="/browse-pros" variant="ghost" className="w-full">
                Back to listings
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
