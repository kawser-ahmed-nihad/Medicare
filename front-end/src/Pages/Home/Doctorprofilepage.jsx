import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
    BadgeCheck,
    ShieldCheck,
    Heart,
    Star,
    Clock,
    GraduationCap,
    Building2,
    Phone,
    Mail,
    MapPin,
    Wallet,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    MessageSquare,
    PhoneCall,
    Loader2,
    X,
    Landmark,
    Banknote,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

/* ---------------- constants ---------------- */



const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]; // matches Date#getDay()
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&seed=";

const tabs = ["About", "Education", "Experience", "Reviews"];

/* ---------------- helpers ---------------- */

function to12Hour(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    let hour = h % 12;
    if (hour === 0) hour = 12;
    return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

function generateSlots(startTime, endTime, durationMin) {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const slots = [];
    let cur = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    while (cur + durationMin <= endMinutes) {
        const h = Math.floor(cur / 60);
        const m = cur % 60;
        slots.push(to12Hour(`${h}:${m}`));
        cur += durationMin;
    }
    return slots;
}

// Builds a { sun: {start,end}, mon: {...}, ... } lookup from the doctor's schedule blocks
function buildWeekdayMap(schedule = []) {
    const map = {};
    schedule.forEach((block) => {
        block.days?.forEach((day) => {
            map[day] = { start: block.start_time, end: block.end_time };
        });
    });
    return map;
}

function isSameDate(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildCalendarWeeks(monthDate) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDay.getDay(); // 0 = Sun

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
}

// "2015 – 2018" / "2021 – Present" / "2015" / "" — handles education (no "current") and work history (has "current")
function formatYearRange(startYear, endYear, current = false) {
    if (current) return startYear ? `${startYear} – Present` : "Present";
    if (startYear && endYear) return `${startYear} – ${endYear}`;
    if (startYear) return `${startYear}`;
    if (endYear) return `${endYear}`;
    return "";
}

// timezone-safe "YYYY-MM-DD" — toISOString() can shift the date near midnight in local time
function toDateKey(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDateLabel(date) {
    return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

/* ---------------- small UI helpers ---------------- */

function SectionCard({ icon: Icon, title, children }) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5">
            <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-blue-600">
                    <Icon size={16} />
                </span>
                <h3 className="font-bold text-slate-900">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function TimelineItem({ icon: Icon = GraduationCap, title, org, years }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-blue-600">
                <Icon size={12} />
            </span>
            <div>
                <p className="text-sm font-semibold text-slate-900">
                    {title}
                    {org && <span className="font-normal text-slate-500"> – {org}</span>}
                </p>
                {years && <p className="text-xs text-slate-400">{years}</p>}
            </div>
        </div>
    );
}

function EmptyState({ text }) {
    return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">{text}</p>;
}

/* ---------------- Tab content ---------------- */

function AboutTab({ doctor, fullName }) {
    return (
        <SectionCard icon={BadgeCheck} title={`About ${fullName}`}>
            {doctor.bio ? (
                <p className="text-sm leading-relaxed text-slate-600">{doctor.bio}</p>
            ) : (
                <EmptyState text="This doctor hasn't added a bio yet." />
            )}
        </SectionCard>
    );
}

function EducationTab({ doctor }) {
    const education = doctor.education || [];

    return (
        <SectionCard icon={GraduationCap} title="Education & Qualifications">
            {education.length > 0 ? (
                <div className="space-y-4">
                    {education.map((ed, i) => (
                        <TimelineItem
                            key={i}
                            title={ed.degree}
                            org={ed.institution}
                            years={formatYearRange(ed.start_year, ed.end_year)}
                        />
                    ))}
                </div>
            ) : doctor.degrees?.length ? (
                <div className="flex flex-wrap gap-2">
                    {doctor.degrees.map((d) => (
                        <span key={d} className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-sky-50 px-3 py-2 text-sm font-medium text-blue-700">
                            <GraduationCap size={14} />
                            {d}
                        </span>
                    ))}
                </div>
            ) : (
                <EmptyState text="No education on record yet." />
            )}
        </SectionCard>
    );
}

function ExperienceTab({ doctor }) {
    const workHistory = doctor.work_experience || [];

    return (
        <SectionCard icon={Building2} title="Experience">
            {workHistory.length > 0 ? (
                <div className="space-y-4">
                    {workHistory.map((w, i) => (
                        <TimelineItem
                            key={i}
                            icon={Building2}
                            title={w.title}
                            org={w.organization}
                            years={formatYearRange(w.start_year, w.end_year, w.current)}
                        />
                    ))}
                </div>
            ) : (
                <>
                    <TimelineItem
                        icon={Building2}
                        title={doctor.designation || doctor.department}
                        org={doctor.chamber_address}
                        years={`${doctor.experience_years}+ years in ${doctor.department}`}
                    />
                    <p className="mt-4 text-xs text-slate-400">
                        Detailed work history isn't recorded for this profile yet.
                    </p>
                </>
            )}
        </SectionCard>
    );
}

function ReviewsTab({ doctor }) {
    const rating = doctor.rating ?? 0;
    const reviewCount = doctor.reviewCount ?? 0;

    return (
        <SectionCard icon={Star} title="Reviews & Feedback">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="text-center sm:w-32">
                    <p className="text-3xl font-bold text-slate-900">{rating.toFixed(1)}</p>
                    <div className="mt-1 flex justify-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} fill="currentColor" className={i < Math.round(rating) ? "" : "text-slate-200"} />
                        ))}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Based on {reviewCount} reviews</p>
                </div>
            </div>

            <div className="mt-6">
                <EmptyState text={reviewCount === 0 ? "No reviews yet. Be the first to review this doctor after your appointment." : "Review list isn't connected to live data yet."} />
            </div>
        </SectionCard>
    );
}

const tabComponents = {
    About: AboutTab,
    Education: EducationTab,
    Experience: ExperienceTab,
    Reviews: ReviewsTab,
};

/* ---------------- Header ---------------- */

function DoctorHeader({ doctor, fullName }) {

    const [expanded, setExpanded] = useState(false);
    const image = doctor.photoUrl || `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;
    const bio = doctor.bio || "";
    const isAvailable = doctor.status === "available";

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr_300px]">
            {/* Photo */}
            <div className="relative overflow-hidden rounded-2xl">
                <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}
                >
                    {isAvailable ? "Available" : doctor.status === "on_leave" ? "On Leave" : "Unavailable"}
                </span>
                <img src={image} alt={fullName} className="h-72 w-full object-cover bg-slate-50 lg:h-full" />
            </div>

            {/* Info */}
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>
                    <BadgeCheck size={20} className="text-blue-600" fill="#3b82f6" stroke="white" />
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-blue-600">
                    <Heart size={14} />
                    {doctor.designation || doctor.department}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-800">{(doctor.rating ?? 0).toFixed(1)}</span>
                        ({doctor.reviewCount ?? 0} reviews)
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {doctor.experience_years}+ years experience
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1 text-emerald-600">
                        <ShieldCheck size={13} />
                        BMDC {doctor.bmdc_reg_no}
                    </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-6">
                    {(doctor.education?.length ? doctor.education : []).slice(0, 2).map((ed, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded bg-sky-100 text-blue-600">
                                <GraduationCap size={13} />
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-slate-800">{ed.degree}</p>
                                <p className="text-xs text-slate-400">{ed.institution}</p>
                            </div>
                        </div>
                    ))}
                    {doctor.work_experience?.[0] && (
                        <div className="flex items-start gap-2">
                            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded bg-sky-100 text-blue-600">
                                <Building2 size={13} />
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-slate-800">{doctor.work_experience[0].title}</p>
                                <p className="text-xs text-slate-400">{doctor.work_experience[0].organization}</p>
                            </div>
                        </div>
                    )}
                </div>

                {doctor.degrees?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {doctor.degrees.map((d) => (
                            <span key={d} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-blue-600">
                                {d}
                            </span>
                        ))}
                    </div>
                )}

                {bio && (
                    <>
                        <p className="mt-4 text-sm leading-relaxed text-slate-500">
                            {expanded || bio.length <= 110 ? bio : `${bio.slice(0, 110)}...`}
                        </p>
                        {bio.length > 110 && (
                            <button
                                onClick={() => setExpanded((v) => !v)}
                                className="mt-1 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                            >
                                {expanded ? "Read Less" : "Read More"}
                                <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Quick info */}
            <QuickInfo doctor={doctor} />
        </div>
    );
}

/* ---------------- Payment method confirm modal ---------------- */

function BookingConfirmModal({ doctor, dateLabel, slot, onClose, onConfirm, submitting, error }) {
    const [method, setMethod] = useState("online");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-[#0A1931]">Confirm Appointment</h3>
                    <button type="button" onClick={onClose} disabled={submitting} className="text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-3.5 text-sm">
                    <p className="flex justify-between"><span className="text-slate-400">Doctor</span><span className="font-medium text-slate-800">Dr. {doctor.first_name} {doctor.last_name}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Date</span><span className="font-medium text-slate-800">{dateLabel}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Time</span><span className="font-medium text-slate-800">{slot}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Fee</span><span className="font-medium text-slate-800">৳{doctor.consultation_fee}</span></p>
                </div>

                <p className="mt-4 mb-2 text-sm font-medium text-slate-700">How would you like to pay?</p>
                <div className="space-y-2">
                    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${method === "online" ? "border-[#0066FE] bg-sky-50" : "border-slate-200 hover:border-slate-300"}`}>
                        <input type="radio" name="payment_method" className="mt-0.5" checked={method === "online"} onChange={() => setMethod("online")} />
                        <span className="flex items-start gap-2">
                            <Landmark size={16} className="mt-0.5 text-[#0066FE]" />
                            <span>
                                <span className="block text-sm font-medium text-slate-800">Pay Online</span>
                                <span className="block text-xs text-slate-400">bKash, Nagad, Card — confirms instantly</span>
                            </span>
                        </span>
                    </label>
                    <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${method === "cash" ? "border-[#0066FE] bg-sky-50" : "border-slate-200 hover:border-slate-300"}`}>
                        <input type="radio" name="payment_method" className="mt-0.5" checked={method === "cash"} onChange={() => setMethod("cash")} />
                        <span className="flex items-start gap-2">
                            <Banknote size={16} className="mt-0.5 text-[#0066FE]" />
                            <span>
                                <span className="block text-sm font-medium text-slate-800">Pay at Hospital</span>
                                <span className="block text-xs text-slate-400">Cash or card at the chamber</span>
                            </span>
                        </span>
                    </label>
                </div>

                {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}

                <div className="mt-5 flex gap-3">
                    <button type="button" onClick={onClose} disabled={submitting}
                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60">
                        Cancel
                    </button>
                    <button type="button" onClick={() => onConfirm(method)} disabled={submitting}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0066FE] py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                        {submitting && <Loader2 size={14} className="animate-spin" />}
                        {submitting ? "Booking…" : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Booking widget (schedule-aware) ---------------- */

function BookingWidget({ doctor }) {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { user } = useAuth();

    const location = useLocation();

    const weekdayMap = useMemo(() => buildWeekdayMap(doctor.schedule), [doctor.schedule]);
    const doctorIsBookable = doctor.status === "available";

    useEffect(() => {
        if (!user) return;
        const raw = sessionStorage.getItem("pendingBooking");
        if (!raw) return;
        try {
            const saved = JSON.parse(raw);
            if (saved.doctorId === doctor._id) {
                const d = new Date(`${saved.date}T00:00:00`);
                setMonthDate(new Date(d.getFullYear(), d.getMonth(), 1));
                setSelectedDate(d);
                setSelectedSlot(saved.time);
                setShowModal(true);
            }
        } finally {
            sessionStorage.removeItem("pendingBooking");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, doctor._id]);

    const handleContinueToBook = () => {
        if (!selectedDate || !selectedSlot) return;

        if (!user) {
            setBookError("Please sign in to confirm your booking.");
            sessionStorage.setItem(
                "pendingBooking",
                JSON.stringify({
                    doctorId: doctor._id,
                    date: toDateKey(selectedDate),
                    time: selectedSlot,
                })
            );
            navigate("/auth/login", { state: { from: location } });
            return;
        }

        setShowModal(true);
    };


    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const [monthDate, setMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [bookError, setBookError] = useState("");

    const weeks = useMemo(() => buildCalendarWeeks(monthDate), [monthDate]);

    const isDayAvailable = (date) => {
        if (!date) return false;
        if (date < today) return false;
        const key = WEEKDAY_KEYS[date.getDay()];
        return doctorIsBookable && Boolean(weekdayMap[key]);
    };

    const slotsForSelectedDate = useMemo(() => {
        if (!selectedDate) return [];
        const key = WEEKDAY_KEYS[selectedDate.getDay()];
        const block = weekdayMap[key];
        if (!block) return [];
        return generateSlots(block.start, block.end, doctor.slot_duration_minutes || 30);
    }, [selectedDate, weekdayMap, doctor.slot_duration_minutes]);

    const availableDayLabels = Object.keys(weekdayMap)
        .map((k) => WEEKDAY_LABELS[WEEKDAY_KEYS.indexOf(k)])
        .filter(Boolean);

    // When most days in the month have passed, find the first available date in the next 60 days
    // to help the user reach the next bookable date.
    const nextAvailableDate = useMemo(() => {
        if (!doctorIsBookable) return null;
        for (let i = 0; i < 60; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            const key = WEEKDAY_KEYS[d.getDay()];
            if (weekdayMap[key]) return d;
        }
        return null;
    }, [today, weekdayMap, doctorIsBookable]);

    const jumpToNextAvailable = () => {
        if (!nextAvailableDate) return;
        setMonthDate(new Date(nextAvailableDate.getFullYear(), nextAvailableDate.getMonth(), 1));
        setSelectedDate(nextAvailableDate);
        setSelectedSlot(null);
    };

    const handleSelectDay = (date) => {
        if (!isDayAvailable(date)) return;
        setSelectedDate(date);
        setSelectedSlot(null);
    };

    const handleConfirmBooking = async (paymentMethod) => {
        if (!selectedDate || !selectedSlot) return;
        setSubmitting(true);
        setBookError("");
        try {
            const res = await axiosSecure.post("/api/appointments", {
                doctorId: doctor._id,
                date: toDateKey(selectedDate),
                time_slot: selectedSlot,
                payment_method: paymentMethod,
            });

            if (paymentMethod === "online") {
                // If gatewayUrl is missing, the backend did not create a payment session; show an error
                // instead of mistakenly redirecting to the success page.
                if (!res.data.gatewayUrl) {
                    setBookError("Could not start the payment process. Please try again.");
                    return;
                }
                window.location.href = res.data.gatewayUrl;
                return;
            }

            // Cash payment is confirmed directly; redirect to the result page.
            navigate(`/booking/success?appointmentId=${res.data.appointment._id}&method=cash`);
        } catch (err) {
            setBookError(err.response?.data?.message || "Failed to book the appointment. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-900/5">
            <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#0066FE]" />
                <h3 className="font-bold text-[#0A1931]">Book Appointment</h3>
            </div>

            {!doctorIsBookable ? (
                <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
                    This doctor isn't currently accepting new appointments.
                </p>
            ) : (
                <>
                    {availableDayLabels.length > 0 && (
                        <p className="mt-3 text-xs text-slate-400">
                            Available: {availableDayLabels.join(", ")}
                        </p>
                    )}
                    {nextAvailableDate && !isSameDate(nextAvailableDate, today) && (
                        <button
                            type="button"
                            onClick={jumpToNextAvailable}
                            className="mt-1 text-xs font-medium text-[#0066FE] hover:underline"
                        >
                            Jump to next available: {formatDateLabel(nextAvailableDate)}
                        </button>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                            aria-label="Previous month"
                        >
                            <ChevronLeft size={16} className="cursor-pointer text-[#4A5568] hover:text-[#0066FE]" />
                        </button>
                        <p className="text-sm font-semibold text-[#0A1931]">
                            {MONTH_LABELS[monthDate.getMonth()]} {monthDate.getFullYear()}
                        </p>
                        <button
                            type="button"
                            onClick={() => setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                            aria-label="Next month"
                        >
                            <ChevronRight size={16} className="cursor-pointer text-[#0066FE]" />
                        </button>
                    </div>

                    <table className="mt-3 w-full text-center text-xs">
                        <thead>
                            <tr className="text-[#4A5568]">
                                {WEEKDAY_LABELS.map((d) => (
                                    <th key={d} className="pb-2 font-normal">{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {weeks.map((week, wi) => (
                                <tr key={wi}>
                                    {week.map((date, di) => {
                                        const available = isDayAvailable(date);
                                        const selected = isSameDate(date, selectedDate);
                                        return (
                                            <td key={di} className="py-1">
                                                {date && (
                                                    <button
                                                        type="button"
                                                        disabled={!available}
                                                        onClick={() => handleSelectDay(date)}
                                                        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full transition-colors ${selected
                                                            ? "bg-[#0066FE] font-semibold text-white"
                                                            : available
                                                                ? "text-[#0A1931] hover:bg-sky-50"
                                                                : "text-slate-300 cursor-not-allowed"
                                                            }`}
                                                    >
                                                        {date.getDate()}
                                                    </button>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <p className="mt-4 text-sm font-semibold text-[#0A1931]">Available Time Slots</p>
                    {!selectedDate ? (
                        <p className="mt-2 text-xs text-slate-400">Pick a highlighted date to see time slots.</p>
                    ) : slotsForSelectedDate.length === 0 ? (
                        <p className="mt-2 text-xs text-slate-400">No slots configured for this day.</p>
                    ) : (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {slotsForSelectedDate.map((slot) => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`rounded-lg border py-2 text-xs font-medium transition-colors ${slot === selectedSlot
                                        ? "border-[#0066FE] bg-sky-50 text-[#0066FE]"
                                        : "border-slate-200 text-slate-600 hover:border-blue-300"
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        type="button"
                        disabled={!selectedDate || !selectedSlot}
                        onClick={handleContinueToBook}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0066FE] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Continue to Book
                        <ArrowRight size={15} />
                    </button>
                </>
            )}

            {showModal && selectedDate && selectedSlot && (
                <BookingConfirmModal
                    doctor={doctor}
                    dateLabel={formatDateLabel(selectedDate)}
                    slot={selectedSlot}
                    submitting={submitting}
                    error={bookError}
                    onClose={() => !submitting && setShowModal(false)}
                    onConfirm={handleConfirmBooking}
                />
            )}
        </div>
    );
}



function QuickInfo({ doctor }) {
    const feeDisplay = doctor.discount_percent > 0
        ? `৳${Math.round(doctor.consultation_fee * (1 - doctor.discount_percent / 100))} (was ৳${doctor.consultation_fee}, ${doctor.discount_percent}% off)`
        : `৳${doctor.consultation_fee}`;

    const rows = [
        { icon: Wallet, label: "Consultation Fee", value: feeDisplay },
        ...(doctor.follow_up_fee ? [{ icon: Wallet, label: "Follow-up Fee", value: `৳${doctor.follow_up_fee}` }] : []),
        { icon: MessageSquare, label: "Languages", value: doctor.languages?.length ? doctor.languages.join(", ") : "Not specified" },
        { icon: MapPin, label: "Location", value: doctor.chamber_address || doctor.location },
        { icon: Phone, label: "Phone", value: doctor.phone },
        { icon: Mail, label: "Email", value: doctor.email },
    ];

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-900/5">
            <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#0066FE]" />
                <h3 className="font-bold text-[#0A1931]">Quick Info</h3>
            </div>
            <div className="mt-4 space-y-4">
                {rows.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2.5 text-sm">
                        <Icon size={15} className="mt-0.5 flex-shrink-0 text-[#0066FE]" />
                        <div>
                            <p className="text-xs text-[#4A5568]">{label}</p>
                            <p className="whitespace-pre-line font-medium text-[#0A1931] break-all">{value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UrgentCareCard() {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-[#0066FE] p-5 text-white">
            <div className="relative flex items-start gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
                    <Heart size={18} />
                </span>
                <div>
                    <p className="font-semibold">Need Urgent Care?</p>
                    <p className="mt-1 text-sm text-sky-100">
                        Our emergency team is available 24/7 for your health needs.
                    </p>
                    <button className="mt-3 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#0066FE] hover:bg-sky-50 transition-colors">
                        <PhoneCall size={13} />
                        Call Now
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Page ---------------- */

export default function DoctorProfilePage() {
    const { doctorId } = useParams();
    const axiosSecure = useAxiosSecure();
    const [activeTab, setActiveTab] = useState("About");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["doctor", doctorId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/doctors/${doctorId}`);
            return res.data.doctor;
        },
        enabled: Boolean(doctorId),
    });

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8fbfe]">
                <Loader2 className="h-6 w-6 animate-spin text-[#0066FE]" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8fbfe] px-4 text-center">
                <p className="text-sm text-slate-500">Couldn't load this doctor's profile. Please try again.</p>
            </div>
        );
    }

    const doctor = data;
    const fullName = `Dr. ${doctor.first_name} ${doctor.last_name}`;
    const ActiveTabComponent = tabComponents[activeTab];

    return (
        <div className="min-h-screen pt-28 bg-[#f8fbfe]  py-8 ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-9">
                <DoctorHeader doctor={doctor} fullName={fullName} />

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
                    {/* Main column */}
                    <div>
                        <div className="flex gap-6 overflow-x-auto rounded-2xl bg-white px-2 shadow-sm shadow-slate-900/5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative whitespace-nowrap px-3 py-4 text-sm font-medium transition-colors ${activeTab === tab ? "text-[#0066FE]" : "text-[#4A5568] hover:text-[#0A1931]"
                                        }`}
                                >
                                    {tab === "Reviews" ? `Reviews (${doctor.reviewCount ?? 0})` : tab}
                                    {activeTab === tab && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#0066FE]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6">
                            <ActiveTabComponent doctor={doctor} fullName={fullName} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <BookingWidget doctor={doctor} />
                        <UrgentCareCard />
                    </div>
                </div>
            </div>
        </div>
    );
}