import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";

function notificationsCollection() {
    return getDB().collection("notifications");
}

export async function create({ userId, type, title, description, link }) {
    const doc = {
        userId: typeof userId === "string" ? new ObjectId(userId) : userId,
        type, // "appointment" | "message" | "prescription" | "system"
        title,
        description,
        link: link || null,
        read: false,
        createdAt: new Date(),
    };
    const result = await notificationsCollection().insertOne(doc);
    return { _id: result.insertedId, ...doc };
}

export async function findByUser(userId) {
    return notificationsCollection()
        .find({ userId: typeof userId === "string" ? new ObjectId(userId) : userId })
        .sort({ createdAt: -1 })
        .toArray();
}

export async function markRead(id, userId) {
    await notificationsCollection().updateOne(
        { _id: typeof id === "string" ? new ObjectId(id) : id, userId: typeof userId === "string" ? new ObjectId(userId) : userId },
        { $set: { read: true } }
    );
}

export async function markAllRead(userId) {
    await notificationsCollection().updateMany(
        { userId: typeof userId === "string" ? new ObjectId(userId) : userId, read: false },
        { $set: { read: true } }
    );
}