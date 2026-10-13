import * as doctorRepo from "../model/doctorRepository.js";
import { createDoctorInviteUser } from "./authController.js";
import * as appointmentRepo from "../model/appointmentRepository.js";
import * as userRepo from "../model/userRepository.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";


export async function createDoctor(req, res, next) {

    const payload = JSON.parse(req.body.data);

    // console.log("BODY DATA:", req.body);

    try {

        let photoUrl = null;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "medicare_doctors");
            photoUrl = result.secure_url;
        }

        const existing = await doctorRepo.findDoctorByEmail(payload.email);
        if (existing) {
            return res.status(409).json({ success: false, message: "A doctor with this email already exists." });
        }

        // 1. Save the doctor profile to the doctors collection.
        const doctor = await doctorRepo.createDoctor({
            ...payload,
            email: payload.email.toLowerCase(),
            photoUrl,
        });

        // 2. Create the login account and send an invitation email.
        let inviteWarning = null;
        try {
            const user = await createDoctorInviteUser({
                name: `${payload.first_name} ${payload.last_name}`,
                email: payload.email,
                doctorId: doctor._id,
            });
            await doctorRepo.linkUserToDoctor(doctor._id, user._id);
        } catch (err) {

            inviteWarning = err.message || "Doctor saved, but the invite email could not be sent.";
        }

        res.status(201).json({
            success: true,
            message: inviteWarning ? "Doctor created." : "Doctor created and invited successfully.",
            warning: inviteWarning,
            doctor,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ success: false, message: "A doctor with this email already exists." });
        }
        next(err);
    }
}

export async function getDoctors(req, res, next) {
    try {
        const result = await doctorRepo.findAllDoctors(req.query);
        res.json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}

export async function getDepartmentCounts(req, res, next) {
    try {
        const counts = await doctorRepo.getDepartmentCounts();
        res.json({ success: true, counts });
    } catch (err) {
        next(err);
    }
}


export async function getDoctorById(req, res, next) {
    try {
        const doctor = await doctorRepo.findDoctorById(req.params.id, { public: true });
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
        res.json({ success: true, doctor });
    } catch (err) {
        next(err);
    }
}

const VALID_STATUSES = ["available", "on_leave", "inactive"];

export async function adminListDoctors(req, res, next) {
    try {
        const { q, department, status, page, limit } = req.query;
        const [list, summary] = await Promise.all([
            doctorRepo.adminList({ q, department, status, page, limit }),
            doctorRepo.adminSummary(),
        ]);
        res.json({ success: true, ...list, ...summary });
    } catch (err) {
        next(err);
    }
}

export async function updateDoctorStatus(req, res, next) {
    try {
        const { status } = req.body;
        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }
        const result = await doctorRepo.updateDoctorStatus(req.params.id, status);
        if (!result?.matchedCount) return res.status(404).json({ success: false, message: "Doctor not found" });
        res.json({ success: true, message: "Status updated" });
    } catch (err) {
        next(err);
    }
}

export async function deleteDoctor(req, res, next) {
    try {
        const doctor = await doctorRepo.findDoctorById(req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

        const d = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const today = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

        const appointments = await appointmentRepo.findByDoctorId(req.params.id);
        const hasUpcoming = appointments.some(
            (a) => a.date >= today && ["confirmed", "pending_payment"].includes(a.status)
        );
        if (hasUpcoming) {
            return res.status(409).json({
                success: false,
                message: "This doctor has upcoming appointments. Cancel them first, or set the status to Inactive instead.",
            });
        }

        await userRepo.deleteUsersByDoctorId(req.params.id); // Delete the linked login account.
        await doctorRepo.deleteDoctorById(req.params.id);
        res.json({ success: true, message: "Doctor deleted" });
    } catch (err) {
        next(err);
    }
}