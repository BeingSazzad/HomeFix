import Link from "next/link";

const facts = [
  { value: "$0", label: "Homeowner fee" },
  { value: "$19.99", label: "Pro membership / mo" },
  { value: "3 mo", label: "Free after clearance" },
];

export function HomeFacts() {
  return (
    <section className="bg-primary py-10 md:py-12">
      <div className="container-site">
        <ul className="grid gap-8 text-center sm:grid-cols-3 sm:gap-6">
          {facts.map((item) => (
            <li key={item.label}>
              <p className="font-display text-[36px] font-bold leading-none text-white md:text-[40px]">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-white/80">{item.label}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="font-display text-sm font-bold text-white underline-offset-4 hover:underline"
          >
            See pricing →
          </Link>
        </div>
      </div>
    </section>
  );
}
