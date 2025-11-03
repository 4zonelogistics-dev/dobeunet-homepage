# Legal Documents Customization Guide

This guide outlines the placeholders and sections in your Privacy Policy and Terms of Service that require customization before production deployment.

## Overview

Two comprehensive legal documents have been created:
- **Privacy Policy**: `/privacy` route
- **Terms of Service**: `/tos` route

Both documents are production-ready but contain placeholders marked with `[BRACKETS]` that need your specific business information.

---

## Privacy Policy Customization

### Required Information

#### 1. Contact Information (Section 13)
- **Full Street Address**: Replace `[FULL STREET ADDRESS TO BE ADDED]`
- **Phone Number**: Replace `[PHONE NUMBER TO BE ADDED]`

#### 2. Third-Party Service Providers (Section 5.1)
Specify your actual providers for:
- **Email Service**: Replace `[EMAIL SERVICE PROVIDER - TO BE SPECIFIED]` (e.g., SendGrid, Mailchimp, AWS SES)
- **Analytics**: Replace `[ANALYTICS PROVIDER - TO BE SPECIFIED]` (e.g., Google Analytics, Mixpanel, Plausible)
- **Cloud Infrastructure**: Replace `[CLOUD PROVIDER - TO BE SPECIFIED]` (e.g., AWS, Google Cloud, Azure)

#### 3. Optional Sections to Review

If you DON'T have certain features, remove or modify these sections:
- **Section 2.4**: Mobile Application Data (if no mobile app yet)
- **Section 6**: Consulting Services data handling (if not offering consulting)
- Any references to safety driver products (mentioned in your requirements but not in current platform)

---

## Terms of Service Customization

### Required Information

#### 1. Contact Information (Section 16)
- **Full Street Address**: Replace `[FULL STREET ADDRESS TO BE ADDED]`
- **Phone Number**: Replace `[PHONE NUMBER TO BE ADDED]`

#### 2. Subscription Details (Section 4)
- **Trial Duration**: Replace `[TRIAL DURATION]` (e.g., "14-day", "30-day")
- **Pricing Page URL**: Replace `[PRICING PAGE URL]` with actual URL when created
- **Grandfathering Period**: Replace `[TIME PERIOD]` (e.g., "12 months", "until next renewal")

#### 3. Service Level Agreement (Section 9.1)
- Confirm or adjust the **99.5% uptime** guarantee based on your infrastructure capabilities

---

## Location Information Discrepancy

**Note**: The documents currently list **Neptune, NJ** as your location, based on the Footer component. However, previous discussions mentioned **Toms River, NJ 08753**. Please verify and update consistently across:
- Privacy Policy (Section 13)
- Terms of Service (Section 16)
- Footer component (`/src/components/Footer.tsx`)
- Any other locations where address appears

---

## Email Addresses to Set Up

The legal documents reference several email addresses. Ensure these are created and monitored:

1. **privacy@dobeu.net** - Privacy inquiries and GDPR/CCPA requests
2. **legal@dobeu.net** - Legal inquiries and dispute resolution
3. **billing@dobeu.net** - Billing and payment questions
4. **support@dobeu.net** - General customer support
5. **info@dobeu.net** - Already exists (used in Footer)

Alternatively, you can:
- Route all to `info@dobeu.net` initially
- Update email addresses in documents to match your structure

---

## Review Checklist

Before going live, verify:

### Legal Compliance
- [ ] Have a lawyer review both documents
- [ ] Confirm GDPR compliance if serving EU customers
- [ ] Confirm CCPA compliance for California customers
- [ ] Verify arbitration clause complies with New Jersey law
- [ ] Confirm data retention periods meet industry standards

### Business Details
- [ ] All contact information is accurate and complete
- [ ] Third-party service providers are correctly disclosed
- [ ] Payment methods match what you actually accept
- [ ] Refund policy reflects your actual business practice
- [ ] Service level commitments are realistic

### Technical Accuracy
- [ ] Supabase is correctly identified as database provider
- [ ] POS integrations match what you support (Toast, Square, etc.)
- [ ] Mobile app references are accurate (or removed if not applicable)
- [ ] Data collection practices match your actual implementation

---

## File Locations

- **Privacy Policy Source**: `/src/pages/PrivacyPolicy.tsx`
- **Terms of Service Source**: `/src/pages/TermsOfService.tsx`
- **Footer with Links**: `/src/components/Footer.tsx`
- **Sitemap**: `/public/sitemap.xml` (already updated)

---

## Testing the Legal Pages

To test the new pages locally:

```bash
npm run dev
```

Then visit:
- Homepage: `http://localhost:5173/`
- Privacy Policy: `http://localhost:5173/privacy`
- Terms of Service: `http://localhost:5173/tos`
- 404 Page: `http://localhost:5173/nonexistent-page`

---

## SEO Considerations

The legal pages are already configured for SEO:
- ✅ Added to sitemap.xml with appropriate priority (0.3)
- ✅ Meta descriptions set dynamically
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Clean, readable URLs (`/privacy`, `/tos`)
- ✅ Mobile-responsive design
- ✅ Fast-loading with code splitting

---

## Accessibility

Both pages include:
- ✅ Semantic HTML structure
- ✅ Proper ARIA labels
- ✅ Keyboard navigation support
- ✅ Skip-to-content links
- ✅ High contrast dark mode support
- ✅ Screen reader friendly

---

## Future Maintenance

### When to Update Privacy Policy
- Adding new third-party integrations
- Collecting new types of data
- Changing data retention policies
- Expanding to new countries/regions
- Adding new features that affect privacy

### When to Update Terms of Service
- Changing pricing or billing
- Modifying refund policies
- Adding new prohibited activities
- Updating service level agreements
- Changes to dispute resolution

**Important**: When updating either document:
1. Update the `lastUpdated` prop in the component
2. Notify existing users via email
3. Update the sitemap lastmod date
4. Consider keeping archived versions for reference

---

## Quick Reference: Placeholder Search

To find all placeholders that need customization, search for:
- `[BRACKETS]` - Direct placeholders
- `TO BE ADDED` - Missing information
- `TO BE SPECIFIED` - Services to be named

---

## Contact for Questions

If you have questions about these legal documents or need assistance with customization, the documents were created based on:
- GDPR compliance requirements
- CCPA compliance requirements
- Industry best practices for SaaS platforms
- Your specific business model (restaurant operations platform + consulting)

Consider having these documents reviewed by a lawyer licensed in New Jersey before deployment.
