import * as conversationRepo from "../model/conversationRepository.js";
import * as messageRepo from "../model/messageRepository.js";
import * as doctorRepo from "../model/doctorRepository.js";
import * as appointmentRepo from "../model/appointmentRepository.js";
import { getIO } from "../utils/socket.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import * as userRepo from "../model/userRepository.js";
import { sendNotification } from "../utils/notify.js";
import { getDB } from "../db/db.js";

function isParticipant(conversation, user) {
    if (user.role === "admin") return true;
    if (user.role === "doctor") return String(conversation.doctorId) === String(user.doctorId);
    return String(conversation.patientId) === String(user._id);
}

export async function startConversation(req, res, next) {
    try {
        const { doctorId } = req.body;

        const hasBooked = await appointmentRepo.findAnyByDoctorAndPatient(doctorId, req.user._id);
        if (!hasBooked) {
            return res.status(403).json({ success: false, message: "You can only message a doctor you've booked an appointment with." });
        }

        const doctor = await doctorRepo.findDoctorById(doctorId);
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

        const conversation = await conversationRepo.findOrCreate({
            doctorId,
            patientId: req.user._id,
            doctorName: `Dr. ${doctor.first_name} ${doctor.last_name}`,
            patientName: req.user.name,
            patientPhone: req.user.phone || null,
        });

        const recipientUserId = senderRole === "patient"
            ? (await userRepo.findUserByDoctorId(conversation.doctorId))?._id
            : conversation.patientId;

        if (recipientUserId) {
            const senderName = senderRole === "patient" ? conversation.patientName : conversation.doctorName;
            sendNotification({
                userId: recipientUserId,
                type: "message",
                title: "New Message",
                description: `${senderName} sent you a message: "${(text || "📎 Sent an attachment").slice(0, 80)}"`,
                link: "/dashboard/messages",
            });
        }

        res.json({ success: true, conversation });
    } catch (err) {
        next(err);
    }
}

export async function getMyConversations(req, res, next) {
    try {
        const list = req.user.role === "doctor"
            ? await conversationRepo.findForDoctor(req.user.doctorId)
            : await conversationRepo.findForPatient(req.user._id);
        res.json({ success: true, conversations: list });
    } catch (err) {
        next(err);
    }
}

export async function getMessages(req, res, next) {
    try {
        const conversation = await conversationRepo.findById(req.params.id);
        if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
        if (!isParticipant(conversation, req.user)) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }
        const messages = await messageRepo.findByConversation(conversation._id);
        if (req.user.role !== "admin") {
            await conversationRepo.markRead(conversation._id, req.user.role === "doctor" ? "doctor" : "patient");
        }
        res.json({ success: true, messages, conversation });
    } catch (err) {
        next(err);
    }
}

export async function sendMessage(req, res, next) {
    try {
        const conversation = await conversationRepo.findById(req.params.id);
        if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });

        if (req.user.role === "admin" || !isParticipant(conversation, req.user)) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

        const { text, attachments } = req.body;
        if (!text?.trim() && !(attachments && attachments.length)) {
            return res.status(400).json({ success: false, message: "Message text or attachment is required" });
        }

        const senderRole = req.user.role === "doctor" ? "doctor" : "patient";
        const message = await messageRepo.create({
            conversationId: conversation._id,
            senderId: req.user._id,
            senderRole,
            text: text?.trim(),
            attachments,
        });

        await conversationRepo.touchLastMessage(conversation._id, text?.trim() || "📎 Attachment", senderRole);
        getIO().to(`conversation:${conversation._id}`).emit("new_message", {
            conversationId: String(conversation._id),
            message,
        });

        res.status(201).json({ success: true, message });
    } catch (err) {
        next(err);
    }
}

export async function uploadAttachment(req, res, next) {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

        const result = await uploadToCloudinary(req.file.buffer, "medicare_chat", "auto");

        res.json({
            success: true,
            attachment: {
                url: result.secure_url,
                name: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size,
            },
        });
    } catch (err) {
        next(err);
    }
}

// Admin oversight of conversations.
export async function adminGetAllConversations(req, res, next) {
    try {
        const list = await conversationRepo.findAll();
        res.json({ success: true, conversations: list });
    } catch (err) {
        next(err);
    }
}

export async function getContact(req, res, next) {
    try {
        const conversation = await conversationRepo.findById(req.params.id);
        if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
        if (!isParticipant(conversation, req.user)) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

        const patient = await userRepo.findUserById(String(conversation.patientId));
        const all = await appointmentRepo.findByPatientId(conversation.patientId);
        const withDoctor = all.filter((a) => String(a.doctorId) === String(conversation.doctorId));

        const valid = withDoctor.filter((a) => !["cancelled", "pending_payment"].includes(a.status));
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const next = valid
            .filter((a) => a.status !== "completed" && new Date(a.date) >= startOfToday)
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

        res.json({
            success: true,
            patient: {
                name: patient?.name || conversation.patientName,
                email: patient?.email || null,
                phone: patient?.phone || conversation.patientPhone || null,
            },
            stats: {
                total: valid.length,
                completed: valid.filter((a) => a.status === "completed").length,
            },
            nextAppointment: next ? { date: next.date, time_slot: next.time_slot } : null,
        });
    } catch (err) {
        next(err);
    }
}


const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Admin conversation list with search, filters, and pagination.
export async function adminListConversations(req, res, next) {
    try {
        const db = getDB();
        const { q, doctorId, filter } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 15));

        const f = {};
        if (q) {
            const rx = { $regex: escapeRegex(q), $options: "i" };
            f.$or = [{ patientName: rx }, { doctorName: rx }];
        }
        if (doctorId) f.doctorId = String(doctorId);
        if (filter === "awaiting") f.lastSenderRole = "patient"; // The patient sent the last message and is waiting for a doctor's reply.

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [total, rows, totalAll, totalMessages, todayMessages, awaiting, doctors] = await Promise.all([
            db.collection("conversations").countDocuments(f),
            db.collection("conversations").find(f).sort({ lastMessageAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
            db.collection("conversations").countDocuments({}),
            db.collection("messages").countDocuments({}),
            db.collection("messages").countDocuments({ createdAt: { $gte: startOfDay } }),
            db.collection("conversations").countDocuments({ lastSenderRole: "patient" }),
            db.collection("conversations").aggregate([{ $group: { _id: "$doctorId", name: { $first: "$doctorName" } } }, { $sort: { name: 1 } }]).toArray(),
        ]);

        const counts = await db.collection("messages").aggregate([
            { $match: { conversationId: { $in: rows.map((r) => r._id) } } },
            { $group: { _id: "$conversationId", count: { $sum: 1 } } },
        ]).toArray();
        const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

        res.json({
            success: true,
            conversations: rows.map((c) => ({
                _id: String(c._id),
                patientId: String(c.patientId),
                patientName: c.patientName || "Patient",
                doctorId: c.doctorId,
                doctorName: c.doctorName || "Doctor",
                lastMessageText: c.lastMessageText,
                lastMessageAt: c.lastMessageAt,
                lastSenderRole: c.lastSenderRole || null,
                messageCount: countMap.get(String(c._id)) || 0,
            })),
            total,
            page,
            totalPages: Math.max(1, Math.ceil(total / limit)),
            stats: { conversations: totalAll, messages: totalMessages, todayMessages, awaiting },
            doctors: doctors.map((d) => ({ id: d._id, name: d.name })),
        });
    } catch (err) {
        next(err);
    }
}

// Marks a conversation as read for the current doctor or patient.
export async function markConversationRead(req, res, next) {
    try {
        const conversation = await conversationRepo.findById(req.params.id);
        if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
        if (req.user.role === "admin" || !isParticipant(conversation, req.user)) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }
        await conversationRepo.markRead(conversation._id, req.user.role === "doctor" ? "doctor" : "patient");
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

// Returns the unread message count used by the badge.
export async function getUnreadCount(req, res, next) {
    try {
        if (!["doctor", "patient"].includes(req.user.role)) return res.json({ success: true, count: 0 });

        const isDoctor = req.user.role === "doctor";
        const list = isDoctor
            ? await conversationRepo.findForDoctor(req.user.doctorId)
            : await conversationRepo.findForPatient(req.user._id);
        const myRole = isDoctor ? "doctor" : "patient";
        const readField = isDoctor ? "doctorLastReadAt" : "patientLastReadAt";

        // A conversation is unread when someone else sent the latest message after the user's last-read time.
        const count = list.filter(
            (c) => c.lastSenderRole && c.lastSenderRole !== myRole && (!c[readField] || new Date(c.lastMessageAt) > new Date(c[readField]))
        ).length;

        res.json({ success: true, count });
    } catch (err) {
        next(err);
    }
}