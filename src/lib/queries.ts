import { groq } from "next-sanity";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED FRAGMENTS
// ─────────────────────────────────────────────────────────────────────────────

const imageFragment = `asset->{ _id, url }`;
const reviewEntriesFragment = `
  reviews[]{
    reviewDate, description, username, rating,
    productReviewImages[]{ ${imageFragment}, caption },
    reply{ message, replyDate, repliedBy }
  }
`;
const reviewDocFragment = `
  _id,
  product->{ _id, title, slug, primaryImage{ ${imageFragment} } },
  category->{ title, image{ ${imageFragment} } },
  ${reviewEntriesFragment}
`;

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT QUERIES
// ─────────────────────────────────────────────────────────────────────────────

export const allProductsQuery = `
  *[_type == "product"] | order(_createdAt asc) {
    title,
    slug,
    shortDescription,
    primaryImage{ ${imageFragment}, alt },
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
    primaryImage{ ${imageFragment}, alt },
    additionalImages[]{ ${imageFragment}, alt },
    brand,
    sku,
    content,
    variantGroups,
    "category": category->{ title, slug },
    seo { metaTitle, metaDescription, ogImage, keywords, noIndex }
  }
`;

export const productListQuery = `
  *[_type == "product"] | order(_createdAt asc) {
    title,
    slug,
    shortDescription,
    primaryImage{ ${imageFragment}, alt },
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
    primaryImage{ ${imageFragment}, alt },
    additionalImages[]{ ${imageFragment}, alt, caption },
    variantGroups[]{
      groupName,
      groupType,
      options[]{
        optionName,
        description,
        price,
        currency,
        inStock,
        optionImage{ ${imageFragment}, alt }
      }
    },
    _createdAt,
    _updatedAt,
    "reviewData": *[_type == "review" && product._ref == ^._id][0]{
      "totalReviews": count(reviews),
      "ratingSum": math::sum(reviews[].rating),
      "reviews": reviews[0..9]{
        username, rating, reviewDate, description
      }
    }
  }
`;

export const productSlugsQuery = `
  *[_type == "product"] { "slug": slug.current }
`;

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY QUERIES
// ─────────────────────────────────────────────────────────────────────────────

export const allCategoriesQuery = `
  *[_type == "category"] | order(_createdAt asc) {
    _id,
    title,
    slug,
    description,
    image{ ${imageFragment} },
    seo { metaTitle, metaDescription, ogImage }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW QUERIES
// ─────────────────────────────────────────────────────────────────────────────

// Simple — used for rating summaries on product cards
export const allReviewsQuery = `
  *[_type == "review"]{
    _id,
    product->{ title, primaryImage{ ${imageFragment} } },
    reviews[]{ username, rating, reviewDate, description }
  }
`;

// Full — used for All Reviews page
export const allReviewsFullQuery = `
  *[_type == "review"]{
    ${reviewDocFragment}
  }
`;

// Full — used for Product Review Section (filtered by productId)
export const productReviewsByIdQuery = `
  *[_type == "review" && references($productId)]{
    ${reviewDocFragment}
  }
`;

// Summary — used for product detail page inline review data
export const productReviewsQuery = `
  *[_type == "review" && references(*[_type=="product" && slug.current==$slug]._id)][0]{
    "totalReviews": count(reviews),
    "averageRating": math::avg(reviews[].rating),
    "reviews": reviews[0..9]{
      username, rating, reviewDate, description
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL MEDIA QUERIES
// ─────────────────────────────────────────────────────────────────────────────

export const socialMediaQuery = `
  *[_type == "socialmedia"] | order(_createdAt desc) {
    _id,
    title,
    images[]{ _key, ${imageFragment}, alt, link }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// BLOG QUERIES
// ─────────────────────────────────────────────────────────────────────────────

const blogCardFragment = groq`
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  publishedAt,
  author,
  primaryImage { asset->{ url }, alt },
  category->{ _id, title, "slug": slug.current },
  tags[]->{ _id, name, "slug": slug.current, color }
`;

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
  *[_type == "blogs"] | order(publishedAt desc) { ${blogCardFragment} }
`;

export const blogListByTagQuery = groq`
  *[_type == "blogs" && $tagSlug in tags[]->slug.current] | order(publishedAt desc) {
    ${blogCardFragment}
  }
`;

export const blogBySlugQuery = groq`
  *[_type == "blogs" && slug.current == $slug][0] {
    ${blogCardFragment},
    content[] {
      ...,
      _type == "image" => { ..., asset->{ url } }
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage{ asset->{ url } },
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
    ${blogCardFragment}
  }
`;

export const blogSlugsQuery = groq`
  *[_type == "blogs"] { "slug": slug.current }
`;
