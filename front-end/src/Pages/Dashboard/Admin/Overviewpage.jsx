import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    Users,
    Stethoscope,
    CalendarDays,
    ClipboardCheck,
    MessageSquareText,
    ArrowRight,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    UserPlus,
    FileText,
    Settings,
    ShieldCheck,
    Wallet,
    Loader2,
} from "lucide-react";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&seed=";

const rangeOptions = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 14 Days", days: 14 },
];

const DEPT_COLORS = [
    "from-blue-600 to-blue-500",
    "from-emerald-500 to-emerald-400",
    "from-violet-500 to-violet-400",
    "from-orange-400 to-orange-300",
    "from-pink-500 to-pink-400",
    "from-slate-400 to-slate-300",
];

function formatShort(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function formatLong(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function timeAgo(iso) {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Avatar({ name, size = "h-10 w-10", text = "text-xs" }) {
    const img = `${DEFAULT_AVATAR}${encodeURIComponent(name || "User")}`;
    return <img src={img} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />;
}

function Card({ children, className = "" }) {
    return (
        <section className={`rounded-2xl border border-blue-100/70 bg-white p-4 shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] sm:p-5 ${className}`}>
            {children}
        </section>
    );
}

function CardTitle({ children, action }) {
    return (
        <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold text-[#0A1931]">{children}</h2>
            {action}
        </div>
    );
}

function ViewAll({ to = "#" }) {
    return (
        <Link to={to} className="inline-flex items-center gap-1 rounded text-xs font-medium text-[#0066FE] hover:text-blue-700">
            View All <ArrowRight className="h-3 w-3" />
        </Link>
    );
}

const STATUS_STYLES = {
    confirmed: { label: "Confirmed", className: "bg-emerald-100 text-emerald-600" },
    pending_payment: { label: "Payment Pending", className: "bg-amber-100 text-amber-600" },
    completed: { label: "Completed", className: "bg-sky-100 text-sky-700" },
    cancelled: { label: "Cancelled", className: "bg-rose-100 text-rose-600" },
    expired: { label: "Expired", className: "bg-slate-100 text-slate-500" },
};

function StatusBadge({ status }) {
    const s = STATUS_STYLES[status] || { label: status, className: "bg-slate-100 text-slate-500" };
    return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${s.className}`}>{s.label}</span>;
}

/* ------------------------------------------------------------------ */
/* Header + stats                                                      */
/* ------------------------------------------------------------------ */

function PageHeader() {
    return (
        <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-[#0A1931]">Overview</h1>
                <p className="mt-1 text-sm text-[#4A5568]">Here's what's happening with your healthcare system today.</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-3 rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-[#0A1931] shadow-sm">
                    <CalendarDays className="h-4 w-4 text-[#0066FE]" />
                    {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-600 shadow-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    System Online
                </span>
            </div>
        </header>
    );
}

function StatCard({ label, value, note, icon: Icon, card, iconBg }) {
    return (
        <div className={`rounded-2xl border p-4 ${card}`}>
            <div className="flex items-center gap-3">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[#4A5568]">{label}</p>
                    <p className="text-2xl font-bold leading-tight text-[#0A1931]">{value}</p>
                </div>
            </div>
            <p className="mt-3 text-xs text-[#4A5568]">{note}</p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Trend chart (real data, dynamic scale)                              */
/* ------------------------------------------------------------------ */

const W = 520, H = 260, M = { l: 40, r: 16, t: 14, b: 30 };

function smoothPath(pts) {
    if (pts.length < 2) return "";
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
    }
    return d;
}

function TrendChart({ trend, days, onDaysChange }) {
    const [hover, setHover] = useState(null);
    const n = trend.length || 1;
    const yMax = Math.max(5, ...trend.map((d) => Math.max(d.patients, d.appointments))) * 1.2;
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(yMax * f));

    const plotW = W - M.l - M.r, plotH = H - M.t - M.b, pad = 14;
    const x = (i) => M.l + pad + ((plotW - pad * 2) * i) / Math.max(n - 1, 1);
    const y = (v) => M.t + plotH * (1 - v / yMax);
    const baseY = y(0);

    const patientPts = trend.map((d, i) => ({ x: x(i), y: y(d.patients) }));
    const apptPts = trend.map((d, i) => ({ x: x(i), y: y(d.appointments) }));
    const patientLine = smoothPath(patientPts);
    const apptLine = smoothPath(apptPts);
    const area = (line, pts) => (pts.length ? `${line} L${pts[pts.length - 1].x},${baseY} L${pts[0].x},${baseY} Z` : "");

    const active = hover ?? n - 1;
    const point = trend[active];

    const onMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * W;
        let nearest = 0, best = Infinity;
        for (let i = 0; i < n; i++) {
            const dist = Math.abs(x(i) - px);
            if (dist < best) { best = dist; nearest = i; }
        }
        setHover(nearest);
    };

    const tooltipOnLeft = active > n / 2;

    if (!point) {
        return (
            <Card>
                <CardTitle>Patient &amp; Appointment Overview</CardTitle>
                <p className="py-10 text-center text-sm text-slate-400">No data yet.</p>
            </Card>
        );
    }

    return (
        <Card>
            <CardTitle
                action={
                    <div className="relative">
                        <select
                            aria-label="Chart range"
                            value={days}
                            onChange={(e) => { onDaysChange(Number(e.target.value)); setHover(null); }}
                            className="h-9 appearance-none rounded-lg border border-blue-100 bg-white pl-3 pr-8 text-xs text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            {rangeOptions.map((o) => <option key={o.days} value={o.days}>{o.label}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    </div>
                }
            >
                Patient &amp; Appointment Overview
            </CardTitle>

            <ul className="mb-2 flex items-center gap-5 text-xs text-slate-600">
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0066FE]" /> Unique Patients</li>
                <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Appointments</li>
            </ul>

            <div className="relative">
                <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={`Patients and appointments over the last ${days} days`} onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
                    <defs>
                        <linearGradient id="fill-patients" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="fill-appts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {yTicks.map((t) => (
                        <g key={t}>
                            <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeDasharray="3 4" />
                            <text x={M.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{t}</text>
                        </g>
                    ))}

                    <path d={area(patientLine, patientPts)} fill="url(#fill-patients)" />
                    <path d={area(apptLine, apptPts)} fill="url(#fill-appts)" />
                    <path d={patientLine} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                    <path d={apptLine} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1={x(active)} x2={x(active)} y1={M.t} y2={baseY} stroke="#93c5fd" strokeDasharray="3 3" />

                    {trend.map((d, i) => (
                        <g key={d.date}>
                            <circle cx={x(i)} cy={y(d.patients)} r={i === active ? 5 : 3.5} fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                            <circle cx={x(i)} cy={y(d.appointments)} r={i === active ? 5 : 3.5} fill="#fff" stroke="#10b981" strokeWidth="2" />
                            {(n <= 8 || i % 2 === 0) && (
                                <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#64748b">{formatShort(d.date)}</text>
                            )}
                            <rect x={x(i) - plotW / n / 2} y={M.t} width={plotW / n} height={plotH} fill="transparent" tabIndex={0} role="button"
                                aria-label={`${formatLong(d.date)}: ${d.patients} patients, ${d.appointments} appointments`}
                                onFocus={() => setHover(i)} onBlur={() => setHover(null)} className="outline-none" />
                        </g>
                    ))}
                </svg>

                <div
                    className="pointer-events-none absolute z-10 w-40 rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs shadow-lg"
                    style={{ left: `${(x(active) / W) * 100}%`, top: `${(y(point.patients) / H) * 100}%`, transform: tooltipOnLeft ? "translate(-108%, -20%)" : "translate(8%, -20%)" }}
                >
                    <p className="mb-1 text-[#4A5568]">{formatLong(point.date)}</p>
                    <p className="flex items-center justify-between gap-2 text-[#0A1931]">
                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#0066FE]" /> Patients</span>
                        <span className="font-semibold">{point.patients}</span>
                    </p>
                    <p className="flex items-center justify-between gap-2 text-[#0A1931]">
                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Appointments</span>
                        <span className="font-semibold">{point.appointments}</span>
                    </p>
                </div>
            </div>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Patient mix donut (replaces the unsupported "gender" chart)          */
/* ------------------------------------------------------------------ */

function PatientMixCard({ patientMix }) {
    const R = 48, C = 2 * Math.PI * R;
    const total = patientMix.new + patientMix.returning || 1;
    const segs = [
        { label: "New Patients", count: patientMix.new, color: "#2563eb", dot: "bg-blue-600" },
        { label: "Returning Patients", count: patientMix.returning, color: "#2dd4bf", dot: "bg-teal-400" },
    ];
    let acc = 0;
    const arcs = segs.map((s) => {
        const pct = (s.count / total) * 100;
        const len = (pct / 100) * C;
        const seg = { ...s, pct, len: Math.max(len - 1.5, 0), offset: acc };
        acc += len;
        return seg;
    });

    return (
        <Card>
            <CardTitle>Patient Mix</CardTitle>
            <div className="relative mx-auto h-44 w-44">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="New vs returning patients">
                    {arcs.map((s) => (
                        <circle key={s.label} cx="60" cy="60" r={R} fill="none" stroke={s.color} strokeWidth="16" strokeDasharray={`${s.len} ${C - s.len}`} strokeDashoffset={-s.offset} />
                    ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-[#0A1931]">{total}</span>
                    <span className="text-[11px] text-[#4A5568]">Patients (7d)</span>
                </div>
            </div>
            <ul className="mt-5 space-y-2.5 text-sm">
                {arcs.map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                        <span className="flex-1 text-[#4A5568]">{s.label}</span>
                        <span className="font-semibold text-[#0A1931]">{s.count}</span>
                        <span className="w-12 text-right text-xs text-[#4A5568]">{s.pct.toFixed(0)}%</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Recent appointments                                                 */
/* ------------------------------------------------------------------ */

function RecentAppointments({ appointments }) {
    console.log(appointments);
    return (
        <Card>
            <CardTitle action={<ViewAll to="/dashboard/appointment-management" />}>Recent Appointments</CardTitle>

            {appointments.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">No appointments yet.</p>
            ) : (
                <>
                    {/* Mobile */}
                    <div className="space-y-3 sm:hidden">
                        {appointments.map((a) => (
                            <div key={a._id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                                <div className="flex items-center gap-3">
                                    <Avatar name={a.patientName} size="h-9 w-9" text="text-[10px]" />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-semibold text-blue-950">{a.patientName || "Patient"}</p>
                                        <p className="text-[10px] text-[#4A5568]">#{String(a._id).slice(-6)}</p>
                                    </div>
                                    <StatusBadge status={a.status} />
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                                    <div className="min-w-0">
                                        <p className="mb-1 text-[9px] font-medium uppercase tracking-wide text-[#4A5568]">Doctor</p>
                                        <p className="truncate text-[11px] font-semibold text-blue-950">{a.doctorName}</p>
                                        <p className="truncate text-[9px] text-[#4A5568]">{a.doctorDepartment}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-[9px] font-medium uppercase tracking-wide text-[#4A5568]">Date & Time</p>
                                        <p className="text-[11px] text-[#0A1931]">{formatLong(a.date)}</p>
                                        <p className="text-[9px] text-[#4A5568]">{a.time_slot}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop */}
                    <div className="hidden overflow-x-auto sm:block">
                        <table className="w-full min-w-[520px] border-separate border-spacing-0 text-left">
                            <thead>
                                <tr className="text-xs font-semibold text-[#4A5568]">
                                    <th className="border-b border-slate-100 pb-2 pr-3">Patient</th>
                                    <th className="border-b border-slate-100 pb-2 pr-3">Doctor</th>
                                    <th className="border-b border-slate-100 pb-2 pr-3">Date &amp; Time</th>
                                    <th className="border-b border-slate-100 pb-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((a) => (
                                    <tr key={a._id}>
                                        <td className="border-b border-slate-50 py-2.5 pr-3">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar name={a.patientName} />
                                                <div>
                                                    <p className="text-xs font-semibold text-blue-950">{a.patientName || "Patient"}</p>
                                                    <p className="text-[10px] text-slate-400">#{String(a._id).slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-b border-slate-50 py-2.5 pr-3">
                                            <p className="text-xs font-semibold text-[#0A1931]">{a.doctorName}</p>
                                            <p className="text-[10px] text-[#4A5568]">{a.doctorDepartment}</p>
                                        </td>
                                        <td className="border-b border-slate-50 py-2.5 pr-3">
                                            <p className="text-xs text-[#0A1931]">{formatLong(a.date)}</p>
                                            <p className="text-[10px] text-[#4A5568]">{a.time_slot}</p>
                                        </td>
                                        <td className="border-b border-slate-50 py-2.5"><StatusBadge status={a.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Department chart                                                    */
/* ------------------------------------------------------------------ */

function useElementWidth() {
    const ref = useRef(null);
    const [width, setWidth] = useState(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        setWidth(el.getBoundingClientRect().width);
        if (typeof ResizeObserver === "undefined") return undefined;
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return [ref, width];
}

const COMPACT_BELOW = 440;

function DepartmentChart({ departments }) {
    const [ref, width] = useElementWidth();
    const compact = width !== null && width < COMPACT_BELOW;
    const max = Math.max(5, ...departments.map((d) => d.value));
    const ticks = [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0];
    const columns = { gridTemplateColumns: `repeat(${departments.length || 1}, minmax(0, 1fr))` };

    return (
        <Card>
            <CardTitle>Appointments by Department</CardTitle>
            <div ref={ref}>
                {departments.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">No data yet.</p>
                ) : compact ? (
                    <ul className="space-y-3">
                        {departments.map((d, i) => (
                            <li key={d.name} className="flex items-center gap-3 text-xs">
                                <span className="w-28 shrink-0 truncate text-[#4A5568]" title={d.name}>{d.name}</span>
                                <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div className={`h-full rounded-full bg-gradient-to-r ${DEPT_COLORS[i % DEPT_COLORS.length]}`} style={{ width: `${(d.value / max) * 100}%` }} />
                                </div>
                                <span className="w-7 shrink-0 text-right font-semibold text-[#0A1931]">{d.value}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex gap-2">
                        <div className="relative h-40 w-6 shrink-0 text-[10px] text-[#4A5568]" aria-hidden="true">
                            {ticks.map((t, i) => (
                                <span key={i} className="absolute right-0 -translate-y-1/2" style={{ top: `${100 - (t / max) * 100}%` }}>{t}</span>
                            ))}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="relative h-40">
                                {ticks.map((t, i) => (
                                    <div key={i} className="absolute inset-x-0 border-t border-dashed border-slate-100" style={{ top: `${100 - (t / max) * 100}%` }} />
                                ))}
                                <div className="relative grid h-full gap-1.5" style={columns}>
                                    {departments.map((d, i) => (
                                        <div key={d.name} className="flex h-full min-w-0 flex-col items-center justify-end">
                                            <span className="mb-1 text-[11px] font-semibold text-[#0A1931]">{d.value}</span>
                                            <div className={`w-full max-w-[34px] rounded-t-md bg-gradient-to-b ${DEPT_COLORS[i % DEPT_COLORS.length]}`} style={{ height: `${(d.value / max) * 100}%` }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-2 grid gap-1.5" style={columns}>
                                {departments.map((d) => (
                                    <p key={d.name} className="min-w-0 text-center text-[10px] leading-tight text-[#4A5568] [overflow-wrap:anywhere]">{d.name}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

function SecurityBanner() {
    return (
        <Card className="!p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066FE] sm:h-9 sm:w-9">
                    <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
                </span>
                <div>
                    <h3 className="text-sm font-bold text-[#0A1931]">Keep Your System Secure</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#4A5568]">Regular backups and updates keep your data safe.</p>
                </div>
                <button type="button" className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#0066FE] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto">
                    System Settings <ArrowRight className="h-3 w-3" />
                </button>
            </div>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Right column                                                        */
/* ------------------------------------------------------------------ */

const ACTIVITY_ICON = { appointment: CalendarDays, record: FileText, doctor: Stethoscope };
const ACTIVITY_TINT = {
    appointment: "bg-blue-100 text-blue-600",
    record: "bg-indigo-100 text-indigo-600",
    doctor: "bg-emerald-100 text-emerald-600",
};

function RecentActivities({ activity }) {
    return (
        <Card>
            <CardTitle>Recent Activities</CardTitle>
            {activity.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">No recent activity.</p>
            ) : (
                <ul className="divide-y divide-slate-100">
                    {activity.map((a, i) => {
                        const Icon = ACTIVITY_ICON[a.type] || Settings;
                        const tint = ACTIVITY_TINT[a.type] || "bg-slate-100 text-slate-600";
                        return (
                            <li key={i} className="flex items-center gap-3 py-3">
                                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tint}`}>
                                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-[#0A1931]">{a.title}</p>
                                    <p className="truncate text-[11px] text-[#4A5568]">{a.detail}</p>
                                </div>
                                <span className="shrink-0 text-[10px] text-[#4A5568]">{timeAgo(a.time)}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
}

function QuickActions() {
    const actions = [
        { label: "Add New Doctor", icon: UserPlus, to: "/dashboard/adddoctor" },
        { label: "Manage Patients", icon: Users, to: "/dashboard/patient-management" },
        { label: "Manage Appointments", icon: CalendarDays, to: "/dashboard/appointment-management" },
        { label: "Payments & Revenue", icon: Wallet, to: "/dashboard/payments-revenue" },
    ];
    return (
        <Card>
            <CardTitle>Quick Actions</CardTitle>
            <ul className="space-y-2">
                {actions.map(({ label, icon: Icon, to }) => (
                    <li key={label}>
                        <Link to={to} className="flex w-full items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-3 text-left text-sm font-medium text-[#0A1931] transition hover:border-blue-300 hover:bg-blue-50">
                            <Icon className="h-5 w-5 text-[#0066FE]" strokeWidth={1.75} />
                            <span className="flex-1">{label}</span>
                            <ChevronRight className="h-4 w-4 text-[#4A5568]" />
                        </Link>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function OverviewPage() {
    const axiosSecure = useAxiosSecure();
    const [days, setDays] = useState(7);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-dashboard", days],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/dashboard/admin", { params: { days } });
            return res.data;
        },
    });

    console.log(data)

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-[#0066FE]" />
            </div>
        );
    }

    const s = data?.stats ?? { totalPatients: 0, totalDoctors: 0, todaysAppointments: 0, totalPrescriptions: 0, pendingReplies: 0 };
    const trend = data?.trend ?? [];
    const departments = data?.departments ?? [];
    const patientMix = data?.patientMix ?? { new: 0, returning: 0 };
    const recentAppointments = data?.recentAppointments ?? [];
    const activity = data?.activity ?? [];

    const stats = [
        { label: "Total Patients", value: s.totalPatients, note: "Registered on the platform", icon: Users, card: "bg-blue-50/80 border-blue-100", iconBg: "bg-blue-100 text-blue-600" },
        { label: "Total Doctors", value: s.totalDoctors, note: "Active provider accounts", icon: Stethoscope, card: "bg-emerald-50/80 border-emerald-100", iconBg: "bg-emerald-100 text-emerald-600" },
        { label: "Today's Appointments", value: s.todaysAppointments, note: "Scheduled for today", icon: CalendarDays, card: "bg-violet-50/80 border-violet-100", iconBg: "bg-violet-100 text-violet-600" },
        { label: "Total Prescriptions", value: s.totalPrescriptions, note: "All time", icon: ClipboardCheck, card: "bg-orange-50/80 border-orange-100", iconBg: "bg-orange-100 text-orange-500" },
        { label: "Pending Replies", value: s.pendingReplies, note: "Doctors yet to respond", icon: MessageSquareText, card: "bg-rose-50/80 border-rose-100", iconBg: "bg-rose-100 text-rose-500" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b p-4 font-sans text-[#4A5568] sm:p-6">
            <div className="mx-auto max-w-[1440px] space-y-5">
                <PageHeader />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {stats.map((s) => <StatCard key={s.label} {...s} />)}
                </div>

                <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="min-w-0 space-y-5">
                        <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
                            <TrendChart trend={trend} days={days} onDaysChange={setDays} />
                            <PatientMixCard patientMix={patientMix} />
                        </div>

                        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
                            <RecentAppointments appointments={recentAppointments} />
                            <div className="space-y-5">
                                <DepartmentChart departments={departments} />
                                <SecurityBanner />
                            </div>
                        </div>
                    </div>

                    <aside className="min-w-0 space-y-5">
                        <RecentActivities activity={activity} />
                        <QuickActions />
                    </aside>
                </div>
            </div>
        </div>
    );
}
