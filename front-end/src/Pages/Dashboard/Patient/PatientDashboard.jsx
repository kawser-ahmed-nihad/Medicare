import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    FileText,
    Lightbulb,
    MapPin,
    Pill,
    UserRound,
    MessageSquare,
    Loader2,
} from "lucide-react";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&seed=";

function to12Hour(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    let hour = h % 12;
    if (hour === 0) hour = 12;
    return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDateLabel(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });
}

const PatientDashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ["patient-dashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/dashboard/patient");
            return res.data;
        },
        enabled: Boolean(user),
    });

    const s = data?.stats ?? {
        upcomingCount: 0,
        doctorsVisited: 0,
        totalRecords: 0,
        activePrescriptions: 0,
    };

    const next = data?.nextAppointment;
    const recentDoctors = data?.recentDoctors ?? [];

    const stats = [
        {
            title: "Upcoming Appointments",
            value: s.upcomingCount,
            subtitle: next
                ? `Next: ${formatDateLabel(next.date)}`
                : "No upcoming visits",
            icon: CalendarDays,
            to: "/dashboard/my-appointments",
        },
        {
            title: "Total Doctors Visited",
            value: s.doctorsVisited,
            subtitle: "All time",
            icon: UserRound,
            to: "/dashboard/my-appointments",
        },
        {
            title: "Medical Records",
            value: s.totalRecords,
            subtitle: "View all records",
            icon: FileText,
            to: "/dashboard/medical-records",
        },
        {
            title: "Active Prescriptions",
            value: s.activePrescriptions,
            subtitle: "View prescriptions",
            icon: Pill,
            to: "/dashboard/medical-records",
        },
    ];

    const quickActions = [
        { title: "Book Appointment", icon: CalendarDays, to: "/find-doctors" },
        { title: "Find Doctors", icon: UserRound, to: "/find-doctors" },
        { title: "View Records", icon: FileText, to: "/dashboard/medical-records" },
        { title: "Message Doctor", icon: MessageSquare, to: "/dashboard/messages" },
    ];

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-7">
                <Loader2 className="h-6 w-6 animate-spin text-[#0878F9]" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-7">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_348px]">

                {/* ================= LEFT ================= */}
                <div className="min-w-0">
                    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-[24px] font-bold tracking-tight text-[#0A2B63] sm:text-[26px]">
                                Good Morning, {user?.name || "there"} 👋
                            </h1>

                            <p className="mt-1 text-[14px] text-[#6680A3]">
                                Take care of your health. We're here to support you.
                            </p>
                        </div>

                        <div className="flex min-w-0 items-center gap-2 text-[13px] text-[#46658D]">
                            <CalendarDays size={16} strokeWidth={1.7} />
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </div>
                    </div>

                    {/* ================= HERO ================= */}
                    <section className="relative mb-5 min-h-[178px] overflow-hidden rounded-[11px] bg-gradient-to-r from-[#E4F2FF] via-[#EAF5FF] to-[#D7EBFF] px-6 py-6 sm:px-7">
                        <div className="relative z-10 max-w-[500px]">
                            <h2 className="text-[24px] font-bold text-[#0A2B63] sm:text-[25px]">
                                Your Health, Our Priority
                            </h2>

                            <p className="mt-2 max-w-[470px] text-[14px] leading-6 text-[#57759D]">
                                Book your next appointment, access your medical records, and stay on top of your health – all in one place.
                            </p>

                            <Link
                                to="/find-doctors"
                                className="mt-4 flex h-[35px] w-fit cursor-pointer items-center gap-3 rounded-[7px] bg-[#0878F9] px-5 text-[13px] font-semibold text-white shadow-[0_5px_12px_rgba(8,120,249,0.2)] transition hover:bg-[#006BEA]"
                            >
                                Book Appointment
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    </section>

                    {/* ================= STATS ================= */}
                    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    to={item.to}
                                    className="group rounded-[11px] border border-[#E0EBF5] bg-white p-4 shadow-[0_2px_8px_rgba(30,70,100,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_7px_20px_rgba(30,70,100,0.07)]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#EAF4FF] text-[#0878F9]">
                                            <Icon size={19} strokeWidth={1.7} />
                                        </div>

                                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0F7FF] text-[#0878F9] transition group-hover:bg-[#0878F9] group-hover:text-white">
                                            <ArrowRight size={14} />
                                        </span>
                                    </div>

                                    <p className="mt-3 text-[13px] font-medium text-[#173F76]">
                                        {item.title}
                                    </p>

                                    <p className="mt-1 text-[28px] font-bold leading-none text-[#0A2B63]">
                                        {item.value}
                                    </p>

                                    <p className="mt-1.5 text-[12px] text-[#7890AE]">
                                        {item.subtitle}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>

                    {/* ================= APPOINTMENT + DOCTORS ================= */}
                    <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1.45fr_1fr]">

                        {/* Upcoming Appointment */}
                        <section className="rounded-[11px] border border-[#E0EBF5] bg-white p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-[15px] font-bold text-[#0A2B63]">
                                    Upcoming Appointment
                                </h3>

                                <Link
                                    to="/dashboard/my-appointments"
                                    className="flex items-center gap-1 text-[12px] font-medium text-[#0878F9]"
                                >
                                    View All <ArrowRight size={12} />
                                </Link>
                            </div>

                            {!next ? (
                                <div className="rounded-[9px] border border-dashed border-[#DFEAF5] p-6 text-center text-[13px] text-[#7890AE]">
                                    No upcoming appointments.{" "}
                                    <Link
                                        to="/find-doctors"
                                        className="font-semibold text-[#0878F9]"
                                    >
                                        Book one →
                                    </Link>
                                </div>
                            ) : (
                                <div className="rounded-[9px] border border-[#DFEAF5] p-3">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                        <img
                                            src={
                                                next.doctorPhoto ||
                                                `${DEFAULT_AVATAR}${encodeURIComponent(next.doctorName)}`
                                            }
                                            alt={next.doctorName}
                                            className="h-[58px] w-[58px] rounded-full object-cover"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h4 className="text-[14px] font-bold text-[#0A2B63]">
                                                        {next.doctorName}
                                                    </h4>

                                                    {next.doctorDepartment && (
                                                        <p className="mt-0.5 text-[12px] text-[#6684A9]">
                                                            {next.doctorDepartment}
                                                        </p>
                                                    )}
                                                </div>

                                                <span className="rounded-full bg-[#EEF7FF] px-3 py-1 text-[11px] font-medium text-[#0878F9]">
                                                    {next.status === "pending_payment"
                                                        ? "Payment Pending"
                                                        : "Upcoming"}
                                                </span>
                                            </div>

                                            {next.doctorRating != null && (
                                                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#6684A9]">
                                                    <span className="text-[#FFB800]">★</span>
                                                    <span className="font-semibold text-[#456487]">
                                                        {next.doctorRating.toFixed(1)}
                                                    </span>
                                                    <span>
                                                        ({next.doctorReviewCount} reviews)
                                                    </span>
                                                </div>
                                            )}

                                            <div className="mt-3 grid gap-2 text-[12px] text-[#6480A4] sm:grid-cols-2">
                                                <div className="flex items-center gap-2">
                                                    <CalendarDays
                                                        size={14}
                                                        className="text-[#0878F9]"
                                                    />
                                                    {formatDateLabel(next.date)}, {next.time_slot}
                                                </div>

                                                {next.doctorLocation && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin
                                                            size={14}
                                                            className="text-[#0878F9]"
                                                        />
                                                        {next.doctorLocation}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 flex gap-2">
                                                <Link
                                                    to="/dashboard/my-appointments"
                                                    className="flex h-[29px] cursor-pointer items-center rounded-[6px] bg-[#0878F9] px-5 text-[11px] font-medium text-white transition hover:bg-[#006BEA]"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Recent Doctors */}
                        <section className="rounded-[11px] border border-[#E0EBF5] bg-white p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-[15px] font-bold text-[#0A2B63]">
                                    Recent Doctors
                                </h3>

                                <Link
                                    to="/dashboard/my-appointments"
                                    className="flex items-center gap-1 text-[12px] font-medium text-[#0878F9]"
                                >
                                    View All <ArrowRight size={12} />
                                </Link>
                            </div>

                            {recentDoctors.length === 0 ? (
                                <p className="py-6 text-center text-[12px] text-[#7890AE]">
                                    No doctors visited yet.
                                </p>
                            ) : (
                                <div>
                                    {recentDoctors.map((doctor, index) => (
                                        <div
                                            key={doctor.doctorId}
                                            className={`flex items-center gap-3 py-2.5 ${
                                                index !== recentDoctors.length - 1
                                                    ? "border-b border-[#EEF3F8]"
                                                    : ""
                                            }`}
                                        >
                                            <img
                                                src={
                                                    doctor.photoUrl ||
                                                    `${DEFAULT_AVATAR}${encodeURIComponent(doctor.name)}`
                                                }
                                                alt={doctor.name}
                                                className="h-9 w-9 shrink-0 rounded-full object-cover"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[12px] font-semibold text-[#173B70]">
                                                    {doctor.name}
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-[#7690AF]">
                                                    {doctor.specialty}
                                                </p>

                                                <p className="mt-0.5 text-[11px] text-[#7F94AF]">
                                                    {formatDateLabel(doctor.lastVisit)}
                                                </p>
                                            </div>

                                            <Link
                                                to={`/doctors/${doctor.doctorId}`}
                                                className="cursor-pointer rounded-[8px] bg-[#F0F7FF] px-3 py-1.5 text-[11px] font-medium text-[#0878F9] transition hover:bg-[#E5F1FF]"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                {/* ================= RIGHT COLUMN ================= */}
                <div className="space-y-5">

                    {/* ================= QUICK ACTIONS ================= */}
                    <section className="rounded-[11px] border border-[#E0EBF5] bg-white p-5">
                        <h3 className="mb-4 text-[15px] font-bold text-[#0A2B63]">
                            Quick Actions
                        </h3>

                        <div className="grid grid-cols-2 gap-3">
                            {quickActions.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.title}
                                        to={item.to}
                                        className="group flex min-h-[105px] cursor-pointer flex-col items-center justify-center rounded-[9px] border border-[#E1ECF7] bg-[#FBFDFF] px-2 transition hover:-translate-y-0.5 hover:border-[#BBD8F5] hover:bg-[#F6FBFF]"
                                    >
                                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F3FF] text-[#0878F9] transition group-hover:bg-[#0878F9] group-hover:text-white">
                                            <Icon size={20} strokeWidth={1.7} />
                                        </span>

                                        <span className="mt-3 text-center text-[12px] font-medium text-[#173B70]">
                                            {item.title}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {/* ================= NEXT APPOINTMENT ================= */}
                    <section className="rounded-[11px] border border-[#E0EBF5] bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CalendarDays
                                    size={17}
                                    className="text-[#0878F9]"
                                />

                                <h3 className="text-[15px] font-bold text-[#0A2B63]">
                                    Next Appointment
                                </h3>
                            </div>

                            <Link
                                to="/dashboard/my-appointments"
                                className="flex items-center gap-1 text-[12px] font-medium text-[#0878F9]"
                            >
                                View All <ArrowRight size={12} />
                            </Link>
                        </div>

                        {!next ? (
                            <p className="py-6 text-center text-[12px] text-[#7890AE]">
                                Nothing scheduled.
                            </p>
                        ) : (
                            <div className="rounded-[9px] border border-[#DFEAF5] p-3">
                                <div className="flex gap-3">
                                    <div className="flex h-[61px] w-[61px] shrink-0 flex-col items-center justify-center rounded-[8px] bg-[#F2F8FF]">
                                        <span className="text-[11px] font-semibold text-[#0878F9]">
                                            {new Date(`${next.date}T00:00:00`).toLocaleDateString(
                                                "en-US",
                                                { month: "short" }
                                            )}
                                        </span>

                                        <span className="text-[22px] font-bold leading-5 text-[#0A2B63]">
                                            {new Date(`${next.date}T00:00:00`).getDate()}
                                        </span>
                                    </div>

                                    <div className="min-w-0">
                                        <h4 className="text-[13px] font-bold text-[#173B70]">
                                            {next.doctorName}
                                        </h4>

                                        {next.doctorDepartment && (
                                            <p className="mt-0.5 text-[11px] text-[#7089A9]">
                                                {next.doctorDepartment}
                                            </p>
                                        )}

                                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#6882A3]">
                                            <Clock3
                                                size={12}
                                                className="text-[#0878F9]"
                                            />
                                            {next.time_slot}
                                        </div>

                                        {next.doctorLocation && (
                                            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#6882A3]">
                                                <MapPin
                                                    size={12}
                                                    className="text-[#0878F9]"
                                                />
                                                {next.doctorLocation}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* ================= HEALTH TIPS ================= */}
                    <section className="rounded-[11px] border border-[#E0EBF5] bg-white p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <Lightbulb
                                size={19}
                                className="text-[#0878F9]"
                            />

                            <h3 className="text-[15px] font-bold text-[#0A2B63]">
                                Health Tips
                            </h3>
                        </div>

                        <div className="overflow-hidden rounded-[9px] bg-gradient-to-r from-[#F0F8FF] to-[#E8F5FF]">
                            <div className="flex min-h-[118px] items-center gap-3 p-3">
                                <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-full bg-white/70">
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-[50%_50%_45%_45%] bg-[#A9D9A1]" />
                                        <div className="absolute -left-2 top-2 h-8 w-5 rotate-[-35deg] rounded-[100%_0] bg-[#72B96C]" />
                                        <div className="absolute -right-2 top-0 h-8 w-5 rotate-[35deg] rounded-[0_100%] bg-[#72B96C]" />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[13px] font-bold text-[#173B70]">
                                        Stay hydrated
                                    </h4>

                                    <p className="mt-1 text-[11px] leading-5 text-[#6682A5]">
                                        Drinking enough water helps your heart, kidneys and overall health.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;

