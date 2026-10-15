"use client";

import { useState } from "react";
import { Clock, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea, TextField } from "@/components/ui/field";
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
    text: "Austin, TX and nearby ZIP codes",
  },
  {
    icon: Clock,
    title: "Hours",
    text: "Mon–Fri, 9:00 AM – 6:00 PM CT",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Contact us"
        description="No account needed. We reply by email."
        image={photos.banners.contact}
      />
      <section className="bg-white py-16 md:py-20">
        <div className="container-site grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-[32px] leading-tight md:text-[40px]">Get in touch</h2>
            <p className="mt-3 max-w-md text-[16px] leading-7 text-copy">
              Help with requests, applications, or membership. We never take project payments.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              {details.map((item) => (
                <article key={item.title} className="flex items-start gap-4 rounded-[16px] bg-smoke p-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <h3 className="text-[18px]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-copy">{item.text}</p>
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] bg-smoke p-6 md:p-8">
            <h2 className="text-[28px] leading-tight md:text-[32px]">Send a message</h2>
            {sent ? (
              <div className="mt-6 rounded-[14px] bg-white p-5">
                <p className="font-display text-lg font-bold text-title">Message sent</p>
                <p className="mt-2 text-sm leading-7 text-copy">
                  Thanks. We will reply to the email you provided.
                </p>
                <div className="mt-5">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSent(false)}>
                    Send another
                  </Button>
                </div>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={submit}>
                <TextField required name="name" placeholder="Full name" />
                <TextField required name="email" type="email" placeholder="Email address" />
                <TextField required name="subject" placeholder="Subject" />
                <TextArea required name="message" placeholder="Type your message" className="min-h-36" />
                <Button type="submit" className="w-full">
                  Send message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
