import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { getMyNotifications, markAsRead, markAllAsRead, adminListNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/mine", requireAuth, getMyNotifications);
router.patch("/read-all", requireAuth, markAllAsRead); // "read-all" is a distinct path segment and does not conflict with "/:id/read".
router.patch("/:id/read", requireAuth, markAsRead);
router.get("/admin/all", requireAuth, requireRole("admin"), adminListNotifications);

export default router;