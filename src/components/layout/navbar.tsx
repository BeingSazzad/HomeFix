"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AccountMenu } from "@/components/layout/account-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/redux/hooks";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/browse-pros", label: "Find a Pro" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M12 2.2C12 2.2 6.8 9.1 6.8 13.4c0 2.9 2.3 5.4 5.2 5.4s5.2-2.5 5.2-5.4C17.2 9.1 12 2.2 12 2.2Zm0 14.1c-1.5 0-2.7-1.3-2.7-2.9 0-.4.3-.7.7-.7s.7.3.7.7c0 .8.6 1.5 1.3 1.5.4 0 .7.3.7.7s-.3.7-.7.7Z" />
        </svg>
      </span>
      <span className="font-display text-[24px] font-bold tracking-tight text-title">
        LocalHomeFix
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const ctaHref = user?.role === "pro" ? "/pro/jobs" : "/account/post-job";
  const ctaLabel = user?.role === "pro" ? "Browse jobs" : "Create a request";

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_10px_30px_color-mix(in_srgb,var(--ink)_6%,transparent)]">
      <div className="container-site flex h-[92px] items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-display text-[16px] font-semibold text-title transition-colors hover:text-primary",
                pathname === link.href && "text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <>
              <Button href={ctaHref} size="sm">
                {ctaLabel}
              </Button>
              <AccountMenu user={user} />
            </>
          ) : (
            <>
              <Link href="/login" className="font-display text-[15px] font-semibold text-title hover:text-primary">
                Log in
              </Link>
              <Button href="/signup">Create a request</Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          {user ? <AccountMenu user={user} /> : null}
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5 text-title" /> : <Menu className="h-5 w-5 text-title" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {publicLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-display font-medium text-title">
                {link.label}
              </Link>
            ))}
            {user ? (
              <Button href={ctaHref} size="sm">
                {ctaLabel}
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="font-display font-medium text-title">
                  Log in
                </Link>
                <Button href="/signup" size="sm">
                  Create a request
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
