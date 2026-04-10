import LegalLayout, { Section } from "@/components/ui/LegalLayout";

const sections: Section[] = [
  { id: "who-we-are", label: "1. Who We Are" },
  { id: "info-we-collect", label: "2. Information We Collect" },
  { id: "how-we-use", label: "3. How We Use Your Information" },
  { id: "who-we-share", label: "4. Who We Share With" },
  { id: "retention", label: "5. How Long We Keep Data" },
  { id: "security", label: "6. Data Security" },
  { id: "your-rights", label: "7. Your Rights" },
  { id: "cookies", label: "8. Cookies" },
  { id: "changes", label: "9. Changes to This Policy" },
  { id: "contact", label: "10. Contact Us" },
];

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="April 10, 2026"
      sections={sections}
    >
      <p>
        At Banstola Brothers, your privacy matters to us. This policy explains
        what personal information we collect when you place an order on{" "}
        <strong>banstolabrothers.com.np</strong>, how we use it, and how we
        protect it. We keep things simple — we only collect what&apos;s needed
        to deliver your order.
      </p>

      {/* 1 */}
      <section id="who-we-are" className="flex flex-col gap-4">
        <h3>1. Who We Are</h3>
        <p>
          Banstola Brothers is a Nepali food business founded in late 1990s by
          Muktinath Banstola, based in Pokhara, Nepal. We sell traditional
          Chhurpi, Khattu, Dog Chew, Papaya, and related products through our
          website at <strong>banstolabrothers.com.np</strong>.
        </p>
        <p>
          We are the data controller for the personal information collected
          through this website, meaning we are responsible for deciding how and
          why your data is used.
        </p>
      </section>

      {/* 2 */}
      <section id="info-we-collect" className="flex flex-col gap-4">
        <h3>2. Information We Collect</h3>
        <p>
          We only collect information that is necessary to process and deliver
          your order. Since our website operates on a guest checkout basis — no
          account required — we collect only what you provide at checkout:
        </p>
        <label>
          <strong>Full Name</strong> — to address your order correctly
        </label>
        <label>
          <strong>Delivery Address</strong> — to ship your order to the right
          location
        </label>
        <label>
          <strong>Phone Number</strong> — so our delivery team can reach you
        </label>
        <label>
          <strong>Email Address</strong> — to send your order confirmation
        </label>
        <p>
          We do not collect or store payment card details on our servers. Any
          payment processing is handled securely by our third-party payment
          provider.
        </p>
        <p>
          We do not require you to create an account or log in to place an
          order.
        </p>
      </section>

      {/* 3 */}
      <section id="how-we-use" className="flex flex-col gap-4">
        <h3>3. How We Use Your Information</h3>
        <p>Your personal data is used solely for the following purposes:</p>
        <label>To process and fulfill your order</label>
        <label>
          To arrange delivery through our courier or delivery partner
        </label>
        <label>
          To contact you regarding your order status or delivery updates
        </label>
        <label>To send you an order confirmation to your email address</label>
        <p>
          We do not use your data for marketing or promotional purposes unless
          you have separately and explicitly opted in.
        </p>
      </section>

      {/* 4 */}
      <section id="who-we-share" className="flex flex-col gap-4">
        <h3>4. Who We Share Your Information With</h3>
        <p>
          We share your personal information only with parties who need it to
          complete your order:
        </p>
        <label>
          <strong>Delivery / Courier Partners</strong> — your name, address, and
          phone number are shared with the courier responsible for delivering
          your order.
        </label>
        <label>
          <strong>Payment Processors</strong> — payment data is handled entirely
          by our third-party payment provider and is not stored on our servers.
        </label>
        <p>
          We do not sell, rent, or trade your personal data to any third party
          for marketing or any other purposes whatsoever.
        </p>
      </section>

      {/* 5 */}
      <section id="retention" className="flex flex-col gap-4">
        <h3>5. How Long We Keep Your Data</h3>
        <p>
          We retain your order information — including your name, address, and
          contact details — for up to <strong>2 years</strong> for order
          tracking and legal or accounting purposes.
        </p>
        <p>
          After this retention period, your data is securely and permanently
          deleted from our systems.
        </p>
      </section>

      {/* 6 */}
      <section id="security" className="flex flex-col gap-4">
        <h3>6. Data Security</h3>
        <p>
          We take reasonable technical and organisational steps to protect your
          personal information from unauthorised access, loss, or misuse. Our
          website uses <strong>HTTPS encryption</strong> to protect all data
          transmitted between your device and our servers.
        </p>
        <p>
          While we take every effort to safeguard your information, no method of
          transmission over the internet is 100% secure. We encourage you to be
          careful about what information you share online.
        </p>
      </section>

      {/* 7 */}
      <section id="your-rights" className="flex flex-col gap-4">
        <h3>7. Your Rights</h3>
        <p>Regarding your personal data, you have the right to:</p>
        <label>
          <strong>Access</strong> — request a copy of the personal data we hold
          about you
        </label>
        <label>
          <strong>Correction</strong> — request that we correct any inaccurate
          information
        </label>
        <label>
          <strong>Deletion</strong> — request that we delete your data, subject
          to any legal obligations we may have to retain it
        </label>
        <p>
          To exercise any of these rights, please reach out to us using the
          contact details in Section 10 below.
        </p>
      </section>

      {/* 8 */}
      <section id="cookies" className="flex flex-col gap-4">
        <h3>8. Cookies</h3>
        <p>
          Our website uses cookies to ensure basic site functionality — such as
          keeping your cart active during checkout. We also use analytics
          cookies to understand how visitors use our site so we can improve it.
        </p>
        <p>
          Please refer to our{" "}
          <a
            href="/legal/cookie-policy"
            className="underline underline-offset-2"
          >
            Cookie Policy
          </a>{" "}
          for full details on what cookies we use and how to manage them.
        </p>
      </section>

      {/* 9 */}
      <section id="changes" className="flex flex-col gap-4">
        <h3>9. Changes to This Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will post the updated policy on this page and update the effective
          date at the top.
        </p>
        <p>
          Your continued use of our website after any changes constitutes
          acceptance of the updated policy. We encourage you to review this page
          periodically.
        </p>
      </section>

      {/* 10 */}
      <section className="flex flex-col gap-4" id="contact">
        <h3>10. Contact Us</h3>
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
