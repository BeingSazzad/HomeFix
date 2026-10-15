import Link from "next/link";
import { photos } from "@/lib/media";

export function PageBanner({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-title text-white">
      <div
        className="absolute inset-0 bg-cover bg-[center_25%]"
        style={{ backgroundImage: `url(${image ?? photos.banner})` }}
      />
      <div className="banner-wash absolute inset-0" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-primary/25 blur-2xl" />
      <div className="container-site relative py-16 md:py-20">
        <p className="text-[13px] text-white/70">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2 text-white/35">/</span>
          <span>{eyebrow}</span>
        </p>
        <h1 className="mt-4 max-w-3xl text-[36px] leading-[1.15] text-white md:text-[52px]">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-xl text-[16px] leading-7 text-white/78">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
