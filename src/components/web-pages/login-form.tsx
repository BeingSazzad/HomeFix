"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextField } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { AuthLinks } from "@/components/web-pages/auth-links";
import { cn } from "@/lib/cn";
import { loginAs } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const search = useSearchParams();
  const nextPath = search.get("next");
  const roleParam = search.get("role");
  const [role, setRole] = useState<"homeowner" | "pro">(roleParam === "pro" ? "pro" : "homeowner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (roleParam === "pro" || roleParam === "homeowner") setRole(roleParam);
  }, [roleParam]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    dispatch(loginAs(role));
    if (nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")) {
      router.push(nextPath);
      return;
    }
    router.push(role === "pro" ? "/pro" : "/account");
  }

  return (
    <Card className="p-6 md:p-8">
      <h1 className="font-display text-[22px] sm:text-[24px] font-semibold leading-snug tracking-tight text-title">
        Sign in to LocalHomeFix
      </h1>
      <p className="mt-1.5 font-sans text-sm leading-relaxed text-[#757575]">
        Sign in to your account or get started with quotes and requests.
      </p>

      <div
        role="tablist"
        aria-label="Account type"
        className="mt-6 grid grid-cols-2 rounded-full border border-line bg-smoke p-1"
      >
        {(
          [
            ["homeowner", "Homeowner"],
            ["pro", "Professional"],
          ] as const
        ).map(([value, label]) => {
          const active = role === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setRole(value)}
              className={cn(
                "min-h-[44px] rounded-full font-display text-sm font-bold transition-colors",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "bg-transparent text-title hover:text-primary",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <Field label="Email">
          <TextField
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={role === "pro" ? "pro@business.com" : "you@email.com"}
            autoComplete="email"
          />
        </Field>
        <Field label="Password">
          <PasswordField
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </Field>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="font-display text-sm font-bold text-primary">
            Forgot password
          </Link>
        </div>
        {error ? <p className="text-sm text-error">{error}</p> : null}
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <AuthLinks prompt="Don't have an account?" href="/signup" label="Sign up free ↗" />
    </Card>
  );
}
