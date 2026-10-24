"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  HelpCircle,
  PhoneCall,
  Shield,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export interface GuaranteeCardProps {
  className?: string;
  variant?: "compact" | "detailed" | "banner";
  showPrice?: boolean;
  onLearnMore?: () => void;
}

/**
 * Interactive Guarantee Trust Badge / Card
 * Displayed during pro viewing, quoting, and schedule booking
 */
export function GuaranteeCard({
  className,
  variant = "compact",
  showPrice = false,
  onLearnMore,
}: GuaranteeCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  function handleOpen(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onLearnMore) {
      onLearnMore();
    } else {
      setModalOpen(true);
    }
  }

  if (variant === "banner") {
    return (
      <>
        <div
          className={cn(
            "rounded-2xl border border-primary/25 bg-gradient-to-r from-smoke via-white to-primary/[0.03] p-4 sm:p-5 shadow-xs transition-all hover:border-primary/40",
            className,
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-sm font-bold text-title">
                    LocalHomeFix Peace of Mind Guarantee
                  </h4>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Up to $2,500
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Every booking is protected. If the work isn&apos;t done right or unexpected damage occurs, we help make it right.
                </p>
              </div>
            </div>

            {onLearnMore ? (
              <button
                type="button"
                onClick={handleOpen}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-white border border-line px-3.5 py-1.5 font-display text-xs font-semibold text-primary hover:border-primary/50 hover:bg-smoke/60 shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                <span>Learn how you&apos;re covered</span>
                <span aria-hidden="true">→</span>
              </button>
            ) : (
              <Link
                href="/guarantee"
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-white border border-line px-3.5 py-1.5 font-display text-xs font-semibold text-primary hover:border-primary/50 hover:bg-smoke/60 shadow-2xs transition-colors shrink-0"
              >
                <span>Learn how you&apos;re covered</span>
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>

        {modalOpen && <GuaranteeModal onClose={() => setModalOpen(false)} />}
      </>
    );
  }

  if (variant === "detailed") {
    return (
      <>
        <div
          className={cn(
            "rounded-2xl border border-line bg-white p-4.5 sm:p-5 shadow-xs space-y-3",
            className,
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="font-display text-sm font-bold text-title">
                LocalHomeFix Guarantee
              </span>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
              $2,500 Protected
            </span>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Hire with total confidence. If this contractor&apos;s finished work falls short of trade standards or causes accidental damage, our program covers repairs up to $2,500.
          </p>

          <div className="flex items-center justify-between border-t border-line/60 pt-2.5 text-[11px]">
            <span className="text-muted">Zero upfront risk · Pay pro on satisfaction</span>
            {onLearnMore ? (
              <button
                type="button"
                onClick={handleOpen}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                Learn more →
              </button>
            ) : (
              <Link
                href="/guarantee"
                className="font-semibold text-primary hover:underline"
              >
                Learn more →
              </Link>
            )}
          </div>
        </div>

        {modalOpen && <GuaranteeModal onClose={() => setModalOpen(false)} />}
      </>
    );
  }

  // Default: Compact card matching the reference screenshot in Thumbtack style, refined for LocalHomeFix
  return (
    <>
      <div
        className={cn(
          "rounded-2xl border border-line/70 bg-white p-4 transition-all hover:border-primary/40 shadow-xs",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-blue-50 text-primary border border-blue-100 shadow-2xs">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h5 className="font-display text-sm font-bold text-title">
                LocalHomeFix Guarantee
              </h5>
              {showPrice && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-md">
                  $2,500
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              If you hire this pro, you&apos;re covered by our workmanship &amp; property protection guarantee.{" "}
              {onLearnMore ? (
                <button
                  type="button"
                  onClick={handleOpen}
                  className="font-semibold text-primary hover:underline inline-block cursor-pointer"
                >
                  Learn more
                </button>
              ) : (
                <Link
                  href="/guarantee"
                  className="font-semibold text-primary hover:underline inline-block"
                >
                  Learn more
                </Link>
              )}
            </p>
          </div>
        </div>
      </div>

      {modalOpen && <GuaranteeModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

/**
 * High-Converting, Empathetic Guarantee Explainer Modal
 * Modeled after Thumbtack & Airbnb AirCover with high-end LocalHomeFix typography
 */
export function GuaranteeModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guarantee-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[24px] border border-line bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* 1. Header Hero Banner */}
        <div className="relative bg-gradient-to-br from-[#01133C] via-[#0D56D6] to-[#00A1DE] px-6 py-7 text-white rounded-t-[23px] overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Guarantee details"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white/90 hover:bg-white/25 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Shield Badge & Title */}
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-primary shadow-md">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white/90 backdrop-blur-xs">
                <Sparkles className="h-3 w-3 text-amber-300" />
                Homeowner Protection Plan
              </div>
              <h2
                id="guarantee-modal-title"
                className="mt-1 font-display text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight"
              >
                LocalHomeFix Guarantee
              </h2>
            </div>
          </div>
        </div>

        {/* 2. Empathetic Lead Copy (Inspired by Thumbtack, polished by Product Designer) */}
        <div className="p-6 sm:p-7 space-y-6">
          <div className="space-y-2">
            <h3 className="font-display text-lg sm:text-xl font-bold text-title tracking-tight">
              When things go wrong, we&apos;re here to make it right.
            </h3>
            <p className="font-sans text-xs sm:text-sm text-copy leading-relaxed">
              We want you to feel thrilled with every pro you hire on LocalHomeFix. But home repairs can be unpredictable, contractors are human, and sometimes issues occur. If anything happens on a booked project, we step in to ensure you&apos;re protected.
            </p>
          </div>

          {/* 3. The 4 Core Protection Pillars */}
          <div className="grid gap-3.5 sm:grid-cols-2">
            {/* Pillar 1: Up to $2,500 Coverage */}
            <div className="rounded-2xl border border-line/80 bg-surface/50 p-4 space-y-1.5 transition-colors hover:border-primary/30">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Shield className="h-4 w-4" />
                </div>
                <h4 className="font-display text-sm font-bold text-title">
                  Up to $2,500 Coverage
                </h4>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                If completed work fails professional standards or causes property damage, we cover corrective repairs up to $2,500.
              </p>
            </div>

            {/* Pillar 2: 100% Screened Pros */}
            <div className="rounded-2xl border border-line/80 bg-surface/50 p-4 space-y-1.5 transition-colors hover:border-primary/30">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <h4 className="font-display text-sm font-bold text-title">
                  Screened &amp; Verified
                </h4>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Every pro undergoes Texas trade license verification, ID validation, and criminal history screening before quoting.
              </p>
            </div>

            {/* Pillar 3: Direct Pay on Satisfaction */}
            <div className="rounded-2xl border border-line/80 bg-surface/50 p-4 space-y-1.5 transition-colors hover:border-primary/30">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-100 text-amber-700">
                  <Wrench className="h-4 w-4" />
                </div>
                <h4 className="font-display text-sm font-bold text-title">
                  Inspect Before Settling
                </h4>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                $0 platform middleman fee. You never pay for labor upfront — inspect the completed work and test fixtures first.
              </p>
            </div>

            {/* Pillar 4: 24h Resolution Support */}
            <div className="rounded-2xl border border-line/80 bg-surface/50 p-4 space-y-1.5 transition-colors hover:border-primary/30">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-100 text-purple-700">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <h4 className="font-display text-sm font-bold text-title">
                  24-Hour Mediation
                </h4>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                If you and the contractor disagree on scope or quality, our local Texas resolution team mediates within 24 hours.
              </p>
            </div>
          </div>

          {/* 4. Simple Checklist for Homeowner Eligibility */}
          <div className="rounded-2xl border border-line/70 bg-smoke/60 p-4 sm:p-4.5 space-y-2.5">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-title flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5 text-primary" />
              How to be covered:
            </h4>
            <ul className="space-y-1.5 text-xs text-copy">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>
                  <strong>Book through LocalHomeFix:</strong> Ensure the job quote and schedule are confirmed within our system.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>
                  <strong>Communicate in writing:</strong> Keep initial scope and price change approvals logged in the job thread.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>
                  <strong>File within 14 days:</strong> If an unresolved issue arises, open a claim via your dashboard within 14 days of completion.
                </span>
              </li>
            </ul>
          </div>

          {/* 5. Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-line/60">
            <p className="text-[11px] text-muted text-center sm:text-left">
              Covered across all 9 catalog trades in Texas.
            </p>
            <Button
              type="button"
              onClick={onClose}
              size="sm"
              className="w-full sm:w-auto font-display font-semibold rounded-xl px-6"
            >
              I Understand, Continue Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
