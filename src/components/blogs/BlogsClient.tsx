"use client";

import BlogCard from "@/components/blogs/BlogCard";
import type { BlogCard as BlogCardType } from "@/types/blogs";

interface Props {
  blogs: BlogCardType[];
}

export default function BlogsClient({ blogs }: Props) {
  return (
    <section className="flex flex-col w-full max-w-[1440px] mx-auto my-20 px-4">
      <h1 className="text-brand-900 mb-8 text-center">Blog & Insights</h1>

      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-neutral-500">No blogs found.</p>
        </div>
      )}
    </section>
  );
}
