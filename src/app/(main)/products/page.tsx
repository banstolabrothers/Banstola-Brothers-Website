import { pageMeta } from "@/lib/metadata";
import { client } from "@/lib/sanity";
import { productListQuery } from "@/lib/queries";
import ProductsClient from "@/components/products/ProductsClient";

export const metadata = pageMeta.products;

export default async function ProductsPage() {
  // ✅ Fetch on the server — no useEffect needed
  const allProducts = await client.fetch(productListQuery);

  return <ProductsClient allProducts={allProducts} />;
}
