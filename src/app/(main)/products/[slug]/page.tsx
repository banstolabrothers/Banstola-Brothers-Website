import { client } from "@/lib/sanity";
import { productBySlugQuery, productDetailQuery } from "@/lib/queries";
import { buildProductMeta } from "@/lib/metadata";
import { ProductSchema, BreadcrumbSchema } from "@/lib/schema"; // ✅ import from lib
import ProductDetailClient from "@/components/products/ProductDetailClient";
import type { Metadata } from "next";
import type { Product } from "@/types/product";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch(productBySlugQuery, { slug });
  if (!product) return { title: "Product Not Found" };
  return buildProductMeta(product, slug);
}

export async function generateStaticParams() {
  const products = await client.fetch(`*[_type == "product"]{ slug }`);
  return products.map((p: { slug: { current: string } }) => ({
    slug: p.slug.current,
  }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await client.fetch<Product | null>(productDetailQuery, {
    slug,
  });

  return (
    <>
      {product && (
        <>
          <ProductSchema product={product} />
          <BreadcrumbSchema
            items={[
              { name: "Home", url: "https://www.banstolabrothers.com.np" },
              {
                name: "Products",
                url: "https://www.banstolabrothers.com.np/products",
              },
              {
                name: product.title,
                url: `https://www.banstolabrothers.com.np/products/${slug}`,
              },
            ]}
          />
        </>
      )}
      <ProductDetailClient product={product} slug={slug} />
    </>
  );
}
