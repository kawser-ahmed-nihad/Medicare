import { getDB } from "../db/db.js";
import * as appointmentRepo from "../model/appointmentRepository.js";
import * as medicalRecordRepo from "../model/medicalRecordRepository.js";
import * as doctorRepo from "../model/doctorRepository.js";
import * as conversationRepo from "../model/conversationRepository.js";
import { withPatientNames } from "../utils/enrichAppointments.js";

/* ---------------- Date helpers for "YYYY-MM-DD" values ---------------- */

const pad = (n) => String(n).padStart(2, "0");
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function todayKey() {
    return dayKey(new Date());
}


function lastNDays(n) {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(dayKey(d));
    }
    return days;
}

// Returns today and the following n - 1 days.
function nextNDays(n) {
    const days = [];
    for (let i = 0; i < n; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push(dayKey(d));
    }
    return days;
}

/* ============================= PATIENT ============================= */

export async function getPatientDashboard(req, res, next) {
    try {
        const patientId = req.user._id;
        const today = todayKey();

        const appointments = await appointmentRepo.findByPatientId(patientId);
        const active = appointments.filter((a) => !["cancelled", "expired"].includes(a.status));
        const upcoming = active.filter((a) => a.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1));

        const records = await medicalRecordRepo.findByPatientId(patientId);
        const prescriptions = records.filter((r) => r.type === "Prescription");

        const byDoctor = new Map();
        active.forEach((a) => {
            const existing = byDoctor.get(a.doctorId);
            if (!existing || existing.date < a.date) byDoctor.set(a.doctorId, a);
        });
        const recentDoctorAppointments = [...byDoctor.values()].sort((a, b) => (a.date > b.date ? -1 : 1)).slice(0, 4);

        const recentDoctors = await Promise.all(
            recentDoctorAppointments.map(async (a) => {
                const doc = await doctorRepo.findDoctorById(a.doctorId);
                return {
                    doctorId: a.doctorId,
                    name: a.doctorName,
                    specialty: doc?.designation || doc?.department || "",
                    photoUrl: doc?.photoUrl || null,
                    lastVisit: a.date,
                };
            })
        );

        let nextAppointment = null;
        if (upcoming[0]) {
            const doc = await doctorRepo.findDoctorById(upcoming[0].doctorId);
            nextAppointment = { ...upcoming[0], doctorPhoto: doc?.photoUrl || null, doctorRating: doc?.rating ?? null, doctorReviewCount: doc?.reviewCount ?? 0 };
        }

        res.json({
            success: true,
            stats: {
                upcomingCount: upcoming.length,
                doctorsVisited: byDoctor.size,
                totalRecords: records.length,
                activePrescriptions: prescriptions.length,

            },
            nextAppointment,
            recentDoctors,
        });
    } catch (err) {
        next(err);
    }
}

/* ============================= DOCTOR ============================== */

export async function getDoctorDashboard(req, res, next) {
    try {
        if (req.user.role !== "doctor" || !req.user.doctorId) {
            return res.status(403).json({ success: false, message: "Doctor account required" });
        }
        const doctorId = req.user.doctorId;
        const today = todayKey();
        const pastDays7 = lastNDays(7);     // prescriptions
        const upcomingDays7 = nextNDays(7); // appointment chart 

        const appointments = await appointmentRepo.findByDoctorId(doctorId);
        const active = appointments.filter((a) => !["cancelled", "expired"].includes(a.status));
        const todays = active.filter((a) => a.date === today);
        const distinctPatientIds = new Set(active.map((a) => String(a.patientId)));

        const records = await medicalRecordRepo.findByDoctorId(doctorId);
        const prescriptionsThisWeek = records.filter((r) => pastDays7.includes(r.date) && r.type === "Prescription");

        // Approximate unread status based on the most recent message sender.

        const conversations = await conversationRepo.findForDoctor(doctorId);
        const awaitingReply = conversations.filter((c) => c.lastSenderRole === "patient").length;

        const weekly = upcomingDays7.map((date) => ({
            day: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" }),
            date,
            count: active.filter((a) => a.date === date).length,
        }));

        const visitCount = new Map();
        active.forEach((a) => {
            const k = String(a.patientId);
            visitCount.set(k, (visitCount.get(k) || 0) + 1);
        });
        let newPatients = 0, returningPatients = 0;
        visitCount.forEach((c) => (c === 1 ? newPatients++ : returningPatients++));

        const upcoming = active
            .filter((a) => a.date >= today && a.status === "confirmed")
            .sort((a, b) =>
                a.date === b.date
                    ? (a.time_slot || "").localeCompare(b.time_slot || "")
                    : a.date < b.date ? -1 : 1
            )
            .slice(0, 6);

        const byPatient = new Map();
        active.forEach((a) => {
            const key = String(a.patientId);
            const existing = byPatient.get(key);
            if (!existing || existing.date < a.date) byPatient.set(key, a);
        });
        const recentPatients = [...byPatient.values()].sort((a, b) => (a.date > b.date ? -1 : 1)).slice(0, 6);

        const profile = await doctorRepo.findDoctorById(doctorId);

        // Populate each appointment's patientName from the users collection.
        const [upcomingNamed, recentPatientsNamed] = await Promise.all([
            withPatientNames(upcoming),
            withPatientNames(recentPatients),
        ]);

        res.json({
            success: true,
            profile,
            stats: {
                totalPatients: distinctPatientIds.size,
                todaysAppointments: todays.length,
                awaitingReply,
                prescriptionsThisWeek: prescriptionsThisWeek.length,
            },
            weekly,
            patientMix: { new: newPatients, returning: returningPatients },
            upcoming: upcomingNamed,
            recentPatients: recentPatientsNamed,
        });
    } catch (err) {
        next(err);
    }

}

/* ============================= ADMIN ============================== */

export async function getAdminDashboard(req, res, next) {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Admin account required" });
        }
        const db = getDB();
        const today = todayKey();
        const rangeDays = Number(req.query.days) === 14 ? 14 : 7;
        const trendDays = lastNDays(rangeDays);

        const [totalPatients, totalDoctors, allAppointments, totalPrescriptions, pendingReplies, recentDoctorRegs, recentRecords] = await Promise.all([
            db.collection("users").countDocuments({ role: { $nin: ["doctor", "admin"] } }),
            db.collection("doctors").countDocuments({}),
            db.collection("appointments").find({}).toArray(),
            db.collection("medical_records").countDocuments({ type: "Prescription" }),
            db.collection("conversations").countDocuments({ lastSenderRole: "patient" }),
            db.collection("users").find({ role: "doctor" }).sort({ createdAt: -1 }).limit(5).toArray(),
            db.collection("medical_records").find({}).sort({ createdAt: -1 }).limit(5).toArray(),
        ]);

        const active = allAppointments.filter((a) => !["cancelled", "expired"].includes(a.status));
        const todaysAppointments = active.filter((a) => a.date === today);

        const trend = trendDays.map((date) => ({
            date,
            patients: new Set(active.filter((a) => a.date === date).map((a) => String(a.patientId))).size,
            appointments: active.filter((a) => a.date === date).length,
        }));

        const byDept = new Map();
        active.forEach((a) => {
            const dept = a.doctorDepartment || "Others";
            byDept.set(dept, (byDept.get(dept) || 0) + 1);
        });
        const departments = [...byDept.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

        // Count new and returning patients.
        const visitCount = new Map();
        active.forEach((a) => {
            const k = String(a.patientId);
            visitCount.set(k, (visitCount.get(k) || 0) + 1);
        });
        let newPatients = 0, returningPatients = 0;
        visitCount.forEach((c) => (c === 1 ? newPatients++ : returningPatients++));

        const recentRaw = [...allAppointments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
        const recentAppointments = await withPatientNames(recentRaw);
        const activityAppts = await withPatientNames(allAppointments.slice(-5));

        const activity = [
            ...activityAppts.map((a) => ({ type: "appointment", title: "Appointment booked", detail: `${a.doctorName} — ${a.patientName || "Patient"}`, time: a.createdAt })),
            ...recentRecords.map((r) => ({ type: "record", title: `${r.type} added`, detail: `For: ${r.patientName || "a patient"}`, time: r.createdAt })),
            ...recentDoctorRegs.map((d) => ({ type: "doctor", title: "New doctor registered", detail: d.name, time: d.createdAt })),
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

        res.json({
            success: true,
            stats: { totalPatients, totalDoctors, todaysAppointments: todaysAppointments.length, totalPrescriptions, pendingReplies },
            trend,
            departments,
            patientMix: { new: newPatients, returning: returningPatients },
            recentAppointments,
            activity,
        });
    } catch (err) {
        next(err);
    }
}