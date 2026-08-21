import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import type { HeroSlide } from "@/lib/content.functions";
import { BTN, Eyebrow } from "./ui";

/**
 * Homepage hero: full-bleed editorial cross-fade slider.
 *
 * Slides come from Airtable through the landing content query, so the array
 * length can change after mount — every read clamps through `safeIdx`.
 */
export function HomeHero({ slides: SLIDES }: { slides: HeroSlide[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLElement>(null);

  const safeIdx = idx < SLIDES.length ? idx : 0;

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (paused || prefersReducedMotion || SLIDES.length === 0) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, [paused, SLIDES.length]);

  const go = (n: number) => setIdx((n + SLIDES.length) % SLIDES.length);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(safeIdx - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(safeIdx + 1);
    }
  };

  if (SLIDES.length === 0) return null;

  const slide = SLIDES[safeIdx];

  return (
    <section
      id="top"
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="F.I.R.E. mission highlights"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}

      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative min-h-[680px] w-full overflow-hidden bg-ink focus:outline-none lg:h-[100svh]"
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Slide {safeIdx + 1} of {SLIDES.length}: {slide.title}
      </div>

      {SLIDES.map((s, i) => (
        <div
          key={s.title}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${SLIDES.length}: ${s.eyebrow}`}
          aria-hidden={i !== safeIdx}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            i === safeIdx ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            key={`${s.title}-${i === safeIdx ? "on" : "off"}`}
            src={s.image}
            alt={s.alt}
            className={`absolute inset-0 h-full w-full object-cover ${
              i === safeIdx ? "animate-ken-burns" : "scale-[1.04]"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
          <div aria-hidden="true" className="navy-veil-overlay absolute inset-0" />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0b1a2e] via-[#0b1a2e]/70 to-transparent"
          />

        </div>
      ))}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-gradient-to-t from-background to-transparent"
      />


      <div className="relative z-10 mx-auto flex h-full min-h-[680px] max-w-[1600px] flex-col justify-end px-6 pb-12 pt-40 text-white lg:min-h-0 lg:px-10 lg:pb-14 lg:pt-48 xl:pt-56">
        <div className="max-w-3xl xl:max-w-4xl" key={safeIdx}>
          <span className="animate-hero-text" style={{ animationDelay: "60ms" }}>
            <Eyebrow onDark>{slide.eyebrow}</Eyebrow>
          </span>
          {safeIdx === 0 ? (
            <h1
              className="animate-hero-text mt-7 whitespace-pre-line font-display text-[clamp(2.25rem,7vw,4.5rem)] font-semibold leading-[1.02] tracking-tight xl:text-[clamp(3.5rem,4.4vw,5rem)]"
              style={{ animationDelay: "160ms" }}
            >
              {slide.title}
            </h1>
          ) : (
            <p
              className="animate-hero-text mt-7 whitespace-pre-line font-display text-[clamp(2.25rem,7vw,4.5rem)] font-semibold leading-[1.02] tracking-tight xl:text-[clamp(3.5rem,4.4vw,5rem)]"
              style={{ animationDelay: "160ms" }}
            >
              {slide.title}
            </p>
          )}
          <p
            className="animate-hero-text mt-6 max-w-lg whitespace-pre-line text-base leading-relaxed text-white/75"
            style={{ animationDelay: "280ms" }}
          >
            {slide.subtitle}
          </p>
          <div
            className="animate-hero-text mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "400ms" }}
          >
            {slide.cta.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className={`group ${c.primary ? BTN.onDarkSolid : BTN.onDarkOutline}`}
              >
                {c.label}
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-end justify-between gap-6 border-t border-white/15 pt-6">
          <div className="flex items-center gap-3" role="tablist" aria-label="Select slide">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === safeIdx}
                aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
                onClick={() => go(i)}
                className="group flex flex-col gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/50 transition group-hover:text-white/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`relative h-px overflow-hidden transition-all duration-500 ${
                    i === safeIdx ? "w-14 bg-white/30" : "w-7 bg-white/25 group-hover:bg-white/60"
                  }`}
                >
                  {i === safeIdx && (
                    <span
                      key={`${safeIdx}-${paused}`}
                      aria-hidden="true"
                      className="absolute inset-0 origin-left bg-white"
                      style={{
                        animation: paused ? undefined : "slide-progress 6500ms linear forwards",
                        transform: paused ? "scaleX(1)" : undefined,
                      }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(safeIdx - 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(safeIdx + 1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
