import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Users,
  Gift,
  Globe2,
  CalendarDays,
  Flame,
  Laptop,
  Sparkles,
  Trophy,
  Rocket,
  Heart,
  HandHeart,
  MapPin,
  ChevronRight,
} from "lucide-react";
import heroChild from "@/assets/hero-child.png";
import progTech from "@/assets/program-tech.jpg";
import progYouth from "@/assets/program-youth.jpg";
import progSports from "@/assets/program-sports.jpg";
import progBiz from "@/assets/program-entrepreneurship.jpg";
import ghanaAerial from "@/assets/ghana-aerial.jpg";
import volunteers from "@/assets/volunteers.jpg";
import storyLab from "@/assets/story-lab.jpg";
import storyLeadership from "@/assets/story-leadership.jpg";
import storyBasketball from "@/assets/story-basketball.jpg";
import eventConference from "@/assets/event-conference.jpg";
import eventWeekend from "@/assets/event-weekend.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "F.I.R.E. — Empowering Communities. Inspiring Futures." },
      {
        name: "description",
        content:
          "F.I.R.E. (Free Inspiration Reaching Everyone) empowers communities through education, technology, entrepreneurship, sports and youth development across Ghana and the United States.",
      },
      { property: "og:title", content: "F.I.R.E. — Empowering Communities. Inspiring Futures." },
      {
        property: "og:description",
        content: "A nonprofit empowering communities across Ghana and the United States.",
      },
    ],
  }),
  component: Landing,
});

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
        <Flame className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-semibold tracking-tight">F.I.R.E.</span>
        <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Free Inspiration Reaching Everyone
        </span>
      </span>
    </a>
  );
}

function Nav() {
  const items = ["Home", "About", "Programs", "Initiatives", "Events", "Sponsors", "Contact"];
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-6 rounded-2xl glass-card px-5 py-3">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-foreground/80 md:flex">
          {items.map((i, idx) => (
            <a
              key={i}
              href={`#${i.toLowerCase()}`}
              className={`relative transition-colors hover:text-primary ${idx === 0 ? "text-primary" : ""}`}
            >
              {i}
              {idx === 0 && (
                <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded bg-primary" />
              )}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="#volunteer"
            className="hidden items-center gap-2 rounded-xl border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5 sm:inline-flex"
          >
            <HandHeart className="h-4 w-4" />
            Volunteer
          </a>
          <a
            href="#donate"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_-10px_rgba(36,87,255,0.6)] transition hover:bg-primary/90"
          >
            <Heart className="h-4 w-4" />
            Donate Now
          </a>
        </div>
      </div>
    </header>
  );
}

function StatGlassCard({
  icon: Icon,
  value,
  label,
  tone = "primary",
  className = "",
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  tone?: "primary" | "accent";
  className?: string;
}) {
  const toneClass =
    tone === "accent" ? "bg-accent/15 text-[#B58200]" : "bg-primary/10 text-primary";
  return (
    <div className={`glass-card flex items-center gap-3 rounded-2xl px-4 py-3 ${className}`}>
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="leading-tight">
        <div className="font-display text-lg font-semibold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 soft-surface" />
      <div className="pointer-events-none absolute -top-40 right-1/3 -z-10 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-24 pt-12 lg:grid-cols-12 lg:gap-6 lg:pt-16">
        <div className="lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-3 py-1 text-xs text-foreground/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Empowering Communities. Inspiring Futures.
          </span>
          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-[5.25rem]">
            Empowering
            <br />
            Communities.
            <br />
            <span className="text-gradient-brand italic">Inspiring Futures.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
            Through education, technology, entrepreneurship, sports, and community development
            across Ghana and the United States.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#donate"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[0_15px_40px_-12px_rgba(36,87,255,0.55)] transition hover:translate-y-[-1px]"
            >
              Support Our Mission
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#programs"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-5 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:bg-white"
            >
              Explore Programs
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#2457FF", "#F5B400", "#0F172A", "#6A8BFF"].map((c) => (
                <span
                  key={c}
                  className="h-8 w-8 rounded-full border-2 border-white"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="text-sm leading-tight">
              <div className="font-semibold">5K+</div>
              <div className="text-xs text-muted-foreground">
                Trusted by communities across Ghana &amp; the USA
              </div>
            </div>
          </div>
        </div>

        <div className="relative lg:col-span-6">
          {/* Giant faded INSPIRE typography */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-6 select-none text-center font-display text-[8rem] font-semibold leading-none tracking-tight text-primary/[0.07] sm:text-[12rem] lg:text-[14rem]"
          >
            INSPIRE
          </div>

          <div className="relative mx-auto aspect-[4/5] max-w-[520px]">
            <img
              src={heroChild}
              alt="Young person from a F.I.R.E. community in Ghana"
              className="absolute inset-0 h-full w-full object-contain"
              width={1024}
              height={1280}
            />

            {/* Floating glass stat cards */}
            <div className="absolute -right-2 top-6 animate-float">
              <StatGlassCard icon={Users} value="5,000+" label="Lives Impacted" />
            </div>
            <div className="absolute -right-6 top-32 animate-float-delay">
              <StatGlassCard icon={Gift} value="$70,500+" label="Resources Distributed" tone="accent" />
            </div>
            <div className="absolute -left-4 bottom-32 animate-float-delay">
              <StatGlassCard icon={Globe2} value="USA + Ghana" label="Global Reach" />
            </div>
            <div className="absolute -right-2 bottom-4 animate-float">
              <StatGlassCard icon={CalendarDays} value="7+ Years" label="Community Impact" tone="accent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const partners = ["Microsoft", "Google", "ExxonMobil", "HP", "Lenovo", "Donorbox"];
  return (
    <section className="relative -mt-10 px-5">
      <div className="mx-auto max-w-7xl rounded-2xl glass-card px-6 py-6">
        <div className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by communities across Ghana &amp; the United States
        </div>
        <div className="mt-5 grid grid-cols-3 items-center gap-6 text-center text-lg font-semibold text-foreground/70 sm:grid-cols-6">
          {partners.map((p) => (
            <div
              key={p}
              className="font-display text-[1.05rem] tracking-tight transition hover:text-foreground"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section id="about" className="px-5 py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-7 overflow-hidden rounded-3xl">
              <img src={storyLab} alt="Students in a computer lab" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="col-span-5 flex flex-col gap-3">
              <div className="overflow-hidden rounded-3xl">
                <img src={progYouth} alt="Joyful youth" className="h-44 w-full object-cover" loading="lazy" />
              </div>
              <div className="overflow-hidden rounded-3xl">
                <img src={storyBasketball} alt="Basketball game" className="h-44 w-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Our Impact
          </div>
          <h2 className="mt-3 font-display text-4xl font-medium leading-tight sm:text-5xl">
            Every Child Deserves<br />
            <span className="italic text-foreground/80">Opportunity.</span>
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            For over seven years, F.I.R.E. has worked to provide access to education, technology,
            sports, and mentorship for underserved communities — building lasting infrastructure
            for the next generation.
          </p>
          <a
            href="#stories"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-10px_rgba(36,87,255,0.55)] transition hover:translate-y-[-1px]"
          >
            Read Our Story <ArrowRight className="h-4 w-4" />
          </a>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { v: "7+", l: "Years of Service" },
              { v: "2", l: "Countries" },
              { v: "100+", l: "Communities Served" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-primary/10 bg-white p-4">
                <div className="font-display text-2xl font-semibold">{s.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Programs() {
  const items = [
    {
      icon: Laptop,
      title: "Technology Access",
      desc: "Providing computer labs, digital literacy, laptops and technology resources to bridge the digital divide.",
      img: progTech,
      tone: "primary",
    },
    {
      icon: Sparkles,
      title: "Youth Development",
      desc: "Mentorship, leadership training and educational support to help young people reach their full potential.",
      img: progYouth,
      tone: "accent",
    },
    {
      icon: Trophy,
      title: "Sports Development",
      desc: "Building character, teamwork and discipline through sports and youth engagement programs.",
      img: progSports,
      tone: "primary",
    },
    {
      icon: Rocket,
      title: "Entrepreneurship",
      desc: "Empowering innovators through mentorship, pitch competitions and startup support.",
      img: progBiz,
      tone: "accent",
    },
  ];
  return (
    <section id="programs" className="px-5 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-primary">What We Do</div>
        <h2 className="mt-2 font-display text-4xl font-medium leading-tight sm:text-5xl">
          Programs Creating Real Change
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <article
              key={p.title}
              className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-white p-3 transition hover:shadow-[0_30px_60px_-30px_rgba(36,87,255,0.25)]"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={p.img}
                  alt={p.title}
                  className="h-44 w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span
                  className={`absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-xl shadow ${
                    p.tone === "accent"
                      ? "bg-accent text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p.icon className="h-5 w-5" />
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                >
                  Learn More <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Initiatives() {
  return (
    <section id="initiatives" className="px-5 pb-24">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <div className="relative">
          <img src={ghanaAerial} alt="Ghana community" className="h-[420px] w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1d4f]/90 via-[#0a1d4f]/55 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10">
            <div className="max-w-xl text-white">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                Our Initiatives
              </div>
              <h2 className="mt-2 font-display text-4xl font-medium leading-tight sm:text-5xl">
                Building Impact Where<br />It Matters Most
              </h2>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-white sm:grid-cols-4">
                {[
                  { v: "50+", l: "Communities Served" },
                  { v: "30+", l: "Schools Supported" },
                  { v: "12", l: "Technology Labs Built" },
                  { v: "10,000+", l: "Resources Distributed" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-2xl font-semibold">{s.v}</div>
                    <div className="text-xs text-white/70">{s.l}</div>
                  </div>
                ))}
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-foreground"
              >
                Explore Ghana Initiatives <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Events() {
  const items = [
    { month: "JUN", day: "15", title: "Ghana To The Moon Conference & Pitch Event", place: "Accra, Ghana", img: eventConference, tone: "primary" },
    { month: "JUL", day: "20", title: "Inspiration Weekend Outreach", place: "Philadelphia, USA", img: eventWeekend, tone: "accent" },
    { month: "AUG", day: "10", title: "Basketball Tournament", place: "Accra, Ghana", img: storyBasketball, tone: "primary" },
    { month: "AUG", day: "24", title: "Community Outreach Program", place: "Volta Region, Ghana", img: progYouth, tone: "accent" },
  ];
  return (
    <section id="events" className="px-5 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Upcoming Events</div>
            <h2 className="mt-2 font-display text-4xl font-medium sm:text-5xl">Join us soon</h2>
          </div>
          <a href="#" className="hidden items-center gap-2 text-sm text-primary md:inline-flex">
            View all <ChevronRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((e) => (
            <article
              key={e.title}
              className="overflow-hidden rounded-3xl border border-primary/10 bg-white"
            >
              <div className="flex items-center gap-3 p-4">
                <div
                  className={`grid h-14 w-14 place-items-center rounded-xl text-center ${
                    e.tone === "accent" ? "bg-accent/20 text-[#8a5e00]" : "bg-primary/10 text-primary"
                  }`}
                >
                  <div className="leading-tight">
                    <div className="text-[10px] font-medium uppercase tracking-wider">{e.month}</div>
                    <div className="font-display text-lg font-semibold">{e.day}</div>
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold">{e.title}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {e.place}
                  </div>
                </div>
              </div>
              <div className="overflow-hidden">
                <img src={e.img} alt={e.title} className="h-36 w-full object-cover" loading="lazy" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sponsor() {
  return (
    <section id="sponsors" className="px-5 pb-12">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 rounded-3xl border border-primary/10 bg-white p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <HandHeart className="h-6 w-6" />
          </span>
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Partner With Purpose
            </div>
            <h3 className="font-display text-xl font-semibold">
              Become a Sponsor. Create Lasting Change.
            </h3>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Join businesses and individuals making a measurable impact in communities.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="#" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
            Become A Sponsor <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#" className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-3 text-sm font-medium text-primary">
            View Packages <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Donate() {
  const tiers = [
    { icon: Gift, amount: "$25", desc: "Provides learning materials for a child", tone: "primary" },
    { icon: Users, amount: "$50", desc: "Supports youth programs", tone: "accent" },
    { icon: Laptop, amount: "$100", desc: "Funds technology access initiatives", tone: "primary" },
    { icon: Heart, amount: "Other", desc: "Choose your impact", tone: "accent" },
  ];
  return (
    <section id="donate" className="px-5 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Your Support Changes Lives
        </div>
        <h2 className="mt-2 font-display text-4xl font-medium sm:text-5xl">Make a contribution</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tiers.map((t) => (
            <button
              key={t.amount}
              className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(36,87,255,0.3)]"
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  t.tone === "accent" ? "bg-accent/20 text-[#8a5e00]" : "bg-primary/10 text-primary"
                }`}
              >
                <t.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-lg font-semibold">{t.amount}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </div>
            </button>
          ))}
          <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground">
            <div className="text-sm">
              Your contribution helps us empower the next generation.
            </div>
            <a
              href="#"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary"
            >
              Donate Now <ArrowRight className="h-4 w-4" />
            </a>
            <Heart className="absolute -bottom-4 -right-4 h-24 w-24 text-white/15" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stories() {
  const items = [
    { date: "May 10, 2024", title: "New Computer Lab Opened in Volta Region", img: storyLab },
    { date: "Apr 28, 2024", title: "F.I.R.E. Youth Excel in Leadership Workshop", img: storyLeadership },
    { date: "Apr 15, 2024", title: "Basketball Brings Communities Together in Accra", img: storyBasketball },
  ];
  return (
    <section id="stories" className="px-5 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Latest Stories
        </div>
        <h2 className="mt-2 font-display text-4xl font-medium sm:text-5xl">Voices from the field</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <article key={s.title} className="overflow-hidden rounded-3xl border border-primary/10 bg-white">
              <div className="overflow-hidden">
                <img src={s.img} alt={s.title} className="h-56 w-full object-cover transition hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5">
                <div className="text-xs text-muted-foreground">{s.date}</div>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
                <a href="#" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Volunteer() {
  return (
    <section id="volunteer" className="px-5 pb-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-primary/10 soft-surface px-6 py-10 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl">
              <img src={volunteers} alt="F.I.R.E. volunteers" className="h-64 w-full object-cover sm:h-80" loading="lazy" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Join The Movement
            </div>
            <h2 className="mt-2 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Together, We Inspire.<br />
              <span className="italic">Together, We Transform.</span>
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Be part of a growing community of volunteers, partners and supporters creating real
              impact across Ghana and the United States.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
                Volunteer Today <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-3 text-sm font-medium text-primary">
                Contact Us <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Quick Links", items: ["About Us", "Programs", "Initiatives"] },
    { title: "Get Involved", items: ["Volunteer", "Donate", "Partner With Us"] },
    { title: "Resources", items: ["Impact Reports", "Photo Gallery", "Success Stories"] },
  ];
  return (
    <footer id="contact" className="border-t border-primary/10 bg-white px-5 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Empowering youth and building stronger communities through education, technology,
            entrepreneurship and sports.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="lg:col-span-2">
            <div className="text-sm font-semibold">{c.title}</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {c.items.map((i) => (
                <li key={i}>
                  <a href="#" className="transition hover:text-primary">{i}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="lg:col-span-2">
          <div className="text-sm font-semibold">Stay Connected</div>
          <p className="mt-4 text-sm text-muted-foreground">
            Subscribe for updates and stories.
          </p>
          <form className="mt-3 flex overflow-hidden rounded-full border border-primary/15 bg-white">
            <input
              type="email"
              required
              placeholder="Email address"
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="grid w-10 place-items-center bg-primary text-primary-foreground"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between border-t border-primary/10 pt-6 text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} F.I.R.E. — Free Inspiration Reaching Everyone.</div>
        <div>Ghana · United States</div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <main className="px-4 sm:px-6">
      <Nav />
      <Hero />
      <Partners />
      <Impact />
      <Programs />
      <Initiatives />
      <Events />
      <Sponsor />
      <Donate />
      <Stories />
      <Volunteer />
      <Footer />
    </main>
  );
}
