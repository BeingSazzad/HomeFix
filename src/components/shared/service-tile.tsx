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
      className="group overflow-hidden rounded-[20px] bg-white text-left soft-shadow"
    >
      <span className="relative block h-56 overflow-hidden">
        <span
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
        <span className="absolute bottom-4 left-4 grid h-14 w-14 place-items-center rounded-[10px] bg-primary text-white">
          <Icon className="h-6 w-6" />
        </span>
      </span>
      <span className="flex items-center justify-between gap-3 px-5 py-5">
        <span className="font-display text-[20px] font-bold text-title">{category.name}</span>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}
