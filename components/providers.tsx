"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { SideNav } from "@/components/nav/side-nav";

type ScrollApi = {
  scrollTo: (id: string) => void;
};

const ScrollContext = createContext<ScrollApi>({
  scrollTo: (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  },
});

export function useScrollTo() {
  return useContext(ScrollContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollApi = useMemo<ScrollApi>(
    () => ({
      scrollTo(id) {
        const element = document.getElementById(id);
        if (!element) return;
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(element, { offset: 0, duration: 1.4 });
          return;
        }
        element.scrollIntoView({ behavior: "smooth" });
      },
    }),
    [],
  );

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = instance;

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <ScrollContext.Provider value={scrollApi}>
      <CustomCursor />
      <SideNav />
      {children}
    </ScrollContext.Provider>
  );
}
