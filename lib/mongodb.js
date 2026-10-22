import { MongoClient } from "mongodb";

// Lazy connection: nothing runs (or crashes) at import time.
// If MONGODB_URI is missing or MongoDB is down, getDb() throws and callers fall back gracefully.
export async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing in .env.local");
  if (!global._mongoPromise) {
    global._mongoPromise = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 })
      .connect()
      .catch((e) => { global._mongoPromise = undefined; throw e; });
  }
  return (await global._mongoPromise).db(process.env.MONGODB_DB || "fornello");
}
