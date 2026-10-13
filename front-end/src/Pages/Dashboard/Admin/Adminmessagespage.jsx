import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    Search,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MessageSquareText,
    MessagesSquare,
    CalendarDays,
    Clock,
    Eye,
    Loader2,
    FileIcon,
    Stethoscope,
    User,
} from "lucide-react";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundColor=0066fe&textColor=ffffff&seed=";

const ALL_DOCTORS = "All Doctors";
const FILTERS = ["All Conversations", "Awaiting Reply"];

const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
const fmtDay = (iso) => new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
const fmtList = (iso) => {
    const d = new Date(iso);
    return d.toDateString() === new Date().toDateString() ? fmtTime(iso) : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

function Avatar({ name, size = "h-10 w-10" }) {
    return <img src={`${DEFAULT_AVATAR}${encodeURIComponent(name || "User")}`} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />;
}

function Card({ children, className = "" }) {
    return (
        <section className={`rounded-2xl border border-blue-100/70 bg-white shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}>
            {children}
        </section>
    );
}

function StatCard({ label, value, note, icon: Icon, tint, card }) {
    return (
        <div className={`flex items-center gap-4 rounded-2xl border p-4 ${card}`}>
            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${tint}`}><Icon className="h-6 w-6" strokeWidth={1.75} /></span>
            <div>
                <p className="text-xs font-semibold text-[#0a1931]">{label}</p>
                <p className="text-3xl font-bold leading-tight text-[#0a1931]">{value}</p>
                <p className="text-xs text-[#4a5568]">{note}</p>
            </div>
        </div>
    );
}

function Attachment({ a }) {
    if (a.type?.startsWith("image/")) {
        return (
            <a href={a.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg">
                <img src={a.url} alt={a.name} className="max-h-48 w-full object-cover" />
            </a>
        );
    }
    return (
        <a href={a.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs text-blue-700 hover:bg-blue-50">
            <FileIcon size={16} /> <span className="truncate">{a.name}</span>
        </a>
    );
}

/* ---------------- thread (read-only) ---------------- */

function Thread({ conversation }) {
    const axiosSecure = useAxiosSecure();
    const endRef = useRef(null);

    const { data: messages, isLoading, isError } = useQuery({
        queryKey: ["admin-thread", conversation._id],
        queryFn: async () => (await axiosSecure.get(`/api/conversations/${conversation._id}/messages`)).data.messages,
        refetchInterval: 8000,
    });

    useEffect(() => {
        endRef.current?.scrollIntoView({ block: "end" });
    }, [messages?.length, conversation._id]);

   
    const items = [];
    let lastDay = "";
    (messages ?? []).forEach((m) => {
        const day = new Date(m.createdAt).toDateString();
        if (day !== lastDay) { items.push({ type: "day", label: fmtDay(m.createdAt), key: `d-${m._id}` }); lastDay = day; }
        items.push({ type: "msg", m, key: m._id });
    });

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-blue-50 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex -space-x-3">
                        <Avatar name={conversation.patientName} size="h-11 w-11 ring-2 ring-white" />
                        <Avatar name={conversation.doctorName} size="h-11 w-11 ring-2 ring-white" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="truncate text-base font-bold text-[#0a1931]">{conversation.patientName} <span className="font-normal text-[#4a5568]">↔</span> {conversation.doctorName}</h2>
                        <p className="text-xs text-[#4a5568]">{conversation.messageCount} messages · ID #{conversation._id.slice(-6)}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 px-5 py-2 text-xs text-amber-700">
                <Eye size={14} /> Admin view: read-only. You can't send messages from here.
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-white to-blue-50/30 px-5 py-4">
                {isLoading && <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-[#0066fe]" /></div>}
                {isError && <p className="py-10 text-center text-sm text-rose-500">Couldn't load this conversation.</p>}
                {!isLoading && !isError && items.length === 0 && <p className="py-10 text-center text-sm text-[#4a5568]">No messages in this conversation yet.</p>}

                {items.map((it) => {
                    if (it.type === "day") {
                        return <div key={it.key} className="flex justify-center"><span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] text-[#4a5568]">{it.label}</span></div>;
                    }
                    const m = it.m;
                    const doctor = m.senderRole === "doctor";
                    return (
                        <div key={it.key} className={`flex ${doctor ? "justify-end" : "justify-start"}`}>
                            <div className={`flex max-w-[78%] flex-col gap-1.5 ${doctor ? "items-end" : "items-start"}`}>
                                <p className="flex items-center gap-1 text-[11px] font-medium text-[#4a5568]">
                                    {doctor ? <Stethoscope size={11} /> : <User size={11} />}
                                    {doctor ? conversation.doctorName : conversation.patientName}
                                </p>
                                {m.attachments?.map((a, i) => <div key={i} className="max-w-[220px]"><Attachment a={a} /></div>)}
                                {m.text && (
                                    <div className={`whitespace-pre-line rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed text-[#0a1931] ${doctor ? "rounded-br-md border border-blue-200 bg-blue-100" : "rounded-bl-md border border-blue-100 bg-white"}`}>
                                        {m.text}
                                    </div>
                                )}
                                <p className="text-[11px] text-[#4a5568]">{fmtTime(m.createdAt)}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>
        </div>
    );
}

/* ---------------- page ---------------- */

export default function AdminMessagesPage() {
    const axiosSecure = useAxiosSecure();

    const [query, setQuery] = useState("");
    const [debounced, setDebounced] = useState("");
    const [doctor, setDoctor] = useState(ALL_DOCTORS);
    const [filter, setFilter] = useState(FILTERS[0]);
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [doctorList, setDoctorList] = useState([]);

    useEffect(() => {
        const t = setTimeout(() => { setDebounced(query.trim()); setPage(1); }, 350);
        return () => clearTimeout(t);
    }, [query]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-conversations", debounced, doctor, filter, page, doctorList.length],
        queryFn: async () => {
            const params = { page, limit: 15 };
            if (debounced) params.q = debounced;
            if (doctor !== ALL_DOCTORS) {
                const d = doctorList.find((x) => x.name === doctor);
                if (d) params.doctorId = d.id;
            }
            if (filter === "Awaiting Reply") params.filter = "awaiting";
            return (await axiosSecure.get("/api/conversations/admin/all", { params })).data;
        },
        keepPreviousData: true,
        refetchInterval: 15000,
    });

    useEffect(() => { if (data?.doctors?.length) setDoctorList(data.doctors); }, [data]);

    const conversations = data?.conversations ?? [];
    const selected = conversations.find((c) => c._id === selectedId) || null;

   
    useEffect(() => {
        if (conversations.length && !conversations.some((c) => c._id === selectedId)) setSelectedId(conversations[0]._id);
        if (!conversations.length) setSelectedId(null);
    }, [conversations]); // eslint-disable-line react-hooks/exhaustive-deps

    const s = data?.stats ?? { conversations: 0, messages: 0, todayMessages: 0, awaiting: 0 };
    const cards = [
        { label: "Conversations", value: s.conversations, note: "Patient–doctor chats", icon: MessagesSquare, tint: "bg-blue-100 text-[#0066fe]", card: "bg-blue-50/70 border-blue-100" },
        { label: "Total Messages", value: s.messages.toLocaleString(), note: "All time", icon: MessageSquareText, tint: "bg-emerald-100 text-emerald-600", card: "bg-emerald-50/70 border-emerald-100" },
        { label: "Today", value: s.todayMessages, note: "Messages sent today", icon: CalendarDays, tint: "bg-violet-100 text-violet-600", card: "bg-violet-50/70 border-violet-100" },
        { label: "Awaiting Reply", value: s.awaiting, note: "Doctor yet to respond", icon: Clock, tint: "bg-rose-100 text-rose-500", card: "bg-rose-50/70 border-rose-100" },
    ];

    const field = "h-10 w-full appearance-none rounded-lg border border-blue-100 bg-white pl-3 pr-8 text-sm text-[#0a1931] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200";

    return (
        <div className="min-h-screen p-4 font-sans text-[#0a1931] sm:p-6">
            <div className="mx-auto max-w-[1440px] space-y-5">
                <header>
                    <h1 className="text-3xl font-bold text-[#0a1931]">All Messages</h1>
                    <p className="mt-1 text-sm text-[#4a5568]">Monitor every patient–doctor conversation in the system. Read-only.</p>
                </header>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((c) => <StatCard key={c.label} {...c} />)}
                </div>

                <Card className="overflow-hidden">
                    <div className="grid md:h-[calc(100vh-19rem)] md:min-h-[600px] md:grid-cols-[360px_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
                        {/* list */}
                        <div className="flex min-h-0 flex-col border-b border-blue-50 md:border-b-0 md:border-r">
                            <div className="space-y-2 p-3">
                                <label className="relative block">
                                    <span className="sr-only">Search conversations</span>
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a5568]" />
                                    <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patient or doctor..." className={`${field} pl-9`} />
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <select aria-label="Doctor" value={doctor} onChange={(e) => { setDoctor(e.target.value); setPage(1); }} className={field}>
                                            <option>{ALL_DOCTORS}</option>
                                            {doctorList.map((d) => <option key={d.id}>{d.name}</option>)}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a5568]" />
                                    </div>
                                    <div className="relative">
                                        <select aria-label="Filter" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} className={field}>
                                            {FILTERS.map((f) => <option key={f}>{f}</option>)}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4a5568]" />
                                    </div>
                                </div>
                            </div>

                            <ul className="min-h-0 max-h-80 flex-1 overflow-y-auto md:max-h-none">
                                {isLoading && <li className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-[#0066fe]" /></li>}
                                {isError && <li className="px-4 py-10 text-center text-xs text-rose-500">Couldn't load conversations.</li>}

                                {conversations.map((c) => {
                                    const active = c._id === selectedId;
                                    return (
                                        <li key={c._id}>
                                            <button type="button" onClick={() => setSelectedId(c._id)} aria-current={active}
                                                className={`flex w-full items-start gap-3 border-l-[3px] px-3 py-3 text-left transition ${active ? "border-[#0066fe] bg-blue-50" : "border-transparent hover:bg-blue-50/50"}`}>
                                                <Avatar name={c.patientName} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="truncate text-sm font-semibold text-[#0a1931]">{c.patientName}</p>
                                                        <span className="shrink-0 text-[11px] text-[#4a5568]">{fmtList(c.lastMessageAt)}</span>
                                                    </div>
                                                    <p className="flex items-center gap-1 text-[11px] text-[#4a5568]"><Stethoscope size={10} /> {c.doctorName}</p>
                                                    <p className="mt-0.5 line-clamp-1 text-xs text-[#4a5568]">{c.lastMessageText || "No messages yet"}</p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="text-[10px] text-[#4a5568]">{c.messageCount} msgs</span>
                                                        {c.lastSenderRole === "patient" && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-500">Awaiting reply</span>}
                                                    </div>
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}

                                {!isLoading && !isError && conversations.length === 0 && (
                                    <li className="px-4 py-10 text-center text-xs text-[#4a5568]">No conversations match these filters.</li>
                                )}
                            </ul>

                            {(data?.totalPages ?? 1) > 1 && (
                                <div className="flex items-center justify-between border-t border-blue-50 px-3 py-2 text-xs text-[#4a5568]">
                                    <span>Page {page} of {data.totalPages}</span>
                                    <div className="flex gap-1">
                                        <button disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page" className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 disabled:opacity-40"><ChevronLeft size={14} /></button>
                                        <button disabled={page === data.totalPages} onClick={() => setPage(page + 1)} aria-label="Next page" className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 disabled:opacity-40"><ChevronRight size={14} /></button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* thread */}
                        <div className="flex h-[620px] min-h-0 flex-col md:h-auto">
                            {selected ? <Thread conversation={selected} /> : (
                                <div className="grid flex-1 place-items-center text-sm text-[#4a5568]">Select a conversation to view it.</div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}