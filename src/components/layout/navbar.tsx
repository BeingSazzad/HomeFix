"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { AccountMenu } from "@/components/layout/account-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";
import { signupHref } from "@/lib/role-access";
import { useAppSelector } from "@/redux/hooks";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/browse-pros", label: "Find Pros" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const ctaHref = user?.role === "pro" ? "/pro/jobs" : "/account/post-job";
  const ctaLabel = user?.role === "pro" ? "Browse Jobs ↗" : "Get Free Quote ↗";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-line/70 shadow-[0_4px_20px_color-mix(in_srgb,var(--ink)_4%,transparent)]">
      <div className="container-site flex h-[74px] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {publicLinks.map((link) => (
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

        <div className="hidden items-center gap-5 lg:flex">
          {user ? (
            <>
              <Button href={ctaHref} size="sm" className="font-medium">
                {ctaLabel}
              </Button>
              <AccountMenu user={user} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-sans text-[14px] font-medium text-title hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Button href={signupHref("/account/post-job")} size="sm" className="font-medium">
                Get Started <ArrowUpRight className="h-4 w-4 ml-0.5" />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          {user ? <AccountMenu user={user} /> : null}
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
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-base font-medium text-title py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-line/60 flex flex-col gap-2">
              {user ? (
                <Button href={ctaHref} size="sm" className="w-full justify-center">
                  {ctaLabel}
                </Button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="font-display font-medium text-title py-1 text-center"
                  >
                    Sign in
                  </Link>
                  <Button
                    href={signupHref("/account/post-job")}
                    size="sm"
                    className="w-full justify-center"
                  >
                    Get Started ↗
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}