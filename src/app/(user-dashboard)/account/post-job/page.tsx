"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { categories } from "@/Mockdata";
import { useAppSelector } from "@/redux/hooks";

export default function PostJobPage() {
  const draft = useAppSelector((state) => state.intake.draft);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[28px]">Post a request</h1>
        <p className="mt-1 text-sm text-copy">
          Confirm the details. The job is not live until you submit.
        </p>
      </div>
      {draft.summary ? (
        <Card className="bg-smoke">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Saved draft</p>
          <p className="mt-1 font-display font-bold">{draft.title}</p>
          <p className="mt-1 text-sm text-copy">{draft.summary}</p>
        </Card>
      ) : null}
      <Card>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/account");
          }}
        >
          <Field label="Title">
            <TextField defaultValue={draft.title} placeholder="Kitchen sink leak" />
          </Field>
          <Field label="Category">
            <NativeSelect defaultValue={draft.categorySlug}>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Description">
            <TextArea defaultValue={draft.problem} placeholder="Describe the problem or project in detail..." />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="ZIP">
              <TextField defaultValue={draft.zip} />
            </Field>
            <Field label="When do you need this?">
              <NativeSelect defaultValue="flexible">
                <option value="asap">Urgent (ASAP)</option>
                <option value="this_week">This week</option>
                <option value="two_weeks">Within 2 weeks</option>
                <option value="flexible">Flexible</option>
              </NativeSelect>
            </Field>
            <Field label="Budget (optional)">
              <NativeSelect defaultValue="">
                <option value="">Not specified</option>
                <option>Under $500</option>
                <option>$500–$1,000</option>
                <option>$1,000–$5,000</option>
                <option>$5,000+</option>
              </NativeSelect>
            </Field>
            <Field label="Property type (optional)">
              <NativeSelect defaultValue="">
                <option value="">Not specified</option>
                <option value="single_family">Single-family home</option>
                <option value="condo">Condo</option>
                <option value="townhome">Townhome</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
              </NativeSelect>
            </Field>
          </div>
          <Button type="submit">Post request</Button>
        </form>
      </Card>
    </div>
  );
}
