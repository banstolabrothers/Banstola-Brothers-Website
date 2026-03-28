// All GROQ queries — never write inline queries in components

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
    _updatedAt
  }
`;
