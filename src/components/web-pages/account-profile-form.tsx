"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextField } from "@/components/ui/field";
import { UserAvatar } from "@/components/shared/user-avatar";
import { updateUser } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function AccountProfileForm() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(
      updateUser({
        name: String(data.get("name") ?? user.name),
        city: String(data.get("city") ?? user.city ?? ""),
        state: String(data.get("state") ?? user.state ?? ""),
        zip: String(data.get("zip") ?? user.zip ?? ""),
      }),
    );
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[28px]">Profile</h1>
        <p className="mt-1 text-sm text-copy">
          This is what LocalHomeFix uses on your account. It is not a public listing.
        </p>
      </div>
      <Card>
        <div className="mb-6 flex items-center gap-4">
          <UserAvatar user={user} size="lg" />
          <div>
            <p className="font-display text-lg font-bold text-title">{user.name}</p>
            <p className="text-sm text-copy">{user.email}</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Full name">
            <TextField name="name" defaultValue={user.name} required />
          </Field>
          <Field label="Email" hint="Email stays on the account. Contact support to change it.">
            <TextField type="email" defaultValue={user.email} disabled />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City">
              <TextField name="city" defaultValue={user.city} />
            </Field>
            <Field label="State">
              <TextField name="state" defaultValue={user.state} />
            </Field>
            <Field label="ZIP">
              <TextField name="zip" defaultValue={user.zip} />
            </Field>
          </div>
          {saved ? <p className="text-sm text-success">Profile saved.</p> : null}
          <Button type="submit">Save profile</Button>
        </form>
      </Card>
    </div>
  );
}
