// Order ID + WhatsApp helpers
export const COMPANY = {
  name: "PAPPU BHAI TANKER WALE",
  short: "PBTW",
  phone: "9214775938",
  whatsapp: "919214775938",
  email: "hydroxflow@gmail.com",
  instagram: "@hydroxflow",
  address: "Gaddi Thoriyan Housing Board, Beawar, Rajasthan - 305901",
  origin: "Prabhu Ki Bagiya, Beawar, Rajasthan",
};

export type WaterType = "drinking" | "non-drinking";
export type TankerSize = 1000 | 3000 | 5000 | 10000;

export const PRICING: Record<WaterType, Record<TankerSize, number>> = {
  drinking: { 1000: 59, 3000: 129, 5000: 200, 10000: 349 },
  "non-drinking": { 1000: 149, 3000: 249, 5000: 399, 10000: 649 },
};

export function generateOrderId(): string {
  // e.g. #2061GWHQK071
  const digits = () => Math.floor(1000 + Math.random() * 9000).toString();
  const letters = () => {
    const a = "ABCDEFGHJKMNPQRSTUVWXYZ";
    let s = "";
    for (let i = 0; i < 5; i++) s += a[Math.floor(Math.random() * a.length)];
    return s;
  };
  return `#${digits()}${letters()}${Math.floor(100 + Math.random() * 900)}`;
}

export interface BookingPayload {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  size: TankerSize;
  waterType: WaterType;
  date: string;
  slot: string;
  payment: "cod" | "online";
  amount: number;
  location?: { lat: number; lng: number };
}

export function buildWhatsAppLink(b: BookingPayload): string {
  const mapsLink = b.location
    ? `https://www.google.com/maps?q=${b.location.lat},${b.location.lng}`
    : "";
  const lines = [
    `I Need Your Service`,
    ``,
    `*Order ID:* ${b.orderId}`,
    `*Name:* ${b.name}`,
    `*Phone:* ${b.phone}`,
    `*Address:* ${b.address}${b.landmark ? ` (${b.landmark})` : ""}`,
    mapsLink ? `*Location:* ${mapsLink}` : ``,
    ``,
    `*Tanker:* ${b.size.toLocaleString()} L (${b.waterType === "drinking" ? "Drinking" : "Non-Drinking / Construction"})`,
    `*Delivery:* ${b.date} • ${b.slot}`,
    `*Payment:* ${b.payment === "cod" ? "Cash on Delivery" : "Online"}`,
    `*Amount:* ₹${b.amount}`,
    ``,
    `— Booked via pappubhaitankerwale.com`,
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${COMPANY.whatsapp}?text=${text}`;
}
