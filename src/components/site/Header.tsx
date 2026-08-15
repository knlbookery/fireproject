import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Heart } from "lucide-react";

import { NAV } from "@/data/site";
import { BTN } from "./ui";

const fireLogoFull = "/images/firelogo-full.png";
const fireLogoIcon = "/images/firelogo2.png";

export function Header() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  const isActive = (item: (typeof NAV)[number]) =>
    pathname === item.to || (item.children?.some((c) => c.to === pathname) ?? false);

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-black/10 bg-white px-4 py-2.5 shadow-md sm:px-5">
        <Link to="/" className="flex items-center gap-3" aria-label="F.I.R.E. home">
          <img
            src={fireLogoFull}
            alt="F.I.R.E. — Free Inspiration Reaching Everyone"
            width={219}
            height={42}
            className="hidden h-[42px] w-auto object-contain lg:block"
          />
          <img
            src={fireLogoIcon}
            alt=""
            aria-hidden="true"
            width={39}
            height={35}
            className="h-[35px] w-auto object-contain lg:hidden"
          />
          <span className="font-display text-base font-extrabold leading-tight tracking-tight text-primary lg:hidden">
            F.I.R.E.
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm lg:flex">
          {NAV.map((item) => {
            const active = isActive(item);
            if (!item.children) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative rounded-sm py-1 transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    active ? "font-medium text-primary" : "text-foreground/75"
                  }`}
                >
                  {item.label}
                  <span
                    className={`pointer-events-none absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-primary transition-all duration-300 ${
                      active ? "w-full opacity-100" : "w-0 opacity-0"
                    }`}
                  />
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
                  className={`flex items-center gap-1 rounded-sm py-1 transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    active ? "font-medium text-primary" : "text-foreground/75"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                {openGroup === item.label && (
                  <div className="absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3">
                    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                      {item.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          className={`block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-primary/5 hover:text-primary ${
                            pathname === c.to ? "text-primary" : "text-foreground/80"
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

        <div className="flex items-center gap-2">
          <Link to="/volunteer" className={`hidden xl:inline-flex ${BTN.secondary}`}>
            Volunteer
          </Link>
          <Link to="/donate" className={`hidden lg:inline-flex ${BTN.primary}`}>
            <Heart className="h-4 w-4" aria-hidden="true" />
            Donate
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
            className="relative z-50 grid h-10 w-10 place-items-center rounded-full bg-white text-foreground shadow-md lg:hidden"
          >
            <span className="text-2xl font-bold leading-none">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="mx-auto mt-2 flex max-h-[75vh] max-w-[1400px] flex-col gap-1 overflow-y-auto rounded-2xl border border-black/10 bg-white/95 p-4 shadow-xl backdrop-blur-md lg:hidden"
        >
          <Link to="/" className="rounded-lg px-3 py-2.5 text-base text-foreground/80">
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
              className={`rounded-lg px-3 py-2.5 text-base transition-colors ${
                pathname === i.to
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground/80 hover:bg-black/5"
              }`}
            >
              {i.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-black/5 pt-3">
            <Link to="/volunteer" className={`w-full ${BTN.secondary}`}>
              Volunteer with us
            </Link>
            <Link to="/donate" className={`w-full ${BTN.primary}`}>
              <Heart className="h-4 w-4" aria-hidden="true" />
              Donate
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
