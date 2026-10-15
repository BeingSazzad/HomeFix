"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageBanner } from "@/components/layout/page-banner";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { loginHref } from "@/lib/role-access";
import { useAppSelector } from "@/redux/hooks";

/** Public gate only — private jobs live on /pro/jobs after clearance + membership. */
export default function BrowseJobsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "pro") router.replace("/pro/jobs");
  }, [router, user]);

  return (
    <>
      <PageBanner
        eyebrow="For professionals"
        title="Job board"
        description="Private requests. Quote after clearance and membership."
        image={photos.banners.jobs}
      />
      <section className="bg-surface py-10 md:py-12">
        <div className="container-site flex flex-wrap gap-3">
          {user?.role === "pro" ? (
            <Button href="/pro/jobs">Open available jobs</Button>
          ) : (
            <>
              <Button href={loginHref({ role: "pro", next: "/pro/jobs" })}>Pro sign in</Button>
              <Button href="/pro-register" variant="ghost">
                Apply as a pro
              </Button>
            </>
          )}
          <Button href="/browse-pros" variant="ghost">
            Browse pros
          </Button>
        </div>
      </section>
    </>
  );
}
