import { Mail, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";

const details = [
  {
    icon: Mail,
    title: "Email",
    text: "admin@localhomefix.com",
  },
  {
    icon: MapPin,
    title: "Service area",
    text: "Local U.S. communities",
  },
  {
    icon: ShieldCheck,
    title: "Office",
    text: "No street office is published",
  },
  {
    icon: UserRound,
    title: "Account",
    text: "No account needed to write us",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Questions, feedback, or help."
        description="No account needed. Write us and we will get back to you."
        image={photos.banners.contact}
      />
      <section className="bg-white py-16 md:py-20">
        <div className="container-site grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-[32px] leading-tight md:text-[40px]">Contact information</h2>
            <p className="mt-3 max-w-md text-[15px] leading-7 text-copy">
              Questions about requests, applications, clearance, or membership. LocalHomeFix does not take project payments.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {details.map((item) => (
                <article key={item.title} className="flex items-start gap-4 rounded-[16px] bg-smoke p-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <h3 className="text-[17px]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-copy">{item.text}</p>
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] bg-smoke p-6 md:p-8">
            <h2 className="text-[28px] leading-tight md:text-[32px]">Send a message</h2>
            <form className="mt-6 space-y-4">
              <TextField required placeholder="Full name" />
              <TextField required type="email" placeholder="Email address" />
              <NativeSelect defaultValue="">
                <option value="" disabled>
                  What is this about?
                </option>
                <option value="homeowner">Homeowner request or account</option>
                <option value="pro">Provider application or membership</option>
                <option value="clearance">Clearance or screening</option>
                <option value="other">Something else</option>
              </NativeSelect>
              <TextField required placeholder="Subject" />
              <TextArea required placeholder="Type your message" className="min-h-36" />
              <Button type="submit" className="w-full">
                Send message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
