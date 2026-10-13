import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    CalendarDays,
    Users,
    MessageSquareText,
    Pill,
    ArrowRight,
    Star,
    Stethoscope,
    Building2,
    Mail,
    Phone,
    MessageSquare,
    Leaf,
    HeartPulse,
    Loader2,
} from "lucide-react";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&seed=";

function formatDateLabel(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Avatar({ name, src, size = "h-10 w-10", text = "text-sm", className = "" }) {
    const img = src || `${DEFAULT_AVATAR}${encodeURIComponent(name || "Doctor")}`;
    return <img src={img} alt={name} className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white ${className}`} />;
}

function Card({ children, className = "" }) {
    return (
        <section className={`rounded-2xl border border-blue-100/70 bg-white p-5 shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}>
            {children}
        </section>
    );
}

function CardHeader({ icon: Icon, title, subtitle, action = true, to = "#" }) {
    return (
        <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0066FE]">
                    <Icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                    <h2 className="text-[15px] font-semibold text-[#0A1931]">{title}</h2>
                    {subtitle && <p className="mt-0.5 text-xs text-[#4A5568]">{subtitle}</p>}
                </div>
            </div>
            {action && (
                <Link to={to} className="inline-flex items-center gap-1 rounded text-xs font-medium text-[#0066FE] hover:text-[#0055D4]">
                    View All <ArrowRight className="h-3 w-3" />
                </Link>
            )}
        </div>
    );
}

function StatCard({ label, value, note, icon: Icon, tint }) {
    return (
        <Card className="!p-4">
            <div className="flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${tint}`}>
                    <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm text-[#4A5568]">{label}</p>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-[#0A1931]">{value}</p>
            <p className="mt-2 text-xs text-slate-400">{note}</p>
        </Card>
    );
}

function AppointmentOverview({ weekly }) {
    const max = Math.max(5, ...weekly.map((d) => d.count));
    const ticks = [max, Math.round(max * 0.66), Math.round(max * 0.33), 0];

    return (
        <Card>
            <CardHeader icon={CalendarDays} title="Appointment Overview" subtitle="Your patient appointments for the last 7 days." action={false} />
            <div className="flex gap-2">
                <div className="relative h-40 w-5 text-[11px] text-[#4A5568]" aria-hidden="true">
                    {ticks.map((t, i) => (
                        <span key={i} className="absolute right-0 -translate-y-1/2" style={{ top: `${100 - (t / max) * 100}%` }}>
                            {t}
                        </span>
                    ))}
                </div>
                <div className="flex-1">
                    <div className="relative h-40">
                        {ticks.map((t, i) => (
                            <div key={i} className="absolute inset-x-0 border-t border-dashed border-slate-100" style={{ top: `${100 - (t / max) * 100}%` }} />
                        ))}
                        <div className="relative flex h-full items-end justify-between px-1 sm:px-3">
                            {weekly.map((d) => (
                                <div key={d.date} className="flex w-9 flex-col items-center justify-end sm:w-11">
                                    <span className="mb-1 text-[11px] font-semibold text-[#4A5568]">{d.count}</span>
                                    <div
                                        className="w-full rounded-t-md bg-gradient-to-b from-blue-500 to-blue-400"
                                        style={{ height: `${max ? (d.count / max) * 100 : 0}%`, minHeight: d.count ? "4px" : 0 }}
                                        role="img"
                                        aria-label={`${d.day}: ${d.count} appointments`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between px-1 sm:px-3">
                        {weekly.map((d) => (
                            <div key={d.date} className="w-9 text-center sm:w-11">
                                <p className="text-xs font-medium text-[#4A5568]">{d.day}</p>
                                <p className="text-[10px] text-[#4A5568]">{formatDateLabel(d.date)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}

function PatientStatistics({ patientMix, totalPatients }) {
    const R = 48;
    const C = 2 * Math.PI * R;
    const total = patientMix.new + patientMix.returning || 1;
    const segments = [
        { label: "New Patients", count: patientMix.new, color: "#2563eb", dot: "bg-blue-600" },
        { label: "Returning Patients", count: patientMix.returning, color: "#2dd4bf", dot: "bg-teal-400" },
    ];
    let acc = 0;
    const arcs = segments.map((s) => {
        const pct = (s.count / total) * 100;
        const len = (pct / 100) * C;
        const seg = { ...s, pct, len: Math.max(len - 2, 0), offset: acc };
        acc += len;
        return seg;
    });

    return (
        <Card>
            <CardHeader icon={Users} title="Patient Statistics" subtitle="New vs. returning patients." action={false} />
            <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-between">
                <div className="relative h-40 w-40 shrink-0">
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label="Patient mix donut chart">
                        <circle cx="60" cy="60" r={R} fill="none" stroke="#f1f5f9" strokeWidth="14" />
                        {arcs.map((s) => (
                            <circle key={s.label} cx="60" cy="60" r={R} fill="none" stroke={s.color} strokeWidth="14" strokeDasharray={`${s.len} ${C - s.len}`} strokeDashoffset={-s.offset} />
                        ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-[#0A1931]">{totalPatients}</span>
                        <span className="text-[11px] text-[#4A5568]">Total Patients</span>
                    </div>
                </div>
                <ul className="min-w-[180px] flex-1 space-y-3 text-sm">
                    {arcs.map((s) => (
                        <li key={s.label} className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                            <span className="flex-1 text-[#4A5568]">{s.label}</span>
                            <span className="w-9 text-right text-xs text-[#4A5568]">{s.pct.toFixed(0)}%</span>
                            <span className="w-8 text-right font-semibold text-[#0A1931]">{s.count}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
}

function StatusBadge({ status }) {
    const map = {
        confirmed: "bg-emerald-50 text-emerald-600",
        pending_payment: "bg-amber-50 text-amber-600",
    };
    const label = { confirmed: "Confirmed", pending_payment: "Payment Pending" }[status] || status;
    return <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${map[status] || "bg-slate-100 text-[#4A5568]"}`}>{label}</span>;
}

function UpcomingAppointments({ upcoming }) {
    return (
        <Card>
            <CardHeader icon={CalendarDays} title="Upcoming Appointments" to="/dashboard/doctors-appointment" />
            {upcoming.length === 0 ? (
                <p className="py-6 text-center text-sm text-[#4A5568]">No upcoming appointments.</p>
            ) : (
                <ul className="divide-y divide-slate-50">
                    {upcoming.map((a) => (
                        <li key={a._id} className="flex items-center gap-3 py-2.5">
                            <Avatar name={a.patientName} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[#0A1931]">{a.patientName || "Patient"}</p>
                                <p className="truncate text-xs text-[#4A5568]">{a.patientPhone || formatDateLabel(a.date)}</p>
                            </div>
                            <p className="hidden text-xs text-[#4A5568] sm:block">{a.time_slot}</p>
                            <StatusBadge status={a.status} />
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}

function RecentPatients({ recentPatients }) {
    return (
        <Card>
            <CardHeader icon={Users} title="Recent Patients" to="/dashboard/patients" />
            {recentPatients.length === 0 ? (
                <p className="py-6 text-center text-sm text-[#4A5568]">No patients yet.</p>
            ) : (
                <ul className="divide-y divide-slate-50">
                    {recentPatients.map((p) => (
                        <li key={p._id} className="flex items-center gap-3 py-2.5">
                            <Avatar name={p.patientName} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[#0A1931]">{p.patientName || "Patient"}</p>
                                <p className="truncate text-xs text-[#4A5568]">Last visit: {formatDateLabel(p.date)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}

function ProfileCard({ profile, stats }) {
    if (!profile) return null;
    const fullName = `Dr. ${profile.first_name} ${profile.last_name}`;
    const rows = [
        { icon: HeartPulse, label: "Specialization", value: profile.department },
        { icon: Building2, label: "Hospital / Chamber", value: profile.chamber_address || profile.location },
        { icon: Mail, label: "Email", value: profile.email },
        { icon: Phone, label: "Phone", value: profile.phone },
    ].filter((r) => r.value);

    return (
        <Card>
            <div className="flex items-center gap-4">
                <Avatar name={fullName} src={profile.photoUrl} size="h-16 w-16" text="text-xl" />
                <div>
                    <h2 className="text-lg font-semibold text-[#0A1931]">{fullName}</h2>
                    <p className="text-sm text-[#4A5568]">{profile.designation || profile.department}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#4A5568]">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-[#0A1931]">{(profile.rating ?? 0).toFixed(1)}</span>
                        ({profile.reviewCount ?? 0} reviews)
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
                    <p className="text-xs text-[#4A5568]">Experience</p>
                    <p className="mt-1 text-sm font-semibold text-[#0A1931]">{profile.experience_years}+ Years</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
                    <p className="text-xs text-[#4A5568]">Patients Today</p>
                    <p className="mt-1 text-sm font-semibold text-[#0A1931]">{stats.todaysAppointments}</p>
                </div>
            </div>

            <ul className="mt-4 divide-y divide-slate-100">
                {rows.map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex items-start gap-3 py-3">
                        <Icon className="mt-0.5 h-4 w-4 text-[#4A5568]" />
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-[#4A5568]">{label}</p>
                            <p className="break-words text-xs text-[#0066FE]">{value}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

function QuickActions() {
    const actions = [
        { label: "View Schedule", icon: CalendarDays, to: "/dashboard/appointment" },
        { label: "My Patients", icon: Users, to: "/dashboard/patients" },
        { label: "Messages", icon: MessageSquare, to: "/dashboard/messages" },
        { label: "Notifications", icon: MessageSquareText, to: "/dashboard/notifications" },
    ];
    return (
        <Card>
            <h2 className="mb-4 text-[15px] font-semibold text-[#0A1931]">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
                {actions.map(({ label, icon: Icon, to }) => (
                    <Link
                        key={label}
                        to={to}
                        className="flex flex-col items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50/40 px-2 py-4 text-xs font-medium text-[#4A5568] transition hover:border-blue-300 hover:bg-blue-50"
                    >
                        <Icon className="h-6 w-6 text-blue-600" strokeWidth={1.75} />
                        {label}
                    </Link>
                ))}
            </div>
        </Card>
    );
}

function CareBanner({ profile }) {
    return (
        <section className="flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100 p-5">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/70">
                <Stethoscope className="h-12 w-12 text-[#0066FE]" strokeWidth={1.5} />
                <Leaf className="absolute right-1 top-2 h-6 w-6 -rotate-12 text-[#10B981]" strokeWidth={1.5} />
            </div>
            <div>
                <h3 className="text-base font-semibold text-[#0066FE]">Your Care Matters</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#4A5568]">Healthy patients build a healthier world.</p>
                {profile && (
                    <Link
                        to="/dashboard/doctor-profile"
                        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#0066FE] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        View Profile <ArrowRight className="h-3 w-3" />
                    </Link>
                )}
            </div>
        </section>
    );
}

export default function DoctorDashboard() {
    const axiosSecure = useAxiosSecure();

    const { data, isLoading } = useQuery({
        queryKey: ["doctor-dashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/dashboard/doctor");
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-[#0066FE]" />
            </div>
        );
    }

    const profile = data?.profile;
    const stats = data?.stats ?? { totalPatients: 0, todaysAppointments: 0, awaitingReply: 0, prescriptionsThisWeek: 0 };
    const weekly = data?.weekly ?? [];
    const patientMix = data?.patientMix ?? { new: 0, returning: 0 };
    const upcoming = data?.upcoming ?? [];
    const recentPatients = data?.recentPatients ?? [];

    const statCards = [
        { label: "Total Patients", value: stats.totalPatients, note: "All time, unique patients", icon: Users, tint: "bg-blue-100 text-[#0066FE]" },
        { label: "Today's Appointments", value: stats.todaysAppointments, note: "Scheduled for today", icon: CalendarDays, tint: "bg-sky-100 text-[#0066FE]" },
        { label: "Awaiting Reply", value: stats.awaitingReply, note: "Patients waiting on you", icon: MessageSquareText, tint: "bg-indigo-100 text-[#0066FE]" },
        { label: "Prescriptions", value: stats.prescriptionsThisWeek, note: "Added this week", icon: Pill, tint: "bg-violet-100 text-[#0066FE]" },
    ];

    return (
        <div className="min-h-screen p-4 font-sans text-[#0A1931] sm:p-6">
            <div className="mx-auto grid max-w-[1400px] gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <main className="space-y-5">
                    <header className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar name={profile ? `Dr. ${profile.first_name} ${profile.last_name}` : "Doctor"} src={profile?.photoUrl} size="h-14 w-14" text="text-lg" />
                            <div>
                                <h1 className="text-xl font-semibold text-[#0A1931]">
                                    Good Morning, {profile ? `Dr. ${profile.first_name} ${profile.last_name}` : "Doctor"}
                                </h1>
                                <p className="text-sm text-[#0066FE]/80">Here's what's happening with your practice today.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5 text-[#4A5568]">
                            <CalendarDays className="mt-0.5 h-5 w-5 text-[#0066FE]" />
                            <div className="text-right">
                                <p className="text-sm font-medium text-[#0A1931]">
                                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                                </p>
                                <p className="text-xs text-[#4A5568]">Have a great day!</p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
                    </div>

                    <div className="grid gap-5 xl:grid-cols-2">
                        <AppointmentOverview weekly={weekly} />
                        <PatientStatistics patientMix={patientMix} totalPatients={stats.totalPatients} />
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
                        <UpcomingAppointments upcoming={upcoming} />
                        <RecentPatients recentPatients={recentPatients} />
                    </div>
                </main>

                <aside className="space-y-5">
                    <ProfileCard profile={profile} stats={stats} />
                    <QuickActions />
                    <CareBanner profile={profile} />
                </aside>
            </div>
        </div>
    );
}