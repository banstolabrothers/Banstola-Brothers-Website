import React, { useMemo } from "react";
import {
  PackageOpen,
  Truck,
  PackageCheck,
  type LucideIcon,
  ShoppingBag,
} from "lucide-react";

interface ExpectationStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const fmt = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Compact range like Airbnb's "When" field:
// same month → "Aug 5 - 13", different months → "Aug 31 - Sep 1"
const fmtRange = (from: Date, to: Date) => {
  const sameMonth =
    from.getMonth() === to.getMonth() &&
    from.getFullYear() === to.getFullYear();
  if (sameMonth) {
    const month = from.toLocaleDateString("en-US", { month: "short" });
    return `${month} ${from.getDate()} - ${to.getDate()}`;
  }
  return `${fmt(from)} - ${fmt(to)}`;
};

export default function ProductDeliveryStatus() {
  const steps: ExpectationStep[] = useMemo(() => {
    const today = new Date();

    return [
      {
        icon: ShoppingBag,
        title: "Order today",
        description: fmt(today),
      },
      {
        icon: Truck,
        title: "Hand to carrier",
        description: `Today or ${fmt(addDays(today, 1))}`,
      },
      {
        icon: PackageCheck,
        title: "In your hands",
        description: `By ${fmtRange(addDays(today, 2), addDays(today, 3))}`,
      },
    ];
  }, []);

  return (
    <div className="w-full max-w-xl flex flex-col gap-1.5">
      <div className="w-full  bg-brand-900/5 rounded-4xl py-4 md:py-8 px-2 md:px-4 flex items-start ">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.title}>
              <div className="flex flex-col items-center text-center w-40 gap-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-brand-900/6  text-brand-900 shrink-0">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-brand-900/64">{step.title}</label>
                  <label className="text-brand-900">{step.description}</label>
                </div>
              </div>

              {i < steps.length - 1 && (
                <div className="flex-1 h-[2] bg-brand-900/24 mt-5 mx-1 w-full" />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <span className="text-xs text-brand-900/32">
        *Applies only to delivery locations outside Pokhara. Delivery timelines
        depend on the delivery partner; the time shown is a general
        estimate.{" "}
      </span>
    </div>
  );
}
