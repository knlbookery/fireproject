/**
 * Page narrator — "Listen to this page".
 *
 * A floating control mounted on every page by SiteLayout. On click it asks the
 * same-origin PHP endpoint /api/page-summary.php for a short spoken script
 * describing what the current page is about and what the visitor is expected
 * to do, then reads it aloud with the browser's Web Speech API (no audio is
 * downloaded or stored). If the endpoint is unavailable, a local script for
 * the route is used instead, so the narrator always speaks.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Headphones, Loader2, Square, X } from "lucide-react";

const LOCAL_SCRIPTS: Record<string, string> = {
  "/": "This is the F.I.R.E. home page. F.I.R.E., Free Inspiration Reaching Everyone, empowers communities through education, technology, entrepreneurship, sports and youth development in Ghana and the United States. Scroll through the mission, programmes, impact and events, then choose a path: explore our programmes, join an event, or support the work with a gift.",
  "/about":
    "This page introduces who F.I.R.E. is: our story, how the organisation is run, and the communities we serve in Philadelphia and Accra. Read through, then meet the team on the leadership page or reach out through the contact page.",
  "/mission":
    "This page sets out why F.I.R.E. exists, our values and the change we are working towards. If the mission resonates, the next step is to volunteer, partner with us, or give.",
  "/impact":
    "This page reports our outcomes: the numbers behind each programme and how we measure the difference we make. Review the figures, then consider funding a specific programme.",
  "/programs":
    "This page covers our work: three primary pillars, Sports, Entrepreneurship and Community Development, with technology and education alongside them. Open a programme to read what it delivers, and use the donate button on any card to give directly to the programme you care about.",
  "/ghana-initiatives":
    "This page covers our Ghana work, based in Accra, and the communities involved. Learn about the initiatives, then get involved as a volunteer or supporter.",
  "/us-initiatives":
    "This page covers our United States work, based in Philadelphia, and who it serves. Learn about the initiatives, then get involved as a volunteer or supporter.",
  "/events":
    "This page lists our upcoming events. Search by keyword or filter by location to find one near you, then RSVP and we will email your confirmation.",
  "/press":
    "This page is our newsroom: articles and coverage about F.I.R.E. Search or filter by topic, then open an article to read the full story.",
  "/leadership":
    "This page introduces the people who lead F.I.R.E., their roles and the governance behind the work. Open any profile to read a full bio.",
  "/partners":
    "This page is our partner directory: who partners with F.I.R.E., how they support the work, and what partnership makes possible. If your organisation is a fit, use the enquiry form to start a conversation.",
  "/sponsors":
    "This page explains corporate sponsorship: the tiers available and what each includes. Choose a tier that fits, then request a sponsorship pack through the form.",
  "/volunteer":
    "This page is about volunteering with F.I.R.E. Roles include coaching, mentoring, event crew and skills based support. Find a role that fits, then fill in the sign up form and the team will follow up.",
  "/donate":
    "This page is where you support F.I.R.E. financially. Giving is secure and processed by Zeffy. Choose a one time or monthly amount in the donation form and complete your gift.",
  "/contact":
    "This page is how you reach the F.I.R.E. team. Send us a message using the form, or email info at freeinspiration dot org.",
};

function localScript(pathname: string) {
  const key = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";
  if (LOCAL_SCRIPTS[key]) return LOCAL_SCRIPTS[key];
  const section = Object.keys(LOCAL_SCRIPTS).find(
    (p) => p !== "/" && key.startsWith(`${p}/`),
  );
  if (section) return LOCAL_SCRIPTS[section];
  return "This is a page on the F.I.R.E. website. F.I.R.E. empowers communities through education, technology, entrepreneurship, sports and youth development in Ghana and the United States. Read through the page, then explore our programmes, join an event, volunteer or support the work with a gift.";
}

const VOICE_KEY = "fire.narrator.voice";
const RATE_KEY = "fire.narrator.rate";

export function PageNarrator() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [supported, setSupported] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [script, setScript] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [rate, setRate] = useState(1);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cacheRef = useRef<Record<string, string>>({});
  const voiceUriRef = useRef("");
  const rateRef = useRef(1);

  voiceUriRef.current = voiceUri;
  rateRef.current = rate;

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  // Restore saved preferences and keep the voice list in sync (it loads async).
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const savedVoice = window.localStorage.getItem(VOICE_KEY);
    if (savedVoice) setVoiceUri(savedVoice);
    const savedRate = Number(window.localStorage.getItem(RATE_KEY));
    if (Number.isFinite(savedRate) && savedRate >= 0.5 && savedRate <= 2) {
      setRate(savedRate);
    }

    const load = () => {
      const list = window.speechSynthesis
        .getVoices()
        .filter((v) => v.lang.toLowerCase().startsWith("en"));
      setVoices(list.length > 0 ? list : window.speechSynthesis.getVoices());
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setSpeaking(false);
  }, []);

  // Stop and reset whenever the visitor navigates to another page.
  useEffect(() => {
    stop();
    setOpen(false);
    setScript("");
  }, [pathname, stop]);

  useEffect(() => stop, [stop]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rateRef.current;
    utterance.pitch = 1;
    const selected = window.speechSynthesis
      .getVoices()
      .find((v) => v.voiceURI === voiceUriRef.current);
    if (selected) {
      utterance.voice = selected;
      utterance.lang = selected.lang;
    } else {
      utterance.lang = "en-US";
    }
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const changeVoice = useCallback(
    (uri: string) => {
      setVoiceUri(uri);
      voiceUriRef.current = uri;
      if (typeof window !== "undefined") window.localStorage.setItem(VOICE_KEY, uri);
      if (speaking && script) speak(script);
    },
    [script, speak, speaking],
  );

  const changeRate = useCallback(
    (value: number) => {
      setRate(value);
      rateRef.current = value;
      if (typeof window !== "undefined") window.localStorage.setItem(RATE_KEY, String(value));
      if (speaking && script) speak(script);
    },
    [script, speak, speaking],
  );


  const fetchScript = useCallback(async () => {
    const cached = cacheRef.current[pathname];
    if (cached) return cached;

    let text = "";
    try {
      const res = await fetch("/api/page-summary.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: pathname }),
      });
      const body = (await res.json()) as { success?: boolean; script?: string };
      if (res.ok && body.success && body.script) text = body.script;
    } catch {
      text = "";
    }

    const final = text || localScript(pathname);
    cacheRef.current[pathname] = final;
    return final;
  }, [pathname]);

  const start = useCallback(async () => {
    setOpen(true);
    if (speaking) {
      stop();
      return;
    }
    if (script) {
      speak(script);
      return;
    }
    setLoading(true);
    const text = await fetchScript();
    setScript(text);
    setLoading(false);
    speak(text);
  }, [fetchScript, script, speak, speaking, stop]);

  const label = useMemo(() => {
    if (loading) return "Preparing the page summary";
    if (speaking) return "Stop the page summary";
    return "Listen to a summary of this page";
  }, [loading, speaking]);

  if (!supported) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => void start()}
        aria-label={label}
        title="Listen to this page"
        className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        ) : speaking ? (
          <Square className="h-5 w-5 fill-current" aria-hidden="true" />
        ) : (
          <Headphones className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          role="region"
          aria-label="Page summary"
          className="fixed bottom-44 right-5 z-50 w-[min(92vw,360px)] rounded-3xl border border-border bg-card p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-base font-bold tracking-tight">
              {speaking ? "Playing page summary" : "Page summary"}
            </p>
            <button
              type="button"
              onClick={() => {
                stop();
                setOpen(false);
              }}
              aria-label="Close the page summary"
              className="rounded-full p-1 text-muted-foreground transition hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <p aria-live="polite" className="mt-3 max-h-56 overflow-y-auto text-sm leading-relaxed text-muted-foreground">
            {loading ? "Preparing a summary of this page…" : script}
          </p>

          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <div className="space-y-1.5">
              <label
                htmlFor="narrator-voice"
                className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Voice
              </label>
              <select
                id="narrator-voice"
                value={voiceUri}
                onChange={(e) => changeVoice(e.target.value)}
                className="w-full rounded-full border border-border bg-background px-3 py-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Browser default</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="narrator-rate"
                className="flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                <span>Speaking rate</span>
                <span className="tabular-nums normal-case text-foreground">{rate.toFixed(1)}×</span>
              </label>
              <input
                id="narrator-rate"
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={rate}
                onChange={(e) => changeRate(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>


          {!loading && script !== "" && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => (speaking ? stop() : speak(script))}
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {speaking ? "Stop" : "Play again"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
