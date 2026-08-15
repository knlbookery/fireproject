import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Quote } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, CTABand, BTN } from "@/components/site/ui";
import { LEADERS } from "@/data/team";
import { absoluteUrl, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/leadership/$slug")({
  head: ({ params }) => {
    const leader = LEADERS.find((l) => l.slug === params.slug);
    return pageHead({
      title: leader
        ? `${leader.name} — ${leader.role} | F.I.R.E.`
        : "Leadership profile | F.I.R.E.",
      description:
        leader?.body ??
        "A leadership profile at F.I.R.E. (Free Inspiration Reaching Everyone).",
      path: `/leadership/${params.slug}`,
      image: leader?.img ?? "/images/portrait1.jpg",
      type: "article",
      jsonLd: leader
        ? {
            "@context": "https://schema.org",
            "@type": "Person",
            name: leader.name,
            jobTitle: leader.role,
            image: absoluteUrl(leader.img),
            worksFor: { "@type": "NGO", name: "Free Inspiration Reaching Everyone" },
            url: absoluteUrl(`/leadership/${leader.slug}`),
          }
        : undefined,
    });
  },
  component: LeaderPage,
});

function LeaderPage() {
  const { slug } = useParams({ from: "/leadership/$slug" });
  const leader = LEADERS.find((l) => l.slug === slug);

  if (!leader) throw notFound();

  const others = LEADERS.filter((l) => l.slug !== slug).slice(0, 4);

  return (
    <SiteLayout>
      <section className="bg-[#0b1230] px-6 pb-16 pt-36 text-white lg:px-10 lg:pb-20 lg:pt-44">
        <div className="mx-auto max-w-[1400px]">
          <Link
            to="/leadership"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All leadership
          </Link>
          <div className="mt-8 flex flex-col items-start gap-8 md:flex-row md:items-center">
            <img
              src={leader.img}
              alt={`${leader.name}, ${leader.role}`}
              className="h-40 w-40 shrink-0 rounded-full object-cover ring-4 ring-white/15"
              loading="eager"
            />
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                {leader.role}
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {leader.name}
              </h1>
              <p className="mt-4 flex items-center gap-1.5 text-sm text-white/70">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {leader.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Profile" title="Remit and responsibilities">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-lg leading-relaxed text-muted-foreground">{leader.body}</p>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {leader.name} works across F.I.R.E.&apos;s programmes in Philadelphia and Ghana,
              reporting against reach, completion, and cost per participant on a quarterly cycle.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className={BTN.primary}>
                Contact leadership
              </Link>
              <Link to="/leadership" className={BTN.secondary}>
                Back to team
              </Link>
            </div>
          </div>
          <blockquote className="rounded-3xl border border-border bg-card p-8">
            <Quote className="h-6 w-6 text-accent" aria-hidden="true" />
            <p className="mt-4 font-display text-xl font-semibold italic leading-relaxed tracking-tight">
              {leader.quote}
            </p>
            <footer className="mt-5 text-sm text-muted-foreground">
              {leader.name}, {leader.role}
            </footer>
          </blockquote>
        </div>
      </Section>

      <Section eyebrow="Team" title="Other leaders" className="bg-surface">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((l) => (
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
              <span className="mt-4 text-xs font-semibold text-foreground group-hover:underline">
                View profile
              </span>
            </Link>
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
