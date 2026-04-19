import type { Product } from "@/types/product";
import type { BlogDetail } from "@/types/blog";

// lib/schema.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Centralised JSON-LD schema components.
// All schema components are pure Server Components — zero client JS shipped.
//
// Usage:
//   import { LocalBusinessSchema, ProductSchema, BreadcrumbSchema } from "@/lib/schema";
//   import { BlogArticleSchema } from "@/lib/schema";
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "https://www.banstolabrothers.com.np";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SanityProduct {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  price?: {
    min: number;
    max: number;
    currency?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export interface SanityReview {
  author: string;
  rating: number;
  body: string;
  datePublished?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

// ── 1. LocalBusiness ─────────────────────────────────────────────────────────

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#business`,

    name: "Banstola Brothers",
    alternateName: "Banstola Brothers Chhurpi & Khattu",
    description:
      "Pokhara's original Chhurpi and Khattu shop, founded in 1999 by Muktinath Banstola. Authentic Himalayan Chhurpi sourced from Ilam, Khattu, natural Dog Chew, and Papaya snacks — available in-store and delivered across Nepal.",

    url: BASE_URL,
    logo: `${BASE_URL}/og-image.png`,
    image: `${BASE_URL}/og-image.png`,

    foundingDate: "1999",
    founder: {
      "@type": "Person",
      name: "Muktinath Banstola",
    },

    address: {
      "@type": "PostalAddress",
      streetAddress: "Tersapatti Rd, Pokhara 33700",
      addressLocality: "Pokhara",
      postalCode: "33700",
      addressRegion: "Gandaki Province",
      addressCountry: "NP",
    },

    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.2285494,
      longitude: 83.9885977,
    },

    hasMap:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14061.556005867795!2d83.98500705!3d28.225870399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595eb31663f9f%3A0xeb2b74dd8de8beea!2sBanstola%20Brothers!5e0!3m2!1sen!2snp",

    telephone: ["+977-9856041086", "+977-9806512036"],
    whatsapp_number: "+977-9846054755",
    email: "banstolabrothers@gmail.com",

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

    brand: "Banstola Brothers",

    priceRange: "NPR 100 – NPR 2000",
    currenciesAccepted: "NPR",
    paymentAccepted: "Cash, eSewa, Khalti, Online Banking",

    areaServed: {
      "@type": "Country",
      name: "Nepal",
    },

    sameAs: [
      "https://www.instagram.com/banstolabrothers/",
      "https://www.facebook.com/banstolabrothers/",
      "https://www.tiktok.com/@banstolabrothers",
      "https://www.x.com/banstolabrother",
      "https://www.youtube.com/@banstolabrothers",
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
            url: `${BASE_URL}/products/chhurpi`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Dog Chew",
            url: `${BASE_URL}/products/dog-chew`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Khattu",
            url: `${BASE_URL}/products/khattu`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Papaya Snack",
            url: `${BASE_URL}/products/papaya`,
          },
        },
      ],
    },

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

interface ProductSchemaProps {
  product: Product;
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const slug = product.slug?.current ?? "";
  const productUrl = `${BASE_URL}/products/${slug}`;
  const rd = product.reviewData;

  const totalReviews = rd?.totalReviews ?? 0;
  const avgRating =
    totalReviews > 0 && rd?.ratingSum ? rd.ratingSum / totalReviews : 5;

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

    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "NPR",
      availability: "https://schema.org/InStoreOnly",
      seller: {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#business`,
        name: "Banstola Brothers",
      },
    },

    // schema.tsx — update this
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
      reviewCount: "262", // ← was 258, site shows 262+
    },

    review:
      rd?.reviews && rd.reviews.length > 0
        ? rd.reviews.slice(0, 10).map((r) => ({
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
          }))
        : [
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Syan S." },
              reviewBody: "Very soft and chewy churpi. Best must try.",
              reviewRating: {
                "@type": "Rating",
                ratingValue: 5,
                bestRating: 5,
                worstRating: 1,
              },
            },
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Sneha L." },
              reviewBody: "Super delicious.",
              reviewRating: {
                "@type": "Rating",
                ratingValue: 5,
                bestRating: 5,
                worstRating: 1,
              },
            },
          ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── 3. BreadcrumbSchema ───────────────────────────────────────────────────────
// Shared by both product and blog pages.

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

// ── 4. BlogArticleSchema ──────────────────────────────────────────────────────
// Place on each blog detail page (app/blogs/[slug]/page.tsx).
//
// Usage:
//   import { BlogArticleSchema, BreadcrumbSchema } from "@/lib/schema";
//
//   <BlogArticleSchema blog={blog} slug={slug} />
//   <BreadcrumbSchema
//     items={[
//       { name: "Home",  url: BASE_URL },
//       { name: "Blogs", url: `${BASE_URL}/blogs` },
//       { name: blog.title, url: `${BASE_URL}/blogs/${slug}` },
//     ]}
//   />

interface BlogSchemaProps {
  blog: BlogDetail;
  slug: string;
}

export function BlogArticleSchema({ blog, slug }: BlogSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.shortDescription,
    image: blog.primaryImage?.asset?.url ?? "",
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Banstola Brothers",
      url: BASE_URL,
    },
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blogs/${slug}`,
    },
    keywords: blog.tags?.map((t) => t.name).join(", ") ?? "",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
