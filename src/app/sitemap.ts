import { client } from "@/lib/sanity";
import { blogSlugsQuery, productSlugsQuery } from "@/lib/queries"; // adjust if needed
import type { MetadataRoute } from "next";

const BASE_URL = "https://www.banstolabrothers.com.np";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, blogSlugs] = await Promise.all([
    client.fetch<{ slug: string }[]>(
      `*[_type == "product"]{ "slug": slug.current }`,
    ),
    client.fetch<{ slug: string }[]>(blogSlugsQuery),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "monthly" },
    { url: `${BASE_URL}/products`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/blogs`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/story`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/store`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE_URL}/faqs`, priority: 0.7, changeFrequency: "monthly" },
    {
      url: `${BASE_URL}/all-reviews`,
      priority: 0.6,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/submit-reviews`,
      priority: 0.5,
      changeFrequency: "yearly",
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      priority: 0.4,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      priority: 0.4,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/cookies-policy`,
      priority: 0.4,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      priority: 0.4,
      changeFrequency: "monthly",
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/products/${slug}`,
    priority: 0.85,
    changeFrequency: "monthly",
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map(({ slug }) => ({
    url: `${BASE_URL}/blogs/${slug}`,
    priority: 0.75,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
