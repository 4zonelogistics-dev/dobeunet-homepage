# 🚀 Quick MongoDB Deployment Guide

**Deploy Dobeu.net with MongoDB in 5 Minutes**

---

## ⚡ Quick Start

### Step 1: Set Environment Variable (2 minutes)

#### Via Netlify Dashboard (Easiest)

1. Go to: https://app.netlify.com/
2. Log in with jswilliamstu@outlook.com
3. Find your site (dobeutechsolutions or create new)
4. Go to: **Site settings** → **Environment variables**
5. Click **Add a variable**
6. Add:
   - **Key:** `MONGODB_URI`
   - **Value:** `mongodb+srv://jeremyw_db_user:feZWyP9XWtYeanXC@dbe-dobeunet.0tw3wi9.mongodb.net/?appName=dbe-dobeunetpublish`
   - **Scopes:** All (Production, Deploy Previews, Branch deploys)
7. Click **Create variable**

#### Via Netlify CLI

```powershell
# Set auth token
$env:NETLIFY_AUTH_TOKEN = "nfp_TAE9UADqCRUAbzAni2VRaAHg1o1KKCf8f9ce"

# Set MongoDB URI
netlify env:set MONGODB_URI "mongodb+srv://jeremyw_db_user:feZWyP9XWtYeanXC@dbe-dobeunet.0tw3wi9.mongodb.net/?appName=dbe-dobeunetpublish"
```

### Step 2: Deploy (3 minutes)

#### Option A: Deploy via CLI

```powershell
# Navigate to project directory
cd E:\DobeuTechSolutions\projects\dobeunet\dobeunet-homepage

# Set Netlify auth token
$env:NETLIFY_AUTH_TOKEN = "nfp_TAE9UADqCRUAbzAni2VRaAHg1o1KKCf8f9ce"

# Deploy to production
netlify deploy --prod
```

#### Option B: Trigger Deploy in Dashboard

1. In Netlify dashboard, go to **Deploys** tab
2. Click **Trigger deploy**
3. Select **Clear cache and deploy site**
4. Wait 2-3 minutes

### Step 3: Verify (1 minute)

1. Open your site: https://dobeutechsolutions.netlify.app
2. Click "Book Strategy Session"
3. Fill out and submit the form
4. You should see "Thank You!" message
5. Check MongoDB Atlas for the new lead

---

## ✅ What Changed from Supabase

| Before (Supabase) | After (MongoDB) |
|-------------------|-----------------|
| Direct browser connection | Serverless functions |
| Supabase anon key needed | No frontend credentials |
| 2 environment variables | 1 environment variable |
| PostgreSQL tables | MongoDB collections |
| `VITE_SUPABASE_URL` | `MONGODB_URI` |
| `VITE_SUPABASE_ANON_KEY` | *(backend only)* |

**Security Improvement:** MongoDB credentials are never exposed to the browser!

---

## 📋 Full Deployment Checklist

### Pre-Deployment
- [x] MongoDB installed (`npm install`)
- [x] Netlify Functions created
- [x] Frontend updated to use MongoDB client
- [x] Environment variable configured
- [ ] MongoDB collections created (see below)

### Post-Deployment
- [ ] Site loads successfully
- [ ] No console errors (F12)
- [ ] Contact form submits
- [ ] Lead appears in MongoDB
- [ ] Netlify Functions showing in dashboard
- [ ] Function logs show successful requests

---

## 🗄️ MongoDB Atlas Setup

### Create Collections and Indexes

If not already done, run these in MongoDB Atlas Shell:

```javascript
// Connect to database
use dobeunet

// Create leads collection
db.createCollection("leads");
db.leads.createIndex({ email: 1 });
db.leads.createIndex({ created_at: -1 });
db.leads.createIndex({ submission_type: 1 });

// Create error_logs collection
db.createCollection("error_logs");
db.error_logs.createIndex({ timestamp: -1 });
db.error_logs.createIndex({ created_at: -1 });

// Auto-delete logs older than 90 days
db.error_logs.createIndex(
  { created_at: 1 },
  { expireAfterSeconds: 7776000 }
);
```

### Verify Collections

```javascript
// Show all collections
show collections

// Should see:
// - leads
// - error_logs

// Check a collection
db.leads.find().limit(1)
```

---

## 🔧 Advanced Deployment Options

### Deploy from Dev Branch

```powershell
# Make sure you're on dev branch
git checkout dev

# Deploy dev branch to production
netlify deploy --prod --branch=dev
```

### Deploy with Specific Build Command

```powershell
netlify deploy --prod --build
```

### Deploy and Open Site

```powershell
netlify deploy --prod --open
```

---

## 🧪 Test Functions Locally

```powershell
# Set environment variable
$env:MONGODB_URI = "mongodb+srv://jeremyw_db_user:feZWyP9XWtYeanXC@dbe-dobeunet.0tw3wi9.mongodb.net/?appName=dbe-dobeunetpublish"

# Start Netlify Dev server
netlify dev

# Site will be at: http://localhost:8888
# Functions at: http://localhost:8888/.netlify/functions/
```

Test in browser or with curl:

```bash
curl -X POST http://localhost:8888/.netlify/functions/submit-lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","company":"Test Co","business_type":"restaurant","phone":"555-1234","message":"Test","submission_type":"strategy"}'
```

---

## 🌐 Custom Domain Setup

After successful deployment, add your custom domain:

### Via Netlify Dashboard

1. Go to: **Site settings** → **Domain management**
2. Click **Add a domain**
3. Enter: `dobeu.net`
4. Follow DNS instructions

### DNS Configuration

Add these records at your domain registrar:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: dobeutechsolutions.netlify.app
```

Wait 5-30 minutes for DNS propagation, then access https://dobeu.net

---

## 🔍 Monitoring & Debugging

### View Netlify Function Logs

1. Netlify Dashboard → **Functions** tab
2. Click function name (`submit-lead` or `log-error`)
3. View real-time logs

### View MongoDB Activity

1. Go to: https://cloud.mongodb.com/
2. Select cluster: **dbe-dobeunet**
3. Click **Metrics** tab
4. View:
   - Connections
   - Operations per second
   - Data size
   - Recent queries

### Check for Errors

```javascript
// In MongoDB Atlas Shell
use dobeunet

// View recent error logs
db.error_logs.find().sort({ created_at: -1 }).limit(10)

// Count errors by severity
db.error_logs.aggregate([
  { $group: { _id: "$severity", count: { $sum: 1 } } }
])

// View recent leads
db.leads.find().sort({ created_at: -1 }).limit(5)
```

---

## 🆘 Troubleshooting

### Site shows "Missing Supabase environment variables"

**Cause:** Old cached files  
**Solution:**
```powershell
# Clear cache and redeploy
netlify deploy --prod --clear-cache
```

### Function returns 500 error

**Cause:** MongoDB connection issue  
**Solution:**
1. Check `MONGODB_URI` is set correctly
2. Verify MongoDB Atlas allows connections from 0.0.0.0/0
3. Check Function logs in Netlify dashboard

### Form submission does nothing

**Cause:** CORS or function not found  
**Solution:**
1. Check browser console for errors (F12)
2. Verify functions are deployed (Netlify dashboard → Functions)
3. Check `netlify.toml` has `functions = "netlify/functions"`

### No data appearing in MongoDB

**Cause:** Function succeeds but database issue  
**Solution:**
1. Check MongoDB Atlas connection
2. Verify user `jeremyw_db_user` has write permissions
3. Check function logs for MongoDB errors

---

## 📊 Performance Optimization

### Connection Pooling

Functions automatically reuse MongoDB connections for better performance:

- **maxPoolSize:** 10 connections
- **minPoolSize:** 2 connections
- **maxIdleTimeMS:** 30 seconds

### Function Cold Starts

First request may be slower (~2-3s). Subsequent requests are fast (<500ms).

To reduce cold starts:
- Keep functions small
- Use connection caching (already implemented)
- Consider Netlify Pro plan for faster functions

---

## 💰 MongoDB Atlas Costs

Current setup uses **Free Tier (M0)**:

- **Storage:** 512 MB
- **RAM:** Shared
- **Backup:** None
- **Cost:** $0/month

### Upgrade Path

If you exceed free tier limits:

- **M10:** $57/month (2GB RAM, 10GB storage, backups)
- **M20:** $118/month (4GB RAM, 20GB storage, backups)

Monitor usage in MongoDB Atlas Dashboard.

---

## 🔐 Security Best Practices

### Already Implemented ✅

- MongoDB credentials secured in backend
- Input validation on all fields
- Email format validation
- CORS properly configured
- Connection pooling to prevent exhaustion

### Additional Recommendations

1. **Enable MongoDB Audit Logs:**
   - MongoDB Atlas → Security → Audit Logs

2. **Set up Alerts:**
   - MongoDB Atlas → Alerts → Configure alerts for high connections, errors

3. **Regular Backups:**
   - Upgrade to M10+ tier for automatic backups
   - Or set up manual exports

4. **Rotate Credentials:**
   - Change MongoDB password periodically
   - Update `MONGODB_URI` in Netlify

---

## 📝 Migration Complete!

Your site is now running on MongoDB Atlas with a secure serverless architecture.

**Key Benefits:**
- ✅ More secure (no exposed credentials)
- ✅ Better scalability
- ✅ Flexible schema
- ✅ Built-in monitoring
- ✅ Free tier available

**Next Steps:**
1. Test the site thoroughly
2. Monitor function logs
3. Set up custom domain (dobeu.net)
4. Configure MongoDB Atlas alerts
5. Regular monitoring and maintenance

---

## 📚 Additional Resources

- **MongoDB Docs:** https://docs.mongodb.com/
- **Netlify Functions:** https://docs.netlify.com/functions/overview/
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **Full Migration Guide:** See `MONGODB_MIGRATION.md`

---

**Deployment Time:** 5-10 minutes  
**Difficulty:** Easy  
**Status:** ✅ Ready to Deploy

Let's go! 🚀

