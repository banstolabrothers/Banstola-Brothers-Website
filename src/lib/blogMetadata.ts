import type { Metadata } from "next";
import type { BlogDetail } from "@/types/blog";

const BASE_URL = "https://www.banstolabrothers.com.np";

export function buildBlogMeta(blog: BlogDetail, slug: string): Metadata {
  const title = blog.seo?.metaTitle ?? `${blog.title} | Banstola Brothers`;
  const description = blog.seo?.metaDescription ?? blog.shortDescription;
  const imageUrl =
    blog.seo?.ogImage?.asset?.url ?? blog.primaryImage?.asset?.url ?? "";
  const canonical = `${BASE_URL}/blogs/${slug}`;

  return {
    title,
    description,
    keywords: blog.seo?.keywords ?? [],
    alternates: { canonical },
    robots: blog.seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: blog.publishedAt,
      authors: [blog.author],
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: blog.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export const blogListMeta: Metadata = {
  title: "Blog | Banstola Brothers",
  description:
    "Explore our latest articles, tips, and insights from the Banstola Brothers team.",
  alternates: { canonical: `${BASE_URL}/blogs` },
  openGraph: {
    title: "Blog | Banstola Brothers",
    description: "Explore our latest articles, tips, and insights.",
    url: `${BASE_URL}/blogs`,
    type: "website",
  },
};
