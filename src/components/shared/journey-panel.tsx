import { roleFeatures, type ProductRole } from "@/lib/product-model";
import { cn } from "@/lib/cn";

export function JourneyPanel({
  role,
  title,
  body,
  className,
}: {
  role: ProductRole;
  title: string;
  body?: string;
  className?: string;
}) {
  const pack = roleFeatures[role];

  return (
    <div className={cn("rounded-[14px] border border-line bg-white p-5", className)}>
      <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary">{title}</p>
      {body ? <p className="mt-2 text-sm leading-6 text-copy">{body}</p> : null}
      <p className="mt-3 text-sm font-semibold text-title">After sign-in you land on</p>
      <p className="mt-1 text-sm text-copy">{pack.landsOn}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-success">You can</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-6 text-copy">
            {pack.can.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">You cannot</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-6 text-copy">
            {pack.cannot.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function PostDestinationPanel() {
  return (
    <div className="rounded-[14px] border border-line bg-smoke p-5">
      <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
        Where this post goes
      </p>
      <ol className="mt-3 space-y-3 text-sm leading-6 text-copy">
        <li>
          <span className="font-semibold text-title">1. Your account · </span>
          Opens under Your requests. Full management view: quotes, hire, messages, review.
        </li>
        <li>
          <span className="font-semibold text-title">2. Matching pros · </span>
          Appears on their Available jobs after they are reviewed. Quoting needs an active membership.
        </li>
        <li>
          <span className="font-semibold text-title">3. Not public · </span>
          Guests and other homeowners never see your private request or phone number.
        </li>
      </ol>
    </div>
  );
}
