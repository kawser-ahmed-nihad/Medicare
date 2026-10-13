import { ObjectId } from "mongodb";
import { getDB } from "../db/db.js";

function messagesCollection() {
    return getDB().collection("messages");
}

export async function create({ conversationId, senderId, senderRole, text, attachments }) {
    const doc = {
        conversationId: typeof conversationId === "string" ? new ObjectId(conversationId) : conversationId,
        senderId,
        senderRole, // "doctor" | "patient"
        text: text || null,
        attachments: attachments || [],
        createdAt: new Date(),
    };
    const result = await messagesCollection().insertOne(doc);
    return { _id: result.insertedId, ...doc };
}

// When `after` is provided, returns only newer messages to avoid refetching old messages during polling.
export async function findByConversation(conversationId, { after } = {}) {
    const filter = { conversationId: typeof conversationId === "string" ? new ObjectId(conversationId) : conversationId };
    if (after) filter.createdAt = { $gt: new Date(after) };
    return messagesCollection().find(filter).sort({ createdAt: 1 }).toArray();
}