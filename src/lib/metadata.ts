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
// 1. STATIC PAGE METADATA
// ─────────────────────────────────────────────────────────────────────────────
export const pageMeta = {
  // ── Core pages ─────────────────────────────────────────────────────────────
  home: buildMeta(
    "Original Chhurpi Since 1999",
    "Buy authentic handcrafted Chhurpi from Banstola Brothers. Smoked, White & Coffee Chhurpi sourced from Ilam, Dolakha & Palpa. Shop in Pokhara since 1999.",
    "/",
    [
      "Chhurpi Pokhara",
      "Banstola Brothers",
      "Smoked Chhurpi",
      "White Chhurpi",
      "Coffee Chhurpi",
      "Nepali hard cheese",
      "Chhurpi from Ilam",
      "traditional Nepali cheese",
      "Chhurpi online Nepal",
      "buy Chhurpi Pokhara",
    ],
  ),

  products: buildMeta(
    "All Products",
    "Browse Chhurpi, Khattu, Dog Chew and Papaya from Banstola Brothers – Pokhara, Nepal. Traditionally processed, 100% natural.",
    "/products",
    [
      "Chhurpi buy Pokhara",
      "Khattu Nepal",
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
    "Visit Banstola Brothers in Pokhara, Nepal. Find our store location, opening hours, and get authentic Chhurpi near you.",
    "/store",
    [
      "Banstola Brothers Pokhara store",
      "Chhurpi shop Pokhara",
      "where to buy Chhurpi Pokhara",
      "Chhurpi store location Nepal",
    ],
  ),

  allReviews: buildMeta(
    "Customer Reviews",
    "267+ verified customer reviews for Chhurpi, Khattu & Dog Chew from Banstola Brothers. See what customers love about our products.",
    "/all-reviews",
    [
      "Banstola Brothers reviews",
      "Chhurpi reviews Nepal",
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
    "Explore articles, tips, and insights from the Banstola Brothers team — from Chhurpi traditions to Himalayan food culture.",
    "/blogs",
    [
      "Banstola Brothers blog",
      "Chhurpi articles",
      "Nepali food culture",
      "Himalayan cheese blog",
      "Chhurpi recipes",
    ],
  ),

  faqs: buildMeta(
    "Frequently Asked Questions",
    "Got questions about Chhurpi, Khattu, Dog Chew or ordering from Banstola Brothers? Find answers to the most common questions here.",
    "/faqs",
    [
      "Banstola Brothers FAQ",
      "Chhurpi FAQ",
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

// Product-specific keyword seeds — improves SEO for known products
const PRODUCT_KEYWORD_SEEDS: Record<string, string[]> = {
  chhurpi: [
    "buy Chhurpi Pokhara",
    "Smoked Chhurpi Nepal",
    "White Chhurpi online",
    "Coffee Chhurpi",
    "hard cheese Nepal",
    "Chhurpi from Ilam",
    "authentic Chhurpi",
    "Banstola Brothers Chhurpi",
  ],
  "dog-chew": [
    "Himalayan dog chew Nepal",
    "yak cheese dog chew",
    "natural dog chew Pokhara",
    "Chhurpi dog treat",
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

export const buildBlogMeta = (blog: SanityBlogMeta, slug: string): Metadata => {
  const title = blog.seo?.metaTitle ?? blog.title;

  const description =
    blog.seo?.metaDescription ??
    blog.shortDescription ??
    `${blog.title} — Read the latest from Banstola Brothers.`;

  const keywords = blog.seo?.keywords?.length
    ? blog.seo.keywords
    : [
        blog.title,
        "Banstola Brothers blog",
        "Chhurpi articles",
        "Nepali food culture",
        "Himalayan cheese",
      ];

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
// 6. USAGE REFERENCE
// ─────────────────────────────────────────────────────────────────────────────
//
// app/page.tsx                    → export const metadata = pageMeta.home;
// app/products/page.tsx           → export const metadata = pageMeta.products;
// app/story/page.tsx              → export const metadata = pageMeta.story;
// app/store/page.tsx              → export const metadata = pageMeta.store;
// app/all-reviews/page.tsx        → export const metadata = pageMeta.allReviews;
// app/submit-reviews/page.tsx     → export const metadata = pageMeta.submitReview;
// app/blogs/page.tsx              → export const metadata = pageMeta.blogs;
// app/faqs/page.tsx               → export const metadata = pageMeta.faqs;
// app/privacy-policy/page.tsx     → export const metadata = pageMeta.privacyPolicy;
// app/terms-and-conditions/page.tsx → export const metadata = pageMeta.termsAndConditions;
// app/shipping-policy/page.tsx    → export const metadata = pageMeta.shippingPolicy;
// app/cookies-policy/page.tsx     → export const metadata = pageMeta.cookiesPolicy;
//
// app/products/[slug]/page.tsx    → export async function generateMetadata({ params }) {
//                                     const product = await client.fetch(...);
//                                     return buildProductMeta(product, slug);
//                                   }
//
// app/blogs/[slug]/page.tsx       → export async function generateMetadata({ params }) {
//                                     const blog = await client.fetch(...);
//                                     return buildBlogMeta(blog, slug);
//                                   }
