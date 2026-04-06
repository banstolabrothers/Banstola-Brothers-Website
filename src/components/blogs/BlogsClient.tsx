"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BlogCard from "@/components/blogs/BlogCard";
import TagFilter from "@/components/blogs/TagFilter";
import type { BlogCard as BlogCardType, Tag } from "@/types/blog";
import MyButton from "@/components/ui/MyButton";

interface Props {
  blogs: BlogCardType[];
  tags: Tag[];
}

export default function BlogsClient({ blogs, tags }: Props) {
  const searchParams = useSearchParams();
  const [activeTag, setActiveTag] = useState<string | null>(
    searchParams.get("tag"), // 👈 read initial value from URL
  );

  // Sync if URL changes (e.g. browser back/forward)
  useEffect(() => {
    setActiveTag(searchParams.get("tag"));
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!activeTag) return blogs;
    return blogs.filter((blog) => blog.tags?.some((t) => t.slug === activeTag));
  }, [activeTag, blogs]);

  return (
    <section className="flex flex-col w-full max-w-[1440] mx-auto my-20 px-4 ">
      <h1 className="text-brand-900 mb-8 text-center">Blog & Insights</h1>

      {tags.length > 0 && (
        <TagFilter
          tags={tags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {filtered.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-neutral-500 mb-4">No blogs found for this tag.</p>
          <MyButton
            onClick={() => setActiveTag(null)}
            text="Clear Filter"
            type="secondarybutton"
          />
        </div>
      )}
    </section>
  );
}
