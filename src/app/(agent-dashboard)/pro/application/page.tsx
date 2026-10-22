"use client";

import { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  ShieldCheck,
  Building2,
  ArrowRight,
  FileCheck,
  RefreshCw,
  BadgeCheck,
  ChevronRight,
  Info,
  SlidersHorizontal,
  FileUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppliedBanner } from "@/components/web-pages/applied-banner";
import {
  saveApplicationDraft,
  setApplicationCleared,
  setApplicationNeedsInfo,
  setApplicationRejected,
  submitApplication,
} from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const statusConfig = {
  draft: {
    label: "Draft in Progress",
    tone: "slate" as const,
    badgeBg: "bg-surface text-copy",
    borderColor: "border-line",
    headerBg: "bg-surface/50",
    icon: FileText,
    iconColor: "text-muted",
    stepIndex: 1,
    title: "Application Draft Started",
    description: "Please complete your license and liability insurance verification to submit for review.",
  },
  submitted: {
    label: "Under Compliance Review",
    tone: "blue" as const,
    badgeBg: "bg-blue-50 text-primary border border-blue-200",
    borderColor: "border-blue-200",
    headerBg: "bg-blue-50/50",
    icon: Clock,
    iconColor: "text-primary",
    stepIndex: 2,
    title: "Review in Progress (24–48h)",
    description: "Your credential filing is currently being verified by our compliance team. We will alert you upon clearance.",
  },
  needs_info: {
    label: "Action Required",
    tone: "amber" as const,
    badgeBg: "bg-amber-50 text-amber-800 border border-amber-200",
    borderColor: "border-amber-200",
    headerBg: "bg-amber-50/60",
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    stepIndex: 2,
    title: "Additional Document Requested",
    description: "The reviewer requested updated or clearer documentation before approving your account.",
  },
  rejected: {
    label: "Clearance Incomplete",
    tone: "orange" as const,
    badgeBg: "bg-red-50 text-red-700 border border-red-200",
    borderColor: "border-red-200",
    headerBg: "bg-red-50/50",
    icon: XCircle,
    iconColor: "text-red-600",
    stepIndex: 2,
    title: "Screening Incomplete",
    description: "Your application could not be verified automatically. You may submit updated credentials below.",
  },
  cleared: {
    label: "Approved & Active",
    tone: "green" as const,
    badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    borderColor: "border-emerald-200",
    headerBg: "bg-emerald-50/40",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    stepIndex: 3,
    title: "Verified Pro Contractor",
    description: "All credentials verified. You have full clearance to bid on local jobs, quote homeowners, and receive direct bookings.",
  },
} as const;

function formatReadableDate(iso?: string) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return iso;
  }
}

export default function ProApplicationPage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.features.applicationStatus);
  const reason = useAppSelector((state) => state.features.rejectionReason);
  const draft = useAppSelector((state) => state.features.applicationDraft);
  const proProfile = useAppSelector((state) => state.features.proProfile);

  const [licenseFile, setLicenseFile] = useState<string>(
    draft.licenseFile || "TX-M-42981-Master-Plumber-Certificate.pdf"
  );
  const [insuranceFile, setInsuranceFile] = useState<string>(
    draft.insuranceFile || "Next-General-Liability-COI-2026.pdf"
  );
  const [saveToast, setSaveToast] = useState(false);
  const [showDevSimulator, setShowDevSimulator] = useState(false);
  const [, startTransition] = useTransition();

  const currentConfig = statusConfig[status] || statusConfig.draft;
  const readableSavedDate = formatReadableDate(draft.savedAt);

  const handleSaveDraft = () => {
    dispatch(
      saveApplicationDraft({
        savedAt: new Date().toISOString(),
        licenseFile,
        insuranceFile,
        note: "Draft updated by contractor",
      })
    );
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2800);
  };

  const handleSubmit = () => {
    dispatch(
      saveApplicationDraft({
        savedAt: new Date().toISOString(),
        licenseFile,
        insuranceFile,
      })
    );
    dispatch(submitApplication());
  };

  const handleFileUpload = (
    type: "license" | "insurance",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    startTransition(() => {
      if (type === "license") {
        setLicenseFile(file.name);
      } else {
        setInsuranceFile(file.name);
      }
      dispatch(
        saveApplicationDraft({
          savedAt: new Date().toISOString(),
          [type === "license" ? "licenseFile" : "insuranceFile"]: file.name,
        })
      );
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/70 pb-5 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-[24px] sm:text-[28px] font-semibold text-title tracking-tight">
              Contractor Clearance & Application
            </h1>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${currentConfig.badgeBg}`}>
              <currentConfig.icon className="h-3.5 w-3.5" />
              {currentConfig.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Credential review and automated compliance verification for LocalHomeFix Pro Network.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/pro/verification"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-title shadow-xs hover:border-primary hover:text-primary transition-all"
          >
            <ShieldCheck className="h-4 w-4 text-primary" />
            Verification Center
          </Link>
          <Link
            href="/pro/profile"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-title shadow-xs hover:border-primary hover:text-primary transition-all"
          >
            <Building2 className="h-4 w-4 text-muted" />
            Edit Profile
          </Link>
        </div>
      </div>

      <Suspense fallback={null}>
        <AppliedBanner />
      </Suspense>

      {/* 3-Stage Progress Stepper */}
      <Card className="p-5 sm:p-6 border border-line/80 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-surface/40 border border-line/50">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Step 1</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>
              </div>
              <h4 className="text-sm font-semibold text-title mt-0.5">Business & Trade Profile</h4>
              <p className="text-xs text-muted mt-0.5">
                {proProfile?.contactName || "Luis Ortega"} · {proProfile?.trade || "Plumbing"}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`flex items-start gap-3.5 p-3 rounded-2xl border transition-all ${
              status === "cleared"
                ? "bg-emerald-50/50 border-emerald-200"
                : status === "needs_info"
                ? "bg-amber-50/50 border-amber-300 ring-2 ring-amber-100"
                : status === "submitted"
                ? "bg-blue-50/50 border-blue-200 ring-2 ring-blue-100"
                : "bg-surface/40 border-line/50"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-xs ${
                status === "cleared"
                  ? "bg-emerald-500 text-white"
                  : status === "needs_info"
                  ? "bg-amber-500 text-white"
                  : status === "submitted"
                  ? "bg-primary text-white"
                  : "bg-surface text-copy border border-line"
              }`}
            >
              {status === "cleared" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : status === "needs_info" ? (
                <AlertTriangle className="h-5 w-5" />
              ) : status === "submitted" ? (
                <Clock className="h-5 w-5 animate-pulse" />
              ) : (
                "2"
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Step 2</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    status === "cleared"
                      ? "text-emerald-700 bg-emerald-100/70"
                      : status === "needs_info"
                      ? "text-amber-800 bg-amber-100"
                      : status === "submitted"
                      ? "text-primary bg-blue-100"
                      : "text-muted bg-surface"
                  }`}
                >
                  {status === "cleared"
                    ? "Verified"
                    : status === "needs_info"
                    ? "Action Needed"
                    : status === "submitted"
                    ? "In Review"
                    : "Ready to Submit"}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-title mt-0.5">License & Insurance Audit</h4>
              <p className="text-xs text-muted mt-0.5">Trade credentials & $1M liability policy</p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`flex items-start gap-3.5 p-3 rounded-2xl border transition-all ${
              status === "cleared"
                ? "bg-emerald-50/50 border-emerald-200"
                : "bg-surface/30 border-line/40 opacity-80"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-xs ${
                status === "cleared" ? "bg-emerald-600 text-white" : "bg-surface text-muted border border-line"
              }`}
            >
              {status === "cleared" ? <BadgeCheck className="h-5 w-5" /> : "3"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Step 3</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    status === "cleared" ? "text-emerald-700 bg-emerald-100/70" : "text-muted bg-surface"
                  }`}
                >
                  {status === "cleared" ? "Unlocked" : "Locked"}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-title mt-0.5">Job Board & Direct Quoting</h4>
              <p className="text-xs text-muted mt-0.5">Instant lead access with $0 platform fee</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Dynamic Status Banner Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-7 shadow-xs transition-all ${currentConfig.borderColor} ${currentConfig.headerBg}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs border ${currentConfig.borderColor}`}>
              <currentConfig.icon className={`h-6 w-6 ${currentConfig.iconColor}`} />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-display text-lg font-semibold text-title">
                  {currentConfig.title}
                </h3>
                <Badge tone={currentConfig.tone}>{currentConfig.label}</Badge>
              </div>
              <p className="text-sm text-copy leading-relaxed max-w-2xl">
                {currentConfig.description}
              </p>

              {reason ? (
                <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/90 p-3.5 text-sm text-amber-900">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-950">Reviewer Note: </span>
                    {reason}
                  </div>
                </div>
              ) : null}

              {readableSavedDate && status === "draft" ? (
                <p className="text-xs text-muted pt-1">
                  Last saved: <span className="font-medium text-title">{readableSavedDate}</span>
                </p>
              ) : null}
            </div>
          </div>

          {/* Quick Action in Header Card */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 self-start sm:self-center">
            {status === "cleared" ? (
              <Button href="/pro/jobs" size="sm" className="rounded-full shadow-xs">
                Browse Open Leads
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            ) : status === "submitted" ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-primary shadow-xs">
                <Clock className="h-3.5 w-3.5" />
                Under active review
              </div>
            ) : (
              <Button type="button" size="sm" onClick={handleSubmit} className="rounded-full shadow-xs">
                {status === "needs_info" ? "Re-submit for Clearance" : "Submit Application"}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Business Profile Info & Document Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: Required Documents Upload */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="space-y-5">
            <div className="flex items-center justify-between border-b border-line/60 pb-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-title flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Required Compliance Documents
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Clear high-resolution copies of your active state trade credentials.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                2 of 2 attached
              </span>
            </div>

            {/* Document 1: Trade License */}
            <div className="rounded-2xl border border-line bg-surface/30 p-4 transition-all hover:border-primary/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-line text-primary shadow-xs">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-title">State Trade License</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Active Verified
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      Master Plumber · License #{proProfile?.licenseNumber || "TX-M-42981"} (Texas)
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-copy">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        {licenseFile}
                      </span>
                      <span className="text-[11px] text-muted">PDF · 1.8 MB</span>
                    </div>
                  </div>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-title shadow-xs hover:border-primary hover:text-primary transition-all">
                  <FileUp className="h-3.5 w-3.5" />
                  <span>Update</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload("license", e)}
                  />
                </label>
              </div>
            </div>

            {/* Document 2: General Liability Insurance */}
            <div className="rounded-2xl border border-line bg-surface/30 p-4 transition-all hover:border-primary/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-line text-emerald-600 shadow-xs">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-title">General Liability Insurance (COI)</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Coverage Valid
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      {proProfile?.insuranceCarrier || "Next Insurance"} · {proProfile?.insuranceCoverage || "$1,000,000 Coverage"}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-copy">
                        <FileText className="h-3.5 w-3.5 text-emerald-600" />
                        {insuranceFile}
                      </span>
                      <span className="text-[11px] text-muted">PDF · 2.4 MB</span>
                    </div>
                  </div>
                </div>

                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-title shadow-xs hover:border-primary hover:text-primary transition-all">
                  <FileUp className="h-3.5 w-3.5" />
                  <span>Update</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload("insurance", e)}
                  />
                </label>
              </div>
            </div>

            {/* Document 3: Identity & Background Screening */}
            <div className="rounded-2xl border border-line bg-surface/30 p-4 transition-all hover:border-primary/50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-line text-blue-600 shadow-xs">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-title">Government Identity & Screening</h4>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Stripe Verified
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      Hosted identity check completed for {proProfile?.contactName || "Luis Ortega"}.
                    </p>
                    <p className="text-[11px] text-muted mt-1.5 flex items-center gap-1">
                      <Info className="h-3 w-3 text-primary" />
                      LocalHomeFix stores verification confirmation, not raw identity credentials.
                    </p>
                  </div>
                </div>

                <Link
                  href="/pro/verification"
                  className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-title shadow-xs hover:border-primary hover:text-primary transition-all"
                >
                  <span>Details</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted" />
                </Link>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveDraft}
                  className="rounded-full text-xs"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Save Draft
                </Button>
                {saveToast ? (
                  <span className="text-xs font-medium text-emerald-600 animate-fade-in flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Draft saved
                  </span>
                ) : readableSavedDate ? (
                  <span className="text-[11px] text-muted hidden sm:inline">
                    Saved: {readableSavedDate}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                {status !== "cleared" ? (
                  <Button type="button" size="sm" onClick={handleSubmit} className="rounded-full shadow-xs">
                    {status === "needs_info" ? "Resubmit Application" : "Submit for Approval"}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button href="/pro/jobs" size="sm" className="rounded-full shadow-xs">
                    Access Job Board
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Verified Contractor Credentials Snapshot */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-line/60 pb-3.5">
              <h3 className="font-display text-base font-semibold text-title flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Contractor Credentials
              </h3>
              <Link href="/pro/profile" className="text-xs font-medium text-primary hover:underline">
                Edit
              </Link>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-line/40">
                <span className="text-muted text-xs">Business Entity</span>
                <span className="font-medium text-title text-right">
                  {proProfile?.businessName || "Ortega Plumbing & Gas"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-line/40">
                <span className="text-muted text-xs">Licensed Principal</span>
                <span className="font-medium text-title text-right">
                  {proProfile?.contactName || "Luis Ortega"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-line/40">
                <span className="text-muted text-xs">Primary Trade</span>
                <span className="font-medium text-title text-right">
                  {proProfile?.trade || "Plumbing"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-line/40">
                <span className="text-muted text-xs">Trade License #</span>
                <span className="font-mono text-xs font-semibold text-title text-right bg-surface px-2 py-0.5 rounded">
                  {proProfile?.licenseNumber || "TX-M-42981 (Master Plumber)"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-line/40">
                <span className="text-muted text-xs">Liability Insurance</span>
                <span className="font-medium text-title text-right">
                  {proProfile?.insuranceCarrier || "Next Insurance"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-line/40">
                <span className="text-muted text-xs">Service Radius</span>
                <span className="font-medium text-title text-right">
                  {proProfile?.radiusMiles || 25} miles around {proProfile?.city || "Austin"}, {proProfile?.state || "TX"}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted text-xs">Platform Commission</span>
                <span className="font-semibold text-emerald-600 text-right">
                  0% (Direct homeowner payout)
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50/70 border border-blue-200/80 p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
              <BadgeCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">LocalHomeFix Guarantee</p>
                <p className="text-blue-800/90 mt-0.5">
                  Verified contractors receive priority lead alerts, instant phone connect, and direct quote messaging without third-party lead fees.
                </p>
              </div>
            </div>
          </Card>

          {/* Compliance & Trust FAQs */}
          <Card className="p-5 space-y-3 bg-surface/30 border border-line/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
              Verification Standards
            </h4>
            <div className="space-y-2 text-xs text-copy leading-relaxed">
              <p>
                <strong>Turnaround Time:</strong> Standard applications are audited in 24 business hours. Automated license registry checks run hourly.
              </p>
              <p>
                <strong>Privacy & Storage:</strong> Insurance and license files are stored in an encrypted compliance vault and never exposed publicly.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Developer / QA Review Simulator (Isolated at bottom) */}
      <div className="mt-8 pt-4 border-t border-line/60">
        <div className="rounded-2xl border border-line/70 bg-surface/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted" />
              <span className="text-xs font-semibold text-title">Review Simulator (QA / Client Demo)</span>
              <span className="text-[10px] text-muted hidden sm:inline">
                Toggle application states to test approval workflows & job board gates
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowDevSimulator((prev) => !prev)}
              className="text-xs font-medium text-primary hover:underline"
            >
              {showDevSimulator ? "Hide controls" : "Show controls"}
            </button>
          </div>

          {showDevSimulator ? (
            <div className="mt-3.5 pt-3 border-t border-line/50 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    saveApplicationDraft({
                      savedAt: new Date().toISOString(),
                      note: "Reset to draft for demo",
                    })
                  )
                }
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                  status === "draft"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-title border-line hover:border-primary/50"
                }`}
              >
                Set: Draft
              </button>

              <button
                type="button"
                onClick={() => dispatch(submitApplication())}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                  status === "submitted"
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-title border-line hover:border-primary/50"
                }`}
              >
                Set: Under Review
              </button>

              <button
                type="button"
                onClick={() =>
                  dispatch(
                    setApplicationNeedsInfo(
                      "Please provide an updated General Liability policy showing LocalHomeFix as additional certificate holder."
                    )
                  )
                }
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                  status === "needs_info"
                    ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                    : "bg-white text-title border-line hover:border-amber-400"
                }`}
              >
                Set: Needs Info
              </button>

              <button
                type="button"
                onClick={() => dispatch(setApplicationCleared())}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                  status === "cleared"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-white text-title border-line hover:border-emerald-400"
                }`}
              >
                Set: Cleared (Active)
              </button>

              <button
                type="button"
                onClick={() =>
                  dispatch(
                    setApplicationRejected(
                      "State licensing board records could not confirm master plumber certification in Travis county."
                    )
                  )
                }
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                  status === "rejected"
                    ? "bg-red-600 text-white border-red-600 shadow-xs"
                    : "bg-white text-title border-line hover:border-red-400"
                }`}
              >
                Set: Rejected
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
