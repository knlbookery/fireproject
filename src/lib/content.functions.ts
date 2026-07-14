import { createServerFn } from "@tanstack/react-start";

/* ------------------------------------------------------------------ */
/* Types — shared between server and client.                          */
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

/**
 * Shared image slots referenced elsewhere on the landing page (portraits,
 * program tiles, story shots). Keys match the semantic slot name so the
 * consumer just does `siteImages.ghanaAerial` etc.
 */
export type SiteImages = {
  ghanaAerial: string;
  volunteers: string;
  storyLab: string;
  storyLeadership: string;
  storyBasketball: string;
  progTech: string;
  progYouth: string;
  progSports: string;
  progBiz: string;
  eventConference: string;
  eventWeekend: string;
};

export type LandingContent = {
  heroSlides: HeroSlide[];
  events: EventItem[];
  siteImages: SiteImages;
};

/* ------------------------------------------------------------------ */
/* Static fallback — used when Airtable isn't configured or errors.   */
/* Mirrors the original hardcoded content in src/routes/index.tsx.    */
/* ------------------------------------------------------------------ */

const U = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const FALLBACK_IMAGES: SiteImages = {
  ghanaAerial: U("1580060839134-75a5edca2e99"),
  volunteers: U("1593113598332-cd288d649433"),
  storyLab: U("1581091870622-1e7e9b1f17b2"),
  storyLeadership: U("1573497019940-1c28c88b4f3e"),
  storyBasketball: U("1546519638-68e109498ffc"),
  progTech: U("1517048676732-d65bc937f952"),
  progYouth: U("1488521787991-ed7bbaae773c"),
  progSports: U("1552674605-db6ffd4facb5"),
  progBiz: U("1556761175-5973dc0f32e7"),
  eventConference: U("1540575467063-178a50c2df87"),
  eventWeekend: U("1529070538774-1843cb3265df"),
};

const FALLBACK_HERO: HeroSlide[] = [
  {
    eyebrow: "Our Mission",
    title: "Empowering Communities. Inspiring Futures.",
    subtitle:
      "Creating opportunity through education, technology, sports, entrepreneurship, and community development across Ghana and the United States.",
    image: FALLBACK_IMAGES.volunteers,
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
    image: FALLBACK_IMAGES.storyLab,
    alt: "Students learning in a F.I.R.E. computer lab",
    cta: [{ label: "Explore Programs", href: "#programs", primary: true }],
  },
  {
    eyebrow: "Sports",
    title: "Sports That Build Leaders.",
    subtitle: "Developing confidence, teamwork, and opportunity through sport.",
    image: FALLBACK_IMAGES.storyBasketball,
    alt: "Young athletes in a F.I.R.E. sports program",
    cta: [{ label: "View Sports Programs", href: "#programs", primary: true }],
  },
  {
    eyebrow: "Entrepreneurship",
    title: "Supporting Entrepreneurship.",
    subtitle: "Helping communities create sustainable futures.",
    image: FALLBACK_IMAGES.progBiz,
    alt: "Entrepreneur in a F.I.R.E. mentorship program",
    cta: [{ label: "Discover Opportunities", href: "#programs", primary: true }],
  },
  {
    eyebrow: "Get Involved",
    title: "Your Support Changes Lives.",
    subtitle: "Donate, volunteer, sponsor, or partner with us.",
    image: FALLBACK_IMAGES.ghanaAerial,
    alt: "Aerial view of a Ghanaian community served by F.I.R.E.",
    cta: [
      { label: "Donate Today", href: "#donate", primary: true },
      { label: "Volunteer", href: "#volunteer" },
    ],
  },
];

const FALLBACK_EVENTS: EventItem[] = [
  {
    month: "JUN",
    day: "15",
    title: "Ghana To The Moon Conference & Pitch Event",
    place: "Accra, Ghana",
    img: FALLBACK_IMAGES.eventConference,
  },
  {
    month: "JUL",
    day: "20",
    title: "Inspiration Weekend Outreach",
    place: "Philadelphia, USA",
    img: FALLBACK_IMAGES.eventWeekend,
  },
  {
    month: "AUG",
    day: "10",
    title: "F.I.R.E. Basketball Tournament",
    place: "Accra, Ghana",
    img: FALLBACK_IMAGES.storyBasketball,
  },
];

export const FALLBACK_CONTENT: LandingContent = {
  heroSlides: FALLBACK_HERO,
  events: FALLBACK_EVENTS,
  siteImages: FALLBACK_IMAGES,
};

/* ------------------------------------------------------------------ */
/* Server function — fetch from Airtable, or fall back.               */
/* ------------------------------------------------------------------ */

export const getLandingContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<LandingContent> => {
    // Load lazily so the Airtable module (and its `fetch` calls) never ship
    // to the client bundle.
    const { isAirtableConfigured, fetchAirtableRecords, pickAttachmentUrl, AIRTABLE_TABLES } =
      await import("./airtable.server");

    if (!isAirtableConfigured()) {
      return FALLBACK_CONTENT;
    }

    try {
      // TODO(airtable): confirm these field names match your Airtable schema.
      const [heroRecords, eventRecords, imageRecords] = await Promise.all([
        fetchAirtableRecords<{
          Eyebrow?: string;
          Title?: string;
          Subtitle?: string;
          Image?: unknown;
          Alt?: string;
          "CTA Label"?: string;
          "CTA Href"?: string;
          "CTA Primary"?: boolean;
          "Secondary CTA Label"?: string;
          "Secondary CTA Href"?: string;
          Order?: number;
        }>(AIRTABLE_TABLES.hero),
        fetchAirtableRecords<{
          Month?: string;
          Day?: string;
          Title?: string;
          Place?: string;
          Image?: unknown;
          Order?: number;
        }>(AIRTABLE_TABLES.events),
        fetchAirtableRecords<{
          Slot?: keyof SiteImages;
          Image?: unknown;
        }>(AIRTABLE_TABLES.siteImages),
      ]);

      const heroSlides: HeroSlide[] = heroRecords
        .slice()
        .sort((a, b) => (a.fields.Order ?? 0) - (b.fields.Order ?? 0))
        .map((r) => {
          const cta: HeroSlide["cta"] = [];
          if (r.fields["CTA Label"] && r.fields["CTA Href"]) {
            cta.push({
              label: r.fields["CTA Label"]!,
              href: r.fields["CTA Href"]!,
              primary: r.fields["CTA Primary"] ?? true,
            });
          }
          if (r.fields["Secondary CTA Label"] && r.fields["Secondary CTA Href"]) {
            cta.push({
              label: r.fields["Secondary CTA Label"]!,
              href: r.fields["Secondary CTA Href"]!,
            });
          }
          return {
            eyebrow: r.fields.Eyebrow ?? "",
            title: r.fields.Title ?? "",
            subtitle: r.fields.Subtitle ?? "",
            image: pickAttachmentUrl(r.fields.Image) ?? FALLBACK_IMAGES.volunteers,
            alt: r.fields.Alt ?? r.fields.Title ?? "",
            cta,
          };
        });

      const events: EventItem[] = eventRecords
        .slice()
        .sort((a, b) => (a.fields.Order ?? 0) - (b.fields.Order ?? 0))
        .map((r) => ({
          month: r.fields.Month ?? "",
          day: r.fields.Day ?? "",
          title: r.fields.Title ?? "",
          place: r.fields.Place ?? "",
          img: pickAttachmentUrl(r.fields.Image) ?? FALLBACK_IMAGES.eventConference,
        }));

      const siteImages: SiteImages = { ...FALLBACK_IMAGES };
      for (const r of imageRecords) {
        const slot = r.fields.Slot;
        const url = pickAttachmentUrl(r.fields.Image);
        if (slot && url && slot in siteImages) {
          siteImages[slot] = url;
        }
      }

      return {
        heroSlides: heroSlides.length ? heroSlides : FALLBACK_HERO,
        events: events.length ? events : FALLBACK_EVENTS,
        siteImages,
      };
    } catch (err) {
      console.error("[content] Airtable fetch failed, using fallback:", err);
      return FALLBACK_CONTENT;
    }
  },
);
