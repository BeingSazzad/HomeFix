"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function DashboardSidebar({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 rounded-[14px] border border-line bg-white p-3 md:w-60">
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/account" && pathname.startsWith("/account/jobs")) ||
            (item.href === "/pro/jobs" && pathname.startsWith("/pro/jobs/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[10px] px-3 py-2.5 font-display text-sm font-medium",
                active ? "bg-primary text-white" : "text-title hover:bg-smoke",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
