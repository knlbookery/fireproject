import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import type { HeroSlide } from "@/lib/content.functions";
import { BTN, Eyebrow, SHELL } from "./ui";

/**
 * Homepage hero — light editorial card layout.
 *
 * Headline sits on the light page, the photography lives inside a large
 * rounded card underneath. Slides come from Airtable through the landing
 * content query, so the array length can change after mount — every read
 * clamps through `safeIdx`.
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
      className="relative w-full overflow-hidden bg-sky px-4 pb-10 pt-28 focus:outline-none sm:px-6 lg:px-8 lg:pb-16 lg:pt-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
      />

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Slide {safeIdx + 1} of {SLIDES.length}: {slide.title}
      </div>

      <div className={`${SHELL} relative`}>
        {/* Headline row */}
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <div key={safeIdx}>
            <span className="animate-hero-text" style={{ animationDelay: "60ms" }}>
              <Eyebrow>{slide.eyebrow}</Eyebrow>
            </span>
            <h1
              className="animate-hero-text mt-6 whitespace-pre-line font-display text-[2.35rem] font-light leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-[4.25rem]"
              style={{ animationDelay: "160ms" }}
            >
              {slide.title}
            </h1>
          </div>
          <div
            className="animate-hero-text lg:pb-3"
            style={{ animationDelay: "280ms" }}
            key={`sub-${safeIdx}`}
          >
            <p className="measure whitespace-pre-line text-base leading-relaxed text-muted-foreground">
              {slide.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {slide.cta.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className={`group ${c.primary ? BTN.accent : BTN.secondary}`}
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
        </div>

        {/* Photography card */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="relative mt-10 overflow-hidden rounded-[28px] bg-ink/5 shadow-soft lg:mt-14 lg:rounded-[36px]"
        >
          <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2.2/1]">
            {SLIDES.map((s, i) => (
              <div
                key={s.title}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${SLIDES.length}: ${s.eyebrow}`}
                aria-hidden={i !== safeIdx}
                className={`absolute inset-0 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
              </div>
            ))}

            {/* Caption chip */}
            <div className="absolute left-4 top-4 flex items-center gap-3 rounded-full bg-background/90 px-4 py-2 text-xs backdrop-blur-md sm:left-6 sm:top-6">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              <span className="font-medium text-ink">{slide.eyebrow}</span>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-6">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => go(safeIdx - 1)}
                className="grid h-10 w-10 place-items-center rounded-full bg-background/90 text-ink backdrop-blur-md transition hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => go(safeIdx + 1)}
                className="grid h-10 w-10 place-items-center rounded-full bg-background/90 text-ink backdrop-blur-md transition hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide index */}
        <div className="mt-6 flex items-center gap-3" role="tablist" aria-label="Select slide">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === safeIdx}
              aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
              onClick={() => go(i)}
              className="group flex flex-col gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink/45 transition group-hover:text-ink/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`relative h-px overflow-hidden transition-all duration-500 ${
                  i === safeIdx ? "w-14 bg-ink/20" : "w-7 bg-ink/15 group-hover:bg-ink/40"
                }`}
              >
                {i === safeIdx && (
                  <span
                    key={`${safeIdx}-${paused}`}
                    aria-hidden="true"
                    className="absolute inset-0 origin-left bg-primary"
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
      </div>
    </section>
  );
}
