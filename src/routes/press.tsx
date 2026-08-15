import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section } from "@/components/site/ui";
import { InquiryForm } from "@/components/site/InquiryForm";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press & Media | F.I.R.E." },
      {
        name: "description",
        content:
          "Press releases, media coverage, and press contact details for F.I.R.E. (Free Inspiration Reaching Everyone).",
      },
    ],
  }),
  component: PressPage,
});

const RELEASES = [
  {
    date: "March 2026",
    title: "F.I.R.E. opens third community court in Greater Accra",
    body: "The new court will host weekly leagues and school tournaments for an estimated 400 young people in its first year.",
  },
  {
    date: "January 2026",
    title: "Founder bootcamp graduates 60 new entrepreneurs",
    body: "The eight-week programme pairs training with micro-grants and twelve months of continued mentorship.",
  },
  {
    date: "November 2025",
    title: "Philadelphia mentorship cohort expands to nine neighbourhoods",
    body: "Sixty-two students are matched with vetted mentors for a structured year of monthly guidance.",
  },
];

function PressPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Press & media"
        title="The work, on the record."
        intro="Announcements, coverage, and everything a journalist needs to write about F.I.R.E. accurately."
        image="/images/press.jpg"
      />

      <Section eyebrow="Announcements" title="Latest releases.">
        <div className="divide-y divide-border border-y border-border">
          {RELEASES.map((r) => (
            <article key={r.title} className="grid gap-4 py-10 md:grid-cols-[180px_1fr]">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{r.date}</div>
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">{r.title}</h2>
                <p className="mt-3 max-w-2xl text-muted-foreground">{r.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Media kit" title="Press contact." className="bg-surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="space-y-4 text-muted-foreground">
            <p>
              For interviews, photography, or programme data, contact our communications team. We
              respond to press inquiries within two business days.
            </p>
            <a
              href="mailto:press@freeinspiration.org"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
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
