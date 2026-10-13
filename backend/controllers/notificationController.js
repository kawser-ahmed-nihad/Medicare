import * as notificationRepo from "../model/notificationRepository.js";
import { getDB } from "../db/db.js";
import * as userRepo from "../model/userRepository.js";

export async function getMyNotifications(req, res, next) {
    try {
        const notifications = await notificationRepo.findByUser(req.user._id);
        res.json({ success: true, notifications });
    } catch (err) {
        next(err);
    }
}

export async function markAsRead(req, res, next) {
    try {
        await notificationRepo.markRead(req.params.id, req.user._id);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

export async function markAllAsRead(req, res, next) {
    try {
        await notificationRepo.markAllRead(req.user._id);
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
}

const NOTIFICATION_TYPES = ["appointment", "message", "prescription", "system"];
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Admin notification list with filters, search, and pagination.
export async function adminListNotifications(req, res, next) {
    try {
        const col = getDB().collection("notifications");
        const { q, type, status } = req.query;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 15));

        const f = {};
        if (NOTIFICATION_TYPES.includes(type)) f.type = type;
        if (status === "Unread") f.read = false;
        if (status === "Read") f.read = true;

        if (q) {
            const rx = { $regex: escapeRegex(q), $options: "i" };
            const users = await getDB().collection("users")
                .find({ $or: [{ name: rx }, { email: rx }] }, { projection: { _id: 1 } })
                .limit(200)
                .toArray();
            f.$or = [{ title: rx }, { description: rx }, { userId: { $in: users.map((u) => u._id) } }];
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [total, rows, totalAll, unread, today, byType] = await Promise.all([
            col.countDocuments(f),
            col.find(f).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
            col.countDocuments({}),
            col.countDocuments({ read: false }),
            col.countDocuments({ createdAt: { $gte: startOfDay } }),
            col.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]).toArray(),
        ]);

        const users = await userRepo.findUsersByIds([...new Set(rows.map((r) => String(r.userId)))]);
        const userMap = new Map(users.map((u) => [String(u._id), u]));

        res.json({
            success: true,
            notifications: rows.map((n) => {
                const u = userMap.get(String(n.userId));
                return {
                    _id: String(n._id),
                    type: n.type,
                    title: n.title,
                    description: n.description,
                    read: n.read,
                    createdAt: n.createdAt,
                    user: u ? { _id: String(u._id), name: u.name, email: u.email, role: u.role || "patient" } : null,
                };
            }),
            total,
            page,
            totalPages: Math.max(1, Math.ceil(total / limit)),
            stats: { total: totalAll, unread, today, byType: Object.fromEntries(byType.map((b) => [b._id, b.count])) },
        });
    } catch (err) {
        next(err);
    }
}