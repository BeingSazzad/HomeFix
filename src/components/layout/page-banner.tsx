import { cn } from "@/lib/cn";

export function PageBanner({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  align?: "left" | "center";
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}) {
  const centered = align === "center";

  return (
    <section className={cn("bg-white border-b border-line/60 pt-10 sm:pt-14 pb-10 sm:pb-14", className)}>
      <div className="container-site">
        {/* Eyebrow with Global Design System Blue Ring Indicator */}
        {eyebrow ? (
          <div className={cn("mb-3 sm:mb-3.5", centered ? "flex justify-center" : "flex justify-start")}>
            <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
              />
              <span>{eyebrow}</span>
            </div>
          </div>
        ) : null}

        {/* Heading: Global Design System Standard (font-geist, font-medium, Title Case) */}
        <h1
          className={cn(
            "font-geist text-[30px] sm:text-[38px] md:text-[44px] font-medium leading-[1.14] tracking-[-1.5px] sm:tracking-[-2px] !text-black",
            centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl",
          )}
        >
          {title}
        </h1>

        {/* Subtitle / Description */}
        {description ? (
          <p
            className={cn(
              "mt-3.5 max-w-2xl font-['Inter_Display',Inter,sans-serif] text-[16px] sm:text-[17px] font-normal leading-[25px] tracking-[-0.18px] text-[#757575]",
              centered ? "mx-auto text-center" : "text-left",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}