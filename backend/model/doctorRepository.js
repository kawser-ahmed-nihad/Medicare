import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";

function doctorsCollection() {
    return getDB().collection("doctors");
}

export async function createDoctor(data) {
    const now = new Date();
    const doc = {
        ...data,
        rating: 0,
        reviewCount: 0,
        createdAt: now,
        updatedAt: now,
    };
    const result = await doctorsCollection().insertOne(doc);
    return { _id: result.insertedId, ...doc };
}

export async function findDoctorByEmail(email) {
    return doctorsCollection().findOne({ email: email });
}


export async function findDoctorById(id, { public: isPublic = false } = {}) {
    if (!ObjectId.isValid(id)) return null;
    const projection = isPublic ? { nid: 0, date_of_birth: 0 } : {};
    return doctorsCollection().findOne({ _id: new ObjectId(id) }, { projection });
}

export async function linkUserToDoctor(doctorId, userId) {
    await doctorsCollection().updateOne(
        { _id: new ObjectId(doctorId) },
        { $set: { userId, updatedAt: new Date() } }
    );
}

export async function deleteDoctorById(id) {
    if (!ObjectId.isValid(id)) return null;
    return doctorsCollection().deleteOne({ _id: new ObjectId(id) });
}

export async function findAllDoctors(query = {}) {
    const {
        search,
        department,
        gender,
        location,
        minExperience,
        maxExperience,
        minRating,
        minFee,
        maxFee,
        sortBy = "recommended",
        page = 1,
        limit = 9,
    } = query;

    const filter = { status: { $ne: "inactive" } }; // Exclude inactive doctors from the list.

    if (search) {
        filter.$or = [
            { first_name: { $regex: search, $options: "i" } },
            { last_name: { $regex: search, $options: "i" } },
            { department: { $regex: search, $options: "i" } },
            { designation: { $regex: search, $options: "i" } },
        ];
    }

    if (department) {
        const depts = Array.isArray(department) ? department : department.split(",");
        filter.department = { $in: depts };
    }

    if (gender) {
        const genders = Array.isArray(gender) ? gender : gender.split(",");
        filter.gender = { $in: genders };
    }

    if (location) {
        filter.location = location;
    }

    if (minExperience || maxExperience) {
        filter.experience_years = {};
        if (minExperience) filter.experience_years.$gte = Number(minExperience);
        if (maxExperience) filter.experience_years.$lte = Number(maxExperience);
    }

    if (minRating) {
        filter.rating = { $gte: Number(minRating) };
    }

    if (minFee || maxFee) {
        filter.consultation_fee = {};
        if (minFee) filter.consultation_fee.$gte = Number(minFee);
        if (maxFee) filter.consultation_fee.$lte = Number(maxFee);
    }

    const sortMap = {
        recommended: { rating: -1, reviewCount: -1 },
        experience_desc: { experience_years: -1 },
        fee_asc: { consultation_fee: 1 },
        fee_desc: { consultation_fee: -1 },
        rating_desc: { rating: -1 },
        newest: { createdAt: -1 },
    };
    const sort = sortMap[sortBy] || sortMap.recommended;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [doctors, total] = await Promise.all([
        doctorsCollection().find(filter).sort(sort).skip(skip).limit(limitNum).toArray(),
        doctorsCollection().countDocuments(filter),
    ]);

    return {
        doctors,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    };
}

// Returns counts for the filter sidebar, such as Cardiology (12) and Neurology (8).
export async function getDepartmentCounts() {
    return doctorsCollection()
        .aggregate([
            { $match: { status: { $ne: "inactive" } } },
            { $group: { _id: "$department", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ])
        .toArray();
}


const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function adminList({ q, department, status, page = 1, limit = 10 }) {
    const filter = {};
    if (q) {
        const rx = { $regex: escapeRegex(q), $options: "i" };
        filter.$or = [{ first_name: rx }, { last_name: rx }, { email: rx }, { department: rx }, { designation: rx }];
    }
    if (department) filter.department = department;
    if (status) filter.status = status;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Math.min(50, Number(limit)));

    const [doctors, total] = await Promise.all([
        doctorsCollection().find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).toArray(),
        doctorsCollection().countDocuments(filter),
    ]);
    return { doctors, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) };
}

// Returns a system-wide summary without filters.
export async function adminSummary() {
    const [byStatus, byDepartment] = await Promise.all([
        doctorsCollection().aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
        doctorsCollection().aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }, { $sort: { count: -1 } }]).toArray(),
    ]);
    const s = Object.fromEntries(byStatus.map((x) => [x._id, x.count]));
    return {
        stats: {
            total: byStatus.reduce((n, x) => n + x.count, 0),
            active: s.available || 0,
            onLeave: s.on_leave || 0,
            inactive: s.inactive || 0,
        },
        byDepartment: byDepartment.map((x) => ({ name: x._id || "Others", count: x.count })),
    };
}

export async function updateDoctorStatus(id, status) {
    if (!ObjectId.isValid(id)) return null;
    return doctorsCollection().updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
}

export async function deleteUsersByDoctorId(doctorId) {
    const ids = [String(doctorId)];
    if (ObjectId.isValid(doctorId)) ids.push(new ObjectId(doctorId));
    return usersCollection().deleteMany({ doctorId: { $in: ids } });
}

export async function findUserByDoctorId(doctorId) {
    const ids = [String(doctorId)];
    if (ObjectId.isValid(doctorId)) ids.push(new ObjectId(doctorId));
    return usersCollection().findOne({ doctorId: { $in: ids } });
}