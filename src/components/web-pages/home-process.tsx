import { FileText, MapPin, MessagesSquare, Handshake } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    n: "01",
    icon: FileText,
    title: "Explain the job",
    text: "Share the details that help a professional understand the work.",
  },
  {
    n: "02",
    icon: MapPin,
    title: "See who is cleared",
    text: "Search by service and ZIP. Public profiles are limited to reviewed providers.",
  },
  {
    n: "03",
    icon: MessagesSquare,
    title: "Compare with context",
    text: "Quotes, messages, and completed-job reviews stay on the same request.",
  },
  {
    n: "04",
    icon: Handshake,
    title: "Agree directly",
    text: "Scope, schedule, contract, and payment stay between you and the pro.",
  },
];

export function HomeProcess() {
  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <SectionHeading align="center" eyebrow="How it works" title="A simple working process" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <article key={step.n} className="group rounded-[20px] bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-smoke text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="font-display text-sm font-bold text-primary">{step.n}</span>
              </div>
              <h3 className="mt-5 text-[20px]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-copy">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
