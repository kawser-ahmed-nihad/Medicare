import * as userRepo from "../model/userRepository.js";

// Fills in missing patient names and phone numbers from the users collection.
export async function withPatientNames(appointments) {
    const ids = [...new Set(appointments.map((a) => String(a.patientId)))];
    const users = await userRepo.findUsersByIds(ids);
    const map = new Map(users.map((u) => [String(u._id), u]));

    return appointments.map((a) => {
        const u = map.get(String(a.patientId));
        return {
            ...a,
            patientName: a.patientName || u?.name || null,
            patientPhone: a.patientPhone || u?.phone || null,
        };
    });
}