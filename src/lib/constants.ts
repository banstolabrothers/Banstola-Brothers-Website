import type { CheckoutFormData } from "@/lib/checkout";

export const INITIAL_FORM: CheckoutFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  pndBranch: "",
  pndArea: "",
  landmark: "",
  orderNote: "",
};

export const PND_CONCURRENCY = 10;
export const PND_CACHE_TTL = 24 * 60 * 60 * 1000;
