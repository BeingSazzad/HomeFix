import { Suspense } from "react";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";
import { BrowseProsClient } from "./browse-pros-client";

export default function BrowseProsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Find a Pro"
        title="Browse cleared professionals"
        description="Public listings are limited to providers who finished administrator review. Contact stays hidden until clearance and membership."
        image={photos.banners.pros}
      />
      <Suspense fallback={<div className="container-site py-16 text-sm text-muted">Loading directory…</div>}>
        <BrowseProsClient />
      </Suspense>
    </>
  );
}
