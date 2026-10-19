import Link from "next/link";
import { cn } from "@/lib/cn";

export interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  href?: string;
}

/**
 * Modern, architectural mark representing Home (roof & structure) + Fix (precision verified check).
 */
export function LogoIcon({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dimensions = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }[size];

  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-[12px] bg-gradient-to-br from-[#0d56d6] via-[#0b4ec7] to-[#009ae5] text-white shadow-[0_4px_14px_rgba(13,86,214,0.30)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(13,86,214,0.40)]",
        dimensions,
        className,
      )}
      aria-hidden="true"
    >
      {/* Subtle top rim highlight */}
      <span className="pointer-events-none absolute inset-0 rounded-[12px] border border-white/25" />

      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[62%] w-[62%] drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
      >
        {/* Chimney */}
        <path
          d="M22 11.5V7.5C22 7.22386 22.2239 7 22.5 7H24.5C24.7761 7 25 7.22386 25 7.5V13.8"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Pitched Roof Chevron */}
        <path
          d="M8.5 16L18 8.5L27.5 16"
          stroke="white"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Foundation Pillars forming the "H" structure */}
        <path
          d="M11.5 17.5V25C11.5 25.5523 11.9477 26 12.5 26H13.5"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M24.5 17.5V25C24.5 25.5523 24.0523 26 23.5 26H22.5"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Dynamic Precision Checkmark (The "Fix" & Verified Quality) */}
        <path
          d="M14 21.2L17 24.2L22.5 17.8"
          stroke="#38bdf8"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Logo({
  variant = "light",
  size = "md",
  showText = true,
  className,
  href = "/",
}: LogoProps) {
  const textSizes = {
    sm: "text-[18px]",
    md: "text-[21px]",
    lg: "text-[24px]",
  }[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <LogoIcon size={size} />
      {showText && (
        <span
          className={cn(
            "font-display font-medium tracking-tight leading-none",
            textSizes,
            variant === "light" ? "text-title" : "text-white",
          )}
        >
          <span>LocalHome</span>
          <span
            className={cn(
              "font-bold transition-colors",
              variant === "light"
                ? "text-primary group-hover:text-[#009ae5]"
                : "text-[#38bdf8] group-hover:text-white",
            )}
          >
            Fix
          </span>
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
      {content}
    </Link>
  );
}
