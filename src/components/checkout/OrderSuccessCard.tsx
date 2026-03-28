import { Check, ExternalLink } from "lucide-react";
import type { OrderResult } from "@/lib/pickndropService";

const ResultRow = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value?: string | number;
  mono?: boolean;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-500 text-sm">{label}</span>
    <span
      className={`text-gray-900 font-medium text-sm ${mono ? "font-mono" : ""}`}
    >
      {value ?? "—"}
    </span>
  </div>
);

const OrderSuccessCard = ({ result }: { result: OrderResult }) => (
  <div className="bg-white rounded-3xl border border-green-200 overflow-hidden w-full">
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <Check size={20} className="text-green-600" strokeWidth={3} />
        </div>
        <div>
          <h6 className="text-gray-900">Order placed successfully!</h6>
          <p className="text-gray-500 text-sm">
            Pick &amp; Drop will collect and deliver your parcel.
          </p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-3">
        <ResultRow label="Order ID" value={result.orderID} mono />
        <ResultRow
          label="Delivery charge"
          value={result.delivery_charge ? `Rs. ${result.delivery_charge}` : "—"}
        />
        <ResultRow label="Status" value={result.status} />
        {result.vendor_tracking_number && (
          <ResultRow
            label="Tracking no."
            value={result.vendor_tracking_number}
            mono
          />
        )}
      </div>
      {result.tracking_url && (
        <a
          href={result.tracking_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-brand-600 font-medium hover:underline underline-offset-2 text-sm w-fit"
        >
          <ExternalLink size={15} /> Track your parcel on Pick &amp; Drop
        </a>
      )}
    </div>
  </div>
);

export default OrderSuccessCard;
