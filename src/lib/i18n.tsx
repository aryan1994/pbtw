import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

type Dict = Record<string, string>;

const en: Dict = {
  // Nav
  "nav.home": "Home",
  "nav.book": "Book Tanker",
  "nav.pricing": "Pricing",
  "nav.drive": "Drive with us",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.dashboard": "Dashboard",
  "nav.login": "Login",
  "nav.bookNow": "Book Now",
  "nav.admin": "Admin",
  // Common
  "common.loading": "Loading…",
  "common.retry": "Try again",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.submit": "Submit",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.download": "Download",
  "common.approve": "Approve",
  "common.reject": "Reject",
  "common.status": "Status",
  "common.total": "Total",
  "common.language": "Language",
  // Auth
  "auth.signIn": "Sign in",
  "auth.signUp": "Create account",
  "auth.welcomeBack": "Welcome back",
  "auth.createAccount": "Create your account",
  "auth.continueGoogle": "Continue with Google",
  "auth.orEmail": "or with email",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.fullName": "Full name",
  "auth.mobile": "Mobile number",
  "auth.new": "New to PBTW?",
  "auth.have": "Already have an account?",
  // Dashboard
  "dash.orders": "Orders",
  "dash.track": "Track",
  "dash.invoices": "Invoices",
  "dash.offers": "Offers",
  "dash.wallet": "Wallet",
  "dash.recharge": "Recharge",
  "dash.noOrders": "No orders yet",
  "dash.noInvoices": "No invoices yet",
  "dash.downloadInvoice": "Download invoice",
  // Booking
  "book.title": "Book a tanker",
  "book.waterType": "Water type",
  "book.size": "Tank size",
  "book.address": "Delivery address",
  "book.distance": "Distance",
  "book.deliveryCharge": "Delivery charge",
  "book.walletDiscount": "Wallet discount",
  "book.confirm": "Confirm booking",
  // Admin
  "admin.title": "Admin Console",
  "admin.orders": "Orders",
  "admin.drivers": "Driver Applications",
  "admin.recharges": "Wallet Recharges",
  "admin.coupons": "Coupons",
  // Driver
  "driver.title": "Driver Dashboard",
  "driver.becomeTitle": "Become a Driver Partner",
  "driver.income": "Income",
  "driver.chat": "Chat",
};

const hi: Dict = {
  "nav.home": "होम",
  "nav.book": "टैंकर बुक करें",
  "nav.pricing": "मूल्य",
  "nav.drive": "हमारे साथ चलें",
  "nav.about": "हमारे बारे में",
  "nav.contact": "संपर्क",
  "nav.dashboard": "डैशबोर्ड",
  "nav.login": "लॉगिन",
  "nav.bookNow": "अभी बुक करें",
  "nav.admin": "एडमिन",

  "common.loading": "लोड हो रहा है…",
  "common.retry": "पुनः प्रयास",
  "common.save": "सेव करें",
  "common.cancel": "रद्द करें",
  "common.submit": "जमा करें",
  "common.delete": "मिटाएँ",
  "common.edit": "संपादित करें",
  "common.download": "डाउनलोड",
  "common.approve": "स्वीकृत",
  "common.reject": "अस्वीकृत",
  "common.status": "स्थिति",
  "common.total": "कुल",
  "common.language": "भाषा",

  "auth.signIn": "साइन इन",
  "auth.signUp": "खाता बनाएँ",
  "auth.welcomeBack": "स्वागत है",
  "auth.createAccount": "अपना खाता बनाएँ",
  "auth.continueGoogle": "Google से जारी रखें",
  "auth.orEmail": "या ईमेल से",
  "auth.email": "ईमेल",
  "auth.password": "पासवर्ड",
  "auth.fullName": "पूरा नाम",
  "auth.mobile": "मोबाइल नंबर",
  "auth.new": "PBTW पर नए हैं?",
  "auth.have": "पहले से खाता है?",

  "dash.orders": "ऑर्डर",
  "dash.track": "ट्रैक करें",
  "dash.invoices": "इनवॉइस",
  "dash.offers": "ऑफ़र",
  "dash.wallet": "वॉलेट",
  "dash.recharge": "रिचार्ज",
  "dash.noOrders": "कोई ऑर्डर नहीं",
  "dash.noInvoices": "कोई इनवॉइस नहीं",
  "dash.downloadInvoice": "इनवॉइस डाउनलोड करें",

  "book.title": "टैंकर बुक करें",
  "book.waterType": "पानी का प्रकार",
  "book.size": "टैंक साइज़",
  "book.address": "डिलीवरी पता",
  "book.distance": "दूरी",
  "book.deliveryCharge": "डिलीवरी शुल्क",
  "book.walletDiscount": "वॉलेट छूट",
  "book.confirm": "बुकिंग की पुष्टि करें",

  "admin.title": "एडमिन कंसोल",
  "admin.orders": "ऑर्डर",
  "admin.drivers": "ड्राइवर आवेदन",
  "admin.recharges": "वॉलेट रिचार्ज",
  "admin.coupons": "कूपन",

  "driver.title": "ड्राइवर डैशबोर्ड",
  "driver.becomeTitle": "ड्राइवर पार्टनर बनें",
  "driver.income": "आय",
  "driver.chat": "चैट",
};

const dicts: Record<Lang, Dict> = { en, hi };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const I18nCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

const KEY = "pbtw_lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Lang | null;
      if (saved === "en" || saved === "hi") {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
      document.documentElement.lang = l;
    } catch {
      /* ignore */
    }
  };

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key: string) => dicts[lang][key] ?? dicts.en[key] ?? key,
    }),
    [lang],
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className={`inline-flex items-center gap-1 rounded-full border border-current/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-current/10 ${className}`}
      title={lang === "en" ? "हिंदी में बदलें" : "Switch to English"}
      aria-label="Toggle language"
    >
      <span className={lang === "en" ? "opacity-100" : "opacity-40"}>EN</span>
      <span className="opacity-40">/</span>
      <span className={lang === "hi" ? "opacity-100" : "opacity-40"}>हिं</span>
    </button>
  );
}
