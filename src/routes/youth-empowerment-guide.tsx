import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/youth-empowerment-guide")({
  head: () => ({
    meta: [
      { title: "How to Start a Youth Empowerment Program — F.I.R.E." },
      {
        name: "description",
        content:
          "A practical guide to starting and sustaining community-led youth empowerment programs, based on F.I.R.E.'s mentorship and logistical frameworks in Ghana and the US.",
      },
      { property: "og:title", content: "How to Start a Youth Empowerment Program — F.I.R.E." },
      {
        property: "og:description",
        content:
          "Practical frameworks for launching mentorship, sports, and education programs that empower young people.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://fireproject.lovable.app/youth-empowerment-guide" },
    ],
    links: [
      { rel: "canonical", href: "https://fireproject.lovable.app/youth-empowerment-guide" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to Start a Youth Empowerment Program",
          author: { "@type": "Organization", name: "F.I.R.E." },
          publisher: {
            "@type": "Organization",
            name: "F.I.R.E.",
            logo: { "@type": "ImageObject", url: "https://fireproject.lovable.app/favicon.ico" },
          },
          mainEntityOfPage: "https://fireproject.lovable.app/youth-empowerment-guide",
        }),
      },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-foreground">
      <p className="text-xs uppercase tracking-[0.22em] text-primary">F.I.R.E. Guide</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        How to start a youth empowerment program
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        A practical, field-tested framework drawn from F.I.R.E.'s work in Ghana and the United
        States — for educators, community leaders, and organizers ready to launch their own
        youth empowerment program.
      </p>

      <section className="prose prose-neutral mt-12 max-w-none">
        <h2>1. Listen to the community first</h2>
        <p>
          Every successful F.I.R.E. program starts with listening. Spend the first 30 days in
          conversation with parents, teachers, faith leaders, and the young people themselves.
          Identify the two or three needs that come up most — academic support, sports, mentorship,
          life skills, or career preparation — and design around those, not around what a funder
          wants to see.
        </p>

        <h2>2. Pick one pillar, then expand</h2>
        <p>
          New programs fail when they try to do everything. Start with one pillar — for example a
          weekly mentorship circle, a Saturday basketball clinic, or a coding club — and run it
          consistently for at least six months before adding a second. F.I.R.E. uses three core
          pillars (Sports, Entrepreneurship, Community Development) with secondary programs in
          technology, education, and leadership layered on once the foundation is stable.
        </p>

        <h2>3. Recruit mentors with a clear commitment</h2>
        <p>
          Ask mentors for a defined commitment: a season, a school year, or a fixed number of
          sessions. Pair every young person with a primary mentor and a backup, run background
          checks, and provide a one-page training that covers safeguarding, listening, and goal
          setting. Mentorship without structure becomes inconsistent — and inconsistency is what
          young people remember most.
        </p>

        <h2>4. Find a free or low-cost venue</h2>
        <p>
          Schools, libraries, community centers, faith spaces, and parks are usually willing to
          host youth programs at no cost in exchange for a clear schedule and clean handoffs. Lock
          in a recurring time slot — same day, same hour, every week — so families can plan
          around it.
        </p>

        <h2>5. Measure what matters</h2>
        <p>
          Track three things from day one: attendance, a single skill metric tied to your pillar
          (reading level, free-throw percentage, business plan completion), and a self-reported
          confidence score. These three numbers tell you whether the program is working and give
          funders a credible story.
        </p>

        <h2>6. Sustain it with shared ownership</h2>
        <p>
          Programs that depend on one founder collapse when that founder steps back. From month
          one, train a second leader, recruit a parent advisory group, and document your weekly
          run-of-show so anyone can pick it up. Sustainability is a leadership pipeline, not a
          grant.
        </p>

        <h2>How F.I.R.E. can help</h2>
        <p>
          We share our curricula, mentor training, and logistical playbooks with community leaders
          launching new programs. If you're starting a youth empowerment program in your community
          and want to compare notes,{" "}
          <Link to="/" hash="contact" className="text-primary underline">
            get in touch with our team
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
