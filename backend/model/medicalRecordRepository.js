import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";

function recordsCollection() {
    return getDB().collection("medical_records");
}

export async function create(data) {
    const now = new Date();
    const doc = { ...data, createdAt: now, updatedAt: now };
    const result = await recordsCollection().insertOne(doc);
    return { _id: result.insertedId, ...doc };
}

export async function findByPatientId(patientId, { type } = {}) {
    const filter = { patientId: typeof patientId === "string" ? new ObjectId(patientId) : patientId };
    if (type && type !== "All Types") filter.type = type;
    return recordsCollection().find(filter).sort({ date: -1 }).toArray();
}

export async function findById(id) {
    if (!ObjectId.isValid(id)) return null;
    return recordsCollection().findOne({ _id: new ObjectId(id) });
}

export async function findByDoctorId(doctorId) {
    return recordsCollection().find({ doctorId: String(doctorId) }).sort({ date: -1 }).toArray();
}