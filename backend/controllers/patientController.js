import * as appointmentRepo from "../model/appointmentRepository.js";
import * as userRepo from "../model/userRepository.js";
import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";
import * as medicalRecordRepo from "../model/medicalRecordRepository.js";



function todayKey() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export async function getMyPatients(req, res, next) {
    try {
        if (req.user.role !== "doctor" || !req.user.doctorId) {
            return res.status(403).json({ success: false, message: "Doctor account required" });
        }
        const today = todayKey();

        const appointments = await appointmentRepo.findByDoctorId(req.user.doctorId);
        // Exclude cancelled and expired appointments; include completed and scheduled appointments.
        const real = appointments.filter((a) => !["cancelled", "expired"].includes(a.status));

        const byPatient = new Map();
        real.forEach((a) => {
            const key = String(a.patientId);
            if (!byPatient.has(key)) byPatient.set(key, []);
            byPatient.get(key).push(a);
        });

        const users = await userRepo.findUsersByIds([...byPatient.keys()]);
        const userMap = new Map(users.map((u) => [String(u._id), u]));

        const patients = [...byPatient.entries()].map(([id, list]) => {
            const u = userMap.get(id);
            const sorted = [...list].sort((a, b) => (a.date < b.date ? -1 : 1));
            const upcoming = sorted.find((a) => a.date >= today && ["confirmed", "pending_payment"].includes(a.status));
            const past = sorted.filter((a) => a.status === "completed" || a.date < today);
            const lastVisit = past.length ? past[past.length - 1] : null;

            return {
                _id: id,
                name: u?.name || list[0].patientName || "Patient",
                email: u?.email || null,
                phone: u?.phone || list[0].patientPhone || null,
                totalAppointments: list.length,
                completedVisits: list.filter((a) => a.status === "completed").length,
                hasToday: list.some((a) => a.date === today),
                lastVisitDate: lastVisit?.date || null,
                nextAppointment: upcoming ? { date: upcoming.date, time_slot: upcoming.time_slot } : null,
                status: upcoming ? "Upcoming" : "Visited",
                history: [...sorted].reverse().map((a) => ({ _id: a._id, date: a.date, time_slot: a.time_slot, status: a.status })),
            };
        });

        // Sort patients by recent activity.
        const activityOf = (p) => p.nextAppointment?.date && p.nextAppointment.date <= today ? p.nextAppointment.date : p.lastVisitDate || p.nextAppointment?.date || "";
        patients.sort((a, b) => (activityOf(a) > activityOf(b) ? -1 : 1));

        res.json({
            success: true,
            patients,
            stats: {
                totalPatients: patients.length,
                todaysPatients: patients.filter((p) => p.hasToday).length,
                upcomingPatients: patients.filter((p) => p.status === "Upcoming").length,
                completedVisits: patients.reduce((sum, p) => sum + p.completedVisits, 0),
            },
        });
    } catch (err) {
        next(err);
    }
}

function keyOf(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
}

// Combines all patients with a summary of their appointments.
async function buildPatientRows() {
    const db = getDB();
    const today = keyOf(new Date());
    const ninetyAgo = keyOf(daysAgo(90));

    const [users, agg] = await Promise.all([
        db.collection("users")
            .find({ role: { $nin: ["doctor", "admin"] } }, { projection: { name: 1, email: 1, phone: 1, provider: 1, isVerified: 1, createdAt: 1 } })
            .sort({ createdAt: -1 })
            .toArray(),
        db.collection("appointments")
            .aggregate([
                { $match: { status: { $nin: ["cancelled", "expired"] } } },
                {
                    $group: {
                        _id: "$patientId",
                        total: { $sum: 1 },
                        lastVisit: { $max: { $cond: [{ $lte: ["$date", today] }, "$date", null] } },
                        nextVisit: { $min: { $cond: [{ $gte: ["$date", today] }, "$date", null] } },
                    },
                },
            ])
            .toArray(),
    ]);

    const statMap = new Map(agg.map((a) => [String(a._id), a]));

    return users.map((u) => {
        const s = statMap.get(String(u._id));
        const lastVisit = s?.lastVisit || null;
        const nextVisit = s?.nextVisit || null;
        const active = Boolean(nextVisit) || Boolean(lastVisit && lastVisit >= ninetyAgo);
        return {
            _id: String(u._id),
            name: u.name || "Patient",
            email: u.email || null,
            phone: u.phone || null,
            provider: u.provider || "local",
            isVerified: Boolean(u.isVerified),
            joinedAt: u.createdAt || null,
            totalAppointments: s?.total || 0,
            lastVisit,
            status: active ? "Active" : "Inactive",
        };
    });
}

export async function adminListPatients(req, res, next) {
    try {
        const { q, status, from, to, all } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));

        const rows = await buildPatientRows();

        // Calculate a system-wide summary without applying filters.
        const monthAgo = daysAgo(30);
        const stats = {
            total: rows.length,
            newPatients: rows.filter((r) => r.joinedAt && new Date(r.joinedAt) >= monthAgo).length,
            active: rows.filter((r) => r.status === "Active").length,
            inactive: rows.filter((r) => r.status === "Inactive").length,
        };
        const breakdown = {
            email: rows.filter((r) => r.provider === "local").length,
            google: rows.filter((r) => r.provider === "google").length,
            github: rows.filter((r) => r.provider === "github").length,
            verified: rows.filter((r) => r.isVerified).length,
            unverified: rows.filter((r) => !r.isVerified).length,
        };

        const needle = q?.trim().toLowerCase();
        const filtered = rows.filter((r) => {
            if (needle && ![r.name, r.email, r._id].some((v) => v && v.toLowerCase().includes(needle))) return false;
            if (status && r.status !== status) return false;
            if (from && !(r.lastVisit && r.lastVisit >= from)) return false;
            if (to && !(r.lastVisit && r.lastVisit <= to)) return false;
            return true;
        });

        // Return all matching results without pagination for CSV export.
        if (all === "true") {
            return res.json({ success: true, patients: filtered, total: filtered.length, stats, breakdown });
        }

        const total = filtered.length;
        res.json({
            success: true,
            patients: filtered.slice((page - 1) * limit, page * limit),
            total,
            page,
            totalPages: Math.max(1, Math.ceil(total / limit)),
            stats,
            breakdown,
        });
    } catch (err) {
        next(err);
    }
}

export async function adminGetPatient(req, res, next) {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }
        const rows = await buildPatientRows();
        const patient = rows.find((r) => r._id === req.params.id);
        if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

        const [appointments, records] = await Promise.all([
            getDB().collection("appointments").find({ patientId: new ObjectId(req.params.id) }).sort({ date: -1 }).toArray(),
            medicalRecordRepo.findByPatientId(req.params.id),
        ]);

        res.json({
            success: true,
            patient,
            recordCount: records.length,
            appointments: appointments.map((a) => ({
                _id: a._id, date: a.date, time_slot: a.time_slot, doctorName: a.doctorName, status: a.status,
            })),
        });
    } catch (err) {
        next(err);
    }
}