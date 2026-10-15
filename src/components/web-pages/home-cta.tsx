import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";

export function HomeCta() {
  return (
    <section className="relative overflow-hidden bg-title">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photos.cta})` }} />
      <div className="absolute inset-0 bg-title/78" />
      <div className="container-site relative flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center md:py-20">
        <div>
          <h2 className="max-w-xl text-[32px] leading-tight text-white md:text-[40px]">
            Ready to post a job or join as a pro?
          </h2>
          <p className="mt-4 max-w-lg text-[16px] leading-7 text-white/75">
            Homeowners get a free account to post and compare quotes. Professionals apply, get reviewed, then start a
            $19.99 monthly membership after three free months.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/signup?next=%2Faccount%2Fpost-job" variant="white" size="lg">
            Create free account
          </Button>
          <Button href="/pro-register" variant="onDark" size="lg">
            Apply as a pro
          </Button>
        </div>
      </div>
    </section>
  );
}
