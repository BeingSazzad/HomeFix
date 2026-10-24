import type { Metadata } from "next";
import {
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Check,
  Wrench,
  Sparkles,
} from "lucide-react";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "LocalHomeFix Guarantee — Peace of Mind Protection Up to $2,500",
  description:
    "When things go wrong, we're here to help. Discover how the LocalHomeFix Guarantee protects your home repairs and installations up to $2,500.",
};

export default function GuaranteePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. PAGE BANNER */}
      <PageBanner
        eyebrow="Protection & Peace of Mind"
        title="LocalHomeFix Guarantee"
        description="When things go wrong, we're here to help. Up to $2,500 in property and workmanship protection on every job booked through LocalHomeFix."
        image={photos.banners.legal}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Guarantee" },
        ]}
      />

      {/* 2. HERO STATEMENT (Matching Thumbtack Guarantee Reference) */}
      <section className="border-b border-line/60 bg-gradient-to-b from-surface/50 to-white py-12 sm:py-16">
        <div className="container-site max-w-3xl text-center space-y-5">
          <div className="inline-grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5 shadow-2xs">
            <ShieldCheck className="h-9 w-9 text-primary" />
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-title tracking-tight leading-tight">
            When things go wrong,
            <br />
            we&apos;re here to help.
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-copy leading-relaxed font-sans">
            <p>
              We want you to be thrilled with every pro you find and everything you get done on{" "}
              <strong className="font-semibold text-title">LocalHomeFix</strong>. But life is
              unpredictable. Pros are human. And sometimes things go wrong. So if anything happens,
              we&apos;ll work to make it right.
            </p>
            <p className="text-xs sm:text-sm text-muted">
              Please read this page and our program terms closely so you understand what has to happen
              for you to be eligible for us to help.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button href="/browse-pros" size="md">
              Find Reviewed Pros ↗
            </Button>
            <Button href="/contact?topic=guarantee" variant="ghost" size="md">
              Submit a Guarantee Claim →
            </Button>
          </div>
        </div>
      </section>

      {/* 3. THREE CORE PILLARS OF COVERAGE */}
      <section className="py-12 sm:py-16 border-b border-line/60 bg-white">
        <div className="container-site">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
              Coverage Highlights
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-title">
              How You Are Protected
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Every qualified project booked on LocalHomeFix automatically includes our guarantee at no extra charge.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-line/80 bg-surface/30 p-6 sm:p-7 space-y-4 shadow-2xs hover:shadow-xs transition">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-primary border border-blue-100 shadow-2xs">
                <Wrench className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-title">Workmanship</h3>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    Up to $2,500
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  If the completed work does not meet standard trade craftsmanship or violates local building codes, we cover corrective repairs with an independent specialist.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-line/80 bg-surface/30 p-6 sm:p-7 space-y-4 shadow-2xs hover:shadow-xs transition">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-2xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-title">Property Protection</h3>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    Up to $2,500
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  In the rare event of accidental physical damage to your home or property caused directly by a contractor during the job, we step in to make financial restitution.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-line/80 bg-surface/30 p-6 sm:p-7 space-y-4 shadow-2xs hover:shadow-xs transition">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-50 text-purple-700 border border-purple-100 shadow-2xs">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-title">Dispute Mediation</h3>
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                    Included Free
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Our dedicated trust team reviews contract agreements, itemized quotes, and communication records to reach a fair, prompt resolution between both parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STEP-BY-STEP ELIGIBILITY & CLAIM FLOW */}
      <section className="py-12 sm:py-16 border-b border-line/60 bg-surface/40">
        <div className="container-site max-w-4xl">
          <div className="text-center space-y-2 mb-10">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
              Step-by-Step Procedure
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-title">
              How the Guarantee Works
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Follow these simple steps before, during, and after hiring to ensure your project qualifies.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Book via Platform",
                desc: "Initiate contact, request bids, and confirm your booking through LocalHomeFix to record the job history.",
              },
              {
                step: "02",
                title: "Retain Invoices",
                desc: "Pay the pro directly and always save written estimates, change orders, and proof of payment.",
              },
              {
                step: "03",
                title: "Contact the Pro",
                desc: "If any defect appears, notify the professional within 14 days and allow reasonable time to inspect.",
              },
              {
                step: "04",
                title: "File Within 30 Days",
                desc: "If unresolved, submit project photos and receipts to our Guarantee Team. We review and resolve promptly.",
              },
            ].map((card) => (
              <div
                key={card.step}
                className="rounded-2xl border border-line/70 bg-white p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-display text-2xl font-black text-primary/30">
                    {card.step}
                  </span>
                  <h4 className="mt-2 font-display text-sm font-bold text-title">
                    {card.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COVERED VS. NOT COVERED TABLE */}
      <section className="py-12 sm:py-16 border-b border-line/60 bg-white">
        <div className="container-site max-w-4xl">
          <div className="text-center space-y-2 mb-10">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
              Clear Boundaries
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-title">
              What Is Covered vs. Not Covered
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* What is covered */}
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-display text-sm font-bold">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>What is Covered</span>
              </div>
              <ul className="space-y-3 text-xs text-copy">
                {[
                  "Defective workmanship that deviates from trade standards or building codes.",
                  "Direct physical damage to your real property caused during service.",
                  "Incomplete projects where full payment was made and the contractor stopped responding.",
                  "Improper installation of parts or equipment supplied by the pro.",
                  "Work performed by independent pros contacted and booked through LocalHomeFix.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What is not covered */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 space-y-4">
              <div className="flex items-center gap-2 text-zinc-800 font-display text-sm font-bold">
                <AlertCircle className="h-5 w-5 text-zinc-500" />
                <span>What is Not Covered</span>
              </div>
              <ul className="space-y-3 text-xs text-copy">
                {[
                  "Normal wear and tear, pre-existing structural issues, or moisture rot.",
                  "Work performed outside the agreed written estimate without documentation.",
                  "Indirect or consequential damages (such as hotel lodging or lost income).",
                  "Materials or fixtures supplied directly by the homeowner.",
                  "Services arranged or negotiated off-platform prior to finding the pro on LocalHomeFix.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="h-4 w-4 grid place-items-center rounded-full bg-zinc-200 text-zinc-600 text-[10px] font-bold shrink-0 mt-0.5">
                      ✕
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GUARANTEE FAQS */}
      <section className="py-12 sm:py-16 border-b border-line/60 bg-surface/30">
        <div className="container-site max-w-3xl">
          <div className="text-center space-y-2 mb-10">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
              Common Questions
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-title">
              Guarantee FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Do I have to pay extra for the Guarantee?",
                a: "No. The LocalHomeFix Guarantee is automatically included on all projects booked with verified professionals on the platform. There are zero enrollment costs or hidden fees.",
              },
              {
                q: "How long do I have to file a guarantee claim?",
                a: "You must notify the contractor within 14 days of work completion, and file a formal claim with LocalHomeFix within 30 days of the scheduled completion date.",
              },
              {
                q: "How does LocalHomeFix issue payment or repairs?",
                a: "Depending on the case, we will either reimburse approved repair costs directly or dispatch a secondary top-rated local contractor to fix and complete the work to code.",
              },
              {
                q: "Can I pay the contractor directly?",
                a: "Yes! Homeowners pay contractors directly with zero platform markup. All we require is that you retain a written receipt, invoice, or electronic proof of payment.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-line/70 bg-white p-5 sm:p-6 shadow-2xs space-y-2"
              >
                <h4 className="font-display text-sm sm:text-base font-bold text-title flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container-site max-w-3xl text-center space-y-5">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-title">
            Ready to hire with complete confidence?
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
            Explore hundreds of verified, background-checked plumbers, electricians, and home specialists in your area.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/browse-pros" size="md">
              Browse Verified Pros ↗
            </Button>
            <Button href="/contact?topic=guarantee" variant="ghost" size="md">
              Contact Guarantee Support →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
