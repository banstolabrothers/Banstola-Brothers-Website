import { groq } from "next-sanity";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT QUERIES
// ─────────────────────────────────────────────────────────────────────────────

export const allProductsQuery = `
  *[_type == "product"] | order(_createdAt asc) {
    title,
    slug,
    shortDescription,
    primaryImage{ asset->{ _id, url }, alt },
    brand,
    "category": category->{ title, slug },
    variantGroups[0]{ options[0]{ price, currency } },
    seo { metaTitle, metaDescription, ogImage }
  }
`;

export const productBySlugQuery = `
  *[_type == "product" && slug.current == $slug][0] {
    title,
    slug,
    shortDescription,
    primaryImage{ asset->{ _id, url }, alt },
    additionalImages[]{ asset->{ _id, url }, alt },
    brand,
    sku,
    content,
    variantGroups,
    "category": category->{ title, slug },
    seo { metaTitle, metaDescription, ogImage, keywords, noIndex }
  }
`;

export const allCategoriesQuery = `
  *[_type == "category"] | order(_createdAt asc) {
    _id,
    title,
    slug,
    description,
    image{ asset->{ _id, url } },
    seo { metaTitle, metaDescription, ogImage }
  }
`;

export const allReviewsQuery = `
  *[_type == "review"]{
    _id,
    product->{ title, primaryImage{ asset->{ _id, url } } },
    reviews[]{ username, rating, reviewDate, description }
  }
`;

export const socialMediaQuery = `
  *[_type == "socialmedia"] | order(_createdAt desc) {
    _id,
    title,
    images[]{ _key, asset->{ _id, url }, alt, link }
  }
`;

export const productListQuery = `
  *[_type == "product"] | order(_createdAt asc) {
    title,
    slug,
    shortDescription,
    primaryImage{ asset->{ _id, url }, alt },
    brand,
    "category": category->{ title, slug },
    "reviewData": *[_type == "review" && references(^._id)][0]{
      "totalReviews": count(reviews),
      "averageRating": math::avg(reviews[].rating),
      "ratings": reviews[].rating
    }
  }
`;

export const productDetailQuery = `
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    title,
    shortDescription,
    content,
    slug,
    brand,
    sku,
    metaDescription,
    "category": category->{ title, slug },
    primaryImage{ asset->{ _id, url }, alt },
    additionalImages[]{ asset->{ _id, url }, alt, caption },
    variantGroups[]{
      groupName,
      groupType,
      options[]{
        optionName,
        description,
        price,
        currency,
        inStock,
        optionImage{ asset->{ _id, url }, alt }
      }
    },
    _createdAt,
    _updatedAt,
    "reviewData": *[_type == "review" && product._ref == ^._id][0]{
      "totalReviews": count(reviews),
      "ratingSum": math::sum(reviews[].rating),
      "reviews": reviews[0..9]{
        username,
        rating,
        reviewDate,
        description
      }
    }
  }
`;

export const productSlugsQuery = `
  *[_type == "product"] { "slug": slug.current }
`;

export const productReviewsQuery = `
  *[_type == "review" && references(*[_type=="product" && slug.current==$slug]._id)][0]{
    "totalReviews": count(reviews),
    "averageRating": math::avg(reviews[].rating),
    "reviews": reviews[0..9]{
      username,
      rating,
      reviewDate,
      description
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOG QUERIES
// ─────────────────────────────────────────────────────────────────────────────

export const allTagsQuery = groq`
  *[_type == "tags"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    color
  }
`;

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

export const blogSlugsQuery = groq`
  *[_type == "blogs"] { "slug": slug.current }
`;
