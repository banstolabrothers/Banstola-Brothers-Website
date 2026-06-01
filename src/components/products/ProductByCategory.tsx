import { client } from "@/lib/sanity";
import { productListQuery, allCategoriesQuery } from "@/lib/queries";
import type { Product, Category } from "@/types/product";
import ProductByCategoryClient from "./ProductByCategoryClient";

const ProductByCategory = async () => {
  const [allProducts, allCategories] = await Promise.all([
    client.fetch<Product[]>(productListQuery),
    client.fetch<Category[]>(allCategoriesQuery),
  ]);

  return (
    <ProductByCategoryClient
      allProducts={allProducts}
      allCategories={allCategories}
    />
  );
};

export default ProductByCategory;
