import { createFileRoute, Link } from "@tanstack/react-router";
import { Droplets, HardHat, Check, ArrowRight, Sparkles } from "lucide-react";
import { PRICING } from "@/lib/booking";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Water Tanker Pricing in Beawar | PAPPU BHAI TANKER WALE" },
      {
        name: "description",
        content:
          "Transparent water tanker prices in Beawar — drinking water from ₹59 and construction water from ₹149. Sizes from 1000L to 10000L.",
      },
      { property: "og:title", content: "Water Tanker Pricing | PAPPU BHAI TANKER WALE" },
      {
        property: "og:description",
        content: "Drinking & non-drinking water tanker pricing from ₹59. Sizes 1000L – 10000L.",
      },
    ],
  }),
  component: PricingPage,
});

const drinkingFeatures = [
  "Tested, potable water",
  "Sealed tankers",
  "Quality certificate on request",
  "Same-day delivery",
];

const constructionFeatures = [
  "For building sites & landscaping",
  "Bulk discounts on repeat orders",
  "Flexible scheduling",
  "Driver coordination over WhatsApp",
];

function PricingPage() {
  const sizes: (keyof (typeof PRICING)["drinking"])[] = [1000, 3000, 5000, 10000];

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero pt-32 pb-20 text-white">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-sky/30 blur-3xl" />
          <div className="absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Transparent pricing • No hidden fees
          </div>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Honest, upfront tanker pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Pay only for what you order. Pick a size, pick a water type, and book in seconds.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="-mt-12 pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* DRINKING */}
          <article className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-elegant">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky/15 blur-2xl" />
            <header className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Droplets className="h-3.5 w-3.5" /> Drinking water
                </span>
                <h2 className="mt-4 font-display text-2xl font-extrabold text-foreground">
                  Clean & tested water
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Safe for homes, offices and restaurants.
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-accent text-white">
                <Droplets className="h-6 w-6" />
              </div>
            </header>

            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-foreground/85">
              {drinkingFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Capacity</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">Price</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sizes.map((s) => (
                    <tr key={s} className="transition-colors hover:bg-secondary/50">
                      <td className="px-4 py-4 font-medium text-foreground">{s.toLocaleString()} L</td>
                      <td className="px-4 py-4 text-right font-display text-lg font-bold text-primary">
                        ₹{PRICING.drinking[s]}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          to="/book"
                          search={{ size: s, type: "drinking" } as never}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                        >
                          Book <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          {/* NON-DRINKING */}
          <article className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-card">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-2xl" />
            <header className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  <HardHat className="h-3.5 w-3.5" /> Construction / Non-drinking
                </span>
                <h2 className="mt-4 font-display text-2xl font-extrabold text-foreground">
                  Bulk water for any job
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  For builders, landscaping, cleaning and gardening.
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-amber-600 text-white">
                <HardHat className="h-6 w-6" />
              </div>
            </header>

            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-foreground/85">
              {constructionFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Capacity</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">Price</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sizes.map((s) => (
                    <tr key={s} className="transition-colors hover:bg-secondary/50">
                      <td className="px-4 py-4 font-medium text-foreground">{s.toLocaleString()} L</td>
                      <td className="px-4 py-4 text-right font-display text-lg font-bold text-accent">
                        ₹{PRICING["non-drinking"][s]}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          to="/book"
                          search={{ size: s, type: "non-drinking" } as never}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                        >
                          Book <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>

        <p className="mx-auto mt-8 max-w-2xl px-4 text-center text-xs text-muted-foreground">
          Prices shown are for delivery within standard Beawar city limits. Outstation
          delivery is charged based on distance — confirmed on call before dispatch.
        </p>
      </section>
    </div>
  );
}
