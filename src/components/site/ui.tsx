import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Reveal, Parallax } from "./motion";

/* ---------------------- Button system (shared with the homepage) ------- */
export const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const BTN = {
  primary: `${BTN_BASE} bg-ink text-white hover:bg-ink/90`,
  secondary: `${BTN_BASE} border border-ink/20 text-ink hover:bg-paper`,
  dark: `${BTN_BASE} bg-ink text-white hover:opacity-90`,
  accent: `${BTN_BASE} bg-primary text-primary-foreground hover:bg-primary/90`,
  onDarkOutline: `${BTN_BASE} border border-white/40 text-white hover:bg-white hover:text-ink`,
  onDarkSolid: `${BTN_BASE} bg-white text-ink hover:bg-white/90`,
} as const;

export const SHELL = "mx-auto max-w-[1400px]";

/* ---------------------- Eyebrow ---------------------------------------- */
export function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] ${
        onDark ? "border-white/30 text-white/85" : "border-ink/15 text-ink/70"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${onDark ? "bg-white" : "bg-primary"}`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

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
    <section id={id} className={`px-6 py-24 lg:px-10 lg:py-32 ${className}`}>
      <div className={SHELL}>
        {(eyebrow || title) && (
          <div
            className={`mb-16 border-t border-border pt-10 ${
              align === "center" ? "mx-auto max-w-3xl text-center" : ""
            }`}
          >
            <div
              className={
                align === "center"
                  ? ""
                  : "grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end"
              }
            >
              <div>
                {eyebrow && (
                  <Reveal variant="right" duration={700}>
                    <Eyebrow>{eyebrow}</Eyebrow>
                  </Reveal>
                )}
                {title && (
                  <Reveal variant="blur" delay={80}>
                    <h2 className="mt-6 font-display text-4xl font-light leading-[1.02] tracking-tight sm:text-5xl lg:text-[4rem]">
                      {title}
                    </h2>
                  </Reveal>
                )}
              </div>
              {intro && (
                <Reveal variant="up" delay={180}>
                  <p className="measure text-base leading-relaxed text-muted-foreground lg:pb-2">
                    {intro}
                  </p>
                </Reveal>
              )}
            </div>
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
    <section className="relative isolate flex min-h-[62vh] items-end overflow-hidden bg-sky px-6 pb-16 pt-40 text-ink lg:min-h-[70vh] lg:px-10 lg:pb-20 lg:pt-48">
      <Parallax strength={60} className="absolute inset-x-0 -bottom-[10%] -top-[10%] -z-10">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover opacity-45"
          loading="eager"
        />
      </Parallax>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-sky via-sky/85 to-sky/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent"
      />

      <div className={`${SHELL} w-full`}>
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <Reveal variant="right" duration={700}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal variant="blur" delay={90}>
              <h1 className="mt-7 max-w-4xl font-display text-[2.6rem] font-light leading-[1] tracking-tight sm:text-6xl lg:text-[5rem]">
                {title}
              </h1>
            </Reveal>
          </div>
          <div>
            {intro && (
              <Reveal variant="up" delay={200}>
                <p className="measure text-base leading-relaxed text-muted-foreground">{intro}</p>
              </Reveal>
            )}
            {actions && (
              <Reveal variant="up" delay={300}>
                <div className="mt-7 flex flex-wrap gap-3">{actions}</div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Lead block (editorial opener) ------------------ */
export function LeadBlock({
  statement,
  body,
  action,
}: {
  statement: string;
  body: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="grid gap-10 border-t border-border pt-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
      <Reveal variant="blur">
        <p className="font-display text-3xl font-light leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
          {statement}
        </p>
      </Reveal>
      <Reveal variant="up" delay={120}>
        <div className="measure space-y-4 text-base leading-relaxed text-muted-foreground">
          {body}
        </div>
        {action && <div className="mt-7">{action}</div>}
      </Reveal>
    </div>
  );
}

/* ---------------------- Full-bleed band -------------------------------- */
export function FullBleedBand({
  image,
  children,
  reverse = false,
}: {
  image: string;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="grid items-stretch lg:grid-cols-2">
      <div className={`relative min-h-[320px] bg-background lg:min-h-[620px] ${reverse ? "lg:order-2" : ""}`}>
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="fade-edges-white absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div
        className={`flex items-center bg-sky px-6 py-20 text-ink lg:px-16 lg:py-24 ${
          reverse ? "lg:order-1" : ""
        }`}
      >
        <div className="w-full max-w-xl">{children}</div>
      </div>
    </section>
  );
}

/* ---------------------- Pull quote ------------------------------------- */
export function PullQuote({
  quote,
  attribution,
  image,
}: {
  quote: string;
  attribution?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-sky px-6 py-28 text-ink lg:px-10 lg:py-36">
      {image && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
            loading="lazy"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-sky/70" />
        </>
      )}
      <div className={`${SHELL} max-w-4xl`}>
        <Reveal variant="blur">
          <blockquote className="font-display text-3xl font-light leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            “{quote}”
          </blockquote>
        </Reveal>
        {attribution && (
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-ink/60">{attribution}</p>
        )}
      </div>
    </section>
  );
}

/* ---------------------- Editorial list row ----------------------------- */
export function ListRow({
  lead,
  title,
  meta,
  children,
  action,
}: {
  lead: ReactNode;
  title: string;
  meta?: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="grid gap-4 border-t border-border py-8 md:grid-cols-[180px_1fr_auto] md:items-baseline md:gap-10">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{lead}</div>
      <div>
        <h3 className="font-display text-2xl font-light tracking-tight lg:text-3xl">{title}</h3>
        {meta && <p className="mt-1 text-sm text-muted-foreground">{meta}</p>}
        {children && <div className="measure mt-3 text-sm text-muted-foreground">{children}</div>}
      </div>
      {action && <div className="md:justify-self-end">{action}</div>}
    </div>
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
    <div
      className={`grid border-t sm:grid-cols-2 lg:grid-cols-4 ${
        onDark ? "border-white/15" : "border-border"
      }`}
    >
      {stats.map((s, i) => (
        <Reveal
          key={s.label}
          variant="up"
          delay={i * 110}
          className={`border-b py-10 pr-8 lg:border-b-0 lg:border-r lg:pl-8 lg:first:pl-0 lg:last:border-r-0 ${
            onDark ? "border-white/15 text-white" : "border-border"
          }`}
        >
          <div className="font-display text-5xl font-light tracking-tight lg:text-6xl">
            {s.value}
          </div>
          <div className="mt-4 text-xs font-medium uppercase tracking-[0.18em]">{s.label}</div>
          {s.detail && (
            <p className={`mt-2 text-sm ${onDark ? "text-white/60" : "text-muted-foreground"}`}>
              {s.detail}
            </p>
          )}
        </Reveal>
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
    <section className="bg-sky px-6 py-24 text-ink lg:px-10 lg:py-32">
      <div className={`${SHELL} grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end`}>
        <h2 className="font-display text-4xl font-light leading-[1.03] tracking-tight sm:text-5xl lg:text-[4.5rem]">
          {title}
        </h2>
        <div>
          <p className="measure text-base leading-relaxed text-muted-foreground">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={primary.to} className={BTN.accent}>
              {primary.label}
            </Link>
            {secondary && (
              <Link to={secondary.to} className={BTN.secondary}>
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
