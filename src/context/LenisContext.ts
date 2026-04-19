import { createContext, useContext } from "react";
import Lenis from "lenis";

export const LenisContext = createContext<React.RefObject<Lenis | null> | null>(
  null,
);

export const useLenis = () => useContext(LenisContext);
