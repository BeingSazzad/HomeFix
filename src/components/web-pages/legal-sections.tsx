export function LegalSections({
  sections,
}: {
  sections: { title: string; body: string }[];
}) {
  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site max-w-3xl">
        <div className="overflow-hidden rounded-[20px] bg-white soft-shadow">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className={index > 0 ? "border-t border-line px-6 py-7 md:px-8 md:py-8" : "px-6 py-7 md:px-8 md:py-8"}
            >
              <h2 className="text-[20px] md:text-[24px]">{section.title}</h2>
              <p className="mt-3 text-[16px] leading-7 text-copy">{section.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
