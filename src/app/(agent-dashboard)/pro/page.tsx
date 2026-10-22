"use client";

import { Button } from "@/components/ui/button";
import { ProAccessStrip } from "@/components/shared/pro-access-strip";
import { ProAnalytics } from "@/components/web-pages/pro-analytics";
import { useRoleAccess } from "@/hooks/use-role-access";
import { Briefcase } from "lucide-react";

export default function ProOverviewPage() {
  const { membershipActive } = useRoleAccess();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/70 pb-5 pt-1">
        <div>
          <h1 className="font-display text-[22px] sm:text-[26px] font-semibold text-title tracking-tight">
            Pro Dashboard & Performance
          </h1>
          <p className="mt-1 text-sm text-muted">
            Track your annual earnings, completed jobs, client growth, and active leads.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button href="/pro/jobs" size="sm" className="font-semibold shadow-xs">
            <Briefcase className="h-4 w-4 mr-1.5" />
            Find Available Jobs ↗
          </Button>
          <Button href="/pro/pricing" size="sm" variant="ghost">
            {membershipActive ? "Subscription ↗" : "Start Trial ↗"}
          </Button>
          <Button href="/pro/verification" size="sm" variant="ghost">
            Verification ↗
          </Button>
        </div>
      </div>

      <ProAccessStrip />

      {/* Senior Product Designer Executive Analytics Section */}
      <ProAnalytics />
    </div>
  );
}
