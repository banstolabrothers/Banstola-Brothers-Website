"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { ReviewItem } from "@/types/review";
import { getInitials } from "@/lib/reviewUtils";
import ReviewList from "@/components/review/ReviewList";
import { useLenis } from "@/context/LenisContext";

interface RepeatCustomerModalProps {
  username: string;
  reviews: ReviewItem[];
  onClose: () => void;
}

const RepeatCustomerModal = ({
  username,
  reviews,
  onClose,
}: RepeatCustomerModalProps) => {
  const lenisRef = useLenis();
  const bodyRef = useRef<HTMLDivElement>(null);

  // ── Stop Lenis + block native scroll on backdrop ──
  useEffect(() => {
    const lenis = lenisRef?.current;
    lenis?.stop();

    // Block wheel/touch on document so backdrop is never scrollable
    const preventScroll = (e: Event) => e.preventDefault();
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      lenis?.start();
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [lenisRef]);

  // ── Allow wheel/touch only when cursor is over the modal body ──
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const allowScroll = (e: WheelEvent | TouchEvent) => {
      // Only stop propagation — let the browser handle the scroll inside el
      e.stopPropagation();
    };

    el.addEventListener("wheel", allowScroll, { passive: true });
    el.addEventListener("touchmove", allowScroll, { passive: true });

    return () => {
      el.removeEventListener("wheel", allowScroll);
      el.removeEventListener("touchmove", allowScroll);
    };
  }, []);

  // ── Escape key ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-brand-50 rounded-4xl flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center px-6 py-5 text-brand-900 gap-3">
          <h5 className=" leading-tight">
            {username} ({reviews.length} review
            {reviews.length !== 1 ? "s" : ""})
          </h5>
        </div>

        {/* ── Scrollable body — wheel events captured here, never reach backdrop ── */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto p-4">
          <ReviewList reviews={reviews} totalReviews={reviews.length} />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default RepeatCustomerModal;
