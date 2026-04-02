import { client } from "@/lib/sanity";
import { blogListQuery, allTagsQuery } from "@/lib/blogQueries";
import { blogListMeta } from "@/lib/blogMetadata";
import BlogsClient from "@/components/blogs/BlogsClient";
import type { BlogCard, Tag } from "@/types/blog";
import type { Metadata } from "next";

export const metadata: Metadata = blogListMeta;

export default async function BlogsPage() {
  const [blogs, tags] = await Promise.all([
    client.fetch<BlogCard[]>(blogListQuery),
    client.fetch<Tag[]>(allTagsQuery),
  ]);

  return <BlogsClient blogs={blogs} tags={tags} />;
}
