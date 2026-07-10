import { jsPDF } from "jspdf";

export type InvoiceOrder = {
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  address_text: string;
  water_type: string;
  size_l: number;
  total: number;
  delivery_date?: string | null;
  delivery_slot?: string | null;
  created_at?: string | null;
  status?: string | null;
};

export function generateInvoicePdf(o: InvoiceOrder): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  let y = 48;

  // Header
  doc.setFillColor(0, 0, 122);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("PBTW GROUP", 40, 42);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Pappu Bhai Tanker Wale • Beawar, Rajasthan", 40, 62);
  doc.text("+91 92147 75938  •  pbtw.lovable.app", 40, 78);

  doc.setTextColor(20, 20, 20);
  y = 130;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("TAX INVOICE", 40, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Invoice #: ${o.order_code}`, W - 40, y - 12, { align: "right" });
  doc.text(`Date: ${new Date(o.created_at ?? Date.now()).toLocaleDateString("en-IN")}`, W - 40, y + 2, { align: "right" });
  doc.text(`Status: ${(o.status ?? "delivered").toUpperCase()}`, W - 40, y + 16, { align: "right" });

  y += 40;
  doc.setDrawColor(220);
  doc.line(40, y, W - 40, y);
  y += 24;

  // Bill to
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 40, y);
  doc.setFont("helvetica", "normal");
  y += 16;
  doc.text(o.customer_name, 40, y);
  y += 14;
  doc.text(`Phone: ${o.customer_phone}`, 40, y);
  if (o.customer_email) { y += 14; doc.text(`Email: ${o.customer_email}`, 40, y); }
  y += 14;
  const addrLines = doc.splitTextToSize(o.address_text || "", W - 80);
  doc.text(addrLines, 40, y);
  y += 14 * addrLines.length + 12;

  // Table
  doc.setFillColor(240, 240, 245);
  doc.rect(40, y, W - 80, 26, "F");
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPTION", 50, y + 17);
  doc.text("QTY (L)", W - 220, y + 17);
  doc.text("AMOUNT", W - 60, y + 17, { align: "right" });
  y += 40;

  doc.setFont("helvetica", "normal");
  const desc = `${o.water_type.replace(/_/g, " ")} water tanker delivery`;
  doc.text(desc, 50, y);
  doc.text(String(o.size_l), W - 220, y);
  doc.text(`₹ ${o.total.toFixed(2)}`, W - 60, y, { align: "right" });
  if (o.delivery_date) {
    y += 16;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Delivery: ${o.delivery_date}${o.delivery_slot ? " · " + o.delivery_slot : ""}`, 50, y);
    doc.setTextColor(20);
    doc.setFontSize(10);
  }

  y += 30;
  doc.line(40, y, W - 40, y);
  y += 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL PAID", W - 200, y);
  doc.text(`₹ ${o.total.toFixed(2)}`, W - 60, y, { align: "right" });

  // Footer
  y = doc.internal.pageSize.getHeight() - 60;
  doc.setDrawColor(220);
  doc.line(40, y, W - 40, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Thank you for choosing PBTW Group. This is a computer-generated invoice.", W / 2, y + 20, { align: "center" });
  doc.text("For queries: +91 92147 75938 · support@pbtw.in", W / 2, y + 34, { align: "center" });

  return doc;
}

export function downloadInvoice(o: InvoiceOrder) {
  const doc = generateInvoicePdf(o);
  doc.save(`PBTW-Invoice-${o.order_code}.pdf`);
}
