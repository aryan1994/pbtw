import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/pbtw-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { useI18n, LanguageToggle } from "@/lib/i18n";

const NAV = [
  { to: "/", key: "nav.home" },
  { to: "/book", key: "nav.book" },
  { to: "/pricing", key: "nav.pricing" },
  { to: "/become-driver", key: "nav.drive" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
] as const;


export function Header() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const checkAdmin = async (uid: string | undefined) => {
      if (!uid) return setIsAdmin(false);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    };
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      void checkAdmin(data.session?.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setAuthed(!!s);
      void checkAdmin(s?.user.id);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      sub.subscription.unsubscribe();
    };
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
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl transition-all overflow-hidden",
              scrolled ? "bg-white ring-1 ring-border" : "bg-white/95 backdrop-blur"
            )}
          >
            <img src={logoAsset.url} alt="PBTW Group logo" className="h-9 w-9 object-contain" />
          </span>
          <span className="flex flex-col leading-tight">
            <span
              className={cn(
                "font-display text-sm font-extrabold tracking-tight sm:text-base",
                scrolled ? "text-foreground" : "text-white"
              )}
            >
              PBTW Group
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.18em]",
                scrolled ? "text-muted-foreground" : "text-white/75"
              )}
            >
              Pappu Bhai Tanker Wale
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
                    ? "bg-secondary text-primary"
                    : "bg-white/15 text-white"
                ),
              }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {authed ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                    scrolled
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "bg-white/15 text-white hover:bg-white/25"
                  )}
                >
                  {t("nav.admin")}
                </Link>
              )}
              <Link
                to="/dashboard"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  scrolled ? "text-foreground hover:bg-secondary" : "text-white hover:bg-white/10"
                )}
              >
                <LayoutDashboard className="h-4 w-4" /> {t("nav.dashboard")}
              </Link>
            </>
          ) : (
            <Link
              to="/auth"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                scrolled ? "text-foreground hover:bg-secondary" : "text-white hover:bg-white/10"
              )}
            >
              {t("nav.login")}
            </Link>
          )}
          <LanguageToggle className={scrolled ? "text-foreground" : "text-white"} />
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:bg-navy-deep hover:scale-[1.03] hover:shadow-elegant"
          >
            {t("nav.bookNow")}
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
                {t(item.key)}
              </Link>
            ))}
            <div className="px-2 pt-2">
              <LanguageToggle className="text-foreground" />
            </div>
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-lg bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
            >
              {t("nav.bookNow")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
