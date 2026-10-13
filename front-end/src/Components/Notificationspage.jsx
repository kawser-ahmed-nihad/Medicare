import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
    Check,
    Calendar,
    MessageCircle,
    Pill,
    Bell,
    Settings,
    ChevronRight,
    SlidersHorizontal,
    Sprout,
    Loader2,
} from "lucide-react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useSocket from "../hooks/useSocket";
import useAuth from "../hooks/useAuth";

const typeMeta = {
    appointment: { icon: Calendar, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", label: "Appointments" },
    message: { icon: MessageCircle, iconBg: "bg-sky-100", iconColor: "text-blue-600", label: "Messages" },
    prescription: { icon: Pill, iconBg: "bg-purple-100", iconColor: "text-purple-600", label: "Prescriptions" },
    system: { icon: Settings, iconBg: "bg-slate-100", iconColor: "text-slate-500", label: "System" },
};

const FILTERS = ["All", "appointment", "message", "prescription", "system"];
const PAGE_SIZE = 8;

function timeAgo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function NotificationsPage() {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const socket = useSocket();
    const { user } = useAuth();

    const [activeFilter, setActiveFilter] = useState("All");
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["my-notifications"],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/notifications/mine");
            return res.data.notifications;
        },
        enabled: Boolean(user),
    });


    // console.log(data)

    const notifications = data ?? [];

    // socket.io
    useEffect(() => {
        if (!socket) return;
        function handleNewNotification(notification) {
            queryClient.setQueryData(["my-notifications"], (old) => (old ? [notification, ...old] : [notification]));
        }
        socket.on("new_notification", handleNewNotification);
        return () => socket.off("new_notification", handleNewNotification);
    }, [socket, queryClient]);

    const counts = useMemo(() => {
        const c = { All: notifications.length };
        FILTERS.slice(1).forEach((t) => { c[t] = notifications.filter((n) => n.type === t).length; });
        return c;
    }, [notifications]);

    const filtered = activeFilter === "All" ? notifications : notifications.filter((n) => n.type === activeFilter);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const unreadCount = notifications.filter((n) => !n.read).length;

    const markOneRead = async (id) => {
        queryClient.setQueryData(["my-notifications"], (old) => old?.map((n) => (n._id === id ? { ...n, read: true } : n)));
        try {
            await axiosSecure.patch(`/api/notifications/${id}/read`);
        } catch (err) {
            console.error("Failed to mark as read:", err.message);
        }
    };

    const markAllRead = async () => {
        queryClient.setQueryData(["my-notifications"], (old) => old?.map((n) => ({ ...n, read: true })));
        try {
            await axiosSecure.patch("/api/notifications/read-all");
        } catch (err) {
            console.error("Failed to mark all as read:", err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-10">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0A1931]">Notifications</h1>
                        <p className="mt-1 text-sm text-[#4A5568]">
                            Stay updated with your appointments, prescriptions, and important health information.
                        </p>
                    </div>

                    <button
                        onClick={markAllRead}
                        disabled={unreadCount === 0}
                        className="flex flex-shrink-0 items-center gap-2 self-start rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#4A5568] hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-40"
                    >
                        <Check size={15} />
                        Mark all as read
                    </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
                    {/* Main column */}
                    <div>
                        {/* Filter tabs */}
                        <div className="flex flex-wrap gap-2">
                            {FILTERS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => { setActiveFilter(f); setPage(1); }}
                                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeFilter === f ? "bg-[#0066FE] text-white" : "bg-white text-[#4A5568] shadow-sm shadow-slate-900/5 hover:bg-slate-50"
                                        }`}
                                >
                                    {f === "All" ? "All" : typeMeta[f].label}
                                    <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold ${activeFilter === f ? "bg-white/20 text-white" : "bg-slate-100 text-[#4A5568]"
                                        }`}>
                                        {counts[f] ?? 0}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Notifications list */}
                        <div className="mt-4 rounded-2xl bg-white px-4 shadow-sm shadow-slate-900/5">
                            {isLoading && <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-blue-600" /></div>}
                            {isError && <p className="py-6 text-center text-sm text-rose-500">Couldn't load notifications. Please try again.</p>}
                            {!isLoading && !isError && paginated.length === 0 && (
                                <p className="py-10 text-center text-sm text-[#4A5568]">No notifications here.</p>
                            )}

                            {paginated.map((n) => {
                                const meta = typeMeta[n.type] || typeMeta.system;
                                const Icon = meta.icon;
                                const Wrapper = n.link ? Link : "button";
                                const wrapperProps = n.link ? { to: n.link } : { type: "button" };

                                return (
                                    <Wrapper
                                        key={n._id}
                                        {...wrapperProps}
                                        onClick={() => !n.read && markOneRead(n._id)}
                                        className="flex w-full items-center gap-4 border-b border-slate-100 py-4 text-left last:border-0 hover:bg-slate-50/60 transition-colors"
                                    >
                                        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${meta.iconBg} ${meta.iconColor}`}>
                                            <Icon size={17} />
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-[#0A1931]">{n.title}</p>
                                            <p className="mt-0.5 truncate text-xs text-[#4A5568]">{n.description}</p>
                                        </div>

                                        <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
                                            <span className="text-xs text-[#4A5568]">{timeAgo(n.createdAt)}</span>
                                            {!n.read && <span className="h-2 w-2 rounded-full bg-[#0066FE]" />}
                                        </div>

                                        <ChevronRight size={16} className="flex-shrink-0 text-[#4A5568]" />
                                    </Wrapper>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {filtered.length > 0 && (
                            <div className="mt-4 flex items-center justify-between px-1">
                                <p className="text-xs text-[#4A5568]">
                                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} notifications
                                </p>
                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const p = i + 1;
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-[#0066FE] text-white" : "text-[#4A5568] hover:bg-slate-50"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-6">
                        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-900/5">
                            <h3 className="flex items-center gap-2 font-bold text-[#0A1931]">
                                <SlidersHorizontal size={15} className="text-[#0066FE]" />
                                Filter Notifications
                            </h3>
                            <div className="mt-4 space-y-3">
                                {FILTERS.map((f) => (
                                    <label key={f} className="flex cursor-pointer items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-[#4A5568]">
                                            <input
                                                type="checkbox"
                                                checked={activeFilter === f || activeFilter === "All"}
                                                onChange={() => { setActiveFilter(f); setPage(1); }}
                                                className="h-4 w-4 rounded border-slate-300 text-[#0066FE] focus:ring-[#0066FE]"
                                            />
                                            {f === "All" ? "All Notifications" : typeMeta[f].label}
                                        </span>
                                        <span className="text-xs text-[#4A5568]">{counts[f] ?? 0}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white p-6 text-center shadow-sm shadow-slate-900/5">
                            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-50">
                                <Bell size={26} className="text-[#0066FE]" />
                                {unreadCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <p className="mt-3 text-sm font-semibold text-[#0A1931]">
                                You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                            </p>
                            <p className="mt-1 text-xs text-[#4A5568]">Keep up to date with your health and appointments.</p>
                        </div>

                        <div className="rounded-2xl bg-emerald-50 p-5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
                                <Sprout size={17} />
                            </span>
                            <p className="mt-3 text-sm font-semibold text-[#0A1931]">Your health matters</p>
                            <p className="mt-1 text-xs text-[#4A5568]">Stay informed, stay healthy!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}