import 'dotenv/config';
import crypto from "crypto";
import jwt from "jsonwebtoken";

/**
 * Creates a one-time token and returns its raw value for delivery to the user
 * and its SHA-256 hash for database storage. Never store the raw token.
 */
export function createOneTimeToken() {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
    return { rawToken, hash };
}

export function hashToken(rawToken) {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function signAccessToken(user) {
    return jwt.sign(
        { sub: user._id.toString(), role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" }
    );
}

export function signRefreshToken(user) {
    return jwt.sign(
        { sub: user._id.toString(), tokenVersion: Date.now() },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );
}

export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}