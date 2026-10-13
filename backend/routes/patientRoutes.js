import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { getMyPatients, adminListPatients, adminGetPatient } from "../controllers/patientController.js";

const router = express.Router();

router.get("/mine", requireAuth, getMyPatients);
router.get("/admin/list", requireAuth, requireRole("admin"), adminListPatients);
router.get("/admin/:id", requireAuth, requireRole("admin"), adminGetPatient);

export default router;