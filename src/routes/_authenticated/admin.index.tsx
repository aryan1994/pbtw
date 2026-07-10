import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2,
  ShieldAlert,
  Package,
  Truck,
  Wallet,
  FileText,
  Users,
  IndianRupee,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { downloadInvoice, type InvoiceOrder } from "@/lib/invoice-pdf";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard | PBTW Group" }] }),
  component: AdminDashboardPage,
});

type Stats = {
  orders_total: number;
  orders_pending: number;
  orders_delivered: number;
  revenue: number;
  drivers_pending: number;
  drivers_active: number;
  recharges_pending: number;
};

function AdminDashboardPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<InvoiceOrder[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return setIsAdmin(false);
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!roleRow);
    })();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [orders, drivers, apps, recharges] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("drivers").select("status"),
        supabase.from("driver_applications").select("status"),
        supabase.from("wallet_recharge_requests").select("status").eq("status", "pending"),
      ]);
      const os = (orders.data ?? []) as unknown as (InvoiceOrder & { status: string; created_at: string })[];
      const delivered = os.filter((o) => o.status === "delivered");
      setStats({
        orders_total: os.length,
        orders_pending: os.filter((o) => o.status === "pending").length,
        orders_delivered: delivered.length,
        revenue: delivered.reduce((s, o) => s + Number(o.total || 0), 0),
        drivers_pending: (apps.data ?? []).filter((a: { status: string }) => a.status === "pending").length,
        drivers_active: (drivers.data ?? []).filter((d: { status: string }) => d.status === "available" || d.status === "on_duty").length,
        recharges_pending: (recharges.data ?? []).length,
      });
      setRecentOrders(os.slice(0, 8));
    })();
  }, [isAdmin]);

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero">
        <div className="rounded-3xl bg-card p-10 text-center shadow-elegant">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="mt-4 font-display text-2xl font-extrabold">Admin access required</h1>
          <Link to="/" className="mt-4 inline-block text-sm font-semibold text-primary underline">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin Console</p>
          <h1 className="font-display text-3xl font-extrabold">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">All operations at a glance — orders, drivers, wallet recharges & invoices.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Package className="h-5 w-5" />} label="Total orders" value={stats?.orders_total ?? "—"} tone="primary" />
          <StatCard icon={<Clock className="h-5 w-5" />} label="Pending" value={stats?.orders_pending ?? "—"} tone="amber" />
          <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Delivered" value={stats?.orders_delivered ?? "—"} tone="emerald" />
          <StatCard icon={<IndianRupee className="h-5 w-5" />} label="Revenue" value={stats ? `₹${stats.revenue.toLocaleString("en-IN")}` : "—"} tone="primary" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <QuickLink to="/admin/orders" icon={<Package />} title="Orders" desc={`${stats?.orders_pending ?? 0} pending`} />
          <QuickLink to="/admin/drivers" icon={<Truck />} title="Drivers" desc={`${stats?.drivers_pending ?? 0} applications · ${stats?.drivers_active ?? 0} active`} />
          <QuickLink to="/admin/recharges" icon={<Wallet />} title="Wallet Recharges" desc={`${stats?.recharges_pending ?? 0} pending`} />
        </div>

        <div className="mt-8 rounded-3xl bg-card shadow-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-extrabold">Recent Invoices</h2>
            </div>
            <Link to="/admin/orders" className="text-xs font-semibold text-primary hover:underline">
              View all orders →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.length === 0 && <p className="p-6 text-sm text-muted-foreground">No orders yet.</p>}
            {recentOrders.map((o) => (
              <div key={o.order_code} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{o.order_code}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
                      {o.status ?? "pending"}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-foreground">{o.customer_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{o.address_text}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg font-extrabold text-foreground">₹{Number(o.total).toFixed(0)}</span>
                  <button
                    onClick={() => {
                      try { downloadInvoice(o); toast.success("Invoice downloaded"); }
                      catch { toast.error("Failed to generate PDF"); }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                  >
                    <Download className="h-3.5 w-3.5" /> Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; tone: "primary" | "amber" | "emerald" }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  } as const;
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</span>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold text-foreground">{value}</p>
    </div>
  );
}

function QuickLink({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link to={to} className="group flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-base font-extrabold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
