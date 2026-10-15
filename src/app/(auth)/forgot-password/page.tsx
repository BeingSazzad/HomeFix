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
      <p className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-primary">Account</p>
      <h1 className="mt-2 text-[32px]">Forgot password</h1>
      {sent ? (
        <>
          <p className="mt-3 text-sm leading-6 text-copy">
            If an account exists for <span className="font-semibold text-title">{email}</span>, a reset link is on the way.
            Check inbox and spam.
          </p>
          <div className="mt-6">
            <Button href="/login" className="w-full">
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
      <AuthLinks
        prompt="Remembered it?"
        href="/login"
        label="Sign in"
        extras={[{ href: "/browse-pros", label: "Continue as guest" }]}
      />
    </Card>
  );
}
