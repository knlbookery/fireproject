publicimport { createServerFn } from "@tanstack/react-start";

/* ------------------------------------------------------------------ */
/* Types & Structural Mappings                                       */
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
/* Static Fallbacks (Root-relative paths for browser assets)          */
/* ------------------------------------------------------------------ */

const FALLBACK_IMAGES: SiteImages = {
  ghanaAerial: `public/images/community_dev.jpg`,
  volunteers: `public/images/impact.png`,
  education: `public/images/education.png`,
  storyLeadership: `public/images/hero.png`,
  storyBasketball: `public/images/hero1.png`,
  progTech: `public/images/basketball.png`,
  progYouth: `public/images/basketballteam.png`,
  progSports: `public/images/sport.png`,
  progBiz: `public/images/mission_enterprenuer.png`,
  mission: `public/images/mission.png`,
  enterprenuer: `public/images/enterprenuers.jpg`,
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
    subtitle:
      "Building brighter futures through access to learning and technology.",
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
    subtitle:
      "Developing confidence, teamwork, and opportunity through sport.",
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

/* ------------------------------------------------------------------ */
/* Server Function API                                                */
/* ------------------------------------------------------------------ */

export const getLandingContent = createServerFn({ method: "GET" })
  .validator((d: { isClient?: boolean } | undefined) => d)
  .handler(async ({ data }): Promise<LandingContent> => {

    // 1. Return fallbacks instantly for SSR if explicitly flagged
    if (!data?.isClient) {
      return FALLBACK_CONTENT;
    }

    // Lookup Environment Variables safely
    const baseId =
      process.env.AIRTABLE_BASE_ID ||
      (import.meta.env?.VITE_AIRTABLE_BASE_ID as string);
    const token =
      process.env.AIRTABLE_API_KEY ||
      (import.meta.env?.VITE_AIRTABLE_API_KEY as string);

    if (!baseId || !token) {
      console.warn("[content.functions] Missing Airtable API credentials in environment.");
      return FALLBACK_CONTENT;
    }

    const heroTable =
      process.env.AIRTABLE_TABLE_HERO ||
      (import.meta.env?.VITE_AIRTABLE_TABLE_HERO as string) ||
      "Hero Slides";

    const eventsTable =
      process.env.AIRTABLE_TABLE_EVENTS ||
      (import.meta.env?.VITE_AIRTABLE_TABLE_EVENTS as string) ||
      "Events";

    try {
      // Parallel fetch for Hero Slides and Events
      const [heroRes, eventsRes] = await Promise.allSettled([
        fetch(
          `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(heroTable)}?sort[0][field]=Order&sort[0][direction]=asc`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        fetch(
          `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(eventsTable)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      // Parse Hero Slides
      let heroSlides: HeroSlide[] = FALLBACK_HERO;
      if (heroRes.status === "fulfilled" && heroRes.value.ok) {
        const heroData = await heroRes.value.json();
        const validRecords = (heroData.records || []).filter(
          (record: any) => record.fields && Object.keys(record.fields).length > 0
        );

        if (validRecords.length > 0) {
          heroSlides = validRecords.map((record: any, index: number) => {
            const f = record.fields;
            const cta = [];

            if (f["CTA Label"] && f["CTA Href"]) {
              cta.push({
                label: f["CTA Label"],
                href: f["CTA Href"],
                primary: f["CTA Primary"] ?? true,
              });
            }
            if (f["Secondary CTA Label"] && f["Secondary CTA Href"]) {
              cta.push({
                label: f["Secondary CTA Label"],
                href: f["Secondary CTA Href"],
              });
            }

            const fallback = FALLBACK_HERO[index] ?? FALLBACK_HERO[0];

            return {
              eyebrow: f.Eyebrow ?? fallback.eyebrow,
              title: f.Title ?? fallback.title,
              subtitle: f.Subtitle ?? fallback.subtitle,
              image: f.Image?.[0]?.url ?? f.image ?? fallback.image,
              alt: f.Alt ?? f.Title ?? fallback.alt,
              cta: cta.length ? cta : fallback.cta,
            };
          });
        }
      } else {
        console.warn("[content.functions] Hero slides fetch skipped or failed, using fallbacks.");
      }

      // Parse Events
      let events: EventItem[] = [];
      if (eventsRes.status === "fulfilled" && eventsRes.value.ok) {
        const eventsData = await eventsRes.value.json();
        events = (eventsData.records || [])
          .filter((r: any) => r.fields && Object.keys(r.fields).length > 0)
          .map((r: any) => ({
            month: r.fields.Month || "",
            day: r.fields.Day || "",
            title: r.fields.Title || "",
            place: r.fields.Place || r.fields.Location || "",
            img: r.fields.Image?.[0]?.url || r.fields.img || "",
          }));
      }

      return {
        heroSlides,
        events,
        siteImages: FALLBACK_IMAGES,
      };
    } catch (error) {
      console.error("[content.functions] Runtime error fetching content:", error);
      return FALLBACK_CONTENT;
    }
  });