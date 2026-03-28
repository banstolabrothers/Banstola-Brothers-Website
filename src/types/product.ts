export interface SanityImageAsset {
  _id: string;
  url: string;
}

export interface SanityImage {
  asset: SanityImageAsset;
  alt?: string;
  caption?: string;
}

export interface CategoryRef {
  title: string;
  slug: { current: string };
}

export interface VariantOption {
  optionName: string;
  description?: string;
  price?: number;
  currency?: string;
  inStock: boolean;
  optionImage?: SanityImage;
}

export interface VariantGroup {
  groupName: string;
  groupType?: string;
  options: VariantOption[];
}

export interface Product {
  _id: string;
  title: string;
  shortDescription?: string;
  content?: unknown[];
  slug: { current: string };
  brand?: string;
  sku?: string;
  metaDescription?: string;
  category?: CategoryRef;
  primaryImage?: SanityImage;
  additionalImages?: SanityImage[];
  variantGroups?: VariantGroup[];
  _createdAt: string;
  _updatedAt: string;
}

export interface Category {
  title: string;
  slug: { current: string };
  description?: string;
  image?: { asset: SanityImageAsset };
}

export type SelectedOptions = Record<string, string>;
