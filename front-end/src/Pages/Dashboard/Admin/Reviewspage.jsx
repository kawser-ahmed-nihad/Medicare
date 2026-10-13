import React, { useMemo, useState } from "react";
import {
    Search,
    Star,
    Smile,
    Meh,
    Frown,
    Download,
    Zap,
    BarChart3,
    MessageSquare,
    CalendarDays,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ArrowUp,
    ArrowDown,
    ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const TOTAL_REVIEWS = 1248;
const PAGE_SIZE = 10;
const TOTAL_PAGES = Math.ceil(TOTAL_REVIEWS / PAGE_SIZE);

const reviews = [
    { id: 1, patient: "Sarah Ahmed", pid: "P001234", doctor: "Dr. Robert Smith", dept: "Cardiology", rating: 5, text: "Very good service and friendly staff. Highly recommended!", at: "2025-07-12T09:45", status: "Approved" },
    { id: 2, patient: "Mohammad Hasan", pid: "P001233", doctor: "Dr. Ayesha Khan", dept: "Pediatrics", rating: 4, text: "The doctor was helpful, but the waiting time was long.", at: "2025-07-11T14:30", status: "Approved" },
    { id: 3, patient: "Fatema Akter", pid: "P001232", doctor: "Dr. Tanvir Hasan", dept: "General Physician", rating: 5, text: "Excellent experience. Clean environment.", at: "2025-07-10T11:15", status: "Approved" },
    { id: 4, patient: "Rafiq Islam", pid: "P001231", doctor: "Dr. Farhana Akter", dept: "Gynecology", rating: 4, text: "Good consultation and proper guidance.", at: "2025-07-09T16:20", status: "Approved" },
    { id: 5, patient: "Lamia Akter", pid: "P001230", doctor: "Dr. Shakib Hasan", dept: "Orthopedics", rating: 4, text: "Very satisfied with the treatment. Thank you doctor!", at: "2025-07-08T10:00", status: "Approved" },
    { id: 6, patient: "Shakib Hossain", pid: "P001229", doctor: "Dr. Nabila Rahman", dept: "Dermatology", rating: 4, text: "Nice behavior and proper suggestions.", at: "2025-07-07T17:45", status: "Approved" },
    { id: 7, patient: "Nusrat Jahan", pid: "P001228", doctor: "Dr. Hasan Mahmud", dept: "Gastroenterology", rating: 3, text: "It was okay, but need more time for the treatment.", at: "2025-07-06T12:30", status: "Pending" },
    { id: 8, patient: "Imran Hossain", pid: "P001227", doctor: "Dr. Ayesha Khan", dept: "Neurology", rating: 5, text: "Great doctor and very professional.", at: "2025-07-05T09:10", status: "Approved" },
    { id: 9, patient: "Shahana Akter", pid: "P001226", doctor: "Dr. Robert Smith", dept: "Cardiology", rating: 4, text: "Good but the clinic was a bit crowded.", at: "2025-07-04T15:00", status: "Approved" },
    { id: 10, patient: "Tania Rahman", pid: "P001225", doctor: "Dr. Farhana Akter", dept: "Gynecology", rating: 5, text: "Amazing service! Very kind and supportive.", at: "2025-07-03T11:20", status: "Approved" },
];

const stats = [
    { label: "Total Reviews", value: "1,248", change: "12%", up: true, icon: Star, tint: "bg-blue-100 text-blue-600", filled: true },
    { label: "Positive Reviews", value: "1,032", change: "16%", up: true, icon: Smile, tint: "bg-emerald-100 text-emerald-600" },
    { label: "Neutral Reviews", value: "142", change: "5%", up: true, icon: Meh, tint: "bg-amber-100 text-amber-500" },
    { label: "Negative Reviews", value: "74", change: "8%", up: false, icon: Frown, tint: "bg-rose-100 text-rose-500" },
];

const ratingDistribution = [
    { stars: 5, pct: 72, color: "bg-emerald-500" },
    { stars: 4, pct: 18, color: "bg-blue-500" },
    { stars: 3, pct: 6, color: "bg-amber-400" },
    { stars: 2, pct: 2, color: "bg-orange-400" },
    { stars: 1, pct: 2, color: "bg-rose-500" },
];

const deptRatings = [
    { name: "Cardiology", value: 4.8, color: "bg-emerald-500" },
    { name: "Neurology", value: 4.6, color: "bg-blue-500" },
    { name: "Orthopedics", value: 4.4, color: "bg-violet-500" },
    { name: "Dermatology", value: 4.3, color: "bg-orange-400" },
    { name: "Gynecology", value: 4.2, color: "bg-rose-500" },
    { name: "Pediatrics", value: 4.1, color: "bg-cyan-400" },
];

const recentFeedback = [
    { name: "Sarah Ahmed", rating: 5, text: "Very good service and friendly staff. Highly recommended!", time: "2 hours ago", dept: "Cardiology", tone: "bg-blue-100 text-blue-700" },
    { name: "Mohammad Hasan", rating: 4, text: "The doctor was helpful, but the waiting time was long.", time: "4 hours ago", dept: "Neurology", tone: "bg-teal-100 text-teal-700" },
    { name: "Fatema Akter", rating: 5, text: "Excellent experience. Clean environment and professional staff.", time: "6 hours ago", dept: "Dermatology", tone: "bg-pink-100 text-pink-600" },
];

// Placeholder daily review counts for June 12–July 12, 2025; replace with data from the reviews API.
const TREND_START = new Date(2025, 5, 12);
const trendDays = Array.from({ length: 31 }, (_, i) => {
    const date = new Date(TREND_START);
    date.setDate(TREND_START.getDate() + i);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return {
        iso,
        date,
        positive: Math.round(45 + i * 2.7 + 12 * Math.sin(i * 1.3) + 6 * Math.cos(i * 2.1)),
        neutral: Math.round(14 + 5 * Math.sin(i * 0.9 + 1)),
        negative: Math.round(7 + 3 * Math.cos(i * 1.1)),
    };
});

const ALL_DEPTS = "All Departments";
const ALL_RATINGS = "All Ratings";
const departmentOptions = [ALL_DEPTS, ...Array.from(new Set(reviews.map((r) => r.dept)))];
const ratingOptions = [ALL_RATINGS, "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"];

const defaultRange = { from: "2025-06-12", to: "2025-07-12" };

/* ------------------------------------------------------------------ */
/* Helpers + building blocks                                           */
/* ------------------------------------------------------------------ */

const AVATAR_TONES = [
    "from-sky-400 to-blue-500",
    "from-teal-400 to-emerald-500",
    "from-indigo-400 to-violet-500",
    "from-rose-400 to-pink-500",
    "from-amber-400 to-orange-500",
];

function Avatar({ name, src, size = "h-10 w-10", text = "text-xs" }) {
    const initials = name
        .replace(/^Dr\.\s*/, "")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("");
    const tone = AVATAR_TONES[name.length % AVATAR_TONES.length];
    if (src) return <img src={src} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />;
    return (
        <div
            aria-hidden="true"
            className={`${size} ${text} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tone} font-semibold text-white`}
        >
            {initials}
        </div>
    );
}

function Card({ children, className = "" }) {
    return (
        <section
            className={`rounded-2xl border border-blue-100/70 bg-white p-5 shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}
        >
            {children}
        </section>
    );
}

function CardTitle({ icon: Icon, children, action }) {
    return (
        <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2.5 text-[15px] font-bold text-blue-950">
                {Icon && <Icon className="h-5 w-5 text-blue-600" strokeWidth={1.75} />}
                {children}
            </h2>
            {action}
        </div>
    );
}

/** Stars with fractional fill, e.g. value=4.6 */
function Stars({ value, size = "h-3.5 w-3.5" }) {
    const row = (cls) =>
        Array.from({ length: 5 }, (_, i) => <Star key={i} className={`${size} shrink-0 fill-current ${cls}`} strokeWidth={0} />);
    return (
        <span className="relative inline-flex" role="img" aria-label={`${value} out of 5 stars`}>
            <span className="flex text-slate-200">{row("")}</span>
            <span className="absolute inset-y-0 left-0 flex overflow-hidden text-amber-400" style={{ width: `${(value / 5) * 100}%` }}>
                {row("")}
            </span>
        </span>
    );
}

const fieldClass =
    "h-11 w-full rounded-lg border border-blue-100 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200";

function Select({ label, value, onChange, options, className = "" }) {
    return (
        <div className={`relative ${className}`}>
            <select
                aria-label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${fieldClass} appearance-none pl-3 pr-9`}
            >
                {options.map((o) => (
                    <option key={o}>{o}</option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
    );
}

function TrendBadge({ up, children }) {
    const Trend = up ? ArrowUp : ArrowDown;
    return (
        <span className={`inline-flex items-center text-xs font-semibold ${up ? "text-emerald-500" : "text-rose-500"}`}>
            <Trend className="h-3 w-3" strokeWidth={3} />
            {children}
        </span>
    );
}

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

/* ------------------------------------------------------------------ */
/* Header + stats                                                      */
/* ------------------------------------------------------------------ */

function PageHeader({ range, setRange, onExport }) {
    return (
        <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-blue-950">Reviews &amp; Feedback</h1>
                <p className="mt-1 text-sm text-slate-500">View patient reviews and feedback about doctors and services.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200">
                    <CalendarDays className="h-4 w-4 shrink-0 text-blue-600" />
                    <input
                        type="date"
                        aria-label="From date"
                        value={range.from}
                        max={range.to || undefined}
                        onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
                        className="h-10 w-[118px] bg-transparent text-xs text-slate-600 focus:outline-none"
                    />
                    <span className="text-slate-400">&ndash;</span>
                    <input
                        type="date"
                        aria-label="To date"
                        value={range.to}
                        min={range.from || undefined}
                        onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
                        className="h-10 w-[118px] bg-transparent text-xs text-slate-600 focus:outline-none"
                    />
                </div>
                <button
                    type="button"
                    onClick={onExport}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                >
                    <Download className="h-4 w-4" />
                    Export Report
                </button>
            </div>
        </header>
    );
}

function StatCard({ label, value, change, up, icon: Icon, tint, filled }) {
    return (
        <Card className="flex items-center gap-4 !p-4">
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tint}`}>
                <Icon className={`h-7 w-7 ${filled ? "fill-current" : ""}`} strokeWidth={filled ? 0 : 1.75} />
            </span>
            <div>
                <p className="text-xs font-semibold text-slate-700">{label}</p>
                <p className="text-3xl font-bold leading-tight text-blue-950">{value}</p>
                <p className="flex items-center gap-1.5 text-xs">
                    <TrendBadge up={up}>{change}</TrendBadge>
                    <span className="text-slate-500">from last month</span>
                </p>
            </div>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Review trends chart                                                 */
/* ------------------------------------------------------------------ */

const W = 640;
const H = 250;
const M = { l: 38, r: 12, t: 12, b: 28 };
const Y_MAX = 200;
const Y_TICKS = [0, 50, 100, 150, 200];

function smoothPath(pts) {
    if (pts.length < 2) return "";
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        d += ` C${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
    }
    return d;
}

function ReviewTrends({ range }) {
    const [hover, setHover] = useState(null);

    const data = useMemo(
        () => trendDays.filter((d) => (!range.from || d.iso >= range.from) && (!range.to || d.iso <= range.to)),
        [range]
    );

    const n = data.length;
    const plotW = W - M.l - M.r;
    const plotH = H - M.t - M.b;
    const groupW = n ? plotW / n : plotW;
    const barW = Math.max(2, Math.min(7, groupW / 4));
    const x = (i) => M.l + groupW * (i + 0.5);
    const y = (v) => M.t + plotH * (1 - v / Y_MAX);
    const baseY = y(0);

    const totalPts = data.map((d, i) => ({ x: x(i), y: y(d.positive + d.neutral + d.negative) }));
    const step = Math.max(1, Math.ceil(n / 10));
    const active = hover !== null && hover < n ? hover : null;
    const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const legend = [
        ["Positive", "bg-emerald-500"],
        ["Neutral", "bg-amber-400"],
        ["Negative", "bg-rose-500"],
    ];

    return (
        <Card>
            <CardTitle
                action={
                    <ul className="flex items-center gap-4 text-xs text-slate-600">
                        {legend.map(([label, dot]) => (
                            <li key={label} className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 rounded-full ${dot}`} />
                                {label}
                            </li>
                        ))}
                    </ul>
                }
            >
                Review Trends
            </CardTitle>

            {n === 0 ? (
                <p className="py-16 text-center text-sm text-slate-400">No review data in this date range.</p>
            ) : (
                <div className="relative">
                    <svg
                        viewBox={`0 0 ${W} ${H}`}
                        className="block w-full"
                        role="img"
                        aria-label="Daily positive, neutral and negative review counts"
                        onMouseLeave={() => setHover(null)}
                    >
                        {Y_TICKS.map((t) => (
                            <g key={t}>
                                <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeDasharray="3 4" />
                                <text x={M.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
                                    {t}
                                </text>
                            </g>
                        ))}

                        {data.map((d, i) => (
                            <g key={d.iso} opacity={active === null || active === i ? 1 : 0.55}>
                                <rect x={x(i) - barW * 1.5 - 0.5} y={y(d.positive)} width={barW} height={baseY - y(d.positive)} rx="1.5" fill="#10b981" />
                                <rect x={x(i) - barW / 2} y={y(d.neutral)} width={barW} height={baseY - y(d.neutral)} rx="1.5" fill="#fbbf24" />
                                <rect x={x(i) + barW / 2 + 0.5} y={y(d.negative)} width={barW} height={baseY - y(d.negative)} rx="1.5" fill="#f43f5e" />
                                {i % step === 0 && (
                                    <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#64748b">
                                        {fmt(d.date)}
                                    </text>
                                )}
                            </g>
                        ))}

                        {n > 1 && <path d={smoothPath(totalPts)} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />}
                        {totalPts.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r={active === i ? 4.5 : 2.5} fill="#fff" stroke="#10b981" strokeWidth="1.5" />
                        ))}

                        {/* Hover / keyboard hit areas */}
                        {data.map((d, i) => (
                            <rect
                                key={`hit-${d.iso}`}
                                x={x(i) - groupW / 2}
                                y={M.t}
                                width={groupW}
                                height={plotH}
                                fill="transparent"
                                tabIndex={0}
                                role="button"
                                aria-label={`${fmt(d.date)}: ${d.positive} positive, ${d.neutral} neutral, ${d.negative} negative`}
                                onMouseEnter={() => setHover(i)}
                                onFocus={() => setHover(i)}
                                onBlur={() => setHover(null)}
                                className="outline-none"
                            />
                        ))}
                    </svg>

                    {active !== null && (
                        <div
                            className="pointer-events-none absolute z-10 w-36 rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs shadow-lg"
                            style={{
                                left: `${(x(active) / W) * 100}%`,
                                top: "8%",
                                transform: active > n / 2 ? "translateX(-108%)" : "translateX(8%)",
                            }}
                        >
                            <p className="mb-1 text-slate-500">
                                {data[active].date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                            {[
                                ["Positive", "bg-emerald-500", data[active].positive],
                                ["Neutral", "bg-amber-400", data[active].neutral],
                                ["Negative", "bg-rose-500", data[active].negative],
                            ].map(([label, dot, v]) => (
                                <p key={label} className="flex items-center justify-between gap-2 text-slate-700">
                                    <span className="flex items-center gap-1.5">
                                        <span className={`h-2 w-2 rounded-full ${dot}`} /> {label}
                                    </span>
                                    <span className="font-semibold">{v}</span>
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Rating overview                                                     */
/* ------------------------------------------------------------------ */

function RatingOverview() {
    const R = 48;
    const C = 2 * Math.PI * R;
    const average = 4.6;
    const filled = (average / 5) * C;

    return (
        <Card>
            <CardTitle>Rating Overview</CardTitle>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap">
                <div className="relative h-40 w-40 shrink-0">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`Average rating ${average} out of 5`}>
                        <circle cx="60" cy="60" r={R} fill="none" stroke="#d1fae5" strokeWidth="12" />
                        <circle
                            cx="60"
                            cy="60"
                            r={R}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${filled} ${C - filled}`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-blue-950">{average}</span>
                        <Stars value={average} size="h-3.5 w-3.5" />
                        <span className="mt-1 max-w-[80px] text-[10px] leading-tight text-slate-500">
                            Based on {TOTAL_REVIEWS.toLocaleString()} reviews
                        </span>
                    </div>
                </div>

                <ul className="min-w-[170px] flex-1 space-y-3">
                    {ratingDistribution.map(({ stars, pct, color }) => (
                        <li key={stars} className="flex items-center gap-2 text-xs">
                            <span className="flex w-7 items-center gap-0.5 font-medium text-slate-700">
                                {stars}
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                            </span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-8 text-right text-slate-500">{pct}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Reviews table                                                       */
/* ------------------------------------------------------------------ */

function Pagination({ page, setPage }) {
    const pages = [1, 2, 3, 4, 5, "\u2026", TOTAL_PAGES];
    const btn =
        "flex h-8 min-w-8 items-center justify-center rounded-md border px-1 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

    return (
        <nav aria-label="Pagination" className="flex items-center gap-1.5">
            <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage(page - 1)} className={`${btn} border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50`}>
                <ChevronLeft className="h-4 w-4" />
            </button>
            {pages.map((p, i) =>
                p === "\u2026" ? (
                    <span key={`gap-${i}`} className="px-1 text-slate-400">
                        &hellip;
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        aria-current={p === page ? "page" : undefined}
                        onClick={() => setPage(p)}
                        className={`${btn} ${p === page ? "border-blue-600 bg-blue-600 font-semibold text-white" : "border-slate-200 text-slate-600 hover:bg-blue-50"
                            }`}
                    >
                        {p}
                    </button>
                )
            )}
            <button type="button" aria-label="Next page" disabled={page === TOTAL_PAGES} onClick={() => setPage(page + 1)} className={`${btn} border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50`}>
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}

function ReviewsTable({ rows, filters, setFilters, isFiltered }) {
    const [page, setPage] = useState(1);
    const patch = (changes) => {
        setFilters((prev) => ({ ...prev, ...changes }));
        setPage(1);
    };

    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, TOTAL_REVIEWS);

    return (
        <Card>
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <h2 className="mr-auto text-[15px] font-bold text-blue-950">Patient Reviews &amp; Feedback</h2>
                <Select label="Department" value={filters.department} onChange={(v) => patch({ department: v })} options={departmentOptions} className="w-full sm:w-44" />
                <Select label="Rating" value={filters.rating} onChange={(v) => patch({ rating: v })} options={ratingOptions} className="w-full sm:w-36" />
                <label className="relative block w-full sm:w-72">
                    <span className="sr-only">Search reviews</span>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        value={filters.query}
                        onChange={(e) => patch({ query: e.target.value })}
                        placeholder="Search by patient name, doctor or review..."
                        className={`${fieldClass} pl-10 pr-3`}
                    />
                </label>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-left">
                    <thead>
                        <tr className="bg-blue-50/60 text-xs font-semibold text-slate-600">
                            <th className="w-10 rounded-l-lg px-4 py-3">#</th>
                            <th className="px-3 py-3">Patient</th>
                            <th className="px-3 py-3">Doctor</th>
                            <th className="px-3 py-3">Department</th>
                            <th className="px-3 py-3">Rating</th>
                            <th className="px-3 py-3">Review</th>
                            <th className="px-3 py-3">Date</th>
                            <th className="px-3 py-3">Status</th>
                            <th className="rounded-r-lg px-3 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={r.id}>
                                <td className="border-b border-slate-100 px-4 py-2.5 text-xs text-slate-500">{(page - 1) * PAGE_SIZE + i + 1}</td>
                                <td className="border-b border-slate-100 px-3 py-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <Avatar name={r.patient} size="h-9 w-9" />
                                        <div>
                                            <p className="text-xs font-semibold text-blue-950">{r.patient}</p>
                                            <p className="text-[10px] text-slate-400">#{r.pid}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-xs text-slate-700">{r.doctor}</td>
                                <td className="border-b border-slate-100 px-3 py-2.5 text-xs text-slate-600">{r.dept}</td>
                                <td className="border-b border-slate-100 px-3 py-2.5">
                                    <div className="flex items-center gap-1.5">
                                        <Stars value={r.rating} size="h-3 w-3" />
                                        <span className="text-xs font-semibold text-slate-700">{r.rating.toFixed(1)}</span>
                                    </div>
                                </td>
                                <td className="max-w-[240px] border-b border-slate-100 px-3 py-2.5 text-xs leading-snug text-blue-900/80">{r.text}</td>
                                <td className="whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-xs">
                                    <p className="text-slate-700">{formatDate(r.at)}</p>
                                    <p className="text-[10px] text-slate-400">{formatTime(r.at)}</p>
                                </td>
                                <td className="border-b border-slate-100 px-3 py-2.5">
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${r.status === "Approved" ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-orange-500"
                                            }`}
                                    >
                                        {r.status}
                                    </span>
                                </td>
                                <td className="border-b border-slate-100 px-3 py-2.5">
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            className="rounded-md border border-blue-300 px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                        >
                                            View
                                        </button>
                                        <button
                                            type="button"
                                            aria-label={`More options for review by ${r.patient}`}
                                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                        >
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {rows.length === 0 && (
                    <p className="py-16 text-center text-sm text-slate-400">
                        No reviews match these filters. Clear the search or widen the date range.
                    </p>
                )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                    {isFiltered
                        ? `Showing ${rows.length} matching reviews`
                        : `Showing ${start} - ${end} of ${TOTAL_REVIEWS.toLocaleString()} reviews`}
                </p>
                <Pagination page={page} setPage={setPage} />
            </div>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

function QuickStats() {
    return (
        <Card>
            <CardTitle icon={Zap}>Quick Stats</CardTitle>
            <ul className="divide-y divide-slate-100">
                {stats.map(({ label, value, change, up, icon: Icon, tint, filled }) => (
                    <li key={label} className="flex items-center gap-3 py-3">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tint}`}>
                            <Icon className={`h-5 w-5 ${filled ? "fill-current" : ""}`} strokeWidth={filled ? 0 : 1.75} />
                        </span>
                        <div className="flex-1">
                            <p className="text-xs text-slate-600">{label}</p>
                            <p className="text-xl font-bold leading-tight text-blue-950">{value}</p>
                        </div>
                        <TrendBadge up={up}>{change}</TrendBadge>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

function RatingByDepartment() {
    return (
        <Card>
            <CardTitle icon={BarChart3}>Rating by Department</CardTitle>
            <ul className="space-y-3">
                {deptRatings.map(({ name, value, color }) => (
                    <li key={name} className="flex items-center gap-3 text-xs">
                        <span className="w-[78px] shrink-0 text-slate-600">{name}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / 5) * 100}%` }} />
                        </div>
                        <span className="w-7 text-right font-semibold text-blue-950">{value.toFixed(1)}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

function RecentFeedback() {
    return (
        <Card>
            <CardTitle
                icon={MessageSquare}
                action={
                    <a
                        href="#"
                        className="inline-flex items-center gap-1 rounded text-xs font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                        View All <ArrowRight className="h-3 w-3" />
                    </a>
                }
            >
                Recent Feedback
            </CardTitle>
            <ul className="space-y-4">
                {recentFeedback.map((f) => (
                    <li key={f.name} className="flex gap-3">
                        <Avatar name={f.name} size="h-10 w-10" />
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-blue-950">{f.name}</p>
                            <div className="flex items-center gap-1.5">
                                <Stars value={f.rating} size="h-3 w-3" />
                                <span className="text-[11px] font-semibold text-slate-700">{f.rating.toFixed(1)}</span>
                            </div>
                            <p className="mt-1 text-xs leading-snug text-slate-600">{f.text}</p>
                            <div className="mt-1.5 flex items-center justify-between">
                                <span className="text-[11px] text-slate-400">{f.time}</span>
                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${f.tone}`}>{f.dept}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;

export default function ReviewsPage() {
    const [range, setRange] = useState(defaultRange);
    const [filters, setFilters] = useState({ query: "", department: ALL_DEPTS, rating: ALL_RATINGS });

    const rows = useMemo(() => {
        const q = filters.query.trim().toLowerCase();
        const stars = filters.rating === ALL_RATINGS ? null : Number(filters.rating[0]);
        return reviews.filter((r) => {
            if (q && ![r.patient, r.doctor, r.text].some((v) => v.toLowerCase().includes(q))) return false;
            if (filters.department !== ALL_DEPTS && r.dept !== filters.department) return false;
            if (stars && r.rating !== stars) return false;
            const day = r.at.slice(0, 10);
            if (range.from && day < range.from) return false;
            if (range.to && day > range.to) return false;
            return true;
        });
    }, [filters, range]);

    const exportCsv = () => {
        const header = ["Patient", "Patient ID", "Doctor", "Department", "Rating", "Review", "Date", "Status"];
        const lines = rows.map((r) =>
            [r.patient, r.pid, r.doctor, r.dept, r.rating, r.text, r.at, r.status].map(csvCell).join(",")
        );
        const blob = new Blob([[header.map(csvCell).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reviews-report.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#eef4ff] to-[#f6f9ff] p-4 font-sans text-slate-700 sm:p-6">
            <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
                <main className="space-y-5">
                    <PageHeader range={range} setRange={setRange} onExport={exportCsv} />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((s) => (
                            <StatCard key={s.label} {...s} />
                        ))}
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                        <ReviewTrends range={range} />
                        <RatingOverview />
                    </div>

                    <ReviewsTable rows={rows} filters={filters} setFilters={setFilters} isFiltered={rows.length !== reviews.length} />
                </main>

                <aside className="space-y-5">
                    <QuickStats />
                    <RatingByDepartment />
                    <RecentFeedback />
                </aside>
            </div>
        </div>
    );
}