import { pageHead } from "@/lib/seo";
import { usePageCopy } from "@/lib/page-content";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section, CTABand, BTN } from "@/components/site/ui";
import { PROGRAMS } from "@/data/site";

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
                <Link to="/contact" className={`mt-8 ${BTN.secondary}`}>
                  Ask about this programme <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
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
