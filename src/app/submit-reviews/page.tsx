"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import emailjs from "@emailjs/browser";
import { client } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import MyButton from "@/components/ui/MyButton";
import { XIcon, CheckCircle, ChevronLeft } from "lucide-react";
import logo from "@/assets/svg/BanstolaBrothers Primary.svg";

// ── Types ────────────────────────────────────────────────────────────────────
interface SanityProduct {
  _id: string;
  title: string;
  slug: { current: string };
  primaryImage: {
    asset: { _id: string; url: string };
    alt?: string;
  };
}

interface ReviewFormData {
  productId: string;
  productSlug: string;
  username: string;
  email: string;
  rating: number;
  review: string;
}

interface SubmittedReview {
  productTitle: string;
  productSlug: string;
  rating: number;
  username: string;
}

// ── Constants ────────────────────────────────────────────────────────────────
const EMAILJS_CONFIG = {
  serviceId: "service_l5kv1yq",
  templateId: "template_n79yl2f",
  publicKey: "-ujHVp02rbNM7BnsH",
} as const;

const INITIAL_FORM: ReviewFormData = {
  productId: "",
  productSlug: "",
  username: "",
  email: "",
  rating: 5,
  review: "",
};

const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt asc){
  _id,
  title,
  slug,
  primaryImage{ asset->{ _id, url }, alt }
}`;

// ── Sub-components ───────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="animate-pulse flex flex-col items-center justify-center my-16 gap-6">
    <div className="w-64 h-56 md:w-80 md:h-80 bg-neutral-200 rounded-2xl" />
    <div className="space-y-2 w-full max-w-md">
      <div className="h-6 bg-neutral-200 rounded-2xl w-3/4 mx-auto" />
      <div className="h-6 bg-neutral-200 rounded-2xl w-1/2 mx-auto" />
    </div>
    <div className="flex justify-center gap-4">
      {[1, 2, 3, 4, 5].map((s) => (
        <div
          key={s}
          className="w-12 h-12 md:w-16 md:h-16 bg-neutral-200 rounded-2xl"
        />
      ))}
    </div>
  </div>
);

const StarRating = ({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (r: number) => void;
}) => (
  <div className="flex justify-center md:justify-start gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="group transition-transform hover:scale-105 focus:outline-none"
        aria-label={`Rate ${star} out of 5`}
      >
        <span
          className={`text-5xl transition-colors ${
            star <= rating
              ? "text-brand-500"
              : "text-neutral-300 group-hover:text-brand-500"
          }`}
        >
          ★
        </span>
      </button>
    ))}
  </div>
);

// ── Nav ──────────────────────────────────────────────────────────────────────
const ReviewNav = ({
  currentStep,
  isPreSelected,
  onBack,
}: {
  currentStep: number;
  isPreSelected: boolean;
  onBack: () => void;
}) => (
  <div className="flex flex-row justify-between items-center">
    {/* Left: Back button on step 2 (not pre-selected), Logo otherwise */}
    {currentStep === 2 && !isPreSelected ? (
      <MyButton
        type="secondarybutton"
        text="Go Back"
        onClick={onBack}
        leadicon={<ChevronLeft size={32} />}
      />
    ) : (
      <Link href="/">
        <Image
          src={logo}
          alt="Banstola Brothers"
          className="h-6 md:h-8 w-auto"
        />
      </Link>
    )}

    {/* Right: Always X */}
    <MyButton type="secondarybutton" link="/" leadicon={<XIcon size={32} />} />
  </div>
);

// ── Step 1: Product Selector ─────────────────────────────────────────────────
const ProductSelector = ({
  products,
  onSelect,
}: {
  products: SanityProduct[];
  onSelect: (p: SanityProduct) => void;
}) => (
  <div>
    <h3 className="text-brand-900 text-center mb-16">
      Which product would you like to review?
    </h3>
    {products.length === 0 ? (
      <p className="text-center py-8 text-neutral-500">No products available</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <button
            key={product._id}
            type="button"
            onClick={() => onSelect(product)}
            className="flex flex-col gap-4 items-center border-2 border-neutral-200 rounded-4xl p-8 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-brand-500 bg-white hover:bg-brand-500/5 text-left"
          >
            <Image
              src={product.primaryImage.asset.url}
              alt={product.primaryImage.alt ?? product.title}
              width={120}
              height={120}
              className="w-32 h-32 object-cover rounded-xl"
            />
            <h4 className="text-neutral-800 font-medium">{product.title}</h4>
          </button>
        ))}
      </div>
    )}
  </div>
);

// ── Step 2: Review Form ──────────────────────────────────────────────────────
const ReviewForm = ({
  product,
  formData,
  submitting,
  canSubmit,
  onChange,
  onRating,
}: {
  product: SanityProduct;
  formData: ReviewFormData;
  submitting: boolean;
  canSubmit: boolean;
  onChange: (field: keyof ReviewFormData, value: string) => void;
  onRating: (r: number) => void;
}) => (
  <div className="flex flex-col md:flex-row justify-center gap-16">
    {/* Left: image */}
    <div className="flex flex-col gap-4 items-center md:items-start">
      <Image
        src={product.primaryImage.asset.url}
        alt={product.primaryImage.alt ?? product.title}
        width={384}
        height={384}
        className="w-[360px] md:w-96 h-auto object-cover rounded-2xl"
      />
    </div>

    {/* Right: fields */}
    <section className="flex flex-col gap-8 text-center md:text-left flex-1">
      {/* Rating */}
      <div className="flex flex-col gap-2">
        <h3 className="text-neutral-700">
          How would you rate <strong>{product.title}</strong>?
        </h3>
        <StarRating rating={formData.rating} onChange={onRating} />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <p className="text-neutral-700 text-left">
          Your Name{" "}
          <span className="text-neutral-400">(displayed publicly)</span>
        </p>
        <p>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onChange("username", e.target.value)}
            placeholder="e.g. John S."
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:border-brand-900 transition-colors"
            required
          />
        </p>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <p className="text-neutral-700 text-left">
          Your Email <span className="text-neutral-400">(kept private)</span>
        </p>
        <p>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:border-brand-900 transition-colors"
            required
          />
        </p>
      </div>

      {/* Review */}
      <div className="flex flex-col gap-2">
        <p className="text-neutral-700 text-left">
          Your Review <span className="text-neutral-400">(optional)</span>
        </p>
        <p>
          <textarea
            value={formData.review}
            onChange={(e) => onChange("review", e.target.value)}
            placeholder="Share your experience..."
            rows={5}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:border-brand-900 transition-colors resize-none"
          />
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full px-5 pt-3 pb-3.5 rounded-full text-white bg-brand-500 border-2 border-brand-900 shadow-[3px_3px_0px_0px_rgba(69,30,0,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
      >
        <p>{submitting ? "Submitting..." : "Submit Review"}</p>
      </button>
    </section>
  </div>
);

// ── Step 3: Success ──────────────────────────────────────────────────────────
const SuccessScreen = ({ review }: { review: SubmittedReview }) => (
  <div className="flex flex-col items-center justify-center gap-8 py-12 text-center">
    <CheckCircle className="text-brand-500 w-16 h-16" />
    <div className="space-y-3">
      <h2 className="text-neutral-800">Thank You, {review.username}!</h2>
      <p className="text-brand-900">
        Your review for{" "}
        <span className="font-semibold text-neutral-800">
          {review.productTitle}
        </span>{" "}
        has been submitted.
      </p>
    </div>
    <div className="bg-brand-100 rounded-2xl p-4 max-w-md">
      <p className="text-neutral-800">
        It will be published once approved by our team.
      </p>
    </div>
    <MyButton type="primarybutton" text="Back to Home" link="/" />
  </div>
);

// ── Main inner component ─────────────────────────────────────────────────────
const SubmitReviewsInner = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedReview, setSubmittedReview] =
    useState<SubmittedReview | null>(null);
  const [formData, setFormData] = useState<ReviewFormData>(INITIAL_FORM);

  useEffect(() => {
    client
      .fetch<SanityProduct[]>(PRODUCTS_QUERY)
      .then((data) => {
        setProducts(data);
        const slug = searchParams.get("product");
        if (slug) {
          const match = data.find((p) => p.slug?.current === slug);
          if (match) {
            setFormData((prev) => ({
              ...prev,
              productId: match._id,
              productSlug: match.slug.current,
            }));
            setCurrentStep(2);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  const isPreSelected = searchParams.get("product") !== null;
  const selectedProduct = products.find((p) => p._id === formData.productId);
  const canSubmit = !!formData.productId && formData.rating > 0 && !submitting;

  const handleFieldChange = (field: keyof ReviewFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductSelect = (product: SanityProduct) => {
    setFormData((prev) => ({
      ...prev,
      productId: product._id,
      productSlug: product.slug.current,
    }));
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
    setFormData(INITIAL_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          product_name: selectedProduct?.title ?? "Unknown Product",
          product_slug: formData.productSlug,
          rating: formData.rating,
          rating_stars:
            "★".repeat(formData.rating) + "☆".repeat(5 - formData.rating),
          customer_name: formData.username,
          customer_email: formData.email,
          review_text: formData.review || "No review text provided",
          submission_date: new Date().toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        EMAILJS_CONFIG.publicKey,
      );

      setSubmittedReview({
        productTitle: selectedProduct?.title ?? "",
        productSlug: formData.productSlug,
        rating: formData.rating,
        username: formData.username,
      });
      setCurrentStep(3);
    } catch (err) {
      console.error("Review submission failed:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="max-w-6xl mx-auto flex flex-col p-4 sm:p-8 gap-12">
      <ReviewNav
        currentStep={currentStep}
        isPreSelected={isPreSelected}
        onBack={handleBack}
      />

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && !isPreSelected && (
          <ProductSelector products={products} onSelect={handleProductSelect} />
        )}

        {currentStep === 2 && selectedProduct && (
          <ReviewForm
            product={selectedProduct}
            formData={formData}
            submitting={submitting}
            canSubmit={canSubmit}
            onChange={handleFieldChange}
            onRating={(r) => setFormData((prev) => ({ ...prev, rating: r }))}
          />
        )}

        {currentStep === 3 && submittedReview && (
          <SuccessScreen review={submittedReview} />
        )}
      </form>
    </div>
  );
};

// ── Export ───────────────────────────────────────────────────────────────────
export default function SubmitReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-96">
          <LoadingSkeleton />
        </div>
      }
    >
      <SubmitReviewsInner />
    </Suspense>
  );
}
