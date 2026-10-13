import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Plus,
    Trash2,
    Paperclip,
    X,
    Loader2,
    Search,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import RecordDetailsModal from "../../../components/records/RecordDetailsModal";
import { RECORD_TYPES, typeMeta, formatDate, recordSummary } from "../../../components/records/recordMeta";

/*
    Doctor page for selecting a patient and adding a prescription, lab report, or diagnosis.
    It can be opened directly from Quick Actions on the Messages page:
    /dashboard/patient-records?patientId=<id>&type=Prescription
*/

const MAX_FILES = 5;
const MAX_FILE_MB = 10;

const inputCls =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const HINTS = {
    Prescription: {
        title: "e.g. Prescription for high blood pressure",
        notesLabel: "Instructions & advice",
        notes: "e.g. Take after meals. Drink plenty of water. Come back in 7 days.",
    },
    "Lab Report": {
        title: "e.g. Complete Blood Count (CBC)",
        notesLabel: "Test details & results summary",
        notes: "e.g. Hemoglobin 13.2 g/dL, all values in normal range.",
    },
    Diagnosis: {
        title: "e.g. Seasonal skin allergy",
        notesLabel: "Diagnosis & treatment plan",
        notes: "e.g. Mild allergic dermatitis. Avoid known triggers and use the cream twice daily.",
    },
};

const emptyMedicine = () => ({ name: "", dosage: "", frequency: "", duration: "" });

const todayLocal = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export default function DoctorPatientRecordsPage() {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [params, setParams] = useSearchParams();

    const [selectedId, setSelectedId] = useState(params.get("patientId") || "");
    const [patientQuery, setPatientQuery] = useState("");

    const [type, setType] = useState(RECORD_TYPES.includes(params.get("type")) ? params.get("type") : "Prescription");
    const [title, setTitle] = useState("");
    const [recordDate, setRecordDate] = useState(todayLocal());
    const [description, setDescription] = useState("");
    const [medicines, setMedicines] = useState([emptyMedicine()]);
    const [attachments, setAttachments] = useState([]);

    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [viewing, setViewing] = useState(null);

    /* ---------- data ---------- */

    const { data: patients = [], isLoading: loadingPatients } = useQuery({
        queryKey: ["doctor-record-patients"],
        queryFn: async () => (await axiosSecure.get("/api/medical-records/my-patients")).data.patients,
    });

    useEffect(() => {
        if (!selectedId && patients.length > 0) setSelectedId(patients[0].patientId);
    }, [patients, selectedId]);

    const selectedPatient = patients.find((p) => p.patientId === selectedId) || null;

    const { data: records = [], isLoading: loadingRecords } = useQuery({
        queryKey: ["doctor-patient-records", selectedId],
        queryFn: async () => (await axiosSecure.get(`/api/medical-records/patient/${selectedId}`)).data.records,
        enabled: Boolean(selectedId),
    });

    const visiblePatients = patients.filter((p) =>
        p.patientName?.toLowerCase().includes(patientQuery.trim().toLowerCase())
    );

    /* ---------- actions ---------- */

    function selectPatient(id) {
        setSelectedId(id);
        setParams({ patientId: id }, { replace: true });
        setError("");
        setSuccess("");
    }

    const updateMedicine = (i, field, value) =>
        setMedicines((list) => list.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));

    async function handleFiles(e) {
        const files = Array.from(e.target.files || []);
        e.target.value = "";
        if (files.length === 0) return;

        setError("");
        const room = MAX_FILES - attachments.length;
        if (files.length > room) setError(`You can attach up to ${MAX_FILES} files.`);

        setUploading(true);
        try {
            for (const file of files.slice(0, Math.max(0, room))) {
                if (file.size > MAX_FILE_MB * 1024 * 1024) {
                    setError(`${file.name} is larger than ${MAX_FILE_MB} MB.`);
                    continue;
                }
                const form = new FormData();
                form.append("file", file);
                const res = await axiosSecure.post("/api/medical-records/upload", form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setAttachments((prev) => [...prev, res.data.attachment]);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed. Try again.");
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!selectedPatient || saving || uploading) return;

        setError("");
        setSuccess("");
        setSaving(true);
        try {
            await axiosSecure.post("/api/medical-records", {
                patientId: selectedPatient.patientId,
                type,
                title,
                description,
                recordDate,
                medicines: type === "Prescription" ? medicines : [],
                attachments,
            });

            queryClient.invalidateQueries({ queryKey: ["doctor-patient-records", selectedPatient.patientId] });
            setTitle("");
            setDescription("");
            setMedicines([emptyMedicine()]);
            setAttachments([]);
            setSuccess(`Saved. ${selectedPatient.patientName} can see this record now.`);
        } catch (err) {
            setError(err.response?.data?.message || "Couldn't save the record. Try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(record) {
        if (!window.confirm(`Delete "${record.title}"? ${selectedPatient?.patientName ?? "The patient"} will no longer see it.`)) return;
        try {
            await axiosSecure.delete(`/api/medical-records/${record._id}`);
            queryClient.invalidateQueries({ queryKey: ["doctor-patient-records", selectedId] });
        } catch (err) {
            setError(err.response?.data?.message || "Couldn't delete the record.");
        }
    }

    const hint = HINTS[type];

    /* ---------- render ---------- */

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-10">
            <div className="mx-auto max-w-6xl">
                <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5">
                    <h1 className="text-2xl font-bold text-slate-900">Patient Records</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Add prescriptions, lab reports and diagnoses. Patients see them in their Medical Records right away.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                    {/* Patients */}
                    <aside className="rounded-2xl bg-white p-4 shadow-sm shadow-slate-900/5 lg:self-start">
                        <h2 className="mb-3 text-sm font-bold text-slate-900">Your patients</h2>
                        <label className="relative mb-3 block">
                            <span className="sr-only">Search patients</span>
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={patientQuery}
                                onChange={(e) => setPatientQuery(e.target.value)}
                                placeholder="Search patients..."
                                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
                            />
                        </label>

                        {loadingPatients && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-blue-600" /></div>}

                        <ul className="max-h-80 space-y-1 overflow-y-auto">
                            {visiblePatients.map((p) => {
                                const active = p.patientId === selectedId;
                                return (
                                    <li key={p.patientId}>
                                        <button
                                            type="button"
                                            onClick={() => selectPatient(p.patientId)}
                                            aria-current={active}
                                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                                        >
                                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-xs font-semibold text-white">
                                                {(p.patientName || "?").split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-medium">{p.patientName}</span>
                                                {p.patientPhone && <span className="block truncate text-xs text-slate-400">{p.patientPhone}</span>}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        {!loadingPatients && patients.length === 0 && (
                            <p className="py-6 text-center text-xs text-slate-400">
                                No patients yet. Patients appear here after they book an appointment with you.
                            </p>
                        )}
                        {!loadingPatients && patients.length > 0 && visiblePatients.length === 0 && (
                            <p className="py-6 text-center text-xs text-slate-400">No patient matches your search.</p>
                        )}
                    </aside>

                    {/* Form + list */}
                    <div className="space-y-6">
                        {!selectedPatient ? (
                            <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-400 shadow-sm shadow-slate-900/5">
                                Choose a patient to add a record.
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5">
                                    <h2 className="text-base font-bold text-slate-900">
                                        New record for {selectedPatient.patientName}
                                    </h2>

                                    {/* Type */}
                                    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Record type">
                                        {RECORD_TYPES.map((t) => {
                                            const meta = typeMeta[t];
                                            const Icon = meta.icon;
                                            const active = t === type;
                                            return (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setType(t)}
                                                    aria-pressed={active}
                                                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
                                                >
                                                    <Icon size={15} /> {t}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px]">
                                        <label className="block">
                                            <span className="mb-1 block text-xs font-medium text-slate-500">Title</span>
                                            <input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                maxLength={120}
                                                placeholder={hint.title}
                                                className={inputCls}
                                            />
                                        </label>
                                        <label className="block">
                                            <span className="mb-1 block text-xs font-medium text-slate-500">Date</span>
                                            <input
                                                type="date"
                                                value={recordDate}
                                                max={todayLocal()}
                                                onChange={(e) => setRecordDate(e.target.value)}
                                                className={inputCls}
                                            />
                                        </label>
                                    </div>

                                    {type === "Prescription" && (
                                        <fieldset className="mt-4">
                                            <legend className="mb-2 text-xs font-medium text-slate-500">Medicines</legend>
                                            <div className="space-y-3">
                                                {medicines.map((m, i) => (
                                                    <div key={i} className="grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                                                        <input
                                                            aria-label={`Medicine ${i + 1} name`}
                                                            value={m.name}
                                                            onChange={(e) => updateMedicine(i, "name", e.target.value)}
                                                            placeholder="Medicine name"
                                                            className={`${inputCls} col-span-2 sm:col-span-1`}
                                                        />
                                                        <input
                                                            aria-label={`Medicine ${i + 1} dosage`}
                                                            value={m.dosage}
                                                            onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
                                                            placeholder="Dosage"
                                                            className={inputCls}
                                                        />
                                                        <input
                                                            aria-label={`Medicine ${i + 1} frequency`}
                                                            value={m.frequency}
                                                            onChange={(e) => updateMedicine(i, "frequency", e.target.value)}
                                                            placeholder="How often"
                                                            className={inputCls}
                                                        />
                                                        <input
                                                            aria-label={`Medicine ${i + 1} duration`}
                                                            value={m.duration}
                                                            onChange={(e) => updateMedicine(i, "duration", e.target.value)}
                                                            placeholder="Duration"
                                                            className={inputCls}
                                                        />
                                                        <button
                                                            type="button"
                                                            aria-label={`Remove medicine ${i + 1}`}
                                                            onClick={() => setMedicines((list) => (list.length === 1 ? [emptyMedicine()] : list.filter((_, idx) => idx !== i)))}
                                                            className="flex h-9 w-9 items-center justify-center self-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            {medicines.length < 20 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setMedicines((list) => [...list, emptyMedicine()])}
                                                    className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                                                >
                                                    <Plus size={14} /> Add medicine
                                                </button>
                                            )}
                                        </fieldset>
                                    )}

                                    <label className="mt-4 block">
                                        <span className="mb-1 block text-xs font-medium text-slate-500">{hint.notesLabel}</span>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            maxLength={3000}
                                            rows={4}
                                            placeholder={hint.notes}
                                            className={`${inputCls} resize-y`}
                                        />
                                    </label>

                                    {/* Files */}
                                    <div className="mt-4">
                                        <span className="mb-1 block text-xs font-medium text-slate-500">
                                            Files (JPG, PNG or PDF, up to {MAX_FILES})
                                        </span>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {attachments.map((a, i) => (
                                                <span key={a.url} className="flex max-w-[220px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
                                                    <Paperclip size={12} className="flex-shrink-0 text-slate-400" />
                                                    <span className="truncate">{a.name}</span>
                                                    <button
                                                        type="button"
                                                        aria-label={`Remove ${a.name}`}
                                                        onClick={() => setAttachments((list) => list.filter((_, idx) => idx !== i))}
                                                        className="text-slate-400 hover:text-rose-500"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ))}

                                            {attachments.length < MAX_FILES && (
                                                <label className={`flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 ${uploading ? "pointer-events-none opacity-60" : ""}`}>
                                                    {uploading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                                                    {uploading ? "Uploading…" : "Add file"}
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/jpeg,image/png,application/pdf"
                                                        onChange={handleFiles}
                                                        className="sr-only"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {error && (
                                        <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> {error}
                                        </p>
                                    )}
                                    {success && (
                                        <p role="status" className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                                            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" /> {success}
                                        </p>
                                    )}

                                    <div className="mt-5 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving || uploading}
                                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {saving && <Loader2 size={15} className="animate-spin" />}
                                            Save record
                                        </button>
                                    </div>
                                </form>

                                {/* Records written by this doctor */}
                                <div className="rounded-2xl bg-white px-6 py-5 shadow-sm shadow-slate-900/5">
                                    <h2 className="text-base font-bold text-slate-900">
                                        Records you've added for {selectedPatient.patientName}
                                    </h2>

                                    {loadingRecords && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-blue-600" /></div>}

                                    {!loadingRecords && records.length === 0 && (
                                        <p className="py-8 text-center text-sm text-slate-400">Nothing added yet.</p>
                                    )}

                                    <div className="mt-2">
                                        {records.map((r) => {
                                            const meta = typeMeta[r.type] ?? typeMeta.Prescription;
                                            const Icon = meta.icon;
                                            const summary = recordSummary(r);
                                            return (
                                                <div key={r._id} className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-0">
                                                    <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${meta.iconBg} ${meta.iconColor}`}>
                                                        <Icon size={18} />
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-slate-900">{r.title}</p>
                                                        <p className="text-xs text-slate-500">{r.type} <span className="mx-1 text-slate-300">•</span> {formatDate(r.recordDate)}</p>
                                                        {summary && <p className="mt-0.5 truncate text-xs text-slate-400">{summary}</p>}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewing(r)}
                                                        className="flex-shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        type="button"
                                                        aria-label={`Delete ${r.title}`}
                                                        onClick={() => handleDelete(r)}
                                                        className="flex-shrink-0 rounded-lg p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <RecordDetailsModal record={viewing} onClose={() => setViewing(null)} />
        </div>
    );
}