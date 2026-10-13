import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";

// Fields that must never be sent to the client
const SENSITIVE_FIELDS = [
    "password",
    "verificationTokenHash",
    "verificationTokenExpires",
    "resetPasswordTokenHash",
    "resetPasswordExpires",
    "refreshTokenHash",
    "failedLoginAttempts",
    "lockUntil",
    "inviteTokenHash",
    "inviteTokenExpires",
];

function usersCollection() {
    return getDB().collection("users");
}

function projectionExcludingSensitive() {
    const proj = {};
    SENSITIVE_FIELDS.forEach((f) => (proj[f] = 0));
    return proj;
}

/** Strips sensitive fields and stringifies _id — safe to send in a response. */
export function toSafeJSON(user) {
    if (!user) return null;
    const safe = { ...user, _id: user._id?.toString() };
    SENSITIVE_FIELDS.forEach((f) => delete safe[f]);
    return safe;
}

export async function hashPassword(plainPassword) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(user, candidatePassword) {
    if (!user?.password) return false; // OAuth-only users have no password
    return bcrypt.compare(candidatePassword, user.password);
}

export function isLocked(user) {
    return !!(user.lockUntil && user.lockUntil > Date.now());
}

/* --------------------------------- CRUD --------------------------------- */

export async function createUser({ name, email, password, provider = "local", ...rest }) {
    const now = new Date();
    const doc = {
        name,
        email: email.toLowerCase(),
        provider,
        isVerified: false,
        failedLoginAttempts: 0,
        role: "patient",
        createdAt: now,
        updatedAt: now,
        ...rest,
    };

    if (password) {
        doc.password = await hashPassword(password);
    }

    const result = await usersCollection().insertOne(doc);
    return { _id: result.insertedId, ...doc };
}

/**
 * @param {object} opts
 * @param {boolean} opts.withSensitive - include password/token hashes/etc.
 *   Needed for login/verify/reset flows; omit for anything returned to the client.
 */
export async function findUserByEmail(email, { withSensitive = false } = {}) {
    const projection = withSensitive ? {} : projectionExcludingSensitive();
    return usersCollection().findOne({ email: email.toLowerCase() }, { projection });
}

export async function findUserById(id, { withSensitive = false } = {}) {
    if (!ObjectId.isValid(id)) return null;
    const projection = withSensitive ? {} : projectionExcludingSensitive();
    return usersCollection().findOne({ _id: new ObjectId(id) }, { projection });
}

export async function findUserByProviderId(field, value) {
    // The field is either "googleId" or "facebookId". This lookup includes sensitive fields
    // because it is used only internally during the OAuth flow.
    return usersCollection().findOne({ [field]: value });
}

export async function findUserByVerificationHash(hash) {
    return usersCollection().findOne({
        verificationTokenHash: hash,
        verificationTokenExpires: { $gt: Date.now() },
    });
}

export async function findUserByResetHash(hash) {
    return usersCollection().findOne({
        resetPasswordTokenHash: hash,
        resetPasswordExpires: { $gt: Date.now() },
    });
}

export async function findUserByInviteHash(hash) {
    return usersCollection().findOne({
        inviteTokenHash: hash,
        inviteTokenExpires: { $gt: Date.now() },
    });
}

export async function findUserByRefreshHash(id, hash) {
    if (!ObjectId.isValid(id)) return null;
    return usersCollection().findOne({ _id: new ObjectId(id), refreshTokenHash: hash });
}

export async function updateUserById(id, update) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    const finalUpdate = { ...update, updatedAt: new Date() };

    // Hash password if it's being changed here
    if (finalUpdate.password) {
        finalUpdate.password = await hashPassword(finalUpdate.password);
    }

    await usersCollection().updateOne({ _id }, { $set: finalUpdate });
}

export async function unsetUserFields(id, fields) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    const unsetObj = {};
    fields.forEach((f) => (unsetObj[f] = ""));
    await usersCollection().updateOne(
        { _id },
        { $unset: unsetObj, $set: { updatedAt: new Date() } }
    );
}

export async function incrementFailedAttempts(id, currentAttempts, maxAttempts, lockTimeMs) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    const nextAttempts = currentAttempts + 1;

    if (nextAttempts >= maxAttempts) {
        await usersCollection().updateOne(
            { _id },
            { $set: { failedLoginAttempts: 0, lockUntil: new Date(Date.now() + lockTimeMs) } }
        );
    } else {
        await usersCollection().updateOne({ _id }, { $set: { failedLoginAttempts: nextAttempts } });
    }
}

export async function resetFailedAttempts(id) {
    const _id = typeof id === "string" ? new ObjectId(id) : id;
    await usersCollection().updateOne(
        { _id },
        { $set: { failedLoginAttempts: 0 }, $unset: { lockUntil: "" } }
    );
}

export async function findUserByDoctorId(doctorId) {
    const ids = [String(doctorId)];
    if (ObjectId.isValid(doctorId)) ids.push(new ObjectId(doctorId));
    return usersCollection().findOne({ doctorId: { $in: ids } });
}

export async function findUsersByIds(ids) {
    const objectIds = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
    if (objectIds.length === 0) return [];
    return usersCollection().find({ _id: { $in: objectIds } }, { projection: projectionExcludingSensitive() }).toArray();
}

