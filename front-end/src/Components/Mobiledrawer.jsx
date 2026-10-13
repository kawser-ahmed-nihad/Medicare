import React, { useEffect } from "react";
import { NavLink } from "react-router";
import { LogOut } from "lucide-react";
import { formatBadge } from "./navItems";

/*
    Match the landing page navbar's mobile menu: a dropdown below the header with
    max-height and opacity transitions (500ms), rounded-xl items, and
    bg-[#EAF3FF] plus translate-x-1 when active. The filename remains unchanged
    to avoid updating imports.
*/
const HEADER_H = 72;

export default function MobileDrawer({ open, onClose, items, badges, user, onLogout }) {
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <div className="lg:hidden">
            {/* Close on outside click; keep the backdrop transparent like the landing page. */}
            {open && <div onClick={onClose} className="fixed inset-0 z-40" aria-hidden="true" />}

            <div
                aria-hidden={!open}
                style={{ top: HEADER_H }}
                className={`
          fixed left-0 right-0 z-50
          overflow-hidden border-t border-gray-100
          bg-white/95 backdrop-blur-xl
          transition-all duration-500 ease-in-out
          ${open ? "max-h-[calc(100vh-72px)] overflow-y-auto opacity-100 shadow-lg" : "pointer-events-none max-h-0 opacity-0"}
        `}
            >
                <div className="px-5 py-4">
                    <ul className="flex flex-col gap-1">
                        {items.map((item) => {
                            const Icon = item.icon;
                            const count = item.badgeKey ? badges[item.badgeKey] : 0;
                            return (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        end={item.end}
                                        onClick={onClose}
                                        className={({ isActive }) => `
                      flex items-center gap-3 rounded-xl px-4 py-3
                      font-semibold transition-all duration-300
                      ${isActive ? "translate-x-1 bg-[#EAF3FF] text-[#1A73E8]" : "text-[#4A5568] hover:bg-gray-50 hover:text-[#1A73E8]"}
                    `}
                                    >
                                        <Icon size={19} strokeWidth={1.8} className="shrink-0" />
                                        <span className="flex-1">{item.label}</span>
                                        {count > 0 && (
                                            <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FF4962] px-1 text-[10px] font-semibold text-white">
                                                {formatBadge(count)}
                                            </span>
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>

                    {/* User and logout controls, as in the landing page's action row. */}
                    <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full border-2 border-[#1A73E8] object-cover" />
                            ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A73E8] text-lg font-bold uppercase text-white shadow">
                                    {user?.name?.charAt(0) || "U"}
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#0A2B63]">{user?.name}</p>
                                <p className="text-xs capitalize text-[#7890B0]">{user?.role || "patient"}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onLogout}
                            title="Logout"
                            className="flex cursor-pointer items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}