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
    <aside className="w-full shrink-0 self-start md:w-56 lg:w-60">
      <nav
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:flex-col md:overflow-visible md:rounded-[14px] md:border md:border-line md:bg-white md:p-3"
        aria-label="Account"
      >
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/account" && pathname.startsWith("/account/jobs")) ||
            (item.href === "/pro/jobs" && pathname.startsWith("/pro/jobs/")) ||
            (item.href === "/account/messages" && pathname.startsWith("/account/messages")) ||
            (item.href === "/pro/messages" && pathname.startsWith("/pro/messages"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-[10px] px-3 py-2.5 font-display text-sm font-medium",
                active
                  ? "bg-primary text-white"
                  : "border border-line bg-white text-title hover:bg-smoke md:border-transparent",
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
