import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms-of-use")({
  head: () =>
    pageHead({
      title: "Terms of Use | F.I.R.E.",
      description:
        "The terms that govern your use of the F.I.R.E. (Free Inspiration Reaching Everyone) website and its services.",
      path: "/terms-of-use",
    }),
  component: TermsOfUse,
});

function TermsOfUse() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Navigation / Back Link */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              ← Back to home
            </Link>
          </div>

          {/* Page Header */}
          <header className="mb-10 border-b border-border/40 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Terms of Use
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Effective date: July 1, 2026</p>
          </header>

          {/* Main Content */}
          <article className="space-y-8 text-foreground/90 leading-relaxed text-base">
            <p className="text-lg leading-relaxed text-foreground/80">
              These Terms of Use (&quot;Terms&quot;) govern your use of this website operated by
              Fire Free Inspiration Reaching Everyone, Inc., a 501(c)(3) nonprofit organization
              operating as F.I.R.E. — Free Inspiration Reaching Everyone (&quot;F.I.R.E.&quot;,
              &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By using this page, you agree to
              these Terms. If you do not agree, please do not use the page.
            </p>

            {/* Section: About this page */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">About this page</h2>
              <p>
                This is an official website managed by Free Inspiration Reaching Everyone, Inc. The
                information here is offered on an &quot;as is&quot; basis for general informational
                purposes and may change or be replaced at any time without notice.
              </p>
            </section>

            {/* Section: Acceptable use */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Acceptable use</h2>
              <p>When using this page and its contact form, you agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/85">
                <li>Submit false, misleading, unlawful, or harmful content.</li>
                <li>Use the form to send spam, solicitations, or malicious material.</li>
                <li>
                  Attempt to disrupt, probe, or gain unauthorized access to the site or its systems.
                </li>
                <li>Impersonate any person or organization.</li>
                <li>Infringe the rights of others or violate any applicable law.</li>
              </ul>
            </section>

            {/* Section: Contact submissions */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Contact submissions
              </h2>
              <p>
                When you contact us through the form, you are responsible for the accuracy of the
                information you provide. Submitting a message does not create any partnership,
                employment, volunteer, or contractual relationship, and we are not obligated to
                respond to every message.
              </p>
            </section>

            {/* Section: Intellectual property */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Intellectual property
              </h2>
              <p>
                The F.I.R.E. name, logo, and the content of this page belong to F.I.R.E. or its
                licensors. You may not copy, reproduce, or reuse them without our permission, except
                as allowed by law.
              </p>
            </section>

            {/* Section: No warranties */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">No warranties</h2>
              <p>
                This page is provided &quot;as is&quot; and &quot;as available&quot; without
                warranties of any kind, whether express or implied. We do not guarantee that the
                page will be uninterrupted, error-free, or free of harmful components.
              </p>
            </section>

            {/* Section: Limitation of liability */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Limitation of liability
              </h2>
              <p>
                To the fullest extent permitted by law, F.I.R.E. will not be liable for any
                indirect, incidental, or consequential damages arising from your use of this
                website.
              </p>
            </section>

            {/* Section: Governing law */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Governing law</h2>
              <p>
                These Terms are governed by the laws of the Commonwealth of Pennsylvania, USA,
                without regard to conflict of law principles.
              </p>
            </section>

            {/* Section: Changes to these Terms */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Changes to these Terms
              </h2>
              <p>
                We may update these Terms at any time. Any updated Terms will be posted on this page
                with a revised effective date.
              </p>
            </section>

            {/* Section: Contact us */}
            <section className="space-y-3 border-t border-border/40 pt-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Contact us</h2>
              <p>
                If you have questions about these Terms, contact us at{" "}
                <a
                  href="mailto:info@freeinspiration.org"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  info@freeinspiration.org
                </a>
                .
              </p>
            </section>

            {/* Cross Reference Link */}
            <div className="pt-4 text-sm text-muted-foreground">
              See also our{" "}
              <Link
                to="/privacy-policy"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
