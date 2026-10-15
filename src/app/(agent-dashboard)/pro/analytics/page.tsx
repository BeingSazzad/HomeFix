import { Card } from "@/components/ui/card";

const rows = [
  { label: "Response rate", value: "92%" },
  { label: "Lead to hire", value: "25%" },
  { label: "Quotes sent", value: "2" },
  { label: "Jobs completed", value: "1" },
];

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-[28px]">Analytics</h1>
      <p className="mt-1 text-sm text-copy">Mock performance numbers for UI review. Nothing here is live billing data.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <Card key={row.label}>
            <p className="text-sm text-muted">{row.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-title">{row.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
