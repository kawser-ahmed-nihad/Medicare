import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    Search,
    Filter,
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    LayoutGrid,
    List,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Download,
    Zap,
    Loader2,
    X,
    Phone,
    Wallet,
} from "lucide-react";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundColor=0066fe&textColor=ffffff&seed=";

const PAGE_SIZE = 10;

const ALL_STATUS = "All Status";
const ALL_DOCTORS = "All Doctors";
const ALL_SPECS = "All Specializations";
const statusOptions = [ALL_STATUS, "Upcoming", "Completed", "Pending Payment", "Cancelled"];

const emptyFilters = { query: "", status: ALL_STATUS, doctor: ALL_DOCTORS, specialty: ALL_SPECS, from: "", to: "" };

const statusStyles = {
    Completed: "bg-emerald-100 text-emerald-600",
    Upcoming: "bg-blue-100 text-[#0066fe]",
    "Pending Payment": "bg-amber-100 text-amber-600",
    "Awaiting Completion": "bg-orange-100 text-orange-500",
    Cancelled: "bg-rose-100 text-rose-500",
    Expired: "bg-slate-100 text-[#4a5568]",
};

const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function addMinutesTo12h(timeStr, durationMin) {
    const [time, period] = timeStr.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    let total = (h * 60 + m + Number(durationMin || 0)) % 1440;
    const eh = Math.floor(total / 60), em = total % 60;
    const ep = eh >= 12 ? "PM" : "AM";
    let eh12 = eh % 12; if (eh12 === 0) eh12 = 12;
    return `${pad(eh12)}:${pad(em)} ${ep}`;
}

/* ---------------- building blocks ---------------- */

function Avatar({ name, size = "h-10 w-10" }) {
    return <img src={`${DEFAULT_AVATAR}${encodeURIComponent(name || "User")}`} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />;
}

function Card({ children, className = "" }) {
    return (
        <section className={`rounded-2xl border border-blue-100/70 bg-white shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}>
            {children}
        </section>
    );
}

const fieldClass = "h-11 w-full rounded-lg border border-blue-100 bg-white text-sm text-[#0a1931] placeholder:text-[#4A5568] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200";

function SearchInput({ value, onChange, placeholder, className = "" }) {
    return (
        <label className={`relative block ${className}`}>
            <span className="sr-only">{placeholder}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5568]" />
            <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${fieldClass} pl-10 pr-3`} />
        </label>
    );
}

function Select({ label, value, onChange, options, className = "" }) {
    return (
        <div className={`relative ${className}`}>
            <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldClass} appearance-none pl-3 pr-9`}>
                {options.map((o) => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5568]" />
        </div>
    );
}

function DateRange({ from, to, onChange, className = "" }) {
    return (
        <div className={`flex items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 ${className}`}>
            <CalendarDays className="h-4 w-4 shrink-0 text-[#0066fe]" />
            <input type="date" aria-label="From date" value={from} max={to || undefined} onChange={(e) => onChange({ from: e.target.value })} className="h-11 min-w-0 flex-1 bg-transparent text-xs text-[#4a5568] focus:outline-none" />
            <span className="text-[#4A5568]">&ndash;</span>
            <input type="date" aria-label="To date" value={to} min={from || undefined} onChange={(e) => onChange({ to: e.target.value })} className="h-11 min-w-0 flex-1 bg-transparent text-xs text-[#4a5568] focus:outline-none" />
        </div>
    );
}

function Pill({ children, className }) {
    return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${className}`}>{children}</span>;
}

function pageList(page, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const set = new Set([1, total, page - 1, page, page + 1]);
    const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const out = [];
    nums.forEach((n, i) => { if (i > 0 && n - nums[i - 1] > 1) out.push("…"); out.push(n); });
    return out;
}

function Pagination({ page, setPage, totalPages }) {
    const btn = "flex h-8 min-w-8 items-center justify-center rounded-md border px-1 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";
    return (
        <nav aria-label="Pagination" className="flex items-center gap-1.5">
            <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage(page - 1)} className={`${btn} border-slate-200 text-[#4a5568] hover:bg-slate-50 disabled:opacity-50`}><ChevronLeft className="h-4 w-4" /></button>
            {pageList(page, totalPages).map((p, i) =>
                p === "…" ? <span key={`gap-${i}`} className="px-1 text-[#4A5568]">&hellip;</span> : (
                    <button key={p} type="button" aria-current={p === page ? "page" : undefined} onClick={() => setPage(p)} className={`${btn} ${p === page ? "border-[#0066fe] bg-[#0066fe] font-semibold text-white" : "border-slate-200 text-[#4a5568] hover:bg-blue-50"}`}>{p}</button>
                )
            )}
            <button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => setPage(page + 1)} className={`${btn} border-slate-200 text-[#4a5568] hover:bg-slate-50 disabled:opacity-50`}><ChevronRight className="h-4 w-4" /></button>
        </nav>
    );
}

/* ---------------- details modal ---------------- */

function AppointmentModal({ appointment: a, busy, error, onClose, onComplete, onCancel }) {
    const canComplete = a.status === "confirmed";
    const canCancel = ["confirmed", "pending_payment"].includes(a.status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1931]/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-base font-bold text-[#0a1931]">Appointment Details</h3>
                        <p className="text-xs text-[#4A5568]">#{a._id.slice(-6)}</p>
                    </div>
                    <button onClick={onClose} disabled={busy} className="text-[#4A5568] hover:text-[#4a5568]"><X size={18} /></button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[#4A5568]">Patient</p>
                        <div className="flex items-center gap-2">
                            <Avatar name={a.patientName} size="h-9 w-9" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#0a1931]">{a.patientName || "Patient"}</p>
                                {a.patientPhone && <p className="flex items-center gap-1 text-[11px] text-[#4a5568]"><Phone size={10} /> {a.patientPhone}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[#4A5568]">Doctor</p>
                        <div className="flex items-center gap-2">
                            <Avatar name={a.doctorName} size="h-9 w-9" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#0a1931]">{a.doctorName}</p>
                                {a.specialty && <p className="truncate text-[11px] text-[#4a5568]">{a.specialty}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3.5 text-sm">
                    <p className="flex justify-between"><span className="text-[#4A5568]">Date</span><span className="font-medium text-[#0a1931]">{formatDate(a.date)}</span></p>
                    <p className="flex justify-between"><span className="text-[#4A5568]">Time</span><span className="font-medium text-[#0a1931]">{a.time_slot} – {addMinutesTo12h(a.time_slot, a.duration_minutes)}</span></p>
                    <p className="flex justify-between"><span className="text-[#4A5568]">Fee</span><span className="font-medium text-[#0a1931]">৳{a.consultation_fee}</span></p>
                    <p className="flex justify-between"><span className="text-[#4A5568]">Payment</span><span className="font-medium text-[#0a1931]">{a.payment_method === "online" ? "Online" : "At hospital"} · {a.payment_status}</span></p>
                    <p className="flex justify-between"><span className="text-[#4A5568]">Status</span><Pill className={statusStyles[a.displayStatus]}>{a.displayStatus}</Pill></p>
                </div>

                {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}

                <div className="mt-5 flex gap-3">
                    {canCancel && (
                        <button onClick={onCancel} disabled={busy} className="flex-1 rounded-xl border border-rose-200 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60">Cancel Appointment</button>
                    )}
                    {canComplete && (
                        <button onClick={onComplete} disabled={busy} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                            {busy && <Loader2 size={14} className="animate-spin" />} Mark Completed
                        </button>
                    )}
                    {!canCancel && !canComplete && (
                        <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-[#4a5568] hover:bg-slate-50">Close</button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------------- header + stats ---------------- */

function StatCard({ label, value, note, icon: Icon, tint, card }) {
    return (
        <div className={`flex items-center gap-4 rounded-2xl border p-4 ${card}`}>
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tint}`}><Icon className="h-6 w-6" strokeWidth={1.75} /></span>
            <div>
                <p className="text-xs font-semibold text-[#0a1931]">{label}</p>
                <p className="text-3xl font-bold leading-tight text-[#0a1931]">{value}</p>
                <p className="text-xs text-[#4a5568]">{note}</p>
            </div>
        </div>
    );
}

/* ---------------- table ---------------- */

function AppointmentsTable({ rows, total, totalPages, page, setPage, filters, setFilters, doctorOptions, isLoading, isError, isFetching, onView }) {
    const [view, setView] = useState("list");
    const [selected, setSelected] = useState(() => new Set());

    const patch = (changes) => { setFilters((prev) => ({ ...prev, ...changes })); setPage(1); };

    const allSelected = rows.length > 0 && rows.every((a) => selected.has(a._id));
    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((a) => a._id)));
    const toggleOne = (id) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

    const ViewBtn = ({ a }) => (
        <button type="button" aria-label={`View appointment for ${a.patientName}`} onClick={() => onView(a)} className="flex h-8 w-8 items-center justify-center rounded-md text-[#0066fe] transition hover:bg-blue-50">
            <Eye className="h-[18px] w-[18px]" />
        </button>
    );

    return (
        <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
                <SearchInput value={filters.query} onChange={(v) => patch({ query: v })} placeholder="Search by patient, doctor name or appointment ID..." className="min-w-[220px] flex-1" />
                <Select label="Status" value={filters.status} onChange={(v) => patch({ status: v })} options={statusOptions} className="w-40" />
                <Select label="Doctor" value={filters.doctor} onChange={(v) => patch({ doctor: v })} options={doctorOptions} className="w-44" />
                <DateRange from={filters.from} to={filters.to} onChange={patch} className="w-full sm:w-[280px]" />
                <button type="button" aria-label={view === "list" ? "Switch to grid view" : "Switch to list view"} onClick={() => setView(view === "list" ? "grid" : "list")} className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[#0066fe] transition hover:bg-blue-100">
                    {view === "list" ? <LayoutGrid className="h-[18px] w-[18px]" /> : <List className="h-[18px] w-[18px]" />}
                </button>
            </div>

            {isLoading && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[#0066fe]" /></div>}
            {isError && <p className="py-10 text-center text-sm text-rose-500">Couldn't load appointments. Please try again.</p>}

            {!isLoading && !isError && view === "list" && (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[960px] border-separate border-spacing-0 text-left">
                        <thead>
                            <tr className="bg-blue-50/60 text-xs font-semibold text-[#4a5568]">
                                <th className="w-10 rounded-l-lg px-4 py-3"><input type="checkbox" aria-label="Select all appointments" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-[#0066fe] focus:ring-blue-400" /></th>
                                <th className="px-3 py-3">Patient</th>
                                <th className="px-3 py-3">Doctor</th>
                                <th className="px-3 py-3">Date &amp; Time</th>
                                <th className="px-3 py-3">Payment</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="rounded-r-lg px-3 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((a) => (
                                <tr key={a._id} className={selected.has(a._id) ? "bg-blue-50/40" : ""}>
                                    <td className="border-b border-slate-100 px-4 py-3"><input type="checkbox" aria-label={`Select appointment for ${a.patientName}`} checked={selected.has(a._id)} onChange={() => toggleOne(a._id)} className="h-4 w-4 rounded border-slate-300 text-[#0066fe] focus:ring-blue-400" /></td>
                                    <td className="border-b border-slate-100 px-3 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={a.patientName} size="h-11 w-11" />
                                            <div>
                                                <p className="text-sm font-semibold text-[#0a1931]">{a.patientName || "Patient"}</p>
                                                <p className="text-[10px] text-[#4A5568]">ID: #{a._id.slice(-6)}</p>
                                                {a.patientPhone && <p className="text-[10px] text-[#4A5568]">{a.patientPhone}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={a.doctorName} size="h-11 w-11" />
                                            <div>
                                                <p className="text-sm font-semibold text-[#0a1931]">{a.doctorName}</p>
                                                {a.specialty && <p className="text-[11px] text-[#4A5568]">{a.specialty}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap border-b border-slate-100 px-3 py-3 text-xs">
                                        <p className="font-medium text-[#0a1931]">{formatDate(a.date)}</p>
                                        <p className="text-[#4a5568]">{a.time_slot} – {addMinutesTo12h(a.time_slot, a.duration_minutes)}</p>
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-3 text-xs">
                                        <p className="flex items-center gap-1 font-medium text-[#0a1931]"><Wallet size={11} /> ৳{a.consultation_fee}</p>
                                        <p className="text-[#4A5568]">{a.payment_method === "online" ? "Online" : "At hospital"}</p>
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-3"><Pill className={statusStyles[a.displayStatus]}>{a.displayStatus}</Pill></td>
                                    <td className="border-b border-slate-100 px-3 py-3"><ViewBtn a={a} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && !isError && view === "grid" && (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {rows.map((a) => (
                        <li key={a._id} className="rounded-xl border border-blue-100 p-4">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <Avatar name={a.patientName} size="h-11 w-11" />
                                    <div>
                                        <p className="text-sm font-semibold text-[#0a1931]">{a.patientName || "Patient"}</p>
                                        <p className="text-[11px] text-[#4A5568]">#{a._id.slice(-6)}</p>
                                    </div>
                                </div>
                                <Pill className={statusStyles[a.displayStatus]}>{a.displayStatus}</Pill>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-[#4a5568]">
                                <Avatar name={a.doctorName} size="h-7 w-7" />
                                <span className="font-medium">{a.doctorName}</span>
                                {a.specialty && <span className="text-[#4A5568]">&bull; {a.specialty}</span>}
                            </div>
                            <p className="mt-2 text-xs text-[#4a5568]">{formatDate(a.date)} <span className="text-[#4A5568]">&bull;</span> {a.time_slot}</p>
                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                                <span className="text-xs text-[#4a5568]">৳{a.consultation_fee} · {a.payment_method === "online" ? "Online" : "At hospital"}</span>
                                <ViewBtn a={a} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && !isError && rows.length === 0 && (
                <p className="py-16 text-center text-sm text-[#4A5568]">No appointments match these filters. Clear the search or widen the date range.</p>
            )}

            {!isLoading && !isError && total > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[#4a5568]">
                        Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} appointments
                        {isFetching && <span className="ml-2 text-[#4A5568]">updating…</span>}
                        {selected.size > 0 && <span className="ml-2 font-medium text-[#0066fe]">{selected.size} selected</span>}
                    </p>
                    <Pagination page={page} setPage={setPage} totalPages={totalPages} />
                </div>
            )}
        </Card>
    );
}

/* ---------------- sidebar ---------------- */

function SidebarTitle({ icon: Icon, children }) {
    return (
        <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold text-[#0a1931]">
            <Icon className="h-5 w-5 text-[#0066fe]" strokeWidth={1.75} />
            {children}
        </h2>
    );
}

function LabeledField({ label, children }) {
    return (
        <div>
            <p className="mb-1.5 text-xs font-semibold text-[#0a1931]">{label}</p>
            {children}
        </div>
    );
}

function FilterPanel({ draft, setDraft, apply, reset, specOptions }) {
    const set = (changes) => setDraft((prev) => ({ ...prev, ...changes }));
    return (
        <Card className="p-5">
            <SidebarTitle icon={Filter}>Filter Appointments</SidebarTitle>
            <div className="space-y-3">
                <LabeledField label="Search"><SearchInput value={draft.query} onChange={(v) => set({ query: v })} placeholder="Patient, doctor or ID..." /></LabeledField>
                <LabeledField label="Date Range"><DateRange from={draft.from} to={draft.to} onChange={set} /></LabeledField>
                <LabeledField label="Specialization"><Select label="Specialization" value={draft.specialty} onChange={(v) => set({ specialty: v })} options={specOptions} /></LabeledField>
                <LabeledField label="Status"><Select label="Status filter" value={draft.status} onChange={(v) => set({ status: v })} options={statusOptions} /></LabeledField>
                <div className="flex gap-3 pt-1">
                    <button type="button" onClick={apply} className="h-11 flex-1 rounded-lg bg-[#0066fe] text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Apply Filters</button>
                    <button type="button" onClick={reset} className="h-11 flex-1 rounded-lg border border-blue-200 text-sm font-semibold text-[#0066fe] transition hover:bg-blue-50">Reset</button>
                </div>
            </div>
        </Card>
    );
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function MiniCalendar({ selectedDay, onPickDay }) {
    const axiosSecure = useAxiosSecure();
    const now = new Date();
    const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
    const { year, month } = view;
    const monthKey = `${year}-${pad(month + 1)}`;
    const title = new Date(year, month, 1).toLocaleString("en-US", { month: "long", year: "numeric" });

    const { data } = useQuery({
        queryKey: ["admin-appointments-calendar", monthKey],
        queryFn: async () => (await axiosSecure.get("/api/appointments/admin/calendar", { params: { month: monthKey } })).data.days,
    });
    const counts = Object.fromEntries((data ?? []).map((d) => [d.date, d.count]));

    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const total = Math.ceil((first.getDay() + daysInMonth) / 7) * 7;
    const cells = Array.from({ length: total }, (_, i) => {
        const d = new Date(year, month, 1 - first.getDay() + i);
        return { iso: keyOf(d), day: d.getDate(), inMonth: d.getMonth() === month };
    });

    const shift = (delta) => setView(({ year, month }) => { const d = new Date(year, month + delta, 1); return { year: d.getFullYear(), month: d.getMonth() }; });
    const nav = "rounded-md p-1 text-[#4a5568] hover:bg-blue-50";

    return (
        <Card className="p-5">
            <SidebarTitle icon={CalendarDays}>Calendar View</SidebarTitle>
            <div className="mb-3 flex items-center justify-between">
                <button type="button" aria-label="Previous month" onClick={() => shift(-1)} className={nav}><ChevronLeft className="h-4 w-4" /></button>
                <p className="text-sm font-semibold text-[#0a1931]">{title}</p>
                <button type="button" aria-label="Next month" onClick={() => shift(1)} className={nav}><ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center">
                {WEEKDAYS.map((d) => <div key={d} className="pb-1 text-[11px] font-medium text-[#4a5568]">{d}</div>)}
                {cells.map((c) => {
                    const isSelected = c.iso === selectedDay;
                    const count = c.inMonth ? counts[c.iso] : 0;
                    return (
                        <div key={c.iso} className="flex flex-col items-center">
                            <button type="button" onClick={() => onPickDay(isSelected ? "" : c.iso)} aria-pressed={isSelected}
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition ${isSelected ? "bg-[#0066fe] font-semibold text-white shadow" : c.inMonth ? "text-[#0a1931] hover:bg-blue-50" : "text-slate-300 hover:bg-blue-50"}`}>
                                {c.day}
                            </button>
                            <span className="h-3 text-[9px] font-semibold leading-3 text-[#0066fe]">{count ? count : ""}</span>
                        </div>
                    );
                })}
            </div>
            <p className="mt-2 text-[11px] text-[#4A5568]">Numbers show active appointments. Click a day to filter.</p>
        </Card>
    );
}

function QuickActions({ onExport, exporting, onToday }) {
    const rowClass = "flex w-full items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-3 text-left text-sm font-medium text-[#0a1931] transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-60";
    return (
        <Card className="p-5">
            <SidebarTitle icon={Zap}>Quick Actions</SidebarTitle>
            <ul className="space-y-2">
                <li>
                    <button type="button" onClick={onToday} className={rowClass}>
                        <CalendarDays className="h-5 w-5 text-[#0066fe]" strokeWidth={1.75} />
                        <span className="flex-1">View Today's Schedule</span>
                        <ChevronRight className="h-4 w-4 text-[#4A5568]" />
                    </button>
                </li>
                <li>
                    <button type="button" onClick={onExport} disabled={exporting} className={rowClass}>
                        {exporting ? <Loader2 className="h-5 w-5 animate-spin text-[#0066fe]" /> : <Download className="h-5 w-5 text-[#0066fe]" strokeWidth={1.75} />}
                        <span className="flex-1">Export Appointments</span>
                        <ChevronRight className="h-4 w-4 text-[#4A5568]" />
                    </button>
                </li>
            </ul>
        </Card>
    );
}

/* ---------------- page ---------------- */

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export default function AppointmentsManagementPage() {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState(emptyFilters);
    const [draft, setDraft] = useState(emptyFilters);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [page, setPage] = useState(1);
    const [target, setTarget] = useState(null);
    const [busy, setBusy] = useState(false);
    const [modalError, setModalError] = useState("");
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(filters.query.trim()), 350);
        return () => clearTimeout(t);
    }, [filters.query]);

    // Preserve the initially loaded doctor list so filtering does not shrink the dropdown.
    const [doctorList, setDoctorList] = useState([]);
    const [specList, setSpecList] = useState([]);

    const buildParams = (extra = {}) => {
        const params = { ...extra };
        if (debouncedQuery) params.q = debouncedQuery;
        if (filters.status !== ALL_STATUS) params.status = filters.status;
        if (filters.doctor !== ALL_DOCTORS) {
            const d = doctorList.find((x) => x.name === filters.doctor);
            if (d) params.doctorId = d.id;
        }
        if (filters.specialty !== ALL_SPECS) params.specialty = filters.specialty;
        if (filters.from) params.from = filters.from;
        if (filters.to) params.to = filters.to;
        return params;
    };

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["admin-appointments", debouncedQuery, filters.status, filters.doctor, filters.specialty, filters.from, filters.to, page, doctorList.length],
        queryFn: async () => (await axiosSecure.get("/api/appointments/admin/list", { params: buildParams({ page, limit: PAGE_SIZE }) })).data,
        keepPreviousData: true,
    });

    useEffect(() => {
        if (data?.doctors?.length) setDoctorList(data.doctors);
        if (data?.specialties?.length) setSpecList(data.specialties);
    }, [data]);

    const doctorOptions = [ALL_DOCTORS, ...doctorList.map((d) => d.name)];
    const specOptions = [ALL_SPECS, ...specList];

    const s = data?.stats ?? { total: 0, completed: 0, upcoming: 0, cancelled: 0 };
    const statCards = [
        { label: "Total Appointments", value: s.total.toLocaleString(), note: "All time", icon: CalendarDays, tint: "bg-blue-100 text-[#0066fe]", card: "bg-blue-50/70 border-blue-100" },
        { label: "Completed", value: s.completed, note: "Marked by doctors", icon: CheckCircle2, tint: "bg-emerald-100 text-emerald-600", card: "bg-emerald-50/70 border-emerald-100" },
        { label: "Upcoming", value: s.upcoming, note: "Today or later", icon: Clock, tint: "bg-violet-100 text-violet-600", card: "bg-violet-50/70 border-violet-100" },
        { label: "Cancelled", value: s.cancelled, note: "Including expired", icon: XCircle, tint: "bg-rose-100 text-rose-500", card: "bg-rose-50/70 border-rose-100" },
    ];

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
        queryClient.invalidateQueries({ queryKey: ["admin-appointments-calendar"] });
    };

    const act = async (path) => {
        setBusy(true);
        setModalError("");
        try {
            await axiosSecure.patch(`/api/appointments/${target._id}/${path}`);
            refresh();
            setTarget(null);
        } catch (err) {
            setModalError(err.response?.data?.message || "Action failed. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    const pickDay = (iso) => {
        const next = { ...filters, from: iso, to: iso };
        setFilters(next);
        setDraft(next);
        setPage(1);
    };

    const exportCsv = async () => {
        setExporting(true);
        try {
            const res = await axiosSecure.get("/api/appointments/admin/list", { params: buildParams({ all: "true" }) });
            const header = ["Appointment ID", "Patient", "Phone", "Doctor", "Specialty", "Date", "Time", "Fee", "Payment Method", "Payment Status", "Status"];
            const lines = res.data.appointments.map((a) =>
                [a._id, a.patientName, a.patientPhone, a.doctorName, a.specialty, a.date, a.time_slot, a.consultation_fee, a.payment_method, a.payment_status, a.displayStatus].map(csvCell).join(",")
            );
            const blob = new Blob([[header.map(csvCell).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "appointments.csv";
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export failed:", err.response?.data?.message || err.message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="min-h-screen  p-4 font-sans text-[#0a1931] sm:p-6">
            <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
                <main className="space-y-5">
                    <header>
                        <h1 className="text-3xl font-bold text-[#0a1931]">Appointments Management</h1>
                        <p className="mt-1 text-sm text-[#4a5568]">View, manage and organize all patient appointments in the system.</p>
                    </header>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((c) => <StatCard key={c.label} {...c} />)}
                    </div>

                    <AppointmentsTable
                        rows={data?.appointments ?? []}
                        total={data?.total ?? 0}
                        totalPages={data?.totalPages ?? 1}
                        page={page}
                        setPage={setPage}
                        filters={filters}
                        setFilters={setFilters}
                        doctorOptions={doctorOptions}
                        isLoading={isLoading}
                        isError={isError}
                        isFetching={isFetching}
                        onView={(a) => { setModalError(""); setTarget(a); }}
                    />
                </main>

                <aside className="space-y-5">
                    <FilterPanel
                        draft={draft}
                        setDraft={setDraft}
                        specOptions={specOptions}
                        apply={() => { setFilters((prev) => ({ ...prev, ...draft, doctor: prev.doctor })); setPage(1); }}
                        reset={() => { setDraft(emptyFilters); setFilters(emptyFilters); setPage(1); }}
                    />
                    <MiniCalendar selectedDay={filters.from && filters.from === filters.to ? filters.from : ""} onPickDay={pickDay} />
                    <QuickActions onExport={exportCsv} exporting={exporting} onToday={() => pickDay(keyOf(new Date()))} />
                </aside>
            </div>

            {target && (
                <AppointmentModal
                    appointment={target}
                    busy={busy}
                    error={modalError}
                    onClose={() => !busy && setTarget(null)}
                    onComplete={() => act("complete")}
                    onCancel={() => act("cancel")}
                />
            )}
        </div>
    );
}