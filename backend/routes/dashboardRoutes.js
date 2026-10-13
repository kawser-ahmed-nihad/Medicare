import express from "express";
import { requireAuth } from "../middleware/auth.JS";
import { getPatientDashboard, getDoctorDashboard, getAdminDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/patient", requireAuth, getPatientDashboard);
router.get("/doctor", requireAuth, getDoctorDashboard);
router.get("/admin", requireAuth, getAdminDashboard);

export default router;