/**
 * Press articles, sourced from the Airtable "Press Articles" table through
 * the same-origin PHP endpoint /api/press.php.
 */

export type PressArticle = {
  id: string;
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  excerpt: string;
  body: string;
  image: string;
  author?: string;
  category?: string;
};

export async function fetchPressArticles(): Promise<PressArticle[]> {
  const res = await fetch("/api/press.php");
  if (!res.ok) throw new Error("Unable to load press articles");
  const body = (await res.json()) as { success?: boolean; articles?: PressArticle[] };
  return body.success && Array.isArray(body.articles) ? body.articles : [];
}

export async function fetchPressArticle(slug: string): Promise<PressArticle | null> {
  const res = await fetch(`/api/press.php?slug=${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Unable to load press article");
  const body = (await res.json()) as { success?: boolean; article?: PressArticle };
  return body.success && body.article ? body.article : null;
}

/** Fallback releases used when Airtable is unreachable or empty. */
export const FALLBACK_ARTICLES: PressArticle[] = [
  {
    id: "fallback-1",
    slug: "third-community-court-greater-accra",
    title: "F.I.R.E. opens third community court in Greater Accra",
    date: "2026-03-01",
    displayDate: "March 2026",
    excerpt:
      "The new court will host weekly leagues and school tournaments for an estimated 400 young people in its first year.",
    body: "The new court will host weekly leagues and school tournaments for an estimated 400 young people in its first year.\n\nBuilt with local contractors and maintained by a resident-led council, the court is the third F.I.R.E. facility in Greater Accra.",
    image: "/images/sport.jpg",
    category: "Announcement",
  },
  {
    id: "fallback-2",
    slug: "founder-bootcamp-graduates-60-entrepreneurs",
    title: "Founder bootcamp graduates 60 new entrepreneurs",
    date: "2026-01-01",
    displayDate: "January 2026",
    excerpt:
      "The eight-week programme pairs training with micro-grants and twelve months of continued mentorship.",
    body: "The eight-week programme pairs training with micro-grants and twelve months of continued mentorship.\n\nGraduates leave with a costed business plan, a market network, and a mentor matched to their sector.",
    image: "/images/mission_enterprenuer.jpg",
    category: "Programme",
  },
  {
    id: "fallback-3",
    slug: "philadelphia-mentorship-cohort-expands",
    title: "Philadelphia mentorship cohort expands to nine neighbourhoods",
    date: "2025-11-01",
    displayDate: "November 2025",
    excerpt:
      "Sixty-two students are matched with vetted mentors for a structured year of monthly guidance.",
    body: "Sixty-two students are matched with vetted mentors for a structured year of monthly guidance.\n\nThe expansion doubles the programme's footprint across Philadelphia.",
    image: "/images/impact.jpg",
    category: "Announcement",
  },
];
