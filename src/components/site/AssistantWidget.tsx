/**
 * Site-wide visitor assistant.
 *
 * A floating helper mounted by SiteLayout on every page. Questions are sent
 * to the same-origin PHP endpoint /api/assistant.php, which talks to the AI
 * provider server-side. If the endpoint is unavailable (local dev without
 * PHP, or an outage), the widget answers from a small local knowledge map so
 * a visitor is never left with a dead assistant.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What does F.I.R.E. do?",
  "How can I volunteer?",
  "How do I donate?",
  "Are there upcoming events?",
];

const LOCAL_ANSWERS: [string[], string][] = [
  [
    ["donat", "give", "gift"],
    "You can give securely on our donation page at /donate — one-time or monthly.",
  ],
  [
    ["volunteer"],
    "We welcome coaches, mentors, event crew and skills volunteers. Roles and the sign-up form are on /volunteer.",
  ],
  [
    ["partner", "sponsor"],
    "Partners and the ways to work with us are on /partners; corporate sponsorship tiers are on /sponsors.",
  ],
  [
    ["event", "rsvp"],
    "Upcoming events, with search, location filters and RSVP, are listed on /events.",
  ],
  [
    ["program", "sport", "entrepreneur", "education", "tech"],
    "Our three pillars are Sports, Entrepreneurship and Community Development, with technology and education alongside them — see /programs.",
  ],
  [["ghana"], "Our Ghana work is based in Accra; details are on /ghana-initiatives."],
  [
    ["philadelphia", "united states", "u.s.", "usa"],
    "Our U.S. work is based in Philadelphia; details are on /us-initiatives.",
  ],
  [["impact", "result", "outcome"], "Our outcome numbers and reporting are on /impact."],
  [
    ["leader", "team", "board", "staff"],
    "You can meet the organisation leaders, with bios and governance information, on /leadership.",
  ],
  [["press", "news", "article"], "News and articles are on /press, searchable by topic."],
  [
    ["contact", "email", "phone", "reach"],
    "You can reach us through the form on /contact or by email at info@freeinspiration.org.",
  ],
  [["mission", "value"], "Our mission and values are set out on /mission."],
  [
    ["who", "what is", "about"],
    "F.I.R.E. (Free Inspiration Reaching Everyone) is a nonprofit empowering communities through education, technology, entrepreneurship, sports and youth development in Ghana and the United States. More on /about.",
  ],
];

function localAnswer(question: string) {
  const q = question.toLowerCase();
  for (const [needles, answer] of LOCAL_ANSWERS) {
    if (needles.some((n) => q.includes(n))) return answer;
  }
  return "F.I.R.E. empowers communities through education, technology, entrepreneurship, sports and youth development in Ghana and the United States. Try /about, /programs or /events — and for anything specific, /contact reaches the team directly.";
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm the F.I.R.E. assistant. Ask me about our programmes, events, volunteering, partnerships or how to give.",
    },
  ]);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const canSend = useMemo(() => input.trim().length > 1 && !busy, [input, busy]);

  async function send(question: string) {
    const trimmed = question.trim();
    if (trimmed === "" || busy) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);

    let reply = "";
    try {
      const res = await fetch("/api/assistant.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route: pathname,
          messages: next.slice(-12).map(({ role, content }) => ({ role, content })),
        }),
      });
      const body = (await res.json()) as { success?: boolean; reply?: string; error?: string };
      if (res.ok && body.success && body.reply) {
        reply = body.reply;
      } else if (body.error) {
        reply = body.error;
      }
    } catch {
      reply = "";
    }

    setMessages([...next, { role: "assistant", content: reply || localAnswer(trimmed) }]);
    setBusy(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="fire-assistant-panel"
        aria-label={open ? "Close the F.I.R.E. assistant" : "Ask the F.I.R.E. assistant"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          id="fire-assistant-panel"
          ref={panelRef}
          role="dialog"
          aria-label="F.I.R.E. assistant"
          className="fixed bottom-24 right-5 z-50 flex h-[min(70vh,540px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        >
          <div className="border-b border-border px-5 py-4">
            <p className="font-display text-lg font-bold tracking-tight">Ask F.I.R.E.</p>
            <p className="text-xs text-muted-foreground">
              Quick answers about our work, events and how to get involved.
            </p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "mr-auto max-w-[90%] rounded-2xl bg-surface px-4 py-2.5 text-sm text-foreground"
                }
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="mr-auto rounded-2xl bg-surface px-4 py-2.5 text-sm text-muted-foreground">
                Thinking…
              </div>
            )}
            <div aria-live="polite" className="sr-only">
              {busy ? "Assistant is typing" : messages[messages.length - 1]?.content}
            </div>
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-center gap-2 border-t border-border px-4 py-3"
          >
            <label htmlFor="fire-assistant-input" className="sr-only">
              Your question
            </label>
            <input
              id="fire-assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={500}
              autoComplete="off"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send question"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
