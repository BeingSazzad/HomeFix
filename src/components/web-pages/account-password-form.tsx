"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";

export function AccountPasswordForm() {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const current = String(data.get("current") ?? "");
    const next = String(data.get("next") ?? "");
    const confirm = String(data.get("confirm") ?? "");

    if (current.length < 6) {
      setError("Enter your current password.");
      setSaved(false);
      return;
    }
    if (next.length < 6) {
      setError("New password must be at least 6 characters.");
      setSaved(false);
      return;
    }
    if (next !== confirm) {
      setError("New password and confirmation do not match.");
      setSaved(false);
      return;
    }
    setError("");
    setSaved(true);
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[28px]">Change password</h1>
        <p className="mt-1 text-sm text-copy">Use a password you do not reuse on other sites.</p>
      </div>
      <Card>
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Current password">
            <PasswordField name="current" autoComplete="current-password" required />
          </Field>
          <Field label="New password">
            <PasswordField name="next" autoComplete="new-password" required />
          </Field>
          <Field label="Confirm new password">
            <PasswordField name="confirm" autoComplete="new-password" required />
          </Field>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          {saved ? <p className="text-sm text-success">Password updated. Use it the next time you sign in.</p> : null}
          <Button type="submit">Update password</Button>
        </form>
      </Card>
    </div>
  );
}
