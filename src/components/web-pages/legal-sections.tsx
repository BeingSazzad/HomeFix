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
      <div className="container-site grid items-start gap-8 lg:grid-cols-[0.85fr_1.35fr] lg:gap-10">
        <aside className="rounded-[20px] bg-white p-5 soft-shadow md:p-6 lg:sticky lg:top-28">
          <p className="font-display text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
            On this page
          </p>
          <nav className="mt-4 space-y-1" aria-label="Section list">
            {sections.map((section, index) => (
              <a
                key={section.title}
                href={`#section-${index + 1}`}
                className="flex items-start gap-2 rounded-[10px] px-2 py-2 text-sm text-copy transition-colors hover:bg-smoke hover:text-title"
              >
                <span className="font-display text-xs font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{section.title}</span>
              </a>
            ))}
          </nav>

          <div className="mt-6 border-t border-line pt-5">
            <p className="text-sm font-semibold text-title">Related</p>
            <ul className="mt-2 space-y-2 text-sm">
              {related.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-primary hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <article
              key={section.title}
              id={`section-${index + 1}`}
              className="scroll-mt-28 rounded-[20px] border border-line bg-white p-5 md:p-7"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-smoke font-display text-sm font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[20px] leading-snug md:text-[22px]">{section.title}</h2>
                  <p className="mt-3 text-[15px] leading-7 text-copy">{section.body}</p>
                </div>
              </div>
            </article>
          ))}

          <div className="rounded-[20px] bg-primary p-5 text-white md:p-6">
            <p className="font-display text-lg font-bold text-white">Questions about these terms?</p>
            <p className="mt-1 text-sm leading-6 text-white/80">
              Reach out through Contact. We do not take project payments.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-full bg-white px-4 py-2.5 font-display text-sm font-bold text-primary"
            >
              Contact us →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
