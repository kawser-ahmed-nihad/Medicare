import * as userRepo from "../model/userRepository.js";

import { setRefreshCookie, clearRefreshCookie, REFRESH_COOKIE_NAME } from "../utils/cookies.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { createOneTimeToken, hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokenutils.js";
import { doctorInviteEmailTemplate, resetPasswordEmailTemplate, sendEmail, verificationEmailTemplate } from "../utils/sendemail.js";
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

/* ---------------------------- helpers ---------------------------- */

async function issueTokensForUser(res, user) {
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    await userRepo.updateUserById(user._id, { refreshTokenHash: hashToken(refreshToken) });

    setRefreshCookie(res, refreshToken);
    return accessToken;
}

/* ------------------------------ register ------------------------------ */

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        const existing = await userRepo.findUserByEmail(email);
        if (existing) {
            return res.status(200).json({
                success: true,
                message: "If this email can be registered, a verification link has been sent.",
            });
        }


        let avatarUrl = "https://via.placeholder.com/150";
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, "medicare_avatars");
            avatarUrl = result.secure_url;
        }

        const user = await userRepo.createUser({
            name,
            email,
            password,
            avatar: avatarUrl,
            provider: "local",
        });

        const { rawToken, hash } = createOneTimeToken();
        await userRepo.updateUserById(user._id, {
            verificationTokenHash: hash,
            verificationTokenExpires: Date.now() + Number(process.env.EMAIL_VERIFY_EXPIRES_MIN || 30) * 60 * 1000,
        });

        const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;
        await sendEmail({
            to: user.email,
            subject: "Verify your MediCare account",
            html: verificationEmailTemplate(user.name, verifyUrl),
        });

        res.status(201).json({
            success: true,
            message: "Account created. Please check your email to verify your account.",
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(200).json({
                success: true,
                message: "If this email can be registered, a verification link has been sent.",
            });
        }
        next(err);
    }
}

/* --------------------------- verify email --------------------------- */

export async function verifyEmail(req, res, next) {
    try {
        const token = req.query.token || req.body.token;
        if (!token) return res.status(400).json({ success: false, message: "Verification token is required" });

        const hash = hashToken(token);
        const user = await userRepo.findUserByVerificationHash(hash);

        if (!user) {
            return res.status(400).json({ success: false, message: "Verification link is invalid or has expired" });
        }

        await userRepo.updateUserById(user._id, { isVerified: true });
        await userRepo.unsetUserFields(user._id, ["verificationTokenHash", "verificationTokenExpires"]);

        res.json({ success: true, message: "Email verified successfully. You can now sign in." });
    } catch (err) {
        next(err);
    }
}

export async function resendVerification(req, res, next) {
    try {
        const { email } = req.body;
        const user = await userRepo.findUserByEmail(email);

        // Generic response regardless of outcome — prevents email enumeration
        const genericResponse = {
            success: true,
            message: "If this account exists and is unverified, a new link has been sent.",
        };

        if (!user || user.isVerified) return res.json(genericResponse);

        const { rawToken, hash } = createOneTimeToken();
        await userRepo.updateUserById(user._id, {
            verificationTokenHash: hash,
            verificationTokenExpires: Date.now() + Number(process.env.EMAIL_VERIFY_EXPIRES_MIN || 30) * 60 * 1000,
        });

        const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${rawToken}`;
        await sendEmail({
            to: user.email,
            subject: "Verify your MediCare account",
            html: verificationEmailTemplate(user.name, verifyUrl),
        });

        res.json(genericResponse);
    } catch (err) {
        next(err);
    }
}

/* --------------------------------- login --------------------------------- */

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await userRepo.findUserByEmail(email, { withSensitive: true });

        // Same generic error for "no user" and "wrong password" — prevents enumeration
        const invalidCredsError = () =>
            res.status(401).json({ success: false, message: "Invalid email or password" });

        if (!user || user.provider !== "local") return invalidCredsError();

        if (userRepo.isLocked(user)) {
            const minutesLeft = Math.ceil((new Date(user.lockUntil).getTime() - Date.now()) / 60000);
            return res.status(423).json({
                success: false,
                message: `Account temporarily locked due to failed attempts. Try again in ${minutesLeft} minute(s).`,
            });
        }

        const isMatch = await userRepo.comparePassword(user, password);
        if (!isMatch) {
            await userRepo.incrementFailedAttempts(
                user._id,
                user.failedLoginAttempts || 0,
                MAX_FAILED_ATTEMPTS,
                LOCK_TIME_MS
            );
            return invalidCredsError();
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before signing in.",
                code: "EMAIL_NOT_VERIFIED",
            });
        }

        // Successful login — reset lockout counters
        await userRepo.resetFailedAttempts(user._id);

        const accessToken = await issueTokensForUser(res, user);

        res.json({
            success: true,
            accessToken,
            user: userRepo.toSafeJSON(user),
        });
    } catch (err) {
        next(err);
    }
}

/* ------------------------------- refresh ------------------------------- */

export async function refresh(req, res, next) {
    try {
        const token = req.cookies?.[REFRESH_COOKIE_NAME];
        if (!token) return res.status(401).json({ success: false, message: "No refresh token provided" });

        let payload;
        try {
            payload = verifyRefreshToken(token);
        } catch {
            clearRefreshCookie(res);
            return res.status(401).json({ success: false, message: "Invalid or expired session" });
        }

        const incomingHash = hashToken(token);

        // Refresh token reuse detection: if no user matches this exact hash,
        // the token may have been stolen/replayed — invalidate the session.
        const user = await userRepo.findUserByRefreshHash(payload.sub, incomingHash);

        if (!user) {
            clearRefreshCookie(res);
            return res.status(401).json({ success: false, message: "Session invalid. Please sign in again." });
        }

        const accessToken = await issueTokensForUser(res, user); // rotates refresh token too

        res.json({ success: true, accessToken, user: userRepo.toSafeJSON(user) });
    } catch (err) {
        next(err);
    }
}

/* -------------------------------- logout -------------------------------- */

export async function logout(req, res, next) {
    try {
        const token = req.cookies?.[REFRESH_COOKIE_NAME];
        if (token) {
            try {
                const payload = verifyRefreshToken(token);
                await userRepo.unsetUserFields(payload.sub, ["refreshTokenHash"]);
            } catch {
                // The token is already invalid, so there is nothing to clean up.
            }
        }
        clearRefreshCookie(res);
        res.json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        next(err);
    }
}

/* ---------------------------- password reset ---------------------------- */

export async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body;
        const user = await userRepo.findUserByEmail(email);

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        const genericResponse = {
            success: true,
            message: "If this email is registered, a password reset link has been sent.",
        };

        if (!user || user.provider !== "local") return res.json(genericResponse);

        const { rawToken, hash } = createOneTimeToken();
        await userRepo.updateUserById(user._id, {
            resetPasswordTokenHash: hash,
            resetPasswordExpires: Date.now() + Number(process.env.PASSWORD_RESET_EXPIRES_MIN || 15) * 60 * 1000,
        });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
        await sendEmail({
            to: user.email,
            subject: "Reset your MediCare password",
            html: resetPasswordEmailTemplate(user.name, resetUrl),
        });

        res.json(genericResponse);
    } catch (err) {
        next(err);
    }
}

export async function resetPassword(req, res, next) {
    try {
        const { token, password } = req.body;
        const hash = hashToken(token);

        const user = await userRepo.findUserByResetHash(hash);
        if (!user) {
            return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });
        }

        // updateUserById hashes `password` automatically when present
        await userRepo.updateUserById(user._id, { password });
        await userRepo.unsetUserFields(user._id, [
            "resetPasswordTokenHash",
            "resetPasswordExpires",
            "refreshTokenHash", // force re-login on all devices
        ]);

        res.json({ success: true, message: "Password reset successfully. Please sign in with your new password." });
    } catch (err) {
        next(err);
    }
}

export async function verifyResetToken(req, res, next) {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        const hash = hashToken(token);
        const user = await userRepo.findUserByResetHash(hash);

        if (!user) {
            return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });
        }

        res.json({ success: true, message: "Token is valid" });
    } catch (err) {
        next(err);
    }
}

/* --------------------------------- me --------------------------------- */

export async function getMe(req, res) {
    res.json({ success: true, user: userRepo.toSafeJSON(req.user) });
}

/* ------------------------------ OAuth callback ------------------------------ */

// Called after passport successfully authenticates via Google/Facebook.
export async function oauthCallback(req, res, next) {
    try {
        const user = req.user;
        const accessToken = await issueTokensForUser(res, user)
        await issueTokensForUser(res, user);


        // Access token isn't returned in the redirect URL (avoids leaking it via
        // browser history/referrer). The frontend calls /api/auth/refresh on
        // load to exchange the httpOnly cookie for an access token.
        res.redirect(`${process.env.CLIENT_URL}/`);

    } catch (err) {
        next(err);
    }
}


export async function createDoctorInviteUser({ name, email, doctorId }) {
    const existing = await userRepo.findUserByEmail(email);
    if (existing) {
        const err = new Error("A user with this email already exists.");
        err.status = 409;
        throw err;
    }

    const user = await userRepo.createUser({
        name,
        email,
        provider: "local",
        role: "doctor",
        accountStatus: "invited",
        isVerified: false,
        doctorId,
    });

    const { rawToken, hash } = createOneTimeToken();
    await userRepo.updateUserById(user._id, {
        inviteTokenHash: hash,
        inviteTokenExpires: Date.now() + Number(process.env.INVITE_EXPIRES_HOURS || 72) * 60 * 60 * 1000,
    });

    const setPasswordUrl = `${process.env.CLIENT_URL}/set-password?token=${rawToken}`;
    await sendEmail({
        to: user.email,
        subject: "Set your password — MediCare Doctor Portal",
        html: doctorInviteEmailTemplate(user.name, setPasswordUrl),
    });

    return user;
}

// Handles invitations when an administrator needs to create or resend a login invitation
// separately from creating the doctor profile.
export async function inviteDoctor(req, res, next) {
    try {
        const { name, email, doctorId } = req.body;
        await createDoctorInviteUser({ name, email, doctorId });
        res.status(201).json({ success: true, message: "Doctor invited. An email has been sent to set their password." });
    } catch (err) {
        if (err.code === 11000 || err.status === 409) {
            return res.status(409).json({ success: false, message: "A user with this email already exists." });
        }
        next(err);
    }
}

export async function verifyInviteToken(req, res, next) {
    try {
        const token = req.query.token;
        if (!token) return res.status(400).json({ success: false, message: "Invite token is required" });

        const hash = hashToken(token);
        const user = await userRepo.findUserByInviteHash(hash);

        if (!user) {
            return res.status(410).json({ success: false, message: "This invite link is invalid or has expired." });
        }

        res.json({ success: true, doctor_name: user.name, email: user.email });
    } catch (err) {
        next(err);
    }
}

export async function setPasswordFromInvite(req, res, next) {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ success: false, message: "Token and password are required" });
        }

        const hash = hashToken(token);
        const user = await userRepo.findUserByInviteHash(hash);

        if (!user) {
            return res.status(410).json({ success: false, message: "This invite link is invalid or has expired." });
        }

        // updateUserById automatically hashes `password` when it is included.
        await userRepo.updateUserById(user._id, {
            password,
            accountStatus: "active",
            isVerified: true,
        });
        await userRepo.unsetUserFields(user._id, ["inviteTokenHash", "inviteTokenExpires"]);

        const freshUser = await userRepo.findUserById(user._id, { withSensitive: true });
        const accessToken = await issueTokensForUser(res, freshUser); // auto-login

        res.json({ success: true, accessToken, user: userRepo.toSafeJSON(freshUser) });
    } catch (err) {
        next(err);
    }
}

export async function resendDoctorInvite(req, res, next) {
    try {
        const { email } = req.body;
        const user = await userRepo.findUserByEmail(email);

        const genericResponse = {
            success: true,
            message: "If a pending invite exists for this email, a new link has been sent.",
        };

        if (!user || user.role !== "doctor" || user.accountStatus !== "invited") {
            return res.json(genericResponse);
        }

        const { rawToken, hash } = createOneTimeToken();
        await userRepo.updateUserById(user._id, {
            inviteTokenHash: hash,
            inviteTokenExpires: Date.now() + Number(process.env.INVITE_EXPIRES_HOURS || 72) * 60 * 60 * 1000,
        });

        const setPasswordUrl = `${process.env.CLIENT_URL}/set-password?token=${rawToken}`;
        await sendEmail({
            to: user.email,
            subject: "Set your password — MediCare Doctor Portal",
            html: doctorInviteEmailTemplate(user.name, setPasswordUrl),
        });

        res.json(genericResponse);
    } catch (err) {
        next(err);
    }
}