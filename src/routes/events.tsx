import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section } from "@/components/site/ui";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Tournaments, workshops and community days | F.I.R.E." },
      {
        name: "description",
        content:
          "Upcoming F.I.R.E. events in Philadelphia and Ghana: youth tournaments, founder workshops, fundraisers, and community days. RSVP online.",
      },
    ],
  }),
  component: EventsPage,
});

type EventItem = {
  id: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  image?: string;
};

function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/events.php")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : (data?.events ?? []);
        setEvents(list);
      })
      .catch(() => undefined)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Events"
        title="Show up. Bring someone with you."
        intro="Tournaments, workshops, fundraisers and community days across Philadelphia and Ghana."
        image="/images/events.jpg"
      />

      <Section eyebrow="Calendar" title="Upcoming events.">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="max-w-xl text-lg text-muted-foreground">
            No events are scheduled right now. Check back soon, or{" "}
            <a href="/contact" className="font-semibold text-primary hover:underline">
              get in touch
            </a>{" "}
            to hear about the next one first.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <article
                key={e.id}
                className="overflow-hidden rounded-3xl border border-border bg-card transition hover:shadow-lg"
              >
                {e.image && (
                  <img
                    src={e.image}
                    alt={e.title}
                    className="h-52 w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="p-7">
                  <h2 className="font-display text-2xl font-bold tracking-tight">{e.title}</h2>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {e.date && (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                        {e.date}
                      </div>
                    )}
                    {e.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                        {e.time}
                      </div>
                    )}
                    {e.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                        {e.location}
                      </div>
                    )}
                  </div>
                  {e.description && (
                    <p className="mt-4 line-clamp-4 text-sm text-muted-foreground">
                      {e.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
