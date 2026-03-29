import { client } from "@/lib/sanity";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: { slug: { current: string }; _updatedAt: string }[] = [];

  try {
    products = await client.fetch(`*[_type == "product"]{ slug, _updatedAt }`);
  } catch (error) {
    console.error("Sitemap: failed to fetch products", error);
  }

  return [
    {
      url: "https://www.banstolabrothers.com.np",
      priority: 1.0,
      changeFrequency: "weekly",
    },
    {
      url: "https://www.banstolabrothers.com.np/products",
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: "https://www.banstolabrothers.com.np/story",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: "https://www.banstolabrothers.com.np/store",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      url: "https://www.banstolabrothers.com.np/all-reviews",
      priority: 0.6,
      changeFrequency: "weekly",
    },
    ...products.map((p) => ({
      url: `https://www.banstolabrothers.com.np/products/${p.slug.current}`,
      lastModified: new Date(p._updatedAt),
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
  ];
}
