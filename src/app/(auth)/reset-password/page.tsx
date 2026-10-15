"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { AuthLinks } from "@/components/web-pages/auth-links";

export default function ResetPasswordPage() {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = String(data.get("next") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    if (next.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (next !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setDone(true);
  }

  return (
    <Card className="p-6 md:p-8">
      <p className="font-display text-[12px] font-bold uppercase tracking-[0.16em] text-primary">Account</p>
      <h1 className="mt-2 text-[32px]">Set a new password</h1>
      {done ? (
        <>
          <p className="mt-3 text-sm leading-6 text-copy">Password updated. Sign in with the new one.</p>
          <div className="mt-6">
            <Button href="/login" className="w-full">
              Sign in
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm leading-6 text-copy">Choose a password you do not use elsewhere.</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <Field label="New password">
              <PasswordField name="next" autoComplete="new-password" required />
            </Field>
            <Field label="Confirm password">
              <PasswordField name="confirm" autoComplete="new-password" required />
            </Field>
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <Button type="submit" className="w-full">
              Update password
            </Button>
          </form>
        </>
      )}
      <AuthLinks prompt="Remembered it?" href="/login" label="Sign in" />
    </Card>
  );
}
