"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function AppliedBanner() {
  const search = useSearchParams();
  if (search.get("applied") !== "1") return null;

  return (
    <p className="rounded-[10px] bg-[#E8F6EE] px-4 py-3 text-sm text-copy">
      <span className="font-semibold text-title">Submitted. </span>
      Next:{" "}
      <Link href="/pro/verification" className="font-semibold text-primary">
        Verification
      </Link>
      , then membership.
    </p>
  );
}
