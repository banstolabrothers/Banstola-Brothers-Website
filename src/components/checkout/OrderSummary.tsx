"use client";
import Image from "next/image";
import { ShoppingCart, Trash2, X, Plus, Minus, MapPin } from "lucide-react";
import type { CartItem } from "@/lib/checkout";

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
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = pndDeliveryRate !== null ? subtotal + pndDeliveryRate : null;

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
      {/* Header */}
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

      {/* Cart items */}
      <div className="space-y-4 my-5 max-h-72  pr-1">
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
              <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {item.quantity}
              </label>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <label className="text-gray-900 line-clamp-1">{item.name}</label>
              <label className=" text-gray-500 mt-0.5 line-clamp-1">
                {item.variant}
              </label>
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
              <label className="text-gray-900 ">
                NPR {(item.price * item.quantity).toFixed(2)}
              </label>
              {item.quantity > 1 && (
                <label className=" text-gray-400 mt-0.5">
                  {item.price.toFixed(2)} each
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t border-gray-200 pt-5">
        <div className="flex justify-between text-gray-700">
          <label>Subtotal</label>
          <label>NPR {subtotal.toFixed(2)}</label>
        </div>

        <div className="flex justify-between text-gray-700 items-center">
          <label>Delivery</label>
          <label>
            {pndDeliveryRate !== null ? (
              <span className="text-gray-900">
                NPR {Number(pndDeliveryRate).toFixed(2)}
              </span>
            ) : (
              <span className="text-gray-400 ">Select delivery branch</span>
            )}
          </label>
        </div>

        {/* Delivery branch badge */}
        {selectedBranch && (
          <div className="mt-4 flex items-center gap-2 p-2 bg-gray-100 rounded-xl border border-gray-100">
            <MapPin size={24} className="text-gray-400 flex-shrink-0" />
            <label className=" text-gray-600">
              Delivery to {selectedBranch}
            </label>
          </div>
        )}

        <div className="flex justify-between border-t border-gray-200 pt-4">
          <p className="font-semibold text-gray-900">Total</p>
          <div className="text-right">
            {total !== null ? (
              <p className="font-bold text-xl text-gray-900">
                NPR {total.toFixed(2)}
              </p>
            ) : (
              <>
                <p className="font-bold text-xl text-gray-900">
                  NPR {subtotal.toFixed(2)}
                </p>
                <p className="text-gray-400  block">+ delivery</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
