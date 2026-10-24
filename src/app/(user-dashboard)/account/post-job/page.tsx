"use client";

import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Home,
  ImagePlus,
  MapPin,
  Send,
  ShieldCheck,
  Store,
  Sun,
  Sunrise,
  Sunset,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { categories, getPro } from "@/Mockdata";
import { clearDraft } from "@/redux/slices/intakeSlice";
import { addJob } from "@/redux/slices/marketplaceSlice";
import { addNotification, invitePro, setJobPhotos } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { PropertyType, Urgency } from "@/types";
import { cn } from "@/lib/cn";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const STEPS = [
  { id: 1, label: "Job Details", shortLabel: "Details" },
  { id: 2, label: "When & Where", shortLabel: "Schedule" },
  { id: 3, label: "Review & Submit", shortLabel: "Review" },
];

export default function PostJobPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[20px] border border-line/80 bg-white p-8 text-center">
          <p className="text-sm text-muted">Loading booking flow…</p>
        </div>
      }
    >
      <BookingFlow />
    </Suspense>
  );
}

function createJobId() {
  return `job-local-${Date.now()}`;
}

function BookingFlow() {
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("invite");
  const invitedPro = inviteId ? getPro(inviteId) : null;

  const draft = useAppSelector((state) => state.intake.draft);
  const user = useAppSelector((state) => state.auth.user);
  const addresses = useAppSelector((state) => state.features.addresses);
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);

  // 3-Step Streamlined Flow
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submittedJobId, setSubmittedJobId] = useState<string | null>(null);

  // Form State
  const [categorySlug, setCategorySlug] = useState(
    invitedPro?.categorySlug ?? draft.categorySlug ?? "plumbing",
  );
  const [titleInput, setTitleInput] = useState(draft.title || "");
  const [descriptionInput, setDescriptionInput] = useState(draft.problem || "");
  const [urgency, setUrgency] = useState<Urgency>("this_week");
  const [timeWindow, setTimeWindow] = useState("anytime");
  const [propertyType, setPropertyType] = useState<PropertyType>("single_family");
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find(
      (a) =>
        user?.street && a.street.trim().toLowerCase() === user.street.trim().toLowerCase(),
    )?.id ||
      addresses[0]?.id ||
      "",
  );
  const [zipInput, setZipInput] = useState(
    draft.zip || user?.zip || addresses[0]?.zip || "78701",
  );
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const selectedCategory = categories.find((c) => c.slug === categorySlug) ?? categories[0];
  const activeAddress = addresses.find((a) => a.id === selectedAddressId);

  // Simple Step Validations
  function validateStep(currentStep: number): boolean {
    setError("");
    if (currentStep === 1) {
      if (titleInput.trim().length < 4) {
        setError("Please enter a short project headline (at least 4 characters).");
        return false;
      }
      if (descriptionInput.trim().length < 10) {
        setError("Please add a brief description of what you need (at least 10 characters).");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!/^\d{5}$/.test(zipInput.trim())) {
        setError("Please enter a valid 5-digit ZIP code.");
        return false;
      }
    }
    return true;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  }

  function handleBack() {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  }

  function onPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])].slice(0, 4 - photoUrls.length);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhotoUrls((prev) => [...prev, reader.result as string].slice(0, 4));
        }
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFinalSubmit() {
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    if (!validateStep(2)) {
      setStep(2);
      return;
    }

    const jobId = createJobId();
    const timeLabel =
      timeWindow === "morning"
        ? "Morning (8 AM – 12 PM)"
        : timeWindow === "afternoon"
          ? "Afternoon (12 PM – 5 PM)"
          : timeWindow === "evening"
            ? "Evening (5 PM – 8 PM)"
            : "Flexible / Anytime";

    const enhancedDescription = `${descriptionInput.trim()}\n\n[Preferred Timing: ${timeLabel}]`;

    dispatch(
      addJob({
        id: jobId,
        title: titleInput.trim(),
        categorySlug,
        description: enhancedDescription,
        zip: zipInput.trim(),
        city: activeAddress?.city || user?.city || "Austin",
        state: activeAddress?.state || user?.state || "TX",
        urgency,
        propertyType,
        homeownerName: user?.name ?? "Homeowner",
      }),
    );

    if (photoUrls.length) {
      dispatch(setJobPhotos({ jobId, photos: photoUrls }));
    }

    if (invitedPro) {
      dispatch(invitePro({ jobId, proId: invitedPro.id }));
      dispatch(
        addNotification({
          title: "Direct quote request",
          body: `${user?.name ?? "A homeowner"} sent you a private quote request for "${titleInput.trim()}".`,
          href: `/pro/jobs/${jobId}`,
          createdAt: "Just now",
          role: "pro",
        }),
      );
    } else {
      dispatch(
        addNotification({
          title: "New open request",
          body: `${titleInput.trim()} near ${zipInput.trim()} is open for bidding on the job board.`,
          href: `/pro/jobs/${jobId}`,
          createdAt: "Just now",
          role: "pro",
        }),
      );
    }

    dispatch(
      addNotification({
        title: "Request Submitted",
        body: invitedPro
          ? `Dispatched directly to ${invitedPro.name}. Expected response within 15 minutes.`
          : "Request sent to local pros. You will receive quotes soon.",
        href: `/account/jobs/${jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );

    dispatch(clearDraft());
    setSubmittedJobId(jobId);
  }

  // Confirmation View
  if (submittedJobId) {
    return (
      <Card className="rounded-[24px] border border-line/80 bg-white p-6 sm:p-10 shadow-sm max-w-xl mx-auto text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs mb-5">
          <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/80">
          Request Sent
        </span>

        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-title">
          {invitedPro ? `Request Sent to ${invitedPro.name}!` : "Your Request is Live!"}
        </h1>

        <p className="mt-2 text-sm text-[#555] max-w-md mx-auto leading-relaxed">
          {invitedPro
            ? `${invitedPro.name} has been notified and will review your request shortly.`
            : "Top local professionals have received your request and will send you upfront quotes."}
        </p>

        {/* Work Order Receipt Box */}
        <div className="mt-6 rounded-2xl border border-line/80 bg-surface/50 p-4 sm:p-5 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-line/60 pb-3">
            <span className="text-xs font-medium text-muted">Request Reference</span>
            <span className="font-mono text-xs font-bold text-title">
              #{submittedJobId.replace("job-local-", "HF-")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted block">Service</span>
              <span className="font-semibold text-title truncate block">{titleInput}</span>
            </div>
            <div>
              <span className="text-muted block">Location</span>
              <span className="font-semibold text-title">
                {zipInput} (Austin, TX)
              </span>
            </div>
            <div>
              <span className="text-muted block">Timeframe</span>
              <span className="font-semibold text-title capitalize">
                {urgency === "asap" ? "Emergency / ASAP" : urgency.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="text-muted block">Status</span>
              <span className="font-semibold text-emerald-700">Waiting for Quotes</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            href={`/account/jobs/${submittedJobId}?posted=1`}
            size="lg"
            className="w-full sm:w-auto font-semibold rounded-full shadow-xs px-6"
          >
            View Request Status ↗
          </Button>

          {invitedPro ? (
            <Button
              href="/account/messages"
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto rounded-full text-xs font-semibold"
            >
              Open Messages ↗
            </Button>
          ) : (
            <Button
              href="/browse-pros"
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto rounded-full text-xs font-semibold"
            >
              Browse Other Pros ↗
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Invited Pro Banner (If directly booking) */}
      {invitedPro ? (
        <Card className="rounded-[20px] border border-primary/30 bg-gradient-to-r from-primary/5 via-blue-50/20 to-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 font-display text-lg font-bold text-white shadow-xs">
                {initials(invitedPro.name)}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    Direct Request
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Pro
                  </span>
                </div>
                <h2 className="font-display text-lg font-bold text-title mt-0.5">
                  {invitedPro.name}
                </h2>
                <p className="text-xs text-muted">
                  ★ {invitedPro.rating.toFixed(1)} ({invitedPro.reviewCount} reviews) • Starting at ${invitedPro.startingPrice}
                </p>
              </div>
            </div>

            <Link
              href={`/browse-pros/${invitedPro.id}`}
              className="text-xs font-semibold text-primary hover:underline shrink-0"
            >
              View Profile ↗
            </Link>
          </div>
        </Card>
      ) : null}

      {/* 2. Streamlined 3-Step Progress Indicator */}
      <div className="rounded-[20px] border border-line/80 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 text-xs">
          <span className="font-display font-bold text-title text-sm">
            Step {step} of 3: <span className="text-primary">{STEPS[step - 1].label}</span>
          </span>
          <span className="font-medium text-muted">{Math.round((step / 3) * 100)}% Completed</span>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-smoke">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step Tabs */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {STEPS.map((s) => {
            const isCompleted = s.id < step;
            const isCurrent = s.id === step;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (s.id < step) setStep(s.id);
                }}
                disabled={s.id > step}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-semibold transition-all",
                  isCurrent && "bg-primary text-white shadow-xs font-bold",
                  isCompleted && "bg-smoke text-title hover:bg-smoke/80 cursor-pointer",
                  !isCurrent && !isCompleted && "bg-transparent text-muted/60 opacity-60 cursor-not-allowed",
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <span className="text-[11px]">{s.id}.</span>
                )}
                <span>{s.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Layout: Form (Left) & Minimal Summary (Right) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Active Step */}
        <div className="lg:col-span-8">
          <Card className="rounded-[22px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
            {/* STEP 1: JOB DETAILS */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="border-b border-line/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-title">
                    What do you need help with?
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Tell us about your project so we can match you with the right specialist.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_1.5fr]">
                  <Field label="Trade Category *">
                    <NativeSelect
                      value={categorySlug}
                      onChange={(e) => setCategorySlug(e.target.value)}
                      className="rounded-xl"
                    >
                      {categories.map((item) => (
                        <option key={item.id} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>

                  <Field label="Project Headline *">
                    <TextField
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      placeholder="e.g. Leaking kitchen faucet or outlet repair"
                      required
                      className="rounded-xl"
                    />
                  </Field>
                </div>

                <Field label="Detailed Work Description *">
                  <TextArea
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    placeholder="Describe what needs to be fixed or installed, any symptoms, and any specific requests..."
                    className="min-h-[110px] rounded-xl text-sm"
                    rows={4}
                    required
                  />
                </Field>

                {/* Inline Photo Upload (Convenient & frictionless) */}
                <div className="space-y-2 pt-1 border-t border-line/40">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-title">
                      Project Photos (Optional)
                    </label>
                    <span className="text-[11px] text-muted">{photoUrls.length} / 4 attached</span>
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={onPhotos}
                    className="sr-only"
                  />

                  <div className="flex flex-wrap items-center gap-2.5">
                    {photoUrls.map((src, index) => (
                      <div
                        key={src.slice(0, 48)}
                        className="relative h-20 w-20 overflow-hidden rounded-xl border border-line shadow-xs group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="Uploaded site photo" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          aria-label="Remove photo"
                          onClick={() => removePhoto(index)}
                          className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-title/80 text-white transition hover:bg-error"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {photoUrls.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line bg-smoke/40 text-muted transition hover:border-primary hover:text-primary hover:bg-primary/[0.02]"
                      >
                        <ImagePlus className="h-5 w-5" />
                        <span className="text-[11px] font-semibold">+ Add Photos</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: WHEN & WHERE */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-line/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-title">
                    When and where do you need service?
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Choose your timeframe and service location.
                  </p>
                </div>

                {/* Streamlined Urgency Selection (3 Clean Cards) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-title">
                    When would you like this done?
                  </label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        id: "asap",
                        title: "ASAP / Emergency",
                        desc: "Immediate or same-day",
                        icon: Zap,
                      },
                      {
                        id: "this_week",
                        title: "Within a few days",
                        desc: "Next 1–3 business days",
                        icon: Calendar,
                      },
                      {
                        id: "flexible",
                        title: "Flexible",
                        desc: "Planning ahead / no rush",
                        icon: Clock,
                      },
                    ].map((item) => {
                      const active = urgency === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setUrgency(item.id as Urgency)}
                          className={cn(
                            "flex flex-col text-left rounded-xl border p-3.5 transition-all",
                            active
                              ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs"
                              : "border-line bg-white hover:border-primary/40 hover:bg-smoke/40",
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={cn(
                                "grid h-7 w-7 place-items-center rounded-lg transition-colors",
                                active ? "bg-primary text-white" : "bg-smoke text-primary",
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="font-display text-xs font-bold text-title">
                              {item.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-muted">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Time of Day (Clean Compact Tabs) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-title">
                    Preferred Arrival Window (Optional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "morning", label: "Morning", sub: "8 AM – 12 PM", icon: Sunrise },
                      { id: "afternoon", label: "Afternoon", sub: "12 PM – 5 PM", icon: Sun },
                      { id: "evening", label: "Evening", sub: "5 PM – 8 PM", icon: Sunset },
                      { id: "anytime", label: "Anytime", sub: "Flexible", icon: Clock },
                    ].map((w) => {
                      const active = timeWindow === w.id;
                      const Icon = w.icon;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setTimeWindow(w.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all",
                            active
                              ? "border-primary bg-primary text-white shadow-xs font-semibold"
                              : "border-line bg-white text-copy hover:border-primary/40 hover:bg-smoke",
                          )}
                        >
                          <Icon className={cn("h-4 w-4 mb-0.5", active ? "text-white" : "text-primary")} />
                          <span className="text-xs font-bold">{w.label}</span>
                          <span className={cn("text-[10px]", active ? "text-white/80" : "text-muted")}>
                            {w.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location: Address / ZIP */}
                <div className="space-y-3 pt-2 border-t border-line/40">
                  <label className="block text-xs font-bold text-title">
                    Service Location
                  </label>

                  {addresses.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {addresses.map((addr) => {
                        const active = selectedAddressId === addr.id;
                        return (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              if (addr.zip) setZipInput(addr.zip);
                            }}
                            className={cn(
                              "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all",
                              active
                                ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs"
                                : "border-line bg-white hover:border-primary/40 hover:bg-smoke",
                            )}
                          >
                            <MapPin className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted")} />
                            <div className="min-w-0">
                              <span className="font-display text-xs font-bold text-title block truncate">
                                {addr.label}
                              </span>
                              <span className="text-[11px] text-muted block truncate">
                                {addr.street}, {addr.zip}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="max-w-xs">
                    <Field label="Service ZIP Code *">
                      <TextField
                        value={zipInput}
                        onChange={(e) => setZipInput(e.target.value)}
                        placeholder="78701"
                        maxLength={5}
                        required
                        className="rounded-xl font-mono text-sm"
                      />
                    </Field>
                  </div>
                </div>

                {/* Property Type (Clean compact pills) */}
                <div className="space-y-2 pt-2 border-t border-line/40">
                  <label className="block text-xs font-bold text-title">
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "single_family", label: "Single-Family", icon: Home },
                      { id: "condo", label: "Condo / HOA", icon: Building },
                      { id: "apartment", label: "Apartment", icon: Building2 },
                      { id: "commercial", label: "Commercial", icon: Store },
                    ].map((p) => {
                      const active = propertyType === p.id;
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPropertyType(p.id as PropertyType)}
                          className={cn(
                            "flex items-center justify-center gap-2 p-2.5 rounded-xl border text-center transition-all",
                            active
                              ? "border-primary bg-primary/[0.05] ring-2 ring-primary/20 text-primary font-bold shadow-xs"
                              : "border-line bg-white text-title hover:border-primary/40 hover:bg-smoke text-xs",
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-semibold">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & CONFIRM */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-line/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-title">
                    Review &amp; Submit
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    Check your details before we notify top-rated pros in your area.
                  </p>
                </div>

                {/* Structured Review Card */}
                <div className="rounded-2xl border border-line/80 bg-surface/50 p-4 sm:p-5 space-y-4">
                  <div className="flex items-start justify-between border-b border-line/60 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {selectedCategory.name}
                      </span>
                      <p className="font-display text-base font-bold text-title mt-0.5">
                        {titleInput}
                      </p>
                      <p className="text-xs text-muted mt-1 leading-relaxed">
                        {descriptionInput}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-primary hover:underline shrink-0 ml-3"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs border-b border-line/60 pb-3">
                    <div>
                      <span className="text-muted block">Timeframe</span>
                      <span className="font-semibold text-title capitalize">
                        {urgency === "asap" ? "Emergency / ASAP" : urgency.replace("_", " ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted block">Arrival Window</span>
                      <span className="font-semibold text-title capitalize">
                        {timeWindow}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted block">Location</span>
                      <span className="font-semibold text-title">{zipInput}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted">Property: </span>
                      <span className="font-semibold text-title capitalize">
                        {propertyType.replace("_", " ")}
                      </span>
                      {photoUrls.length > 0 && (
                        <span className="ml-3 text-muted">
                          • {photoUrls.length} photo{photoUrls.length > 1 ? "s" : ""} attached
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Photos Preview in Review (if any) */}
                {photoUrls.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-title">Attached Photos</span>
                    <div className="flex gap-2">
                      {photoUrls.map((src) => (
                        <div
                          key={src.slice(0, 48)}
                          className="h-16 w-16 overflow-hidden rounded-xl border border-line"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="Attached" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct info banner */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 flex items-center gap-2.5 text-xs text-emerald-950">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>
                    No charges now. Pros will send you free upfront quotes and you pay directly when the job is done.
                  </span>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-error border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleBack}
                  className="rounded-full gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <Button
                  href="/account"
                  variant="ghost"
                  size="md"
                  className="rounded-full text-muted"
                >
                  Cancel
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  size="md"
                  onClick={handleNext}
                  className="rounded-full gap-1.5 font-semibold shadow-xs"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="md"
                  onClick={handleFinalSubmit}
                  className="rounded-full gap-2 font-semibold shadow-sm bg-primary hover:bg-primary-hover px-6"
                >
                  <Send className="h-4 w-4" />
                  {invitedPro
                    ? `Send Request to ${invitedPro.name}`
                    : "Post Request & Get Quotes"}
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Live Booking Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <Card className="rounded-[22px] border border-line/80 bg-white p-5 shadow-xs space-y-3.5">
            <h3 className="font-display text-xs font-bold text-muted uppercase tracking-wider">
              Summary
            </h3>

            {invitedPro ? (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs space-y-1">
                <p className="font-bold text-title">{invitedPro.name}</p>
                <p className="text-muted">{invitedPro.trade} • Starting at ${invitedPro.startingPrice}</p>
              </div>
            ) : (
              <div className="rounded-xl border border-line bg-smoke/60 p-3 text-xs space-y-0.5">
                <p className="font-bold text-title">Open Request</p>
                <p className="text-muted">
                  Sending to top verified pros in {zipInput} (Austin area).
                </p>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-line/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted">Service:</span>
                <span className="font-semibold text-title">{selectedCategory.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Timeframe:</span>
                <span className="font-semibold text-title capitalize">
                  {urgency === "asap" ? "ASAP" : urgency.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Location:</span>
                <span className="font-semibold text-title font-mono">{zipInput}</span>
              </div>
              {photoUrls.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted">Photos:</span>
                  <span className="font-semibold text-title">{photoUrls.length} attached</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
