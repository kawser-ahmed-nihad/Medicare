import * as notificationRepo from "../model/notificationRepository.js";
import { getIO } from "./socket.js";

export async function sendNotification({ userId, type, title, description, link }) {
    try {
        const notification = await notificationRepo.create({ userId, type, title, description, link });
        getIO().to(`user:${userId}`).emit("new_notification", notification);
        return notification;
    } catch (err) {
        console.error("Failed to send notification:", err.message);
    }
}