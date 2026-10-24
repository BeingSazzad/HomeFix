"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminHeader, AppStatusBadge } from "@/components/admin/admin-ui";
import { NativeSelect } from "@/components/ui/field";
import { appStatusLabel, type AdminAppStatus } from "@/lib/admin-data";
import { useAppSelector } from "@/redux/hooks";

const filters: { id: "all" | AdminAppStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "submitted", label: "In review" },
  { id: "needs_info", label: "Needs info" },
  { id: "cleared", label: "Cleared" },
  { id: "rejected", label: "Rejected" },
];

export default function AdminApplicationsPage() {
  const applications = useAppSelector((state) => state.admin.applications);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  const list = useMemo(() => {
    const rows = filter === "all" ? applications : applications.filter((a) => a.status === filter);
    return [...rows].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }, [applications, filter]);

  return (
    <div className="space-y-5">
      <AdminHeader
        title="Applications"
        count={applications.filter((a) => a.status === "submitted" || a.status === "needs_info").length}
        hint="Approve only when license, insurance, and identity check are enough for a public listing."
      />

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              filter === item.id ? "border-primary bg-primary text-white" : "border-line bg-white text-title"
            }`}
          >
            {item.label}
          </button>
        ))}
        <div className="sr-only">
          <NativeSelect value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
            {filters.map((item) => (
              <option key={item.id} value={item.id}>
                {appStatusLabel[item.id as AdminAppStatus] ?? item.label}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-line bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Trade</th>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((app) => (
              <tr key={app.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/admin/applications/${app.id}`} className="font-semibold text-title hover:text-primary">
                    {app.businessName}
                  </Link>
                  <p className="text-xs text-muted">{app.contactName}</p>
                </td>
                <td className="px-4 py-3 text-copy">{app.trade}</td>
                <td className="px-4 py-3 text-copy">
                  {app.city}, {app.state}
                </td>
                <td className="px-4 py-3 text-copy">{app.submittedAt}</td>
                <td className="px-4 py-3">
                  <AppStatusBadge status={app.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 ? <p className="px-4 py-6 text-sm text-muted">Nothing in this view.</p> : null}
      </div>
    </div>
  );
}
