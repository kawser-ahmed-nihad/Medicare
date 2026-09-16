import React, { useState } from "react";
import {
    BadgeCheck,
    Heart,
    Star,
    Clock,
    GraduationCap,
    Building2,
    Phone,
    Mail,
    MapPin,
    Wallet,
    Link2,
    Calendar,
    Eye,
    Camera,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Activity,
    Droplet,
    HeartPulse,
    Syringe,
    LineChart,
    ArrowRight,
    MessageSquare,
    ThumbsUp,
    PhoneCall,
} from "lucide-react";

import { FaFacebook, FaLinkedin, FaYoutube, FaLink } from "react-icons/fa";

/* ---------------- Data ---------------- */

const doctor = {
    name: "Dr. Ahmed Hasan",
    role: "Cardiologist",
    rating: 4.8,
    reviews: 124,
    experience: "10+ years experience",
    credentials: [
        { title: "MBBS", org: "Dhaka Medical College" },
        { title: "MD (Cardiology)", org: "Bangladesh Medical University" },
        { title: "Consultant", org: "Apollo Hospitals, Dhaka" },
    ],
    tags: ["Heart Disease", "High Blood Pressure", "Heart Failure", "Interventional Cardiology"],
    bioShort:
        "Dr. Ahmed Hasan is a highly experienced and compassionate cardiologist with over 10 years of experience in treating heart-related diseases. He is dedicated to providing the best care and modern treatment solutions for his patients.",
    photo:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
    phone: "+880 1711 223344",
    email: "info@medicare.com",
    location: "123 Health Street, Mymensingh, Bangladesh",
    fee: "৳500 – ৳1,100",
};

const aboutText =
    "Dr. Ahmed Hasan is a skilled and dedicated cardiologist with extensive experience in diagnosing and treating heart-related conditions. He focuses on personalized care, modern treatment methods, and patient education to ensure long-term heart health. His approach combines advanced medical knowledge with a compassionate and supportive attitude towards every patient.";

const quote =
    "A healthy heart leads to a healthier life. My goal is to help you achieve better heart health and a better tomorrow.";

const education = [
    { title: "MBBS", org: "Dhaka Medical College", years: "2008 – 2014" },
    { title: "MD (Cardiology)", org: "Bangladesh Medical University", years: "2015 – 2018" },
    { title: "Fellowship in Interventional Cardiology", org: "Apollo Hospitals, Dhaka", years: "2019 – 2021" },
];

const experience = [
    { title: "Consultant Cardiologist", org: "Apollo Hospitals, Dhaka", years: "2021 – Present" },
    { title: "Senior Registrar", org: "National Heart Foundation", years: "2018 – 2021" },
    { title: "House Officer", org: "Dhaka Medical College Hospital", years: "2014 – 2015" },
];

const services = [
    { title: "Heart Disease", icon: Heart },
    { title: "High Blood Pressure", icon: Activity },
    { title: "Heart Failure", icon: HeartPulse },
    { title: "Interventional Cardiology", icon: Syringe },
    { title: "ECG & Echo", icon: LineChart },
    { title: "Cholesterol Management", icon: Droplet },
    { title: "Diabetes & Cardiac Care", icon: Syringe },
];

const ratingBreakdown = [
    { star: 5, pct: 92 },
    { star: 4, pct: 6 },
    { star: 3, pct: 1 },
    { star: 2, pct: 1 },
    { star: 1, pct: 0 },
];

const reviewsList = [
    {
        name: "Faria Rahman",
        date: "Jun 12, 2025",
        rating: 5,
        text: "Very professional and friendly. The treatment was excellent. Highly recommended!",
        helpful: 12,
        avatar:
            "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=100&auto=format&fit=crop",
    },
    {
        name: "Rakib Hossain",
        date: "May 28, 2025",
        rating: 5,
        text: "Dr. Hasan took the time to explain everything clearly. My blood pressure is finally under control.",
        helpful: 9,
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    },
    {
        name: "Nadia Sultana",
        date: "May 10, 2025",
        rating: 4,
        text: "Great experience overall, though the wait time was a bit long. Doctor was very thorough.",
        helpful: 4,
        avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    },
];

const calendarDays = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, null, null, null],
];

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

const tabs = ["About", "Education", "Experience", "Services", "Reviews"];

/* ---------------- Small UI helpers ---------------- */

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

function TimelineItem({ title, org, years }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-blue-600">
                <GraduationCap size={12} />
            </span>
            <div>
                <p className="text-sm font-semibold text-slate-900">
                    {title}{" "}
                    <span className="font-normal text-slate-500">– {org}</span>
                </p>
                <p className="text-xs text-slate-400">{years}</p>
            </div>
        </div>
    );
}

/* ---------------- Tab content components ---------------- */

function AboutTab() {
    return (
        <SectionCard icon={BadgeCheck} title={`About ${doctor.name}`}>
            <p className="text-sm leading-relaxed text-slate-600">{aboutText}</p>
            <div className="mt-4 rounded-xl bg-sky-50 p-4">
                <p className="text-sm italic leading-relaxed text-slate-600">
                    "{quote}"
                </p>
                <p className="mt-2 text-xs font-semibold text-slate-500">
                    — {doctor.name}
                </p>
            </div>
        </SectionCard>
    );
}

function EducationTab() {
    return (
        <SectionCard icon={GraduationCap} title="Education & Qualifications">
            <div className="space-y-4">
                {education.map((e) => (
                    <TimelineItem key={e.title} {...e} />
                ))}
            </div>
        </SectionCard>
    );
}

function ExperienceTab() {
    return (
        <SectionCard icon={Building2} title="Experience">
            <div className="space-y-4">
                {experience.map((e) => (
                    <TimelineItem key={e.title} {...e} />
                ))}
            </div>
        </SectionCard>
    );
}

function ServicesTab() {
    return (
        <SectionCard icon={Heart} title="Specialized In Services">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {services.map(({ title, icon: Icon }) => (
                    <div
                        key={title}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3"
                    >
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-blue-600">
                            <Icon size={15} />
                        </span>
                        <p className="text-sm font-medium text-slate-700">{title}</p>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}

function ReviewsTab() {
    return (
        <SectionCard icon={Star} title="Reviews & Feedback">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="text-center sm:w-32">
                    <p className="text-3xl font-bold text-slate-900">{doctor.rating}</p>
                    <div className="mt-1 flex justify-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < 4 ? "currentColor" : "currentColor"}
                                className={i < 4 ? "" : "opacity-50"}
                            />
                        ))}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                        Based on {doctor.reviews} reviews
                    </p>
                </div>

                <div className="flex-1 space-y-1.5">
                    {ratingBreakdown.map(({ star, pct }) => (
                        <div key={star} className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="w-9 flex-shrink-0">{star} Star</span>
                            <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                                <div
                                    className="h-1.5 rounded-full bg-blue-600"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <span className="w-8 flex-shrink-0 text-right">{pct}%</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">Patient Reviews</h4>
                <a href="#" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                    View All Reviews <ArrowRight size={12} />
                </a>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
                {reviewsList.map((r) => (
                    <div key={r.name} className="flex gap-3 py-4">
                        <img src={r.avatar} alt={r.name} className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                                <p className="text-xs text-slate-400">{r.date}</p>
                            </div>
                            <div className="mt-0.5 flex gap-0.5 text-amber-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={11} fill="currentColor" stroke="none" className={i < r.rating ? "" : "text-slate-200"} />
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-slate-600">{r.text}</p>
                            <button className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors">
                                <ThumbsUp size={12} />
                                Helpful ({r.helpful})
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}

const tabComponents = {
    About: AboutTab,
    Education: EducationTab,
    Experience: ExperienceTab,
    Services: ServicesTab,
    Reviews: ReviewsTab,
};

/* ---------------- Header / booking widget ---------------- */

function DoctorHeader() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr_300px]">
            {/* Photo */}
            <div className="relative overflow-hidden rounded-2xl">
                <span className="absolute left-3 top-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                    Available
                </span>
                <img src={doctor.photo} alt={doctor.name} className="h-72 w-full object-cover lg:h-full" />
                <button className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                    <Camera size={13} />
                    View Photos (5)
                </button>
            </div>

            {/* Info */}
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">{doctor.name}</h1>
                    <BadgeCheck size={20} className="text-blue-600" fill="#3b82f6" stroke="white" />
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-blue-600">
                    <Heart size={14} />
                    {doctor.role}
                </p>

                <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-800">{doctor.rating}</span>
                        ({doctor.reviews} reviews)
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {doctor.experience}
                    </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-6">
                    {doctor.credentials.map((c, i) => (
                        <div key={c.title} className="flex items-start gap-2">
                            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded bg-sky-100 text-blue-600">
                                {i === 2 ? <Building2 size={13} /> : <GraduationCap size={13} />}
                            </span>
                            <div>
                                <p className="text-xs font-semibold text-slate-800">{c.title}</p>
                                <p className="text-xs text-slate-400">{c.org}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {doctor.tags.map((t) => (
                        <span key={t} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-blue-600">
                            {t}
                        </span>
                    ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    {expanded ? doctor.bioShort : `${doctor.bioShort.slice(0, 110)}...`}
                </p>
                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="mt-1 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
                >
                    {expanded ? "Read Less" : "Read More"}
                    <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>
            </div>

            {/* Booking card */}
            <QuickInfo />

        </div>
    );
}

/* ---------------- Booking sidebar (persistent) ---------------- */

function BookingWidget() {
    const [step] = useState(1);
    const [selectedDay, setSelectedDay] = useState(12);
    const [selectedSlot, setSelectedSlot] = useState("09:00 AM");

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-900/5">
            <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#0066FE]" />
                <h3 className="font-bold text-[#0A1931]">Book Appointment</h3>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs">
                {["Date & Time", "Details", "Confirm"].map((label, i) => (
                    <React.Fragment key={label}>
                        <span
                            className={`flex items-center gap-1.5 ${i + 1 === step ? "font-semibold text-[#0066FE]" : "text-[#4A5568]"
                                }`}
                        >
                            <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${i + 1 === step ? "bg-[#0066FE] text-white" : "bg-slate-100 text-[#4A5568]"
                                    }`}
                            >
                                {i + 1}
                            </span>
                            {label}
                        </span>
                        {i < 2 && <span className="h-px flex-1 bg-slate-100" />}
                    </React.Fragment>
                ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
                <ChevronLeft size={16} className="cursor-pointer text-[#4A5568] hover:text-[#0066FE]" />
                <p className="text-sm font-semibold text-[#0A1931]">June 2025</p>
                <ChevronRight size={16} className="cursor-pointer text-[#0066FE] hover:text-[#0066FE]" />
            </div>

            <table className="mt-3 w-full text-center text-xs">
                <thead>
                    <tr className="text-[#4A5568]">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <th key={d} className="pb-2 font-normal">{d}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {calendarDays.map((week, wi) => (
                        <tr key={wi}>
                            {week.map((day, di) => (
                                <td key={di} className="py-1">
                                    {day && (
                                        <button
                                            onClick={() => setSelectedDay(day)}
                                            className={`flex h-7 w-7 items-center justify-center rounded-full mx-auto transition-colors ${day === selectedDay
                                                ? "bg-[#0066FE]text-white font-semibold"
                                                : "text-[#4A5568]hover:bg-sky-50"
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="mt-4 text-sm font-semibold text-[#0A1931]">
                Available Time Slots
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                    <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-lg border py-2 text-xs font-medium transition-colors ${slot === selectedSlot
                            ? "border-[#0066FE] bg-sky-50 text-[#0066FE]"
                            : "border-slate-200 text-[#0066FE]hover:border-blue-300"
                            }`}
                    >
                        {slot}
                    </button>
                ))}
            </div>

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0066FE] py-2.5 text-sm font-semibold text-white hover:bg-[#0066FE] transition-colors">
                Continue to Book
                <ArrowRight size={15} />
            </button>
        </div>
    );
}

function QuickInfo() {
    const rows = [
        { icon: Wallet, label: "Consultation Fee", value: doctor.fee },
        { icon: Clock, label: "Visiting Hours", value: "Sat - Thu: 9:00 AM - 8:00 PM\nFriday: Closed" },
        { icon: MessageSquare, label: "Languages", value: "English, Bangla" },
        { icon: MapPin, label: "Location", value: doctor.location },
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
                            <p className="whitespace-pre-line font-medium text-[#0A1931]">{value}</p>
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
            <svg
                className="pointer-events-none absolute -right-4 bottom-0 h-16 w-40 text-blue-500/40"
                viewBox="0 0 200 60"
                fill="none"
            >
                <path d="M0 30 H60 L75 10 L95 50 L115 30 H200" stroke="currentColor" strokeWidth="2" />
            </svg>
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
    const [activeTab, setActiveTab] = useState("About");
    const ActiveTabComponent = tabComponents[activeTab];

    return (
        <div className="min-h-screen pt-28 bg-[#f8fbfe]  py-8 ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-9">
                <DoctorHeader />

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
                    {/* Main column */}
                    <div>
                        {/* Tabs */}
                        <div className="flex gap-6 overflow-x-auto rounded-2xl bg-white px-2 shadow-sm shadow-slate-900/5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative whitespace-nowrap px-3 py-4 text-sm font-medium transition-colors ${activeTab === tab
                                        ? "text-[#0066FE]"
                                        : "text-[#4A5568] hover:text-[#0A1931]"
                                        }`}
                                >
                                    {tab === "Reviews" ? `Reviews (${doctor.reviews})` : tab}
                                    {activeTab === tab && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#0066FE]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Active tab content only */}
                        <div className="mt-6">
                            <ActiveTabComponent />
                        </div>
                    </div>

                    {/* Sidebar - persistent across tabs */}
                    <div className="space-y-6">
                        <BookingWidget />
                        <UrgentCareCard />
                    </div>
                </div>
            </div>
        </div>
    );
}