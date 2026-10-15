import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const testimonials = [
  {
    name: "Maya Chen",
    place: "Austin, TX",
    trade: "Plumbing",
    rating: 5,
    initials: "MC",
    body: "Posted once, got clear quotes, and paid the plumber directly. No platform fee on my side.",
  },
  {
    name: "Jordan Hale",
    place: "Round Rock, TX",
    trade: "Electrical",
    rating: 5,
    initials: "JH",
    body: "Only reviewed pros showed up. Easy to compare options and message from the same request.",
  },
  {
    name: "Elena Ruiz",
    place: "Cedar Park, TX",
    trade: "HVAC",
    rating: 5,
    initials: "ER",
    body: "Found a cleared tech the same day. Price stayed between us — LocalHomeFix never took a cut.",
  },
];

export function HomeTestimonials() {
  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Reviews"
            title="What homeowners say"
            description="Feedback from people who posted a request and hired locally."
          />
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.name} className="flex h-full flex-col rounded-[20px] bg-white p-6 soft-shadow md:p-7">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <Quote className="h-5 w-5 shrink-0 text-primary/30" aria-hidden />
              </div>

              <p className="mt-5 flex-1 text-[15px] leading-7 text-copy">{item.body}</p>

              <div className="mt-6 flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-white">
                  {item.initials}
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold text-title">{item.name}</p>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {item.place} · {item.trade}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
