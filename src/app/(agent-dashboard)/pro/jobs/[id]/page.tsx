import { notFound } from "next/navigation";
import { RequestDetail } from "@/components/web-pages/request-detail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { getJob } from "@/Mockdata";

export default async function ProJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!getJob(id)) notFound();

  return (
    <div className="space-y-5">
      <RequestDetail id={id} backHref="/pro/jobs" backLabel="Available jobs" />
      <Card>
        <h2 className="text-xl">Send a quote</h2>
        <p className="mt-2 text-sm leading-6 text-copy">
          Homeowner contact stays hidden until clearance and an active trial or membership. LocalHomeFix does not take the repair payment.
        </p>
        <form className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Price type">
              <NativeSelect defaultValue="estimate">
                <option value="estimate">Estimate</option>
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
              </NativeSelect>
            </Field>
            <Field label="Amount">
              <TextField placeholder="180" />
            </Field>
          </div>
          <Field label="Scope">
            <TextArea placeholder="What the quote covers." />
          </Field>
          <Field label="Availability">
            <TextField placeholder="Thursday afternoon" />
          </Field>
          <Button type="button">Save quote</Button>
        </form>
      </Card>
    </div>
  );
}
