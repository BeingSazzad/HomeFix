"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const controlClass =
  "w-full min-h-[50px] rounded-[10px] border border-line bg-white px-4 pr-16 text-[16px] text-title outline-none transition-colors placeholder:text-muted focus:border-primary";

export function PasswordField({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative block">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(controlClass, className)}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute right-3 top-1/2 -translate-y-1/2 font-display text-sm font-bold text-primary"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </span>
  );
}
