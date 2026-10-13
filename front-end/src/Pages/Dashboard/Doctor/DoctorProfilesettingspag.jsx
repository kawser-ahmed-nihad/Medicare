import React, { useEffect, useRef, useState } from "react";
import {
    User,
    Clock,
    Bell,
    Lock,
    Camera,
    Trash2,
    BadgeCheck,
    HeartPulse,
    FileText,
    Mail,
    Phone,
    MapPin,
    Pencil,
    Save,
    Check,
    Star,
    CalendarDays,
    MessageSquareText,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const specializations = [
    "Cardiologist",
    "Neurologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedic Surgeon",
    "General Physician",
];

const experienceOptions = ["1+", "3+", "5+", "10+", "15+"];

const timeRanges = [
    "09:00 AM \u2013 05:00 PM",
    "08:00 AM \u2013 02:00 PM",
    "10:00 AM \u2013 06:00 PM",
    "02:00 PM \u2013 09:00 PM",
];

const initialHours = [
    { day: "Monday", open: true, range: timeRanges[0] },
    { day: "Tuesday", open: true, range: timeRanges[0] },
    { day: "Wednesday", open: true, range: timeRanges[0] },
    { day: "Thursday", open: true, range: timeRanges[0] },
    { day: "Friday", open: true, range: timeRanges[0] },
    { day: "Saturday", open: false, range: timeRanges[0] },
    { day: "Sunday", open: false, range: timeRanges[0] },
];

const notificationItems = [
    { key: "appointments", icon: CalendarDays, title: "New Appointments", desc: "Get notified about new appointment requests" },
    { key: "messages", icon: MessageSquareText, title: "Patient Messages", desc: "Receive messages from your patients" },
    { key: "prescriptions", icon: FileText, title: "Prescription Updates", desc: "Get notified when prescriptions are updated" },
    { key: "reminders", icon: Clock, title: "Reminders", desc: "Receive reminders for upcoming appointments" },
    { key: "system", icon: Bell, title: "System Notifications", desc: "Important updates and announcements" },
];

const BIO_LIMIT = 300;

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

function Card({ children, className = "" }) {
    return (
        <section
            className={`rounded-2xl border border-blue-100/70 bg-white p-5 shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}
        >
            {children}
        </section>
    );
}

function SectionTitle({ icon: Icon, children, subtitle }) {
    return (
        <div className="mb-4">
            <h2 className="flex items-center gap-2.5 text-base font-bold text-blue-950">
                <Icon className="h-5 w-5 text-blue-600" strokeWidth={1.75} />
                {children}
            </h2>
            {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
    );
}

const inputClass =
    "h-10 w-full rounded-lg border border-blue-100 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200";

function Field({ id, label, children }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-600">
                {label}
            </label>
            {children}
        </div>
    );
}

function SelectField({ id, value, onChange, options, className = "" }) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${inputClass} appearance-none pr-9 ${className}`}
            >
                {options.map((o) => (
                    <option key={o}>{o}</option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
    );
}

function Toggle({ checked, onChange, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${checked ? "bg-blue-600" : "bg-slate-300"
                }`}
        >
            <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"
                    }`}
            />
        </button>
    );
}

function ProfilePhoto({ photo, size = "h-24 w-24", text = "text-2xl" }) {
    return photo ? (
        <img src={photo} alt="Dr. Robert Smith" className={`${size} rounded-full object-cover ring-4 ring-blue-50`} />
    ) : (
        <div
            aria-label="Dr. Robert Smith"
            role="img"
            className={`${size} ${text} flex items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 font-semibold text-white ring-4 ring-blue-50`}
        >
            RS
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Left: profile summary                                               */
/* ------------------------------------------------------------------ */

function ProfileSummary({ profile, photo, openPicker }) {
    const details = [
        { icon: HeartPulse, label: "Specialization", value: profile.specialization === "Cardiologist" ? "Cardiology" : profile.specialization },
        { icon: FileText, label: "License No.", value: profile.license },
        { icon: Mail, label: "Email", value: profile.email },
        { icon: Phone, label: "Phone", value: profile.phone },
        { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh" },
    ];

    return (
        <Card>
            <div className="flex flex-col items-center text-center">
                <div className="relative">
                    <ProfilePhoto photo={photo} size="h-28 w-28" text="text-3xl" />
                    <button
                        type="button"
                        onClick={openPicker}
                        aria-label="Change profile photo"
                        className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                        <Camera className="h-4 w-4" />
                    </button>
                </div>

                <h2 className="mt-3 flex items-center gap-1.5 text-lg font-bold text-blue-950">
                    Dr. Robert Smith
                    <BadgeCheck className="h-5 w-5 text-blue-600" aria-label="Verified" />
                </h2>
                <p className="text-sm text-slate-500">{profile.specialization}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Available
                </span>
            </div>

            <dl className="mt-5 grid grid-cols-3 divide-x divide-blue-100 rounded-xl border border-blue-100 bg-blue-50/30 py-3 text-center">
                <div className="px-1">
                    <dt className="sr-only">Years of experience</dt>
                    <dd className="text-base font-bold text-blue-950">{profile.experience}</dd>
                    <p className="text-[10px] leading-tight text-slate-500">Years Experience</p>
                </div>
                <div className="px-1">
                    <dt className="sr-only">Total patients</dt>
                    <dd className="text-base font-bold text-blue-950">248</dd>
                    <p className="text-[10px] leading-tight text-slate-500">Total Patients</p>
                </div>
                <div className="px-1">
                    <dt className="sr-only">Rating</dt>
                    <dd className="flex items-center justify-center gap-0.5 text-base font-bold text-blue-950">
                        4.9 <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </dd>
                    <p className="text-[10px] leading-tight text-slate-500">Rating</p>
                </div>
            </dl>

            <ul className="mt-4 divide-y divide-slate-100">
                {details.map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex items-start gap-3 py-3">
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" strokeWidth={1.75} />
                        <div className="min-w-0">
                            <p className="text-xs text-slate-400">{label}</p>
                            <p className="break-words text-sm font-medium text-slate-700">{value}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-2 border-t border-slate-100 pt-4">
                <h3 className="mb-2 text-sm font-bold text-blue-950">About Me</h3>
                <textarea
                    readOnly
                    aria-label="About me"
                    value={profile.bio}
                    rows={5}
                    className="w-full resize-none rounded-lg border border-blue-100 bg-white p-3 text-xs leading-relaxed text-slate-600 focus:outline-none"
                />
                <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-500 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </button>
            </div>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Middle: basic information + working hours                           */
/* ------------------------------------------------------------------ */

function BasicInformation({ profile, update }) {
    return (
        <Card>
            <SectionTitle icon={User}>Basic Information</SectionTitle>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field id="full-name" label="Full Name">
                    <input id="full-name" className={inputClass} value={profile.name} onChange={(e) => update("name", e.target.value)} />
                </Field>
                <Field id="specialization" label="Specialization">
                    <SelectField id="specialization" value={profile.specialization} onChange={(v) => update("specialization", v)} options={specializations} />
                </Field>
                <Field id="email" label="Email Address">
                    <input id="email" type="email" className={inputClass} value={profile.email} onChange={(e) => update("email", e.target.value)} />
                </Field>
                <Field id="phone" label="Phone Number">
                    <input id="phone" type="tel" className={inputClass} value={profile.phone} onChange={(e) => update("phone", e.target.value)} />
                </Field>
                <Field id="license" label="License Number">
                    <input id="license" className={inputClass} value={profile.license} onChange={(e) => update("license", e.target.value)} />
                </Field>
                <Field id="experience" label="Experience (Years)">
                    <SelectField id="experience" value={profile.experience} onChange={(v) => update("experience", v)} options={experienceOptions} />
                </Field>
            </div>

            <div className="mt-4">
                <Field id="bio" label="Bio">
                    <div className="relative">
                        <textarea
                            id="bio"
                            rows={4}
                            maxLength={BIO_LIMIT}
                            value={profile.bio}
                            onChange={(e) => update("bio", e.target.value)}
                            className="w-full resize-none rounded-lg border border-blue-100 bg-white p-3 pb-6 text-sm leading-relaxed text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-slate-400">
                            {profile.bio.length}/{BIO_LIMIT}
                        </span>
                    </div>
                </Field>
            </div>
        </Card>
    );
}

function WorkingHours({ hours, setHours }) {
    const patch = (day, changes) =>
        setHours((prev) => prev.map((h) => (h.day === day ? { ...h, ...changes } : h)));

    return (
        <Card>
            <SectionTitle icon={Clock}>Working Hours</SectionTitle>
            <ul className="space-y-3">
                {hours.map((h) => (
                    <li key={h.day} className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                        <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${h.open ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"
                                }`}
                        >
                            <Clock className="h-4 w-4" />
                        </span>
                        <span className="w-24 shrink-0 text-sm font-medium text-slate-700">{h.day}</span>
                        <Toggle checked={h.open} onChange={(v) => patch(h.day, { open: v })} label={`${h.day} working`} />

                        {h.open ? (
                            <div className="relative min-w-[200px] flex-1">
                                <Clock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                                <select
                                    aria-label={`${h.day} hours`}
                                    value={h.range}
                                    onChange={(e) => patch(h.day, { range: e.target.value })}
                                    className={`${inputClass} appearance-none pl-9 pr-9 text-slate-600`}
                                >
                                    {timeRanges.map((r) => (
                                        <option key={r}>{r}</option>
                                    ))}
                                </select>
                                <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            </div>
                        ) : (
                            <div className="flex h-10 min-w-[200px] flex-1 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400">
                                Closed
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Right column                                                        */
/* ------------------------------------------------------------------ */

function ProfilePictureCard({ photo, openPicker, removePhoto }) {
    return (
        <Card>
            <SectionTitle icon={User}>Profile Picture</SectionTitle>
            <div className="flex items-center gap-5">
                <ProfilePhoto photo={photo} size="h-28 w-28" text="text-3xl" />
                <div className="flex flex-col items-start gap-2">
                    <button
                        type="button"
                        onClick={openPicker}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                    >
                        <Camera className="h-4 w-4" />
                        Change Photo
                    </button>
                    <button
                        type="button"
                        onClick={removePhoto}
                        disabled={!photo}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4" />
                        Remove
                    </button>
                    <p className="text-[11px] text-slate-400">JPG, PNG (Max 2MB)</p>
                </div>
            </div>
        </Card>
    );
}

function NotificationSettings() {
    const [enabled, setEnabled] = useState({
        appointments: true,
        messages: true,
        prescriptions: true,
        reminders: true,
        system: true,
    });

    return (
        <Card>
            <SectionTitle icon={Bell} subtitle="Choose what notifications you want to receive.">
                Notification Settings
            </SectionTitle>
            <ul className="divide-y divide-slate-100">
                {notificationItems.map(({ key, icon: Icon, title, desc }) => (
                    <li key={key} className="flex items-center gap-3 py-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-blue-950">{title}</p>
                            <p className="text-[11px] leading-snug text-slate-500">{desc}</p>
                        </div>
                        <Toggle
                            checked={enabled[key]}
                            onChange={(v) => setEnabled((prev) => ({ ...prev, [key]: v }))}
                            label={title}
                        />
                    </li>
                ))}
            </ul>
        </Card>
    );
}

function PasswordField({ id, label, value, onChange }) {
    const [visible, setVisible] = useState(false);
    return (
        <Field id={id} label={label}>
            <div className="relative">
                <input
                    id={id}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete={id === "current-password" ? "current-password" : "new-password"}
                    className={`${inputClass} pr-10 tracking-wider`}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? `Hide ${label}` : `Show ${label}`}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        </Field>
    );
}

function ChangePassword() {
    const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
    const [message, setMessage] = useState(null);

    const set = (key) => (value) => setPw((prev) => ({ ...prev, [key]: value }));

    const submit = (e) => {
        e.preventDefault();
        if (!pw.current || !pw.next || !pw.confirm) {
            return setMessage({ ok: false, text: "Fill in all three password fields." });
        }
        if (pw.next.length < 8) {
            return setMessage({ ok: false, text: "New password must be at least 8 characters." });
        }
        if (pw.next !== pw.confirm) {
            return setMessage({ ok: false, text: "New password and confirmation don't match." });
        }
        // TODO: Send the password change to the backend API.
        setPw({ current: "", next: "", confirm: "" });
        setMessage({ ok: true, text: "Password updated." });
    };

    return (
        <Card>
            <SectionTitle icon={Lock}>Change Password</SectionTitle>
            <form onSubmit={submit} className="space-y-3">
                <PasswordField id="current-password" label="Current Password" value={pw.current} onChange={set("current")} />
                <PasswordField id="new-password" label="New Password" value={pw.next} onChange={set("next")} />
                <PasswordField id="confirm-password" label="Confirm New Password" value={pw.confirm} onChange={set("confirm")} />

                <p
                    role="status"
                    className={`min-h-[1rem] text-xs ${message?.ok ? "text-emerald-600" : "text-rose-500"}`}
                >
                    {message?.text}
                </p>

                <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                >
                    <Lock className="h-4 w-4" />
                    Update Password
                </button>
            </form>
        </Card>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProfileSettingsPage() {
    const [profile, setProfile] = useState({
        name: "Dr. Robert Smith",
        specialization: "Cardiologist",
        email: "robert.smith@medicare.com",
        phone: "+880 1712 345678",
        license: "MED-12345",
        experience: "5+",
        bio: "Experienced cardiologist with a passion for providing quality healthcare. I focus on preventive care and personalized treatment plans for every patient.",
    });
    const [hours, setHours] = useState(initialHours);
    const [photo, setPhoto] = useState(null);
    const [saved, setSaved] = useState(false);
    const [photoError, setPhotoError] = useState("");
    const fileRef = useRef(null);

    const update = (key, value) => setProfile((prev) => ({ ...prev, [key]: value }));

    // Revoke object URLs when the photo changes or the page unmounts
    useEffect(() => {
        return () => {
            if (photo && photo.startsWith("blob:")) URL.revokeObjectURL(photo);
        };
    }, [photo]);

    useEffect(() => {
        if (!saved) return undefined;
        const t = setTimeout(() => setSaved(false), 2200);
        return () => clearTimeout(t);
    }, [saved]);

    const onPickFile = (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            return setPhotoError("Use a JPG or PNG image.");
        }
        if (file.size > 2 * 1024 * 1024) {
            return setPhotoError("Image must be 2MB or smaller.");
        }
        setPhotoError("");
        setPhoto(URL.createObjectURL(file));
    };

    const save = () => {
        // TODO: Send the profile and hours data to the profile settings API.
        setSaved(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#eef4ff] to-[#f6f9ff] p-4 font-sans text-slate-700 sm:p-6">
            <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={onPickFile}
                aria-hidden="true"
                tabIndex={-1}
            />

            <div className="mx-auto grid max-w-[1400px] gap-5 lg:grid-cols-[270px_minmax(0,1fr)_340px]">
                <header className="flex flex-wrap items-start justify-between gap-4 lg:col-span-2 lg:col-start-1 lg:row-start-1">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-950">Doctor Profile &amp; Settings</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage your profile information, preferences and account settings.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={save}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                    >
                        {saved ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Save className="h-4 w-4" />}
                        <span aria-live="polite">{saved ? "Changes saved" : "Save Changes"}</span>
                    </button>
                </header>

                <div className="lg:col-start-1 lg:row-start-2">
                    <ProfileSummary profile={profile} photo={photo} openPicker={() => fileRef.current?.click()} />
                </div>

                <main className="space-y-5 lg:col-start-2 lg:row-start-2">
                    <BasicInformation profile={profile} update={update} />
                    <WorkingHours hours={hours} setHours={setHours} />
                </main>

                <aside className="space-y-5 lg:col-start-3 lg:row-span-2 lg:row-start-1">
                    <ProfilePictureCard
                        photo={photo}
                        openPicker={() => fileRef.current?.click()}
                        removePhoto={() => {
                            setPhoto(null);
                            setPhotoError("");
                        }}
                    />
                    {photoError && (
                        <p role="alert" className="-mt-3 px-1 text-xs text-rose-500">
                            {photoError}
                        </p>
                    )}
                    <NotificationSettings />
                    <ChangePassword />
                </aside>
            </div>
        </div>
    );
}