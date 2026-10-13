import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Star,
  Stethoscope,
  HeartPulse,
  Brain,
  Link2,
  Baby,
  VenusAndMars,
  Cross,
  Grid2X2,
  ArrowRight,
  Info,
  BadgeCheck,
  Loader2,
  X,
  Landmark,
  Banknote,
  Eye,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";

/* ------------------------------------------------------------------ */
/* Doctor normalization                                                */
/* ------------------------------------------------------------------ */

function normalizeDoctor(d) {
  if (!d) return d;
  const fullName = [d.first_name, d.last_name].filter(Boolean).join(" ");
  return {
    id: d._id,
    name: fullName ? `Dr. ${fullName}` : "Doctor profile incomplete",
    specialty: d.designation || d.department || "Specialist",
    rating: d.rating ? d.rating.toFixed(1) : "New",
    reviews: d.reviewCount ?? 0,
    degree: (d.degrees || []).join(", ") || "Degree not listed",
    experience: d.experience_years != null ? `${d.experience_years}+ years experience` : "Experience N/A",
    hospital: d.chamber_address || d.location || "Location not listed",
    fee: d.consultation_fee ?? null,
    image: d.photoUrl || null,
    slotMinutes: d.slot_duration_minutes || 30,
    schedule: d.schedule || [],
  };
}

/* ------------------------------------------------------------------ */
/* Static UI data                                                      */
/* ------------------------------------------------------------------ */

const specialists = [
  { name: "Cardiology", icon: HeartPulse },
  { name: "Neurology", icon: Brain },
  { name: "Dermatology", icon: Cross },
  { name: "Orthopedics", icon: Link2 },
  { name: "Pediatrics", icon: Baby },
  { name: "Gynecology", icon: VenusAndMars },
  { name: "General Medicine", icon: Stethoscope },
  { name: "Others", icon: Grid2X2 },
];

const PAGE_SIZE = 6;

/* ------------------------------------------------------------------ */
/* Schedule helpers                                                    */
/* ------------------------------------------------------------------ */

const DAY_CODES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_MONTHS_AHEAD = 6;

const toIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

function availableDayCodes(schedule) {
  const set = new Set();
  (schedule || []).forEach((block) => (block.days || []).forEach((d) => set.add(String(d).toLowerCase())));
  return set;
}

function scheduleBlockForDate(schedule, dateIso) {
  if (!dateIso) return null;
  const dayCode = DAY_CODES[new Date(`${dateIso}T00:00:00`).getDay()];
  return (schedule || []).find((b) => (b.days || []).map((d) => String(d).toLowerCase()).includes(dayCode)) || null;
}

function generateTimeSlots(block, slotMinutes = 30) {
  if (!block) return [];
  const [sh, sm] = block.start_time.split(":").map(Number);
  const [eh, em] = block.end_time.split(":").map(Number);
  let cur = sh * 60 + sm;
  const end = eh * 60 + em;
  const slots = [];
  while (cur + slotMinutes <= end) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    const period = h >= 12 ? "PM" : "AM";
    const h12 = ((h + 11) % 12) + 1;
    slots.push(`${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`);
    cur += slotMinutes;
  }
  return slots;
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function DoctorAvatar({ name, src, size = "h-12 w-12" }) {
  const initials = (name || "Dr")
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  if (src) {
    return <img src={src} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />;
  }
  return (
    <div
      aria-hidden="true"
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-[#0066FE] text-sm font-bold text-white`}
    >
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Doctor list card                                                    */
/* ------------------------------------------------------------------ */

function DoctorCard({ doctor, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`group flex min-h-[106px] cursor-pointer items-center gap-4 rounded-lg border bg-white px-3 py-3 transition-all ${selected ? "border-blue-400 shadow-[0_3px_15px_rgba(37,99,235,0.10)]" : "border-slate-200 hover:border-blue-300 hover:shadow-sm"
        }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="shrink-0 overflow-hidden rounded-full bg-blue-50 ring-4 ring-blue-50">
          <DoctorAvatar name={doctor.name} src={doctor.image} size="h-[62px] w-[62px]" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-bold text-[#0A1931]">{doctor.name}</h3>
            <BadgeCheck size={14} className="fill-blue-500 text-white" />
          </div>

          <p className="text-sm text-[#4A5568]">{doctor.specialty}</p>

          <div className="mt-1 flex items-center gap-1 text-xs">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-[#0A1931]">{doctor.rating}</span>
            <span className="text-[#0066FE]">({doctor.reviews} reviews)</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#4A5568]">
            <span className="flex items-center gap-1">
              <GraduationCap size={12} />
              {doctor.degree}
            </span>
            <span className="flex items-center gap-1">
              <BriefcaseBusiness size={11} />
              {doctor.experience}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {doctor.hospital}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-7">
        <div className="hidden text-right sm:block">
          <div className="rounded-lg bg-blue-50 px-3 py-1.5">
            <p className="text-center text-sm font-bold text-[#0066FE]">{doctor.fee != null ? `\u09f3 ${doctor.fee}` : "N/A"}</p>
            <p className="text-[11px] text-[#4A5568]">Consultation Fee</p>
          </div>
        </div>

        <Link
          to={`/doctors/${doctor.id}`}
          className="flex items-center gap-2 rounded-md bg-[#0066FE] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Eye size={14} />
          View Profile
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Schedule-aware calendar                                             */
/* ------------------------------------------------------------------ */

function Calendar({ schedule, selectedDate, onSelectDate }) {
  const today = startOfDay(new Date());
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const availableDays = useMemo(() => availableDayCodes(schedule), [schedule]);
  const hasAnySchedule = availableDays.size > 0;

  const { year, month } = view;
  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((first.getDay() + daysInMonth) / 7) * 7;
    return Array.from({ length: totalCells }, (_, i) => {
      const date = new Date(year, month, 1 - first.getDay() + i);
      const iso = toIso(date);
      const code = DAY_CODES[date.getDay()];
      const inMonth = date.getMonth() === month;
      const isPast = startOfDay(date) < today;
      const isAvailable = hasAnySchedule ? availableDays.has(code) : true;
      return { date, iso, inMonth, disabled: isPast || !isAvailable };
    });
  }, [year, month, availableDays, hasAnySchedule, today]);

  const monthsFromToday = (y, m) => (y - today.getFullYear()) * 12 + (m - today.getMonth());
  const atEarliestMonth = monthsFromToday(year, month) <= 0;
  const atLatestMonth = monthsFromToday(year, month) >= MAX_MONTHS_AHEAD;

  const shift = (delta) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} disabled={atEarliestMonth} aria-label="Previous month" className="text-[#0066FE] transition disabled:cursor-not-allowed disabled:opacity-30">
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-[#0066FE]">
          <CalendarDays size={14} />
          {monthLabel}
        </div>
        <button type="button" onClick={() => shift(1)} disabled={atLatestMonth} aria-label="Next month" className="text-[#0066FE] transition disabled:cursor-not-allowed disabled:opacity-30">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {DAY_LABELS.map((day) => (
          <div key={day} className="pb-2 text-center text-xs font-medium text-[#4A5568]">
            {day}
          </div>
        ))}

        {cells.map((c) => {
          const isSelected = c.iso === selectedDate;
          return (
            <div key={c.iso} className="flex justify-center">
              <button
                type="button"
                disabled={c.disabled}
                onClick={() => onSelectDate(c.iso)}
                aria-pressed={isSelected}
                title={c.disabled ? "Doctor not available this day" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition ${!c.inMonth ? "opacity-40" : ""} ${isSelected ? "bg-[#0066FE] font-bold text-white shadow-md" : c.disabled ? "cursor-not-allowed text-slate-300" : "text-slate-600 hover:bg-blue-50"
                  }`}
              >
                {c.date.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      {hasAnySchedule && <p className="mt-2 text-xs leading-relaxed text-[#4A5568]">Grayed-out dates are days the doctor is not available.</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Payment method modal                                                */
/* ------------------------------------------------------------------ */

function PaymentMethodModal({ doctor, date, time, onClose, onConfirm, submitting, error }) {
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
          <p className="flex justify-between"><span className="text-[#4A5568]">Doctor</span><span className="font-medium text-[#0A1931]">{doctor.name}</span></p>
          <p className="flex justify-between"><span className="text-[#4A5568]">Date</span><span className="font-medium text-[#0A1931]">{date}</span></p>
          <p className="flex justify-between"><span className="text-[#4A5568]">Time</span><span className="font-medium text-[#0A1931]">{time}</span></p>
          <p className="flex justify-between"><span className="text-[#4A5568]">Fee</span><span className="font-medium text-[#0A1931]">৳{doctor.fee}</span></p>
        </div>

        <p className="mt-4 mb-2 text-sm font-medium text-[#4A5568]">How would you like to pay?</p>
        <div className="space-y-2">
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${method === "online" ? "border-blue-600 bg-sky-50" : "border-slate-200 hover:border-slate-300"}`}>
            <input type="radio" name="pm" className="mt-0.5" checked={method === "online"} onChange={() => setMethod("online")} />
            <span className="flex items-start gap-2">
              <Landmark size={16} className="mt-0.5 text-[#0066FE]" />
              <span>
                <span className="block text-sm font-medium text-[#0A1931]">Pay Online</span>
                <span className="block text-xs text-[#4A5568]">bKash, Nagad, Card — confirms instantly</span>
              </span>
            </span>
          </label>
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${method === "cash" ? "border-blue-600 bg-sky-50" : "border-slate-200 hover:border-slate-300"}`}>
            <input type="radio" name="pm" className="mt-0.5" checked={method === "cash"} onChange={() => setMethod("cash")} />
            <span className="flex items-start gap-2">
              <Banknote size={16} className="mt-0.5 text-[#0066FE]" />
              <span>
                <span className="block text-sm font-medium text-[#0A1931]">Pay at Hospital</span>
                <span className="block text-xs text-[#4A5568]">Cash or card at the chamber</span>
              </span>
            </span>
          </label>
        </div>

        {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onClose} disabled={submitting} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60">
            Cancel
          </button>
          <button type="button" onClick={() => onConfirm(method)} disabled={submitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? "Booking…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Right-hand booking panel                                            */
/* ------------------------------------------------------------------ */

function DoctorDetails({ doctor, onRequestConfirm }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    setSelectedDate(null);
    setSelectedTime(null);
  }, [doctor?.id]);

  const block = useMemo(() => scheduleBlockForDate(doctor?.schedule, selectedDate), [doctor?.schedule, selectedDate]);
  const timeSlots = useMemo(() => generateTimeSlots(block, doctor?.slotMinutes), [block, doctor?.slotMinutes]);

  useEffect(() => {
    if (selectedTime && !timeSlots.includes(selectedTime)) setSelectedTime(null);
  }, [timeSlots]); // eslint-disable-line react-hooks/exhaustive-deps

  const canConfirm = Boolean(selectedDate && selectedTime);

  if (!doctor) {
    return (
      <aside className="flex w-full shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-400 lg:w-[285px]">
        No doctor selected.
      </aside>
    );
  }

  return (
    <aside className="w-full shrink-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:w-[285px]">
      <div className="border-b border-slate-100 pb-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={16} className="text-[#0066FE]" />
            <span className="text-sm font-bold text-[#0A1931]">Selected Doctor</span>
          </div>
        </div>

        <div className="flex gap-3">
          <DoctorAvatar name={doctor.name} src={doctor.image} size="h-12 w-12" />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#0A1931]">{doctor.name}</h3>
              <BadgeCheck size={12} className="fill-blue-500 text-white" />
            </div>
            <p className="text-xs text-[#4A5568]">{doctor.specialty}</p>
            <div className="mt-1 flex items-center gap-1 text-xs">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <b>{doctor.rating}</b>
              <span className="text-[#0066FE]">({doctor.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1.5 text-xs text-[#4A5568]">
          <p className="flex items-center gap-2">
            <GraduationCap size={13} />
            {doctor.degree}
          </p>
          <p className="flex items-center gap-2">
            <BriefcaseBusiness size={12} />
            {doctor.experience}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={12} />
            {doctor.hospital}
          </p>
        </div>
      </div>

      <div className="border-b border-slate-100 py-4">
        <div className="mb-3 flex items-center gap-1.5">
          <CalendarDays size={16} className="text-[#0066FE]" />
          <span className="text-sm font-bold text-[#0A1931]">Select Date</span>
        </div>
        <Calendar schedule={doctor.schedule} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      <div className="py-4">
        <div className="mb-3 flex items-center gap-1.5">
          <Clock3 size={16} className="text-[#0066FE]" />
          <span className="text-sm font-bold text-[#0A1931]">Available Time Slots</span>
        </div>

        {!selectedDate ? (
          <p className="rounded-md bg-slate-50 py-4 text-center text-xs text-[#4A5568]">Pick a date first to see open time slots.</p>
        ) : timeSlots.length === 0 ? (
          <p className="rounded-md bg-slate-50 py-4 text-center text-xs text-[#4A5568]">No slots available on this day.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`rounded-md border py-1.5 text-xs font-medium transition ${selectedTime === time ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-3 flex gap-2 rounded-lg bg-blue-50 p-3">
        <Info size={15} className="shrink-0 text-[#0066FE]" />
        <p className="text-xs leading-relaxed text-[#0066FE]">Free cancellation up to 2 hours before your appointment.</p>
      </div>

      <button
        type="button"
        disabled={!canConfirm}
        onClick={() => onRequestConfirm({ doctor, date: selectedDate, time: selectedTime })}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0066FE] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <CalendarDays size={14} />
        Confirm Appointment
        <ArrowRight size={13} />
      </button>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function BookAppointment() {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState(null); // null = all departments
  const [page, setPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [pendingBooking, setPendingBooking] = useState(null); // { doctor, date, time }
  const [submitting, setSubmitting] = useState(false);
  const [bookError, setBookError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["book-appointment-doctors", search, specialty, page],
    queryFn: async () => {
      const params = { page, limit: PAGE_SIZE, sortBy: "recommended" };
      if (search) params.search = search;
      if (specialty) params.department = specialty;
      const res = await axiosSecure.get("/api/doctors", { params });
      return res.data; // { doctors, pagination }
    },
    keepPreviousData: true,
  });

  const doctors = useMemo(() => (data?.doctors ?? []).map(normalizeDoctor), [data]);
  const pagination = data?.pagination ?? { total: 0, totalPages: 1 };

  useEffect(() => {
    if (doctors.length > 0 && !doctors.some((d) => d.id === selectedDoctor?.id)) {
      setSelectedDoctor(doctors[0]);
    } else if (doctors.length === 0) {
      setSelectedDoctor(null);
    }
  }, [doctors]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRequestConfirm = ({ doctor, date, time }) => {
    setBookError("");

    if (!user) {
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({ doctorId: doctor.id, date, time })
      );
      navigate("/auth/login", { state: { from: location } });
      return;
    }

    setPendingBooking({ doctor, date, time });
  };

  useEffect(() => {
    if (!user || doctors.length === 0) return;
    const raw = sessionStorage.getItem("pendingBooking");
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      const doc = doctors.find((d) => d.id === saved.doctorId);
      if (doc) {
        setSelectedDoctor(doc);
        setPendingBooking({ doctor: doc, date: saved.date, time: saved.time });
      }
    } finally {
      sessionStorage.removeItem("pendingBooking");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, doctors]);


  const handleConfirmBooking = async (paymentMethod) => {
    if (!pendingBooking) return;

    if (!user) {
      setBookError("Please sign in to confirm your booking.");
      navigate("/auth/login", {
        state: { from: location },
        replace: false,
      });
      return;
    }

    setSubmitting(true);
    setBookError("");
    try {
      const res = await axiosSecure.post("/api/appointments", {
        doctorId: pendingBooking.doctor.id,
        date: pendingBooking.date,
        time_slot: pendingBooking.time,
        payment_method: paymentMethod,
      });

      if (paymentMethod === "online") {
        if (!res.data.gatewayUrl) {
          setBookError("Could not start the payment process. Please try again.");
          return;
        }
        window.location.href = res.data.gatewayUrl;
        return;
      }

      navigate(`/booking/success?appointmentId=${res.data.appointment._id}&method=cash`);
    } catch (err) {
      setBookError(err.response?.data?.message || "Failed to book the appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const rangeStart = doctors.length ? (page - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = rangeStart ? rangeStart + doctors.length - 1 : 0;

  return (
    <div className="min-h-screen  p-3 font-sans text-[#0A1931] sm:p-5">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <header className="relative mb-3 flex items-start justify-between overflow-hidden rounded-lg px-1 py-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0A1931] sm:text-3xl">Book Appointment</h1>
            <p className="mt-1 text-xs text-[#4A5568] sm:text-sm">
              Find the right doctor, select a time and book your appointment in just a few clicks.
            </p>
          </div>
          <div className="hidden items-center gap-3 pr-5 sm:flex">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-400">
              <CalendarDays size={42} strokeWidth={1.3} />
            </div>
            <div className="text-[#0066FE]">
              <Stethoscope size={48} strokeWidth={1.4} />
            </div>
          </div>
        </header>

        {/* Stepper */}
        <div className="mb-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
              <span className="text-sm font-semibold text-[#0066FE]">Select Doctor</span>
            </div>
            <div className="h-px flex-1 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">2</span>
              <span className="text-sm text-[#4A5568]">Choose Date &amp; Time</span>
            </div>
            <div className="h-px flex-1 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">3</span>
              <span className="text-sm text-[#4A5568]">Confirm &amp; Book</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <main className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            {/* Search */}
            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5568]" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for doctor, specialties..."
                  className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-[#4A5568] focus:border-blue-400"
                />
              </div>

              {specialty && (
                <button
                  type="button"
                  onClick={() => { setSpecialty(null); setPage(1); }}
                  className="flex h-10 items-center justify-between gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 text-sm text-[#0066FE]"
                >
                  {specialty} <X size={13} />
                </button>
              )}
            </div>

            {/* Specialties */}
            <div className="mb-4">
              <h2 className="mb-2 text-sm font-bold text-[#0A1931]">Specialties</h2>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {specialists.map((item) => {
                  const Icon = item.icon;
                  const active = specialty === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => { setSpecialty(active ? null : item.name); setPage(1); }}
                      className={`flex h-[62px] flex-col items-center justify-center gap-1 rounded-lg border transition ${active ? "border-blue-500 bg-blue-50 text-[#0066FE] shadow-sm" : "border-slate-100 bg-white text-[#4A5568] hover:border-blue-200 hover:bg-blue-50"
                        }`}
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full ${active ? "bg-[#0066FE] text-white" : "bg-blue-50 text-[#0066FE]"}`}>
                        <Icon size={14} />
                      </span>
                      <span className="text-[10px]">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Doctors heading */}
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#0A1931]">
                Available Doctors ({pagination.total}) {isFetching && <span className="font-normal text-[#4A5568]">updating…</span>}
              </h2>
            </div>

            {/* Doctors list */}
            {isLoading && (
              <div className="flex justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-[#0066FE]" />
              </div>
            )}

            {isError && <p className="py-6 text-center text-sm text-rose-500">Couldn't load doctors. Please try again.</p>}

            {!isLoading && !isError && doctors.length === 0 && (
              <p className="py-10 text-center text-sm text-[#4A5568]">No doctors match your search.</p>
            )}

            <div className="space-y-2">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  selected={selectedDoctor?.id === doctor.id}
                  onSelect={() => setSelectedDoctor(doctor)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-[#4A5568]">
                  Showing {rangeStart}-{rangeEnd} of {pagination.total} doctors
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-[#4A5568] disabled:opacity-40"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  {Array.from({ length: pagination.totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`flex h-7 w-7 items-center justify-center rounded border text-xs ${p === page ? "border-[#0066FE] bg-[#0066FE] text-white" : "border-slate-200 text-[#4A5568]"
                          }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-[#4A5568] disabled:opacity-40"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Right panel */}
          <DoctorDetails doctor={selectedDoctor} onRequestConfirm={handleRequestConfirm} />
        </div>
      </div>

      {pendingBooking && (
        <PaymentMethodModal
          doctor={pendingBooking.doctor}
          date={pendingBooking.date}
          time={pendingBooking.time}
          submitting={submitting}
          error={bookError}
          onClose={() => !submitting && setPendingBooking(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}