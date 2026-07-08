import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  Wallet,
  Gift,
  ShieldAlert,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin Console | PBTW" }] }),
  component: AdminHome,
});

type Counts = {
  ordersPending: number;
  ordersTotal: number;
  driverApps: number;
  rechargesPending: number;
  couponsActive: number;
};

function AdminHome() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [counts, setCounts] = useState<Counts>({
    ordersPending: 0,
    ordersTotal: 0,
    driverApps: 0,
    rechargesPending: 0,
    couponsActive: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return setIsAdmin(false);
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!role);
    })();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [op, ot, da, rp, ca] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("driver_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("wallet_recharge_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("coupon_codes").select("id", { count: "exact", head: true }).eq("active", true),
      ]);
      setCounts({
        ordersPending: op.count ?? 0,
        ordersTotal: ot.count ?? 0,
        driverApps: da.count ?? 0,
        rechargesPending: rp.count ?? 0,
        couponsActive: ca.count ?? 0,
      });
      setLoading(false);
    })();
  }, [isAdmin]);

  if (isAdmin === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto mt-32 max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
        <h2 className="mt-4 font-display text-2xl font-bold">Admins only</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You need admin privileges to view this page.
        </p>
      </div>
    );
  }

  const tiles = [
    {
      to: "/admin/orders",
      label: "Orders",
      desc: "Assign drivers, update statuses, notifications",
      icon: Package,
      badge: counts.ordersPending ? `${counts.ordersPending} pending` : `${counts.ordersTotal} total`,
      tone: "from-navy-deep to-hero",
    },
    {
      to: "/admin/drivers",
      label: "Driver Applications",
      desc: "Review documents, approve or reject",
      icon: Truck,
      badge: counts.driverApps ? `${counts.driverApps} to review` : "All reviewed",
      tone: "from-emerald-600 to-emerald-800",
    },
    {
      to: "/admin/recharges",
      label: "Wallet Recharges",
      desc: "Approve customer wallet top-ups",
      icon: Wallet,
      badge: counts.rechargesPending ? `${counts.rechargesPending} pending` : "None pending",
      tone: "from-amber-600 to-orange-700",
    },
    {
      to: "/admin/coupons",
      label: "Coupons",
      desc: "Create promo codes and discounts",
      icon: Gift,
      badge: `${counts.couponsActive} active`,
      tone: "from-fuchsia-600 to-purple-700",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Admin Console
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage every side of PBTW from one place.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tiles.map((tile) => (
            <Link
              key={tile.to}
              to={tile.to}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity group-hover:opacity-20 ${tile.tone}`}
              />
              <div className="relative flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <tile.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <h3 className="relative mt-5 font-display text-lg font-bold text-foreground">
                {tile.label}
              </h3>
              <p className="relative mt-1 text-sm text-muted-foreground">{tile.desc}</p>
              <span className="relative mt-4 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                {tile.badge}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
