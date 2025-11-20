# GitHub Actions Setup Guide - Dobeu.net

**Date:** November 20, 2025  
**Status:** ✅ **COMPLETE - Ready to Activate**

---

## 🎯 Overview

Comprehensive GitHub Actions CI/CD pipeline with:
- ✅ Automated code quality checks
- ✅ Security vulnerability scanning
- ✅ Dependency management (Dependabot)
- ✅ AI-powered code review
- ✅ Automated deployments
- ✅ PR preview deployments
- ✅ Performance monitoring (Lighthouse)

---

## 📁 Workflows Created

### 1. **ci.yml** - Continuous Integration

**Triggers:** Push & Pull Requests to `main` or `dev`

**Jobs:**
- **Dependency Audit** - Checks for security vulnerabilities
- **Code Quality** - Runs ESLint & TypeScript checks
- **Security Scan** - Trivy vulnerability scanner
- **Build Verification** - Ensures project builds
- **Bundle Size Check** - Monitors bundle size
- **AI Code Review** - Automated code review on PRs
- **Security Headers** - Validates security headers

**Purpose:** Ensure code quality before merging

---

### 2. **deploy-production.yml** - Production Deployment

**Triggers:** Push to `main` branch

**Jobs:**
- **Pre-Deployment Checks** - Security & quality validation
- **Deployment Start** - Notifies team
- **Deploy to Netlify** - Automated production deployment
- **Post-Deployment Tests** - Verifies deployment success
- **Deployment Complete** - Final notification

**Purpose:** Automated, safe production deployments

---

### 3. **pr-preview.yml** - PR Preview Deployments

**Triggers:** Pull Request opened/updated to `main` or `dev`

**Jobs:**
- **Deploy Preview** - Creates preview deployment
- **Lighthouse Check** - Performance analysis

**Purpose:** Test changes before merging

**Preview URL Format:** `https://pr-[NUMBER]--dobeu-net.netlify.app`

---

### 4. **dependency-update.yml** - Automated Updates

**Triggers:** 
- Weekly schedule (Mondays at 9 AM UTC)
- Manual trigger

**Jobs:**
- **Update Dependencies** - Updates patch versions
- **Security Updates** - Applies security fixes

**Purpose:** Keep dependencies current and secure

---

### 5. **code-review.yml** - AI Code Review

**Triggers:** Pull Request opened/updated

**Jobs:**
- **Static Analysis** - Code complexity analysis
- **Security Review** - Checks for secrets & dangerous patterns
- **Code Quality Metrics** - Calculates code statistics
- **Best Practices** - Validates coding standards

**Purpose:** Automated code review and feedback

---

### 6. **dependabot.yml** - Dependency Bot

**Triggers:** Automatic (GitHub Dependabot)

**Configuration:**
- Weekly dependency updates (Mondays)
- Groups related updates (React, ESLint, TypeScript, Vite)
- Ignores major version updates for critical packages
- Targets `dev` branch
- Auto-labels PRs

**Purpose:** Automated dependency management

---

## 🔐 Required Secrets

### Setup GitHub Secrets

Go to: https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/settings/secrets/actions

**Click "New repository secret" and add:**

### 1. **NETLIFY_AUTH_TOKEN**

**Value:** `nfp_TAE9UADqCRUAbzAni2VRaAHg1o1KKCf8f9ce`

**Purpose:** Authenticates GitHub Actions with Netlify

**How to get:**
- You already have this token
- Or generate new: Netlify → User Settings → Applications → Personal Access Tokens

---

### 2. **NETLIFY_SITE_ID**

**Value:** `ea67f06f-f2a0-44b0-9e31-f15f43136f7f`

**Purpose:** Identifies your Netlify site

**How to get:**
- Already shown in netlify status output
- Or: Netlify Dashboard → Site Settings → Site information → Site ID

---

### 3. **MONGODB_URI** (For future testing)

**Value:** `mongodb+srv://jeremyw_db_user:feZWyP9XWtYeanXC@dbe-dobeunet.0tw3wi9.mongodb.net/dobeunet?appName=dbe-dobeunetpublish`

**Purpose:** Used if you add automated E2E tests

**Note:** Currently only needed in Netlify, but good to have in GitHub for testing

---

## ✅ Setup Checklist

### Step 1: Add GitHub Secrets (5 minutes)

1. Go to: https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/settings/secrets/actions
2. Click **"New repository secret"**
3. Add **NETLIFY_AUTH_TOKEN**:
   - Name: `NETLIFY_AUTH_TOKEN`
   - Value: `nfp_TAE9UADqCRUAbzAni2VRaAHg1o1KKCf8f9ce`
   - Click **"Add secret"**
4. Add **NETLIFY_SITE_ID**:
   - Name: `NETLIFY_SITE_ID`
   - Value: `ea67f06f-f2a0-44b0-9e31-f15f43136f7f`
   - Click **"Add secret"**

### Step 2: Verify Workflows (1 minute)

1. Go to: https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/actions
2. You should see 5 workflows:
   - CI - Code Quality & Security
   - Deploy to Production
   - PR Preview Deployment
   - Dependency Updates
   - AI Code Review

### Step 3: Test the Pipeline (10 minutes)

Create a test PR to verify everything works:

```bash
# Create test branch
git checkout -b test-github-actions

# Make a small change
echo "# Test GitHub Actions" >> README.md

# Commit and push
git add README.md
git commit -m "test: Verify GitHub Actions pipeline"
git push origin test-github-actions
```

Then:
1. Create PR on GitHub: test-github-actions → dev
2. Watch Actions run automatically
3. See preview deployment in PR comments
4. See AI code review comments
5. Verify all checks pass

### Step 4: Merge and Deploy (After tests pass)

When ready:
1. Merge PR to `dev`
2. Then merge `dev` to `main`
3. Production deployment triggers automatically
4. Monitor deployment at: https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/actions

---

## 🔄 Workflow Triggers

### Automatic Triggers

| Event | Workflows Triggered |
|-------|---------------------|
| Push to `main` | CI, Deploy to Production |
| Push to `dev` | CI |
| PR opened/updated | CI, PR Preview, AI Code Review |
| Monday 9 AM UTC | Dependency Updates |
| Dependabot PR | CI (automatic) |

### Manual Triggers

All workflows support `workflow_dispatch` for manual runs:
1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Choose branch
5. Click "Run workflow"

---

## 🎯 What Each Workflow Does

### CI Workflow (ci.yml)

**When:** Every push and PR

**Steps:**
1. **Dependency Audit** (2 min)
   - Runs `npm audit`
   - Checks for vulnerabilities
   - Reports outdated packages

2. **Code Quality** (3 min)
   - Runs ESLint
   - Runs TypeScript type checking
   - Checks code formatting

3. **Security Scan** (4 min)
   - Scans filesystem for vulnerabilities
   - Uploads results to GitHub Security tab
   - Detects misconfigurations

4. **Build** (2 min)
   - Runs `npm run build`
   - Verifies build succeeds
   - Uploads artifacts

5. **Bundle Size** (1 min)
   - Checks total bundle size
   - Warns if > 500MB
   - Reports individual file sizes

6. **AI Code Review** (PR only)
   - Analyzes changed files
   - Posts checklist in PR comments
   - Suggests improvements

**Total Time:** ~12 minutes

---

### Production Deployment (deploy-production.yml)

**When:** Push to `main` branch

**Steps:**
1. **Pre-Deployment Checks** (3 min)
   - Security audit (high severity only)
   - Linting
   - Type checking
   - Build verification
   - Verifies MongoDB config
   - Verifies Netlify Functions exist

2. **Deployment Start** (30s)
   - Creates GitHub deployment
   - Posts deployment start comment

3. **Deploy to Netlify** (2 min)
   - Builds project
   - Deploys to Netlify production
   - Updates both URLs (netlify.app & dobeu.net)

4. **Post-Deployment Tests** (1 min)
   - Waits 30s for propagation
   - Checks Netlify URL (HTTP 200)
   - Checks custom domain
   - Tests MongoDB function endpoint

5. **Deployment Complete** (30s)
   - Updates deployment status
   - Posts success/failure notification

**Total Time:** ~7 minutes

---

### PR Preview (pr-preview.yml)

**When:** PR opened or updated

**Steps:**
1. **Build & Deploy** (3 min)
   - Runs pre-deploy checks
   - Builds project
   - Deploys to Netlify preview
   - Creates unique URL per PR

2. **Lighthouse Check** (2 min)
   - Runs performance audit
   - Checks accessibility
   - Validates SEO
   - Posts results

**Preview URLs:**
- `https://pr-123--dobeu-net.netlify.app` (PR #123)
- Each PR gets own preview
- Auto-deleted when PR closed

**Total Time:** ~5 minutes

---

### Dependency Updates (dependency-update.yml)

**When:** 
- Every Monday 9 AM UTC (automatic)
- Manual trigger

**Steps:**
1. **Update Dependencies**
   - Checks for outdated packages
   - Updates patch versions
   - Runs full test suite
   - Creates PR if updates available

2. **Security Updates**
   - Runs `npm audit fix`
   - Applies security patches
   - Creates separate PR

**Result:** Automated PRs in `dev` branch

---

### Code Review (code-review.yml)

**When:** PR opened or updated

**Steps:**
1. **Static Analysis**
   - Analyzes changed files
   - Calculates complexity
   - Posts file change summary

2. **Security Review**
   - Checks for hardcoded secrets
   - Detects dangerous patterns (`eval`, `innerHTML`, etc.)
   - Validates environment variable usage

3. **Code Quality Metrics**
   - Counts files, lines, components
   - Posts metrics to PR

4. **Best Practices**
   - Checks for console.log
   - Checks file sizes
   - Finds TODOs/FIXMEs

**Total Time:** ~4 minutes

---

## 🚀 How to Use

### For Pull Requests

1. **Create PR:**
   ```bash
   git checkout -b feature/my-feature
   # Make changes
   git commit -m "feat: Add my feature"
   git push origin feature/my-feature
   ```

2. **Create PR on GitHub** (dev ← feature branch)

3. **Automated Actions:**
   - ✅ CI checks run automatically
   - ✅ Preview deployment created
   - ✅ AI code review posts comments
   - ✅ Metrics calculated
   - ✅ Security scan runs

4. **Review Results:**
   - Check Actions tab for status
   - Review AI comments
   - Test preview URL
   - Fix any issues

5. **Merge PR:**
   - All checks must pass ✅
   - Preview tested ✅
   - Code reviewed ✅
   - Merge to `dev`

---

### For Production Deployment

1. **Merge dev to main:**
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

2. **Automated Deployment:**
   - ✅ Pre-deployment checks run
   - ✅ Deploys to Netlify
   - ✅ Updates dobeu.net
   - ✅ Post-deployment tests run
   - ✅ Notifications sent

3. **Monitor:**
   - Watch Actions tab
   - Check notifications
   - Verify https://dobeu.net

---

## 📊 Monitoring & Notifications

### GitHub Actions Tab

**URL:** https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/actions

**What you'll see:**
- All workflow runs
- Status (success/failure)
- Detailed logs
- Artifacts (build outputs)
- Deployment history

### Notifications

You'll receive notifications for:
- ✅ Successful deployments
- ❌ Failed checks
- 📊 Performance reports
- 🔐 Security alerts
- 📝 Dependency update PRs

---

## 🔒 Security Features

### Automated Security Checks ✅

1. **Dependency Scanning**
   - npm audit on every PR
   - Trivy filesystem scanning
   - GitHub Security tab integration

2. **Code Security**
   - Detects hardcoded secrets
   - Finds dangerous patterns
   - Validates environment variables
   - Checks CSP headers

3. **Security Updates**
   - Weekly automated security patches
   - Auto-creates PRs for fixes
   - Tests before merging

### Manual Security Reviews

**Required for:**
- Major version updates
- New dependencies
- Environment variable changes
- Security header modifications

---

## 📦 Dependency Management

### Dependabot Configuration ✅

**Schedule:** Weekly (Mondays at 9 AM UTC)

**Target Branch:** `dev`

**Update Strategy:**
- ✅ Patch updates: Automatic
- ✅ Minor updates: Automatic
- ⚠️ Major updates: Manual review required

**Grouped Updates:**
- React packages together
- ESLint packages together
- TypeScript packages together
- Vite packages together

**Ignored Updates:**
- Vite major versions (breaking changes)
- React major versions (testing required)

---

## 🎨 Code Quality Standards

### Enforced Checks ✅

| Check | Tool | Fail on |
|-------|------|---------|
| **Linting** | ESLint | Any error |
| **Type Safety** | TypeScript | Type errors |
| **Build** | Vite | Build failure |
| **Bundle Size** | Custom | > 500MB |
| **Security Headers** | Custom | Missing headers |
| **Secrets** | grep | Hardcoded secrets |
| **Dangerous Patterns** | grep | eval, innerHTML, etc. |

### Quality Gates 🚪

**Before Merge:**
- ✅ All CI checks pass
- ✅ Preview deployment successful
- ✅ Code review complete
- ✅ No security vulnerabilities

**Before Production:**
- ✅ All pre-deployment checks pass
- ✅ Build successful
- ✅ Functions verified
- ✅ Security audit passed

---

## 🤖 AI Code Review

### CodeRabbit Integration

**Features:**
- Analyzes pull request changes
- Suggests improvements
- Identifies potential bugs
- Recommends best practices

**Note:** Requires CodeRabbit to be installed on the repo (free for open source)

**Alternative:** Manual code review using Claude/GPT

---

## 🎯 Best Practices Enforced

### Automated Checks ✅

1. **No Console Logs** (warning only)
   - Detects console.log in production code
   - Build strips them anyway
   - Still good practice to remove

2. **No Large Files**
   - Checks for files > 100KB
   - Warns if found
   - Suggests optimization

3. **TODO Tracking**
   - Finds TODO/FIXME comments
   - Lists them in PR
   - Ensures they're tracked

4. **Security Patterns**
   - No `eval()`
   - No `dangerouslySetInnerHTML`
   - No `innerHTML =`
   - No `document.write()`

---

## 📈 Performance Monitoring

### Lighthouse CI ✅

**Runs on:** Every PR preview

**Metrics Checked:**
- Performance score
- Accessibility score
- Best Practices score
- SEO score
- First Contentful Paint
- Time to Interactive
- Largest Contentful Paint
- Cumulative Layout Shift

**Threshold:** 90+ on all metrics

---

## 🚨 Failure Handling

### If CI Checks Fail

**Process:**
1. GitHub blocks merge (if required)
2. Developer receives notification
3. Review failure logs in Actions tab
4. Fix issues locally
5. Push fix
6. Checks run again automatically

### If Deployment Fails

**Process:**
1. Deployment marked as failed
2. GitHub creates alert
3. No changes go live
4. Review logs
5. Fix and redeploy

**Rollback:**
- Netlify keeps previous deployments
- Can rollback in Netlify dashboard
- Or redeploy previous git commit

---

## 📊 Workflow Status Badges

Add these to your README.md:

```markdown
![CI Status](https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/workflows/CI%20-%20Code%20Quality%20&%20Security/badge.svg)

![Deploy Status](https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/workflows/Deploy%20to%20Production/badge.svg)

![Security](https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/workflows/AI%20Code%20Review/badge.svg)
```

**Shows:** Real-time status of your workflows

---

## 🎓 How It Protects Production

### Multiple Safety Layers 🛡️

**Layer 1: Pre-Commit**
- Developer runs tests locally
- Lint & typecheck before push

**Layer 2: PR Checks**
- CI workflow runs on PR
- Preview deployment created
- AI code review
- Security scans
- Manual review required

**Layer 3: Pre-Merge**
- All checks must pass
- Preview must be tested
- At least 1 approver (configure in branch protection)

**Layer 4: Pre-Production**
- Separate production deployment workflow
- Additional security checks
- Build verification
- Function validation

**Layer 5: Post-Deployment**
- Automated smoke tests
- URL accessibility check
- Function endpoint tests

**Layer 6: Monitoring**
- Lighthouse performance
- Security alerts
- Error tracking in MongoDB

**Result:** 🔒 **HIGHLY SECURE PIPELINE**

---

## 🔧 Configuration Files

### Branch Protection (Recommended)

Set up in: https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/settings/branches

**For `main` branch:**
- [x] Require pull request before merging
- [x] Require approvals: 1
- [x] Require status checks to pass:
  - Code Quality Checks
  - Build Verification
  - Security Scanning
- [x] Require branches to be up to date
- [x] Do not allow bypassing

**For `dev` branch:**
- [x] Require pull request before merging
- [x] Require status checks to pass
- [ ] Approvals: Optional (faster development)

---

## 📝 Workflow Files Summary

```
.github/
├── workflows/
│   ├── ci.yml                    # Main CI pipeline
│   ├── deploy-production.yml     # Production deployment
│   ├── pr-preview.yml            # PR preview deployments
│   ├── dependency-update.yml     # Automated updates
│   └── code-review.yml           # AI code review
└── dependabot.yml                # Dependabot config
```

**Total:** 6 configuration files

---

## 🎯 Benefits

### For Developers ✅

- Automated quality checks
- Instant feedback on PRs
- Preview environments for testing
- Automated dependency updates
- No manual deployment

### For Production ✅

- Multiple safety gates
- Automated security scanning
- Performance monitoring
- Rollback capability
- Deployment history

### For Business ✅

- Reduced bugs in production
- Faster development cycle
- Better code quality
- Enhanced security
- Professional workflow

---

## 🧪 Testing the Setup

### Test 1: Create a PR

```bash
git checkout -b test/pr-workflow
echo "# Test" >> README.md
git add README.md
git commit -m "test: PR workflow"
git push origin test/pr-workflow
```

**Expected:**
- CI workflow runs
- Preview deployment created
- AI review posts comments
- Lighthouse results posted

---

### Test 2: Merge to Main

```bash
git checkout main
git merge dev
git push origin main
```

**Expected:**
- Production deployment triggers
- Pre-deployment checks run
- Deploys to Netlify
- Post-deployment tests run
- Success notification posted

---

### Test 3: Dependency Update

**Trigger manually:**
1. Go to Actions → Dependency Updates
2. Click "Run workflow"
3. Select `dev` branch
4. Click "Run workflow"

**Expected:**
- Checks for outdated packages
- Creates PR if updates available
- All tests run on the PR

---

## 📊 Metrics & Reports

### Available Reports

1. **Security Scan Results**
   - Location: GitHub Security tab
   - Trivy vulnerability reports
   - npm audit results

2. **Build Artifacts**
   - Location: Actions → Build Verification → Artifacts
   - Download built dist/
   - Kept for 7 days

3. **Lighthouse Reports**
   - Location: PR comments
   - Temporary public storage
   - Performance metrics

4. **Code Metrics**
   - Location: PR comments
   - File counts
   - Lines of code
   - Component counts

---

## 🆘 Troubleshooting

### Workflow Not Running

**Check:**
1. Workflow file syntax (YAML valid?)
2. Triggers configured correctly?
3. Branch protection not blocking?

**Fix:**
- Validate YAML: https://www.yamllint.com/
- Check workflow logs
- Verify triggers match branch names

---

### Secrets Not Working

**Symptoms:**
- Netlify deployment fails
- "Invalid token" errors

**Fix:**
1. Verify secrets are set in repo settings
2. Check secret names match workflow files
3. Regenerate tokens if needed

---

### Build Failing in Actions

**Check:**
1. Does it build locally? (`npm run build`)
2. Are dependencies cached correctly?
3. Node version matches? (18)

**Fix:**
- Clear npm cache in workflow
- Update Node version
- Check error logs in Actions

---

## 🎉 Success Criteria

### GitHub Actions Working When:

✅ CI runs on every PR  
✅ All checks pass before merge  
✅ Preview deployments created  
✅ Production deploys on main push  
✅ Security scans detect issues  
✅ Dependency PRs created weekly  
✅ Performance monitored  
✅ Notifications received  

---

## 📞 Next Steps

### Immediate (After pushing workflows)

1. **Add GitHub Secrets** (5 min)
   - NETLIFY_AUTH_TOKEN
   - NETLIFY_SITE_ID

2. **Test with PR** (10 min)
   - Create test branch
   - Make small change
   - Open PR
   - Verify workflows run

3. **Configure Branch Protection** (5 min)
   - Protect `main` branch
   - Require checks to pass

### Week 1

1. **Monitor workflows**
   - Check Actions tab daily
   - Review any failures
   - Adjust as needed

2. **Review first Dependabot PR**
   - Appears Monday morning
   - Review updates
   - Test and merge

### Month 1

1. **Fine-tune workflows**
   - Adjust timing
   - Add more checks if needed
   - Optimize build speed

2. **Add custom tests**
   - Unit tests
   - Integration tests
   - E2E tests

---

## 🏆 What You Get

### Automation ✅

- Zero-touch deployments
- Automated security updates
- Dependency management
- Code quality enforcement
- Performance monitoring

### Quality ✅

- Every change reviewed
- Security scanned
- Performance tracked
- Best practices enforced
- Professional workflow

### Confidence ✅

- Safe to deploy
- No manual steps
- Rollback capability
- Full audit trail
- Peace of mind

---

## 📚 Additional Resources

### Documentation
- **GitHub Actions:** https://docs.github.com/en/actions
- **Netlify Deploy:** https://github.com/nwtgck/actions-netlify
- **Dependabot:** https://docs.github.com/en/code-security/dependabot
- **Branch Protection:** https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches

### Monitoring
- **GitHub Actions:** https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/actions
- **Security Alerts:** https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/security
- **Insights:** https://github.com/Dobeu-Tech-Solutions/dobeunet-homepage/pulse

---

**Status:** ✅ **COMPLETE - READY TO ACTIVATE**

**Next:** Add the 2 required secrets in GitHub and test with a PR! 🚀

