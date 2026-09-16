import React, { useState } from 'react'


import {
    Search,
    ChevronDown,
    Users,
    Star,
    ShieldCheck,
    Clock,
    Heart,
    Eye,
    Calendar,
    MapPin,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Link } from 'react-router';

const stats = [
    { icon: Users, value: "50+", label: "Qualified Doctors" },
    { icon: Star, value: "15+", label: "Specializations" },
    { icon: ShieldCheck, value: "98%", label: "Patient Satisfaction" },
    { icon: Clock, value: "24/7", label: "Support" },
];

const departments = [
    { name: "Cardiology", count: 12 },
    { name: "Neurology", count: 9 },
    { name: "Orthopedics", count: 8 },
    { name: "Dermatology", count: 6 },
    { name: "Pediatrics", count: 7 },
    { name: "Gynecology", count: 5 },
    { name: "General Medicine", count: 10 },
    { name: "ENT", count: 4 },
    { name: "Urology", count: 3 },
    { name: "Others", count: 2 },
];

const experienceOptions = ["Less than 5 years", "5 - 10 years", "More than 10 years"];
const ratingOptions = ["4.5 & above", "4.0 & above", "3.5 & above", "3.0 & above"];
const feeOptions = ["Under ৳500", "৳500 – ৳1,000", "৳1,000 – ৳2,000", "Above ৳2,000"];

const doctors = [
    {
        name: "Dr. Ahmed Hasan",
        role: "Cardiologist",
        rating: 4.8,
        reviews: 124,
        experience: "10+ years experience",
        fee: "৳1,000 – ৳1,500",
        location: "Dhaka",
        image:
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Farhana Akter",
        role: "Gynecologist",
        rating: 4.7,
        reviews: 98,
        experience: "8+ years experience",
        fee: "৳800 – ৳1,200",
        location: "Dhaka",
        image:
            "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Rabin Chowdhury",
        role: "Neurologist",
        rating: 4.9,
        reviews: 142,
        experience: "12+ years experience",
        fee: "৳1,200 – ৳2,000",
        location: "Dhaka",
        image:
            "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Nusrat Jahan",
        role: "Dermatologist",
        rating: 4.6,
        reviews: 87,
        experience: "7+ years experience",
        fee: "৳800 – ৳1,200",
        location: "Dhaka",
        image:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Saifur Rahman",
        role: "Orthopedic Surgeon",
        rating: 4.8,
        reviews: 112,
        experience: "11+ years experience",
        fee: "৳1,000 – ৳1,800",
        location: "Dhaka",
        image:
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Tasnia Islam",
        role: "Pediatrician",
        rating: 4.7,
        reviews: 96,
        experience: "6+ years experience",
        fee: "৳700 – ৳1,000",
        location: "Dhaka",
        image:
            "https://images.unsplash.com/photo-1590650213165-c1fef80648c4?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Imran Hossain",
        role: "ENT Specialist",
        rating: 4.5,
        reviews: 76,
        experience: "9+ years experience",
        fee: "৳800 – ৳1,300",
        location: "Dhaka",
        image:
            "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Shaila Rahman",
        role: "General Physician",
        rating: 4.6,
        reviews: 104,
        experience: "8+ years experience",
        fee: "৳600 – ৳1,000",
        location: "Mymensingh",
        image:
            "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Mahmudul Hasan",
        role: "Urologist",
        rating: 4.7,
        reviews: 89,
        experience: "7+ years experience",
        fee: "৳900 – ৳1,400",
        location: "Dhaka",
        image:
            "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=300&auto=format&fit=crop",
    },
];

function FilterSection({ title, children }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="border-b border-slate-100 py-5 first:pt-0">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between text-left"
            >
                <span className="text-sm font-semibold text-slate-900">{title}</span>
                <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>
            {open && <div className="mt-3 space-y-2.5">{children}</div>}
        </div>
    );
}

function Checkbox({ label, defaultChecked = false }) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
                type="checkbox"
                defaultChecked={defaultChecked}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
            />
            {label}
        </label>
    );
}

function DoctorCard({ doctor }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-900/5">
            <div className="relative">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-40 w-full rounded-xl object-cover"
                />
                <span className="absolute right-2 top-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                    Available
                </span>
            </div>

            <div className="mt-3 flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        {doctor.name}
                    </h3>
                    <p className="text-xs font-medium text-blue-600">{doctor.role}</p>
                </div>
                <button aria-label="Save doctor" className="text-slate-300 hover:text-rose-500 transition-colors">
                    <Heart size={16} />
                </button>
            </div>

            <div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="font-medium text-slate-800">{doctor.rating}</span>
                <span className="text-slate-400">({doctor.reviews} reviews)</span>
            </div>

            <div className="mt-2 space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {doctor.experience}
                </p>
                <p className="flex items-center gap-1.5">
                    <span className="text-[13px] leading-none">৳</span>
                    {doctor.fee}
                </p>
                <p className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    {doctor.location}
                </p>
            </div>

            <div className="mt-4 flex gap-2">
                <Link
                to={`/doctors/:doctorId`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[10px] font-semibold text-[#4A5568] hover:border-blue-400 hover:text-[#0066FE] transition-colors">
                    <Eye size={13} />
                    View Details
                </Link>
                <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0066FE] px-0.5 py-2 text-[10px] font-semibold text-white hover:bg-blue-700 transition-colors">
                    <Calendar size={13} />
                    Book Appointment
                </button>
            </div>
        </div>
    );
}


const Doctorspage = () => {

    const [page, setPage] = useState(1);
    const totalPages = 5;

    return (
        <div className="min-h-screen bg-[#f8fbfe] ">
            {/* Page header */}
            <div className='bg-[#f0f8fe]'>

                <section className="  max-w-7xl mx-auto px-4 pt-26 sm:px-6 lg:px-9 py-10 ">
                    <p className="mb-4 flex items-center gap-1 text-xs text-[#4A5568]">
                        Home <span>›</span> <span className="text-text-[#4A55">Doctors</span>
                    </p>

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A1931] sm:text-4xl">
                                Find the Right Doctor
                            </h1>
                            <h2 className="text-3xl font-bold text-[#0066FE] sm:text-4xl">
                                for Your Health
                            </h2>
                            <p className="mt-3 max-w-md text-sm text-[#4A5568]">
                                Our experienced and qualified doctors are here to provide you
                                with the best care, whenever you need it.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {stats.map(({ icon: Icon, value, label }) => (
                                <div
                                    key={label}
                                    className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white px-4 py-5 text-center shadow-sm shadow-slate-900/5"
                                >
                                    <Icon size={20} className="text-[#0066FE]" />
                                    <p className="text-sm font-bold text-[#0A1931]">{value}</p>
                                    <p className="text-xs text-[#4A5568]">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>

            <div className='max-w-7xl mx-auto px-4  sm:px-6 lg:px-9 py-10 '>
                {/* Search bar */}
                <section className="">

                    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4  shadow-sm shadow-slate-900/5 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Search doctor by name, speciality, or keyword..."
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-blue-400"
                            />
                        </div>

                        <button className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-left text-sm text-[#4A5568] lg:w-48">
                            <span>
                                Department
                                <br />
                                <span className="text-xs text-[#4A5568]">All Departments</span>
                            </span>
                            <ChevronDown size={14} className="flex-shrink-0" />
                        </button>

                        <button className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-left text-sm text-[#4A5568] lg:w-44">
                            <span>
                                Location
                                <br />
                                <span className="text-xs text-slate-400">All Locations</span>
                            </span>
                            <ChevronDown size={14} className="flex-shrink-0" />
                        </button>

                        <button className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-left text-sm text-[#4A5568] lg:w-44">
                            <span>
                                Sort By
                                <br />
                                <span className="text-xs text-slate-400">Recommended</span>
                            </span>
                            <ChevronDown size={14} className="flex-shrink-0" />
                        </button>

                        <button className="flex items-center justify-center gap-2 rounded-lg bg-[#0066FE] px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                            <Search size={15} />
                            Search
                        </button>
                    </div>
                </section>

                {/* Main content */}
                <section className=" py-12 ">
                    <div className="flex flex-col  gap-6 lg:flex-row lg:items-start">
                        {/* Sidebar filters */}
                        <aside className="w-full flex-shrink-0 rounded-2xl bg-white  p-5 shadow-sm shadow-slate-900/5 lg:w-64">
                            <div className="flex items-center justify-between pb-4">
                                <h3 className="text-sm font-bold text-[#0A1931]">
                                    Filter Doctors
                                </h3>
                                <button className="text-xs font-medium text-[#0066FE] hover:underline">
                                    Clear All
                                </button>
                            </div>

                            <FilterSection title="Department">
                                {departments.map((d) => (
                                    <Checkbox key={d.name} label={`${d.name} (${d.count})`} />
                                ))}
                            </FilterSection>

                            <FilterSection title="Gender">
                                <Checkbox label="Male (28)" />
                                <Checkbox label="Female (22)" />
                                <Checkbox label="Any (50)" defaultChecked />
                            </FilterSection>

                            <FilterSection title="Experience">
                                {experienceOptions.map((label) => (
                                    <Checkbox
                                        key={label}
                                        label={label}
                                        defaultChecked={label === "More than 10 years"}
                                    />
                                ))}
                            </FilterSection>

                            <FilterSection title="Rating">
                                {ratingOptions.map((label) => (
                                    <label
                                        key={label}
                                        className="flex cursor-pointer items-center gap-2 text-sm text-[#4A5568]"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-slate-300 text-[#0066FE] focus:ring-blue-400"
                                        />
                                        <span className="flex items-center gap-0.5 text-amber-400">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <Star key={i} size={11} fill="currentColor" stroke="none" />
                                            ))}
                                            <Star size={11} className="text-slate-200" fill="currentColor" stroke="none" />
                                        </span>
                                        {label}
                                    </label>
                                ))}
                            </FilterSection>

                            <FilterSection title="Consultation Fee">
                                {feeOptions.map((label) => (
                                    <Checkbox key={label} label={label} />
                                ))}
                            </FilterSection>

                            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-[#4A5568] hover:border-blue-400 hover:text-[#0066FE]transition-colors">
                                <RefreshCw size={14} />
                                Reset Filters
                            </button>
                        </aside>

                        {/* Doctor grid */}
                        <div className="flex-1">
                            <p className="mb-4 text-sm text-[#4A5568]">
                                Showing 1 – 9 of 50 doctors
                            </p>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {doctors.map((doctor) => (
                                    <DoctorCard key={doctor.name} doctor={doctor} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-10 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[#4A5568] disabled:opacity-40 hover:border-blue-400 hover:text-[#0066FE] transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const p = i + 1;
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${p === page
                                                ? "bg-[#0066FE] text-white"
                                                : "text-[#4A5568]hover:bg-blue-50 hover:text-[#0066FE]"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[#4A5568] disabled:opacity-40 hover:border-blue-400 hover:text-[#0066FE]transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>


        </div>
    )
}

export default Doctorspage