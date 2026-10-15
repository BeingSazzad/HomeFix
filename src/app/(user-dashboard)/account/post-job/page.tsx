"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { categories } from "@/Mockdata";
import { postRequiredHints } from "@/lib/product-model";
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
  const [error, setError] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  function onPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])].slice(0, 4);
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
        body: `${title} near ${zip} is on the job board for matching reviewed pros.`,
        href: `/pro/jobs/${jobId}`,
        createdAt: "Just now",
        role: "pro",
      }),
    );
    dispatch(
      addNotification({
        title: "Request posted",
        body: "Your job is live in Your requests. Matching pros can quote after membership.",
        href: `/account/jobs/${jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );
    dispatch(clearDraft());
    router.push(`/account/jobs/${jobId}?posted=1`);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[28px]">Post a request</h1>
        <p className="mt-1 text-sm text-copy">
          Free. Opens in Your requests and on matching pros’ job board — not the public site.
        </p>
      </div>

      {draft.summary ? (
        <Card className="bg-smoke">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-primary">Saved draft from homepage</p>
          <p className="mt-1 font-display font-bold">{draft.title}</p>
          <p className="mt-1 text-sm text-copy">{draft.summary}</p>
        </Card>
      ) : null}

      <Card>
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Title *" hint={postRequiredHints.title}>
            <TextField name="title" defaultValue={draft.title} placeholder="Kitchen sink leak" required />
          </Field>
          <Field label="Category *" hint={postRequiredHints.category}>
            <NativeSelect name="category" defaultValue={draft.categorySlug || "plumbing"}>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Description *" hint={postRequiredHints.description}>
            <TextArea
              name="description"
              defaultValue={draft.problem}
              placeholder="What needs fixing, where it is, and anything a pro should know."
              required
            />
          </Field>
          <Field label="Photos (optional)" hint={postRequiredHints.photos}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={onPhotos}
              className="block w-full text-sm text-copy"
            />
            <p className="mt-1 text-[12px] text-muted">Up to 4 images.</p>
            {photoUrls.length ? (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {photoUrls.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src.slice(0, 40)} src={src} alt="" className="h-20 w-full rounded-[10px] object-cover" />
                ))}
              </div>
            ) : null}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ZIP *" hint={postRequiredHints.zip}>
              <TextField name="zip" defaultValue={draft.zip || user?.zip || addresses[0]?.zip} required />
            </Field>
            <Field label="Saved address (optional)">
              <NativeSelect name="addressId" defaultValue="">
                <option value="">ZIP only — street stays private until contact unlock</option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.label} — {addr.street}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Timing *" hint={postRequiredHints.urgency}>
              <NativeSelect name="urgency" defaultValue="flexible">
                <option value="asap">Urgent</option>
                <option value="this_week">This week</option>
                <option value="two_weeks">Within 2 weeks</option>
                <option value="flexible">Flexible</option>
              </NativeSelect>
            </Field>
            <Field label="Budget (optional)" hint={postRequiredHints.budget}>
              <NativeSelect name="budget" defaultValue="">
                <option value="">Not specified</option>
                <option>Under $500</option>
                <option>$500–$1,000</option>
                <option>$1,000–$5,000</option>
                <option>$5,000+</option>
              </NativeSelect>
            </Field>
            <Field label="Property type (optional)" hint={postRequiredHints.propertyType}>
              <NativeSelect name="propertyType" defaultValue="">
                <option value="">Not specified</option>
                <option value="single_family">Single-family home</option>
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
