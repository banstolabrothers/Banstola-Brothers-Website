import LegalLayout, { Section } from "@/components/ui/LegalLayout";

const sections: Section[] = [
  { id: "what-are-cookies", label: "1. What Are Cookies?" },
  { id: "cookies-we-use", label: "2. Cookies We Use" },
  { id: "essential-cookies", label: "3. Essential Cookies" },
  { id: "analytics-cookies", label: "4. Analytics Cookies" },
  { id: "social-cookies", label: "5. Social Media Cookies" },
  { id: "manage-cookies", label: "6. How to Manage Cookies" },
  { id: "changes", label: "7. Changes to This Policy" },
  { id: "contact", label: "8. Contact Us" },
];

export default function CookiePolicy() {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated="April 10, 2026"
      sections={sections}
    >
      <p>
        This Cookie Policy explains what cookies are, which cookies{" "}
        <strong>banstolabrothers.com.np</strong> uses, and how you can manage
        them. We keep our cookie use minimal — only what&apos;s genuinely needed
        for the site to work well and help us understand how it&apos;s being
        used.
      </p>

      {/* 1 */}
      <section className="flex flex-col gap-4" id="what-are-cookies">
        <h3>1. What Are Cookies?</h3>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They allow the site to remember certain information about
          your visit — such as items in your cart or your browsing session — so
          your experience is smoother.
        </p>
        <p>
          Cookies do not contain personal data like your name or payment
          information on their own. They are widely used across the internet to
          make websites work properly and to provide information to site owners.
        </p>
      </section>

      {/* 2 */}
      <section className="flex flex-col gap-4" id="cookies-we-use">
        <h3>2. Cookies We Use</h3>
        <p>
          We use a small number of cookies, grouped into the categories below.
          We do not use advertising cookies or behavioural tracking cookies for
          marketing purposes.
        </p>
        <table className="policy-table">
          <thead>
            <tr>
              <th>Cookie</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>session_cart</code>
              </td>
              <td>
                <span className="badge badge-essential">Essential</span>
              </td>
              <td>Saves items in your shopping cart during your session</td>
              <td>Session (cleared on browser close)</td>
            </tr>
            <tr>
              <td>
                <code>checkout_session</code>
              </td>
              <td>
                <span className="badge badge-essential">Essential</span>
              </td>
              <td>Keeps your checkout progress and form entries intact</td>
              <td>Session</td>
            </tr>
            <tr>
              <td>
                <code>_ga</code>, <code>_gid</code>
              </td>
              <td>
                <span className="badge badge-analytics">Analytics</span>
              </td>
              <td>
                Google Analytics — helps us understand how visitors use our
                site. No personally identifiable data is shared.
              </td>
              <td>Up to 2 years</td>
            </tr>
            <tr>
              <td>Instagram / Meta Pixel</td>
              <td>
                <span className="badge badge-social">Social</span>
              </td>
              <td>
                Set when you interact with our Instagram-linked content. May
                track visits for ad performance measurement by Meta.
              </td>
              <td>Up to 90 days</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 3 */}
      <section className="flex flex-col gap-4" id="essential-cookies">
        <h3>3. Essential Cookies</h3>
        <p>
          Essential cookies are strictly necessary for our website to function
          correctly. They cannot be disabled — without them, core features such
          as your shopping cart and the checkout process would not work.
        </p>
        <p>
          These cookies do not collect any personal information and are never
          used for marketing or tracking. They are only set in response to
          actions you take, such as adding an item to your cart.
        </p>
      </section>

      {/* 4 */}
      <section className="flex flex-col gap-4" id="analytics-cookies">
        <h3>4. Analytics Cookies (Google Analytics)</h3>
        <p>
          We use Google Analytics to understand how visitors interact with our
          website — which pages are most popular, how long visitors stay, and
          how they navigate through the site. This helps us improve your
          experience and make better decisions about our content and products.
        </p>
        <p>
          The data collected through Google Analytics is anonymous and
          aggregated — it does not identify you personally. You can opt out at
          any time by installing the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>
      </section>

      {/* 5 */}
      <section className="flex flex-col gap-4" id="social-cookies">
        <h3>5. Social Media Cookies</h3>
        <p>
          Our website displays content linked to our Instagram page (
          <strong>@banstolabrothers</strong>). When you interact with or view
          this content, Instagram / Meta may set cookies on your device. These
          are governed by{" "}
          <a
            href="https://www.facebook.com/policies/cookies/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Meta&apos;s Cookie Policy
          </a>
          .
        </p>
        <p>
          We do not control these third-party cookies. If you wish to prevent
          them, adjust your settings on those platforms or use browser controls.
        </p>
      </section>

      {/* 6 */}
      <section className="flex flex-col gap-4" id="manage-cookies">
        <h3>6. How to Manage or Disable Cookies</h3>
        <p>
          You can control and manage cookies through your browser settings. Most
          modern browsers allow you to view, delete, and block cookies, and to
          receive notifications when a cookie is set.
        </p>
        <p>
          Please be aware that disabling certain cookies may affect site
          functionality. Disabling essential cookies may prevent you from
          completing a checkout.
        </p>
        <p>For browser-specific instructions:</p>
        <a
          href="https://support.google.com/chrome/answer/95647"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Google Chrome
        </a>
        <a
          href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Mozilla Firefox
        </a>
        <a
          href="https://support.apple.com/en-us/HT201265"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Apple Safari
        </a>
        <a
          href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Microsoft Edge
        </a>
      </section>

      {/* 7 */}
      <section className="flex flex-col gap-4" id="changes">
        <h3>7. Changes to This Cookie Policy</h3>
        <p>
          We may update this Cookie Policy from time to time. Any updates will
          be posted on this page with an updated effective date. We encourage
          you to check this page occasionally.
        </p>
      </section>

      {/* 8 */}
      <section className="flex flex-col gap-4" id="contact">
        <h3>8. Contact Us</h3>
        <section className="contact-box">
          <p>
            If you have any questions or concerns about these Terms &amp;
            Conditions, please reach out to us directly.
          </p>
          <p style={{ marginTop: 16 }}>
            <strong>Banstola Brothers</strong> — Pokhara, Nepal
          </p>
          <p>
            Email:{" "}
            <a
              className="underline underline-offset-2"
              href="mailto:banstolabrothers@gmail.com"
            >
              banstolabrothers@gmail.com
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a
              className="underline underline-offset-2"
              href="https://instagram.com/banstolabrothers"
            >
              @banstolabrothers
            </a>
          </p>
          <p>
            Facebook:{" "}
            <a
              className="underline underline-offset-2"
              href="https://facebook.com/banstolabrothers"
            >
              facebook.com/banstolabrothers
            </a>
          </p>
        </section>
      </section>
    </LegalLayout>
  );
}
