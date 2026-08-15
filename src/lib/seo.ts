/**
 * Shared SEO helpers.
 *
 * Every route builds its <head> through pageHead() so title, description,
 * canonical, Open Graph and Twitter tags stay consistent and self-referencing.
 */

export const SITE_URL = "https://freeinspiration.org";

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export type PageHeadOptions = {
  title: string;
  description: string;
  /** Route path, e.g. "/about". Used for canonical + og:url. */
  path: string;
  /** Social/preview image (relative paths are made absolute). */
  image?: string;
  type?: "website" | "article";
  /** Optional JSON-LD object rendered as application/ld+json. */
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
};

export function pageHead({
  title,
  description,
  path,
  image = "/images/firelogo.png",
  type = "website",
  jsonLd,
  noindex = false,
}: PageHeadOptions) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  const meta: Record<string, string>[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: imageUrl },
    { property: "og:site_name", content: "F.I.R.E." },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];

  if (noindex) {
    meta.push({ name: "robots", content: "noindex, follow" });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
    ...(jsonLd
      ? { scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] }
      : {}),
  };
}

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "F.I.R.E.",
  alternateName: "Free Inspiration Reaching Everyone",
  url: SITE_URL,
  logo: absoluteUrl("/images/firelogo.png"),
  areaServed: ["Ghana", "United States"],
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
