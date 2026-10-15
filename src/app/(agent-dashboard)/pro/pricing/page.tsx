"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProAccessStrip } from "@/components/shared/pro-access-strip";
import { startMembership } from "@/redux/slices/marketplaceSlice";
import {
  setMembershipCancelled,
  setMembershipPaused,
  unlockContact,
} from "@/redux/slices/featuresSlice";
import { useRoleAccess } from "@/hooks/use-role-access";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function PricingPage() {
  const dispatch = useAppDispatch();
  const { access, applicationStatus } = useRoleAccess();
  const active = useAppSelector((state) => state.marketplace.membershipActive);
  const paused = useAppSelector((state) => state.features.membershipPaused);
  const cancelled = useAppSelector((state) => state.features.membershipCancelled);
  const trialDaysLeft = useAppSelector((state) => state.features.trialDaysLeft);
  const invoices = useAppSelector((state) => state.features.invoices);

  function activateMembership() {
    dispatch(startMembership());
    dispatch(setMembershipPaused(false));
    dispatch(setMembershipCancelled(false));
    if (applicationStatus === "cleared") dispatch(unlockContact());
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[28px]">Membership</h1>
        <p className="mt-1 text-sm text-copy">$19.99/mo after 3 free months. One plan — not repair packages.</p>
      </div>
      <ProAccessStrip />
      <Card>
        <p className="font-display text-4xl font-bold text-title">
          $19.99<span className="text-lg text-copy">/month</span>
        </p>
        <p className="mt-2 text-sm text-copy">
          Start unlocks quote + contact (if cleared). Pause or cancel locks them again.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {!active || cancelled ? (
            <Button type="button" onClick={activateMembership}>
              {cancelled ? "Restart" : "Start free trial"}
            </Button>
          ) : (
            <>
              <Badge>{paused ? "Paused" : "Active"}</Badge>
              <p className="w-full text-sm text-copy">{trialDaysLeft} trial days left (demo).</p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (paused) {
                    dispatch(setMembershipPaused(false));
                    if (applicationStatus === "cleared") dispatch(unlockContact());
                  } else {
                    dispatch(setMembershipPaused(true));
                  }
                }}
              >
                {paused ? "Resume" : "Pause"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => dispatch(setMembershipCancelled(true))}>
                Cancel
              </Button>
            </>
          )}
        </div>
        {active ? (
          <p className="mt-4 text-sm font-semibold text-title">
            Contact: {access.canSeeContact ? "Unlocked" : "Locked"}
          </p>
        ) : null}
      </Card>
      <Card>
        <h2 className="text-lg">Invoices</h2>
        <div className="mt-3 divide-y divide-line">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex justify-between gap-2 py-3 text-sm">
              <div>
                <p className="font-semibold text-title">{invoice.id.toUpperCase()}</p>
                <p className="text-muted">{invoice.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-title">{invoice.amount}</p>
                <p className="capitalize text-muted">{invoice.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
