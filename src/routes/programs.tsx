import { pageHead } from "@/lib/seo";
import { usePageCopy } from "@/lib/page-content";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Users } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section, CTABand, BTN } from "@/components/site/ui";
import { ProgramDonateDialog } from "@/components/site/ProgramDonateDialog";
import { PROGRAMS } from "@/data/site";
import {
  formatGiftDate,
  formatMoney,
  useDonationSummary,
  type ProgrammeDonations,
} from "@/lib/donations";

/** Live funding progress for one programme, fed by the Zeffy webhook ledger. */
function ProgrammeFunding({
  funding,
  goal,
}: {
  funding?: ProgrammeDonations;
  goal?: number;
}) {
  if (!funding || funding.raised <= 0) return null;

  const currency = funding.currency || "USD";
  const pct = goal && goal > 0 ? Math.min(100, Math.round((funding.raised / goal) * 100)) : null;
  const lastGift = formatGiftDate(funding.lastGiftAt);

  return (
    <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold">
          <span className="font-display text-2xl tracking-tight">
            {formatMoney(funding.raised, currency)}
          </span>{" "}
          <span className="text-muted-foreground font-normal">
            raised{goal ? ` of ${formatMoney(goal, currency)}` : ""}
          </span>
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {funding.supporters} {funding.supporters === 1 ? "supporter" : "supporters"}
        </p>
      </div>

      {pct !== null && (
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Funding progress"
        >
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
      )}

      {lastGift && (
        <p className="mt-3 text-xs text-muted-foreground">Most recent gift: {lastGift}</p>
      )}
    </div>
  );
}

export const Route = createFileRoute("/programs")({
  head: () =>
    pageHead({
      title: "Programs — Sports, enterprise, education and outreach | F.I.R.E.",
      description:
        "Explore F.I.R.E. programmes: youth sports and wellness, entrepreneurship training, community development, education and mentorship, technology access, and community outreach.",
      path: "/programs",
      image: "/images/sport.jpg",
    }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const copy = usePageCopy("/programs");
  const hero = copy("hero", {
    eyebrow: "Programs",
    title: "Six programmes. One throughline: opportunity.",
    intro:
      "Each programme is built with local leadership, measured against a public number, and designed to outlast the funding cycle that started it.",
    image: "/images/sport.jpg",
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow={hero.eyebrow!}
        title={hero.title!}
        intro={hero.intro}
        image={hero.image!}
        actions={
          <>
            <Link to="/donate" className={BTN.onDarkSolid}>
              Fund a programme
            </Link>
            <Link to="/volunteer" className={BTN.onDarkOutline}>
              Volunteer with us
            </Link>
          </>
        }
      />

      <Section>
        <div className="space-y-6">
          {PROGRAMS.map((p, i) => (
            <article
              key={p.slug}
              className={`grid overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
              }`}
            >
              <figure className="m-0">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-64 w-full object-cover lg:h-full lg:min-h-[340px]"
                  loading="lazy"
                />
              </figure>
              <div className="p-8 lg:p-12">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Programme {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight lg:text-4xl">
                  {p.title}
                </h2>
                <p className="mt-4 text-muted-foreground">{p.summary}</p>
                <ul className="mt-6 space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ProgramDonateDialog
                    programSlug={p.slug}
                    programTitle={p.title}
                    triggerClassName={BTN.primary}
                  />
                  <Link to="/contact" className={BTN.secondary}>
                    Ask about this programme <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CTABand
        title="Sponsor a cohort."
        body="Programme sponsorship funds a named cohort end to end — equipment, coaching, and reporting included."
        primary={{ label: "Become a sponsor", to: "/sponsors" }}
        secondary={{ label: "Talk to our team", to: "/contact" }}
      />
    </SiteLayout>
  );
}
