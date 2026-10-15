import { notFound } from "next/navigation";
import { RequestDetail } from "@/components/web-pages/request-detail";
import { ProQuoteForm } from "@/components/web-pages/pro-quote-form";
import { getJob } from "@/Mockdata";

export default async function ProJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id.startsWith("job-local-") && !getJob(id)) notFound();

  return (
    <div className="space-y-5">
      <RequestDetail
        id={id}
        backHref="/pro/jobs"
        backLabel="Available jobs"
        inboxHref="/pro/messages"
        viewer="pro"
      />
      <ProQuoteForm jobId={id} />
    </div>
  );
}
