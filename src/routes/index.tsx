import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors";
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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-500 ${
        scrolled || open
          ? "translate-y-0 border-black/5 bg-white/85 opacity-100 backdrop-blur"
          : "pointer-events-none -translate-y-full border-transparent bg-transparent opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-10">
        <a href="#top" className="flex items-center gap-2.5">
          <img src={fireLogo.url} alt="F.I.R.E. logo" className="h-10 w-10 object-contain" />
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
            className={`hidden sm:inline-flex ${BTN.primary}`}
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
    <section id="top" className="relative min-h-[760px] w-full overflow-hidden bg-black lg:h-screen">
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
            <article className="group relative overflow-hidden rounded-2xl bg-black">
              <img
                src={p.img}
                alt={`${p.title} program at F.I.R.E.`}
                data-atropos-offset="-4"
                className="aspect-[4/5] w-full object-cover opacity-80 transition duration-700 group-hover:opacity-95"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                data-atropos-offset="2"
              />
              <div
                className="absolute inset-0 flex flex-col justify-end p-7 text-white"
                data-atropos-offset="8"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/15 backdrop-blur">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-3xl font-medium tracking-tight" data-atropos-offset="12">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-white/85" data-atropos-offset="6">
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
            <a
              href="#stories"
              className={`mt-8 ${BTN.onDarkOutline}`}
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
    { img: portrait1, name: "Ama", role: "Entrepreneur", location: "Accra, Ghana", quote: "F.I.R.E. didn't just teach me business — they believed in me before I did.", body: "Ama launched a small textile studio after completing the entrepreneurship cohort. Two years on, she employs four young women from her neighborhood." },
    { img: storyLeadership, name: "Kojo", role: "Youth Leader", location: "Kumasi, Ghana", quote: "The mentors became the older brothers I never had.", body: "Kojo now runs weekend leadership circles for 30+ teens, using the same curriculum that changed his trajectory at 16." },
    { img: portrait6, name: "Nana", role: "Software Engineer", location: "Accra, Ghana", quote: "I went from borrowing a laptop to writing code for a global team.", body: "After the tech fellowship, Nana joined a remote engineering team building fintech tools for African SMEs." },
    { img: portrait2, name: "Daniel", role: "Tech Fellow", location: "Philadelphia, USA", quote: "F.I.R.E. showed me my zip code wasn't my ceiling.", body: "Daniel was the first in his family to graduate college. He now mentors high schoolers from his old block." },
    { img: portrait8, name: "Auntie Adwoa", role: "Teacher", location: "Cape Coast, Ghana", quote: "When you invest in a teacher, you invest in a hundred children.", body: "Adwoa runs a F.I.R.E.-supported reading program serving over 200 students across two schools." },
    { img: portrait5, name: "Esi", role: "Scholar", location: "Volta Region, Ghana", quote: "The scholarship gave me a chance. The community gave me belonging.", body: "Esi is studying public health on full scholarship and plans to return home to build maternal care programs." },
    { img: portrait10, name: "Abena", role: "Student", location: "Tamale, Ghana", quote: "I want to be the doctor my village never had.", body: "Abena is a top of her class secondary student with her sights set on medical school — F.I.R.E. covers her boarding and books." },
    { img: portrait3, name: "Akua", role: "Athlete", location: "Accra, Ghana", quote: "Sport gave me discipline. F.I.R.E. gave me a stage.", body: "Akua represented her region in two national tournaments and now coaches a girls' track squad after school." },
    { img: portrait7, name: "Marcus", role: "Hooper", location: "Philadelphia, USA", quote: "The court is where I learned to lead.", body: "Marcus runs the summer hoops league F.I.R.E. sponsors in West Philly — over 180 kids played last season." },
    { img: portrait9, name: "Yaw", role: "Founder", location: "Kumasi, Ghana", quote: "We don't need handouts. We need a runway — F.I.R.E. built mine.", body: "Yaw founded a logistics startup connecting rural farmers to urban markets, now serving 12 districts." },
    { img: portrait4, name: "Mr. Mensah", role: "Mentor", location: "Tema, Ghana", quote: "Mentorship is the long game. I'm proud to play it.", body: "A retired engineer, Mr. Mensah has personally mentored 40+ F.I.R.E. tech fellows over the last six years." },
    { img: storyBasketball, name: "Kwame", role: "Coach", location: "Accra, Ghana", quote: "Every kid deserves a coach who shows up — every single week.", body: "Kwame's after-school program has kept hundreds of teens off the streets and on the court since 2019." },
  ];

  // Triple the list so we can seamlessly loop by jumping between identical copies
  const LOOP = 3;
  const looped = Array.from({ length: LOOP }).flatMap((_, copy) =>
    portraits.map((p, i) => ({ ...p, _key: `${copy}-${i}`, _origIndex: i }))
  );

  const features = [
    { title: "Real Community Voices", body: "Every story begins with a person. We listen first — then build programs that match what families and youth actually need." },
    { title: "Long-Term Mentorship", body: "Our fellows and coaches stay with participants for years, not weeks. Relationships are the engine of lasting change." },
    { title: "Measurable Impact", body: "From scholarships earned to businesses launched and championships won — we track the outcomes that move lives forward." },
  ];

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const velocityRef = useRef(0);
  const modeRef = useRef<"idle" | "drag" | "momentum" | "tween">("idle");
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
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
    if (!el) { rafRef.current = null; return; }
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

    el.scrollLeft = posRef.current;

    if (modeRef.current === "idle") {
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
    try { el.releasePointerCapture(e.pointerId); } catch {}
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
      const swallow = (ev: Event) => { ev.stopPropagation(); ev.preventDefault(); };
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
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenStory(null); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
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
            <span>{portraits[activeIndex]?.role} — {portraits[activeIndex]?.location}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Jump to story">
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
                  <h3 id="story-modal-title" className="mt-3 font-display text-3xl font-medium leading-tight sm:text-4xl">
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
          <article
            key={e.title}
            className="group relative overflow-hidden rounded-2xl bg-black"
          >
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
            <button type="submit" className={BTN.primary}>
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
  const tiers = [
    {
      amount: "$25",
      label: "Spark",
      impact: "Provides school supplies for one student for a month.",
    },
    {
      amount: "$50",
      label: "Kindle",
      impact: "Funds a week of after-school mentorship for a youth athlete.",
    },
    {
      amount: "$100",
      label: "Ignite",
      impact: "Sponsors entrepreneurship training for a community member.",
      featured: true,
    },
    {
      amount: "Custom",
      label: "Blaze",
      impact: "Choose your own gift — every dollar reaches the field.",
    },
  ];

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
    <section id="donate" className="px-6 py-28 lg:px-10 lg:py-36">
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
                  <div className="text-xs text-foreground/60">One-time · Monthly available at checkout</div>
                </div>
                <div className="hidden items-center gap-2 text-xs text-foreground/60 sm:flex">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>2,400+ donors this year</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {tiers.map((t) => (
                  <button
                    key={t.amount}
                    className={`group relative rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                      t.featured
                        ? "border-primary bg-primary text-white shadow-md"
                        : "border-foreground/10 bg-white text-foreground hover:border-primary/40"
                    }`}
                  >
                    {t.featured && (
                      <span className="absolute -top-2 right-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                        Most given
                      </span>
                    )}
                    <div className="font-display text-2xl font-semibold">{t.amount}</div>
                    <div
                      className={`mt-0.5 text-[11px] font-medium uppercase tracking-wider ${
                        t.featured ? "text-white/80" : "text-primary"
                      }`}
                    >
                      {t.label}
                    </div>
                    <div
                      className={`mt-3 text-xs leading-snug ${
                        t.featured ? "text-white/90" : "text-foreground/70"
                      }`}
                    >
                      {t.impact}
                    </div>
                  </button>
                ))}
              </div>

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

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#" className={`flex-1 ${BTN.primary}`}>
                  <Heart className="h-4 w-4" />
                  Donate Now
                </a>
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
                <div className="mb-4 text-sm font-medium text-foreground">Trusted & accountable</div>
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
                    Workplace giving, matching gifts, and program sponsorships for purpose-led companies.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {["Custom impact reports", "Brand co-marketing", "Employee volunteer days"].map((i) => (
                      <li key={i} className="flex items-center gap-2 text-white/85">
                        <Check className="h-4 w-4 text-accent" />
                        {i}
                      </li>
                    ))}
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

      <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-10 md:flex-row md:items-center">
        <div>
          <div className="font-display text-2xl font-medium tracking-tight">
            Become a partner.
          </div>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Join a coalition of changemakers funding scholarships, building courts, and launching founders.
          </p>
        </div>
        <a href="#contact" className={BTN.primary}>
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
