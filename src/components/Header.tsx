import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/book", label: "Book Tanker" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-card border-b border-border"
          : "bg-gradient-to-b from-navy-deep/70 to-transparent backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
              scrolled ? "bg-primary text-primary-foreground" : "bg-white/15 text-white backdrop-blur"
            )}
          >
            <Droplets className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span
              className={cn(
                "font-display text-sm font-extrabold tracking-tight sm:text-base",
                scrolled ? "text-foreground" : "text-white"
              )}
            >
              PAPPU BHAI
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.2em]",
                scrolled ? "text-muted-foreground" : "text-white/75"
              )}
            >
              Tanker Wale
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                scrolled
                  ? "text-foreground/80 hover:bg-secondary hover:text-foreground"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              )}
              activeProps={{
                className: cn(
                  "rounded-full px-4 py-2 text-sm font-semibold",
                  scrolled
                    ? "bg-secondary text-foreground"
                    : "bg-white/15 text-white"
                ),
              }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-card transition-transform hover:scale-[1.03] hover:shadow-elegant"
          >
            Book Now
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className={cn(
            "rounded-lg p-2 md:hidden",
            scrolled ? "text-foreground hover:bg-secondary" : "text-white hover:bg-white/10"
          )}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="space-y-1 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-secondary"
                activeProps={{ className: "block rounded-lg px-4 py-3 text-base font-semibold bg-secondary text-primary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-lg bg-accent px-4 py-3 text-center text-base font-semibold text-accent-foreground"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
