# MongoDB Atlas Search Setup Guide

**Date:** November 20, 2025  
**Status:** ✅ Complete Setup Instructions

---

## 🎯 Overview

This guide will help you set up MongoDB Atlas Search for full-text search capabilities on your `leads` and `error_logs` collections.

---

## 📋 Prerequisites

- MongoDB Atlas account
- Cluster running (M10 or higher recommended for production)
- Database: `dobeunet`
- Collections: `leads`, `error_logs`

---

## 🚀 Step 1: Run Database Setup Script

### Option A: MongoDB Atlas Shell

1. Go to MongoDB Atlas → Browse Collections
2. Click "..." → "Open MongoDB Shell"
3. Copy and paste the contents of `scripts/mongodb-setup.js`
4. Run the script

### Option B: MongoDB Compass

1. Connect to your cluster using MongoDB Compass
2. Select database `dobeunet`
3. Open MongoDB Shell (bottom panel)
4. Copy and paste the contents of `scripts/mongodb-setup.js`
5. Run the script

### Option C: Command Line (mongosh)

```bash
mongosh "mongodb+srv://jeremyw_db_user:feZWyP9XWtYeanXC@dbe-dobeunet.0tw3wi9.mongodb.net/dobeunet"
```

Then paste and run the script.

---

## 🔍 Step 2: Create Atlas Search Indexes

### For Leads Collection

1. **Go to Atlas Search:**
   - MongoDB Atlas Dashboard
   - Click "Search" in left sidebar
   - Click "Create Search Index"

2. **Configure Index:**
   - **Index Name:** `leads_search`
   - **Database:** `dobeunet`
   - **Collection:** `leads`
   - **Index Type:** "JSON Editor"

3. **Paste Configuration:**
   ```json
   {
     "mappings": {
       "dynamic": true,
       "fields": {
         "name": {
           "type": "string",
           "analyzer": "lucene.standard",
           "searchAnalyzer": "lucene.standard"
         },
         "email": {
           "type": "string",
           "analyzer": "lucene.standard",
           "searchAnalyzer": "lucene.standard"
         },
         "company": {
           "type": "string",
           "analyzer": "lucene.standard",
           "searchAnalyzer": "lucene.standard"
         },
         "business_type": {
           "type": "string",
           "analyzer": "lucene.standard",
           "searchAnalyzer": "lucene.standard"
         },
         "phone": {
           "type": "string",
           "analyzer": "lucene.standard",
           "searchAnalyzer": "lucene.standard"
         },
         "message": {
           "type": "string",
           "analyzer": "lucene.standard",
           "searchAnalyzer": "lucene.standard"
         },
         "submission_type": {
           "type": "string",
           "analyzer": "lucene.keyword",
           "searchAnalyzer": "lucene.keyword"
         },
         "created_at": {
           "type": "date"
         }
       }
     }
   }
   ```

4. **Click "Next" → "Create Search Index"**

5. **Wait for Index to Build** (usually 1-5 minutes)

---

### For Error Logs Collection

1. **Create Another Search Index:**
   - Click "Create Search Index" again

2. **Configure Index:**
   - **Index Name:** `error_logs_search`
   - **Database:** `dobeunet`
   - **Collection:** `error_logs`
   - **Index Type:** "JSON Editor"

3. **Paste Configuration:**
   ```json
   {
     "mappings": {
       "dynamic": true,
       "fields": {
         "message": {
           "type": "string",
           "analyzer": "lucene.standard",
           "searchAnalyzer": "lucene.standard"
         },
         "user_message": {
           "type": "string",
           "analyzer": "lucene.standard",
           "searchAnalyzer": "lucene.standard"
         },
         "stack": {
           "type": "string",
           "analyzer": "lucene.standard",
           "searchAnalyzer": "lucene.standard"
         },
         "code": {
           "type": "string",
           "analyzer": "lucene.keyword",
           "searchAnalyzer": "lucene.keyword"
         },
         "error_type": {
           "type": "string",
           "analyzer": "lucene.keyword",
           "searchAnalyzer": "lucene.keyword"
         },
         "severity": {
           "type": "string",
           "analyzer": "lucene.keyword",
           "searchAnalyzer": "lucene.keyword"
         },
         "url": {
           "type": "string",
           "analyzer": "lucene.standard",
           "searchAnalyzer": "lucene.standard"
         },
         "timestamp": {
           "type": "date"
         }
       }
     }
   }
   ```

4. **Click "Next" → "Create Search Index"**

5. **Wait for Index to Build**

---

## ✅ Step 3: Verify Setup

### Check Collections

```javascript
use('dobeunet');

// Check collections exist
show collections;
// Should show: leads, error_logs

// Check indexes
db.leads.getIndexes();
db.error_logs.getIndexes();
```

### Test Search (After Indexes are Built)

```javascript
// Test leads search
db.leads.aggregate([
  {
    $search: {
      index: 'leads_search',
      text: {
        query: 'test',
        path: { wildcard: '*' }
      }
    }
  },
  { $limit: 5 }
]);

// Test error logs search
db.error_logs.aggregate([
  {
    $search: {
      index: 'error_logs_search',
      text: {
        query: 'network',
        path: ['message', 'user_message']
      }
    }
  },
  { $limit: 5 }
]);
```

---

## 🔧 Step 4: Test API Endpoints

### Search Leads

```bash
# Basic search
curl "https://dobeu-net.netlify.app/.netlify/functions/search-leads?q=restaurant"

# With filters
curl "https://dobeu-net.netlify.app/.netlify/functions/search-leads?q=test&business_type=restaurant&submission_type=strategy"

# Pagination
curl "https://dobeu-net.netlify.app/.netlify/functions/search-leads?q=test&limit=10&offset=0"
```

### Search Error Logs

```bash
# Basic search
curl "https://dobeu-net.netlify.app/.netlify/functions/search-errors?q=network"

# With filters
curl "https://dobeu-net.netlify.app/.netlify/functions/search-errors?q=error&severity=ERROR&error_type=NETWORK"
```

### Get Analytics

```bash
# Last 30 days
curl "https://dobeu-net.netlify.app/.netlify/functions/analytics"

# Last 7 days
curl "https://dobeu-net.netlify.app/.netlify/functions/analytics?days=7"
```

### Verify Data

```bash
curl "https://dobeu-net.netlify.app/.netlify/functions/verify-data"
```

---

## 📊 Available Endpoints

### 1. Search Leads
**GET** `/.netlify/functions/search-leads`

**Query Parameters:**
- `q` - Search query (text)
- `business_type` - Filter by business type
- `submission_type` - Filter by submission type (`strategy` or `pilot`)
- `date_from` - Start date (ISO format)
- `date_to` - End date (ISO format)
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Example:**
```
/.netlify/functions/search-leads?q=restaurant&business_type=restaurant&limit=20
```

---

### 2. Search Error Logs
**GET** `/.netlify/functions/search-errors`

**Query Parameters:**
- `q` - Search query (text)
- `error_type` - Filter by error type
- `severity` - Filter by severity (`INFO`, `WARNING`, `ERROR`, `CRITICAL`)
- `date_from` - Start date (ISO format)
- `date_to` - End date (ISO format)
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

**Example:**
```
/.netlify/functions/search-errors?q=network&severity=ERROR&limit=10
```

---

### 3. Analytics
**GET** `/.netlify/functions/analytics`

**Query Parameters:**
- `days` - Number of days to analyze (default: 30)

**Returns:**
- Total leads and errors
- Leads by type and business type
- Errors by severity and type
- Daily trends
- Period statistics

---

### 4. Verify Data
**GET** `/.netlify/functions/verify-data`

**Returns:**
- Connection status
- Collection statistics
- Index information
- Sample documents
- Recent data counts
- Health status

---

## 🎯 Features

### Full-Text Search
- ✅ Fuzzy matching (typo tolerance)
- ✅ Multi-field search
- ✅ Relevance scoring
- ✅ Fast performance

### Filtering
- ✅ By date range
- ✅ By type/category
- ✅ Combined filters
- ✅ Pagination support

### Analytics
- ✅ Aggregated statistics
- ✅ Trend analysis
- ✅ Grouped counts
- ✅ Time-based filtering

### Data Verification
- ✅ Connection health check
- ✅ Collection statistics
- ✅ Index verification
- ✅ Sample data preview

---

## 🔒 Security Notes

- All endpoints are CORS-enabled
- No authentication required (add if needed for production)
- Search queries are sanitized
- Rate limiting recommended for production

---

## 📈 Performance Tips

1. **Indexes:** All necessary indexes are created automatically
2. **Connection Pooling:** Configured in `mongodb.ts` (max 10 connections)
3. **Atlas Search:** Uses dedicated search indexes for fast queries
4. **Pagination:** Always use limit/offset for large result sets

---

## 🐛 Troubleshooting

### Search Not Working

1. **Check Index Status:**
   - Go to Atlas → Search
   - Verify indexes are "Active" (not "Building")

2. **Check Index Names:**
   - Must be exactly: `leads_search` and `error_logs_search`

3. **Test in Atlas:**
   - Use Atlas Data Explorer to test search queries

### No Results

1. **Check Data:**
   - Verify collections have documents
   - Use `verify-data` endpoint

2. **Check Query:**
   - Try simpler queries first
   - Check for typos in field names

### Slow Queries

1. **Check Indexes:**
   - Verify all indexes are created
   - Check index usage in Atlas

2. **Optimize Queries:**
   - Use filters to reduce result set
   - Limit result size
   - Use date ranges

---

## ✅ Checklist

- [ ] Database setup script run successfully
- [ ] Collections created (`leads`, `error_logs`)
- [ ] Indexes created (check with `getIndexes()`)
- [ ] Atlas Search index `leads_search` created and active
- [ ] Atlas Search index `error_logs_search` created and active
- [ ] Test search queries work
- [ ] API endpoints respond correctly
- [ ] Analytics endpoint returns data
- [ ] Verify-data endpoint shows healthy status

---

## 📚 Additional Resources

- [MongoDB Atlas Search Documentation](https://docs.atlas.mongodb.com/atlas-search/)
- [Atlas Search Index Configuration](https://docs.atlas.mongodb.com/atlas-search/create-index/)
- [Aggregation Pipeline with $search](https://docs.atlas.mongodb.com/atlas-search/aggregation-pipeline/)

---

**Status:** ✅ Ready to use after Atlas Search indexes are created!

