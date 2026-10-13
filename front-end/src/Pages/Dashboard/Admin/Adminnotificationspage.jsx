import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Bell,
    BellRing,
    CalendarDays,
    Calendar,
    MessageCircle,
    Pill,
    Settings,
    Loader2,
} from "lucide-react";

const TYPE_META = {
    appointment: { label: "Appointment", icon: Calendar, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", chip: "bg-emerald-50 text-emerald-600" },
    message: { label: "Message", icon: MessageCircle, iconBg: "bg-sky-100", iconColor: "text-[#0066fe]", chip: "bg-sky-50 text-[#0066fe]" },
    prescription: { label: "Prescription", icon: Pill, iconBg: "bg-purple-100", iconColor: "text-purple-600", chip: "bg-purple-50 text-purple-600" },
    system: { label: "System", icon: Settings, iconBg: "bg-slate-100", iconColor: "text-[#4a5568]", chip: "bg-slate-100 text-[#4a5568]" },
};
const ROLE_CHIP = { admin: "bg-rose-50 text-rose-600", doctor: "bg-blue-50 text-[#0066fe]", patient: "bg-emerald-50 text-emerald-600" };
const TYPE_OPTIONS = ["All Types", "Appointment", "Message", "Prescription", "System"];
const STATUS_OPTIONS = ["All Status", "Unread", "Read"];

const fmtDateTime = (iso) =>
    new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

function pageList(page, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const set = new Set([1, total, page - 1, page, page + 1]);
    const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const out = [];
    nums.forEach((n, i) => { if (i > 0 && n - nums[i - 1] > 1) out.push("…"); out.push(n); });
    return out;
}

function Card({ children, className = "" }) {
    return (
        <section className={`rounded-2xl border border-blue-100/70 bg-white shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}>
            {children}
        </section>
    );
}

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

const fieldClass = "h-11 w-full appearance-none rounded-lg border border-blue-100 bg-white pl-3 pr-9 text-sm text-[#0a1931] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200";

export default function AdminNotificationsPage() {
    const axiosSecure = useAxiosSecure();

    const [query, setQuery] = useState("");
    const [debounced, setDebounced] = useState("");
    const [type, setType] = useState(TYPE_OPTIONS[0]);
    const [status, setStatus] = useState(STATUS_OPTIONS[0]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const t = setTimeout(() => { setDebounced(query.trim()); setPage(1); }, 350);
        return () => clearTimeout(t);
    }, [query]);

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["admin-notifications", debounced, type, status, page],
        queryFn: async () => {
            const params = { page, limit: 15 };
            if (debounced) params.q = debounced;
            if (type !== "All Types") params.type = type.toLowerCase();
            if (status !== "All Status") params.status = status;
            return (await axiosSecure.get("/api/notifications/admin/all", { params })).data;
        },
        keepPreviousData: true,
    });

    const rows = data?.notifications ?? [];
    const total = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;
    const s = data?.stats ?? { total: 0, unread: 0, today: 0, byType: {} };

    const cards = [
        { label: "Total Notifications", value: s.total.toLocaleString(), note: "Sent to all users", icon: Bell, tint: "bg-blue-100 text-[#0066fe]", card: "bg-blue-50/70 border-blue-100" },
        { label: "Unread", value: s.unread, note: "Not yet opened by users", icon: BellRing, tint: "bg-rose-100 text-rose-500", card: "bg-rose-50/70 border-rose-100" },
        { label: "Today", value: s.today, note: "Sent today", icon: CalendarDays, tint: "bg-violet-100 text-violet-600", card: "bg-violet-50/70 border-violet-100" },
        { label: "Appointments", value: s.byType.appointment || 0, note: `${s.byType.message || 0} messages · ${s.byType.prescription || 0} prescriptions`, icon: Calendar, tint: "bg-emerald-100 text-emerald-600", card: "bg-emerald-50/70 border-emerald-100" },
    ];

    return (
        <div className="min-h-screen   p-4 font-sans text-[#0a1931] sm:p-6">
            <div className="mx-auto max-w-[1440px] space-y-5">
                <header>
                    <h1 className="text-3xl font-bold text-[#0a1931]">All Notifications</h1>
                    <p className="mt-1 text-sm text-[#4a5568]">See every notification the system has sent to patients, doctors and admins.</p>
                </header>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((c) => <StatCard key={c.label} {...c} />)}
                </div>

                <Card className="p-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="relative block min-w-[220px] flex-1">
                            <span className="sr-only">Search notifications</span>
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a5568]" />
                            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, text, user name or email..." className={`${fieldClass} pl-10 pr-3`} />
                        </label>
                        <div className="relative w-40">
                            <select aria-label="Type" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className={fieldClass}>
                                {TYPE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a5568]" />
                        </div>
                        <div className="relative w-36">
                            <select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className={fieldClass}>
                                {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a5568]" />
                        </div>
                    </div>

                    {isLoading && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[#0066fe]" /></div>}
                    {isError && <p className="py-10 text-center text-sm text-rose-500">Couldn't load notifications. Please try again.</p>}

                    {!isLoading && !isError && (
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left">
                                <thead>
                                    <tr className="bg-blue-50/60 text-xs font-semibold text-[#4a5568]">
                                        <th className="rounded-l-lg px-4 py-3">Notification</th>
                                        <th className="px-3 py-3">Type</th>
                                        <th className="px-3 py-3">Recipient</th>
                                        <th className="px-3 py-3">Sent</th>
                                        <th className="rounded-r-lg px-3 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((n) => {
                                        const meta = TYPE_META[n.type] || TYPE_META.system;
                                        const Icon = meta.icon;
                                        return (
                                            <tr key={n._id}>
                                                <td className="border-b border-slate-100 px-4 py-3">
                                                    <div className="flex items-start gap-3">
                                                        <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${meta.iconBg} ${meta.iconColor}`}><Icon size={16} /></span>
                                                        <div className="min-w-0 max-w-[340px]">
                                                            <p className="text-sm font-semibold text-[#0a1931]">{n.title}</p>
                                                            <p className="line-clamp-2 text-xs text-[#4a5568]">{n.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="border-b border-slate-100 px-3 py-3">
                                                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${meta.chip}`}>{meta.label}</span>
                                                </td>
                                                <td className="border-b border-slate-100 px-3 py-3">
                                                    {n.user ? (
                                                        <div>
                                                            <p className="flex items-center gap-2 text-sm font-medium text-[#0a1931]">
                                                                {n.user.name}
                                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${ROLE_CHIP[n.user.role] || "bg-slate-100 text-[#4a5568]"}`}>{n.user.role}</span>
                                                            </p>
                                                            <p className="text-xs text-[#4a5568]">{n.user.email}</p>
                                                        </div>
                                                    ) : <span className="text-xs text-[#4a5568]">Deleted user</span>}
                                                </td>
                                                <td className="whitespace-nowrap border-b border-slate-100 px-3 py-3 text-xs text-[#4a5568]">{fmtDateTime(n.createdAt)}</td>
                                                <td className="border-b border-slate-100 px-3 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${n.read ? "bg-slate-100 text-[#4a5568]" : "bg-blue-50 text-[#0066fe]"}`}>
                                                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-[#0066fe]" />}
                                                        {n.read ? "Read" : "Unread"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {rows.length === 0 && <p className="py-16 text-center text-sm text-[#4a5568]">No notifications match these filters.</p>}
                        </div>
                    )}

                    {!isLoading && !isError && total > 0 && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs text-[#4a5568]">
                                Showing {(page - 1) * 15 + 1} - {Math.min(page * 15, total)} of {total.toLocaleString()} notifications
                                {isFetching && <span className="ml-2 text-[#4a5568]">updating…</span>}
                            </p>
                            <nav aria-label="Pagination" className="flex items-center gap-1.5">
                                <button disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-[#4a5568] hover:bg-slate-50 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
                                {pageList(page, totalPages).map((p, i) => p === "…" ? <span key={`g${i}`} className="px-1 text-[#4a5568]">&hellip;</span> : (
                                    <button key={p} onClick={() => setPage(p)} className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-1 text-sm ${p === page ? "border-[#0066fe] bg-[#0066fe] font-semibold text-white" : "border-slate-200 text-[#4a5568] hover:bg-blue-50"}`}>{p}</button>
                                ))}
                                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} aria-label="Next page" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-[#4a5568] hover:bg-slate-50 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
                            </nav>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}