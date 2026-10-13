import { getDB } from "../db/db.js";

const online = new Map(); // Maps each user key to the set of active socket IDs.

export const keyFor = (user) =>
    user.role === "doctor" ? `doctor:${user.doctorId}` : `patient:${user._id}`;

// Returns true when the user transitions from offline to online.
export function markOnline(key, socketId) {
    const set = online.get(key) ?? new Set();
    const wasOffline = set.size === 0;
    set.add(socketId);
    online.set(key, set);
    return wasOffline;
}

// Returns lastSeenAt when the user's final active tab disconnects; otherwise, returns null.
export async function markOffline(key, socketId) {
    const set = online.get(key);
    if (!set) return null;
    set.delete(socketId);
    if (set.size > 0) return null;
    online.delete(key);
    const lastSeenAt = new Date();
    await getDB().collection("presence").updateOne({ _id: key }, { $set: { lastSeenAt } }, { upsert: true });
    return lastSeenAt;
}

export async function getPresence(key) {
    if (online.has(key)) return { online: true, lastSeenAt: null };
    const doc = await getDB().collection("presence").findOne({ _id: key });
    return { online: false, lastSeenAt: doc?.lastSeenAt ?? null };
}