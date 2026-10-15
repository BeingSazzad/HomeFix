import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-[28px]">Professional membership</h1>
      <p className="mt-1 text-sm text-copy">
        Access costs $19.99 a month after three free months. Homeowners are never charged a LocalHomeFix project fee.
      </p>
      <Card className="mt-6">
        <p className="font-display text-sm font-semibold text-primary">After approval</p>
        <p className="mt-2 font-display text-4xl font-bold text-title">
          $19.99<span className="text-lg text-copy">/month</span>
        </p>
        <p className="mt-1 text-sm text-copy">First 3 months free. Cancel anytime.</p>
        <ul className="mt-5 space-y-2 text-sm text-copy">
          <li>Eligible matched projects</li>
          <li>Direct homeowner contact after clearance</li>
          <li>Discuss scope and pricing directly</li>
          <li>No project commissions or payouts through LocalHomeFix</li>
        </ul>
        <div className="mt-6">
          <Button>Start free trial</Button>
        </div>
      </Card>
    </div>
  );
}
