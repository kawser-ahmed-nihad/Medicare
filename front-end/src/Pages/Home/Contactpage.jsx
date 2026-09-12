import React, { useState } from 'react'

import {
    HeartPulse,
    Search,
    Calendar,
    Phone,
    Mail,
    MapPin,
    Clock,
    ArrowRight,
    Send,
    ChevronDown,

} from "lucide-react";


const contactInfo = [
    {
        icon: Phone,
        title: "Call Us",
        lines: ["+880 1711 223344", "+880 1911 556677"],
    },
    {
        icon: Mail,
        title: "Email Us",
        lines: ["info@medicare.com", "support@medicare.com"],
    },
    {
        icon: MapPin,
        title: "Visit Us",
        lines: ["123 Health Street,", "Mymensingh, Bangladesh"],
    },
    {
        icon: Clock,
        title: "Working Hours",
        lines: ["Mon - Sat: 8:00 AM - 8:00 PM", "Sunday: Emergency Only"],
    },
];

const departments = [
    "General Inquiry",
    "Book an Appointment",
    "Billing & Insurance",
    "Emergency Care",
    "Feedback & Complaints",
];

const faqs = [
    {
        q: "How do I book an appointment with MediCare?",
        a: "You can book online through the Book Appointment button, call our helpline, or visit any of our branches directly.",
    },
    {
        q: "Do you accept health insurance?",
        a: "Yes, we work with most major insurance providers. Contact our billing team to confirm your specific plan.",
    },
    {
        q: "What should I do in a medical emergency?",
        a: "Call our 24/7 emergency line immediately or visit the nearest MediCare emergency department without an appointment.",
    },
    {
        q: "Can I request a specific doctor?",
        a: "Absolutely. Select your preferred doctor while booking, and we'll do our best to accommodate the request.",
    },
];


function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);


    return (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between text-left"
            >
                <span className="text-sm font-semibold text-slate-900">{q}</span>
                <ChevronDown
                    size={16}
                    className={`flex-shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""
                        }`}
                />
            </button>
            {open && (
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{a}</p>
            )}
        </div>
    );
}

const Contactpage = () => {

    const [submitted, setSubmitted] = useState(false);



    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#f8fbfe] ">


            {/* Hero */}
            <section className="bg-[#f8fbfe] ">
                <div className='max-w-7xl mx-auto px-4 pt-26 sm:px-6 lg:px-9'>
                    <p className="mb-4 flex items-center gap-1 text-xs text-[#4A5568]">
                        Home <span>›</span> <span className="text-[#4A5568]">Contact</span>
                    </p>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-[#0A1931] sm:text-4xl">
                            Get in <span className="text-[#0066FE]">Touch</span>
                        </h1>
                        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#0A1931]">
                            Have a question, need to book an appointment, or want to learn
                            more about our services? Our team is here to help.
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {contactInfo.map(({ icon: Icon, title, lines }) => (
                            <div
                                key={title}
                                className="rounded-xl bg-white p-5 text-center shadow-sm shadow-slate-900/5"
                            >
                                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-[#0066FE]">
                                    <Icon size={18} />
                                </span>
                                <h3 className="mt-3 text-sm font-semibold text-[#0A1931]">
                                    {title}
                                </h3>
                                {lines.map((line) => (
                                    <p key={line} className="mt-0.5 text-xs text-[#4A5568]">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

            </section>

            {/* Form + Map */}
            <section className="max-w-7xl mx-auto px-4 pt-26 sm:px-6 lg:px-9">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                    {/* Form */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#0066FE]">
                            Send a Message
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-[#0A1931] sm:text-3xl">
                            We'd Love to <span className="text-[#0066FE]">Hear From You</span>
                        </h2>
                        <p className="mt-2 text-sm text-[#4A5568]">
                            Fill out the form and our team will get back to you within one
                            business day.
                        </p>

                        {submitted ? (
                            <div className="mt-6 rounded-xl bg-[#f0f8fe] p-6 text-sm text-[#0A1931]">
                                Thanks for reaching out — your message has been received.
                                Our team will contact you shortly.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-[#4A5568]">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Your name"
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-[#4A5568]">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+880 1XXX XXXXXX"
                                            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-[#4A5568]">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-[#4A5568]">
                                        Department
                                    </label>
                                    <select className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-[#4A5568] outline-none focus:border-blue-400">
                                        {departments.map((d) => (
                                            <option key={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-[#4A5568]">
                                        Message
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="How can we help you?"
                                        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-full bg-[#0066FE] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                                >
                                    <Send size={16} />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Map + quick info */}
                    <div className="flex flex-col gap-6">
                        <div className="h-64 w-full overflow-hidden rounded-2xl bg-[#f8fbfe] lg:h-full">
                            <img
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=900&auto=format&fit=crop"
                                alt="Map location"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="rounded-2xl bg-[#0066FE] p-6 text-white">
                            <h3 className="text-lg font-bold">Emergency? Call Now</h3>
                            <p className="mt-1 text-sm text-[#f8fbfe]">
                                Our emergency line is open 24/7 for urgent medical needs.
                            </p>
                            <a
                                href="tel:+8801711223344"
                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0066FE] hover:bg-sky-50 transition-colors"
                            >
                                <Phone size={15} />
                                +880 1711 223344
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-[#f0f8fe]  py-16 ">
                <div className='max-w-7xl mx-auto px-4 pt-26 sm:px-6 lg:px-9'>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#0066FE]">
                        FAQs
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-[#0A1931] sm:text-3xl">
                        Frequently Asked <span className="text-[#0066FE]">Questions</span>
                    </h2>

                    <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-2">
                        {faqs.map((faq) => (
                            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </div>

            </section>

            {/* CTA */}
            <section className=" max-w-7xl mx-auto pb-16 px-4 pt-12 sm:px-6 lg:px-9py-10 ">
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
                                Still Have Questions?
                            </p>
                            <h3 className="mt-1 text-2xl font-bold sm:text-3xl">
                                Our Team Is Ready to Help
                            </h3>
                            <p className="mt-2 max-w-md text-sm text-sky-100">
                                Book an appointment or reach out directly — we typically
                                respond within one business day.
                            </p>
                        </div>

                        <div className="flex md:flex-row flex-col flex-shrink-0 gap-3">
                            <button className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0066FE] hover:bg-sky-50 transition-colors">
                                <Calendar size={16} />
                                Book Appointment
                            </button>
                            <button className="flex items-center gap-2 rounded-full border border-white/60 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                                <ArrowRight size={16} />
                                Explore Services
                            </button>
                        </div>
                    </div>
                </div>
            </section>


        </div>

    )
}

export default Contactpage