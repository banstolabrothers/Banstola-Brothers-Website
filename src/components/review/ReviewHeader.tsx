"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Filter, Pencil } from "lucide-react";
import Image from "next/image";
import MyButton from "@/components/ui/MyButton";

// ── Types ────────────────────────────────────────────────────────────────────
interface RatingStats {
  totalReviews: number;
  averageRating: number;
  ratingCounts: number[];
}

interface Product {
  id: string;
  name: string;
  slug?: { current: string };
  image?: string;
}

interface CustomerImage {
  url: string;
  caption?: string;
  username: string;
}

interface ReviewHeaderProps {
  ratingStats: RatingStats;
  renderStars: (rating: number, size?: string) => React.ReactNode;
  sortBy: string;
  setSortBy: (v: string) => void;
  setFilterBy: (v: string) => void;
  customerImages: CustomerImage[];
  reviewLink?: string;
  showFilters?: boolean;
  showCustomerImages?: boolean;
  products?: Product[];
  selectedProduct?: string;
  setSelectedProduct?: (v: string) => void;
  selectedRating?: string;
  setSelectedRating?: (v: string) => void;
}

// ── Component ────────────────────────────────────────────────────────────────
const ReviewHeader = ({
  ratingStats,
  renderStars,
  sortBy,
  setSortBy,
  setFilterBy,
  customerImages,
  reviewLink = "/submit-reviews",
  showFilters = true,
  showCustomerImages = true,
  products = [],
  selectedProduct,
  setSelectedProduct,
  selectedRating,
  setSelectedRating,
}: ReviewHeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPhotosOnly, setShowPhotosOnly] = useState(false);
  const [showTextOnly, setShowTextOnly] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const clearContentFilters = () => {
    setShowPhotosOnly(false);
    setShowTextOnly(false);
  };

  useEffect(() => {
    let filterValue = "all";
    if (showPhotosOnly && showTextOnly) filterValue = "withTextAndImages";
    else if (showPhotosOnly) filterValue = "withImages";
    else if (showTextOnly) filterValue = "withText";
    setFilterBy(filterValue);
  }, [showPhotosOnly, showTextOnly, setFilterBy]);

  useEffect(() => {
    if (measureRef.current && selectRef.current) {
      selectRef.current.style.width = `${measureRef.current.offsetWidth}px`;
    }
  }, [sortBy]);

  const hasContentFilters = showPhotosOnly || showTextOnly;
  const hasProductFilter = selectedProduct && selectedProduct !== "all";
  const hasRatingFilter = selectedRating && selectedRating !== "all";

  const sortLabel: Record<string, string> = {
    newest: "Newest Review",
    oldest: "Oldest",
    highest: "Highest Rating",
    lowest: "Lowest Rating",
  };

  return (
    <div className="mb-8 w-full">
      {/* ── Row 1: Rating summary + customer images ── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 mb-6">
        {/* Left: rating summary + bars */}
        <div className="flex flex-col w-full lg:w-5/12 gap-4">
          <div className="flex items-center gap-4">
            <h4 className="text-brand-900">
              {ratingStats.averageRating.toFixed(1)}
            </h4>
            <div className="flex mb-1 text-brand-900">
              {renderStars(Math.round(ratingStats.averageRating), "w-6 h-6")}
            </div>
            <label className="text-brand-900">
              Based on {ratingStats.totalReviews} reviews
            </label>
          </div>

          <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map((star, index) => (
              <div key={star} className="flex items-center w-full gap-3">
                <label className="text-brand-900 w-2">{star}</label>
                <span className="text-brand-900">★</span>
                <div className="flex-1 h-3 bg-brand-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-900 rounded-full transition-all duration-300"
                    style={{
                      width:
                        ratingStats.totalReviews > 0
                          ? `${(ratingStats.ratingCounts[index] / ratingStats.totalReviews) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
                <label className="text-brand-900 w-4 text-right">
                  {ratingStats.ratingCounts[index]}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Right: customer images */}
        <div className="flex flex-col w-full lg:w-7/12 gap-4">
          {showCustomerImages && customerImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
              {customerImages.slice(0, 20).map((img, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden bg-brand-100/50 hover:scale-105 transition-transform duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <Image
                    src={img.url}
                    alt={`Submitted by ${img.username}`}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-brand-900/40 mb-6" />

      {/* ── Row 2: Filter + Write review buttons ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {showFilters && (
          <MyButton
            type="secondarybutton"
            text="Filter"
            leadicon={<Filter size={32} />}
            onClick={() => setIsFilterOpen((prev) => !prev)}
          />
        )}
        <MyButton
          type="primarybutton"
          text="Write a Review"
          link={reviewLink}
          leadicon={<Pencil size={32} />}
        />
      </div>

      {/* ── Filter panel ── */}
      {showFilters && isFilterOpen && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          {/* Product filter */}
          {products.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h6 className="text-neutral-700">Product</h6>
                {hasProductFilter && (
                  <button
                    onClick={() => setSelectedProduct?.("all")}
                    className="px-3 py-1 text-xs text-neutral-600 hover:text-brand-900 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct?.(product.id)}
                    className={`px-4 py-2 border-2 rounded-full text-sm font-medium transition-all ${
                      selectedProduct === product.id
                        ? "bg-brand-500 text-white border-brand-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "bg-white text-neutral-700 border-neutral-300 hover:border-brand-900 hover:bg-neutral-50"
                    }`}
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rating filter */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h6 className="text-neutral-700">Rating</h6>
              {hasRatingFilter && (
                <button
                  onClick={() => setSelectedRating?.("all")}
                  className="px-3 py-1 text-xs text-neutral-600 hover:text-brand-900 underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating?.(rating.toString())}
                  className={`px-4 py-2 border-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                    selectedRating === rating.toString()
                      ? "bg-brand-500 text-white border-brand-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-brand-900 hover:bg-neutral-50"
                  }`}
                >
                  {rating} <span className="text-xs">★</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content type filter */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h6 className="text-neutral-700">Content Type</h6>
              {hasContentFilters && (
                <button
                  onClick={clearContentFilters}
                  className="px-3 py-1 text-xs text-neutral-600 hover:text-brand-900 underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "With Photos",
                  state: showPhotosOnly,
                  toggle: () => setShowPhotosOnly((p) => !p),
                },
                {
                  label: "With Text",
                  state: showTextOnly,
                  toggle: () => setShowTextOnly((p) => !p),
                },
              ].map(({ label, state, toggle }) => (
                <button
                  key={label}
                  onClick={toggle}
                  className={`px-4 py-2 border-2 rounded-full text-sm font-medium transition-all ${
                    state
                      ? "bg-brand-500 text-white border-brand-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white text-neutral-700 border-neutral-300 hover:border-brand-900 hover:bg-neutral-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Row 3: Count + Sort ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-brand-900">{ratingStats.totalReviews} reviews</h3>

        <div className="flex flex-row items-center w-fit gap-4">
          <h5>Sort By:</h5>
          <div className="relative inline-block">
            <span
              ref={measureRef}
              className="invisible absolute whitespace-nowrap pl-8 py-4 pr-12"
            >
              {sortLabel[sortBy]}
            </span>
            <select
              ref={selectRef}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-brand-100/40 hover:bg-brand-100 rounded-full pl-8 py-4 pr-12 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Review</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <ChevronDown size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-900/40 mb-6" />
    </div>
  );
};

export default ReviewHeader;
