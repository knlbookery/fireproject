import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
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

// Unsplash imagery — editorial, community, Ghana, sports, entrepreneurship
const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const ghanaAerial = U("1580060839134-75a5edca2e99"); // Accra skyline / Ghana
const volunteers = U("1593113598332-cd288d649433"); // volunteers hands together
const storyLab = U("1581091870622-1e7e9b1f17b2"); // students at laptops
const storyLeadership = U("1573497019940-1c28c88b4f3e"); // confident African woman portrait
const storyBasketball = U("1546519638-68e109498ffc"); // basketball action
const portrait1 = U("1531123897727-8f129e1688ce"); // African woman entrepreneur
const portrait2 = U("1500648767791-00dcc994a43e"); // young man portrait
const portrait3 = U("1521119989659-a83eee488004"); // athlete portrait
const portrait4 = U("1507003211169-0a1dd7228f2d"); // older mentor portrait
const portrait5 = U("1502323777036-f29e3972d82f"); // scholar girl
const portrait6 = U("1542178243-bc20204b769f"); // software engineer
const portrait7 = U("1519085360753-af0119f7cbe7"); // hooper
const portrait8 = U("1544005313-94ddf0286df2"); // teacher
const portrait9 = U("1539571696357-5a69c17a67c6"); // founder portrait
const portrait10 = U("1517841905240-472988babdf9"); // student portrait
const progTech = U("1517048676732-d65bc937f952"); // tech classroom
const progYouth = U("1488521787991-ed7bbaae773c"); // youth group
const progSports = U("1552674605-db6ffd4facb5"); // youth sports outdoor
const progBiz = U("1556761175-5973dc0f32e7"); // entrepreneurship meeting
const eventConference = U("1540575467063-178a50c2df87"); // conference
const eventWeekend = U("1529070538774-1843cb3265df"); // community weekend
import fireLogo from "@/assets/fire-logo.png.asset.json";

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
  { label: "Partners", href: "#partners" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

/* ---------------------- Button system (consistent across site) ---------------------- */
const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const BTN = {
  // Solid brand button on light surfaces
  primary: `${BTN_BASE} bg-primary text-primary-foreground hover:bg-primary/90`,
  // Outline button on light surfaces
  secondary: `${BTN_BASE} border border-foreground/15 text-foreground hover:bg-foreground/5`,
  // Solid dark button on light surfaces
  dark: `${BTN_BASE} bg-foreground text-background hover:opacity-90`,
  // Outline button on dark / image backgrounds
  onDarkOutline: `${BTN_BASE} border border-white/30 text-white hover:bg-white/10`,
  // Solid white button on dark / colored backgrounds
  onDarkSolid: `${BTN_BASE} bg-white text-primary hover:bg-white/90`,
} as const;

/* ---------------------- Header ---------------------- */
function Header() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0); // 0 = on hero, 1 = solid
  const [activeId, setActiveId] = useState<string>("top");
  const [logoOffset, setLogoOffset] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  // Smooth transparent -> solid transition based on scroll (first ~160px)
  useEffect(() => {
    const onScroll = () => {
      const start = 40;
      const end = 160;
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Measure logo offset so it can animate to true viewport center on hero
  useEffect(() => {
    const measure = () => {
      if (!headerRef.current || !logoRef.current) return;
      const headerLeft = headerRef.current.getBoundingClientRect().left;
      const restCenter = headerLeft + logoRef.current.offsetLeft + logoRef.current.offsetWidth / 2;
      setLogoOffset(window.innerWidth / 2 - restCenter);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Active section tracking for nav indicator
  useEffect(() => {
    const ids = NAV.map((n) => n.href.replace("#", ""));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onHero = progress < 0.5;
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div
        ref={headerRef}
        className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 sm:px-5"
        style={{
          backgroundColor: `rgba(255,255,255,${progress * 0.85})`,
          backdropFilter: progress > 0.05 ? "blur(12px) saturate(150%)" : "none",
          WebkitBackdropFilter: progress > 0.05 ? "blur(12px) saturate(150%)" : "none",
          borderColor: `rgba(0,0,0,${progress * 0.05})`,
          borderWidth: 1,
          borderStyle: "solid",
          boxShadow:
            progress > 0.05 ? `0 8px 30px -12px rgba(15,23,42,${progress * 0.18})` : "none",
        }}
      >
        {/* Logo — center on hero, slide to left on scroll */}
        <a
          ref={logoRef}
          href="#top"
          className="flex items-center gap-2.5 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(${logoOffset * (1 - progress)}px)`,
          }}
        >
          <img
            src={fireLogo.url}
            alt="F.I.R.E. logo"
            className="h-8 w-8 object-contain md:h-9 md:w-9"
          />
          <span
            className="hidden font-display text-base font-semibold tracking-tight transition-colors sm:inline"
            style={{ color: onHero ? "#ffffff" : "hsl(var(--foreground))" }}
          >
            F.I.R.E.
          </span>
        </a>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-sm transition-opacity duration-300 md:flex"
          style={{ opacity: progress, pointerEvents: progress > 0.5 ? "auto" : "none" }}
        >
          {NAV.map((i) => {
            const id = i.href.replace("#", "");
            const active = activeId === id;
            return (
              <a
                key={i.href}
                href={i.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 transition-colors hover:text-primary ${active ? "text-primary" : "text-foreground/75"}`}
              >
                {i.label}
                <span
                  className={`pointer-events-none absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-primary transition-all duration-300 ${
                    active ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>
        <div
          className="flex items-center gap-2 transition-opacity duration-300"
          style={{ opacity: Math.max(progress, 0.001) }}
        >
          <a
            href="#donate"
            className={`hidden sm:inline-flex ${BTN.primary}`}
            style={{ pointerEvents: progress > 0.5 ? "auto" : "none" }}
          >
            <Heart className="h-4 w-4" />
            Donate
          </a>
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-foreground transition-colors md:hidden"
          >
            <span className="text-lg leading-none">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-auto mt-2 max-w-[1400px] rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-lg md:hidden">
          {NAV.map((i) => {
            const id = i.href.replace("#", "");
            const active = activeId === id;
            return (
              <a
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className={`block py-2 text-sm ${active ? "text-primary font-medium" : "text-foreground/80"}`}
              >
                {i.label}
              </a>
            );
          })}
          <a
            href="#donate"
            onClick={() => setOpen(false)}
            className={`mt-2 flex w-full ${BTN.primary}`}
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
      { label: "Learn more about our mission", href: "#mission", primary: true },
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
    <section
      id="top"
      className="relative min-h-[760px] w-full overflow-hidden bg-black lg:h-screen"
    >
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

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-32 pt-40 text-white sm:pt-48 lg:px-10 lg:pb-40 lg:pt-56">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-white/85">
            <span className="h-px w-8 bg-white/60" /> {SLIDES[idx].eyebrow}
          </span>
          {idx === 0 ? (
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {SLIDES[idx].title}
            </h1>
          ) : (
            <p className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {SLIDES[idx].title}
            </p>
          )}
          <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">{SLIDES[idx].subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {SLIDES[idx].cta.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className={`group ${c.primary ? BTN.primary : BTN.onDarkOutline}`}
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
    { img: storyLeadership, left: "3%", top: "6%", rotate: -22, delay: "0s" },
    { img: progYouth, left: "32%", top: "-2%", rotate: -22, delay: "0.15s" },
    { img: storyBasketball, left: "61%", top: "6%", rotate: -22, delay: "0.3s" },
    { img: progSports, left: "17%", top: "44%", rotate: -22, delay: "0.45s" },
    { img: volunteers, left: "47%", top: "40%", rotate: -22, delay: "0.6s" },
  ];
  const dots = [
    { left: "2%", top: "22%", size: 14, color: "bg-primary" },
    { left: "6%", top: "82%", size: 22, color: "bg-accent" },
    { left: "94%", top: "12%", size: 18, color: "bg-accent" },
    { left: "97%", top: "48%", size: 10, color: "bg-primary" },
    { left: "90%", top: "86%", size: 26, color: "bg-primary" },
    { left: "50%", top: "96%", size: 12, color: "bg-accent" },
    { left: "74%", top: "92%", size: 8, color: "bg-emerald-500" },
    { left: "0%", top: "52%", size: 8, color: "bg-rose-500" },
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
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
              Impact is measured in changed lives.
            </h2>
            <p className="mt-5 max-w-md text-white/75">
              From education access to youth sports and entrepreneurship support, we meet
              communities where they are — and build forward together.
            </p>
            <a href="#stories" className={`mt-8 ${BTN.onDarkOutline}`}>
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
type Story = {
  img: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  body: string;
};

function Stories() {
  const portraits: Story[] = [
    {
      img: portrait1,
      name: "Ama",
      role: "Entrepreneur",
      location: "Accra, Ghana",
      quote: "F.I.R.E. didn't just teach me business — they believed in me before I did.",
      body: "Ama launched a small textile studio after completing the entrepreneurship cohort. Two years on, she employs four young women from her neighborhood.",
    },
    {
      img: storyLeadership,
      name: "Kojo",
      role: "Youth Leader",
      location: "Kumasi, Ghana",
      quote: "The mentors became the older brothers I never had.",
      body: "Kojo now runs weekend leadership circles for 30+ teens, using the same curriculum that changed his trajectory at 16.",
    },
    {
      img: portrait6,
      name: "Nana",
      role: "Software Engineer",
      location: "Accra, Ghana",
      quote: "I went from borrowing a laptop to writing code for a global team.",
      body: "After the tech fellowship, Nana joined a remote engineering team building fintech tools for African SMEs.",
    },
    {
      img: portrait2,
      name: "Daniel",
      role: "Tech Fellow",
      location: "Philadelphia, USA",
      quote: "F.I.R.E. showed me my zip code wasn't my ceiling.",
      body: "Daniel was the first in his family to graduate college. He now mentors high schoolers from his old block.",
    },
    {
      img: portrait8,
      name: "Auntie Adwoa",
      role: "Teacher",
      location: "Cape Coast, Ghana",
      quote: "When you invest in a teacher, you invest in a hundred children.",
      body: "Adwoa runs a F.I.R.E.-supported reading program serving over 200 students across two schools.",
    },
    {
      img: portrait5,
      name: "Esi",
      role: "Scholar",
      location: "Volta Region, Ghana",
      quote: "The scholarship gave me a chance. The community gave me belonging.",
      body: "Esi is studying public health on full scholarship and plans to return home to build maternal care programs.",
    },
    {
      img: portrait10,
      name: "Abena",
      role: "Student",
      location: "Tamale, Ghana",
      quote: "I want to be the doctor my village never had.",
      body: "Abena is a top of her class secondary student with her sights set on medical school — F.I.R.E. covers her boarding and books.",
    },
    {
      img: portrait3,
      name: "Akua",
      role: "Athlete",
      location: "Accra, Ghana",
      quote: "Sport gave me discipline. F.I.R.E. gave me a stage.",
      body: "Akua represented her region in two national tournaments and now coaches a girls' track squad after school.",
    },
    {
      img: portrait7,
      name: "Marcus",
      role: "Hooper",
      location: "Philadelphia, USA",
      quote: "The court is where I learned to lead.",
      body: "Marcus runs the summer hoops league F.I.R.E. sponsors in West Philly — over 180 kids played last season.",
    },
    {
      img: portrait9,
      name: "Yaw",
      role: "Founder",
      location: "Kumasi, Ghana",
      quote: "We don't need handouts. We need a runway — F.I.R.E. built mine.",
      body: "Yaw founded a logistics startup connecting rural farmers to urban markets, now serving 12 districts.",
    },
    {
      img: portrait4,
      name: "Mr. Mensah",
      role: "Mentor",
      location: "Tema, Ghana",
      quote: "Mentorship is the long game. I'm proud to play it.",
      body: "A retired engineer, Mr. Mensah has personally mentored 40+ F.I.R.E. tech fellows over the last six years.",
    },
    {
      img: storyBasketball,
      name: "Kwame",
      role: "Coach",
      location: "Accra, Ghana",
      quote: "Every kid deserves a coach who shows up — every single week.",
      body: "Kwame's after-school program has kept hundreds of teens off the streets and on the court since 2019.",
    },
  ];

  // Triple the list so we can seamlessly loop by jumping between identical copies
  const LOOP = 3;
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
      const opacity = Math.max(0, 1 - abs * 0.35);
      card.style.transform = `translateY(${y}px) translateZ(${z}px) rotate(${rotate}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
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
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
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
      id="stories"
      eyebrow="Community Stories"
      title="The people behind the spark."
      intro="A dozen faces. A dozen journeys. One shared belief — that opportunity, once unlocked, multiplies."
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
                <div className="font-display text-base font-medium">{p.name}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
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
                    Support more stories <ArrowRight className="h-4 w-4" />
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
          <article key={e.title} className="group relative overflow-hidden rounded-2xl bg-black">
            <img
              src={e.img}
              alt={`${e.title} F.I.R.E. event`}
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
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  organization: z
    .string()
    .trim()
    .max(120, { message: "Organization must be less than 120 characters" })
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, { message: "Please share at least 20 characters about your inquiry" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});
type ContactValues = z.infer<typeof contactSchema>;
type ContactErrors = Partial<Record<keyof ContactValues, string>>;

function Contact() {
  const [values, setValues] = useState<ContactValues>({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [modal, setModal] = useState<null | "success" | "error">(null);
  const [errorDetail, setErrorDetail] = useState<string>("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    mountTimeRef.current = Date.now();
  }, []);

  const set = <K extends keyof ContactValues>(key: K, v: ContactValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const inputBase =
    "mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary";
  const inputCls = (k: keyof ContactValues) =>
    `${inputBase} ${errors[k] ? "border-red-500 focus:border-red-500" : "border-black/10"}`;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Honeypot: silently "succeed" without doing anything if filled by a bot
    if (honeypotRef.current && honeypotRef.current.value.trim() !== "") {
      setStatus("success");
      setValues({ name: "", email: "", organization: "", message: "" });
      setModal("success");
      return;
    }

    // Submit-time delay check: reject suspiciously fast submissions
    if (Date.now() - mountTimeRef.current < 2000) {
      setStatus("success");
      setValues({ name: "", email: "", organization: "", message: "" });
      setModal("success");
      return;
    }

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: ContactErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof ContactValues | undefined;
        if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      // Simulate network call — wire to backend in next phase.
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setValues({ name: "", email: "", organization: "", message: "" });
      setModal("success");
    } catch (err) {
      setStatus("error");
      setErrorDetail(err instanceof Error ? err.message : "An unexpected error occurred.");
      setModal("error");
    }
  };

  return (
    <section id="contact" className="px-6 py-6 lg:px-10 lg:py-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 rounded-3xl bg-[#f3f5fb] px-6 py-12 lg:grid-cols-12 lg:gap-20 lg:px-12 lg:py-16">
        <div className="lg:col-span-5">
          <div className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            Inquire
          </div>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
            Let&apos;s start the conversation.
          </h2>
          <p className="mt-5 max-w-md text-foreground/70">
            Interested in sponsoring an event, volunteering, partnering with F.I.R.E., or learning
            more? Send us a note and our team will follow up.
          </p>
          <a
            href="mailto:info@freeinspiration.org"
            className="mt-8 inline-flex items-center gap-3 text-sm text-foreground/80 transition hover:text-primary"
          >
            <Mail className="h-4 w-4 text-primary" />
            info@freeinspiration.org
          </a>
        </div>
        <form
          onSubmit={onSubmit}
          noValidate
          aria-busy={status === "submitting"}
          className="grid grid-cols-1 gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.25)] sm:grid-cols-2 lg:col-span-7 lg:p-8"
        >
          {/* Honeypot field — hidden from real users, catches bots */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
          >
            <label>
              Website
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </label>
          </div>

          <label className="text-sm">
            <span className="text-foreground/80">Full name</span>
            <input
              className={inputCls("name")}
              placeholder="Your name"
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "contact-name-err" : undefined}
              maxLength={100}
              autoComplete="name"
            />
            {errors.name && (
              <span id="contact-name-err" className="mt-1 block text-xs text-red-600">
                {errors.name}
              </span>
            )}
          </label>
          <label className="text-sm">
            <span className="text-foreground/80">Email address</span>
            <input
              type="email"
              className={inputCls("email")}
              placeholder="you@example.com"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "contact-email-err" : undefined}
              maxLength={255}
              autoComplete="email"
            />
            {errors.email && (
              <span id="contact-email-err" className="mt-1 block text-xs text-red-600">
                {errors.email}
              </span>
            )}
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-foreground/80">Organization (optional)</span>
            <input
              className={inputCls("organization")}
              placeholder="Company or organization"
              value={values.organization}
              onChange={(e) => set("organization", e.target.value)}
              maxLength={120}
              autoComplete="organization"
            />
            {errors.organization && (
              <span className="mt-1 block text-xs text-red-600">{errors.organization}</span>
            )}
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="text-foreground/80">How can we help?</span>
            <textarea
              rows={4}
              className={inputCls("message")}
              placeholder="Tell us about your interest — sponsorship, volunteering, partnership…"
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "contact-message-err" : undefined}
              maxLength={1000}
            />
            <div className="mt-1 flex items-center justify-between text-xs">
              {errors.message ? (
                <span id="contact-message-err" className="text-red-600">
                  {errors.message}
                </span>
              ) : (
                <span className="text-foreground/50">Minimum 20 characters</span>
              )}
              <span className="text-foreground/40">{values.message.length}/1000</span>
            </div>
          </label>
          <div className="sm:col-span-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "submitting"}
              className={`${BTN.primary} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {status === "submitting" ? (
                "Sending…"
              ) : (
                <>
                  Send Inquiry <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            {status === "error" && Object.keys(errors).length > 0 && (
              <span className="text-xs text-red-600">Please fix the highlighted fields.</span>
            )}
          </div>
        </form>
      </div>

      {/* Success / Error modals */}
      <Dialog open={modal !== null} onOpenChange={(o) => !o && setModal(null)}>
        <DialogContent>
          {modal === "success" ? (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <DialogTitle className="text-center">Message sent</DialogTitle>
                <DialogDescription className="text-center">
                  Thanks for reaching out. Our team will follow up at the email you provided within
                  1–2 business days.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <button className={BTN.primary} onClick={() => setModal(null)}>
                  Close
                </button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-red-100 text-red-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <DialogTitle className="text-center">Something went wrong</DialogTitle>
                <DialogDescription className="text-center">
                  {errorDetail ||
                    "We couldn't send your message. Please check your connection and try again."}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <button className={BTN.primary} onClick={() => setModal(null)}>
                  Try again
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ---------------------- Donate ---------------------- */
function Donate() {
  const tiers = [
    { amount: 25, label: "Spark", impact: "Provides school supplies for one student for a month." },
    {
      amount: 50,
      label: "Kindle",
      impact: "Funds a week of after-school mentorship for a youth athlete.",
    },
    {
      amount: 100,
      label: "Ignite",
      impact: "Sponsors entrepreneurship training for a community member.",
      featured: true,
    },
    {
      amount: null as number | null,
      label: "Blaze",
      impact: "Choose your own gift — every dollar reaches the field.",
    },
  ];

  const [selectedIdx, setSelectedIdx] = useState<number>(2);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const selected = tiers[selectedIdx];
  const isCustom = selected.amount === null;
  const effectiveAmount = isCustom ? Number(customAmount) : (selected.amount as number);
  const amountValid = Number.isFinite(effectiveAmount) && effectiveAmount >= 1;

  const handleDonate = () => {
    setErrorMsg("");
    if (!amountValid) {
      setErrorMsg(
        isCustom ? "Enter a custom amount of $1 or more." : "Please select a gift amount.",
      );
      return;
    }
    setConfirmOpen(true);
  };

  const allocation = [
    { label: "Programs", pct: 82, color: "bg-primary" },
    { label: "Community Events", pct: 12, color: "bg-accent" },
    { label: "Operations", pct: 6, color: "bg-foreground/40" },
  ];

  const trust = [
    { icon: ShieldCheck, label: "501(c)(3) Nonprofit", sub: "EIN on request" },
    { icon: FileCheck, label: "Tax-Deductible", sub: "Receipt emailed instantly" },
    { icon: Lock, label: "Secure Checkout", sub: "256-bit SSL · PCI compliant" },
    { icon: Award, label: "Audited Annually", sub: "Independent CPA review" },
  ];

  return (
    <section id="donate" className="px-6 py-10 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              Donate
            </div>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Give with confidence.
              <br />
              <span className="text-foreground/60">Watch it become impact.</span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/70">
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-3 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Verified Nonprofit
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-3 py-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              Encrypted Giving
            </span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: tiers */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-foreground/10 bg-white p-6 sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Choose your gift</div>
                  <div className="text-xs text-foreground/60">
                    One-time · Monthly available at checkout
                  </div>
                </div>
                <div className="hidden items-center gap-2 text-xs text-foreground/60 sm:flex">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>2,400+ donors this year</span>
                </div>
              </div>

              {/* Frequency toggle */}
              <div className="mb-4 inline-flex rounded-full border border-foreground/10 bg-foreground/[0.03] p-1 text-xs font-medium">
                {(["one-time", "monthly"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={`rounded-full px-4 py-1.5 capitalize transition ${
                      frequency === f
                        ? "bg-white text-foreground shadow-sm"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {f === "one-time" ? "One-time" : "Monthly"}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {tiers.map((t, i) => {
                  const isSelected = selectedIdx === i;
                  return (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => {
                        setSelectedIdx(i);
                        setErrorMsg("");
                      }}
                      aria-pressed={isSelected}
                      className={`group relative rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                        isSelected
                          ? "border-primary bg-primary text-white shadow-md ring-2 ring-primary/30"
                          : "border-foreground/10 bg-white text-foreground hover:border-primary/40"
                      }`}
                    >
                      {t.featured && (
                        <span className="absolute -top-2 right-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                          Most given
                        </span>
                      )}
                      <div className="font-display text-2xl font-semibold">
                        {t.amount === null ? "Custom" : `$${t.amount}`}
                      </div>
                      <div
                        className={`mt-0.5 text-[11px] font-medium uppercase tracking-wider ${isSelected ? "text-white/80" : "text-primary"}`}
                      >
                        {t.label}
                      </div>
                      <div
                        className={`mt-3 text-xs leading-snug ${isSelected ? "text-white/90" : "text-foreground/70"}`}
                      >
                        {t.impact}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom amount input */}
              {isCustom && (
                <div className="mt-4">
                  <label
                    htmlFor="custom-amount"
                    className="mb-1 block text-xs font-medium text-foreground/70"
                  >
                    Enter your gift amount (USD)
                  </label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/60">
                      $
                    </span>
                    <input
                      id="custom-amount"
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setErrorMsg("");
                      }}
                      placeholder="250"
                      className="w-full rounded-full border border-foreground/15 bg-white py-2 pl-7 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              {/* Allocation bar */}
              <div className="mt-8 border-t border-foreground/10 pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-foreground">Where every dollar goes</div>
                  <div className="text-xs text-foreground/60">FY 2025 · Audited</div>
                </div>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-foreground/5">
                  {allocation.map((a) => (
                    <div
                      key={a.label}
                      className={`${a.color} h-full`}
                      style={{ width: `${a.pct}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-foreground/70">
                  {allocation.map((a) => (
                    <div key={a.label} className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-sm ${a.color}`} />
                      <span className="font-medium text-foreground">{a.pct}%</span>
                      <span>{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button type="button" onClick={handleDonate} className={`flex-1 ${BTN.primary}`}>
                  <Heart className="h-4 w-4" />
                  {amountValid
                    ? `Donate $${effectiveAmount}${frequency === "monthly" ? "/mo" : ""}`
                    : "Donate Now"}
                </button>
                <a href="#contact" className={`flex-1 ${BTN.secondary}`}>
                  <Building2 className="h-4 w-4" />
                  Corporate Giving
                </a>
              </div>
              <p className="mt-4 text-center text-xs text-foreground/60">
                Powered by Stripe & Network for Good · Your information is never shared.
              </p>
            </div>
          </div>

          {/* Right: trust + corporate */}
          <div className="lg:col-span-4">
            <div className="grid h-full grid-rows-[auto_1fr] gap-6">
              {/* Trust badges */}
              <div className="rounded-2xl border border-foreground/10 bg-white p-6">
                <div className="mb-4 text-sm font-medium text-foreground">
                  Trusted & accountable
                </div>
                <ul className="space-y-4">
                  {trust.map((t) => (
                    <li key={t.label} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <t.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{t.label}</div>
                        <div className="text-xs text-foreground/60">{t.sub}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Corporate CTA */}
              <div className="relative overflow-hidden rounded-2xl bg-foreground p-6 text-white">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/30 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-accent/30 blur-2xl" />
                <div className="relative">
                  <Building2 className="h-6 w-6 text-accent" />
                  <h3 className="mt-4 font-display text-xl font-medium leading-tight">
                    Partner with F.I.R.E.
                  </h3>
                  <p className="mt-2 text-sm text-white/75">
                    Workplace giving, matching gifts, and program sponsorships for purpose-led
                    companies.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {["Custom impact reports", "Brand co-marketing", "Employee volunteer days"].map(
                      (i) => (
                        <li key={i} className="flex items-center gap-2 text-white/85">
                          <Check className="h-4 w-4 text-accent" />
                          {i}
                        </li>
                      ),
                    )}
                  </ul>
                  <a href="#contact" className={`mt-5 ${BTN.onDarkSolid}`}>
                    Become a sponsor
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-2xl">
              <Heart className="h-5 w-5 text-primary" />
              Confirm your gift
            </DialogTitle>
            <DialogDescription>
              You're about to give a {frequency === "monthly" ? "monthly recurring" : "one-time"}{" "}
              gift to F.I.R.E.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-foreground/60">
                {selected.label}
              </span>
              <span className="font-display text-3xl font-semibold text-foreground">
                ${effectiveAmount}
                {frequency === "monthly" && (
                  <span className="text-base text-foreground/60">/mo</span>
                )}
              </span>
            </div>
            <p className="mt-2 text-xs text-foreground/70">{selected.impact}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className={`flex-1 ${BTN.secondary}`}
            >
              Cancel
            </button>
            <a
              href={`https://www.networkforgood.com/donation/MakeDonation10.aspx?ORGID2=&amount=${effectiveAmount}&frequency=${frequency}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 ${BTN.primary}`}
            >
              Continue to checkout
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="text-center text-[11px] text-foreground/55">
            Secure checkout · Tax-deductible receipt emailed instantly.
          </p>
        </DialogContent>
      </Dialog>
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
          <a href="#contact" className={BTN.primary}>
            <Users className="h-4 w-4" />
            Volunteer
          </a>
          <a href="#contact" className={BTN.secondary}>
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
          <img src={fireLogo.url} alt="F.I.R.E. logo" className="h-10 w-10 object-contain" />

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

/* ---------------------- Partners ---------------------- */
import exxonLogo from "@/assets/exxonmobil.png.asset.json";
import macarthurLogo from "@/assets/macarthur.svg.asset.json";
import urbanAffairsLogo from "@/assets/urban-affairs-coalition.png.asset.json";
import feedChildrenLogo from "@/assets/feed-the-children.png.asset.json";
import philadelphiaLogo from "@/assets/city-of-philadelphia.png.asset.json";
import tmobileLogo from "@/assets/tmobile.png.asset.json";
import networkForGoodLogo from "@/assets/network-for-good.png.asset.json";
import raytheonLogo from "@/assets/raytheon.png.asset.json";
import getTheMillionsLogo from "@/assets/get-the-millions.png.asset.json";
import dtrConsultingLogo from "@/assets/dtr-consulting.png.asset.json";
import atolatseLogo from "@/assets/atolatse.png.asset.json";
import usGhanaChamberLogo from "@/assets/us-ghana-chamber.png.asset.json";
import ejConsultingLogo from "@/assets/ej-consulting.png.asset.json";
import mayorsFundLogo from "@/assets/mayors-fund-philadelphia.png.asset.json";
import cityPhiladelphiaV2Logo from "@/assets/city-of-philadelphia-v2.png.asset.json";

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
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
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
      <Partners />
      <Events />
      <Contact />
      <Donate />
      <Volunteer />
      <Footer />
    </main>
  );
}
