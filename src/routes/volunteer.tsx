import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section } from "@/components/site/ui";
import { InquiryForm } from "@/components/site/InquiryForm";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer with F.I.R.E. — Give your time" },
      {
        name: "description",
        content:
          "Volunteer with F.I.R.E. as a coach, mentor, event lead, or skills volunteer in Philadelphia and Ghana. Tell us how you'd like to help.",
      },
    ],
  }),
  component: VolunteerPage,
});

const ROLES = [
  { title: "Coach", body: "Lead training sessions and game days for youth leagues. Seasonal commitment." },
  { title: "Mentor", body: "Support one student for a year with monthly guidance and goal setting." },
  { title: "Event crew", body: "Set-up, registration, and hospitality at tournaments and community days." },
  { title: "Skills volunteer", body: "Design, legal, accounting, translation, or software — remote friendly." },
];

function VolunteerPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Volunteer"
        title="Time is the gift that scales."
        intro="Volunteers run our leagues, mentor our students, and hold our events together. Here's where you'd fit."
        image="/images/volunteer.jpg"
      />

      <Section eyebrow="Roles" title="Ways to help.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r) => (
            <div key={r.title} className="rounded-3xl border border-border bg-card p-8">
              <h3 className="font-display text-xl font-bold tracking-tight">{r.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Sign up" title="Tell us how you'd like to help." className="bg-surface">
        <div className="mx-auto max-w-3xl">
          <InquiryForm
            subject="Volunteer application"
            organizationLabel="Employer or school (optional)"
            messageLabel="Why you'd like to volunteer"
            messagePlaceholder="Share your availability, relevant experience, and the role you're interested in…"
            submitLabel="Submit application"
            extraFields={[
              { name: "role", label: "Preferred role", options: ROLES.map((r) => r.title) },
              { name: "location", label: "Location", options: ["Philadelphia / U.S.", "Ghana", "Remote"] },
            ]}
          />
        </div>
      </Section>
    </SiteLayout>
  );
}
