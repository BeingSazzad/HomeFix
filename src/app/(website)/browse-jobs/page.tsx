"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageBanner } from "@/components/layout/page-banner";
import { Button } from "@/components/ui/button";
import { photos } from "@/lib/media";
import { loginHref } from "@/lib/role-access";
import { useAppSelector } from "@/redux/hooks";

/**
 * Public marketing gate only — job details stay private on /pro/jobs after clearance + membership.
 */
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
        title="Matched jobs live on your board"
        description="Open requests are not public. After clearance and an active membership, you quote from Available jobs inside your account."
        image={photos.banners.jobs}
      />
      <section className="bg-surface py-12 md:py-16">
        <div className="container-site max-w-2xl space-y-4">
          <p className="text-[16px] leading-7 text-copy">
            Homeowners post privately. Guests never see request details. Pros open the job board only after
            administrator review and membership.
          </p>
          <div className="flex flex-wrap gap-3">
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
              Browse pros instead
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
