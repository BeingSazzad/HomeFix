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
      <h1 className="text-[24px] md:text-[28px]">Saved professionals</h1>
      <p className="mt-0.5 text-sm text-copy">Shortlist to invite on a request later.</p>
      {list.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No saved pros yet"
            description="Open a profile and tap Save."
            actionLabel="Find a pro"
            href="/browse-pros"
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((pro) => (
            <ProCard key={pro.id} pro={pro} />
          ))}
        </div>
      )}
      <p className="mt-5 text-sm text-copy">
        Prefer browsing?{" "}
        <Link href="/browse-pros" className="font-semibold text-primary">
          Find a Pro
        </Link>
      </p>
    </div>
  );
}
