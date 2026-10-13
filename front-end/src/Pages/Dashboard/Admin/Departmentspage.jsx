import React, { useMemo, useState } from "react";
import {
    Search,
    Plus,
    LayoutGrid,
    Stethoscope,
    User,
    CalendarDays,
    CalendarPlus,
    ClipboardPlus,
    Settings,
    Eye,
    Pencil,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ArrowUp,
    BarChart3,
    Zap,
    HeartPulse,
    Brain,
    Bone,
    Hand,
    Venus,
    Baby,
    Wind,
    Utensils,
    Droplets,
    Ear,
    Smile,
    MessageCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 12;

const stats = [
    { label: "Total Departments", value: 12, change: "2%", note: "from last month", icon: LayoutGrid, tint: "bg-blue-100 text-blue-600", card: "bg-blue-50/70 border-blue-100" },
    { label: "Total Services", value: 86, change: "6%", note: "from last month", icon: Stethoscope, tint: "bg-emerald-100 text-emerald-600", card: "bg-emerald-50/70 border-emerald-100" },
    { label: "Active Doctors", value: 24, change: "8%", note: "from last month", icon: User, tint: "bg-violet-100 text-violet-600", card: "bg-violet-50/70 border-violet-100" },
    { label: "Total Appointments (Today)", value: 48, change: "12%", note: "from yesterday", icon: CalendarDays, tint: "bg-orange-100 text-orange-500", card: "bg-orange-50/70 border-orange-100" },
];

const departments = [
    { id: 1, name: "Cardiology", services: 8, status: "Active", desc: "Heart related diagnosis and treatment.", examples: "ECG, Echo, Stress Test, etc.", icon: HeartPulse, tone: "bg-rose-100 text-rose-500" },
    { id: 2, name: "Neurology", services: 7, status: "Active", desc: "Brain and nervous system care.", examples: "EEG, Nerve Test, etc.", icon: Brain, tone: "bg-violet-100 text-violet-600" },
    { id: 3, name: "Orthopedics", services: 9, status: "Active", desc: "Bone, joint and muscle treatment.", examples: "Ultrasound, Physiotherapy, etc.", icon: Bone, tone: "bg-blue-100 text-blue-600" },
    { id: 4, name: "Dermatology", services: 6, status: "Active", desc: "Skin, hair and nail care.", examples: "Skin Test, Allergy Test, etc.", icon: Hand, tone: "bg-pink-100 text-pink-500" },
    { id: 5, name: "Gynecology", services: 7, status: "Active", desc: "Women's health and pregnancy care.", examples: "Ultrasound, Prenatal Care, etc.", icon: Venus, tone: "bg-purple-100 text-purple-600" },
    { id: 6, name: "Pediatrics", services: 6, status: "Active", desc: "Child health and development care.", examples: "Vaccination, Growth Check, etc.", icon: Baby, tone: "bg-orange-100 text-orange-500" },
    { id: 7, name: "General Medicine", services: 10, status: "Active", desc: "General health checkup and treatment.", examples: "Fever, Cold, Diabetes, etc.", icon: Stethoscope, tone: "bg-teal-100 text-teal-600" },
    { id: 8, name: "Pulmonology", services: 5, status: "Active", desc: "Lung and respiratory system care.", examples: "Spirometry, Chest X-Ray, etc.", icon: Wind, tone: "bg-sky-100 text-sky-600" },
    { id: 9, name: "Gastroenterology", services: 6, status: "Inactive", desc: "Digestive system treatment.", examples: "Endoscopy, Liver Test, etc.", icon: Utensils, tone: "bg-amber-100 text-amber-600" },
    { id: 10, name: "Urology", services: 5, status: "Active", desc: "Kidney and urinary system care.", examples: "Urine Test, Ultrasound, etc.", icon: Droplets, tone: "bg-violet-100 text-violet-500" },
    { id: 11, name: "ENT", services: 4, status: "Active", desc: "Ear, nose and throat treatment.", examples: "Hearing Test, Sinus Care, etc.", icon: Ear, tone: "bg-teal-100 text-teal-600" },
    { id: 12, name: "Psychiatry", services: 4, status: "Active", desc: "Mental health and wellbeing.", examples: "Counseling, Therapy, etc.", icon: Smile, tone: "bg-purple-100 text-purple-600" },
];

const ALL_DEPTS = "All Departments";
const ALL_STATUSES = "All Statuses";
const departmentOptions = [ALL_DEPTS, ...departments.map((d) => d.name)];
const statusOptions = [ALL_STATUSES, "Active", "Inactive"];

const quickActions = [
    { label: "Add New Department", icon: Plus },
    { label: "Add New Service", icon: ClipboardPlus },
    { label: "Manage Departments", icon: LayoutGrid },
    { label: "Manage Services", icon: Settings },
];

const FEATURED_STATS = 5; // number of departments listed before "Others"

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function Card({ children, className = "" }) {
    return (
        <section
            className={`rounded-2xl border border-blue-100/70 bg-white shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}
        >
            {children}
        </section>
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

function StatusBadge({ status }) {
    const styles = status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500";
    return (
        <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${styles}`}>
            {status}
        </span>
    );
}

function DeptIcon({ icon: Icon, tone, size = "h-10 w-10", iconSize = "h-5 w-5" }) {
    return (
        <span className={`flex ${size} shrink-0 items-center justify-center rounded-xl ${tone}`}>
            <Icon className={iconSize} strokeWidth={1.75} />
        </span>
    );
}

const iconBtn =
    "flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

/* ------------------------------------------------------------------ */
/* Header + stats                                                      */
/* ------------------------------------------------------------------ */

function PageHeader() {
    return (
        <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-blue-950">Departments / Services</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage hospital departments and the services offered in each department.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Add Department
                </button>
                <button
                    type="button"
                    className="rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                    Manage Services
                </button>
            </div>
        </header>
    );
}

function StatCard({ label, value, change, note, icon: Icon, tint, card }) {
    return (
        <div className={`flex items-center gap-4 rounded-2xl border p-4 ${card}`}>
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tint}`}>
                <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <div>
                <p className="text-xs font-semibold text-slate-700">{label}</p>
                <p className="text-3xl font-bold leading-tight text-blue-950">{value}</p>
                <p className="flex items-center gap-1.5 text-xs">
                    <span className="flex items-center font-semibold text-emerald-500">
                        <ArrowUp className="h-3 w-3" strokeWidth={3} />
                        {change}
                    </span>
                    <span className="text-slate-500">{note}</span>
                </p>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Department list                                                     */
/* ------------------------------------------------------------------ */

function DepartmentList({ filters, setFilters }) {
    const [page, setPage] = useState(1);

    const patch = (changes) => {
        setFilters((prev) => ({ ...prev, ...changes }));
        setPage(1);
    };

    const filtered = useMemo(() => {
        const q = filters.query.trim().toLowerCase();
        return departments.filter((d) => {
            if (q && ![d.name, d.desc, d.examples].some((v) => v.toLowerCase().includes(q))) return false;
            if (filters.department !== ALL_DEPTS && d.name !== filters.department) return false;
            if (filters.status !== ALL_STATUSES && d.status !== filters.status) return false;
            return true;
        });
    }, [filters]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, totalPages);
    const startIdx = (current - 1) * PAGE_SIZE;
    const pageRows = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    const navBtn =
        "flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50";

    return (
        <>
            <Card className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <label className="relative min-w-[220px] flex-1">
                        <span className="sr-only">Search departments or services</span>
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
                        <input
                            type="search"
                            value={filters.query}
                            onChange={(e) => patch({ query: e.target.value })}
                            placeholder="Search departments or services..."
                            className={`${fieldClass} pl-10 pr-3`}
                        />
                    </label>
                    <Select label="Department" value={filters.department} onChange={(v) => patch({ department: v })} options={departmentOptions} className="w-full sm:w-52" />
                    <Select label="Status" value={filters.status} onChange={(v) => patch({ status: v })} options={statusOptions} className="w-full sm:w-44" />
                </div>
            </Card>

            <Card className="p-4">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left">
                        <thead>
                            <tr className="bg-blue-50/60 text-xs font-semibold text-slate-600">
                                <th className="w-12 rounded-l-lg px-4 py-3">#</th>
                                <th className="px-3 py-3">Department</th>
                                <th className="px-3 py-3">Services (Count)</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="px-3 py-3">Description</th>
                                <th className="rounded-r-lg px-3 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((d, i) => (
                                <tr key={d.id}>
                                    <td className="border-b border-slate-100 px-4 py-2.5 text-xs text-slate-500">{startIdx + i + 1}</td>
                                    <td className="border-b border-slate-100 px-3 py-2.5">
                                        <div className="flex items-center gap-3">
                                            <DeptIcon icon={d.icon} tone={d.tone} />
                                            <span className="text-sm font-semibold text-blue-950">{d.name}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-xs text-slate-600">
                                        {d.services} Services
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-2.5">
                                        <StatusBadge status={d.status} />
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-2.5">
                                        <p className="text-xs text-slate-600">{d.desc}</p>
                                        <p className="text-[11px] text-blue-600">{d.examples}</p>
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-2.5">
                                        <div className="flex items-center gap-0.5">
                                            <button type="button" aria-label={`View ${d.name}`} className={iconBtn}>
                                                <Eye className="h-[18px] w-[18px]" />
                                            </button>
                                            <button type="button" aria-label={`Edit ${d.name}`} className={iconBtn}>
                                                <Pencil className="h-[18px] w-[18px]" />
                                            </button>
                                            <button type="button" aria-label={`More options for ${d.name}`} className={`${iconBtn} !text-slate-500`}>
                                                <MoreVertical className="h-[18px] w-[18px]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <p className="py-16 text-center text-sm text-slate-400">
                            No departments match these filters. Clear the search or change a filter.
                        </p>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                        {filtered.length === 0
                            ? "Showing 0 departments"
                            : `Showing ${startIdx + 1} - ${startIdx + pageRows.length} of ${filtered.length} departments`}
                    </p>
                    <nav aria-label="Pagination" className="flex items-center gap-1.5">
                        <button type="button" aria-label="Previous page" disabled={current === 1} onClick={() => setPage(current - 1)} className={navBtn}>
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                type="button"
                                aria-current={p === current ? "page" : undefined}
                                onClick={() => setPage(p)}
                                className={`flex h-8 min-w-8 items-center justify-center rounded-md border text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${p === current
                                        ? "border-blue-600 bg-blue-600 font-semibold text-white"
                                        : "border-slate-200 text-slate-600 hover:bg-blue-50"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button type="button" aria-label="Next page" disabled={current === totalPages} onClick={() => setPage(current + 1)} className={navBtn}>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </nav>
                </div>
            </Card>
        </>
    );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

function SidebarTitle({ icon: Icon, children }) {
    return (
        <h2 className="mb-4 flex items-center gap-2.5 text-base font-bold text-blue-950">
            <Icon className="h-5 w-5 text-blue-600" strokeWidth={1.75} />
            {children}
        </h2>
    );
}

function QuickActions() {
    return (
        <Card className="p-5">
            <SidebarTitle icon={Zap}>Quick Actions</SidebarTitle>
            <ul className="space-y-2">
                {quickActions.map(({ label, icon: Icon }) => (
                    <li key={label}>
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                            <Icon className="h-5 w-5 text-blue-600" strokeWidth={1.75} />
                            <span className="flex-1">{label}</span>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                        </button>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

function DepartmentStatistics({ onSelect }) {
    const featured = departments.slice(0, FEATURED_STATS);
    const othersCount = departments.slice(FEATURED_STATS).reduce((sum, d) => sum + d.services, 0);

    const row =
        "flex w-full items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

    return (
        <Card className="p-5">
            <SidebarTitle icon={BarChart3}>Department Statistics</SidebarTitle>
            <ul className="space-y-2">
                {featured.map((d) => (
                    <li key={d.id}>
                        <button type="button" onClick={() => onSelect(d.name)} className={row}>
                            <DeptIcon icon={d.icon} tone={d.tone} size="h-9 w-9" iconSize="h-[18px] w-[18px]" />
                            <span className="flex-1">
                                <span className="block text-sm font-semibold text-blue-950">{d.name}</span>
                                <span className="block text-[11px] text-slate-500">{d.services} Services</span>
                            </span>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                        </button>
                    </li>
                ))}
                <li>
                    <div className={row.replace("hover:border-blue-300 hover:bg-blue-50", "")}>
                        <DeptIcon icon={MessageCircle} tone="bg-slate-100 text-slate-500" size="h-9 w-9" iconSize="h-[18px] w-[18px]" />
                        <span className="flex-1">
                            <span className="block text-sm font-semibold text-blue-950">Others</span>
                            <span className="block text-[11px] text-slate-500">{othersCount} Services</span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                </li>
            </ul>
        </Card>
    );
}

function Banner() {
    return (
        <section className="flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100 p-5">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/70">
                <Stethoscope className="h-12 w-12 text-blue-500" strokeWidth={1.5} />
                <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500 shadow">
                    <HeartPulse className="h-4 w-4" />
                </span>
            </div>
            <div>
                <h3 className="text-sm font-bold leading-snug text-blue-950">Better Healthcare Management</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Organize departments, services and provide better care to your patients.
                </p>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DepartmentsPage() {
    const [filters, setFilters] = useState({ query: "", department: ALL_DEPTS, status: ALL_STATUSES });

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#eef4ff] to-[#f6f9ff] p-4 font-sans text-slate-700 sm:p-6">
            <div className="mx-auto grid max-w-[1440px] gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
                <main className="space-y-5">
                    <PageHeader />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((s) => (
                            <StatCard key={s.label} {...s} />
                        ))}
                    </div>

                    <DepartmentList filters={filters} setFilters={setFilters} />
                </main>

                <aside className="space-y-5">
                    <QuickActions />
                    <DepartmentStatistics onSelect={(name) => setFilters((prev) => ({ ...prev, department: name }))} />
                    <Banner />
                </aside>
            </div>
        </div>
    );
}