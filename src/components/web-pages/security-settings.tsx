"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { logout } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

export function SecuritySettings({ role }: { role: "homeowner" | "pro" }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [deleteArmed, setDeleteArmed] = useState(false);
  const passwordHref = role === "pro" ? "/pro/password" : "/account/password";

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-[24px] md:text-[28px]">Security</h1>
        <p className="mt-0.5 text-sm text-copy">Password and account access.</p>
      </div>

      <Card className="divide-y divide-line p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h2 className="text-base font-bold text-title">Password</h2>
            <p className="mt-0.5 text-sm text-copy">Update your sign-in password.</p>
          </div>
          <Button href={passwordHref} size="sm" variant="ghost">
            Change password
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h2 className="text-base font-bold text-title">Delete account</h2>
            <p className="mt-0.5 text-sm text-copy">Clears this demo session.</p>
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
              Confirm delete
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
