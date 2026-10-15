"use client";

import { useMemo, useState } from "react";
import { ClipboardList, MapPin, Star, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { photos } from "@/lib/media";
import { categories } from "@/Mockdata";
import { saveDraft } from "@/redux/slices/intakeSlice";
import { useAppDispatch } from "@/redux/hooks";
import { cn } from "@/lib/cn";

const trustFaces = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80",
];

function buildDraft(problem: string, categorySlug: string, zip: string) {
  const guessed =
    categorySlug ||
    (problem.toLowerCase().includes("leak") || problem.toLowerCase().includes("sink")
      ? "plumbing"
      : "");
  const match = categories.find((item) => item.slug === guessed);
  return {
    problem,
    categorySlug: guessed,
    zip,
    title: match ? `${match.name} help needed` : "Home repair request",
    summary: problem,
    followUps: [
      "What type of property is this?",
      "Are there access details the professional should know?",
      "Which days or times work best?",
      "Can you add photos of the affected area?",
    ],
  };
}

export function HomeHero() {
  const dispatch = useAppDispatch();
  const [problem, setProblem] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<ReturnType<typeof buildDraft> | null>(null);

  const suggested = useMemo(
    () => categories.find((item) => item.slug === preview?.categorySlug),
    [preview],
  );

  function summarize() {
    if (problem.trim().length < 10) {
      setError("Describe the problem in at least 10 characters.");
      return;
    }
    if (zip.trim().length < 2) {
      setError("Enter a ZIP or city.");
      return;
    }
    setError("");
    const draft = buildDraft(problem.trim(), categorySlug, zip.trim());
    setPreview(draft);
    dispatch(saveDraft(draft));
  }

  return (
    <section className="relative min-h-[620px] overflow-hidden bg-title text-white md:min-h-[680px]">
      <div
        className="absolute inset-0 bg-cover bg-[center_20%]"
        style={{ backgroundImage: `url(${photos.hero})` }}
      />
      <div className="hero-wash absolute inset-0 z-[1]" />

      <div className="container-site relative z-[2] grid min-h-[620px] items-center gap-8 py-14 md:min-h-[680px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-20">
        <div className="relative z-[1] max-w-xl">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-white">
            Local services
          </span>
          <h1 className="mt-4 text-[36px] leading-[1.12] text-white md:text-[48px] lg:text-[52px]">
            Find trusted local pros for{" "}
            <span className="text-primary-hover">home repairs</span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-white/90">
            Browse free. Post a request when you are ready. Pay the professional directly —
            LocalHomeFix never takes the repair payment.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              {trustFaces.map((src, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={cn(
                    "h-9 w-9 rounded-full border-2 border-white/80 object-cover",
                    index > 0 && "-ml-2.5",
                  )}
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5" aria-label="4.8 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-0.5 text-sm font-semibold text-white">
                4.8/5 from local homeowners
              </p>
            </div>
          </div>

          <div className="mt-7">
            <Button href="/browse-pros" variant="white" size="lg">
              Browse professionals →
            </Button>
          </div>
        </div>

        <div className="relative z-10 rounded-[20px] border border-white/70 bg-white/95 p-5 text-title shadow-[0_28px_64px_color-mix(in_srgb,var(--ink)_32%,transparent),0_8px_24px_color-mix(in_srgb,var(--ink)_14%,transparent)] backdrop-blur-md md:p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-smoke text-primary">
              <ClipboardList className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-[12px] font-bold uppercase tracking-[0.12em] text-primary">
                Start a request
              </p>
              <p className="font-display text-lg font-bold leading-tight text-title">Draft your request</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Field label="What service do you need?">
              <span className="relative block">
                <Wrench className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <NativeSelect
                  value={categorySlug}
                  onChange={(event) => setCategorySlug(event.target.value)}
                  className="pl-9"
                >
                  <option value="">Select a service</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </NativeSelect>
              </span>
            </Field>

            <Field label="Describe the job">
              <TextArea
                value={problem}
                onChange={(event) => setProblem(event.target.value)}
                placeholder="Leak under the kitchen sink…"
                className="min-h-[72px]"
                rows={2}
              />
            </Field>

            <Field label="Location">
              <span className="relative block">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <TextField
                  value={zip}
                  onChange={(event) => setZip(event.target.value)}
                  placeholder="ZIP or city"
                  className="pl-9"
                />
              </span>
            </Field>

            <Button type="button" className="w-full" onClick={summarize}>
              Review my request →
            </Button>
            {error ? <p className="text-sm text-error">{error}</p> : null}
            {preview ? (
              <div className="rounded-[12px] bg-smoke p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {suggested ? `Suggested: ${suggested.name}` : "Draft ready"}
                </p>
                <p className="mt-1 font-display text-sm font-bold text-title">{preview.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" href="/signup?next=%2Faccount%2Fpost-job">
                    Sign up to post
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    href={`/browse-pros?category=${preview.categorySlug}&location=${encodeURIComponent(preview.zip)}`}
                  >
                    Browse pros
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-[12px] text-muted">Nothing posts until you sign up.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
