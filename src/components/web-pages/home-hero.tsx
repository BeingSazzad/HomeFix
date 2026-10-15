"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { photos } from "@/lib/media";
import { categories } from "@/Mockdata";
import { saveDraft } from "@/redux/slices/intakeSlice";
import { useAppDispatch } from "@/redux/hooks";

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
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a valid 5-digit U.S. ZIP code.");
      return;
    }
    setError("");
    const draft = buildDraft(problem.trim(), categorySlug, zip);
    setPreview(draft);
    dispatch(saveDraft(draft));
  }

  return (
    <section className="relative min-h-[620px] overflow-hidden bg-title text-white md:min-h-[740px]">
      <div
        className="absolute inset-0 bg-cover bg-[center_20%]"
        style={{ backgroundImage: `url(${photos.hero})` }}
      />
      <div className="hero-wash absolute inset-0" />

      <div className="container-site relative grid min-h-[620px] items-center gap-10 py-20 md:min-h-[740px] lg:grid-cols-[1.1fr_0.9fr] lg:py-[140px]">
        <div className="max-w-xl">
          <p className="mb-4 font-display text-[13px] font-bold uppercase tracking-[0.18em] text-white/70">
            Local home repair
          </p>
          <h1 className="text-[40px] leading-[1.1] text-white md:text-[56px]">
            Start with what needs fixing.
          </h1>
          <p className="mt-5 max-w-md text-[16px] leading-7 text-white/78">
            Describe the job. Compare cleared locals. Keep quotes and messages on one request.
          </p>
          <div className="mt-8">
            <Button href="/browse-pros" variant="white" size="lg">
              Find a pro
            </Button>
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-6 text-title soft-shadow md:p-8">
          <p className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-primary">
            Start a request
          </p>
          <h2 className="mt-2 text-[24px] leading-tight">Nothing posts until you create an account.</h2>
          <div className="mt-5 space-y-3">
            <Field label="What is going on?">
              <TextArea
                value={problem}
                onChange={(event) => setProblem(event.target.value)}
                placeholder="Water is leaking under my kitchen sink when the faucet runs."
                className="min-h-[88px]"
                rows={3}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Service (optional)">
                <NativeSelect value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)}>
                  <option value="">Unsure — that’s fine</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="ZIP code">
                <TextField
                  value={zip}
                  onChange={(event) => setZip(event.target.value)}
                  placeholder="78701"
                  inputMode="numeric"
                />
              </Field>
            </div>
            <Button type="button" className="w-full" onClick={summarize}>
              Get summary
            </Button>
            {error ? <p className="text-sm text-error">{error}</p> : null}
            {preview ? (
              <div className="rounded-[14px] bg-smoke p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {suggested ? `Suggested: ${suggested.name}` : "Draft ready"}
                </p>
                <p className="mt-2 font-display text-lg font-bold text-title">{preview.title}</p>
                <p className="mt-1 text-sm leading-6 text-copy">{preview.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" href="/signup">
                    Continue to post
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    href={`/browse-pros?category=${preview.categorySlug}&zip=${preview.zip}`}
                  >
                    Browse matching pros
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
