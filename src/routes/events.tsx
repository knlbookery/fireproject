import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState, type FormEvent } from "react";
import { CalendarDays, CheckCircle2, Clock, Mail, MapPin } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Section, BTN } from "@/components/site/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { pageHead } from "@/lib/seo";
import { usePageCopy } from "@/lib/page-content";

export const Route = createFileRoute("/events")({
  head: () =>
    pageHead({
      title: "Events — Tournaments, workshops and community days | F.I.R.E.",
      description:
        "Upcoming F.I.R.E. events in Philadelphia and Ghana: youth tournaments, founder workshops, fundraisers, and community days. RSVP online.",
      path: "/events",
      image: "/images/events.jpg",
    }),
  component: EventsPage,
});

type EventItem = {
  id: string;
  name: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  photo?: string;
  links?: { label: string; url: string }[];
};

async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch("/api/events.php");
  if (!res.ok) throw new Error("Unable to load events");
  const body = (await res.json()) as { success?: boolean; events?: EventItem[] };
  return Array.isArray(body.events) ? body.events : [];
}

type RsvpState =
  | { status: "form" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | {
      status: "confirmed";
      name: string;
      email: string;
      phone: string;
      emailSent: boolean;
    };

function RsvpDialog({ event, onClose }: { event: EventItem | null; onClose: () => void }) {
  const [state, setState] = useState<RsvpState>({ status: "form" });
  const formRef = useRef<HTMLFormElement>(null);

  const close = () => {
    onClose();
    setState({ status: "form" });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!event) return;

    const data = new FormData(e.currentTarget);
    const fullName = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").replace(/\D/g, "");

    if (fullName.length < 2) {
      setState({ status: "error", message: "Please enter your full name." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState({ status: "error", message: "Please enter a valid email address." });
      return;
    }
    if (!/^\d{9,10}$/.test(phone)) {
      setState({ status: "error", message: "Please enter a 9–10 digit phone number." });
      return;
    }

    setState({ status: "submitting" });

    try {
      const res = await fetch("/api/rsvp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          fullName,
          email,
          phone,
          eventName: event.name,
          eventDate: event.date ?? "",
          eventTime: event.time ?? "",
          eventLocation: event.location ?? "",
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        emailSent?: boolean;
        error?: string;
      };

      if (!res.ok || !body.success) {
        setState({
          status: "error",
          message: body.error ?? "We couldn't record your RSVP. Please try again shortly.",
        });
        return;
      }

      setState({
        status: "confirmed",
        name: fullName,
        email,
        phone,
        emailSent: body.emailSent !== false,
      });
      formRef.current?.reset();
    } catch {
      setState({
        status: "error",
        message: "We couldn't reach the server. Please check your connection and try again.",
      });
    }
  }

  const confirmed = state.status === "confirmed";

  return (
    <Dialog open={event !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-lg">
        {confirmed ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden="true" />
            <DialogHeader>
              <DialogTitle className="mt-4 text-center font-display text-2xl font-bold tracking-tight">
                You're on the list.
              </DialogTitle>
              <DialogDescription className="text-center">
                Thanks {state.name} — your RSVP for {event?.name} is confirmed.
              </DialogDescription>
            </DialogHeader>

            <dl className="mt-6 space-y-3 rounded-2xl border border-border bg-surface p-5 text-left text-sm">
              {event?.date && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-medium">{event.date}</dd>
                </div>
              )}
              {event?.time && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Time</dt>
                  <dd className="font-medium">{event.time}</dd>
                </div>
              )}
              {event?.location && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="text-right font-medium">{event.location}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{state.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{state.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{state.phone}</dd>
              </div>
            </dl>

            <p className="mt-5 inline-flex items-start gap-2 text-left text-sm text-muted-foreground">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {state.emailSent
                ? `A confirmation email with these details is on its way to ${state.email}.`
                : "Your RSVP is recorded. We couldn't send the confirmation email — our team will follow up directly."}
            </p>

            <button type="button" onClick={close} className={`${BTN.primary} mt-7 w-full`}>
              Done
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-bold tracking-tight">
                RSVP — {event?.name}
              </DialogTitle>
              <DialogDescription>
                Reserve your place. We'll email you a confirmation with the details.
              </DialogDescription>
            </DialogHeader>

            <form ref={formRef} onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
              <div>
                <label htmlFor="rsvp-name" className="text-sm font-medium">
                  Full name
                </label>
                <input
                  id="rsvp-name"
                  name="fullName"
                  autoComplete="name"
                  required
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="rsvp-email" className="text-sm font-medium">
                  Email address
                </label>
                <input
                  id="rsvp-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="rsvp-phone" className="text-sm font-medium">
                  Phone number
                </label>
                <input
                  id="rsvp-phone"
                  name="phone"
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  aria-describedby="rsvp-phone-hint"
                  className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <p id="rsvp-phone-hint" className="mt-1.5 text-xs text-muted-foreground">
                  Digits only — 9 to 10 numbers.
                </p>
              </div>

              <div aria-live="polite">
                {state.status === "error" && (
                  <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {state.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={state.status === "submitting"}
                className={`${BTN.primary} w-full disabled:opacity-60`}
              >
                {state.status === "submitting" ? "Submitting…" : "Confirm RSVP"}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function EventsPage() {
  const copy = usePageCopy("/events");
  const hero = copy("hero", {
    eyebrow: "Events",
    title: "Show up. Bring someone with you.",
    intro: "Tournaments, workshops, fundraisers and community days across Philadelphia and Ghana.",
    image: "/images/events.jpg",
  });
  const calendar = copy("calendar", { eyebrow: "Calendar", title: "Upcoming events." });

  const [rsvpEvent, setRsvpEvent] = useState<EventItem | null>(null);
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState("All locations");

  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 60 * 1000,
  });

  const events = useMemo(() => data ?? [], [data]);

  const places = useMemo(() => {
    const set = new Set(events.map((e) => e.location).filter(Boolean) as string[]);
    return ["All locations", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [events]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchesPlace = place === "All locations" || e.location === place;
      const matchesQuery =
        q === "" ||
        [e.name, e.description, e.location, e.date, e.time]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q));
      return matchesPlace && matchesQuery;
    });
  }, [events, place, query]);


  return (
    <SiteLayout>
      <PageHero
        eyebrow={hero.eyebrow!}
        title={hero.title!}
        intro={hero.intro}
        image={hero.image!}
      />

      <Section eyebrow={calendar.eyebrow} title={calendar.title}>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="max-w-xl text-lg text-muted-foreground">
            No events are scheduled right now. Check back soon, or{" "}
            <a
              href="/contact"
              className="rounded-sm font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              get in touch
            </a>{" "}
            to hear about the next one first.
          </p>
        ) : (
          <ul className="grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <li key={e.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition hover:shadow-lg">
                  {e.photo && (
                    <img
                      src={e.photo}
                      alt=""
                      aria-hidden="true"
                      className="h-52 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="font-display text-2xl font-bold tracking-tight">{e.name}</h2>
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
                    {e.links && e.links.length > 0 && (
                      <ul className="mt-4 space-y-1 text-sm">
                        {e.links.map((l) => (
                          <li key={l.url}>
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      type="button"
                      onClick={() => setRsvpEvent(e)}
                      className={`${BTN.primary} mt-6 w-full`}
                    >
                      RSVP for {e.name}
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <RsvpDialog event={rsvpEvent} onClose={() => setRsvpEvent(null)} />
    </SiteLayout>
  );
}
