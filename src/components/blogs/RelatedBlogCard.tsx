import Link from "next/link";
import Image from "next/image";
import type { BlogCard as BlogCardType } from "@/types/blogs";

interface Props {
  blog: BlogCardType;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RelatedBlogCard({ blog }: Props) {
  const imageUrl = blog.primaryImage?.asset?.url;

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex items-center gap-4 flex-row"
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={blog.primaryImage?.alt ?? blog.title}
          width={320}
          height={160}
          quality={85}
          className="h-32 max-w-4/12 w-full object-cover rounded-3xl border-2 border-brand-900/4"
        />
      )}

      <div className="flex flex-col w-8/12 gap-1">
        <p className="text-brand-900 group-hover:opacity-50 transition-opacity">
          {blog.title}
        </p>
        {blog.publishedAt && (
          <time
            dateTime={blog.publishedAt}
            className="text-xs text-neutral-500"
          >
            {formatDate(blog.publishedAt)}
          </time>
        )}
      </div>
    </Link>
  );
}
