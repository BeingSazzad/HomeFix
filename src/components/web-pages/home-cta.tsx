import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";

export function HomeCta() {
  return (
    <section className="relative overflow-hidden bg-title">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photos.cta})` }} />
      <div className="absolute inset-0 bg-title/78" />
      <div className="container-site relative flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center md:py-20">
        <div>
          <h2 className="max-w-xl text-[32px] leading-tight text-white md:text-[42px]">
            Give the problem a place to start.
          </h2>
          <p className="mt-4 max-w-lg text-[16px] leading-7 text-white/75">
            Homeowners create an account to post. Professionals apply separately, then start membership after approval.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/signup" variant="white" size="lg">
            Homeowner account
          </Button>
          <Button href="/pro-register" variant="onDark" size="lg">
            Apply as a pro
          </Button>
        </div>
      </div>
    </section>
  );
}
