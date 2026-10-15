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
    <section className="relative min-h-[560px] overflow-hidden bg-title text-white md:min-h-[640px]">
      <div
        className="absolute inset-0 bg-cover bg-[center_20%]"
        style={{ backgroundImage: `url(${photos.hero})` }}
      />
      <div className="hero-wash absolute inset-0" />

      <div className="container-site relative grid min-h-[560px] items-center gap-8 py-16 md:min-h-[640px] lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="max-w-xl">
          <p className="mb-3 font-display text-[12px] font-bold uppercase tracking-[0.18em] text-white/70">
            Local home repair
          </p>
          <h1 className="text-[36px] leading-[1.1] text-white md:text-[52px]">
            Start with what needs fixing.
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-6 text-white/78">
            Browse free. Post when ready. Pay the pro directly.
          </p>
          <div className="mt-6">
            <Button href="/browse-pros" variant="white" size="lg">
              Find a pro
            </Button>
          </div>
        </div>

        <div className="rounded-[20px] bg-white p-5 text-title soft-shadow md:p-7">
          <p className="font-display text-[12px] font-bold uppercase tracking-[0.16em] text-primary">
            Start a request
          </p>
          <h2 className="mt-2 text-[22px] leading-tight">Draft your request</h2>
          <p className="mt-1 text-sm text-copy">Nothing posts until you sign up.</p>
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
              <Field label="Location">
                <TextField
                  value={zip}
                  onChange={(event) => setZip(event.target.value)}
                  placeholder="ZIP or city"
                />
              </Field>
            </div>
            <Button type="button" className="w-full" onClick={summarize}>
              Preview my request
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
                  <Button size="sm" href="/signup?next=%2Faccount%2Fpost-job">
                    Sign up to post
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    href={`/browse-pros?category=${preview.categorySlug}&location=${encodeURIComponent(preview.zip)}`}
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
