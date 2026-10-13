import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { uploadChatFile } from "../utils/cloudinary.js";
import {
    startConversation, getMyConversations, getMessages, sendMessage, uploadAttachment, adminGetAllConversations,
    getContact,
    adminListConversations,
    getUnreadCount,
    markConversationRead,
} from "../controllers/conversationController.js";

const router = express.Router();

router.post("/start", requireAuth, startConversation);
router.get("/mine", requireAuth, getMyConversations);
router.get("/admin/all", requireAuth, requireRole("admin"), adminGetAllConversations); // Admin endpoint for listing all conversations.
router.post("/upload", requireAuth, uploadChatFile.single("file"), uploadAttachment);
router.get("/:id/messages", requireAuth, getMessages);
router.post("/:id/messages", requireAuth, sendMessage);
router.get("/:id/contact", requireAuth, getContact);
router.get("/admin/all", requireAuth, requireRole("admin"), adminListConversations); // Admin endpoint for searching and filtering conversations.
router.get("/unread-count", requireAuth, getUnreadCount);
router.post("/:id/read", requireAuth, markConversationRead);

export default router;