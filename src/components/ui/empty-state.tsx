import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionLabel,
  href,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  href?: string;
}) {
  return (
    <div className="rounded-[14px] border border-dashed border-line bg-smoke px-6 py-12 text-center">
      <h3 className="text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-copy">{description}</p>
      {actionLabel && href ? (
        <div className="mt-5">
          <Button href={href} size="sm">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
