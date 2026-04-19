"use client";

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

// Exported so consumers can use useContext(TransitionContext) directly,
// allowing safe optional access without throwing.
export const TransitionContext = createContext<TransitionContextValue | null>(
  null,
);

// Strict hook — throws if used outside provider. Use for components that
// REQUIRE the transition system (PageTransition, TransitionLink).
export function useTransitionContext() {
  const ctx = useContext(TransitionContext);
  if (!ctx)
    throw new Error("useTransitionContext must be inside <TransitionProvider>");
  return ctx;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const startTransition = useCallback(
    (href: string) => {
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
