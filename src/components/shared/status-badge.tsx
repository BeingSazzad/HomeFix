import { Badge } from "@/components/ui/badge";
import { statusLabels } from "@/Mockdata";
import type { JobStatus } from "@/types";

const tones: Record<JobStatus, "blue" | "green" | "amber" | "slate" | "orange"> = {
  draft: "slate",
  active: "green",
  getting_quotes: "blue",
  quotes_in: "blue",
  hired: "orange",
  scheduled: "amber",
  in_progress: "amber",
  completed: "green",
  cancelled: "slate",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return <Badge tone={tones[status]}>{statusLabels[status]}</Badge>;
}
