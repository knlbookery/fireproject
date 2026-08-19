import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Check, HandHeart, Handshake } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section, StatGrid, CTABand, BTN } from "@/components/site/ui";
import { InquiryForm } from "@/components/site/InquiryForm";
import { PARTNERS, PARTNER_STEPS, PARTNER_WAYS, type Partner } from "@/data/partners";
import { SPONSOR_TIERS } from "@/data/site";
import { usePageCopy } from "@/lib/page-content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/partners")({
  head: () =>
    pageHead({
      title: "Our Partners — who they are and how they support F.I.R.E.",
      description:
        "The companies, foundations, and civic partners behind F.I.R.E. See who they are, how they support youth programmes in Philadelphia and Ghana, and how your organization can become a partner.",
      path: "/partners",
      image: "/images/editorial/partners.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "F.I.R.E. Partners",
        about: PARTNERS.map((p) => ({ "@type": "Organization", name: p.name })),
      },
    }),
  component: PartnersPage,
});

const CATEGORIES = ["All partners", "Corporate", "Foundation", "Civic & Government", "Community & Advisory"] as const;

function PartnerLogo({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="font-display text-base font-semibold tracking-tight">{partner.name}</span>
    );
  }
  return (
    <img
      src={partner.logo}
      alt={`${partner.name} logo`}
      loading="lazy"
      onError={() => setFailed(true)}
      className="max-h-12 max-w-[160px] object-contain"
    />
  );
}

function PartnersPage() {
  const copy = usePageCopy("/partners");
  const hero = copy("hero", {
    eyebrow: "Our partners",
    title: "Nothing here was built alone.",
    intro:
      "Corporations, foundations, civic offices, and community advisors fund, supply, and advise the work F.I.R.E. delivers in Philadelphia and Ghana.",
    image: "/images/editorial/partners.jpg",
  });

  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All partners");

  const filtered = useMemo(
    () =>
      category === "All partners" ? PARTNERS : PARTNERS.filter((p) => p.category === category),
    [category],
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow={hero.eyebrow!}
        title={hero.title!}
        intro={hero.intro}
        image={hero.image!}
        actions={
          <>
            <a href="#become-a-partner" className={BTN.primary}>
              Become a partner
            </a>
            <Link to="/sponsors" className={BTN.secondary}>
              See sponsorship tiers
            </Link>
          </>
        }
      />

      <Section eyebrow="At a glance" title="What partnership makes possible.">
        <StatGrid
          stats={[
            {
              value: `${PARTNERS.length}`,
              label: "Active partners",
              detail: "Corporate, foundation, civic, and community",
            },
            { value: "2", label: "Countries", detail: "United States and Ghana" },
            {
              value: "6",
              label: "Programme areas",
              detail: "Sports, enterprise, education, tech, outreach, community",
            },
            {
              value: "Quarterly",
              label: "Impact reporting",
              detail: "Figures and stories you can share internally",
            },
          ]}
        />
      </Section>

      <Section
        eyebrow="The directory"
        title="Who our partners are."
        intro="Every partner below contributes something specific — funding, supplies, access, or expertise."
        className="bg-surface"
      >
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter partners by type">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length} partners shown
        </p>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <article key={p.name} className="flex flex-col rounded-3xl border border-border bg-card p-8">
              <div className="flex h-16 items-center">
                <PartnerLogo partner={p} />
              </div>
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{p.name}</h3>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {p.category}
                </span>
                <span className="rounded-full bg-foreground/5 px-3 py-1 text-muted-foreground">
                  {p.region}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.about}</p>
              <p className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-sm text-foreground/85">
                <HandHeart className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {p.support}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Ways to support"
        title="Four ways organizations partner with us."
        intro="Most partnerships combine two or three of these. We'll help you choose the mix that fits your goals."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {PARTNER_WAYS.map((w) => (
            <div key={w.title} className="rounded-3xl border border-border bg-card p-8">
              <Handshake className="h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">{w.title}</h3>
              <p className="mt-3 text-muted-foreground">{w.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How it works"
        title="Becoming a partner takes four steps."
        className="bg-surface"
      >
        <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PARTNER_STEPS.map((s) => (
            <li key={s.step} className="rounded-3xl border border-border bg-card p-8">
              <div className="font-display text-4xl font-bold tracking-tight text-primary/25">
                {s.step}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="What you receive" title="Recognition and reporting, in writing.">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <ul className="space-y-4">
            {[
              "A written partnership scope: what is funded, over what period, and what gets reported.",
              "Quarterly impact figures — reach, completion, and cost per participant.",
              "Logo placement on this page, and on event materials at Champion level and above.",
              "Photography and participant stories cleared for your own communications.",
              "A named contact on the F.I.R.E. leadership team.",
              "Annual acknowledgement in our published impact report.",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 text-base">
                <Check className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-3xl border border-border bg-card p-8">
            <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">
              Prefer a defined tier?
            </h3>
            <p className="mt-3 text-muted-foreground">
              Sponsorship tiers start at {SPONSOR_TIERS[0].amount} and set benefits up front.
            </p>
            <Link to="/sponsors" className={`mt-6 ${BTN.primary}`}>
              View sponsorship tiers <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>

      <Section
        id="become-a-partner"
        eyebrow="Get started"
        title="Start a partnership conversation."
        intro="Tell us about your organization and what you'd like to back. We reply within five working days."
        className="bg-surface"
      >
        <div className="mx-auto max-w-3xl">
          <InquiryForm
            subject="Partnership inquiry"
            organizationLabel="Company, foundation or agency"
            messageLabel="What you'd like to support"
            messagePlaceholder="Tell us about your organization, the programmes you're drawn to, and your timeline…"
            submitLabel="Send partnership inquiry"
            extraFields={[
              {
                name: "support_type",
                label: "Type of support",
                options: PARTNER_WAYS.map((w) => w.title),
              },
            ]}
          />
        </div>
      </Section>

      <CTABand
        title="Every partner starts with one conversation."
        body="Funding, supplies, expertise, or introductions — there is a way for your organization to matter here."
        primary={{ label: "Contact us", to: "/contact" }}
        secondary={{ label: "See our programmes", to: "/programs" }}
      />
    </SiteLayout>
  );
}
