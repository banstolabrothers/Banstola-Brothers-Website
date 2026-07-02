"use client";
import Image from "next/image";
import { AutoScrollCarousel } from "@/components/ui/AutoScrollCarousel";
import RenderStars from "@/components/review/RenderStars";
import { getDisplayName } from "@/lib/reviewUtils";
import type { HomeReviewItem } from "@/types/review";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CarouselImage {
  _key: string;
  asset: { _id: string; url: string };
  alt?: string;
  link?: string;
}

type ReviewProps = {
  variant: "reviews";
  items: HomeReviewItem[];
};

type ImageProps = {
  variant: "images";
  items: CarouselImage[];
};

type SectionCarouselProps = ReviewProps | ImageProps;

// ── Card configs ──────────────────────────────────────────────────────────────
// Each variant declares its own card dimensions so AutoScrollCarousel can
// calculate the seamless reset point correctly.

const REVIEW_CARD_WIDTH = 384; // w-96
const REVIEW_CARD_GAP = 4; // gap-1
const REVIEW_SPEED = 1.0; // slower — cards need reading time

const IMAGE_CARD_WIDTH = 240;
const IMAGE_CARD_GAP = 16;
const IMAGE_SPEED = 1.5;

// ── TestimonialCard ───────────────────────────────────────────────────────────

const TestimonialCard = ({
  review,
  cardIndex,
}: {
  review: HomeReviewItem;
  cardIndex: number;
}) => (
  <div
    className={`flex flex-col w-96 flex-shrink-0 bg-brand-100/40 rounded-[32px] px-8 py-10 text-center justify-between transition-all duration-300 hover:-translate-y-1 h-[500px] ${
      cardIndex % 2 === 0 ? "mb-8" : "mt-8"
    }`}
  >
    <div className="flex items-center justify-center gap-1 mb-4">
      <RenderStars size={32} rating={review.rating || 5} />
    </div>

    <p className="text-neutral-800">&ldquo;{review.description}&rdquo;</p>

    <div className="flex flex-col w-full gap-2 mt-4">
      <h5 className="text-brand-900">{getDisplayName(review.username)}</h5>
      {review.productTitle && (
        <div className="flex items-center justify-center gap-3">
          {review.productImage && (
            <Image
              src={review.productImage}
              alt={review.productTitle}
              width={40}
              height={40}
              className="object-cover rounded-lg"
            />
          )}
          <p className="text-neutral-600 truncate">{review.productTitle}</p>
        </div>
      )}
    </div>
  </div>
);

// ── ImageCard ─────────────────────────────────────────────────────────────────

const ImageCard = ({ image }: { image: CarouselImage }) => (
  <div
    className="relative group overflow-hidden rounded-[24px] h-fit mb-4 hover:shadow-lg transition-all duration-300 flex-shrink-0"
    style={{ width: IMAGE_CARD_WIDTH }}
  >
    {image.link ? (
      <a href={image.link} target="_blank" rel="noreferrer" className="block">
        <Image
          src={image.asset.url}
          alt={image.alt || "Social media post"}
          width={IMAGE_CARD_WIDTH}
          height={IMAGE_CARD_WIDTH}
          className="object-cover w-full"
        />
      </a>
    ) : (
      <Image
        src={image.asset.url}
        alt={image.alt || "Social media post"}
        width={IMAGE_CARD_WIDTH}
        height={IMAGE_CARD_WIDTH}
        className="object-cover w-full"
      />
    )}
  </div>
);

// ── SectionCarousel ───────────────────────────────────────────────────────────

/**
 * Single client carousel used by both HomeReviewSection and FollowUsSection.
 *
 * Usage:
 *   <SectionCarousel variant="reviews" items={reviewsArray} />
 *   <SectionCarousel variant="images"  items={imagesArray}  />
 *
 * The `variant` discriminator selects the right card shape, dimensions,
 * and scroll speed. Both section files only need to import this one component.
 */
const SectionCarousel = (props: SectionCarouselProps) => {
  if (props.variant === "reviews") {
    return (
      <AutoScrollCarousel
        cardWidth={REVIEW_CARD_WIDTH}
        gap={REVIEW_CARD_GAP}
        speed={REVIEW_SPEED}
      >
        {props.items.map((review, i) => (
          <TestimonialCard key={`review-${i}`} review={review} cardIndex={i} />
        ))}
      </AutoScrollCarousel>
    );
  }

  return (
    <AutoScrollCarousel
      cardWidth={IMAGE_CARD_WIDTH}
      gap={IMAGE_CARD_GAP}
      speed={IMAGE_SPEED}
    >
      {props.items.map((image, index) => (
        <ImageCard key={`${image._key}-${index}`} image={image} />
      ))}
    </AutoScrollCarousel>
  );
};

export default SectionCarousel;
