import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, User } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { BTN, SHELL, CTABand } from "@/components/site/ui";
import { absoluteUrl, breadcrumbJsonLd, pageHead, SITE_URL } from "@/lib/seo";
import { FALLBACK_ARTICLES, fetchPressArticle, type PressArticle } from "@/lib/press";

export const Route = createFileRoute("/press/$slug")({
  head: ({ params }) => {
    const fallback = FALLBACK_ARTICLES.find((a) => a.slug === params.slug);
    const title = fallback ? `${fallback.title} | F.I.R.E. Press` : "Press article | F.I.R.E.";
    const description =
      fallback?.excerpt ??
      "A press release from F.I.R.E. (Free Inspiration Reaching Everyone) on youth sports, education, enterprise, and community development in Ghana and the U.S.";

    return pageHead({
      title,
      description,
      path: `/press/${params.slug}`,
      image: fallback?.image ?? "/images/press.jpg",
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: fallback?.title ?? "F.I.R.E. press release",
        datePublished: fallback?.date,
        image: absoluteUrl(fallback?.image ?? "/images/press.jpg"),
        author: { "@type": "Organization", name: "F.I.R.E." },
        publisher: {
          "@type": "Organization",
          name: "F.I.R.E.",
          logo: { "@type": "ImageObject", url: absoluteUrl("/images/firelogo.png") },
        },
        mainEntityOfPage: `${SITE_URL}/press/${params.slug}`,
      },
    });
  },
  component: PressArticlePage,
});

/** Renders the Airtable long-text body: blank-line separated paragraphs,
 *  "## " headings, and "- " bullet lists. */
function ArticleBody({ body }: { body: string }) {
  const blocks = body
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6 text-lg leading-relaxed text-foreground/85">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="pt-4 font-display text-3xl font-bold tracking-tight text-foreground"
            >
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("- ")) {
          return (
            <ul key={i} className="list-disc space-y-2 pl-6">
              {block.split("\n").map((line, j) => (
                <li key={j}>{line.replace(/^-\s*/, "")}</li>
              ))}
            </ul>
          );
        }
        if (block.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="border-l-4 border-primary pl-6 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground"
            >
              {block.slice(2)}
            </blockquote>
          );
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}

function PressArticlePage() {
  const { slug } = useParams({ from: "/press/$slug" });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["press-article", slug],
    queryFn: () => fetchPressArticle(slug),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const fallback = FALLBACK_ARTICLES.find((a) => a.slug === slug) ?? null;
  const article: PressArticle | null = data ?? (isError || data === null ? fallback : null);

  if (isLoading && !article) {
    return (
      <SiteLayout>
        <div className="px-6 pb-24 pt-40 lg:px-10" aria-busy="true">
          <div className={`${SHELL} max-w-3xl space-y-6`}>
            <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
            <div className="h-14 w-full animate-pulse rounded-2xl bg-muted" />
            <div className="h-72 w-full animate-pulse rounded-3xl bg-muted" />
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!article) {
    return (
      <SiteLayout>
        <div className="px-6 pb-24 pt-40 lg:px-10">
          <div className={`${SHELL} max-w-2xl text-center`}>
            <h1 className="font-display text-4xl font-bold tracking-tight">Story not found</h1>
            <p className="mt-4 text-muted-foreground">
              This press item may have been unpublished or moved.
            </p>
            <Link to="/press" className={`${BTN.primary} mt-8`}>
              Back to press
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        // Breadcrumbs for the resolved (live) article.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Press", path: "/press" },
              { name: article.title, path: `/press/${article.slug}` },
            ]),
          ),
        }}
      />

      <article>
        <header className="relative isolate overflow-hidden bg-[#0b1230] px-6 pb-20 pt-36 text-white lg:px-10 lg:pb-28 lg:pt-44">
          {article.image && (
            <img
              src={article.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0b1230] via-[#0b1230]/85 to-[#0b1230]/40"
          />
          <div className={SHELL}>
            <Link
              to="/press"
              className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-white/70 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1230]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All press
            </Link>
            <div className="mt-6 max-w-3xl">
              {article.category && (
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">
                  {article.category}
                </div>
              )}
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {article.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white/70">
                {article.displayDate && (
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    <time dateTime={article.date || undefined}>{article.displayDate}</time>
                  </span>
                )}
                {article.author && (
                  <span className="inline-flex items-center gap-2">
                    <User className="h-4 w-4" aria-hidden="true" />
                    {article.author}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-16 lg:px-10 lg:py-24">
          <div className={`${SHELL} grid gap-14 lg:grid-cols-[minmax(0,1fr)_300px]`}>
            <div className="max-w-3xl">
              {article.excerpt && (
                <p className="mb-10 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground">
                  {article.excerpt}
                </p>
              )}
              <ArticleBody body={article.body || article.excerpt} />
            </div>

            <aside aria-label="Press contact" className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-border bg-surface p-7">
                <h2 className="font-display text-xl font-bold tracking-tight">Media enquiries</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Need interviews, photography, or programme data? Our communications team replies
                  within two business days.
                </p>
                <a
                  href="mailto:press@freeinspiration.org"
                  className={`${BTN.primary} mt-6 w-full`}
                >
                  Email the press team
                </a>
                <Link to="/press" className={`${BTN.secondary} mt-3 w-full`}>
                  More stories
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <CTABand
        title="Support the next story."
        body="Every programme in these releases is funded by people who decided to act."
        primary={{ label: "Donate", to: "/donate" }}
        secondary={{ label: "Volunteer", to: "/volunteer" }}
      />
    </SiteLayout>
  );
}
