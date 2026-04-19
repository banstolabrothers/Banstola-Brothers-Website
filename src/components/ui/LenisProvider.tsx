"use client";

import Lenis from "lenis";
import { useEffect, useRef, useContext } from "react";
import { usePathname } from "next/navigation";
import { TransitionContext } from "@/components/transition/TransitionContext";
import { LenisContext } from "@/context/LenisContext"; // ← add

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const ctx = useContext(TransitionContext);
  const phase = ctx?.phase ?? "idle";
  const lenisRef = useRef<Lenis | null>(null);

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

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (phase !== "idle") {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [phase]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenisRef}>
      {" "}
      {/* ← wrap */}
      {children}
    </LenisContext.Provider>
  );
}
