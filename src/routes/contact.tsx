import { pageHead } from "@/lib/seo";
import { usePageCopy } from "@/lib/page-content";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section } from "@/components/site/ui";
import { InquiryForm } from "@/components/site/InquiryForm";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact F.I.R.E. — Talk to our team",
      description:
        "Get in touch with F.I.R.E. (Free Inspiration Reaching Everyone) about programmes, partnerships, media, or volunteering in Philadelphia and Ghana.",
      path: "/contact",
      image: "/images/editorial/impact.jpg",
    }),
  component: ContactPage,
});

function ContactPage() {
  const copy = usePageCopy("/contact");
  const hero = copy("hero", {
    eyebrow: "Contact",
    title: "Start a conversation.",
    intro:
      "Whether you want to partner, volunteer, or simply understand the work better — we read every message.",
    image: "/images/editorial/impact.jpg",
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow={hero.eyebrow!}
        title={hero.title!}
        intro={hero.intro}
        image={hero.image!}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <div className="font-semibold">Email</div>
                <a
                  href="mailto:info@freeinspiration.org"
                  className="text-muted-foreground hover:text-primary"
                >
                  info@freeinspiration.org
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <div className="font-semibold">Phone</div>
                <a href="tel:+12155550142" className="text-muted-foreground hover:text-primary">
                  +1 (215) 555-0142
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <div className="font-semibold">Offices</div>
                <p className="text-muted-foreground">Philadelphia, Pennsylvania · Accra, Ghana</p>
              </div>
            </div>
          </div>

          <InquiryForm subject="General inquiry" submitLabel="Send inquiry" />
        </div>
      </Section>
    </SiteLayout>
  );
}
