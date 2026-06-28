import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import ghanaAerial from "@/assets/ghana-aerial.jpg";
import volunteers from "@/assets/volunteers.jpg";
import storyLab from "@/assets/story-lab.jpg";
import storyLeadership from "@/assets/story-leadership.jpg";
import storyBasketball from "@/assets/story-basketball.jpg";
import progTech from "@/assets/program-tech.jpg";
import progYouth from "@/assets/program-youth.jpg";
import progSports from "@/assets/program-sports.jpg";
import progBiz from "@/assets/program-entrepreneurship.jpg";
import eventConference from "@/assets/event-conference.jpg";
import eventWeekend from "@/assets/event-weekend.jpg";

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
  component: Landing,
});

const NAV = [
  { label: "Mission", href: "#mission" },
  { label: "Programs", href: "#programs" },
  { label: "Impact", href: "#impact" },
  { label: "Stories", href: "#stories" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

/* ---------------------- Header ---------------------- */
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Flame className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">F.I.R.E.</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-foreground/80 md:flex">
          {NAV.map((i) => (
            <a key={i.href} href={i.href} className="transition-colors hover:text-primary">
              {i.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#donate"
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 sm:inline-flex"
          >
            <Heart className="h-4 w-4" />
            Donate
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 md:hidden"
          >
            <span className="text-lg">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-black/5 bg-white px-6 py-3 md:hidden">
          {NAV.map((i) => (
            <a
              key={i.href}
              href={i.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-foreground/80"
            >
              {i.label}
            </a>
          ))}
          <a
            href="#donate"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
          >
            Donate
          </a>
        </nav>
      )}
    </header>
  );
}

/* ---------------------- Hero Slider ---------------------- */
type Slide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  cta: { label: string; href: string; primary?: boolean }[];
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Our Mission",
    title: "Empowering Communities. Inspiring Futures.",
    subtitle:
      "Creating opportunity through education, technology, sports, entrepreneurship, and community development across Ghana and the United States.",
    image: volunteers,
    alt: "F.I.R.E. community gathering",
    cta: [
      { label: "Learn More", href: "#mission", primary: true },
      { label: "Donate", href: "#donate" },
    ],
  },
  {
    eyebrow: "Education",
    title: "Transforming Lives Through Education.",
    subtitle: "Building brighter futures through access to learning and technology.",
    image: storyLab,
    alt: "Students learning in a F.I.R.E. computer lab",
    cta: [{ label: "Explore Programs", href: "#programs", primary: true }],
  },
  {
    eyebrow: "Sports",
    title: "Sports That Build Leaders.",
    subtitle: "Developing confidence, teamwork, and opportunity through sport.",
    image: storyBasketball,
    alt: "Young athletes in a F.I.R.E. sports program",
    cta: [{ label: "View Sports Programs", href: "#programs", primary: true }],
  },
  {
    eyebrow: "Entrepreneurship",
    title: "Supporting Entrepreneurship.",
    subtitle: "Helping communities create sustainable futures.",
    image: progBiz,
    alt: "Entrepreneur in a F.I.R.E. mentorship program",
    cta: [{ label: "Discover Opportunities", href: "#programs", primary: true }],
  },
  {
    eyebrow: "Get Involved",
    title: "Your Support Changes Lives.",
    subtitle: "Donate, volunteer, sponsor, or partner with us.",
    image: ghanaAerial,
    alt: "Aerial view of a Ghanaian community served by F.I.R.E.",
    cta: [
      { label: "Donate Today", href: "#donate", primary: true },
      { label: "Volunteer", href: "#volunteer" },
    ],
  },
];

function Hero() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);
  const go = (n: number) => setIdx((n + SLIDES.length) % SLIDES.length);

  return (
    <section id="top" className="relative h-[88vh] min-h-[600px] w-full overflow-hidden bg-black">
      {SLIDES.map((s, i) => (
        <div
          key={s.title}
          aria-hidden={i !== idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
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

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-24 pt-32 text-white lg:px-10 lg:pb-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/85">
            <span className="h-px w-8 bg-white/60" /> {SLIDES[idx].eyebrow}
          </span>
          {idx === 0 ? (
            <h1 className="mt-5 font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {SLIDES[idx].title}
            </h1>
          ) : (
            <p className="mt-5 font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {SLIDES[idx].title}
            </p>
          )}
          <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">{SLIDES[idx].subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {SLIDES[idx].cta.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className={
                  c.primary
                    ? "group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                    : "group inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
                }
              >
                {c.label}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-10 bg-white" : "w-5 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous slide"
              onClick={() => go(idx - 1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/5 text-white backdrop-blur transition hover:bg-white/15"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go(idx + 1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/5 text-white backdrop-blur transition hover:bg-white/15"
            >
              <ChevronRight className="h-4 w-4" />
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
    <section id={id} className={`px-6 py-28 lg:px-10 lg:py-36 ${className}`}>
      <div className="mx-auto max-w-[1400px]">
        {(eyebrow || title) && (
          <div className="mb-16 max-w-3xl">
            {eyebrow && (
              <div className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
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
    { img: storyLeadership, left: "6%", top: "8%", rotate: -22, delay: "0s" },
    { img: progYouth, left: "30%", top: "0%", rotate: -22, delay: "0.15s" },
    { img: storyBasketball, left: "54%", top: "6%", rotate: -22, delay: "0.3s" },
    { img: progSports, left: "18%", top: "38%", rotate: -22, delay: "0.45s" },
    { img: volunteers, left: "42%", top: "32%", rotate: -22, delay: "0.6s" },
  ];
  const dots = [
    { left: "2%", top: "20%", size: 14, color: "bg-primary" },
    { left: "8%", top: "78%", size: 22, color: "bg-accent" },
    { left: "92%", top: "12%", size: 18, color: "bg-accent" },
    { left: "96%", top: "44%", size: 10, color: "bg-primary" },
    { left: "88%", top: "82%", size: 26, color: "bg-primary" },
    { left: "48%", top: "92%", size: 12, color: "bg-accent" },
    { left: "70%", top: "88%", size: 8, color: "bg-emerald-500" },
    { left: "0%", top: "50%", size: 8, color: "bg-rose-500" },
    { left: "82%", top: "2%", size: 10, color: "bg-emerald-500" },
  ];
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[720px]">
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
          className="absolute h-[58%] w-[22%] overflow-hidden rounded-full shadow-xl ring-1 ring-black/5"
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
    <section id="mission" className="px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-20">
        <div className="lg:col-span-5">
          <div className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            Our Mission
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {PRIMARY_PILLARS.map((p) => (
          <article
            key={p.title}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]"
          >
            <div className="overflow-hidden">
              <img
                src={p.img}
                alt={p.title}
                className="aspect-[5/4] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col items-center px-8 pb-8 pt-8 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-medium tracking-tight text-foreground">
                {p.title}
              </h3>
              <div className="mt-3 h-px w-10 bg-black/15" />
              <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
              <a
                href="#contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-foreground/85"
              >
                Learn More
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
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
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
              Impact is measured in changed lives.
            </h2>
            <p className="mt-5 max-w-md text-white/75">
              From education access to youth sports and entrepreneurship support, we meet
              communities where they are — and build forward together.
            </p>
            <a
              href="#stories"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Read the stories <ArrowRight className="h-4 w-4" />
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

/* ---------------------- Stories ---------------------- */
function Stories() {
  const items = [
    {
      date: "May 10, 2024",
      title: "A new computer lab opens in the Volta Region",
      img: storyLab,
    },
    {
      date: "Apr 28, 2024",
      title: "F.I.R.E. youth excel in leadership workshop",
      img: storyLeadership,
    },
    {
      date: "Apr 15, 2024",
      title: "Basketball brings communities together in Accra",
      img: storyBasketball,
    },
  ];
  return (
    <Section
      id="stories"
      eyebrow="Community Stories"
      title="Voices from the field."
      className="bg-[var(--surface)]"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((s) => (
          <article key={s.title} className="group">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={s.img}
                alt={s.title}
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            <div className="mt-5">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {s.date}
              </div>
              <h3 className="mt-2 font-display text-xl font-medium leading-snug">{s.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------- Events ---------------------- */
function Events() {
  const items = [
    {
      month: "JUN",
      day: "15",
      title: "Ghana To The Moon Conference & Pitch Event",
      place: "Accra, Ghana",
      img: eventConference,
    },
    {
      month: "JUL",
      day: "20",
      title: "Inspiration Weekend Outreach",
      place: "Philadelphia, USA",
      img: eventWeekend,
    },
    {
      month: "AUG",
      day: "10",
      title: "F.I.R.E. Basketball Tournament",
      place: "Accra, Ghana",
      img: storyBasketball,
    },
  ];
  return (
    <Section
      id="events"
      eyebrow="Upcoming Events"
      title="Sponsor an event. Show up for a community."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((e) => (
          <article
            key={e.title}
            className="group relative overflow-hidden rounded-2xl bg-black"
          >
            <img
              src={e.img}
              alt={e.title}
              className="aspect-[4/3] w-full object-cover opacity-85 transition duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute left-5 top-5 rounded-lg bg-white/95 px-3 py-2 text-center text-foreground">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {e.month}
              </div>
              <div className="font-display text-xl font-semibold leading-none">{e.day}</div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <h3 className="font-display text-lg font-medium leading-snug">{e.title}</h3>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-white/80">
                <MapPin className="h-3.5 w-3.5" /> {e.place}
              </div>
              <a
                href="#contact"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white"
              >
                Sponsor this event <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------- Contact ---------------------- */
function Contact() {
  return (
    <section id="contact" className="px-6 py-28 lg:px-10 lg:py-36">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            Inquire
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
            Let&apos;s start the conversation.
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Interested in sponsoring an event, volunteering, partnering with F.I.R.E., or learning
            more? Send us a note and our team will follow up.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-foreground/80">
            <Mail className="h-4 w-4 text-primary" />
            hello@fire-nonprofit.org
          </div>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 gap-4 rounded-2xl border border-black/5 bg-white p-6 sm:grid-cols-2 lg:col-span-7 lg:p-8"
        >
          <label className="text-sm">
            <span className="text-foreground/80">Full name</span>
            <input
              required
              className="mt-1.5 w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="Your name"
            />
          </label>
          <label className="text-sm">
            <span className="text-foreground/80">Email address</span>
            <input
              required
              type="email"
              className="mt-1.5 w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="you@example.com"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-foreground/80">Organization (optional)</span>
            <input
              className="mt-1.5 w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="Company or organization"
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-foreground/80">How can we help?</span>
            <textarea
              required
              rows={4}
              className="mt-1.5 w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary"
              placeholder="Tell us about your interest — sponsorship, volunteering, partnership…"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Send Inquiry <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ---------------------- Donate ---------------------- */
function Donate() {
  const tiers = ["$25", "$50", "$100", "Custom"];
  return (
    <section id="donate" className="px-6 py-28 lg:px-10 lg:py-36">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-3xl">
        <img
          src={progYouth}
          alt="Children at a F.I.R.E. program"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/60" />
        <div className="relative grid grid-cols-1 gap-12 p-10 text-white lg:grid-cols-12 lg:p-16">
          <div className="lg:col-span-7">
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-white/80">
              Donate
            </div>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Fuel a program.
              <br />
              Transform a community.
            </h2>
            <p className="mt-5 max-w-md text-white/85">
              Your gift funds programs, resources, events, and mentorship that move people from
              potential to opportunity.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              {tiers.map((t) => (
                <button
                  key={t}
                  className="rounded-xl border border-white/30 bg-white/10 px-4 py-5 text-left text-white backdrop-blur transition hover:bg-white/20"
                >
                  <div className="font-display text-xl font-semibold">{t}</div>
                  <div className="mt-1 text-xs text-white/75">
                    {t === "Custom" ? "Choose amount" : "One-time gift"}
                  </div>
                </button>
              ))}
            </div>
            <a
              href="#"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-white/90"
            >
              <Heart className="h-4 w-4" />
              Donate Now
            </a>
            <p className="mt-3 text-center text-xs text-white/70">
              Secure donations powered by our partners.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Volunteer ---------------------- */
function Volunteer() {
  return (
    <section id="volunteer" className="px-6 pb-28 lg:px-10 lg:pb-36">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6 rounded-2xl border border-black/10 bg-white px-8 py-8">
        <div className="flex items-start gap-5">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <HandHeart className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-2xl font-medium tracking-tight">
              Become part of the mission.
            </h3>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Support through volunteering, partnership, or event sponsorship.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Users className="h-4 w-4" />
            Volunteer
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary/5"
          >
            <Globe2 className="h-4 w-4" />
            Partner With Us
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Footer ---------------------- */
function Footer() {
  const links = [...NAV, { label: "Donate", href: "#donate" }];
  return (
    <footer className="border-t border-black/10 bg-[#0b1230] px-6 py-14 text-white lg:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-foreground">
            <Flame className="h-5 w-5" />
          </span>
          <div>
            <div className="font-display text-lg font-semibold tracking-tight">F.I.R.E.</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">
              Free Inspiration Reaching Everyone
            </div>
          </div>
        </a>
        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-white/80">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1400px] flex-col items-start justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/55 md:flex-row md:items-center">
        <div>© {new Date().getFullYear()} F.I.R.E. — Free Inspiration Reaching Everyone.</div>
        <div>Ghana · United States</div>
      </div>
    </footer>
  );
}

/* ---------------------- Page ---------------------- */
function Landing() {
  return (
    <main>
      <Header />
      <Hero />
      <Mission />
      <Programs />
      <Impact />
      <Stories />
      <Events />
      <Contact />
      <Donate />
      <Volunteer />
      <Footer />
    </main>
  );
}
