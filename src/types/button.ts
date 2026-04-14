export interface Category {
  _id?: string;
  title?: string;
  slug?: { current: string };
  image?: { asset?: { url: string } };
}

export type ButtonType =
  | "ctabutton"
  | "primarybutton"
  | "secondarybutton"
  | "whatsapp"
  | "category";

export interface MyButtonProps {
  type?: ButtonType;
  leadicon?: React.ReactNode;
  trailicon?: React.ReactNode;
  link?: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
  category?: Category | null;
  selectedCategory?: string | null;
  onCategorySelect?: ((slug: string) => void) | null;
  showTextWhenSelected?: boolean;
  disabled?: boolean;
  product?: Record<string, unknown> | null;
  onClick?: () => void;
}
