import React from 'react'
import {


    Calendar,
    ShieldCheck,
    Users,
    Cpu,
    Heart,
    Target,
    Eye,
    Lightbulb,
    Clock,
    ArrowRight,
} from "lucide-react";


const trustBadges = [
    { label: "Trusted\nHealthcare", icon: ShieldCheck },
    { label: "Expert\nDoctors", icon: Users },
    { label: "Modern\nTechnology", icon: Cpu },
    { label: "Patient\nFirst", icon: Heart },
];

const overviewStats = [
    { icon: Users, value: "10,000+", label: "Happy Patients" },
    { icon: Users, value: "50+", label: "Expert Doctors" },
    { icon: ShieldCheck, value: "15+", label: "Specializations" },
    { icon: Clock, value: "24/7", label: "Support" },
];

const values = [
    {
        title: "Compassion",
        desc: "We treat every patient with care and respect.",
        icon: Heart,
    },
    {
        title: "Integrity",
        desc: "We follow the highest ethical standards.",
        icon: ShieldCheck,
    },
    {
        title: "Excellence",
        desc: "We strive for the best in everything we do.",
        icon: Users,
    },
    {
        title: "Innovation",
        desc: "We use technology to create better healthcare solutions.",
        icon: Lightbulb,
    },
];

const doctors = [
    {
        name: "Dr. Ahmed Hasan",
        role: "Cardiologist",
        image:
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Farhana Akter",
        role: "Gynecologist",
        image:
            "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Rabin Chowdhury",
        role: "Neurologist",
        image:
            "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=300&auto=format&fit=crop",
    },
    {
        name: "Dr. Tasnia Islam",
        role: "Pediatrician",
        image:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
    },
];

const Aboutpage = () => {
    return (
        <div className="min-h-screen bg-[#f8fbfe] ">

            {/* Hero */}
            <section className=" bg-[#f0f8fe] pt-26  ">
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-9'>
                    <p className="mb-4 flex items-center gap-1 text-xs text-[#4A5568]">
                        Home <span>›</span> <span className="text-[#4A5568]">About Us</span>
                    </p>

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0A1931] sm:text-4xl">
                                About MediCare
                            </h1>
                            <h2 className="text-3xl font-bold text-[#0066FE] sm:text-4xl">
                                Better Health, Brighter Future
                            </h2>
                            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#4A5568]">
                                We are a modern healthcare platform dedicated to providing
                                high-quality medical services, expert doctors, and
                                compassionate care for you and your family. Our goal is to
                                make healthcare simple, accessible, and reliable for everyone.
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {trustBadges.map(({ label, icon: Icon }) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#0066FE] shadow-sm shadow-slate-900/5">
                                            <Icon size={16} />
                                        </span>
                                        <p className="whitespace-pre-line text-xs font-medium text-[#4A5568]">
                                            {label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"
                                alt="Doctor"
                                className="h-80 w-full rounded-3xl object-cover sm:h-96"
                            />
                            <div className="absolute left-6 top-6 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg shadow-slate-900/10">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-blue-600">
                                    <Heart size={16} />
                                </span>
                                <div className="leading-tight">
                                    <p className="text-sm font-semibold text-[#0A1931]">
                                        Your Health
                                    </p>
                                    <p className="text-sm font-semibold text-[#0A1931]">
                                        Our Priority
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-9'>

                {/* Who We Are */}
                <section className=" py-16">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop"
                                alt="MediCare reception"
                                className="h-80 w-full rounded-2xl object-cover"
                            />
                            <div className="absolute bottom-2 left-2 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg shadow-slate-900/10">
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0066FE] text-white">
                                    <Users size={18} />
                                </span>
                                <div className="leading-tight">
                                    <p className="text-sm font-semibold text-[#0A1931]">
                                        Founded in 2026
                                    </p>
                                    <p className="max-w-[180px] text-xs text-[#4A5568]">
                                        With a vision to make quality healthcare accessible to all.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:pl-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#0066FE]">
                                Who We Are
                            </p>
                            <h2 className="mt-1 text-2xl font-bold text-[#0A1931] sm:text-3xl">
                                We Are More Than Just A{" "}
                                <span className="text-[#0066FE]">Healthcare Platform</span>
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-[#4A5568]">
                                MediCare is a dedicated team of healthcare professionals,
                                technologists, and support staff working together to build a
                                healthier community. We connect patients with trusted doctors,
                                offer easy appointment booking, and provide reliable medical
                                information — all in one place.
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {overviewStats.map(({ icon: Icon, value, label }) => (
                                    <div
                                        key={label}
                                        className="rounded-xl bg-[#f0f8fe] px-3 py-5 text-center"
                                    >
                                        <Icon size={18} className="mx-auto text-[#0066FE]" />
                                        <p className="mt-2 font-bold text-[#0A1931]">{value}</p>
                                        <p className="text-xs text-[#4A5568]">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className=" pb-16 ">
                    <div className="grid grid-cols-1 lg:divide-x-1
                                lg:divide-[#c1d5f7] gap-8 rounded-2xl bg-[#f0f8fe] p-8 sm:grid-cols-2">
                        <div className="flex gap-4">
                            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#0066FE]">
                                <Target size={20} />
                            </span>
                            <div>
                                <h3 className="font-bold text-[#0A1931]">Our Mission</h3>
                                <p className="mt-1 text-sm leading-relaxed text-[#4A5568]">
                                    To provide accessible, affordable, and high-quality
                                    healthcare services that improve lives and build healthier
                                    communities.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#0066FE]">
                                <Eye size={20} />
                            </span>
                            <div>
                                <h3 className="font-bold text-[#0A1931]">Our Vision</h3>
                                <p className="mt-1 text-sm leading-relaxed text-[#0A1931]">
                                    To become the most trusted and advanced healthcare platform,
                                    making quality medical care accessible to everyone,
                                    everywhere.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className=" pb-16 ">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#0066FE]">
                        Our Values
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-[#0A1931] sm:text-3xl">
                        What <span className="text-blue-600">Drives Us</span>
                    </h2>

                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map(({ title, desc, icon: Icon }) => (
                            <div
                                key={title}
                                className="rounded-2xl bg-[#f0f8fe] p-6 hover:bg-sky-100/70 transition-colors"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0066FE]">
                                    <Icon size={20} />
                                </span>
                                <h3 className="mt-4 font-semibold text-[#0A1931]">{title}</h3>
                                <p className="mt-1 text-sm text-[#0A1931]">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section className="bg-[#f0f8fe] rounded-md  p-12 ">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#f0f8fe]">
                                Our Team
                            </p>
                            <h2 className="mt-1 text-2xl font-bold text-[#0A1931] sm:text-3xl">
                                Meet Our Healthcare Experts
                            </h2>
                            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#4A5568]">
                                Our team of experienced doctors, specialists, and healthcare
                                professionals are always here to serve you with dedication and
                                care.
                            </p>
                            <button className="mt-6 flex items-center gap-2 rounded-full bg-[#0066FE] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                                Meet Our Doctors
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {doctors.map(({ name, role, image }) => (
                                <div key={name} className="text-center">
                                    <img
                                        src={image}
                                        alt={name}
                                        className="aspect-square w-full rounded-xl object-cover"
                                    />
                                    <p className="mt-3 text-sm font-semibold text-[#0A1931]">
                                        {name}
                                    </p>
                                    <p className="text-xs text-[#4A5568]">{role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className=" py-10">
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
                                <p className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Ready to Get Started?
                                </p>
                                <h3 className="mt-1 text-2xl font-bold sm:text-3xl text-white">
                                    Book Your Appointment Today
                                </h3>
                                <p className="mt-2 max-w-md text-sm text-[#E1EDFE]">
                                    Take the first step towards a healthier life. Choose your
                                    doctor and book your appointment in just a few clicks.
                                </p>
                            </div>

                            <div className="flex flex-shrink-0 gap-3">
                                <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0066FE]  hover:bg-sky-50 transition-colors">
                                    <Calendar size={16} />
                                    Book Appointment
                                </button>
                                <button className="flex items-center gap-2 rounded-xl border border-white/60 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                                    <ArrowRight size={16} />
                                    Explore Services
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    )
}

export default Aboutpage