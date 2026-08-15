import { pageHead } from "@/lib/seo";
import { usePageCopy } from "@/lib/page-content";
import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section, StatGrid, CTABand, BTN } from "@/components/site/ui";
import { GALLERY } from "@/data/site";

export const Route = createFileRoute("/ghana-initiatives")({
  head: () =>
    pageHead({
      title: "Ghana Initiatives — Youth, sports and enterprise in Accra | F.I.R.E.",
      description:
        "F.I.R.E.'s Ghana initiatives: community courts, school partnerships, founder training, and outreach across Greater Accra and beyond.",
      path: "/ghana-initiatives",
      image: "/images/community_dev.jpg",
    }),
  component: GhanaPage,
});

const WORK = [
  {
    title: "Community courts",
    body: "Three built and maintained courts hosting weekly leagues, coaching clinics, and school tournaments.",
  },
  {
    title: "School partnerships",
    body: "Tutoring, supplies, and scholarship support delivered with partner schools in Greater Accra.",
  },
  {
    title: "Founder training",
    body: "Eight-week business bootcamps followed by micro-grants and continued mentorship.",
  },
  {
    title: "Outreach drives",
    body: "Seasonal food, health, and supply drives coordinated with local community leaders.",
  },
];

function GhanaPage() {
  const copy = usePageCopy("/ghana-initiatives");
  const hero = copy("hero", {
    eyebrow: "Ghana initiatives",
    title: "Accra, and everywhere the work travels next.",
    intro:
      "Locally led programmes in sport, education, and enterprise — built with Ghanaian coaches, teachers, and founders.",
    image: "/images/community_dev.jpg",
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow={hero.eyebrow!}
        title={hero.title!}
        intro={hero.intro}
        image={hero.image!}
        actions={
          <Link to="/donate" className={BTN.onDarkSolid}>
            Support Ghana programmes
          </Link>
        }
      />

      <Section eyebrow="On the ground" title="What we run in Ghana.">
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
              { value: "7,200+", label: "Young people reached" },
              { value: "3", label: "Community courts" },
              { value: "180", label: "Founders trained" },
              { value: "12", label: "Partner schools" },
            ]}
          />
        </div>
      </Section>

      <Section eyebrow="Gallery" title="Moments from the field." className="bg-surface">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {GALLERY.slice(0, 8).map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`F.I.R.E. Ghana programme photo ${i + 1}`}
              className="h-48 w-full rounded-2xl object-cover"
              loading="lazy"
            />
          ))}
        </div>
      </Section>

      <CTABand
        title="Fund the next court."
        body="Each new community court reaches roughly 400 additional young people in its first year."
        primary={{ label: "Donate", to: "/donate" }}
        secondary={{ label: "Partner with F.I.R.E.", to: "/sponsors" }}
      />
    </SiteLayout>
  );
}
