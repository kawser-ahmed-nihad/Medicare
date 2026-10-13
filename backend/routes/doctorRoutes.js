import express from "express";
import { createDoctor, getDoctors, getDoctorById, getDepartmentCounts, adminListDoctors, updateDoctorStatus, deleteDoctor } from "../controllers/doctorController.js";
import { upload } from "../utils/cloudinary.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getDoctors);
router.get("/meta/department-counts", getDepartmentCounts);
router.get("/admin/list", requireAuth, requireRole("admin"), adminListDoctors); // Declare this route before the generic "/:id" route.
router.get("/:id", getDoctorById);
router.post("/", requireAuth, requireRole("admin"), upload.single("photo"), createDoctor);
router.patch("/:id/status", requireAuth, requireRole("admin"), updateDoctorStatus);
router.delete("/:id", requireAuth, requireRole("admin"), deleteDoctor);
export default router;