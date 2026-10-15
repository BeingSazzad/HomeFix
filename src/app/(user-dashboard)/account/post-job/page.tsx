"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { categories } from "@/Mockdata";
import { clearDraft } from "@/redux/slices/intakeSlice";
import { addJob } from "@/redux/slices/marketplaceSlice";
import { addNotification, setJobPhotos } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { PropertyType, Urgency } from "@/types";

export default function PostJobPage() {
  const draft = useAppSelector((state) => state.intake.draft);
  const user = useAppSelector((state) => state.auth.user);
  const addresses = useAppSelector((state) => state.features.addresses);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

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
    const categorySlug = String(data.get("category") ?? "plumbing");
    if (title.length < 4) {
      setError("Add a short title (at least 4 characters).");
      return;
    }
    if (description.length < 12) {
      setError("Describe the work in a bit more detail.");
      return;
    }
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a valid 5-digit ZIP.");
      return;
    }
    setError("");
    const jobId = `job-local-${Date.now()}`;
    const selectedAddress = addresses.find((item) => item.id === String(data.get("addressId") ?? ""));
    dispatch(
      addJob({
        id: jobId,
        title,
        categorySlug,
        description,
        zip,
        city: selectedAddress?.city || user?.city || "Austin",
        state: selectedAddress?.state || user?.state || "TX",
        urgency: String(data.get("urgency") ?? "flexible") as Urgency,
        budget: String(data.get("budget") ?? "") || undefined,
        propertyType: (String(data.get("propertyType") ?? "") || undefined) as PropertyType | "",
        homeownerName: user?.name ?? "Homeowner",
      }),
    );
    if (photoUrls.length) dispatch(setJobPhotos({ jobId, photos: photoUrls }));
    dispatch(
      addNotification({
        title: "New open request",
        body: `${title} near ${zip} is on the job board.`,
        href: `/pro/jobs/${jobId}`,
        createdAt: "Just now",
        role: "pro",
      }),
    );
    dispatch(
      addNotification({
        title: "Request posted",
        body: "Live in Your requests. Matching pros can quote.",
        href: `/account/jobs/${jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );
    dispatch(clearDraft());
    router.push(`/account/jobs/${jobId}?posted=1`);
  }

  return (
    <div className="space-y-3">
      {draft.summary ? (
        <Card className="bg-smoke p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Homepage draft</p>
          <p className="mt-1 font-display text-sm font-bold">{draft.title}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-copy">{draft.summary}</p>
        </Card>
      ) : null}

      <Card className="p-4 md:p-5">
        <div className="mb-4 border-b border-line pb-3">
          <h1 className="text-[22px] md:text-[24px]">Post a request</h1>
          <p className="mt-0.5 text-sm text-copy">Free · private · not on the public site</p>
        </div>
        <form className="space-y-3" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr]">
            <Field label="Title *">
              <TextField name="title" defaultValue={draft.title} placeholder="Kitchen sink leak" required />
            </Field>
            <Field label="Category *">
              <NativeSelect name="category" defaultValue={draft.categorySlug || "plumbing"}>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </div>

          <Field label="Description *">
            <TextArea
              name="description"
              defaultValue={draft.problem}
              placeholder="What’s broken, where it is, access notes…"
              required
              className="min-h-[88px]"
              rows={3}
            />
          </Field>

          <div>
            <p className="mb-1.5 font-display text-sm font-semibold text-title">Photos (optional)</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={onPhotos}
              className="sr-only"
            />
            <div className="flex flex-wrap gap-2">
              {photoUrls.map((src, index) => (
                <div
                  key={src.slice(0, 48)}
                  className="relative h-20 w-20 overflow-hidden rounded-[10px] border border-line"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => removePhoto(index)}
                    className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-title/80 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {photoUrls.length < 4 ? (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-0.5 rounded-[10px] border border-dashed border-line bg-smoke text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-[11px] font-medium">Add</span>
                </button>
              ) : null}
            </div>
            <p className="mt-1.5 text-[12px] text-muted">Up to 4 photos · JPG, PNG, WebP</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="ZIP *">
              <TextField name="zip" defaultValue={draft.zip || user?.zip || addresses[0]?.zip} required />
            </Field>
            <Field label="Address (optional)">
              <NativeSelect name="addressId" defaultValue="">
                <option value="">ZIP only</option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.label} — {addr.street}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Timing *">
              <NativeSelect name="urgency" defaultValue="flexible">
                <option value="asap">Urgent</option>
                <option value="this_week">This week</option>
                <option value="two_weeks">Within 2 weeks</option>
                <option value="flexible">Flexible</option>
              </NativeSelect>
            </Field>
            <Field label="Budget">
              <NativeSelect name="budget" defaultValue="">
                <option value="">Not specified</option>
                <option>Under $500</option>
                <option>$500–$1,000</option>
                <option>$1,000–$5,000</option>
                <option>$5,000+</option>
              </NativeSelect>
            </Field>
            <Field label="Property type">
              <NativeSelect name="propertyType" defaultValue="">
                <option value="">Not specified</option>
                <option value="single_family">Single-family</option>
                <option value="condo">Condo</option>
                <option value="townhome">Townhome</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
              </NativeSelect>
            </Field>
          </div>

          {error ? <p className="text-sm text-error">{error}</p> : null}
          <Button type="submit">Post request</Button>
        </form>
      </Card>
    </div>
  );
}
