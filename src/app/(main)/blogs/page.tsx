import type { Metadata } from "next";

import { client } from "@/lib/sanity";
import BlogsClient from "@/components/blogs/BlogsClient";
import type { BlogCard } from "@/types/blogs";
import { blogListQuery } from "@/lib/queries";

import { buildStaticPageMeta } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMeta("blogs");
}
export const revalidate = 60;

export default async function BlogsPage() {
  const blogs = await client.fetch<BlogCard[]>(blogListQuery);

  return <BlogsClient blogs={blogs} />;
}
