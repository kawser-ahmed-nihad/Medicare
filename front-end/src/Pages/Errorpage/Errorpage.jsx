import React from 'react'

import {

    Search,
    Calendar,
    Home,
    ArrowLeft,
    Stethoscope,
    Phone,
    Mail,
    MapPin,
    Clock,
    HeartPulse,

} from "lucide-react";
import { Link } from 'react-router';

const helpfulLinks = [
    { label: "Go to Homepage", icon: Home },
    { label: "Browse Services", icon: Stethoscope },
    { label: "Contact Support", icon: Phone },
];


const Errorpage = () => {
    return (
        <div className="flex min-h-screen flex-col bg-white">

            <main className="flex flex-1 items-center justify-center px-6 py-16 md:px-16">
                <div className="mx-auto max-w-xl text-center">
                    {/* Illustration */}
                    <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center">
                        <svg
                            className="absolute inset-0 h-full w-full text-sky-100"
                            viewBox="0 0 200 200"
                            fill="none"
                        >
                            <circle cx="100" cy="100" r="90" fill="currentColor" />
                        </svg>
                        <svg
                            className="absolute h-24 w-40 text-blue-200"
                            viewBox="0 0 200 60"
                            fill="none"
                        >
                            <path
                                d="M0 30 H50 L60 10 L75 50 L90 30 H200"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                        </svg>
                        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg shadow-slate-900/10">
                            <HeartPulse size={28} />
                        </span>
                    </div>

                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        Error 404
                    </p>
                    <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">
                        Page Not Found
                    </h1>
                    <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-500">
                        The page you're looking for may have been moved, renamed, or is
                        temporarily unavailable. Let's get you back to where you can find
                        the care you need.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link to='/' className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                            <Home size={16} />
                            Back to Homepage
                        </Link>
                        <Link to='/' className="flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                            <ArrowLeft size={16} />
                            Go Back
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {helpfulLinks.map(({ label, icon: Icon }) => (
                            <a
                                key={label}
                                href="/"
                                className="flex items-center justify-center gap-2 rounded-xl bg-sky-50 px-4 py-4 text-sm font-medium text-slate-700 hover:bg-sky-100 transition-colors"
                            >
                                <Icon size={16} className="text-blue-600" />
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </main>

        </div>
    )
}

export default Errorpage