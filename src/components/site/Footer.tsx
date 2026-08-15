import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";

import { SITE } from "@/data/site";
import { NewsletterForm } from "./NewsletterForm";

const fireLogoFullOnDark = "/images/firelogo-full-dark.png";

const COLUMNS: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Programs", to: "/programs" },
      { label: "Events", to: "/events" },
    ],
  },
  {
    heading: "Initiatives",
    links: [
      { label: "Ghana", to: "/ghana-initiatives" },
      { label: "Philadelphia / U.S.", to: "/us-initiatives" },
      { label: "Press & Media", to: "/press" },
    ],
  },
  {
    heading: "Get involved",
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
    <footer className="w-full bg-[#0b1230] px-6 pb-10 pt-16 text-white lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" className="inline-flex items-center" aria-label="F.I.R.E. home">
              <img
                src={fireLogoFullOnDark}
                alt="F.I.R.E. — Free Inspiration Reaching Everyone"
                width={277}
                height={54}
                className="h-[43px] w-auto object-contain md:h-[54px]"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              {SITE.legalName} creates opportunity through education, technology, sports,
              entrepreneurship, and community development across Ghana and the United States.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/70">
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {SITE.email}
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {SITE.addressUS} · {SITE.addressGH}
              </p>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  {col.heading}
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className="text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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

        <div className="grid gap-10 border-b border-white/10 py-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">Stay in the loop.</h2>
            <p className="mt-2 max-w-sm text-sm text-white/65">
              Occasional updates on programmes, events, and impact. No noise.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/60">
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
                className="text-white/70 transition-colors hover:text-white"
              >
                {s.label}
              </a>
            ))}
            <Link to="/privacy-policy" className="text-white/70 underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="text-white/70 underline-offset-4 hover:underline">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
