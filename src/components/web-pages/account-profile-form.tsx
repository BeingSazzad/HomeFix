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
  updateAddress,
  type SavedAddress,
} from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

type AddressDraft = Omit<SavedAddress, "id"> & { id?: string };

const emptyDraft = (): AddressDraft => ({
  label: "Home",
  street: "",
  city: "Austin",
  state: "TX",
  zip: "",
});

export function AccountProfileForm() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const fileInput = useRef<HTMLInputElement>(null);
  const addresses = useAppSelector((state) => state.features.addresses);
  const [avatar, setAvatar] = useState("");
  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<AddressDraft>(emptyDraft());
  const [addrError, setAddrError] = useState("");

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

  function startEdit(addr: SavedAddress) {
    setEditingId(addr.id);
    setDraft({ ...addr });
    setAddrError("");
  }

  function startAdd() {
    setEditingId("new");
    setDraft({
      ...emptyDraft(),
      street: current.street || "",
      city: current.city || "Austin",
      state: current.state || "TX",
      zip: current.zip || "",
    });
    setAddrError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyDraft());
    setAddrError("");
  }

  function saveAddress() {
    const label = draft.label.trim();
    const street = draft.street.trim();
    const city = draft.city.trim();
    const state = draft.state.trim().toUpperCase();
    const zip = draft.zip.trim();
    if (!label) {
      setAddrError("Add a label (Home, Office…).");
      return;
    }
    if (street.length < 3) {
      setAddrError("Enter a street address.");
      return;
    }
    if (!city) {
      setAddrError("Enter a city.");
      return;
    }
    if (state.length !== 2) {
      setAddrError("Enter a 2-letter state.");
      return;
    }
    if (!/^\d{5}$/.test(zip)) {
      setAddrError("Enter a valid 5-digit ZIP.");
      return;
    }
    setAddrError("");
    if (editingId && editingId !== "new") {
      dispatch(updateAddress({ id: editingId, label, street, city, state, zip }));
    } else {
      dispatch(addAddress({ label, street, city, state, zip }));
    }
    cancelEdit();
  }

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-[24px] md:text-[28px]">Profile</h1>
        <p className="mt-0.5 text-sm text-copy">Account and job contact details.</p>
      </div>

      <Card className="p-4 md:p-5">
        <form className="space-y-3" onSubmit={submit}>
          <div className="flex flex-wrap items-center gap-3">
            <UserAvatar user={{ name: current.name, avatar }} size="md" />
            <div>
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onPhotoPick}
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => fileInput.current?.click()}>
                <Camera className="h-4 w-4" />
                Change photo
              </Button>
              <p className="mt-1 text-[11px] text-muted">JPG or PNG · max 5 MB</p>
              {photoError ? <p className="mt-0.5 text-[11px] text-error">{photoError}</p> : null}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name" className="sm:col-span-2">
              <TextField name="name" defaultValue={current.name} required autoComplete="name" />
            </Field>
            <Field label="Email">
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
            <Field label="Street" className="sm:col-span-2">
              <TextField
                name="street"
                defaultValue={current.street}
                placeholder="418 West 5th Street"
                autoComplete="street-address"
              />
            </Field>
            <Field label="City">
              <TextField name="city" defaultValue={current.city} autoComplete="address-level2" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
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

          <div className="border-t border-line pt-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-display text-sm font-semibold text-title">Saved addresses</p>
              {editingId === null ? (
                <Button type="button" size="sm" variant="ghost" onClick={startAdd}>
                  Add
                </Button>
              ) : null}
            </div>

            <ul className="space-y-2">
              {addresses.map((addr) =>
                editingId === addr.id ? (
                  <li key={addr.id} className="rounded-[10px] border border-line bg-smoke p-3">
                    <AddressEditor
                      draft={draft}
                      error={addrError}
                      onChange={setDraft}
                      onSave={saveAddress}
                      onCancel={cancelEdit}
                    />
                  </li>
                ) : (
                  <li
                    key={addr.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] bg-smoke px-3 py-2"
                  >
                    <p className="min-w-0 text-sm text-copy">
                      <span className="font-semibold text-title">{addr.label}</span>
                      {" · "}
                      {addr.street}, {addr.city}, {addr.state} {addr.zip}
                    </p>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary"
                        onClick={() => startEdit(addr)}
                        disabled={editingId !== null}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-xs font-semibold text-muted hover:text-error"
                        onClick={() => dispatch(removeAddress(addr.id))}
                        disabled={editingId !== null}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ),
              )}

              {editingId === "new" ? (
                <li className="rounded-[10px] border border-line bg-smoke p-3">
                  <AddressEditor
                    draft={draft}
                    error={addrError}
                    onChange={setDraft}
                    onSave={saveAddress}
                    onCancel={cancelEdit}
                  />
                </li>
              ) : null}

              {!addresses.length && editingId !== "new" ? (
                <li className="rounded-[10px] border border-dashed border-line px-3 py-4 text-center text-sm text-muted">
                  No saved addresses yet.{" "}
                  <button type="button" className="font-semibold text-primary" onClick={startAdd}>
                    Add one
                  </button>
                </li>
              ) : null}
            </ul>
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

function AddressEditor({
  draft,
  error,
  onChange,
  onSave,
  onCancel,
}: {
  draft: AddressDraft;
  error: string;
  onChange: (next: AddressDraft) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-2.5">
      <div className="grid gap-2.5 sm:grid-cols-2">
        <Field label="Label">
          <TextField
            value={draft.label}
            onChange={(event) => onChange({ ...draft, label: event.target.value })}
            placeholder="Home"
          />
        </Field>
        <Field label="Street" className="sm:col-span-2">
          <TextField
            value={draft.street}
            onChange={(event) => onChange({ ...draft, street: event.target.value })}
            placeholder="418 West 5th Street"
          />
        </Field>
        <Field label="City">
          <TextField
            value={draft.city}
            onChange={(event) => onChange({ ...draft, city: event.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="State">
            <TextField
              value={draft.state}
              maxLength={2}
              onChange={(event) => onChange({ ...draft, state: event.target.value.toUpperCase() })}
              placeholder="TX"
            />
          </Field>
          <Field label="ZIP">
            <TextField
              value={draft.zip}
              inputMode="numeric"
              maxLength={5}
              onChange={(event) => onChange({ ...draft, zip: event.target.value })}
              placeholder="78701"
            />
          </Field>
        </div>
      </div>
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={onSave}>
          Save address
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
