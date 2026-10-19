import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-4xl text-center", className)}>
      {eyebrow ? (
        <div className={cn("mb-3 sm:mb-3.5", align === "center" && "flex justify-center")}>
          <p
            className={cn(
              "font-geist text-[13px] sm:text-[14px] font-medium tracking-normal",
              light ? "text-white/75" : "text-[#757575]",
            )}
          >
            {eyebrow}
          </p>
        </div>
      ) : null}
      <h2
        className={cn(
          "font-geist text-[32px] sm:text-[40px] md:text-[48px] font-medium leading-[1.125] tracking-[-0.05em] sm:tracking-[-0.06em]",
          light ? "!text-white" : "!text-black",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3.5 sm:mt-4 max-w-[560px] font-['Inter_Display',Inter,sans-serif] text-[18px] font-normal leading-[25px] tracking-[-0.18px]",
            light ? "!text-white/80" : "text-[#757575]",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}