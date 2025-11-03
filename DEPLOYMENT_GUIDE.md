# Dobeu Tech Solutions - Production Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Dobeu Tech Solutions website to production at https://dobeu.net.

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all environment variables are properly configured in your hosting platform:

```bash
VITE_SUPABASE_URL=https://qmwefqnbeipmbydhfcfj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Build Verification
Run the following commands locally to verify the build:

```bash
# Install dependencies
npm install

# Run type checking
npm run typecheck

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### 3. Testing Checklist
- [ ] All forms submit correctly to Supabase
- [ ] Dark mode toggle works across all components
- [ ] Navigation links scroll to correct sections
- [ ] Apollo meeting scheduler integration works
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] All images load correctly
- [ ] Contact modal opens and closes properly

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

3. **Configure Custom Domain**:
   - Go to Vercel Dashboard → Project Settings → Domains
   - Add custom domain: `dobeu.net`
   - Follow DNS configuration instructions

4. **Configure Environment Variables**:
   - Go to Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy to Netlify**:
   ```bash
   netlify deploy --prod
   ```

3. **Configure Custom Domain**:
   - Go to Domain Settings in Netlify Dashboard
   - Add custom domain: `dobeu.net`
   - Configure DNS records

4. **Configure Environment Variables**:
   - Go to Site Settings → Build & Deploy → Environment
   - Add environment variables

### Option 3: Traditional Web Server (Apache/Nginx)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Upload files**:
   - Upload contents of `dist/` directory to web server
   - Ensure files are in the document root (e.g., `/var/www/html`)

3. **Configure Nginx** (example):
   ```nginx
   server {
       listen 80;
       listen [::]:80;
       server_name dobeu.net www.dobeu.net;

       # Redirect to HTTPS
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       listen [::]:443 ssl http2;
       server_name dobeu.net www.dobeu.net;

       # SSL Configuration
       ssl_certificate /etc/letsencrypt/live/dobeu.net/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/dobeu.net/privkey.pem;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;

       root /var/www/dobeu.net;
       index index.html;

       # Security Headers
       add_header X-Frame-Options "DENY" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Referrer-Policy "strict-origin-when-cross-origin" always;
       add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.apollo.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;" always;

       # Gzip Compression
       gzip on;
       gzip_vary on;
       gzip_min_length 1024;
       gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

       # Cache Static Assets
       location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # SPA Routing - Serve index.html for all routes
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Configure Apache** (example):
   ```apache
   <VirtualHost *:443>
       ServerName dobeu.net
       ServerAlias www.dobeu.net

       SSLEngine on
       SSLCertificateFile /etc/letsencrypt/live/dobeu.net/fullchain.pem
       SSLCertificateKeyFile /etc/letsencrypt/live/dobeu.net/privkey.pem

       DocumentRoot /var/www/dobeu.net

       <Directory /var/www/dobeu.net>
           Options -Indexes +FollowSymLinks
           AllowOverride All
           Require all granted

           # SPA Routing
           RewriteEngine On
           RewriteBase /
           RewriteRule ^index\.html$ - [L]
           RewriteCond %{REQUEST_FILENAME} !-f
           RewriteCond %{REQUEST_FILENAME} !-d
           RewriteRule . /index.html [L]
       </Directory>

       # Security Headers
       Header always set X-Frame-Options "DENY"
       Header always set X-Content-Type-Options "nosniff"
       Header always set X-XSS-Protection "1; mode=block"
       Header always set Referrer-Policy "strict-origin-when-cross-origin"

       # Compression
       <IfModule mod_deflate.c>
           AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
       </IfModule>

       # Cache Static Assets
       <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$">
           Header set Cache-Control "max-age=31536000, public, immutable"
       </FilesMatch>
   </VirtualHost>
   ```

## DNS Configuration

Configure your DNS records to point to your hosting provider:

### For Vercel or Netlify:
1. Add A record: `@` → Hosting provider's IP
2. Add CNAME record: `www` → Hosting provider's domain

### For Custom Server:
1. Add A record: `@` → Your server IP address
2. Add CNAME record: `www` → `dobeu.net`

## SSL/TLS Certificate Setup

### Using Let's Encrypt (Free):
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d dobeu.net -d www.dobeu.net

# Auto-renewal is configured by default
# Test renewal:
sudo certbot renew --dry-run
```

## Post-Deployment Verification

### 1. Functionality Testing
- [ ] Website loads at https://dobeu.net
- [ ] SSL certificate is valid and shows in browser
- [ ] All pages and sections load correctly
- [ ] Forms submit to Supabase successfully
- [ ] Dark mode works across the site
- [ ] Mobile responsive design works properly
- [ ] Apollo meeting scheduler integration functions

### 2. SEO Verification
- [ ] Submit sitemap to Google Search Console: https://search.google.com/search-console
- [ ] Submit sitemap to Bing Webmaster Tools: https://www.bing.com/webmasters
- [ ] Verify structured data: https://search.google.com/test/rich-results
- [ ] Test meta tags: https://metatags.io/
- [ ] Check mobile-friendliness: https://search.google.com/test/mobile-friendly
- [ ] Run PageSpeed Insights: https://pagespeed.web.dev/

### 3. Security Testing
- [ ] Test security headers: https://securityheaders.com/
- [ ] Verify SSL configuration: https://www.ssllabs.com/ssltest/
- [ ] Check for mixed content warnings
- [ ] Test HTTPS enforcement (HTTP should redirect to HTTPS)

### 4. Performance Testing
- [ ] Run Lighthouse audit in Chrome DevTools
- [ ] Test on slow 3G connection
- [ ] Verify image optimization
- [ ] Check Time to Interactive (TTI) < 3.8s
- [ ] Verify First Contentful Paint (FCP) < 1.8s
- [ ] Check Cumulative Layout Shift (CLS) < 0.1

## Monitoring and Analytics

### Setup Google Analytics
1. Create GA4 property at https://analytics.google.com/
2. Add tracking code to index.html
3. Verify data collection

### Setup Error Monitoring (Optional)
Consider adding error monitoring service:
- Sentry: https://sentry.io/
- LogRocket: https://logrocket.com/
- Rollbar: https://rollbar.com/

### Setup Uptime Monitoring
Monitor website availability:
- UptimeRobot: https://uptimerobot.com/
- Pingdom: https://www.pingdom.com/
- StatusCake: https://www.statuscake.com/

## Rollback Procedure

If issues arise after deployment:

### For Vercel/Netlify:
1. Go to deployments dashboard
2. Find previous successful deployment
3. Click "Rollback" or "Promote to Production"

### For Custom Server:
1. Keep backup of previous `dist/` folder
2. Stop web server
3. Replace current files with backup
4. Restart web server

## Maintenance

### Regular Tasks:
- **Weekly**: Check uptime monitoring and error logs
- **Monthly**: Update npm dependencies
- **Monthly**: Review Google Search Console for SEO issues
- **Quarterly**: Run security audit
- **Quarterly**: Review and update SSL certificates (auto-renewal should handle this)

### Dependency Updates:
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update major versions (carefully test)
npm install <package>@latest

# Rebuild and test
npm run build
npm run preview
```

## Troubleshooting

### Common Issues:

**404 Errors on Refresh**
- Solution: Ensure SPA routing is configured in web server (see Nginx/Apache examples above)

**Environment Variables Not Working**
- Solution: Verify variables start with `VITE_` prefix
- Solution: Rebuild application after adding variables

**SSL Certificate Issues**
- Solution: Verify certificate paths in web server configuration
- Solution: Run `sudo certbot renew` to renew expired certificates

**Images Not Loading**
- Solution: Check file paths are correct (relative to public directory)
- Solution: Verify image files are included in build output

**Supabase Connection Failures**
- Solution: Verify environment variables are set correctly
- Solution: Check Supabase project status and API keys

## Support

For deployment issues or questions:
- Technical Lead: [Add contact information]
- DevOps Team: [Add contact information]
- Documentation: https://vitejs.dev/guide/static-deploy.html

## Version History

- **v1.0.0** (2025-10-26): Initial production deployment
  - Fixed TypeScript compilation errors
  - Added comprehensive SEO enhancements
  - Implemented security headers
  - Optimized build configuration
  - Created deployment documentation
