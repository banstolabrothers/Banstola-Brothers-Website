import { Suspense } from "react"; // 👈
import { client } from "@/lib/sanity";
import BlogsClient from "@/components/blogs/BlogsClient";
import type { BlogCard, Tag } from "@/types/blog";
import { blogListQuery, allTagsQuery } from "@/lib/queries";
import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta.blogs;

export default async function BlogsPage() {
  const [blogs, tags] = await Promise.all([
    client.fetch<BlogCard[]>(blogListQuery),
    client.fetch<Tag[]>(allTagsQuery),
  ]);

  return (
    <Suspense fallback={null}>
      {" "}
      {/* 👈 */}
      <BlogsClient blogs={blogs} tags={tags} />
    </Suspense>
  );
}
