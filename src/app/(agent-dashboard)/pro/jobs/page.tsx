import { JobCard } from "@/components/shared/job-card";
import { jobs } from "@/Mockdata";

export default function ProJobsPage() {
  return (
    <div>
      <h1 className="text-[28px]">Available jobs</h1>
      <p className="mt-1 text-sm text-copy">
        Contact details are revealed only for cleared members on an active trial or subscription.
      </p>
      <div className="mt-6 grid gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} href={`/pro/jobs/${job.id}`} actionLabel="View details" />
        ))}
      </div>
    </div>
  );
}
