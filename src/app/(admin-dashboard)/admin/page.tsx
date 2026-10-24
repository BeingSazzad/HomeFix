"use client";

import Link from "next/link";
import { AdminHeader, AppStatusBadge, DisputeBadge } from "@/components/admin/admin-ui";
import { Card } from "@/components/ui/card";
import { selectAllJobs } from "@/lib/marketplace";
import { adminLoop } from "@/lib/admin-model";
import { useAppSelector } from "@/redux/hooks";

export default function AdminOverviewPage() {
  const applications = useAppSelector((state) => state.admin.applications);
  const disputes = useAppSelector((state) => state.admin.disputes);
  const activity = useAppSelector((state) => state.admin.activity);
  const listingStatus = useAppSelector((state) => state.admin.listingStatus);
  const jobs = useAppSelector(selectAllJobs);
  const ready = useAppSelector((state) => state.admin.hydrated);

  const queue = applications.filter((a) => a.status === "submitted" || a.status === "needs_info");
  const openDisputes = disputes.filter((d) => d.status === "open" || d.status === "in_review");
  const suspended = Object.values(listingStatus).filter((v) => v === "suspended").length;
  const liveJobs = jobs.filter((j) => j.status !== "cancelled" && j.status !== "completed").length;

  if (!ready) {
    return <p className="text-sm text-muted">Loading ops…</p>;
  }

  const pulse = [
    { label: "In the queue", value: String(queue.length), href: "/admin/applications", hint: "Submitted + needs info" },
    { label: "Open disputes", value: String(openDisputes.length), href: "/admin/disputes", hint: "Needs a decision" },
    { label: "Suspended listings", value: String(suspended), href: "/admin/professionals", hint: "Hidden from Find a Pro" },
    { label: "Open requests", value: String(liveJobs), href: "/admin/requests", hint: "Marketplace in flight" },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Operations"
        hint="Clear applications first. Then disputes. Listings stay public only after clearance."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {pulse.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-[16px] border border-line/80 bg-white px-4 py-4 shadow-xs transition hover:border-primary/30 hover:shadow-md"
          >
            <p className="font-display text-2xl font-bold text-title">{item.value}</p>
            <p className="mt-1 text-sm font-semibold text-title">{item.label}</p>
            <p className="mt-0.5 text-xs text-muted">{item.hint}</p>
          </Link>
        ))}
      </div>

      <Card className="p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">Today’s order</p>
        <ol className="mt-3 flex flex-wrap gap-2">
          {adminLoop.map((step, i) => (
            <li
              key={step}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-copy"
            >
              <span className="text-primary">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-title">Application queue</h2>
            <Link href="/admin/applications" className="text-sm font-semibold text-primary">
              Open all
            </Link>
          </div>
          {queue.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Queue is clear.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {queue.map((app) => (
                <li key={app.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <Link href={`/admin/applications/${app.id}`} className="font-semibold text-title hover:text-primary">
                      {app.businessName}
                    </Link>
                    <p className="text-xs text-muted">
                      {app.trade} · {app.city} · {app.submittedAt}
                    </p>
                  </div>
                  <AppStatusBadge status={app.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-title">Disputes</h2>
            <Link href="/admin/disputes" className="text-sm font-semibold text-primary">
              Open all
            </Link>
          </div>
          {openDisputes.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No open disputes.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {openDisputes.map((item) => (
                <li key={item.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-title">{item.jobTitle}</p>
                    <DisputeBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {item.homeownerName} · {item.proName}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-title">Recent activity</h2>
        <ul className="mt-3 divide-y divide-line">
          {activity.slice(0, 6).map((item) => (
            <li key={item.id} className="py-3">
              <p className="text-xs text-muted">{item.at}</p>
              <p className="font-semibold text-title">{item.title}</p>
              <p className="text-sm text-copy">{item.body}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
