/**
 * MongoDB Atlas Setup Script
 * 
 * This script sets up:
 * 1. Collections with validation
 * 2. Indexes for performance
 * 3. Atlas Search indexes (requires manual creation in Atlas UI)
 * 
 * Run this in MongoDB Atlas Shell or MongoDB Compass
 */

// Connect to database
use('dobeunet');

// ============================================
// LEADS COLLECTION
// ============================================

// Create leads collection with validation
db.createCollection('leads', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'company', 'business_type', 'phone', 'submission_type', 'created_at'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100,
          description: 'Lead name (2-100 characters)',
        },
        email: {
          bsonType: 'string',
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          description: 'Valid email address',
        },
        company: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100,
          description: 'Company name (2-100 characters)',
        },
        business_type: {
          bsonType: 'string',
          description: 'Type of business',
        },
        phone: {
          bsonType: 'string',
          description: 'Phone number',
        },
        message: {
          bsonType: 'string',
          maxLength: 1000,
          description: 'Optional message (max 1000 characters)',
        },
        submission_type: {
          enum: ['strategy', 'pilot'],
          description: 'Type of submission',
        },
        created_at: {
          bsonType: 'date',
          description: 'Creation timestamp',
        },
      },
    },
  },
});

// Create indexes for leads
print('Creating indexes for leads collection...');

// Email index (unique)
db.leads.createIndex({ email: 1 }, { name: 'email_1' });

// Created date index (for sorting)
db.leads.createIndex({ created_at: -1 }, { name: 'created_at_-1' });

// Submission type index
db.leads.createIndex({ submission_type: 1 }, { name: 'submission_type_1' });

// Business type index
db.leads.createIndex({ business_type: 1 }, { name: 'business_type_1' });

// Compound index for common queries
db.leads.createIndex(
  { submission_type: 1, created_at: -1 },
  { name: 'submission_type_created_at' }
);

// Text index for basic text search (fallback if Atlas Search not available)
db.leads.createIndex(
  { name: 'text', email: 'text', company: 'text', message: 'text' },
  { name: 'text_search', weights: { name: 10, email: 5, company: 8, message: 1 } }
);

print('✓ Leads collection and indexes created');

// ============================================
// ERROR_LOGS COLLECTION
// ============================================

// Create error_logs collection
db.createCollection('error_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['error_type', 'severity', 'message', 'user_message', 'timestamp', 'created_at'],
      properties: {
        error_type: {
          enum: ['NETWORK', 'VALIDATION', 'DATABASE', 'AUTHENTICATION', 'UNEXPECTED', 'TIMEOUT'],
          description: 'Type of error',
        },
        severity: {
          enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
          description: 'Error severity level',
        },
        message: {
          bsonType: 'string',
          description: 'Technical error message',
        },
        user_message: {
          bsonType: 'string',
          description: 'User-friendly error message',
        },
        code: {
          bsonType: 'string',
          description: 'Optional error code',
        },
        details: {
          bsonType: 'object',
          description: 'Additional error details',
        },
        user_agent: {
          bsonType: 'string',
          description: 'User agent string',
        },
        url: {
          bsonType: 'string',
          description: 'URL where error occurred',
        },
        stack: {
          bsonType: 'string',
          description: 'Error stack trace',
        },
        timestamp: {
          bsonType: 'date',
          description: 'Error timestamp',
        },
        created_at: {
          bsonType: 'date',
          description: 'Creation timestamp',
        },
      },
    },
  },
});

// Create indexes for error_logs
print('Creating indexes for error_logs collection...');

// Timestamp index (for sorting)
db.error_logs.createIndex({ timestamp: -1 }, { name: 'timestamp_-1' });

// Created date index
db.error_logs.createIndex({ created_at: -1 }, { name: 'created_at_-1' });

// Severity index
db.error_logs.createIndex({ severity: 1 }, { name: 'severity_1' });

// Error type index
db.error_logs.createIndex({ error_type: 1 }, { name: 'error_type_1' });

// Compound index for filtering
db.error_logs.createIndex(
  { severity: 1, error_type: 1, timestamp: -1 },
  { name: 'severity_error_type_timestamp' }
);

// TTL index to auto-delete logs older than 90 days
db.error_logs.createIndex(
  { created_at: 1 },
  { expireAfterSeconds: 7776000, name: 'ttl_90_days' } // 90 days in seconds
);

// Text index for basic text search (fallback if Atlas Search not available)
db.error_logs.createIndex(
  { message: 'text', user_message: 'text', stack: 'text', code: 'text' },
  { name: 'text_search', weights: { message: 10, user_message: 5, stack: 3, code: 2 } }
);

print('✓ Error_logs collection and indexes created');

// ============================================
// VERIFICATION
// ============================================

print('\n=== Verification ===');
print('Collections:');
db.getCollectionNames().forEach((name) => {
  print(`  - ${name}`);
});

print('\nLeads indexes:');
db.leads.getIndexes().forEach((index) => {
  print(`  - ${index.name}: ${JSON.stringify(index.key)}`);
});

print('\nError_logs indexes:');
db.error_logs.getIndexes().forEach((index) => {
  print(`  - ${index.name}: ${JSON.stringify(index.key)}`);
});

print('\n✓ Setup complete!');
print('\n⚠️  IMPORTANT: Create Atlas Search indexes manually in MongoDB Atlas UI:');
print('   1. Go to Atlas → Search → Create Search Index');
print('   2. Create index "leads_search" on "leads" collection');
print('   3. Create index "error_logs_search" on "error_logs" collection');
print('   4. Use "JSON Editor" and see mongodb-atlas-search-indexes.json for configuration');

