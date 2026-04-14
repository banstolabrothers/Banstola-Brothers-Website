import cn from "classnames";
import type { Category } from "@/types/button";
import { getButtonStyle, DEFAULT_BUTTON_CLASS } from "@/lib/button/style";

interface CategoryButtonProps {
  category: Category;
  selectedCategory?: string | null;
  onCategorySelect?: ((slug: string) => void) | null;
  text?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const CategoryButton = ({
  category,
  selectedCategory,
  onCategorySelect,
  text,
  className = DEFAULT_BUTTON_CLASS,
  disabled = false,
  children,
}: CategoryButtonProps) => {
  const categoryKey = category.slug?.current ?? category._id ?? null;
  const isSelected = categoryKey !== null && selectedCategory === categoryKey;

  const handleClick = () => {
    if (disabled || !onCategorySelect || !categoryKey) return;
    onCategorySelect(categoryKey);
  };

  return (
    <button
      key={categoryKey}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        getButtonStyle("category"),
        isSelected ? "pr-4 bg-brand-100 text-brand-500" : "",
        className,
      )}
    >
      {category.image?.asset?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={category.image.asset.url}
          alt={category.title ?? text}
          className="w-20 h-20 object-cover rounded-full flex-shrink-0"
        />
      )}

      {isSelected && <h5 className="pl-1 pr-2">{category.title ?? text}</h5>}

      {children}
    </button>
  );
};
