"use client";

import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  HelpCircle,
  Lock,
  Printer,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/cn";

export interface LegalSection {
  title: string;
  body: string;
  note?: string;
  badge?: string;
}

interface LegalSectionsProps {
  documentType?: "terms" | "privacy";
  effectiveDate?: string;
  version?: string;
  sections: LegalSection[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function LegalSections({
  documentType = "terms",
  effectiveDate = "October 20, 2026",
  version = "2.1",
  sections,
}: LegalSectionsProps) {
  return (
    <section className="bg-[#FAFAF9] py-10 md:py-16 text-stone-900">
      <div className="container-site">
        <div className="mx-auto max-w-5xl">
          {/* Top Document Control & Hub Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
            {/* Legal Document Tab Switcher */}
            <nav aria-label="Legal document switcher" className="inline-flex rounded-xl bg-stone-200/70 p-1 text-sm font-medium">
              <Link
                href="/terms"
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 transition-all text-xs sm:text-sm",
                  documentType === "terms"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                )}
              >
                <Scale className="h-4 w-4 text-primary" />
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 transition-all text-xs sm:text-sm",
                  documentType === "privacy"
                    ? "bg-white text-stone-900 shadow-xs font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                )}
              >
                <Lock className="h-4 w-4 text-primary" />
                Privacy Policy
              </Link>
            </nav>

            {/* Document Metadata Badges & Print Utility */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-medium text-stone-700 border border-stone-200/90 shadow-2xs">
                <Calendar className="h-3.5 w-3.5 text-stone-400" />
                Effective: {effectiveDate}
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600 border border-stone-200/80">
                Version {version}
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200/90 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-2xs hover:bg-stone-50 hover:text-stone-900 transition-colors"
                title="Print this document or save as PDF"
              >
                <Printer className="h-3.5 w-3.5 text-stone-500" />
                Print
              </button>
            </div>
          </div>

          {/* Mobile Table of Contents Quick-Jumper */}
          <div className="lg:hidden mt-5 overflow-x-auto pb-2 scrollbar-none">
            <div className="inline-flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium shrink-0">Jump to:</span>
              {sections.map((section, idx) => (
                <a
                  key={section.title}
                  href={`#${slugify(section.title)}`}
                  className="shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1 font-medium text-stone-700 hover:border-primary hover:text-primary transition-colors"
                >
                  {String(idx + 1).padStart(2, "0")}. {section.title}
                </a>
              ))}
            </div>
          </div>

          {/* 2-Column Desktop Grid */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Sticky Sidebar Navigation (Desktop) */}
            <aside className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-24 space-y-5">
                <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="font-display text-sm font-semibold text-stone-900">
                      Table of Contents
                    </h3>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                      {sections.length} sections
                    </span>
                  </div>
                  <nav className="mt-3 space-y-1">
                    {sections.map((section, idx) => {
                      const slug = slugify(section.title);
                      return (
                        <a
                          key={section.title}
                          href={`#${slug}`}
                          className="group flex items-baseline gap-2.5 rounded-lg px-2.5 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        >
                          <span className="font-mono text-xs font-semibold text-stone-400 group-hover:text-primary transition-colors">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="font-medium truncate">{section.title}</span>
                        </a>
                      );
                    })}
                  </nav>
                </div>

                {/* Quick Legal Support Card in Sidebar */}
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
                    <HelpCircle className="h-4 w-4" />
                    Legal Support
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-stone-600">
                    Have questions about contractor agreements, licensing disclosures, or personal data requests?
                  </p>
                  <Link
                    href="/contact"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    Contact Austin Support Team →
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Reading Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Document Overview Banner Card */}
              <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <p className="font-sans text-xs font-semibold tracking-wider uppercase text-primary">
                  {documentType === "terms" ? "Legal Agreement" : "Privacy & Compliance Notice"}
                </p>
                <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
                  {documentType === "terms"
                    ? "LocalHomeFix Terms of Service"
                    : "LocalHomeFix Privacy Policy"}
                </h2>
                <p className="mt-2.5 font-sans text-sm leading-relaxed text-stone-600">
                  {documentType === "terms"
                    ? "These Terms and Conditions govern your use of the LocalHomeFix marketplace platform, connecting homeowners and verified independent service professionals across Greater Austin, Texas."
                    : "This Privacy Policy explains how LocalHomeFix collects, safeguards, and processes personal information, screening records, and marketplace activity for homeowners and independent contractors."}
                </p>
              </div>

              {/* Legal Sections Cards */}
              <div className="space-y-5">
                {sections.map((section, idx) => {
                  const slug = slugify(section.title);
                  return (
                    <article
                      key={section.title}
                      id={slug}
                      className="scroll-mt-28 rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 md:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-stone-600 border border-stone-200/70">
                          Section {String(idx + 1).padStart(2, "0")}
                        </span>
                        <a
                          href={`#${slug}`}
                          aria-label={`Direct link to ${section.title}`}
                          className="font-mono text-sm font-medium text-stone-300 hover:text-stone-600 transition-colors"
                          title="Direct link to this section"
                        >
                          #
                        </a>
                      </div>

                      <h2 className="mt-3.5 font-display text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
                        {section.title}
                      </h2>

                      <p className="mt-3.5 font-sans text-[15.5px] sm:text-[16px] leading-[1.8] text-stone-700">
                        {section.body}
                      </p>

                      {section.note && (
                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-xs sm:text-[13px] leading-relaxed text-stone-700">
                          <span className="font-semibold text-primary">Summary Note: </span>
                          {section.note}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* Polished Support & Resolution Card */}
              <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-100 pb-6">
                  <div className="max-w-md">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                      <HelpCircle className="h-3.5 w-3.5" />
                      Need Clarification?
                    </span>
                    <h3 className="mt-2.5 font-display text-lg sm:text-xl font-semibold text-stone-900">
                      Have questions about these terms or privacy practices?
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                      Our Austin team is available to assist homeowners and contractors with any legal, compliance, or account questions.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-xl bg-title px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#041a24] transition-colors"
                    >
                      Contact Support →
                    </Link>
                    <Link
                      href="/faq"
                      className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-stone-50 px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                    >
                      View FAQs
                    </Link>
                  </div>
                </div>

                {/* Cross-navigation links (no self-links) */}
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Related Policies & Resources
                  </p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {documentType === "terms" ? (
                      <Link
                        href="/privacy"
                        className="group rounded-xl border border-stone-200/80 p-3.5 hover:border-primary/40 hover:bg-stone-50/70 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-stone-900 group-hover:text-primary transition-colors">
                            Privacy Policy
                          </span>
                          <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="mt-1 text-xs text-stone-500">How we handle and protect user data</p>
                      </Link>
                    ) : (
                      <Link
                        href="/terms"
                        className="group rounded-xl border border-stone-200/80 p-3.5 hover:border-primary/40 hover:bg-stone-50/70 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-stone-900 group-hover:text-primary transition-colors">
                            Terms & Conditions
                          </span>
                          <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <p className="mt-1 text-xs text-stone-500">Marketplace rules and project agreements</p>
                      </Link>
                    )}

                    <Link
                      href="/how-it-works"
                      className="group rounded-xl border border-stone-200/80 p-3.5 hover:border-primary/40 hover:bg-stone-50/70 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-stone-900 group-hover:text-primary transition-colors">
                          How It Works
                        </span>
                        <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="mt-1 text-xs text-stone-500">Contractor vetting & verification steps</p>
                    </Link>

                    <Link
                      href="/contact"
                      className="group rounded-xl border border-stone-200/80 p-3.5 hover:border-primary/40 hover:bg-stone-50/70 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-stone-900 group-hover:text-primary transition-colors">
                          Austin Support
                        </span>
                        <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="mt-1 text-xs text-stone-500">Direct assistance from our local team</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
