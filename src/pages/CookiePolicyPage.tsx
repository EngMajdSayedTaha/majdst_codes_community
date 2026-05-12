import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <section className="majd-section page-section">
        <div className="majd-inner">
          <div className="policy-header">
            <div className="section-eyebrow">// legal</div>
            <h1 className="section-heading">Cookie Policy</h1>
            <p className="policy-meta">Last updated: May 2026</p>
          </div>

          <div className="policy-content">
            <section className="policy-section">
              <h2>1. What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your device (computer, phone, or tablet) when you visit a website.
                They are widely used to make websites work more efficiently and provide useful information to website owners.
              </p>
              <p>
                Cookies allow websites to:
              </p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use the website</li>
                <li>Personalize your experience</li>
                <li>Track website performance</li>
                <li>Serve relevant content and advertisements</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>2. Our Cookie Categories</h2>

              <div className="cookie-type">
                <h3>2.1 Necessary Cookies (Always Enabled)</h3>
                <p>
                  <strong>Purpose:</strong> Required for the website to function properly and provide essential services.
                </p>
                <table className="cookie-table">
                  <thead>
                    <tr>
                      <th>Cookie Name</th>
                      <th>Provider</th>
                      <th>Duration</th>
                      <th>Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>majdst_cookie_consent</td>
                      <td>majdst.codes</td>
                      <td>1 year</td>
                      <td>Stores your cookie preference choices (Necessary, Functional, Analytics, Marketing)</td>
                    </tr>
                    <tr>
                      <td>__Host-session</td>
                      <td>majdst.codes</td>
                      <td>Session</td>
                      <td>Maintains your session on the website</td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  <strong>User Control:</strong> These cookies cannot be disabled as they are essential for website functionality.
                </p>
              </div>

              <div className="cookie-type">
                <h3>2.2 Functional Cookies (Opt-In)</h3>
                <p>
                  <strong>Purpose:</strong> Enhance website functionality and provide personalized features based on your preferences.
                </p>
                <table className="cookie-table">
                  <thead>
                    <tr>
                      <th>Cookie Name</th>
                      <th>Provider</th>
                      <th>Duration</th>
                      <th>Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>user_preferences</td>
                      <td>majdst.codes</td>
                      <td>1 year</td>
                      <td>Remembers your display preferences (theme, language, layout)</td>
                    </tr>
                    <tr>
                      <td>section_visited</td>
                      <td>majdst.codes</td>
                      <td>Session</td>
                      <td>Tracks which sections you've visited for navigation purposes</td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  <strong>User Control:</strong> You can enable/disable these through our cookie preferences.
                </p>
              </div>

              <div className="cookie-type">
                <h3>2.3 Analytics Cookies (Opt-In)</h3>
                <p>
                  <strong>Purpose:</strong> Help us understand how you use the website, identify issues, and improve performance.
                  Includes Microsoft Clarity for session recording and analytics.
                </p>
                <table className="cookie-table">
                  <thead>
                    <tr>
                      <th>Cookie Name</th>
                      <th>Provider</th>
                      <th>Duration</th>
                      <th>Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>_clarity_session</td>
                      <td>Microsoft Clarity</td>
                      <td>Session</td>
                      <td>Creates a unique session ID for session recording and analytics</td>
                    </tr>
                    <tr>
                      <td>_clck, _cli</td>
                      <td>Microsoft Clarity</td>
                      <td>1 year</td>
                      <td>Tracks user interactions and provides analytics data</td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  <strong>What is tracked:</strong> Page views, clicks, scroll behavior, mouse movements, form interactions.
                </p>
                <p>
                  <strong>What is NOT tracked:</strong> Passwords, payment information, sensitive form data.
                </p>
                <p>
                  <strong>Data Retention:</strong> Typically 30 days (Microsoft Clarity default policy).
                </p>
                <p>
                  <strong>User Control:</strong> You can disable analytics cookies through our cookie preferences. Once disabled,
                  no new tracking occurs, but existing session may be partially recorded.
                </p>
                <p>
                  Learn more about Clarity: <a href="https://clarity.microsoft.com/privacy" target="_blank" rel="noopener noreferrer">
                    Microsoft Clarity Privacy & Data
                  </a>
                </p>
              </div>

              <div className="cookie-type">
                <h3>2.4 Marketing Cookies (Opt-In)</h3>
                <p>
                  <strong>Purpose:</strong> Track marketing campaign performance and serve personalized advertisements.
                </p>
                <table className="cookie-table">
                  <thead>
                    <tr>
                      <th>Cookie Name</th>
                      <th>Provider</th>
                      <th>Duration</th>
                      <th>Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>utm_campaign</td>
                      <td>majdst.codes / Partners</td>
                      <td>Session</td>
                      <td>Tracks which marketing campaign led you to our site</td>
                    </tr>
                    <tr>
                      <td>_fbp</td>
                      <td>Meta Pixel</td>
                      <td>3 months</td>
                      <td>Facebook pixel for ad targeting and campaign tracking (if enabled)</td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  <strong>User Control:</strong> You can enable/disable these through our cookie preferences.
                </p>
              </div>
            </section>

            <section className="policy-section">
              <h2>3. Third-Party Cookies</h2>
              <p>
                Some cookies are placed by third-party providers who deliver services on our behalf:
              </p>
              <ul>
                <li>
                  <strong>Microsoft Clarity:</strong> Analytics and session recording service. See their
                  <a href="https://clarity.microsoft.com/privacy" target="_blank" rel="noopener noreferrer"> privacy policy</a>.
                </li>
                <li>
                  <strong>Social Media Platforms:</strong> If you use social login or share buttons, they may place cookies.
                </li>
              </ul>
              <p>
                These third parties have their own privacy policies. We are not responsible for their cookie practices beyond
                our contractual obligations.
              </p>
            </section>

            <section className="policy-section">
              <h2>4. How to Manage Cookies</h2>

              <h3>4.1 Using Our Cookie Preferences</h3>
              <p>
                The easiest way to manage cookies is through our cookie consent banner that appears when you first visit the site.
                You can:
              </p>
              <ul>
                <li><strong>Accept All:</strong> Enable all cookie categories</li>
                <li><strong>Necessary Only:</strong> Disable all optional cookies</li>
                <li><strong>Customize:</strong> Toggle individual cookie categories to your preference</li>
              </ul>

              <h3>4.2 Browser Settings</h3>
              <p>
                You can also control cookies through your browser settings:
              </p>
              <ul>
                <li>
                  <strong>Chrome/Edge:</strong> Settings → Privacy and security → Cookies and other site data
                </li>
                <li>
                  <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
                </li>
                <li>
                  <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
                </li>
              </ul>
              <p>
                <strong>Note:</strong> Disabling cookies may affect website functionality.
              </p>

              <h3>4.3 Do Not Track (DNT)</h3>
              <p>
                Some browsers have a "Do Not Track" feature. While we honor DNT signals where applicable, not all cookies can be
                completely disabled without impacting site functionality.
              </p>
            </section>

            <section className="policy-section">
              <h2>5. Cookie Consent & Storage</h2>
              <p>
                Your cookie preferences are stored locally in your browser under the key <code>majdst_cookie_consent</code>.
              </p>
              <p>
                <strong>Stored Data:</strong>
              </p>
              <pre className="code-block">
{`{
  "necessary": true,     // Always true
  "functional": true,    // Your choice
  "analytics": true,     // Your choice
  "marketing": false,    // Your choice
  "timestamp": 1715511234000,  // When you chose
  "version": "1.0"       // Consent version
}`}
              </pre>
            </section>

            <section className="policy-section">
              <h2>6. Clarity Analytics Specifics</h2>
              <p>
                Since Microsoft Clarity is our primary analytics tool, here's detailed information about it:
              </p>

              <h3>6.1 What Clarity Records</h3>
              <ul>
                <li>Your mouse movements and clicks</li>
                <li>How long you spend on each page</li>
                <li>Content you scroll through</li>
                <li>Form interactions (not form values)</li>
                <li>Page load performance metrics</li>
                <li>Browser and device information</li>
              </ul>

              <h3>6.2 What Clarity Does NOT Record</h3>
              <ul>
                <li>Passwords or authentication tokens</li>
                <li>Credit card numbers or payment info</li>
                <li>Personal identification numbers (SSN, etc.)</li>
                <li>Email addresses in password fields</li>
                <li>Text in password/sensitive input fields</li>
              </ul>

              <h3>6.3 Session Recordings</h3>
              <p>
                Clarity creates anonymous session recordings to help us understand user experience issues.
                These recordings:
              </p>
              <ul>
                <li>Do not identify you personally</li>
                <li>Are automatically anonymized</li>
                <li>Are stored for ~30 days (Microsoft policy)</li>
                <li>Can be disabled through cookie preferences</li>
              </ul>

              <h3>6.4 Disabling Clarity</h3>
              <p>
                To disable Clarity tracking:
              </p>
              <ol>
                <li>Click "Customize" in the cookie banner</li>
                <li>Toggle off "Analytics Cookies"</li>
                <li>Click "Save Preferences"</li>
              </ol>
              <p>
                <strong>Note:</strong> If you disable analytics after visiting, some data may have already been collected for that
                session. Future sessions will not be tracked.
              </p>
            </section>

            <section className="policy-section">
              <h2>7. Newsletter Cookies</h2>
              <p>
                If you subscribe to our newsletter:
              </p>
              <ul>
                <li>Your email is stored securely on our server</li>
                <li>We may place tracking pixels in emails to measure open/click rates</li>
                <li>You can unsubscribe anytime by clicking the link in any email</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>8. Updates to Cookie Usage</h2>
              <p>
                As our website evolves, we may add new cookies or retire old ones. We will:
              </p>
              <ul>
                <li>Update this policy when cookie usage changes</li>
                <li>Show the updated cookie banner on your next visit if you have a major change</li>
                <li>Notify you of material changes to cookie practices</li>
              </ul>
              <p>
                Your continued use of the site after updates constitutes acceptance of the new cookie policy.
              </p>
            </section>

            <section className="policy-section">
              <h2>9. GDPR & CCPA Cookie Rights</h2>
              <p>
                <strong>EU Users (GDPR):</strong> Under GDPR, we must obtain your consent before placing non-essential cookies.
                Our cookie banner handles this by requiring you to opt-in to non-necessary cookies.
              </p>
              <p>
                <strong>California Users (CCPA):</strong> California law gives you the right to know what cookies are used and to
                control them. You can manage your preferences through our cookie banner.
              </p>
            </section>

            <section className="policy-section">
              <h2>10. Questions About Cookies?</h2>
              <p>
                If you have questions about how we use cookies or want to exercise your rights:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> privacy@majdst.codes</p>
                <p><strong>Social Media:</strong> @majdst_codes on Instagram, TikTok, or YouTube</p>
              </div>
            </section>

            <section className="policy-section">
              <h2>11. Useful Links</h2>
              <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="https://clarity.microsoft.com" target="_blank" rel="noopener noreferrer">Microsoft Clarity</a></li>
                <li><a href="https://gdpr-info.eu" target="_blank" rel="noopener noreferrer">GDPR Information</a></li>
                <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">All About Cookies</a></li>
              </ul>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
