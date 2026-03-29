import type { Metadata } from "next";
import IntroSection from "@/components/home/IntroSection";
import HistorySection from "@/components/home/HistorySection";
import ProductByCategory from "@/components/products/ProductByCategory";
import HomeReviewSection from "@/components/home/HomeReviewSection";
import FollowUsSection from "@/components/home/FollowUsSection";

import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta.home;

// ── LocalBusiness JSON-LD ─────────────────────────────────────────────────────
function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.banstolabrothers.com.np/#business",
    name: "Banstola Brothers",
    description:
      "Authentic Nepali Chhurpi shop in Pokhara offering traditionally processed hard cheese from Ilam, Dolakha, and Palpa. Available in Smoked, Non-Smoked White, and Coffee varieties.",
    url: "https://www.banstolabrothers.com.np",
    foundingDate: "1999",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pokhara",
      addressRegion: "Gandaki Province",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.2259,
      longitude: 83.985,
    },
    openingHours: "Mo-Su 09:00-18:00",
    priceRange: "NRs 150 – NRs 800",
    image: "https://www.banstolabrothers.com.np/og-image.jpg",
    sameAs: [
      "https://www.instagram.com/banstolabrothers/",
      "https://www.facebook.com/banstolabrothers/",
      "https://www.tiktok.com/@banstolabrothers",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Chhurpi Products",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Product", name: "Smoked Chhurpi" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Product", name: "Non-Smoked White Chhurpi" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Product", name: "Coffee Chhurpi" },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
// ✅ Server Component — all data fetching happens inside child server components
export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />

      <section>
        {/* Hero / Intro */}
        <IntroSection />

        {/* Brand history */}
        <HistorySection />

        {/* Product categories — fetches from Sanity server-side */}
        <ProductByCategory />

        {/* Reviews carousel — server fetches, client animates */}
        <HomeReviewSection />

        {/* Instagram feed — server fetches, client scrolls */}
        <FollowUsSection />

        {/* Google Map */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14061.556005867795!2d83.98500705!3d28.225870399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595eb31663f9f%3A0xeb2b74dd8de8beea!2sBanstola%20Brothers!5e0!3m2!1sen!2snp!4v1751128652987!5m2!1sen!2snp"
          width="100%"
          height="820"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Google Map showing Banstola Brothers location in Pokhara"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
