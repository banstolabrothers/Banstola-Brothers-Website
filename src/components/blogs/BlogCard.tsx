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
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex flex-col hover:cursor-pointer "
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={blog.primaryImage?.alt ?? blog.title}
          width={400}
          height={160}
          quality={100}
          className="md:h-160 h-80 w-full object-cover rounded-3xl border-2  hover:cursor-pointer border-brand-900/4 group-hover:opacity-50 transition-opacity"
        />
      )}

      <div className="flex flex-col flex-1 py-2 gap-3  hover:cursor-pointer">
        <p className=" text-brand-900 group-hover:opacity-50 transition-opacity">
          {blog.title}
        </p>
      </div>
    </Link>
  );
}
