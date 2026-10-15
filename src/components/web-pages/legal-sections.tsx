import Link from "next/link";

export function LegalSections({
  sections,
  related = [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact" },
  ],
}: {
  sections: { title: string; body: string }[];
  related?: { href: string; label: string }[];
}) {
  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <div className="divide-y divide-line">
            {sections.map((section) => (
              <article key={section.title} className="py-8 first:pt-0 last:pb-0">
                <h2 className="text-[20px] leading-snug md:text-[22px]">{section.title}</h2>
                <p className="mt-3 text-[15px] leading-7 text-copy">{section.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 border-t border-line pt-6">
            <p className="text-sm text-copy">
              Questions?{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                Contact us
              </Link>
              . We do not take project payments.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {related.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-primary hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
