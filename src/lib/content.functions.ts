/* ------------------------------------------------------------------ */
/* Types & Structural Mappings                                        */
/* ------------------------------------------------------------------ */

export type HeroSlide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  cta: { label: string; href: string; primary?: boolean }[];
};

export type EventItem = {
  month: string;
  day: string;
  title: string;
  place: string;
  img: string;
};

export type SiteImages = Record<string, string>;

export type LandingContent = {
  heroSlides: HeroSlide[];
  events: EventItem[];
  siteImages: SiteImages;
};

/* ------------------------------------------------------------------ */
/* Static Fallbacks (Used instantly during SSR to eliminate delay)    */
/* ------------------------------------------------------------------ */

const FALLBACK_IMAGES: SiteImages = {
  ghanaAerial: `/images/editorial/ghana.jpg`,
  volunteers: `/images/editorial/impact.jpg`,
  education: `/images/editorial/education.jpg`,
  progTech: `/images/editorial/tech.jpg`,
  progYouth: `/images/editorial/youth.jpg`,
  progSports: `/images/editorial/sports.jpg`,
  progBiz: `/images/editorial/enterprise.jpg`,
  mission: `/images/editorial/mission.jpg`,
  enterprenuer: `/images/editorial/enterprise.jpg`,
};

const FALLBACK_HERO: HeroSlide[] = [
  {
    eyebrow: "Our Mission",
    title: "Empowering Communities. Inspiring Futures.",
    subtitle:
      "Creating opportunity through education, technology, sports, entrepreneurship, and community development across Ghana and the United States.",
    image: FALLBACK_IMAGES.mission,
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
    image: FALLBACK_IMAGES.education,
    alt: "F.I.R.E. education program in action",
    cta: [
      { label: "Explore Programs", href: "#programs", primary: true },
      { label: "Donate", href: "#donate" },
    ],
  },
  {
    eyebrow: "Sports",
    title: "Sports That Build Leaders.",
    subtitle: "Developing confidence, teamwork, and opportunity through sport.",
    image: FALLBACK_IMAGES.progYouth,
    alt: "F.I.R.E. sports program in action",
    cta: [
      { label: "View Sport programs", href: "#programs", primary: true },
      { label: "Donate", href: "#donate" },
    ],
  },
  {
    eyebrow: "Entrepreneurship",
    title: "Supporting Entrepreneurship.",
    subtitle: "Helping communities create sustainable futures.",
    image: FALLBACK_IMAGES.enterprenuer,
    alt: "F.I.R.E. entrepreneurship program in action",
    cta: [
      { label: "Discover Opportunities", href: "#programs", primary: true },
      { label: "Donate", href: "#donate" },
    ],
  },
  {
    eyebrow: "Get Involved",
    title: "Your Support Changes Lives.",
    subtitle: "Donate, volunteer, sponsor, or partner with us.",
    image: FALLBACK_IMAGES.volunteers,
    alt: "F.I.R.E. volunteers in action",
    cta: [{ label: "Donate Today", href: "#donate", primary: true }],
  },
];

export const FALLBACK_CONTENT: LandingContent = {
  heroSlides: FALLBACK_HERO,
  events: [],
  siteImages: FALLBACK_IMAGES,
};
