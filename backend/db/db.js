import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";
import dns from "node:dns";

// Configure Node.js to use Google DNS directly.
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbanp2q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`.trim();

let client;
let db;

export async function connectDB() {
    if (db) {
        return db;
    }

    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: false,
            deprecationErrors: true,
        },
    });

    await client.connect();

    db = client.db("Medicare");

    console.log("✅ MongoDB Connected Successfully");

    return db;
}

export function getDB() {
    if (!db) {
        throw new Error("❌ Database not initialized.");
    }
    return db;
}