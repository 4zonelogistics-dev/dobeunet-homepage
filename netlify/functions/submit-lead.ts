import { Handler, HandlerEvent } from '@netlify/functions';
import { getCollection } from './mongodb';

interface Lead {
  name: string;
  email: string;
  company: string;
  business_type: string;
  phone: string;
  message: string;
  submission_type: 'strategy' | 'pilot';
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
    const requiredFields = ['name', 'email', 'company', 'business_type', 'phone', 'submission_type'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          fields: missingFields,
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Validate submission_type
    if (!['strategy', 'pilot'].includes(body.submission_type)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid submission type' }),
      };
    }

    // Create lead document
    const lead: Lead = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      company: body.company.trim(),
      business_type: body.business_type,
      phone: body.phone.trim(),
      message: body.message ? body.message.trim() : '',
      submission_type: body.submission_type,
      created_at: new Date(),
    };

    // Insert into MongoDB
    const collection = await getCollection<Lead>('leads');
    const result = await collection.insertOne(lead);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        id: result.insertedId,
      }),
    };

  } catch (error) {
    console.error('Error submitting lead:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

