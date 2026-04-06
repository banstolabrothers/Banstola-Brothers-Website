"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Section = {
  type: "major" | "minor";
  progress: number;
  element: HTMLElement | null;
  title: string;
};

type Props = {
  /** Show the minimap lines panel. Default: true */
  showMinimap?: boolean;
  /** Show the horizontal orange progress line. Default: true */
  showProgressLine?: boolean;
  /** Show the % badge on the progress line. Default: true */
  showPercentage?: boolean;
  /** Show the arrow on the progress line. Default: true */
  showArrow?: boolean;
  /** Show the hover cursor indicator. Default: true */
  showHoverIndicator?: boolean;
  /** Accent color used for the progress line, arrow, and badge. Default: "#e73226" */
  accentColor?: string;
  /** Color of major heading lines. Default: neutral-900 via Tailwind */
  majorLineColor?: string;
  /** Color of minor heading lines. Default: neutral-400 via Tailwind */
  minorLineColor?: string;
};

export default function ScrollProgressMinimap({
  showMinimap = true,
  showProgressLine = true,
  showPercentage = true,
  showArrow = true,
  showHoverIndicator = true,
  accentColor = "#e73226",
  majorLineColor,
  minorLineColor,
}: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const minimapRef = useRef<HTMLDivElement>(null);

  const findSections = useCallback(() => {
    const headings =
      document.querySelectorAll<HTMLHeadingElement>("h1, h2, h3");
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const sectionData: Section[] = Array.from(headings).map((heading) => {
      const scrollTop = window.scrollY;
      const elementTop = heading.getBoundingClientRect().top + scrollTop;
      const progress =
        documentHeight > 0 ? Math.min(elementTop / documentHeight, 1) : 0;

      return {
        type: heading.tagName === "H1" ? "major" : "minor",
        progress,
        element: heading,
        title: heading.textContent ?? "",
      };
    });

    sectionData.push({
      type: "major",
      progress: 1,
      element: null,
      title: "End",
    });
    setSections(sectionData);
  }, []);

  useEffect(() => {
    findSections();
    const handleResize = () => setTimeout(findSections, 100);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [findSections]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(Math.min(Math.max(scrollPercent, 0), 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const calculateScale = (sectionProgress: number, index: number): number => {
    if (isHovering) {
      const distance = Math.abs(hoverPosition - index / (sections.length - 1));
      const maxDistance = 0.2;
      if (distance <= maxDistance) {
        return 1 + 1.5 * (1 - distance / maxDistance);
      }
      return 1;
    }
    const distance = Math.abs(scrollProgress - sectionProgress);
    const maxDistance = 0.15;
    if (distance <= maxDistance) {
      return 1 + 1 * (1 - distance / maxDistance);
    }
    return 1;
  };

  const calculateOpacity = (sectionProgress: number, index: number): number => {
    if (isHovering) {
      const distance = Math.abs(hoverPosition - index / (sections.length - 1));
      const maxDistance = 0.25;
      if (distance <= maxDistance) {
        return 0.2 + 0.8 * (1 - distance / maxDistance);
      }
      return 0.2;
    }
    const distance = Math.abs(scrollProgress - sectionProgress);
    const maxDistance = 0.2;
    if (distance <= maxDistance) {
      return 0.3 + 0.7 * (1 - distance / maxDistance);
    }
    return 0.3;
  };

  const handleSectionClick = (section: Section) => {
    if (section.element) {
      const elementTop =
        section.element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementTop - 100, behavior: "smooth" });
    } else if (section.progress === 1) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!minimapRef.current || sections.length === 0) return;
    const rect = minimapRef.current.getBoundingClientRect();
    const normalized = Math.max(
      0,
      Math.min(1, (e.clientY - rect.top) / rect.height),
    );
    setHoverPosition(normalized);
  };

  if (sections.length === 0) return null;
  if (!showMinimap && !showProgressLine) return null;

  const baseHeight = sections.length * 9.35;
  const padding = baseHeight * 0.1;
  const totalHeight = baseHeight;
  const startOffset = padding;

  return (
    <div className="fixed left-[40px] top-1/2 -translate-x-1/2 -translate-y-1/2 flex z-50">
      {/* Minimap Lines */}
      {showMinimap && (
        <div
          ref={minimapRef}
          className="flex flex-col h-fit mx-8 gap-2 py-8"
          style={{
            paddingTop: `${startOffset}px`,
            paddingBottom: `${startOffset}px`,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setHoverPosition(0);
          }}
        >
          {sections.map((section, index) => (
            <div
              key={index}
              className={`h-[1.5px] origin-left cursor-pointer ${
                section.type === "major" ? "w-10" : "w-6"
              } ${
                !majorLineColor && !minorLineColor
                  ? section.type === "major"
                    ? "bg-neutral-900 hover:bg-brand-500"
                    : "bg-neutral-400 hover:bg-brand-400"
                  : ""
              }`}
              style={{
                ...(section.type === "major" && majorLineColor
                  ? { background: majorLineColor }
                  : {}),
                ...(section.type === "minor" && minorLineColor
                  ? { background: minorLineColor }
                  : {}),
                transform: `scaleX(${calculateScale(section.progress, index)})`,
                opacity: calculateOpacity(section.progress, index),
                transition: isHovering
                  ? "transform 0.1s ease-out, opacity 0.1s ease-out"
                  : "transform 0.05s ease-out, opacity 0.05s ease-out",
              }}
              onClick={() => handleSectionClick(section)}
              title={section.title}
            />
          ))}
        </div>
      )}

      {/* Progress Line */}
      {showProgressLine && (
        <div
          className="absolute flex h-px w-screen left-8 pointer-events-none max-md:left-0"
          style={{
            background: accentColor,
            transform: `translateY(${startOffset + scrollProgress * totalHeight}px)`,
            transition: "transform 0.05s ease-out",
          }}
        >
          {showArrow && (
            <svg
              width="10"
              height="8"
              viewBox="0 0 7 6"
              fill="none"
              className="-translate-y-[3px] -ml-4 -rotate-90 max-md:hidden"
            >
              <path
                d="M3.54688 6L0.515786 0.75L6.57796 0.75L3.54688 6Z"
                fill={accentColor}
              />
            </svg>
          )}

          {showPercentage && (
            <label
              className="absolute right-32 max-sm:right-10  uppercase h-6 w-fit px-2  flex items-center text-white whitespace-nowrap cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity"
              style={{ background: accentColor }}
            >
              {Math.round(scrollProgress * 100)}%
            </label>
          )}
        </div>
      )}

      {/* Hover Cursor Indicator */}
      {showHoverIndicator && isHovering && (
        <div
          className="absolute w-2 h-px opacity-30 left-6 pointer-events-none transition-transform duration-75"
          style={{
            background: "#60a5fa",
            transform: `translateY(${startOffset + hoverPosition * totalHeight}px)`,
          }}
        />
      )}
    </div>
  );
}
