# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the Dobeu.net project.

## Workflows

### 🔍 ci.yml - Continuous Integration
Runs on every push and PR. Includes:
- Dependency security audit
- ESLint & TypeScript checks
- Trivy security scanning
- Build verification
- Bundle size monitoring
- AI code review (PRs only)

### 🚀 deploy-production.yml - Production Deployment
Runs when code is pushed to `main`. Includes:
- Pre-deployment security checks
- Automated Netlify deployment
- Post-deployment verification
- Status notifications

### 👀 pr-preview.yml - PR Preview
Creates preview deployments for every PR. Includes:
- Unique preview URL per PR
- Lighthouse performance check
- Automatic cleanup on PR close

### 📦 dependency-update.yml - Dependency Management
Runs weekly (Mondays). Includes:
- Automated dependency updates
- Security patch applications
- Auto-created PRs for review

### 🤖 code-review.yml - AI Code Review
Runs on PRs. Includes:
- Static code analysis
- Security pattern detection
- Code quality metrics
- Best practices validation

## Setup Required

See `GITHUB_ACTIONS_SETUP.md` for complete setup instructions.

**Required Secrets:**
1. `NETLIFY_AUTH_TOKEN`
2. `NETLIFY_SITE_ID`

## Status

All workflows are configured and ready to use once secrets are added.

