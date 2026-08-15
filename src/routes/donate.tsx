import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Heart, Lock, ShieldCheck } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section } from "@/components/site/ui";

export const Route = createFileRoute("/donate")({
  head: () =>
    pageHead({
      title: "Donate — Give inspiration that changes lives | F.I.R.E.",
      description:
        "Support F.I.R.E. with a secure one-time or monthly gift. 100% of your donation reaches youth sports, education, and enterprise programmes in Philadelphia and Ghana.",
      path: "/donate",
      image: "/images/impact.jpg",
    }),
  component: DonatePage,
});

function DonatePage() {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://www.zeffy.com/embed/v2/zeffy-embed.js";
    s.async = true;
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Donate"
        title="Give inspiration that changes lives."
        intro="Join us in creating change. Every act of kindness, every dollar, and every moment of your time brings us closer to our mission."
        image="/images/donate.jpg"
      />

      <Section className="bg-surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-start">
          <div>
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight lg:text-5xl">
              Together, we can create a brighter future.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              At F.I.R.E. — Free Inspiration Reaching Everyone — we know that change starts with
              people like you. Your gift funds coaching, equipment, tuition support, and the
              micro-capital that helps a new founder open their doors.
            </p>
            <ul className="mt-10 space-y-5">
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">
                  501(c)(3) nonprofit — donations are tax deductible in the U.S.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">
                  Payments processed securely by Zeffy, with Apple Pay and Google Pay supported.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Heart className="mt-0.5 h-5 w-5 text-primary" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">
                  Zero platform fees — 100% of your gift reaches the programmes.
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-3 shadow-sm sm:p-5">
            <iframe
              title="Donation form powered by Zeffy"
              src="https://www.zeffy.com/embed/donation-form/give-inspiration-that-changes-lives"
              allow="payment"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              className="h-[900px] min-h-[900px] w-full rounded-2xl border-0"
            />
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
