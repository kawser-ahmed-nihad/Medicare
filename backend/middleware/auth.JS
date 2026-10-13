import * as userRepo from "../model/userRepository.js";
import { verifyAccessToken } from "../utils/tokenutils.js";

/**
 * Requires a Bearer access token in the Authorization header.
 */
export async function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        const [scheme, token] = header.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const payload = verifyAccessToken(token);
        const user = await userRepo.findUserById(payload.sub);

        if (!user) {
            return res.status(401).json({ success: false, message: "User no longer exists" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}

export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions" });
        }
        next();
    };
}