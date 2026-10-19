import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const groups = [
  {
    title: "For homeowners",
    links: [
      { href: "/browse-pros", label: "Find a Pro" },
      { href: "/services", label: "Services" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/faq", label: "FAQ" },
      { href: "/signup?next=%2Faccount%2Fpost-job", label: "Create an account" },
    ],
  },
  {
    title: "For professionals",
    links: [
      { href: "/pro-register", label: "Apply as a pro" },
      { href: "/pricing", label: "Membership" },
      { href: "/browse-jobs", label: "Job board access" },
      { href: "/login?role=pro&next=/pro/jobs", label: "Pro login" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

const socials = [
  {
    href: "mailto:admin@localhomefix.com",
    label: "Email",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="0" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/localhomefix",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1Z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/localhomefix",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/localhomefix",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M6.5 9H4v11h2.5V9ZM5.2 4C4.3 4 3.6 4.7 3.6 5.6s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6S6.2 4 5.2 4ZM20 20h-2.5v-5.6c0-1.6-.6-2.4-1.8-2.4-1.2 0-1.9.8-1.9 2.4V20H11V9h2.4v1.5c.5-.9 1.5-1.7 3.1-1.7 2.2 0 3.5 1.4 3.5 4.3V20Z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-title text-white">
      <div className="container-site grid gap-10 border-b border-white/10 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,0.7fr)]">
        <div>
          <Logo variant="dark" size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
            Austin&apos;s direct home repair network. Compare itemized quotes from background-checked local specialists, message privately, and pay directly upon job completion.
          </p>
          <div className="mt-6 flex gap-2">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-primary hover:bg-primary"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="font-display text-base font-semibold tracking-tight text-white">{group.title}</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-site flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/50">
        <p>© {new Date().getFullYear()} LocalHomeFix Inc.</p>
        <p>No deposits or project payments collected by the platform.</p>
      </div>
    </footer>
  );
}
