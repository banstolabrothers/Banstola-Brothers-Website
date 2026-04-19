import { useEffect } from "react";
import Lenis from "lenis";

export const useLenisLock = () => {
  useEffect(() => {
    // Find the active Lenis instance via its RAF wrapper on the window
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, []);
};
