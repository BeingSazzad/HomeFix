import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { plans } from "@/lib/site-content";

export function PricingPlans({
  eyebrow = "Pricing",
  title = "Who pays, and for what",
  description = "LocalHomeFix sells marketplace access. It does not sell repair packages or take the project payment.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-white py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <SectionHeading align="center" eyebrow={eyebrow} title={title} description={description} />
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "rounded-[20px] p-8 md:p-10",
                plan.featured ? "bg-primary text-white" : "bg-white soft-shadow",
              )}
            >
              <p
                className={cn(
                  "font-display text-sm font-bold uppercase tracking-[0.14em]",
                  plan.featured ? "text-white/80" : "text-primary",
                )}
              >
                {plan.name}
              </p>
              <p
                className={cn(
                  "mt-4 font-display text-[48px] font-bold leading-none",
                  plan.featured ? "text-white" : "text-title",
                )}
              >
                {plan.price}
                {plan.period ? (
                  <span
                    className={cn(
                      "text-lg font-medium",
                      plan.featured ? "text-white/75" : "text-copy",
                    )}
                  >
                    {plan.period}
                  </span>
                ) : null}
              </p>
              <p className={cn("mt-3 text-[15px] leading-7", plan.featured ? "text-white/80" : "text-copy")}>
                {plan.tagline}
              </p>
              <ul className={cn("mt-8 space-y-3 text-[15px]", plan.featured ? "text-white/90" : "text-copy")}>
                {plan.features.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className={cn("mt-0.5 h-5 w-5 shrink-0", plan.featured ? "text-white" : "text-primary")} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href={plan.href} variant={plan.featured ? "white" : "primary"} className="w-full">
                  {plan.cta}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
