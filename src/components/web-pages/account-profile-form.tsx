"use client";

import { useRef, useState } from "react";
import {
  Building2,
  Camera,
  Check,
  Home,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
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

type AddressDraft = Omit<SavedAddress, "id"> & { id?: string; isPrimary?: boolean };

const emptyDraft = (): AddressDraft => ({
  label: "Home",
  street: "",
  city: "Austin",
  state: "TX",
  zip: "",
  isPrimary: false,
});

const QUICK_LABELS = ["Home", "Rental Property", "Office", "Condo"];

export function AccountProfileForm() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const fileInput = useRef<HTMLInputElement>(null);
  const addresses = useAppSelector((state) => state.features.addresses);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const avatar = customAvatar ?? user?.avatar ?? "";
  const [saved, setSaved] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<AddressDraft>(emptyDraft());
  const [addrError, setAddrError] = useState("");

  if (!user) return null;
  const current = user;

  function isAddressPrimary(addr: SavedAddress, index: number) {
    if (current.street) {
      return (
        addr.street.trim().toLowerCase() === current.street.trim().toLowerCase() &&
        addr.zip.trim() === current.zip?.trim()
      );
    }
    return index === 0;
  }

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
      if (typeof reader.result === "string") setCustomAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(
      updateUser({
        name: String(data.get("name") ?? current.name).trim(),
        phone: String(data.get("phone") ?? "").trim(),
        avatar: avatar || current.avatar,
      }),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  }

  function startEdit(addr: SavedAddress, isPrimary: boolean) {
    setEditingId(addr.id);
    setDraft({ ...addr, isPrimary });
    setAddrError("");
  }

  function startAdd() {
    setEditingId("new");
    setDraft({
      ...emptyDraft(),
      street: "",
      city: current.city || "",
      state: current.state || "",
      zip: current.zip || "",
      isPrimary: addresses.length === 0,
    });
    setAddrError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyDraft());
    setAddrError("");
  }

  function makePrimary(addr: SavedAddress) {
    dispatch(
      updateUser({
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
      }),
    );
  }

  function handleDeleteAddress(id: string) {
    const target = addresses.find((a) => a.id === id);
    const wasPrimary =
      target &&
      current.street &&
      target.street.trim().toLowerCase() === current.street.trim().toLowerCase();

    dispatch(removeAddress(id));

    if (wasPrimary) {
      const remaining = addresses.filter((a) => a.id !== id);
      if (remaining.length > 0) {
        dispatch(
          updateUser({
            street: remaining[0].street,
            city: remaining[0].city,
            state: remaining[0].state,
            zip: remaining[0].zip,
          }),
        );
      } else {
        dispatch(updateUser({ street: "", city: "", state: "", zip: "" }));
      }
    }
  }

  function saveAddress() {
    const label = draft.label.trim();
    const street = draft.street.trim();
    const city = draft.city.trim();
    const state = draft.state.trim().toUpperCase();
    const zip = draft.zip.trim();

    if (!label) {
      setAddrError("Please enter an address label (e.g. Home, Office).");
      return;
    }
    if (street.length < 3) {
      setAddrError("Enter a valid street address.");
      return;
    }
    if (!city) {
      setAddrError("Enter a city.");
      return;
    }
    if (state.length !== 2) {
      setAddrError("Enter a valid 2-letter state code (e.g. TX).");
      return;
    }
    if (!/^\d{5}$/.test(zip)) {
      setAddrError("Enter a valid 5-digit ZIP code.");
      return;
    }

    setAddrError("");

    if (editingId && editingId !== "new") {
      dispatch(updateAddress({ id: editingId, label, street, city, state, zip }));
    } else {
      dispatch(addAddress({ label, street, city, state, zip }));
    }

    // Sync primary address with user profile if marked or if it's the only address
    if (draft.isPrimary || addresses.length === 0) {
      dispatch(updateUser({ street, city, state, zip }));
    }

    cancelEdit();
  }

  function getAddressIcon(label: string) {
    const lower = label.toLowerCase();
    if (
      lower.includes("office") ||
      lower.includes("work") ||
      lower.includes("commercial") ||
      lower.includes("building")
    ) {
      return Building2;
    }
    if (
      lower.includes("home") ||
      lower.includes("house") ||
      lower.includes("residence") ||
      lower.includes("condo") ||
      lower.includes("apt")
    ) {
      return Home;
    }
    return MapPin;
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-line/70 pb-4 pt-1">
        <h1 className="font-display text-[22px] sm:text-[26px] font-semibold text-title tracking-tight">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your personal details and service addresses.
        </p>
      </div>

      {/* 1. Personal Information Card */}
      <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
        <div className="mb-6 border-b border-line/60 pb-4">
          <h2 className="font-display text-base sm:text-[17px] font-semibold text-title">Personal Information</h2>
          <p className="text-xs text-muted">Profile photo and primary contact details</p>
        </div>

        <form className="space-y-6" onSubmit={submitProfile}>
          {/* Avatar and Photo Upload */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-b border-line/60 pb-6">
            <div className="relative group">
              <UserAvatar user={{ name: current.name, avatar }} size="lg" />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-white shadow-sm ring-2 ring-white transition hover:bg-primary-hover"
                title="Change photo"
                aria-label="Change photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onPhotoPick}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInput.current?.click()}
                  className="rounded-full"
                >
                  <Camera className="h-4 w-4" />
                  Upload new photo
                </Button>
                {avatar && avatar !== current.avatar ? (
                  <button
                    type="button"
                    onClick={() => setCustomAvatar(null)}
                    className="text-xs font-medium text-muted hover:text-error transition"
                  >
                    Reset
                  </button>
                ) : null}
              </div>
              <p className="mt-1.5 text-xs text-muted">JPG, PNG, or WebP · Max 5 MB</p>
              {photoError ? <p className="mt-1 text-xs font-medium text-error">{photoError}</p> : null}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" className="sm:col-span-2">
              <TextField
                name="name"
                defaultValue={current.name}
                required
                autoComplete="name"
                placeholder="e.g. Maya Chen"
              />
            </Field>

            <Field label="Email address" hint="Associated with your account authentication">
              <div className="relative">
                <TextField
                  type="email"
                  defaultValue={current.email}
                  disabled
                  autoComplete="email"
                  className="bg-smoke/60 text-muted cursor-not-allowed pr-24"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  <Check className="h-3 w-3" />
                  Verified
                </span>
              </div>
            </Field>

            <Field label="Phone number" hint="For contractor updates and appointment confirmations">
              <TextField
                name="phone"
                type="tel"
                defaultValue={current.phone}
                placeholder="(512) 555-0142"
                autoComplete="tel"
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" size="sm" className="rounded-full">
              Save personal details
            </Button>
            {saved ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success animate-in fade-in">
                <Check className="h-4 w-4" />
                Profile changes saved.
              </span>
            ) : null}
          </div>
        </form>
      </Card>

      {/* 2. Service Addresses Section */}
      <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-title">Service Addresses</h2>
            <p className="text-xs text-muted">
              Properties where contractors can be scheduled for on-site repair jobs
            </p>
          </div>
          {editingId === null ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={startAdd}
              className="rounded-full self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              Add new address
            </Button>
          ) : null}
        </div>

        {/* Address Form (Inline Editor for Add or Edit) */}
        {editingId !== null ? (
          <div className="mb-6 rounded-[16px] border border-primary/20 bg-smoke/70 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-line/50 pb-3">
              <p className="font-display text-sm font-bold text-title">
                {editingId === "new" ? "Add New Service Address" : `Edit Address (${draft.label})`}
              </p>
              <button
                type="button"
                onClick={cancelEdit}
                aria-label="Close address editor"
                className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-white hover:text-title transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <AddressEditor
              draft={draft}
              error={addrError}
              onChange={setDraft}
              onSave={saveAddress}
              onCancel={cancelEdit}
            />
          </div>
        ) : null}

        {/* Saved Addresses List */}
        <div className="space-y-3">
          {addresses.map((addr, index) => {
            const isPrimary = isAddressPrimary(addr, index);
            const Icon = getAddressIcon(addr.label);

            return (
              <div
                key={addr.id}
                className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[16px] border p-4 transition-all duration-200 ${
                  isPrimary
                    ? "border-primary/40 bg-primary/[0.02] shadow-xs"
                    : "border-line/80 bg-white hover:border-line"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                      isPrimary ? "bg-primary/10 text-primary" : "bg-smoke text-muted"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-bold text-title">{addr.label}</span>
                      {isPrimary ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                          <Check className="h-3 w-3" />
                          Primary address
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 font-display text-[15px] font-medium text-title">
                      {addr.street}
                    </p>
                    <p className="text-xs text-muted">
                      {addr.city}, {addr.state} {addr.zip}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-line/40">
                  {!isPrimary ? (
                    <button
                      type="button"
                      onClick={() => makePrimary(addr)}
                      className="rounded-full px-3 py-1 text-xs font-semibold text-muted hover:bg-smoke hover:text-primary transition"
                    >
                      Set as primary
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => startEdit(addr, isPrimary)}
                    disabled={editingId !== null}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/5 transition disabled:opacity-40"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    disabled={editingId !== null}
                    aria-label={`Remove address ${addr.label}`}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-muted hover:bg-rose-50 hover:text-error transition disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {!addresses.length && editingId !== "new" ? (
            <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-line/80 py-8 text-center bg-smoke/30">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-smoke text-muted mb-3">
                <MapPin className="h-6 w-6" />
              </div>
              <p className="font-display text-sm font-semibold text-title">No saved addresses</p>
              <p className="mt-1 text-xs text-muted max-w-sm">
                Add your home or property address so pros can provide accurate quotes and schedule visits.
              </p>
              <Button type="button" size="sm" variant="ghost" onClick={startAdd} className="mt-4 rounded-full">
                <Plus className="h-4 w-4" />
                Add your first address
              </Button>
            </div>
          ) : null}
        </div>
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
    <div className="space-y-4">
      {/* Quick label selection chips */}
      <div>
        <span className="block font-display text-xs font-semibold text-title mb-1.5">
          Quick Label
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_LABELS.map((item) => {
            const isSelected = draft.label.toLowerCase() === item.toLowerCase();
            return (
              <button
                key={item}
                type="button"
                onClick={() => onChange({ ...draft, label: item })}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-white border border-line text-copy hover:border-primary/50"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Address Label">
          <TextField
            value={draft.label}
            onChange={(event) => onChange({ ...draft, label: event.target.value })}
            placeholder="e.g. Home, Office, Townhouse"
          />
        </Field>

        <Field label="Street Address" className="sm:col-span-2">
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
            placeholder="City"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="State">
            <TextField
              value={draft.state}
              maxLength={2}
              onChange={(event) =>
                onChange({ ...draft, state: event.target.value.toUpperCase() })
              }
              placeholder="TX"
            />
          </Field>
          <Field label="ZIP Code">
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

      {/* Set as Primary Checkbox */}
      <label className="flex items-center gap-2 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={Boolean(draft.isPrimary)}
          onChange={(e) => onChange({ ...draft, isPrimary: e.target.checked })}
          className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
        />
        <span className="text-xs font-medium text-copy">
          Set as my primary service address
        </span>
      </label>

      {error ? (
        <p className="rounded-[8px] bg-rose-50 px-3 py-2 text-xs font-medium text-error border border-rose-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/40">
        <Button type="button" size="sm" onClick={onSave} className="rounded-full">
          Save address
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="rounded-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
