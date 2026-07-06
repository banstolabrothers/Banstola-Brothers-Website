import type { Metadata } from "next";

import { Suspense } from "react";
import { client } from "@/lib/sanity";
import BlogsClient from "@/components/blogs/BlogsClient";
import type { BlogCard, Tag } from "@/types/blog";
import { blogListQuery, allTagsQuery } from "@/lib/queries";

import { buildStaticPageMeta } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildStaticPageMeta("blogs");
}
export const revalidate = 60;

export default async function BlogsPage() {
  console.log("[BlogsPage] Starting fetch...");

  let blogs: BlogCard[] = [];
  let tags: Tag[] = [];

  try {
    const results = await Promise.all([
      client.fetch<BlogCard[]>(blogListQuery),
      client.fetch<Tag[]>(allTagsQuery),
    ]);
    blogs = results[0];
    tags = results[1];

    console.log("[BlogsPage] Fetch succeeded");
    console.log("[BlogsPage] blogs count:", blogs?.length);
    console.log("[BlogsPage] tags count:", tags?.length);
    console.log(
      "[BlogsPage] first blog sample:",
      JSON.stringify(blogs?.[0], null, 2),
    );
  } catch (err) {
    console.error("[BlogsPage] FETCH FAILED:", err);
    // Re-throw so Next shows the real error instead of hanging
    throw err;
  }

  return (
    <Suspense fallback={null}>
      <BlogsClient blogs={blogs} tags={tags} />
    </Suspense>
  );
}
