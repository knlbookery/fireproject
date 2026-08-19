import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, CalendarDays, User } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, BTN } from "@/components/site/ui";
import { absoluteUrl, pageHead } from "@/lib/seo";
import {
  FALLBACK_ARTICLES,
  fetchPressArticle,
  fetchPressArticles,
  type PressArticle,
} from "@/lib/press";

export const Route = createFileRoute("/press/$slug")({
  head: ({ params }) => {
    const fallback = FALLBACK_ARTICLES.find((a) => a.slug === params.slug);
    return pageHead({
      title: fallback ? `${fallback.title} | F.I.R.E. Press` : "Press release | F.I.R.E.",
      description:
        fallback?.excerpt ?? "A press release from F.I.R.E. (Free Inspiration Reaching Everyone).",
      path: `/press/${params.slug}`,
      image: fallback?.image ?? "/images/editorial/press.jpg",
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

  const { data: allArticles } = useQuery({
    queryKey: ["press-articles"],
    queryFn: fetchPressArticles,
    staleTime: 5 * 60 * 1000,
  });

  const article: PressArticle | null =
    data ?? FALLBACK_ARTICLES.find((a) => a.slug === slug) ?? null;

  const pool = allArticles && allArticles.length > 0 ? allArticles : FALLBACK_ARTICLES;
  const others = pool.filter((a) => a.slug !== slug);
  const related = [
    ...others.filter((a) => article?.category && a.category === article.category),
    ...others.filter((a) => !article?.category || a.category !== article.category),
  ].slice(0, 3);


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
        <header className="bg-sky px-6 pb-16 pt-36 text-ink lg:px-10 lg:pb-20 lg:pt-44">
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
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-ink/70">
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

        {related.length > 0 && (
          <Section eyebrow="Keep reading" title="Related articles." className="bg-surface">
            <ul className="grid list-none gap-8 p-0 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <li key={item.id}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition hover:shadow-lg">
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        aria-hidden="true"
                        className="h-44 w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        <span>{item.displayDate}</span>
                        {item.category && (
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] tracking-[0.12em]">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-display text-xl font-bold leading-tight tracking-tight">
                        <Link
                          to="/press/$slug"
                          params={{ slug: item.slug }}
                          className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group-hover:text-primary"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                        {item.excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        Read the story <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </article>

    </SiteLayout>
  );
}
