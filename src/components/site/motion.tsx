import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ */
/* Reduced-motion                                                      */
/* ------------------------------------------------------------------ */

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/* ------------------------------------------------------------------ */
/* useInView — one-shot IntersectionObserver                           */
/* ------------------------------------------------------------------ */

export function useInView<T extends HTMLElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const { threshold = 0.15, rootMargin = "0px 0px -10% 0px", once = true } = options ?? {};
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/* Reveal — scroll-triggered entrance                                  */
/* ------------------------------------------------------------------ */

export type RevealVariant = "up" | "down" | "left" | "right" | "fade" | "scale" | "blur";

const HIDDEN: Record<RevealVariant, string> = {
  up: "translate3d(0, 34px, 0)",
  down: "translate3d(0, -34px, 0)",
  left: "translate3d(38px, 0, 0)",
  right: "translate3d(-38px, 0, 0)",
  fade: "none",
  scale: "scale(0.94)",
  blur: "translate3d(0, 20px, 0)",
};

export function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  duration = 800,
  className = "",
  threshold,
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: RevealVariant;
  /** milliseconds */
  delay?: number;
  /** milliseconds */
  duration?: number;
  className?: string;
  threshold?: number;
  style?: CSSProperties;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold });
  const show = inView || reduced;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "none" : HIDDEN[variant],
        filter: variant === "blur" && !show ? "blur(10px)" : "none",
        transition: reduced
          ? undefined
          : `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms ease ${delay}ms`,
        willChange: show ? undefined : "opacity, transform",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger — reveals direct children in sequence                       */
/* ------------------------------------------------------------------ */

export function Stagger({
  children,
  className = "",
  step = 90,
  variant = "up",
  duration = 800,
  initialDelay = 0,
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
  variant?: RevealVariant;
  duration?: number;
  initialDelay?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Reveal
          key={i}
          variant={variant}
          duration={duration}
          delay={initialDelay + i * step}
          className="contents-reveal"
        >
          {child}
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* useParallax — translateY driven by viewport progress                */
/* ------------------------------------------------------------------ */

export function useParallax<T extends HTMLElement>(strength = 60) {
  const ref = useRef<T | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      // -1 (below viewport) .. 1 (above viewport)
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      el.style.transform = `translate3d(0, ${(progress * strength).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [strength, reduced]);

  return ref;
}

/** Wraps content in a parallax-translated layer. */
export function Parallax({
  children,
  strength = 60,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useParallax<HTMLDivElement>(strength);
  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ScrollProgress — thin reading-progress bar                          */
/* ------------------------------------------------------------------ */

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 bg-transparent"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-primary to-accent"
        style={{ transform: `scaleX(${progress})`, transition: "transform 120ms linear" }}
      />
    </div>
  );
}
