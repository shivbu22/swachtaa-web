"use client";

import { useRef } from "react";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

export function MagneticLink({
  children,
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(event: MouseEvent<HTMLAnchorElement>) {
    const element = ref.current;
    if (!element || window.matchMedia("(pointer: coarse)").matches) return;

    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - (bounds.left + bounds.width / 2)) * 0.12;
    const y = (event.clientY - (bounds.top + bounds.height / 2)) * 0.12;
    element.style.setProperty("--magnetic-x", `${x}px`);
    element.style.setProperty("--magnetic-y", `${y}px`);
  }

  function reset() {
    ref.current?.style.setProperty("--magnetic-x", "0px");
    ref.current?.style.setProperty("--magnetic-y", "0px");
  }

  return (
    <a ref={ref} className={`magnetic-link ${className}`} onMouseMove={handleMove} onMouseLeave={reset} {...props}>
      {children}
    </a>
  );
}
