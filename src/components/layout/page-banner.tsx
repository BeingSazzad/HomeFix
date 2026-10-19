import Link from "next/link";
import { cn } from "@/lib/cn";
import { photos } from "@/lib/media";

export function PageBanner({
  eyebrow,
  title,
  description,
  image,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <section className="relative overflow-hidden bg-title text-white">
      <div
        className="absolute inset-0 bg-cover bg-[center_25%]"
        style={{ backgroundImage: `url(${image ?? photos.banner})` }}
      />
      <div className="banner-wash absolute inset-0" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div
        className={cn(
          "container-site relative py-12 md:py-16",
          centered && "mx-auto max-w-3xl text-center",
        )}
      >
        <p className="font-sans text-[12px] font-medium text-white/70">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span className="mx-2 text-white/40">/</span>
          <span className="text-white/90">{eyebrow}</span>
        </p>
        <h1
          className={cn(
            "mt-3.5 font-display text-[32px] font-medium leading-[1.1] tracking-[-1.8px] text-white sm:text-[40px] sm:tracking-[-2.2px] md:text-[48px] md:tracking-[-2.88px]",
            centered ? "mx-auto max-w-3xl" : "max-w-3xl",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-3 max-w-xl font-sans text-[16px] font-normal leading-[24px] tracking-[-0.14px] text-white/80 md:text-[18px] md:leading-[26px] md:tracking-[-0.18px]",
              centered && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}