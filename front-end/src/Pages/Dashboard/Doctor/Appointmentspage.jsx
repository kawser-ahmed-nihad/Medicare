import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import {
    CalendarDays,
    Calendar,
    CheckCircle2,
    XCircle,
    XSquare,
    Clock,
    Users,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    X,
    Stethoscope,
    Leaf,
    Loader2,
    Wallet,
    Phone,
} from "lucide-react";

const DEFAULT_AVATAR =
    "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&seed=";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n) => String(n).padStart(2, "0");

function todayKey() {
    const d = new Date();

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
    )}`;
}

function formatDateLabel(dateStr) {
    if (!dateStr) return "N/A";

    const [y, m, d] = dateStr.split("-").map(Number);

    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function addMinutesTo12h(timeStr, durationMin) {
    if (!timeStr) return "";

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

    return `${String(endH12).padStart(2, "0")}:${String(
        endM
    ).padStart(2, "0")} ${endPeriod}`;
}

function classify(a, today) {
    if (a.status === "completed") return "completed";

    if (["cancelled", "expired"].includes(a.status)) {
        return "cancelled";
    }

    if (a.date === today) return "today";

    return "upcoming";
}

const STATUS_META = {
    confirmed: {
        label: "Confirmed",
        className: "bg-emerald-100 text-emerald-600",
    },

    pending_payment: {
        label: "Payment Pending",
        className: "bg-amber-100 text-amber-600",
    },

    completed: {
        label: "Completed",
        className: "bg-sky-100 text-sky-700",
    },

    cancelled: {
        label: "Cancelled",
        className: "bg-rose-100 text-rose-600",
    },

    expired: {
        label: "Expired",
        className: "bg-slate-100 text-slate-500",
    },
};

function StatusBadge({ status }) {
    const m = STATUS_META[status] || {
        label: status || "Unknown",
        className: "bg-slate-100 text-slate-500",
    };

    return (
        <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${m.className}`}
        >
            {m.label}
        </span>
    );
}

function Avatar({
    name,
    size = "h-11 w-11",
}) {
    const img = `${DEFAULT_AVATAR}${encodeURIComponent(
        name || "Patient"
    )}`;

    return (
        <img
            src={img}
            alt={name || "Patient"}
            className={`${size} shrink-0 rounded-full object-cover`}
        />
    );
}

/* ---------------- card ---------------- */

function Card({ children, className = "" }) {
    return (
        <section
            className={`rounded-2xl border border-blue-100/70 bg-white shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}
        >
            {children}
        </section>
    );
}

/* ---------------- stat card ---------------- */

function StatCard({
    label,
    value,
    icon: Icon,
    tint,
    note,
}) {
    return (
        <Card className="flex items-center gap-4 p-4">
            <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tint}`}
            >
                <Icon className="h-6 w-6" />
            </span>

            <div>
                <p className="text-xs font-medium text-[#4A5568]">
                    {label}
                </p>

                <p className="text-3xl font-bold leading-tight text-[#0A1931]">
                    {value}
                </p>

                {note && (
                    <p className="text-xs text-[#4A5568]">
                        {note}
                    </p>
                )}
            </div>
        </Card>
    );
}

/* ---------------- details / action modal ---------------- */

function AppointmentModal({
    appointment,
    onClose,
    onComplete,
    onCancel,
    submitting,
}) {
    if (!appointment) return null;

    const endTime = addMinutesTo12h(
        appointment.time_slot,
        appointment.duration_minutes
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-[#0A1931]">
                        Appointment Details
                    </h3>

                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="text-[#4A5568] hover:text-[#0A1931]"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <Avatar
                        name={appointment.patientName}
                        size="h-12 w-12"
                    />

                    <div>
                        <p className="text-sm font-semibold text-[#0A1931]">
                            {appointment.patientName ||
                                "Patient"}
                        </p>

                        {appointment.patientPhone && (
                            <p className="text-xs text-[#4A5568]">
                                {appointment.patientPhone}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3.5 text-sm">
                    <p className="flex justify-between gap-4">
                        <span className="text-[#4A5568]">
                            Date
                        </span>

                        <span className="font-medium text-[#0A1931]">
                            {formatDateLabel(
                                appointment.date
                            )}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span className="text-[#4A5568]">
                            Time
                        </span>

                        <span className="font-medium text-[#0A1931]">
                            {appointment.time_slot} –{" "}
                            {endTime}
                        </span>
                    </p>

                    <p className="flex justify-between gap-4">
                        <span className="text-[#4A5568]">
                            Fee
                        </span>

                        <span className="text-right font-medium text-[#0A1931]">
                            ৳{appointment.consultation_fee}{" "}
                            (
                            {appointment.payment_method ===
                                "online"
                                ? "paid online"
                                : "pay at hospital"}
                            )
                        </span>
                    </p>

                    <p className="flex items-center justify-between gap-4">
                        <span className="text-[#4A5568]">
                            Status
                        </span>

                        <StatusBadge
                            status={appointment.status}
                        />
                    </p>
                </div>

                <div className="mt-5 flex gap-3">
                    {appointment.status === "confirmed" && (
                        <>
                            <button
                                onClick={onCancel}
                                disabled={submitting}
                                className="flex-1 rounded-xl border border-rose-200 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={onComplete}
                                disabled={submitting}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {submitting && (
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                )}

                                Mark Completed
                            </button>
                        </>
                    )}

                    {appointment.status !== "confirmed" && (
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-[#4A5568] hover:bg-slate-50"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------------- table ---------------- */

const TABS = [
    {
        id: "today",
        label: "Today",
        icon: Calendar,
    },
    {
        id: "upcoming",
        label: "Upcoming",
        icon: CalendarDays,
    },
    {
        id: "completed",
        label: "Completed",
        icon: CheckCircle2,
    },
    {
        id: "cancelled",
        label: "Cancelled",
        icon: XCircle,
    },
];

function AppointmentsTable({
    grouped = {},
    onRowClick,
}) {
    const [active, setActive] = useState("today");

    // console.log(grouped)
    /*
    * Fix: prevent the component from crashing when grouped is undefined.
     */
    const safeGrouped = {
        today: [],
        upcoming: [],
        completed: [],
        cancelled: [],
        ...(grouped || {}),
    };

    const rows = safeGrouped[active] || [];

    return (
        <Card className="p-5">
            <div className="flex flex-wrap items-center gap-2">
                {TABS.map(
                    ({ id, label, icon: Icon }) => {
                        const selected = active === id;

                        return (
                            <button
                                key={id}
                                onClick={() =>
                                    setActive(id)
                                }
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${selected
                                    ? "bg-[#0066FE] text-white shadow-sm"
                                    : "text-[#4A5568] hover:bg-blue-50"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />

                                {label} (
                                {safeGrouped[id]?.length ??
                                    0}
                                )
                            </button>
                        );
                    }
                )}
            </div>

            <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
                    <thead>
                        <tr className="bg-blue-50/60 text-xs font-semibold text-[#4A5568]">
                            <th className="rounded-l-lg px-4 py-3">
                                Patient
                            </th>

                            <th className="px-4 py-3">
                                Date &amp; Time
                            </th>

                            <th className="px-4 py-3">
                                Payment
                            </th>

                            <th className="px-4 py-3">
                                Status
                            </th>

                            <th className="rounded-r-lg px-4 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((a) => (
                            <tr
                                key={a._id}
                                className="group"
                            >
                                <td className="border-b border-slate-100 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            name={
                                                a.patientName
                                            }
                                        />

                                        <div>
                                            <p className="text-sm font-semibold text-[#0A1931]">
                                                {a.patientName ||
                                                    "Patient"}
                                            </p>

                                            {a.patientPhone && (
                                                <p className="flex items-center gap-1 text-[11px] text-[#4A5568]">
                                                    <Phone
                                                        size={
                                                            10
                                                        }
                                                    />

                                                    {
                                                        a.patientPhone
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                <td className="border-b border-slate-100 px-4 py-3">
                                    <div className="flex items-center gap-2.5">
                                        <CalendarDays className="h-4 w-4 shrink-0 text-[#0066FE]" />

                                        <div className="text-xs">
                                            <p className="font-medium text-[#0A1931]">
                                                {formatDateLabel(
                                                    a.date
                                                )}
                                            </p>

                                            <p className="text-[#4A5568]">
                                                {
                                                    a.time_slot
                                                }{" "}
                                                –{" "}
                                                {addMinutesTo12h(
                                                    a.time_slot,
                                                    a.duration_minutes
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="border-b border-slate-100 px-4 py-3 text-xs">
                                    <p className="flex items-center gap-1 font-medium text-[#0A1931]">
                                        <Wallet size={11} />

                                        ৳
                                        {
                                            a.consultation_fee
                                        }
                                    </p>

                                    <p className="text-[#4A5568]">
                                        {a.payment_method ===
                                            "online"
                                            ? "Paid online"
                                            : "At hospital"}
                                    </p>
                                </td>

                                <td className="border-b border-slate-100 px-4 py-3">
                                    <StatusBadge
                                        status={a.status}
                                    />
                                </td>

                                <td className="border-b border-slate-100 px-4 py-3">
                                    <button
                                        onClick={() =>
                                            onRowClick(a)
                                        }
                                        className="rounded-md border border-[#0066FE] px-4 py-1.5 text-xs font-semibold text-[#0066FE] transition hover:bg-blue-50"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {rows.length === 0 && (
                    <p className="py-16 text-center text-sm text-[#4A5568]">
                        No appointments to show in this tab.
                    </p>
                )}
            </div>
        </Card>
    );
}

/* ---------------- mini calendar ---------------- */

const DOT_COLOR = {
    confirmed: "bg-emerald-500",
    pending: "bg-blue-500",
    cancelled: "bg-orange-400",
};

function MiniCalendar({ appointments = [] }) {
    const today = new Date();

    const [view, setView] = useState({
        year: today.getFullYear(),
        month: today.getMonth(),
    });

    const [selected, setSelected] =
        useState(todayKey());

    const markers = useMemo(() => {
        const map = {};

        appointments.forEach((a) => {
            let key;

            if (
                a.status === "confirmed" ||
                a.status === "completed"
            ) {
                key = "confirmed";
            } else if (
                a.status === "pending_payment"
            ) {
                key = "pending";
            } else {
                key = "cancelled";
            }

            if (!map[a.date]) {
                map[a.date] = new Set();
            }

            map[a.date].add(key);
        });

        const out = {};

        Object.entries(map).forEach(
            ([date, set]) => {
                out[date] = [...set];
            }
        );

        return out;
    }, [appointments]);

    const { year, month } = view;

    const monthName = new Date(
        year,
        month,
        1
    ).toLocaleString("en-US", {
        month: "long",
    });

    const offset = new Date(
        year,
        month,
        1
    ).getDay();

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const cells = [
        ...Array(offset).fill(null),
        ...Array.from(
            { length: daysInMonth },
            (_, i) => i + 1
        ),
    ];

    const shift = (delta) =>
        setView(({ year, month }) => {
            const d = new Date(
                year,
                month + delta,
                1
            );

            return {
                year: d.getFullYear(),
                month: d.getMonth(),
            };
        });

    return (
        <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0A1931]">
                    {monthName} {year}
                </h2>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => shift(-1)}
                        aria-label="Previous month"
                        className="rounded-md p-1.5 text-[#4A5568] hover:bg-blue-50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        onClick={() => shift(1)}
                        aria-label="Next month"
                        className="rounded-md p-1.5 text-[#4A5568] hover:bg-blue-50"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center">
                {WEEKDAYS.map((d) => (
                    <div
                        key={d}
                        className="pb-1 text-[11px] font-medium text-[#4A5568]"
                    >
                        {d}
                    </div>
                ))}

                {cells.map((day, i) => {
                    if (day === null) {
                        return (
                            <div
                                key={`blank-${i}`}
                            />
                        );
                    }

                    const key = `${year}-${pad(
                        month + 1
                    )}-${pad(day)}`;

                    const dots =
                        markers[key] || [];

                    const isSelected =
                        key === selected;

                    return (
                        <div
                            key={key}
                            className="flex flex-col items-center"
                        >
                            <button
                                onClick={() =>
                                    setSelected(key)
                                }
                                aria-pressed={
                                    isSelected
                                }
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${isSelected
                                    ? "bg-[#0066FE] font-semibold text-white shadow"
                                    : "text-[#0A1931] hover:bg-blue-50"
                                    }`}
                            >
                                {day}
                            </button>

                            <div className="mt-0.5 flex h-1.5 items-center gap-0.5">
                                {dots.map((d) => (
                                    <span
                                        key={d}
                                        className={`h-1 w-1 rounded-full ${DOT_COLOR[d]}`}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#4A5568]">
                {[
                    ["Confirmed", "confirmed"],
                    [
                        "Pending Payment",
                        "pending",
                    ],
                    [
                        "Cancelled",
                        "cancelled",
                    ],
                ].map(([label, key]) => (
                    <li
                        key={key}
                        className="flex items-center gap-1.5"
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${DOT_COLOR[key]}`}
                        />

                        {label}
                    </li>
                ))}
            </ul>
        </Card>
    );
}

/* ---------------- quick actions + banner ---------------- */

function QuickActions({ awaitingReply = 0 }) {
    const actions = [
        {
            label: "My Patients",
            icon: Users,
            to: "/dashboard/patients",
        },
        {
            label: "Messages",
            icon: MessageSquare,
            to: "/dashboard/messages",
            badge: awaitingReply,
        },
    ];

    return (
        <Card className="p-5">
            <h2 className="mb-4 text-base font-bold text-[#0A1931]">
                Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-3">
                {actions.map(
                    ({
                        label,
                        icon: Icon,
                        to,
                        badge,
                    }) => (
                        <Link
                            key={label}
                            to={to}
                            className="relative flex min-h-[92px] flex-col items-start justify-between rounded-xl border border-[#E2E8F0] bg-[#F7FAFC]/40 p-3 text-left text-xs font-medium text-[#4A5568] transition hover:border-[#A0AEC0] hover:bg-[#EDF2F7]"
                        >
                            <Icon
                                className="h-6 w-6 text-[#0066FE]"
                                strokeWidth={1.75}
                            />

                            {label}

                            {badge > 0 && (
                                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                                    {badge}
                                </span>
                            )}
                        </Link>
                    )
                )}
            </div>
        </Card>
    );
}

function GreetingBanner({
    profile,
    todaysCount,
}) {
    const name = profile
        ? `Dr. ${profile.first_name} ${profile.last_name}`
        : "Doctor";

    return (
        <section className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100 p-5">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/70">
                <Stethoscope
                    className="h-12 w-12 text-[#0066FE]"
                    strokeWidth={1.5}
                />

                <Leaf
                    className="absolute left-1 top-3 h-6 w-6 rotate-12 text-emerald-400"
                    strokeWidth={1.5}
                />
            </div>

            <div>
                <h3 className="text-sm font-bold leading-snug text-[#0A1931]">
                    Good Morning,
                    <br />
                    {name}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-[#4A5568]">
                    You have {todaysCount}{" "}
                    appointment
                    {todaysCount !== 1
                        ? "s"
                        : ""}{" "}
                    today. Keep up the great
                    work!
                </p>
            </div>
        </section>
    );
}

/* ---------------- page ---------------- */

export default function DoctorAppointmentsPage() {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [modalTarget, setModalTarget] =
        useState(null);

    const [submitting, setSubmitting] =
        useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["doctor-appointments"],

        queryFn: async () => {
            const res = await axiosSecure.get(
                "/api/appointments/doctor/mine"
            );

            return res.data.appointments;
        },
    });

    // console.log(data)

    const { data: profile } = useQuery({
        queryKey: [
            "my-doctor-profile",
            user?.doctorId,
        ],

        queryFn: async () => {
            const res = await axiosSecure.get(
                `/api/doctors/${user.doctorId}`
            );

            return res.data.doctor;
        },

        enabled: Boolean(user?.doctorId),
    });

    const { data: conversations } = useQuery({
        queryKey: ["doctor-conversations-badge"],

        queryFn: async () => {
            const res = await axiosSecure.get(
                "/api/conversations/mine"
            );

            return res.data.conversations;
        },
    });

    const awaitingReply = (
        conversations ?? []
    ).filter(
        (c) =>
            c.lastSenderRole === "patient"
    ).length;

    const appointments = Array.isArray(data)
        ? data
        : [];

    const today = todayKey();

    /*
     * GROUP APPOINTMENTS
     */
    const grouped = useMemo(() => {
        const g = {
            today: [],
            upcoming: [],
            completed: [],
            cancelled: [],
        };

        appointments.forEach((a) => {
            const type = classify(a, today);

            /*
             * Defensive check: prevent a crash if an unexpected category is returned.
             */
            if (g[type]) {
                g[type].push(a);
            }
        });

        g.today.sort((a, b) =>
            (a.time_slot || "").localeCompare(
                b.time_slot || ""
            )
        );

        g.upcoming.sort((a, b) =>
            (a.date || "").localeCompare(
                b.date || ""
            )
        );

        g.completed.sort((a, b) =>
            (b.date || "").localeCompare(
                a.date || ""
            )
        );

        g.cancelled.sort((a, b) =>
            (b.date || "").localeCompare(
                a.date || ""
            )
        );

        return g;
    }, [appointments, today]);

    /*
     * STATS
     */
    const stats = useMemo(() => {
        const totalPatients = new Set(
            appointments.map((a) =>
                String(a.patientId)
            )
        ).size;

        return {
            todays: grouped?.today?.length ?? 0,
            totalPatients,
            completed:
                grouped?.completed?.length ?? 0,
            cancelled:
                grouped?.cancelled?.length ?? 0,
        };
    }, [appointments, grouped]);

    /* ---------------- complete appointment ---------------- */

    const handleComplete = async () => {
        if (!modalTarget) return;

        setSubmitting(true);

        try {
            await axiosSecure.patch(
                `/api/appointments/${modalTarget._id}/complete`
            );

            await queryClient.invalidateQueries({
                queryKey: [
                    "doctor-appointments",
                ],
            });

            setModalTarget(null);
        } catch (err) {
            console.error(
                err.response?.data?.message ||
                err.message
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------------- cancel appointment ---------------- */

    const handleCancel = async () => {
        if (!modalTarget) return;

        setSubmitting(true);

        try {
            await axiosSecure.patch(
                `/api/appointments/${modalTarget._id}/cancel`
            );

            await queryClient.invalidateQueries({
                queryKey: [
                    "doctor-appointments",
                ],
            });

            setModalTarget(null);
        } catch (err) {
            console.error(
                err.response?.data?.message ||
                err.message
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------------- loading ---------------- */

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center  p-6">
                <Loader2 className="h-6 w-6 animate-spin text-[#0066FE]" />
            </div>
        );
    }

    const statCards = [
        {
            label: "Today's Appts",
            value: stats.todays,
            icon: CalendarDays,
            tint: "bg-[#E2E8F0] text-[#0066FE]",
        },

        {
            label: "Total Patients",
            value: stats.totalPatients,
            icon: Users,
            tint: "bg-emerald-100 text-emerald-600",
        },

        {
            label: "Completed",
            value: stats.completed,
            icon: Clock,
            tint: "bg-violet-100 text-violet-600",
        },

        {
            label: "Cancelled",
            value: stats.cancelled,
            icon: XSquare,
            tint: "bg-rose-100 text-rose-500",
        },
    ];

    return (
        <div className="min-h-screen p-4 font-sans text-[#0A1931] sm:p-6">
            <div className="mx-auto grid max-w-[1400px] gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
                <main className="space-y-5">
                    <header>
                        <h1 className="text-2xl font-bold text-[#0A1931]">
                            Appointments
                        </h1>

                        <p className="mt-1 text-sm text-[#4A5568]">
                            Manage your upcoming
                            and past
                            appointments.
                        </p>
                    </header>

                    {/* STATS */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((s) => (
                            <StatCard
                                key={s.label}
                                {...s}
                            />
                        ))}
                    </div>

                    {/* APPOINTMENTS TABLE */}
                    <AppointmentsTable
                        grouped={grouped}
                        onRowClick={
                            setModalTarget
                        }
                    />
                </main>

                {/* RIGHT SIDEBAR */}
                <aside className="space-y-5">
                    <MiniCalendar
                        appointments={
                            appointments
                        }
                    />

                    <QuickActions
                        awaitingReply={
                            awaitingReply
                        }
                    />

                    <GreetingBanner
                        profile={profile}
                        todaysCount={
                            stats.todays
                        }
                    />
                </aside>
            </div>

            {/* MODAL */}
            {modalTarget && (
                <AppointmentModal
                    appointment={modalTarget}
                    submitting={submitting}
                    onClose={() =>
                        !submitting &&
                        setModalTarget(null)
                    }
                    onComplete={
                        handleComplete
                    }
                    onCancel={
                        handleCancel
                    }
                />
            )}
        </div>
    );
}


