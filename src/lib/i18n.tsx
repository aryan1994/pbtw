import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

const DICT = {
  en: {
    "nav.home": "Home",
    "nav.book": "Book Tanker",
    "nav.pricing": "Pricing",
    "nav.drive": "Drive with us",
    "nav.about": "About",
    "nav.contact": "Contact",
    "cta.book": "Book Now",
    "cta.login": "Login",
    "cta.dashboard": "Dashboard",
    "lang.toggle": "हिं",
  },
  hi: {
    "nav.home": "होम",
    "nav.book": "टैंकर बुक करें",
    "nav.pricing": "मूल्य",
    "nav.drive": "ड्राइवर बनें",
    "nav.about": "हमारे बारे में",
    "nav.contact": "संपर्क",
    "cta.book": "अभी बुक करें",
    "cta.login": "लॉगिन",
    "cta.dashboard": "डैशबोर्ड",
    "lang.toggle": "EN",
  },
} as const;

type Key = keyof typeof DICT["en"];

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string };

const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pbtw_lang") as Lang | null;
      if (saved === "hi" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("pbtw_lang", l); } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  const t = (k: Key) => DICT[lang][k] ?? DICT.en[k] ?? k;
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useT = () => useContext(LangCtx);
