import * as appointmentRepo from "../model/appointmentRepository.js";
import * as doctorRepo from "../model/doctorRepository.js";
import * as userRepo from "../model/userRepository.js";
import { appointmentConfirmationEmailTemplate, sendEmail } from "./sendEmail.js";

export async function sendAppointmentConfirmationEmail(appointmentId) {
    try {
        const appointment = await appointmentRepo.findById(appointmentId);
        if (!appointment) return;

        const [doctor, patient] = await Promise.all([
            doctorRepo.findDoctorById(appointment.doctorId),
            userRepo.findUserById(appointment.patientId),
        ]);
        if (!patient?.email) return;

        await sendEmail({
            to: patient.email,
            subject: "Your appointment is confirmed — MediCare",
            html: appointmentConfirmationEmailTemplate({
                patientName: patient.name,
                doctorName: doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : appointment.doctorName || "your doctor",
                date: appointment.date,
                time: appointment.time_slot,
                fee: appointment.consultation_fee,
                paymentMethod: appointment.payment_method,
                location: doctor?.chamber_address || doctor?.location,
            }),
        });
    } catch (err) {
        console.error("Failed to send appointment confirmation email:", err.message, err);
        console.error("Failed to send appointment confirmation email:", err.message);
    }
}