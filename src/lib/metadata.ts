import type { Metadata } from "next";

// ── Site-wide defaults ────────────────────────────────────────────────────────
const SITE_NAME = "Banstola Brothers";
const SITE_URL = "https://www.banstolabrothers.com.np";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const DEFAULT_OG_IMAGE = [
  {
    url: OG_IMAGE,
    width: 1200,
    height: 630,
    alt: "Banstola Brothers – Authentic Chhurpi, Pokhara Nepal",
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
//    Usage: import { pageMeta } from '@/lib/metadata'
//           export const metadata = pageMeta.home
// ─────────────────────────────────────────────────────────────────────────────
export const pageMeta = {
  home: buildMeta(
    "Banstola Brothers | Authentic Chhurpi – Pokhara Nepal",
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
    ],
  ),

  products: buildMeta(
    "All Products | Banstola Brothers",
    "Browse Chhurpi, Khattu, Dog Chew and more from Banstola Brothers – Pokhara, Nepal. Traditionally processed, 100% natural.",
    "/products",
    [
      "Chhurpi buy Pokhara",
      "Khattu Nepal",
      "Dog Chew Nepal",
      "Nepali traditional snacks",
      "Banstola Brothers products",
    ],
  ),

  story: buildMeta(
    "Our Story – Since 1999 | Banstola Brothers",
    "Pokhara's first Chhurpi & Pau shop, founded by Muktinath Banstola in the late 1990s. 25 years of authentic Himalayan taste.",
    "/story",
    [
      "Banstola Brothers history",
      "Chhurpi since 1999",
      "Pokhara first Chhurpi shop",
      "Muktinath Banstola",
      "Chhurpi from Ilam",
    ],
  ),

  store: buildMeta(
    "Find Our Store in Pokhara | Banstola Brothers",
    "Visit Banstola Brothers in Pokhara, Nepal. Find our store location, opening hours, and get authentic Chhurpi near you.",
    "/store",
    [
      "Banstola Brothers Pokhara store",
      "Chhurpi shop Pokhara",
      "where to buy Chhurpi Pokhara",
    ],
  ),

  allReviews: buildMeta(
    "Customer Reviews | Banstola Brothers",
    "258+ verified customer reviews for Chhurpi, Khattu & Dog Chew from Banstola Brothers. See what customers love about our products.",
    "/all-reviews",
    [
      "Banstola Brothers reviews",
      "Chhurpi reviews Nepal",
      "Khattu reviews",
      "customer feedback Chhurpi",
    ],
  ),

  submitReview: buildMeta(
    "Write a Review | Banstola Brothers",
    "Share your experience with Banstola Brothers products. Submit your review for Chhurpi, Khattu, Dog Chew and more.",
    "/submit-reviews",
    [],
  ),
} satisfies Record<string, Metadata>;

// ─────────────────────────────────────────────────────────────────────────────
// 2. DYNAMIC PRODUCT PAGE METADATA
//    Usage: import { buildProductMeta } from '@/lib/metadata'
//           export async function generateMetadata({ params }) {
//             const product = await client.fetch(...)
//             return buildProductMeta(product, slug)
//           }
// ─────────────────────────────────────────────────────────────────────────────
interface SanityImage {
  asset?: { url?: string };
}

interface SanityProduct {
  title: string;
  shortDescription?: string;
  brand?: string;
  primaryImage?: SanityImage;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    noIndex?: boolean;
    ogImage?: SanityImage;
  };
}

export const buildProductMeta = (
  product: SanityProduct,
  slug: string,
): Metadata => {
  const title = product.seo?.metaTitle ?? `${product.title} | ${SITE_NAME}`;
  const description =
    product.seo?.metaDescription ??
    product.shortDescription ??
    `Buy ${product.title} from Banstola Brothers. Authentic Nepali product from Pokhara.`;
  const keywords = product.seo?.keywords ?? [
    product.title,
    "Banstola Brothers",
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
    robots: product.seo?.noIndex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.title }],
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
