import jsPDF from "jspdf";

export type InvoiceOrder = {
  order_code: string;
  customer_name: string;
  customer_phone: string;
  address_text: string;
  water_type: string;
  size_l: number;
  base_price: number;
  distance_km: number | null;
  delivery_charge: number;
  wallet_discount: number;
  gst: number;
  total: number;
  payment_method: string;
  delivery_date: string;
  delivery_slot: string;
  created_at: string;
};

export type InvoiceMeta = {
  invoice_no: string;
  issued_at?: string;
};

const BRAND = {
  name: "PBTW Group — Pappu Bhai Tanker Wale",
  address: "Beawar, Rajasthan, India",
  phone: "+91 92147 75938",
  email: "hello@pbtw.in",
  gstin: "GSTIN: N/A",
};

export function generateInvoicePdf(order: InvoiceOrder, meta: InvoiceMeta) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  let y = 48;

  // Header band
  doc.setFillColor(10, 61, 98);
  doc.rect(0, 0, w, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("TAX INVOICE", 40, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(BRAND.name, 40, 62);
  doc.setFontSize(9);
  doc.text(`${BRAND.address}  ·  ${BRAND.phone}`, 40, 78);

  doc.setTextColor(20, 20, 20);
  y = 120;

  // Invoice meta box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Invoice No: ${meta.invoice_no}`, 40, y);
  doc.text(`Order: ${order.order_code}`, w - 200, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Issued: ${new Date(meta.issued_at ?? Date.now()).toLocaleString()}`, 40, y);
  doc.text(`Delivery: ${order.delivery_date} (${order.delivery_slot})`, w - 200, y);
  y += 24;

  // Bill to
  doc.setDrawColor(220);
  doc.line(40, y, w - 40, y);
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.text("Bill To", 40, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.text(order.customer_name, 40, y);
  y += 14;
  doc.text(order.customer_phone, 40, y);
  y += 14;
  const addrLines = doc.splitTextToSize(order.address_text, w - 80);
  doc.text(addrLines, 40, y);
  y += addrLines.length * 14 + 10;

  // Items table
  doc.setFillColor(240, 245, 250);
  doc.rect(40, y, w - 80, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Description", 50, y + 15);
  doc.text("Qty", w - 220, y + 15);
  doc.text("Amount (INR)", w - 130, y + 15);
  y += 30;

  doc.setFont("helvetica", "normal");
  const rows: [string, string, string][] = [
    [
      `Water tanker (${order.water_type.replace("_", " ")})`,
      `${order.size_l} L`,
      inr(order.base_price),
    ],
    [
      `Delivery charge${order.distance_km ? ` · ${order.distance_km} km` : ""}`,
      "-",
      inr(order.delivery_charge),
    ],
  ];
  if (order.wallet_discount > 0) {
    rows.push(["Wallet discount (15%)", "-", `-${inr(order.wallet_discount)}`]);
  }
  if (order.gst > 0) {
    rows.push(["GST", "-", inr(order.gst)]);
  }
  rows.forEach((r) => {
    doc.text(r[0], 50, y);
    doc.text(r[1], w - 220, y);
    doc.text(r[2], w - 130, y);
    y += 18;
  });

  y += 6;
  doc.line(40, y, w - 40, y);
  y += 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Total", 50, y);
  doc.text(inr(order.total), w - 130, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Payment: ${order.payment_method.toUpperCase()}`, 50, y);
  y += 40;

  // Footer
  doc.setDrawColor(220);
  doc.line(40, y, w - 40, y);
  y += 16;
  doc.setFontSize(9);
  doc.setTextColor(90);
  doc.text(
    "Thank you for choosing PBTW Group. For queries, WhatsApp +91 92147 75938.",
    40,
    y,
  );
  doc.text(BRAND.gstin, 40, y + 14);

  doc.save(`${meta.invoice_no}.pdf`);
}

function inr(n: number | string) {
  const v = typeof n === "number" ? n : Number(n);
  return `Rs. ${v.toFixed(2)}`;
}
