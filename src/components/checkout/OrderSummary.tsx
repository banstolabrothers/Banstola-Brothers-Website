"use client";
import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Trash2, X, Plus, Minus, MapPin } from "lucide-react";
import type { CartItem } from "@/lib/checkout";
import { PROMO_CODES } from "@/lib/constants";

interface OrderSummaryProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  pndDeliveryRate: number | null;
  selectedBranch: string;
}

const OrderSummary = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  pndDeliveryRate,
  selectedBranch,
}: OrderSummaryProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    type: "percentage" | "fixed" | "shipping";
    value: number;
    description: string;
  } | null>(null);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a promo code");
      return;
    }
    const found = PROMO_CODES[code as keyof typeof PROMO_CODES];
    if (found) {
      setAppliedPromo({ code, ...found });
      setPromoError("");
      setPromoCode("");
    } else {
      setPromoError("Invalid promo code");
      setAppliedPromo(null);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  let discount = 0;
  if (appliedPromo?.type === "percentage")
    discount = (subtotal * appliedPromo.value) / 100;
  else if (appliedPromo?.type === "fixed") discount = appliedPromo.value;

  const isFreeShip = appliedPromo?.type === "shipping";
  const shipping = isFreeShip ? 0 : pndDeliveryRate;
  const total = shipping !== null ? subtotal - discount + shipping : null;

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingCart size={64} className="text-gray-300 mb-4" />
        <h5 className="text-gray-900 font-semibold mb-2">Your cart is empty</h5>
        <p className="text-gray-600 text-sm">Add items to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-fit">
      <div className="pb-4 border-b border-gray-200 flex items-center justify-between">
        <h5 className="text-gray-900 font-semibold">
          Order Summary ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
        </h5>
        <button
          type="button"
          onClick={onClearCart}
          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {selectedBranch && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
          <MapPin size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600">
            Delivering to{" "}
            <span className="font-medium text-gray-800">{selectedBranch}</span>
          </span>
        </div>
      )}

      <div className="space-y-4 my-5 max-h-72 overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <div
            key={item.cartId}
            className="flex gap-3 items-start group relative"
          >
            <button
              type="button"
              onClick={() => onRemoveItem(item.cartId)}
              className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
            >
              <X size={12} strokeWidth={3} />
            </button>
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-gray-900 font-semibold text-sm line-clamp-1">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {item.variant}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateQuantity(item.cartId, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus size={11} strokeWidth={2.5} />
                </button>
                <span className="text-sm font-medium text-gray-900 min-w-[18px] text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateQuantity(item.cartId, item.quantity + 1)
                  }
                  className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <Plus size={11} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-gray-900 font-semibold text-sm">
                NPR {(item.price * item.quantity).toFixed(2)}
              </span>
              {item.quantity > 1 && (
                <span className="text-xs text-gray-400 mt-0.5">
                  NPR {item.price.toFixed(2)} each
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Promo */}
      <div className="mb-5 pb-5 border-t border-gray-200 pt-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value);
              setPromoError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
            placeholder="Enter promo code"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold text-sm whitespace-nowrap"
          >
            Apply
          </button>
        </div>
        {promoError && (
          <p className="text-red-500 text-xs mt-2">{promoError}</p>
        )}
        {appliedPromo && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-green-700 font-semibold text-sm">
                {appliedPromo.code}
              </span>
              <span className="text-green-600 text-xs block">
                {appliedPromo.description}
              </span>
            </div>
            <button
              type="button"
              onClick={removePromo}
              className="text-green-700 hover:text-green-900"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-3">
        <div className="flex justify-between text-gray-700">
          <span className="text-sm">Subtotal</span>
          <span className="font-semibold text-sm">
            NPR {subtotal.toFixed(2)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="text-sm">Discount</span>
            <span className="font-semibold text-sm">
              - NPR {discount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-gray-700 items-center">
          <span className="text-sm">Delivery</span>
          <span className="font-semibold text-sm">
            {isFreeShip ? (
              <span className="text-green-600">FREE</span>
            ) : shipping !== null ? (
              <span className="text-gray-900">
                NPR {Number(shipping).toFixed(2)}
              </span>
            ) : (
              <span className="text-gray-400 font-normal text-xs">
                Select delivery branch
              </span>
            )}
          </span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-4">
          <span className="font-semibold text-gray-900">Total</span>
          <div className="text-right">
            {total !== null ? (
              <span className="font-bold text-xl text-gray-900">
                NPR {total.toFixed(2)}
              </span>
            ) : (
              <>
                <span className="font-bold text-xl text-gray-900">
                  NPR {(subtotal - discount).toFixed(2)}
                </span>
                <span className="text-gray-400 text-xs block">+ delivery</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-200 flex flex-col gap-2 text-xs text-gray-500">
        {["Secure checkout", "Free returns within 7 days"].map((t) => (
          <div key={t} className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;
