import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Reveal, Parallax } from "./motion";


/* ---------------------- Button system (shared with the homepage) ------- */
export const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const BTN = {
  primary: `${BTN_BASE} bg-primary text-primary-foreground hover:bg-primary/90`,
  secondary: `${BTN_BASE} border border-foreground/15 text-foreground hover:bg-foreground/5`,
  dark: `${BTN_BASE} bg-foreground text-background hover:opacity-90`,
  accent: `${BTN_BASE} bg-accent text-accent-foreground hover:bg-accent/90`,
  onDarkOutline: `${BTN_BASE} border border-white/30 text-white hover:bg-white/10`,
  onDarkSolid: `${BTN_BASE} bg-white text-primary hover:bg-white/90`,
} as const;

export const SHELL = "mx-auto max-w-[1400px]";

/* ---------------------- Section wrapper -------------------------------- */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  align = "left",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <section id={id} className={`px-6 py-20 lg:px-10 lg:py-28 ${className}`}>
      <div className={SHELL}>
        {(eyebrow || title) && (
          <div className={`mb-14 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
            {eyebrow && (
              <Reveal variant="right" duration={700}>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  {eyebrow}
                </div>
              </Reveal>
            )}
            {title && (
              <Reveal variant="blur" delay={80}>
                <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  {title}
                </h2>
              </Reveal>
            )}
            {intro && (
              <Reveal variant="up" delay={180}>
                <p className="mt-6 text-lg text-muted-foreground">{intro}</p>
              </Reveal>
            )}
          </div>
        )}
        <Reveal variant="up" delay={120} threshold={0.05}>
          {children}
        </Reveal>

      </div>
    </section>
  );
}

/* ---------------------- Page hero (inner pages) ------------------------ */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  actions,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  actions?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#0b1230] px-6 pb-20 pt-36 text-white lg:px-10 lg:pb-28 lg:pt-44">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
        loading="eager"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1230] via-[#0b1230]/85 to-[#0b1230]/40"
      />
      <div className={SHELL}>
        <div className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
            {eyebrow}
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-tight sm:text-5xl lg:text-7xl">
            {title}
          </h1>
          {intro && <p className="mt-6 max-w-2xl text-lg text-white/75">{intro}</p>}
          {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Stats ------------------------------------------ */
export function StatGrid({
  stats,
  onDark = false,
}: {
  stats: { value: string; label: string; detail?: string }[];
  onDark?: boolean;
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className={`p-8 ${onDark ? "bg-[#0b1230] text-white" : "bg-card"}`}>
          <div className="font-display text-4xl font-bold tracking-tight lg:text-5xl">
            {s.value}
          </div>
          <div className="mt-3 text-sm font-semibold uppercase tracking-[0.14em]">{s.label}</div>
          {s.detail && (
            <p className={`mt-2 text-sm ${onDark ? "text-white/60" : "text-muted-foreground"}`}>
              {s.detail}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------------- Closing CTA band -------------------------------- */
export function CTABand({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: string;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="px-6 pb-24 lg:px-10">
      <div
        className={`${SHELL} flex flex-col items-start justify-between gap-8 rounded-3xl bg-gradient-to-br from-[#0b1230] via-[#0b1230] to-[#1a2a6b] px-8 py-14 text-white md:flex-row md:items-center md:px-14`}
      >
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight lg:text-4xl">{title}</h2>
          <p className="mt-3 max-w-xl text-white/70">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={primary.to} className={BTN.accent}>
            {primary.label}
          </Link>
          {secondary && (
            <Link to={secondary.to} className={BTN.onDarkOutline}>
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
