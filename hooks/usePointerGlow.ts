"use client";

import { useEffect, useRef } from "react";

export function usePointerGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(pointer: coarse)").matches) return;
    const glowElement = element;

    function handleMove(event: PointerEvent) {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      glowElement.style.setProperty("--pointer-x", `${x}%`);
      glowElement.style.setProperty("--pointer-y", `${y}%`);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return ref;
}
