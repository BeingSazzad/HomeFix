"use client";

import { use, useState } from "react";
import Link from "next/link";
import { AppStatusBadge } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextArea } from "@/components/ui/field";
import { decisionRules } from "@/lib/admin-model";
import { decideApplication } from "@/redux/slices/adminSlice";
import {
  addNotification,
  setApplicationCleared,
  setApplicationNeedsInfo,
  setApplicationRejected,
} from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const app = useAppSelector((state) => state.admin.applications.find((item) => item.id === id));
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState("");

  if (!app) {
    return (
      <div className="space-y-3">
        <Link href="/admin/applications" className="text-sm font-semibold text-primary">
          ← Applications
        </Link>
        <p className="text-sm text-copy">Application not found.</p>
      </div>
    );
  }

  function syncLivePro(status: "cleared" | "needs_info" | "rejected", reason?: string) {
    if (!app || app.proId !== "pro-1") return;
    if (status === "cleared") dispatch(setApplicationCleared());
    if (status === "needs_info") dispatch(setApplicationNeedsInfo(reason || "More information required."));
    if (status === "rejected") dispatch(setApplicationRejected(reason || "Application rejected."));
    dispatch(
      addNotification({
        title:
          status === "cleared"
            ? "You’re cleared"
            : status === "needs_info"
              ? "More info needed"
              : "Application update",
        body:
          status === "cleared"
            ? "Admin cleared your listing. Start membership to quote."
            : reason || "Check your application.",
        href: "/pro/application",
        createdAt: "Just now",
        role: "pro",
      }),
    );
  }

  function decide(status: "cleared" | "needs_info" | "rejected") {
    if (!app) return;
    if (status !== "cleared" && note.trim().length < 8) {
      setSaved("Add a short reviewer note the pro can act on.");
      return;
    }
    dispatch(decideApplication({ id: app.id, status, note: note.trim() || undefined }));
    syncLivePro(status, note.trim());
    setNote("");
    setSaved(
      status === "cleared"
        ? "Cleared. This trade can appear on Find a Pro once listing is live."
        : status === "needs_info"
          ? "Note sent. The pro sees it on Application."
          : "Rejected with reason.",
    );
  }

  return (
    <div className="space-y-5">
      <Link href="/admin/applications" className="text-sm font-semibold text-primary">
        ← Applications
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-semibold text-title">{app.businessName}</h1>
          <p className="mt-1 text-sm text-muted">
            {app.contactName} · {app.trade} · {app.city}, {app.state} {app.zip}
          </p>
        </div>
        <AppStatusBadge status={app.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4 p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-title">Credentials</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            {[
              ["Email", app.email],
              ["Phone", app.phone],
              ["License", app.licenseNumber],
              ["License file", app.licenseFile],
              ["Insurance", `${app.insuranceCarrier} · ${app.insuranceCoverage}`],
              ["COI file", app.insuranceFile],
              ["Identity", app.identityStatus === "verified" ? "Verified" : "Pending"],
              ["Radius", `${app.radiusMiles} mi`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="font-medium text-title">{v}</dd>
              </div>
            ))}
          </dl>
          {app.reviewerNote ? (
            <p className="rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
              Last note: {app.reviewerNote}
            </p>
          ) : null}
        </Card>

        <Card className="space-y-3 p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-title">Decision</h2>
          <p className="text-xs leading-5 text-muted">{decisionRules.approve}</p>
          <Field label="Reviewer note">
            <TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Required for hold or reject. Optional on approve."
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => decide("cleared")}>
              Approve
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => decide("needs_info")}>
              Request info
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => decide("rejected")}>
              Reject
            </Button>
          </div>
          {saved ? <p className="text-sm text-success">{saved}</p> : null}
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-title">History</h2>
        <ul className="mt-3 space-y-2">
          {app.history.map((item) => (
            <li key={item.id} className="rounded-[12px] border border-line bg-surface px-3 py-2 text-sm">
              <p className="font-semibold text-title">
                {item.action.replace("_", " ")} · {item.at} · {item.by}
              </p>
              {item.note ? <p className="mt-0.5 text-copy">{item.note}</p> : null}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
