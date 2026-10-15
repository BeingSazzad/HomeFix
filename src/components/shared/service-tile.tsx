"use client";

import {
  ArrowUpRight,
  Wrench,
  Zap,
  Wind,
  Hammer,
  Trees,
  Paintbrush,
  Bug,
  Droplets,
  Home,
} from "lucide-react";
import { photos } from "@/lib/media";
import type { Category } from "@/types";

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

export function ServiceTile({
  category,
  onSelect,
}: {
  category: Category;
  onSelect?: (slug: string) => void;
}) {
  const Icon = icons[category.slug] ?? Wrench;
  const image = photos.services[category.slug];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(category.slug)}
      className="group overflow-hidden rounded-[18px] border border-line bg-white text-left soft-shadow"
    >
      <span className="relative block h-44 overflow-hidden md:h-48">
        <span
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
      </span>
      <span className="relative flex items-center gap-3 px-4 pb-4 pt-5">
        <span className="absolute -top-5 left-4 grid h-10 w-10 place-items-center rounded-full bg-primary text-white shadow-md">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 pl-12 font-display text-[17px] font-bold text-title">
          {category.name}
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}
