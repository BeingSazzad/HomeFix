"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  Image as ImageIcon,
  Info,
  Percent,
  Plus,
  ShieldCheck,
  Trash2,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { categories } from "@/Mockdata";
import { updateUser } from "@/redux/slices/authSlice";
import {
  updateProProfile,
  type ProServiceItem,
} from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";

export function ProProfileForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const proProfile = useAppSelector((state) => state.features.proProfile);

  const [activeTab, setActiveTab] = useState<
    "services" | "overview" | "hours" | "credentials" | "portfolio"
  >("services");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ ...proProfile });

  // Inline "Add Service" state
  const [newService, setNewService] = useState({
    name: "",
    price: 95,
    unit: "starting rate",
    description: "",
  });
  const [showAddService, setShowAddService] = useState(false);

  // Inline "Add Photo" state
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  });
  const [showAddPhoto, setShowAddPhoto] = useState(false);

  if (!user) return null;

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  function handleSaveAll() {
    dispatch(updateProProfile(formData));
    dispatch(
      updateUser({
        name: formData.contactName,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      })
    );
    showToast("Profile & services updated successfully! Changes are live on your public storefront.");
  }

  // Service helpers
  function handleAddService() {
    if (!newService.name.trim()) return;
    const item: ProServiceItem = {
      id: `srv-${Date.now()}`,
      name: newService.name.trim(),
      price: Number(newService.price) || 50,
      unit: newService.unit.trim() || "starting rate",
      description: newService.description.trim(),
    };
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, item],
    }));
    setNewService({ name: "", price: 95, unit: "starting rate", description: "" });
    setShowAddService(false);
    showToast("Service added");
  }

  function handleRemoveService(id: string) {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  }

  // Payment methods toggle
  function togglePayment(payment: string) {
    setFormData((prev) => {
      const exists = prev.acceptedPayments.includes(payment);
      const next = exists
        ? prev.acceptedPayments.filter((p) => p !== payment)
        : [...prev.acceptedPayments, payment];
      return { ...prev, acceptedPayments: next };
    });
  }

  // Photo helpers
  function handleAddPhoto() {
    if (!newPhoto.title.trim()) return;
    setFormData((prev) => ({
      ...prev,
      portfolio: [
        ...prev.portfolio,
        {
          title: newPhoto.title.trim(),
          image: newPhoto.image.trim(),
        },
      ],
    }));
    setNewPhoto({
      title: "",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    });
    setShowAddPhoto(false);
    showToast("Photo added to portfolio");
  }

  function handleRemovePhoto(index: number) {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-title px-5 py-3 text-white shadow-xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Live Profile Shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/70 pb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="font-display text-[24px] sm:text-[28px] font-bold text-title tracking-tight leading-tight">
              Business Profile &amp; Services
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <Check className="h-3 w-3 text-emerald-600" />
              Storefront Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted">
            Manage your public storefront profile, trade services, pricing, and operating schedule.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/browse-pros/pro-1"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-title shadow-2xs hover:border-primary hover:text-primary transition"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View Public Storefront ↗</span>
          </Link>
          <Button
            type="button"
            onClick={handleSaveAll}
            className="shadow-xs text-xs sm:text-sm font-semibold px-5"
          >
            Save All Changes
          </Button>
        </div>
      </div>

      {/* 2. Professional Navigation Tabs (Proper Icons, No Sparkles) */}
      <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1 border-b border-line/60 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {[
          { key: "services", label: "Services & Rates", icon: Wrench, count: formData.services.length },
          { key: "overview", label: "Business Info", icon: Building2 },
          { key: "hours", label: "Hours & Payments", icon: Clock },
          { key: "credentials", label: "Licenses & Verification", icon: ShieldCheck },
          { key: "portfolio", label: "Project Photos", icon: ImageIcon, count: formData.portfolio.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg font-display text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer",
                active
                  ? "bg-title text-white shadow-2xs font-semibold"
                  : "bg-white text-muted hover:text-title border border-line/80 hover:bg-slate-50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-muted"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: SERVICES & RATES                                      */}
      {/* ============================================================ */}
      {activeTab === "services" && (
        <div className="space-y-6">
          {/* SPECIAL PROMOTIONAL DISCOUNT CARD */}
          <Card className="rounded-xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60 shrink-0">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-title">
                    First-Time Customer Discount
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Optional promotional discount displayed on your public profile header to attract new clients.
                  </p>
                </div>
              </div>

              {/* Offer Active Switch */}
              <label className="inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto bg-slate-50 border border-line/80 rounded-lg px-3 py-1.5 hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.specialOffer.active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialOffer: { ...prev.specialOffer, active: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
                <span className="text-xs font-medium text-title">
                  {formData.specialOffer.active ? "Discount Active" : "Discount Inactive"}
                </span>
              </label>
            </div>

            {formData.specialOffer.active && (
              <div className="mt-4 grid gap-4 sm:grid-cols-3 pt-4 border-t border-line/50">
                <Field label="Offer Headline">
                  <TextField
                    value={formData.specialOffer.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialOffer: { ...prev.specialOffer, title: e.target.value },
                      }))
                    }
                    placeholder="e.g. $25 Off First Diagnostic Call"
                  />
                </Field>

                <Field label="Badge Text">
                  <TextField
                    value={formData.specialOffer.discount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialOffer: { ...prev.specialOffer, discount: e.target.value },
                      }))
                    }
                    placeholder="e.g. $25 OFF"
                  />
                </Field>

                <Field label="Eligibility Note" className="sm:col-span-3">
                  <TextField
                    value={formData.specialOffer.terms}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialOffer: { ...prev.specialOffer, terms: e.target.value },
                      }))
                    }
                    placeholder="e.g. Valid for all first-time residential homeowners in Austin"
                  />
                </Field>
              </div>
            )}
          </Card>

          {/* BASE STARTING PRICE & RESPONSE TIME */}
          <Card className="rounded-xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Profile Starting Rate ($)">
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <TextField
                    type="number"
                    min={1}
                    value={formData.startingPrice}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        startingPrice: Number(e.target.value) || 0,
                      }))
                    }
                    className="pl-9"
                    placeholder="95"
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  Shown as &ldquo;Starting from ${formData.startingPrice}&rdquo; on your public profile.
                </p>
              </Field>

              <Field label="Typical Response Time">
                <TextField
                  value={formData.responseTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, responseTime: e.target.value }))
                  }
                  placeholder="e.g. Usually responds within 1 hour"
                />
                <p className="mt-1 text-[11px] text-muted">
                  Displays your expected response speed to homeowner inquiries.
                </p>
              </Field>
            </div>
          </Card>

          {/* ITEMIZED SERVICES CATALOG */}
          <Card className="rounded-2xl border border-line/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base sm:text-[17px] font-bold text-title">
                  Services Offered &amp; Rates ({formData.services.length})
                </h3>
                <p className="text-xs text-muted">
                  Homeowners can select and request quotes directly for these specific services.
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowAddService(!showAddService)}
                className="border border-line text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1 text-primary" />
                Add Service
              </Button>
            </div>

            {/* Inline Add Service Form */}
            {showAddService && (
              <div className="rounded-xl border border-primary/25 bg-smoke/60 p-4 space-y-3 animate-in fade-in">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  New Service Item
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Service Name" className="sm:col-span-2">
                    <TextField
                      value={newService.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewService({ ...newService, name: e.target.value })
                      }
                      placeholder="e.g. Tankless Water Heater Flush"
                    />
                  </Field>
                  <Field label="Price ($)">
                    <TextField
                      type="number"
                      value={newService.price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewService({ ...newService, price: Number(e.target.value) || 0 })
                      }
                      placeholder="120"
                    />
                  </Field>
                  <Field label="Rate Type">
                    <TextField
                      value={newService.unit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewService({ ...newService, unit: e.target.value })
                      }
                      placeholder="e.g. starting rate, per fixture"
                    />
                  </Field>
                  <Field label="Scope Description" className="sm:col-span-2">
                    <TextField
                      value={newService.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewService({ ...newService, description: e.target.value })
                      }
                      placeholder="e.g. Includes full system flush, diagnostic inspection, and seal verification."
                    />
                  </Field>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddService(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddService}
                    className="text-xs font-semibold"
                  >
                    Add Service
                  </Button>
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="divide-y divide-line/50">
              {formData.services.map((srv) => (
                <div key={srv.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-[15px] font-bold text-title">{srv.name}</p>
                      <span className="font-semibold text-primary text-xs bg-smoke px-2 py-0.5 rounded-md border border-primary/20">
                        ${srv.price}
                      </span>
                      <span className="text-xs text-muted">/ {srv.unit}</span>
                    </div>
                    {srv.description && (
                      <p className="text-xs text-copy">{srv.description}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveService(srv.id)}
                    className="text-muted hover:text-rose-600 transition p-1"
                    title="Remove Service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: BUSINESS INFO                                         */}
      {/* ============================================================ */}
      {activeTab === "overview" && (
        <Card className="rounded-2xl border border-line/80 bg-white p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="font-display text-base sm:text-[17px] font-bold text-title">Business Information</h3>
            <p className="text-xs text-muted">Core business details presented to Austin homeowners.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business Name">
              <TextField
                value={formData.businessName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                placeholder="Ortega Plumbing & Gas"
                required
              />
            </Field>

            <Field label="Contact Person Name">
              <TextField
                value={formData.contactName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                placeholder="Luis Ortega"
                required
              />
            </Field>

            <Field label="Primary Trade">
              <NativeSelect
                value={formData.categorySlug}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const slug = e.target.value;
                  const cat = categories.find((c) => c.slug === slug);
                  setFormData({
                    ...formData,
                    categorySlug: slug,
                    trade: cat?.name ?? "Plumbing",
                  });
                }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>

            <Field label="Business Phone">
              <TextField
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(512) 555-0198"
              />
            </Field>

            <Field label="Street Address">
              <TextField
                value={formData.street}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, street: e.target.value })
                }
                placeholder="2201 South Lamar Blvd"
              />
            </Field>

            <div className="grid grid-cols-3 gap-2">
              <Field label="City">
                <TextField
                  value={formData.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Austin"
                />
              </Field>
              <Field label="State">
                <TextField
                  value={formData.state}
                  maxLength={2}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="TX"
                />
              </Field>
              <Field label="ZIP">
                <TextField
                  value={formData.zip}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, zip: e.target.value })
                  }
                  placeholder="78704"
                />
              </Field>
            </div>

            <Field label="Service Radius (Miles)">
              <TextField
                type="number"
                value={formData.radiusMiles}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, radiusMiles: Number(e.target.value) || 25 })
                }
                placeholder="25"
              />
            </Field>

            <Field label="Years in Business">
              <TextField
                value={formData.yearsInBusiness}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, yearsInBusiness: e.target.value })
                }
                placeholder="10+ years"
              />
            </Field>

            <Field label="Profile Pitch / Tagline" className="sm:col-span-2">
              <TextField
                value={formData.tagline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="e.g. Master Licensed Plumber serving residential Austin & Central Texas"
              />
            </Field>

            <Field label="Business Bio" className="sm:col-span-2">
              <TextArea
                value={formData.bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="min-h-[85px]"
                rows={3}
                placeholder="Describe your background, craftsmanship, and customer commitment..."
              />
            </Field>
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 3: OPERATING HOURS & DIRECT PAYMENTS                     */}
      {/* ============================================================ */}
      {activeTab === "hours" && (
        <div className="space-y-6">
          <Card className="rounded-2xl border border-line/80 bg-white p-6 shadow-2xs space-y-4">
            <div>
              <h3 className="font-display text-base sm:text-[17px] font-bold text-title">Business Operating Hours</h3>
              <p className="text-xs text-muted">When homeowners can reach you for service appointments.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Monday – Friday">
                <TextField
                  value={formData.businessHours.weekdays}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessHours: { ...prev.businessHours, weekdays: e.target.value },
                    }))
                  }
                  placeholder="7:30 AM – 6:00 PM"
                />
              </Field>

              <Field label="Saturday">
                <TextField
                  value={formData.businessHours.saturday}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessHours: { ...prev.businessHours, saturday: e.target.value },
                    }))
                  }
                  placeholder="8:00 AM – 4:00 PM"
                />
              </Field>

              <Field label="Sunday">
                <TextField
                  value={formData.businessHours.sunday}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      businessHours: { ...prev.businessHours, sunday: e.target.value },
                    }))
                  }
                  placeholder="Closed / Emergency Only"
                />
              </Field>
            </div>

            {/* Emergency Toggle */}
            <div className="pt-3 border-t border-line/50">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.emergency}
                  onChange={(e) =>
                    setFormData({ ...formData, emergency: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
                <div>
                  <p className="text-sm font-semibold text-title">
                    24/7 Emergency Dispatch Available
                  </p>
                  <p className="text-xs text-muted">
                    Show an emergency badge to receive high-urgency water leak or electrical requests.
                  </p>
                </div>
              </label>
            </div>
          </Card>

          {/* ACCEPTED DIRECT PAYMENTS */}
          <Card className="rounded-2xl border border-line/80 bg-white p-6 shadow-2xs space-y-3">
            <div>
              <h3 className="font-display text-base sm:text-[17px] font-bold text-title">
                Accepted Payment Methods
              </h3>
              <p className="text-xs text-muted">
                Methods homeowners can use to pay you directly upon 100% completed job.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                "Credit/Debit Card",
                "Zelle",
                "Bank Transfer (ACH)",
                "Check",
                "Cash",
                "Venmo",
                "Apple Pay",
              ].map((method) => {
                const selected = formData.acceptedPayments.includes(method);
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => togglePayment(method)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold border transition-all",
                      selected
                        ? "border-primary bg-primary text-white shadow-2xs"
                        : "border-line bg-white text-muted hover:border-primary/40 hover:text-title"
                    )}
                  >
                    <Check className={cn("h-3.5 w-3.5", selected ? "opacity-100" : "opacity-0")} />
                    <span>{method}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: LICENSES & VERIFICATION                               */}
      {/* ============================================================ */}
      {activeTab === "credentials" && (
        <Card className="rounded-2xl border border-line/80 bg-white p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="font-display text-base sm:text-[17px] font-bold text-title">
              Licenses &amp; Verification Badges
            </h3>
            <p className="text-xs text-muted">
              Official trade credentials displayed on your public storefront.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="State Trade License #">
              <TextField
                value={formData.licenseNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
                placeholder="TX-M-42981 (Master Plumber)"
              />
            </Field>

            <Field label="State of License">
              <TextField
                value={formData.licenseState}
                maxLength={2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, licenseState: e.target.value })
                }
                placeholder="TX"
              />
            </Field>

            <Field label="Insurance Carrier Name">
              <TextField
                value={formData.insuranceCarrier}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, insuranceCarrier: e.target.value })
                }
                placeholder="Next Insurance Company"
              />
            </Field>

            <Field label="General Liability Coverage">
              <TextField
                value={formData.insuranceCoverage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, insuranceCoverage: e.target.value })
                }
                placeholder="$1,000,000 General Liability"
              />
            </Field>
          </div>

          <div className="rounded-xl bg-smoke p-4 flex items-center justify-between border border-line/60">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-title">Background Screening</p>
                <p className="text-[11px] text-muted">Identity and criminal background verified annually.</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <Check className="h-3 w-3" />
              Verified
            </span>
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 5: PORTFOLIO PHOTOS                                      */}
      {/* ============================================================ */}
      {activeTab === "portfolio" && (
        <Card className="rounded-2xl border border-line/80 bg-white p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base sm:text-[17px] font-bold text-title">
                Project Photos ({formData.portfolio.length})
              </h3>
              <p className="text-xs text-muted">
                Completed project photos displayed on your public storefront portfolio.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowAddPhoto(!showAddPhoto)}
              className="border border-line text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5 mr-1 text-primary" />
              Add Photo
            </Button>
          </div>

          {/* Add Photo Form */}
          {showAddPhoto && (
            <div className="rounded-xl border border-primary/25 bg-smoke/60 p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Add Project Photo
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Project Caption">
                  <TextField
                    value={newPhoto.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewPhoto({ ...newPhoto, title: e.target.value })
                    }
                    placeholder="e.g. Tankless water heater installation"
                  />
                </Field>
                <Field label="Image URL">
                  <TextField
                    value={newPhoto.image}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewPhoto({ ...newPhoto, image: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                  />
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddPhoto(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddPhoto}
                  className="text-xs font-semibold"
                >
                  Add Photo
                </Button>
              </div>
            </div>
          )}

          {/* Photos Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {formData.portfolio.map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-smoke border border-line shadow-2xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3 text-white">
                  <span className="text-xs font-medium truncate pr-2">{item.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="p-1 rounded-full bg-red-600/80 hover:bg-red-600 text-white shrink-0 transition"
                    title="Remove Photo"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Floating Save Footer Bar */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-xl border border-line/80 bg-white/95 px-5 py-3 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Info className="h-4 w-4 text-muted shrink-0" />
          <span>All updates immediately reflect across homeowner searches and your public storefront.</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/browse-pros/pro-1"
            target="_blank"
            className="text-xs font-medium text-muted hover:text-title transition flex items-center gap-1"
          >
            <span>Preview Storefront ↗</span>
          </Link>
          <Button
            type="button"
            onClick={handleSaveAll}
            className="shadow-xs text-xs sm:text-sm font-medium px-5 rounded-lg"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
