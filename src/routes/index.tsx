import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { HomeHero } from "@/components/site/HomeHero";
import { BTN, CTABand, Eyebrow, SHELL, StatGrid } from "@/components/site/ui";
import { Reveal } from "@/components/site/motion";
import { ORGANIZATION_JSONLD, pageHead } from "@/lib/seo";
import { landingContentQuery } from "@/lib/content";
import { FALLBACK_CONTENT } from "@/lib/content.functions";
import { IMPACT_STATS, PROGRAMS, SITE, VALUES } from "@/data/site";
import { LEADERS } from "@/data/team";
import { PARTNERS } from "@/data/partners";
import { FALLBACK_ARTICLES, fetchPressArticles, type PressArticle } from "@/lib/press";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "F.I.R.E. — Empowering Communities. Inspiring Futures.",
      description:
        "F.I.R.E. (Free Inspiration Reaching Everyone) is a nonprofit creating opportunity through education, technology, sports, entrepreneurship, and community development across Ghana and the United States.",
      path: "/",
      image: "/images/editorial/impact.jpg",
      jsonLd: ORGANIZATION_JSONLD,
    }),
  loader: ({ context }) => context.queryClient.ensureQueryData(landingContentQuery),
  component: HomePage,
});

/* --------------------------------------------------------------------- */
/* Page                                                                  */
/* --------------------------------------------------------------------- */
function HomePage() {
  const { data: content } = useQuery(landingContentQuery);
  const slides = content?.heroSlides?.length ? content.heroSlides : FALLBACK_CONTENT.heroSlides;

  return (
    <SiteLayout>
      <HomeHero slides={slides} />
      <Ticker />
      <Manifesto />
      <WorkIndex />
      <TwoCountries />
      <ImpactLedger />
      <Voices />
      <Gatherings />
      <Dispatches />
      <PartnerWall />
      <CTABand
        title="Give inspiration that changes lives."
        body="Every gift funds coaching, classrooms, and founders — and every quarter we publish where it went."
        primary={{ label: "Donate", to: "/donate" }}
        secondary={{ label: "Become a sponsor", to: "/sponsors" }}
      />
    </SiteLayout>
  );
}

/* --------------------------------------------------------------------- */
/* 01 — Ticker                                                           */
/* --------------------------------------------------------------------- */
const TICKER_WORDS = [
  "Education",
  "Technology",
  "Sports",
  "Entrepreneurship",
  "Community",
  "Mentorship",
  "Opportunity",
];

function Ticker() {
  const row = [...TICKER_WORDS, ...TICKER_WORDS];
  return (
    <section aria-hidden="true" className="overflow-hidden border-y border-border bg-paper py-5">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] items-center gap-10 whitespace-nowrap px-6 motion-reduce:animate-none">
        {row.map((w, i) => (
          <span key={`${w}-${i}`} className="flex items-center gap-10">
            <span className="font-display text-sm uppercase tracking-[0.32em] text-ink/55">
              {w}
            </span>
            <span className="h-1 w-1 rounded-full bg-primary" />
          </span>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/* 02 — Manifesto                                                        */
/* --------------------------------------------------------------------- */
function Manifesto() {
  return (
    <section className="px-6 py-24 lg:px-10 lg:py-36">
      <div className={SHELL}>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <Reveal variant="right" duration={700}>
              <Eyebrow>Who we are</Eyebrow>
            </Reveal>
            <Reveal variant="blur" delay={80}>
              <p className="mt-8 font-display text-[2rem] font-light leading-[1.08] tracking-tight sm:text-[2.75rem] lg:text-[3.5rem]">
                We put opportunity within walking distance of the young people who need it.
              </p>
            </Reveal>
            <Reveal variant="up" delay={200}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/about" className={BTN.primary}>
                  About F.I.R.E.
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link to="/mission" className={BTN.secondary}>
                  Our mission
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal
                key={v.title}
                variant="up"
                delay={i * 90}
                className="bg-background p-8 lg:p-10"
              >
                <span className="font-display text-xs tracking-[0.28em] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-xl font-normal tracking-tight">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/* 03 — Work index (hover-preview list)                                  */
/* --------------------------------------------------------------------- */
function WorkIndex() {
  const [hovered, setHovered] = useState(0);

  return (
    <section className="bg-sky px-6 py-24 text-ink lg:px-10 lg:py-36">
      <div className={SHELL}>
        <div className="grid gap-8 border-t border-ink/15 pt-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-light leading-[1.02] tracking-tight sm:text-5xl lg:text-[4rem]">
              Six programmes, one index.
            </h2>
          </div>
          <p className="measure text-base leading-relaxed text-muted-foreground lg:pb-2">
            Each line is a live programme with local leadership, a public number attached, and a way
            for you to fund it directly.
          </p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <ul className="border-t border-ink/15">
            {PROGRAMS.map((p, i) => (
              <li key={p.slug}>
                <Link
                  to="/programs"
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  className="group flex items-baseline gap-6 border-b border-ink/15 py-7 transition-colors hover:bg-ink/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:py-9"
                >
                  <span className="w-10 shrink-0 font-display text-xs tracking-[0.24em] text-ink/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-2xl font-light tracking-tight transition-transform duration-500 group-hover:translate-x-2 lg:text-[2.25rem]">
                      {p.title}
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed text-muted-foreground lg:hidden">
                      {p.summary}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-ink/40 transition group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5">
                {PROGRAMS.map((p, i) => (
                  <img
                    key={p.slug}
                    src={p.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                      i === hovered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {PROGRAMS[hovered].summary}
              </p>
              <Link to="/programs" className={`mt-7 ${BTN.secondary}`}>
                All programmes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/* 04 — Two countries                                                    */
/* --------------------------------------------------------------------- */
const PLACES = [
  {
    to: "/us-initiatives",
    label: "Philadelphia, U.S.",
    title: "Neighbourhood work, block by block.",
    body: "Coaching, mentorship, and family support delivered through schools, rec centres, and civic partners across the city.",
    image: "/images/editorial/youth.jpg",
  },
  {
    to: "/ghana-initiatives",
    label: "Accra, Ghana",
    title: "Courts, classrooms, and capital.",
    body: "Community courts, digital literacy labs, and micro-grants built with resident-led councils in Greater Accra.",
    image: "/images/editorial/ghana.jpg",
  },
] as const;

function TwoCountries() {
  return (
    <section className="grid lg:grid-cols-2">
      {PLACES.map((place) => (
        <Link
          key={place.to}
          to={place.to}
          className="group relative isolate flex min-h-[520px] items-end overflow-hidden px-6 py-14 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white lg:min-h-[680px] lg:px-14 lg:py-16"
        >
          <img
            src={place.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 -z-10 h-full w-full scale-105 object-cover transition-transform duration-[1200ms] group-hover:scale-110"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/60" />
          <div className="w-full max-w-lg">
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/70">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {place.label}
            </span>
            <h2 className="mt-6 font-display text-[2rem] font-light leading-[1.05] tracking-tight lg:text-[3rem]">
              {place.title}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/70">{place.body}</p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
              Explore the work
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

/* --------------------------------------------------------------------- */
/* 05 — Impact ledger                                                    */
/* --------------------------------------------------------------------- */
function ImpactLedger() {
  return (
    <section className="px-6 py-24 lg:px-10 lg:py-36">
      <div className={SHELL}>
        <div className="grid gap-8 border-t border-border pt-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Eyebrow>The ledger</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-light leading-[1.02] tracking-tight sm:text-5xl lg:text-[4rem]">
              Counted, not claimed.
            </h2>
          </div>
          <p className="measure text-base leading-relaxed text-muted-foreground lg:pb-2">
            Reach, spend, and outcomes published every quarter — in plain language, for anyone who
            asks.
          </p>
        </div>
        <div className="mt-14">
          <StatGrid stats={IMPACT_STATS} />
        </div>
        <Reveal variant="up" delay={120}>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link to="/impact" className={BTN.primary}>
              Read the impact report
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/volunteer" className={BTN.secondary}>
              Volunteer with us
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/* 06 — Voices / leadership                                              */
/* --------------------------------------------------------------------- */
function Voices() {
  const lead = LEADERS[0];
  const rail = LEADERS.slice(0, 6);

  return (
    <section className="bg-paper px-6 py-24 lg:px-10 lg:py-36">
      <div className={SHELL}>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal variant="up">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={lead.img}
                alt={lead.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <div className="flex flex-col justify-center">
            <div>
              <Eyebrow>Leadership</Eyebrow>
            </div>
            <Reveal variant="blur" delay={80}>
              <blockquote className="mt-8 font-display text-[1.9rem] font-light leading-[1.12] tracking-tight sm:text-[2.5rem] lg:text-[3.25rem]">
                “{lead.quote}”
              </blockquote>
            </Reveal>
            <p className="mt-8 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {lead.name} — {lead.role}
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
              {rail.map((l) => (
                <Link
                  key={l.slug}
                  to="/leadership/$slug"
                  params={{ slug: l.slug }}
                  title={`${l.name} — ${l.role}`}
                  className="group relative h-14 w-14 overflow-hidden rounded-full ring-1 ring-border transition hover:ring-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <img
                    src={l.img}
                    alt={l.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </Link>
              ))}
              <Link
                to="/leadership"
                className="ml-2 inline-flex items-center gap-2 text-sm font-medium text-ink underline-offset-4 hover:underline"
              >
                Meet the team
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/* 07 — Gatherings (live events)                                         */
/* --------------------------------------------------------------------- */
type LiveEvent = {
  id: string;
  name: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
};

async function fetchEvents(): Promise<LiveEvent[]> {
  const res = await fetch("/api/events.php");
  if (!res.ok) throw new Error("Unable to load events");
  const body = (await res.json()) as { events?: LiveEvent[] };
  return Array.isArray(body.events) ? body.events : [];
}

const FALLBACK_EVENTS: LiveEvent[] = [
  {
    id: "f1",
    name: "Youth Summer League — Opening Day",
    date: "June 14, 2026",
    time: "10:00 AM",
    location: "Philadelphia, PA",
    description: "Opening tournament for the summer basketball league, open to families.",
  },
  {
    id: "f2",
    name: "Founder Bootcamp — Cohort Four",
    date: "July 2, 2026",
    time: "9:00 AM",
    location: "Accra, Ghana",
    description: "Eight weeks of business training, micro-grants, and mentorship.",
  },
  {
    id: "f3",
    name: "Community Day & Family Drive",
    date: "August 9, 2026",
    time: "12:00 PM",
    location: "Philadelphia, PA",
    description: "Meals, health screenings, and school supplies for neighbourhood families.",
  },
];

function Gatherings() {
  const { data } = useQuery({
    queryKey: ["home-events"],
    queryFn: fetchEvents,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const events = (data?.length ? data : FALLBACK_EVENTS).slice(0, 3);

  return (
    <section className="px-6 py-24 lg:px-10 lg:py-36">
      <div className={SHELL}>
        <div className="grid gap-8 border-t border-border pt-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Eyebrow>Gatherings</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-light leading-[1.02] tracking-tight sm:text-5xl lg:text-[4rem]">
              Come stand in the room.
            </h2>
          </div>
          <p className="measure text-base leading-relaxed text-muted-foreground lg:pb-2">
            Tournaments, workshops, and community days across Philadelphia and Ghana. RSVP takes a
            minute.
          </p>
        </div>

        <ul className="mt-12">
          {events.map((e, i) => (
            <Reveal key={e.id} variant="up" delay={i * 90}>
              <li>
                <Link
                  to="/events"
                  className="group grid gap-4 border-t border-border py-8 transition-colors hover:bg-paper md:grid-cols-[200px_1fr_auto] md:items-baseline md:gap-10"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {e.date ?? "Date to be announced"}
                    {e.time ? ` · ${e.time}` : ""}
                  </span>
                  <span>
                    <span className="block font-display text-2xl font-light tracking-tight lg:text-3xl">
                      {e.name}
                    </span>
                    {e.location && (
                      <span className="mt-1 block text-sm text-muted-foreground">{e.location}</span>
                    )}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-medium md:justify-self-end">
                    RSVP
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>

        <div className="border-t border-border pt-10">
          <Link to="/events" className={BTN.secondary}>
            See the full calendar
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/* 08 — Dispatches (press)                                               */
/* --------------------------------------------------------------------- */
function Dispatches() {
  const { data } = useQuery<PressArticle[]>({
    queryKey: ["home-press"],
    queryFn: fetchPressArticles,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const articles = (data?.length ? data : FALLBACK_ARTICLES).slice(0, 3);

  return (
    <section className="bg-paper px-6 py-24 lg:px-10 lg:py-36">
      <div className={SHELL}>
        <div className="grid gap-8 border-t border-border pt-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Eyebrow>Dispatches</Eyebrow>
            <h2 className="mt-6 font-display text-4xl font-light leading-[1.02] tracking-tight sm:text-5xl lg:text-[4rem]">
              Latest from the field.
            </h2>
          </div>
          <p className="measure text-base leading-relaxed text-muted-foreground lg:pb-2">
            Reporting, announcements, and short films from both sides of the work.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.slug} variant="up" delay={i * 100}>
              <Link
                to="/press/$slug"
                params={{ slug: a.slug }}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={a.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  />
                </div>
                <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {a.displayDate}
                  {a.category ? ` · ${a.category}` : ""}
                </p>
                <h3 className="mt-3 font-display text-2xl font-light leading-tight tracking-tight">
                  {a.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-10">
          <Link to="/press" className={BTN.secondary}>
            All press & media
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- */
/* 09 — Partner wall                                                     */
/* --------------------------------------------------------------------- */
function PartnerWall() {
  return (
    <section className="px-6 py-24 lg:px-10 lg:py-32">
      <div className={SHELL}>
        <div className="grid gap-10 border-t border-border pt-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <Eyebrow>Partners</Eyebrow>
            <h2 className="mt-6 font-display text-3xl font-light leading-[1.05] tracking-tight lg:text-[2.75rem]">
              Nothing here was built alone.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Corporations, foundations, and civic offices fund, supply, and advise the work.
            </p>
            <Link to="/partners" className={`mt-8 ${BTN.secondary}`}>
              Meet our partners
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4">
            {PARTNERS.slice(0, 12).map((p) => (
              <li
                key={p.name}
                className="flex aspect-[3/2] items-center justify-center bg-background p-6"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  loading="lazy"
                  className="max-h-12 w-auto max-w-[80%] object-contain opacity-60 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {SITE.ein}
        </p>
      </div>
    </section>
  );
}
