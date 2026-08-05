import type { Product, SelectedOptions } from "@/types/product";

export interface CartItem {
  cartId: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  phone: string;
  pndBranch: string;
  pndArea: string;
  landmark: string;
  orderNote: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  pndBranch?: string;
  pndArea?: string;
}

export function buildCartItem(
  product: Product,
  selectedOptions: SelectedOptions,
  quantity = 1,
): CartItem {
  const groups = product.variantGroups ?? [];

  let price = 0;
  for (const group of groups) {
    const selectedName = selectedOptions[group.groupName];
    const option = group.options.find((o) => o.optionName === selectedName);
    if (option?.price != null) {
      price = option.price;
      break;
    }
  }

  const variantLabel = groups
    .map((g) => selectedOptions[g.groupName])
    .filter(Boolean)
    .join(" · ");

  // Deterministic id so re-adding the same product+variant combo increments
  // quantity instead of creating a duplicate line.
  const variantKey = groups
    .map((g) => `${g.groupName}:${selectedOptions[g.groupName] ?? ""}`)
    .join("|");
  const cartId = `${product._id}::${variantKey}`;

  const image =
    product.primaryImage?.asset?.url ??
    "https://placehold.co/80x80?text=Product";

  return {
    cartId,
    name: product.title,
    variant: variantLabel,
    price,
    quantity,
    image,
  };
}
