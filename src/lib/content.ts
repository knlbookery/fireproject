import { queryOptions } from "@tanstack/react-query";
import { FALLBACK_CONTENT, type HeroSlide, type LandingContent } from "./content.functions";

export const landingContentQuery = queryOptions({
  queryKey: ["landing-content"],
  queryFn: async (): Promise<LandingContent> => {
    // SSR runs this in a server (non-browser) context — serve the fallback
    // instantly rather than attempting a relative-URL fetch with no origin
    // to resolve against. The browser refetches (staleTime: 0) after
    // hydration, where a same-origin relative fetch resolves correctly.
    if (typeof window === "undefined") {
      return FALLBACK_CONTENT;
    }

    try {
      const res = await fetch("/api/content.php");
      if (!res.ok) {
        console.warn(`[content] /api/content.php error response: ${res.status}`);
        return FALLBACK_CONTENT;
      }

      const body = (await res.json()) as { success: boolean; heroSlides?: HeroSlide[] };
      if (!body.success || !body.heroSlides || body.heroSlides.length === 0) {
        return FALLBACK_CONTENT;
      }

      return {
        heroSlides: body.heroSlides,
        events: [],
        siteImages: FALLBACK_CONTENT.siteImages,
      };
    } catch (error) {
      console.error("Failed fetching live content from /api/content.php:", error);
      return FALLBACK_CONTENT;
    }
  },
  initialData: FALLBACK_CONTENT,
  staleTime: 0,
});
