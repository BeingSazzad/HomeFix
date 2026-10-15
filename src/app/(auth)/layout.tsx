import Link from "next/link";
import { photos } from "@/lib/media";

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
          <p className="font-display text-[12px] font-bold uppercase tracking-[0.18em] !text-white/70">
            LocalHomeFix
          </p>
          <h1 className="mt-3 text-[36px] leading-tight !text-white">
            Browse free. Account only when you need to act.
          </h1>
          <p className="mt-4 text-[15px] leading-6 !text-white/80">
            Sign up to post a job or apply as a pro. You pay the provider directly.
          </p>
        </div>
        <p className="relative text-sm !text-white/60">No repair payments collected here.</p>
      </aside>

      <div className="flex flex-col bg-surface px-5 py-10 md:px-10">
        <div className="mb-8 lg:hidden">
          <Link href="/" className="font-display text-xl font-bold text-title">
            LocalHomeFix
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
