"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import gsap from "gsap";
import { WebGLPageTransition } from "@/lib/WebGLPageTransition";

// ── Global transition color ───────────────────────────────────────────────────
// Change this one value to update the dissolve color across the entire site.
export const TRANSITION_COLOR = "#e73226";

// ── Context ───────────────────────────────────────────────────────────────────
type TransitionContextType = {
  triggerTransition: (href: string) => void;
  isTransitioning: boolean;
};

const TransitionContext = createContext<TransitionContextType>({
  triggerTransition: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function TransitionProvider({
  children,
  router,
}: {
  children: ReactNode;
  router: (path: string) => void;
}) {
  const webglRef = useRef<WebGLPageTransition | null>(null);
  const rafRef = useRef<number>(0);
  const isTransitioningRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      webglRef.current = new WebGLPageTransition(TRANSITION_COLOR);
    } catch (e) {
      console.warn("WebGL not available, transitions disabled:", e);
      return;
    }

    const animate = () => {
      webglRef.current?.render();
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => webglRef.current?.onResize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      webglRef.current?.destroy();
      webglRef.current = null;
    };
  }, []);

  const triggerTransition = useCallback(
    (href: string) => {
      if (isTransitioningRef.current) return;

      if (!webglRef.current) {
        router(href);
        return;
      }

      isTransitioningRef.current = true;
      setIsTransitioning(true);

      const canvas = document.getElementById(
        "webgl-canvas",
      ) as HTMLElement | null;
      if (canvas) gsap.set(canvas, { opacity: 1, visibility: "visible" });

      const uniforms = webglRef.current.material.uniforms;

      const tl = gsap.timeline();

      // ── Phase 1: dissolve IN (0 → 1s) ──────────────────────────────────────
      // router.push fires at 70% of the dissolve-in (0.7s),
      // while the screen is mostly covered. This gives Next.js ~0.3s
      // to start loading the new page before the dissolve-out begins.
      tl.to(uniforms.uProgress, {
        value: -0.75,
        duration: 1.25,
        ease: "power1.in",
        onUpdate: function () {
          // Fire router.push once at 70% progress (uProgress ≈ 0.225)
          // uProgress goes 1.5 → -0.75, total range = 2.25
          // 70% of the way = 1.5 - (2.25 * 0.7) = -0.075
          if (!tl.data?.navigated && uniforms.uProgress.value <= -0.075) {
            tl.data = { ...tl.data, navigated: true };
            router(href);
          }
        },
      });

      // ── Phase 2: dissolve OUT (starts right after IN, no delay) ────────────
      // No delay — start immediately. The new page has had ~0.3s to load
      // while we were finishing the dissolve-in.
      tl.to(uniforms.uProgress, {
        value: 1.5,
        duration: 2.0,
        ease: "power1.out",
        onComplete: () => {
          if (canvas) gsap.set(canvas, { opacity: 0, visibility: "hidden" });
          isTransitioningRef.current = false;
          setIsTransitioning(false);
          tl.kill();
        },
      });
    },
    [router],
  );

  return (
    <TransitionContext.Provider value={{ triggerTransition, isTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
}
