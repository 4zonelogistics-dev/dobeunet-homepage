import { Handler, HandlerEvent } from '@netlify/functions';
import { getDatabase } from './mongodb';

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const db = await getDatabase();

    // Check database connection
    const adminDb = db.admin();
    const serverStatus = await adminDb.serverStatus().catch(() => null);

    // Get collection stats
    const leadsCollection = db.collection('leads');
    const errorsCollection = db.collection('error_logs');

    // Get collection statistics
    const leadsStats = await leadsCollection.stats().catch(() => null);
    const errorsStats = await errorsCollection.stats().catch(() => null);

    // Get indexes
    const leadsIndexes = await leadsCollection.indexes();
    const errorsIndexes = await errorsCollection.indexes();

    // Get sample documents
    const sampleLead = await leadsCollection.findOne({});
    const sampleError = await errorsCollection.findOne({});

    // Count documents
    const leadsCount = await leadsCollection.countDocuments();
    const errorsCount = await errorsCollection.countDocuments();

    // Check for recent data (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentLeads = await leadsCollection.countDocuments({
      created_at: { $gte: yesterday },
    });

    const recentErrors = await errorsCollection.countDocuments({
      timestamp: { $gte: yesterday },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        connection: {
          connected: serverStatus !== null,
          serverVersion: serverStatus?.version || null,
        },
        database: {
          name: db.databaseName,
        },
        collections: {
          leads: {
            exists: leadsStats !== null,
            count: leadsCount,
            recentCount: recentLeads,
            size: leadsStats?.size || 0,
            indexes: leadsIndexes.length,
            indexDetails: leadsIndexes,
            sample: sampleLead ? {
              _id: sampleLead._id,
              name: sampleLead.name,
              email: sampleLead.email,
              created_at: sampleLead.created_at,
            } : null,
          },
          error_logs: {
            exists: errorsStats !== null,
            count: errorsCount,
            recentCount: recentErrors,
            size: errorsStats?.size || 0,
            indexes: errorsIndexes.length,
            indexDetails: errorsIndexes,
            sample: sampleError ? {
              _id: sampleError._id,
              error_type: sampleError.error_type,
              severity: sampleError.severity,
              timestamp: sampleError.timestamp,
            } : null,
          },
        },
        health: {
          status: serverStatus !== null && leadsStats !== null && errorsStats !== null ? 'healthy' : 'degraded',
          timestamp: new Date().toISOString(),
        },
      }),
    };
  } catch (error) {
    console.error('Error verifying data:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        health: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
        },
      }),
    };
  }
};

