"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Filter, Pencil } from "lucide-react";
import Image from "next/image";
import MyButton from "@/components/ui/MyButton";
import star from "@/assets/svg/star.svg";
import type { RatingStats, CustomerImage, ProductFilter } from "@/types/review";

// ── Types ────────────────────────────────────────────────────────────────────

interface ReviewHeaderProps {
  ratingStats: RatingStats;
  sortBy: string;
  setSortBy: (v: string) => void;
  setFilterBy: (v: string) => void;
  customerImages: CustomerImage[];
  reviewLink?: string;
  showFilters?: boolean;
  showCustomerImages?: boolean;
  products?: ProductFilter[];
  selectedProduct?: string;
  setSelectedProduct?: (v: string) => void;
  selectedRating?: string;
  setSelectedRating?: (v: string) => void;
}

const SORT_LABELS: Record<string, string> = {
  newest: "Newest Review",
  oldest: "Oldest",
  highest: "Highest Rating",
  lowest: "Lowest Rating",
};

const FILTER_CHIPS = [
  { label: "With Photos", key: "photos" },
  { label: "With Text", key: "text" },
] as const;

// ── Component ────────────────────────────────────────────────────────────────

const ReviewHeader = ({
  ratingStats,
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

  // Sync content filters → parent filterBy string
  useEffect(() => {
    let filterValue = "all";
    if (showPhotosOnly && showTextOnly) filterValue = "withTextAndImages";
    else if (showPhotosOnly) filterValue = "withImages";
    else if (showTextOnly) filterValue = "withText";
    setFilterBy(filterValue);
  }, [showPhotosOnly, showTextOnly, setFilterBy]);

  // Keep select width snug around its label
  useEffect(() => {
    if (measureRef.current && selectRef.current)
      selectRef.current.style.width = `${measureRef.current.offsetWidth}px`;
  }, [sortBy]);

  const clearContentFilters = () => {
    setShowPhotosOnly(false);
    setShowTextOnly(false);
  };

  const hasContentFilters = showPhotosOnly || showTextOnly;
  const hasProductFilter = selectedProduct && selectedProduct !== "all";
  const hasRatingFilter = selectedRating && selectedRating !== "all";

  return (
    <div className="mb-8 w-full">
      {/* ── Row 1: Rating summary + customer images ── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 mb-6">
        {/* Rating bars */}
        <div className="flex flex-col w-full gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-brand-900">
              {ratingStats.averageRating.toFixed(1)}
            </h3>
            <div className="flex mb-1 gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Image
                  key={i}
                  src={star}
                  alt="star"
                  className="w-8 h-8 transition-opacity duration-200"
                  style={{
                    opacity:
                      i < Math.round(ratingStats.averageRating) ? 1 : 0.2,
                  }}
                />
              ))}
            </div>
            <label className="text-brand-900">
              Based on {ratingStats.totalReviews} reviews
            </label>
          </div>

          <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map((s, index) => (
              <div key={s} className="flex items-center w-full gap-3">
                <label className="text-brand-900 w-2">{s}</label>
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

        {/* Customer images */}
        {showCustomerImages && customerImages.length > 0 && (
          <div className="flex flex-col w-full gap-4">
            <div className="flex gap-1 pb-1 scroll-smooth flex-wrap">
              {customerImages.slice(0, 18).map((img, index) => (
                <div key={index} className="bg-brand-100/50">
                  <Image
                    src={img.url}
                    alt={`Submitted by ${img.username}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-xl object-cover hover:scale-105 transition-transform duration-200 cursor-pointer hover:shadow-sm"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-brand-900/40 mb-6" />

      {/* ── Row 2: Filter + Write review ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {showFilters && (
          <MyButton
            type="secondarybutton"
            text="Filter"
            leadicon={<Filter size={32} />}
            onClick={() => setIsFilterOpen((p) => !p)}
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
          <p className="relative inline-block">
            <span
              ref={measureRef}
              className="invisible absolute whitespace-nowrap pl-8 py-4 pr-12"
            >
              {SORT_LABELS[sortBy]}
            </span>
            <select
              ref={selectRef}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-brand-100/40 hover:bg-brand-100 rounded-full pl-8 py-4 pr-12 focus:outline-none cursor-pointer"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <ChevronDown size={24} />
            </span>
          </p>
        </div>
      </div>

      <div className="border-t border-brand-900/40 mb-6" />
    </div>
  );
};

export default ReviewHeader;
