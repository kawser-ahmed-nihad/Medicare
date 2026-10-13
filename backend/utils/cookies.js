import 'dotenv/config';
export const REFRESH_COOKIE_NAME = "refreshToken";

const isProd = process.env.NODE_ENV === "production";

export function setRefreshCookie(res, token) {
    res.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProd,                    // production-এ true
        sameSite: isProd ? "none" : "lax", // cross-domain (Netlify ↔ Render) হলে "none" লাগবে
        domain: process.env.COOKIE_DOMAIN || undefined,
        path: "/api/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export function clearRefreshCookie(res) {
    res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: process.env.COOKIE_DOMAIN || undefined,
        path: "/api/auth",
    });
}