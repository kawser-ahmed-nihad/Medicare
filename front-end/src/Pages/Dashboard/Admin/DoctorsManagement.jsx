import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    Plus,
    Search,
    Filter,
    LayoutGrid,
    List,
    Eye,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Users,
    UserCheck,
    Clock,
    XCircle,
    HeartPulse,
    Baby,
    Stethoscope,
    Sparkles,
    Activity,
    Flower2,
    Brain,
    Archive,
    Loader2,
    X,
} from "lucide-react";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&seed=";
const PAGE_SIZE = 10;

const ALL_SPECS = "All Specializations";
const ALL_STATUS = "All Status";
const DEPARTMENTS = ["Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics", "Gynecology", "General Medicine", "ENT", "Urology", "Others"];
const specOptions = [ALL_SPECS, ...DEPARTMENTS];
const statusOptions = [ALL_STATUS, "Active", "On Leave", "Inactive"];

// UI labels <-> backend values.
const STATUS_TO_API = { Active: "available", "On Leave": "on_leave", Inactive: "inactive" };
const API_TO_STATUS = { available: "Active", on_leave: "On Leave", inactive: "Inactive" };

const specializationStyles = {
    Cardiology: "bg-blue-100 text-blue-700",
    Pediatrics: "bg-violet-100 text-violet-700",
    "General Medicine": "bg-emerald-100 text-emerald-700",
    Dermatology: "bg-rose-100 text-rose-600",
    Orthopedics: "bg-orange-100 text-orange-600",
    Gynecology: "bg-purple-100 text-purple-700",
    Neurology: "bg-indigo-100 text-indigo-700",
    ENT: "bg-sky-100 text-sky-700",
    Urology: "bg-teal-100 text-teal-700",
};

const statusStyles = {
    Active: "bg-emerald-100 text-emerald-600",
    "On Leave": "bg-orange-100 text-orange-500",
    Inactive: "bg-rose-100 text-rose-500",
};

const deptIcons = {
    Cardiology: { icon: HeartPulse, tint: "text-blue-600 bg-blue-50" },
    Pediatrics: { icon: Baby, tint: "text-violet-600 bg-violet-50" },
    "General Medicine": { icon: Stethoscope, tint: "text-emerald-600 bg-emerald-50" },
    Dermatology: { icon: Sparkles, tint: "text-rose-500 bg-rose-50" },
    Orthopedics: { icon: Activity, tint: "text-orange-500 bg-orange-50" },
    Gynecology: { icon: Flower2, tint: "text-purple-600 bg-purple-50" },
    Neurology: { icon: Brain, tint: "text-indigo-600 bg-indigo-50" },
};

/* ---------------- building blocks ---------------- */

function Avatar({ name, src, size = "h-10 w-10" }) {
    return <img src={src || `${DEFAULT_AVATAR}${encodeURIComponent(name)}`} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />;
}

function Card({ children, className = "" }) {
    return (
        <section className={`rounded-2xl border border-blue-100/70 bg-white shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}>
            {children}
        </section>
    );
}

const fieldClass = "h-11 w-full rounded-lg border border-blue-100 bg-white text-sm text-slate-700 placeholder:text-[#4A5568] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200";

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

function SpecPill({ value }) {
    return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${specializationStyles[value] || "bg-slate-100 text-[#4A5568]"}`}>{value}</span>;
}

function StatusBadge({ status }) {
    return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${statusStyles[status]}`}>{status}</span>;
}

const actionBtn = "flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-blue-50 hover:text-[#0066FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

function RowActions({ doctor, onEdit, onDelete }) {
    return (
        <div className="flex items-center gap-1">
            <Link to={`/doctors/${doctor._id}`} aria-label={`View ${doctor.name}`} className={actionBtn}>
                <Eye className="h-[18px] w-[18px]" />
            </Link>
            <button type="button" aria-label={`Change status of ${doctor.name}`} onClick={() => onEdit(doctor)} className={actionBtn}>
                <Pencil className="h-[18px] w-[18px]" />
            </button>
            <button type="button" aria-label={`Delete ${doctor.name}`} onClick={() => onDelete(doctor)} className={`${actionBtn} !text-rose-500 hover:!bg-rose-50`}>
                <Trash2 className="h-[18px] w-[18px]" />
            </button>
        </div>
    );
}

/* ---------------- modals ---------------- */

function StatusModal({ doctor, saving, error, onClose, onSave }) {
    const [value, setValue] = useState(doctor.status);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1931]/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-blue-950">Change Status</h3>
                    <button onClick={onClose} disabled={saving} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                </div>
                <p className="mt-2 text-sm text-slate-500">{doctor.name}</p>
                <div className="mt-4 space-y-2">
                    {["Active", "On Leave", "Inactive"].map((s) => (
                        <label key={s} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${value === s ? "border-[#0066FE] bg-sky-50" : "border-slate-200 hover:border-slate-300"}`}>
                            <input type="radio" name="status" checked={value === s} onChange={() => setValue(s)} />
                            <span className="flex-1 font-medium text-[#0A1931]">{s}</span>
                            <StatusBadge status={s} />
                        </label>
                    ))}
                </div>
                <p className="mt-3 text-xs text-[#4A5568]">Active doctors can take bookings. On Leave and Inactive doctors can't be booked.</p>
                {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}
                <div className="mt-5 flex gap-3">
                    <button onClick={onClose} disabled={saving} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-[#4A5568] hover:bg-slate-50 disabled:opacity-60">Cancel</button>
                    <button onClick={() => onSave(value)} disabled={saving || value === doctor.status} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0066FE] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                        {saving && <Loader2 size={14} className="animate-spin" />} Save
                    </button>
                </div>
            </div>
        </div>
    );
}

function DeleteModal({ doctor, deleting, error, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1931]/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-base font-bold text-[#0A1931]">Delete {doctor.name}?</h3>
                <p className="mt-2 text-sm text-[#4A5568]">
                    This removes the doctor's profile and login account. Past appointments keep the doctor's name for record. This can't be undone.
                </p>
                {error && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-600">{error}</p>}
                <div className="mt-5 flex gap-3">
                    <button onClick={onClose} disabled={deleting} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
                    <button onClick={onConfirm} disabled={deleting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60">
                        {deleting && <Loader2 size={14} className="animate-spin" />} Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------------- header + stats ---------------- */

function PageHeader() {
    return (
        <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-[#0A1931]">Doctors Management</h1>
                <p className="mt-1 text-sm text-[#4A5568]">View, manage and control all registered doctors in the system.</p>
            </div>
            <Link to="/dashboard/adddoctor" className="inline-flex items-center gap-2 rounded-lg bg-[#0066FE] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add New Doctor
            </Link>
        </header>
    );
}

function StatCard({ label, value, icon: Icon, tint, card }) {
    return (
        <div className={`flex items-center gap-4 rounded-2xl border p-4 ${card}`}>
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tint}`}>
                <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <div>
                <p className="text-xs font-medium text-[#4A5568]">{label}</p>
                <p className="text-3xl font-bold leading-tight text-[#0A1931]">{value}</p>
            </div>
        </div>
    );
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
    const btn = "flex h-8 min-w-8 items-center justify-center rounded-md border text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";
    return (
        <nav aria-label="Pagination" className="flex items-center gap-1.5">
            <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage(page - 1)} className={`${btn} border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50`}>
                <ChevronLeft className="h-4 w-4" />
            </button>
            {pageList(page, totalPages).map((p, i) =>
                p === "…" ? (
                    <span key={`gap-${i}`} className="px-1 text-[#4A5568]">&hellip;</span>
                ) : (
                    <button key={p} type="button" aria-current={p === page ? "page" : undefined} onClick={() => setPage(p)} className={`${btn} ${p === page ? "border-[#0066FE] bg-[#0066FE] font-semibold text-white" : "border-slate-200 text-[#4A5568] hover:bg-[#0066FE]"}`}>
                        {p}
                    </button>
                )
            )}
            <button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => setPage(page + 1)} className={`${btn} border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50`}>
                <ChevronRight className="h-4 w-4" />
            </button>
        </nav>
    );
}

/* ---------------- list ---------------- */

function DoctorsList({ doctors, total, totalPages, page, setPage, filters, setFilters, isLoading, isError, isFetching, focusQuickFilters, onEdit, onDelete }) {
    const [view, setView] = useState("list");
    const [selected, setSelected] = useState(() => new Set());

    const patch = (changes) => {
        setFilters((prev) => ({ ...prev, ...changes }));
        setPage(1);
    };

    const allSelected = doctors.length > 0 && doctors.every((d) => selected.has(d._id));
    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(doctors.map((d) => d._id)));
    const toggleOne = (id) => setSelected((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const viewBtn = (mode) => `flex h-9 w-9 items-center justify-center rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${view === mode ? "bg-[#0066FE] text-white" : "text-slate-500 hover:bg-blue-50"}`;

    return (
        <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
                <SearchInput value={filters.query} onChange={(v) => patch({ query: v })} placeholder="Search by name, email, specialization..." className="min-w-[220px] flex-1" />
                <Select label="Specialization" value={filters.specialization} onChange={(v) => patch({ specialization: v })} options={specOptions} className="w-44" />
                <Select label="Status" value={filters.status} onChange={(v) => patch({ status: v })} options={statusOptions} className="w-36" />
                <button type="button" onClick={focusQuickFilters} className="inline-flex h-11 items-center gap-2 rounded-lg border border-blue-100 px-4 text-sm font-medium text-slate-700 transition hover:bg-blue-50">
                    <Filter className="h-4 w-4 text-[#0066FE]" />
                    Filter
                </button>
                <div className="flex items-center gap-1 rounded-lg border border-blue-100 p-1" role="group" aria-label="View mode">
                    <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={viewBtn("grid")}><LayoutGrid className="h-[18px] w-[18px]" /></button>
                    <button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")} className={viewBtn("list")}><List className="h-[18px] w-[18px]" /></button>
                </div>
            </div>

            {isLoading && <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>}
            {isError && <p className="py-10 text-center text-sm text-rose-500">Couldn't load doctors. Please try again.</p>}

            {!isLoading && !isError && view === "list" && (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left">
                        <thead>
                            <tr className="bg-blue-50/60 text-xs font-semibold text-[#4A5568]">
                                <th className="w-10 rounded-l-lg px-4 py-3">
                                    <input type="checkbox" aria-label="Select all doctors" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400" />
                                </th>
                                <th className="px-3 py-3">Doctor</th>
                                <th className="px-3 py-3">Specialization</th>
                                <th className="px-3 py-3">Experience</th>
                                <th className="px-3 py-3">Email</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="rounded-r-lg px-3 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((d) => (
                                <tr key={d._id} className={selected.has(d._id) ? "bg-blue-50/40" : ""}>
                                    <td className="border-b border-slate-100 px-4 py-3">
                                        <input type="checkbox" aria-label={`Select ${d.name}`} checked={selected.has(d._id)} onChange={() => toggleOne(d._id)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400" />
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={d.name} src={d.photoUrl} />
                                            <div>
                                                <p className="text-sm font-semibold text-[#0A1931]">{d.name}</p>
                                                <p className="text-[11px] text-[#4A5568]">#{d._id.slice(-6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-3"><SpecPill value={d.department} /></td>
                                    <td className="whitespace-nowrap border-b border-slate-100 px-3 py-3 text-xs text-[#4A5568]">{d.experience}</td>
                                    <td className="border-b border-slate-100 px-3 py-3 text-xs text-[#4A5568]">{d.email}</td>
                                    <td className="border-b border-slate-100 px-3 py-3"><StatusBadge status={d.status} /></td>
                                    <td className="border-b border-slate-100 px-3 py-3"><RowActions doctor={d} onEdit={onEdit} onDelete={onDelete} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!isLoading && !isError && view === "grid" && (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {doctors.map((d) => (
                        <li key={d._id} className="rounded-xl border border-blue-100 p-4">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <Avatar name={d.name} src={d.photoUrl} size="h-12 w-12" />
                                    <div>
                                        <p className="text-sm font-semibold text-[#0A1931]">{d.name}</p>
                                        <p className="text-[11px] text-[#4A5568]">#{d._id.slice(-6)}</p>
                                    </div>
                                </div>
                                <StatusBadge status={d.status} />
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-2">
                                <SpecPill value={d.department} />
                                <span className="text-xs text-[#4A5568]">{d.experience}</span>
                            </div>
                            <p className="mt-2 truncate text-xs text-[#4A5568]">{d.email}</p>
                            <div className="mt-2 border-t border-slate-100 pt-2"><RowActions doctor={d} onEdit={onEdit} onDelete={onDelete} /></div>
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && !isError && doctors.length === 0 && (
                <p className="py-16 text-center text-sm text-[#4A5568]">No doctors match these filters. Clear the search or change a filter.</p>
            )}

            {!isLoading && !isError && total > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[#4A5568]">
                        Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total} doctors
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

function QuickFilters({ draft, setDraft, apply, reset, searchRef }) {
    return (
        <Card className="p-5">
            <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold text-[#0A1931]">
                <Filter className="h-5 w-5 text-[#0066FE]" strokeWidth={1.75} />
                Quick Filters
            </h2>
            <div className="space-y-3">
                <SearchInput inputRef={searchRef} value={draft.query} onChange={(v) => setDraft((p) => ({ ...p, query: v }))} placeholder="Search doctor..." />
                <Select label="Select specialization" value={draft.specialization} onChange={(v) => setDraft((p) => ({ ...p, specialization: v }))} options={specOptions} />
                <Select label="Select status" value={draft.status} onChange={(v) => setDraft((p) => ({ ...p, status: v }))} options={statusOptions} />
                <div className="flex gap-3 pt-1">
                    <button type="button" onClick={apply} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                        <Filter className="h-4 w-4" />
                        Apply Filters
                    </button>
                    <button type="button" onClick={reset} className="h-11 rounded-lg border border-blue-200 px-5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
                        Reset
                    </button>
                </div>
            </div>
        </Card>
    );
}

function BySpecialization({ byDepartment }) {
    return (
        <Card className="p-5">
            <h2 className="mb-3 flex items-center gap-2.5 text-base font-bold text-[#0A1931]">
                <Users className="h-5 w-5 text-[#0066FE]" strokeWidth={1.75} />
                Doctors by Specialization
            </h2>
            {byDepartment.length === 0 ? (
                <p className="py-4 text-center text-xs text-[#4A5568]">No doctors yet.</p>
            ) : (
                <ul>
                    {byDepartment.map(({ name, count }) => {
                        const meta = deptIcons[name] || { icon: Archive, tint: "text-slate-600 bg-slate-100" };
                        const Icon = meta.icon;
                        return (
                            <li key={name} className="flex items-center gap-3 rounded-lg px-1 py-2.5">
                                <span className={`flex h-7 w-7 items-center justify-center rounded-md ${meta.tint}`}><Icon className="h-4 w-4" strokeWidth={1.75} /></span>
                                <span className="flex-1 text-sm text-[#4A5568]">{name}</span>
                                <span className="text-sm font-semibold text-[#0066FE]">{count}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
}

function Banner() {
    return (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100 p-5">
            <h3 className="text-base font-bold text-[#0066FE]">Better Healthcare for Everyone</h3>
            <p className="mt-1 max-w-[190px] text-xs leading-relaxed text-[#4A5568]">Manage your doctors, patients and appointments all in one place.</p>
            <div className="mt-4 flex items-center justify-center rounded-xl bg-white/70 py-6">
                <div className="relative">
                    <Stethoscope className="h-16 w-16 text-[#0066FE]" strokeWidth={1.25} />
                    <span className="absolute -bottom-2 -right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500 shadow"><HeartPulse className="h-4 w-4" /></span>
                </div>
            </div>
        </section>
    );
}

/* ---------------- page ---------------- */

const emptyFilters = { query: "", specialization: ALL_SPECS, status: ALL_STATUS };

export default function DoctorsManagement() {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState(emptyFilters);
    const [draft, setDraft] = useState(emptyFilters);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [page, setPage] = useState(1);
    const searchRef = useRef(null);

    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [busy, setBusy] = useState(false);
    const [modalError, setModalError] = useState("");

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(filters.query.trim()), 350);
        return () => clearTimeout(t);
    }, [filters.query]);

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["admin-doctors", debouncedQuery, filters.specialization, filters.status, page],
        queryFn: async () => {
            const params = { page, limit: PAGE_SIZE };
            if (debouncedQuery) params.q = debouncedQuery;
            if (filters.specialization !== ALL_SPECS) params.department = filters.specialization;
            if (filters.status !== ALL_STATUS) params.status = STATUS_TO_API[filters.status];
            const res = await axiosSecure.get("/api/doctors/admin/list", { params });
            return res.data;
        },
        keepPreviousData: true,
    });

    const doctors = (data?.doctors ?? []).map((d) => ({
        _id: d._id,
        name: `Dr. ${d.first_name} ${d.last_name}`,
        department: d.department || "Others",
        experience: d.experience_years != null ? `${d.experience_years}+ years` : "—",
        email: d.email,
        photoUrl: d.photoUrl,
        status: API_TO_STATUS[d.status] || "Active",
    }));

    const s = data?.stats ?? { total: 0, active: 0, onLeave: 0, inactive: 0 };
    const statCards = [
        { label: "Total Doctors", value: s.total, icon: Users, tint: "bg-blue-100 text-blue-600", card: "bg-blue-50/70 border-blue-100" },
        { label: "Active Doctors", value: s.active, icon: UserCheck, tint: "bg-emerald-100 text-emerald-600", card: "bg-emerald-50/70 border-emerald-100" },
        { label: "On Leave", value: s.onLeave, icon: Clock, tint: "bg-violet-100 text-violet-600", card: "bg-violet-50/70 border-violet-100" },
        { label: "Inactive", value: s.inactive, icon: XCircle, tint: "bg-rose-100 text-rose-500", card: "bg-rose-50/70 border-rose-100" },
    ];

    const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });

    const saveStatus = async (uiStatus) => {
        setBusy(true);
        setModalError("");
        try {
            await axiosSecure.patch(`/api/doctors/${editTarget._id}/status`, { status: STATUS_TO_API[uiStatus] });
            await refresh();
            setEditTarget(null);
        } catch (err) {
            setModalError(err.response?.data?.message || "Failed to update status.");
        } finally {
            setBusy(false);
        }
    };

    const confirmDelete = async () => {
        setBusy(true);
        setModalError("");
        try {
            await axiosSecure.delete(`/api/doctors/${deleteTarget._id}`);
            await refresh();
            setDeleteTarget(null);
        } catch (err) {
            setModalError(err.response?.data?.message || "Failed to delete doctor.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen  p-4 font-sans text-[#0A1931] sm:p-6">
            <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
                <main className="space-y-5">
                    <PageHeader />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((c) => <StatCard key={c.label} {...c} />)}
                    </div>

                    <DoctorsList
                        doctors={doctors}
                        total={data?.total ?? 0}
                        totalPages={data?.totalPages ?? 1}
                        page={page}
                        setPage={setPage}
                        filters={filters}
                        setFilters={setFilters}
                        isLoading={isLoading}
                        isError={isError}
                        isFetching={isFetching}
                        focusQuickFilters={() => searchRef.current?.focus()}
                        onEdit={(d) => { setModalError(""); setEditTarget(d); }}
                        onDelete={(d) => { setModalError(""); setDeleteTarget(d); }}
                    />
                </main>

                <aside className="space-y-5">
                    <QuickFilters
                        draft={draft}
                        setDraft={setDraft}
                        searchRef={searchRef}
                        apply={() => { setFilters(draft); setPage(1); }}
                        reset={() => { setDraft(emptyFilters); setFilters(emptyFilters); setPage(1); }}
                    />
                    <BySpecialization byDepartment={data?.byDepartment ?? []} />
                    <Banner />
                </aside>
            </div>

            {editTarget && (
                <StatusModal doctor={editTarget} saving={busy} error={modalError} onClose={() => !busy && setEditTarget(null)} onSave={saveStatus} />
            )}
            {deleteTarget && (
                <DeleteModal doctor={deleteTarget} deleting={busy} error={modalError} onClose={() => !busy && setDeleteTarget(null)} onConfirm={confirmDelete} />
            )}
        </div>
    );
}