import { notFound } from "next/navigation";
import { RequestDetail } from "@/components/web-pages/request-detail";
import { getJob } from "@/Mockdata";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!getJob(id)) notFound();

  return (
    <RequestDetail id={id} backHref="/account" backLabel="Your requests" inboxHref="/account/messages" />
  );
}
