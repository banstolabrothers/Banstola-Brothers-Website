import { groq } from "next-sanity";

// ─── All Tags (for filter UI) ──────────────────────────────────────────────────

export const allTagsQuery = groq`
  *[_type == "tags"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    color
  }
`;

// ─── Blog List (all blogs with tag info) ──────────────────────────────────────

export const blogListQuery = groq`
  *[_type == "blogs"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    publishedAt,
    author,
    primaryImage {
      asset-> { url },
      alt
    },
    category-> {
      _id,
      title,
      "slug": slug.current
    },
    tags[]-> {
      _id,
      name,
      "slug": slug.current,
      color
    }
  }
`;

// ─── Blog List filtered by tag ────────────────────────────────────────────────

export const blogListByTagQuery = groq`
  *[_type == "blogs" && $tagSlug in tags[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    publishedAt,
    author,
    primaryImage {
      asset-> { url },
      alt
    },
    category-> {
      _id,
      title,
      "slug": slug.current
    },
    tags[]-> {
      _id,
      name,
      "slug": slug.current,
      color
    }
  }
`;

// ─── Blog Detail by Slug ──────────────────────────────────────────────────────

export const blogBySlugQuery = groq`
  *[_type == "blogs" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    publishedAt,
    author,
    primaryImage {
      asset-> { url },
      alt
    },
    content[] {
      ...,
      _type == "image" => {
        ...,
        asset-> { url }
      }
    },
    category-> {
      _id,
      title,
      "slug": slug.current
    },
    tags[]-> {
      _id,
      name,
      "slug": slug.current,
      color
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage { asset-> { url } },
      keywords,
      noIndex
    }
  }
`;

// ─── Related Blogs (same category or shared tags, excluding current) ──────────

export const relatedBlogsQuery = groq`
  *[
    _type == "blogs" &&
    slug.current != $slug &&
    (
      category->slug.current == $categorySlug ||
      count((tags[]->slug.current)[@ in $tagSlugs]) > 0
    )
  ] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    publishedAt,
    author,
    primaryImage {
      asset-> { url },
      alt
    },
    tags[]-> {
      _id,
      name,
      "slug": slug.current,
      color
    }
  }
`;

// ─── For generateStaticParams ─────────────────────────────────────────────────

export const blogSlugsQuery = groq`
  *[_type == "blogs"] { "slug": slug.current }
`;
