import { createPaymentSession, validatePayment } from "../utils/sslcommerz.js";
import * as appointmentRepo from "../model/appointmentRepository.js";
import { sendAppointmentConfirmationEmail } from "../utils/appointmentEmails.js";
import * as conversationRepo from "../model/conversationRepository.js";
import { sendNotification } from "../utils/notify.js";
import { getDB } from "../db/db.js";
import { withPatientNames } from "../utils/enrichAppointments.js";

export async function initiatePayment(req, res, next) {
    try {
        const appointment = await appointmentRepo.findById(req.params.appointmentId);
        if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

        // Only allow payment for appointments owned by the current user.
        if (String(appointment.patientId) !== String(req.user._id)) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }
        if (appointment.payment_status === "paid") {
            return res.status(400).json({ success: false, message: "This appointment is already paid" });
        }

        const gatewayUrl = await createPaymentSession(appointment, req.user);
        res.json({ success: true, gatewayUrl });
    } catch (err) {
        next(err);
    }
}

export async function paymentSuccess(req, res) {
    try {
        const { tran_id, val_id } = req.body;
        const appointment = await appointmentRepo.findById(tran_id);
        if (!appointment) {
            return res.redirect(`${process.env.CLIENT_URL}/booking/failed?reason=not_found`);
        }

        const alreadyPaid = appointment.payment_status === "paid"; // Prevent duplicate confirmation emails.

        const validation = await validatePayment(val_id);
        const isValid = ["VALID", "VALIDATED"].includes(validation.status);
        const amountOk = Number(validation.amount) >= Number(appointment.consultation_fee);

        if (isValid && amountOk) {
            await appointmentRepo.updateById(tran_id, {
                status: "confirmed",
                payment_status: "paid",
                payment_reference: val_id,
                payment_channel: validation.card_type || null, // Store the gateway's payment channel, such as "BKASH-Bkash" or "VISA-Dutch Bangla".
                paid_at: new Date(),
            });
            if (!alreadyPaid) {
                sendAppointmentConfirmationEmail(tran_id); // Send the confirmation email only for newly paid appointments.
                conversationRepo.findOrCreate({
                    doctorId: appointment.doctorId,
                    patientId: appointment.patientId,
                    doctorName: appointment.doctorName,
                    patientName: appointment.patientName,
                    patientPhone: appointment.patientPhone,
                }).catch((err) => console.error("Failed to create conversation:", err.message));

                sendNotification({
                    userId: appointment.patientId,
                    type: "appointment",
                    title: "Appointment Confirmed",
                    description: `Your appointment with ${appointment.doctorName} is confirmed for ${appointment.date} at ${appointment.time_slot}.`,
                    link: "/dashboard/my-appointments",
                });
            }
            return res.redirect(`${process.env.CLIENT_URL}/booking/success?appointmentId=${tran_id}`);
        }

        return res.redirect(`${process.env.CLIENT_URL}/booking/failed?appointmentId=${tran_id}`);
    } catch (err) {
        console.error("paymentSuccess error:", err);
        return res.redirect(`${process.env.CLIENT_URL}/booking/failed`);
    }
}

export async function paymentFail(req, res) {
    try {
        const { tran_id } = req.body;
        if (tran_id) {
            await appointmentRepo.updateById(tran_id, { status: "cancelled", payment_status: "unpaid" });
        }
        res.redirect(`${process.env.CLIENT_URL}/booking/failed?appointmentId=${tran_id || ""}`);
    } catch (err) {
        console.error("paymentFail error:", err);
        res.redirect(`${process.env.CLIENT_URL}/booking/failed`);
    }
}

export async function paymentCancel(req, res) {
    try {
        const { tran_id } = req.body;
        if (tran_id) {
            await appointmentRepo.updateById(tran_id, { status: "cancelled", payment_status: "unpaid" });
        }
        res.redirect(`${process.env.CLIENT_URL}/booking/cancelled?appointmentId=${tran_id || ""}`);
    } catch (err) {
        console.error("paymentCancel error:", err);
        res.redirect(`${process.env.CLIENT_URL}/booking/cancelled`);
    }
}

// Treat IPN as the source of truth: the user may close the browser before reaching the success URL,
// while the gateway sends IPN requests directly to the server.
export async function paymentIPN(req, res) {
    try {
        const { tran_id, val_id } = req.body;
        const appointment = await appointmentRepo.findById(tran_id);
        const alreadyPaid = appointment?.payment_status === "paid";

        const validation = await validatePayment(val_id);
        const isValid = ["VALID", "VALIDATED"].includes(validation.status);

        if (isValid) {
            await appointmentRepo.updateById(tran_id, {
                status: "confirmed",
                payment_status: "paid",
                payment_reference: val_id,
            });
            if (!alreadyPaid) sendAppointmentConfirmationEmail(tran_id); // Send the confirmation email only for newly paid appointments.
        }
        res.sendStatus(200);
    } catch (err) {
        console.error("paymentIPN error:", err);
        res.sendStatus(500);
    }
}

/* ---------------- admin: payments & revenue ---------------- */

const REVENUE = {
    $or: [
        { payment_method: "online", payment_status: "paid", status: { $nin: ["cancelled", "refund_required"] } },
        { payment_method: "cash", status: "completed" },
    ],
};
const REFUND = { payment_status: "paid", status: { $in: ["cancelled", "refund_required"] } };
const PENDING = { payment_method: "online", status: "pending_payment" };
const FAILED = { payment_method: "online", payment_status: "unpaid", status: { $in: ["cancelled", "expired"] } };

const pad2 = (n) => String(n).padStart(2, "0");
const dayKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const daysAgoDate = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const dateCond = (from, to) => {
    const c = {};
    if (from) c.$gte = from;
    if (to) c.$lte = to;
    return Object.keys(c).length ? { date: c } : {};
};

function channelOf(a) {
    if (a.payment_method === "cash") return "Cash";
    const c = String(a.payment_channel || "").toUpperCase();
    if (c.includes("BKASH")) return "bKash";
    if (c.includes("NAGAD")) return "Nagad";
    if (c.includes("ROCKET")) return "Rocket";
    if (/VISA|MASTER|AMEX|CARD/.test(c)) return "Card";
    return "Online";
}

function paymentLabel(a) {
    if (a.payment_status === "paid" && ["cancelled", "refund_required"].includes(a.status)) return "Refund Due";
    if (a.payment_method === "cash") return "Paid";
    if (a.payment_status === "paid") return "Paid";
    if (a.status === "pending_payment") return "Pending";
    return "Failed";
}

export async function adminPaymentsSummary(req, res, next) {
    try {
        const col = getDB().collection("appointments");
        const to = req.query.to || dayKey(new Date());
        let from = req.query.from || dayKey(daysAgoDate(29));
        // Limit the requested date range to 92 days.
        const minFrom = dayKey(new Date(new Date(`${to}T00:00:00`).getTime() - 91 * 86400000));
        if (from < minFrom) from = minFrom;
        const range = dateCond(from, to);

        // Set the start date for the seven-month revenue summary.
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        const monthStartKey = dayKey(monthStart);

        const [revDocs, pendingDocs, refundDocs, apptByDay, monthlyDocs] = await Promise.all([
            col.find({ ...REVENUE, ...range }, { projection: { date: 1, consultation_fee: 1, payment_method: 1, payment_channel: 1, doctorDepartment: 1 } }).toArray(),
            col.find({ ...PENDING, ...range }, { projection: { consultation_fee: 1 } }).toArray(),
            col.find({ ...REFUND, ...range }, { projection: { consultation_fee: 1 } }).toArray(),
            col.aggregate([
                { $match: { ...range, status: { $nin: ["cancelled", "expired"] } } },
                { $group: { _id: "$date", count: { $sum: 1 } } },
            ]).toArray(),
            col.find({ ...REVENUE, date: { $gte: monthStartKey } }, { projection: { date: 1, consultation_fee: 1 } }).toArray(),
        ]);

        const sum = (docs) => docs.reduce((n, d) => n + (d.consultation_fee || 0), 0);
        const totalRevenue = sum(revDocs);

        // Group revenue by payment method.
        const byChannel = new Map();
        revDocs.forEach((d) => {
            const k = channelOf(d);
            const cur = byChannel.get(k) || { name: k, amount: 0, count: 0 };
            cur.amount += d.consultation_fee || 0;
            cur.count += 1;
            byChannel.set(k, cur);
        });
        const methods = [...byChannel.values()]
            .sort((a, b) => b.amount - a.amount)
            .map((m) => ({ ...m, pct: totalRevenue ? Math.round((m.amount / totalRevenue) * 100) : 0 }));

        // Group revenue by department, combining all but the top four into "Other".
        const byDept = new Map();
        revDocs.forEach((d) => {
            const k = d.doctorDepartment || "Other";
            byDept.set(k, (byDept.get(k) || 0) + (d.consultation_fee || 0));
        });
        const deptSorted = [...byDept.entries()].map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);
        const top = deptSorted.slice(0, 4);
        const rest = deptSorted.slice(4).reduce((n, d) => n + d.amount, 0);
        if (rest) top.push({ name: "Other", amount: rest });
        const departments = top.map((d) => ({ ...d, share: totalRevenue ? Math.round((d.amount / totalRevenue) * 100) : 0 }));

        // Build a daily series for every date in the selected range.
        const revByDay = new Map();
        revDocs.forEach((d) => revByDay.set(d.date, (revByDay.get(d.date) || 0) + (d.consultation_fee || 0)));
        const apptMap = new Map(apptByDay.map((r) => [r._id, r.count]));
        const series = [];
        for (let t = new Date(`${from}T00:00:00`); dayKey(t) <= to; t.setDate(t.getDate() + 1)) {
            const k = dayKey(t);
            series.push({ date: k, revenue: revByDay.get(k) || 0, appointments: apptMap.get(k) || 0 });
        }

        // Build the monthly summary for the current month and previous six months.
        const monthly = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
            monthly.push({
                key,
                label: d.toLocaleDateString("en-US", { month: "short" }),
                value: monthlyDocs.filter((x) => x.date.startsWith(key)).reduce((n, x) => n + (x.consultation_fee || 0), 0),
            });
        }

        res.json({
            success: true,
            range: { from, to },
            stats: {
                totalRevenue,
                paymentsCount: revDocs.length,
                pendingCount: pendingDocs.length,
                pendingAmount: sum(pendingDocs),
                refundCount: refundDocs.length,
                refundAmount: sum(refundDocs),
            },
            methods,
            departments,
            series,
            monthly,
        });
    } catch (err) {
        next(err);
    }
}

export async function adminPaymentsList(req, res, next) {
    try {
        const col = getDB().collection("appointments");
        const { from, to, status, all } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 7));

        // Include all online appointments and completed cash appointments.
        const base = { $or: [{ payment_method: "online" }, { payment_method: "cash", status: "completed" }] };
        const parts = [base, dateCond(from, to)];
        if (status === "Paid") parts.push(REVENUE);
        else if (status === "Pending") parts.push(PENDING);
        else if (status === "Refund Due") parts.push(REFUND);
        else if (status === "Failed") parts.push(FAILED);
        const filter = { $and: parts.filter((p) => Object.keys(p).length) };

        const total = await col.countDocuments(filter);
        let cursor = col.find(filter).sort({ createdAt: -1 });
        if (all !== "true") cursor = cursor.skip((page - 1) * limit).limit(limit);
        const named = await withPatientNames(await cursor.toArray());

        res.json({
            success: true,
            total,
            page,
            totalPages: Math.max(1, Math.ceil(total / limit)),
            payments: named.map((a) => ({
                _id: String(a._id),
                patientName: a.patientName,
                doctorName: a.doctorName,
                channel: channelOf(a),
                amount: a.consultation_fee,
                appointmentDate: a.date,
                createdAt: a.createdAt,
                status: paymentLabel(a),
                reference: a.payment_reference || null,
            })),
        });
    } catch (err) {
        next(err);
    }
}