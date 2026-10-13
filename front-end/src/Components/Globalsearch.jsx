import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, Stethoscope, LayoutGrid, User, Loader2 } from "lucide-react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import { getNavItems } from "./navItems";

const AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&seed=";

/*
    Search returns three types of results:
    - Pages: sidebar items filtered by role
    - Doctors: API results available to everyone
    - Patients: only the current doctor's patients
    Keyboard: Up, Down, Enter, and Escape
*/
export default function GlobalSearch({ autoFocus = false, onNavigate, className = "", inputClassName = "" }) {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const { user } = useAuth();
    const role = user?.role;

    const [query, setQuery] = useState("");
    const [debounced, setDebounced] = useState("");
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const boxRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setDebounced(query.trim()), 300);
        return () => clearTimeout(t);
    }, [query]);

    // Close when the user clicks outside.
    useEffect(() => {
        const onDown = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    const q = query.trim().toLowerCase();

    const pages = useMemo(
        () => (q ? getNavItems(role).filter((i) => i.label.toLowerCase().includes(q)) : []),
        [q, role]
    );

    const doctorsQuery = useQuery({
        queryKey: ["global-search-doctors", debounced],
        queryFn: async () => (await axiosSecure.get("/api/doctors", { params: { search: debounced, limit: 5, page: 1 } })).data.doctors ?? [],
        enabled: debounced.length >= 2,
        staleTime: 60_000,
    });

    const patientsQuery = useQuery({
        queryKey: ["doctor-patients"], // Same query key as PatientsPage.
        queryFn: async () => (await axiosSecure.get("/api/patients/mine")).data,
        enabled: role === "doctor" && open && q.length >= 1,
        staleTime: 60_000,
    });

    const sections = useMemo(() => {
        const out = [];
        if (pages.length) {
            out.push({ title: "Pages", icon: LayoutGrid, items: pages.map((p) => ({ key: `p-${p.to}`, label: p.label, sub: "Go to page", to: p.to, img: null })) });
        }
        const docs = debounced.length >= 2 ? doctorsQuery.data ?? [] : [];
        if (docs.length) {
            out.push({
                title: "Doctors",
                icon: Stethoscope,
                items: docs.map((d) => {
                    const name = `Dr. ${d.first_name} ${d.last_name}`;
                    return { key: `d-${d._id}`, label: name, sub: d.designation || d.department || "Specialist", to: `/doctors/${d._id}`, img: d.photoUrl || `${AVATAR}${encodeURIComponent(name)}` };
                }),
            });
        }
        const pats = (patientsQuery.data?.patients ?? []).filter((p) => p.name?.toLowerCase().includes(q)).slice(0, 5);
        if (role === "doctor" && pats.length) {
            out.push({
                title: "My Patients",
                icon: User,
                items: pats.map((p) => ({ key: `u-${p._id}`, label: p.name, sub: p.email || "Patient", to: "/dashboard/patients", img: `${AVATAR}${encodeURIComponent(p.name)}` })),
            });
        }
        return out;
    }, [pages, doctorsQuery.data, patientsQuery.data, debounced, q, role]);

    const flat = sections.flatMap((s) => s.items);
    useEffect(() => setActive(0), [query, flat.length]);

    const loading = (debounced.length >= 2 && doctorsQuery.isFetching) || (role === "doctor" && patientsQuery.isFetching);
    const go = (item) => {
        if (!item) return;
        navigate(item.to);
        setQuery("");
        setOpen(false);
        onNavigate?.();
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, flat.length - 1)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
        else if (e.key === "Enter") { e.preventDefault(); go(flat[active] ?? flat[0]); }
        else if (e.key === "Escape") { setOpen(false); e.currentTarget.blur(); }
    };

    const showPanel = open && q.length > 0;
    let index = -1;

    return (
        <div ref={boxRef} className={`relative ${className}`}>
            <Search size={19} strokeWidth={1.8} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#56739C]" />
            <input
                type="text"
                role="combobox"
                aria-expanded={showPanel}
                aria-label="Search"
                autoFocus={autoFocus}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                placeholder="Search doctors, pages, patients..."
                className={`h-[41px] w-full rounded-[10px] border border-[#DCE7F3] bg-[#f8fbfe] pl-12 pr-10 text-[13px] text-[#344E73] outline-none placeholder:text-[#7187A5] focus:border-[#8ABCF5] focus:ring-2 focus:ring-[#1473EA]/10 ${inputClassName}`}
            />
            {loading && <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-[#56739C]" />}

            {showPanel && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-[#E8F0F7] bg-white p-2 shadow-xl">
                    {sections.length === 0 && !loading && (
                        <p className="px-3 py-6 text-center text-[13px] text-[#7187A5]">
                            {q.length < 2 ? "Keep typing…" : `No results for “${query.trim()}”`}
                        </p>
                    )}

                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div key={section.title} className="mb-1">
                                <p className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-[#7187A5]">
                                    <Icon size={12} /> {section.title}
                                </p>
                                {section.items.map((item) => {
                                    index += 1;
                                    const i = index;
                                    return (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onMouseEnter={() => setActive(i)}
                                            onClick={() => go(item)}
                                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${i === active ? "bg-[#EAF4FF]" : "hover:bg-[#F5F9FD]"}`}
                                        >
                                            {item.img ? (
                                                <img src={item.img} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                                            ) : (
                                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EAF4FF] text-[#0878F9]"><LayoutGrid size={14} /></span>
                                            )}
                                            <span className="min-w-0">
                                                <span className="block truncate text-[13px] font-medium text-[#0A2B63]">{item.label}</span>
                                                <span className="block truncate text-[11px] text-[#7187A5]">{item.sub}</span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}