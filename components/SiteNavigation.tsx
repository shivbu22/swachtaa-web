"use client";

import { useEffect, useRef, useState } from "react";
import { MagneticLink } from "./MagneticLink";

const links = [
  { label: "The loop", href: "#the-loop" },
  { label: "For operators", href: "#operators" },
  { label: "Our approach", href: "#approach" },
];

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => navRef.current?.classList.toggle("site-nav--scrolled", window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    window.dispatchEvent(new CustomEvent("swachta:menu", { detail: { open } }));
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const close = () => setOpen(false);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "Tab") {
        const items = [toggleRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a, button") ?? [])].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const desktop = window.matchMedia("(min-width: 900px)");
    desktop.addEventListener("change", close);
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.classList.remove("menu-open");
      window.dispatchEvent(new CustomEvent("swachta:menu", { detail: { open: false } }));
      window.removeEventListener("keydown", handleKey);
      desktop.removeEventListener("change", close);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <header ref={navRef} className={`site-nav ${open ? "is-open" : ""}`}>
      <a className="wordmark" href="#top" onClick={() => setOpen(false)} aria-label="Swachta home" inert={open}>
        <span className="wordmark__symbol" aria-hidden="true"><i /><i /><i /></span>
        <span>swachta</span>
      </a>
      <nav className="site-nav__links" aria-label="Main navigation">
        {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
      </nav>
      <MagneticLink className="nav-cta" href="#start">Plan a pilot <span aria-hidden="true">↗</span></MagneticLink>
      <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true" /><span aria-hidden="true" />
      </button>
      <div ref={menuRef} className="mobile-navigation" id="mobile-navigation" role={open ? "dialog" : undefined} aria-modal={open ? true : undefined} aria-label="Site menu" aria-hidden={!open} inert={!open} data-lenis-prevent>
        <div className="mobile-navigation__inner">
          <p>Move the work forward</p>
          <nav aria-label="Mobile navigation">
            {links.map((link, index) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{link.label}</a>)}
          </nav>
          <a className="mobile-navigation__contact" href="#start" onClick={() => setOpen(false)}>Plan a pilot <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </header>
  );
}
