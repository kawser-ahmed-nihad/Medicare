import express from "express";
import passport from "passport";
import {
    register,
    verifyEmail,
    resendVerification,
    login,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    getMe,
    oauthCallback,
    verifyResetToken,
    verifyInviteToken,
    setPasswordFromInvite,
    resendDoctorInvite,
    inviteDoctor,
} from "../controllers/authController.js";

import { requireAuth, requireRole } from "../middleware/auth.JS";
import { authLimiter, loginLimiter } from "../middleware/rateLimiter.js";
import {
    validate,
    registerRules,
    loginRules,
    emailOnlyRules,
    resetPasswordRules,
} from "../middleware/validators.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

/* ------------------------- Local email/password ------------------------- */

router.post("/register", authLimiter, upload.single("avatar"), register);
router.get("/verify-email", verifyEmail);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", authLimiter, emailOnlyRules, validate, resendVerification);

router.post("/login", loginLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.post("/forgot-password", authLimiter, emailOnlyRules, validate, forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordRules, validate, resetPassword);
router.post("/verify-reset-token", verifyResetToken);
router.get("/me", requireAuth, getMe);

router.post("/invite-doctor", requireAuth, requireRole("admin"), inviteDoctor);
router.get("/verify-invite", verifyInviteToken);
router.post("/set-password", setPasswordFromInvite);
router.post("/resend-invite", resendDoctorInvite);


/* ------------------------------ Google OAuth ------------------------------ */

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    }),
    oauthCallback
);

/* ----------------------------- Facebook OAuth ----------------------------- */

/* ------------------------------ GitHub OAuth ------------------------------ */

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"], session: false })
);

router.get(
    "/github/callback",
    passport.authenticate("github", {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
    }),
    oauthCallback
);

export default router;