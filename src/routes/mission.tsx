import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section, CTABand, BTN } from "@/components/site/ui";
import { VALUES, GALLERY } from "@/data/site";
import { usePageCopy } from "@/lib/page-content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/mission")({
  head: () =>
    pageHead({
      title: "Our Mission | F.I.R.E.",
      description:
        "F.I.R.E. creates opportunity where potential already lives — investing in education, technology, sports, and entrepreneurship alongside communities in Ghana and the United States.",
      path: "/mission",
      image: "/images/editorial/mission.jpg",
    }),
  component: MissionPage,
});

function MissionPage() {
  const copy = usePageCopy("/mission");
  const hero = copy("hero", {
    eyebrow: "Our mission",
    title: "We create opportunity where potential already lives.",
    intro:
      "F.I.R.E. — Free Inspiration Reaching Everyone — works alongside communities in Ghana and the United States, investing in education, technology, sports, and entrepreneurship.",
    image: "/images/editorial/mission.jpg",
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
            <Link to="/programs" className={BTN.primary}>
              See how we work
            </Link>
            <Link to="/impact" className={BTN.secondary}>
              Read our impact
            </Link>
          </>
        }
      />

      <Section eyebrow="Why we exist" title="Talent is everywhere. Opportunity is not.">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              In every neighbourhood we work in — Philadelphia and Accra alike — there is more
              ability than there is access. Young people with the drive to build a business, finish
              school, or lead a team are held back by a missing court, a missing laptop, a missing
              mentor.
            </p>
            <p>
              F.I.R.E. closes those specific gaps. We build practical pathways forward and then walk
              them with the people we serve, staying long enough for the work to compound.
            </p>
            <p>
              We design with communities, never for them. Local leadership decides what gets built,
              and every programme carries a number we are accountable to.
            </p>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-base font-medium text-primary"
            >
              Explore our programmes <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {GALLERY.slice(0, 4).map((src, i) => (
              <img
                key={src}
                src={src}
                alt="F.I.R.E. community programmes in action"
                className={`w-full rounded-3xl object-cover ${i % 3 === 0 ? "h-64" : "h-48"}`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Our values" title="How we work." className="bg-surface">
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
        title="Carry the mission with us."
        body="Give, volunteer, or bring your organization into the work."
        primary={{ label: "Donate", to: "/donate" }}
        secondary={{ label: "Become a partner", to: "/partners" }}
      />
    </SiteLayout>
  );
}
