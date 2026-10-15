import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const items = [
  { title: "Stripe Identity", status: "Ready to start", note: "Stripe hosts the identity session. LocalHomeFix stores the result, not the document." },
  { title: "Checkr screening", status: "Invitation needed", note: "Checkr emails a hosted invitation. Do not send SSN, DOB, or report files here." },
  { title: "License evidence", status: "Not uploaded", note: "Trade license files only. Self-reported claims do not create a badge." },
  { title: "Liability insurance", status: "Not uploaded", note: "Upload the policy evidence. Administrator review is separate from screening." },
];

export default function VerificationPage() {
  return (
    <div>
      <h1 className="text-[28px]">Verification center</h1>
      <p className="mt-1 text-sm text-copy">
        Screening clearance and marketplace clearance are separate decisions. Public visibility starts only after Cleared.
      </p>
      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <Card key={item.title}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg">{item.title}</h2>
              <Badge>{item.status}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-copy">{item.note}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
