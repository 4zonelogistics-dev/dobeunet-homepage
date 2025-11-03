import LegalDocumentLayout from '../components/legal/LegalDocumentLayout';
import LegalSection from '../components/legal/LegalSection';
import { useEffect } from 'react';

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service - Dobeu Tech Solutions';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Terms of Service for Dobeu Tech Solutions. Review our terms for using the restaurant operations platform, consulting services, and related products.');
    }
  }, []);

  return (
    <LegalDocumentLayout title="Terms of Service" lastUpdated="2025-10-26">
      <div className="mb-8 p-6 bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 rounded">
        <p className="text-slate-800 dark:text-slate-200 font-medium mb-2">
          Effective Date: October 26, 2025
        </p>
        <p className="text-slate-700 dark:text-slate-300 text-sm">
          Please read these Terms of Service carefully before using the Dobeu Tech Solutions website, platform, or services. By accessing or using our services, you agree to be bound by these terms.
        </p>
      </div>

      <LegalSection id="acceptance" title="1. Acceptance of Terms">
        <p>
          These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and Dobeu Tech Solutions ("Dobeu," "we," "us," or "our") governing your access to and use of:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>The Dobeu website located at dobeu.net</li>
          <li>The Dobeu restaurant operations platform (the "Platform")</li>
          <li>Mobile applications for food waste tracking and operational management</li>
          <li>Consulting services and custom software development</li>
          <li>Any related tools, features, or services (collectively, the "Services")</li>
        </ul>
        <p className="mt-4">
          By creating an account, accessing our website, or using any of our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <a href="/privacy" className="text-cyan-600 dark:text-cyan-400 hover:underline">Privacy Policy</a>.
        </p>
        <p>
          If you do not agree with these Terms, you must immediately discontinue use of all Services.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="2. Eligibility and Account Registration">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">2.1 Eligibility Requirements</h3>
        <p>To use our Services, you must:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Be at least 18 years of age</li>
          <li>Have the legal capacity to enter into binding contracts</li>
          <li>Represent a legitimate business entity for commercial Services</li>
          <li>Not be prohibited from using our Services under applicable laws</li>
          <li>Not have been previously suspended or banned from our Services</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">2.2 Account Registration</h3>
        <p>When creating an account, you agree to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Provide accurate, current, and complete registration information</li>
          <li>Maintain and promptly update your account information</li>
          <li>Keep your password secure and confidential</li>
          <li>Notify us immediately of any unauthorized account access</li>
          <li>Accept responsibility for all activities under your account</li>
        </ul>
        <p className="mt-4">
          You may not: (a) create multiple accounts for the same business entity; (b) share your account credentials with others; (c) use another person's account without permission; or (d) create an account using false or misleading information.
        </p>
      </LegalSection>

      <LegalSection id="service-description" title="3. Service Description">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">3.1 Restaurant Operations Platform</h3>
        <p>Our SaaS platform provides:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Food waste tracking and categorization with AI-assisted analysis</li>
          <li>Inventory management and supplier invoice processing</li>
          <li>Menu item cost analysis and pricing optimization</li>
          <li>Real-time operational dashboards and ROI metrics</li>
          <li>Integration with POS systems (Toast, Square, and others)</li>
          <li>Mobile applications for on-site data collection</li>
          <li>Reporting and analytics tools for operational insights</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">3.2 Consulting Services</h3>
        <p>We offer custom software development and consulting services including:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Restaurant technology assessments and implementation planning</li>
          <li>Custom software development for operational needs</li>
          <li>POS system integration and data migration</li>
          <li>Technology training and onboarding support</li>
          <li>Ongoing technical support and optimization</li>
        </ul>
        <p className="mt-4">
          Consulting services are provided under separate statements of work or service agreements that supplement these Terms.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">3.3 Pilot Programs</h3>
        <p>
          Pilot program participants receive early access to features under development. Pilot programs may have: (a) reduced functionality; (b) potential bugs or technical issues; (c) limited support availability; (d) special pricing terms; and (e) additional requirements for feedback and data sharing.
        </p>
      </LegalSection>

      <LegalSection id="subscription-payment" title="4. Subscription and Payment Terms">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">4.1 Subscription Plans</h3>
        <p>Our Platform is offered through subscription plans with the following terms:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Free Trial:</strong> [TRIAL DURATION] trial period with full feature access (if applicable)</li>
          <li><strong>Monthly Subscription:</strong> Billed monthly with automatic renewal</li>
          <li><strong>Annual Subscription:</strong> Billed annually with automatic renewal at discounted rates</li>
          <li><strong>Custom Enterprise:</strong> Negotiated pricing for multi-location operations</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">4.2 Pricing and Fees</h3>
        <p>Current pricing is available at [PRICING PAGE URL]. We reserve the right to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Modify pricing with 30 days advance notice to existing customers</li>
          <li>Grandfather existing customers at current rates for [TIME PERIOD]</li>
          <li>Charge additional fees for premium features or add-ons</li>
          <li>Offer promotional pricing or discounts at our discretion</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">4.3 Payment Methods</h3>
        <p>We accept the following payment methods:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Credit cards (Visa, Mastercard, American Express, Discover)</li>
          <li>ACH bank transfers (for annual subscriptions and enterprise accounts)</li>
          <li>Company checks (for invoiced accounts with approved credit terms)</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">4.4 Billing and Automatic Renewal</h3>
        <p>By providing payment information, you authorize us to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Charge your payment method at the start of each billing period</li>
          <li>Automatically renew your subscription unless canceled</li>
          <li>Update payment information from your payment provider</li>
          <li>Charge late fees for overdue invoiced accounts</li>
        </ul>
        <p className="mt-4">
          Subscription fees are non-refundable except as required by law or as explicitly stated in these Terms.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">4.5 Failed Payments</h3>
        <p>If a payment fails, we will:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Notify you via email and request updated payment information</li>
          <li>Retry the charge up to 3 times over 10 days</li>
          <li>Suspend your account access if payment cannot be processed</li>
          <li>Terminate your account after 30 days of non-payment</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">4.6 Refund Policy</h3>
        <p>Refunds are provided in the following circumstances:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Trial Cancellation:</strong> No charges if canceled before trial ends</li>
          <li><strong>Service Issues:</strong> Pro-rated refund for documented service outages exceeding our SLA</li>
          <li><strong>Duplicate Charges:</strong> Full refund for billing errors within 60 days</li>
          <li><strong>Dissatisfaction:</strong> 30-day money-back guarantee for first-time subscribers</li>
        </ul>
        <p className="mt-4">
          To request a refund, contact <a href="mailto:billing@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">billing@dobeu.net</a> with your account details and reason for the request.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="5. Acceptable Use Policy">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">5.1 Permitted Use</h3>
        <p>You may use our Services for:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Managing restaurant operations and business data</li>
          <li>Tracking food waste and inventory</li>
          <li>Analyzing operational metrics and generating reports</li>
          <li>Integrating with your existing POS and business systems</li>
          <li>Training your employees on platform features</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">5.2 Prohibited Activities</h3>
        <p>You agree not to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Violate any applicable laws, regulations, or third-party rights</li>
          <li>Use the Services for any illegal, fraudulent, or unauthorized purpose</li>
          <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
          <li>Reverse engineer, decompile, or disassemble any aspect of the Platform</li>
          <li>Remove, obscure, or alter any proprietary notices or branding</li>
          <li>Introduce viruses, malware, or other malicious code</li>
          <li>Engage in data scraping, harvesting, or automated data collection</li>
          <li>Interfere with or disrupt the integrity or performance of the Services</li>
          <li>Resell, sublicense, or redistribute the Services without authorization</li>
          <li>Use the Services to compete with Dobeu or develop competing products</li>
          <li>Upload or transmit infringing, defamatory, or objectionable content</li>
          <li>Impersonate any person or entity or misrepresent your affiliation</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">5.3 Enforcement</h3>
        <p>
          We reserve the right to investigate violations and take appropriate action, including: (a) removing content; (b) suspending or terminating accounts; (c) reporting illegal activity to law enforcement; and (d) pursuing legal remedies.
        </p>
      </LegalSection>

      <LegalSection id="intellectual-property" title="6. Intellectual Property Rights">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">6.1 Dobeu's Intellectual Property</h3>
        <p>
          All rights, title, and interest in the Services, including but not limited to software, algorithms, user interfaces, designs, logos, trademarks, and documentation (collectively, "Dobeu IP") are owned by Dobeu Tech Solutions and protected by intellectual property laws.
        </p>
        <p>
          "Dobeu," the Dobeu logo, and other trademarks are proprietary marks. You may not use our trademarks without prior written permission.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">6.2 Limited License Grant</h3>
        <p>
          Subject to these Terms and payment of applicable fees, we grant you a limited, non-exclusive, non-transferable, revocable license to:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Access and use the Platform for your internal business operations</li>
          <li>Use mobile applications on authorized devices</li>
          <li>Generate and download reports for your business use</li>
        </ul>
        <p className="mt-4">
          This license does not include the right to: (a) modify or create derivative works; (b) distribute, sell, or sublicense the Services; (c) access source code; or (d) use the Services for service bureau purposes.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">6.3 Customer Data Ownership</h3>
        <p>
          You retain all ownership rights to data you submit to the Platform ("Customer Data"), including:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Restaurant operational data</li>
          <li>Food waste logs and inventory information</li>
          <li>Financial data and pricing information</li>
          <li>Employee data and access permissions</li>
        </ul>
        <p className="mt-4">
          You grant us a limited license to use Customer Data solely to: (a) provide the Services; (b) improve our algorithms and features using aggregated, anonymized data; and (c) generate industry benchmarks and reports.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">6.4 Feedback and Suggestions</h3>
        <p>
          If you provide feedback, suggestions, or ideas about our Services, you grant us a perpetual, irrevocable, worldwide, royalty-free license to use, modify, and incorporate such feedback without compensation or attribution.
        </p>
      </LegalSection>

      <LegalSection id="data-responsibilities" title="7. Data Security and Responsibilities">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">7.1 Our Responsibilities</h3>
        <p>We will:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Implement reasonable security measures to protect your data</li>
          <li>Maintain regular backups of Customer Data</li>
          <li>Provide documented data export capabilities</li>
          <li>Comply with our <a href="/privacy" className="text-cyan-600 dark:text-cyan-400 hover:underline">Privacy Policy</a></li>
          <li>Notify you of security breaches as required by law</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">7.2 Your Responsibilities</h3>
        <p>You are responsible for:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Maintaining the security of your account credentials</li>
          <li>Ensuring accuracy and legality of data you upload</li>
          <li>Complying with applicable data protection laws</li>
          <li>Obtaining necessary consents from employees and third parties</li>
          <li>Maintaining your own backup copies of critical data</li>
          <li>Managing user permissions and access controls</li>
        </ul>
      </LegalSection>

      <LegalSection id="third-party-integrations" title="8. Third-Party Integrations">
        <p>
          Our Services integrate with third-party systems including POS platforms (Toast, Square), payment processors, and other business tools. When using integrations:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>You are responsible for maintaining active accounts with third-party providers</li>
          <li>Third-party services are governed by their own terms and privacy policies</li>
          <li>We are not responsible for third-party service availability or functionality</li>
          <li>Integration capabilities may change based on third-party API modifications</li>
          <li>You grant us necessary permissions to access your third-party accounts</li>
        </ul>
        <p className="mt-4">
          Dobeu does not endorse, control, or assume responsibility for third-party products or services.
        </p>
      </LegalSection>

      <LegalSection id="service-availability" title="9. Service Availability and Modifications">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">9.1 Service Level</h3>
        <p>
          We strive to maintain [99.5%] uptime for the Platform (calculated monthly, excluding scheduled maintenance). However, Services are provided "as available" and may experience interruptions due to:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Scheduled maintenance (announced 48 hours in advance when possible)</li>
          <li>Emergency maintenance for security or stability issues</li>
          <li>Third-party service failures beyond our control</li>
          <li>Force majeure events</li>
        </ul>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">9.2 Service Modifications</h3>
        <p>We reserve the right to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Modify, update, or discontinue features with reasonable notice</li>
          <li>Change system requirements or technical specifications</li>
          <li>Implement new features or improvements without prior notice</li>
          <li>Temporarily suspend Services for maintenance or upgrades</li>
        </ul>
        <p className="mt-4">
          Material changes affecting core functionality will be communicated at least 30 days in advance.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="10. Termination and Suspension">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">10.1 Termination by You</h3>
        <p>You may terminate your account at any time by:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Canceling through your account settings, or</li>
          <li>Emailing <a href="mailto:support@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">support@dobeu.net</a></li>
        </ul>
        <p className="mt-4">
          Cancellation takes effect at the end of your current billing period. You will retain access until that date and will not be charged for subsequent periods.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">10.2 Termination by Dobeu</h3>
        <p>We may suspend or terminate your account immediately if you:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Violate these Terms or our Acceptable Use Policy</li>
          <li>Fail to pay fees when due (after 30-day grace period)</li>
          <li>Engage in fraudulent or illegal activity</li>
          <li>Pose a security risk to our Services or other users</li>
          <li>Repeatedly upload malicious content or abuse support channels</li>
        </ul>
        <p className="mt-4">
          We will provide notice before termination when reasonably possible, except for violations requiring immediate action.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">10.3 Effects of Termination</h3>
        <p>Upon termination:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Your access to the Services will be immediately revoked</li>
          <li>You will have 30 days to export your Customer Data</li>
          <li>We may delete your data after 60 days (subject to legal retention requirements)</li>
          <li>You remain liable for any unpaid fees</li>
          <li>Sections of these Terms that should survive termination will remain in effect</li>
        </ul>
      </LegalSection>

      <LegalSection id="warranties-disclaimers" title="11. Warranties and Disclaimers">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">11.1 Limited Warranty</h3>
        <p>
          We warrant that the Services will perform substantially in accordance with our documentation under normal use. This warranty does not cover issues caused by: (a) misuse or unauthorized modifications; (b) third-party software or services; (c) your hardware or network issues; or (d) failure to apply updates.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">11.2 Disclaimers</h3>
        <p className="font-semibold uppercase">
          EXCEPT AS EXPRESSLY PROVIDED IN SECTION 11.1, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul className="list-disc ml-6 space-y-2 mt-4">
          <li>IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT</li>
          <li>WARRANTIES REGARDING ACCURACY, RELIABILITY, OR COMPLETENESS OF DATA OR RESULTS</li>
          <li>WARRANTIES THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE</li>
          <li>WARRANTIES REGARDING THIRD-PARTY INTEGRATIONS OR SERVICES</li>
        </ul>
        <p className="mt-4">
          We do not warrant that our Services will meet your specific requirements or that defects will be corrected. Some jurisdictions do not allow exclusion of implied warranties, so some limitations may not apply to you.
        </p>
      </LegalSection>

      <LegalSection id="limitation-liability" title="12. Limitation of Liability">
        <p className="font-semibold uppercase mb-4">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW:
        </p>
        <p>
          IN NO EVENT SHALL DOBEU TECH SOLUTIONS, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul className="list-disc ml-6 space-y-2 mt-4">
          <li>LOSS OF PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES</li>
          <li>BUSINESS INTERRUPTION OR LOST SAVINGS</li>
          <li>COST OF SUBSTITUTE SERVICES</li>
          <li>LOSS OF GOODWILL OR REPUTATION</li>
        </ul>
        <p className="mt-4">
          WHETHER ARISING FROM CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p className="mt-4">
          OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICES SHALL NOT EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID TO DOBEU IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) $500.
        </p>
        <p className="mt-4">
          These limitations apply to claims based on warranty, contract, tort, or any other legal theory, even if we have been advised of the possibility of such damages. Some jurisdictions do not allow limitation of liability for consequential damages, so these limitations may not fully apply to you.
        </p>
      </LegalSection>

      <LegalSection id="indemnification" title="13. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Dobeu Tech Solutions, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from or related to:
        </p>
        <ul className="list-disc ml-6 space-y-2 mt-4">
          <li>Your use or misuse of the Services</li>
          <li>Your violation of these Terms or any applicable laws</li>
          <li>Your Customer Data or content you submit</li>
          <li>Your infringement of third-party intellectual property rights</li>
          <li>Your negligence or willful misconduct</li>
        </ul>
        <p className="mt-4">
          We reserve the right to assume exclusive defense and control of any matter subject to indemnification, and you agree to cooperate with our defense of such claims.
        </p>
      </LegalSection>

      <LegalSection id="dispute-resolution" title="14. Dispute Resolution and Governing Law">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">14.1 Governing Law</h3>
        <p>
          These Terms are governed by and construed in accordance with the laws of the State of New Jersey, United States, without regard to its conflict of law provisions.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">14.2 Informal Dispute Resolution</h3>
        <p>
          Before filing a claim, you agree to contact us at <a href="mailto:legal@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">legal@dobeu.net</a> to attempt to resolve the dispute informally. We will attempt to resolve disputes within 60 days of receiving your notice.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">14.3 Arbitration Agreement</h3>
        <p>
          If informal resolution fails, disputes will be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association. Arbitration will be conducted in Monmouth County, New Jersey or via videoconference.
        </p>
        <p className="mt-4">
          <strong>Exceptions:</strong> Either party may bring claims in small claims court if they qualify. We may also seek injunctive relief in court for intellectual property infringement or unauthorized access.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">14.4 Class Action Waiver</h3>
        <p>
          You agree that disputes will be resolved on an individual basis only. You waive the right to participate in class actions, class arbitrations, or representative proceedings.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">14.5 Jurisdiction and Venue</h3>
        <p>
          To the extent arbitration does not apply, you consent to the exclusive jurisdiction of state and federal courts located in Monmouth County, New Jersey.
        </p>
      </LegalSection>

      <LegalSection id="general-provisions" title="15. General Provisions">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">15.1 Force Majeure</h3>
        <p>
          We are not liable for delays or failures in performance resulting from circumstances beyond our reasonable control, including natural disasters, acts of war, terrorism, labor disputes, government actions, pandemics, or internet/telecommunications failures.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">15.2 Entire Agreement</h3>
        <p>
          These Terms, together with our Privacy Policy and any separate service agreements, constitute the entire agreement between you and Dobeu regarding the Services, superseding any prior agreements.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">15.3 Amendments</h3>
        <p>
          We may modify these Terms at any time by posting updated terms on our website. Material changes will be notified via email at least 30 days before taking effect. Continued use after changes become effective constitutes acceptance.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">15.4 Severability</h3>
        <p>
          If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect, and the invalid provision will be modified to reflect the parties' intentions as closely as possible.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">15.5 Waiver</h3>
        <p>
          Our failure to enforce any right or provision of these Terms does not constitute a waiver of such right or provision. Any waiver must be in writing and signed by an authorized representative.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">15.6 Assignment</h3>
        <p>
          You may not assign or transfer these Terms or your account without our written consent. We may assign these Terms to an affiliate or in connection with a merger, acquisition, or sale of assets.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">15.7 No Third-Party Beneficiaries</h3>
        <p>
          These Terms do not create any third-party beneficiary rights except as explicitly stated.
        </p>

        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">15.8 Notices</h3>
        <p>
          We may provide notices to you via email, in-platform notifications, or by posting on our website. Notices to us must be sent to the address provided in Section 16.
        </p>
      </LegalSection>

      <LegalSection id="contact-information" title="16. Contact Information">
        <p>For questions about these Terms of Service, please contact us:</p>

        <div className="mt-6 p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
          <p className="font-semibold text-slate-900 dark:text-white mb-4">Dobeu Tech Solutions</p>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <p><strong>Legal Inquiries:</strong> <a href="mailto:legal@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">legal@dobeu.net</a></p>
            <p><strong>Billing Questions:</strong> <a href="mailto:billing@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">billing@dobeu.net</a></p>
            <p><strong>General Support:</strong> <a href="mailto:support@dobeu.net" className="text-cyan-600 dark:text-cyan-400 hover:underline">support@dobeu.net</a></p>
            <p><strong>Location:</strong> Neptune, NJ [FULL STREET ADDRESS TO BE ADDED]</p>
            <p><strong>Phone:</strong> [PHONE NUMBER TO BE ADDED]</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <strong>Note for Legal Review:</strong> These Terms of Service include placeholders marked in [BRACKETS] that require completion with actual business details before deployment. Key items requiring customization include: trial duration, specific pricing page URLs, SLA uptime commitments, arbitration specifics, and complete contact information. Please review with legal counsel to ensure compliance with New Jersey law and your specific business model.
          </p>
        </div>
      </LegalSection>
    </LegalDocumentLayout>
  );
}
