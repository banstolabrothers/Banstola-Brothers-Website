import type { Metadata } from "next";
import type { BlogDetail } from "@/types/blog";

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
  robots: { index: true, follow: true },
});

// ─────────────────────────────────────────────────────────────────────────────
// 1. STATIC PAGE METADATA
//
//    Usage:
//    import { pageMeta } from "@/lib/metadata";
//    export const metadata = pageMeta.home;
// ─────────────────────────────────────────────────────────────────────────────
export const pageMeta = {
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
    "Our Story – Since 1999",
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
    "Find Our Store in Pokhara",
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
    "262+ verified customer reviews for Chhurpi, Khattu & Dog Chew from Banstola Brothers. See what customers love about our products.",
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

  // ── Blog list page (static) ───────────────────────────────────────────────
  blogs: buildMeta(
    "Blog",
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
} satisfies Record<string, Metadata>;

// ─────────────────────────────────────────────────────────────────────────────
// 2. DYNAMIC PRODUCT PAGE METADATA
//
//    Usage in app/products/[slug]/page.tsx:
//
//    import { buildProductMeta, productMetaQuery } from "@/lib/metadata";
//
//    export async function generateMetadata({ params }): Promise<Metadata> {
//      const product = await client.fetch(productMetaQuery, { slug: params.slug });
//      if (!product) return {};
//      return buildProductMeta(product, params.slug);
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

export const buildProductMeta = (
  product: SanityProductMeta,
  slug: string,
): Metadata => {
  const title = product.seo?.metaTitle ?? product.title;

  const description =
    product.seo?.metaDescription ??
    product.shortDescription ??
    `Buy ${product.title} from Banstola Brothers. Authentic Nepali product from Pokhara.`;

  const keywords = product.seo?.keywords?.length
    ? product.seo.keywords
    : [
        product.title,
        `${product.title} Nepal`,
        `${product.title} Pokhara`,
        `buy ${product.title}`,
        "Banstola Brothers",
        "authentic Nepali snacks",
        "buy Pokhara Nepal",
      ];

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
//    import { buildBlogMeta, blogMetaQuery } from "@/lib/metadata";
//
//    export async function generateMetadata({ params }): Promise<Metadata> {
//      const blog = await client.fetch(blogMetaQuery, { slug: params.slug });
//      if (!blog) return { title: "Blog Not Found" };
//      return buildBlogMeta(blog, params.slug);
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
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }]
        : [DEFAULT_OG_IMAGE[0]],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl || OG_IMAGE],
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
