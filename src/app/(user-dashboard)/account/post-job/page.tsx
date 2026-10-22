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
  DollarSign,
  Home,
  ImagePlus,
  MapPin,
  PackageCheck,
  Send,
  ShieldCheck,
  CalendarCheck,
  Store,
  Sun,
  Sunrise,
  Sunset,
  Truck,
  Wrench,
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

const categoryIntakeGuide: Record<
  string,
  {
    typicalRange: string;
    commonIssues: string[];
    diagnosticTip: string;
  }
> = {
  plumbing: {
    typicalRange: "$120 – $280 for minor repairs · $350 – $850 for fixtures/heaters",
    commonIssues: [
      "Kitchen faucet leaking under cabinet",
      "Running / constantly filling toilet",
      "Bathroom sink drain clogged",
      "Water heater not producing hot water",
      "Garbage disposal humming or jammed",
    ],
    diagnosticTip: "If there is active spraying, shut off the local isolation valve under the fixture immediately.",
  },
  electrical: {
    typicalRange: "$110 – $250 for outlets/switches · $280 – $650 for circuits/fans",
    commonIssues: [
      "Wall outlet stopped working / no power",
      "Ceiling fan replacement & balancing",
      "Circuit breaker frequently tripping",
      "New recessed ceiling lights installation",
      "EV charger 240V circuit installation",
    ],
    diagnosticTip: "Turn off the relevant circuit breaker at the main electrical panel before inspecting wires.",
  },
  hvac: {
    typicalRange: "$140 – $320 diagnostic & tune-up · $450 – $1,200 compressor/blower",
    commonIssues: [
      "AC running but blowing warm air",
      "Heat pump / furnace not turning on",
      "Smart thermostat wiring installation",
      "Water leaking from indoor drain pan",
      "Strange squealing or burning smell from vents",
    ],
    diagnosticTip: "Check your furnace air filter first; a clogged filter is the #1 cause of airflow failure.",
  },
  handyman: {
    typicalRange: "$95 – $240 for typical punch-list tasks",
    commonIssues: [
      "Drywall hole patch & paint matching",
      "Heavy TV wall mounting on studs",
      "Interior door rubbing or latching issue",
      "Cabinet hardware installation",
      "Curtain rods & blinds installation",
    ],
    diagnosticTip: "Group multiple smaller punch-list items together into one visit to get the best hourly value.",
  },
  painting: {
    typicalRange: "$250 – $600 per room · $1,200 – $3,500 whole interior",
    commonIssues: [
      "Single bedroom wall & ceiling refresh",
      "Baseboard and door trim repainting",
      "Drywall water stain priming & repaint",
      "Kitchen cabinet spray refinishing",
    ],
    diagnosticTip: "Specify whether you want walls only, or if ceilings, trim, and closets are included.",
  },
  roofing: {
    typicalRange: "$200 – $600 for leak repairs · $5,000+ for replacement",
    commonIssues: [
      "Missing or wind-damaged shingles",
      "Chimney / vent pipe flashing leak",
      "Gutter pulling away from fascia",
      "Ceiling water spot after heavy rain",
    ],
    diagnosticTip: "Take photos of indoor ceiling stains as well as exterior roof angles if safely visible from ground.",
  },
  "appliance-repair": {
    typicalRange: "$125 – $290 diagnostic + labor · Parts priced separately",
    commonIssues: [
      "Refrigerator clicking and not cooling",
      "Dishwasher leaving standing water in bottom",
      "Washing machine not spinning / draining",
      "Clothes dryer running but no heat",
    ],
    diagnosticTip: "Have the model and serial number (usually on a sticker inside the door frame) handy.",
  },
  landscaping: {
    typicalRange: "$80 – $220 standard yard maintenance · $500+ projects",
    commonIssues: [
      "Lawn mowing, edging, and weed whacking",
      "Flower bed mulching and weed clearing",
      "Hedge and tree branch trimming",
      "Sprinkler head repair & zone tune-up",
    ],
    diagnosticTip: "Mention the approximate size of the yard (front, back, or both) and gate width for mowers.",
  },
  "pest-control": {
    typicalRange: "$150 – $350 initial treatment · $60 – $100 recurring",
    commonIssues: [
      "Ant infestation in kitchen / bathroom",
      "Wasp or hornet nest near roof eaves",
      "Rodent sounds in attic or crawlspace",
      "Termite inspection & barrier treatment",
    ],
    diagnosticTip: "Note where activity is highest and whether pets or young children are present.",
  },
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const STEPS = [
  { id: 1, label: "Scope & Details", shortLabel: "Scope" },
  { id: 2, label: "Schedule & Timing", shortLabel: "Schedule" },
  { id: 3, label: "Property & Parts", shortLabel: "Property" },
  { id: 4, label: "Location & Photos", shortLabel: "Location" },
  { id: 5, label: "Review & Confirm", shortLabel: "Review" },
];

export default function PostJobPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[20px] border border-line/80 bg-white p-8 text-center">
          <p className="text-sm text-muted">Loading Thumbtack-grade booking flow…</p>
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

  // Flow Step State (1 to 5)
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
  const [timeWindow, setTimeWindow] = useState("morning");
  const [propertyType, setPropertyType] = useState<PropertyType>("single_family");
  const [materialsStatus, setMaterialsStatus] = useState("pro_supplies");
  const [budget, setBudget] = useState("");
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

  // Step Validations
  function validateStep(currentStep: number): boolean {
    setError("");
    if (currentStep === 1) {
      if (titleInput.trim().length < 4) {
        setError("Please enter a short project title (at least 4 characters).");
        return false;
      }
      if (descriptionInput.trim().length < 10) {
        setError("Please describe the issue or work needed in a bit more detail (at least 10 characters).");
        return false;
      }
    }
    if (currentStep === 4) {
      if (!/^\d{5}$/.test(zipInput.trim())) {
        setError("Please provide a valid 5-digit ZIP code.");
        return false;
      }
    }
    return true;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
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
    if (!validateStep(4)) {
      setStep(4);
      return;
    }

    const jobId = createJobId();
    const materialsLabel =
      materialsStatus === "homeowner_supplies"
        ? "Homeowner has parts on-site"
        : materialsStatus === "needs_consultation"
          ? "Diagnostic & parts recommendation needed"
          : "Contractor should supply parts & materials";

    const enhancedDescription = `${descriptionInput.trim()}\n\n[Preferred Timing: ${timeWindow.toUpperCase()}] · [Scope & Materials: ${materialsLabel}]`;

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
        budget: budget || undefined,
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
        title: "Work Order Confirmed",
        body: invitedPro
          ? `Dispatched directly to ${invitedPro.name}. Expected response within 15 minutes.`
          : "Request broadcast to top-rated local pros. Quotes will appear in your requests.",
        href: `/account/jobs/${jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );

    dispatch(clearDraft());
    setSubmittedJobId(jobId);
  }

  // If successfully submitted, show Thumbtack celebration confirmation
  if (submittedJobId) {
    return (
      <Card className="rounded-[24px] border border-line/80 bg-white p-6 sm:p-10 shadow-sm max-w-2xl mx-auto text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-xs mb-5">
          <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200/80">
          Work Order Dispatched
        </span>

        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-title">
          {invitedPro
            ? `Request Sent to ${invitedPro.name}!`
            : "Your Request is Live!"}
        </h1>

        <p className="mt-2 text-sm text-[#555] max-w-md mx-auto leading-relaxed">
          {invitedPro
            ? `${invitedPro.name} has been notified with your exact project details, schedule, and photos.`
            : "Top background-checked local specialists have received your request and will review your specifications."}
        </p>

        {/* Work Order Receipt Box */}
        <div className="mt-6 rounded-2xl border border-line/80 bg-surface/50 p-4 sm:p-5 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-line/60 pb-3">
            <span className="text-xs font-medium text-muted">Work Order Reference</span>
            <span className="font-mono text-xs font-bold text-title">
              #{submittedJobId.replace("job-local-", "HF-")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted block">Service</span>
              <span className="font-semibold text-title">{titleInput}</span>
            </div>
            <div>
              <span className="text-muted block">Service Location</span>
              <span className="font-semibold text-title">
                {activeAddress ? `${activeAddress.street}, ` : ""}{zipInput} (Austin, TX)
              </span>
            </div>
            <div>
              <span className="text-muted block">Schedule Target</span>
              <span className="font-semibold text-title capitalize">
                {urgency === "asap" ? "Emergency / ASAP" : urgency.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="text-muted block">Direct Payment Guarantee</span>
              <span className="font-semibold text-emerald-700">$0 Platform Markup</span>
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
            Track Work Order &amp; Quotes <ArrowRight className="h-4 w-4 ml-1" />
          </Button>

          {invitedPro ? (
            <Button
              href={`/account/messages`}
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto rounded-full text-xs font-semibold"
            >
              Open Direct Messages
            </Button>
          ) : (
            <Button
              href="/browse-pros"
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto rounded-full text-xs font-semibold"
            >
              Browse More Pros
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Invited Pro Sticky Hero Banner (If directly booking a specific pro) */}
      {invitedPro ? (
        <Card className="rounded-[22px] border border-primary/30 bg-gradient-to-r from-primary/5 via-blue-50/20 to-white p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 font-display text-xl font-bold text-white shadow-xs">
                {initials(invitedPro.name)}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    Direct Booking Request
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Pro
                  </span>
                </div>
                <h2 className="mt-1 font-display text-lg sm:text-xl font-bold text-title">
                  {invitedPro.name}
                </h2>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-semibold text-title">★ {invitedPro.rating.toFixed(1)}</span>
                  <span>({invitedPro.reviewCount} reviews)</span>
                  <span>•</span>
                  <span>Starting at ${invitedPro.startingPrice}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">Responds {invitedPro.responseTime.toLowerCase()}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/browse-pros/${invitedPro.id}`}
              className="text-xs font-semibold text-primary hover:underline shrink-0 self-start sm:self-auto"
            >
              View Full Profile →
            </Link>
          </div>
        </Card>
      ) : null}

      {/* 2. Thumbtack Visual Step Progress Bar */}
      <div className="rounded-[20px] border border-line/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 text-xs">
          <span className="font-display font-bold text-title text-sm">
            Step {step} of 5: <span className="text-primary">{STEPS[step - 1].label}</span>
          </span>
          <span className="font-medium text-muted">{Math.round((step / 5) * 100)}% Completed</span>
        </div>

        {/* Animated Progress Track */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-smoke">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Indicator Pills */}
        <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2">
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
                  "flex items-center justify-center gap-1.5 rounded-xl py-2 px-1 text-xs font-semibold transition-all",
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
                <span className="hidden sm:inline">{s.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main 2-Column Responsive Layout: Wizard (Left) & Sticky Summary (Right) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (8 cols on lg): The Active Step Card */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="rounded-[22px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
            {/* STEP 1: SERVICE & SCOPE */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="border-b border-line/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-title">
                    What service or repair do you need?
                  </h2>
                  <p className="mt-1 text-xs text-[#757575]">
                    Select your trade and pick from common scopes to quickly specify your project.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_1.5fr]">
                  <Field label="Trade Category *">
                    <NativeSelect
                      value={categorySlug}
                      onChange={(e) => {
                        setCategorySlug(e.target.value);
                      }}
                      className="rounded-xl"
                    >
                      {categories.map((item) => (
                        <option key={item.id} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>

                  <Field label="Project Headline *" hint="Brief, specific summary">
                    <TextField
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      placeholder="e.g. Kitchen sink faucet leaking under cabinet"
                      required
                      className="rounded-xl"
                    />
                  </Field>
                </div>

                {/* Common Issue Quick-Scope Chips */}
                {categoryIntakeGuide[categorySlug]?.commonIssues && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                      <Wrench className="h-3.5 w-3.5" />
                      <span>Popular {selectedCategory.name} Scopes (Click to prefill)</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {categoryIntakeGuide[categorySlug].commonIssues.map((issue) => (
                        <button
                          key={issue}
                          type="button"
                          onClick={() => {
                            setTitleInput(issue);
                            if (!descriptionInput || descriptionInput.length < 20) {
                              setDescriptionInput(
                                `Need certified ${selectedCategory.name.toLowerCase()} service for ${issue.toLowerCase()}. Please inspect, test, and provide an itemized quote with labor and materials included.`,
                              );
                            }
                          }}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs font-medium transition text-left",
                            titleInput === issue
                              ? "border-primary bg-primary text-white shadow-xs"
                              : "border-line bg-white text-copy hover:border-primary/50 hover:bg-smoke",
                          )}
                        >
                          + {issue}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Field
                  label="Detailed Work Description *"
                  hint="Mention symptoms, when it started, brand/model, or access notes"
                >
                  <TextArea
                    value={descriptionInput}
                    onChange={(e) => setDescriptionInput(e.target.value)}
                    placeholder="Provide additional details so contractors can give you an accurate, itemized quote upfront…"
                    className="min-h-[120px] rounded-xl text-sm"
                    rows={4}
                    required
                  />
                </Field>
              </div>
            )}

            {/* STEP 2: SCHEDULE & TIMING */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-line/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-title">
                    When would you like this done?
                  </h2>
                  <p className="mt-1 text-xs text-[#757575]">
                    Thumbtack-grade scheduling matches contractors with matching calendar openings.
                  </p>
                </div>

                {/* Visual Urgency Selection Cards */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      {
                        id: "asap",
                        title: "Urgent (ASAP / Emergency)",
                        desc: "Need immediate dispatch or same-day service call",
                        icon: Zap,
                        badge: "Urgent Dispatch",
                        badgeClass: "bg-red-50 text-red-700 border-red-200",
                      },
                      {
                        id: "this_week",
                        title: "Within 48 Hours",
                        desc: "Next 1 to 2 business days; flexible on exact time",
                        icon: Calendar,
                        badge: "Most Popular",
                        badgeClass: "bg-blue-50 text-primary border-blue-200",
                      },
                      {
                        id: "two_weeks",
                        title: "This Week / Next Week",
                        desc: "Within the next 7 to 10 days at regular standard rates",
                        icon: Clock,
                      },
                      {
                        id: "flexible",
                        title: "Flexible Schedule",
                        desc: "Planning ahead / gathering estimates without rush",
                        icon: CalendarCheck,
                      },
                    ] as const
                  ).map((item) => {
                    const active = urgency === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setUrgency(item.id)}
                        className={cn(
                          "flex flex-col text-left rounded-2xl border p-4 transition-all relative",
                          active
                            ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs"
                            : "border-line bg-white hover:border-primary/40 hover:bg-smoke/40",
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={cn(
                              "grid h-9 w-9 place-items-center rounded-xl transition-colors",
                              active ? "bg-primary text-white" : "bg-smoke text-primary",
                            )}
                          >
                            <Icon className="h-4.5 w-4.5" />
                          </span>
                          {"badge" in item && item.badge && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-bold border",
                                item.badgeClass,
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="font-display text-sm font-bold text-title">{item.title}</span>
                        <span className="mt-1 text-xs text-muted leading-relaxed">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Preferred Time-of-Day Window */}
                <div className="space-y-2 pt-2">
                  <label className="block font-display text-xs font-bold uppercase tracking-wider text-muted">
                    Preferred Arrival Window
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "morning", label: "Morning", sub: "8 AM – 12 PM", icon: Sunrise },
                      { id: "afternoon", label: "Afternoon", sub: "12 PM – 5 PM", icon: Sun },
                      { id: "evening", label: "Evening", sub: "5 PM – 8 PM", icon: Sunset },
                      { id: "flexible", label: "Anytime", sub: "Pro selects slot", icon: Clock },
                    ].map((w) => {
                      const active = timeWindow === w.id;
                      const Icon = w.icon;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setTimeWindow(w.id)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all",
                            active
                              ? "border-primary bg-primary text-white shadow-xs font-semibold"
                              : "border-line bg-white text-copy hover:border-primary/40 hover:bg-smoke",
                          )}
                        >
                          <Icon className={cn("h-4 w-4 mb-1", active ? "text-white" : "text-primary")} />
                          <span className="text-xs font-bold">{w.label}</span>
                          <span className={cn("text-[10px]", active ? "text-white/80" : "text-muted")}>
                            {w.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PROPERTY & MATERIALS */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-line/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-title">
                    Property Type &amp; Materials
                  </h2>
                  <p className="mt-1 text-xs text-[#757575]">
                    Helps contractors bring the right tools, ladders, and vehicle stock.
                  </p>
                </div>

                {/* Property Type Grid */}
                <div className="space-y-2">
                  <label className="block font-display text-xs font-bold uppercase tracking-wider text-muted">
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "single_family", label: "Single-Family", desc: "Detached home", icon: Home },
                      { id: "condo", label: "Condo / Townhome", desc: "Attached HOA", icon: Building },
                      { id: "apartment", label: "Apartment", desc: "Multi-unit rental", icon: Building2 },
                      { id: "commercial", label: "Commercial", desc: "Business / Office", icon: Store },
                    ].map((p) => {
                      const active = propertyType === p.id;
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPropertyType(p.id as PropertyType)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all",
                            active
                              ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs text-primary"
                              : "border-line bg-white text-title hover:border-primary/40 hover:bg-smoke",
                          )}
                        >
                          <Icon className={cn("h-5 w-5 mb-1.5", active ? "text-primary" : "text-muted")} />
                          <span className="font-display text-xs font-bold">{p.label}</span>
                          <span className="text-[10px] text-muted">{p.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Parts & Materials Preference */}
                <div className="space-y-2 pt-2">
                  <label className="block font-display text-xs font-bold uppercase tracking-wider text-muted">
                    Parts &amp; Materials Status
                  </label>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {[
                      {
                        id: "pro_supplies",
                        title: "Contractor Supplies Parts",
                        desc: "Pro brings certified parts & warranties work (Recommended)",
                        icon: Truck,
                      },
                      {
                        id: "homeowner_supplies",
                        title: "I Have Materials On-Site",
                        desc: "I already purchased replacement fixtures / hardware",
                        icon: PackageCheck,
                      },
                      {
                        id: "needs_consultation",
                        title: "Need Diagnostic First",
                        desc: "Inspect on-site first, then advise on part purchases",
                        icon: Wrench,
                      },
                    ].map((m) => {
                      const active = materialsStatus === m.id;
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setMaterialsStatus(m.id)}
                          className={cn(
                            "flex flex-col text-left p-3.5 rounded-2xl border transition-all",
                            active
                              ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs"
                              : "border-line bg-white hover:border-primary/40 hover:bg-smoke",
                          )}
                        >
                          <Icon className={cn("h-5 w-5 mb-2", active ? "text-primary" : "text-muted")} />
                          <span className="font-display text-xs font-bold text-title">{m.title}</span>
                          <span className="mt-1 text-[11px] text-muted leading-relaxed">{m.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Budget (Optional) */}
                <div className="space-y-2 pt-2">
                  <label className="block font-display text-xs font-bold uppercase tracking-wider text-muted">
                    Estimated Budget Range (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "",
                      "Under $250",
                      "$250 – $500",
                      "$500 – $1,200",
                      "$1,200 – $3,000",
                      "$3,000+",
                    ].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                          budget === b
                            ? "border-primary bg-primary text-white shadow-xs"
                            : "border-line bg-white text-title hover:border-primary/40 hover:bg-smoke",
                        )}
                      >
                        {b || "Not specified / Open to bids"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: LOCATION & PHOTOS */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-line/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-title">
                    Service Address &amp; Project Photos
                  </h2>
                  <p className="mt-1 text-xs text-[#757575]">
                    Pros verify service area and inspect site conditions before dispatching.
                  </p>
                </div>

                {/* Address Selection */}
                <div className="space-y-2">
                  <label className="block font-display text-xs font-bold uppercase tracking-wider text-muted">
                    Service Property Location
                  </label>
                  {addresses.length > 0 ? (
                    <div className="grid gap-2.5 sm:grid-cols-2">
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
                              "flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all",
                              active
                                ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20 shadow-xs"
                                : "border-line bg-white hover:border-primary/40 hover:bg-smoke",
                            )}
                          >
                            <MapPin className={cn("h-4 w-4 mt-0.5 shrink-0", active ? "text-primary" : "text-muted")} />
                            <div className="min-w-0">
                              <span className="font-display text-xs font-bold text-title block truncate">
                                {addr.label}
                              </span>
                              <span className="text-xs text-muted block truncate">
                                {addr.street}, {addr.city}, {addr.state} {addr.zip}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="max-w-xs pt-1">
                    <Field label="Service ZIP Code *" hint="Used for travel radius matching">
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

                {/* Project Photos Drag/Drop */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-display text-xs font-bold uppercase tracking-wider text-muted">
                      Attach Photos (Optional)
                    </label>
                    <span className="text-xs text-muted">{photoUrls.length} / 4 uploaded</span>
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={onPhotos}
                    className="sr-only"
                  />

                  <div className="flex flex-wrap gap-3">
                    {photoUrls.map((src, index) => (
                      <div
                        key={src.slice(0, 48)}
                        className="relative h-24 w-24 overflow-hidden rounded-2xl border border-line shadow-xs group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="Uploaded site photo" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          aria-label="Remove photo"
                          onClick={() => removePhoto(index)}
                          className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-title/85 text-white transition hover:bg-error"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}

                    {photoUrls.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex h-24 w-28 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-line bg-smoke/60 text-muted transition hover:border-primary hover:text-primary hover:bg-primary/[0.02]"
                      >
                        <ImagePlus className="h-6 w-6" />
                        <span className="text-xs font-semibold">+ Add Photos</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11.5px] text-[#757575] leading-relaxed">
                    Photos help contractors estimate required parts in advance and eliminate unexpected arrival surprises.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & INSTANT BOOKING DISPATCH */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-line/60 pb-3">
                  <h2 className="font-display text-xl font-bold text-title">
                    Review &amp; Confirm Work Order
                  </h2>
                  <p className="mt-1 text-xs text-[#757575]">
                    Double-check your service scope before dispatching to vetted contractors.
                  </p>
                </div>

                {/* Summary Table Card */}
                <div className="rounded-2xl border border-line/80 bg-surface/40 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-line/60 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Service Scope
                      </span>
                      <p className="font-display text-base font-bold text-title mt-0.5">
                        {titleInput}
                      </p>
                      <p className="text-xs text-muted line-clamp-2 mt-0.5">{descriptionInput}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-primary hover:underline shrink-0"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-line/60 pb-3">
                    <div>
                      <span className="text-muted block">Trade</span>
                      <span className="font-semibold text-title">{selectedCategory.name}</span>
                    </div>
                    <div>
                      <span className="text-muted block">Schedule</span>
                      <span className="font-semibold text-title capitalize">
                        {urgency.replace("_", " ")} ({timeWindow})
                      </span>
                    </div>
                    <div>
                      <span className="text-muted block">Property</span>
                      <span className="font-semibold text-title capitalize">
                        {propertyType.replace("_", " ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted block">Location</span>
                      <span className="font-semibold text-title">{zipInput} (Austin)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-muted">Materials: </span>
                      <span className="font-medium text-title">
                        {materialsStatus === "pro_supplies"
                          ? "Contractor Supplies All Parts"
                          : materialsStatus === "homeowner_supplies"
                            ? "Homeowner Supplies On-Site"
                            : "Diagnostic & Advice Needed"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Thumbtack Local Price Benchmark Meter */}
                <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-blue-50/60 to-surface p-4 flex items-start gap-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-display text-sm font-bold text-title">
                      Typical Market Cost for {selectedCategory.name} in Austin:
                    </p>
                    <p className="mt-0.5 font-semibold text-primary">
                      {categoryIntakeGuide[categorySlug]?.typicalRange ?? "$100 – $300 standard local average"}
                    </p>
                    <p className="mt-1 text-muted leading-relaxed">
                      Zero platform markup. You review quotes and pay the contractor directly upon 100% completion.
                    </p>
                  </div>
                </div>

                {/* Direct Pro Guarantee */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950">
                    <p className="font-bold">Protected by the LocalHomeFix Guarantee</p>
                    <p className="mt-0.5 text-emerald-900/80 leading-relaxed">
                      Every professional is verified and background-checked. Up to $1,000 property &amp; workmanship coverage on every approved job.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-error border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Wizard Navigation Footer */}
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

              {step < 5 ? (
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
                    ? `Confirm & Send to ${invitedPro.name}`
                    : "Confirm & Dispatch Request"}
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols on lg): Live Sticky Booking Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <Card className="rounded-[22px] border border-line/80 bg-white p-5 shadow-xs space-y-4">
            <h3 className="font-display text-sm font-bold text-title uppercase tracking-wider text-muted">
              Booking Summary
            </h3>

            {/* Invited Contractor Card if Present */}
            {invitedPro ? (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-white font-bold font-display text-sm">
                    {initials(invitedPro.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-title truncate">
                      {invitedPro.name}
                    </p>
                    <p className="text-xs text-muted truncate">{invitedPro.trade} • {invitedPro.city}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-primary/10">
                  <span className="text-muted">Starting rate:</span>
                  <span className="font-display font-bold text-title">${invitedPro.startingPrice}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-line bg-smoke/60 p-3 text-xs space-y-1">
                <p className="font-bold text-title">Broadcast Mode</p>
                <p className="text-muted">
                  Sending to top-rated, reviewed specialists in {zipInput} (Austin area).
                </p>
              </div>
            )}

            {/* Live Parameter Checklist */}
            <div className="space-y-2 pt-2 border-t border-line/60 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted">Service Trade:</span>
                <span className="font-semibold text-title">{selectedCategory.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Schedule:</span>
                <span className="font-semibold text-title capitalize">
                  {urgency.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Property:</span>
                <span className="font-semibold text-title capitalize">
                  {propertyType.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Service Location:</span>
                <span className="font-semibold text-title font-mono">{zipInput}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Attached Photos:</span>
                <span className="font-semibold text-title">{photoUrls.length} files</span>
              </div>
            </div>

            {/* Thumbtack Trust Strip */}
            <div className="space-y-2 pt-3 border-t border-line/60 text-[11.5px] text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>$1,000 Property &amp; Workmanship Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary shrink-0" />
                <span>100% Direct Pay • $0 Platform Markup</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Average Quote Response: ~15 mins</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
