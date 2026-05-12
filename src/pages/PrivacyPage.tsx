import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <section className="majd-section page-section">
        <div className="majd-inner">
          <div className="policy-header">
            <div className="section-eyebrow">// legal</div>
            <h1 className="section-heading">Privacy Policy</h1>
            <p className="policy-meta">Last updated: May 2026</p>
          </div>

          <div className="policy-content">
            <section className="policy-section">
              <h2>1. Introduction</h2>
              <p>
                Welcome to <strong>majdst.codes</strong> ("we," "us," "our," or "Company"). We are committed to
                protecting your privacy and ensuring you have a positive experience on our website. This Privacy
                Policy explains how we collect, use, disclose, and safeguard your information when you visit our
                website, including any other media form, media channel, mobile website, or mobile application
                related or connected thereto.
              </p>
            </section>

            <section className="policy-section">
              <h2>2. Information We Collect</h2>
              <p>We may collect information about you in a variety of ways. The information we may collect on the
                site includes:</p>

              <h3>2.1 Automatically Collected Information</h3>
              <ul>
                <li><strong>Log Data:</strong> Information your browser sends to us (IP address, browser type, pages visited, time spent, referral URLs)</li>
                <li><strong>Cookies:</strong> Small text files stored on your device for preferences and analytics</li>
                <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers</li>
                <li><strong>Usage Information:</strong> How you interact with the site (clicks, scrolls, session duration)</li>
              </ul>

              <h3>2.2 Information You Provide</h3>
              <ul>
                <li><strong>Newsletter Subscription:</strong> Email address and optional first name when subscribing</li>
                <li><strong>Contact Forms:</strong> Information submitted through any contact or feedback forms</li>
                <li><strong>User Accounts:</strong> Account credentials and profile information if you create an account</li>
              </ul>

              <h3>2.3 Third-Party Information</h3>
              <ul>
                <li>Information from analytics providers (Microsoft Clarity)</li>
                <li>Information from social media platforms (if you connect your social accounts)</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>3. How We Use Your Information</h2>
              <p>We use the collected information for various purposes:</p>
              <ul>
                <li><strong>To provide and improve our services</strong> - Understanding how users interact with our platform</li>
                <li><strong>To send newsletters</strong> - Delivering weekly dev cards, challenges, and updates</li>
                <li><strong>To analyze usage patterns</strong> - Identifying popular content and user preferences</li>
                <li><strong>To customize your experience</strong> - Remembering your preferences and settings</li>
                <li><strong>To conduct research and development</strong> - Improving site functionality and features</li>
                <li><strong>To comply with legal obligations</strong> - Meeting regulatory and legal requirements</li>
                <li><strong>To prevent fraud and abuse</strong> - Protecting our platform and users</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>4. Analytics & Session Recording</h2>
              <p>
                We use <strong>Microsoft Clarity</strong> for analytics and session recording. Clarity helps us understand
                how users interact with our site, identify usability issues, and improve the user experience.
              </p>
              <ul>
                <li><strong>What is collected:</strong> Mouse movements, clicks, scroll behavior, page views, and session recordings</li>
                <li><strong>User control:</strong> You can disable analytics through our cookie preferences</li>
                <li><strong>Privacy:</strong> Session recordings do not capture sensitive information like passwords or payment data</li>
                <li><strong>Retention:</strong> Data is retained per Microsoft's default policies (typically 30 days)</li>
              </ul>
              <p>
                Learn more: <a href="https://clarity.microsoft.com/privacy" target="_blank" rel="noopener noreferrer">Microsoft Clarity Privacy</a>
              </p>
            </section>

            <section className="policy-section">
              <h2>5. Cookie Usage</h2>
              <p>
                Cookies are small text files stored on your device. We use different types of cookies for different purposes.
                See our <a href="/cookies">Cookie Policy</a> for detailed information about how we use cookies and how to manage your preferences.
              </p>
            </section>

            <section className="policy-section">
              <h2>6. Data Sharing & Disclosure</h2>
              <p>We do not sell your personal information. We may share information in the following circumstances:</p>
              <ul>
                <li><strong>Service Providers:</strong> Third-party vendors who help us operate our site (hosting, analytics, email delivery)</li>
                <li><strong>Legal Requirements:</strong> When required by law, legal process, or government request</li>
                <li><strong>Protection of Rights:</strong> To enforce our terms of service or protect our legal rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your information against unauthorized
                access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure,
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="policy-section">
              <h2>8. Your Rights & Choices</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> Right to know what information we collect about you</li>
                <li><strong>Correction:</strong> Right to correct inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Right to request deletion of your data (subject to legal obligations)</li>
                <li><strong>Opt-out:</strong> Right to opt out of marketing communications</li>
                <li><strong>Cookie Control:</strong> Right to manage cookie preferences through our banner</li>
                <li><strong>Do Not Track:</strong> We honor browser "Do Not Track" signals when applicable</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>9. GDPR & CCPA Compliance</h2>
              <p>
                <strong>For EU Users (GDPR):</strong> We comply with the General Data Protection Regulation. You have rights to
                access, rectify, erase, and port your data. Contact us to exercise these rights.
              </p>
              <p>
                <strong>For California Users (CCPA):</strong> California residents have specific rights under the California
                Consumer Privacy Act. You can request information about what data we collect and delete your data.
              </p>
            </section>

            <section className="policy-section">
              <h2>10. Children's Privacy</h2>
              <p>
                Our website is not intended for children under 13 years old. We do not knowingly collect personal information
                from children under 13. If we become aware that we have collected information from a child under 13, we will
                take steps to delete such information promptly.
              </p>
            </section>

            <section className="policy-section">
              <h2>11. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of
                third-party sites. Please review their privacy policies before providing any personal information.
              </p>
            </section>

            <section className="policy-section">
              <h2>12. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul>
                <li><strong>Newsletter emails:</strong> Until you unsubscribe</li>
                <li><strong>Analytics data:</strong> Typically 30 days (Microsoft Clarity default)</li>
                <li><strong>Cookies:</strong> Duration varies by type (see Cookie Policy)</li>
                <li><strong>Legal/compliance data:</strong> As required by applicable laws</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>13. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> privacy@majdst.codes</p>
                <p><strong>Social Media:</strong> @majdst_codes</p>
                <ul className="social-links">
                  <li><a href="https://instagram.com/majdst_codes" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                  <li><a href="https://tiktok.com/@majdst_codes" target="_blank" rel="noopener noreferrer">TikTok</a></li>
                  <li><a href="https://youtube.com/@majdst_codes" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                </ul>
              </div>
            </section>

            <section className="policy-section">
              <h2>14. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal
                requirements, or other factors. We will notify you of any material changes by posting the updated policy on
                this page and updating the "Last updated" date. Your continued use of the site constitutes your acceptance of
                the updated Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
