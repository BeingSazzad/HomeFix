import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";

export function HomeCta() {
  return (
    <section className="relative overflow-hidden bg-title">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${photos.cta})` }} />
      <div className="absolute inset-0 bg-title/78" />
      <div className="container-site relative flex flex-col items-center gap-6 py-[var(--section-sm)] text-center md:py-[var(--section)]">
        <div>
          <h2 className="mx-auto max-w-lg text-[28px] leading-tight text-white md:text-[36px]">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-6 text-white/75">
            Homeowners free. Pros $19.99/mo after 3 free months.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
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
