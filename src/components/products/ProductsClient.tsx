"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ReviewData {
  totalReviews: number;
  averageRating: number | null;
  ratings: number[];
}

interface Product {
  title: string;
  slug: { current: string };
  shortDescription?: string;
  primaryImage?: { asset: { _id: string; url: string }; alt?: string };
  brand?: string;
  reviewData?: ReviewData;
}

// ─── Star renderer ────────────────────────────────────────────────────────────
const renderStars = (rating: number, size = "w-4 h-4") => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < Math.round(rating) ? "opacity-100 text-brand-500" : "opacity-30 text-neutral-400"}`}
      >
        ★
      </span>
    ))}
  </div>
);

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const productUrl = `/products/${product.slug?.current}`;
  const hasReviews =
    (product.reviewData?.totalReviews ?? 0) > 0 &&
    product.reviewData?.averageRating != null;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    router.push(productUrl);
  };

  return (
    <div
      className="group flex flex-col cursor-pointer relative"
      onClick={handleCardClick}
    >
      {/* Product image */}
      {product.primaryImage?.asset?.url && (
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={product.primaryImage.asset.url}
            alt={product.primaryImage.alt ?? product.title}
            fill
            className="object-cover group-hover:scale-105 transition-all ease-in-out duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      )}

      {/* Product info */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <h3 className="text-brand-900 text-center duration-300 ease-in-out">
          {product.title}
        </h3>

        {product.shortDescription && (
          <p className="text-neutral-800 text-center">
            {product.shortDescription}
          </p>
        )}

        {hasReviews && product.reviewData?.averageRating != null && (
          <div className="flex items-center gap-2 text-neutral-600">
            {renderStars(product.reviewData.averageRating)}
            <label>{product.reviewData.averageRating.toFixed(1)}</label>
            <label>({product.reviewData.totalReviews} reviews)</label>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main client component ────────────────────────────────────────────────────
const ProductsClient = ({ allProducts }: { allProducts: Product[] }) => {
  return (
    <div className="flex flex-col mx-auto max-w-[1280px] px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-20">
        {allProducts.length === 0 ? (
          <div className="col-span-full text-center text-neutral-600">
            <p className="text-lg">No products available at the moment.</p>
          </div>
        ) : (
          allProducts.map((product) => (
            <ProductCard key={product.slug.current} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsClient;
