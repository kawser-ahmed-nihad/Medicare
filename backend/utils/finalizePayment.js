import * as appointmentRepo from "../model/appointmentRepository.js";
import * as conversationRepo from "../model/conversationRepository.js";
import { sendAppointmentConfirmationEmail } from "./appointmentEmails.js";
import { notifyDoctor } from "./appointmentNotifications.js";
import { sendNotification } from "./notify.js";

export async function finalizePaidAppointment(appt, { reference, channel }) {
    const id = String(appt._id);

    await appointmentRepo.updateById(id, {
        status: "confirmed",
        payment_status: "paid",
        payment_reference: reference,
        payment_channel: channel, // The revenue page's channelOf() function recognizes these demo channel values.
        paid_at: new Date(),
    });

    sendAppointmentConfirmationEmail(id);

    conversationRepo.findOrCreate({
        doctorId: appt.doctorId,
        patientId: appt.patientId,
        doctorName: appt.doctorName,
        patientName: appt.patientName,
        patientPhone: appt.patientPhone,
    }).catch((err) => console.error("Failed to create conversation:", err.message));

    sendNotification({
        userId: appt.patientId,
        type: "appointment",
        title: "Appointment Confirmed",
        description: `Your appointment with ${appt.doctorName} is confirmed for ${appt.date} at ${appt.time_slot}.`,
        link: "/dashboard/my-appointments",
    });

    notifyDoctor(appt, {
        title: "New Appointment",
        description: `${appt.patientName || "A patient"} booked ${appt.date} at ${appt.time_slot}.`,
    });
}