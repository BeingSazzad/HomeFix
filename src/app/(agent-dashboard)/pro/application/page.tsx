"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppliedBanner } from "@/components/web-pages/applied-banner";
import {
  saveApplicationDraft,
  setApplicationCleared,
  setApplicationNeedsInfo,
  setApplicationRejected,
  submitApplication,
} from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const labels = {
  draft: "Draft",
  submitted: "Under review",
  needs_info: "Needs info",
  rejected: "Rejected",
  cleared: "Cleared",
} as const;

export default function ProApplicationPage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.features.applicationStatus);
  const reason = useAppSelector((state) => state.features.rejectionReason);
  const draft = useAppSelector((state) => state.features.applicationDraft);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[28px]">Application</h1>
        <p className="mt-1 text-sm text-copy">
          {status === "cleared"
            ? "Cleared — start membership to quote."
            : "Waiting on review before the job board opens."}
        </p>
      </div>
      <Suspense fallback={null}>
        <AppliedBanner />
      </Suspense>
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg">Status</h2>
          <Badge>{labels[status]}</Badge>
        </div>
        {reason ? <p className="mt-3 text-sm text-copy">{reason}</p> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() =>
              dispatch(
                saveApplicationDraft({
                  savedAt: new Date().toISOString(),
                  note: "Draft saved",
                }),
              )
            }
          >
            Save draft
          </Button>
          <Button type="button" size="sm" onClick={() => dispatch(submitApplication())}>
            Submit
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => dispatch(setApplicationCleared())}>
            Demo: cleared
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => dispatch(setApplicationNeedsInfo("Re-upload liability insurance."))}
          >
            Demo: needs info
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => dispatch(setApplicationRejected("Screening incomplete."))}
          >
            Demo: reject
          </Button>
        </div>
        {Object.keys(draft).length ? (
          <p className="mt-4 text-[12px] text-muted">Last draft: {draft.savedAt ?? "saved"}</p>
        ) : null}
      </Card>
      <Card>
        <h2 className="text-lg">Documents</h2>
        <p className="mt-2 text-sm text-copy">Upload license / insurance evidence (browser only in this demo).</p>
        <input type="file" accept="image/*,application/pdf" className="mt-4 block w-full text-sm text-copy" />
        <div className="mt-4">
          <Button href="/pro/verification" size="sm" variant="ghost">
            Verification center
          </Button>
        </div>
      </Card>
    </div>
  );
}
