"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface Section {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
}

export default function LegalLayout({
  title,
  lastUpdated,
  sections,
  children,
}: LegalLayoutProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visibleMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleMap.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visibleMap.delete(entry.target.id);
          }
        });

        if (visibleMap.size === 0) return;

        const sorted = [...visibleMap.entries()].sort((a, b) => a[1] - b[1]);
        setActiveId(sorted[0][0]);
      },
      {
        rootMargin: "-10% 0px -60% 0px",
        threshold: 0,
      },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  /* ─────────────────────────────────────────────────────────────
     Auto-scroll the TOC sidebar so the active item stays visible
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!tocRef.current) return;
    const activeEl = tocRef.current.querySelector<HTMLElement>(
      "[data-active='true']",
    );
    activeEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  const scrollTo = useCallback((id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }, []);

  /* ── TOC item ── */
  const TocItem = ({ id, label }: Section) => {
    const isActive = activeId === id;
    return (
      <button
        data-active={isActive}
        onClick={() => scrollTo(id)}
        className={[
          "w-full text-left px-7 py-4 leading-snug capitalize",
          "border-l-4 transition-colors duration-[50ms]",
          "focus-visible:outline-none",
          isActive
            ? "border-brand-900 text-brand-900 bg-brand-100 font-medium cursor-pointer"
            : "border-transparent text-brand-900/50 font-normal hover:bg-brand-900/5 hover:text-brand-900 cursor-pointer",
        ].join(" ")}
      >
        <label onClick={() => scrollTo(id)} className="cursor-pointer">
          {label}
        </label>
      </button>
    );
  };

  return (
    <section className=" w-full mx-auto">
      {/* ── HERO ── */}
      <div className="p-16 bg-brand-500 text-center text-brand-100">
        <h1 className="mb-3">{title}</h1>
        <p>Last Updated: {lastUpdated}</p>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <section className="flex flex-col lg:flex-row max-w-[1440] w-full px-8 py-24 mx-auto gap-16">
        {/* ── LEFT: STICKY TOC ── */}
        <div className="hidden lg:block w-4/12 flex-shrink-0 lg:pr-2">
          <div
            ref={tocRef}
            className="sticky top-32 mb-32 max-h-[90vh] overflow-y-auto self-start"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0,0,0,0.08) transparent",
            }}
          >
            <label className=" text-brand-900">What&apos;s on this page</label>

            {/* TOC list with left border */}
            <div className="border-l-2 border-brand-900/20 mt-8 ">
              {sections.map((s) => (
                <TocItem key={s.id} {...s} />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: ARTICLE BODY ── */}
        <main className="  flex flex-col w-full lg:w-[8/12] gap-16 mb-40">
          {children}
        </main>
      </section>
    </section>
  );
}
