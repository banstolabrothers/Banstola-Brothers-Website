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

// Site-wide aggregate rating stats — must be computed from REAL review data,
// never hardcoded. Pass this in from a server component that has fetched all
// reviews (see notes at bottom of file for the query + computation).
export interface SiteAggregateStats {
  totalReviews: number;
  averageRating: number; // already rounded, e.g. 4.8
}

// ── 1. LocalBusiness ─────────────────────────────────────────────────────────

interface LocalBusinessSchemaProps {
  aggregateStats?: SiteAggregateStats | null;
}

export function LocalBusinessSchema({
  aggregateStats,
}: LocalBusinessSchemaProps = {}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#business`,

    name: "Banstola Brothers",
    alternateName: "Banstola Brothers Chhurpi & Khattu",
    description:
      "Pokhara's original Chhurpi and Khattu shop, founded in 1999 by Muktinath Banstola. Authentic Himalayan Chhurpi sourced from Ilam, Khattu, natural Dog Chew, and Papaya snacks — available in-store and delivered across Nepal. Open Sunday–Friday, 8 AM–7 PM. Saturday visits welcome by calling ahead.",

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
      latitude: 28.2258704,
      longitude: 83.985007,
    },

    hasMap:
      "https://www.google.com/maps/place/Banstola+Brothers/@28.2261435,83.9852819,15.07z/data=!4m6!3m5!1s0x399595eb31663f9f:0xeb2b74dd8de8beea!8m2!3d28.2285359!4d83.9886343!16s%2Fg%2F11f796kqw7?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",

    telephone: ["+977-9856041086", "+977-9806512036"],
    whatsapp_number: "+977-9846054755",
    email: "banstolabrothers@gmail.com",

    // Real hours: Sunday–Friday fixed hours. Saturday (Nepal's official
    // weekend day) is open by call/as-needed rather than fixed hours, so
    // it's deliberately left out of openingHoursSpecification rather than
    // listing a false commitment — schema.org has no clean "by appointment"
    // value, and an inaccurate Saturday entry would just trade one wrong
    // number for another. Saturday availability is instead noted in the
    // plain-text description below, which customers/Google can read as
    // context without it being treated as a strict hours claim.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "19:00",
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

    // NOTE: itemOffered entries intentionally omit "@type": "Product".
    // These are lightweight menu-style references on the LocalBusiness
    // entity, not standalone product rich-result candidates. Tagging them
    // as "@type": "Product" makes Google's Rich Results Test validate each
    // one as a full Product entity, which then fails with "Either offers,
    // review, or aggregateRating should be specified" since these stubs
    // only carry name/url. The real, fully-detailed Product markup (with
    // offers/aggregateRating/review) lives in ProductSchema on each
    // individual product page — that's what Google actually uses for
    // product rich results. Leaving @type off here just stops these
    // catalog stubs from being double-validated as incomplete products.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Banstola Brothers Products",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            name: "Chhurpi",
            url: `${BASE_URL}/products/chhurpi`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            name: "Dog Chew",
            url: `${BASE_URL}/products/dog-chew`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            name: "Khattu",
            url: `${BASE_URL}/products/khattu`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            name: "Papaya Snack",
            url: `${BASE_URL}/products/papaya`,
          },
        },
      ],
    },
  };

  // Only attach aggregateRating if we have REAL, computed stats.
  // Never hardcode a rating/count here — Google's structured data policy
  // requires this to match what's actually verifiable on/around the site,
  // and mismatches risk a manual action that suppresses rich results sitewide.
  if (aggregateStats && aggregateStats.totalReviews > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateStats.averageRating,
      bestRating: 5,
      worstRating: 1,
      reviewCount: aggregateStats.totalReviews,
    };
  }

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
    totalReviews > 0 && rd?.ratingSum
      ? Math.round((rd.ratingSum / totalReviews) * 10) / 10 // round to 1 decimal
      : null;

  // Price is optional. If variant pricing exists, use the lowest in-stock
  // option's price as a representative "starting from" figure. If no price
  // data exists yet, `offers` is still valid without a `price` field —
  // schema.org doesn't require it, so we simply omit it rather than
  // guessing or hardcoding a number.
  const inStockPrices =
    product.variantGroups
      ?.flatMap((g) => g.options ?? [])
      .filter((o) => o.inStock && typeof o.price === "number")
      .map((o) => o.price as number) ?? [];
  const lowestPrice =
    inStockPrices.length > 0 ? Math.min(...inStockPrices) : undefined;

  const offers: Record<string, unknown> = {
    "@type": "Offer",
    url: productUrl,
    priceCurrency: "NPR",
    availability: "https://schema.org/InStoreOnly",
    seller: {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#business`,
      name: "Banstola Brothers",
    },
  };
  if (lowestPrice !== undefined) {
    offers.price = lowestPrice;
  }

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

    // Always present — this alone satisfies Google's requirement that at
    // least one of offers/review/aggregateRating exists, even for brand
    // new products that have zero reviews yet. `price` inside is optional.
    offers,
  };

  // Only include aggregateRating/review when there is at least one REAL
  // review for this product. No fabricated fallback reviews — injecting
  // reviews into structured data that don't exist on the visible page is
  // exactly the kind of mismatch Google's spam policies penalize.
  if (totalReviews > 0 && avgRating !== null && rd?.reviews?.length) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      bestRating: 5,
      worstRating: 1,
      reviewCount: totalReviews,
    };

    schema.review = rd.reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.username || "Anonymous" },
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

// ── 5. FAQSchema ───────────────────────────────────────────────────────────────
// Use on /faqs, and optionally as a mini-FAQ block on product/blog pages.
//
// IMPORTANT: only pass questions that are ACTUALLY visible as text on the
// same page. Google's structured data guidelines require FAQPage markup to
// match visible content — marking up questions that aren't shown on the
// page is treated as spam and can trigger a manual action.
//
// Usage:
//   import { FAQSchema } from "@/lib/schema";
//
//   <FAQSchema
//     faqs={[
//       {
//         question: "Where can I buy chhurpi in Pokhara?",
//         answer: "Banstola Brothers, Pokhara's first chhurpi and paun shop ...",
//       },
//       // ...
//     ]}
//   />

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. WIRING NOTES — how to feed LocalBusinessSchema real data
// ─────────────────────────────────────────────────────────────────────────────
//
// LocalBusinessSchema now takes an optional `aggregateStats` prop instead of
// a hardcoded rating. Compute it once, server-side, wherever LocalBusinessSchema
// is rendered (likely app/layout.tsx or app/page.tsx), using data you already
// have query infrastructure for:
//
//   import { client } from "@/lib/sanity";
//   import { allReviewsQuery } from "@/lib/queries";
//   import { LocalBusinessSchema, type SiteAggregateStats } from "@/lib/schema";
//
//   async function getSiteAggregateStats(): Promise<SiteAggregateStats | null> {
//     const docs = await client.fetch(allReviewsQuery); // reviews[]{ rating, ... } per product
//     const ratings = docs.flatMap((d: any) =>
//       (d.reviews ?? []).map((r: any) => r.rating).filter(Boolean)
//     );
//     if (ratings.length === 0) return null;
//     const sum = ratings.reduce((s: number, r: number) => s + r, 0);
//     return {
//       totalReviews: ratings.length,
//       averageRating: Math.round((sum / ratings.length) * 10) / 10,
//     };
//   }
//
//   // in the server component:
//   const aggregateStats = await getSiteAggregateStats();
//   <LocalBusinessSchema aggregateStats={aggregateStats} />
//
// This mirrors exactly the same math already used client-side in
// lib/reviewUtils.ts (calculateRatingStats) — no new logic, just applied
// server-side and fed into structured data instead of being hand-typed.
