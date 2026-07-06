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

// ── Helper: strips an accidental "| Banstola Brothers" suffix from a title ──
// The root layout's `title.template` ("%s | Banstola Brothers") already
// appends the brand name to every page automatically. If a title coming
// from Sanity (or this file) already ends with the brand name — usually
// because someone typed it into a metaTitle field in Studio without
// realizing the template does this for them — the rendered title doubles
// up ("Chhurpi | Banstola Brothers | Banstola Brothers"). This strips that
// trailing brand suffix (in a few common separator styles) so the template
// is always the only thing adding it.
const stripBrandSuffix = (title: string): string =>
  title.replace(/\s*[|\-–—]\s*Banstola Brothers\s*$/i, "").trim();

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

interface SanityImageAsset {
  asset?: { url?: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. STATIC PAGE METADATA — hardcoded fallback only.
//
//    As of this update, the real content for these pages lives in Sanity
//    `pageMeta` documents (see schemaTypes/pageMeta.ts + schemaTypes/seo.ts)
//    and is fetched via buildStaticPageMeta() below. This object is what
//    renders ONLY if that fetch fails or a page's Sanity doc doesn't exist
//    yet — so keyword lists here are intentionally kept short, not the full
//    SEO-tuned lists (those live in Studio now, where they can be edited
//    without a redeploy).
// ─────────────────────────────────────────────────────────────────────────────
export const pageMeta = {
  home: buildMeta(
    "Chhurpi & Titaura since 1999 in Pokhara",
    "Pokhara's first churpi & paun shop, since 1999. Chhurpi from Ilam, paun from Kathmandu, plus khattu, amala & dog chew — 492+ verified reviews. Order across Nepal.",
    "/",
    [
      "chhurpi Pokhara",
      "churpi Pokhara",
      "Banstola Brothers",
      "churpi near me",
    ],
  ),

  products: buildMeta(
    "All Products",
    "Browse Chhurpi (Churpi), Khattu, Dog Chew and Papaya from Banstola Brothers – Pokhara, Nepal. Traditionally processed, 100% natural. Delivered to Kathmandu and across Nepal.",
    "/products",
    [
      "buy chhurpi Pokhara",
      "Khattu Nepal",
      "Dog Chew Nepal",
      "Banstola Brothers products",
    ],
  ),

  story: buildMeta(
    "Our Story - Since 1999",
    "Pokhara's first Chhurpi & Pau shop, founded by Muktinath Banstola in the late 1990s. 25 years of authentic Himalayan taste.",
    "/story",
    ["Banstola Brothers history", "Chhurpi since 1999", "Muktinath Banstola"],
  ),

  store: buildMeta(
    "Find Our Store",
    "Visit Banstola Brothers in Pokhara, Nepal. Find our store location, opening hours, and get authentic chhurpi (churpi) near you.",
    "/store",
    [
      "Banstola Brothers Pokhara store",
      "chhurpi shop Pokhara",
      "churpi shop near me",
    ],
  ),

  // NOTE: static fallback only — used if buildAllReviewsMeta()'s fetch fails,
  // or as a placeholder if you haven't wired up the dynamic version yet.
  allReviews: buildMeta(
    "Customer Reviews",
    "Verified customer reviews for Chhurpi, Khattu & Dog Chew from Banstola Brothers. See what customers love about our products.",
    "/all-reviews",
    ["Banstola Brothers reviews", "Chhurpi reviews Nepal", "Khattu reviews"],
  ),

  submitReview: buildMeta(
    "Write a Review",
    "Share your experience with Banstola Brothers products. Submit your review for Chhurpi, Khattu, Dog Chew and more.",
    "/submit-reviews",
    ["review Banstola Brothers", "submit Chhurpi review"],
  ),

  blogs: buildMeta(
    "Blog & Insights",
    "Explore articles, tips, and insights from the Banstola Brothers team — from chhurpi (churpi) traditions to Himalayan food culture.",
    "/blogs",
    ["Banstola Brothers blog", "Chhurpi articles", "Nepali food culture"],
  ),

  faqs: buildMeta(
    "Frequently Asked Questions",
    "Got questions about chhurpi (churpi), Khattu, Dog Chew or ordering from Banstola Brothers? Find answers to the most common questions here.",
    "/faqs",
    ["Banstola Brothers FAQ", "Chhurpi FAQ", "Khattu questions"],
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
    ["Banstola Brothers shipping", "Chhurpi delivery Nepal"],
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
// 1b. STATIC PAGE METADATA — LIVE FROM SANITY
//
//    Fetches the pageMeta{ page, seo{...} } document for a given static
//    page and merges it, field by field, over the hardcoded fallback above.
//    If a field is left empty in Studio, that one field falls back — not
//    the whole page. If the fetch throws entirely, the full static
//    fallback is returned so metadata never breaks the build.
//
//    Usage in app/faqs/page.tsx:
//
//    import { buildStaticPageMeta } from "@/lib/metadata";
//
//    export async function generateMetadata(): Promise<Metadata> {
//      return buildStaticPageMeta("faqs");
//    }
// ─────────────────────────────────────────────────────────────────────────────
export const pageMetaQuery = `
  *[_type == "pageMeta" && page == $page][0]{
    seo {
      metaTitle,
      metaDescription,
      keywords,
      noIndex,
      "ogImage": { "asset": { "url": ogImage.asset->url } }
    }
  }
`;

interface SanityPageSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImage?: SanityImageAsset;
}

export async function buildStaticPageMeta(
  page: keyof typeof pageMeta,
): Promise<Metadata> {
  const fallback = pageMeta[page];
  const path = `${fallback.alternates?.canonical}`.replace(SITE_URL, "");

  try {
    // Lazy imports — same pattern as buildAllReviewsMeta below — so pages
    // that don't call this function don't pull the Sanity client in.
    const { client } = await import("@/lib/sanity");
    const doc = await client.fetch<{ seo?: SanityPageSeo } | null>(
      pageMetaQuery,
      { page },
    );
    if (!doc?.seo) return fallback;

    return buildMeta(
      stripBrandSuffix(doc.seo.metaTitle ?? (fallback.title as string)),
      doc.seo.metaDescription ?? (fallback.description as string),
      path,
      doc.seo.keywords?.length
        ? doc.seo.keywords
        : (fallback.keywords as string[]),
      doc.seo.ogImage?.asset?.url
        ? [
            {
              url: doc.seo.ogImage.asset.url,
              width: 1200,
              height: 630,
              alt: fallback.title as string,
            },
          ]
        : DEFAULT_OG_IMAGE,
      doc.seo.noIndex ?? false,
    );
  } catch {
    return fallback;
  }
}

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

// Product-specific keyword seeds — fallback only, used when a product's
// `seo.keywords` field is empty in Sanity. Fill that in per-product in
// Studio for full control.
const PRODUCT_KEYWORD_SEEDS: Record<string, string[]> = {
  chhurpi: [
    "buy chhurpi Pokhara",
    "buy churpi Pokhara",
    "churpi near me",
    "Chhurpi from Ilam",
    "chhurpi Kathmandu",
    "Banstola Brothers Chhurpi",
  ],
  "dog-chew": [
    "Himalayan dog chew Nepal",
    "chhurpi dog chew",
    "natural dog chew Pokhara",
    "Banstola Brothers dog chew",
  ],
  khattu: [
    "Khattu Nepal",
    "buy Khattu Pokhara",
    "traditional Nepali snack",
    "Banstola Brothers Khattu",
  ],
  // NOTE: no /products/titaura page exists yet (confirmed via live site
  // footer, Jul 2026) — this seed is inert until that page is created.
  titaura: [
    "titaura Pokhara",
    "paun Pokhara",
    "paun from Kathmandu",
    "Banstola Brothers titaura",
  ],
  papaya: [
    "Papaya snack Nepal",
    "dried papaya Pokhara",
    "Banstola Brothers Papaya",
  ],
};

export const buildProductMeta = (
  product: SanityProductMeta,
  slug: string,
): Metadata => {
  const title = stripBrandSuffix(product.seo?.metaTitle ?? product.title);

  const description =
    product.seo?.metaDescription ??
    product.shortDescription ??
    `Buy ${product.title} from Banstola Brothers. Authentic Nepali product from Pokhara, Nepal. 100% natural and traditionally processed.`;

  const keywords = product.seo?.keywords?.length
    ? product.seo.keywords
    : (PRODUCT_KEYWORD_SEEDS[slug] ?? [
        product.title,
        `${product.title} Nepal`,
        `buy ${product.title}`,
        "Banstola Brothers",
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

// Fallback keyword seeds by topic slug — only fires when a blog post's own
// `seo.keywords` field is empty in Sanity.
const BLOG_KEYWORD_SEEDS: Record<string, string[]> = {
  "what-is-chhurpi": ["what is chhurpi", "what is churpi", "chhurpi meaning"],
  "how-to-eat-chhurpi": ["how to eat chhurpi", "chhurpi recipe"],
  "chhurpi-vs-khattu": ["chhurpi vs khattu", "Nepali snack comparison"],
  "where-to-buy-chhurpi-pokhara": [
    "where to buy chhurpi Pokhara",
    "chhurpi shop near me",
  ],
  "order-chhurpi-kathmandu": [
    "buy chhurpi Kathmandu",
    "chhurpi delivery Kathmandu",
  ],
  "what-is-paun": ["what is paun Nepal", "paun vs titaura"],
  "chhurpi-for-dogs": ["chhurpi dog chew", "is chhurpi safe for dogs"],
  "history-of-chhurpi-ilam": ["chhurpi from Ilam", "chhurpi history Nepal"],
};

export const buildBlogMeta = (blog: SanityBlogMeta, slug: string): Metadata => {
  const title = stripBrandSuffix(blog.seo?.metaTitle ?? blog.title);

  const description =
    blog.seo?.metaDescription ??
    blog.shortDescription ??
    `${blog.title} — Read the latest from Banstola Brothers.`;

  const keywords = blog.seo?.keywords?.length
    ? blog.seo.keywords
    : (BLOG_KEYWORD_SEEDS[slug] ?? [
        blog.title,
        "Banstola Brothers blog",
        "Nepali food culture",
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
  *[_type == "blogs" && slug.current == $slug][0]{
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
// 6. DYNAMIC "ALL REVIEWS" PAGE METADATA
//
//    Computes the real review count server-side instead of hardcoding one.
//
//    Usage in app/all-reviews/page.tsx:
//
//    import { buildAllReviewsMeta } from "@/lib/metadata";
//
//    export async function generateMetadata(): Promise<Metadata> {
//      return buildAllReviewsMeta();
//    }
// ─────────────────────────────────────────────────────────────────────────────
export const buildAllReviewsMeta = async (): Promise<Metadata> => {
  const path = "/all-reviews";
  const keywords = [
    "Banstola Brothers reviews",
    "Chhurpi reviews Nepal",
    "Khattu reviews",
    "Dog Chew reviews",
  ];

  let totalReviews = 0;
  try {
    const { client } = await import("@/lib/sanity");
    const { allReviewsQuery } = await import("@/lib/queries");
    const docs = await client.fetch<{ reviews?: unknown[] }[]>(allReviewsQuery);
    totalReviews = docs.reduce((sum, d) => sum + (d.reviews?.length ?? 0), 0);
  } catch {
    totalReviews = 0; // fail safe — fall back to a count-free description below
  }

  const title = "Customer Reviews";
  const description =
    totalReviews > 0
      ? `${totalReviews}+ verified customer reviews for Chhurpi, Khattu & Dog Chew from Banstola Brothers. See what customers love about our products.`
      : "Verified customer reviews for Chhurpi, Khattu & Dog Chew from Banstola Brothers. See what customers love about our products.";

  return buildMeta(title, description, path, keywords);
};
