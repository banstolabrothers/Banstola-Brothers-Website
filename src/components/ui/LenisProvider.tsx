"use client";

/**
 * LenisProvider — smooth scroll with page transition awareness
 *
 * Uses useContext directly (not useTransitionContext) so it never throws
 * even if rendered outside <TransitionProvider>. It degrades gracefully:
 * if no TransitionContext is found, Lenis runs normally without pause/resume.
 */

import Lenis from "lenis";
import { useEffect, useRef, useContext } from "react";
import { usePathname } from "next/navigation";
import { TransitionContext } from "@/components/transition/TransitionContext";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Safe — returns null instead of throwing if outside TransitionProvider
  const ctx = useContext(TransitionContext);
  const phase = ctx?.phase ?? "idle";

  const lenisRef = useRef<Lenis | null>(null);

  // ── Bootstrap Lenis once ──────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    let stopped = false;

    function raf(time: number) {
      if (stopped) return;
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      stopped = true;
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ── Pause Lenis while curtain is active ───────────────────────────────────
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (phase !== "idle") {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [phase]);

  // ── Reset scroll on route change (while curtain is closed) ───────────────
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
