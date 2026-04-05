"use client";

import Image from "next/image";
import Link from "next/link";
import BlogContentSection from "@/components/blogs/BlogContentSection";
import MyButton from "@/components/ui/MyButton";
import type { BlogDetail, BlogCard as BlogCardType } from "@/types/blog";
import RelatedBlogCard from "@/components/blogs/RelatedBlogCard";

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
    <section className="w-full mx-auto">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row md:min-h-screen h-full">
        {/* Hero Image */}
        {imageUrl && (
          <div className="flex w-full bg-neutral-100">
            <Image
              src={imageUrl}
              alt={blog.primaryImage?.alt ?? blog.title}
              width="1000"
              height="1000"
              className="object-cover"
              priority
            />
          </div>
        )}

        <section className="flex flex-col w-full md:h-screen text-center px-10 pt-20 pb-24 md:pt-64 lg:pt-80 items-center justify-start gap-6 bg-brand-500">
          {/* Breadcrumb */}
          {/* <p className="flex items-center gap-2 text-brand-900/65">
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
          </p> */}

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <label className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag._id}
                  href={`/blogs?tag=${tag.slug}`}
                  className="px-3 py-1.5 rounded-full border-2 border-brand-50 bg-brand-100 text-brand-900 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </label>
          )}

          {/* Title */}
          <h2 className="text-brand-900">{blog.title}</h2>

          {/* Meta */}
          <p className="flex flex-wrap items-center justify-center gap-1 text-brand-900">
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
          </p>
        </section>
      </section>

      <section className="w-full max-w-2xl mx-auto px-4">
        {/* ── Content ──────────────────────────────────────────────────────── */}
        {(blog.content?.length ?? 0) > 0 && (
          <BlogContentSection content={blog.content!} />
        )}

        {/* ── Related Blogs ─────────────────────────────────────────────────── */}
        {relatedBlogs.length > 0 && (
          <div className="pb-16">
            <h3 className=" text-brand-900 mb-4">Related Articles</h3>
            <div className="flex flex-col gap-4">
              {relatedBlogs.map((b) => (
                <RelatedBlogCard key={b._id} blog={b} />
              ))}
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
