"use client";

import Image from "next/image";
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
      <section className="flex flex-col md:flex-row md:max-h-screen h-full">
        {imageUrl && (
          <div className="flex w-full bg-neutral-100">
            <Image
              src={imageUrl}
              alt={blog.primaryImage?.alt ?? blog.title}
              width="2000"
              height="10"
              className="object-cover overflow-hidden w-full max-h-[50vh] md:max-h-full"
              priority
            />
          </div>
        )}

        <section className="flex flex-col w-full md:h-screen text-center px-10 pt-20 pb-24 md:pt-64 lg:pt-[20vh] items-center justify-start gap-6 bg-brand-500">
          <h2 className="text-brand-900">{blog.title}</h2>

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

      <section className="w-full max-w-3xl mx-auto px-4">
        {(blog.content?.length ?? 0) > 0 && (
          <BlogContentSection content={blog.content!} />
        )}

        {relatedBlogs.length > 0 && (
          <div className="pb-16">
            <h3 className="text-brand-900 mb-4">Related Blogs</h3>
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
