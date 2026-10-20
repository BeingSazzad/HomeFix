"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
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
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function PostJobPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[20px] border border-line/80 bg-white p-8 text-center">
          <p className="text-sm text-muted">Loading request form…</p>
        </div>
      }
    >
      <PostJobForm />
    </Suspense>
  );
}

function PostJobForm() {
  const searchParams = useSearchParams();
  const inviteId = searchParams.get("invite");
  const invitedPro = inviteId ? getPro(inviteId) : null;

  const draft = useAppSelector((state) => state.intake.draft);
  const user = useAppSelector((state) => state.auth.user);
  const addresses = useAppSelector((state) => state.features.addresses);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [categorySlug, setCategorySlug] = useState(
    invitedPro?.categorySlug ?? draft.categorySlug ?? "plumbing",
  );
  const [titleInput, setTitleInput] = useState(draft.title || "");
  const [descriptionInput, setDescriptionInput] = useState(draft.problem || "");

  // Default address matching user's primary street or first saved address
  const defaultAddressId =
    addresses.find(
      (a) =>
        user?.street && a.street.trim().toLowerCase() === user.street.trim().toLowerCase(),
    )?.id ||
    addresses[0]?.id ||
    "";

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

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const zip = String(data.get("zip") ?? "").trim();
    const categorySlug = String(
      data.get("category") ?? invitedPro?.categorySlug ?? draft.categorySlug ?? "plumbing",
    );

    if (title.length < 4) {
      setError("Please add a concise title (at least 4 characters).");
      return;
    }
    if (description.length < 12) {
      setError("Please describe the work in a bit more detail (at least 12 characters).");
      return;
    }
    if (!/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    setError("");
    const jobId = `job-local-${Date.now()}`;
    const selectedAddress = addresses.find(
      (item) => item.id === String(data.get("addressId") ?? ""),
    );

    const materialsStatus = String(data.get("materialsStatus") ?? "");
    const materialsLabel =
      materialsStatus === "homeowner_supplies"
        ? "Homeowner has parts on-site"
        : materialsStatus === "needs_consultation"
          ? "Diagnostic & recommendation needed before purchasing"
          : "Contractor should supply parts & materials";
    const enhancedDescription = `${description}\n\n[Scope & Inventory: ${materialsLabel}]`;

    dispatch(
      addJob({
        id: jobId,
        title,
        categorySlug,
        description: enhancedDescription,
        zip,
        city: selectedAddress?.city || user?.city || "",
        state: selectedAddress?.state || user?.state || "",
        urgency: String(data.get("urgency") ?? "flexible") as Urgency,
        budget: String(data.get("budget") ?? "") || undefined,
        propertyType: (String(data.get("propertyType") ?? "") || undefined) as PropertyType | "",
        homeownerName: user?.name ?? "Homeowner",
      }),
    );

    if (photoUrls.length) {
      dispatch(setJobPhotos({ jobId, photos: photoUrls }));
    }

    // Connect invited pro if came through direct quote button
    if (invitedPro) {
      dispatch(invitePro({ jobId, proId: invitedPro.id }));
      dispatch(
        addNotification({
          title: "Direct quote request",
          body: `${user?.name ?? "A homeowner"} sent you a private quote request for "${title}".`,
          href: `/pro/jobs/${jobId}`,
          createdAt: "Just now",
          role: "pro",
        }),
      );
    } else {
      // General job board broadcast notification
      dispatch(
        addNotification({
          title: "New open request",
          body: `${title} near ${zip} is open for bidding on the job board.`,
          href: `/pro/jobs/${jobId}`,
          createdAt: "Just now",
          role: "pro",
        }),
      );
    }

    // Homeowner notification
    dispatch(
      addNotification({
        title: "Request posted",
        body: invitedPro
          ? `Sent directly to ${invitedPro.businessName}. You'll be notified when their estimate arrives.`
          : "Live in Your Requests. Matching vetted pros will send itemized quotes.",
        href: `/account/jobs/${jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );

    dispatch(clearDraft());
    router.push(`/account/jobs/${jobId}?posted=1`);
  }

  return (
    <div className="space-y-6">
      {/* 1. Invited Contractor Callout Banner (If arrived via direct quote) */}
      {invitedPro ? (
        <Card className="rounded-[20px] border border-primary/30 bg-primary/[0.03] p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] bg-gradient-to-br from-primary to-blue-600 font-display text-lg font-bold text-white shadow-xs">
                {initials(invitedPro.name)}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3 w-3" />
                    Direct Request
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Pro
                  </span>
                </div>
                <h2 className="font-display text-[17px] font-bold text-title">
                  {invitedPro.businessName} ({invitedPro.name})
                </h2>
                <p className="text-xs text-muted">
                  Starting from ${invitedPro.startingPrice} · Responds {invitedPro.responseTime.toLowerCase()}
                </p>
              </div>
            </div>

            <Link
              href={`/browse-pros/${invitedPro.id}`}
              className="text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
            >
              View profile →
            </Link>
          </div>
        </Card>
      ) : null}

      {/* 2. Homepage Draft Banner if intake exists */}
      {!invitedPro && draft.summary ? (
        <Card className="rounded-[18px] bg-smoke p-4 border border-line/60">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            Draft imported from search
          </p>
          <p className="mt-1 font-display text-sm font-bold text-title">{draft.title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-copy">{draft.summary}</p>
        </Card>
      ) : null}

      {/* 3. Main Request Form Card */}
      <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
        <div className="mb-6 border-b border-line/60 pb-4">
          <h1 className="font-display text-[22px] font-bold text-title md:text-[25px]">
            {invitedPro ? `Request Quote from ${invitedPro.businessName}` : "Post a Service Request"}
          </h1>
          <p className="mt-1 text-xs text-muted">
            {invitedPro
              ? "Share your project details so they can send you a clear, itemized quote."
              : "Free to post · No hidden platform fees · Receive quotes from verified local pros."}
          </p>
        </div>

        <form className="space-y-6" onSubmit={submit}>
          {/* SECTION 1: PROJECT SCOPE */}
          <div className="space-y-4">
            <h2 className="font-display text-sm font-bold text-title uppercase tracking-wide text-muted">
              1. Project Overview
            </h2>

            <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
              <Field label="Job Title *" hint="Briefly describe what needs to be fixed or installed">
                <TextField
                  name="title"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Kitchen sink faucet leaking under cabinet"
                  required
                />
              </Field>

              <Field label="Service Category *">
                <NativeSelect
                  name="category"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            </div>

            {/* Smart Scope Helper Chips */}
            {categoryIntakeGuide[categorySlug]?.commonIssues ? (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Common {categories.find((c) => c.slug === categorySlug)?.name ?? "project"} scopes (click to autofill):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categoryIntakeGuide[categorySlug].commonIssues.map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      onClick={() => {
                        setTitleInput(issue);
                        if (!descriptionInput || descriptionInput.length < 20) {
                          setDescriptionInput(
                            `Need professional service for ${issue.toLowerCase()}. Please inspect, test, and provide an itemized quote with labor and materials.`,
                          );
                        }
                      }}
                      className="rounded-full bg-smoke/80 border border-line px-2.5 py-1 text-xs text-copy hover:border-primary/50 hover:bg-primary/5 transition text-left"
                    >
                      + {issue}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Local Cost Guidance Banner */}
            <div className="rounded-[14px] bg-gradient-to-r from-blue-50/70 to-surface border border-primary/20 p-3.5 flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <DollarSign className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-title">
                  Estimated Cost Guidance ({categories.find((c) => c.slug === categorySlug)?.name ?? "Service"}):
                </p>
                <p className="mt-0.5 text-copy font-medium">
                  {categoryIntakeGuide[categorySlug]?.typicalRange ?? "Standard local rates apply."}
                </p>
                <p className="mt-0.5 text-muted">
                  {categoryIntakeGuide[categorySlug]?.diagnosticTip}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
              <Field
                label="Work Description *"
                hint="Describe symptoms, locations, fixture brands, or access notes"
              >
                <TextArea
                  name="description"
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  placeholder="Explain what is happening, when it started, and what you would like done…"
                  required
                  className="min-h-[100px]"
                  rows={4}
                />
              </Field>

              <Field
                label="Parts &amp; Materials Status"
                hint="Helps pros prepare their truck inventory"
              >
                <NativeSelect name="materialsStatus" defaultValue="pro_supplies">
                  <option value="pro_supplies">Contractor supplies parts &amp; materials</option>
                  <option value="homeowner_supplies">I already purchased / have parts on-site</option>
                  <option value="needs_consultation">Need contractor diagnostic &amp; recommendation</option>
                </NativeSelect>
              </Field>
            </div>

            {/* Photos */}
            <div>
              <p className="mb-1.5 font-display text-sm font-semibold text-title">
                Project Photos (optional)
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={onPhotos}
                className="sr-only"
              />
              <div className="flex flex-wrap gap-2.5">
                {photoUrls.map((src, index) => (
                  <div
                    key={src.slice(0, 48)}
                    className="relative h-20 w-20 overflow-hidden rounded-[12px] border border-line"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => removePhoto(index)}
                      className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-title/80 text-white transition hover:bg-title"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {photoUrls.length < 4 ? (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-[12px] border border-dashed border-line bg-smoke/70 text-muted transition hover:border-primary hover:text-primary"
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[11px] font-medium">Add Photo</span>
                  </button>
                ) : null}
              </div>
              <p className="mt-1.5 text-xs text-muted">Up to 4 photos · JPG, PNG, or WebP</p>
            </div>
          </div>

          {/* SECTION 2: LOCATION */}
          <div className="space-y-4 pt-4 border-t border-line/60">
            <h2 className="font-display text-sm font-bold text-title uppercase tracking-wide text-muted">
              2. Service Location
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Saved Service Address"
                hint={
                  addresses.length
                    ? "Select one of your saved properties"
                    : "Manage your address in Profile settings"
                }
              >
                <NativeSelect name="addressId" defaultValue={defaultAddressId}>
                  <option value="">ZIP only (Keep street private)</option>
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.label} — {addr.street}, {addr.city}
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <Field label="ZIP Code *" hint="Pros use ZIP to check service radius">
                <TextField
                  name="zip"
                  defaultValue={draft.zip || user?.zip || addresses[0]?.zip || "78701"}
                  placeholder="78701"
                  required
                />
              </Field>
            </div>
          </div>

          {/* SECTION 3: TIMING & PROPERTY */}
          <div className="space-y-4 pt-4 border-t border-line/60">
            <h2 className="font-display text-sm font-bold text-title uppercase tracking-wide text-muted">
              3. Timing &amp; Scope Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="When do you need this? *">
                <NativeSelect name="urgency" defaultValue="this_week">
                  <option value="asap">Urgent (ASAP / Emergency)</option>
                  <option value="this_week">This week</option>
                  <option value="two_weeks">Within 2 weeks</option>
                  <option value="flexible">Flexible / Planning ahead</option>
                </NativeSelect>
              </Field>

              <Field label="Estimated Budget (optional)">
                <NativeSelect name="budget" defaultValue="">
                  <option value="">Not specified</option>
                  <option>Under $300</option>
                  <option>$300–$750</option>
                  <option>$750–$1,500</option>
                  <option>$1,500–$3,500</option>
                  <option>$3,500+</option>
                </NativeSelect>
              </Field>

              <Field label="Property Type (optional)">
                <NativeSelect name="propertyType" defaultValue="single_family">
                  <option value="single_family">Single-family home</option>
                  <option value="condo">Condo</option>
                  <option value="townhome">Townhome</option>
                  <option value="apartment">Apartment</option>
                  <option value="commercial">Commercial property</option>
                  <option value="other">Other</option>
                </NativeSelect>
              </Field>
            </div>
          </div>

          {error ? (
            <p className="rounded-[10px] bg-rose-50 px-4 py-2.5 text-xs font-medium text-error border border-rose-200">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-line/60">
            <Button type="submit" size="md" className="rounded-full">
              {invitedPro ? `Send Request to ${invitedPro.businessName}` : "Post Request"}
            </Button>
            <Button href="/account" variant="ghost" size="md" className="rounded-full">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
