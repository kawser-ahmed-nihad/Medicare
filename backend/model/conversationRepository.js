import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";

function conversationsCollection() {
    return getDB().collection("conversations");
}

export async function findOrCreate({ doctorId, patientId, doctorName, patientName, patientPhone }) {
    const existing = await conversationsCollection().findOne({
        doctorId: String(doctorId),
        patientId: new ObjectId(patientId),
    });
    if (existing) return existing;

    const now = new Date();
    const doc = {
        doctorId: String(doctorId),
        patientId: new ObjectId(patientId),
        doctorName,
        patientName,
        patientPhone,
        lastMessageText: null,
        lastMessageAt: now,
        createdAt: now,
        updatedAt: now,
    };
    const result = await conversationsCollection().insertOne(doc);
    return { _id: result.insertedId, ...doc };
}

export async function findById(id) {
    if (!ObjectId.isValid(id)) return null;
    return conversationsCollection().findOne({ _id: new ObjectId(id) });
}

export async function findForDoctor(doctorId) {
    return conversationsCollection().find({ doctorId: String(doctorId) }).sort({ lastMessageAt: -1 }).toArray();
}

export async function findForPatient(patientId) {
    return conversationsCollection().find({ patientId: new ObjectId(patientId) }).sort({ lastMessageAt: -1 }).toArray();
}

// Returns all conversations for admin oversight.
export async function findAll() {
    return conversationsCollection().find({}).sort({ lastMessageAt: -1 }).toArray();
}

export async function touchLastMessage(id, text, senderRole) {
    await conversationsCollection().updateOne(
        { _id: typeof id === "string" ? new ObjectId(id) : id },
        { $set: { lastMessageText: text, lastMessageAt: new Date(), lastSenderRole: senderRole, updatedAt: new Date() } }
    );
}

export async function markRead(id, role) {
    if (!ObjectId.isValid(id)) return;
    const field = role === "doctor" ? "doctorLastReadAt" : "patientLastReadAt";
    await conversationsCollection().updateOne({ _id: new ObjectId(id) }, { $set: { [field]: new Date() } });
}