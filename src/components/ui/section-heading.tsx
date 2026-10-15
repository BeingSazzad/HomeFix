import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center")}>
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 font-display text-[13px] font-bold uppercase tracking-[0.18em]",
            light ? "text-white/70" : "text-primary",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("text-[32px] leading-[1.2] md:text-[40px]", light && "text-white")}>{title}</h2>
      {description ? (
        <p
          className={cn(
            "mt-3 max-w-lg text-[15px] leading-7",
            light ? "text-white/75" : "text-copy",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
