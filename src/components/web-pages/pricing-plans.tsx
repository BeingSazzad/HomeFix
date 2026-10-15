"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { plans } from "@/lib/site-content";
import { useRoleAccess } from "@/hooks/use-role-access";

export function PricingPlans({
  eyebrow = "Pricing",
  title = "Who pays, and for what",
  description = "Marketplace access only — not repair packages.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const { access, membershipActive } = useRoleAccess();

  return (
    <section className="bg-white py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <SectionHeading align="center" eyebrow={eyebrow} title={title} description={description} />
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const isHome = plan.id === "homeowner";
            const isPro = plan.id === "pro";
            const yours =
              (isHome && access.audience === "homeowner") ||
              (isPro && access.audience === "pro" && membershipActive);

            let href = plan.href;
            let cta = plan.cta;
            if (isHome) {
              if (access.audience === "homeowner") {
                href = "/account/post-job";
                cta = "Post a request";
              } else if (access.audience === "pro") {
                href = "/pro/jobs";
                cta = "Stay on pro jobs";
              }
            }
            if (isPro) {
              if (access.audience === "pro") {
                href = "/pro/pricing";
                cta = membershipActive ? "Manage membership" : "Start free trial";
              } else if (access.audience === "homeowner") {
                href = "/pro-register";
                cta = "Apply with a pro account";
              }
            }

            return (
              <article
                key={plan.name}
                className={cn(
                  "rounded-[20px] p-8 md:p-10",
                  plan.featured ? "bg-primary text-white" : "border border-line bg-white",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      "font-display text-sm font-bold uppercase tracking-[0.14em]",
                      plan.featured ? "text-white/80" : "text-primary",
                    )}
                  >
                    {plan.name}
                  </p>
                  {yours ? (
                    <span
                      className={cn(
                        "rounded-[10px] px-2.5 py-1 font-display text-[12px] font-bold",
                        plan.featured ? "bg-white text-primary" : "bg-smoke text-primary",
                      )}
                    >
                      Your plan
                    </span>
                  ) : null}
                </div>
                <p
                  className={cn(
                    "mt-4 font-display text-[48px] font-bold leading-none",
                    plan.featured ? "text-white" : "text-title",
                  )}
                >
                  {plan.price}
                  {plan.period ? (
                    <span className={cn("text-lg font-medium", plan.featured ? "text-white/75" : "text-copy")}>
                      {plan.period}
                    </span>
                  ) : null}
                </p>
                <p className={cn("mt-3 text-[16px] leading-7", plan.featured ? "text-white/80" : "text-copy")}>
                  {plan.tagline}
                </p>
                <ul className={cn("mt-8 space-y-3 text-[16px]", plan.featured ? "text-white/90" : "text-copy")}>
                  {plan.features.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className={cn("mt-0.5 h-5 w-5 shrink-0", plan.featured ? "text-white" : "text-primary")} />
                      {item}
                    </li>
                  ))}
                  {plan.limits.slice(0, 1).map((item) => (
                    <li key={item} className="flex gap-3 opacity-80">
                      <X className={cn("mt-0.5 h-5 w-5 shrink-0", plan.featured ? "text-white/70" : "text-muted")} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button href={href} variant={plan.featured ? "white" : "primary"} className="w-full">
                    {cta}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
