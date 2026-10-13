import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import {
    FileText,
    FlaskConical,
    ClipboardList,
    ChevronLeft,
    Upload,
    X,
    Save,
    Loader2,
    Check,
    User,
} from "lucide-react";

const RECORD_TYPES = [
    { value: "Prescription", icon: FileText, tint: "bg-sky-50 text-blue-600 border-blue-200" },
    { value: "Lab Report", icon: FlaskConical, tint: "bg-purple-50 text-purple-600 border-purple-200" },
    { value: "Diagnosis", icon: ClipboardList, tint: "bg-teal-50 text-teal-600 border-teal-200" },
];

// Use the local date to stay consistent with the backend's todayKey()/lastNDays().
// new Date().toISOString() returns UTC, which can produce a different date near midnight
// and cause records to disappear from the dashboard if it does not match the backend's "today".
const todayLocal = () => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const Field = ({ label, required, error, hint, children }) => (
    <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {children}
        {error ? <p className="mt-1.5 text-xs text-rose-500">{error}</p> : hint ? <p className="mt-1.5 text-xs text-slate-400">{hint}</p> : null}
    </div>
);

const inputBase = "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

export default function AddMedicalRecord() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const patientId = searchParams.get("patientId");
    const patientName = searchParams.get("patientName");
    const presetType = searchParams.get("type");

    const [type, setType] = useState(RECORD_TYPES.some((t) => t.value === presetType) ? presetType : "Prescription");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(todayLocal()); // Fix: use the local date, not UTC.
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const onFile = (e) => {
        const f = e.target.files?.[0];
        if (f) setFile(f);
    };

    const validate = () => {
        const e = {};
        if (!patientId) e.patient = "No patient selected. Please open this form from a patient's conversation in Messages.";
        if (!title.trim()) e.title = "Title is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            patientId,
            patientName: patientName || null, // Fix: include this for the admin Recent Activity feed; it was not sent before.
            doctorName: user?.name,
            type,
            title: title.trim(),
            description: description.trim() || null,
            date,
        };

        const body = new FormData();
        body.append("data", JSON.stringify(payload));
        if (file) body.append("file", file);

        try {
            setSaving(true);
            await axiosSecure.post("/api/medical-records", body);
            setSaved(true);
            setTimeout(() => navigate(-1), 1200);
        } catch (err) {
            setErrors((prev) => ({ ...prev, submit: err.response?.data?.message || "Failed to save record. Please try again." }));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-5 lg:p-8">
            <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
                <button type="button" onClick={() => navigate(-1)} className="mb-2 flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
                    <ChevronLeft className="h-4 w-4" /> Back
                </button>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Medical Record</h1>
                <p className="mt-1 text-sm text-slate-500">Add a prescription, lab report, or diagnosis to a patient's medical history.</p>

                <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:p-6">
                    {/* Patient */}
                    {patientId ? (
                        <div className="mb-5 flex items-center gap-3 rounded-xl bg-blue-50 p-3.5">
                            <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-blue-600">
                                <User className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-xs text-blue-500">Adding record for</p>
                                <p className="text-sm font-semibold text-slate-800">{patientName || "Patient"}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-700">
                            No patient selected. Please open this form from a patient's conversation in{" "}
                            <Link to="/dashboard/messages" className="font-semibold underline">Messages</Link>.
                        </div>
                    )}

                    <div className="space-y-5">
                        <Field label="Record Type" required>
                            <div className="grid grid-cols-3 gap-2">
                                {RECORD_TYPES.map((t) => {
                                    const Icon = t.icon;
                                    const active = type === t.value;
                                    return (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => setType(t.value)}
                                            className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-medium transition ${active ? t.tint : "border-slate-200 text-slate-500 hover:border-slate-300"
                                                }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            {t.value}
                                        </button>
                                    );
                                })}
                            </div>
                        </Field>

                        <Field label="Title" required error={errors.title}>
                            <input
                                value={title}
                                onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
                                placeholder={type === "Prescription" ? "e.g. Medicine for high blood pressure" : type === "Lab Report" ? "e.g. Complete Blood Count (CBC)" : "e.g. Migraine assessment"}
                                className={`${inputBase} ${errors.title ? "border-rose-300" : "border-slate-200"}`}
                            />
                        </Field>

                        <Field label="Description" hint="Dosage, instructions, findings, or notes the patient should see.">
                            <textarea
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Write details here..."
                                className={`${inputBase} resize-none border-slate-200`}
                            />
                        </Field>

                        <Field label="Date" required>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${inputBase} border-slate-200`} />
                        </Field>

                        <Field label="Attachment" hint="Optional — a scanned prescription, lab PDF, or report image (max 10MB).">
                            {file ? (
                                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm">
                                    <span className="truncate text-slate-700">{file.name}</span>
                                    <button type="button" onClick={() => setFile(null)} className="text-slate-400 hover:text-rose-500">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3.5 py-2.5 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600">
                                    <Upload className="h-4 w-4" />
                                    Upload file
                                    <input type="file" accept="image/*,application/pdf" onChange={onFile} className="hidden" />
                                </label>
                            )}
                        </Field>
                    </div>

                    {errors.patient && <p className="mt-4 text-xs text-rose-500">{errors.patient}</p>}
                    {errors.submit && (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errors.submit}</div>
                    )}
                </div>

                <div className="mt-5 flex justify-end gap-3">
                    <button type="button" onClick={() => navigate(-1)} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || !patientId}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {saved ? <Check className="h-4 w-4" /> : saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saved ? "Saved" : saving ? "Saving…" : "Save Record"}
                    </button>
                </div>
            </form>
        </div>
    );
}
