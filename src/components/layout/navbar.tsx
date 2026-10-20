"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Bell } from "lucide-react";
import { useState } from "react";
import { AccountMenu } from "@/components/layout/account-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";
import { signupHref } from "@/lib/role-access";
import { useAppSelector } from "@/redux/hooks";

const homeownerLinks = [
  { href: "/", label: "Home" },
  { href: "/browse-pros", label: "Find Pros" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const proLinks = [
  { href: "/pro", label: "Dashboard" },
  { href: "/pro/jobs", label: "Available Jobs" },
  { href: "/pro/messages", label: "Messages" },
  { href: "/pro/pricing", label: "Subscription" },
  { href: "/browse-pros/pro-1", label: "My Storefront" },
];

export function Navbar() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const isPro = user?.role === "pro";
  const navLinks = isPro ? proLinks : homeownerLinks;

  const [open, setOpen] = useState(false);
  const notifHref = isPro ? "/pro/notifications" : "/account/notifications";
  const unreadCount = useAppSelector((state) =>
    user ? state.features.notifications.filter((n) => !n.read && (n.role === user.role || n.role === "all")).length : 0,
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-line/70 shadow-[0_4px_20px_color-mix(in_srgb,var(--ink)_4%,transparent)]">
      <div className="container-site flex h-[74px] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-sans text-[15px] font-medium tracking-normal text-[#555] transition-colors hover:text-title",
                pathname === link.href && "text-primary font-semibold",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3.5 lg:flex">
          {user ? (
            <>
              {isPro && (
                <Link
                  href="/pro/jobs"
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-display text-xs font-semibold text-primary hover:bg-primary/10 transition"
                  title="View live homeowner job requests"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Pro Contractor</span>
                </Link>
              )}
              {/* Notification Icon Button */}
              <Link
                href={notifHref}
                className={cn(
                  "relative grid h-10 w-10 place-items-center rounded-xl border border-line/70 bg-white text-title transition-all duration-200 hover:border-primary/40 hover:bg-smoke hover:text-primary shadow-xs",
                  pathname === notifHref && "border-primary text-primary bg-smoke",
                )}
                aria-label={`Notifications (${unreadCount} unread)`}
                title="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 font-display text-[10px] font-bold text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <AccountMenu user={user} />
            </>
          ) : (
            <Button href="/login" size="sm" className="font-medium">
              Get Started <ArrowUpRight className="h-4 w-4 ml-0.5" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          {user ? (
            <>
              <Link
                href={notifHref}
                className="relative grid h-9 w-9 place-items-center rounded-xl border border-line text-title"
                aria-label={`Notifications (${unreadCount} unread)`}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <AccountMenu user={user} />
            </>
          ) : null}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-title"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-white px-5 py-5 lg:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-base font-medium text-title py-1"
              >
                {link.label}
              </Link>
            ))}
              {user ? (
                <Link
                  href={notifHref}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-[12px] bg-smoke px-4 py-2.5 font-display text-sm font-semibold text-title hover:bg-smoke/80 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Bell className="h-4 w-4 text-primary" />
                    <span>Notifications</span>
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-error px-2 py-0.5 font-display text-[11px] font-bold text-white">
                      {unreadCount} unread
                    </span>
                  )}
                </Link>
              ) : (
                <Button
                  href="/login"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="w-full justify-center"
                >
                  Get Started <ArrowUpRight className="h-4 w-4 ml-0.5" />
                </Button>
              )}
          </div>
        </div>
      ) : null}
    </header>
  );
}