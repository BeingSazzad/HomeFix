import { Badge } from "@/components/ui/badge";
import type { AdminAppStatus, DisputeStatus, ListingVisibility } from "@/lib/admin-data";
import { appStatusLabel, disputeStatusLabel } from "@/lib/admin-data";

export function AppStatusBadge({ status }: { status: AdminAppStatus }) {
  const tone =
    status === "cleared" ? "green" : status === "needs_info" ? "amber" : status === "rejected" ? "orange" : "blue";
  return <Badge tone={tone}>{appStatusLabel[status]}</Badge>;
}

export function DisputeBadge({ status }: { status: DisputeStatus }) {
  const tone =
    status === "open" ? "orange" : status === "in_review" ? "amber" : status === "resolved" ? "green" : "slate";
  return <Badge tone={tone}>{disputeStatusLabel[status]}</Badge>;
}

export function ListingBadge({ visibility }: { visibility: ListingVisibility }) {
  const tone = visibility === "live" ? "green" : visibility === "suspended" ? "orange" : "slate";
  const label = visibility === "live" ? "Live" : visibility === "suspended" ? "Suspended" : "Hidden";
  return <Badge tone={tone}>{label}</Badge>;
}

export function AdminHeader({
  title,
  count,
  hint,
}: {
  title: string;
  count?: number;
  hint?: string;
}) {
  return (
    <div className="border-b border-line/70 pb-4 pt-1">
      <div className="flex flex-wrap items-center gap-2.5">
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-title sm:text-[26px]">{title}</h1>
        {count != null ? (
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-smoke px-2.5 py-0.5 text-xs font-semibold text-primary">
            {count}
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}
