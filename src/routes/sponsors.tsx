import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section } from "@/components/site/ui";
import { InquiryForm } from "@/components/site/InquiryForm";
import { SPONSOR_TIERS } from "@/data/site";

export const Route = createFileRoute("/sponsors")({
  head: () =>
    pageHead({
      title: "Sponsors & Partners | F.I.R.E.",
      description:
        "Partner with F.I.R.E. Corporate sponsorship tiers fund youth sports, enterprise training, and community programmes in Philadelphia and Ghana.",
      path: "/sponsors",
      image: "/images/partners.jpg",
    }),
  component: SponsorsPage,
});

function SponsorsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Sponsors & partners"
        title="Put your brand behind real outcomes."
        intro="Sponsorship funds named cohorts, courts, and events — with reporting you can show your board."
        image="/images/partners.jpg"
      />

      <Section eyebrow="Tiers" title="Sponsorship levels.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SPONSOR_TIERS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-3xl border border-border bg-card p-8"
            >
              <h3 className="font-display text-2xl font-bold tracking-tight">{t.name}</h3>
              <div className="mt-2 text-primary">{t.amount}</div>
              <ul className="mt-6 space-y-2.5">
                {t.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Get started" title="Become a partner." className="bg-surface">
        <div className="mx-auto max-w-3xl">
          <InquiryForm
            subject="Sponsorship inquiry"
            organizationLabel="Company or foundation"
            messageLabel="What you'd like to support"
            messagePlaceholder="Tell us about your organization, the programmes you're drawn to, and your timeline…"
            submitLabel="Request sponsorship pack"
            extraFields={[
              { name: "tier", label: "Interested tier", options: SPONSOR_TIERS.map((t) => t.name) },
            ]}
          />
        </div>
      </Section>
    </SiteLayout>
  );
}
