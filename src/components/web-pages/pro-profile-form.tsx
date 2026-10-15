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
    <div className="space-y-3">
      <div>
        <h1 className="text-[24px] md:text-[28px]">Business profile</h1>
        <p className="mt-0.5 text-sm text-copy">Shown after clearance. Contact stays membership-gated.</p>
      </div>
      <Card className="p-4 md:p-5">
        <form className="space-y-3" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-2">
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
            <Field label="Phone">
              <TextField name="phone" type="tel" defaultValue={current.phone} />
            </Field>
            <Field label="Email">
              <TextField type="email" defaultValue={current.email} disabled />
            </Field>
            <Field label="Street">
              <TextField name="street" defaultValue={current.street} />
            </Field>
            <Field label="City">
              <TextField name="city" defaultValue={current.city} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="State">
                <TextField name="state" defaultValue={current.state} maxLength={2} />
              </Field>
              <Field label="ZIP">
                <TextField name="zip" defaultValue={current.zip} />
              </Field>
            </div>
            <Field label="Bio" className="sm:col-span-2">
              <TextArea
                name="bio"
                defaultValue="Licensed plumber focused on residential leak repair and fixture installs across central Austin."
                className="min-h-[88px]"
                rows={3}
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3">
            <Button type="submit" size="sm">
              Save changes
            </Button>
            {saved ? <p className="text-sm text-success">Saved.</p> : null}
          </div>
        </form>
      </Card>
    </div>
  );
}
