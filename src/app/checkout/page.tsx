"use client";
import { useState, useCallback, useEffect } from "react";
import { Check, ChevronLeft, Loader2, XIcon } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import { InputField, ComboSelectField } from "@/components/ui/InputField";
import { createOrder } from "@/lib/pickndropService";
import type { OrderResult } from "@/lib/pickndropService";
import StepCard from "@/components/checkout/StepCard";
import OrderSummary from "@/components/checkout/OrderSummary";
import OrderSuccessCard from "@/components/checkout/OrderSuccessCard";
import { usePicknDrop } from "./_hooks/usePicknDrop";
import { INITIAL_FORM } from "@/lib/constants";
import type { CheckoutFormData, FormErrors } from "@/lib/checkout";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // ── Cart ──────────────────────────────────────────────────────────────────
  // Sourced from CartContext (localStorage-backed) instead of demo data.
  const {
    items: cartItems,
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    clearCart: handleClearCart,
    subtotal: cartSubtotal,
    hydrated: cartHydrated,
  } = useCart();

  // ── Form ──────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setFormData((p) => {
        // Picking a different branch invalidates whatever area was
        // selected under the previous branch — clear it so the customer
        // can't submit an area that doesn't belong to the branch they
        // just switched to.
        if (name === "pndBranch" && value !== p.pndBranch) {
          return { ...p, pndBranch: value, pndArea: "" };
        }
        return { ...p, [name]: value };
      });
      if (errors[name as keyof FormErrors]) {
        setErrors((p) => ({ ...p, [name]: "" }));
      }
    },
    [errors],
  );

  // ── Pick & Drop ───────────────────────────────────────────────────────────
  // `destinations` is one entry per real branch (label = branch name only,
  // e.g. "Kathmandu Valley"). Each destination also carries `areas`: the
  // individual localities under that branch (Thamel, Basantapur, ...),
  // parsed out of Pick & Drop's raw data — see usePicknDrop.ts. Nothing
  // auto-selects; both fields start empty until the customer picks.
  const {
    destinations,
    loading: initLoading,
    error: initError,
    scanProgress,
  } = usePicknDrop();
  const branchLabels = destinations.map((d) => d.label);
  const selectedDestination = destinations.find(
    (d) => d.label === formData.pndBranch,
  );
  const areaOptions = selectedDestination?.areas ?? [];
  const deliveryRate = selectedDestination?.deliveryAmount ?? null;
  const codAmount =
    deliveryRate !== null
      ? Math.round(cartSubtotal + deliveryRate)
      : Math.round(cartSubtotal);

  // ── Validation ────────────────────────────────────────────────────────────
  const validateStep = (step: number): boolean => {
    const e: FormErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim()) e.firstName = "First name is required";
      if (!formData.lastName.trim()) e.lastName = "Last name is required";
      if (!formData.phone.trim()) e.phone = "Phone number is required";
      else if (!/^[0-9]{10}$/.test(formData.phone))
        e.phone = "Please enter a valid 10-digit phone number";
    } else if (step === 2) {
      if (!formData.pndBranch) e.pndBranch = "Please select a delivery branch";
      // Only require an area/locality when the selected branch actually
      // has parsed localities to choose from.
      if (formData.pndBranch && areaOptions.length > 0 && !formData.pndArea)
        e.pndArea = "Please select your area / locality";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps((p) =>
        p.includes(currentStep) ? p : [...p, currentStep],
      );
      setCurrentStep(currentStep + 1);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  // Snapshot of what was ordered, kept for display after the cart is cleared.
  const [placedItems, setPlacedItems] = useState<typeof cartItems>([]);

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setIsSubmitting(true);
    setSubmitError("");

    // orderDescription: what's actually in the parcel — name, variant, qty
    // for every line item. This is the "manual" field Pick & Drop's own
    // dashboard shows to whoever handles the package, so it needs to reflect
    // the real order contents every time, not get replaced by the
    // customer's note.
    const orderDescription =
      cartItems
        .map(
          (i) =>
            `${i.name}${i.variant ? ` (${i.variant})` : ""} x${i.quantity}`,
        )
        .join(", ") || "Order from website";

    // instruction: carries ONLY the customer's own note — address, area,
    // and landmark are sent through their own dedicated fields below, so
    // they don't need to be duplicated in here.
    const instruction = formData.orderNote ? `${formData.orderNote}` : "";

    // destinationBranch: the real branch name (e.g. "Kathmandu Valley").
    // destinationCityArea: the specific locality the customer picked
    // (e.g. "Thamel") — falls back to the branch name only if the branch
    // has no parsed localities to choose from.
    const destinationBranch =
      selectedDestination?.branchName ?? formData.pndBranch;
    const destinationCityArea =
      formData.pndArea || selectedDestination?.branchName || formData.pndBranch;

    try {
      const result = await createOrder({
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        primaryMobileNo: formData.phone,
        destinationBranch,
        destinationCityArea,
        orderDescription,
        codAmount,
        instruction,
        orderType: "Regular",
        ...(formData.landmark && { landmark: formData.landmark }),
      });
      setOrderResult(result);
      setPlacedItems(cartItems); // keep a copy to show in the summary panel
      setCompletedSteps((p) => (p.includes(3) ? p : [...p, 3]));
      setCurrentStep(4);
      handleClearCart(); // order is placed — empty the cart so it doesn't linger
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !cartHydrated) return null;

  // Nothing in the cart and no order was just placed — send them back to shop
  // instead of showing an empty checkout form.
  if (cartItems.length === 0 && !orderResult) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
        <h5 className="text-gray-900">Your cart is empty</h5>
        <p className="text-gray-500 text-sm max-w-sm">
          Add something from the shop before checking out.
        </p>
        <MyButton
          type="primarybutton"
          text="Browse products"
          link="/products"
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col mx-auto min-h-screen my-auto w-full bg-white">
      {/* Header Bar */}
      <div className="flex flex-row justify-between items-center max-w-5xl w-full mx-auto px-4 py-8">
        <MyButton
          type="secondarybutton"
          leadicon={<ChevronLeft size={24} />}
          text="Go Back"
          link="/"
        />
        <MyButton
          type="secondarybutton"
          leadicon={<XIcon size={24} />}
          link="/"
        />
      </div>

      <div className="flex md:flex-row max-w-5xl w-full mx-auto gap-8 px-4 py-8">
        {/* LEFT: Steps */}
        <div className="flex flex-col w-7/12 gap-6">
          {/* Step 1 */}
          <StepCard
            stepNumber={1}
            title="Contact information"
            isActive={currentStep === 1}
            isCompleted={completedSteps.includes(1)}
            summaryText={`${formData.firstName} ${formData.lastName} · +977 ${formData.phone}`}
            onChangeClick={() => setCurrentStep(1)}
          >
            <div className="flex gap-4">
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Ramesh"
                error={errors.firstName}
                required
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Shrestha"
                error={errors.lastName}
                required
              />
            </div>
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="9800000000"
              error={errors.phone}
              required
              maxLength={10}
              prefix="+977"
            />
            <MyButton
              type="primarybutton"
              text="Next"
              onClick={handleNext}
              className="mt-4"
            />
          </StepCard>

          {/* Step 2 */}
          <StepCard
            stepNumber={2}
            title="Delivery address"
            isActive={currentStep === 2}
            isCompleted={completedSteps.includes(2)}
            summaryText={`${formData.pndBranch}${formData.pndArea ? ` · ${formData.pndArea}` : ""} · ${formData.landmark ? ` (${formData.landmark})` : ""}`}
            onChangeClick={() => setCurrentStep(2)}
          >
            {initError && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                {initError}
              </div>
            )}

            {initLoading && (
              <div className="flex flex-col gap-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Finding available delivery locations…
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {scanProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-gray-900 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Cached for 24 hours after this
                </p>
              </div>
            )}

            <ComboSelectField
              label="Delivery Branch"
              name="pndBranch"
              value={formData.pndBranch}
              onChange={handleInputChange} // works unchanged — same synthetic event shape
              options={branchLabels}
              placeholder={
                initLoading
                  ? `Scanning… (${scanProgress}%)`
                  : branchLabels.length === 0
                    ? "No delivery locations available"
                    : "Search delivery branch…"
              }
              error={errors.pndBranch}
              required
              disabled={initLoading}
            />

            {/* Area / Locality: only meaningful once a branch is picked
                and that branch actually has parsed localities. Hidden
                otherwise so the form doesn't show an empty, confusing
                dropdown before a branch is chosen. */}
            {formData.pndBranch && areaOptions.length > 0 && (
              <ComboSelectField
                label="Area / Locality"
                name="pndArea"
                value={formData.pndArea}
                onChange={handleInputChange}
                options={areaOptions}
                placeholder="Search your area, e.g. Thamel…"
                error={errors.pndArea}
                required
              />
            )}

            <InputField
              label="Landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              placeholder="Near temple, opposite school, etc."
              required
            />

            <MyButton
              type="primarybutton"
              text="Next"
              onClick={handleNext}
              className="mt-2"
            />
          </StepCard>

          {/* Step 3 */}
          <StepCard
            stepNumber={3}
            title="Review your order"
            isActive={currentStep === 3}
            isCompleted={completedSteps.includes(3)}
            summaryText={`COD · Rs. ${codAmount}`}
            onChangeClick={() => setCurrentStep(3)}
          >
            <InputField
              label="Add a note to your order"
              name="orderNote"
              type="textarea"
              value={formData.orderNote}
              onChange={handleInputChange}
              placeholder="Special instructions, delivery preferences, gift message, etc."
              rows={3}
              optional
            />

            <div className="w-full flex flex-col gap-2">
              <label className="text-gray-900">Payment Method</label>
              <div className="p-4 border-2 border-brand-500 rounded-xl bg-brand-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-500 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h5 className="text-brand-900">Cash on Delivery (COD)</h5>
                    <label className="text-brand-900/70 text-sm">
                      Pay when you receive your order
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="p-4 bg-red-50 rounded-2xl text-red-700 text-sm">
                {submitError}
              </div>
            )}

            <MyButton
              type="primarybutton"
              text={isSubmitting ? "Placing order…" : "Place My Order"}
              onClick={handleSubmit}
              className="mt-4"
              disabled={isSubmitting}
            />
          </StepCard>

          {orderResult && <OrderSuccessCard result={orderResult} />}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:sticky lg:top-4 flex flex-col w-5/12 gap-6 self-start">
          <div className="bg-white rounded-3xl border border-neutral-200 p-6">
            <OrderSummary
              cartItems={orderResult ? placedItems : cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              pndDeliveryRate={deliveryRate}
              selectedBranch={formData.pndBranch}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
