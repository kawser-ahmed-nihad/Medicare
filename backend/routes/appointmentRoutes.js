import express from "express";
import { cancelAppointment, createAppointment, getMyAppointments, getAppointmentById, getDoctorAppointments, markAppointmentCompleted, adminListAppointments, adminAppointmentCalendar } from "../controllers/appointmentController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, createAppointment);
router.get("/mine", requireAuth, getMyAppointments);
router.patch("/:id/cancel", requireAuth, cancelAppointment);
router.get("/:id", requireAuth, getAppointmentById);
router.get("/doctor/mine", requireAuth, getDoctorAppointments); // This two-segment path does not match the single-segment "/:id" route.
router.patch("/:id/complete", requireAuth, markAppointmentCompleted);
router.get("/admin/list", requireAuth, requireRole("admin"), adminListAppointments);
router.get("/admin/calendar", requireAuth, requireRole("admin"), adminAppointmentCalendar);

export default router;