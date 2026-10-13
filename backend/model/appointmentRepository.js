import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";

function appointmentsCollection() {
    return getDB().collection("appointments");
}

export async function create(data) {
    const now = new Date();
    const doc = { ...data, createdAt: now, updatedAt: now };
    const result = await appointmentsCollection().insertOne(doc);
    return { _id: result.insertedId, ...doc };
}

export async function findById(id) {
    if (!ObjectId.isValid(id)) return null;
    return appointmentsCollection().findOne({ _id: new ObjectId(id) });
}

export async function findByPatientId(patientId) {
    return appointmentsCollection().find({ patientId }).sort({ date: -1 }).toArray();
}

// Checks for an active booking with the same doctor, date, and time slot.
export async function findActiveByDoctorSlot(doctorId, date, time_slot) {
    return appointmentsCollection().findOne({
        doctorId: typeof doctorId === "string" ? doctorId : doctorId.toString(),
        date,
        time_slot,
        status: { $in: ["pending_payment", "confirmed"] },
    });
}

export async function updateById(id, update) {
    await appointmentsCollection().updateOne(
        { _id: typeof id === "string" ? new ObjectId(id) : id },
        { $set: { ...update, updatedAt: new Date() } }
    );
}

export async function findAnyByDoctorAndPatient(doctorId, patientId) {
    return appointmentsCollection().findOne({
        doctorId: typeof doctorId === "string" ? doctorId : doctorId.toString(),
        patientId: typeof patientId === "string" ? new ObjectId(patientId) : patientId,
    });
}

export async function findByDoctorId(doctorId) {
    return appointmentsCollection()
        .find({ doctorId: typeof doctorId === "string" ? doctorId : doctorId.toString() })
        .sort({ date: 1 })
        .toArray();
}

export async function findByPaymentToken(token) {
    if (!token) return null;
    return appointmentsCollection().findOne({ payment_token: token });
}