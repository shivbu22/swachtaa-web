import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setupSiteAnimations(root: HTMLElement, reduceMotion: boolean) {
  const ctx = gsap.context(() => {
    if (reduceMotion) {
      gsap.set("[data-reveal]", { clearProps: "all", opacity: 1, y: 0, x: 0, clipPath: "inset(0 0 0 0)" });
      return;
    }

    gsap.from("[data-hero-reveal]", {
      opacity: 0,
      y: 36,
      duration: 1.1,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.55,
    });

    gsap.from("[data-hero-media]", {
      clipPath: "inset(0 0 100% 0)",
      scale: 1.08,
      duration: 1.5,
      ease: "power4.inOut",
      delay: 0.2,
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 34,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 84%",
          once: true,
        },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
      gsap.to(element, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    const loop = root.querySelector<HTMLElement>("[data-loop-track]");
    const loopSection = root.querySelector<HTMLElement>("[data-loop-section]");
    if (loop && loopSection && window.matchMedia("(min-width: 900px)").matches) {
      const distance = () => Math.max(0, loop.scrollWidth - window.innerWidth + 48);
      gsap.to(loop, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: loopSection,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 1.7, distance() * 1.25)}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }

    const signalRows = gsap.utils.toArray<HTMLElement>("[data-signal-row]");
    signalRows.forEach((row, index) => {
      gsap.from(row, {
        opacity: 0.35,
        x: index % 2 === 0 ? -18 : 18,
        duration: 0.7,
        scrollTrigger: {
          trigger: row,
          start: "top 90%",
          once: true,
        },
      });
    });

    ScrollTrigger.refresh();
  }, root);

  return () => ctx.revert();
}
