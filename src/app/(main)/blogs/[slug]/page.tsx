import { client } from "@/lib/sanity";
import {
  blogBySlugQuery,
  blogSlugsQuery,
  relatedBlogsQuery,
} from "@/lib/queries";
import { buildBlogMeta, blogMetaQuery } from "@/lib/metadata";
import { BlogArticleSchema, BreadcrumbSchema } from "@/lib/schema";
import BlogDetailClient from "@/components/blogs/BlogDetailClient";
import type { BlogDetail, BlogCard } from "@/types/blog";
import type { Metadata } from "next";

const BASE_URL = "https://www.banstolabrothers.com.np";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await client.fetch<BlogDetail | null>(blogBySlugQuery, { slug });
  if (!blog) return { title: "Blog Not Found" };
  return buildBlogMeta(blog, slug);
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(blogSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await client.fetch<BlogDetail | null>(blogBySlugQuery, { slug });

  // Fetch related blogs (same category or shared tags)
  let relatedBlogs: BlogCard[] = [];
  if (blog) {
    const tagSlugs = blog.tags?.map((t) => t.slug) ?? [];
    relatedBlogs = await client.fetch<BlogCard[]>(relatedBlogsQuery, {
      slug,
      categorySlug: blog.category?.slug ?? "",
      tagSlugs,
    });
  }

  return (
    <>
      {blog && (
        <>
          <BlogArticleSchema blog={blog} slug={slug} />
          <BreadcrumbSchema
            items={[
              { name: "Home", url: BASE_URL },
              { name: "Blogs", url: `${BASE_URL}/blogs` },
              { name: blog.title, url: `${BASE_URL}/blogs/${slug}` },
            ]}
          />
        </>
      )}
      <BlogDetailClient blog={blog} slug={slug} relatedBlogs={relatedBlogs} />
    </>
  );
}
