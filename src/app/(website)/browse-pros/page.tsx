import { Suspense } from "react";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";
import { BrowseProsClient } from "./browse-pros-client";

export default function BrowseProsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Find a Pro"
        title="Browse professionals"
        description="Cleared pros only. Browse free."
        image={photos.banners.pros}
      />
      <Suspense fallback={<div className="container-site py-16 text-sm text-muted">Loading directory…</div>}>
        <BrowseProsClient />
      </Suspense>
    </>
  );
}
