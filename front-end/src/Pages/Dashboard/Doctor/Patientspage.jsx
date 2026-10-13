import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Search,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  CalendarDays,
  Clock,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Leaf,
  Loader2,
  X,
  FileText,
  MessageSquare,
  FilePlus2,
} from "lucide-react";

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/initials/svg?backgroundType=gradientLinear&seed=";
const PAGE_SIZE = 10;

const patientScopes = ["All Patients", "Seen this week"];
const statuses = ["All Status", "Upcoming", "Visited"];

/* ---------------- helpers ---------------- */

const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

function Avatar({ name, size = "h-12 w-12" }) {
  return <img src={`${DEFAULT_AVATAR}${encodeURIComponent(name || "Patient")}`} alt={name} className={`${size} shrink-0 rounded-full object-cover`} />;
}

function Card({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-blue-100/70 bg-white shadow-[0_1px_2px_rgba(30,64,175,0.04),0_8px_24px_-12px_rgba(30,64,175,0.12)] ${className}`}>
      {children}
    </section>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Upcoming: "bg-emerald-100 text-emerald-600",
    Visited: "bg-slate-100 text-[#4A5568]",
  }[status] || "bg-slate-100 text-[#4A5568]";
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>{status}</span>;
}

const APPT_STATUS = {
  confirmed: "text-emerald-600",
  pending_payment: "text-amber-600",
  completed: "text-sky-600",
};

function Select({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-lg border border-blue-100 bg-white pl-3 pr-9 text-sm text-[#0A1931] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5568]" />
    </div>
  );
}

/* ---------------- patient detail modal ---------------- */

function PatientModal({ patient, onClose }) {
  const axiosSecure = useAxiosSecure();

  const { data: records, isLoading } = useQuery({
    queryKey: ["patient-records-for-doctor", patient._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/medical-records/patient/${patient._id}`);
      return res.data.records;
    },
  });

  const addRecordLink = `/dashboard/add-medical-record?type=Prescription&patientId=${patient._id}&patientName=${encodeURIComponent(patient.name)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <Avatar name={patient.name} size="h-14 w-14" />
            <div>
              <h3 className="text-base font-bold text-[#0A1931]">{patient.name}</h3>
              <p className="text-xs text-[#4A5568]">ID: #{patient._id.slice(-6)}</p>
              <div className="mt-1"><StatusBadge status={patient.status} /></div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#4A5568] hover:text-[#0A1931]"><X size={18} /></button>
        </div>

        <div className="space-y-5 overflow-y-auto p-5">
          <div className="space-y-1.5 text-sm text-[#4A5568]">
            {patient.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#4A5568]" /> {patient.email}</p>}
            {patient.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#4A5568]" /> {patient.phone}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ["Appointments", patient.totalAppointments],
              ["Completed", patient.completedVisits],
              ["Last visit", patient.lastVisitDate ? formatDate(patient.lastVisitDate) : "—"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] text-[#4A5568]">{label}</p>
                <p className="mt-0.5 text-sm font-semibold text-[#0A1931]">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="mb-2 text-sm font-bold text-[#0A1931]">Appointment History</h4>
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {patient.history.slice(0, 6).map((h) => (
                <li key={h._id} className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="text-[#4A5568]">{formatDate(h.date)} · {h.time_slot}</span>
                  <span className={`font-medium capitalize ${APPT_STATUS[h.status] || "text-[#4A5568]"}`}>{h.status.replace("_", " ")}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-bold text-[#0A1931]">Medical Records</h4>
            {isLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-[#0A1931]" /></div>
            ) : !records?.length ? (
              <p className="rounded-xl bg-slate-50 p-3 text-xs text-[#4A5568]">No records added yet.</p>
            ) : (
              <ul className="space-y-2">
                {records.slice(0, 5).map((r) => (
                  <li key={r._id} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2">
                    <FileText className="h-4 w-4 shrink-0 text-[#0A1931]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#0A1931]">{r.title}</p>
                      <p className="text-[11px] text-[#4A5568]">{r.type} · {formatDate(r.date)}</p>
                    </div>
                    {r.fileUrl && <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-[11px] font-semibold text-[#0A1931] hover:underline">Open</a>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 p-5">
          <Link to="/dashboard/messages" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <MessageSquare className="h-4 w-4" /> Message
          </Link>
          <Link to={addRecordLink} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <FilePlus2 className="h-4 w-4" /> Add Record
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- pagination ---------------- */

function Pagination({ page, setPage, totalPages }) {
  const btn = "flex h-8 min-w-8 items-center justify-center rounded-md border text-sm transition";
  return (
    <nav aria-label="Pagination" className="flex items-center gap-1.5">
      <button disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page" className={`${btn} border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50`}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;
        return (
          <button key={p} onClick={() => setPage(p)} className={`${btn} ${p === page ? "border-blue-600 bg-blue-600 font-semibold text-white" : "border-slate-200 text-slate-600 hover:bg-blue-50"}`}>
            {p}
          </button>
        );
      })}
      <button disabled={page === totalPages} onClick={() => setPage(page + 1)} aria-label="Next page" className={`${btn} border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50`}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

/* ---------------- left column ---------------- */

function PatientList({ patients, onView }) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState(patientScopes[0]);
  const [status, setStatus] = useState(statuses[0]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoKey = keyOf(weekAgo);

    return patients.filter((p) => {
      if (q && ![p.name, p.email, p.phone, p._id].some((v) => v && v.toLowerCase().includes(q))) return false;
      if (status !== "All Status" && p.status !== status) return false;
      if (scope === "Seen this week" && !(p.lastVisitDate && p.lastVisitDate >= weekAgoKey)) return false;
      return true;
    });
  }, [patients, query, scope, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <>
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search patients</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4A5568]" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by name, email or ID..."
              className="h-11 w-full rounded-lg border border-blue-100 bg-white pl-10 pr-3 text-sm text-[#0A1931] placeholder:text-[#4A5568] focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <div className="w-40"><Select label="Patient scope" value={scope} onChange={(v) => { setScope(v); setPage(1); }} options={patientScopes} /></div>
          <div className="w-40"><Select label="Status" value={status} onChange={(v) => { setStatus(v); setPage(1); }} options={statuses} /></div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-blue-50/60 text-xs font-semibold text-[#4A5568]">
                <th className="rounded-l-lg px-4 py-3">Patient</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Last Visit</th>
                <th className="px-4 py-3">Status</th>
                <th className="rounded-r-lg px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((p) => (
                <tr key={p._id}>
                  <td className="border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.name} />
                      <div>
                        <p className="text-sm font-semibold text-[#0A1931]">{p.name}</p>
                        <p className="text-[11px] text-[#4A5568]">ID: #{p._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3">
                    {p.phone && <p className="flex items-center gap-2 text-xs text-[#4A5568]"><Phone className="h-3.5 w-3.5 text-[#4A5568]" /> {p.phone}</p>}
                    {p.email && <p className="mt-1 flex items-center gap-2 text-xs text-[#4A5568]"><Mail className="h-3.5 w-3.5 text-[#4A5568]" /> {p.email}</p>}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3 text-xs">
                    <p className="font-medium text-[#0A1931]">{p.lastVisitDate ? formatDate(p.lastVisitDate) : "No visit yet"}</p>
                    {p.nextAppointment && <p className="text-[#4A5568]">Next: {formatDate(p.nextAppointment.date)}</p>}
                  </td>
                  <td className="border-b border-slate-100 px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="border-b border-slate-100 px-4 py-3 text-center">
                    <button onClick={() => onView(p)} className="rounded-md border border-blue-300 px-5 py-1.5 text-xs font-semibold text-[#0A1931] transition hover:bg-blue-50">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="py-16 text-center text-sm text-[#4A5568]">
              {patients.length === 0 ? "No patients yet. They'll appear here once someone books with you." : "No patients match these filters."}
            </p>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#4A5568]">
              Showing {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} patients
            </p>
            <Pagination page={safePage} setPage={setPage} totalPages={totalPages} />
          </div>
        )}
      </Card>
    </>
  );
}

/* ---------------- sidebar ---------------- */

function PatientOverview({ stats }) {
  const overview = [
    { label: "Total Patients", value: stats.totalPatients, icon: Users, tint: "bg-blue-100 text-blue-600" },
    { label: "Today's Patients", value: stats.todaysPatients, icon: CalendarDays, tint: "bg-sky-100 text-sky-600" },
    { label: "Upcoming", value: stats.upcomingPatients, icon: Clock, tint: "bg-blue-100 text-blue-600" },
    { label: "Completed Visits", value: stats.completedVisits, icon: CheckCircle2, tint: "bg-indigo-100 text-indigo-600" },
  ];
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Users className="h-[18px] w-[18px]" /></span>
        <h2 className="text-base font-bold text-[#0A1931]">Patient Overview</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {overview.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${tint}`}><Icon className="h-5 w-5" /></span>
            <p className="mt-3 text-xs text-[#4A5568]">{label}</p>
            <p className="text-3xl font-bold leading-tight text-[#0A1931]">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentPatients({ patients, onView }) {
  const recent = patients.slice(0, 5);
  return (
    <Card className="p-5">
      <h2 className="mb-3 text-base font-bold text-[#0A1931]">Recent Patients</h2>
      {recent.length === 0 ? (
        <p className="py-4 text-center text-xs text-[#4A5568]">No patients yet.</p>
      ) : (
        <ul className="divide-y divide-[#E2E8F0]">
          {recent.map((p) => (
            <li key={p._id} className="flex items-center gap-3 py-2.5">
              <Avatar name={p.name} size="h-10 w-10" />
              <button onClick={() => onView(p)} className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold text-[#0A1931] hover:text-blue-600">{p.name}</p>
                <p className="text-[11px] text-[#4A5568]">#{p._id.slice(-6)}</p>
              </button>
              <p className="hidden text-[11px] text-[#4A5568] sm:block">{p.lastVisitDate ? formatDate(p.lastVisitDate) : "—"}</p>
              <StatusBadge status={p.status} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function RecordsBanner() {
  return (
    <section className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100 p-5">
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/70">
        <Stethoscope className="h-12 w-12 text-[#0066FE]" strokeWidth={1.5} />
        <Leaf className="absolute right-1 top-3 h-6 w-6 -rotate-12 text-emerald-400" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-sm font-bold leading-snug text-[#0A1931]">Need to add a record?</h3>
        <p className="mt-1 text-xs leading-relaxed text-[#4A5568]">Open a patient and add a prescription, lab report or diagnosis.</p>
        <Link to="/dashboard/messages" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700">
          Go to Messages <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- page ---------------- */

export default function PatientsPage() {
  const axiosSecure = useAxiosSecure();
  const [selected, setSelected] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctor-patients"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/patients/mine");
      return res.data;
    },
  });

  const patients = data?.patients ?? [];
  const stats = data?.stats ?? { totalPatients: 0, todaysPatients: 0, upcomingPatients: 0, completedVisits: 0 };

  return (
    <div className="min-h-screen t p-4 font-sans text-[#0A1931] sm:p-6">
      <div className="mx-auto grid max-w-[1400px] gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <main className="space-y-4">
          <header>
            <h1 className="text-2xl font-bold text-[#0A1931]">Patients</h1>
            <p className="mt-1 text-sm text-[#4A5568]">View and manage your patient list.</p>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-[#0066FE]" /></div>
          ) : isError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">Couldn't load your patients. Please try again.</p>
          ) : (
            <PatientList patients={patients} onView={setSelected} />
          )}
        </main>

        <aside className="space-y-5">
          <PatientOverview stats={stats} />
          <RecentPatients patients={patients} onView={setSelected} />
          <RecordsBanner />
        </aside>
      </div>

      {selected && <PatientModal patient={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}