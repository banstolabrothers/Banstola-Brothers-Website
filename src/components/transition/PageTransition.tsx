"use client";

/**
 * PageTransition — curtain wipe for both initial load and link-click navigation
 *
 * ── Initial load (first paint) ────────────────────────────────────────────────
 *
 *  TransitionContext starts with phase = "covering", so the curtain is already
 *  covering the screen before React even renders the page. On first mount,
 *  PageTransition detects isFirstMount + phase = "covering" and immediately
 *  starts the title-read → reveal sequence WITHOUT waiting for a pathname change.
 *
 *  Flow:
 *    Mount → step = "covering" (curtain already down) → poll document.title
 *    → title found → chars animate in → hold → chars exit
 *    → onCharsExited → beginReveal() → curtain falls off bottom → idle
 *
 * ── Link-click navigation (subsequent) ───────────────────────────────────────
 *
 *  Same as before: phase goes covering → route pushes → pathname changes
 *  → new page mounts → title poll → chars → reveal → idle
 *
 * ── globals.css ───────────────────────────────────────────────────────────────
 *
 *  Add this to avoid React 19 <style> tag warning:
 *
 *    @media (prefers-reduced-motion: reduce) {
 *      [data-pt-curtain], [data-pt-content] {
 *        transition-duration: 0ms !important;
 *      }
 *    }
 */

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, cubicBezier } from "motion/react";
import { useTransitionContext, COVER_MS, REVEAL_MS } from "./TransitionContext";

// ─── Timing ───────────────────────────────────────────────────────────────────
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

// ─── Variants ─────────────────────────────────────────────────────────────────
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

// ─── TitleChars ───────────────────────────────────────────────────────────────
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

// ─── PageTransition ───────────────────────────────────────────────────────────
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { phase, beginReveal } = useTransitionContext();

  const [displayChildren, setDisplayChildren] = useState(children);
  const pendingChildren = useRef(children);

  // Tracks whether we are in the very first mount
  const isFirstMount = useRef(true);

  useEffect(() => {
    pendingChildren.current = children;
  }, [children]);

  const [step, setStep] = useState<Step>(
    // Mirror initial phase — if context starts covering, curtain is already down
    "covering",
  );
  const [overlayTitle, setOverlayTitle] = useState("");
  const [showTitle, setShowTitle] = useState(false);

  const stepRef = useRef<Step>("covering");
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

  // ── Title poll + read sequence (shared by initial load and link-click) ────
  const startTitleSequence = useCallback(() => {
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
  }, [go, stopAll]);

  // ── Initial load: curtain is already down, start title sequence immediately ─
  useEffect(() => {
    // Only runs once on first mount
    if (!isFirstMount.current) return;
    isFirstMount.current = false;

    // Context starts as "covering" — curtain is already covering the screen.
    // Start reading the title immediately, no need to wait for pathname change.
    startTitleSequence();

    return stopAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps — runs exactly once on mount

  // ── Subsequent navigations: phase changes from link clicks ────────────────
  useEffect(() => {
    if (phase === "covering" && !isFirstMount.current && step === "idle") {
      // Link-click transition: curtain has just covered, step needs to catch up
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

  // ── Pathname change: new page mounted behind curtain ─────────────────────
  useEffect(() => {
    // Skip the very first pathname — handled by the initial mount effect above
    if (isFirstMount.current) return;

    // Swap children while curtain is closed
    setDisplayChildren(pendingChildren.current);
    startTitleSequence();

    return stopAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── ACT 3 gate: fires after all chars have exited ────────────────────────
  const onCharsExited = useCallback(() => {
    if (!titleWasShown.current) return;
    stopAll();
    go("exiting");
    beginReveal();
  }, [beginReveal, go, stopAll]);

  // ── Curtain position ──────────────────────────────────────────────────────
  //  idle      → translateY(-100%) parked above viewport
  //  covering  → translateY(0%)    fully covers screen
  //  waiting   → translateY(0%)    held while reading title
  //  reading   → translateY(0%)    chars animating
  //  exiting   → translateY(100%)  falls off bottom
  const curtainY =
    step === "idle"
      ? "-100%"
      : step === "exiting" || phase === "revealing"
        ? "100%"
        : "0%";

  // Content is hidden while curtain is covering or revealing
  const contentHidden = phase !== "idle";

  return (
    <div className="relative min-h-dvh">
      {/* ── Page content ───────────────────────────────────────────────────── */}
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

      {/* ── Curtain ──────────────────────────────────────────────────────────
          Starts at translateY(0%) on first paint — already covering the screen.
          Falls to translateY(100%) during reveal — slides off the bottom.
          Returns to translateY(-100%) at idle — parked above viewport.

          On initial load: no transition on the initial cover position
          (it's already there). Only the reveal gets an animated transition.
      ─────────────────────────────────────────────────────────────────────── */}
      <div
        data-pt-curtain
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[9999] h-dvh"
        style={{
          transform: `translateY(${curtainY})`,
          transition:
            step === "idle" || (step === "covering" && isFirstMount.current)
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
