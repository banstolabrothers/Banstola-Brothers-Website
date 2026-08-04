"use client";

/**
 * PageTransition — curtain wipe for both initial load and link-click navigation
 *
 * ── Initial load (first paint) ────────────────────────────────────────────────
 *
 *  Curtain starts ALREADY COVERING the viewport (translateY(0%)) on the very
 *  first render — no animated sweep-in. There is nothing behind it yet worth
 *  protecting from a sweep, so we skip straight to the title-read sequence.
 *  This avoids the brief flash of underlying content that occurred when the
 *  curtain used to start parked off-screen and animate down into place.
 *
 *  Flow:
 *    Mount → curtain already covering (step="covering") → title poll
 *    → title found → chars animate in → hold → chars exit → onCharsExited
 *    → beginReveal() → curtain slides off bottom (top-to-bottom reveal edge)
 *    → idle
 *
 * ── Link-click navigation (subsequent) ───────────────────────────────────────
 *
 *  Same idea, driven by TransitionContext: phase goes covering → route pushes
 *  → pathname changes → new page mounts → title poll → chars → reveal → idle
 *  Here the curtain DOES animate down to cover (there's a live page to hide).
 *
 * ── Long-title handling ──────────────────────────────────────────────────────
 *
 *  Title is split into words; words stay unbreakable (nowrap) but real spaces
 *  sit between them so the browser can wrap onto multiple lines. Width/margin/
 *  padding for the wrapping box are controlled purely via CSS on
 *  [data-pt-title-wrap] in globals.css. Reading hold time is capped so a very
 *  long title (70-80 words) doesn't produce a multi-second stall.
 *
 * ── globals.css ───────────────────────────────────────────────────────────────
 *
 *  Requires (already added):
 *
 *    @media (prefers-reduced-motion: reduce) {
 *      [data-pt-curtain], [data-pt-content] {
 *        transition-duration: 0ms !important;
 *      }
 *    }
 *
 *    [data-pt-title-wrap] { ... responsive width/margin/padding rules ... }
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
  duration: 0.24,
  stagger: 0.016,
  delayFirst: 0.08,
  exitDuration: 0.16,
} as const;

const POLL_FIRST_MS = 60;
const POLL_RETRY_MS = 50;
const READING_BASE_MS = 500;
const READING_PER_CHAR_MS = 40;
const READING_MAX_MS = 2600; // hard ceiling so long titles don't stall for seconds

const allCharsInMs = (n: number) =>
  (CHAR.delayFirst + CHAR.stagger * (n - 1) + CHAR.duration) * 1000;

const readingHoldMs = (n: number) =>
  Math.min(READING_BASE_MS + READING_PER_CHAR_MS * n, READING_MAX_MS);

const readTitle = (): string => {
  if (typeof document === "undefined") return "";
  return document.title.split(/\s*[|–—]\s*/)[0].trim();
};

// ─── Variants ─────────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {},
  exit: {},
};

const charVariants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: {
      duration: CHAR.duration,
      ease: CHAR_EASE_IN,
      delay: CHAR.delayFirst + CHAR.stagger * i,
    },
  }),
  exit: {
    y: "110%",
    transition: { duration: CHAR.exitDuration, ease: CHAR_EASE_OUT },
  },
};

type Step = "idle" | "covering" | "waiting" | "reading" | "exiting";

// ─── TitleChars ───────────────────────────────────────────────────────────────
function TitleChars({ title }: { title: string }) {
  // Preserve whitespace runs as their own tokens so real spaces stay between words
  const tokens = title.split(/(\s+)/).filter(Boolean);
  let charIndex = 0; // running index over visible chars only — drives stagger delay

  return (
    <motion.h1
      aria-label={title}
      className="text-brand-100 select-none"
      style={{
        whiteSpace: "normal",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        textAlign: "center",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {tokens.map((token, tIdx) => {
        const isSpace = /^\s+$/.test(token);

        if (isSpace) {
          // Real space — the only thing giving the browser a legal line-break point
          return <span key={tIdx}>{token}</span>;
        }

        return (
          <span
            key={tIdx}
            style={{
              display: "inline-block",
              whiteSpace: "nowrap", // keeps this one word atomic
              verticalAlign: "bottom",
            }}
          >
            {token.split("").map((char, cIdx) => {
              const idx = charIndex++;
              return (
                <span
                  key={cIdx}
                  style={{
                    display: "inline-block",
                    overflow: "hidden",
                    verticalAlign: "bottom",
                  }}
                >
                  <motion.span
                    aria-hidden="true"
                    custom={idx}
                    variants={charVariants}
                    style={{ display: "inline-block" }}
                  >
                    {char}
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
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

  // Tracks whether we are in the very first mount. Flipped to false on the
  // frame right after mount (via rAF), which is early enough to let the
  // pathname-change effect below skip itself on the initial commit, but
  // without gating anything on an animation this time (there isn't one).
  const isFirstMount = useRef(true);

  useEffect(() => {
    pendingChildren.current = children;
  }, [children]);

  // Local step starts "covering" — curtain is ALREADY covering the viewport
  // on first paint (translateY(0%)). No animated sweep-in on load: there's
  // nothing behind it yet worth protecting from a sweep, and starting here
  // avoids a frame (or few) where both the curtain and the page content are
  // invisible at once, which is what caused the old "flash of landing page"
  // before the curtain finished sliding down.
  const [step, setStep] = useState<Step>("covering");
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

        // Use visible-char count (spaces excluded) for both timing calcs —
        // spaces no longer animate, so they shouldn't inflate the hold time.
        const visibleLen = title.replace(/\s+/g, "").length;
        const totalMs = allCharsInMs(visibleLen) + readingHoldMs(visibleLen);
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

  // ── Initial load: curtain is ALREADY covering (step starts "covering"),
  //    so there's nothing to sweep — go straight into the title read
  //    sequence as soon as we mount. ──────────────────────────────────────
  useEffect(() => {
    startTitleSequence();

    // Defer flipping isFirstMount to the next frame — NOT synchronously —
    // so the pathname-change effect below (which also fires on this same
    // initial commit) still sees isFirstMount.current === true and skips
    // itself, avoiding a duplicate startTitleSequence() call for the same
    // initial route.
    const raf = requestAnimationFrame(() => {
      isFirstMount.current = false;
    });

    return () => {
      cancelAnimationFrame(raf);
      stopAll();
    };
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
          covering (initial): translateY(0%) from the very first paint —
                               no sweep-in animation, just already there.
          covering (link-click): animates from idle's -100% down to 0% —
                               this IS a visible sweep, because there's a
                               live page underneath worth wiping away.
          exiting:  translateY(100%)  — slides further down, off the bottom
                                        (top→bottom reveal edge)

          Only "idle" itself is unanimated (transition: none), since that's
          the instant reset back to the parked position after a full cycle
          completes, ready for the next link-click's animated sweep-in.
      ─────────────────────────────────────────────────────────────────────── */}
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
          <div data-pt-title-wrap>
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
