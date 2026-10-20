"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProAccessStrip } from "@/components/shared/pro-access-strip";
import { selectAllJobs, selectAllQuotes } from "@/lib/marketplace";
import { useRoleAccess } from "@/hooks/use-role-access";
import { useAppSelector } from "@/redux/hooks";

export default function ProOverviewPage() {
  const jobs = useAppSelector(selectAllJobs);
  const quotes = useAppSelector(selectAllQuotes);
  const { membershipActive } = useRoleAccess();
  const hired = Object.keys(useAppSelector((state) => state.marketplace.hiredByJob)).length;
  const openJobs = jobs.filter((job) => job.status !== "completed" && job.status !== "cancelled").length;

  const stats = [
    { label: "Open jobs", value: String(openJobs) },
    { label: "Quotes", value: String(quotes.filter((q) => q.proId === "pro-1" || q.id.startsWith("quote-local")).length) },
    { label: "Hires", value: String(hired) },
    { label: "Membership", value: membershipActive ? "On" : "Off" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-line/70 pb-4 pt-1">
        <h1 className="font-display text-[22px] sm:text-[26px] font-semibold text-title tracking-tight">
          Pro Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Track active jobs, quotes, and profile performance.
        </p>
      </div>
      <ProAccessStrip />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="py-4">
            <p className="text-xs uppercase tracking-wide text-muted">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-title">{item.value}</p>
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button href="/pro/jobs" size="sm">
          Available jobs
        </Button>
        <Button href="/pro/pricing" size="sm" variant="ghost">
          {membershipActive ? "Membership" : "Start trial"}
        </Button>
        <Button href="/pro/verification" size="sm" variant="ghost">
          Verification
        </Button>
      </div>
    </div>
  );
}
