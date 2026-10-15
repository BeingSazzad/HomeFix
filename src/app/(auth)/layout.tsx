import Link from "next/link";
import { photos } from "@/lib/media";

const points = [
  "Browse cleared professionals without an account",
  "Create an account only to post or apply",
  "Project payment stays between you and the pro",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <aside className="auth-panel relative hidden overflow-hidden bg-ink text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0 bg-cover bg-[center_30%]"
          style={{ backgroundImage: `url(${photos.auth})` }}
        />
        <div className="auth-wash absolute inset-0" />
        <div className="relative">
          <Link href="/" className="font-display text-2xl font-bold !text-white">
            LocalHomeFix
          </Link>
        </div>
        <div className="relative max-w-md">
          <p className="font-display text-[13px] font-bold uppercase tracking-[0.18em] !text-white/70">
            Guest or account
          </p>
          <h1 className="mt-4 text-[40px] leading-tight !text-white">
            Look around first. Sign in when you need to act.
          </h1>
          <ul className="mt-8 space-y-3 text-[15px] leading-7 !text-white/80">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Link
            href="/browse-pros"
            className="mt-8 inline-flex min-h-[50px] items-center rounded-[10px] border border-white/40 px-8 font-display font-bold !text-white hover:bg-white hover:!text-title"
          >
            Continue as guest
          </Link>
        </div>
        <p className="relative text-sm !text-white/60">LocalHomeFix does not take the repair payment.</p>
      </aside>

      <div className="flex flex-col bg-surface px-5 py-10 md:px-10">
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <Link href="/" className="font-display text-xl font-bold text-title">
            LocalHomeFix
          </Link>
          <Link href="/browse-pros" className="font-display text-sm font-bold text-primary">
            Continue as guest
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
