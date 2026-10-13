import * as appointmentRepo from "../model/appointmentRepository.js";
import * as doctorRepo from "../model/doctorRepository.js";
import { createPaymentSession } from "../utils/sslcommerz.js";
import { sendAppointmentConfirmationEmail } from "../utils/appointmentEmails.js";
import * as conversationRepo from "../model/conversationRepository.js";
import { sendNotification } from "../utils/notify.js";
import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";
import { withPatientNames } from "../utils/enrichAppointments.js";
import { notifyDoctor, notifyPatient } from "../utils/appointmentNotifications.js";


export async function createAppointment(req, res, next) {
    try {
        const { doctorId, date, time_slot, payment_method } = req.body;

        if (!doctorId || !date || !time_slot) {
            return res.status(400).json({ success: false, message: "doctorId, date and time_slot are required" });
        }
        if (!["online", "cash"].includes(payment_method)) {
            return res.status(400).json({ success: false, message: "payment_method must be 'online' or 'cash'" });
        }

        const doctor = await doctorRepo.findDoctorById(doctorId);
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
        if (doctor.status !== "available") {
            return res.status(400).json({ success: false, message: "This doctor isn't accepting appointments right now" });
        }

        const clash = await appointmentRepo.findActiveByDoctorSlot(doctorId, date, time_slot);
        if (clash) {
            return res.status(409).json({ success: false, message: "This time slot was just taken. Please pick another." });
        }

        const appointment = await appointmentRepo.create({
            doctorId,
            doctorName: `Dr. ${doctor.first_name} ${doctor.last_name}`,
            doctorDepartment: doctor.designation || doctor.department,
            doctorLocation: doctor.chamber_address || doctor.location,
            patientId: req.user._id,
            patientName: req.user.name,
            patientPhone: req.user.phone || null,
            date,
            time_slot,
            duration_minutes: doctor.slot_duration_minutes,
            consultation_fee: doctor.consultation_fee,
            payment_method,
            status: payment_method === "online" ? "pending_payment" : "confirmed",
            payment_status: "unpaid",
        });

        if (payment_method === "cash") {
            sendAppointmentConfirmationEmail(appointment._id);
            conversationRepo.findOrCreate({
                doctorId,
                patientId: req.user._id,
                doctorName: appointment.doctorName,
                patientName: req.user.name,
                patientPhone: req.user.phone || null,
            }).catch((err) => console.error("Failed to create conversation:", err.message));

            sendNotification({
                userId: req.user._id,
                type: "appointment",
                title: "Appointment Confirmed",
                description: `Your appointment with ${appointment.doctorName} is confirmed for ${appointment.date} at ${appointment.time_slot}.`,
                link: "/dashboard/my-appointments",
            });

            notifyDoctor(appointment, {
                title: "New Appointment",
                description: `${req.user.name || "A patient"} booked ${appointment.date} at ${appointment.time_slot}.`,
            });
        }

        if (payment_method === "online") {
            try {
                const gatewayUrl = await createPaymentSession(appointment, req.user);
                return res.status(201).json({ success: true, appointment, gatewayUrl });
            } catch (err) {
                // console.error("SSLCommerz session creation failed:", err.message); 
                await appointmentRepo.updateById(appointment._id, { status: "cancelled" });
                return res.status(502).json({
                    success: false,
                    message: "Could not start the payment process. Please try again.",
                });
            }
        }

        res.status(201).json({ success: true, appointment });
    } catch (err) {
        next(err);
    }
}

export async function getMyAppointments(req, res, next) {
    try {
        const appointments = await appointmentRepo.findByPatientId(req.user._id);
        res.json({ success: true, appointments });
    } catch (err) {
        next(err);
    }
}

export async function getAppointmentById(req, res, next) {
    try {
        const appointment = await appointmentRepo.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });
        if (String(appointment.patientId) !== String(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }
        res.json({ success: true, appointment });
    } catch (err) {
        next(err);
    }
}

export async function cancelAppointment(req, res, next) {
    try {
        const appointment = await appointmentRepo.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

        const isOwningDoctor = req.user.role === "doctor" && String(req.user.doctorId) === String(appointment.doctorId);
        const isOwningPatient = String(appointment.patientId) === String(req.user._id);

        if (!isOwningPatient && !isOwningDoctor && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not allowed to cancel this appointment" });
        }
        await appointmentRepo.updateById(req.params.id, { status: "cancelled" });

        const byPatient = String(appointment.patientId) === String(req.user._id);
        const when = `${appointment.date} at ${appointment.time_slot}`;

        if (byPatient) {
            notifyDoctor(appointment, {
                title: "Appointment Cancelled",
                description: `${appointment.patientName || "A patient"} cancelled the visit on ${when}.`,
            });
        } else {
            notifyPatient(appointment, {
                title: "Appointment Cancelled",
                description: `Your appointment with ${appointment.doctorName} on ${when} was cancelled.`,
            });
        }

        res.json({ success: true, message: "Appointment cancelled" });
    } catch (err) {
        next(err);
    }
}

export async function getDoctorAppointments(req, res, next) {
    try {
        if (req.user.role !== "doctor" || !req.user.doctorId) {
            return res.status(403).json({ success: false, message: "Doctor account required" });
        }
        const appointments = await appointmentRepo.findByDoctorId(req.user.doctorId);
        res.json({ success: true, appointments: await withPatientNames(appointments) });
    } catch (err) {
        next(err);
    }
}

export async function markAppointmentCompleted(req, res, next) {
    try {
        const appointment = await appointmentRepo.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

        const isOwningDoctor = req.user.role === "doctor" && String(req.user.doctorId) === String(appointment.doctorId);
        if (!isOwningDoctor && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }
        if (appointment.status !== "confirmed") {
            return res.status(400).json({ success: false, message: "Only confirmed appointments can be marked completed" });
        }

        await appointmentRepo.updateById(appointment._id, { status: "completed" });
        res.json({ success: true, message: "Appointment marked as completed" });
    } catch (err) {
        next(err);
    }
}


function keyOf(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function displayStatus(a, today) {
    if (a.status === "completed") return "Completed";
    if (a.status === "cancelled") return "Cancelled";
    if (a.status === "expired") return "Expired";
    if (a.status === "pending_payment") return "Pending Payment";
    return a.date >= today ? "Upcoming" : "Awaiting Completion"; // Applies to confirmed appointments.
}

export async function adminListAppointments(req, res, next) {
    try {
        const db = getDB();
        const today = keyOf(new Date());
        const { q, status, doctorId, specialty, from, to, all } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));

        const filter = {};

        // Filter by appointment status.
        let gte = from || null;
        if (status === "Upcoming") {
            filter.status = "confirmed";
            gte = gte && gte > today ? gte : today;
        } else if (status === "Completed") filter.status = "completed";
        else if (status === "Pending Payment") filter.status = "pending_payment";
        else if (status === "Cancelled") filter.status = { $in: ["cancelled", "expired"] };

        // Filter by appointment date range.
        const dateCond = {};
        if (gte) dateCond.$gte = gte;
        if (to) dateCond.$lte = to;
        if (Object.keys(dateCond).length) filter.date = dateCond;

        if (doctorId) filter.doctorId = String(doctorId);
        if (specialty) filter.doctorDepartment = specialty;

        // Search by patient name, doctor name, patient email, or appointment ID.
        if (q) {
            const rx = { $regex: escapeRegex(q), $options: "i" };
            const users = await db.collection("users")
                .find({ $or: [{ name: rx }, { email: rx }] }, { projection: { _id: 1 } })
                .limit(200)
                .toArray();
            const or = [{ patientName: rx }, { doctorName: rx }, { patientId: { $in: users.map((u) => u._id) } }];
            if (/^[0-9a-fA-F]{24}$/.test(q)) or.push({ _id: new ObjectId(q) });
            filter.$or = or;
        }

        const [total, completed, upcoming, cancelled, doctors, specialties] = await Promise.all([
            db.collection("appointments").countDocuments({}),
            db.collection("appointments").countDocuments({ status: "completed" }),
            db.collection("appointments").countDocuments({ status: { $in: ["confirmed", "pending_payment"] }, date: { $gte: today } }),
            db.collection("appointments").countDocuments({ status: { $in: ["cancelled", "expired"] } }),
            db.collection("appointments").aggregate([{ $group: { _id: "$doctorId", name: { $first: "$doctorName" } } }, { $sort: { name: 1 } }]).toArray(),
            db.collection("appointments").distinct("doctorDepartment"),
        ]);

        const matchedCount = await db.collection("appointments").countDocuments(filter);
        let cursor = db.collection("appointments").find(filter).sort({ date: -1, createdAt: -1 });
        if (all !== "true") cursor = cursor.skip((page - 1) * limit).limit(limit);
        const raw = await cursor.toArray();

        const named = await withPatientNames(raw);
        const appointments = named.map((a) => ({
            _id: String(a._id),
            patientId: String(a.patientId),
            patientName: a.patientName,
            patientPhone: a.patientPhone,
            doctorId: a.doctorId,
            doctorName: a.doctorName,
            specialty: a.doctorDepartment || null,
            date: a.date,
            time_slot: a.time_slot,
            duration_minutes: a.duration_minutes,
            consultation_fee: a.consultation_fee,
            payment_method: a.payment_method,
            payment_status: a.payment_status,
            status: a.status,
            displayStatus: displayStatus(a, today),
        }));

        res.json({
            success: true,
            appointments,
            total: matchedCount,
            page,
            totalPages: Math.max(1, Math.ceil(matchedCount / limit)),
            stats: { total, completed, upcoming, cancelled },
            doctors: doctors.map((d) => ({ id: d._id, name: d.name })),
            specialties: specialties.filter(Boolean).sort(),
        });
    } catch (err) {
        next(err);
    }
}

// Mini calendar 
export async function adminAppointmentCalendar(req, res, next) {
    try {
        const month = /^\d{4}-\d{2}$/.test(req.query.month || "") ? req.query.month : keyOf(new Date()).slice(0, 7);
        const rows = await getDB().collection("appointments").aggregate([
            { $match: { date: { $regex: `^${month}` }, status: { $nin: ["cancelled", "expired"] } } },
            { $group: { _id: "$date", count: { $sum: 1 } } },
        ]).toArray();
        res.json({ success: true, days: rows.map((r) => ({ date: r._id, count: r.count })) });
    } catch (err) {
        next(err);
    }
}