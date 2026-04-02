import type { BlogDetail } from "@/types/blog";

const BASE_URL = "https://www.banstolabrothers.com.np";

interface BlogSchemaProps {
  blog: BlogDetail;
  slug: string;
}

export function BlogArticleSchema({ blog, slug }: BlogSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.shortDescription,
    image: blog.primaryImage?.asset?.url ?? "",
    author: {
      "@type": "Person",
      name: blog.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Banstola Brothers",
      url: BASE_URL,
    },
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blogs/${slug}`,
    },
    keywords: blog.tags?.map((t) => t.name).join(", ") ?? "",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BlogBreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BlogBreadcrumbSchema({ items }: BlogBreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
