import { MongoClient } from 'mongodb';

// MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global variable to cache the MongoDB client across function invocations
let cachedClient: MongoClient | null = null;

/**
 * Connect to MongoDB using connection pooling
 * Reuses the connection across Lambda function invocations for better performance
 */
export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
  });

  await client.connect();
  cachedClient = client;

  return client;
}

/**
 * Get the database instance
 */
export async function getDatabase() {
  const client = await connectToDatabase();
  return client.db('dobeunet'); // Database name
}

/**
 * Helper to get a collection
 */
export async function getCollection<T = Document>(collectionName: string) {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

