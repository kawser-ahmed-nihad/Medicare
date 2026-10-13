import React, { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock3,
    MapPin,
    ArrowRight,
    Plus,
    Headphones,
    Loader2,
    X,
    Wallet,
    RotateCcw,
} from "lucide-react";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&seed=";

/* ---------------- date/time helpers ---------------- */

function todayKey() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDateLabel(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysUntil(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const target = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

// "10:30 AM" + 30 min -> "11:00 AM" — build the end time from time_slot + duration_minutes.
function addMinutesTo12h(timeStr, durationMin) {
    const [time, period] = timeStr.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    let total = h * 60 + m + Number(durationMin || 0);
    total = ((total % 1440) + 1440) % 1440;
    const endH = Math.floor(total / 60);
    const endM = total % 60;
    const endPeriod = endH >= 12 ? "PM" : "AM";
    let endH12 = endH % 12;
    if (endH12 === 0) endH12 = 12;
    return `${String(endH12).padStart(2, "0")}:${String(endM).padStart(2, "0")} ${endPeriod}`;
}

// The backend never sets the "completed" status (only pending_payment/confirmed/cancelled/expired),
// so confirmed appointments with past dates are treated as "completed" here.
function classify(appointment) {
    if (["cancelled", "expired"].includes(appointment.status)) return "cancelled";
    if (appointment.status === "confirmed" && appointment.date < todayKey()) return "completed";
    return "upcoming";
}

/* ---------------- stat card ---------------- */

const StatCard = ({ icon: Icon, title, value, subtitle, iconClass, bgClass }) => (
    <div className="relative overflow-hidden rounded-xl border border-[#e3ebf6] bg-white px-4 py-3.5 shadow-[0_2px_10px_rgba(30,91,150,0.03)]">
        <div className={`absolute -right-4 -bottom-5 h-20 w-20 rounded-full opacity-40 ${bgClass}`} />
        <div className="relative flex items-center gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
                <Icon size={21} strokeWidth={2.3} />
            </div>
            <div>
                <p className="text-xs font-medium text-[#667a96]">{title}</p>
                <h3 className="mt-0.5 text-xl font-bold leading-6 text-[#12305b]">{value}</h3>
                <p className="mt-1 text-[11px] text-[#8292a9]">{subtitle}</p>
            </div>
        </div>
    </div>
);

/* ---------------- main appointment row ---------------- */

const STATUS_PILL = {
    upcoming: { label: "Upcoming", className: "bg-[#e8faf4] text-[#17ae80]" },
    completed: { label: "Completed", className: "bg-[#e7faf4] text-[#1aae82]" },
    cancelled: { label: "Cancelled", className: "bg-[#fff0f2] text-[#ef6675]" },
    pending: { label: "Payment Pending", className: "bg-[#fff8e6] text-[#c8960c]" },
};

function AppointmentRow({ appointment, onCancelClick, onViewDetails }) {
    const bucket = classify(appointment);
    const pillKey = appointment.status === "pending_payment" ? "pending" : bucket;
    const pill = STATUS_PILL[pillKey] || STATUS_PILL.upcoming;
    const endTime = addMinutesTo12h(appointment.time_slot, appointment.duration_minutes);
    const feeLabel = appointment.payment_status === "paid"
        ? `৳${appointment.consultation_fee} paid online`
        : `৳${appointment.consultation_fee} at hospital`;
    const avatar = `${DEFAULT_AVATAR}${encodeURIComponent(appointment.doctorName || "Doctor")}`;

    return (
        <div className="group flex flex-col gap-4 border-b border-[#edf2f8] px-4 py-4 last:border-b-0 md:flex-row md:items-center md:justify-between">
            {/* Doctor */}
            <div className="flex min-w-[220px] items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#eef5fc] shadow-sm">
                    <img src={avatar} alt={appointment.doctorName} className="h-full w-full object-cover" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-[#17355f]">{appointment.doctorName}</h4>
                    {appointment.doctorDepartment && (
                        <p className="mt-0.5 text-xs text-[#71829a]">{appointment.doctorDepartment}</p>
                    )}
                </div>
            </div>

            {/* Date, time, fee/location */}
            <div className="min-w-[220px] space-y-1.5 text-xs text-[#6e8099]">
                <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-[#6682aa]" />
                    <span>{formatDateLabel(appointment.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock3 size={14} className="text-[#6682aa]" />
                    <span>{appointment.time_slot} – {endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                    {appointment.doctorLocation ? (
                        <>
                            <MapPin size={14} className="text-[#6682aa]" />
                            <span>{appointment.doctorLocation}</span>
                        </>
                    ) : (
                        <>
                            <Wallet size={14} className="text-[#6682aa]" />
                            <span>{feeLabel}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Status */}
            <div className="flex min-w-[110px] items-center">
                <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${pill.className}`}>
                    {pill.label}
                </span>
            </div>

            {/* Actions vary by bucket. */}
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => onViewDetails(appointment)}
                    className="rounded-md bg-[#087cf5] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#006ee0]"
                >
                    View Details
                </button>

                {bucket === "upcoming" && (
                    <button
                        onClick={() => onCancelClick(appointment)}
                        className="rounded-md border border-rose-200 px-4 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                        Cancel
                    </button>
                )}

                {(bucket === "completed" || bucket === "cancelled") && (
                    <Link
                        to={`/doctors/${appointment.doctorId}`}
                        className="flex items-center gap-1.5 rounded-md border border-[#a9ccfb] bg-white px-4 py-2 text-xs font-medium text-[#087cf5] transition hover:bg-[#f3f8ff]"
                    >
                        <RotateCcw size={13} />
                        Book Again
                    </Link>
                )}
            </div>
        </div>
    );
}

/* ---------------- compact row (Recent History panel) ---------------- */

function HistoryRow({ appointment }) {
    const bucket = classify(appointment);
    const completed = bucket === "completed";
    const avatar = `${DEFAULT_AVATAR}${encodeURIComponent(appointment.doctorName || "Doctor")}`;

    return (
        <div className="flex items-center justify-between border-b border-[#edf2f8] py-3 last:border-0">
            <div className="flex min-w-0 items-center gap-2.5">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#eef4fa]">
                    <img src={avatar} alt={appointment.doctorName} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#234266]">{appointment.doctorName}</p>
                    {appointment.doctorDepartment && (
                        <p className="truncate text-[11px] text-[#8594a9]">{appointment.doctorDepartment}</p>
                    )}
                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#8291a6]">
                        <CalendarDays size={9} />
                        <span>{formatDateLabel(appointment.date)}</span>
                        <span>|</span>
                        <span>{appointment.time_slot}</span>
                    </div>
                </div>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${completed ? "bg-[#e7faf4] text-[#1aae82]" : "bg-[#fff0f2] text-[#ef6675]"}`}>
                {completed ? "Completed" : "Cancelled"}
            </span>
        </div>
    );
}

/* ---------------- cancel modal ---------------- */

function CancelModal({ appointment, cancelling, error, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-[#0A1931]">Cancel Appointment?</h3>
                    <button onClick={onClose} disabled={cancelling} className="text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                    Your appointment with <span className="font-medium text-slate-700">{appointment.doctorName}</span> on{" "}
                    <span className="font-medium text-slate-700">{formatDateLabel(appointment.date)}</span> at{" "}
                    <span className="font-medium text-slate-700">{appointment.time_slot}</span> will be cancelled.
                    {appointment.payment_status === "paid" && " Refunds for online payments are handled by our support team."}
                </p>
                {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}
                <div className="mt-5 flex gap-3">
                    <button onClick={onClose} disabled={cancelling}
                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60">
                        Keep Appointment
                    </button>
                    <button onClick={onConfirm} disabled={cancelling}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60">
                        {cancelling && <Loader2 size={14} className="animate-spin" />}
                        {cancelling ? "Cancelling…" : "Yes, Cancel"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------------- details modal ---------------- */

function DetailsModal({ appointment, onClose }) {
    const bucket = classify(appointment);
    const pillKey = appointment.status === "pending_payment" ? "pending" : bucket;
    const pill = STATUS_PILL[pillKey] || STATUS_PILL.upcoming;
    const endTime = addMinutesTo12h(appointment.time_slot, appointment.duration_minutes);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-[#0A1931]">Appointment Details</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>
                <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3.5 text-sm">
                    <p className="flex justify-between"><span className="text-slate-400">Doctor</span><span className="font-medium text-slate-800">{appointment.doctorName}</span></p>
                    {appointment.doctorDepartment && (
                        <p className="flex justify-between"><span className="text-slate-400">Department</span><span className="font-medium text-slate-800">{appointment.doctorDepartment}</span></p>
                    )}
                    <p className="flex justify-between"><span className="text-slate-400">Date</span><span className="font-medium text-slate-800">{formatDateLabel(appointment.date)}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Time</span><span className="font-medium text-slate-800">{appointment.time_slot} – {endTime}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Fee</span><span className="font-medium text-slate-800">৳{appointment.consultation_fee}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Payment</span><span className="font-medium text-slate-800">{appointment.payment_method === "online" ? "Online" : "At hospital"} — {appointment.payment_status}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Status</span><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pill.className}`}>{pill.label}</span></p>
                </div>
                <Link
                    to={`/doctors/${appointment.doctorId}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#0066FE] py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    View Doctor Profile <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}

/* ---------------- page ---------------- */

const TABS = [
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
];

export default function Appointments() {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [activeTab, setActiveTab] = useState("upcoming");
    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState("");
    const [detailsTarget, setDetailsTarget] = useState(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["my-appointments"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/appointments/mine");
            return res.data.appointments;
        },
    });

    const appointments = data ?? [];

    const grouped = useMemo(() => {
        const g = { upcoming: [], completed: [], cancelled: [] };
        appointments.forEach((a) => g[classify(a)].push(a));
        g.upcoming.sort((a, b) => (a.date < b.date ? -1 : 1));
        g.completed.sort((a, b) => (a.date > b.date ? -1 : 1));
        g.cancelled.sort((a, b) => (a.date > b.date ? -1 : 1));
        return g;
    }, [appointments]);

    const nextUpcoming = grouped.upcoming[0];


    const recentHistory = useMemo(
        () => [...grouped.completed, ...grouped.cancelled].sort((a, b) => (a.date > b.date ? -1 : 1)).slice(0, 5),
        [grouped]
    );

    const handleConfirmCancel = async () => {
        if (!cancelTarget) return;
        setCancelling(true);
        setCancelError("");
        try {
            await axiosSecure.patch(`/api/appointments/${cancelTarget._id}/cancel`);
            await queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
            setCancelTarget(null);
        } catch (err) {
            setCancelError(err.response?.data?.message || "Failed to cancel. Please try again.");
        } finally {
            setCancelling(false);
        }
    };

    const activeList = grouped[activeTab] || [];

    return (
        <div className="min-h-screen bg-[#f7fbff] px-3 py-6 sm:px-5 lg:px-6">
            <div className="mx-auto max-w-[1200px]">
                {/* HEADER */}
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#12315d]">My Appointments</h1>
                        <p className="mt-1 text-xs text-[#8193ac]">Manage your upcoming and past appointments easily.</p>
                    </div>
                    <Link
                        to="/find-doctors"
                        className="flex w-fit items-center gap-2 rounded-md bg-[#087cf5] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_5px_14px_rgba(8,124,245,0.2)] transition hover:bg-[#006ee0]"
                    >
                        <Plus size={14} />
                        Book New Appointment
                    </Link>
                </div>

                {/* STATS */}
                <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={CalendarDays}
                        title="Upcoming Appointments"
                        value={grouped.upcoming.length}
                        subtitle={nextUpcoming ? `Next appointment in ${Math.max(daysUntil(nextUpcoming.date), 0)} day(s)` : "No upcoming visits"}
                        iconClass="bg-[#e5f1ff] text-[#087cf5]"
                        bgClass="bg-[#e8f2ff]"
                    />
                    <StatCard
                        icon={CheckCircle2}
                        title="Completed Appointments"
                        value={grouped.completed.length}
                        subtitle="Keep up the good work!"
                        iconClass="bg-[#dff8f1] text-[#20b893]"
                        bgClass="bg-[#e8faf5]"
                    />
                    <StatCard
                        icon={XCircle}
                        title="Cancelled Appointments"
                        value={grouped.cancelled.length}
                        subtitle="Appointments you cancelled"
                        iconClass="bg-[#ffe8ec] text-[#f15c70]"
                        bgClass="bg-[#fff0f3]"
                    />
                    <StatCard
                        icon={Clock3}
                        title="Total Appointments"
                        value={appointments.length}
                        subtitle="All time appointments"
                        iconClass="bg-[#eee8ff] text-[#8c5df6]"
                        bgClass="bg-[#f2edff]"
                    />
                </div>

                {cancelError && !cancelTarget && (
                    <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs text-rose-600">{cancelError}</div>
                )}

                {/* TABS */}
                <div className="mb-3 flex items-center gap-2 overflow-x-auto">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            className={`whitespace-nowrap rounded-md px-4 py-2.5 text-xs font-semibold transition-colors ${activeTab === t.key
                                    ? "bg-[#0066FE] text-white"
                                    : "bg-white text-[#4A5568] shadow-sm ring-1 ring-[#e7eef7]"
                                }`}
                        >
                            {t.label} ({grouped[t.key].length})
                        </button>
                    ))}
                </div>


                <section className="rounded-lg border border-[#e4edf7] bg-white shadow-[0_2px_12px_rgba(30,91,150,0.03)]">
                    <div className="flex items-center justify-between border-b border-[#edf2f8] px-4 py-3.5">
                        <h2 className="text-sm font-bold text-[#4A5568]">
                            {TABS.find((t) => t.key === activeTab)?.label} Appointments
                        </h2>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-5 w-5 animate-spin text-[#0066FE]" />
                        </div>
                    )}

                    {isError && (
                        <p className="p-4 text-sm text-rose-500">Couldn't load your appointments. Please try again.</p>
                    )}

                    {!isLoading && !isError && activeList.length === 0 && (
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                            <CalendarDays className="text-[#4A5568]" size={32} />
                            <p className="text-sm text-[#4A5568]">No {activeTab} appointments.</p>
                        </div>
                    )}

                    {activeList.map((appointment) => (
                        <AppointmentRow
                            key={appointment._id}
                            appointment={appointment}
                            onCancelClick={setCancelTarget}
                            onViewDetails={setDetailsTarget}
                        />
                    ))}
                </section>

                {/* BOTTOM */}
                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr]">
                    <section className="rounded-lg border border-[#e4edf7] bg-white px-4 shadow-[0_2px_12px_rgba(30,91,150,0.03)]">
                        <div className="flex items-center justify-between border-b border-[#edf2f8] py-3.5">
                            <h2 className="text-sm font-bold text-[#0A1931]">Recent History</h2>
                        </div>
                        {recentHistory.length === 0 ? (
                            <p className="py-6 text-center text-xs text-[#4A5568]">
                                Completed and cancelled appointments will show up here.
                            </p>
                        ) : (
                            recentHistory.map((appointment) => (
                                <HistoryRow key={appointment._id} appointment={appointment} />
                            ))
                        )}
                    </section>

                    <section className="relative overflow-hidden rounded-lg border border-[#dceaf8] bg-gradient-to-br from-[#fafdff] to-[#f0f7ff] px-5 py-5">
                        <div className="flex items-center gap-5">
                            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e9f3ff]">
                                <CalendarDays size={42} strokeWidth={1.5} className="text-[#83b8fa]" />
                                <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#0066FE] text-white shadow-md">
                                    <CheckCircle2 size={17} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[#1b3b66]">Need to cancel your visit?</h3>
                                <p className="mt-1.5 max-w-[230px] text-xs leading-5 text-[#7c8da3]">
                                    You can cancel an upcoming appointment any time from this page. For other changes, our support team is here to help.
                                </p>
                                <button className="mt-3 flex items-center gap-2 rounded-md border border-[#77affb] bg-white px-3 py-2 text-xs font-semibold text-[#0066FE] transition hover:bg-[#f2f8ff]">
                                    <Headphones size={13} />
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {cancelTarget && (
                <CancelModal
                    appointment={cancelTarget}
                    cancelling={cancelling}
                    error={cancelError}
                    onClose={() => !cancelling && setCancelTarget(null)}
                    onConfirm={handleConfirmCancel}
                />
            )}

            {detailsTarget && (
                <DetailsModal appointment={detailsTarget} onClose={() => setDetailsTarget(null)} />
            )}
        </div>
    );
}