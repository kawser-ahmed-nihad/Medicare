import 'dotenv/config';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import * as userRepo from "../model/userRepository.js";

/**
 * Finds an existing user by provider ID or email, or creates a new one.
 * OAuth users are marked isVerified: true immediately — the provider
 * has already confirmed the email address on our behalf.
 */
async function findOrCreateOAuthUser({ provider, providerId, email, name, avatar }) {
    const idField = provider === "google" ? "googleId" : "facebookId";

    let user = await userRepo.findUserByProviderId(idField, providerId);
    if (user) return user;

    // Link to an existing local account with the same email, if one exists.
    if (email) {
        user = await userRepo.findUserByEmail(email, { withSensitive: true });
        if (user) {
            const update = { [idField]: providerId, isVerified: true };
            if (!user.avatar && avatar) update.avatar = avatar;
            await userRepo.updateUserById(user._id, update);
            return { ...user, ...update };
        }
    }

    user = await userRepo.createUser({
        name: name || "New User",
        email: email || `${providerId}@${provider}.oauth`,
        provider,
        [idField]: providerId,
        avatar,
        isVerified: true,
    });

    return user;
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await findOrCreateOAuthUser({
                    provider: "google",
                    providerId: profile.id,
                    email: profile.emails?.[0]?.value,
                    name: profile.displayName,
                    avatar: profile.photos?.[0]?.value,
                });
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,

        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let userEmail = profile.emails?.find((e) => e.primary)?.value;


                if (!userEmail) {
                    userEmail = profile.emails?.find((e) => e.verified)?.value;
                }


                if (!userEmail) {
                    userEmail = profile.emails?.[0]?.value;
                }

                const user = await findOrCreateOAuthUser({
                    provider: "github",
                    providerId: profile.id,
                    email: userEmail,
                    name: profile.displayName || profile.username,
                    avatar: profile.photos?.[0]?.value,
                });
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

// Stateless API (JWT-based) — we don't use passport sessions,
// but serialize/deserialize are still required by passport internals.
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userRepo.findUserById(id, { withSensitive: true });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;