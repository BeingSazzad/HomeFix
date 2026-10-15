"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { setTwoFactor } from "@/redux/slices/featuresSlice";
import { logout } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

export function SecuritySettings({ role }: { role: "homeowner" | "pro" }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const twoFactorOn = useAppSelector((state) => state.features.twoFactorOn);
  const [exported, setExported] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[28px]">Security & privacy</h1>
        <p className="mt-1 text-sm text-copy">Demo controls. No backend yet.</p>
      </div>

      <Card className="divide-y divide-line p-0">
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg">Two-factor authentication</h2>
              <p className="mt-1 text-sm text-copy">Status: {twoFactorOn ? "On" : "Off"}</p>
            </div>
            <Button type="button" size="sm" onClick={() => dispatch(setTwoFactor(!twoFactorOn))}>
              {twoFactorOn ? "Turn off" : "Turn on"}
            </Button>
          </div>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg">Export data</h2>
              <p className="mt-1 text-sm text-copy">{exported ? "Export started." : "Download a demo JSON file."}</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setExported(true);
                const blob = new Blob(
                  [JSON.stringify({ role, exportedAt: new Date().toISOString() }, null, 2)],
                  { type: "application/json" },
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "localhomefix-export.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download
            </Button>
          </div>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg">Delete account</h2>
              <p className="mt-1 text-sm text-copy">Clears this demo session.</p>
            </div>
            {!deleteArmed ? (
              <Button type="button" size="sm" variant="ghost" onClick={() => setDeleteArmed(true)}>
                Request delete
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  dispatch(logout());
                  router.push("/");
                }}
              >
                Confirm
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
