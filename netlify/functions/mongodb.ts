import { MongoClient, Db, Collection } from 'mongodb';

// MongoDB connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Global variable to cache the MongoDB client across function invocations
let cachedClient: MongoClient | null = null;
const MAX_CONNECTION_ATTEMPTS = 3;

/**
 * Connect to MongoDB using connection pooling
 * Reuses the connection across Lambda function invocations for better performance
 * Includes retry logic and connection health checks
 */
export async function connectToDatabase(): Promise<MongoClient> {
  // Check if we have a cached client and it's still connected
  if (cachedClient) {
    try {
      // Ping the database to check if connection is alive
      await cachedClient.db('admin').command({ ping: 1 });
      return cachedClient;
    } catch {
      // Connection is dead, reset and reconnect
      console.warn('Cached MongoDB connection is dead, reconnecting...');
      cachedClient = null;
    }
  }

  // Create new client with optimized connection pool settings
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10, // Maximum number of connections in the pool
    minPoolSize: 2, // Minimum number of connections to maintain
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    serverSelectionTimeoutMS: 5000, // How long to try selecting a server
    socketTimeoutMS: 45000, // How long to wait for a socket operation
    connectTimeoutMS: 10000, // How long to wait for initial connection
    retryWrites: true, // Retry write operations on network errors
    retryReads: true, // Retry read operations on network errors
  });

  // Attempt connection with retry logic
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= MAX_CONNECTION_ATTEMPTS; attempt++) {
    try {
      await client.connect();
      
      // Verify connection by pinging the database
      await client.db('admin').command({ ping: 1 });
      
      cachedClient = client;
      console.log(`MongoDB connected successfully (attempt ${attempt})`);
      return client;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`MongoDB connection attempt ${attempt} failed:`, lastError.message);
      
      if (attempt < MAX_CONNECTION_ATTEMPTS) {
        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All connection attempts failed
  throw new Error(
    `Failed to connect to MongoDB after ${MAX_CONNECTION_ATTEMPTS} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Get the database instance
 * Ensures connection is healthy before returning database
 */
export async function getDatabase(): Promise<Db> {
  const client = await connectToDatabase();
  const db = client.db('dobeunet'); // Database name
  
  // Verify database is accessible
  try {
    await db.admin().ping();
  } catch (error) {
    console.error('Database ping failed:', error);
    throw new Error('Database is not accessible');
  }
  
  return db;
}

/**
 * Helper to get a collection
 * Includes validation that collection exists (optional check)
 */
export async function getCollection<T = Document>(collectionName: string): Promise<Collection<T>> {
  const db = await getDatabase();
  const collection = db.collection<T>(collectionName);
  
  // Verify collection exists by checking if database has collections
  // This is a lightweight check that doesn't require listing all collections
  try {
    const stats = await collection.stats().catch(() => null);
    if (stats === null) {
      console.warn(`Collection '${collectionName}' may not exist or is empty`);
    }
  } catch (error) {
    // Stats check failed, but collection might still be valid
    console.warn(`Could not verify collection '${collectionName}':`, error);
  }
  
  return collection;
}

/**
 * Health check function to verify MongoDB connection and database status
 */
export async function checkHealth(): Promise<{
  connected: boolean;
  database: string;
  collections: string[];
  error?: string;
}> {
  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();
    
    return {
      connected: true,
      database: db.databaseName,
      collections: collections.map(c => c.name),
    };
  } catch (error) {
    return {
      connected: false,
      database: 'dobeunet',
      collections: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Close the MongoDB connection (useful for cleanup in tests)
 */
export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    console.log('MongoDB connection closed');
  }
}

