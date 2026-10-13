import React, { useEffect, useRef, useState } from 'react'

import {
    Search,
    ChevronDown,
    Users,
    Star,
    ShieldCheck,
    Clock,
    Heart,
    Eye,
    MapPin,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const stats = [
    { icon: Users, value: "50+", label: "Qualified Doctors" },
    { icon: Star, value: "15+", label: "Specializations" },
    { icon: ShieldCheck, value: "98%", label: "Patient Satisfaction" },
    { icon: Clock, value: "24/7", label: "Support" },
];

const ALL_DEPARTMENTS = [
    "Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics",
    "Gynecology", "General Medicine", "ENT", "Urology", "Others",
];

const LOCATIONS = ["Dhaka", "Mymensingh", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur"];

const experienceOptions = [
    { label: "Less than 5 years", params: { maxExperience: 4 } },
    { label: "5 - 10 years", params: { minExperience: 5, maxExperience: 10 } },
    { label: "More than 10 years", params: { minExperience: 11 } },
];

const ratingOptions = [
    { label: "4.5 & above", value: 4.5 },
    { label: "4.0 & above", value: 4.0 },
    { label: "3.5 & above", value: 3.5 },
    { label: "3.0 & above", value: 3.0 },
];

const feeOptions = [
    { label: "Under ৳500", params: { maxFee: 499 } },
    { label: "৳500 – ৳1,000", params: { minFee: 500, maxFee: 1000 } },
    { label: "৳1,000 – ৳2,000", params: { minFee: 1000, maxFee: 2000 } },
    { label: "Above ৳2,000", params: { minFee: 2001 } },
];

const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "rating_desc", label: "Highest Rated" },
    { value: "experience_desc", label: "Most Experienced" },
    { value: "fee_asc", label: "Fee: Low to High" },
    { value: "fee_desc", label: "Fee: High to Low" },
    { value: "newest", label: "Newest" },
];

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&seed=";
const PAGE_SIZE = 9;

const initialFilters = {
    search: "",
    departments: [],
    gender: "",
    experienceLabel: "",
    ratingLabel: "",
    feeLabel: "",
    location: "",
    sortBy: "recommended",
};

/* ---------------- small pieces ---------------- */

function FilterSection({ title, children }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="border-b border-slate-100 py-5 first:pt-0">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between text-left"
                type="button"
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

function Checkbox({ label, checked, onChange }) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
            />
            {label}
        </label>
    );
}

// Generic dropdown for the Department, Location, and Sort filters in the search bar.
// Closes when the user clicks outside it.
function Dropdown({ label, valueLabel, widthClass = "lg:w-44", children }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function onClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    return (
        <div ref={ref} className={`relative ${widthClass}`}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-left text-sm text-[#4A5568]"
            >
                <span>
                    {label}
                    <br />
                    <span className="text-xs text-slate-400">{valueLabel}</span>
                </span>
                <ChevronDown size={14} className="flex-shrink-0" />
            </button>
            {open && (
                <div className="absolute left-0 z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                    {typeof children === "function" ? children(() => setOpen(false)) : children}
                </div>
            )}
        </div>
    );
}

function DoctorCard({ doctor }) {
    const fullName = `Dr. ${doctor.first_name} ${doctor.last_name}`;
    const role = doctor.designation || doctor.department;
    const experienceLabel = `${doctor.experience_years}+ years experience`;
    const feeLabel = doctor.follow_up_fee
        ? `৳${doctor.consultation_fee} (Follow-up ৳${doctor.follow_up_fee})`
        : `৳${doctor.consultation_fee}`;
    const isAvailable = doctor.status === "available";
    const image = doctor.photoUrl || `${DEFAULT_AVATAR}${encodeURIComponent(fullName)}`;

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-900/5">
            <div className="relative">
                <img
                    src={image}
                    alt={fullName}
                    className="h-40 w-full rounded-xl object-cover bg-slate-50"
                />
                {isAvailable && (
                    <span className="absolute right-2 top-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                        Available
                    </span>
                )}
                {doctor.status === "on_leave" && (
                    <span className="absolute right-2 top-2 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
                        On Leave
                    </span>
                )}
            </div>

            <div className="mt-3 flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        {fullName}
                    </h3>
                    <p className="text-xs font-medium text-blue-600">{role}</p>
                </div>
                <button aria-label="Save doctor" className="text-slate-300 hover:text-rose-500 transition-colors">
                    <Heart size={16} />
                </button>
            </div>

            <div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span className="font-medium text-slate-800">{(doctor.rating ?? 0).toFixed(1)}</span>
                <span className="text-slate-400">({doctor.reviewCount ?? 0} reviews)</span>
            </div>

            <div className="mt-2 space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {experienceLabel}
                </p>
                <p className="flex items-center gap-1.5">
                    <span className="text-[13px] leading-none">৳</span>
                    {feeLabel}
                </p>
                <p className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    {doctor.location}
                </p>
            </div>

            <div className="mt-4">
                <Link
                    to={`/doctors/${doctor._id}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[11px] font-semibold text-[#4A5568] hover:border-blue-400 hover:text-[#0066FE] transition-colors">
                    <Eye size={13} />
                    View Details
                </Link>
            </div>
        </div>
    );
}

function FilterChip({ label, onRemove }) {
    return (
        <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            {label}
            <button onClick={onRemove} aria-label={`Remove ${label} filter`}>
                <X size={12} />
            </button>
        </span>
    );
}

/* ---------------------------------- page ---------------------------------- */

const Doctorspage = () => {
    const axiosSecure = useAxiosSecure();

    const [searchInput, setSearchInput] = useState("");
    const [filters, setFilters] = useState(initialFilters);
    const [page, setPage] = useState(1);

    // helper: update one filter key, resetting to page 1
    const patchFilters = (patch) => {
        setFilters((prev) => ({ ...prev, ...patch }));
        setPage(1);
    };

    const toggleDepartment = (name) => {
        setFilters((prev) => {
            const has = prev.departments.includes(name);
            return {
                ...prev,
                departments: has
                    ? prev.departments.filter((d) => d !== name)
                    : [...prev.departments, name],
            };
        });
        setPage(1);
    };

    // exclusive single-select helper (click again to clear)
    const toggleExclusive = (key, value) => {
        patchFilters({ [key]: filters[key] === value ? "" : value });
    };

    const runSearch = () => patchFilters({ search: searchInput.trim() });

    const resetAll = () => {
        setSearchInput("");
        setFilters(initialFilters);
        setPage(1);
    };

    const activeFilterCount =
        filters.departments.length +
        (filters.gender ? 1 : 0) +
        (filters.experienceLabel ? 1 : 0) +
        (filters.ratingLabel ? 1 : 0) +
        (filters.feeLabel ? 1 : 0) +
        (filters.location ? 1 : 0) +
        (filters.search ? 1 : 0);

    // department counts for the sidebar labels — falls back to 0 while loading
    const { data: deptCountsData } = useQuery({
        queryKey: ["doctor-department-counts"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/doctors/meta/department-counts");
            return res.data.counts;
        },
        staleTime: 5 * 60 * 1000,
    });

    const departmentCounts = Object.fromEntries(
        (deptCountsData ?? []).map((d) => [d._id, d.count])
    );

    // build the query params object sent to the backend
    const buildQueryParams = () => {
        const experience = experienceOptions.find((o) => o.label === filters.experienceLabel)?.params;
        const rating = ratingOptions.find((o) => o.label === filters.ratingLabel)?.value;
        const fee = feeOptions.find((o) => o.label === filters.feeLabel)?.params;

        const params = {
            page,
            limit: PAGE_SIZE,
            sortBy: filters.sortBy,
        };
        if (filters.search) params.search = filters.search;
        if (filters.departments.length) params.department = filters.departments.join(",");
        if (filters.gender) params.gender = filters.gender;
        if (filters.location) params.location = filters.location;
        if (rating) params.minRating = rating;
        if (experience?.minExperience) params.minExperience = experience.minExperience;
        if (experience?.maxExperience) params.maxExperience = experience.maxExperience;
        if (fee?.minFee) params.minFee = fee.minFee;
        if (fee?.maxFee) params.maxFee = fee.maxFee;
        return params;
    };

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ["doctors", filters, page],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/doctors/`, { params: buildQueryParams() });
            return res.data; // { success, doctors, pagination }
        },
        keepPreviousData: true,
    });

    // console.log(data)

    const doctors = data?.doctors ?? [];
    const pagination = data?.pagination ?? { total: 0, page: 1, totalPages: 1, limit: PAGE_SIZE };
    const { total, totalPages } = pagination;
    const rangeStart = doctors.length ? (page - 1) * PAGE_SIZE + 1 : 0;
    const rangeEnd = rangeStart ? rangeStart + doctors.length - 1 : 0;

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
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                                placeholder="Search doctor by name, speciality, or keyword..."
                                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-blue-400"
                            />
                        </div>

                        <Dropdown
                            label="Department"
                            valueLabel={filters.departments.length ? `${filters.departments.length} selected` : "All Departments"}
                            widthClass="lg:w-48"
                        >
                            {() => (
                                <div className="max-h-64 space-y-2 overflow-y-auto">
                                    {ALL_DEPARTMENTS.map((name) => (
                                        <Checkbox
                                            key={name}
                                            label={`${name}${departmentCounts[name] ? ` (${departmentCounts[name]})` : ""}`}
                                            checked={filters.departments.includes(name)}
                                            onChange={() => toggleDepartment(name)}
                                        />
                                    ))}
                                </div>
                            )}
                        </Dropdown>

                        <Dropdown
                            label="Location"
                            valueLabel={filters.location || "All Locations"}
                            widthClass="lg:w-44"
                        >
                            {(close) => (
                                <div className="space-y-1">
                                    <button
                                        type="button"
                                        onClick={() => { patchFilters({ location: "" }); close(); }}
                                        className={`block w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50 ${!filters.location ? "text-blue-600 font-medium" : "text-slate-600"}`}
                                    >
                                        All Locations
                                    </button>
                                    {LOCATIONS.map((loc) => (
                                        <button
                                            key={loc}
                                            type="button"
                                            onClick={() => { patchFilters({ location: loc }); close(); }}
                                            className={`block w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50 ${filters.location === loc ? "text-blue-600 font-medium" : "text-slate-600"}`}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </Dropdown>

                        <Dropdown
                            label="Sort By"
                            valueLabel={sortOptions.find((o) => o.value === filters.sortBy)?.label}
                            widthClass="lg:w-44"
                        >
                            {(close) => (
                                <div className="space-y-1">
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => { patchFilters({ sortBy: opt.value }); close(); }}
                                            className={`block w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50 ${filters.sortBy === opt.value ? "text-blue-600 font-medium" : "text-slate-600"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </Dropdown>

                        <button
                            onClick={runSearch}
                            className="flex items-center justify-center gap-2 rounded-lg bg-[#0066FE] px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                            <Search size={15} />
                            Search
                        </button>
                    </div>

                    {activeFilterCount > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {filters.search && (
                                <FilterChip label={`"${filters.search}"`} onRemove={() => { setSearchInput(""); patchFilters({ search: "" }); }} />
                            )}
                            {filters.departments.map((d) => (
                                <FilterChip key={d} label={d} onRemove={() => toggleDepartment(d)} />
                            ))}
                            {filters.gender && (
                                <FilterChip label={filters.gender} onRemove={() => patchFilters({ gender: "" })} />
                            )}
                            {filters.location && (
                                <FilterChip label={filters.location} onRemove={() => patchFilters({ location: "" })} />
                            )}
                            {filters.experienceLabel && (
                                <FilterChip label={filters.experienceLabel} onRemove={() => patchFilters({ experienceLabel: "" })} />
                            )}
                            {filters.ratingLabel && (
                                <FilterChip label={filters.ratingLabel} onRemove={() => patchFilters({ ratingLabel: "" })} />
                            )}
                            {filters.feeLabel && (
                                <FilterChip label={filters.feeLabel} onRemove={() => patchFilters({ feeLabel: "" })} />
                            )}
                            <button onClick={resetAll} className="text-xs font-medium text-blue-600 hover:underline">
                                Clear all
                            </button>
                        </div>
                    )}
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
                                <button onClick={resetAll} className="text-xs font-medium text-[#0066FE] hover:underline">
                                    Clear All
                                </button>
                            </div>

                            <FilterSection title="Department">
                                {ALL_DEPARTMENTS.map((name) => (
                                    <Checkbox
                                        key={name}
                                        label={`${name}${departmentCounts[name] ? ` (${departmentCounts[name]})` : ""}`}
                                        checked={filters.departments.includes(name)}
                                        onChange={() => toggleDepartment(name)}
                                    />
                                ))}
                            </FilterSection>

                            <FilterSection title="Gender">
                                <Checkbox label="Male" checked={filters.gender === "male"} onChange={() => toggleExclusive("gender", "male")} />
                                <Checkbox label="Female" checked={filters.gender === "female"} onChange={() => toggleExclusive("gender", "female")} />
                                <Checkbox label="Any" checked={!filters.gender} onChange={() => patchFilters({ gender: "" })} />
                            </FilterSection>

                            <FilterSection title="Experience">
                                {experienceOptions.map((opt) => (
                                    <Checkbox
                                        key={opt.label}
                                        label={opt.label}
                                        checked={filters.experienceLabel === opt.label}
                                        onChange={() => toggleExclusive("experienceLabel", opt.label)}
                                    />
                                ))}
                            </FilterSection>

                            <FilterSection title="Rating">
                                {ratingOptions.map((opt) => (
                                    <label
                                        key={opt.label}
                                        className="flex cursor-pointer items-center gap-2 text-sm text-[#4A5568]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.ratingLabel === opt.label}
                                            onChange={() => toggleExclusive("ratingLabel", opt.label)}
                                            className="h-4 w-4 rounded border-slate-300 text-[#0066FE] focus:ring-blue-400"
                                        />
                                        <span className="flex items-center gap-0.5 text-amber-400">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <Star key={i} size={11} fill="currentColor" stroke="none" />
                                            ))}
                                            <Star size={11} className="text-slate-200" fill="currentColor" stroke="none" />
                                        </span>
                                        {opt.label}
                                    </label>
                                ))}
                            </FilterSection>

                            <FilterSection title="Consultation Fee">
                                {feeOptions.map((opt) => (
                                    <Checkbox
                                        key={opt.label}
                                        label={opt.label}
                                        checked={filters.feeLabel === opt.label}
                                        onChange={() => toggleExclusive("feeLabel", opt.label)}
                                    />
                                ))}
                            </FilterSection>

                            <button
                                onClick={resetAll}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-[#4A5568] hover:border-blue-400 hover:text-[#0066FE] transition-colors">
                                <RefreshCw size={14} />
                                Reset Filters
                            </button>
                        </aside>

                        {/* Doctor grid */}
                        <div className="flex-1">
                            <p className="mb-4 text-sm text-[#4A5568]">
                                {isLoading
                                    ? "Loading doctors…"
                                    : `Showing ${rangeStart} – ${rangeEnd} of ${total} doctors`}
                                {isFetching && !isLoading && <span className="ml-2 text-xs text-slate-400">Updating…</span>}
                            </p>

                            {isError && (
                                <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                                    Failed to load doctors. Please try again.
                                </p>
                            )}

                            {!isLoading && !isError && doctors.length === 0 && (
                                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                                    <p>No doctors match your filters.</p>
                                    <button onClick={resetAll} className="mt-2 text-blue-600 hover:underline">
                                        Clear filters
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {doctors.map((doctor) => (
                                    <DoctorCard key={doctor._id} doctor={doctor} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
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
                                                    : "text-[#4A5568] hover:bg-blue-50 hover:text-[#0066FE]"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-[#4A5568] disabled:opacity-40 hover:border-blue-400 hover:text-[#0066FE] transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Doctorspage