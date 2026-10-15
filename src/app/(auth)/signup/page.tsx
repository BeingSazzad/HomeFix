"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextField } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { AuthLinks } from "@/components/web-pages/auth-links";
import { loginAs } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const draft = useAppSelector((state) => state.intake.draft);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    dispatch(loginAs("homeowner"));
    router.push(draft.summary ? "/account/post-job" : "/account");
  }

  return (
    <Card className="p-6 md:p-8">
      <p className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-primary">Homeowners</p>
      <h1 className="mt-2 text-[32px]">Create an account</h1>
      <p className="mt-2 text-sm leading-6 text-copy">
        Post a request, compare quotes, and keep messages on one job. No LocalHomeFix project fee.
      </p>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <Field label="Full name">
          <TextField
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jane Smith"
            autoComplete="name"
          />
        </Field>
        <Field label="Email">
          <TextField
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Password">
          <PasswordField
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </Field>
        <Field label="Confirm password">
          <PasswordField
            required
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
          />
        </Field>
        <label className="flex items-start gap-3 text-sm leading-6 text-copy">
          <input type="checkbox" required className="mt-1 h-4 w-4 accent-primary" />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="font-semibold text-primary">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-primary">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <Button type="submit" className="w-full">
          Create homeowner account
        </Button>
      </form>

      <AuthLinks prompt="Already have an account?" href="/login" label="Sign in" />
    </Card>
  );
}
