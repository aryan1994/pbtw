import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Droplets,
  HardHat,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Home,
  CheckCircle2,
  MessageCircle,
  Loader2,
  ArrowRight,
  IndianRupee,
  Banknote,
  QrCode,
} from "lucide-react";
import {
  PRICING,
  type TankerSize,
  type WaterType,
  generateOrderId,
  buildWhatsAppLink,
  COMPANY,
} from "@/lib/booking";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Water Tanker Online in Beawar | PAPPU BHAI TANKER WALE" },
      {
        name: "description",
        content:
          "Book your water tanker delivery in under 60 seconds. Pick size, water type, slot — we'll dispatch the nearest tanker right after you confirm on WhatsApp.",
      },
      { property: "og:title", content: "Book a Water Tanker — PAPPU BHAI TANKER WALE" },
      {
        property: "og:description",
        content: "Quick online tanker booking with WhatsApp confirmation.",
      },
    ],
  }),
  component: BookPage,
});

const SIZES: { size: TankerSize; label: string; use: string }[] = [
  { size: 1000, label: "1000 L", use: "Small home / office" },
  { size: 3000, label: "3000 L", use: "Mid-size family" },
  { size: 5000, label: "5000 L", use: "Apartment / shop" },
  { size: 10000, label: "10000 L", use: "Construction site" },
];

const SLOTS = [
  "ASAP (within 90 min)",
  "Morning · 7 – 10 AM",
  "Late morning · 10 AM – 1 PM",
  "Afternoon · 1 – 4 PM",
  "Evening · 4 – 7 PM",
  "Night · 7 – 10 PM",
];

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
function maxDateISO() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function BookPage() {
  const [waterType, setWaterType] = useState<WaterType>("drinking");
  const [size, setSize] = useState<TankerSize>(1000);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState(SLOTS[0]);
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    orderId: string;
    waUrl: string;
    amount: number;
  } | null>(null);

  const amount = useMemo(() => PRICING[waterType][size], [waterType, size]);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location not supported on this device");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast.success("Location captured");
      },
      (err) => {
        setLocating(false);
        toast.error(err.message || "Could not get location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name");
    if (!/^[6-9]\d{9}$/.test(phone)) return toast.error("Please enter a valid 10-digit mobile number");
    if (!address.trim() || address.trim().length < 8)
      return toast.error("Please enter a complete address");

    const orderId = generateOrderId();
    const waUrl = buildWhatsAppLink({
      orderId,
      name: name.trim(),
      phone,
      address: address.trim(),
      landmark: landmark.trim() || undefined,
      size,
      waterType,
      date,
      slot,
      payment,
      amount,
      location: location ?? undefined,
    });

    setConfirmation({ orderId, waUrl, amount });
    // Open WhatsApp in a new tab so the order is sent automatically
    window.open(waUrl, "_blank", "noopener,noreferrer");
    toast.success("Order confirmed! Opening WhatsApp…");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setConfirmation(null);
    setName("");
    setPhone("");
    setAddress("");
    setLandmark("");
    setLocation(null);
  };

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero pt-32 pb-16 text-white">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-sky/30 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur">
            <Droplets className="h-3.5 w-3.5" /> Online booking · Confirmation on WhatsApp
          </div>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Book your tanker
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Takes less than a minute. We'll dispatch the nearest tanker right after you confirm.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
          {confirmation ? (
            <Confirmation reset={resetForm} confirmation={confirmation} />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid gap-6 rounded-[2rem] border border-border bg-card p-6 shadow-elegant sm:p-8 lg:grid-cols-3"
            >
              <div className="space-y-8 lg:col-span-2">
                {/* Water type */}
                <Section title="1. Choose water type" icon={<Droplets className="h-4 w-4" />}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TypeCard
                      active={waterType === "drinking"}
                      onClick={() => setWaterType("drinking")}
                      icon={<Droplets className="h-5 w-5" />}
                      title="Drinking water"
                      subtitle="Tested, potable supply"
                      hint="From ₹59"
                      accent="primary"
                    />
                    <TypeCard
                      active={waterType === "non-drinking"}
                      onClick={() => setWaterType("non-drinking")}
                      icon={<HardHat className="h-5 w-5" />}
                      title="Construction water"
                      subtitle="Non-drinking, bulk supply"
                      hint="From ₹149"
                      accent="accent"
                    />
                  </div>
                </Section>

                {/* Size */}
                <Section title="2. Pick tanker size" icon={<Droplets className="h-4 w-4" />}>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {SIZES.map((s) => {
                      const price = PRICING[waterType][s.size];
                      const active = size === s.size;
                      return (
                        <button
                          key={s.size}
                          type="button"
                          onClick={() => setSize(s.size)}
                          className={cn(
                            "group relative overflow-hidden rounded-2xl border p-4 text-left transition-all",
                            active
                              ? "border-primary bg-primary/5 shadow-glow"
                              : "border-border bg-card hover:border-primary/40 hover:bg-secondary/50"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                              active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                            )}
                          >
                            <Droplets className="h-4 w-4" />
                          </div>
                          <p className="mt-3 font-display text-lg font-bold text-foreground">{s.label}</p>
                          <p className="text-xs text-muted-foreground">{s.use}</p>
                          <p className="mt-3 font-display text-base font-bold text-primary">₹{price}</p>
                          {active && (
                            <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-primary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Section>

                {/* Contact details */}
                <Section title="3. Your details" icon={<User className="h-4 w-4" />}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" icon={<User className="h-4 w-4" />}>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        required
                        maxLength={80}
                        placeholder="e.g. Rahul Sharma"
                        className="input-base"
                      />
                    </Field>
                    <Field label="Mobile number" icon={<Phone className="h-4 w-4" />}>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        type="tel"
                        required
                        inputMode="numeric"
                        placeholder="10-digit mobile"
                        className="input-base"
                      />
                    </Field>
                    <Field
                      label="Delivery address"
                      icon={<Home className="h-4 w-4" />}
                      className="sm:col-span-2"
                    >
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        rows={3}
                        maxLength={300}
                        placeholder="House / flat no., street, area, city"
                        className="input-base resize-none"
                      />
                    </Field>
                    <Field label="Landmark (optional)" icon={<MapPin className="h-4 w-4" />}>
                      <input
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        type="text"
                        maxLength={120}
                        placeholder="e.g. Near SBI ATM"
                        className="input-base"
                      />
                    </Field>
                    <div className="flex flex-col">
                      <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <MapPin className="h-4 w-4" /> GPS location
                      </label>
                      <button
                        type="button"
                        onClick={captureLocation}
                        disabled={locating}
                        className={cn(
                          "flex h-[46px] items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors",
                          location
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                            : "border-border bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
                        )}
                      >
                        {locating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Locating…
                          </>
                        ) : location ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" /> Location pinned
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4" /> Use current location
                          </>
                        )}
                      </button>
                      {location && (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                        </p>
                      )}
                    </div>
                  </div>
                </Section>

                {/* Schedule */}
                <Section title="4. Delivery schedule" icon={<Calendar className="h-4 w-4" />}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Delivery date" icon={<Calendar className="h-4 w-4" />}>
                      <input
                        type="date"
                        value={date}
                        min={todayISO()}
                        max={maxDateISO()}
                        onChange={(e) => setDate(e.target.value)}
                        className="input-base"
                      />
                    </Field>
                    <Field label="Delivery slot" icon={<Clock className="h-4 w-4" />}>
                      <select
                        value={slot}
                        onChange={(e) => setSlot(e.target.value)}
                        className="input-base"
                      >
                        {SLOTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </Section>

                {/* Payment */}
                <Section title="5. Payment method" icon={<IndianRupee className="h-4 w-4" />}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TypeCard
                      active={payment === "cod"}
                      onClick={() => setPayment("cod")}
                      icon={<Banknote className="h-5 w-5" />}
                      title="Cash on Delivery"
                      subtitle="Pay the driver on arrival"
                      hint="Most popular"
                      accent="primary"
                    />
                    <TypeCard
                      active={payment === "online"}
                      onClick={() => setPayment("online")}
                      icon={<QrCode className="h-5 w-5" />}
                      title="Online / UPI"
                      subtitle="Pay via UPI on WhatsApp"
                      hint="QR shared on chat"
                      accent="accent"
                    />
                  </div>
                </Section>
              </div>

              {/* Summary */}
              <aside className="lg:col-span-1">
                <div className="space-y-5 rounded-2xl border border-border bg-secondary/40 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Order summary
                  </p>
                  <SummaryRow label="Water type" value={waterType === "drinking" ? "Drinking" : "Construction"} />
                  <SummaryRow label="Tanker size" value={`${size.toLocaleString()} L`} />
                  <SummaryRow label="Delivery" value={`${date} · ${slot.split(" · ")[0]}`} />
                  <SummaryRow label="Payment" value={payment === "cod" ? "Cash on Delivery" : "Online / UPI"} />
                  <div className="border-t border-border pt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="font-display text-3xl font-extrabold text-primary">
                        ₹{amount}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Inclusive of all city-limit delivery charges.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-accent-foreground shadow-card transition-transform hover:scale-[1.02]"
                  >
                    Confirm & send on WhatsApp
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    By confirming, you agree to receive a WhatsApp message from us at the
                    number provided.
                  </p>
                </div>
              </aside>
            </form>
          )}
        </div>
      </section>

      <style>{`
        .input-base {
          width: 100%;
          height: 46px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          background-color: var(--color-card);
          color: var(--color-foreground);
          font-size: 0.95rem;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        textarea.input-base {
          height: auto;
          padding: 12px 14px;
          line-height: 1.5;
        }
        .input-base:focus {
          outline: none;
          border-color: var(--color-ring);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-ring) 18%, transparent);
        }
      `}</style>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col", className)}>
      <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

function TypeCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
  hint,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  hint: string;
  accent: "primary" | "accent";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 text-left transition-all",
        active
          ? accent === "primary"
            ? "border-primary bg-primary/5 shadow-glow"
            : "border-accent bg-accent/5 shadow-card"
          : "border-border bg-card hover:border-primary/40 hover:bg-secondary/50"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl text-white",
            accent === "primary" ? "bg-primary" : "bg-accent"
          )}
        >
          {icon}
        </span>
        <div>
          <p className="font-display text-base font-bold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {hint}
      </p>
      {active && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-primary" />}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function Confirmation({
  confirmation,
  reset,
}: {
  confirmation: { orderId: string; waUrl: string; amount: number };
  reset: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-elegant sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-foreground">
        Order confirmed!
      </h2>
      <p className="mt-2 text-muted-foreground">
        Your tanker booking is on its way to our team.
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-dashed border-border bg-secondary/40 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Order ID</p>
        <p className="mt-1 font-display text-2xl font-extrabold text-primary">
          {confirmation.orderId}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Total amount · <span className="font-semibold text-foreground">₹{confirmation.amount}</span>
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
        We've also opened WhatsApp so you can send the order to{" "}
        <span className="font-semibold text-foreground">{COMPANY.phone}</span> — please tap{" "}
        <em>Send</em> to complete your booking.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href={confirmation.waUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-card transition-transform hover:scale-[1.03]"
        >
          <MessageCircle className="h-4 w-4" /> Reopen WhatsApp
        </a>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Book another tanker
        </button>
      </div>
    </div>
  );
}
