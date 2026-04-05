"use client";

import Image from "next/image";
import Link from "next/link";
import BlogContentSection from "@/components/blogs/BlogContentSection";
import BlogCard from "@/components/blogs/BlogCard";
import MyButton from "@/components/ui/MyButton";
import type { BlogDetail, BlogCard as BlogCardType } from "@/types/blog";

interface Props {
  blog: BlogDetail | null;
  slug: string;
  relatedBlogs: BlogCardType[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogDetailClient({ blog, relatedBlogs }: Props) {
  if (!blog) {
    return (
      <div className="flex flex-col justify-center items-center min-h-96 gap-4">
        <div className="text-lg text-red-600">Blog not found</div>
        <MyButton type="primarybutton" text="Back to Blogs" link="/blogs" />
      </div>
    );
  }

  const imageUrl = blog.primaryImage?.asset?.url;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 ">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className=" pt-16 pb-0">
        {/* Breadcrumb */}
        <p className="flex items-center gap-2  text-brand-900/65 mb-8">
          <Link href="/" className="hover:text-brand-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/blogs"
            className="hover:text-brand-900 transition-colors"
          >
            Blogs
          </Link>
          <span>/</span>
          <span className="text-brand-900 line-clamp-1">{blog.title}</span>
        </p>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <label className="flex flex-wrap gap-2 mb-5">
            {blog.tags.map((tag) => (
              <Link
                key={tag._id}
                href={`/blogs?tag=${tag.slug}`}
                className="px-3 py-1.5 rounded-full border-2 border-brand-900/20 bg-brand-100 text-brand-900 transition-colors  opacity-60 hover:opacity-100"
              >
                {tag.name}
              </Link>
            ))}
          </label>
        )}

        {/* Title */}
        <h1 className="text-brand-900 mb-6 w-full">{blog.title}</h1>

        {/* Meta */}
        <label className="flex flex-wrap items-center gap-2 text-brand-900">
          <span>By {blog.author}</span>
          {blog.category && (
            <>
              <span>·</span>
              <span className="capitalize">{blog.category.title}</span>
            </>
          )}
          {blog.publishedAt && (
            <>
              <span>·</span>
              <time dateTime={blog.publishedAt}>
                {formatDate(blog.publishedAt)}
              </time>
            </>
          )}
        </label>

        {/* Hero Image */}
        {/* {imageUrl && (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src={imageUrl}
              alt={blog.primaryImage?.alt ?? blog.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )} */}
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {(blog.content?.length ?? 0) > 0 && (
        <BlogContentSection content={blog.content!} />
      )}

      {/* ── Related Blogs ─────────────────────────────────────────────────── */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 border-t border-neutral-100">
          <div className=" mx-auto px-4">
            <h2 className="text-2xl font-bold text-brand-900 mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedBlogs.map((b) => (
                <BlogCard key={b._id} blog={b} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
