import Link from "next/link";
import { cn } from "@/lib/cn";

export function AccessNotice({
  title,
  body,
  href,
  linkLabel,
  tone = "default",
}: {
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
  tone?: "default" | "warn" | "ok";
}) {
  return (
    <div
      className={cn(
        "rounded-[10px] px-4 py-3 text-sm leading-6",
        tone === "warn" && "bg-[#FFF4E5] text-copy",
        tone === "ok" && "bg-[#E8F6EE] text-copy",
        tone === "default" && "bg-smoke text-copy",
      )}
    >
      <p className="font-display text-sm font-bold text-title">{title}</p>
      <p className="mt-1">{body}</p>
      {href && linkLabel ? (
        <p className="mt-2">
          <Link href={href} className="font-semibold text-primary">
            {linkLabel}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
