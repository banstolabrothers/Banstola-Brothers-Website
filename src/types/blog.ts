// ─── Tag ──────────────────────────────────────────────────────────────────────

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

// ─── Blog Card (list view) ────────────────────────────────────────────────────

export interface BlogCard {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  publishedAt: string;
  author: string;
  primaryImage: {
    asset: { url: string };
    alt: string;
  };
  category: {
    _id: string;
    title: string;
    slug: string;
  };
  tags: Tag[];
}

// ─── Blog Detail ──────────────────────────────────────────────────────────────

export interface BlogDetail extends BlogCard {
  content: unknown[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: { asset: { url: string } };
    keywords?: string[];
    noIndex?: boolean;
  };
}
