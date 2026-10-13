import 'dotenv/config';
export const REFRESH_COOKIE_NAME = "refreshToken";

export function setRefreshCookie(res, token) {
    res.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie.
        secure: process.env.NODE_ENV === "production", // Sends the cookie over HTTPS in production.
        sameSite: "lax", // Helps mitigate CSRF while allowing top-level OAuth redirects.
        domain: process.env.COOKIE_DOMAIN || undefined,
        path: "/api/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000, // Keeps the cookie for seven days.
    });
}

export function clearRefreshCookie(res) {
    res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        domain: process.env.COOKIE_DOMAIN || undefined,
        path: "/api/auth",
    });
}