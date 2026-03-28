import type { CartItem, CheckoutFormData } from "./checkout";

export const DEMO_CART_ITEMS: CartItem[] = [
  {
    cartId: "demo-1",
    name: "Classic Cotton T-Shirt",
    variant: "Size: M · White",
    price: 899,
    quantity: 2,
    image: "https://placehold.co/80x80?text=T-Shirt",
  },
  {
    cartId: "demo-2",
    name: "Ceramic Coffee Mug",
    variant: "Black",
    price: 450,
    quantity: 1,
    image: "https://placehold.co/80x80?text=Mug",
  },
];

export const INITIAL_FORM: CheckoutFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  pndBranch: "",
  streetAddress: "",
  landmark: "",
  orderNote: "",
};

export const PND_CONCURRENCY = 10;
export const PND_CACHE_TTL = 24 * 60 * 60 * 1000;
