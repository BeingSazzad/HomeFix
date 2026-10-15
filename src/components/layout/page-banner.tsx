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
      <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-primary/25 blur-2xl" />
      <div
        className={cn(
          "container-site relative py-16 md:py-20",
          centered && "mx-auto max-w-3xl text-center",
        )}
      >
        <p className={cn("text-[12px] text-white/70", centered && "text-white/70")}>
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2 text-white/35">/</span>
          <span>{eyebrow}</span>
        </p>
        <h1
          className={cn(
            "mt-4 text-[36px] leading-[1.15] text-white md:text-[56px]",
            centered ? "mx-auto max-w-3xl" : "max-w-3xl",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-4 text-[16px] leading-7 text-white/78",
              centered ? "mx-auto max-w-2xl" : "max-w-xl",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
