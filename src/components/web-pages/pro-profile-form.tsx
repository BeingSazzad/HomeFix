"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Flame,
  Info,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { categories } from "@/Mockdata";
import { updateUser } from "@/redux/slices/authSlice";
import {
  updateProProfile,
  type ProServiceItem,
  type ProSpecialOffer,
} from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";

export function ProProfileForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const proProfile = useAppSelector((state) => state.features.proProfile);

  const [activeTab, setActiveTab] = useState<
    "overview" | "services" | "hours" | "credentials" | "portfolio"
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
    setTimeout(() => setToastMessage(null), 4000);
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
    showToast("Profile & service offerings updated! Changes are live on your public storefront.");
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

  // Perks toggle
  function togglePerk(perk: string) {
    setFormData((prev) => {
      const exists = prev.includedPerks.includes(perk);
      const next = exists
        ? prev.includedPerks.filter((p) => p !== perk)
        : [...prev.includedPerks, perk];
      return { ...prev, includedPerks: next };
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-title px-5 py-3.5 text-white shadow-xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Live Profile Shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/70 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-[26px] sm:text-[30px] font-bold text-title tracking-tight leading-tight">
              Business Profile &amp; Services
            </h1>
            <Badge tone="green" className="border border-emerald-300">
              <Check className="h-3 w-3 mr-1 text-emerald-600" />
              Storefront Active
            </Badge>
          </div>
          <p className="text-sm text-copy">
            Configure your public storefront, service offerings, special promotional discounts, and business hours.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/browse-pros/pro-1"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-title shadow-xs hover:border-primary hover:text-primary transition"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View Public Storefront</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
          </Link>
          <Button
            type="button"
            onClick={handleSaveAll}
            className="rounded-full shadow-xs text-xs sm:text-sm font-semibold px-5"
          >
            Save All Changes
          </Button>
        </div>
      </div>

      {/* 2. Modern Navigation Tabs */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 border-b border-line/60 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {[
          { key: "services", label: "Services & Special Offers", icon: Sparkles },
          { key: "overview", label: "Identity & Contact", icon: Briefcase },
          { key: "hours", label: "Availability & Payments", icon: Clock },
          { key: "credentials", label: "Licenses & Insurance", icon: ShieldCheck },
          { key: "portfolio", label: "Portfolio Gallery", icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs sm:text-sm font-semibold transition-all whitespace-nowrap",
                active
                  ? "bg-primary text-white shadow-xs"
                  : "bg-smoke/80 text-title hover:bg-smoke hover:text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.key === "services" && (
                <span className={cn(
                  "ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                  active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                )}>
                  {formData.services.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: SERVICES & SPECIAL OFFERS (The primary focus)         */}
      {/* ============================================================ */}
      {activeTab === "services" && (
        <div className="space-y-6">
          {/* SPECIAL PROMOTIONAL OFFER BOX */}
          <Card className="rounded-[22px] border-2 border-emerald-300/80 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-xs">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold uppercase tracking-wider text-emerald-800">
                      Promotional Offer &amp; Discounts
                    </span>
                    <Badge tone="green" className="text-[10px]">Homeowner Magnet</Badge>
                  </div>
                  <p className="text-xs text-[#555] mt-0.5">
                    Highlighted prominently on your public profile header to increase quote conversion.
                  </p>
                </div>
              </div>

              {/* Offer Active Switch */}
              <label className="inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto bg-white border border-emerald-200 rounded-full px-3.5 py-1.5 shadow-2xs">
                <input
                  type="checkbox"
                  checked={formData.specialOffer.active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialOffer: { ...prev.specialOffer, active: e.target.checked },
                    }))
                  }
                  className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-emerald-900">
                  {formData.specialOffer.active ? "Offer Active on Profile" : "Offer Paused"}
                </span>
              </label>
            </div>

            {formData.specialOffer.active && (
              <div className="mt-5 grid gap-4 sm:grid-cols-3 pt-4 border-t border-emerald-200/60">
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

                <Field label="Discount Badge">
                  <TextField
                    value={formData.specialOffer.discount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialOffer: { ...prev.specialOffer, discount: e.target.value },
                      }))
                    }
                    placeholder="e.g. $25 OFF or 10% OFF"
                  />
                </Field>

                <Field label="Terms & Eligibility" className="sm:col-span-3">
                  <TextArea
                    value={formData.specialOffer.terms}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialOffer: { ...prev.specialOffer, terms: e.target.value },
                      }))
                    }
                    placeholder="e.g. Valid for all first-time homeowners in Travis & Williamson counties..."
                    className="min-h-[64px]"
                  />
                </Field>
              </div>
            )}
          </Card>

          {/* BASE STARTING PRICE & PRICING TRANSPARENCY */}
          <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-6 shadow-xs">
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
                  Displayed as &quot;Starting from ${formData.startingPrice}&quot; on search cards and profile banner.
                </p>
              </Field>

              <Field label="Availability Note">
                <TextField
                  value={formData.responseTime}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, responseTime: e.target.value }))
                  }
                  placeholder="e.g. Usually responds within 1 hour"
                />
                <p className="mt-1 text-[11px] text-muted">
                  Displays response commitment on search directory and profile header.
                </p>
              </Field>
            </div>
          </Card>

          {/* ITEMIZED SERVICES CATALOG */}
          <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-[17px] font-bold text-title">
                  Services Offered &amp; Rates ({formData.services.length})
                </h3>
                <p className="text-xs text-muted">
                  Homeowners browse these exact service options when requesting quotes.
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowAddService(!showAddService)}
                className="rounded-xl border border-line text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1 text-primary" />
                Add Service
              </Button>
            </div>

            {/* Inline Add Service Form */}
            {showAddService && (
              <div className="rounded-xl border border-primary/30 bg-smoke/60 p-4 space-y-3 animate-in fade-in">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  New Service Offering
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
                  <Field label="Unit / Rate Type">
                    <TextField
                      value={newService.unit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewService({ ...newService, unit: e.target.value })
                      }
                      placeholder="e.g. starting rate, per fixture"
                    />
                  </Field>
                  <Field label="Short Scope Description" className="sm:col-span-2">
                    <TextField
                      value={newService.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewService({ ...newService, description: e.target.value })
                      }
                      placeholder="e.g. Includes full mineral flush, valve inspection, and diagnostic."
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
                    Add Service to Profile
                  </Button>
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="divide-y divide-line/60">
              {formData.services.map((srv) => (
                <div key={srv.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-[15px] font-bold text-title">{srv.name}</p>
                      <Badge tone="blue" className="text-[11px] font-bold">
                        ${srv.price}
                      </Badge>
                      <span className="text-xs text-muted">/ {srv.unit}</span>
                    </div>
                    {srv.description && (
                      <p className="text-xs text-copy">{srv.description}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveService(srv.id)}
                    className="text-muted hover:text-error transition p-1"
                    title="Remove Service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* WHAT'S INCLUDED GUARANTEES */}
          <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-6 shadow-xs space-y-3">
            <div>
              <h3 className="font-display text-[16px] font-bold text-title">
                What&apos;s Included With Every Service Call
              </h3>
              <p className="text-xs text-muted">
                These trust perks are highlighted on your public profile checklist.
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
              {[
                "Free upfront itemized quote",
                "1-Year workmanship & leak warranty",
                "Floor protection & clean boot covers",
                "OEM certified plumbing parts",
                "Direct payment on 100% completion ($0 platform fee)",
                "Full clean-up of work area",
              ].map((perk) => {
                const checked = formData.includedPerks.includes(perk);
                return (
                  <label
                    key={perk}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition",
                      checked
                        ? "border-emerald-300 bg-emerald-50/50 text-emerald-950 font-semibold"
                        : "border-line/70 bg-white text-muted hover:bg-smoke"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePerk(perk)}
                      className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
                    />
                    <span>{perk}</span>
                  </label>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: IDENTITY & CONTACT OVERVIEW                           */}
      {/* ============================================================ */}
      {activeTab === "overview" && (
        <Card className="rounded-[20px] border border-line/80 bg-white p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-display text-[17px] font-bold text-title">Business Information</h3>
            <p className="text-xs text-muted">Basic business profile details shown to local homeowners.</p>
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

            <Field label="Profile Tagline / Pitch" className="sm:col-span-2">
              <TextField
                value={formData.tagline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                placeholder="e.g. Master Licensed Plumber serving residential Austin & Central Texas"
              />
            </Field>

            <Field label="Detailed Business Bio" className="sm:col-span-2">
              <TextArea
                value={formData.bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="min-h-[95px]"
                rows={3}
                placeholder="Describe your background, expertise, and customer commitment..."
              />
            </Field>
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 3: AVAILABILITY & DIRECT PAYMENT PREFERENCES             */}
      {/* ============================================================ */}
      {activeTab === "hours" && (
        <div className="space-y-6">
          {/* BUSINESS HOURS */}
          <Card className="rounded-[20px] border border-line/80 bg-white p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-display text-[17px] font-bold text-title">Business Operating Hours</h3>
              <p className="text-xs text-muted">When homeowners can expect you to be on-duty or available for bookings.</p>
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
            <div className="pt-3 border-t border-line/60">
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
                  <p className="text-sm font-semibold text-title flex items-center gap-1.5">
                    <span>24/7 Urgent Emergency Dispatch</span>
                    <Badge tone="blue" className="text-[10px]">High Demand</Badge>
                  </p>
                  <p className="text-xs text-muted">
                    Display an &quot;Emergency On-Call&quot; badge to attract homeowners with urgent water leaks or power outages.
                  </p>
                </div>
              </label>
            </div>
          </Card>

          {/* ACCEPTED DIRECT PAYMENTS */}
          <Card className="rounded-[20px] border border-line/80 bg-white p-6 shadow-xs space-y-3">
            <div>
              <h3 className="font-display text-[17px] font-bold text-title">
                Accepted Direct Payment Methods
              </h3>
              <p className="text-xs text-muted">
                Homeowners pay you directly upon 100% completion ($0 platform commission cut).
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
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
                      "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold border transition-all",
                      selected
                        ? "border-primary bg-primary text-white shadow-xs"
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
      {/* TAB 4: LICENSES, INSURANCE & CREDENTIALS                     */}
      {/* ============================================================ */}
      {activeTab === "credentials" && (
        <Card className="rounded-[20px] border border-line/80 bg-white p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-display text-[17px] font-bold text-title">
              Licenses &amp; Verification Badges
            </h3>
            <p className="text-xs text-muted">
              Official credentials displayed on your profile that unlock homeowner trust.
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
              <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-title">Checkr Background Screening</p>
                <p className="text-[11px] text-muted">Identity and criminal background verified annually.</p>
              </div>
            </div>
            <Badge tone="green">Cleared &amp; Verified</Badge>
          </div>
        </Card>
      )}

      {/* ============================================================ */}
      {/* TAB 5: PORTFOLIO & WORK PHOTOS                               */}
      {/* ============================================================ */}
      {activeTab === "portfolio" && (
        <Card className="rounded-[20px] border border-line/80 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-[17px] font-bold text-title">
                Project Gallery Photos ({formData.portfolio.length})
              </h3>
              <p className="text-xs text-muted">
                Photos of your recent completed jobs displayed in your public portfolio.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowAddPhoto(!showAddPhoto)}
              className="rounded-xl border border-line text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5 mr-1 text-primary" />
              Add Photo
            </Button>
          </div>

          {/* Add Photo Form */}
          {showAddPhoto && (
            <div className="rounded-xl border border-primary/30 bg-smoke/60 p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Add Project Photo
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Project Title / Caption">
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
                  Add to Gallery
                </Button>
              </div>
            </div>
          )}

          {/* Photos Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            {formData.portfolio.map((item, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-smoke border border-line shadow-xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3 text-white">
                  <span className="text-xs font-semibold truncate pr-2">{item.title}</span>
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
      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-2xl border border-line/80 bg-white/95 px-6 py-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <span>All updates immediately reflect across homeowner searches and your public storefront.</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/browse-pros/pro-1"
            target="_blank"
            className="text-xs font-semibold text-muted hover:text-primary transition flex items-center gap-1"
          >
            <span>Preview Profile</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Button
            type="button"
            onClick={handleSaveAll}
            className="rounded-full shadow-xs text-xs sm:text-sm font-semibold px-6"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
