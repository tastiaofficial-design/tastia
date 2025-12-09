"use client";

import { useEffect, useMemo, useState } from "react";
import { IOrder } from "@/lib/models/Order";
import { TrendingUp, ShoppingBag, Wallet, PieChart } from "lucide-react";

type Order = IOrder;

function StatCard({ title, value, subtitle, icon: Icon, colorClass = "text-tastia-cream" }: { title: string; value: string | number; subtitle?: string; icon: any; colorClass?: string; }) {
  return (
    <div className="glass-effect rounded-2xl p-5 border border-tastia-secondary/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-tastia-cream/70 text-sm">{title}</p>
          <p className="text-tastia-cream text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-tastia-cream/50 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-tastia-primary/20 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-tastia-cream/80 text-sm truncate max-w-[65%]">{label}</span>
        <span className="text-tastia-cream/60 text-xs">{value}</span>
      </div>
      <div className="h-2.5 bg-tastia-primary/20 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-tastia-primary to-tastia-secondary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [itemsIndex, setItemsIndex] = useState<Record<string, { categoryId?: string; cost?: number }>>({});
  const [categoriesIndex, setCategoriesIndex] = useState<Record<string, { name?: string }>>({});
  const [showBestHours, setShowBestHours] = useState(true);

  // Persist best hours toggle
  useEffect(() => {
    try {
      const v = localStorage.getItem('analytics.showBestHours');
      if (v === 'true') setShowBestHours(true);
      if (v === 'false') setShowBestHours(false);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('analytics.showBestHours', showBestHours ? 'true' : 'false');
    } catch {}
  }, [showBestHours]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set('limit', '500');
        if (fromDate) params.set('from', fromDate);
        if (toDate) params.set('to', toDate);
        const res = await fetch(`/api/orders?${params.toString()}`);
        const json = await res.json();
        if (!cancelled) {
          if (json.success) {
            setOrders(json.data || []);
          } else {
            setError(json.error || 'Failed to load orders');
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load orders');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [fromDate, toDate]);

  // Build indices for items -> category and categoryId -> name (admin=true to bypass cache)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [itemsRes, catsRes] = await Promise.all([
          fetch('/api/items?admin=true'),
          fetch('/api/categories?admin=true'),
        ]);
        const [itemsJson, catsJson] = await Promise.all([itemsRes.json(), catsRes.json()]);
        if (cancelled) return;
        if (itemsJson?.success && Array.isArray(itemsJson.data)) {
          const idx: Record<string, { categoryId?: string; cost?: number }> = {};
          for (const it of itemsJson.data) {
            if (it?._id) idx[it._id] = { categoryId: it.categoryId, cost: it.cost };
          }
          setItemsIndex(idx);
        }
        if (catsJson?.success && Array.isArray(catsJson.data)) {
          const cidx: Record<string, { name?: string }> = {};
          for (const c of catsJson.data) {
            if (c?._id) cidx[c._id] = { name: c.name };
          }
          setCategoriesIndex(cidx);
        }
      } catch (_) {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => {
      const subtotal = o.totalAmount || 0;
      const discount = o.discountAmount || 0;
      const tips = o.tips || 0;
      return sum + subtotal - discount + tips;
    }, 0);
    const totalTips = orders.reduce((sum, o) => sum + (o.tips || 0), 0);
    const takeawayOrders = orders.filter(o => (o.notes || '').includes('تيك أواي')).length;
    const dineInOrders = totalOrders - takeawayOrders;
    const orderType = [
      { label: 'تيك أواي', count: takeawayOrders },
      { label: 'داخل المطعم', count: dineInOrders },
    ];
    const topItemsMap = new Map<string, { name: string; count: number }>();
    for (const o of orders) {
      for (const it of o.items || []) {
        const entry = topItemsMap.get(it.menuItemId) || { name: it.menuItemName, count: 0 };
        entry.count += it.quantity;
        topItemsMap.set(it.menuItemId, entry);
      }
    }
    const allItemsByCount = Array.from(topItemsMap.values()).sort((a, b) => b.count - a.count);
    const topItems = allItemsByCount.slice(0, 5);
    const bottomItems = allItemsByCount.slice(-5).reverse();
    const maxTop = topItems[0]?.count || 0;
    const maxBottom = bottomItems[0]?.count || 0;
    // Self-selling items: orders that contain exactly one unique item
    const selfSellingMap = new Map<string, { name: string; count: number }>();
    for (const o of orders) {
      const validItems = (o.items || []).filter(it => it.quantity > 0);
      if (validItems.length === 1) {
        const only = validItems[0];
        const entry = selfSellingMap.get(only.menuItemId) || { name: only.menuItemName, count: 0 };
        entry.count += only.quantity;
        selfSellingMap.set(only.menuItemId, entry);
      }
    }
    const selfSelling = Array.from(selfSellingMap.values()).sort((a, b) => b.count - a.count).slice(0, 10);
    const maxSelf = selfSelling[0]?.count || 0;

    // Revenue by category
    const revenueByCategoryMap = new Map<string, number>();
    for (const o of orders) {
      for (const it of o.items || []) {
        const catId = itemsIndex[it.menuItemId]?.categoryId || 'unknown';
        const prev = revenueByCategoryMap.get(catId) || 0;
        revenueByCategoryMap.set(catId, prev + (it.totalPrice || (it.quantity * it.unitPrice)));
      }
    }
    const revenueByCategory = Array.from(revenueByCategoryMap.entries()).map(([catId, value]) => ({
      label: categoriesIndex[catId]?.name || (catId === 'unknown' ? 'غير معروف' : catId),
      value,
    })).sort((a, b) => b.value - a.value);
    const maxRevenueCategory = revenueByCategory[0]?.value || 0;

    // Orders by hour (best hours)
    const byHourMap = new Map<number, number>();
    for (const o of orders) {
      const d = new Date(o.orderDate);
      const h = d.getHours();
      byHourMap.set(h, (byHourMap.get(h) || 0) + 1);
    }
    const ordersByHour = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: byHourMap.get(h) || 0 }));
    const maxByHour = ordersByHour.reduce((m, x) => Math.max(m, x.count), 0);

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Average spend per unique customer (by phone)
    const uniquePhones = new Set<string>();
    for (const o of orders) {
      const p = (o.customerInfo as any)?.phone;
      if (p) uniquePhones.add(p);
    }
    const numCustomers = uniquePhones.size || 0;
    const averageSpendPerCustomer = numCustomers > 0 ? totalRevenue / numCustomers : 0;

    // Profitability per item if cost exists
    const profitMap = new Map<string, { name: string; profit: number }>();
    for (const o of orders) {
      for (const it of o.items || []) {
        const cost = itemsIndex[it.menuItemId]?.cost ?? 0;
        const revenue = (it.totalPrice ?? it.unitPrice * it.quantity);
        const profit = revenue - cost * (it.quantity || 1);
        const entry = profitMap.get(it.menuItemId) || { name: it.menuItemName, profit: 0 };
        entry.profit += profit;
        profitMap.set(it.menuItemId, entry);
      }
    }
    const profitableItems = Array.from(profitMap.values()).sort((a, b) => b.profit - a.profit).slice(0, 5);
    const maxProfit = profitableItems[0]?.profit || 0;

    // Common item pairings
    const pairingMap = new Map<string, { a: string; b: string; count: number }>();
    for (const o of orders) {
      const ids = Array.from(new Set((o.items || []).map(it => it.menuItemName).filter(Boolean)));
      ids.sort();
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const key = ids[i] + '||' + ids[j];
          const entry = pairingMap.get(key) || { a: ids[i], b: ids[j], count: 0 };
          entry.count += 1;
          pairingMap.set(key, entry);
        }
      }
    }
    const commonPairings = Array.from(pairingMap.values()).sort((a, b) => b.count - a.count).slice(0, 10);
    const maxPairCount = commonPairings[0]?.count || 0;

    return { totalOrders, totalRevenue, totalTips, takeawayOrders, dineInOrders, orderType, topItems, bottomItems, maxTop, maxBottom, selfSelling, maxSelf, revenueByCategory, maxRevenueCategory, ordersByHour, maxByHour, averageOrderValue, numCustomers, averageSpendPerCustomer, profitableItems, maxProfit, commonPairings, maxPairCount };
  }, [orders, itemsIndex, categoriesIndex]);

  return (
    <div className="space-y-6">
      <h1 className="text-tastia-cream text-2xl font-bold">التحليلات</h1>

      {/* Date range filters */}
      <div className="glass-effect rounded-2xl p-4 border border-tastia-secondary/30">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-tastia-cream/70 text-xs mb-1">من تاريخ</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full admin-input"
            />
          </div>
          <div>
            <label className="block text-tastia-cream/70 text-xs mb-1">إلى تاريخ</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full admin-input"
            />
          </div>
          <div className="text-tastia-cream/60 text-sm">
            {fromDate || toDate ? (
              <span>
                عرض النتائج {fromDate && <>من <b className="text-tastia-cream">{fromDate}</b></>} {toDate && <>إلى <b className="text-tastia-cream">{toDate}</b></>}
              </span>
            ) : (
              <span>عرض جميع الطلبات (آخر 500)</span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-tastia-cream/80">جاري التحميل...</div>
      ) : error ? (
        <div className="text-red-300">{error}</div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="إجمالي الطلبات" value={stats.totalOrders} icon={ShoppingBag} />
            <StatCard title="إجمالي الإيرادات" value={`${stats.totalRevenue.toFixed(2)} ر.س`} icon={Wallet} />
            <StatCard title="إجمالي البقشيش" value={`${stats.totalTips.toFixed(2)} ر.س`} icon={TrendingUp} />
            <StatCard title="متوسط قيمة الطلب" value={`${stats.averageOrderValue.toFixed(2)} ر.س`} icon={PieChart} />
          </div>

          {/* Additional KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="طلبات التيك أواي" value={stats.takeawayOrders} icon={ShoppingBag} />
            <StatCard title="طلبات داخل المطعم" value={stats.dineInOrders} icon={ShoppingBag} />
            <StatCard title="عدد العملاء" value={stats.numCustomers} subtitle={`متوسط إنفاق: ${stats.averageSpendPerCustomer.toFixed(2)} ر.س`} icon={Wallet} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top items */}
            <div className="glass-effect rounded-2xl p-6 border border-tastia-secondary/30">
              <h2 className="text-tastia-cream text-lg font-semibold mb-4">أكثر العناصر طلباً</h2>
              <div className="space-y-3">
                {stats.topItems.length === 0 ? (
                  <p className="text-tastia-cream/60 text-sm">لا توجد بيانات كافية</p>
                ) : (
                  stats.topItems.map((it) => (
                    <Bar key={it.name} label={it.name} value={it.count} max={stats.maxTop} />
                  ))
                )}
              </div>
            </div>

            {/* Bottom items */}
            <div className="glass-effect rounded-2xl p-6 border border-tastia-secondary/30">
              <h2 className="text-tastia-cream text-lg font-semibold mb-4">أقل العناصر طلباً</h2>
              <div className="space-y-3">
                {stats.bottomItems.length === 0 ? (
                  <p className="text-tastia-cream/60 text-sm">لا توجد بيانات كافية</p>
                ) : (
                  stats.bottomItems.map((it) => (
                    <Bar key={it.name} label={it.name} value={it.count} max={stats.maxBottom} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Revenue by category */}
          <div className="glass-effect rounded-2xl p-6 border border-tastia-secondary/30">
            <h2 className="text-tastia-cream text-lg font-semibold mb-4">الإيرادات حسب الفئة</h2>
            <div className="space-y-3">
              {stats.revenueByCategory.length === 0 ? (
                <p className="text-tastia-cream/60 text-sm">لا توجد بيانات كافية</p>
              ) : (
                stats.revenueByCategory.map((r) => (
                  <Bar key={r.label} label={r.label} value={r.value} max={stats.maxRevenueCategory} />
                ))
              )}
            </div>
          </div>

          {/* Best hours (collapsible) */}
          <div className="glass-effect rounded-2xl border border-tastia-secondary/30">
            <button
              className="w-full flex items-center justify-between p-6 text-left"
              onClick={() => setShowBestHours(v => !v)}
            >
              <h2 className="text-tastia-cream text-lg font-semibold">أفضل الساعات (عدد الطلبات لكل ساعة)</h2>
              <span className="text-tastia-cream/70 text-sm">{showBestHours ? 'إخفاء' : 'عرض'}</span>
            </button>
            {showBestHours && (
              <div className="p-6 pt-0 space-y-3">
                {stats.ordersByHour.every(h => h.count === 0) ? (
                  <p className="text-tastia-cream/60 text-sm">لا توجد بيانات كافية</p>
                ) : (
                  stats.ordersByHour.map(({ hour, count }) => (
                    <Bar key={hour} label={`${hour}:00`} value={count} max={stats.maxByHour} />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Self-selling items */}
          <div className="glass-effect rounded-2xl p-6 border border-tastia-secondary/30">
            <h2 className="text-tastia-cream text-lg font-semibold mb-4">أصناف بتتباع لوحدها (طلب عنصر واحد)</h2>
            <div className="space-y-3">
              {stats.selfSelling.length === 0 ? (
                <p className="text-tastia-cream/60 text-sm">لا توجد بيانات كافية</p>
              ) : (
                stats.selfSelling.map((it) => (
                  <Bar key={it.name} label={it.name} value={it.count} max={stats.maxSelf} />
                ))
              )}
            </div>
          </div>

          {/* Most profitable items */}
          {stats.profitableItems.length > 0 && (
            <div className="glass-effect rounded-2xl p-6 border border-tastia-secondary/30">
              <h2 className="text-tastia-cream text-lg font-semibold mb-4">أكثر الأصناف ربحية</h2>
              <div className="space-y-3">
                {stats.profitableItems.map((it) => (
                  <Bar key={it.name} label={it.name} value={Math.round(it.profit)} max={Math.round(stats.maxProfit)} />
                ))}
              </div>
            </div>
          )}

          {/* Common item pairings */}
          <div className="glass-effect rounded-2xl p-6 border border-tastia-secondary/30">
            <h2 className="text-tastia-cream text-lg font-semibold mb-4">الأصناف الشائعة سوياً</h2>
            <div className="space-y-3">
              {stats.commonPairings.length === 0 ? (
                <p className="text-tastia-cream/60 text-sm">لا توجد بيانات كافية</p>
              ) : (
                stats.commonPairings.map((p) => (
                  <Bar key={`${p.a}+${p.b}`} label={`${p.a} + ${p.b}`} value={p.count} max={stats.maxPairCount} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


