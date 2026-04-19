import LegalLayout, { Section } from "@/components/ui/LegalLayout";

import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta.termsAndConditions;

const sections: Section[] = [
  { id: "about", label: "1. About Us" },
  { id: "placing-an-order", label: "2. Placing an Order" },
  { id: "pricing-payment", label: "3. Pricing & Payment" },
  { id: "delivery", label: "4. Delivery" },
  { id: "returns-refunds", label: "5. Returns & Refunds" },
  { id: "product-disclaimers", label: "6. Product Disclaimers" },
  { id: "intellectual-property", label: "7. Intellectual Property" },
  { id: "liability", label: "8. Limitation of Liability" },
  { id: "governing-law", label: "9. Governing Law" },
  { id: "changes", label: "10. Changes to These Terms" },
  { id: "contact", label: "11. Contact Us" },
];

export default function TermsAndConditions() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      lastUpdated="April 10, 2026"
      sections={sections}
    >
      <p>
        Please read these Terms &amp; Conditions carefully before placing an
        order on <strong>banstolabrothers.com.np</strong>. By completing a
        purchase, you agree to be bound by these terms. If you do not agree,
        please do not use this website.
      </p>

      {/* 1 */}
      <section className="flex flex-col gap-4" id="about">
        <h3>1. About Us</h3>
        <p>
          Banstola Brothers is a Nepali food and product business founded in the
          late 1990s, operating from Pokhara, Nepal. We sell traditional
          Chhurpi, Khattu, Papaya, Dog Chew, and related products through our
          website at <strong>banstolabrothers.com.np</strong>.
        </p>
        <p>
          References to &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;
          throughout these Terms refer to Banstola Brothers. References to
          &quot;you&quot; or &quot;your&quot; refer to the customer placing an
          order on our website.
        </p>
      </section>

      {/* 2 */}
      <section className="flex flex-col gap-4" id="placing-an-order">
        <h3>2. Placing an Order</h3>
        <p>
          All orders on our website are completed through a guest checkout — no
          account is required. By submitting an order, you confirm that:
        </p>
        <p className="ml-8">
          1. The delivery information you provide (name, address, phone, email)
          is accurate and complete. We are not liable for failed deliveries due
          to incorrect information.
        </p>
        <p className="ml-8">
          2. You are of legal age to purchase the products in your region.
        </p>
        <p className="ml-8">
          3. You have reviewed your order before submitting it.
        </p>
        <p>
          An order is <strong>confirmed</strong> only after you receive an order
          confirmation via email or SMS. We reserve the right to cancel any
          order if a product is out of stock, unavailable, or if we are unable
          to deliver to your specified location.
        </p>
      </section>

      {/* 3 */}
      <section className="flex flex-col gap-4" id="pricing-payment">
        <h3>3. Pricing &amp; Payment</h3>
        <p>
          All prices listed on the website are in{" "}
          <strong>Nepali Rupees (NPR)</strong> and are inclusive of applicable
          taxes unless stated otherwise. Delivery charges are shown at checkout
          before you confirm your order.
        </p>
        <p>
          We reserve the right to change product prices at any time without
          prior notice. The price displayed at the time you place your order is
          the price you will be charged.
        </p>
        <p>
          Payment must be completed at checkout. Orders will not be processed or
          dispatched until payment is confirmed. We do not store payment card
          details on our servers.
        </p>
      </section>

      {/* 4 */}
      <section className="flex flex-col gap-4" id="delivery">
        <h3>4. Delivery</h3>
        <p>
          We deliver across Nepal. Estimated delivery times, areas of coverage,
          and delivery charges are outlined in our{" "}
          <a href="/shipping-policy" className="underline underline-offset-4">
            Shipping Policy
          </a>
          .
        </p>
        <p>
          Delivery times are estimates and may vary due to location, courier
          availability, public holidays, or circumstances beyond our control
          (such as extreme weather or road conditions).
        </p>
        <p>
          Once your order has been handed to our delivery partner, we are not
          liable for delays caused by the courier service. However, we will
          assist in resolving any delivery issues as best we can.
        </p>
      </section>

      {/* 5 */}
      <section className="flex flex-col gap-4" id="returns-refunds">
        <h3>5. Returns &amp; Refunds</h3>
        <p>
          Because we sell perishable food products, our returns and refunds
          policy is strict. Please read this section carefully before
          purchasing.
        </p>
        <p className="ml-8">
          1. Returns are <strong>not accepted</strong> for food products
          (Chhurpi, Khattu, Papaya) once delivered, unless the product arrives
          damaged, spoiled, or incorrect.
        </p>
        <p className="ml-8">
          2. If your order arrives damaged or incorrect, please contact us
          within <strong>24 hours</strong> of receiving it, with photo evidence.
        </p>
        <p className="ml-8">
          3. For Dog Chew products, returns are accepted only if the product is{" "}
          <strong>unopened</strong> and reported within 24 hours of delivery.
        </p>
        <p className="ml-8">
          4. Approved refunds will be processed within{" "}
          <strong>5–7 business days</strong> via the original payment method.
        </p>
        <label>
          ⚠️ All sales of food products are final once delivered, unless the
          product is defective, damaged, or incorrectly fulfilled. We do not
          accept returns for hygiene and food safety reasons.
        </label>
      </section>

      {/* 6 */}
      <section className="flex flex-col gap-4" id="product-disclaimers">
        <h3>6. Product Descriptions &amp; Disclaimers</h3>
        <p>
          We make every reasonable effort to ensure product descriptions,
          images, and details on our website are accurate. However, slight
          variations in appearance, colour, size, or texture may occur due to
          the natural variation of our handcrafted products, or due to device
          screen differences.
        </p>
        <h5>Dog Chew Products</h5>
        <p>
          Dog Chew products are intended for pets only and are not for human
          consumption. Always supervise your pet when using this product.
          Banstola Brothers is not liable for any harm or adverse effects caused
          by misuse or failure to supervise.
        </p>
        <h5>Food Allergens</h5>
        <p>
          All food products are made from natural ingredients. If you have food
          allergies or dietary requirements, please review all product
          ingredients carefully before purchasing. If in doubt, please contact
          us before placing an order.
        </p>
      </section>

      {/* 7 */}
      <section className="flex flex-col gap-4" id="intellectual-property">
        <h3>7. Intellectual Property</h3>
        <p>
          All content on this website — including text, images, logos, product
          photographs, brand names, and design elements — is the property of
          Banstola Brothers and is protected by applicable intellectual property
          laws.
        </p>
        <p>
          None of this content may be copied, reproduced, republished,
          distributed, or used in any form without prior written permission from
          Banstola Brothers.
        </p>
      </section>

      {/* 8 */}
      <section className="flex flex-col gap-4" id="liability">
        <h3>8. Limitation of Liability</h3>
        <p>
          To the fullest extent permitted by Nepali law, Banstola Brothers shall
          not be liable for any indirect, incidental, special, or consequential
          damages arising from the use of our products or website, including but
          not limited to loss of profits, data, or goodwill.
        </p>
        <p>
          Our total liability for any claim related to a specific order shall
          not exceed the total amount you paid for that order.
        </p>
      </section>

      {/* 9 */}
      <section className="flex flex-col gap-4" id="governing-law">
        <h3>9. Governing Law</h3>
        <p>
          These Terms &amp; Conditions are governed by and construed in
          accordance with the laws of <strong>Nepal</strong>. Any disputes
          arising from or relating to these terms shall be subject to the
          exclusive jurisdiction of the courts of Nepal.
        </p>
      </section>

      {/* 10 */}
      <section className="flex flex-col gap-4" id="changes">
        <h3>10. Changes to These Terms</h3>
        <p>
          We may update these Terms &amp; Conditions at any time. The latest
          version will always be available on this page with the effective date
          updated accordingly.
        </p>
        <p>
          Your continued use of our website after any changes are posted
          constitutes your acceptance of the updated Terms. We encourage you to
          review this page periodically.
        </p>
      </section>

      {/* 11 */}
      <section className="flex flex-col gap-4" id="contact">
        <h3>11. Contact Us</h3>
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
