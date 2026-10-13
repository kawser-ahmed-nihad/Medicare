import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.JS";
import { uploadChatFile } from "../utils/cloudinary.js";
import { createRecord, getMyRecords, getPatientRecords } from "../controllers/medicalRecordController.js";

const router = express.Router();

router.post("/", requireAuth, requireRole("doctor"), uploadChatFile.single("file"), createRecord);
router.get("/mine", requireAuth, getMyRecords);
router.get("/patient/:patientId", requireAuth, getPatientRecords); // Declare this route before any generic "/:id" route.

export default router;