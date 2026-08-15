import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Effective date: July 1, 2026</p>
          </header>

          {/* Main Content */}
          <article className="space-y-8 text-foreground/90 leading-relaxed text-base">
            <p className="text-lg leading-relaxed text-foreground/80">
              This Privacy Policy explains how Fire Free Inspiration Reaching Everyone, Inc., a
              501(c)(3) nonprofit organization operating as F.I.R.E. — Free Inspiration Reaching
              Everyone (&quot;F.I.R.E.&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;),
              handles information collected through this website. By accessing and submitting any
              information through this website and its contact form, you acknowledge and consent to
              our collection of information needed to respond to your inquiries.
            </p>

            {/* Section: Information We Collect */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Information we collect
              </h2>
              <p>We only collect information you choose to give us through the contact form:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/85">
                <li>
                  <strong className="font-semibold text-foreground">Your name</strong> — so we know
                  who is contacting us.
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Your email address</strong> — so
                  we can reply.
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Your organization</strong> —
                  optional, only if you provide it.
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Your message</strong> — the
                  content you send us.
                </li>
              </ul>
              <p className="text-sm text-muted-foreground pt-1">
                We do not run advertising or analytics trackers on this page, and we do not store
                your IP address with your submission.
              </p>
            </section>

            {/* Section: How We Use Your Information */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                How we use your information
              </h2>
              <p>
                We use the information you submit solely to read and respond to your message and to
                keep a record of correspondence. When you submit the form, your message is emailed
                to us and a copy is stored in our records system so we can follow up.
              </p>
            </section>

            {/* Section: How Your Information Is Handled */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                How your information is handled
              </h2>
              <p>
                Form submissions are delivered to us by email and stored in a third-party records
                service (Airtable) used purely for internal record-keeping. We share your
                information only with the service providers that make this contact process work, and
                only to the extent needed. We do not sell your information or share it for
                advertising.
              </p>
            </section>

            {/* Section: How Long We Keep It */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                How long we keep it
              </h2>
              <p>
                We keep contact submissions only as long as needed to respond to and follow up on
                your inquiry, and to maintain reasonable records. You may ask us to delete your
                information at any time using the contact details below.
              </p>
            </section>

            {/* Section: Your Choices */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Your choices</h2>
              <p>
                You can request access to, correction of, or deletion of the information you have
                submitted to us. To make a request, email us at{" "}
                <a
                  href="mailto:info@freeinspiration.org"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  info@freeinspiration.org
                </a>
                . Depending on where you live, you may have additional rights under applicable
                data-protection laws.
              </p>
            </section>

            {/* Section: Children's Privacy */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Children&apos;s privacy
              </h2>
              <p>
                This website is not directed to children, and we do not knowingly collect
                information from children through this form. If you believe a child has submitted
                information, please contact us so we can remove it.
              </p>
            </section>

            {/* Section: Changes to This Policy */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Changes to this policy
              </h2>
              <p>
                This policy may be updated from time to time. Any updated policy will be posted on
                this page with a revised effective date.
              </p>
            </section>

            {/* Section: Contact Us */}
            <section className="space-y-3 border-t border-border/40 pt-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Contact us</h2>
              <p>
                If you have questions about this Privacy Policy, contact us at{" "}
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
                to="/terms-of-use"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Terms of Use
              </Link>
              .
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
