import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section } from "@/components/site/ui";
import { InquiryForm } from "@/components/site/InquiryForm";
import { pageHead } from "@/lib/seo";
import { usePageCopy } from "@/lib/page-content";
import { FALLBACK_ARTICLES, fetchPressArticles } from "@/lib/press";

export const Route = createFileRoute("/press/")({
  head: () =>
    pageHead({
      title: "Press & Media | F.I.R.E.",
      description:
        "Press releases, media coverage, and press contact details for F.I.R.E. (Free Inspiration Reaching Everyone).",
      path: "/press",
      image: "/images/press.jpg",
    }),
  component: PressPage,
});

function PressPage() {
  const copy = usePageCopy("/press");
  const hero = copy("hero", {
    eyebrow: "Press & media",
    title: "The work, on the record.",
    intro:
      "Announcements, coverage, and everything a journalist needs to write about F.I.R.E. accurately.",
    image: "/images/press.jpg",
  });
  const releases = copy("releases", {
    eyebrow: "Announcements",
    title: "Latest releases.",
  });
  const contact = copy("press-contact", {
    eyebrow: "Media kit",
    title: "Press contact.",
    body: "For interviews, photography, or programme data, contact our communications team. We respond to press inquiries within two business days.",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["press-articles"],
    queryFn: fetchPressArticles,
    staleTime: 5 * 60 * 1000,
  });

  const articles = data && data.length > 0 ? data : FALLBACK_ARTICLES;

  return (
    <SiteLayout>
      <PageHero
        eyebrow={hero.eyebrow!}
        title={hero.title!}
        intro={hero.intro}
        image={hero.image!}
      />

      <Section eyebrow={releases.eyebrow} title={releases.title}>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        ) : (
          <ul className="grid list-none gap-8 p-0 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition hover:shadow-lg">
                  {article.image && (
                    <img
                      src={article.image}
                      alt=""
                      aria-hidden="true"
                      className="h-52 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      <span>{article.displayDate}</span>
                      {article.category && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] tracking-[0.12em]">
                          {article.category}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight">
                      <Link
                        to="/press/$slug"
                        params={{ slug: article.slug }}
                        className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group-hover:text-primary"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">
                      {article.excerpt}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Read the story <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section eyebrow={contact.eyebrow} title={contact.title} className="bg-surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="space-y-4 text-muted-foreground">
            <p>{contact.body}</p>
            <a
              href="mailto:press@freeinspiration.org"
              className="inline-flex items-center gap-2 rounded-sm font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              press@freeinspiration.org <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <InquiryForm
            subject="Press inquiry"
            organizationLabel="Publication or outlet"
            messageLabel="Your inquiry"
            messagePlaceholder="Tell us about your story, deadline, and what you need from us…"
            submitLabel="Send press inquiry"
          />
        </div>
      </Section>
    </SiteLayout>
  );
}
