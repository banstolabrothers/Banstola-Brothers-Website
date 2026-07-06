import type { Metadata } from "next";

import { buildStaticPageMeta, pageMeta } from "@/lib/metadata";
import { client } from "@/lib/sanity";
import { productListQuery } from "@/lib/queries";
import ProductsClient from "@/components/products/ProductsClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMeta("products");
}

export const revalidate = 60;

export default async function ProductsPage() {
  const allProducts = await client.fetch(productListQuery);
  return <ProductsClient allProducts={allProducts} />;
}
