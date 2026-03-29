// ✅ No 'use client' — Server Component
// generateMetadata + data fetch both run on the server

import { client } from "@/lib/sanity";
import { productBySlugQuery, productDetailQuery } from "@/lib/queries";
import { buildProductMeta } from "@/lib/metadata";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import type { Metadata } from "next";
import type { Product } from "@/types/product";

interface Props {
  params: Promise<{ slug: string }>;
}

// ✅ generateMetadata must be in a Server Component
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch(productBySlugQuery, { slug });
  if (!product) return { title: "Product Not Found" };
  return buildProductMeta(product, slug);
}

// ✅ Pre-build all product pages at deploy time
export async function generateStaticParams() {
  const products = await client.fetch(`*[_type == "product"]{ slug }`);
  return products.map((p: { slug: { current: string } }) => ({
    slug: p.slug.current,
  }));
}

// ✅ Fetch product data on the server — no useEffect needed
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await client.fetch<Product | null>(productDetailQuery, {
    slug,
  });

  // Pass data down to the client component
  return <ProductDetailClient product={product} slug={slug} />;
}
