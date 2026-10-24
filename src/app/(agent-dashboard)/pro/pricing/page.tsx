"use client";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Pause,
  Percent,
  Play,
  Printer,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextField } from "@/components/ui/field";
import { startMembership } from "@/redux/slices/marketplaceSlice";
import {
  setMembershipCancelled,
  setMembershipPaused,
  setSubscriptionPlan,
  updatePaymentMethod,
  unlockContact,
  type InvoiceItem,
} from "@/redux/slices/featuresSlice";
import { useRoleAccess } from "@/hooks/use-role-access";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";

export default function PricingPage() {
  const dispatch = useAppDispatch();
  const { applicationStatus } = useRoleAccess();
  const active = useAppSelector((state) => state.marketplace.membershipActive);
  const paused = useAppSelector((state) => state.features.membershipPaused);
  const cancelled = useAppSelector((state) => state.features.membershipCancelled);
  const trialDaysLeft = useAppSelector((state) => state.features.trialDaysLeft ?? 67);
  const invoices = useAppSelector((state) => state.features.invoices);
  const currentPlan = useAppSelector(
    (state) => state.features.subscriptionPlan ?? "trial"
  );
  const currentRenewalDate = useAppSelector(
    (state) => state.features.renewalDate ?? "Jan 10, 2027"
  );
  const paymentMethod = useAppSelector(
    (state) =>
      state.features.paymentMethod ?? {
        brand: "Visa",
        last4: "4242",
        exp: "08/29",
      }
  );

  const [billingPreference, setBillingPreference] = useState<"annual" | "monthly">("annual");
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [cardForm, setCardForm] = useState({
    number: "•••• •••• •••• 4242",
    exp: paymentMethod?.exp ?? "08/29",
    cvc: "•••",
    name: "Luis Ortega",
    zip: "78704",
  });

  const isTrialActive = active && !cancelled && !paused && currentPlan === "trial";
  const isPaidActive = active && !cancelled && !paused && currentPlan !== "trial";
  const isPaused = paused;
  const isCancelled = cancelled;

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  function handleStartTrial() {
    dispatch(startMembership());
    dispatch(setMembershipPaused(false));
    dispatch(setMembershipCancelled(false));
    dispatch(
      setSubscriptionPlan({
        plan: "trial",
        billingCycle: billingPreference,
        renewalDate: "Jan 10, 2027",
      })
    );
    if (applicationStatus === "cleared") dispatch(unlockContact());
    showToast("3-Month Free Trial started successfully. Enjoy zero platform fees!");
  }

  function handleSelectPlan(plan: "monthly" | "annual", immediate = false) {
    dispatch(
      setSubscriptionPlan({
        plan,
        billingCycle: plan,
        renewalDate: immediate ? "Nov 20, 2026" : currentRenewalDate,
      })
    );
    if (immediate) {
      showToast(
        `Upgraded to Pro ${plan === "annual" ? "Annual" : "Monthly"}. Your subscription is active.`
      );
    } else {
      showToast(
        `Auto-renewal preference set to Pro ${
          plan === "annual" ? "Annual ($14.99/mo · Save 25%)" : "Monthly ($19.99/mo)"
        }. Your card will renew on ${currentRenewalDate}.`
      );
    }
  }

  function handleTogglePause() {
    if (paused) {
      dispatch(setMembershipPaused(false));
      if (applicationStatus === "cleared") dispatch(unlockContact());
      showToast("Subscription resumed. Your profile and quote privileges are active.");
    } else {
      dispatch(setMembershipPaused(true));
      showToast("Subscription paused. Auto-billing and quote notifications are on hold.");
    }
  }

  function handleCancelAutoRenew() {
    dispatch(setMembershipCancelled(true));
    showToast("Auto-renewal cancelled. You will not be charged when your trial expires.");
  }

  function handleUpdateCard(e: React.FormEvent) {
    e.preventDefault();
    const cleanNumber = cardForm.number.replace(/\D/g, "");
    const last4 = cleanNumber.length >= 4 ? cleanNumber.slice(-4) : "4242";
    dispatch(
      updatePaymentMethod({
        brand: cleanNumber.startsWith("3") ? "Amex" : cleanNumber.startsWith("5") ? "Mastercard" : "Visa",
        last4,
        exp: cardForm.exp || "08/29",
      })
    );
    setShowCardModal(false);
    showToast("Payment method updated successfully.");
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line/70 pb-4 pt-1">
        <div>
          <h1 className="font-display text-[22px] sm:text-[26px] font-semibold text-title tracking-tight">
            Pro Subscription &amp; Billing
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your subscription tier, billing cycles, payment cards, and invoices.
          </p>
        </div>

        {/* Global Action indicator */}
        <div className="flex items-center gap-2">
          {isTrialActive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Trial Active ({trialDaysLeft} days left)
            </span>
          ) : isPaidActive ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
              <Check className="h-3.5 w-3.5" />
              Pro {currentPlan === "annual" ? "Annual" : "Monthly"} Active
            </span>
          ) : isPaused ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
              <Pause className="h-3 w-3" />
              Subscription Paused
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-smoke px-3 py-1 text-xs font-semibold text-muted border border-line">
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="rounded-[14px] bg-title text-white p-3.5 text-sm font-medium shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. CURRENT ACTIVE PLAN CARD                                  */}
      {/* ============================================================ */}
      <Card className="rounded-xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs">
        {/* Card Header Status & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs font-semibold uppercase tracking-wider text-muted">
              Current Plan
            </span>
            <span className="text-muted/40">·</span>
            {isCancelled ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 border border-red-200/60">
                Cancelled
              </span>
            ) : isPaused ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 border border-amber-200/60">
                <Pause className="h-3 w-3" />
                Paused
              </span>
            ) : isPaidActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
                <Check className="h-3 w-3" />
                Pro {currentPlan === "annual" ? "Annual" : "Monthly"} Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-title border border-slate-200">
                90-Day Free Trial
              </span>
            )}
          </div>

          {/* Quick Management Buttons */}
          <div className="flex items-center gap-2">
            {!active || cancelled ? (
              <Button type="button" size="sm" onClick={handleStartTrial} className="h-8 font-medium text-xs rounded-lg">
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Start Free Trial
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleTogglePause}
                  className="h-8 border border-line/80 text-xs font-medium text-copy hover:text-title hover:bg-slate-50 rounded-lg"
                >
                  {paused ? (
                    <>
                      <Play className="h-3.5 w-3.5 mr-1.5 text-title" />
                      Resume Plan
                    </>
                  ) : (
                    <>
                      <Pause className="h-3.5 w-3.5 mr-1.5 text-muted" />
                      Pause Plan
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelAutoRenew}
                  className="h-8 text-xs font-medium text-muted hover:text-error hover:bg-red-50 rounded-lg"
                >
                  Cancel Renewal
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Plan Details & Pricing */}
        <div className="mt-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-title tracking-tight">
              {isCancelled
                ? "Subscription Inactive"
                : isPaused
                ? "Subscription Paused"
                : isPaidActive
                ? currentPlan === "annual"
                  ? "Pro Annual"
                  : "Pro Monthly"
                : "Pro 3-Month Free Trial"}
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-xl">
              {isCancelled
                ? "Your subscription is cancelled. Reactivate anytime to submit quotes and contact homeowners."
                : isPaused
                ? "Your subscription is temporarily paused. Resume anytime to unlock direct contact and quoting privileges."
                : isPaidActive
                ? `Your Pro subscription is in good standing. Next auto-renewal is scheduled for ${currentRenewalDate}.`
                : "Includes full directory listing, unlimited quote submissions, direct homeowner messaging, and zero commission fees."}
            </p>
          </div>

          <div className="md:text-right shrink-0">
            <div className="flex items-baseline md:justify-end gap-1.5">
              <span className="font-display text-3xl sm:text-4xl font-bold text-title tracking-tight">
                {isCancelled
                  ? "$19.99"
                  : isPaidActive
                  ? currentPlan === "annual"
                    ? "$14.99"
                    : "$19.99"
                  : "$0.00"}
              </span>
              <span className="text-xs font-medium text-muted">
                {isCancelled
                  ? "/ month"
                  : isPaidActive
                  ? currentPlan === "annual"
                    ? "/ mo ($179.88/yr)"
                    : "/ month"
                  : "/ month"}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-muted">
              {isTrialActive
                ? `Free through ${currentRenewalDate}`
                : isPaidActive
                ? `Renews on ${currentRenewalDate}`
                : "No active billing"}
            </p>
          </div>
        </div>

        {/* Trial Days Progress Bar */}
        {isTrialActive && (
          <div className="mt-5 pt-4 border-t border-line/60">
            <div className="flex items-center justify-between text-xs font-medium text-title mb-2">
              <span className="flex items-center gap-1.5 text-muted">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Trial Progress · Day {90 - trialDaysLeft} of 90
              </span>
              <span className="text-primary font-semibold">{trialDaysLeft} days remaining</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.round(((90 - trialDaysLeft) / 90) * 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              Auto-renewal date: <strong className="text-title">{currentRenewalDate}</strong> · No payment will be collected before this date.
            </p>
          </div>
        )}
      </Card>

      {/* ============================================================ */}
      {/* 3. PLAN SELECTION & UPGRADE PATH                             */}
      {/* ============================================================ */}
      <div className="space-y-3">
        <div>
          <h2 className="font-display text-base sm:text-lg font-semibold text-title tracking-tight">
            {isTrialActive ? "Renewal Plan Selection" : "Available Subscription Plans"}
          </h2>
          <p className="text-xs text-muted">
            {isTrialActive
              ? `Choose how you'd like to be billed when your free trial concludes on ${currentRenewalDate}.`
              : "Switch your billing frequency anytime. Changes take effect on your next cycle."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* OPTION 1: Pro Annual (Recommended) */}
          <div
            className={cn(
              "relative flex flex-col justify-between rounded-xl border p-5 sm:p-6 transition-all duration-200",
              billingPreference === "annual" || currentPlan === "annual"
                ? "border-primary bg-primary/[0.02] shadow-xs ring-1 ring-primary/30"
                : "border-line/80 bg-white hover:border-slate-300 hover:shadow-xs"
            )}
          >
            {/* Value Badge */}
            <div className="absolute right-4 top-4">
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-[11px] font-semibold">
                <Percent className="h-3 w-3" /> Save 25% ($60/yr)
              </span>
            </div>

            <div>
              <span className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
                Annual Billing · Best Value
              </span>
              <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-title">
                Pro Annual
              </h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-2xl sm:text-3xl font-bold text-title">$14.99</span>
                <span className="text-xs text-muted">/ month ($179.88 billed annually)</span>
              </div>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Ideal for full-time specialists and trade contractors looking to maximize margin and maintain prime search visibility.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-copy">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Includes all Pro Monthly benefits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span><strong>Priority Search Placement:</strong> Ranked above monthly pros</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Featured Pro Profile trust badge</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted">
                {isTrialActive ? `Renews at $179.88 on ${currentRenewalDate}` : "Auto-renews yearly"}
              </span>
              <Button
                type="button"
                size="sm"
                variant={currentPlan === "annual" ? "secondary" : "primary"}
                onClick={() => {
                  setBillingPreference("annual");
                  handleSelectPlan("annual", false);
                }}
                className="font-medium text-xs rounded-lg"
              >
                {currentPlan === "annual" ? "Renewal Plan Selected ✓" : "Select Annual Plan ↗"}
              </Button>
            </div>
          </div>

          {/* OPTION 2: Pro Monthly (Flexible) */}
          <div
            className={cn(
              "relative flex flex-col justify-between rounded-xl border p-5 sm:p-6 transition-all duration-200",
              billingPreference === "monthly" && currentPlan !== "annual"
                ? "border-primary bg-primary/[0.02] shadow-xs ring-1 ring-primary/30"
                : "border-line/80 bg-white hover:border-slate-300 hover:shadow-xs"
            )}
          >
            <div>
              <span className="font-display text-xs font-semibold uppercase tracking-wider text-muted">
                Month-to-Month Flexibility
              </span>
              <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-title">
                Pro Monthly
              </h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-display text-2xl sm:text-3xl font-bold text-title">$19.99</span>
                <span className="text-xs text-muted">/ month (Billed monthly)</span>
              </div>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Standard monthly tier. Perfect for independent contractors who prefer month-to-month flexibility with zero commitment.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-copy">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Full job lead board access &amp; quote submissions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Direct homeowner contact details unlocked</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Pause or cancel anytime without penalties</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted">
                {isTrialActive ? `Renews at $19.99 on ${currentRenewalDate}` : "Auto-renews monthly"}
              </span>
              <Button
                type="button"
                size="sm"
                variant={currentPlan === "monthly" ? "secondary" : "ghost"}
                onClick={() => {
                  setBillingPreference("monthly");
                  handleSelectPlan("monthly", false);
                }}
                className="font-medium text-xs border border-line/80 rounded-lg hover:bg-slate-50"
              >
                {currentPlan === "monthly" ? "Renewal Plan Selected ✓" : "Select Monthly Plan ↗"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. PAYMENT METHOD & BILLING INFO                             */}
      {/* ============================================================ */}
      <Card className="rounded-xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 shrink-0 border border-slate-200/60">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm sm:text-base font-semibold text-title flex items-center gap-2">
                <span>{paymentMethod?.brand ?? "Visa"} •••• {paymentMethod?.last4 ?? "4242"}</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200/60">
                  Primary Card
                </span>
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Expires {paymentMethod?.exp ?? "08/29"} · Card will only be charged when paid cycle commences.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowCardModal(true)}
            className="border border-line/80 text-xs font-medium rounded-lg self-start sm:self-auto hover:bg-slate-50"
          >
            Update Payment Card ↗
          </Button>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* 5. INVOICES & RECEIPTS HISTORY TABLE                         */}
      {/* ============================================================ */}
      <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/70 pb-3.5">
          <div>
            <h2 className="font-display text-lg font-bold text-title">
              Invoices &amp; Receipts
            </h2>
            <p className="text-xs text-muted">
              Download payment receipts and view upcoming renewal charges.
            </p>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line/70 text-muted uppercase font-sans text-[11px] tracking-wider">
                <th className="py-2.5 font-semibold">Invoice #</th>
                <th className="py-2.5 font-semibold">Billing Date</th>
                <th className="py-2.5 font-semibold hidden sm:table-cell">Description</th>
                <th className="py-2.5 font-semibold text-right">Amount</th>
                <th className="py-2.5 font-semibold text-center">Status</th>
                <th className="py-2.5 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-smoke/40 transition-colors">
                  <td className="py-3 font-semibold text-title">
                    {inv.id.toUpperCase()}
                  </td>
                  <td className="py-3 text-copy">
                    {inv.date}
                  </td>
                  <td className="py-3 text-muted hidden sm:table-cell">
                    {inv.description ?? (inv.amount === "$0.00" ? "3-Month Free Trial" : "Pro Membership")}
                  </td>
                  <td className="py-3 text-right font-display text-[13px] font-bold text-title">
                    {inv.amount}
                  </td>
                  <td className="py-3 text-center">
                    {inv.status === "paid" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <Check className="h-3 w-3" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                        <Clock className="h-3 w-3" /> Upcoming
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(inv)}
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      <span>View ↗</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ============================================================ */}
      {/* MODAL 1: UPDATE PAYMENT CARD MODAL                           */}
      {/* ============================================================ */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-[22px] border border-line bg-white p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-display text-lg font-bold text-title flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Update Payment Card
              </h3>
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="text-muted hover:text-title"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCard} className="mt-4 space-y-4">
              <Field label="Cardholder Name">
                <TextField
                  value={cardForm.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCardForm({ ...cardForm, name: e.target.value })
                  }
                  placeholder="Luis Ortega"
                  required
                />
              </Field>

              <Field label="Card Number">
                <TextField
                  value={cardForm.number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCardForm({ ...cardForm, number: e.target.value })
                  }
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Exp Date (MM/YY)">
                  <TextField
                    value={cardForm.exp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCardForm({ ...cardForm, exp: e.target.value })
                    }
                    placeholder="08/29"
                    maxLength={5}
                    required
                  />
                </Field>
                <Field label="CVC">
                  <TextField
                    value={cardForm.cvc}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCardForm({ ...cardForm, cvc: e.target.value })
                    }
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </Field>
              </div>

              <p className="text-xs text-muted flex items-center gap-1.5 pt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                PCI-DSS Level 1 compliant. Your card will only be charged when your paid billing cycle starts.
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCardModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 font-semibold">
                  Save Card
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: VIEW / PRINT RECEIPT MODAL                         */}
      {/* ============================================================ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[22px] border border-line bg-white p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-title">
                  Invoice Receipt: {selectedInvoice.id.toUpperCase()}
                </h3>
                <p className="text-xs text-muted">LocalHomeFix Subscription Billing</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="text-muted hover:text-title"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-copy">
              <div className="flex justify-between border-b border-line/60 pb-2.5">
                <span className="text-muted">Billed To</span>
                <span className="font-semibold text-title">Luis Ortega (Ortega Plumbing)</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-2.5">
                <span className="text-muted">Issue Date</span>
                <span className="font-semibold text-title">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-2.5">
                <span className="text-muted">Description</span>
                <span className="font-semibold text-title">
                  {selectedInvoice.description ?? "Pro Membership Subscription"}
                </span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-2.5">
                <span className="text-muted">Payment Method</span>
                <span className="font-semibold text-title">{paymentMethod?.brand} •••• {paymentMethod?.last4}</span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="font-bold text-title">Total Amount</span>
                <span className="font-display text-lg font-bold text-primary">
                  {selectedInvoice.amount}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-line pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                className="text-xs border border-line"
              >
                <Printer className="h-3.5 w-3.5 mr-1" />
                Print / Save PDF
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setSelectedInvoice(null)}
                className="text-xs"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
