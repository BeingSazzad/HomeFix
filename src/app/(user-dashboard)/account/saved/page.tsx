"use client";

import Link from "next/link";
import { ProCard } from "@/components/shared/pro-card";
import { EmptyState } from "@/components/ui/empty-state";
import { professionals } from "@/Mockdata";
import { useAppSelector } from "@/redux/hooks";

export default function SavedProsPage() {
  const favorites = useAppSelector((state) => state.features.favorites);
  const list = professionals.filter((pro) => favorites.includes(pro.id) && pro.clearance === "cleared");

  return (
    <div>
      <h1 className="text-[28px]">Saved professionals</h1>
      <p className="mt-1 text-sm text-copy">Shortlist cleared pros to invite on a request later.</p>
      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No saved pros yet"
            description="Open a profile and tap Save."
            actionLabel="Find a pro"
            href="/browse-pros"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((pro) => (
            <ProCard key={pro.id} pro={pro} />
          ))}
        </div>
      )}
      <p className="mt-6 text-sm text-copy">
        Prefer browsing?{" "}
        <Link href="/browse-pros" className="font-semibold text-primary">
          Find a Pro
        </Link>
      </p>
    </div>
  );
}
