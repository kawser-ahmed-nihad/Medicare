import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Calendar, DollarSign, CreditCard, FileText, RotateCcw,
  BarChart3, Receipt, ArrowRight, ChevronLeft, ChevronRight, Zap,
  Download, Loader2, Building2,
} from "lucide-react";

const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

const formatAmount = (n) => Math.round(n || 0).toLocaleString("en-US");
const formatCompactAmount = (n) => {
  const value = Number(n) || 0;
  const absoluteValue = Math.abs(value);
  const units = [
    { threshold: 1e9, divisor: 1e9, suffix: "B" },
    { threshold: 1e6, divisor: 1e6, suffix: "M" },
    { threshold: 1e3, divisor: 1e3, suffix: "K" },
  ];
  const unit = units.find(({ threshold }) => absoluteValue >= threshold);

  if (!unit) return formatAmount(value);

  const amount = Number((value / unit.divisor).toFixed(1));
  return `${amount}${unit.suffix}`;
};
const money = (n) => `$${formatAmount(n)}`;
const fmtShort = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const fmtLong = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const METHOD_COLORS = { Cash: "#f59e0b", Card: "#8b5cf6", bKash: "#10b981", Nagad: "#f97316", Rocket: "#ec4899", Online: "#3b82f6" };
const METHOD_CHIP = {
  Cash: "bg-amber-50 text-amber-600",
  Card: "bg-violet-50 text-violet-600",
  bKash: "bg-emerald-50 text-emerald-600",
  Nagad: "bg-orange-50 text-orange-600",
  Rocket: "bg-pink-50 text-pink-600",
  Online: "bg-blue-50 text-[#0066fe]",
};
const STATUS_CHIP = {
  Paid: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  "Refund Due": "bg-rose-50 text-rose-600",
  Failed: "bg-slate-100 text-[#4a5568]",
};
const DEPT_BARS = ["bg-[#0066fe]", "bg-violet-500", "bg-emerald-500", "bg-orange-500", "bg-[#4a5568]"];
const DEPT_TINTS = ["bg-blue-50 text-[#0066fe]", "bg-violet-50 text-violet-600", "bg-emerald-50 text-emerald-600", "bg-orange-50 text-orange-600", "bg-slate-100 text-[#4a5568]"];
const STATUS_FILTERS = ["All", "Paid", "Pending", "Refund Due", "Failed"];
const PAGE_SIZE = 7;

const initials = (n) => (n || "P").split(" ").map((w) => w[0]).slice(0, 2).join("");

/* ---------------- pieces ---------------- */

const Card = ({ className = "", children }) => (
  <section className={`rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}>{children}</section>
);

const CardTitle = ({ icon: Icon, children, action }) => (
  <div className="mb-5 flex items-center justify-between">
    <h2 className="flex items-center gap-2 text-sm font-semibold text-[#0a1931]">
      {Icon && <Icon className="h-4 w-4 text-[#0066fe]" />}
      {children}
    </h2>
    {action}
  </div>
);

function DollarAmount({ value, compact: isCompact = false }) {
  const formatted = isCompact ? formatCompactAmount(value) : formatAmount(value);

  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap tabular-nums" aria-label={`${money(value)} USD`}>
      <DollarSign aria-hidden="true" className="h-[0.85em] w-[0.85em] shrink-0 self-center text-[#0066fe]" />
      <span>{formatted}</span>
    </span>
  );
}

function niceMax(v) {
  if (v <= 0) return 5;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

// Divide the 30 days of data into about 11 bars.
function bucketSeries(series, target = 11) {
  const size = Math.max(1, Math.ceil(series.length / target));
  const out = [];
  for (let i = 0; i < series.length; i += size) {
    const chunk = series.slice(i, i + size);
    out.push({
      date: chunk[0].date,
      revenue: chunk.reduce((n, d) => n + d.revenue, 0),
      appointments: chunk.reduce((n, d) => n + d.appointments, 0),
    });
  }
  return out;
}

function RevenueOverview({ series }) {
  const data = useMemo(() => bucketSeries(series), [series]);
  const maxRev = niceMax(Math.max(0, ...data.map((d) => d.revenue)));
  const maxAppt = niceMax(Math.max(0, ...data.map((d) => d.appointments)));
  const W = 640, H = 200, step = data.length > 1 ? W / (data.length - 1) : W;
  const yRev = (v) => H - (v / maxRev) * H;
  const yAppt = (v) => H - (v / maxAppt) * H;
  const line = data.map((p, i) => `${i * step},${yAppt(p.appointments)}`).join(" ");
  const ticks = [1, 0.8, 0.6, 0.4, 0.2, 0];

  return (
    <Card>
      <CardTitle><span className="text-base">Revenue Overview</span></CardTitle>
      <div className="-mt-9 mb-4 flex justify-end gap-4 text-xs text-[#4a5568]">
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#0066fe]" />Revenue</span>
        <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-500" />Appointments</span>
      </div>

      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#4a5568]">No data in this range.</p>
      ) : (
        <div className="flex gap-3">
          <div className="flex flex-col justify-between py-1 text-[11px] text-[#4a5568]">
            {ticks.map((t) => <span key={t}><DollarAmount value={maxRev * t} compact /></span>)}
          </div>
          <div className="flex-1">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-52 w-full overflow-visible" preserveAspectRatio="none">
              {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1="0" x2={W} y1={(H / 5) * i} y2={(H / 5) * i} stroke="#f1f5f9" strokeWidth="1" />)}
              {data.map((p, i) => (
                <rect key={p.date} x={i * step - 11} y={yRev(p.revenue)} width="22" height={H - yRev(p.revenue)} rx="4" fill="#3b82f6">
                  <title>{`${fmtShort(p.date)}: ${money(p.revenue)}`}</title>
                </rect>
              ))}
              <polyline points={line} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {data.map((p, i) => (
                <circle key={p.date} cx={i * step} cy={yAppt(p.appointments)} r="3.5" fill="#fff" stroke="#10b981" strokeWidth="2">
                  <title>{`${fmtShort(p.date)}: ${p.appointments} appointments`}</title>
                </circle>
              ))}
            </svg>
            <div className="mt-2 flex justify-between text-[11px] text-[#4a5568]">
              {data.map((p) => <span key={p.date}>{fmtShort(p.date)}</span>)}
            </div>
          </div>
          <div className="flex flex-col justify-between py-1 text-[11px] text-emerald-500">
            {ticks.map((t) => <span key={t}>{Math.round(maxAppt * t)}</span>)}
          </div>
        </div>
      )}
    </Card>
  );
}

function PaymentMethods({ methods, total }) {
  let acc = 0;
  const stops = methods.map((m) => {
    const from = acc, to = acc + m.pct;
    acc = to;
    return `${METHOD_COLORS[m.name] || "#94a3b8"} ${from}% ${to}%`;
  }).join(", ");

  return (
    <Card>
      <CardTitle><span className="text-base">Payment Methods</span></CardTitle>
      {methods.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#4a5568]">No payments in this range.</p>
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative shrink-0">
            <div className="h-40 w-40 rounded-full" style={{ background: `conic-gradient(${stops})` }} />
            <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-white text-center">
              <span className="text-lg font-semibold text-[#0a1931]"><DollarAmount value={total} compact /></span>
              <span className="text-[11px] text-[#4a5568]">Total Revenue</span>
            </div>
          </div>
          <ul className="flex-1 space-y-3.5 text-sm">
            {methods.map((m) => (
              <li key={m.name} className="flex items-center gap-3">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: METHOD_COLORS[m.name] || "#94a3b8" }} />
                <span className="flex-1 text-[#4a5568]">{m.name}</span>
                <span className="w-10 text-right text-[#4a5568]">{m.pct}%</span>
                <span className="w-20 text-right font-medium text-[#0a1931]"><DollarAmount value={m.amount} compact /></span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-4 text-[11px] text-[#4a5568]">Cash = completed visits (assumed collected at the chamber).</p>
    </Card>
  );
}

function pageList(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => { if (i > 0 && n - nums[i - 1] > 1) out.push("…"); out.push(n); });
  return out;
}

function RecentPayments({ data, isLoading, isError, page, setPage, statusFilter, setStatusFilter }) {
  const rows = data?.payments ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <h2 className="text-base font-semibold text-[#0a1931]">Recent Payments</h2>
        <select
          aria-label="Filter by payment status"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-[#4a5568] focus:border-blue-400 focus:outline-none"
        >
          {STATUS_FILTERS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-xs font-medium text-[#4a5568]">
              {["#", "Patient", "Doctor", "Method", "Amount", "Booked", "Status"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3.5 text-[#4a5568]" title={p.reference || undefined}>#{p._id.slice(-6)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {/* <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">{initials(p.patientName)}</span> */}
                    <span className="font-medium text-xs text-[#0a1931]">{p.patientName || "Patient"}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[#4a5568]">{p.doctorName}</td>
                <td className="px-5 py-3.5"><span className={`rounded-md px-2 py-1 text-xs font-medium ${METHOD_CHIP[p.channel] || "bg-slate-100 text-[#4a5568]"}`}>{p.channel}</span></td>
                <td className="px-5 py-3.5 font-medium text-[#0a1931]"><DollarAmount value={p.amount} /></td>
                <td className="px-5 py-3.5 text-[#4a5568]">
                  <div>{fmtLong(p.createdAt)}</div>
                  <div className="text-xs text-[#4a5568]">{fmtTime(p.createdAt)}</div>
                </td>
                <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CHIP[p.status]}`}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        {isLoading && <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-[#0066fe]" /></div>}
        {isError && <p className="py-8 text-center text-sm text-rose-500">Couldn't load payments.</p>}
        {!isLoading && !isError && rows.length === 0 && <p className="py-10 text-center text-sm text-[#4a5568]">No payments found.</p>}
      </div>

      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm text-[#4a5568]">
          <span>Showing {(page - 1) * PAGE_SIZE + 1} – {Math.min(page * PAGE_SIZE, total)} of {total} payments</span>
          <nav className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-[#4a5568] hover:bg-slate-50 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
            {pageList(page, totalPages).map((n, i) => n === "…" ? <span key={`g${i}`} className="px-1">…</span> : (
              <button key={n} onClick={() => setPage(n)} className={`h-8 min-w-8 rounded-lg px-1 text-sm ${n === page ? "bg-[#0066fe] text-white" : "border border-slate-200 text-[#4a5568] hover:bg-slate-50"}`}>{n}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-[#4a5568] hover:bg-slate-50 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
          </nav>
        </div>
      )}
    </Card>
  );
}

function MonthlyRevenue({ monthly }) {
  const max = niceMax(Math.max(0, ...monthly.map((m) => m.value)));
  const current = monthly[monthly.length - 1];
  const ticks = [1, 0.75, 0.5, 0.25, 0];
  return (
    <Card>
      <CardTitle icon={BarChart3}>Monthly Revenue</CardTitle>
      {current && (
        <div className="mb-3 flex justify-end">
          <div className="rounded-lg border border-slate-200 px-2.5 py-1 text-right">
            <div className="text-[11px] text-[#4a5568]">{current.label} (this month)</div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0066fe]"><i className="h-2 w-2 rounded-full bg-[#0066fe]" /><DollarAmount value={current.value} compact /></div>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <div className="flex flex-col justify-between text-[11px] text-[#4a5568]">
          {ticks.map((t) => <span key={t}><DollarAmount value={max * t} compact /></span>)}
        </div>
        <div className="flex flex-1 items-end gap-2" style={{ height: 130 }}>
          {monthly.map((m, i) => (
            <div key={m.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2" title={`${m.label}: ${money(m.value)}`}>
              <div className={`w-full rounded-t-md ${i === monthly.length - 1 ? "bg-[#0066fe]" : "bg-blue-200"}`} style={{ height: `${(m.value / max) * 100}%`, minHeight: m.value ? 3 : 0 }} />
              <span className="text-[11px] text-[#4a5568]">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ---------------- page ---------------- */

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export default function PaymentsRevenue() {
  const axiosSecure = useAxiosSecure();

  const [range, setRange] = useState({ from: keyOf(daysAgo(29)), to: keyOf(new Date()) });
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [exporting, setExporting] = useState(false);

  useEffect(() => setPage(1), [range.from, range.to]);

  const summary = useQuery({
    queryKey: ["admin-payments-summary", range.from, range.to],
    queryFn: async () => (await axiosSecure.get("/api/payments/admin/summary", { params: range })).data,
    enabled: Boolean(range.from && range.to),
  });

  const list = useQuery({
    queryKey: ["admin-payments-list", range.from, range.to, statusFilter, page],
    queryFn: async () => {
      const params = { ...range, page, limit: PAGE_SIZE };
      if (statusFilter !== "All") params.status = statusFilter;
      return (await axiosSecure.get("/api/payments/admin/list", { params })).data;
    },
    keepPreviousData: true,
    enabled: Boolean(range.from && range.to),
  });

  const s = summary.data?.stats ?? { totalRevenue: 0, paymentsCount: 0, pendingCount: 0, pendingAmount: 0, refundCount: 0, refundAmount: 0 };

  const stats = [
    { label: "Total Revenue", value: <DollarAmount value={s.totalRevenue} compact />, note: "Online paid + completed cash visits", icon: DollarSign, tint: "bg-emerald-100 text-emerald-600" },
    { label: "Total Payments", value: s.paymentsCount, note: "Successful payments", icon: CreditCard, tint: "bg-sky-100 text-sky-600" },
    { label: "Pending Payments", value: s.pendingCount, note: <><DollarAmount value={s.pendingAmount} compact /> awaiting online payment</>, icon: FileText, tint: "bg-violet-100 text-violet-600" },
    { label: "Refunds Due", value: s.refundCount, note: <><DollarAmount value={s.refundAmount} compact /> paid, then cancelled</>, icon: RotateCcw, tint: "bg-orange-100 text-orange-600" },
  ];

  const exportCsv = async () => {
    setExporting(true);
    try {
      const params = { ...range, all: "true" };
      if (statusFilter !== "All") params.status = statusFilter;
      const res = await axiosSecure.get("/api/payments/admin/list", { params });
      const header = ["Appointment ID", "Patient", "Doctor", "Method", "Amount", "Booked At", "Appointment Date", "Status", "Reference"];
      const lines = res.data.payments.map((p) => [p._id, p.patientName, p.doctorName, p.channel, p.amount, p.createdAt, p.appointmentDate, p.status, p.reference].map(csvCell).join(","));
      const blob = new Blob([[header.map(csvCell).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "payments.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err.response?.data?.message || err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 text-[#0a1931] lg:p-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-[#4a5568]">
            <span>Dashboard</span><span>/</span>
            <span className="text-[#4a5568]">Payments / Revenue</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight">Payments / Revenue</h1>
          <p className="mt-1 text-sm text-[#4a5568]">Track revenue, manage payments and view financial reports.</p>
        </div>
        <div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-[#4a5568] focus-within:border-blue-400">
            <Calendar className="h-4 w-4 text-[#0066fe]" />
            <input type="date" aria-label="From date" value={range.from} max={range.to} onChange={(e) => e.target.value && setRange((r) => ({ ...r, from: e.target.value }))} className="bg-transparent py-1 text-sm focus:outline-none" />
            <span className="text-[#4a5568]">–</span>
            <input type="date" aria-label="To date" value={range.to} min={range.from} max={keyOf(new Date())} onChange={(e) => e.target.value && setRange((r) => ({ ...r, to: e.target.value }))} className="bg-transparent py-1 text-sm focus:outline-none" />
          </div>
          <p className="mt-1 text-right text-[11px] text-[#4a5568]">Filtered by appointment date · max 92 days</p>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((st) => (
              <Card key={st.label}>
                <div className="flex items-start gap-3">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${st.tint}`}><st.icon className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <div className="text-sm text-[#4a5568]">{st.label}</div>
                    <div className="mt-0.5  text-2xl font-bold">{summary.isLoading ? "…" : st.value}</div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-[#4a5568]">{st.note}</p>
              </Card>
            ))}
          </div>

          {summary.isError && <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">Couldn't load the revenue summary. Please try again.</p>}

          <div className="grid gap-5 lg:grid-cols-2">
            <RevenueOverview series={summary.data?.series ?? []} />
            <PaymentMethods methods={summary.data?.methods ?? []} total={s.totalRevenue} />
          </div>

          <RecentPayments
            data={list.data}
            isLoading={list.isLoading}
            isError={list.isError}
            page={page}
            setPage={setPage}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        <aside className="space-y-5">
          <Card>
            <CardTitle icon={Building2}>Revenue by Department</CardTitle>
            {(summary.data?.departments ?? []).length === 0 ? (
              <p className="py-6 text-center text-sm text-[#4a5568]">No revenue in this range.</p>
            ) : (
              <ul className="space-y-4">
                {summary.data.departments.map((d, i) => (
                  <li key={d.name}>
                    <div className="flex items-center gap-3">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${DEPT_TINTS[i % DEPT_TINTS.length]}`}><Receipt className="h-4 w-4" /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2 text-sm">
                          <span className="truncate text-[#4a5568]">{d.name}</span>
                          <span className="font-semibold text-[#0a1931]"><DollarAmount value={d.amount} compact /></span>
                        </div>
                        <div className="text-xs text-[#4a5568]">{d.share}%</div>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${DEPT_BARS[i % DEPT_BARS.length]}`} style={{ width: `${d.share}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <MonthlyRevenue monthly={summary.data?.monthly ?? []} />

          <Card>
            <CardTitle icon={Zap}>Quick Actions</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={exportCsv} disabled={exporting} className="flex flex-col items-start gap-2 rounded-xl bg-slate-50 p-3 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60">
                {exporting ? <Loader2 className="h-4 w-4 animate-spin text-[#0066fe]" /> : <Download className="h-4 w-4 text-[#0066fe]" />}
                Export Payments
              </button>
              <button onClick={() => { setStatusFilter("Refund Due"); setPage(1); }} className="flex flex-col items-start gap-2 rounded-xl bg-slate-50 p-3 text-left text-xs font-medium text-slate-700 hover:bg-slate-100">
                <RotateCcw className="h-4 w-4 text-[#0066fe]" />
                View Refunds Due
              </button>
              <button onClick={() => { setStatusFilter("Pending"); setPage(1); }} className="flex flex-col items-start gap-2 rounded-xl bg-slate-50 p-3 text-left text-xs font-medium text-slate-700 hover:bg-slate-100">
                <FileText className="h-4 w-4 text-[#0066fe]" />
                View Pending
              </button>
              <Link to="/dashboard/appointment-management" className="flex flex-col items-start gap-2 rounded-xl bg-slate-50 p-3 text-left text-xs font-medium text-slate-700 hover:bg-slate-100">
                <ArrowRight className="h-4 w-4 text-[#0066fe]" />
                Appointments
              </Link>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
