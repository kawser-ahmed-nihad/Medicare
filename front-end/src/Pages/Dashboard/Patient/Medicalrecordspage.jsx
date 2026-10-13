import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    Download,
    FileText,
    FlaskConical,
    ClipboardList,
    Search,
    ChevronDown,
    ShieldCheck,
    Pill,
    Activity,
    Loader2,
} from "lucide-react";

/* ---------------- static presentation data ---------------- */

const typeMeta = {
    Prescription: { icon: FileText, iconBg: "bg-sky-100", iconColor: "text-blue-600", badgeBg: "bg-emerald-50", badgeColor: "text-emerald-600" },
    "Lab Report": { icon: FlaskConical, iconBg: "bg-purple-100", iconColor: "text-purple-600", badgeBg: "bg-purple-50", badgeColor: "text-purple-600" },
    Diagnosis: { icon: ClipboardList, iconBg: "bg-teal-100", iconColor: "text-teal-600", badgeBg: "bg-sky-50", badgeColor: "text-blue-600" },
};

const PAGE_SIZE = 7;

function formatDateLabel(dateStr) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function withinDateRange(dateStr, range) {
    if (range === "All Dates") return true;
    const d = new Date(dateStr);
    const now = new Date();
    const days = range === "Last 30 days" ? 30 : range === "Last 3 months" ? 90 : 365;
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - days);
    return d >= cutoff;
}

/* ---------------- row ---------------- */

function RecordRow({ record, onDownload, downloading }) {
    const meta = typeMeta[record.type] || typeMeta.Prescription;
    const Icon = meta.icon;

    return (
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-1 py-4 last:border-0">
            <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${meta.iconBg} ${meta.iconColor}`}>
                <Icon size={18} />
            </span>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0A1931]">{record.title}</p>
                <p className="text-xs text-[#4A5568]">
                    {record.doctorName} {record.specialty && <><span className="mx-1 text-[#4A5568]">•</span> {record.specialty}</>}
                </p>
                {record.description && <p className="mt-0.5 truncate text-xs text-[#4A5568]">{record.description}</p>}
            </div>

            <p className="hidden w-24 flex-shrink-0 text-xs text-[#4A5568] sm:block">{formatDateLabel(record.date)}</p>

            <span className={`hidden flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium sm:block ${meta.badgeBg} ${meta.badgeColor}`}>
                {record.type}
            </span>

            {record.fileUrl ? (
                <button
                    type="button"
                    onClick={() => onDownload(record)}
                    disabled={downloading}
                    className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0066FE] transition-colors hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {downloading ? (
                        <>
                            <Loader2 size={13} className="animate-spin" />
                            Downloading…
                        </>
                    ) : (
                        <>
                            <Download size={13} />
                            Download
                        </>
                    )}
                </button>
            ) : (
                <span className="flex-shrink-0 rounded-lg border border-slate-100 px-3 py-1.5 text-xs text-[#4A5568]">No file</span>
            )}
        </div>
    );
}

/* ---------------- page ---------------- */

export default function MedicalRecordsPage() {
    const axiosSecure = useAxiosSecure();

    const [activeType, setActiveType] = useState("All Records");
    const [dateRange, setDateRange] = useState("All Dates");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["my-medical-records"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/medical-records/mine");
            return res.data.records;
        },
    });

    const records = data ?? [];

    const counts = useMemo(() => ({
        "All Records": records.length,
        Prescriptions: records.filter((r) => r.type === "Prescription").length,
        "Lab Reports": records.filter((r) => r.type === "Lab Report").length,
        Diagnoses: records.filter((r) => r.type === "Diagnosis").length,
    }), [records]);

    const filterTabs = [
        { label: "All Records", count: counts["All Records"] },
        { label: "Prescriptions", count: counts["Prescriptions"], type: "Prescription" },
        { label: "Lab Reports", count: counts["Lab Reports"], type: "Lab Report" },
        { label: "Diagnoses", count: counts["Diagnoses"], type: "Diagnosis" },
    ];

    const filtered = useMemo(() => {
        const activeTypeValue = filterTabs.find((t) => t.label === activeType)?.type;
        return records.filter((r) => {
            if (activeTypeValue && r.type !== activeTypeValue) return false;
            if (!withinDateRange(r.date, dateRange)) return false;
            if (search.trim() && !`${r.title} ${r.description || ""} ${r.doctorName}`.toLowerCase().includes(search.trim().toLowerCase())) return false;
            return true;
        });
    }, [records, activeType, dateRange, search]); // eslint-disable-line react-hooks/exhaustive-deps

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const quickStats = [
        { icon: FileText, label: "Total Records", value: records.length, bg: "bg-sky-100", color: "text-blue-600" },
        { icon: Pill, label: "Prescriptions", value: counts.Prescriptions, bg: "bg-emerald-100", color: "text-emerald-600" },
        { icon: FlaskConical, label: "Lab Reports", value: counts["Lab Reports"], bg: "bg-purple-100", color: "text-purple-600" },
        { icon: Activity, label: "Diagnoses", value: counts.Diagnoses, bg: "bg-amber-100", color: "text-amber-600" },
    ];

    const recentActivity = [...records]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);


    const [downloadingId, setDownloadingId] = useState(null);

    const handleDownload = useCallback(async (record) => {
        if (!record.fileUrl || downloadingId) return;
        setDownloadingId(record._id);

        try {
            const response = await fetch(record.fileUrl, { mode: "cors" });
            if (!response.ok) throw new Error("Failed to fetch file");
            const blob = await response.blob();

            const extFromUrl = record.fileUrl.match(/\.(\w+)(?:\?.*)?$/)?.[1];
            const ext = extFromUrl || blob.type.split("/")[1] || "file";
            const safeTitle = record.title.replace(/[^\w\-]+/g, "_").slice(0, 60) || "medical-record";

            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${safeTitle}.${ext}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            // console.error("Download failed, opening in new tab instead:", err);
            window.open(record.fileUrl, "_blank", "noopener,noreferrer");
        } finally {
            setDownloadingId(null);
        }
    }, [downloadingId]);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-10">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0A1931]">Medical Records</h1>
                        <p className="mt-1 max-w-md text-sm text-[#4A5568]">
                            Access your medical history, reports, prescriptions and more — all in one place.
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
                    {/* Main column */}
                    <div>
                        {/* Filter tabs */}
                        <div className="flex flex-wrap gap-2">
                            {filterTabs.map((tab) => (
                                <button
                                    key={tab.label}
                                    onClick={() => { setActiveType(tab.label); setPage(1); }}
                                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeType === tab.label ? "bg-[#0066FE] text-white" : "bg-white text-[#4A5568] shadow-sm shadow-slate-900/5 hover:bg-slate-50"
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ${activeType === tab.label ? "bg-white/20 text-white" : "bg-slate-100 text-[#4A5568]"
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Filters + search */}
                        <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-slate-900/5 sm:flex-row sm:items-center">
                            <label className="flex-1">
                                <span className="mb-1 block text-xs font-medium text-[#4A5568]">Date Range</span>
                                <div className="relative">
                                    <select
                                        value={dateRange}
                                        onChange={(e) => { setDateRange(e.target.value); setPage(1); }}
                                        className="w-full appearance-none rounded-lg border border-[#d1d5db] py-2 pl-3 pr-8 text-sm text-[#4A5568] outline-none focus:border-[#0066FE]"
                                    >
                                        <option>All Dates</option>
                                        <option>Last 30 days</option>
                                        <option>Last 3 months</option>
                                        <option>Last year</option>
                                    </select>
                                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                            </label>

                            <label className="flex-[2]">
                                <span className="mb-1 block text-xs font-medium text-[#4A5568] sm:opacity-0">Search</span>
                                <div className="relative">
                                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5568]" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                        placeholder="Search records..."
                                        className="w-full rounded-lg border border-[#d1d5db] py-2 pl-9 pr-4 text-sm outline-none focus:border-[#0066FE]"
                                    />
                                </div>
                            </label>
                        </div>

                        {/* Records list */}
                        <div className="mt-4 rounded-2xl bg-white px-4 shadow-sm shadow-slate-900/5">
                            {isLoading && (
                                <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-[#0066FE]" /></div>
                            )}
                            {isError && <p className="py-6 text-center text-sm text-rose-500">Couldn't load your records. Please try again.</p>}
                            {!isLoading && !isError && paginated.length === 0 && (
                                <p className="py-10 text-center text-sm text-slate-400">No records found.</p>
                            )}
                            {paginated.map((record) => (
                                <RecordRow
                                    key={record._id}
                                    record={record}
                                    onDownload={handleDownload}
                                    downloading={downloadingId === record._id}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {filtered.length > 0 && (
                            <div className="mt-4 flex items-center justify-between px-1">
                                <p className="text-xs text-[#4A5568]">
                                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
                                </p>
                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const p = i + 1;
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-[#0066FE] text-white" : "text-[#4A5568] hover:bg-slate-50"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-900/5">
                            <h3 className="font-bold text-[#4A5568]">Quick Stats</h3>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {quickStats.map(({ icon: Icon, label, value, bg, color }) => (
                                    <div key={label} className="rounded-xl bg-slate-50 p-3">
                                        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${bg} ${color}`}>
                                            <Icon size={16} />
                                        </span>
                                        <p className="mt-2 text-xs text-[#4A5568]">{label}</p>
                                        <p className="text-lg font-bold text-[#4A5568]">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-900/5">
                            <h3 className="font-bold text-[#4A5568]">Recent Activity</h3>
                            <div className="mt-4 space-y-4">
                                {recentActivity.length === 0 && <p className="text-xs text-[#4A5568]">No activity yet.</p>}
                                {recentActivity.map((r) => {
                                    const meta = typeMeta[r.type] || typeMeta.Prescription;
                                    const Icon = meta.icon;
                                    return (
                                        <div key={r._id} className="flex items-start gap-3">
                                            <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${meta.badgeBg} ${meta.badgeColor}`}>
                                                <Icon size={14} />
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-[#4A5568]">{r.title}</p>
                                                <p className="text-xs text-[#4A5568]">
                                                    {r.doctorName} <span className="mx-1">•</span> {formatDateLabel(r.date)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-sky-50 p-5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0066FE] text-white">
                                <ShieldCheck size={17} />
                            </span>
                            <p className="mt-3 text-sm font-semibold text-[#0A1931]">Your Health Data is Safe</p>
                            <p className="mt-1 text-xs leading-relaxed text-[#4A5568]">
                                We use industry-standard encryption to keep your medical records secure and private.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}