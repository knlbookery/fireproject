import { pageHead } from "@/lib/seo";
import { usePageCopy } from "@/lib/page-content";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section, StatGrid, CTABand, BTN } from "@/components/site/ui";

export const Route = createFileRoute("/us-initiatives")({
  head: () =>
    pageHead({
      title: "Philadelphia & U.S. Initiatives | F.I.R.E.",
      description:
        "F.I.R.E.'s U.S. work: Philadelphia youth leagues, mentorship cohorts, family support drives, and career pathways for students.",
      path: "/us-initiatives",
      image: "/images/impact.jpg",
    }),
  component: UsPage,
});

const WORK = [
  {
    title: "Youth leagues",
    body: "Season-long basketball leagues with trained coaches, transport support, and academic check-ins.",
  },
  {
    title: "Mentorship cohorts",
    body: "Students paired with vetted mentors for a structured year of monthly guidance and goal setting.",
  },
  {
    title: "Family support drives",
    body: "Seasonal meals, school supplies, and winter essentials distributed through neighbourhood partners.",
  },
  {
    title: "Career pathways",
    body: "Workshops, internships, and introductions that connect graduating students to real openings.",
  },
];

function UsPage() {
  const copy = usePageCopy("/us-initiatives");
  const hero = copy("hero", {
    eyebrow: "Philadelphia / U.S. initiatives",
    title: "The neighbourhood where it started.",
    intro:
      "Philadelphia remains our home base — leagues, mentorship, and family support running block by block.",
    image: "/images/basketball.jpg",
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow={hero.eyebrow!}
        title={hero.title!}
        intro={hero.intro}
        image={hero.image!}
        actions={
          <Link to="/volunteer" className={BTN.onDarkSolid}>
            Volunteer in Philadelphia
          </Link>
        }
      />

      <Section eyebrow="On the ground" title="What we run in the U.S.">
        <div className="grid gap-6 md:grid-cols-2">
          {WORK.map((w) => (
            <div key={w.title} className="rounded-3xl border border-border bg-card p-8">
              <h3 className="font-display text-2xl font-bold tracking-tight">{w.title}</h3>
              <p className="mt-3 text-muted-foreground">{w.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <StatGrid
            stats={[
              { value: "5,200+", label: "Young people reached" },
              { value: "62", label: "Mentorship graduates" },
              { value: "18", label: "Community partners" },
              { value: "9", label: "Neighbourhoods served" },
            ]}
          />
        </div>
      </Section>

      <CTABand
        title="Back a Philadelphia season."
        body="A single sponsored season covers coaching, equipment, transport, and academic support for one team."
        primary={{ label: "Donate", to: "/donate" }}
        secondary={{ label: "Become a sponsor", to: "/sponsors" }}
      />
    </SiteLayout>
  );
}
