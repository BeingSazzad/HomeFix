import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Projects available", value: "4" },
  { label: "Quotes sent", value: "2" },
  { label: "Jobs won", value: "1" },
  { label: "Membership", value: "Trial" },
];

export default function ProOverviewPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[28px]">Pro dashboard</h1>
        <p className="mt-1 text-sm text-copy">
          Approval plus an active trial or subscription is required to view homeowner contact details.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="py-5">
            <p className="text-xs uppercase tracking-wide text-muted">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-title">{item.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="text-lg">Membership</h2>
        <p className="mt-2 text-sm leading-6 text-copy">
          $19.99/month after the first three months free. LocalHomeFix never handles project pricing or payment.
        </p>
        <div className="mt-4">
          <Button href="/pro/pricing" size="sm">
            Review membership
          </Button>
        </div>
      </Card>
    </div>
  );
}
