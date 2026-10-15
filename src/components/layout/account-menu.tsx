"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, KeyRound, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/cn";
import { logout } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import type { User } from "@/types";

function roleLabel(role: User["role"]) {
  if (role === "pro") return "Professional";
  if (role === "admin") return "Admin";
  return "Homeowner";
}

export function AccountMenu({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const profileHref = user.role === "pro" ? "/pro/profile" : "/account/profile";
  const passwordHref = user.role === "pro" ? "/pro/password" : "/account/password";

  const links =
    user.role === "pro"
      ? [
          { href: "/pro", label: "Dashboard" },
          { href: "/pro/jobs", label: "Available jobs" },
          { href: "/pro/messages", label: "Messages" },
          { href: "/pro/notifications", label: "Notifications" },
          { href: "/pro/pricing", label: "Membership" },
        ]
      : [
          { href: "/account", label: "My requests" },
          { href: "/account/post-job", label: "Post a request" },
          { href: "/account/messages", label: "Messages" },
          { href: "/account/saved", label: "Saved pros" },
          { href: "/account/notifications", label: "Notifications" },
        ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-[10px] py-1 pl-1 pr-2 transition-colors hover:bg-smoke"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <UserAvatar user={user} />
        <span className="hidden text-left xl:block">
          <span className="block font-display text-sm font-bold leading-tight text-title">{user.name}</span>
          <span className="block text-xs text-muted">{roleLabel(user.role)}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 overflow-hidden rounded-[14px] border border-line bg-white soft-shadow"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-4">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-title">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          </div>

          <div className="p-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={cn(
                  "block rounded-[10px] px-3 py-2.5 font-display text-sm font-medium text-title hover:bg-smoke",
                  pathname === item.href && "bg-smoke text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-line p-2">
            <Link
              href={profileHref}
              role="menuitem"
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 font-display text-sm font-medium text-title hover:bg-smoke"
            >
              <UserRound className="h-4 w-4 text-primary" />
              Profile
            </Link>
            <Link
              href={passwordHref}
              role="menuitem"
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 font-display text-sm font-medium text-title hover:bg-smoke"
            >
              <KeyRound className="h-4 w-4 text-primary" />
              Change password
            </Link>
          </div>

          <div className="border-t border-line p-2">
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left font-display text-sm font-medium text-title hover:bg-smoke"
              onClick={() => {
                dispatch(logout());
                router.push("/");
              }}
            >
              <LogOut className="h-4 w-4 text-error" />
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
