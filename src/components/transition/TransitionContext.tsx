"use client";

/**
 * TransitionContext
 *
 * ── Initial load transition ───────────────────────────────────────────────────
 *
 *  Phase starts as "covering" (not "idle") so the curtain is already covering
 *  the screen on first paint. PageTransition sees this, runs the title reveal
 *  sequence, then calls beginReveal() to slide the curtain off.
 *
 *  This means every hard navigation (URL entry, refresh, new tab) gets the
 *  same curtain-wipe experience as clicking a TransitionLink.
 *
 * ── Phase flow ────────────────────────────────────────────────────────────────
 *
 *  Initial load:  covering → (title reads) → revealing → idle
 *  Link click:    idle → covering → (title reads) → revealing → idle
 */

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export const COVER_MS = 500;
export const REVEAL_MS = 500;

export type Phase = "idle" | "covering" | "revealing";

interface TransitionContextValue {
  phase: Phase;
  startTransition: (href: string) => void;
  beginReveal: () => void;
}

// Named export so LenisProvider can use useContext(TransitionContext) safely
// without throwing if nesting is wrong
export const TransitionContext = createContext<TransitionContextValue | null>(
  null,
);

// Strict hook for components that require the transition system
export function useTransitionContext() {
  const ctx = useContext(TransitionContext);
  if (!ctx)
    throw new Error("useTransitionContext must be inside <TransitionProvider>");
  return ctx;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // ── Start in "covering" — curtain is already down on first paint ───────────
  // PageTransition reads this immediately and starts the initial reveal sequence.
  const [phase, setPhase] = useState<Phase>("covering");

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const startTransition = useCallback(
    (href: string) => {
      // Block mid-transition clicks
      if (phase !== "idle") return;
      clearTimer();
      setPhase("covering");
      timer.current = setTimeout(() => router.push(href), COVER_MS);
    },
    [phase, router],
  );

  const beginReveal = useCallback(() => {
    clearTimer();
    setPhase("revealing");
    timer.current = setTimeout(() => setPhase("idle"), REVEAL_MS + 60);
  }, []);

  return (
    <TransitionContext.Provider value={{ phase, startTransition, beginReveal }}>
      {children}
    </TransitionContext.Provider>
  );
}
