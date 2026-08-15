import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Quote } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section, CTABand, BTN } from "@/components/site/ui";
import { LEADERS } from "@/data/team";
import { usePageCopy } from "@/lib/page-content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/leadership/")({
  head: () =>
    pageHead({
      title: "Leadership — the team behind F.I.R.E.",
      description:
        "Meet the leaders of F.I.R.E. (Free Inspiration Reaching Everyone) — the founders, directors, and officers guiding youth, education, sports, and enterprise programmes in Philadelphia and Ghana.",
      path: "/leadership",
      image: "/images/portrait1.jpg",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "F.I.R.E. Leadership",
        mainEntity: LEADERS.map((l) => ({
          "@type": "Person",
          name: l.name,
          jobTitle: l.role,
          worksFor: { "@type": "NGO", name: "Free Inspiration Reaching Everyone" },
        })),
      },
    }),
  component: LeadershipPage,
});

function LeadershipPage() {
  const copy = usePageCopy("/leadership");
  const hero = copy("hero", {
    eyebrow: "Organisation leaders",
    title: "The people accountable for the work.",
    intro:
      "A cross-border team of operators, builders, and community organisers leading F.I.R.E. across the United States and Ghana.",
    image: "/images/impact.jpg",
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
            <Link to="/volunteer" className={BTN.onDarkSolid}>
              Join the team
            </Link>
            <Link to="/contact" className={BTN.onDarkOutline}>
              Contact leadership
            </Link>
          </>
        }
      />

      <Section
        eyebrow="Leadership"
        title="Meet the leadership team."
        intro="Each leader carries a defined remit — finance, programmes, technology, partnerships — and reports against it every quarter."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {LEADERS.map((l) => (
            <Link
              key={l.slug}
              to="/leadership/$slug"
              params={{ slug: l.slug }}
              className="group flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center transition-colors hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <img
                src={l.img}
                alt={`${l.name}, ${l.role}`}
                className="h-24 w-24 rounded-full object-cover"
                loading="lazy"
              />
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight">{l.name}</h3>
              <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {l.role}
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {l.location}
              </p>
              <span className="mt-4 text-xs font-semibold text-foreground group-hover:underline">
                View profile
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Governance"
        title="How decisions get made."
        className="bg-surface"
        intro="F.I.R.E. is a 501(c)(3) nonprofit. Programme spending, partnerships, and reporting are reviewed by leadership on a quarterly cycle and published in the annual impact report."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Quarterly review",
              b: "Every programme is reviewed against reach, completion, and cost per participant.",
            },
            {
              t: "Open books",
              b: "Financial summaries are published so donors and sponsors can see where money goes.",
            },
            {
              t: "Local leadership",
              b: "Ghana and U.S. programmes are led by people from the communities they serve.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-3xl border border-border bg-card p-8">
              <h3 className="font-display text-xl font-bold tracking-tight">{c.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{c.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTABand
        title="Work alongside this team."
        body="We're always looking for coaches, mentors, and skilled volunteers in Philadelphia and Accra."
        primary={{ label: "Volunteer with us", to: "/volunteer" }}
        secondary={{ label: "Partner with F.I.R.E.", to: "/partners" }}
      />
    </SiteLayout>
  );
}
