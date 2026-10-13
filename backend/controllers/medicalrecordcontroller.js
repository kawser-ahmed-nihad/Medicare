import { ObjectId } from "mongodb";
import * as recordRepo from "../model/medicalRecordRepository.js";
import * as appointmentRepo from "../model/appointmentRepository.js";
import { sendNotification } from "../utils/notify.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export async function createRecord(req, res, next) {
    try {
        if (req.user.role !== "doctor") {
            return res.status(403).json({ success: false, message: "Only doctors can add medical records" });
        }

        const payload = JSON.parse(req.body.data);
        const { patientId, type, title, description, date } = payload;

        if (!patientId || !type || !title) {
            return res.status(400).json({ success: false, message: "patientId, type and title are required" });
        }

        const hasRelation = await appointmentRepo.findAnyByDoctorAndPatient(req.user.doctorId, patientId);
        if (!hasRelation) {
            return res.status(403).json({ success: false, message: "You can only add records for your own patients" });
        }

        // Use Cloudinary's "auto" resource type for PDF uploads.
        let fileUrl = null;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "medicare_records", "auto");
            fileUrl = result.secure_url;
        }

        const record = await recordRepo.create({
            patientId: new ObjectId(patientId),
            doctorId: req.user.doctorId,
            patientName: payload.patientName || null,
            doctorName: payload.doctorName || "Doctor",
            type,
            title: title.trim(),
            description: description?.trim() || null,
            date: date || new Date().toISOString().slice(0, 10),
            fileUrl,
        });

        sendNotification({
            userId: patientId,
            type: record.type === "Prescription" ? "prescription" : "system",
            title: record.type === "Prescription" ? "Prescription Available" : `${record.type} Added`,
            description: `${title} from ${payload.doctorName || "your doctor"} is now available in your medical records.`,
            link: "/dashboard/medical-records",
        });

        res.status(201).json({ success: true, record });
    } catch (err) {
        next(err);
    }
}

export async function getMyRecords(req, res, next) {
    try {
        const records = await recordRepo.findByPatientId(req.user._id, { type: req.query.type });
        res.json({ success: true, records });
    } catch (err) {
        next(err);
    }
}

export async function getPatientRecords(req, res, next) {
    try {
        if (req.user.role !== "doctor" && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }
        if (req.user.role === "doctor") {
            const hasRelation = await appointmentRepo.findAnyByDoctorAndPatient(req.user.doctorId, req.params.patientId);
            if (!hasRelation) return res.status(403).json({ success: false, message: "Not allowed" });
        }
        const records = await recordRepo.findByPatientId(req.params.patientId);
        res.json({ success: true, records });
    } catch (err) {
        next(err);
    }
}