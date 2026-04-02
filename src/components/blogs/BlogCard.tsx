import Link from "next/link";
import Image from "next/image";
import type { BlogCard as BlogCardType } from "@/types/blog";

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

export default function BlogCard({ blog }: Props) {
  const imageUrl = blog.primaryImage?.asset?.url;

  return (
    <Link href={`/blogs/${blog.slug}`} className="group flex flex-col">
      {/* Image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={blog.primaryImage?.alt ?? blog.title}
          // fill={true}
          width={320}
          height={160}
          quality={100}
          className="h-full w-full object-cover  aspect-5/4 group-hover:scale-105 rounded-3xl transition-transform duration-500"
        />
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 py-6 gap-3">
        {/* Title */}
        <h3 className="text-brand-900 opacity-75 group-hover:opacity-100 transition-opacity line-clamp-2">
          {blog.title}
        </h3>
      </div>
    </Link>
  );
}
