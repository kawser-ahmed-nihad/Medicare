import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";

import doctorRoutes from "./routes/doctorRoutes.js";
import { connectDB } from './db/db.js';
import "./db/passport.js"; // Registers the Google and GitHub OAuth strategies.
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFound } from './middleware/errorhandler.js';
import appointmentRoutes from "./routes/appointmentRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";

import { setIO } from "./utils/socket.js";
import { keyFor, markOnline, markOffline, getPresence } from "./utils/presence.js";

// Adjust these imports to match your project structure.
// Import verifyAccessToken and userRepo from the modules used by your authentication middleware.
import * as userRepo from "./model/userRepository.js";
import * as conversationRepo from "./model/conversationRepository.js";
import { verifyAccessToken } from './utils/tokenUtils.js';
import medicalRecordRoutes from "./routes/medicalrecordroutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true, // Allow the HTTP-only refresh cookie to be sent.
    })
);

app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.set("trust proxy", 1);

// --- API routes ---
app.get("/", (req, res) => res.send("test"));
app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/patients", patientRoutes);
// --- Error handling (must be registered last) ---
app.use(notFound);
app.use(errorHandler);

/* ------------------------------------------------------------------ */
/* Socket.io                                                           */
/* ------------------------------------------------------------------ */

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
});
setIO(io);

// Verify the JWT for each socket connection. HTTP-only cookies are not sent with the socket handshake,
// so the frontend must provide the access token directly in the handshake auth payload.
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Unauthorized"));
        const payload = verifyAccessToken(token);
        const user = await userRepo.findUserById(payload.sub);
        if (!user) return next(new Error("Unauthorized"));
        socket.user = user;
        next();
    } catch (err) {
        console.log("[socket] auth failed:", err.message); // Log the underlying error for debugging.
        next(new Error("Unauthorized"));
    }
});

function canAccess(user, conversation) {
    if (user.role === "admin") return true;
    if (user.role === "doctor") return String(conversation.doctorId) === String(user.doctorId);
    return String(conversation.patientId) === String(user._id);
}

io.on("connection", (socket) => {
    // console.log("[socket] connected:", socket.user.role, String(socket.user._id), "| doctorId:", socket.user.doctorId);
    socket.join(`user:${socket.user._id}`);
    /* ---------- presence: online / last seen ---------- */
    const myKey = keyFor(socket.user);

    // Notify subscribers when the user transitions from offline to online.
    if (markOnline(myKey, socket.id)) {
        io.to(`presence:${myKey}`).emit("presence_update", { online: true, lastSeenAt: null });
    }

    socket.on("disconnect", async () => {
        try {
            // lastSeenAt is returned only after the user's final active tab disconnects.
            const lastSeenAt = await markOffline(myKey, socket.id);
            if (lastSeenAt) {
                io.to(`presence:${myKey}`).emit("presence_update", { online: false, lastSeenAt });
            }
        } catch (err) {
            console.error("presence disconnect error:", err.message);
        }
    });

    // The client requests the other participant's presence for this conversation.
    socket.on("watch_presence", async (conversationId, ack) => {
        try {
            const conversation = await conversationRepo.findById(conversationId);
            if (!conversation) {
                console.log("[presence] conversation not found:", conversationId);
                return ack?.(null);
            }
            if (!canAccess(socket.user, conversation)) {
                console.log("[presence] access denied. role:", socket.user.role,
                    "| user.doctorId:", socket.user.doctorId, "| conversation.doctorId:", conversation.doctorId);
                return ack?.(null);
            }

            // Leave any previously joined presence rooms.
            for (const room of [...socket.rooms]) {
                if (room.startsWith("presence:")) socket.leave(room);
            }

            const iAmDoctor = socket.user.role === "doctor";
            const otherKey = iAmDoctor
                ? `patient:${conversation.patientId}`
                : `doctor:${conversation.doctorId}`;

            socket.join(`presence:${otherKey}`);
            ack?.(await getPresence(otherKey));
        } catch {
            ack?.(null);
        }
    });

    /* ---------- chat rooms ---------- */
    socket.on("join_conversation", async (conversationId) => {
        try {
            const conversation = await conversationRepo.findById(conversationId);
            if (!conversation) return;
            if (canAccess(socket.user, conversation)) socket.join(`conversation:${conversationId}`);
        } catch (err) {
            console.error("join_conversation error:", err.message);
        }
    });

    socket.on("leave_conversation", (conversationId) => {
        socket.leave(`conversation:${conversationId}`);
    });
});

await connectDB();
server.listen(port, () => console.log(`Server running on port ${port}`));