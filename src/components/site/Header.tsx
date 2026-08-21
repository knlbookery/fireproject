import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { NAV } from "@/data/site";

const fireLogoFull = "/images/firelogo-full.png";
const fireLogoFullOnDark = "/images/firelogo-full-dark.png";

/**
 * Site header — logo left, floating white pill navigation centred, and a
 * solid "Donate Now" action right, matching the approved reference layout.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setOpenGroup(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (item: (typeof NAV)[number]) =>
    pathname === item.to || (item.children?.some((c) => c.to === pathname) ?? false);

  const onDark = !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b border-border bg-white/95 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 lg:px-10 lg:py-5">
        <Link to="/" className="flex shrink-0 items-center" aria-label="F.I.R.E. home">
          <img
            src={onDark ? fireLogoFullOnDark : fireLogoFull}
            alt="F.I.R.E. — Free Inspiration Reaching Everyone"
            width={219}
            height={42}
            className="h-9 w-auto object-contain sm:h-10"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 rounded-2xl bg-white px-3 py-2 shadow-[0_18px_40px_-24px_rgba(8,22,40,0.45)] lg:flex lg:items-center"
        >
          {NAV.map((item) => {
            const active = isActive(item);
            if (!item.children) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={pathname === item.to ? "page" : undefined}
                  className={`rounded-xl px-5 py-2 text-[0.95rem] transition-colors hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                    active ? "font-semibold text-ink" : "text-ink/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(item.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  type="button"
                  aria-expanded={openGroup === item.label}
                  onClick={() => setOpenGroup((g) => (g === item.label ? null : item.label))}
                  className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-[0.95rem] transition-colors hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                    active ? "font-semibold text-ink" : "text-ink/70"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                {openGroup === item.label && (
                  <div className="absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3">
                    <div className="overflow-hidden rounded-2xl border border-border bg-white p-1.5 shadow-[0_18px_40px_-24px_rgba(8,22,40,0.45)]">
                      {item.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          aria-current={pathname === c.to ? "page" : undefined}
                          className={`block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                            pathname === c.to ? "font-semibold text-ink" : "text-ink/75"
                          }`}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/donate"
            className="hidden rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:inline-flex"
          >
            Donate Now
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
            className={`relative z-[60] grid h-11 w-11 place-items-center rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink lg:hidden ${
              open
                ? "border-ink/15 bg-white text-ink"
                : onDark
                  ? "border-white/40 text-white"
                  : "border-ink/15 text-ink"
            }`}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-50 flex h-[100dvh] flex-col bg-white lg:hidden"
        >
          <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-6 pb-6 pt-24">
            <Link
              to="/"
              className="block border-b border-border py-4 font-display text-2xl font-semibold tracking-tight text-ink"
            >
              Home
            </Link>
            {NAV.flatMap((item) =>
              item.children
                ? item.children.map((c) => ({ label: c.label, to: c.to }))
                : [{ label: item.label, to: item.to }],
            ).map((i) => (
              <Link
                key={i.to}
                to={i.to}
                aria-current={pathname === i.to ? "page" : undefined}
                className={`block border-b border-border py-4 font-display text-2xl font-semibold tracking-tight transition-colors ${
                  pathname === i.to ? "text-accent" : "text-ink"
                }`}
              >
                {i.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 border-t border-border px-6 py-6">
            <Link
              to="/volunteer"
              className="rounded-xl border border-ink/20 px-6 py-3 text-center text-sm font-semibold text-ink"
            >
              Volunteer with us
            </Link>
            <Link
              to="/donate"
              className="rounded-xl bg-ink px-6 py-3 text-center text-sm font-semibold text-white"
            >
              Donate Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
