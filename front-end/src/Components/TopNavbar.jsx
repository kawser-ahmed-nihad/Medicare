import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Bell, CalendarDays, Menu, Plus, Search, UserPlus, X } from "lucide-react";
import useAuth from "../hooks/useAuth";
import useBadgeCounts from "../hooks/useBadgeCounts";
import GlobalSearch from "./GlobalSearch";
import MobileDrawer from "./MobileDrawer";
import { getNavItems, formatBadge } from "./navItems";

const CTA = {
    patient: { label: "Book Appointment", to: "/dashboard/book-appointment", icon: Plus },
    doctor: { label: "Today's Schedule", to: "/dashboard/doctors-appointment", icon: CalendarDays },
    admin: { label: "Add Doctor", to: "/dashboard/adddoctor", icon: UserPlus },
};

const BELL_LINK = { admin: "/dashboard/admin-notificationspage" };


const TopNavbar = ({ user: userProp, handleLogout }) => {
    const { user: ctxUser, logout } = useAuth();
    const user = userProp ?? ctxUser;
    const navigate = useNavigate();
    const location = useLocation();
    const badges = useBadgeCounts();

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false); // Mobile only.

    useEffect(() => {
        setMenuOpen(false);
        setSearchOpen(false);
    }, [location.pathname]);

    const role = user?.role;
    const items = getNavItems(role);
    const cta = CTA[role];
    const CtaIcon = cta?.icon;
    const bellCount = role === "admin" ? 0 : badges.notifications;

    const doLogout = async () => {
        setMenuOpen(false);
        if (handleLogout) return handleLogout();
        await logout?.();
        navigate("/login");
    };

    return (
        <>
            <header className="sticky top-0 z-50 flex h-[72px] items-center gap-3 border-b border-[#E8F0F7] bg-white px-4 sm:px-7">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-5">
                    <GlobalSearch className="hidden w-full max-w-[470px] sm:block" />

                    <button
                        type="button"
                        onClick={() => setSearchOpen(true)}
                        aria-label="Search"
                        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#173B70] transition hover:bg-[#F4F8FC] sm:hidden"
                    >
                        <Search size={20} strokeWidth={1.8} />
                    </button>

                    <div className="flex items-center gap-2 sm:ml-auto sm:gap-5">
                        {/* {cta && (
                            <Link
                                to={cta.to}
                                className="hidden items-center gap-2 rounded-[10px] bg-[#0878F9] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_4px_10px_rgba(8,120,249,0.18)] transition hover:bg-[#006BEA] md:inline-flex"
                            >
                                <CtaIcon size={16} /> {cta.label}
                            </Link>
                        )} */}

                        <Link
                            to={BELL_LINK[role] ?? "/dashboard/notifications"}
                            aria-label={bellCount ? `Notifications, ${bellCount} unread` : "Notifications"}
                            className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#173B70] transition hover:bg-[#F4F8FC]"
                        >
                            <Bell size={21} strokeWidth={1.7} />
                            {bellCount > 0 && (
                                <span className="absolute right-0 top-0 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#FF4962] px-1 text-[9px] font-semibold text-white">
                                    {formatBadge(bellCount)}
                                </span>
                            )}
                        </Link>

                        <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user?.name || "User"} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[#E7F2FF] text-[#0878F9]">
                                        <span className="text-[13px] font-semibold">{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                                    </div>
                                )}
                            </div>
                            <div className="hidden text-left leading-tight md:block">
                                <p className="max-w-[140px] truncate text-[12px] font-semibold text-[#0A2B63]">{user?.name}</p>
                                <p className="mt-0.5 text-[10px] capitalize text-[#7890B0]">{user?.role || "patient"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/80 text-[#1A73E8] transition-all duration-300 active:scale-90 lg:hidden"
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                {searchOpen && (
                    <div className="absolute inset-0 z-10 flex items-center gap-2 bg-white px-4 sm:hidden">
                        <GlobalSearch autoFocus className="w-full" onNavigate={() => setSearchOpen(false)} />
                        <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#173B70] hover:bg-[#F4F8FC]">
                            <X size={20} />
                        </button>
                    </div>
                )}
            </header>

            <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} items={items} badges={badges} user={user} onLogout={doLogout} />
        </>
    );
};

export default TopNavbar;