"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextField } from "@/components/ui/field";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";

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
        title="Contact Us"
        description="Have questions or need assistance? Reach out to our Austin support team anytime."
        image={photos.banners.contact}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      <section className="bg-surface/50 py-12 md:py-20 border-b border-line/60">
        <div className="container-site grid items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ========================================================= */}
          {/* LEFT COLUMN: GET IN TOUCH CARD                            */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-[28px] border border-line/80 bg-white p-6 sm:p-8 md:p-9 shadow-xs">
            <div className="space-y-6 sm:space-y-7">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-title tracking-tight">
                  Get in Touch
                </h2>
                <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-muted">
                  Have questions or need help with a request? Reach out to us directly.
                </p>
              </div>

              {/* Channels List - Clean, Minimal, Elegant Cards */}
              <div className="space-y-3">
                {/* Channel 1: Email */}
                <a
                  href="mailto:admin@localhomefix.com"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-line/70 bg-white p-4 transition-all duration-200 hover:border-primary/60 hover:shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100 transition-colors group-hover:bg-primary group-hover:text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Email
                      </h3>
                      <p className="text-sm font-semibold text-title group-hover:text-primary transition-colors">
                        admin@localhomefix.com
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </a>

                {/* Channel 2: Phone */}
                <a
                  href="tel:5125550140"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-line/70 bg-white p-4 transition-all duration-200 hover:border-primary/60 hover:shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100 transition-colors group-hover:bg-primary group-hover:text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Phone
                      </h3>
                      <p className="text-sm font-semibold text-title group-hover:text-primary transition-colors">
                        (512) 555-0140
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </a>

                {/* Channel 3: Service Area */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-line/70 bg-white p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Service Area
                    </h3>
                    <p className="text-sm font-semibold text-title">
                      Austin, TX &amp; surrounding areas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours Card - Fills space seamlessly */}
            <div className="mt-6 rounded-2xl border border-line/60 bg-surface/60 p-4.5 text-xs text-muted">
              <p className="font-semibold text-title">Support Hours</p>
              <p className="mt-1 leading-relaxed">
                Monday – Saturday: 8:00 AM – 7:00 PM CST<br />
                Sunday: Closed (Emergency inquiries monitored)
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: SEND MESSAGE FORM                           */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-[28px] border border-line/80 bg-white p-6 sm:p-8 md:p-9 shadow-xs space-y-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-title tracking-tight">
                Send a Message
              </h2>
              <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-muted">
                Drop us a note below and a representative will reply to your email promptly.
              </p>
            </div>

            {sent ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-7 text-center space-y-3">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-title">Message Successfully Sent</h3>
                <p className="text-sm text-copy/90 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. We have received your inquiry and will follow up shortly at your provided email.
                </p>
                <div className="pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSent(false)} className="rounded-full text-xs">
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={submit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name">
                    <TextField required name="name" placeholder="Luis Ortega" />
                  </Field>
                  <Field label="Email Address">
                    <TextField required name="email" type="email" placeholder="you@example.com" />
                  </Field>
                </div>

                <Field label="Subject">
                  <TextField required name="subject" placeholder="Contractor verification, quote question, etc." />
                </Field>

                <Field label="Your Message">
                  <TextArea required name="message" placeholder="Provide as much detail as possible..." className="min-h-32" />
                </Field>

                <Button type="submit" size="lg" className="w-full justify-center rounded-full shadow-xs">
                  Send Message ↗
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
