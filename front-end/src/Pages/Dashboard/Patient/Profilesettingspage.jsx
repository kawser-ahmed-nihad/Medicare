import React, { useState } from "react";
import {
    BadgeCheck,
    Mail,
    Phone,
    MapPin,
    Camera,
    User,
    ShieldCheck,
    Bell,
    Lock,
    Upload,
    Trash2,
    Info,
    CreditCard,
    Calendar,
    Clock,
    KeyRound,
    ShieldHalf,
    History,
    ChevronRight,
    BellRing,
    Pill,
    MessageSquare,
    Megaphone,
    Sprout,
    Headphones,
} from "lucide-react";

/* ---------------- Data ---------------- */

const tabs = [
    { label: "Personal Info", icon: User },
    { label: "Account Settings", icon: ShieldCheck },
    { label: "Notifications", icon: Bell },
    { label: "Privacy", icon: Lock },
];

const securityItems = [
    { icon: KeyRound, title: "Change Password", desc: "Update your account password" },
    { icon: ShieldHalf, title: "Two-Factor Authentication", desc: "Add an extra layer of security" },
    { icon: History, title: "Login Activity", desc: "View your recent login activity" },
];

const notificationDefaults = [
    { icon: BellRing, title: "Appointment Reminders", desc: "Get notified before your appointments", enabled: true },
    { icon: Pill, title: "Prescription Updates", desc: "Know when your prescriptions are ready", enabled: true },
    { icon: MessageSquare, title: "Doctor Messages", desc: "Get messages from your doctors", enabled: true },
    { icon: Megaphone, title: "System Notifications", desc: "Important updates and announcements", enabled: true },
];

/* ---------------- Small UI helpers ---------------- */

function Field({ label, defaultValue, type = "text", full = false }) {
    return (
        <label className={full ? "sm:col-span-2" : ""}>
            <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
            <input
                type={type}
                defaultValue={defaultValue}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
            />
        </label>
    );
}

function SelectField({ label, options, defaultValue }) {
    return (
        <label>
            <span className="mb-1.5 block text-xs font-medium text-slate-600">{label}</span>
            <select
                defaultValue={defaultValue}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400"
            >
                {options.map((o) => (
                    <option key={o}>{o}</option>
                ))}
            </select>
        </label>
    );
}

function Toggle({ enabled, onChange }) {
    return (
        <button
            onClick={onChange}
            className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-slate-200"
                }`}
        >
            <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
            />
        </button>
    );
}

/* ---------------- Sections ---------------- */

function ProfileHeaderCard() {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-sky-50 p-6">
            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                            alt="Kawser Nihad"
                            className="h-20 w-20 rounded-full object-cover"
                        />
                        <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
                            <Camera size={13} />
                        </button>
                    </div>

                    <div>
                        <div className="flex items-center gap-1.5">
                            <h2 className="text-lg font-bold text-slate-900">Kawser Nihad</h2>
                            <BadgeCheck size={17} className="text-blue-600" fill="#3b82f6" stroke="white" />
                        </div>
                        <p className="text-xs text-slate-500">Patient</p>

                        <div className="mt-2 space-y-1 text-xs text-slate-500">
                            <p className="flex items-center gap-1.5">
                                <Mail size={12} />
                                kawsernihad@gmail.com
                            </p>
                            <p className="flex items-center gap-1.5">
                                <Phone size={12} />
                                +880 1712 345678
                            </p>
                            <p className="flex items-center gap-1.5">
                                <MapPin size={12} />
                                City Hospital, Room 302
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative hidden max-w-[200px] text-right sm:block">
                    <p className="text-sm italic text-slate-500">
                        "Your health is your greatest wealth. Take care of it."
                    </p>
                    <div className="pointer-events-none absolute -bottom-6 -right-4 opacity-40">
                        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                            <path d="M35 60 C10 45 5 25 20 15 C28 10 35 15 35 22 C35 15 42 10 50 15 C65 25 60 45 35 60Z" stroke="#3b82f6" strokeWidth="2" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Tabs({ active, setActive }) {
    return (
        <div className="mt-6 flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm shadow-slate-900/5">
            {tabs.map(({ label, icon: Icon }, i) => (
                <button
                    key={label}
                    onClick={() => setActive(i)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${active === i
                            ? "bg-blue-600 text-white"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        }`}
                >
                    <Icon size={15} />
                    {label}
                </button>
            ))}
        </div>
    );
}

function PersonalInfoTab() {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5">
                <h3 className="font-bold text-slate-900">Personal Information</h3>
                <p className="mt-0.5 text-xs text-slate-500">Update your basic information here.</p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Full Name" defaultValue="Kawser Nihad" full />
                    <Field label="Email Address" defaultValue="kawsernihad@gmail.com" type="email" full />
                    <Field label="Phone Number" defaultValue="+880 1712 345678" full />
                    <Field label="Date of Birth" defaultValue="2006-01-12" type="date" />
                    <SelectField label="Gender" defaultValue="Male" options={["Male", "Female", "Other"]} />
                    <SelectField label="Blood Group" defaultValue="O+" options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]} />
                    <Field label="Address" defaultValue="City Hospital, Room 302" />
                </div>

                <button className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                    <Upload size={15} />
                    Save Changes
                </button>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5">
                <h3 className="font-bold text-slate-900">Additional Information</h3>
                <p className="mt-0.5 text-xs text-slate-500">Share more details about your health (optional).</p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Field label="Height" defaultValue="175 cm" />
                    <Field label="Weight" defaultValue="65 kg" />
                    <SelectField label="Preferred Language" defaultValue="English" options={["English", "Bangla"]} />
                    <Field label="Emergency Contact" defaultValue="+880 1712 345678" />
                </div>
            </div>
        </div>
    );
}

function ProfilePhotoCard() {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <Camera size={15} className="text-blue-600" />
                Profile Photo
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">Upload a clear photo for your profile.</p>

            <div className="mt-5 flex justify-center">
                <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                />
            </div>

            <div className="mt-5 space-y-2">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                    <Upload size={15} />
                    Change Photo
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:border-rose-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={15} />
                    Remove Photo
                </button>
            </div>
        </div>
    );
}

function QuickInfoCard() {
    const rows = [
        { icon: CreditCard, label: "Patient ID", value: "#MED123456" },
        { icon: Calendar, label: "Member Since", value: "Jan 2025" },
        { icon: Clock, label: "Last Login", value: "Jun 12, 2025 · 10:24 AM" },
    ];

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <Info size={15} className="text-blue-600" />
                Quick Info
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">Your important details at a glance.</p>

            <div className="mt-4 space-y-3">
                {rows.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-500">
                            <Icon size={14} />
                            {label}
                        </span>
                        <span className="font-medium text-slate-800">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AccountSecurityCard() {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-900/5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck size={16} className="text-blue-600" />
                Account Security
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">Keep your account safe and secure.</p>

            <div className="mt-4 divide-y divide-slate-100">
                {securityItems.map(({ icon: Icon, title, desc }) => (
                    <button
                        key={title}
                        className="flex w-full items-center gap-3 py-3 text-left first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
                    >
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-blue-600">
                            <Icon size={15} />
                        </span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{title}</p>
                            <p className="text-xs text-slate-500">{desc}</p>
                        </div>
                        <ChevronRight size={15} className="text-slate-300" />
                    </button>
                ))}
            </div>
        </div>
    );
}

function NotificationPreferencesCard() {
    const [prefs, setPrefs] = useState(notificationDefaults);

    const toggle = (i) => {
        setPrefs((prev) => prev.map((p, idx) => (idx === i ? { ...p, enabled: !p.enabled } : p)));
    };

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm shadow-slate-900/5">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <Bell size={16} className="text-blue-600" />
                Notification Preferences
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">Choose what you want to be notified about.</p>

            <div className="mt-4 divide-y divide-slate-100">
                {prefs.map(({ icon: Icon, title, desc, enabled }, i) => (
                    <div key={title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-blue-600">
                            <Icon size={15} />
                        </span>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{title}</p>
                            <p className="text-xs text-slate-500">{desc}</p>
                        </div>
                        <Toggle enabled={enabled} onChange={() => toggle(i)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function SupportCard() {
    return (
        <div className="rounded-2xl bg-sky-50 p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                <Sprout size={17} />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-900">Need to make changes?</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
                If you face any issues, please contact our support team.
            </p>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm shadow-slate-900/5 hover:bg-slate-50 transition-colors">
                <Headphones size={14} />
                Contact Support
            </button>
        </div>
    );
}

/* ---------------- Page ---------------- */

export default function ProfileSettingsPage() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-10">
            <div className="mx-auto max-w-6xl">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Profile &amp; Settings</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage your personal information, account settings and preferences.
                    </p>
                </div>

                <div className="mt-5">
                    <ProfileHeaderCard />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
                    {/* Main column */}
                    <div>
                        <Tabs active={activeTab} setActive={setActiveTab} />

                        <div className="mt-6">
                            {activeTab === 0 && (
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
                                    <PersonalInfoTab />
                                    <div className="space-y-6">
                                        <ProfilePhotoCard />
                                        <QuickInfoCard />
                                    </div>
                                </div>
                            )}

                            {activeTab === 1 && (
                                <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm shadow-slate-900/5">
                                    Account settings content goes here.
                                </div>
                            )}

                            {activeTab === 2 && (
                                <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm shadow-slate-900/5">
                                    Notification settings content goes here.
                                </div>
                            )}

                            {activeTab === 3 && (
                                <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm shadow-slate-900/5">
                                    Privacy settings content goes here.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right sidebar - persistent */}
                    <div className="space-y-6">
                        <AccountSecurityCard />
                        <NotificationPreferencesCard />
                        <SupportCard />
                    </div>
                </div>
            </div>
        </div>
    );
}