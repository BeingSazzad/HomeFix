"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Steps } from "antd";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { categories } from "@/Mockdata";
import { AuthLinks } from "@/components/web-pages/auth-links";
import { PasswordField } from "@/components/ui/password-field";
import { loginAs } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

const steps = ["Personal info", "Business profile", "Area & credentials"];

export default function ProRegisterPage() {
  const [step, setStep] = useState(0);
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <Card className="max-w-none">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Provider application
      </p>
      <h1 className="mt-2 text-[28px]">Join as a professional</h1>
      <p className="mt-2 text-sm text-copy">
        Three months free after approval, then $19.99/month. Contact details stay hidden until clearance plus membership.
      </p>
      <div className="mt-5">
        <Steps current={step} items={steps.map((title) => ({ title }))} size="small" />
      </div>
      <div className="mt-6 space-y-3">
        {step === 0 ? (
          <>
            <Field label="Full name"><TextField placeholder="Joe Smith" /></Field>
            <Field label="Email"><TextField type="email" placeholder="joe@example.com" /></Field>
            <Field label="Phone" hint="Shared with matched homeowners only after approval and an active trial or subscription.">
              <TextField placeholder="(555) 000-0000" />
            </Field>
            <Field label="Password">
              <PasswordField placeholder="At least 8 characters" autoComplete="new-password" />
            </Field>
          </>
        ) : null}
        {step === 1 ? (
          <>
            <Field label="Business name"><TextField placeholder="Joe's Plumbing LLC" /></Field>
            <Field label="Primary trade">
              <NativeSelect defaultValue="">
                <option value="" disabled>Select your primary trade</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>{item.name}</option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Bio">
              <TextArea placeholder="What homeowners should know about your work." />
            </Field>
          </>
        ) : null}
        {step === 2 ? (
          <>
            <Field label="Service ZIP"><TextField placeholder="78704" /></Field>
            <Field label="Travel radius">
              <NativeSelect defaultValue="25">
                <option value="10">Within 10 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
                <option value="75">Within 75 miles</option>
                <option value="100">Within 100 miles</option>
              </NativeSelect>
            </Field>
            <label className="block text-sm text-copy">
              <input type="checkbox" className="mr-2" /> I carry general liability insurance
            </label>
            <label className="block text-sm text-copy">
              <input type="checkbox" className="mr-2" /> I hold a valid trade license
            </label>
            <label className="block text-sm text-copy">
              <input type="checkbox" className="mr-2" /> I authorize a Checkr hosted background screening. Do not send SSN or ID files to LocalHomeFix.
            </label>
          </>
        ) : null}
      </div>
      <div className="mt-6 flex gap-2">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => setStep((value) => value - 1)}>
            Back
          </Button>
        ) : null}
        <Button
          type="button"
          onClick={() => {
            if (step < 2) {
              setStep((value) => value + 1);
              return;
            }
            dispatch(loginAs("pro"));
            router.push("/pro/verification");
          }}
        >
          {step < 2 ? "Next" : "Submit application"}
        </Button>
      </div>
      <AuthLinks
        prompt="Already have an account?"
        href="/login"
        label="Sign in"
        extras={[
          { href: "/signup", label: "I'm a homeowner" },
          { href: "/browse-pros", label: "Continue as guest" },
        ]}
      />
    </Card>
  );
}
