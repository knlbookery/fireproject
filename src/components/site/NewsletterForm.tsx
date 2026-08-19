import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { BTN_BASE } from "./ui";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}$/;

/**
 * Footer newsletter signup. Reuses the existing /api/contact.php contract
 * (no new endpoint) by submitting a composed message — see lovableRule.md §5.
 */
export function NewsletterForm() {
  const renderedAt = useRef(new Date().toISOString());
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setState("sending");
    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0] || "Subscriber",
          email,
          organization: "",
          message: "Newsletter signup request submitted from the website footer.",
          website,
          formRenderedAt: renderedAt.current,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setState("done");
      setEmail("");
    } catch {
      setState("error");
      setError("We couldn't sign you up right now. Please try again shortly.");
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-6 text-sm text-foreground">
        <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
        You're on the list. Look out for our next update.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className={`${BTN_BASE} shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60`}
        >
          {state === "sending" ? "Signing up…" : "Subscribe"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="mt-3 text-sm text-primary">
          {error}
        </p>
      )}
    </form>
  );
}
