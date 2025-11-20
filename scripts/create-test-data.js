import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Missing MONGODB_URI environment variable');
  process.exit(1);
}

const SAMPLE_LEADS = [
  {
    name: 'Alicia Martinez',
    email: 'alicia@shorelinehospitality.com',
    company: 'Shoreline Hospitality Group',
    business_type: 'restaurant',
    phone: '+1 (609) 555-0198',
    message: 'Need visibility into weekly food waste for our Jersey Shore locations.',
    submission_type: 'strategy',
    estimated_locations: 18,
    headcount: 420,
    location: {
      city: 'Atlantic City',
      state: 'NJ',
      postal_code: '08401',
      coordinates: {
        type: 'Point',
        coordinates: [-74.4229, 39.3643],
      },
    },
    marketing: {
      utm_source: 'paid_search',
      utm_medium: 'google',
      utm_campaign: 'food_waste_tracking',
      lead_source: 'contact_modal',
    },
  },
  {
    name: 'Marcus Greene',
    email: 'marcus@tri-statefleet.com',
    company: 'Tri-State Fleet Logistics',
    business_type: 'fleet',
    phone: '+1 (856) 555-1122',
    message: 'Evaluating pilot for DVIR compliance dashboards.',
    submission_type: 'pilot',
    estimated_locations: 7,
    headcount: 260,
    location: {
      city: 'Camden',
      state: 'NJ',
      postal_code: '08102',
      coordinates: {
        type: 'Point',
        coordinates: [-75.1196, 39.9259],
      },
    },
    marketing: {
      utm_source: 'event',
      utm_medium: 'conference',
      utm_campaign: 'fleet_ops_summit',
      lead_source: 'account_based',
    },
  },
  {
    name: 'Priya Desai',
    email: 'priya@phillyfreshdining.com',
    company: 'Philly Fresh Dining',
    business_type: 'restaurant',
    phone: '+1 (215) 555-0901',
    message: 'Looking for AP automation to replace manual invoice entry.',
    submission_type: 'strategy',
    estimated_locations: 9,
    headcount: 185,
    location: {
      city: 'Philadelphia',
      state: 'PA',
      postal_code: '19103',
      coordinates: {
        type: 'Point',
        coordinates: [-75.1652, 39.9526],
      },
    },
    marketing: {
      utm_source: 'organic',
      utm_medium: 'seo',
      utm_campaign: 'ap_automation',
      lead_source: 'blog_cta',
    },
  },
];

const SAMPLE_ERRORS = [
  {
    error_type: 'NETWORK',
    severity: 'WARNING',
    message: 'Failed to fetch analytics widget',
    user_message: 'We could not refresh analytics right now.',
    timestamp: new Date(),
    created_at: new Date(),
  },
  {
    error_type: 'VALIDATION',
    severity: 'ERROR',
    message: 'User submitted invalid postal code',
    user_message: 'Postal code must be a 5 digit value.',
    timestamp: new Date(),
    created_at: new Date(),
  },
];

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('dobeunet');
    const leadsCollection = db.collection('leads');
    const errorsCollection = db.collection('error_logs');

    const now = new Date();
    const enrichedLeads = SAMPLE_LEADS.map((lead, idx) => ({
      ...lead,
      created_at: new Date(now.getTime() - idx * 86400000),
      updated_at: new Date(),
      score: 75 + idx * 5,
      priority: idx === 0 ? 'hot' : idx === 1 ? 'warm' : 'nurture',
      insights: {
        ideal_software_tier: idx === 0 ? 'enterprise' : 'growth',
        recommended_product_focus: idx === 1 ? 'Compliance automation' : 'Food waste + AP automation',
        follow_up_actions: ['Send ROI summary', 'Schedule discovery call'],
      },
      enrichment_status: 'complete',
      tags: ['sample_data', lead.business_type],
    }));

    if (enrichedLeads.length) {
      await leadsCollection.insertMany(enrichedLeads);
    }
    if (SAMPLE_ERRORS.length) {
      await errorsCollection.insertMany(SAMPLE_ERRORS);
    }

    console.log(`Inserted ${enrichedLeads.length} sample leads and ${SAMPLE_ERRORS.length} error logs.`);
  } finally {
    await client.close();
  }
}

main().catch(error => {
  console.error('Failed to seed test data:', error);
  process.exit(1);
});

