"use client";
import { useEffect, useRef, useCallback } from "react";

interface AutoScrollCarouselProps {
  children: React.ReactNode[];
  /** px width of each card — needed to calculate the seamless reset point */
  cardWidth: number;
  /** px gap between cards. Must match the gap style applied to the track. Default: 16 */
  gap?: number;
  /** px per animation frame. Lower = slower. Default: 1.5 */
  speed?: number;
  className?: string;
}

export function AutoScrollCarousel({
  children,
  cardWidth,
  gap = 16,
  speed = 1.5,
  className,
}: AutoScrollCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);

  const itemCount = children.length;
  const oneSetWidth = itemCount * (cardWidth + gap);

  const animate = useCallback(() => {
    if (!pausedRef.current) {
      offsetRef.current += speed;
      if (offsetRef.current >= oneSetWidth) {
        offsetRef.current -= oneSetWidth;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [speed, oneSetWidth]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };

    const cards = Array.from(track.children);
    cards.forEach((card) => {
      card.addEventListener("mouseenter", pause);
      card.addEventListener("mouseleave", resume);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", pause);
        card.removeEventListener("mouseleave", resume);
      });
    };
  }, [children]);

  // Duplicate children for a seamless loop.
  // Wrap each copy in a keyed div so the two sets never share a key,
  // regardless of what keys the children themselves carry.
  const displayed = [
    ...children.map((child, i) => (
      <div key={`a-${i}`} className="contents">
        {child}
      </div>
    )),
    ...children.map((child, i) => (
      <div key={`b-${i}`} className="contents">
        {child}
      </div>
    )),
  ];

  return (
    <div className={`w-full overflow-hidden ${className ?? ""}`}>
      <div
        ref={trackRef}
        className="flex"
        style={{ gap, willChange: "transform" }}
      >
        {displayed}
      </div>
    </div>
  );
}
