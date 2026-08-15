/**
 * Airtable-driven page copy.
 *
 * Editors manage a "Page Content" table (Route, Section Key, Eyebrow, Title,
 * Intro, Body, Image, Status). Each route asks for its own copy and merges it
 * over the hardcoded fallback, so the site always renders even when Airtable
 * is unreachable or a row has not been created yet.
 */

import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export type PageSection = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  body?: string;
  image?: string;
};

export type PageContent = Record<string, PageSection>;

async function fetchPageContent(route: string): Promise<PageContent> {
  try {
    const res = await fetch(`/api/page-content.php?route=${encodeURIComponent(route)}`);
    if (!res.ok) return {};
    const body = (await res.json()) as { success?: boolean; sections?: PageContent };
    return body.success && body.sections ? body.sections : {};
  } catch {
    return {};
  }
}

function merge(fallback: PageSection, override?: PageSection): PageSection {
  if (!override) return fallback;
  const out: PageSection = { ...fallback };
  (Object.keys(override) as (keyof PageSection)[]).forEach((k) => {
    const value = override[k];
    if (typeof value === "string" && value.trim() !== "") out[k] = value;
  });
  return out;
}

/**
 * Returns a `copy(sectionKey, fallback)` function for the given route.
 * Falls back silently to the passed-in values.
 */
export function usePageCopy(route: string) {
  const { data } = useQuery({
    queryKey: ["page-content", route],
    queryFn: () => fetchPageContent(route),
    initialData: {} as PageContent,
    staleTime: 5 * 60 * 1000,
  });

  return useCallback(
    <T extends PageSection>(sectionKey: string, fallback: T): T =>
      merge(fallback, data?.[sectionKey]) as T,
    [data],
  );
}
