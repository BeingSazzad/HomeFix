import {
  Bug,
  Droplets,
  Hammer,
  Home,
  MapPin,
  Paintbrush,
  ShieldCheck,
  Star,
  Trees,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import type { Professional } from "@/types";

const icons: Record<string, typeof Wrench> = {
  "appliance-repair": Wrench,
  electrical: Zap,
  hvac: Wind,
  handyman: Hammer,
  landscaping: Trees,
  painting: Paintbrush,
  "pest-control": Bug,
  plumbing: Droplets,
  roofing: Home,
};

export function ProCard({ pro }: { pro: Professional }) {
  const image = photos.services[pro.categorySlug];
  const Icon = icons[pro.categorySlug] ?? Wrench;
  const facts = [
    pro.licensed ? "License on file" : null,
    pro.insured ? "Insured" : null,
    pro.emergency ? "Urgent jobs" : null,
  ].filter(Boolean);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white">
      <div className="relative h-56 overflow-hidden bg-smoke">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-[10px] bg-white px-3 py-1.5 font-display text-xs font-bold text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Cleared
        </div>
        <span className="absolute bottom-4 left-4 grid h-14 w-14 place-items-center rounded-[10px] bg-primary text-white">
          <Icon className="h-6 w-6" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[22px] text-title">{pro.businessName}</h3>
        <p className="mt-1 text-sm font-semibold text-primary">{pro.trade}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-copy">
          <MapPin className="h-4 w-4 shrink-0 text-muted" />
          {pro.city}, {pro.state}
        </p>
        <p className="mt-4 flex items-center gap-1.5 text-sm text-copy">
          <Star className="h-4 w-4 shrink-0 text-accent" />
          {pro.rating.toFixed(1)}
          <span className="text-muted">
            · {pro.reviewCount} reviews · {pro.jobsCompleted} jobs
          </span>
        </p>
        {facts.length ? <p className="mt-3 text-xs text-muted">{facts.join(" · ")}</p> : null}
        <div className="mt-auto pt-6">
          <Button href="/signup" className="w-full">
            Request a quote
          </Button>
        </div>
      </div>
    </article>
  );
}
