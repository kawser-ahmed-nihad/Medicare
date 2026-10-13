import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useSocket from "../../../hooks/useSocket";
import {
    Search,
    ChevronDown,
    Phone,
    Video,
    MoreHorizontal,
    Paperclip,
    Send,
    CheckCheck,
    ArrowRight,
    CalendarDays,
    FileText,
    FileSignature,
    PenSquare,
    Loader2,
    FileIcon,
    X,
    Stethoscope,
} from "lucide-react";



const messageFilters = ["All Messages", "Unread"];

const AVATAR_TONES = [
    "from-sky-400 to-blue-500",
    "from-teal-400 to-emerald-500",
    "from-indigo-400 to-violet-500",
    "from-rose-400 to-pink-500",
    "from-amber-400 to-orange-500",
];

function Avatar({ name, size = "h-11 w-11", text = "text-sm" }) {
    const safeName = name || "User";
    const initials = safeName.replace(/^Dr\.\s*/, "").split(" ").map((n) => n[0]).slice(0, 2).join("");
    const tone = AVATAR_TONES[safeName.length % AVATAR_TONES.length];
    return (
        <div className={`relative shrink-0 ${size}`}>
            <div className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${tone} ${text} font-semibold text-white`}>
                {initials}
            </div>
        </div>
    );
}

function Card({ children, className = "" }) {
    return (
        <section className={`rounded-2xl border border-blue-100/70 bg-white shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}>
            {children}
        </section>
    );
}

function formatTime(iso) {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function formatListTime(iso) {
    const d = new Date(iso);
    const isToday = d.toDateString() === new Date().toDateString();
    return isToday ? formatTime(iso) : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ---------------- conversation list ---------------- */

function ConversationList({ conversations, activeId, onSelect, isLoading, nameField, emptyText }) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState(messageFilters[0]);

    const visible = conversations.filter((c) => {
        if (query.trim() && !c[nameField]?.toLowerCase().includes(query.trim().toLowerCase())) return false;
        if (filter === "Unread" && !c.hasUnread) return false;
        return true;
    });

    return (
        <div className="flex min-h-0 flex-col border-b border-blue-50 md:border-b-0 md:border-r">
            <div className="flex items-center gap-2 p-3">
                <label className="relative min-w-0 flex-1">
                    <span className="sr-only">Search</span>
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5568]" />
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."
                        className="h-10 w-full rounded-lg border border-blue-100 bg-white pl-8 pr-2 text-xs text-[#0A1931] placeholder:text-[#4A5568] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </label>
                <div className="relative w-[112px] shrink-0">
                    <select
                        aria-label="Filter messages"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="h-10 w-full appearance-none rounded-lg border border-blue-100 bg-white pl-2.5 pr-7 text-xs text-[#0A1931] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        {messageFilters.map((f) => <option key={f}>{f}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5568]" />
                </div>
            </div>

            <ul className="min-h-0 max-h-72 flex-1 overflow-y-auto md:max-h-none">
                {isLoading && <li className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-[#0066FE]" /></li>}

                {!isLoading && visible.map((c) => {
                    const active = c._id === activeId;
                    return (
                        <li key={c._id}>
                            <button
                                type="button"
                                onClick={() => onSelect(c._id)}
                                aria-current={active}
                                className={`flex w-full items-start gap-3 border-l-[3px] px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400 ${active ? "border-blue-600 bg-blue-50" : "border-transparent hover:bg-blue-50/50"
                                    }`}
                            >
                                <Avatar name={c[nameField]} />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate text-sm font-semibold text-[#0A1931]">{c[nameField]}</p>
                                        <span className="shrink-0 text-[11px] text-[#4A5568]">{formatListTime(c.lastMessageAt)}</span>
                                    </div>
                                    <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-[#4A5568]">
                                        {c.lastMessageText || "No messages yet"}
                                    </p>
                                </div>
                            </button>
                        </li>
                    );
                })}

                {!isLoading && visible.length === 0 && (
                    <li className="px-4 py-10 text-center text-xs text-[#4A5568]">{emptyText}</li>
                )}
            </ul>
        </div>
    );
}

/* ---------------- attachment preview ---------------- */

function AttachmentPreview({ attachment }) {
    const isImage = attachment.type?.startsWith("image/");
    if (isImage) {
        return (
            <a href={attachment.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg">
                <img src={attachment.url} alt={attachment.name} className="max-h-48 w-full object-cover" />
            </a>
        );
    }
    return (
        <a href={attachment.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs text-blue-700 hover:bg-blue-50">
            <FileIcon size={16} />
            <span className="truncate">{attachment.name}</span>
        </a>
    );
}

/* ---------------- chat panel ---------------- */

function MessageBubble({ message, myRole, otherName }) {
    const mine = message.senderRole === myRole;
    return (
        <div className={`flex items-end gap-3 ${mine ? "justify-end" : "justify-start"}`}>
            {!mine && <Avatar name={otherName} size="h-9 w-9" text="text-xs" />}
            <div className={`flex max-w-[78%] flex-col gap-1.5 ${mine ? "items-end" : "items-start"}`}>
                {message.attachments?.map((att, i) => (
                    <div key={i} className="max-w-[220px]"><AttachmentPreview attachment={att} /></div>
                ))}
                {message.text && (
                    <div className={`whitespace-pre-line rounded-2xl px-4 py-3 text-[13px] leading-relaxed text-[#0A1931] ${mine ? "rounded-br-md border border-blue-200 bg-blue-100" : "rounded-bl-md border border-blue-100 bg-blue-50/60"
                        }`}>
                        {message.text}
                    </div>
                )}
                <p className="flex items-center gap-1 text-[11px] text-[#4A5568]">
                    {formatTime(message.createdAt)}
                    {mine && <CheckCheck className="h-3.5 w-3.5 text-[#0066FE]" />}
                </p>
            </div>
            {mine && <Avatar name="You" size="h-9 w-9" text="text-xs" />}
        </div>
    );
}

function ChatPanel({ conversation, messages, isLoading, onSend, sending, pendingFile, onPickFile, onClearFile, myRole, nameField, isDoctor }) {
    const [draft, setDraft] = useState("");
    const endRef = React.useRef(null);
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ block: "end" });
    }, [messages, conversation?._id]);

    const submit = (e) => {
        e.preventDefault();
        const text = draft.trim();
        if (!text && !pendingFile) return;
        onSend(text);
        setDraft("");
    };

    const iconBtn = "flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

    if (!conversation) {
        return <div className="flex min-h-0 flex-1 items-center justify-center text-sm text-slate-400">Select a conversation to start chatting.</div>;
    }

    const otherName = conversation[nameField];

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-blue-50 px-5 py-3">
                <div className="flex items-center gap-3">
                    <Avatar name={otherName} size="h-12 w-12" text="text-base" />
                    <div>
                        <h2 className="text-base font-bold text-[#0A1931]">{otherName}</h2>
                        {!isDoctor && (
                            <Link to={`/doctors/${conversation.doctorId}`} className="flex items-center gap-1 text-xs text-[#0066FE] hover:underline">
                                <Stethoscope size={11} /> View profile
                            </Link>
                        )}
                        {isDoctor && conversation.patientPhone && (
                            <p className="text-xs text-[#4A5568]">{conversation.patientPhone}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button type="button" aria-label="Voice call" className={iconBtn}><Phone className="h-[18px] w-[18px]" /></button>
                    <button type="button" aria-label="Video call" className={iconBtn}><Video className="h-[18px] w-[18px]" /></button>
                    <button type="button" aria-label="More options" className={iconBtn}><MoreHorizontal className="h-[18px] w-[18px]" /></button>
                </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-white to-blue-50/30 px-5 py-4">
                {isLoading && <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-[#0066FE]" /></div>}
                {!isLoading && messages.length === 0 && (
                    <p className="py-10 text-center text-sm text-[#4A5568]">No messages yet. Say hello!</p>
                )}
                {messages.map((m) => <MessageBubble key={m._id} message={m} myRole={myRole} otherName={otherName} />)}
                <div ref={endRef} />
            </div>

            {pendingFile && (
                <div className="flex items-center justify-between border-t border-blue-50 bg-blue-50/60 px-4 py-2 text-xs text-[#0066FE]">
                    <span className="flex items-center gap-2 truncate"><Paperclip size={14} /> {pendingFile.name}</span>
                    <button type="button" onClick={onClearFile} className="text-slate-400 hover:text-rose-500"><X size={14} /></button>
                </div>
            )}

            <form onSubmit={submit} className="flex items-center gap-3 border-t border-blue-50 px-4 py-3">
                <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0])} />
                <button type="button" aria-label="Attach file" onClick={() => fileInputRef.current?.click()} className="rounded-md p-1.5 text-slate-500 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                    <Paperclip className="h-5 w-5" />
                </button>
                <div className="relative min-w-0 flex-1">
                    <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Type a message..."
                        aria-label="Type a message"
                        className="h-11 w-full rounded-lg border border-blue-100 bg-white pl-4 pr-4 text-sm text-[#0A1931] placeholder:text-[#4A5568] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <button
                    type="submit"
                    aria-label="Send message"
                    disabled={(!draft.trim() && !pendingFile) || sending}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {sending ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Send className="h-[18px] w-[18px]" />}
                </button>
            </form>
        </div>
    );
}

/* ---------------- sidebar ---------------- */

function ContactInfoCard({ conversation, nameField, isDoctor }) {
    if (!conversation) return null;
    return (
        <Card className="p-5">
            <div className="flex items-center gap-4">
                <Avatar name={conversation[nameField]} size="h-16 w-16" text="text-xl" />
                <div>
                    <h2 className="text-base font-bold text-[#0A1931]">{conversation[nameField]}</h2>
                    {isDoctor && conversation.patientPhone && <p className="mt-0.5 text-xs text-[#4A5568]">{conversation.patientPhone}</p>}
                </div>
            </div>
            {!isDoctor && (
                <Link
                    to={`/doctors/${conversation.doctorId}`}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                    View Full Profile <ArrowRight className="h-3 w-3" />
                </Link>
            )}
        </Card>
    );
}

function QuickActions({ conversation, isDoctor }) {
    if (!conversation) return null;
    const patientQuery = `patientId=${conversation.patientId}&patientName=${encodeURIComponent(conversation.patientName || "")}`;
    const actions = isDoctor
        ? [
            { label: "Send Prescription", icon: FileSignature, to: `/dashboard/add-medical-record?type=Prescription&${patientQuery}` },
            { label: "View Medical Records", icon: FileText, to: "/dashboard/patients" },
            { label: "Add Notes", icon: PenSquare, to: `/dashboard/add-medical-record?type=Diagnosis&${patientQuery}` },
        ]
        : [
            { label: "Book Follow-up", icon: CalendarDays, to: `/doctors/${conversation.doctorId}` },
            { label: "View Appointments", icon: FileText, to: "/dashboard/my-appointments" },
        ];

    return (
        <Card className="p-5">
            <h2 className="mb-3 text-base font-bold text-[#0A1931]">Quick Actions</h2>
            <ul className="space-y-2">
                {actions.map(({ label, icon: Icon, to }) => (
                    <li key={label}>
                        <Link
                            to={to}
                            className="flex w-full items-center gap-3 rounded-lg bg-blue-50/70 px-3 py-3 text-left text-sm font-medium text-[#0A1931] transition hover:bg-blue-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                            <Icon className="h-5 w-5 text-[#0066FE]" strokeWidth={1.75} />
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </Card>
    );
}

/* ---------------- page ---------------- */

export default function MessagesPage() {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const socket = useSocket();
    const { user } = useAuth();

    const isDoctor = user?.role === "doctor";
    const myRole = isDoctor ? "doctor" : "patient";
    const nameField = isDoctor ? "patientName" : "doctorName"; // Field used to display the other participant's name in the chat.
    const emptyText = isDoctor
        ? "No conversations yet. Patients can message you once they book an appointment."
        : "No conversations yet. Once your appointment is confirmed, you can message your doctor here.";

    const [activeId, setActiveId] = useState(null);
    const [sending, setSending] = useState(false);
    const [pendingFile, setPendingFile] = useState(null);

    const { data: conversationsData, isLoading: loadingConversations } = useQuery({
        queryKey: ["my-conversations", user?._id],
        queryFn: async () => {
            const res = await axiosSecure.get("/api/conversations/mine");
            return res.data.conversations;
        },
        enabled: Boolean(user),
    });

    const conversations = conversationsData ?? [];

    useEffect(() => {
        if (!activeId && conversations.length > 0) setActiveId(conversations[0]._id);
    }, [conversations, activeId]);

    const activeConversation = conversations.find((c) => c._id === activeId) || null;

    const { data: messagesData, isLoading: loadingMessages } = useQuery({
        queryKey: ["conversation-messages", activeId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/conversations/${activeId}/messages`);
            return res.data.messages;
        },
        enabled: Boolean(activeId),
    });

    const messages = messagesData ?? [];

    useEffect(() => {
        if (!socket || conversations.length === 0) return;
        conversations.forEach((c) => socket.emit("join_conversation", c._id));
    }, [socket, conversations]);

    useEffect(() => {
        if (!socket) return;
        function handleNewMessage({ conversationId, message }) {
            queryClient.setQueryData(["conversation-messages", conversationId], (old) => {
                if (!old) return [message];
                if (old.some((m) => m._id === message._id)) return old;
                return [...old, message];
            });
            queryClient.setQueryData(["my-conversations", user?._id], (old) => {
                if (!old) return old;
                return old
                    .map((c) => c._id === conversationId ? { ...c, lastMessageText: message.text || "📎 Attachment", lastMessageAt: message.createdAt } : c)
                    .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
            });
        }
        socket.on("new_message", handleNewMessage);
        return () => socket.off("new_message", handleNewMessage);
    }, [socket, queryClient, user?._id]);

    const handlePickFile = (file) => file && setPendingFile(file);

    const handleSend = async (text) => {
        if (!activeId) return;
        setSending(true);
        try {
            let attachments;
            if (pendingFile) {
                const form = new FormData();
                form.append("file", pendingFile);
                const uploadRes = await axiosSecure.post("/api/conversations/upload", form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                attachments = [uploadRes.data.attachment];
            }
            const res = await axiosSecure.post(`/api/conversations/${activeId}/messages`, { text, attachments });
            queryClient.setQueryData(["conversation-messages", activeId], (old) => (old ? [...old, res.data.message] : [res.data.message]));
            setPendingFile(null);
        } catch (err) {
            console.error("Failed to send message:", err.response?.data?.message || err.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen  p-4 font-sans text-[#0A1931] sm:p-6">
            <div className="mx-auto grid max-w-[1400px] gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <main className="space-y-4">
                    <header>
                        <h1 className="text-2xl font-bold text-[#0A1931]">Messages</h1>
                        <p className="mt-1 text-sm text-[#4A5568]">
                            {isDoctor ? "Chat with your patients and provide better care." : "Chat with the doctors you've booked appointments with."}
                        </p>
                    </header>

                    <Card className="overflow-hidden">
                        <div className="grid md:h-[calc(100vh-10rem)] md:min-h-[600px] md:grid-cols-[270px_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
                            <ConversationList
                                conversations={conversations}
                                activeId={activeId}
                                onSelect={setActiveId}
                                isLoading={loadingConversations}
                                nameField={nameField}
                                emptyText={emptyText}
                            />
                            <div className="flex h-[600px] min-h-0 flex-col md:h-auto">
                                <ChatPanel
                                    conversation={activeConversation}
                                    messages={messages}
                                    isLoading={loadingMessages}
                                    onSend={handleSend}
                                    sending={sending}
                                    pendingFile={pendingFile}
                                    onPickFile={handlePickFile}
                                    onClearFile={() => setPendingFile(null)}
                                    myRole={myRole}
                                    nameField={nameField}
                                    isDoctor={isDoctor}
                                />
                            </div>
                        </div>
                    </Card>
                </main>

                <aside className="space-y-5">
                    <ContactInfoCard conversation={activeConversation} nameField={nameField} isDoctor={isDoctor} />
                    <QuickActions conversation={activeConversation} isDoctor={isDoctor} />
                </aside>
            </div>
        </div>
    );
}