import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function StatRow({
  items,
}: {
  items: { value: string; label: string; icon?: LucideIcon }[];
}) {
  const cols =
    items.length === 3
      ? "sm:grid-cols-3"
      : items.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 xl:grid-cols-4";

  return (
    <div className={cn("grid gap-5", cols)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <article key={item.label} className="rounded-[20px] border border-line bg-white p-6 soft-shadow md:p-7">
            {Icon ? (
              <span className="mb-5 grid h-12 w-12 place-items-center rounded-[10px] bg-smoke text-primary">
                <Icon className="h-5 w-5" />
              </span>
            ) : null}
            <p className="font-display text-[36px] font-bold leading-none text-title">{item.value}</p>
            <p className="mt-3 text-[16px] leading-6 text-copy">{item.label}</p>
          </article>
        );
      })}
    </div>
  );
}
