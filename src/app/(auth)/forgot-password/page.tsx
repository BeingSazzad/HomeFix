"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextField } from "@/components/ui/field";
import { AuthLinks } from "@/components/web-pages/auth-links";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <Card className="p-6 md:p-8">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
        Account Recovery
      </span>
      <h1 className="mt-3 font-display text-[22px] sm:text-[24px] font-semibold leading-snug tracking-tight text-title">
        Forgot password
      </h1>
      {sent ? (
        <>
          <p className="mt-3 text-sm leading-6 text-copy">
            If an account exists for <span className="font-semibold text-title">{email}</span>, a reset link is on the way.
            Check inbox and spam.
          </p>
          <div className="mt-6 space-y-3">
            <Button href="/reset-password" className="w-full">
              Continue to reset
            </Button>
            <Button href="/login" variant="ghost" className="w-full">
              Back to sign in
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-6 text-copy">
            Enter the email on the account. We send a reset link if that address is registered.
          </p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
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
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </form>
        </>
      )}
      <AuthLinks prompt="Remembered it?" href="/login" label="Sign in" />
    </Card>
  );
}
