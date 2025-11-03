import LegalDocumentLayout from '../components/legal/LegalDocumentLayout';
import LegalSection from '../components/legal/LegalSection';
import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy - Dobeu Tech Solutions';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Privacy Policy for Dobeu Tech Solutions. Learn how we collect, use, protect, and manage your personal and business data.');
    }
  }, []);

  return (
    <LegalDocumentLayout title="Privacy Policy" lastUpdated="2025-10-26">
      <div className="mb-8 p-6 bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 rounded">
        <p className="text-slate-800 dark:text-slate-200 font-medium mb-2">
          Effective Date: October 26, 2025
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-sm">
          This Privacy Policy describes how Dobeu Tech Solutions ("we," "us," "our," or "Dobeu") collects, uses, protects, and discloses information about you when you use our website, restaurant operations platform, consulting services, and related products.
        </p>
      </div>

      <LegalSection id="introduction" title="1. Introduction">
        <p>
          Dobeu Tech Solutions is committed to protecting your privacy and maintaining the security of your personal and business data. This Privacy Policy applies to all users of our services, including:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Website visitors at dobeu.net</li>
          <li>Restaurant operations platform users (SaaS customers)</li>
          <li>Consulting service clients</li>
          <li>Mobile application users</li>
          <li>Demo and trial participants</li>
        </ul>
        <p>
          By using our services, you consent to the data practices described in this policy. If you do not agree with this policy, please discontinue use of our services.
        </p>
      </LegalSection>

      <LegalSection id="information-collection" title="2. Information We Collect">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">2.1 Information You Provide Directly</h3>
        <p>We collect information that you voluntarily provide when you:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Contact Us:</strong> Name, email address, phone number, company name, restaurant details, and message content through our contact forms</li>
          <li><strong>Create an Account:</strong> Business name, contact information, billing address, payment information, and user credentials</li>
          <li><strong>Use Our Platform:</strong> Restaurant location data, menu items, inventory information, food waste logs, invoice data, vendor details, pricing data, and financial metrics</li>
          <li><strong>Schedule Consultations:</strong> Availability preferences, business challenges, current technology stack, and operational requirements</li>
          <li><strong>Participate in Pilots:</strong> Operational data, feedback, usage patterns, and ROI metrics</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">2.2 Automatically Collected Information</h3>
        <p>When you interact with our website and platform, we automatically collect:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Usage Data:</strong> Pages viewed, features accessed, time spent, click patterns, and navigation paths</li>
          <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device type, and unique device identifiers</li>
          <li><strong>Analytics Data:</strong> Session duration, bounce rates, conversion metrics, and feature adoption rates</li>
          <li><strong>Cookies and Tracking:</strong> Session cookies, preference cookies, and analytics cookies (see Section 8)</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">2.3 Third-Party Integration Data</h3>
        <p>When you connect third-party services to our platform, we may collect:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>POS System Data:</strong> Sales transactions, menu items, inventory levels, and customer orders from integrated systems (Toast, Square, etc.)</li>
          <li><strong>Payment Processor Data:</strong> Transaction records, payment status, and billing information (processed securely by third-party payment processors)</li>
          <li><strong>Cloud Storage Data:</strong> Files, documents, and reports you upload or store through our platform</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">2.4 Mobile Application Data</h3>
        <p>Our mobile food waste tracking application may collect:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Camera access for waste documentation (with your permission)</li>
          <li>Location data for restaurant site verification (with your permission)</li>
          <li>Push notification tokens for operational alerts</li>
          <li>Offline data synchronized when connectivity is restored</li>
        </ul>
      </LegalSection>

      <LegalSection id="how-we-use-information" title="3. How We Use Your Information">
        <p>We use collected information for the following purposes:</p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">3.1 Service Delivery</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Provide, operate, and maintain our restaurant operations platform</li>
          <li>Process transactions and manage billing</li>
          <li>Deliver consulting services and custom software development</li>
          <li>Generate operational reports, analytics, and ROI calculations</li>
          <li>Enable integrations with POS systems and third-party applications</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">3.2 Communication</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Respond to inquiries and support requests</li>
          <li>Send service-related notifications and updates</li>
          <li>Provide training materials and onboarding assistance</li>
          <li>Share product updates, new features, and best practices</li>
          <li>Send marketing communications (with your consent, and you may opt out at any time)</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">3.3 Platform Improvement</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Analyze usage patterns to improve our products and services</li>
          <li>Conduct research and development for new features</li>
          <li>Identify and fix technical issues</li>
          <li>Optimize user experience and interface design</li>
          <li>Train machine learning models for waste categorization and predictive analytics</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">3.4 Legal and Security</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Comply with legal obligations and regulatory requirements</li>
          <li>Protect against fraud, security threats, and unauthorized access</li>
          <li>Enforce our Terms of Service and other agreements</li>
          <li>Resolve disputes and investigate violations</li>
        </ul>
      </LegalSection>

      <LegalSection id="data-storage" title="4. Data Storage and Security">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">4.1 Primary Data Storage</h3>
        <p>
          We use <strong>Supabase</strong> as our primary database provider for storing customer data. Supabase provides enterprise-grade security with:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Data encryption at rest using AES-256 encryption</li>
          <li>Data encryption in transit using TLS 1.3</li>
          <li>Regular security audits and compliance certifications</li>
          <li>Automatic daily backups with point-in-time recovery</li>
          <li>Row-level security policies to protect your data</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">4.2 Security Measures</h3>
        <p>We implement comprehensive security measures including:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Multi-factor authentication for account access</li>
          <li>Role-based access controls limiting data access to authorized personnel</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Employee training on data protection and privacy practices</li>
          <li>Incident response procedures for data breaches</li>
          <li>Secure development practices and code reviews</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">4.3 Data Retention</h3>
        <p>We retain your information for as long as necessary to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Provide our services to active accounts</li>
          <li>Comply with legal obligations (typically 7 years for financial records)</li>
          <li>Resolve disputes and enforce our agreements</li>
          <li>Maintain business records and analytics</li>
        </ul>
        <p className="mt-4">
          <strong>Inactive Accounts:</strong> If your account remains inactive for 12 consecutive months, we may archive your data and provide 30 days notice before deletion. You may request immediate deletion at any time (see Section 10).
        </p>
      </LegalSection>

      <LegalSection id="data-sharing" title="5. How We Share Your Information">
        <p>We do not sell your personal information. We may share your information in the following circumstances:</p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">5.1 Service Providers</h3>
        <p>We share data with trusted third-party service providers who assist in:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Database Hosting:</strong> Supabase (data storage and infrastructure)</li>
          <li><strong>Payment Processing:</strong> Stripe, Square (payment transactions)</li>
          <li><strong>Email Communications:</strong> [EMAIL SERVICE PROVIDER - TO BE SPECIFIED]</li>
          <li><strong>Analytics:</strong> [ANALYTICS PROVIDER - TO BE SPECIFIED, e.g., Google Analytics, Mixpanel]</li>
          <li><strong>Cloud Infrastructure:</strong> [CLOUD PROVIDER - TO BE SPECIFIED if using AWS, Google Cloud, etc.]</li>
        </ul>
        <p className="mt-4">
          These providers are contractually obligated to protect your information and use it only for providing services to us.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">5.2 POS System Integrations</h3>
        <p>
          When you connect your POS system (Toast, Square, or others), we access only the data necessary to provide our services, such as sales data, menu items, and inventory levels. This data is transmitted securely and stored in accordance with this Privacy Policy.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">5.3 Legal Requirements</h3>
        <p>We may disclose your information if required by law or in response to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Valid legal processes (subpoenas, court orders, search warrants)</li>
          <li>Government requests and regulatory inquiries</li>
          <li>Protection of our rights, property, or safety</li>
          <li>Prevention of fraud or security threats</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">5.4 Business Transfers</h3>
        <p>
          In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change and provide options regarding your data.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">5.5 Aggregated and Anonymized Data</h3>
        <p>
          We may share aggregated, anonymized data that cannot identify you personally for research, industry benchmarking, or marketing purposes. For example, "Restaurants using our platform reduce food waste by an average of 30%."
        </p>
      </LegalSection>

      <LegalSection id="consulting-services" title="6. Data Handling for Consulting Services">
        <p>When we provide consulting services or custom software development:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>We access client systems and data only as necessary to deliver contracted services</li>
          <li>We maintain strict confidentiality and sign Non-Disclosure Agreements (NDAs) when requested</li>
          <li>Client data accessed during consulting engagements is not used for other purposes</li>
          <li>We follow client-specific security and data handling requirements</li>
          <li>Upon project completion, we return or securely delete client data as specified in our agreement</li>
        </ul>
        <p className="mt-4">
          For consulting clients, specific data handling terms may be outlined in separate service agreements that supplement this Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection id="international-transfers" title="7. International Data Transfers">
        <p>
          Dobeu Tech Solutions is based in Neptune, New Jersey, United States. If you access our services from outside the United States, your information will be transferred to and processed in the United States.
        </p>
        <p>
          The United States may have different data protection laws than your country. By using our services, you consent to the transfer of your information to the United States and processing in accordance with this Privacy Policy.
        </p>
        <p>
          For users in the European Economic Area (EEA) or United Kingdom, we implement appropriate safeguards for international data transfers, including standard contractual clauses approved by the European Commission.
        </p>
      </LegalSection>

      <LegalSection id="cookies-tracking" title="8. Cookies and Tracking Technologies">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">8.1 Types of Cookies We Use</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Essential Cookies:</strong> Required for website functionality, user authentication, and security</li>
          <li><strong>Preference Cookies:</strong> Remember your settings such as language, timezone, and dark mode preference</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website to improve user experience</li>
          <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness (with your consent)</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">8.2 Managing Cookies</h3>
        <p>You can control cookies through your browser settings:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Most browsers allow you to refuse cookies or delete existing cookies</li>
          <li>Disabling essential cookies may limit website functionality</li>
          <li>You can opt out of analytics cookies through our cookie preference center</li>
          <li>For more information, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">www.allaboutcookies.org</a></li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">8.3 Do Not Track Signals</h3>
        <p>
          Some browsers support "Do Not Track" (DNT) signals. Currently, there is no industry standard for responding to DNT signals. We do not currently respond to DNT browser settings, but we provide cookie management options as described above.
        </p>
      </LegalSection>

      <LegalSection id="gdpr-rights" title="9. Your Rights Under GDPR (European Users)">
        <p>If you are located in the European Economic Area (EEA) or United Kingdom, you have the following rights under the General Data Protection Regulation (GDPR):</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Right to Access:</strong> Request copies of your personal data</li>
          <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
          <li><strong>Right to Restrict Processing:</strong> Limit how we use your data in certain circumstances</li>
          <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
          <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or for direct marketing</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
          <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
        </ul>
        <p className="mt-4">
          To exercise these rights, contact us at <a href="mailto:privacy@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">privacy@dobeu.net</a>. We will respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection id="ccpa-rights" title="10. Your Rights Under CCPA (California Users)">
        <p>If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA):</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Right to Know:</strong> Request disclosure of personal information collected, used, and shared</li>
          <li><strong>Right to Delete:</strong> Request deletion of your personal information (subject to exceptions)</li>
          <li><strong>Right to Opt-Out:</strong> Opt out of the sale of personal information (Note: We do not sell personal information)</li>
          <li><strong>Right to Non-Discrimination:</strong> Receive equal service regardless of privacy rights exercise</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">How to Exercise Your Rights</h3>
        <p>To submit a CCPA request:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Email: <a href="mailto:privacy@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">privacy@dobeu.net</a></li>
          <li>Subject line: "CCPA Data Request"</li>
          <li>Include your full name, email address, and account details for verification</li>
        </ul>
        <p className="mt-4">
          We will verify your identity before processing your request and respond within 45 days.
        </p>
      </LegalSection>

      <LegalSection id="childrens-privacy" title="11. Children's Privacy">
        <p>
          Our services are not intended for children under the age of 13 (or 16 in the European Economic Area). We do not knowingly collect personal information from children.
        </p>
        <p>
          If you believe we have inadvertently collected information from a child, please contact us immediately at <a href="mailto:privacy@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">privacy@dobeu.net</a>, and we will promptly delete such information.
        </p>
        <p>
          Our platform is designed for business use by restaurant operators, managers, and authorized employees who are at least 18 years old.
        </p>
      </LegalSection>

      <LegalSection id="changes-to-policy" title="12. Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Update the "Last Updated" date at the top of this policy</li>
          <li>Notify you via email if you have an active account</li>
          <li>Display a prominent notice on our website</li>
          <li>Request your consent for material changes affecting how we use personal information</li>
        </ul>
        <p className="mt-4">
          We encourage you to review this Privacy Policy periodically. Continued use of our services after changes become effective constitutes acceptance of the updated policy.
        </p>
      </LegalSection>

      <LegalSection id="contact-information" title="13. Contact Us">
        <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>

        <div className="mt-6 p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
          <p className="font-semibold text-slate-900 dark:text-white mb-4">Dobeu Tech Solutions</p>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <p><strong>Privacy Inquiries:</strong> <a href="mailto:privacy@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">privacy@dobeu.net</a></p>
            <p><strong>General Contact:</strong> <a href="mailto:info@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">info@dobeu.net</a></p>
            <p><strong>Location:</strong> Neptune, NJ [FULL STREET ADDRESS TO BE ADDED]</p>
            <p><strong>Phone:</strong> [PHONE NUMBER TO BE ADDED]</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <strong>Note for Legal Review:</strong> This Privacy Policy includes placeholders marked in [BRACKETS] that require completion with actual business details before deployment. Please review and customize sections related to third-party service providers, analytics tools, and contact information to reflect your current operational setup.
          </p>
        </div>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
