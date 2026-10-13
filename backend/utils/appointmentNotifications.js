import * as userRepo from "../model/userRepository.js";
import { sendNotification } from "./notify.js";

// Finds the doctor's user account and sends them a notification.
export async function notifyDoctor(appt, { title, description }) {
    try {
        const doctorUser = await userRepo.findUserByDoctorId(appt.doctorId);
        if (!doctorUser) return;
        sendNotification({
            userId: doctorUser._id,
            type: "appointment",
            title,
            description,
            link: "/dashboard/doctors-appointment",
        });
    } catch (err) {
        console.error("notifyDoctor failed:", err.message);
    }
}

export function notifyPatient(appt, { title, description }) {
    sendNotification({
        userId: appt.patientId,
        type: "appointment",
        title,
        description,
        link: "/dashboard/my-appointments",
    });
}