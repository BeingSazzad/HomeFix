import { Logo } from "@/components/ui/logo";
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
          <Logo variant="dark" size="lg" />
        </div>
        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.14em] !text-white/80 backdrop-blur-md">
            Direct & Transparent
          </span>
          <h2 className="mt-4 font-display text-[26px] sm:text-[28px] lg:text-[30px] font-medium leading-[1.2] tracking-tight !text-white">
            Browse free. Account only when you need to act.
          </h2>
          <p className="mt-3 font-sans text-[14px] sm:text-[15px] leading-relaxed !text-white/80">
            Sign up to post a job or apply as a pro. You pay your technician directly upon completion.
          </p>
        </div>
        <p className="relative text-sm !text-white/60">No repair payments collected here.</p>
      </aside>

      <div className="flex flex-col bg-surface px-5 py-10 md:px-10">
        <div className="mb-8 lg:hidden">
          <Logo size="md" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[500px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
