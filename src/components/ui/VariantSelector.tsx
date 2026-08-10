"use client";
import { useState } from "react";
import Image from "next/image";

// ── Types ────────────────────────────────────────────────────────────────────
interface VariantOptionData {
  optionName: string;
  description?: string;
  inStock: boolean;
  optionImage?: {
    asset?: { url: string };
    alt?: string;
  };
}

interface VariantGroup {
  groupName: string;
  options: VariantOptionData[];
}
interface VariantOptionProps {
  option: VariantOptionData;
  isSelected: boolean;
  isOutOfStock: boolean;
  onSelect: () => void;
}

interface VariantSelectorProps {
  group: VariantGroup;
  selectedOption: string;
  onOptionSelect: (optionName: string) => void;
}

// ── Individual option ────────────────────────────────────────────────────────
const VariantOption = ({
  option,
  isSelected,
  isOutOfStock,
  onSelect,
}: VariantOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasImage = option.optionImage?.asset?.url;

  // Image-based variant
  if (hasImage) {
    return (
      <div
        onClick={isOutOfStock ? undefined : onSelect}
        onMouseEnter={() => !isOutOfStock && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative transition-all duration-300 shrink-0 snap-start ${
          isOutOfStock ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="relative rounded-3xl">
          <Image
            src={option.optionImage!.asset!.url}
            alt={option.optionImage?.alt || option.optionName}
            width={200}
            height={128}
            className={`w-fit aspect-video h-32 shadow-md rounded-3xl ring-1 object-cover transition-all duration-300 ${
              isSelected ? "ring-brand-500/10 p-1" : "ring-neutral-100"
            }`}
          />

          {/* Hover overlay */}
          {isHovered && !isSelected && !isOutOfStock && (
            <div className="absolute inset-0 bg-brand-900/20 rounded-xl transition-opacity duration-300" />
          )}

          {/* Selected checkmark overlay */}
          {isSelected && (
            <div className="absolute inset-0 m-1 bg-brand-900/60 flex rounded-xl items-center justify-center transition-opacity duration-300">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Label */}
        <div className="mt-2">
          <p
            className={`${isSelected ? "text-brand-900" : "text-neutral-600"}`}
          >
            {option.optionName}
          </p>
          {option.description && (
            <label className="text-neutral-500 mt-1 line-clamp-2 block">
              {option.description}
            </label>
          )}
        </div>
      </div>
    );
  }

  // Text-based variant
  return (
    <div
      onClick={isOutOfStock ? undefined : onSelect}
      className={`relative rounded-3xl px-5 py-3 transition-all duration-300 border-2 w-fit shrink-0 snap-start ${
        isOutOfStock
          ? "bg-neutral-50 opacity-40 text-neutral-400 cursor-not-allowed border-neutral-200 pointer-events-none"
          : isSelected
            ? "text-white bg-brand-100 cursor-pointer"
            : "bg-white hover:bg-brand-100/50 border-neutral-200 cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 space-y-0.5">
          <p className="cursor-pointer text-brand-900 whitespace-nowrap">
            {option.optionName}
          </p>
          {option.description && (
            <label className="cursor-pointer line-clamp-1 text-brand-900/64 block whitespace-nowrap">
              {option.description}
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main VariantSelector ─────────────────────────────────────────────────────
const VariantSelector = ({
  group,
  selectedOption,
  onOptionSelect,
}: VariantSelectorProps) => {
  if (!group?.options?.length) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <label className="text-brand-900/80 w-full">{group.groupName}</label>

      <div className="flex flex-row gap-4 overflow-x-auto w-full pb-2 px-1  scrollbar-thin">
        {group.options.map((option, i) => (
          <VariantOption
            key={i}
            option={option}
            isSelected={selectedOption === option.optionName}
            isOutOfStock={!option.inStock}
            onSelect={() => {
              if (option.inStock) onOptionSelect(option.optionName);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export { VariantSelector };
export default VariantSelector;
