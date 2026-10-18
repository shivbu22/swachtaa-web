"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const enterTimer = window.setTimeout(() => setVisible(true), 0);
    const exitTimer = window.setTimeout(() => setVisible(false), 900);
    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(exitTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader" aria-label="Loading Swachta" role="status">
      <div className="preloader__topline">
        <span>SWACHTA</span>
        <span>01 / 01</span>
      </div>
      <div className="preloader__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>Make every report move.</p>
    </div>
  );
}
