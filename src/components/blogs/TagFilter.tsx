"use client";

import type { Tag } from "@/types/blog";
import MyButton from "@/components/ui/MyButton"; // adjust path as needed

interface Props {
  tags: Tag[];
  activeTag: string | null;
  onTagChange: (slug: string | null) => void;
}

export default function TagFilter({ tags, activeTag, onTagChange }: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {/* All button */}
      <MyButton
        type={activeTag === null ? "primarybutton" : "secondarybutton"}
        text="All"
        onClick={() => onTagChange(null)}
      />

      {tags.map((tag) => {
        const isActive = activeTag === tag.slug;
        return (
          <MyButton
            key={tag._id}
            type={isActive ? "primarybutton" : "secondarybutton"}
            text={tag.name}
            onClick={() => onTagChange(isActive ? null : tag.slug)}
          />
        );
      })}
    </div>
  );
}
