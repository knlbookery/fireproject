import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CTABand, Section as SiteSection } from "@/components/site/ui";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { FALLBACK_CONTENT, type HeroSlide, type EventItem } from "@/lib/content.functions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import {
  ArrowRight,
  Users,
  Globe2,
  Heart,
  HandHeart,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Flame,
  Trophy,
  Rocket,
  Sprout,
  Laptop,
  GraduationCap,
  Compass,
  Sparkles,
  UserPlus,
  Mail,
  ShieldCheck,
  Lock,
  Award,
  FileCheck,
  Building2,
  TrendingUp,
  Check,
  X,
} from "lucide-react";
import { Atropos } from "atropos/react";
import "atropos/css";

import { useQuery } from "@tanstack/react-query";
import { landingContentQuery } from "@/lib/content";

// Unsplash imagery — editorial, community, Ghana, sports, entrepreneurship
const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// what we do and volunteer imagery
const ghanaAerial = `/images/community_dev.jpg`; // Accra skyline / Ghana
const progSports = `/images/sport.jpg`; // youth sports outdoor
const progBiz = `/images/mission_enterprenuer.jpg`; // entrepreneurship meeting
const volunteers = `/images/impact.jpg`; // volunteers hands together

// capsule imagery
const capsule1 = `/images/capsule1.jpg`; // basketball action
const capsule2 = `/images/capsule2.jpg`; // basketball action
const capsule3 = `/images/capsule3.jpg`; // basketball action
const capsule4 = `/images/capsule4.jpg`; // basketball action
const capsule5 = `/images/basketball.jpg`; // basketball action

// organization team imagery
const portrait1 = `/images/portrait1.jpg`; // African woman entrepreneur
const portrait2 = `/images/portrait2.jpg`; // young man portrait
const portrait3 = `/images/portrait3.jpg`; // young man portrait
const portrait4 = `/images/portrait4.jpg`; // young man portrait
const portrait5 = `/images/portrait5.jpg`; // young man portrait
const portrait6 = `/images/portrait6.jpg`; // young man portrait
const portrait7 = `/images/portrait7.jpg`; // young man portrait

// Logos. Native art is 328x66 for both wordmarks and 430x385 for the icon;
// each is rendered with an explicit height and `w-auto` so the true 4.97:1
// (wordmark) aspect is preserved rather than forced to the nominal target
// size. Widths therefore land within a few px of the specified dimensions.
// TODO: SVG versions are coming — swapping them in removes the raster
// softness these PNGs show at 2x DPI (see CLAUDE.md deferred work).
// Note: /images/firelogo.png is still shipped and referenced as the
// og:image/twitter:image in __root.tsx and youth-empowerment-guide.tsx via
// absolute URLs; it is simply no longer rendered on this page.
const fireLogoFull = { url: `/images/firelogo-full.png` }; // wordmark, dark art for light bg
// Named for where it goes, not what the file is called: the artwork in
// firelogo-full-dark.png is *light* coloured, for use on the dark footer.
const fireLogoFullOnDark = { url: `/images/firelogo-full-dark.png` };
const fireLogoIcon = { url: `/images/firelogo2.png` }; // icon/avatar — mobile header

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "F.I.R.E. — Empowering Communities. Inspiring Futures." },
      {
        name: "description",
        content:
          "F.I.R.E. (Free Inspiration Reaching Everyone) is a nonprofit creating opportunity through education, technology, sports, entrepreneurship, and community development across Ghana and the United States.",
      },
      { property: "og:title", content: "F.I.R.E. — Empowering Communities. Inspiring Futures." },
      {
        property: "og:description",
        content:
          "Creating opportunity through education, technology, sports, entrepreneurship, and community development.",
      },
      { property: "og:image", content: volunteers },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(landingContentQuery),
  component: Landing,
});

/* ---------------------- Button system ---------------------- */
const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const BTN = {
  primary: `${BTN_BASE} bg-primary text-primary-foreground hover:bg-primary/90`,
  secondary: `${BTN_BASE} border border-foreground/15 text-foreground hover:bg-foreground/5`,
  dark: `${BTN_BASE} bg-foreground text-background hover:opacity-90`,
  onDarkOutline: `${BTN_BASE} border border-white/30 text-white hover:bg-white/10`,
  onDarkSolid: `${BTN_BASE} bg-white text-primary hover:bg-white/90`,
} as const;

/* ---------------------- Landing Component ---------------------- */
function Landing() {
  const { data: content } = useQuery(landingContentQuery);

  const activeSlides = content?.heroSlides || FALLBACK_CONTENT.heroSlides;

  const processedSlides = activeSlides.map((slide) => {
    let displayImage = slide.image;

    if (!displayImage) {
      if (slide.eyebrow?.toLowerCase().includes("sport")) {
        displayImage = progSports;
      } else if (slide.eyebrow?.toLowerCase().includes("entrepreneur")) {
        displayImage = progBiz;
      } else {
        displayImage = FALLBACK_CONTENT.heroSlides[0].image;
      }
    }

    return {
      ...slide,
      image: displayImage,
    };
  });

  return (
    <SiteLayout>
      <Hero slides={processedSlides} />

      <Mission />
      <Programs />
      <Impact />
      <Team />
      <Partners />
      <Events fallback={content?.events || []} />

      <CTABand
        title="Give inspiration that changes lives."
        body="Every dollar funds coaching, classrooms, and founders — 100% of your gift reaches F.I.R.E."
        primary={{ label: "Donate", to: "/donate" }}
        secondary={{ label: "Become a sponsor", to: "/sponsors" }}
      />

      <SiteSection
        eyebrow="Get involved"
        title="Become part of the mission."
        intro="Volunteer your time, partner with us, or start a conversation — there's a way in for everyone."
        align="center"
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/volunteer" className={BTN.primary}>
            Volunteer with us
          </Link>
          <Link to="/sponsors" className={BTN.secondary}>
            Partner with F.I.R.E.
          </Link>
          <Link to="/contact" className={BTN.secondary}>
            Contact us
          </Link>
        </div>
      </SiteSection>
    </SiteLayout>
  );
}

/* ---------------------- Hero Slider ---------------------- */
function Hero({ slides: SLIDES }: { slides: HeroSlide[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLElement>(null);

  // SLIDES is a prop whose length can change after mount: the first render
  // uses FALLBACK_HERO, then the Airtable-backed content query resolves and
  // swaps in the live slides. If the incoming array is shorter (an editor
  // deleting a hero slide in Airtable is enough), a previously-valid idx now
  // points past its end — and every read below is an unguarded
  // SLIDES[idx].title / .eyebrow / .subtitle / .cta, so it would throw and
  // take down the whole hero. Clamp on read rather than assuming idx is in
  // range, and key the interval on SLIDES.length so it stops advancing on a
  // stale modulus. The clamp is what covers the gap between the array
  // changing and the next interval tick correcting idx.
  const safeIdx = idx < SLIDES.length ? idx : 0;

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (paused || prefersReducedMotion || SLIDES.length === 0) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, [paused, SLIDES.length]);

  const go = (n: number) => setIdx((n + SLIDES.length) % SLIDES.length);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(safeIdx - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(safeIdx + 1);
    }
  };

  // Airtable returning zero active hero slides yields an empty array, which
  // wins over the fallback ([] is truthy), so this is reachable via content
  // changes alone — and would otherwise be a SLIDES[0] crash.
  if (SLIDES.length === 0) return null;

  return (
    <section
      id="top"
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="F.I.R.E. mission highlights"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative min-h-[760px] w-full overflow-hidden bg-black focus:outline-none lg:h-screen"
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Slide {safeIdx + 1} of {SLIDES.length}: {SLIDES[safeIdx].title}
      </div>
      {SLIDES.map((s, i) => (
        <div
          key={s.title}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${SLIDES.length}: ${s.eyebrow}`}
          aria-hidden={i !== safeIdx}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === safeIdx ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={s.image}
            alt={s.alt}
            className="absolute inset-0 h-full w-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-24 pt-52 text-white sm:pt-56 lg:px-10 lg:pb-40 lg:pt-56">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/85">
            <span className="h-px w-8 bg-white/60" aria-hidden="true" /> {SLIDES[safeIdx].eyebrow}
          </span>
          {/*
            whitespace-pre-line renders real newlines typed into the Airtable
            field as line breaks, while still collapsing incidental runs of
            spaces. This is deliberately not HTML: the values are interpolated
            as text so React escapes them, and a <br/> typed into Airtable
            shows up as literal characters rather than markup. Rendering these
            as HTML would need dangerouslySetInnerHTML, which would make every
            Airtable text field an XSS vector — see CLAUDE.md's requirement
            that public Airtable content is sanitized.
          */}
          {safeIdx === 0 ? (
            <h1 className="mt-5 whitespace-pre-line font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {SLIDES[safeIdx].title}
            </h1>
          ) : (
            <p className="mt-5 whitespace-pre-line font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {SLIDES[safeIdx].title}
            </p>
          )}
          <p className="mt-5 max-w-xl whitespace-pre-line text-base text-white/85 sm:text-lg">
            {SLIDES[safeIdx].subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {SLIDES[safeIdx].cta.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className={`group ${c.primary ? BTN.primary : BTN.onDarkOutline}`}
              >
                {c.label}
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Select slide">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === safeIdx}
                aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${i === safeIdx ? "w-10 bg-white" : "w-5 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(safeIdx - 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/5 text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(safeIdx + 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/5 text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Section wrapper ---------------------- */
function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-6 pt-24 pb-10 lg:px-10 lg:pt-32 lg:pb-10 ${className}`}>
      <div className="mx-auto max-w-[1400px]">
        {(eyebrow || title) && (
          <div className="mb-16 max-w-3xl">
            {eyebrow && (
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                {title}
              </h2>
            )}
            {intro && <p className="mt-6 text-lg text-muted-foreground">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* ---------------------- Capsule Collage ---------------------- */
function CapsuleCollage() {
  const capsules = [
    { img: capsule1, left: "3%", top: "6%", rotate: -22, delay: "0s" },
    { img: capsule2, left: "32%", top: "-2%", rotate: -22, delay: "0.15s" },
    { img: capsule3, left: "64%", top: "6%", rotate: -22, delay: "0.3s" },
    { img: capsule4, left: "23%", top: "44%", rotate: -22, delay: "0.45s" },
    { img: capsule5, left: "50%", top: "40%", rotate: -22, delay: "0.6s" },
  ];
  const dots = [
    { left: "2%", top: "22%", size: 19, color: "bg-primary" },
    { left: "6%", top: "82%", size: 29, color: "bg-accent" },
    { left: "94%", top: "12%", size: 18, color: "bg-accent" },
    { left: "97%", top: "48%", size: 20, color: "bg-primary" },
    { left: "90%", top: "86%", size: 36, color: "bg-primary" },
    { left: "50%", top: "96%", size: 18, color: "bg-accent" },
    { left: "74%", top: "92%", size: 8, color: "bg-emerald-500" },
    { left: "0%", top: "52%", size: 15, color: "bg-rose-500" },
    { left: "84%", top: "0%", size: 10, color: "bg-emerald-500" },
  ];
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[760px]">
      {dots.map((d, i) => (
        <span
          key={`d-${i}`}
          className={`absolute rounded-full ${d.color}`}
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
          }}
        />
      ))}
      {capsules.map((c, i) => (
        <div
          key={`c-${i}`}
          className="absolute h-[54%] w-[20%] overflow-hidden rounded-full shadow-xl ring-1 ring-black/5"
          style={{
            left: c.left,
            top: c.top,
            transform: `rotate(${c.rotate}deg)`,
          }}
        >
          <img
            src={c.img}
            alt=""
            className="h-full w-full object-cover"
            style={{ transform: `rotate(${-c.rotate}deg) scale(1.4)` }}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------------- Mission ---------------------- */
function Mission() {
  return (
    <section id="mission" className="px-6 py-10 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-20">
        <div className="lg:col-span-5">
          <div className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            Our Mission
          </div>
          <h2 className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            We create opportunity where potential already lives.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            F.I.R.E. — Free Inspiration Reaching Everyone — is a nonprofit working alongside
            communities in Ghana and the United States. We invest in education, technology, sports,
            and entrepreneurship to build practical pathways forward — and we walk those pathways
            with the people we serve.
          </p>
          <a
            href="#programs"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            See how we work <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="lg:col-span-7">
          <CapsuleCollage />
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Programs ---------------------- */
const PRIMARY_PILLARS = [
  {
    icon: Trophy,
    title: "Sports",
    desc: "Confidence, teamwork, and leadership built on the court, the field, and the track.",
    img: progSports,
  },
  {
    icon: Rocket,
    title: "Entrepreneurship",
    desc: "Mentorship, capital, and pitch opportunities for founders solving local problems.",
    img: progBiz,
  },
  {
    icon: Sprout,
    title: "Community Development",
    desc: "Infrastructure, partnerships, and long-term investment that strengthens communities.",
    img: ghanaAerial,
  },
];

const SUPPORTING = [
  { icon: Laptop, label: "Technology" },
  { icon: GraduationCap, label: "Education" },
  { icon: Compass, label: "Leadership" },
  { icon: Sparkles, label: "Youth Development" },
  { icon: UserPlus, label: "Mentorship" },
];

function Programs() {
  return (
    <Section
      id="programs"
      eyebrow="What We Do"
      title="Three pillars. One mission."
      intro="Sports, entrepreneurship, and community development drive our work — supported by programs in technology, education, leadership, youth development, and mentorship."
      className="bg-[var(--surface)]"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PRIMARY_PILLARS.map((p) => (
          <Atropos
            key={p.title}
            shadow={false}
            highlight={false}
            rotateXMax={8}
            rotateYMax={8}
            className="rounded-2xl"
          >
            <article className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
              <img
                src={p.img}
                alt={`${p.title} program at F.I.R.E.`}
                data-atropos-offset="-4"
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-white via-white/95 to-transparent"
                data-atropos-offset="0"
              />
              <div
                className="absolute inset-0 flex flex-col justify-end p-7 text-foreground"
                data-atropos-offset="8"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary backdrop-blur">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3
                  className="mt-5 font-display text-3xl font-medium tracking-tight text-foreground"
                  data-atropos-offset="12"
                >
                  {p.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-foreground/70" data-atropos-offset="6">
                  {p.desc}
                </p>
              </div>
            </article>
          </Atropos>
        ))}
      </div>

      <div className="mt-14 border-t border-black/10 pt-10">
        <div className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Supporting programs &amp; services
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {SUPPORTING.map((s) => (
            <span
              key={s.label}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-foreground/85"
            >
              <s.icon className="h-4 w-4 text-primary" />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------------- Impact ---------------------- */
function Impact() {
  const stats = [
    { v: "5,000+", l: "Lives reached through community programs" },
    { v: "$70,500+", l: "Resources distributed to support learning and development" },
    { v: "USA · Ghana", l: "Communities served across two continents" },
  ];
  return (
    <section id="impact" className="px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-3xl bg-[#0b1230] text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="p-10 lg:col-span-5 lg:p-14">
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-accent">
              Our Impact
            </div>
            <h2 className="mt-4 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Impact is measured in changed lives.
            </h2>
            <p className="mt-5 max-w-md text-white/75">
              From education access to youth sports and entrepreneurship support, we meet
              communities where they are — and build forward together.
            </p>
            <a href="#team" className={`mt-8 ${BTN.onDarkOutline}`}>
              Read the team <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="relative lg:col-span-7">
            <img
              src={volunteers}
              alt="Young people supported by F.I.R.E."
              className="h-full max-h-[520px] w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 border-t border-white/10 md:grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className={`p-8 lg:p-10 ${i > 0 ? "md:border-l md:border-white/10" : ""}`}
            >
              <div className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                {s.v}
              </div>
              <div className="mt-2 text-sm text-white/70">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Team ---------------------- */
type Story = {
  img: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  body: string;
};

function Team() {
  const portraits: Story[] = [
    {
      img: portrait1,
      name: "Emil Acolatse",
      role: "Founder & Executive Director",
      location: "USA & Ghana",
      quote: "Empowering communities through shared inspiration and sustainable vision.",
      body: "Leading strategic growth, partnership expansion, and organizational alignment across all regional initiatives.",
    },
    {
      img: portrait2,
      name: "Larz E. Jeter",
      role: "CFO",
      location: "USA & Ghana",
      quote: "Efficiency and empathy are the pillars of impactful execution.",
      body: "Oversees financial planning, budgeting, compliance, and the fiscal architecture supporting F.I.R.E.’s cross-border operations.",
    },
    {
      img: portrait3,
      name: "Donavan S. West",
      role: "CBO",
      location: "USA & Ghana",
      quote: "Real transformation starts at the grassroots level.",
      body: "Driving outreach programs, volunteer mobilization, and building lasting relationships with local partners.",
    },
    {
      img: portrait4,
      name: "James R. Beckley",
      role: "CTO",
      location: "USA & Ghana",
      quote:
        "Building scalable frameworks, systems, and leveraging modern technology to amplify real-world human impact and long-term community value.",
      body: "Architecting and maintaining the core digital platforms, web infrastructures, and automated systems.",
    },
    {
      img: portrait5,
      name: "Zebi Williams",
      role: "Program Director",
      location: "USA & Ghana",
      quote:
        "We empower the people we work alongside with the power to ignite action and spark real change within their lives and their communities.",
      body: "Developing ecosystem growth plans, project roadmaps, and key stakeholder performance frameworks.",
    },
    {
      img: portrait6,
      name: "Star Wright",
      role: "CPO",
      location: "USA & Ghana",
      quote: "Every partnership is an opportunity to uplift lives and create opportunity.",
      body: "Coordinating event execution, field operations, and monitoring program impact across active locations.",
    },
    {
      img: portrait7,
      name: "Sean McMillan",
      role: "Business Intelligence Director",
      location: "USA & Ghana",
      quote: "Information is the key to unlocking potential and driving meaningful change.",
      body: "Coordinating data collection, analysis, and reporting to inform strategic decisions and measure program effectiveness.",
    },
  ];

  // ... rest of your Team carousel calculations, UI triggers, and layout continues unchanged below

  // Triple the list so we can seamlessly loop by jumping between identical copies
  const LOOP = 2;
  const looped = Array.from({ length: LOOP }).flatMap((_, copy) =>
    portraits.map((p, i) => ({ ...p, _key: `${copy}-${i}`, _origIndex: i })),
  );

  const features = [
    {
      title: "Real Community Voices",
      body: "Every story begins with a person. We listen first — then build programs that match what families and youth actually need.",
    },
    {
      title: "Long-Term Mentorship",
      body: "Our fellows and coaches stay with participants for years, not weeks. Relationships are the engine of lasting change.",
    },
    {
      title: "Measurable Impact",
      body: "From scholarships earned to businesses launched and championships won — we track the outcomes that move lives forward.",
    },
  ];

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const velocityRef = useRef(0);
  const modeRef = useRef<"idle" | "drag" | "momentum" | "tween">("idle");
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const hoverPausedRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const AUTO_SPEED = 0.35; // px per ~16ms frame
  const dragState = useRef({
    down: false,
    startX: 0,
    startPos: 0,
    lastX: 0,
    lastT: 0,
    moved: false,
    samples: [] as { x: number; t: number }[],
  });

  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openStory, setOpenStory] = useState<Story | null>(null);
  const openStoryRef = useRef<Story | null>(null);
  useEffect(() => {
    openStoryRef.current = openStory;
  }, [openStory]);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Apply arc transform based on distance from scroller center.
  // In reduced-motion mode, we skip all 3D transforms and just keep cards upright.
  const applyArc = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    const radius = el.clientWidth / 2;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    let closestDist = Infinity;
    let closestIdx = 0;
    cards.forEach((card) => {
      const mid = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = Number(card.dataset.origIndex || 0);
      }
      if (reducedMotion) {
        card.style.transform = "";
        card.style.opacity = "1";
        return;
      }
      const t = Math.max(-1.2, Math.min(1.2, (mid - center) / radius));
      const abs = Math.abs(t);
      const rotate = t * 26;
      const y = abs * abs * 70;
      const z = -abs * abs * 140;
      const scale = 1.04 - abs * abs * 0.22;
      card.style.transform = `translateY(${y}px) translateZ(${z}px) rotate(${rotate}deg) scale(${scale})`;
      // Portraits render at full opacity. This previously faded with
      // distance from centre (down to ~0.58), which let the light section
      // background show through and read as a white wash over the photos
      // rather than as depth. Depth is still conveyed by the rotation,
      // translate, and scale above.
      card.style.opacity = "1";
    });
    setActiveIndex((prev) => (prev === closestIdx ? prev : closestIdx));
  };

  const normalizeLoop = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const copyWidth = el.scrollWidth / LOOP;
    if (copyWidth <= 0) return;
    if (posRef.current < copyWidth * 0.5) {
      posRef.current += copyWidth;
      targetRef.current += copyWidth;
      dragState.current.startPos += copyWidth;
      el.scrollLeft = posRef.current;
    } else if (posRef.current > copyWidth * 1.5) {
      posRef.current -= copyWidth;
      targetRef.current -= copyWidth;
      dragState.current.startPos -= copyWidth;
      el.scrollLeft = posRef.current;
    }
  };

  const ensureRaf = () => {
    if (rafRef.current == null) {
      lastTsRef.current = performance.now();
      rafRef.current = requestAnimationFrame(step);
    }
  };

  const step = (ts: number) => {
    const el = scrollerRef.current;
    if (!el) {
      rafRef.current = null;
      return;
    }
    const dt = Math.min(64, ts - lastTsRef.current) || 16;
    lastTsRef.current = ts;
    const frames = dt / 16.6667;

    if (modeRef.current === "momentum") {
      // Stronger friction in reduced-motion mode → settles almost immediately
      const decayBase = reducedMotion ? 0.7 : 0.95;
      const decay = Math.pow(decayBase, frames);
      velocityRef.current *= decay;
      posRef.current += velocityRef.current * frames;
      if (Math.abs(velocityRef.current) < 0.05) {
        velocityRef.current = 0;
        modeRef.current = "idle";
      }
    } else if (modeRef.current === "tween") {
      const diff = targetRef.current - posRef.current;
      const easeBase = reducedMotion ? 0.5 : 0.22;
      const ease = 1 - Math.pow(1 - easeBase, frames);
      posRef.current += diff * ease;
      if (Math.abs(diff) < 0.3) {
        posRef.current = targetRef.current;
        modeRef.current = "idle";
      }
    }

    // Auto-scroll drift when idle, not paused, and no modal open
    const now = performance.now();
    const canAuto =
      modeRef.current === "idle" &&
      !reducedMotion &&
      !openStoryRef.current &&
      !hoverPausedRef.current &&
      !dragState.current.down &&
      now >= pauseUntilRef.current;
    if (canAuto) {
      posRef.current += AUTO_SPEED * frames;
      targetRef.current = posRef.current;
    }

    el.scrollLeft = posRef.current;

    if (modeRef.current === "idle" && !canAuto) {
      rafRef.current = null;
      return;
    }
    rafRef.current = requestAnimationFrame(step);
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta === 0) return;
    e.preventDefault();
    if (modeRef.current !== "tween") targetRef.current = posRef.current;
    targetRef.current += delta;
    modeRef.current = "tween";
    velocityRef.current = 0;
    pauseUntilRef.current = performance.now() + 2500;
    ensureRaf();
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    velocityRef.current = 0;
    modeRef.current = "idle";
    posRef.current = el.scrollLeft;
    targetRef.current = posRef.current;
    const now = performance.now();
    dragState.current = {
      down: true,
      startX: e.clientX,
      startPos: posRef.current,
      lastX: e.clientX,
      lastT: now,
      moved: false,
      samples: [{ x: e.clientX, t: now }],
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const d = dragState.current;
    if (!el || !d.down) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    posRef.current = d.startPos - dx;
    el.scrollLeft = posRef.current;
    const now = performance.now();
    d.samples.push({ x: e.clientX, t: now });
    while (d.samples.length > 2 && now - d.samples[0].t > 80) d.samples.shift();
    d.lastX = e.clientX;
    d.lastT = now;
    applyArc();
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const d = dragState.current;
    if (!el) return;
    const wasMoved = d.moved;
    d.down = false;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      // pointer already released
    }
    if (d.samples.length >= 2 && !reducedMotion) {
      const first = d.samples[0];
      const last = d.samples[d.samples.length - 1];
      const dt = Math.max(1, last.t - first.t);
      const vxPxPerMs = (last.x - first.x) / dt;
      const vFrame = -vxPxPerMs * 16.6667;
      if (Math.abs(vFrame) > 0.6) {
        velocityRef.current = vFrame;
        modeRef.current = "momentum";
        ensureRaf();
      }
    }
    // Suppress the click that follows a drag
    if (wasMoved) {
      const swallow = (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      el.addEventListener("click", swallow, { capture: true, once: true });
    }
  };

  // Jump to a specific portrait (by original index) — used by pagination dots.
  const scrollToIndex = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    // Find a card in the middle copy matching this index
    let target: HTMLElement | null = null;
    cards.forEach((c) => {
      if (Number(c.dataset.origIndex) === idx && Number(c.dataset.copy) === 1) {
        target = c;
      }
    });
    if (!target) return;
    const mid = (target as HTMLElement).offsetLeft + (target as HTMLElement).offsetWidth / 2;
    const next = mid - el.clientWidth / 2;
    if (reducedMotion) {
      posRef.current = next;
      targetRef.current = next;
      el.scrollLeft = next;
      applyArc();
      return;
    }
    targetRef.current = next;
    modeRef.current = "tween";
    velocityRef.current = 0;
    ensureRaf();
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const copyWidth = el.scrollWidth / LOOP;
    el.scrollLeft = copyWidth;
    posRef.current = copyWidth;
    targetRef.current = copyWidth;
    applyArc();
    // Kick off auto-scroll
    ensureRaf();
    const onScroll = () => {
      if (modeRef.current === "idle" && !dragState.current.down) {
        posRef.current = el.scrollLeft;
        targetRef.current = posRef.current;
      }
      normalizeLoop();
      applyArc();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      const cw = el.scrollWidth / LOOP;
      el.scrollLeft = cw;
      posRef.current = cw;
      targetRef.current = cw;
      applyArc();
    };
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      // Reset the ref, not just cancel the frame — otherwise StrictMode's
      // dev-mode mount→cleanup→mount leaves rafRef.current holding a stale,
      // already-cancelled ID, so ensureRaf()'s null-check on the second
      // mount thinks a frame is already scheduled and never starts a new one.
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [reducedMotion]);

  // Close modal on Escape
  useEffect(() => {
    if (!openStory) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenStory(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openStory]);

  // Resume auto-scroll when modal closes
  useEffect(() => {
    if (!openStory) ensureRaf();
  }, [openStory]);

  return (
    <Section
      id="team"
      eyebrow="Organization"
      title="The Leaders Behind The Spark"
      intro="Through purposeful leadership, our team inspires people, expands opportunity, and creates lasting impact."
      className="bg-[var(--surface)]"
    >
      <div
        className="relative mx-auto w-full"
        style={{ perspective: reducedMotion ? undefined : "1400px" }}
      >
        <div
          ref={scrollerRef}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onMouseEnter={() => {
            hoverPausedRef.current = true;
          }}
          onMouseLeave={() => {
            hoverPausedRef.current = false;
            ensureRaf();
          }}
          className="flex items-end justify-start gap-3 overflow-x-auto overflow-y-hidden px-6 py-10 md:gap-5 md:py-16 cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          role="region"
          aria-label="Community story portraits — swipe or drag to browse"
        >
          {looped.map((p) => (
            <button
              type="button"
              key={p._key}
              data-card
              data-orig-index={p._origIndex}
              data-copy={p._key.split("-")[0]}
              onClick={() => {
                if (dragState.current.moved) return;
                setOpenStory(p);
              }}
              className="group relative shrink-0 cursor-pointer bg-transparent p-0 transition-[opacity] duration-200 hover:!translate-y-0 hover:!rotate-0 hover:!scale-105 will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] rounded-[140px]"
              style={{ transformOrigin: "center bottom" }}
              aria-label={`Open story: ${p.name}, ${p.role}`}
            >
              <div className="overflow-hidden rounded-[140px] bg-black/5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
                <img
                  src={p.img}
                  alt={`Portrait of ${p.name}, ${p.role}`}
                  draggable={false}
                  className="h-[260px] w-[120px] object-cover sm:h-[320px] sm:w-[150px] md:h-[400px] md:w-[180px] lg:h-[460px] lg:w-[210px] pointer-events-none"
                  loading="lazy"
                />
              </div>
              <figcaption className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="font-display text-[11.2px] font-medium">{p.name}</div>
                <div className="text-[8.4px] uppercase tracking-[0.18em] text-muted-foreground">
                  {p.role}
                </div>
              </figcaption>
            </button>
          ))}
        </div>

        {/* Pagination dots + active indicator */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <span className="font-medium text-foreground">{portraits[activeIndex]?.name}</span>
            <span className="mx-2 opacity-40">·</span>
            <span>
              {portraits[activeIndex]?.role} — {portraits[activeIndex]?.location}
            </span>
          </div>
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Jump to story"
          >
            {portraits.map((p, i) => {
              const active = i === activeIndex;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  role="tab"
                  aria-selected={active}
                  aria-label={`Go to ${p.name}`}
                  className={`h-2 rounded-full transition-all duration-300 ${active ? "w-8 bg-primary" : "w-2 bg-black/20 hover:bg-black/40"}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-10 border-t border-black/10 pt-14 md:grid-cols-3 md:gap-12">
        {features.map((f) => (
          <div key={f.title}>
            <h3 className="font-display text-xl font-medium">{f.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <a href="#volunteer" className={BTN.primary}>
          Join the next chapter <ArrowRight className="h-4 w-4" />
        </a>
        <a href="#impact" className={BTN.secondary}>
          See our impact
        </a>
      </div>

      {/* Story detail modal */}
      {openStory && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-modal-title"
        >
          <div
            className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${reducedMotion ? "" : "animate-fade-in"}`}
            onClick={() => setOpenStory(null)}
          />
          <div
            className={`relative z-10 w-full max-w-3xl overflow-hidden rounded-[20px] bg-white shadow-2xl ${reducedMotion ? "" : "animate-scale-in"}`}
          >
            <button
              type="button"
              onClick={() => setOpenStory(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black"
              aria-label="Close story"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-[4/5] md:aspect-auto md:min-h-[460px]">
                <img
                  src={openStory.img}
                  alt={`Portrait of ${openStory.name}, ${openStory.role}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-5 p-6 sm:p-8 md:p-10">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-primary">
                    Community Story
                  </div>
                  <h3
                    id="story-modal-title"
                    className="mt-3 font-display text-3xl font-medium leading-tight sm:text-4xl"
                  >
                    {openStory.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{openStory.role}</span>
                    <span className="opacity-40">·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {openStory.location}
                    </span>
                  </div>
                </div>
                <blockquote className="border-l-2 border-primary pl-4 font-display text-lg italic leading-snug text-foreground sm:text-xl">
                  “{openStory.quote}”
                </blockquote>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {openStory.body}
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a href="#volunteer" className={BTN.primary} onClick={() => setOpenStory(null)}>
                    Support our mission <ArrowRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setOpenStory(null)}
                    className={BTN.secondary}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ---------------------- Events ---------------------- */
type LiveEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  photo: string;
  links?: { label: string; url: string }[];
};

const rsvpFormSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(180),
  // Digits only, 9-10 — covers US 10-digit numbers and Ghanaian numbers in
  // local format (10 with the leading 0, 9 without). The input itself strips
  // non-digits and hard-caps at 10, so this is the server-side-mirrored
  // backstop rather than the primary guard.
  //
  // FUTURE ITERATION: this deliberately does not support international
  // numbers — no country code, no +, no extensions. Adding proper
  // international support (country selector or E.164 parsing via something
  // like libphonenumber-js) is planned; see CLAUDE.md's deferred work.
  phone: z
    .string()
    .trim()
    .regex(/^\d{9,10}$/, "Please enter a valid phone number (9-10 digits)"),
});

type RsvpField = "fullName" | "email" | "phone";

/**
 * Progressive display formatting for the RSVP phone input. State always
 * holds bare digits — which is what rsvpFormSchema, the POST body, and
 * rsvp.php all expect — so this affects only what the user sees as they
 * type. Grouping is US-style, matching the field's placeholder.
 */
function formatPhoneDisplay(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function Events({ fallback }: { fallback: EventItem[] }) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<LiveEvent | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/events.php");
        const data = (await res.json()) as { success: boolean; events?: LiveEvent[] };
        if (!cancelled && data.success && data.events) {
          setEvents(data.events);
        }
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayEvents: LiveEvent[] =
    events.length > 0
      ? events
      : fallback.map((e, i) => ({
          id: `fallback-${i}`,
          name: e.title,
          date: `${e.month} ${e.day}`,
          time: "",
          location: e.place,
          description: "",
          photo: e.img,
        }));

  return (
    <Section id="events" eyebrow="Upcoming Events" title="Show up. Sponsor. Celebrate community.">
      {loading && events.length === 0 ? (
        <p className="text-muted-foreground">Loading upcoming events…</p>
      ) : displayEvents.length === 0 ? (
        <p className="text-muted-foreground">No upcoming events yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayEvents.map((e) => (
            <button
              type="button"
              key={e.id}
              onClick={() => setSelected(e)}
              className="group relative overflow-hidden rounded-2xl bg-black text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <img
                src={e.photo || fallback[0]?.img}
                alt={`${e.name} F.I.R.E. event`}
                className="aspect-[4/3] w-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              {e.date && (
                <div className="absolute left-5 top-5 max-w-[70%] rounded-lg bg-white/95 px-3 py-2 text-foreground">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {e.date}
                  </div>
                  {e.time && (
                    <div className="font-display text-sm font-semibold leading-tight">{e.time}</div>
                  )}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-display text-lg font-medium leading-snug">{e.name}</h3>
                {e.location && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-white/80">
                    <MapPin className="h-3.5 w-3.5" /> {e.location}
                  </div>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                  View details & RSVP <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <EventDetailModal event={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}

function EventDetailModal({ event, onClose }: { event: LiveEvent | null; onClose: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Partial<Record<RsvpField, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Depends on event?.id, not event, deliberately: this resets the form only
  // when a *different* event is opened. Depending on the whole object would
  // re-run on any parent re-render that rebuilds the events array — same
  // event, new object identity — wiping a visitor's half-typed RSVP.
  useEffect(() => {
    if (event) {
      setFullName("");
      setEmail("");
      setPhone("");
      setErrors({});
      setStatus("idle");
      setErrorMessage("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id]);

  const isFallback = event?.id.startsWith("fallback-");

  // Mirrors the Contact form's error-state pattern: validate the blurred
  // field on blur, clear its error as soon as the user edits it again, and
  // show a red border plus red helper text underneath (no modal).
  const validateField = (key: RsvpField) => {
    const result = rsvpFormSchema.safeParse({ fullName, email, phone });
    const message = result.success
      ? undefined
      : result.error.issues.find((issue) => issue.path[0] === key)?.message;
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const clearError = (key: RsvpField) => {
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const inputBase =
    "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2";
  const inputCls = (key: RsvpField) =>
    `${inputBase} ${
      errors[key] ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"
    }`;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!event) return;

    const parsed = rsvpFormSchema.safeParse({ fullName, email, phone });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof typeof errors;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          phone: parsed.data.phone,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };
      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
    } catch (err) {
      console.error("RSVP submit failed", err);
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <Dialog open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        {event && (
          <div className="max-h-[85vh] overflow-y-auto">
            {event.photo && (
              <div className="relative h-52 w-full overflow-hidden md:h-64">
                <img src={event.photo} alt={event.name} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="space-y-6 p-6 md:p-8">
              <DialogHeader className="space-y-2 text-left">
                {event.date && (
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    {event.date}
                    {event.time ? ` • ${event.time}` : ""}
                  </div>
                )}
                <DialogTitle className="font-display text-2xl font-semibold leading-tight md:text-3xl">
                  {event.name}
                </DialogTitle>
                {event.location && (
                  <DialogDescription className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {event.location}
                  </DialogDescription>
                )}
              </DialogHeader>

              {event.description && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              )}

              {event.links && event.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              )}

              <div className="border-t border-border pt-6">
                <h3 className="font-display text-lg font-semibold">Register for the guest list</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll confirm your spot by email.
                </p>

                {isFallback ? (
                  <p className="mt-4 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                    RSVPs open once this event is published from Airtable.
                  </p>
                ) : status === "success" ? (
                  <div className="mt-4 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <div className="font-semibold">You're on the list.</div>
                      <div className="text-muted-foreground">
                        Thanks, {fullName || "friend"} — we'll be in touch with details.
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Full name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(ev) => {
                            setFullName(ev.target.value);
                            clearError("fullName");
                          }}
                          onBlur={() => validateField("fullName")}
                          aria-invalid={!!errors.fullName}
                          aria-describedby={errors.fullName ? "rsvp-fullname-err" : undefined}
                          className={inputCls("fullName")}
                        />
                        {errors.fullName && (
                          <span id="rsvp-fullname-err" className="mt-1 block text-xs text-red-600">
                            {errors.fullName}
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(ev) => {
                            setEmail(ev.target.value);
                            clearError("email");
                          }}
                          onBlur={() => validateField("email")}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "rsvp-email-err" : undefined}
                          className={inputCls("email")}
                        />
                        {errors.email && (
                          <span id="rsvp-email-err" className="mt-1 block text-xs text-red-600">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={14}
                        value={formatPhoneDisplay(phone)}
                        onChange={(ev) => {
                          // Strip anything non-numeric and hard-cap at 10.
                          // Handles paste as well as typing, so letters and
                          // the display formatting characters never reach
                          // state — only bare digits are ever stored.
                          setPhone(ev.target.value.replace(/\D/g, "").slice(0, 10));
                          clearError("phone");
                        }}
                        onBlur={() => validateField("phone")}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "rsvp-phone-err" : undefined}
                        placeholder="(555) 123-4567"
                        className={inputCls("phone")}
                      />
                      {errors.phone && (
                        <span id="rsvp-phone-err" className="mt-1 block text-xs text-red-600">
                          {errors.phone}
                        </span>
                      )}
                    </div>

                    {status === "error" && (
                      <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <DialogFooter className="mt-2 flex flex-row justify-end gap-2 sm:justify-end">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                      >
                        {status === "submitting" ? "Registering…" : "Confirm RSVP"}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </DialogFooter>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ---------------------- Partners ---------------------- */
const exxonLogo = { url: `/images/partners/exxonLogo.png` };
const macarthurLogo = { url: `/images/partners/macarthur.png` };
const urbanAffairsLogo = { url: `/images/partners/urban-affairs-coalition.png` };
const feedChildrenLogo = { url: `/images/partners/feed-the-children.png` };
const tmobileLogo = { url: `/images/partners/tmobile.png` };
const networkForGoodLogo = { url: `/images/partners/network-for-good.png` };
const raytheonLogo = { url: `/images/partners/raytheon.jpg` };
const getTheMillionsLogo = { url: `/images/partners/get-the-millions.jpg` };
const dtrConsultingLogo = { url: `/images/partners/dtr-consulting.png` };
const atolatseLogo = { url: `/images/partners/atolatse.jpg` };
const usGhanaChamberLogo = { url: `/images/partners/us-ghana-chamber.jpg` };
const ejConsultingLogo = { url: `/images/partners/ej-consulting.jpg` };
const mayorsFundLogo = { url: `/images/partners/mayors-fund-philadelphia.png` };
const cityPhiladelphiaV2Logo = { url: `/images/partners/city-of-philadelphia.png` };

const clearbit = (domain: string) => `https://logo.clearbit.com/${domain}`;

const PARTNERS: { name: string; logo: string }[] = [
  { name: "ExxonMobil", logo: exxonLogo.url },
  { name: "MacArthur Foundation", logo: macarthurLogo.url },
  { name: "The Mayor's Fund for Philadelphia", logo: mayorsFundLogo.url },
  { name: "Urban Affairs Coalition", logo: urbanAffairsLogo.url },
  { name: "Feed The Children", logo: feedChildrenLogo.url },
  { name: "City of Philadelphia", logo: cityPhiladelphiaV2Logo.url },
  { name: "T-Mobile", logo: tmobileLogo.url },
  { name: "Network for Good", logo: networkForGoodLogo.url },
  { name: "Raytheon Technologies", logo: raytheonLogo.url },
  { name: "Get The Millions", logo: getTheMillionsLogo.url },
  { name: "DTR Consulting", logo: dtrConsultingLogo.url },
  { name: "Atolatse", logo: atolatseLogo.url },
  { name: "US-Ghana Chamber of Commerce", logo: usGhanaChamberLogo.url },
  { name: "EJ Consulting", logo: ejConsultingLogo.url },
];

function PartnerCard({ p }: { p: (typeof PARTNERS)[number] }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex h-28 w-56 shrink-0 items-center justify-center px-6 opacity-70 transition-all duration-500 hover:opacity-100">
      {failed ? (
        <div className="text-center font-display text-base font-semibold tracking-tight text-foreground">
          {p.name}
        </div>
      ) : (
        <img
          src={p.logo}
          alt={`${p.name} logo`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-h-14 max-w-full object-contain"
        />
      )}
    </div>
  );
}

function Partners() {
  const [paused, setPaused] = useState(false);
  const rowA = PARTNERS.slice(0, Math.ceil(PARTNERS.length / 2));
  const rowB = PARTNERS.slice(Math.ceil(PARTNERS.length / 2));

  return (
    <Section
      id="partners"
      eyebrow="Our Partners"
      title="Built with bold partners."
      intro="From global enterprises to civic leaders and grassroots foundations — these are the collaborators amplifying F.I.R.E.'s mission across Ghana and the United States."
      className="bg-background"
    >
      <div
        className="relative -mx-6 lg:-mx-10"
        role="region"
        aria-label="Partner organizations"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="overflow-hidden py-4">
          <div
            className="flex gap-6 w-max"
            style={{
              animation: "fire-marquee 50s linear infinite",
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {[...rowA, ...rowA].map((p, i) => (
              <PartnerCard key={`a-${i}-${p.name}`} p={p} />
            ))}
          </div>
        </div>

        <div className="overflow-hidden py-4">
          <div
            className="flex gap-6 w-max"
            style={{
              animation: "fire-marquee-reverse 60s linear infinite",
              animationPlayState: paused ? "paused" : "running",
            }}
          >
            {[...rowB, ...rowB].map((p, i) => (
              <PartnerCard key={`b-${i}-${p.name}`} p={p} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl bg-gradient-to-br from-[#0b1230] via-[#0b1230] to-[#1a2a6b] px-8 py-10 text-white md:flex-row md:items-center md:px-12">
        <div>
          <div className="font-display text-2xl font-medium tracking-tight text-white">
            Become a partner.
          </div>
          <p className="mt-2 max-w-xl text-white/70">
            Join a coalition of changemakers funding scholarships, building courts, and launching
            founders.
          </p>
        </div>
        <a href="#contact" className={`${BTN_BASE} bg-accent text-foreground hover:bg-accent/90`}>
          Partner with F.I.R.E. <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <style>{`
        @keyframes fire-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fire-marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </Section>
  );
}
