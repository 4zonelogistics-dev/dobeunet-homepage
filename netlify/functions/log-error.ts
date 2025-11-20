import { Handler, HandlerEvent } from '@netlify/functions';
import { getCollection } from './mongodb';

interface ErrorLog {
  error_type: 'NETWORK' | 'VALIDATION' | 'DATABASE' | 'AUTHENTICATION' | 'UNEXPECTED' | 'TIMEOUT';
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  user_message: string;
  code?: string;
  details?: Record<string, unknown>;
  user_agent?: string;
  url?: string;
  stack?: string;
  timestamp: Date;
  created_at: Date;
}

export const handler: Handler = async (
  event: HandlerEvent
) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    
    // Validate required fields
    if (!body.error_type || !body.severity || !body.message || !body.user_message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Create error log document
    const errorLog: ErrorLog = {
      error_type: body.error_type,
      severity: body.severity,
      message: body.message,
      user_message: body.user_message,
      code: body.code,
      details: body.details || {},
      user_agent: body.user_agent || event.headers['user-agent'],
      url: body.url,
      stack: body.stack,
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
      created_at: new Date(),
    };

    // Insert into MongoDB
    const collection = await getCollection<ErrorLog>('error_logs');
    const result = await collection.insertOne(errorLog);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: result.insertedId,
      }),
    };

  } catch (error) {
    console.error('Error logging error:', error);
    
    // Don't fail if error logging fails - just log to console
    return {
      statusCode: 200, // Return 200 to not break the app
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to log error',
      }),
    };
  }
};

