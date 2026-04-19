"use client";

/**
 * PageTransition — single-direction curtain wipe, top → bottom → off screen
 *
 * NOTE: The prefers-reduced-motion styles have been moved to globals.css.
 * React 19 throws a warning when <style> tags are rendered inside client
 * components. Add this to your globals.css:
 *
 *   @media (prefers-reduced-motion: reduce) {
 *     [data-pt-curtain],
 *     [data-pt-content] {
 *       transition-duration: 0ms !important;
 *     }
 *   }
 */

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, cubicBezier } from "motion/react";
import { useTransitionContext, COVER_MS, REVEAL_MS } from "./TransitionContext";

const CHAR_EASE_IN = cubicBezier(0.22, 1, 0.36, 1);
const CHAR_EASE_OUT: [number, number, number, number] = [0.4, 0, 1, 1];

const COVER_S = COVER_MS / 1000;
const REVEAL_S = REVEAL_MS / 1000;

const CHAR = {
  duration: 0.38,
  stagger: 0.042,
  delayFirst: 0.1,
  exitDuration: 0.16,
} as const;

const POLL_FIRST_MS = 60;
const POLL_RETRY_MS = 50;
const READING_BASE_MS = 500;
const READING_PER_CHAR_MS = 40;

const allCharsInMs = (n: number) =>
  (CHAR.delayFirst + CHAR.stagger * (n - 1) + CHAR.duration) * 1000;

const readingHoldMs = (n: number) => READING_BASE_MS + READING_PER_CHAR_MS * n;

const readTitle = (): string => {
  if (typeof document === "undefined") return "";
  return document.title.split(/\s*[|–—]\s*/)[0].trim();
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: CHAR.stagger,
      delayChildren: CHAR.delayFirst,
    },
  },
  exit: { transition: { staggerChildren: 0 } },
};

const charVariants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: CHAR.duration, ease: CHAR_EASE_IN },
  },
  exit: {
    y: "110%",
    transition: { duration: CHAR.exitDuration, ease: CHAR_EASE_OUT },
  },
};

type Step = "idle" | "covering" | "waiting" | "reading" | "exiting";

function TitleChars({ title }: { title: string }) {
  return (
    <motion.h1
      aria-label={title}
      className="whitespace-nowrap text-brand-100 select-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {title.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
          }}
        >
          <motion.span
            aria-hidden="true"
            variants={charVariants}
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { phase, beginReveal } = useTransitionContext();

  const [displayChildren, setDisplayChildren] = useState(children);
  const pendingChildren = useRef(children);
  const isFirstMount = useRef(true);

  useEffect(() => {
    pendingChildren.current = children;
  }, [children]);

  const [step, setStep] = useState<Step>("idle");
  const [overlayTitle, setOverlayTitle] = useState("");
  const [showTitle, setShowTitle] = useState(false);

  const stepRef = useRef<Step>("idle");
  const titleWasShown = useRef(false);

  const go = useCallback((s: Step) => {
    stepRef.current = s;
    setStep(s);
  }, []);

  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAll = useCallback(() => {
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (phase === "covering" && step === "idle") {
      go("covering");
    }
    if (phase === "idle") {
      stopAll();
      setShowTitle(false);
      setOverlayTitle("");
      titleWasShown.current = false;
      go("idle");
    }
  }, [phase, step, go, stopAll]);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    setDisplayChildren(pendingChildren.current);
    stopAll();
    setOverlayTitle("");
    setShowTitle(false);
    titleWasShown.current = false;
    go("waiting");

    let attempts = 0;

    const poll = () => {
      if (stepRef.current !== "waiting") return;
      attempts++;
      const title = readTitle();

      if (title) {
        setOverlayTitle(title);
        go("reading");
        titleWasShown.current = true;
        setShowTitle(true);

        const totalMs =
          allCharsInMs(title.length) + readingHoldMs(title.length);
        holdTimer.current = setTimeout(() => setShowTitle(false), totalMs);
        return;
      }

      pollTimer.current = setTimeout(
        poll,
        attempts === 1 ? POLL_FIRST_MS : POLL_RETRY_MS,
      );
    };

    pollTimer.current = setTimeout(poll, POLL_FIRST_MS);
    return stopAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const onCharsExited = useCallback(() => {
    if (!titleWasShown.current) return;
    stopAll();
    go("exiting");
    beginReveal();
  }, [beginReveal, go, stopAll]);

  const curtainY =
    step === "idle"
      ? "-100%"
      : step === "exiting" || phase === "revealing"
        ? "100%"
        : "0%";

  const contentHidden = phase !== "idle";

  return (
    <div className="relative min-h-dvh">
      {/* Page content */}
      <div
        data-pt-content
        style={{
          opacity: contentHidden ? 0 : 1,
          transform: contentHidden ? "translateY(-8px)" : "translateY(0)",
          transitionProperty: "opacity, transform",
          transitionDuration: contentHidden
            ? `${COVER_S * 0.35}s, ${COVER_S * 0.35}s`
            : `${REVEAL_S * 0.6}s, ${REVEAL_S * 0.6}s`,
          transitionTimingFunction: "ease-out, ease-out",
          pointerEvents: contentHidden ? "none" : "auto",
        }}
      >
        {displayChildren}
      </div>

      {/* Curtain — parked above viewport, slides down to cover, continues off bottom */}
      <div
        data-pt-curtain
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[9999] h-dvh"
        style={{
          transform: `translateY(${curtainY})`,
          transition:
            step === "idle"
              ? "none"
              : `transform ${
                  step === "exiting" || phase === "revealing"
                    ? REVEAL_S
                    : COVER_S
                }s cubic-bezier(0.76, 0, 0.24, 1)`,
          pointerEvents:
            step !== "idle" && phase !== "revealing" ? "auto" : "none",
        }}
      >
        <div className="w-full h-full bg-brand-500 flex items-center justify-center">
          <div>
            <AnimatePresence mode="wait" onExitComplete={onCharsExited}>
              {showTitle && overlayTitle ? (
                <TitleChars key={overlayTitle} title={overlayTitle} />
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
