"use client";

import { useState } from "react";
import { Clock, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextField } from "@/components/ui/field";
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
      <section className="bg-surface py-[var(--section-sm)] md:py-[var(--section)]">
        <div className="container-site grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-[20px] bg-white p-5 soft-shadow md:p-7">
            <h2 className="text-[24px] leading-tight md:text-[28px]">Get in touch</h2>
            <p className="mt-2 max-w-md text-[15px] leading-6 text-copy">
              Help with requests, applications, or membership. We never take project payments.
            </p>
            <div className="mt-6 space-y-3">
              {details.map((item) => (
                <article key={item.title} className="flex items-start gap-3 rounded-[14px] bg-surface p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-primary">
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <h3 className="text-[16px] font-semibold">{item.title}</h3>
                    <p className="mt-0.5 text-sm leading-6 text-copy">{item.text}</p>
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] bg-white p-5 soft-shadow md:p-7">
            <h2 className="text-[24px] leading-tight md:text-[28px]">Send a message</h2>
            {sent ? (
              <div className="mt-5 rounded-[14px] bg-surface p-5">
                <p className="font-display text-lg font-bold text-title">Message sent</p>
                <p className="mt-2 text-sm leading-6 text-copy">
                  Thanks. We will reply to the email you provided.
                </p>
                <div className="mt-4">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSent(false)}>
                    Send another
                  </Button>
                </div>
              </div>
            ) : (
              <form className="mt-5 space-y-3.5" onSubmit={submit}>
                <Field label="Full name">
                  <TextField required name="name" placeholder="Jane Smith" />
                </Field>
                <Field label="Email">
                  <TextField required name="email" type="email" placeholder="you@email.com" />
                </Field>
                <Field label="Subject">
                  <TextField required name="subject" placeholder="How can we help?" />
                </Field>
                <Field label="Message">
                  <TextArea required name="message" placeholder="Type your message" className="min-h-32" />
                </Field>
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
