import { JobCard } from "@/components/shared/job-card";
import { Button } from "@/components/ui/button";
import { jobs } from "@/Mockdata";

export default function AccountPage() {
  const mine = jobs.filter((job) => job.homeownerName === "Maya Chen" || job.id === "job-1");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px]">Your requests</h1>
          <p className="mt-1 text-sm text-copy">Quotes, messages, and status stay on each request.</p>
        </div>
        <Button href="/account/post-job" size="sm">
          New request
        </Button>
      </div>
      <div className="mt-6 grid gap-4">
        {mine.map((job) => (
          <JobCard key={job.id} job={job} href={`/account/jobs/${job.id}`} actionLabel="View details" />
        ))}
      </div>
    </div>
  );
}
