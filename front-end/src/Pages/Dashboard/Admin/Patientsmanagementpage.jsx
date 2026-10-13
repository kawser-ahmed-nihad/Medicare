import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    Search,
    Filter,
    CalendarDays,
    CalendarCheck,
    Eye,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Users,
    User,
    FileText,
    BarChart3,
    Zap,
    Download,
    Loader2,
    X,
    Mail,
    Phone,
    ShieldCheck,
} from "lucide-react";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundColor=0066fe&textColor=ffffff&seed=";

const PAGE_SIZE = 10;

const ALL_STATUS = "All Status";
const statusOptions = [ALL_STATUS, "Active", "Inactive"];

const emptyFilters = { query: "", status: ALL_STATUS, from: "", to: "" };

const statusStyles = {
    Active: "bg-emerald-100 text-emerald-600",
    Inactive: "bg-rose-100 text-rose-500",
};

const PROVIDER_LABEL = { local: "Email", google: "Google", github: "GitHub" };

const APPT_COLOR = {
    confirmed: "text-emerald-600",
    pending_payment: "text-amber-600",
    completed: "text-sky-600",
    cancelled: "text-rose-500",
    expired: "text-slate-400",
};

/* ---------------- helpers ---------------- */

const formatDate = (iso) => {
    if (!iso) return "—";
    const d = iso.length === 10 ? new Date(`${iso}T00:00:00`) : new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

function Avatar({ name, size = "h-10 w-10" }) {
    return <img src={`${DEFAULT_AVATAR}${encodeURIComponent(name || "Patient")}`} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />;
}

function Card({ children, className = "" }) {
    return (
        <section className={`rounded-2xl border border-blue-100/70 bg-white shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}>
            {children}
        </section>
    );
}

const fieldClass = "h-11 w-full rounded-lg border border-blue-100 bg-white text-sm text-[#0A1931] placeholder:text-[#4A5568] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200";

function SearchInput({ value, onChange, placeholder, inputRef, className = "" }) {
    return (
        <label className={`relative block ${className}`}>
            <span className="sr-only">{placeholder}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5568]" />
            <input ref={inputRef} type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${fieldClass} pl-10 pr-3`} />
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

function Pill({ children, className }) {
    return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${className}`}>{children}</span>;
}

/* ---------------- pagination ---------------- */

function pageList(page, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const set = new Set([1, total, page - 1, page, page + 1]);
    const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const out = [];
    nums.forEach((n, i) => {
        if (i > 0 && n - nums[i - 1] > 1) out.push("…");
        out.push(n);
    });
    return out;
}

function Pagination({ page, setPage, totalPages }) {
    const btn = "flex h-8 min-w-8 items-center justify-center rounded-md border px-1 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";
    return (
        <nav aria-label="Pagination" className="flex items-center gap-1.5">
            <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage(page - 1)} className={`${btn} border-slate-200 text-[#4A5568] hover:bg-slate-50 disabled:opacity-50`}>
                <ChevronLeft className="h-4 w-4" />
            </button>
            {pageList(page, totalPages).map((p, i) =>
                p === "…" ? (
                    <span key={`gap-${i}`} className="px-1 text-[#4A5568]">&hellip;</span>
                ) : (
                    <button key={p} type="button" aria-current={p === page ? "page" : undefined} onClick={() => setPage(p)} className={`${btn} ${p === page ? "border-blue-600 bg-blue-600 font-semibold text-white" : "border-slate-200 text-[#4A5568] hover:bg-blue-50"}`}>
                        {p}
                    </button>
                )
            )}
            <button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => setPage(page + 1)} className={`${btn} border-slate-200 text-[#4A5568] hover:bg-slate-50 disabled:opacity-50`}>
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}

/* ---------------- patient detail modal ---------------- */

function PatientModal({ patient, onClose }) {
    const axiosSecure = useAxiosSecure();
    const { data, isLoading } = useQuery({
        queryKey: ["admin-patient", patient._id],
        queryFn: async () => (await axiosSecure.get(`/api/patients/admin/${patient._id}`)).data,
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1931]/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between border-b border-slate-100 p-5">
                    <div className="flex items-center gap-3">
                        <Avatar name={patient.name} size="h-14 w-14" />
                        <div>
                            <h3 className="text-base font-bold text-[#0A1931]">{patient.name}</h3>
                            <p className="text-xs text-[#4A5568]">ID: #{patient._id.slice(-6)}</p>
                            <div className="mt-1"><Pill className={statusStyles[patient.status]}>{patient.status}</Pill></div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-[#4A5568] hover:text-[#0A1931]"><X size={18} /></button>
                </div>

                <div className="space-y-5 overflow-y-auto p-5">
                    <div className="space-y-1.5 text-sm text-[#4A5568]">
                        {patient.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#4A5568]" /> {patient.email}</p>}
                        {patient.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#4A5568]" /> {patient.phone}</p>}
                        <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#4A5568]" /> {patient.isVerified ? "Email verified" : "Not verified"} · via {PROVIDER_LABEL[patient.provider] || patient.provider}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        {[
                            ["Appointments", patient.totalAppointments],
                            ["Records", isLoading ? "…" : data?.recordCount ?? 0],
                            ["Joined", formatDate(patient.joinedAt)],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[11px] text-[#4A5568]">{label}</p>
                                <p className="mt-0.5 text-sm font-semibold text-[#0A1931]">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 className="mb-2 text-sm font-bold text-[#0A1931]">Appointment History</h4>
                        {isLoading ? (
                            <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-blue-600" /></div>
                        ) : !data?.appointments?.length ? (
                            <p className="rounded-xl bg-slate-50 p-3 text-xs text-[#4A5568]">No appointments yet.</p>
                        ) : (
                            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                                {data.appointments.slice(0, 8).map((a) => (
                                    <li key={a._id} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                                        <span className="min-w-0 truncate text-[#4A5568]">{formatDate(a.date)} · {a.time_slot} · {a.doctorName}</span>
                                        <span className={`shrink-0 font-medium capitalize ${APPT_COLOR[a.status] || "text-[#4A5568]"}`}>{a.status.replace("_", " ")}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- header + stats ---------------- */

function PageHeader() {
    return (
        <header>
            <h1 className="text-3xl font-bold text-[#0A1931]">Patients Management</h1>
            <p className="mt-1 text-sm text-[#4A5568]">View, manage and keep track of all registered patients in the system.</p>
        </header>
    );
}

function StatCard({ label, value, note, icon: Icon, tint, card }) {
    return (
        <div className={`flex items-center gap-4 rounded-2xl border p-4 ${card}`}>
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tint}`}>
                <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <div>
                <p className="text-xs font-semibold text-[#4A5568]">{label}</p>
                <p className="text-3xl font-bold leading-tight text-[#0A1931]">{value}</p>
                <p className="text-xs text-[#4A5568]">{note}</p>
            </div>
        </div>
    );
}

/* ---------------- table ---------------- */

function PatientTable({ rows, total, totalPages, page, setPage, filters, setFilters, isLoading, isError, isFetching, focusSearch, focusDates, onView }) {
    const [selected, setSelected] = useState(() => new Set());

    const patch = (changes) => {
        setFilters((prev) => ({ ...prev, ...changes }));
        setPage(1);
    };

    const allSelected = rows.length > 0 && rows.every((p) => selected.has(p._id));
    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(rows.map((p) => p._id)));
    const toggleOne = (id) => setSelected((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    return (
        <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
                <SearchInput value={filters.query} onChange={(v) => patch({ query: v })} placeholder="Search by name, email, or patient ID..." className="min-w-[220px] flex-1" />
                <Select label="Status" value={filters.status} onChange={(v) => patch({ status: v })} options={statusOptions} className="w-36" />
                <button type="button" aria-label="Filter by last visit date" onClick={focusDates} className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-100 text-blue-600 transition hover:bg-blue-50">
                    <CalendarDays className="h-[18px] w-[18px]" />
                </button>
                <button type="button" onClick={focusSearch} className="inline-flex h-11 items-center gap-2 rounded-lg border border-blue-100 px-4 text-sm font-medium text-slate-700 transition hover:bg-blue-50">
                    <Filter className="h-4 w-4 text-[#0066FE]" />
                    Filter
                </button>
            </div>

            {isLoading && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>}
            {isError && <p className="py-10 text-center text-sm text-rose-500">Couldn't load patients. Please try again.</p>}

            {!isLoading && !isError && (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left">
                        <thead>
                            <tr className="bg-blue-50/60 text-xs font-semibold text-slate-600">
                                <th className="w-10 rounded-l-lg px-4 py-3">
                                    <input type="checkbox" aria-label="Select all patients" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400" />
                                </th>
                                <th className="px-3 py-3">Patient</th>
                                <th className="px-3 py-3">Email</th>
                                <th className="px-3 py-3">Joined</th>
                                <th className="px-3 py-3">Appointments</th>
                                <th className="px-3 py-3">Last Visit</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="rounded-r-lg px-3 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((p) => (
                                <tr key={p._id} className={selected.has(p._id) ? "bg-blue-50/40" : ""}>
                                    <td className="border-b border-slate-100 px-4 py-2.5">
                                        <input type="checkbox" aria-label={`Select ${p.name}`} checked={selected.has(p._id)} onChange={() => toggleOne(p._id)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400" />
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-2.5">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={p.name} size="h-11 w-11" />
                                            <div>
                                                <p className="text-sm font-semibold text-[#0A1931]">{p.name}</p>
                                                <p className="text-[11px] text-[#4A5568]">#{p._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-2.5 text-xs text-[#4A5568]">{p.email}</td>
                                    <td className="whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-xs text-[#4A5568]">{formatDate(p.joinedAt)}</td>
                                    <td className="border-b border-slate-100 px-3 py-2.5 text-xs text-[#4A5568]">{p.totalAppointments}</td>
                                    <td className="whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-xs text-[#4A5568]">{formatDate(p.lastVisit)}</td>
                                    <td className="border-b border-slate-100 px-3 py-2.5"><Pill className={statusStyles[p.status]}>{p.status}</Pill></td>
                                    <td className="border-b border-slate-100 px-3 py-2.5">
                                        <button type="button" aria-label={`View ${p.name}`} onClick={() => onView(p)} className="flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-50">
                                            <Eye className="h-[18px] w-[18px]" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {rows.length === 0 && <p className="py-16 text-center text-sm text-[#4A5568]">No patients match these filters. Clear the search or change a filter.</p>}
                </div>
            )}

            {!isLoading && !isError && total > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[#4A5568]">
                        Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} patients
                        {isFetching && <span className="ml-2 text-[#4A5568]">updating…</span>}
                        {selected.size > 0 && <span className="ml-2 font-medium text-[#0066FE]">{selected.size} selected</span>}
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
        <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold text-[#0A1931]">
            <Icon className="h-5 w-5 text-[#0066FE]" strokeWidth={1.75} />
            {children}
        </h2>
    );
}

function LabeledSelect({ label, ...props }) {
    return (
        <div>
            <p className="mb-1.5 text-xs font-semibold text-[#4A5568]">{label}</p>
            <Select label={label} {...props} />
        </div>
    );
}

function QuickFilters({ draft, setDraft, apply, reset, searchRef, fromRef }) {
    const set = (key) => (value) => setDraft((prev) => ({ ...prev, [key]: value }));
    return (
        <Card className="p-5">
            <SidebarTitle icon={Filter}>Quick Filters</SidebarTitle>
            <div className="space-y-3">
                <SearchInput inputRef={searchRef} value={draft.query} onChange={set("query")} placeholder="Search by name or email..." />
                <LabeledSelect label="Status" value={draft.status} onChange={set("status")} options={statusOptions} />

                <fieldset>
                    <legend className="mb-1.5 text-xs font-semibold text-[#4A5568]">Last visit between</legend>
                    <div className="flex items-center gap-2 rounded-lg border border-[#0066FE] bg-white px-3 focus-within:border-[#0066FE] focus-within:ring-2 focus-within:ring-[#0066FE]">
                        <CalendarDays className="h-4 w-4 shrink-0 text-[#0066FE]" />
                        <input ref={fromRef} type="date" aria-label="Visited from" value={draft.from} max={draft.to || undefined} onChange={(e) => set("from")(e.target.value)} className="h-11 min-w-0 flex-1 bg-transparent text-xs text-[#4A5568] focus:outline-none" />
                        <span className="text-[#4A5568]">&ndash;</span>
                        <input type="date" aria-label="Visited to" value={draft.to} min={draft.from || undefined} onChange={(e) => set("to")(e.target.value)} className="h-11 min-w-0 flex-1 bg-transparent text-xs text-[#4A5568] focus:outline-none" />
                    </div>
                </fieldset>

                <div className="flex gap-3 pt-1">
                    <button type="button" onClick={apply} className="h-11 flex-1 rounded-lg bg-[#0066FE] text-sm font-semibold text-white shadow-sm transition hover:bg-[#0052C9]">Apply Filters</button>
                    <button type="button" onClick={reset} className="h-11 flex-1 rounded-lg border border-[#0066FE] text-sm font-semibold text-[#0066FE] transition hover:bg-[#F0F4FF]">Reset</button>
                </div>
            </div>
        </Card>
    );
}

function PatientBreakdown({ breakdown }) {
    const items = [
        { label: "Signed up with Email", count: breakdown.email, tint: "bg-blue-100 text-blue-600" },
        { label: "Signed up with Google", count: breakdown.google, tint: "bg-rose-100 text-rose-500" },
        { label: "Signed up with GitHub", count: breakdown.github, tint: "bg-slate-200 text-slate-600" },
        { label: "Email verified", count: breakdown.verified, tint: "bg-emerald-100 text-emerald-600" },
        { label: "Not verified", count: breakdown.unverified, tint: "bg-orange-100 text-orange-500" },
    ];
    return (
        <Card className="p-5">
            <SidebarTitle icon={BarChart3}>Patient Statistics</SidebarTitle>
            <ul className="space-y-2">
                {items.map((g) => (
                    <li key={g.label} className="flex items-center gap-3 rounded-lg bg-[#F0F4FF] px-3 py-2.5">
                        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${g.tint}`}><User className="h-4 w-4" /></span>
                        <span className="flex-1 text-sm text-[#4A5568]">{g.label}</span>
                        <span className="text-sm font-bold text-[#0066FE]">{g.count}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

function QuickActions({ onExport, exporting }) {
    const rowClass = "flex w-full items-center gap-3 rounded-lg border border-[#0066FE] bg-[#F0F4FF] px-3 py-3 text-left text-sm font-medium text-[#4A5568] transition hover:border-[#0052C9] hover:bg-[#E2E8F0] disabled:opacity-60";
    return (
        <Card className="p-5">
            <SidebarTitle icon={Zap}>Quick Actions</SidebarTitle>
            <ul className="space-y-2">
                <li>
                    <button type="button" onClick={onExport} disabled={exporting} className={rowClass}>
                        {exporting ? <Loader2 className="h-5 w-5 animate-spin text-[#0066FE]" /> : <Download className="h-5 w-5 text-[#0066FE]" strokeWidth={1.75} />}
                        <span className="flex-1">Export Patient List</span>
                        <ChevronRight className="h-4 w-4 text-[#4A5568]" />
                    </button>
                </li>
                <li>
                    <Link to="/dashboard/appointment-management" className={rowClass}>
                        <FileText className="h-5 w-5 text-[#0066FE]" strokeWidth={1.75} />
                        <span className="flex-1">Manage Appointments</span>
                        <ChevronRight className="h-4 w-4 text-[#4A5568]" />
                    </Link>
                </li>
            </ul>
        </Card>
    );
}

/* ---------------- page ---------------- */

const csvCell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export default function PatientsManagementPage() {
    const axiosSecure = useAxiosSecure();

    const [filters, setFilters] = useState(emptyFilters);
    const [draft, setDraft] = useState(emptyFilters);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [page, setPage] = useState(1);
    const [viewTarget, setViewTarget] = useState(null);
    const [exporting, setExporting] = useState(false);
    const searchRef = useRef(null);
    const fromRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(filters.query.trim()), 350);
        return () => clearTimeout(t);
    }, [filters.query]);

    const buildParams = (extra = {}) => {
        const params = { ...extra };
        if (debouncedQuery) params.q = debouncedQuery;
        if (filters.status !== ALL_STATUS) params.status = filters.status;
        if (filters.from) params.from = filters.from;
        if (filters.to) params.to = filters.to;
        return params;
    };

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["admin-patients", debouncedQuery, filters.status, filters.from, filters.to, page],
        queryFn: async () => (await axiosSecure.get("/api/patients/admin/list", { params: buildParams({ page, limit: PAGE_SIZE }) })).data,
        keepPreviousData: true,
    });

    const s = data?.stats ?? { total: 0, newPatients: 0, active: 0, inactive: 0 };
    const breakdown = data?.breakdown ?? { email: 0, google: 0, github: 0, verified: 0, unverified: 0 };

    const statCards = [
        { label: "Total Patients", value: s.total.toLocaleString(), note: "All registered", icon: Users, tint: "bg-[#F0F4FF] text-[#0066FE]", card: "bg-[#F0F4FF] border-[#0066FE]" },
        { label: "New Patients", value: s.newPatients, note: "Joined in the last 30 days", icon: User, tint: "bg-[#E2F5E2] text-[#22C55E]", card: "bg-[#E2F5E2] border-[#22C55E]" },
        { label: "Active Patients", value: s.active, note: "Visit in last 90 days or upcoming", icon: CalendarCheck, tint: "bg-[#F3E8FF] text-[#8B5CF6]", card: "bg-[#F3E8FF] border-[#8B5CF6]" },
        { label: "Inactive Patients", value: s.inactive, note: "No recent or upcoming visit", icon: FileText, tint: "bg-[#FFE4E4] text-[#EF4444]", card: "bg-[#FFE4E4] border-[#EF4444]" },
    ];

    // Export all patients matching the current filters to CSV, not just the current page.
    const exportCsv = async () => {
        setExporting(true);
        try {
            const res = await axiosSecure.get("/api/patients/admin/list", { params: buildParams({ all: "true" }) });
            const header = ["Patient ID", "Name", "Email", "Phone", "Sign-up Method", "Joined", "Appointments", "Last Visit", "Status"];
            const lines = res.data.patients.map((p) =>
                [p._id, p.name, p.email, p.phone, PROVIDER_LABEL[p.provider] || p.provider, p.joinedAt ? p.joinedAt.slice(0, 10) : "", p.totalAppointments, p.lastVisit || "", p.status].map(csvCell).join(",")
            );
            const blob = new Blob([[header.map(csvCell).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "patients.csv";
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export failed:", err.response?.data?.message || err.message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="min-h-screen   p-4 font-sans text-[#0A1931] sm:p-6">
            <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
                <main className="space-y-5">
                    <PageHeader />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((c) => <StatCard key={c.label} {...c} />)}
                    </div>

                    <PatientTable
                        rows={data?.patients ?? []}
                        total={data?.total ?? 0}
                        totalPages={data?.totalPages ?? 1}
                        page={page}
                        setPage={setPage}
                        filters={filters}
                        setFilters={setFilters}
                        isLoading={isLoading}
                        isError={isError}
                        isFetching={isFetching}
                        focusSearch={() => searchRef.current?.focus()}
                        focusDates={() => fromRef.current?.focus()}
                        onView={setViewTarget}
                    />
                </main>

                <aside className="space-y-5">
                    <QuickFilters
                        draft={draft}
                        setDraft={setDraft}
                        searchRef={searchRef}
                        fromRef={fromRef}
                        apply={() => { setFilters(draft); setPage(1); }}
                        reset={() => { setDraft(emptyFilters); setFilters(emptyFilters); setPage(1); }}
                    />
                    <PatientBreakdown breakdown={breakdown} />
                    <QuickActions onExport={exportCsv} exporting={exporting} />
                </aside>
            </div>

            {viewTarget && <PatientModal patient={viewTarget} onClose={() => setViewTarget(null)} />}
        </div>
    );
}