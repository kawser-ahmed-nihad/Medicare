import {
    HeartPulse,
    User,
    Brain,
    Wind,
    Bone,
    Baby,
    Venus,
    Hand,
    Droplet,
    Ear,
    Pill,
    Eye,
    Search,
    Calendar,
    UserCheck,
    ShieldCheck,
    Tag,
    Headphones,

    Grid3x3,
    Star,
    Phone,


    ArrowRight,


} from "lucide-react";
import React from 'react'

const highlights = [
    { label: "Experienced\nDoctors", icon: UserCheck },
    { label: "Modern\nTechnology", icon: ShieldCheck },
    { label: "Affordable\nPricing", icon: Tag },
    { label: "24/7\nSupport", icon: Headphones },
];

const treatments = [
    {
        title: "Health Checkup Package",
        desc: "Keep your health in check with our comprehensive health packages.",
        icon: HeartPulse,
        image:
            "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Heart Care Program",
        desc: "Advanced cardiac care with modern technology and expert team.",
        icon: HeartPulse,
        image:
            "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Maternal & Child Care",
        desc: "Safe and healthy care for moms and newborns.",
        icon: Baby,
        image:
            "https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Surgical Services",
        desc: "Advanced surgical solutions with high success rate.",
        icon: User,
        image:
            "https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=600&auto=format&fit=crop",
    },
];

const stats = [
    { icon: User, value: "100+", label: "Expert Doctors" },
    { icon: Grid3x3, value: "50+", label: "Medical Departments" },
    { icon: User, value: "20k+", label: "Happy Patients" },
    { icon: Star, value: "98%", label: "Patient Satisfaction" },
];

const services = [
    {
        name: "General Medicine",
        desc: "Primary care for all ages, from routine checkups to common illnesses.",
        icon: HeartPulse,
        bg: "bg-sky-100",
        color: "text-sky-600",
    },
    {
        name: "Cardiology",
        desc: "Advanced heart care with modern diagnostics and treatment options.",
        icon: User,
        bg: "bg-blue-100",
        color: "text-blue-600",
    },
    {
        name: "Neurology",
        desc: "Expert treatment for brain, nerve, and spine disorders.",
        icon: Brain,
        bg: "bg-purple-100",
        color: "text-purple-600",
    },
    {
        name: "Pulmonology",
        desc: "Care for respiratory issues, including asthma, COPD and lung infections.",
        icon: Wind,
        bg: "bg-emerald-100",
        color: "text-emerald-600",
    },
    {
        name: "Orthopedics",
        desc: "Treatment for bone, joint and muscle problems.",
        icon: Bone,
        bg: "bg-sky-100",
        color: "text-sky-600",
    },
    {
        name: "Pediatrics",
        desc: "Specialized care for infants, children and adolescents.",
        icon: Baby,
        bg: "bg-teal-100",
        color: "text-teal-600",
    },
    {
        name: "Gynecology",
        desc: "Complete women's health services from adolescence to menopause.",
        icon: Venus,
        bg: "bg-fuchsia-100",
        color: "text-fuchsia-600",
    },
    {
        name: "Dermatology",
        desc: "Care for skin, hair and nail conditions.",
        icon: Hand,
        bg: "bg-orange-100",
        color: "text-orange-600",
    },
    {
        name: "Urology",
        desc: "Treatment for urinary tract and kidney related issues.",
        icon: Droplet,
        bg: "bg-sky-100",
        color: "text-sky-600",
    },
    {
        name: "ENT",
        desc: "Specialized care for ear, nose, throat and hearing problems.",
        icon: Ear,
        bg: "bg-blue-100",
        color: "text-blue-600",
    },
    {
        name: "Gastroenterology",
        desc: "Digestive system's care and endoscopy services.",
        icon: Pill,
        bg: "bg-amber-100",
        color: "text-amber-600",
    },
    {
        name: "Ophthalmology",
        desc: "Comprehensive eye care and vision correction.",
        icon: Eye,
        bg: "bg-sky-100",
        color: "text-sky-600",
    },
];



const MedicalServicesPage = () => {
    return (
        <div className="min-h-screen bg-[#f8fbfe] pt-24 ">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9">
                {/* Page header / breadcrumb */}
                <section className=" ">
                    <p className="mb-4 flex items-center gap-1 text-xs text-[#4A5568]">
                        Home <span>›</span> <span className="text-[#4A5568]">Services</span>
                    </p>

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                Our Medical <span className="text-[#0066FE]">Services</span>
                            </h1>
                            <p className="mt-3 max-w-md text-sm text-[#4A5568]">
                                We offer a wide range of healthcare services to meet your
                                healthcare needs under one roof.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {highlights.map(({ label, icon: Icon }) => (
                                <div
                                    key={label}
                                    className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white px-4 py-5 text-center shadow-sm shadow-slate-900/5"
                                >
                                    <Icon size={20} className="text-[#0066FE]" />
                                    <p className="whitespace-pre-line text-xs font-medium text-[#0A1931]">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categories of Services */}
                <section className=" py-16 ">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#0066FE]">
                                Our Services
                            </p>
                            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                                Categories of <span className="text-[#0066FE]">Services</span>
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-[#4A5568]">
                                Explore our different medical services to find the right care
                                for you and your family.
                            </p>
                        </div>

                        <div className="relative w-full max-w-xs">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5568]"
                            />
                            <input
                                type="text"
                                placeholder="Search services..."
                                className="w-full rounded-full border border-[#4A5568] py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {services.map(({ name, desc, icon: Icon, bg, color }) => (
                            <div
                                key={name}
                                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-900/5 hover:shadow-md transition-shadow"
                            >
                                <span
                                    className={`flex h-11 w-11 items-center justify-center rounded-full ${bg} ${color}`}
                                >
                                    <Icon size={20} />
                                </span>
                                <h3 className="mt-4 font-semibold text-[#0A1931]">{name}</h3>
                                <p className="mt-1 text-sm text-[#4A5568]">{desc}</p>
                                <span className="mt-4 flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[#0066FE] group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <ArrowRight size={14} />
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Treatments */}
                <section className="  py-16 ">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#0066FE]">
                        Featured Treatments
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-[#0A1931] sm:text-3xl">
                        Our Special <span className="text-[#0066FE]">Treatments</span>
                    </h2>
                    <p className="mt-2 max-w-md text-sm text-[#4A5568]">
                        We focus on providing high-quality and personalized treatment for
                        your better health and comfort.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {treatments.map(({ title, desc, icon: Icon, image }) => (
                            <div
                                key={title}
                                className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-slate-900/5"
                            >
                                <div className="relative h-40 w-full">
                                    <img
                                        src={image}
                                        alt={title}
                                        className="h-full w-full object-cover"
                                    />
                                    <span className="absolute -bottom-5 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0066FE] shadow-md">
                                        <Icon size={18} />
                                    </span>
                                </div>
                                <div className="p-5 pt-7">
                                    <h3 className="font-semibold text-slate-900">{title}</h3>
                                    <p className="mt-1 text-sm text-slate-500">{desc}</p>
                                    <a
                                        href="#"
                                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0066FE] hover:gap-2 transition-all"
                                    >
                                        Learn More <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats bar */}
                    <div className="mt-10 grid grid-cols-2 gap-6 rounded-2xl bg-[#f0f8fe] p-6 shadow-sm shadow-slate-900/5 sm:grid-cols-4">
                        {stats.map(({ icon: Icon, value, label }) => (
                            <div key={label} className="flex items-center gap-3">
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0066FE]">
                                    <Icon size={24} />
                                </span>
                                <div className="leading-tight">
                                    <p className="font-bold text-slate-900">{value}</p>
                                    <p className="text-xs text-slate-500">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA banner */}
                <section className=" py-10 ">
                    <div className="relative overflow-hidden rounded-2xl bg-[#0066FE] px-8 py-10 text-white">
                        <svg
                            className="pointer-events-none absolute -right-6 top-0 h-full w-64 text-blue-500/40"
                            viewBox="0 0 200 160"
                            fill="none"
                        >
                            <path
                                d="M0 80 H60 L75 40 L95 120 L115 80 H200"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                        </svg>

                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-sky-200">
                                    Need Emergency Care?
                                </p>
                                <h3 className="mt-1 text-2xl font-bold sm:text-3xl text-white">
                                    Your Health Is Our Priority
                                </h3>
                                <p className="mt-2 max-w-md text-sm text-[#E1EDFE]">
                                    Get the best medical care, whenever you need it. Book your
                                    appointment today and take the first step towards a healthier
                                    life.
                                </p>
                            </div>

                            <div
                                className="
                                                   flex
                                                   flex-col
                                                   sm:flex-row
                                                   w-full
                                                   lg:w-auto
                                                   lg:ml-auto
                                                   gap-3
                                                   sm:gap-4
                                                   items-stretch
                                                   sm:items-center
                                                   mt-6
                                                   lg:mt-0
                                               "
                            >

                                <button
                                    className="
                                                       flex
                                                       items-center
                                                       cursor-pointer
                                                       justify-center
                                                       bg-white
                                                       font-semibold
                                                       text-[#0066FE]
                                                       rounded-xl
                                                       px-5
                                                       py-3
                                                       transition-all
                                                       duration-300
                                                       hover:shadow-lg
                                                       hover:-translate-y-0.5
                                                   "
                                >
                                    <Calendar
                                        color="#0066FE"
                                        size={20}
                                        className="mr-2"
                                    />

                                    Book Appointment
                                </button>


                                <button
                                    className="
                                                       flex
                                                       items-center
                                                       cursor-pointer
                                                       justify-center
                                                       outline-2
                                                       outline-[#E2E8F0]
                                                       bg-transparent
                                                       text-white
                                                       rounded-xl
                                                       font-semibold
                                                       px-5
                                                       py-3
                                                       transition-all
                                                       duration-300
                                                       hover:bg-white/10
                                                       hover:-translate-y-0.5
                                                   "
                                >
                                    <Phone
                                        color="#ffffff"
                                        size={20}
                                        className="mr-2"
                                    />

                                    Talk to Doctor
                                </button>

                            </div>
                        </div>
                    </div>
                </section>
            </div>






        </div>
    )
}

export default MedicalServicesPage