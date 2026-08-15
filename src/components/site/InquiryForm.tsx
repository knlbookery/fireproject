import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";

import { BTN } from "./ui";

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’.\- ]{1,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}$/;

type Errors = Partial<Record<"name" | "email" | "organization" | "message", string>>;

/**
 * Shared inquiry form used by Contact, Volunteer, and Sponsors.
 *
 * All three post to the existing /api/contact.php contract (name, email,
 * organization, message + honeypot + formRenderedAt) — no new endpoint, per
 * lovableRule.md §5. `subject` is prefixed onto the message so the team can
 * tell the enquiries apart in Airtable.
 */
export function InquiryForm({
  subject,
  organizationLabel = "Organization (optional)",
  messageLabel = "Message",
  messagePlaceholder = "Tell us a little about why you're reaching out…",
  submitLabel = "Send message",
  extraFields,
}: {
  subject: string;
  organizationLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  extraFields?: { name: string; label: string; options?: string[] }[];
}) {
  const renderedAt = useRef(new Date().toISOString());
  const [values, setValues] = useState({ name: "", email: "", organization: "", message: "" });
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): Errors {
    const next: Errors = {};
    if (!NAME_REGEX.test(values.name.trim())) next.name = "Enter your full name (letters only).";
    if (!EMAIL_REGEX.test(values.email.trim())) next.email = "Enter a valid email address.";
    if (values.message.trim().length < 20)
      next.message = "Please write at least 20 characters so we can help properly.";
    if (values.message.trim().length > 1500)
      next.message = "Please keep this under 1500 characters.";
    return next;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setServerError(null);
    setState("sending");

    const extraLines = Object.entries(extras)
      .filter(([, v]) => v.trim() !== "")
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          organization: values.organization.trim(),
          message: `[${subject}]\n${extraLines ? extraLines + "\n" : ""}${values.message.trim()}`,
          website,
          formRenderedAt: renderedAt.current,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setState("done");
    } catch {
      setState("idle");
      setServerError("We couldn't send your message right now. Please try again shortly.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
        <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">Message received</h3>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Thank you — a member of the F.I.R.E. team will follow up with you by email shortly.
        </p>
      </div>
    );
  }

  const field =
    "mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-border bg-card p-6 sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="if-name" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="if-name"
            className={field}
            value={values.name}
            autoComplete="name"
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            onBlur={() => setErrors(validate())}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "if-name-err" : undefined}
          />
          {errors.name && (
            <p id="if-name-err" role="alert" className="mt-1.5 text-xs text-destructive">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="if-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="if-email"
            type="email"
            className={field}
            value={values.email}
            autoComplete="email"
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            onBlur={() => setErrors(validate())}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "if-email-err" : undefined}
          />
          {errors.email && (
            <p id="if-email-err" role="alert" className="mt-1.5 text-xs text-destructive">
              {errors.email}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="if-org" className="text-sm font-medium">
            {organizationLabel}
          </label>
          <input
            id="if-org"
            className={field}
            value={values.organization}
            onChange={(e) => setValues((v) => ({ ...v, organization: e.target.value }))}
          />
        </div>

        {extraFields?.map((f) => (
          <div key={f.name} className="sm:col-span-2">
            <label htmlFor={`if-${f.name}`} className="text-sm font-medium">
              {f.label}
            </label>
            {f.options ? (
              <select
                id={`if-${f.name}`}
                className={field}
                value={extras[f.label] ?? ""}
                onChange={(e) => setExtras((x) => ({ ...x, [f.label]: e.target.value }))}
              >
                <option value="">Select an option</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`if-${f.name}`}
                className={field}
                value={extras[f.label] ?? ""}
                onChange={(e) => setExtras((x) => ({ ...x, [f.label]: e.target.value }))}
              />
            )}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label htmlFor="if-message" className="text-sm font-medium">
            {messageLabel}
          </label>
          <textarea
            id="if-message"
            rows={6}
            className={field}
            placeholder={messagePlaceholder}
            value={values.message}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
            onBlur={() => setErrors(validate())}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "if-message-err" : "if-message-count"}
          />
          <div className="mt-1.5 flex items-center justify-between">
            {errors.message ? (
              <p id="if-message-err" role="alert" className="text-xs text-destructive">
                {errors.message}
              </p>
            ) : (
              <span id="if-message-count" className="text-xs text-muted-foreground">
                {values.message.trim().length}/1500 characters
              </span>
            )}
          </div>
        </div>
      </div>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
      />

      {serverError && (
        <p
          role="alert"
          className="mt-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className={`mt-7 ${BTN.primary} disabled:opacity-60`}
      >
        {state === "sending" ? "Sending…" : submitLabel}
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
