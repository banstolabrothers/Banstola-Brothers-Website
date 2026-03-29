// lib/schema.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Centralised JSON-LD schema components.
// All schema components are pure Server Components — zero client JS shipped.
//
// Usage:
//   import { LocalBusinessSchema, ProductSchema } from "@/lib/schema";
//
//   // In page.tsx (server component)
//   <LocalBusinessSchema />
//   <ProductSchema product={sanityProduct} reviews={sanityReviews} />
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────

/** Shape of a product document coming out of Sanity */
export interface SanityProduct {
  name: string;
  slug: string; // e.g. "chhurpi"
  description?: string;
  image?: string; // resolved Sanity CDN URL
  price?: {
    min: number;
    max: number;
    currency?: string; // default "NPR"
  };
  /** Pass the full aggregateRating block if you store it in Sanity */
  aggregateRating?: {
    ratingValue: number; // e.g. 5
    reviewCount: number; // e.g. 258
  };
}

/** Shape of a single review coming out of Sanity */
export interface SanityReview {
  author: string;
  rating: number; // 1–5
  body: string;
  datePublished?: string; // ISO 8601 e.g. "2024-11-15"
}

// ── 1. LocalBusiness ─────────────────────────────────────────────────────────
// Place once in app/page.tsx (homepage). Do NOT repeat on every page.

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.banstolabrothers.com.np/#business",

    name: "Banstola Brothers",
    alternateName: "Banstola Brothers Chhurpi & Khattu",
    description:
      "Pokhara's original Chhurpi and Khattu shop, founded in 1999 by Muktinath Banstola. Authentic Himalayan Chhurpi sourced from Illam, Khattu, natural Dog Chew, and Papaya snacks — available in-store and delivered across Nepal.",

    url: "https://www.banstolabrothers.com.np",
    logo: "https://www.banstolabrothers.com.np/og-image.png",
    image: "https://www.banstolabrothers.com.np/og-image.png",

    foundingDate: "1999",
    founder: {
      "@type": "Person",
      name: "Muktinath Banstola",
    },

    address: {
      "@type": "PostalAddress",
      streetAddress: "Tersapatti Road, Opposite Pokhara Central Oasis",
      addressLocality: "Pokhara",
      postalCode: "33700",
      addressRegion: "Gandaki Province",
      addressCountry: "NP",
    },

    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.2259,
      longitude: 83.985,
    },

    hasMap:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14061.556005867795!2d83.98500705!3d28.225870399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595eb31663f9f%3A0xeb2b74dd8de8beea!2sBanstola%20Brothers!5e0!3m2!1sen!2snp",

    telephone: "+977-9856041086", // ← add your phone number e.g. "+977-61-123456"
    email: "banstolabrothers@gmail.com", // ← add contact email if available

    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },

    priceRange: "NRs 150 – NRs 800",
    currenciesAccepted: "NPR",
    paymentAccepted: "Cash, eSewa, Khalti", // ← update if needed

    areaServed: {
      "@type": "Country",
      name: "Nepal",
    },

    sameAs: [
      "https://www.instagram.com/banstolabrothers/",
      "https://www.facebook.com/banstolabrothers/",
      "https://www.tiktok.com/@banstolabrothers",
    ],

    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Banstola Brothers Products",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Chhurpi",
            url: "https://www.banstolabrothers.com.np/products/chhurpi",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Dog Chew",
            url: "https://www.banstolabrothers.com.np/products/dog-chew",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Khattu",
            url: "https://www.banstolabrothers.com.np/products/khattu",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Papaya Snack",
            url: "https://www.banstolabrothers.com.np/products/papaya",
          },
        },
      ],
    },

    // Aggregate across all products — update reviewCount as it grows
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      reviewCount: "258",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 2. ProductSchema ──────────────────────────────────────────────────────────
// Place on each individual product page (app/products/[slug]/page.tsx).
// Pass the product data from Sanity + the reviews array for that product.
//
// Example usage in a product page:
//
//   const product = await sanityFetch<SanityProduct>({ ... });
//   const reviews = await sanityFetch<SanityReview[]>({ ... });
//
//   return (
//     <>
//       <ProductSchema product={product} reviews={reviews} />
//       <YourProductUI ... />
//     </>
//   );

interface ProductSchemaProps {
  product: Product;
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const slug = product.slug?.current ?? "";
  const productUrl = `https://www.banstolabrothers.com.np/products/${slug}`;
  const rd = product.reviewData;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription ?? product.metaDescription ?? "",
    image: product.primaryImage?.asset?.url ?? "",
    url: productUrl,
    sku: product.sku ?? product._id,
    brand: {
      "@type": "Brand",
      name: product.brand ?? "Banstola Brothers",
    },
    // Build offers from variant groups
    offers: product.variantGroups?.flatMap((group) =>
      group.options
        .filter((o) => o.price)
        .map((option) => ({
          "@type": "Offer",
          priceCurrency: option.currency ?? "NPR",
          price: option.price,
          availability: option.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: productUrl,
          sku: `${product._id}-${option.optionName}`,
          seller: {
            "@type": "LocalBusiness",
            "@id": "https://www.banstolabrothers.com.np/#business",
            name: "Banstola Brothers",
          },
        })),
    ),
  };

  // ✅ aggregateRating — only added when real data exists
  if (rd && rd.totalReviews > 0 && rd.averageRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(rd.averageRating.toFixed(1)),
      bestRating: 5,
      worstRating: 1,
      reviewCount: rd.totalReviews,
    };

    // ✅ Individual reviews (Google uses up to ~5)
    if (rd.reviews?.length > 0) {
      schema.review = rd.reviews.slice(0, 10).map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.username },
        reviewBody: r.description ?? "",
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        ...(r.reviewDate ? { datePublished: r.reviewDate } : {}),
      }));
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 3. BreadcrumbSchema ───────────────────────────────────────────────────────
// Adds breadcrumb rich results — helps Google understand your site structure.
// Place on product pages alongside ProductSchema.
//
// Example:
//   <BreadcrumbSchema
//     items={[
//       { name: "Home", url: "https://www.banstolabrothers.com.np" },
//       { name: "Products", url: "https://www.banstolabrothers.com.np/products" },
//       { name: "Chhurpi", url: "https://www.banstolabrothers.com.np/products/chhurpi" },
//     ]}
//   />

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
