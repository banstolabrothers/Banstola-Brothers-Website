// src/app/sitemap.ts
import { client } from "@/lib/sanity";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await client.fetch(
    `*[_type == "product"]{ slug, _updatedAt }`,
  );
  const categories = await client.fetch(
    `*[_type == "category"]{ slug, _updatedAt }`,
  );

  const productUrls = products.map((p: any) => ({
    url: `https://www.banstolabrothers.com.np/products/${p.slug.current}`,
    lastModified: new Date(p._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((c: any) => ({
    url: `https://www.banstolabrothers.com.np/category/${c.slug.current}`,
    lastModified: new Date(c._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: "https://www.banstolabrothers.com.np", priority: 1.0 },
    { url: "https://www.banstolabrothers.com.np/product", priority: 0.9 },
    { url: "https://www.banstolabrothers.com.np/about", priority: 0.6 },
    { url: "https://www.banstolabrothers.com.np/contact", priority: 0.6 },
    ...productUrls,
    ...categoryUrls,
  ];
}
