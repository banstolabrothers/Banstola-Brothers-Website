import LegalLayout, { Section } from "@/components/ui/LegalLayout";
import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta.shippingPolicy;

const sections: Section[] = [
  { id: "delivery-areas", label: "1. Delivery Areas" },
  { id: "delivery-times", label: "2. Estimated Delivery Times" },
  { id: "shipping-charges", label: "3. Shipping Charges" },
  { id: "order-processing", label: "4. Order Processing" },
  { id: "tracking", label: "5. Tracking Your Order" },
  { id: "damaged-orders", label: "6. Damaged or Missing Orders" },
  { id: "failed-delivery", label: "7. Failed Deliveries" },
  { id: "food-handling", label: "8. Special Handling — Food Products" },
  { id: "contact", label: "9. Contact Us" },
];

export default function ShippingPolicy() {
  return (
    <LegalLayout
      title="Shipping Policy"
      lastUpdated="April 10, 2026"
      sections={sections}
    >
      <p>
        We want your Chhurpi, Khattu, and other products to reach you fresh and
        on time. Here is everything you need to know about how we handle
        shipping and delivery across Nepal.
      </p>

      {/* 1 */}
      <section id="delivery-areas" className="flex flex-col gap-4">
        <h3>1. Delivery Areas</h3>
        <p>
          We deliver to locations across <strong>Nepal</strong> through our
          courier partner,{" "}
          <a
            href="https://pickndropnepal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Pick & Drop Nepal
          </a>
          , a trusted logistics provider serving e-commerce businesses
          nationwide — covering major cities, towns, and many remote and hill
          areas.
        </p>
        <p>
          If you are unsure whether we deliver to your specific location, please
          reach out to us on Instagram{" "}
          <a
            href="https://instagram.com/banstolabrothers"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            @banstolabrothers
          </a>{" "}
          before placing your order and we will confirm availability.
        </p>
      </section>

      {/* 2 */}
      <section id="delivery-times" className="flex flex-col gap-4">
        <h3>2. Estimated Delivery Times</h3>
        <p>
          Delivery times vary depending on your location. Actual delivery may
          vary due to courier capacity, public holidays, extreme weather, or
          other factors beyond our control.
        </p>
      </section>

      {/* 3 */}
      <section id="shipping-charges" className="flex flex-col gap-4">
        <h3>3. Shipping Charges</h3>
        <p>
          Shipping charges are calculated at the time of placing the order and
          you will be your order amount.
        </p>
        <p>Total Amount = Product Charge + Shipping Charge</p>
      </section>

      {/* 4 */}
      <section id="order-processing" className="flex flex-col gap-4">
        <h3>4. Order Processing</h3>
        <p>
          Orders are typically processed within <strong>1 business day</strong>{" "}
          of order confirmed then handed over to Pick & Drop Nepal for dispatch.
          Orders placed on weekends or public holidays in Nepal will be
          processed on the next available business day.
        </p>
        <p>
          You will receive an order confirmation via SMS shortly once your order
          has been handed over to Pick & Drop Nepal.
        </p>
        <p>
          Please double-check your delivery address and contact number before
          confirming your order. We are unable to modify delivery details once
          an order has been dispatched.
        </p>
      </section>

      {/* 5 */}
      <section id="tracking" className="flex flex-col gap-4">
        <h3>5. Tracking Your Order</h3>
        <p>
          Once your order is dispatched, Pick & Drop Nepal provides real-time
          order tracking. We will share your tracking details via SMS so you can
          follow your delivery every step of the way.
        </p>
        <p>
          You can also track your parcel directly on the{" "}
          <a
            href="https://pickndropnepal.com/tracking"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Pick & Drop Nepal tracking page
          </a>{" "}
          using the tracking number we provide.
        </p>
        <p>
          If you have not received your order within the expected window, or if
          your tracking shows an unexpected status, please contact us and we
          will follow up with Pick & Drop Nepal on your behalf.
        </p>
      </section>

      {/* 6 */}
      <section id="damaged-orders" className="flex flex-col gap-4">
        <h3>6. Damaged or Missing Orders</h3>
        <p>
          If your order arrives damaged, spoiled, or with items missing, please
          take the following steps:
        </p>
        <p>
          1. Contact us within <strong>24 hours</strong> of receiving the
          depvery.
        </p>
        <p>
          2. Provide your order number and clear <strong>photo evidence</strong>{" "}
          of the damaged or missing items.
        </p>
        <p>
          3. Include the product name(s) affected so we can resolve the issue
          quickly.
        </p>
        <p>
          We will review your case with Pick & Drop Nepal and work to resolve it
          as quickly as possible — this may result in a replacement shipment or
          a full or partial refund.
        </p>
      </section>

      {/* 7 */}
      <section id="failed-delivery" className="flex flex-col gap-4">
        <h3>7. Failed Deliveries</h3>
        <p>
          If a delivery attempt by Pick & Drop Nepal fails because you were
          unavailable, unreachable, or provided an incorrect address, their team
          may attempt redelivery or hold the package at a local pickup point for
          a limited time.
        </p>
        <p>
          If the package is returned to us due to a failed delivery caused by an
          incorrect or incomplete address, any re-shipping costs will be charged
          to the customer before the order is re-dispatched.
        </p>
        <p>
          Banstola Brothers is not liable for failed deliveries resulting from
          inaccurate delivery information provided at checkout.
        </p>
      </section>

      {/* 8 */}
      <section id="food-handling" className="flex flex-col gap-4">
        <h3>8. Special Handling — Food Products</h3>
        <p>
          Our food products are natural, handcrafted products with no artificial
          preservatives. They are carefully packaged to maintain freshness
          during transit with Pick & Drop Nepal. To ensure the best experience,
          we recommend:
        </p>
        <p>
          1. Storing products in a cool, dry place immediately upon receipt.
        </p>
        <p>2. Checking the best-before or packaging date before consuming.</p>
        <p>3. Soft Chhurpi must be keft in dry area after opening.</p>
        <p>
          If you have any questions about storage or shelf life for a specific
          product, feel free to reach out before placing your order.
        </p>
      </section>

      {/* 9 */}
      <section className="flex flex-col gap-4" id="contact">
        <h3>9. Contact Us</h3>
        <section className="contact-box">
          <p>
            If you have any questions or concerns about your shipment or this
            Shipping Policy, please reach out to us directly.
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
          <p style={{ marginTop: 16 }}>
            For parcel tracking queries, visit{" "}
            <a
              className="underline underline-offset-2"
              href="https://pickndropnepal.com/tracking"
              target="_blank"
              rel="noopener noreferrer"
            >
              pickndropnepal.com/tracking
            </a>
            .
          </p>
        </section>
      </section>
    </LegalLayout>
  );
}
