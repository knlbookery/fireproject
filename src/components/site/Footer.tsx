import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { SITE } from "@/data/site";
import { NewsletterForm } from "./NewsletterForm";

const fireLogoFull = "/images/firelogo-full.png";

const COLUMNS: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Quick Links",
    links: [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Our Mission", to: "/mission" },
      { label: "Our Impact", to: "/impact" },
      { label: "Programs", to: "/programs" },
      { label: "Events", to: "/events" },
    ],
  },
  {
    heading: "Organisation",
    links: [
      { label: "Organisation Leaders", to: "/leadership" },
      { label: "Our Partners", to: "/partners" },
      { label: "Ghana", to: "/ghana-initiatives" },
      { label: "Philadelphia / U.S.", to: "/us-initiatives" },
      { label: "Press & Media", to: "/press" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "Donate", to: "/donate" },
      { label: "Volunteer", to: "/volunteer" },
      { label: "Sponsors & Partners", to: "/sponsors" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-background px-4 pb-6 pt-16 lg:px-6 lg:pt-24">
      <div className="navy-veil on-navy relative mx-auto max-w-[1400px] overflow-hidden rounded-[28px] px-6 pb-8 pt-12 text-white/70 lg:px-14 lg:pt-16">
        {/* Newsletter band */}
        <div className="grid gap-8 border-b border-white/12 pb-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-[2.6rem] md:leading-[1.1]">
              Subscribe to our newsletter
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
              Occasional updates on programmes, events, and impact across Ghana and the United
              States. No noise.
            </p>
          </div>
          <NewsletterForm onDark />
        </div>

        {/* Main grid */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1.25fr_2fr]">
          <div>
            <Link to="/" className="inline-flex items-center" aria-label="F.I.R.E. home">
              <img
                src={fireLogoFull}
                alt="F.I.R.E. — Free Inspiration Reaching Everyone"
                width={277}
                height={54}
                className="h-[43px] w-auto object-contain md:h-[54px]"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {SITE.legalName} creates opportunity through education, technology, sports,
              entrepreneurship, and community development across Ghana and the United States.
            </p>
            <div className="mt-7 space-y-3 text-sm">
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 text-white/75 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                {SITE.email}
              </a>
              <a
                href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-3 text-white/75 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                {SITE.phone}
              </a>
              <p className="flex items-start gap-3 text-white/75">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  {SITE.addressUS}
                  <br />
                  {SITE.addressGH}
                </span>
              </p>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-white/45">
                  {col.heading}
                </h3>
                <ul className="mt-5 space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className="text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/12 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {SITE.name} — {SITE.legalName}. All rights reserved.{" "}
            {SITE.ein}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-white/60 transition-colors hover:text-white"
              >
                {s.label}
              </a>
            ))}
            <Link to="/privacy-policy" className="text-white/60 underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="text-white/60 underline-offset-4 hover:underline">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
