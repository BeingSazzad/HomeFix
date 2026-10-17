import { cn } from "@/lib/cn";
import { trackerSteps } from "@/lib/pro-extras";
import type { JobStatus } from "@/types";

export function StatusTracker({ status }: { status: JobStatus }) {
  if (status === "cancelled") {
    return <p className="text-sm font-semibold text-muted">Request closed</p>;
  }
  if (status === "disputed") {
    return <p className="text-sm font-semibold text-error">Dispute open — support reviewing</p>;
  }

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      {trackerSteps.map((step, index) => {
        const active = (step.statuses as readonly string[]).includes(status);
        const current =
          active &&
          (index === trackerSteps.length - 1 ||
            !(trackerSteps[index + 1].statuses as readonly string[]).includes(status));
        return (
          <li key={step.key} className="flex items-center gap-2">
            {index > 0 ? <span className="text-muted">·</span> : null}
            <span
              className={cn(
                "font-display font-semibold",
                current ? "text-primary" : active ? "text-title" : "text-muted",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
