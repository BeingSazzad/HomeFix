"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { setVerification, type VerifyKey } from "@/redux/slices/marketplaceSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const items: {
  key: VerifyKey;
  title: string;
  note: string;
  action: string;
}[] = [
  {
    key: "identity",
    title: "Stripe Identity",
    note: "Stripe hosts the ID check. LocalHomeFix stores the result, not the document.",
    action: "Start identity check",
  },
  {
    key: "screening",
    title: "Checkr screening",
    note: "Checkr emails a hosted invite. Do not send SSN, DOB, or report files here.",
    action: "Request invite",
  },
  {
    key: "license",
    title: "License evidence",
    note: "Upload trade license evidence. Self-reported claims do not create a badge.",
    action: "Upload license",
  },
  {
    key: "insurance",
    title: "Liability insurance",
    note: "Upload policy evidence. Admin clearance is separate from screening.",
    action: "Upload insurance",
  },
];

const labels = {
  idle: "Not started",
  started: "In progress",
  done: "Submitted",
} as const;

export default function VerificationPage() {
  const dispatch = useAppDispatch();
  const verification = useAppSelector((state) => state.marketplace.verification);
  const [files, setFiles] = useState<Record<string, string>>({});

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px]">Verification</h1>
          <p className="mt-1 text-sm text-copy">
            Screening and marketplace clearance are separate. Public listings start after Cleared.
          </p>
        </div>
        <Button href="/pro/application" size="sm" variant="ghost">
          Application status
        </Button>
      </div>
      <div className="mt-6 grid gap-3">
        {items.map((item) => {
          const status = verification[item.key];
          return (
            <Card key={item.key}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg">{item.title}</h2>
                    <Badge>{labels[status]}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-copy">{item.note}</p>
                  {(item.key === "license" || item.key === "insurance") && status !== "done" ? (
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="mt-3 block w-full text-sm text-copy"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        setFiles((prev) => ({ ...prev, [item.key]: file.name }));
                        dispatch(setVerification({ key: item.key, status: "started" }));
                      }}
                    />
                  ) : null}
                  {files[item.key] ? (
                    <p className="mt-2 text-[12px] text-muted">Selected: {files[item.key]}</p>
                  ) : null}
                </div>
                {status !== "done" ? (
                  <Button
                    type="button"
                    size="sm"
                    variant={status === "idle" ? "primary" : "ghost"}
                    onClick={() =>
                      dispatch(
                        setVerification({
                          key: item.key,
                          status: status === "idle" ? "started" : "done",
                        }),
                      )
                    }
                  >
                    {status === "idle" ? item.action : "Mark complete"}
                  </Button>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
