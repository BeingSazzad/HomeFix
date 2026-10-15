"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextField } from "@/components/ui/field";
import { UserAvatar } from "@/components/shared/user-avatar";
import { updateUser } from "@/redux/slices/authSlice";
import {
  addAddress,
  removeAddress,
  setEmailVerified,
  setPhoneVerified,
} from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function AccountProfileForm() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const fileInput = useRef<HTMLInputElement>(null);
  const addresses = useAppSelector((state) => state.features.addresses);
  const emailVerified = useAppSelector((state) => state.features.emailVerified);
  const phoneVerified = useAppSelector((state) => state.features.phoneVerified);
  const [avatar, setAvatar] = useState("");
  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (user?.avatar) setAvatar(user.avatar);
  }, [user?.avatar]);

  if (!user) return null;
  const current = user;

  function onPhotoPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Use a JPG or PNG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Keep the photo under 5 MB.");
      return;
    }
    setPhotoError("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  }

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
        avatar: avatar || current.avatar,
      }),
    );
    setSaved(true);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[28px]">Profile</h1>
        <p className="mt-1 text-sm text-copy">Used for your account and job contact.</p>
      </div>

      <Card className="p-6 md:p-8">
        <form className="space-y-8" onSubmit={submit}>
          <div className="flex flex-wrap items-center gap-5">
            <UserAvatar user={{ name: current.name, avatar }} size="lg" />
            <div>
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onPhotoPick}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInput.current?.click()}
              >
                <Camera className="h-4 w-4" />
                Change photo
              </Button>
              <p className="mt-2 text-xs text-muted">JPG or PNG · max 5 MB</p>
              {photoError ? <p className="mt-1 text-xs text-error">{photoError}</p> : null}
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
              Contact
            </p>
            <Field label="Full name">
              <TextField name="name" defaultValue={current.name} required autoComplete="name" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" hint="Contact support to change email.">
                <TextField type="email" defaultValue={current.email} disabled autoComplete="email" />
              </Field>
              <Field label="Phone">
                <TextField
                  name="phone"
                  type="tel"
                  defaultValue={current.phone}
                  placeholder="(512) 555-0100"
                  autoComplete="tel"
                />
              </Field>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
              Address
            </p>
            <Field label="Street address">
              <TextField
                name="street"
                defaultValue={current.street}
                placeholder="418 West 5th Street"
                autoComplete="street-address"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-[1.4fr_0.7fr_0.9fr]">
              <Field label="City">
                <TextField name="city" defaultValue={current.city} autoComplete="address-level2" />
              </Field>
              <Field label="State">
                <TextField
                  name="state"
                  defaultValue={current.state}
                  maxLength={2}
                  placeholder="TX"
                  autoComplete="address-level1"
                />
              </Field>
              <Field label="ZIP">
                <TextField
                  name="zip"
                  defaultValue={current.zip}
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="78701"
                  autoComplete="postal-code"
                />
              </Field>
            </div>
          </div>

          <div className="space-y-4 border-t border-line pt-6">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
              Verification
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={() => dispatch(setEmailVerified(true))}>
                {emailVerified ? "Email verified" : "Verify email"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => dispatch(setPhoneVerified(true))}>
                {phoneVerified ? "Phone verified" : "Verify phone"}
              </Button>
            </div>
          </div>

          <div className="space-y-4 border-t border-line pt-6">
            <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
              Saved addresses
            </p>
            <div className="space-y-2">
              {addresses.map((addr) => (
                <div key={addr.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-smoke px-4 py-3">
                  <div>
                    <p className="font-display text-sm font-bold text-title">{addr.label}</p>
                    <p className="text-sm text-copy">
                      {addr.street}, {addr.city}, {addr.state} {addr.zip}
                    </p>
                  </div>
                  <Button type="button" size="sm" variant="ghost" onClick={() => dispatch(removeAddress(addr.id))}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                dispatch(
                  addAddress({
                    label: "Other",
                    street: current.street || "New street",
                    city: current.city || "Austin",
                    state: current.state || "TX",
                    zip: current.zip || "78701",
                  }),
                )
              }
            >
              Add address
            </Button>
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
