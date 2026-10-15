import { Suspense } from "react";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";
import { BrowseProsClient } from "./browse-pros-client";

export default function BrowseProsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Find a Pro"
        title="Browse reviewed local professionals"
        description="Only pros who finished administrator review appear here. You can look around free — phone and email stay locked until a pro has clearance and membership."
        image={photos.banners.pros}
      />
      <Suspense fallback={<div className="container-site py-16 text-sm text-muted">Loading directory…</div>}>
        <BrowseProsClient />
      </Suspense>
    </>
  );
}
