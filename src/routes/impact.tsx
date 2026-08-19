import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section, StatGrid, CTABand } from "@/components/site/ui";
import { IMPACT_STATS, PROGRAMS } from "@/data/site";
import { usePageCopy } from "@/lib/page-content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/impact")({
  head: () =>
    pageHead({
      title: "Our Impact | F.I.R.E.",
      description:
        "Impact is measured in changed lives. See the reach, resources, and outcomes of F.I.R.E. programmes across Philadelphia and Ghana, updated quarterly.",
      path: "/impact",
      image: "/images/editorial/impact.jpg",
    }),
  component: ImpactPage,
});

const HEADLINE_STATS = [
  { value: "5,000+", label: "Lives reached", detail: "Through community programmes" },
  {
    value: "$70,500+",
    label: "Resources distributed",
    detail: "Equipment, supplies, and scholarships",
  },
  { value: "USA · Ghana", label: "Two continents", detail: "One shared mission" },
  { value: "Quarterly", label: "Public reporting", detail: "Figures published every quarter" },
];

function ImpactPage() {
  const copy = usePageCopy("/impact");
  const hero = copy("hero", {
    eyebrow: "Our impact",
    title: "Impact is measured in changed lives.",
    intro:
      "From education access to youth sports and entrepreneurship support, we meet communities where they are — and publish what happens next.",
    image: "/images/editorial/impact.jpg",
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow={hero.eyebrow!}
        title={hero.title!}
        intro={hero.intro}
        image={hero.image!}
      />

      <Section eyebrow="Headline figures" title="What the work adds up to.">
        <StatGrid stats={HEADLINE_STATS} />
      </Section>

      <Section
        eyebrow="Reach"
        title="Numbers we're accountable to."
        intro="Published figures, updated each quarter alongside our public impact report."
        className="bg-surface"
      >
        <StatGrid stats={IMPACT_STATS} />
      </Section>

      <Section
        eyebrow="By programme"
        title="Where the impact happens."
        intro="Each programme carries its own outcomes — attendance, completion, and follow-on opportunity."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PROGRAMS.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-48 w-full object-cover"
                loading="lazy"
              />
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display text-xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.summary}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
                  {p.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CTABand
        title="Fund the next number on this page."
        body="Donations and partnerships translate directly into programme places, equipment, and mentorship hours."
        primary={{ label: "Donate", to: "/donate" }}
        secondary={{ label: "Become a partner", to: "/partners" }}
      />
    </SiteLayout>
  );
}
