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
  streetAddress: string;
  landmark: string;
  orderNote: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  pndBranch?: string;
  streetAddress?: string;
}
