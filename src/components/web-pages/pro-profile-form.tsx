"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { categories } from "@/Mockdata";
import { updateUser } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function ProProfileForm() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [saved, setSaved] = useState(false);

  if (!user) return null;
  const current = user;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(
      updateUser({
        name: String(data.get("name") ?? current.name).trim(),
        phone: String(data.get("phone") ?? "").trim(),
        street: String(data.get("street") ?? "").trim(),
        city: String(data.get("city") ?? "").trim(),
        state: String(data.get("state") ?? "").trim(),
        zip: String(data.get("zip") ?? "").trim(),
      }),
    );
    setSaved(true);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[28px]">Business profile</h1>
        <p className="mt-1 text-sm text-copy">Shown after clearance. Contact stays gated by membership.</p>
      </div>
      <Card className="p-6 md:p-8">
        <form className="space-y-8" onSubmit={submit}>
          <div className="space-y-4">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
              Business
            </p>
            <Field label="Contact name">
              <TextField name="name" defaultValue={current.name} required />
            </Field>
            <Field label="Business name">
              <TextField name="business" defaultValue="Ortega Plumbing" required />
            </Field>
            <Field label="Primary trade">
              <NativeSelect name="trade" defaultValue="plumbing">
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Bio">
              <TextArea
                name="bio"
                defaultValue="Licensed plumber focused on residential leak repair and fixture installs across central Austin."
              />
            </Field>
          </div>

          <div className="space-y-4">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
              Contact
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" hint="Contact support to change email.">
                <TextField type="email" defaultValue={current.email} disabled />
              </Field>
              <Field label="Phone">
                <TextField name="phone" type="tel" defaultValue={current.phone} />
              </Field>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
              Service area
            </p>
            <Field label="Street address">
              <TextField name="street" defaultValue={current.street} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-[1.4fr_0.7fr_0.9fr]">
              <Field label="City">
                <TextField name="city" defaultValue={current.city} />
              </Field>
              <Field label="State">
                <TextField name="state" defaultValue={current.state} maxLength={2} />
              </Field>
              <Field label="ZIP">
                <TextField name="zip" defaultValue={current.zip} />
              </Field>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
            <Button type="submit">Save changes</Button>
            {saved ? <p className="text-sm text-success">Saved.</p> : null}
          </div>
        </form>
      </Card>
    </div>
  );
}
