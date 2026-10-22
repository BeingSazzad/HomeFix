"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Steps } from "antd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { AuthLinks } from "@/components/web-pages/auth-links";
import { PasswordField } from "@/components/ui/password-field";
import { categories } from "@/Mockdata";
import { loginAs } from "@/redux/slices/authSlice";
import { saveApplicationDraft, submitApplication } from "@/redux/slices/featuresSlice";
import { useAppDispatch } from "@/redux/hooks";

const steps = ["Account", "Business", "Service area"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessName: string;
  trade: string;
  bio: string;
  serviceZip: string;
  radius: string;
};

const empty: FormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  businessName: "",
  trade: "",
  bio: "",
  serviceZip: "",
  radius: "25",
};

export default function ProRegisterPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  function patch(partial: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function next() {
    setError("");
    if (step < 2) {
      setStep((value) => value + 1);
      return;
    }
    dispatch(
      saveApplicationDraft({
        ...Object.fromEntries(
          Object.entries(form).map(([key, value]) => [key, String(value)]),
        ),
        savedAt: new Date().toISOString(),
      }),
    );
    dispatch(submitApplication());
    dispatch(
      loginAs({
        role: "pro",
        profile: {
          name: form.name.trim() || "Luis Ortega",
          email: form.email.trim() || "pro@localfix.com",
          phone: form.phone.trim() || "(512) 555-0144",
          zip: form.serviceZip.trim() || "78701",
          city: "Austin",
          state: "TX",
        },
      }),
    );
    router.push("/pro/application?applied=1");
  }

  return (
    <Card className="max-w-none">
      <h1 className="font-display text-[22px] sm:text-[24px] font-semibold leading-snug tracking-tight text-title">
        Join as a professional
      </h1>
      <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#666]">
        {step === 0 && "Create your professional account to connect directly with Austin homeowners."}
        {step === 1 && "Tell homeowners about your trade specialty and craftsmanship experience."}
        {step === 2 && "Set your local service territory and service coverage radius."}
      </p>

      <div className="mt-5">
        <Steps current={step} items={steps.map((title) => ({ title }))} size="small" />
      </div>
      <div className="mt-6 space-y-3">
        {step === 0 ? (
          <>
            <Field label="Full name *">
              <TextField value={form.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Joe Smith" />
            </Field>
            <Field label="Work email *">
              <TextField
                type="email"
                value={form.email}
                onChange={(e) => patch({ email: e.target.value })}
                placeholder="joe@business.com"
              />
            </Field>
            <Field label="Business phone *">
              <TextField
                value={form.phone}
                onChange={(e) => patch({ phone: e.target.value })}
                placeholder="(555) 000-0000"
              />
            </Field>
            <Field label="Password *">
              <PasswordField
                value={form.password}
                onChange={(e) => patch({ password: e.target.value })}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </Field>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <Field label="Business name *">
              <TextField
                value={form.businessName}
                onChange={(e) => patch({ businessName: e.target.value })}
                placeholder="Joe's Plumbing LLC"
              />
            </Field>
            <Field label="Primary trade *">
              <NativeSelect value={form.trade} onChange={(e) => patch({ trade: e.target.value })}>
                <option value="" disabled>
                  Select your primary trade
                </option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Short bio (optional)">
              <TextArea
                value={form.bio}
                onChange={(e) => patch({ bio: e.target.value })}
                placeholder="Briefly describe your experience and specialties (optional)."
              />
            </Field>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <Field label="Service ZIP *">
              <TextField
                value={form.serviceZip}
                onChange={(e) => patch({ serviceZip: e.target.value })}
                placeholder="78704"
              />
            </Field>
            <Field label="Travel radius *">
              <NativeSelect value={form.radius} onChange={(e) => patch({ radius: e.target.value })}>
                <option value="10">Within 10 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
                <option value="75">Within 75 miles</option>
                <option value="100">Within 100 miles</option>
              </NativeSelect>
            </Field>
          </>
        ) : null}
      </div>
      {error ? <p className="mt-4 text-sm text-error">{error}</p> : null}
      <div className="mt-6 flex flex-wrap gap-2">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => setStep((value) => value - 1)}>
            ← Back
          </Button>
        ) : null}
        <Button type="button" onClick={next}>
          {step < 2 ? "Next ↗" : "Submit application ↗"}
        </Button>
      </div>
      <AuthLinks prompt="Already have an account?" href="/login?role=pro" label="Sign in ↗" />
    </Card>
  );
}
