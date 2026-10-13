import React, { useState } from "react";
import { toast } from "react-toastify";
import {
    User, Briefcase, DollarSign, CalendarClock, Upload, X, Plus,
    Save, ChevronLeft, Trash2, Check, GraduationCap, Building2,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

/* ---------------- options ---------------- */

const DEPARTMENTS = [
    "Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics",
    "Gynecology", "General Medicine", "ENT", "Urology", "Others",
];

const DEGREES = ["MBBS", "FCPS", "MD", "MS", "MRCP", "FRCS", "BDS", "DDV", "PhD"];

const LOCATIONS = ["Dhaka", "Mymensingh", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur"];

const LANGUAGES = ["Bangla", "English", "Hindi", "Arabic"];

const DAYS = [
    { key: "sat", label: "Sat" }, { key: "sun", label: "Sun" },
    { key: "mon", label: "Mon" }, { key: "tue", label: "Tue" },
    { key: "wed", label: "Wed" }, { key: "thu", label: "Thu" },
    { key: "fri", label: "Fri" },
];

const emptySlot = () => ({ id: crypto.randomUUID(), days: [], start: "09:00", end: "17:00" });

// Store the institution and year for each degree.
const emptyEducation = () => ({ id: crypto.randomUUID(), degree: "", institution: "", startYear: "", endYear: "" });

// Store the doctor's work history.
const emptyWorkExperience = () => ({ id: crypto.randomUUID(), title: "", organization: "", startYear: "", endYear: "", current: false });

const initialForm = {
    firstName: "", lastName: "", email: "", phone: "", gender: "",
    dob: "", nid: "", bio: "", photo: null,
    department: "", designation: "", degrees: [], bmdc: "",
    experience: "", location: "", chamber: "", languages: [],
    education: [emptyEducation()],
    workHistory: [emptyWorkExperience()],
    consultationFee: "", followUpFee: "", discount: "",
    slotDuration: "30", maxPatients: "20", schedule: [emptySlot()],
    status: "available",
};

/* ---------------- small ui pieces ---------------- */

const Card = ({ icon: Icon, title, desc, children }) => (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:p-6">
        <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
            </span>
            <div>
                <h2 className="text-base font-semibold text-slate-800">{title}</h2>
                {desc && <p className="text-sm text-slate-500">{desc}</p>}
            </div>
        </div>
        {children}
    </section>
);

const Field = ({ label, required, error, hint, children, className = "" }) => (
    <div className={className}>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {children}
        {error ? (
            <p className="mt-1.5 text-xs text-rose-500">{error}</p>
        ) : hint ? (
            <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
        ) : null}
    </div>
);

const inputBase =
    "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const Input = ({ error, ...props }) => (
    <input {...props} className={`${inputBase} ${error ? "border-rose-300" : "border-slate-200"}`} />
);

const Select = ({ error, children, ...props }) => (
    <select {...props} className={`${inputBase} ${error ? "border-rose-300" : "border-slate-200"}`}>
        {children}
    </select>
);

const Chip = ({ active, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`rounded-lg border px-3 py-1.5 text-sm transition ${active
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
            }`}
    >
        {children}
    </button>
);

/* ---------------- page ---------------- */

export default function AddDoctor() {
    const [form, setForm] = useState(initialForm);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const axiosInstance = useAxiosSecure();

    const set = (key, value) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const toggleIn = (key, value) =>
        setForm((f) => ({
            ...f,
            [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
        }));

    const onPhoto = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        set("photo", file);
        setPreview(URL.createObjectURL(file));
    };

    const removePhoto = () => {
        set("photo", null);
        setPreview(null);
    };

    /* schedule helpers */
    const updateSlot = (id, patch) =>
        setForm((f) => ({ ...f, schedule: f.schedule.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));

    const toggleSlotDay = (id, day) =>
        setForm((f) => ({
            ...f,
            schedule: f.schedule.map((s) =>
                s.id === id
                    ? { ...s, days: s.days.includes(day) ? s.days.filter((d) => d !== day) : [...s.days, day] }
                    : s
            ),
        }));

    const addSlot = () => setForm((f) => ({ ...f, schedule: [...f.schedule, emptySlot()] }));
    const removeSlot = (id) =>
        setForm((f) => ({ ...f, schedule: f.schedule.filter((s) => s.id !== id) }));

    /* education helpers */
    const addEducation = () => setForm((f) => ({ ...f, education: [...f.education, emptyEducation()] }));
    const removeEducation = (id) =>
        setForm((f) => ({ ...f, education: f.education.filter((ed) => ed.id !== id) }));
    const updateEducation = (id, patch) =>
        setForm((f) => ({ ...f, education: f.education.map((ed) => (ed.id === id ? { ...ed, ...patch } : ed)) }));

    /* work history helpers */
    const addWorkHistory = () => setForm((f) => ({ ...f, workHistory: [...f.workHistory, emptyWorkExperience()] }));
    const removeWorkHistory = (id) =>
        setForm((f) => ({ ...f, workHistory: f.workHistory.filter((w) => w.id !== id) }));
    const updateWorkHistory = (id, patch) =>
        setForm((f) => ({ ...f, workHistory: f.workHistory.map((w) => (w.id === id ? { ...w, ...patch } : w)) }));

    /* validation */
    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = "First name is required";
        if (!form.lastName.trim()) e.lastName = "Last name is required";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address";
        if (!/^01\d{9}$/.test(form.phone)) e.phone = "Enter an 11-digit number starting with 01";
        if (!form.gender) e.gender = "Select a gender";
        if (!form.department) e.department = "Select a department";
        if (!form.bmdc.trim()) e.bmdc = "BMDC registration number is required";
        if (form.experience === "" || Number(form.experience) < 0) e.experience = "Enter years of experience";
        if (!form.location) e.location = "Select a location";
        if (form.consultationFee === "" || Number(form.consultationFee) <= 0)
            e.consultationFee = "Enter a consultation fee";
        if (!form.schedule.some((s) => s.days.length)) e.schedule = "Pick at least one day for availability";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const buildPayload = () => ({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        gender: form.gender,
        date_of_birth: form.dob || null,
        nid: form.nid.trim() || null,
        bio: form.bio.trim() || null,
        department: form.department,
        designation: form.designation.trim() || null,
        degrees: form.degrees,
        bmdc_reg_no: form.bmdc.trim(),
        experience_years: Number(form.experience),
        location: form.location,
        chamber_address: form.chamber.trim() || null,
        languages: form.languages,
        // Submit each degree's institution and year, omitting empty rows.
        education: form.education
            .filter((ed) => ed.degree.trim() || ed.institution.trim())
            .map((ed) => ({
                degree: ed.degree.trim(),
                institution: ed.institution.trim(),
                start_year: ed.startYear ? Number(ed.startYear) : null,
                end_year: ed.endYear ? Number(ed.endYear) : null,
            })),
        // Submit work history, omitting empty rows.
        work_experience: form.workHistory
            .filter((w) => w.title.trim() || w.organization.trim())
            .map((w) => ({
                title: w.title.trim(),
                organization: w.organization.trim(),
                start_year: w.startYear ? Number(w.startYear) : null,
                end_year: w.current ? null : w.endYear ? Number(w.endYear) : null,
                current: w.current,
            })),
        consultation_fee: Number(form.consultationFee),
        follow_up_fee: form.followUpFee === "" ? null : Number(form.followUpFee),
        discount_percent: form.discount === "" ? 0 : Number(form.discount),
        slot_duration_minutes: Number(form.slotDuration),
        max_patients_per_day: Number(form.maxPatients),
        status: form.status,
        schedule: form.schedule
            .filter((s) => s.days.length)
            .map(({ days, start, end }) => ({ days, start_time: start, end_time: end })),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            document.querySelector("[data-error='true']")?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const payload = buildPayload();

        // Use multipart because the request includes a photo. To send JSON only, use body: JSON.stringify(payload).
        const body = new FormData();
        body.append("data", JSON.stringify(payload));
        if (form.photo) body.append("photo", form.photo);

        try {
            setSaving(true);
            const res = await axiosInstance.post("/api/doctors", body);
            setSaved(true);
            toast.success(res.data?.message || "Doctor added successfully.");
            if (res.data?.warning) {
                toast.warn(res.data.warning);
            }
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            // err.response may be undefined for network errors, so optional chaining reads it safely.
            // The errors state expects an object with a submit property, so do not assign a string directly.
            const message = err.response?.data?.message || "Failed to save doctor. Please try again.";
            setErrors((prev) => ({ ...prev, submit: message }));
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    const reset = () => {
        setForm({
            ...initialForm,
            schedule: [emptySlot()],
            education: [emptyEducation()],
            workHistory: [emptyWorkExperience()],
        });
        setErrors({});
        setPreview(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-5 text-slate-900 lg:p-8">
            <form onSubmit={handleSubmit} className="mx-auto max-w-5xl">
                {/* header */}
                <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <button type="button" className="mb-2 flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
                            <ChevronLeft className="h-4 w-4" /> Back to doctors
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight">Add a doctor</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Fill in the profile, fees and weekly availability. The doctor appears in the directory once saved.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={reset}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                        >
                            Clear form
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {saving ? "Saving…" : saved ? "Saved" : "Save doctor"}
                        </button>
                    </div>
                </header>

                {saved && (
                    <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        Doctor saved successfully.
                    </div>
                )}
                {errors.submit && (
                    <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {errors.submit}
                    </div>
                )}

                <div className="space-y-5">
                    {/* 1. personal */}
                    <Card icon={User} title="Personal details" desc="Basic identity shown on the doctor card.">
                        <div className="mb-6 flex flex-wrap items-center gap-5">
                            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                                {preview ? (
                                    <img src={preview} alt="Doctor preview" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-8 w-8 text-slate-300" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                        <Upload className="h-4 w-4 text-blue-500" />
                                        Upload photo
                                        <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
                                    </label>
                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={removePhoto}
                                            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-400 hover:text-rose-500"
                                            aria-label="Remove photo"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="mt-2 text-xs text-slate-400">Square JPG or PNG, at least 400×400px, under 2MB.</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="First name" required error={errors.firstName} className="" >
                                <div data-error={!!errors.firstName}>
                                    <Input value={form.firstName} error={errors.firstName}
                                        onChange={(e) => set("firstName", e.target.value)} placeholder="Ahmed" />
                                </div>
                            </Field>
                            <Field label="Last name" required error={errors.lastName}>
                                <Input value={form.lastName} error={errors.lastName}
                                    onChange={(e) => set("lastName", e.target.value)} placeholder="Hasan" />
                            </Field>
                            <Field label="Email" required error={errors.email}>
                                <Input type="email" value={form.email} error={errors.email}
                                    onChange={(e) => set("email", e.target.value)} placeholder="ahmed.hasan@clinic.com" />
                            </Field>
                            <Field label="Phone" required error={errors.phone}>
                                <Input value={form.phone} error={errors.phone} inputMode="numeric"
                                    onChange={(e) => set("phone", e.target.value)} placeholder="01712345678" />
                            </Field>
                            <Field label="Gender" required error={errors.gender}>
                                <Select value={form.gender} error={errors.gender} onChange={(e) => set("gender", e.target.value)}>
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Select>
                            </Field>
                            <Field label="Date of birth">
                                <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
                            </Field>
                            <Field label="National ID" hint="Optional, used for internal records only.">
                                <Input value={form.nid} onChange={(e) => set("nid", e.target.value)} placeholder="1990123456789" />
                            </Field>
                            <Field label="Languages spoken" className="sm:col-span-1">
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {LANGUAGES.map((l) => (
                                        <Chip key={l} active={form.languages.includes(l)} onClick={() => toggleIn("languages", l)}>
                                            {l}
                                        </Chip>
                                    ))}
                                </div>
                            </Field>
                            <Field label="Short bio" className="sm:col-span-2"
                                hint="One or two sentences patients will read on the profile page.">
                                <textarea
                                    rows={3}
                                    value={form.bio}
                                    onChange={(e) => set("bio", e.target.value)}
                                    placeholder="Consultant cardiologist with a focus on preventive care and heart failure management."
                                    className={`${inputBase} resize-none border-slate-200`}
                                />
                            </Field>
                        </div>
                    </Card>

                    {/* 2. professional */}
                    <Card icon={Briefcase} title="Professional details" desc="Specialty, credentials and where the doctor practises.">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Department" required error={errors.department}>
                                <Select value={form.department} error={errors.department}
                                    onChange={(e) => set("department", e.target.value)}>
                                    <option value="">Select department</option>
                                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                </Select>
                            </Field>
                            <Field label="Designation" hint="Shown under the name, e.g. Cardiologist.">
                                <Input value={form.designation} onChange={(e) => set("designation", e.target.value)}
                                    placeholder="Consultant Cardiologist" />
                            </Field>
                            <Field label="BMDC registration no." required error={errors.bmdc}>
                                <Input value={form.bmdc} error={errors.bmdc}
                                    onChange={(e) => set("bmdc", e.target.value)} placeholder="A-12345" />
                            </Field>
                            <Field label="Years of experience" required error={errors.experience}>
                                <Input type="number" min="0" max="60" value={form.experience} error={errors.experience}
                                    onChange={(e) => set("experience", e.target.value)} placeholder="10" />
                            </Field>
                            <Field label="Location" required error={errors.location}>
                                <Select value={form.location} error={errors.location} onChange={(e) => set("location", e.target.value)}>
                                    <option value="">Select location</option>
                                    {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                                </Select>
                            </Field>
                            <Field label="Chamber address">
                                <Input value={form.chamber} onChange={(e) => set("chamber", e.target.value)}
                                    placeholder="House 12, Road 5, Dhanmondi" />
                            </Field>
                            <Field label="Degrees" className="sm:col-span-2">
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {DEGREES.map((d) => (
                                        <Chip key={d} active={form.degrees.includes(d)} onClick={() => toggleIn("degrees", d)}>
                                            {d}
                                        </Chip>
                                    ))}
                                </div>
                            </Field>
                        </div>
                    </Card>

                    {/* 2b. education & work history */}
                    <Card icon={GraduationCap} title="Education & Work History" desc="Shown on the doctor's public profile page as timelines.">
                        <div className="space-y-6">
                            {/* Education */}
                            <div>
                                <p className="mb-3 text-sm font-medium text-slate-700">Education</p>
                                <div className="space-y-3">
                                    {form.education.map((ed, i) => (
                                        <div key={ed.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700">Degree {i + 1}</span>
                                                {form.education.length > 1 && (
                                                    <button type="button" onClick={() => removeEducation(ed.id)}
                                                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500">
                                                        <Trash2 className="h-3.5 w-3.5" /> Remove
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid gap-3 sm:grid-cols-4">
                                                <Field label="Degree" className="sm:col-span-1">
                                                    <Select value={ed.degree} onChange={(e) => updateEducation(ed.id, { degree: e.target.value })}>
                                                        <option value="">Select</option>
                                                        {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
                                                    </Select>
                                                </Field>
                                                <Field label="Institution" className="sm:col-span-2">
                                                    <Input value={ed.institution}
                                                        onChange={(e) => updateEducation(ed.id, { institution: e.target.value })}
                                                        placeholder="Dhaka Medical College" />
                                                </Field>
                                                <Field label="Year range" className="sm:col-span-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Input type="number" value={ed.startYear} placeholder="2008"
                                                            onChange={(e) => updateEducation(ed.id, { startYear: e.target.value })} />
                                                        <span className="text-slate-400">–</span>
                                                        <Input type="number" value={ed.endYear} placeholder="2014"
                                                            onChange={(e) => updateEducation(ed.id, { endYear: e.target.value })} />
                                                    </div>
                                                </Field>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addEducation}
                                        className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600">
                                        <Plus className="h-4 w-4" /> Add another degree
                                    </button>
                                </div>
                            </div>

                            {/* Work history */}
                            <div>
                                <p className="mb-3 text-sm font-medium text-slate-700">Work Experience</p>
                                <div className="space-y-3">
                                    {form.workHistory.map((w, i) => (
                                        <div key={w.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700">Position {i + 1}</span>
                                                {form.workHistory.length > 1 && (
                                                    <button type="button" onClick={() => removeWorkHistory(w.id)}
                                                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500">
                                                        <Trash2 className="h-3.5 w-3.5" /> Remove
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid gap-3 sm:grid-cols-4">
                                                <Field label="Job title" className="sm:col-span-1">
                                                    <Input value={w.title}
                                                        onChange={(e) => updateWorkHistory(w.id, { title: e.target.value })}
                                                        placeholder="Consultant Cardiologist" />
                                                </Field>
                                                <Field label="Organization" className="sm:col-span-2">
                                                    <Input value={w.organization}
                                                        onChange={(e) => updateWorkHistory(w.id, { organization: e.target.value })}
                                                        placeholder="Apollo Hospitals, Dhaka" />
                                                </Field>
                                                <Field label="Year range" className="sm:col-span-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Input type="number" value={w.startYear} placeholder="2021"
                                                            onChange={(e) => updateWorkHistory(w.id, { startYear: e.target.value })} />
                                                        <span className="text-slate-400">–</span>
                                                        {w.current ? (
                                                            <span className="flex h-[42px] flex-1 items-center rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500">
                                                                Present
                                                            </span>
                                                        ) : (
                                                            <Input type="number" value={w.endYear} placeholder="2024"
                                                                onChange={(e) => updateWorkHistory(w.id, { endYear: e.target.value })} />
                                                        )}
                                                    </div>
                                                </Field>
                                            </div>
                                            <label className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                                <input type="checkbox" checked={w.current}
                                                    onChange={(e) => updateWorkHistory(w.id, { current: e.target.checked, endYear: e.target.checked ? "" : w.endYear })}
                                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                Currently working here
                                            </label>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addWorkHistory}
                                        className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600">
                                        <Plus className="h-4 w-4" /> Add another position
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 3. fees */}
                    <Card icon={DollarSign} title="Fees" desc="Amounts patients see before booking.">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <Field label="Consultation fee (৳)" required error={errors.consultationFee}>
                                <Input type="number" min="0" value={form.consultationFee} error={errors.consultationFee}
                                    onChange={(e) => set("consultationFee", e.target.value)} placeholder="800" />
                            </Field>
                            <Field label="Follow-up fee (৳)">
                                <Input type="number" min="0" value={form.followUpFee}
                                    onChange={(e) => set("followUpFee", e.target.value)} placeholder="500" />
                            </Field>
                            <Field label="Discount (%)" hint="Leave empty for no discount.">
                                <Input type="number" min="0" max="100" value={form.discount}
                                    onChange={(e) => set("discount", e.target.value)} placeholder="0" />
                            </Field>
                        </div>
                    </Card>

                    {/* 4. availability */}
                    <Card icon={CalendarClock} title="Availability" desc="Weekly chamber hours and booking limits.">
                        <div className="mb-5 grid gap-4 sm:grid-cols-3">
                            <Field label="Slot duration">
                                <Select value={form.slotDuration} onChange={(e) => set("slotDuration", e.target.value)}>
                                    {["15", "20", "30", "45", "60"].map((m) => (
                                        <option key={m} value={m}>{m} minutes</option>
                                    ))}
                                </Select>
                            </Field>
                            <Field label="Max patients per day">
                                <Input type="number" min="1" value={form.maxPatients}
                                    onChange={(e) => set("maxPatients", e.target.value)} />
                            </Field>
                            <Field label="Profile status">
                                <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
                                    <option value="available">Available</option>
                                    <option value="on_leave">On leave</option>
                                    <option value="inactive">Inactive</option>
                                </Select>
                            </Field>
                        </div>

                        <div data-error={!!errors.schedule} className="space-y-3">
                            {form.schedule.map((slot, i) => (
                                <div key={slot.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Time block {i + 1}</span>
                                        {form.schedule.length > 1 && (
                                            <button type="button" onClick={() => removeSlot(slot.id)}
                                                className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500">
                                                <Trash2 className="h-3.5 w-3.5" /> Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        {DAYS.map((d) => (
                                            <Chip key={d.key} active={slot.days.includes(d.key)}
                                                onClick={() => toggleSlotDay(slot.id, d.key)}>
                                                {d.label}
                                            </Chip>
                                        ))}
                                    </div>
                                    <div className="flex flex-wrap items-end gap-4">
                                        <Field label="Starts" className="w-32">
                                            <Input type="time" value={slot.start}
                                                onChange={(e) => updateSlot(slot.id, { start: e.target.value })} />
                                        </Field>
                                        <Field label="Ends" className="w-32">
                                            <Input type="time" value={slot.end}
                                                onChange={(e) => updateSlot(slot.id, { end: e.target.value })} />
                                        </Field>
                                    </div>
                                </div>
                            ))}
                            {errors.schedule && <p className="text-xs text-rose-500">{errors.schedule}</p>}
                            <button type="button" onClick={addSlot}
                                className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600">
                                <Plus className="h-4 w-4" /> Add another time block
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button type="button" onClick={reset}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                        Cancel
                    </button>
                    <button type="submit" disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                        <Save className="h-4 w-4" />
                        {saving ? "Saving…" : "Save doctor"}
                    </button>
                </div>
            </form>
        </div>
    );
}