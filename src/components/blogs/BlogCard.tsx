import Image from "next/image";
import type { BlogCard as BlogCardType } from "@/types/blogs";
import { TransitionLink } from "../transition/TransitionLink";

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
    <TransitionLink
      href={`/blogs/${blog.slug}`}
      className="group flex flex-col hover:cursor-pointer"
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={blog.primaryImage?.alt ?? blog.title}
          width={400}
          height={160}
          quality={85}
          className="md:h-160 h-80 w-full object-cover rounded-3xl border-2 border-brand-900/4 group-hover:opacity-50 transition-opacity"
        />
      )}

      <div className="flex flex-col flex-1 py-2 gap-1">
        <p className="text-brand-900 group-hover:opacity-50 transition-opacity">
          {blog.title}
        </p>
        {/* {blog.publishedAt && (
          <time
            dateTime={blog.publishedAt}
            className="text-sm text-neutral-500"
          >
            {formatDate(blog.publishedAt)}
          </time>
        )} */}
      </div>
    </TransitionLink>
  );
}
