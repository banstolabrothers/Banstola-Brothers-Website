"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import type { GalleryImage } from "@/types/product";

// ── Types ────────────────────────────────────────────────────────────────────

// ── Thumbnail gallery ────────────────────────────────────────────────────────
const ProductImageGallery = ({
  images,
  onSwiper,
}: {
  images: GalleryImage[];
  onSwiper: (swiper: SwiperType) => void;
}) => (
  <Swiper
    onSwiper={onSwiper}
    modules={[FreeMode, Thumbs]}
    spaceBetween={8}
    slidesPerView="auto"
    freeMode
    watchSlidesProgress
    loop
    className="w-full flex justify-center items-center"
  >
    {images.map((img, idx) => (
      <SwiperSlide key={idx} className="!w-auto">
        <div className="thumbnail-wrapper flex flex-col overflow-hidden border-4 transition-all bg-white rounded-full cursor-pointer border-white/10">
          <Image
            src={img.url}
            alt={img.alt || `Product image ${idx + 1}`}
            width={64}
            height={64}
            className="h-16 w-16 object-cover rounded-full"
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

// ── Main gallery ─────────────────────────────────────────────────────────────
const ProductImageGallerySection = ({
  product,
  selectedOptions,
}: ProductImageGallerySectionProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const mainSwiperRef = useRef<{ swiper: SwiperType } | null>(null);

  // Build image array from product data
  useEffect(() => {
    const images: GalleryImage[] = [];

    if (product?.primaryImage?.asset?.url) {
      images.push({
        url: product.primaryImage.asset.url,
        alt: product.primaryImage.alt || product.title,
        type: "primary",
      });
    }

    product?.additionalImages?.forEach((img) => {
      if (img?.asset?.url) {
        images.push({
          url: img.asset.url,
          alt: img.alt || product.title,
          caption: img.caption,
          type: "additional",
        });
      }
    });

    product?.variantGroups?.forEach((group) => {
      group.options?.forEach((option) => {
        if (option?.optionImage?.asset?.url) {
          images.push({
            url: option.optionImage.asset.url,
            alt:
              option.optionImage.alt ||
              `${product.title} - ${option.optionName}`,
            type: "variant",
            variantGroup: group.groupName,
            variantOption: option.optionName,
          });
        }
      });
    });

    setAllImages(images);
  }, [product]);

  // Auto-scroll to variant image when option selected
  useEffect(() => {
    if (!selectedOptions || !allImages.length || !mainSwiperRef.current) return;

    const idx = allImages.findIndex(
      (img) =>
        img.type === "variant" &&
        Object.entries(selectedOptions).some(
          ([groupName, optionName]) =>
            img.variantGroup === groupName && img.variantOption === optionName,
        ),
    );

    if (idx !== -1 && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slideTo(idx);
    }
  }, [selectedOptions, allImages]);

  return (
    <div className="relative w-full md:w-6/12 h-[620px] md:h-full object-cover rounded-3xl overflow-clip">
      {/* Main swiper */}
      <div className="flex w-full h-full bg-brand-100/50 rounded-lg overflow-hidden">
        <Swiper
          ref={mainSwiperRef as React.RefObject<{ swiper: SwiperType }>}
          modules={[Navigation, Thumbs]}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          spaceBetween={0}
          slidesPerView={1}
          loop
          className="w-full h-full"
        >
          {allImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={idx === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom gradient shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
      </div>

      {/* Thumbnail strip */}
      {allImages.length > 0 && (
        <div className="absolute left-4 bottom-4 z-20">
          <ProductImageGallery images={allImages} onSwiper={setThumbsSwiper} />
        </div>
      )}
    </div>
  );
};

export default ProductImageGallerySection;
