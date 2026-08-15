import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section, StatGrid, CTABand } from "@/components/site/ui";
import { IMPACT_STATS, VALUES } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About F.I.R.E. — Our story, values and leadership" },
      {
        name: "description",
        content:
          "F.I.R.E. (Free Inspiration Reaching Everyone) is a 501(c)(3) nonprofit with roots in Philadelphia and Ghana, creating opportunity for young people through sports, education, enterprise and community development.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About us"
        title="Rooted in Philadelphia. Growing in Ghana."
        intro="F.I.R.E. — Free Inspiration Reaching Everyone — exists to put opportunity within reach of young people, wherever they start."
        image="/images/impact.jpg"
      />

      <Section eyebrow="Our story" title="One idea, carried across two countries.">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              F.I.R.E. began the way most durable things do — small, local and stubborn. A handful
              of volunteers in Philadelphia running a weekend basketball programme for young people
              who had the talent but not the team.
            </p>
            <p>
              What started on one court became a set of programmes: mentorship for students,
              training and micro-capital for founders, and neighbourhood projects designed with the
              families who live in them. When members of the community carried the work home to
              Ghana, the model travelled with them.
            </p>
            <p>
              Today the organization works on both sides of the Atlantic with the same conviction:
              opportunity, once unlocked, multiplies. Our job is to unlock it, then get out of the
              way.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/capsule1.jpg"
              alt="Young people at a F.I.R.E. community programme"
              className="col-span-2 h-64 w-full rounded-3xl object-cover"
              loading="lazy"
            />
            <img
              src="/images/sport.jpg"
              alt="Youth sports session in progress"
              className="h-48 w-full rounded-3xl object-cover"
              loading="lazy"
            />
            <img
              src="/images/community_dev.jpg"
              alt="Community development project"
              className="h-48 w-full rounded-3xl object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Impact"
        title="Numbers we're accountable to."
        intro="Published figures, updated each quarter alongside our public impact report."
        className="bg-surface"
      >
        <StatGrid stats={IMPACT_STATS} />
      </Section>

      <Section eyebrow="Our values" title="How we work.">
        <div className="grid gap-6 md:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-3xl border border-border bg-card p-8">
              <h3 className="font-display text-2xl font-bold tracking-tight">{v.title}</h3>
              <p className="mt-3 text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTABand
        title="Bring the work closer to home."
        body="Volunteer your time, partner with us, or give to a programme running right now."
        primary={{ label: "Donate", to: "/donate" }}
        secondary={{ label: "Volunteer with us", to: "/volunteer" }}
      />
    </SiteLayout>
  );
}
