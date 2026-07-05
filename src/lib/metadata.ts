import type { Metadata } from "next";

// ── Site-wide constants ───────────────────────────────────────────────────────
const SITE_NAME = "Banstola Brothers";
const SITE_URL = "https://www.banstolabrothers.com.np";
const OG_IMAGE = "/og-image.png";

const DEFAULT_OG_IMAGE = [
  {
    url: OG_IMAGE,
    width: 1200,
    height: 630,
    alt: "Banstola Brothers | Authentic Chhurpi, Pokhara Nepal",
  },
];

// ── Helper: builds full metadata object ──────────────────────────────────────
const buildMeta = (
  title: string,
  description: string,
  path: string,
  keywords: string[] = [],
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
): Metadata => ({
  title,
  description,
  keywords,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}${path}`,
    type: "website",
    locale: "en_NP",
    siteName: SITE_NAME,
    images: ogImage,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage[0].url],
  },
  alternates: {
    canonical: `${SITE_URL}${path}`,
  },
  robots: noIndex
    ? { index: false, follow: false }
    : { index: true, follow: true },
});

// ─────────────────────────────────────────────────────────────────────────────
// NOTE ON KEYWORDS: the <meta name="keywords"> tag has had no effect on
// Google's ranking algorithm since ~2009 (Google has confirmed this
// directly). It's kept here because it's harmless and a couple of smaller
// engines/directories still read it, but it should never be treated as the
// lever that moves rankings. The keyword lists below were tightened based
// on real Google Search Console query data (as of Jul 2026) — notably,
// searchers use BOTH "chhurpi" and "churpi" (single h) roughly as often as
// each other, so both spellings are now represented across titles,
// descriptions, and keyword arrays rather than only the double-h spelling.
// The actual ranking lever is title + description + on-page content
// matching these terms naturally — not this array.
// ─────────────────────────────────────────────────────────────────────────────

export const pageMeta = {
  // ── Core pages ─────────────────────────────────────────────────────────────
  home: buildMeta(
    "Chhurpi & Titaura Since 1999 in Pokhara",
    "Pokhara's first churpi & paun shop, since 1999. Authentic chhurpi from Ilam, khattu, titaura (paun), amala & dog chew — 492+ verified reviews. Order across Nepal, including Kathmandu delivery.",
    "/",
    [
      "chhurpi Pokhara",
      "churpi Pokhara",
      "churpi shop Pokhara",
      "churpi near me",
      "chhurpi near me",
      "churpi shop near me",
      "dairy shop Pokhara",
      "dairy shop near me",
      "khattu Pokhara",
      "titaura Pokhara",
      "paun Pokhara",
      "titaura paun Pokhara",
      "amala Pokhara",
      "Nepali snacks Pokhara",
      "dog chew Nepal",
      "chhurpi Kathmandu",
      "churpi Kathmandu",
      "buy chhurpi Kathmandu",
      "chhurpi delivery Kathmandu",
      "khattu Kathmandu",
      "titaura Kathmandu",
      "paun Kathmandu",
      "Nepali snacks Kathmandu",
      "Banstola Brothers",
      "Banstola",
      "churpi paun",
      "Churpi paun Bhandar",
      "Bastola Churpi",
      "Bastola bhai ko Churpi paun bhandar",
      "paun bhandar",
      "ratna paun",
      "Ratnapark Paun ",
    ],
  ),

  products: buildMeta(
    "All Products",
    "Browse Chhurpi (Churpi), Khattu, Dog Chew and Papaya from Banstola Brothers – Pokhara, Nepal. Traditionally processed, 100% natural. Delivered to Kathmandu and across Nepal.",
    "/products",
    [
      "buy chhurpi Pokhara",
      "buy churpi Pokhara",
      "churpi online Nepal",
      "buy chhurpi Kathmandu",
      "chhurpi delivery Kathmandu",
      "churpi delivery Nepal",
      "Khattu Nepal",
      "Khattu Kathmandu",
      "Dog Chew Nepal",
      "Papaya snack Nepal",
      "Nepali traditional snacks",
      "Banstola Brothers products",
      "natural Nepali food online",
    ],
  ),

  story: buildMeta(
    "Our Story - Since 1999",
    "Pokhara's first Chhurpi & Pau shop, founded by Muktinath Banstola in the late 1990s. 25 years of authentic Himalayan taste.",
    "/story",
    [
      "Banstola Brothers history",
      "Chhurpi since 1999",
      "Pokhara first Chhurpi shop",
      "Muktinath Banstola",
      "Chhurpi from Ilam",
      "authentic Nepali food brand",
    ],
  ),

  store: buildMeta(
    "Find Our Store",
    "Visit Banstola Brothers in Pokhara, Nepal. Find our store location, opening hours, and get authentic chhurpi (churpi) near you.",
    "/store",
    [
      "Banstola Brothers Pokhara store",
      "chhurpi shop Pokhara",
      "churpi shop near me",
      "where to buy chhurpi Pokhara",
      "chhurpi store location Nepal",
    ],
  ),

  // NOTE: static fallback only — used if buildAllReviewsMeta()'s fetch fails,
  // or as a placeholder if you haven't wired up the dynamic version yet.
  // Deliberately has no specific review count baked in — see
  // buildAllReviewsMeta() below for the version with a real, computed count.
  allReviews: buildMeta(
    "Customer Reviews",
    "Verified customer reviews for Chhurpi, Khattu & Dog Chew from Banstola Brothers. See what customers love about our products.",
    "/all-reviews",
    [
      "Banstola Brothers reviews",
      "Chhurpi reviews Nepal",
      "Churpi reviews",
      "Khattu reviews",
      "Dog Chew reviews",
      "customer feedback Chhurpi",
    ],
  ),

  submitReview: buildMeta(
    "Write a Review",
    "Share your experience with Banstola Brothers products. Submit your review for Chhurpi, Khattu, Dog Chew and more.",
    "/submit-reviews",
    [
      "review Banstola Brothers",
      "submit Chhurpi review",
      "Banstola Brothers feedback",
    ],
  ),

  blogs: buildMeta(
    "Blog & Insights",
    "Explore articles, tips, and insights from the Banstola Brothers team — from chhurpi (churpi) traditions to Himalayan food culture.",
    "/blogs",
    [
      "Banstola Brothers blog",
      "Chhurpi articles",
      "Churpi articles",
      "Nepali food culture",
      "Himalayan cheese blog",
      "Chhurpi recipes",
    ],
  ),

  faqs: buildMeta(
    "Frequently Asked Questions",
    "Got questions about chhurpi (churpi), Khattu, Dog Chew or ordering from Banstola Brothers? Find answers to the most common questions here.",
    "/faqs",
    [
      "Banstola Brothers FAQ",
      "Chhurpi FAQ",
      "Churpi FAQ",
      "Khattu questions",
      "Dog Chew questions",
      "Banstola Brothers help",
      "Chhurpi shipping Nepal",
    ],
  ),

  // ── Legal pages ────────────────────────────────────────────────────────────
  // noIndex = true — legal pages should not appear in search results
  privacyPolicy: buildMeta(
    "Privacy Policy",
    "Read the Banstola Brothers Privacy Policy. Learn how we collect, use, and protect your personal data when you shop with us.",
    "/privacy-policy",
    ["Banstola Brothers privacy policy", "data protection Nepal"],
    DEFAULT_OG_IMAGE,
    true, // noIndex
  ),

  termsAndConditions: buildMeta(
    "Terms & Conditions",
    "Review the Terms and Conditions for using the Banstola Brothers website and purchasing our products.",
    "/terms-and-conditions",
    ["Banstola Brothers terms", "terms of service Nepal"],
    DEFAULT_OG_IMAGE,
    true, // noIndex
  ),

  shippingPolicy: buildMeta(
    "Shipping Policy",
    "Banstola Brothers shipping policy — delivery timelines, areas covered, and order handling for Chhurpi and other products.",
    "/shipping-policy",
    [
      "Banstola Brothers shipping",
      "Chhurpi delivery Nepal",
      "Pokhara delivery policy",
    ],
    DEFAULT_OG_IMAGE,
    true, // noIndex
  ),

  cookiesPolicy: buildMeta(
    "Cookies Policy",
    "Learn how Banstola Brothers uses cookies to improve your browsing experience on our website.",
    "/cookies-policy",
    ["Banstola Brothers cookies", "cookie policy Nepal"],
    DEFAULT_OG_IMAGE,
    true, // noIndex
  ),
} satisfies Record<string, Metadata>;

// ─────────────────────────────────────────────────────────────────────────────
// 2. DYNAMIC PRODUCT PAGE METADATA
//
//    Usage in app/products/[slug]/page.tsx:
//
//    import { buildProductMeta } from "@/lib/metadata";
//
//    export async function generateMetadata({ params }): Promise<Metadata> {
//      const product = await client.fetch(productBySlugQuery, { slug });
//      if (!product) return { title: "Product Not Found" };
//      return buildProductMeta(product, slug);
//    }
// ─────────────────────────────────────────────────────────────────────────────
interface SanityImageAsset {
  asset?: { url?: string };
}

export interface SanityProductMeta {
  title: string;
  shortDescription?: string;
  brand?: string;
  primaryImage?: SanityImageAsset;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    noIndex?: boolean;
    ogImage?: SanityImageAsset;
  };
}

// Product-specific keyword seeds — improves SEO for known products.
// Both "chhurpi" and "churpi" spellings included since real searchers use
// both (confirmed via Search Console — e.g. "churpi near me" ranks #1,
// "churpi" ranks #3, alongside "chhurpi Pokhara" terms).
// NOTE: these are only used as a fallback when a product's `seo.keywords`
// field is empty in Sanity — fill that in per-product in Studio for full
// control, this is just the safety net.
const PRODUCT_KEYWORD_SEEDS: Record<string, string[]> = {
  chhurpi: [
    "buy chhurpi Pokhara",
    "buy churpi Pokhara",
    "churpi near me",
    "chhurpi near me",
    "churpi shop near me",
    "Smoked Chhurpi Nepal",
    "White Chhurpi online",
    "Coffee Chhurpi",
    "hard cheese Nepal",
    "Chhurpi from Ilam",
    "authentic churpi",
    "chhurpi Kathmandu",
    "buy chhurpi Kathmandu",
    "chhurpi delivery Kathmandu",
    "Banstola Brothers Chhurpi",
  ],
  "dog-chew": [
    "Himalayan dog chew Nepal",
    "yak cheese dog chew",
    "chhurpi dog chew",
    "churpi dog chew",
    "natural dog chew Pokhara",
    "buy dog chew Nepal",
    "Banstola Brothers dog chew",
  ],
  khattu: [
    "Khattu Nepal",
    "buy Khattu Pokhara",
    "sour dried mango Nepal",
    "traditional Nepali snack",
    "Banstola Brothers Khattu",
  ],
  // NOTE: assumed slug "titaura" — your homepage copy mentions titaura/paun
  // and amala as products, but no product.ts slug was confirmed for these.
  // Update this key to match the real Sanity slug if it differs.
  titaura: [
    "titaura Pokhara",
    "paun Pokhara",
    "buy titaura Nepal",
    "titaura paun online",
    "khattu titaura",
    "titaura Kathmandu",
    "paun Kathmandu",
    "Nepali spicy candy",
    "lapsi titaura",
    "Banstola Brothers titaura",
  ],
  papaya: [
    "Papaya snack Nepal",
    "dried papaya Pokhara",
    "natural papaya Nepal",
    "Banstola Brothers Papaya",
  ],
};

export const buildProductMeta = (
  product: SanityProductMeta,
  slug: string,
): Metadata => {
  const title = product.seo?.metaTitle ?? product.title;

  const description =
    product.seo?.metaDescription ??
    product.shortDescription ??
    `Buy ${product.title} from Banstola Brothers. Authentic Nepali product from Pokhara, Nepal. 100% natural and traditionally processed.`;

  const keywords = product.seo?.keywords?.length
    ? product.seo.keywords
    : (PRODUCT_KEYWORD_SEEDS[slug] ?? [
        product.title,
        `${product.title} Nepal`,
        `${product.title} Pokhara`,
        `buy ${product.title}`,
        "Banstola Brothers",
        "authentic Nepali snacks",
        "buy Pokhara Nepal",
      ]);

  const imageUrl =
    product.seo?.ogImage?.asset?.url ??
    product.primaryImage?.asset?.url ??
    OG_IMAGE;

  const canonical = `${SITE_URL}/products/${slug}`;

  return {
    title,
    description,
    keywords,
    robots: product.seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: "en_NP",
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${product.title} | Banstola Brothers`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: { canonical },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. SANITY GROQ QUERY — PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
export const productMetaQuery = `
  *[_type == "product" && slug.current == $slug][0]{
    title,
    shortDescription,
    brand,
    "primaryImage": {
      "asset": { "url": primaryImage.asset->url }
    },
    seo {
      metaTitle,
      metaDescription,
      keywords,
      noIndex,
      "ogImage": {
        "asset": { "url": ogImage.asset->url }
      }
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// 4. DYNAMIC BLOG PAGE METADATA
//
//    Usage in app/blogs/[slug]/page.tsx:
//
//    import { buildBlogMeta } from "@/lib/metadata";
//
//    export async function generateMetadata({ params }): Promise<Metadata> {
//      const blog = await client.fetch(blogMetaQuery, { slug });
//      if (!blog) return { title: "Blog Not Found" };
//      return buildBlogMeta(blog, slug);
//    }
// ─────────────────────────────────────────────────────────────────────────────
export interface SanityBlogMeta {
  title: string;
  shortDescription?: string;
  publishedAt?: string;
  author?: string;
  primaryImage?: SanityImageAsset;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    noIndex?: boolean;
    ogImage?: SanityImageAsset;
  };
}

// Fallback keyword seeds by topic, matched against a blog's slug the same
// way PRODUCT_KEYWORD_SEEDS works for products. This only fires when a
// blog post's own `seo.keywords` field is empty in Sanity — always prefer
// filling that in per-post, since it can be far more specific than a
// generic topic match. See section 6 below for suggested first posts to
// write, since /blogs currently has zero published posts.
const BLOG_KEYWORD_SEEDS: Record<string, string[]> = {
  "what-is-chhurpi": [
    "what is chhurpi",
    "what is churpi",
    "chhurpi meaning",
    "Nepali hard cheese",
    "yak cheese Nepal",
    "chhurpi vs churpi",
  ],
  "how-to-eat-chhurpi": [
    "how to eat chhurpi",
    "how to eat churpi",
    "chhurpi recipe",
    "churpi snack ideas",
    "chewing chhurpi",
  ],
  "chhurpi-vs-khattu": [
    "chhurpi vs khattu",
    "churpi vs khattu",
    "Nepali snack comparison",
    "khattu meaning",
  ],
  "where-to-buy-chhurpi-pokhara": [
    "where to buy chhurpi Pokhara",
    "where to buy churpi Pokhara",
    "chhurpi shop near me",
    "churpi shop near me",
    "dairy shop Pokhara",
  ],
  "order-chhurpi-kathmandu": [
    "buy chhurpi Kathmandu",
    "churpi Kathmandu",
    "chhurpi delivery Kathmandu",
    "order churpi online Nepal",
    "khattu Kathmandu",
  ],
  "what-is-paun": [
    "what is paun Nepal",
    "paun titaura meaning",
    "paun vs titaura",
    "Nepali paun snack",
    "titaura Nepal Bhasa",
  ],
  "chhurpi-for-dogs": [
    "chhurpi dog chew",
    "churpi dog chew",
    "is chhurpi safe for dogs",
    "Himalayan dog chew",
    "natural dog treats Nepal",
  ],
  "history-of-chhurpi-ilam": [
    "chhurpi from Ilam",
    "chhurpi history Nepal",
    "traditional Himalayan cheese",
    "Ilam dairy tradition",
  ],
};

export const buildBlogMeta = (blog: SanityBlogMeta, slug: string): Metadata => {
  const title = blog.seo?.metaTitle ?? blog.title;

  const description =
    blog.seo?.metaDescription ??
    blog.shortDescription ??
    `${blog.title} — Read the latest from Banstola Brothers.`;

  const keywords = blog.seo?.keywords?.length
    ? blog.seo.keywords
    : (BLOG_KEYWORD_SEEDS[slug] ?? [
        blog.title,
        "Banstola Brothers blog",
        "chhurpi articles",
        "churpi articles",
        "Nepali food culture",
        "Himalayan cheese",
      ]);

  const imageUrl =
    blog.seo?.ogImage?.asset?.url ?? blog.primaryImage?.asset?.url ?? OG_IMAGE;

  const canonical = `${SITE_URL}/blogs/${slug}`;

  return {
    title,
    description,
    keywords,
    robots: blog.seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      locale: "en_NP",
      siteName: SITE_NAME,
      ...(blog.publishedAt && { publishedTime: blog.publishedAt }),
      ...(blog.author && { authors: [blog.author] }),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: { canonical },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SANITY GROQ QUERY — BLOGS
// ─────────────────────────────────────────────────────────────────────────────
export const blogMetaQuery = `
  *[_type == "blog" && slug.current == $slug][0]{
    title,
    shortDescription,
    publishedAt,
    "author": author->name,
    "primaryImage": {
      "asset": { "url": primaryImage.asset->url }
    },
    seo {
      metaTitle,
      metaDescription,
      keywords,
      noIndex,
      "ogImage": {
        "asset": { "url": ogImage.asset->url }
      }
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// 6. SUGGESTED FIRST BLOG POSTS (as of Jul 2026 — /blogs has 0 posts live)
// ─────────────────────────────────────────────────────────────────────────────
//
// These slugs match BLOG_KEYWORD_SEEDS above, and are picked based on real
// Search Console queries already hitting the site with no dedicated content
// to answer them (churpi/dairy/"near me" terms getting impressions but
// ranking poorly, positions 8-11) plus themes visible in your own customer
// reviews (softness, smokiness, dog chew popularity, Ilam sourcing story).
//
//   1. "what-is-chhurpi"               — explainer for people who've never
//                                         heard of it; capture informational
//                                         searches, both spellings.
//   2. "chhurpi-vs-khattu"             — comparison content, easy to rank
//                                         for since little competition.
//   3. "where-to-buy-chhurpi-pokhara"  — directly targets "near me" /
//                                         "dairy shop near me" impressions
//                                         you're already getting but not
//                                         ranking well for.
//   4. "chhurpi-for-dogs"              — reviews already mention dogs
//                                         loving the dog chew; own this
//                                         angle with a dedicated post.
//   5. "history-of-chhurpi-ilam"       — ties into your Story page and
//                                         founding narrative, good for
//                                         brand + "chhurpi from Ilam" terms.
//   6. "order-chhurpi-kathmandu"       — Kathmandu is Nepal's chhurpi trade/
//                                         export hub even though production
//                                         is in the eastern hills, so there's
//                                         real buyer intent there for online
//                                         ordering/delivery — targets that
//                                         without falsely implying a
//                                         Kathmandu storefront.
//   7. "what-is-paun"                  — your own tagline already says
//                                         "chhurpi & paun shop" but nothing
//                                         on-site explains that "paun" is
//                                         the Nepal Bhasa name for titaura
//                                         (the sweet-sour-spicy dried fruit
//                                         candy — lapsi, mango, lemon) —
//                                         a completely different snack
//                                         category from chhurpi (dairy).
//                                         Worth a short explainer post so
//                                         first-time visitors aren't
//                                         confused by the combined name.
//
// Add these as real posts in Sanity Studio with slugs matching the keys
// above (or update BLOG_KEYWORD_SEEDS to match whatever slugs you use) —
// then buildBlogMeta() will automatically pick up the right keyword seed
// per post if you leave `seo.keywords` empty in Studio.
