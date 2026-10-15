import { FileText, MapPin, MessagesSquare, Handshake } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";

const steps = [
  {
    n: "01",
    icon: FileText,
    title: "Describe the job",
    text: "Problem, ZIP, and timing. Photos optional.",
  },
  {
    n: "02",
    icon: MapPin,
    title: "Browse reviewed pros",
    text: "Only admin-approved profiles appear in search.",
  },
  {
    n: "03",
    icon: MessagesSquare,
    title: "Compare quotes",
    text: "Quotes and chat stay on one request.",
  },
  {
    n: "04",
    icon: Handshake,
    title: "Pay the pro directly",
    text: "No job checkout on LocalHomeFix.",
  },
];

export function HomeProcess() {
  return (
    <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="Four steps to hire"
          description="Free for homeowners. Pros apply and start membership after approval."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <article key={step.n} className="rounded-[20px] bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-smoke text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="font-display text-sm font-bold text-primary">{step.n}</span>
              </div>
              <h3 className="mt-5 text-[20px]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-copy">{step.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href="/how-it-works" variant="ghost">
            Homeowner & pro paths
          </Button>
        </div>
      </div>
    </section>
  );
}
