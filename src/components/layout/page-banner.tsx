import Link from "next/link";
import { cn } from "@/lib/cn";
import { photos } from "@/lib/media";

export function PageBanner({
  eyebrow,
  title,
  description,
  image,
  align = "center",
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  align?: "left" | "center";
  breadcrumbs?: { label: string; href?: string }[];
}) {
  const centered = align === "center";
  const crumbs = breadcrumbs ?? [
    { label: "Home", href: "/" },
    { label: eyebrow ?? title },
  ];

  return (
    <section className="relative overflow-hidden bg-title text-white">
      <div
        className="absolute inset-0 bg-cover bg-[center_25%]"
        style={{ backgroundImage: `url(${image ?? photos.banner})` }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="banner-wash absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div
        className={cn(
          "container-site relative py-12 md:py-16",
          centered && "mx-auto max-w-3xl text-center",
        )}
      >
        <nav
          aria-label="Breadcrumb"
          className={cn(
            "font-sans text-[12px] font-medium text-white/70",
            centered && "flex justify-center",
          )}
        >
          <ol className={cn("inline-flex items-center flex-wrap gap-1.5", centered && "justify-center")}>
            {crumbs.map((crumb, idx) => (
              <li key={idx} className="inline-flex items-center">
                {idx > 0 && <span className="mx-2 text-white/40">/</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/90" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1
          className={cn(
            "mt-3.5 font-display text-[30px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[38px] md:text-[44px]",
            centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-3 max-w-lg font-sans text-sm sm:text-base leading-relaxed text-white/85",
              centered && "mx-auto text-center",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}