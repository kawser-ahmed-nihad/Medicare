import React, { useState } from "react";
import {
    Heart,
    Search,
    MoreVertical,
    Star,
    CalendarDays,
    MapPin,
    BriefcaseBusiness,
    UserRound,
    FileText,
    MessageSquare,
    Pill,
    ChevronRight,
    ArrowRight,
    Bell,
    CheckCircle2,
    Stethoscope,
    Quote,
    BadgeCheck,
} from "lucide-react";

const favoriteDoctors = [
    {
        name: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        rating: "4.8",
        reviews: "320",
        experience: "10+ years experience",
        hospital: "City Hospital, Room 302",
        image:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=85",
    },
    {
        name: "Dr. Robert Smith",
        specialty: "Dermatologist",
        rating: "4.6",
        reviews: "210",
        experience: "8+ years experience",
        hospital: "City Hospital, Room 205",
        image:
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=85",
    },
    {
        name: "Dr. Emily Carter",
        specialty: "General Physician",
        rating: "4.7",
        reviews: "180",
        experience: "7+ years experience",
        hospital: "City Hospital, Room 101",
        image:
            "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&q=85",
    },
];

const consultedDoctors = [
    {
        name: "Dr. James Anderson",
        specialty: "Orthopedic Specialist",
        rating: "4.5",
        reviews: "140",
        experience: "6+ years experience",
        hospital: "City Hospital, Room 208",
        image:
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&q=85",
    },
    {
        name: "Dr. Lisa Martinez",
        specialty: "Neurologist",
        rating: "4.6",
        reviews: "98",
        experience: "9+ years experience",
        hospital: "City Hospital, Room 305",
        image:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&q=85",
    },
    {
        name: "Dr. Michael Brown",
        specialty: "Pediatrician",
        rating: "4.3",
        reviews: "76",
        experience: "5+ years experience",
        hospital: "City Hospital, Room 102",
        image:
            "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&q=85",
    },
];

function DoctorImage({ src, name }) {
    return (
        <div className="relative h-[62px] w-[62px] shrink-0 overflow-hidden rounded-full bg-blue-50 ring-4 ring-blue-50">
            <img
                src={src}
                alt={name}
                className="h-full w-full object-cover"
            />
        </div>
    );
}

function FavoriteDoctorCard({ doctor }) {
    return (
        <div className="relative rounded-lg border border-slate-200 bg-white p-3 transition hover:border-blue-300 hover:shadow-md">
            {/* More */}
            <button className="absolute right-2 top-2 text-blue-500">
                <MoreVertical size={13} />
            </button>

            {/* Favorite */}
            <div className="absolute left-[72px] top-3 flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[7px] font-medium text-blue-600">
                <Heart size={8} className="fill-blue-500" />
                Favorite
            </div>

            {/* Doctor */}
            <div className="flex gap-3">
                <DoctorImage src={doctor.image} name={doctor.name} />

                <div className="min-w-0 pt-1">
                    <div className="flex items-center gap-1">
                        <h3 className="truncate text-[10px] font-bold text-slate-800">
                            {doctor.name}
                        </h3>

                        <BadgeCheck
                            size={10}
                            className="shrink-0 fill-blue-500 text-white"
                        />
                    </div>

                    <p className="mt-0.5 text-[8px] text-slate-500">
                        {doctor.specialty}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-[8px]">
                        <Star size={9} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-700">
                            {doctor.rating}
                        </span>
                        <span className="text-blue-500">
                            ({doctor.reviews} reviews)
                        </span>
                    </div>
                </div>
            </div>

            {/* Information */}
            <div className="mt-3 space-y-1.5 text-[7px] text-slate-500">
                <div className="flex items-center gap-2">
                    <BriefcaseBusiness size={9} />
                    {doctor.experience}
                </div>

                <div className="flex items-center gap-2">
                    <CalendarDays size={9} />
                    {doctor.experience}
                </div>

                <div className="flex items-center gap-2">
                    <MapPin size={9} />
                    {doctor.hospital}
                </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-1 rounded-md bg-blue-600 py-2 text-[7px] font-semibold text-white hover:bg-blue-700">
                    <CalendarDays size={10} />
                    Book Appointment
                </button>

                <button className="flex items-center justify-center gap-1 rounded-md border border-blue-200 px-3 py-2 text-[7px] font-medium text-blue-600 hover:bg-blue-50">
                    <UserRound size={10} />
                    View Profile
                </button>
            </div>
        </div>
    );
}

function ConsultedDoctorCard({ doctor }) {
    return (
        <div className="relative rounded-lg border border-slate-200 bg-white p-3 transition hover:border-blue-300 hover:shadow-md">
            <button className="absolute right-2 top-2 text-blue-500">
                <MoreVertical size={13} />
            </button>

            <div className="flex gap-3">
                <DoctorImage src={doctor.image} name={doctor.name} />

                <div className="min-w-0 pt-1">
                    <div className="flex items-center gap-1">
                        <h3 className="truncate text-[10px] font-bold text-slate-800">
                            {doctor.name}
                        </h3>

                        <BadgeCheck
                            size={10}
                            className="shrink-0 fill-blue-500 text-white"
                        />
                    </div>

                    <p className="mt-0.5 text-[8px] text-slate-500">
                        {doctor.specialty}
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-[8px]">
                        <Star size={9} className="fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{doctor.rating}</span>
                        <span className="text-blue-500">
                            ({doctor.reviews} reviews)
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-3 space-y-1.5 text-[7px] text-slate-500">
                <div className="flex items-center gap-2">
                    <BriefcaseBusiness size={9} />
                    {doctor.experience}
                </div>

                <div className="flex items-center gap-2">
                    <CalendarDays size={9} />
                    {doctor.experience}
                </div>

                <div className="flex items-center gap-2">
                    <MapPin size={9} />
                    {doctor.hospital}
                </div>
            </div>

            <div className="mt-3 flex justify-end">
                <button className="flex items-center gap-1 rounded-md border border-blue-200 px-3 py-2 text-[7px] font-medium text-blue-600 hover:bg-blue-50">
                    <UserRound size={10} />
                    View Profile
                </button>
            </div>
        </div>
    );
}

function SectionHeader({ icon, title, subtitle }) {
    return (
        <div className="mb-3 flex items-start justify-between">
            <div className="flex items-start gap-2">
                <div className="mt-0.5 text-blue-600">{icon}</div>

                <div>
                    <h2 className="text-[10px] font-bold text-[#12336b]">
                        {title}
                    </h2>

                    <p className="mt-0.5 text-[7px] text-slate-400">
                        {subtitle}
                    </p>
                </div>
            </div>

            <button className="flex items-center gap-1 text-[7px] font-semibold text-blue-600">
                View All
                <ArrowRight size={9} />
            </button>
        </div>
    );
}

function WhyFollow() {
    const points = [
        "Get appointment reminders",
        "Receive health tips & updates",
        "Quick access to medical history",
        "Direct messaging with your doctor",
    ];

    return (
        <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-4">
            <div className="mb-3 flex justify-end">
                <div className="relative flex h-14 w-24 items-center justify-center overflow-hidden rounded-lg bg-blue-50">
                    <Heart className="absolute left-3 top-2 fill-blue-100 text-blue-400" />
                    <Stethoscope className="text-blue-600" size={36} />
                </div>
            </div>

            <h2 className="text-[12px] font-bold text-[#12336b]">
                Why Follow Your Doctors?
            </h2>

            <p className="mt-1 text-[8px] leading-relaxed text-slate-400">
                Stay connected with your doctors
                <br />
                for better care and faster support.
            </p>

            <div className="mt-3 space-y-2.5">
                {points.map((point) => (
                    <div
                        key={point}
                        className="flex items-center gap-2 text-[8px] text-slate-500"
                    >
                        <CheckCircle2
                            size={11}
                            className="fill-blue-600 text-white"
                        />
                        {point}
                    </div>
                ))}
            </div>
        </div>
    );
}

const actions = [
    {
        icon: CalendarDays,
        title: "Book New Appointment",
        subtitle: "Find and book a doctor",
    },
    {
        icon: FileText,
        title: "View Medical Records",
        subtitle: "Access your health history",
    },
    {
        icon: MessageSquare,
        title: "Send Message",
        subtitle: "Chat with your doctor",
    },
    {
        icon: Pill,
        title: "View Prescriptions",
        subtitle: "Check your medicines",
    },
];

function QuickActions() {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3">
            <h2 className="mb-2 text-[10px] font-bold text-[#12336b]">
                Quick Actions
            </h2>

            <div className="overflow-hidden rounded-lg border border-slate-100">
                {actions.map((action, index) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.title}
                            className={`flex w-full items-center gap-3 p-2.5 text-left hover:bg-blue-50 ${index !== actions.length - 1
                                    ? "border-b border-slate-100"
                                    : ""
                                }`}
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                                <Icon size={13} />
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block text-[8px] font-semibold text-[#12336b]">
                                    {action.title}
                                </span>

                                <span className="mt-0.5 block text-[7px] text-slate-400">
                                    {action.subtitle}
                                </span>
                            </span>

                            <ChevronRight size={12} className="text-slate-400" />
                        </button>
                    );
                })}
            </div>

            {/* Quote */}
            <div className="mt-3 rounded-lg bg-blue-50 p-4">
                <Quote size={22} className="mb-1 text-blue-300" />

                <p className="text-[8px] leading-relaxed text-blue-500">
                    "Good doctors treat the disease,
                    <br />
                    great doctors treat the person."
                </p>

                <p className="mt-3 text-[7px] text-blue-400">
                    — William Osler
                </p>
            </div>
        </div>
    );
}

export default function MyDoctors() {
    const [activeTab, setActiveTab] = useState("All Doctors (6)");

    const tabs = [
        "All Doctors (6)",
        "Favorite (3)",
        "Previous (3)",
    ];

    return (
        <div className="min-h-screen bg-[#f6fbff] p-3 font-sans text-slate-800 sm:p-5">
            <div className="mx-auto max-w-[1280px]">
                {/* Header */}
                <header className="mb-3 flex items-start justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold tracking-tight text-[#12336b] sm:text-[23px]">
                            My Doctors
                        </h1>

                        <p className="mt-1 text-[8px] text-slate-400 sm:text-[9px]">
                            View and manage your favorite doctors and previously
                            consulted doctors.
                        </p>
                    </div>

                    <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-[8px] font-semibold text-white shadow-sm transition hover:bg-blue-700">
                        <Search size={11} />
                        Find New Doctor
                    </button>
                </header>

                {/* Tabs */}
                <div className="mb-3 flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-lg px-4 py-2 text-[8px] font-medium transition ${activeTab === tab
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "border border-blue-100 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main layout */}
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_215px]">
                    {/* Left */}
                    <main className="space-y-3">
                        {/* Favorite doctors */}
                        <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                            <SectionHeader
                                icon={<Heart size={15} />}
                                title="Your Favorite Doctors"
                                subtitle="Doctors you have marked as favorite for quick access."
                            />

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {favoriteDoctors.map((doctor) => (
                                    <FavoriteDoctorCard
                                        key={doctor.name}
                                        doctor={doctor}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Previously consulted */}
                        <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                            <SectionHeader
                                icon={<CalendarDays size={15} />}
                                title="Previously Consulted Doctors"
                                subtitle="Doctors you have consulted in the past."
                            />

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {consultedDoctors.map((doctor) => (
                                    <ConsultedDoctorCard
                                        key={doctor.name}
                                        doctor={doctor}
                                    />
                                ))}
                            </div>
                        </section>
                    </main>

                    {/* Right sidebar */}
                    <aside className="space-y-3">
                        <WhyFollow />
                        <QuickActions />
                    </aside>
                </div>
            </div>
        </div>
    );
}