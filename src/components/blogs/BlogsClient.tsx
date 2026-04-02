"use client";

import { useState, useMemo } from "react";
import BlogCard from "@/components/blogs/BlogCard";
import TagFilter from "@/components/blogs/TagFilter";
import type { BlogCard as BlogCardType, Tag } from "@/types/blog";
import MyButton from "../ui/MyButton";

interface Props {
  blogs: BlogCardType[];
  tags: Tag[];
}

export default function BlogsClient({ blogs, tags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeTag) return blogs;
    return blogs.filter((blog) => blog.tags?.some((t) => t.slug === activeTag));
  }, [activeTag, blogs]);

  return (
    <main className="min-h-screen py-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* ── Header ── */}
        <div className="mb-12 text-center">
          <h1 className=" text-brand-900 mb-4">Blog & Insights</h1>
          <p className="text-neutral-600 max-w-xl mx-auto">
            Tips, stories, and insights from the Banstola Brothers team.
          </p>
        </div>

        {/* ── Tag Filter ── */}
        {tags.length > 0 && (
          <TagFilter
            tags={tags}
            activeTag={activeTag}
            onTagChange={setActiveTag}
          />
        )}

        {/* ── Blog Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            {filtered.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-neutral-500  mb-4">
              No blogs found for this tag.
            </p>
            <MyButton
              onClick={() => setActiveTag(null)}
              text="Clear Filter"
              type="secondarybutton"
            />
          </div>
        )}
      </div>
    </main>
  );
}
