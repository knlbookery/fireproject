import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, User } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, BTN } from "@/components/site/ui";
import { absoluteUrl, pageHead } from "@/lib/seo";
import { FALLBACK_ARTICLES, fetchPressArticle, type PressArticle } from "@/lib/press";

export const Route = createFileRoute("/press/$slug")({
  head: ({ params }) => {
    const fallback = FALLBACK_ARTICLES.find((a) => a.slug === params.slug);
    return pageHead({
      title: fallback ? `${fallback.title} | F.I.R.E. Press` : "Press release | F.I.R.E.",
      description:
        fallback?.excerpt ?? "A press release from F.I.R.E. (Free Inspiration Reaching Everyone).",
      path: `/press/${params.slug}`,
      image: fallback?.image ?? "/images/press.jpg",
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Press", item: absoluteUrl("/press") },
          {
            "@type": "ListItem",
            position: 3,
            name: fallback?.title ?? "Press release",
            item: absoluteUrl(`/press/${params.slug}`),
          },
        ],
      },
    });
  },
  component: PressArticlePage,
});

function ArticleBody({ body }: { body: string }) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

function PressArticlePage() {
  const { slug } = useParams({ from: "/press/$slug" });

  const { data, isLoading } = useQuery({
    queryKey: ["press-article", slug],
    queryFn: () => fetchPressArticle(slug),
    staleTime: 5 * 60 * 1000,
  });

  const article: PressArticle | null =
    data ?? FALLBACK_ARTICLES.find((a) => a.slug === slug) ?? null;

  if (isLoading && !article) {
    return (
      <SiteLayout>
        <Section>
          <div className="mx-auto max-w-3xl space-y-5 pt-24" aria-busy="true">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="h-14 w-full animate-pulse rounded bg-muted" />
            <div className="h-72 w-full animate-pulse rounded-3xl bg-muted" />
          </div>
        </Section>
      </SiteLayout>
    );
  }

  if (!article) {
    return (
      <SiteLayout>
        <Section eyebrow="Press" title="We couldn't find that release.">
          <p className="max-w-xl text-lg text-muted-foreground">
            The article may have been moved or unpublished.
          </p>
          <Link to="/press" className={`${BTN.primary} mt-8`}>
            Back to press & media
          </Link>
        </Section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article>
        <header className="bg-[#0b1230] px-6 pb-16 pt-36 text-white lg:px-10 lg:pb-20 lg:pt-44">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/press"
              className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Press & media
            </Link>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight lg:text-6xl">
              {article.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/70">
              {article.displayDate && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={article.date}>{article.displayDate}</time>
                </span>
              )}
              {article.author && (
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  {article.author}
                </span>
              )}
              {article.category && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                  {article.category}
                </span>
              )}
            </div>
          </div>
        </header>

        {article.image && (
          <div className="px-6 lg:px-10">
            <img
              src={article.image}
              alt=""
              aria-hidden="true"
              className="mx-auto -mt-10 max-h-[520px] w-full max-w-5xl rounded-3xl object-cover shadow-xl"
              loading="eager"
            />
          </div>
        )}

        <Section>
          <div className="mx-auto max-w-3xl">
            {article.excerpt && (
              <p className="mb-8 border-l-4 border-primary pl-5 font-display text-xl font-semibold leading-snug text-foreground lg:text-2xl">
                {article.excerpt}
              </p>
            )}
            <ArticleBody body={article.body || article.excerpt} />

            <div className="mt-12 rounded-3xl border border-border bg-surface p-7">
              <h2 className="font-display text-2xl font-bold tracking-tight">Press contact</h2>
              <p className="mt-2 text-muted-foreground">
                For interviews, photography, or programme data, contact our communications team.
              </p>
              <a href="mailto:press@freeinspiration.org" className={`${BTN.primary} mt-6`}>
                press@freeinspiration.org
              </a>
            </div>

            <Link
              to="/press"
              className="mt-10 inline-flex items-center gap-2 rounded-sm font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All press releases
            </Link>
          </div>
        </Section>
      </article>
    </SiteLayout>
  );
}
