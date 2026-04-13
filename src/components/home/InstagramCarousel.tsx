"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

interface CarouselImage {
  _key: string;
  asset: { _id: string; url: string };
  alt?: string;
  link?: string;
}

const CARD_WIDTH = 240;
const CARD_GAP = 16;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const SCROLL_SPEED = 1.5;

const ImageCard = ({ image }: { image: CarouselImage }) => (
  <div
    className="carousel-card relative group overflow-hidden rounded-[24px] h-fit mb-4 hover:shadow-lg transition-all duration-300 flex-shrink-0"
    style={{ width: CARD_WIDTH }}
  >
    {image.link ? (
      <a href={image.link} target="_blank" rel="noreferrer" className="block">
        <Image
          src={image.asset.url}
          alt={image.alt || "Social media post"}
          width={CARD_WIDTH}
          height={CARD_WIDTH}
          className="object-cover w-full"
        />
      </a>
    ) : (
      <Image
        src={image.asset.url}
        alt={image.alt || "Social media post"}
        width={CARD_WIDTH}
        height={CARD_WIDTH}
        className="object-cover w-full"
      />
    )}
  </div>
);

const InstagramCarousel = ({ images }: { images: CarouselImage[] }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const oneSetWidth = images.length * CARD_STEP;

  // RAF scroll loop
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (!pausedRef.current) {
        offsetRef.current += SCROLL_SPEED;
        if (offsetRef.current >= oneSetWidth) {
          offsetRef.current -= oneSetWidth;
        }
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [oneSetWidth]);

  // Pause on hover
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll(".carousel-card");
    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };

    cards.forEach((card) => {
      card.addEventListener("mouseenter", pause);
      card.addEventListener("mouseleave", resume);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", pause);
        card.removeEventListener("mouseleave", resume);
      });
    };
  }, [images]);

  // Duplicate for seamless loop
  const displayImages = [...images, ...images];

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={trackRef}
        className="flex"
        style={{ gap: CARD_GAP, willChange: "transform" }}
      >
        {displayImages.map((image, index) => (
          <ImageCard key={`${image._key}-${index}`} image={image} />
        ))}
      </div>
    </div>
  );
};

export default InstagramCarousel;
