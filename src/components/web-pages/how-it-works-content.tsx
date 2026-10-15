import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";

const homeowner = [
  { title: "Post the request", text: "Describe the work, add photos if you have them, and set timing and budget." },
  { title: "Get matched", text: "Cleared providers who serve that ZIP can review eligible requests." },
  { title: "Talk directly", text: "Approved members can share contact details so you can discuss the job." },
  { title: "Agree and review", text: "You set scope, price, schedule, and payment. After the work, leave a review." },
];

const professional = [
  { title: "Apply", text: "Business details, service area, and the required screening steps." },
  { title: "Get cleared", text: "An administrator reviews identity, Checkr status, and credential evidence." },
  { title: "Start membership", text: "$19.99 a month after three free months. This is the only LocalHomeFix fee." },
  { title: "Quote and work", text: "See matched requests, send a quote, and handle payment with the homeowner." },
];

export function HowItWorksContent() {
  return (
    <div>
      <PageBanner
        eyebrow="How it works"
        title="Submit a request. Compare quotes. Choose one professional."
        description="Browse without an account. Sign up only to post. LocalHomeFix does not move the project money."
        image={photos.banners.how}
      />
      <section className="container-site grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Homeowners" title="Get the project moving" />
          <ol className="mt-8 space-y-4">
            {homeowner.map((step, index) => (
              <li key={step.title} className="flex gap-4 rounded-[20px] bg-white p-5 soft-shadow">
                <span className="font-display text-xl font-bold text-primary">0{index + 1}</span>
                <span>
                  <h3 className="text-xl">{step.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-copy">{step.text}</p>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Button href="/signup">Create a homeowner account</Button>
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Professionals" title="Apply, then take membership" />
          <ol className="mt-8 space-y-4">
            {professional.map((step, index) => (
              <li key={step.title} className="flex gap-4 rounded-[20px] bg-white p-5 soft-shadow">
                <span className="font-display text-xl font-bold text-primary">0{index + 1}</span>
                <span>
                  <h3 className="text-xl">{step.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-copy">{step.text}</p>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <Button href="/pro-register" variant="ghost">
              Start a provider application
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
