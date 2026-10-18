"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setupSiteAnimations } from "@/animations/site";

export function useSiteMotion() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | undefined;
    const cleanupAnimations = setupSiteAnimations(root, reduceMotion);

    if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
      });
      const onScroll = () => ScrollTrigger.update();
      const update = (time: number) => lenis?.raf(time * 1000);
      lenis.on("scroll", onScroll);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);

      return () => {
        lenis?.off("scroll", onScroll);
        gsap.ticker.remove(update);
        cleanupAnimations();
        lenis?.destroy();
      };
    }

    return cleanupAnimations;
  }, []);

  return rootRef;
}
