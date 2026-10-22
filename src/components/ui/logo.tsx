import Image from "next/image";
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
 * Modern icon mark cropped from brand logo.
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
        "relative inline-grid place-items-center overflow-hidden rounded-[10px] shrink-0",
        dimensions,
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src="/logo.png"
        alt="Logo Icon"
        width={100}
        height={100}
        priority
        className="h-full w-auto max-w-none object-cover object-left"
      />
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
  const heightClasses = {
    sm: "h-9 sm:h-10",
    md: "h-[46px] sm:h-[52px]",
    lg: "h-[56px] sm:h-[62px]",
  }[size];

  const logoSrc = variant === "dark" ? "/logo-dark.png" : "/logo.png";

  const content = (
    <div className={cn("inline-flex items-center group select-none", className)}>
      <Image
        src={logoSrc}
        alt="LocalFix"
        width={320}
        height={82}
        priority
        className={cn(
          "w-auto object-contain transition-transform duration-200 group-hover:scale-102",
          heightClasses,
        )}
      />
    </div>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
    >
      {content}
    </Link>
  );
}
