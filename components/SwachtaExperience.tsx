"use client";

import Image from "next/image";
import { MagneticLink } from "@/components/MagneticLink";
import { Preloader } from "@/components/Preloader";
import { SiteNavigation } from "@/components/SiteNavigation";
import { usePointerGlow } from "@/hooks/usePointerGlow";
import { useSiteMotion } from "@/hooks/useSiteMotion";
import { footerLinks, loopSteps, signalRows } from "@/lib/content";
import { WorkflowDemo } from "@/components/WorkflowDemo";

export function SwachtaExperience() {
  const rootRef = useSiteMotion();
  const pointerRef = usePointerGlow();

  return (
    <div ref={rootRef} className="site-shell" id="top">
      <div ref={pointerRef} className="pointer-glow" aria-hidden="true" />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Preloader />
      <SiteNavigation />

      <main id="main-content">
        <section className="hero section-dark" aria-labelledby="hero-title">
          <div className="hero__media" data-hero-media aria-hidden="true">
            <Image
              src="/images/hero.jpg"
              alt=""
              fill
              preload
              sizes="100vw"
            />
          </div>
          <div className="hero__shade" aria-hidden="true" />
          <div className="hero__grid" aria-hidden="true" />
          <div className="container hero__content">
            <p className="eyebrow eyebrow--light" data-hero-reveal>
              Civic infrastructure for a cleaner everyday
            </p>
            <h1 id="hero-title" data-hero-reveal>
              Make every<br /><em>report</em> move.
            </h1>
            <div className="hero__lower" data-hero-reveal>
              <p className="hero__lede">
                Swachta turns the moment someone spots a problem into a clear path to resolution.
              </p>
              <div className="hero__actions">
                <MagneticLink className="button button--amber" href="#the-loop">
                  See how it works <span aria-hidden="true">↘</span>
                </MagneticLink>
                <a className="text-link text-link--light" href="#start">For pilot partners <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
          <div className="hero__meta" data-hero-reveal aria-hidden="true">
            <span>01 / 05</span>
            <span className="hero__line" />
            <span>Scroll to move through the loop</span>
          </div>
          <a className="hero__scroll" href="#intro" aria-label="Scroll to introduction">
            <span className="hero__scroll-ring" aria-hidden="true">↓</span>
            <span>Enter the system</span>
          </a>
        </section>

        <section className="intro section-paper" id="intro" aria-labelledby="intro-title">
          <div className="container intro__layout">
            <p className="eyebrow" data-reveal>01 / The premise</p>
            <div className="intro__message" data-reveal>
              <h2 id="intro-title">A cleaner place is a connected place.</h2>
              <p>
                The missing link is rarely effort. It is the space between a report and the team who can act on it.
              </p>
            </div>
            <div className="intro__aside" data-reveal>
              <span className="signal-dot" aria-hidden="true" />
              <p>One shared signal for people, operators, and the place they care for.</p>
            </div>
          </div>
        </section>

        <section className="loop-section section-moss" id="the-loop" data-loop-section aria-labelledby="loop-title">
          <div className="loop-section__head container">
            <div>
              <p className="eyebrow eyebrow--light" data-reveal>02 / The loop</p>
              <h2 id="loop-title" data-reveal>From a signal<br /><em>to a street changed.</em></h2>
            </div>
            <p className="loop-section__hint" data-reveal>
              Every step has an owner. Every owner has a next action.
            </p>
          </div>
          <div className="loop-track" data-loop-track>
            {loopSteps.map((step, index) => (
              <article className={`loop-card ${index === 0 ? "loop-card--active" : ""}`} key={step.number} data-reveal>
                <div className="loop-card__top">
                  <span>{step.number}</span>
                  <span className="loop-card__line" aria-hidden="true" />
                  <span>{step.label}</span>
                </div>
                <div className="loop-card__body">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <div className="loop-card__orb" aria-hidden="true"><span>{index + 1}</span></div>
              </article>
            ))}
          </div>
          <div className="loop-section__footer container" data-reveal>
            <span>01</span><span className="loop-progress"><i /></span><span>05</span>
          </div>
        </section>

        <WorkflowDemo />

        <section className="approach section-paper" id="approach" aria-labelledby="approach-title">
          <div className="container">
            <div className="approach__intro" data-reveal>
              <p className="eyebrow">03 / The approach</p>
              <h2 id="approach-title">Built for the space between <em>people</em> and place.</h2>
            </div>
            <div className="approach__grid">
              <div className="approach__image image-frame" data-reveal>
                <Image
                  data-parallax
                  src="/images/field.jpg"
                  alt="A green public landscape with trees and a path"
                  fill
                  sizes="(max-width: 899px) 100vw, 55vw"
                />
                <span className="image-frame__caption">The system starts where people are.</span>
              </div>
              <div className="approach__notes" data-reveal>
                <div className="note-item">
                  <span className="note-item__index">A</span>
                  <div><h3>Location-agnostic by design</h3><p>Boundaries, languages, categories, and service clocks adapt to the place that runs Swachta.</p></div>
                </div>
                <div className="note-item">
                  <span className="note-item__index">B</span>
                  <div><h3>Human when it matters</h3><p>Automation clears the path. People keep the judgement, the context, and the final say.</p></div>
                </div>
                <div className="note-item">
                  <span className="note-item__index">C</span>
                  <div><h3>Proof, not promises</h3><p>Before and after, timelines, and clear ownership make resolution visible to everyone.</p></div>
                </div>
                <a className="text-link text-link--dark" href="#start">Read our principles <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        </section>

        <section className="signal-section section-dark" aria-labelledby="signal-title">
          <div className="signal-section__backdrop" aria-hidden="true" />
          <div className="container signal-section__layout">
            <div className="signal-section__copy" data-reveal>
              <p className="eyebrow eyebrow--light">04 / In motion</p>
              <h2 id="signal-title">Clear enough to act on.</h2>
              <p>Operators see the same story a citizen started. No lost context. No dead-end inbox.</p>
              <a className="text-link text-link--light" href="#operators">Explore the operator view <span aria-hidden="true">↘</span></a>
            </div>
            <div className="signal-panel" data-reveal aria-label="Example operator queue, not live data">
              <div className="signal-panel__top">
                <span className="signal-panel__badge"><i /> Example operator view</span>
                <span>Queue / Today</span>
              </div>
              <div className="signal-panel__summary">
                <span><strong>03</strong> open signals</span>
                <span><strong>01</strong> resolved</span>
                <span className="signal-panel__pulse"><i /> Live example</span>
              </div>
              <div className="signal-table" role="table" aria-label="Example operator queue">
                {signalRows.map((row) => (
                  <div className="signal-row" data-signal-row role="row" key={row.id}>
                    <span className="signal-row__id">#{row.id}</span>
                    <span className="signal-row__issue"><strong>{row.issue}</strong><small>{row.area}</small></span>
                    <span className={`status status--${row.status.toLowerCase()}`}><i />{row.status}</span>
                    <span className="signal-row__time">{row.time}</span>
                  </div>
                ))}
              </div>
              <div className="signal-panel__bottom"><span>Example states are illustrative</span><span>↗</span></div>
            </div>
          </div>
        </section>

        <section className="start-section section-amber" id="start" aria-labelledby="start-title">
          <div className="container start-section__inner" data-reveal>
            <p className="eyebrow">05 / Start somewhere</p>
            <h2 id="start-title">The next clean-up<br /><em>can start here.</em></h2>
            <div className="start-section__bottom">
              <p>We are building with the people who know their streets best. Bring us the first place you want to move forward.</p>
              <MagneticLink className="button button--ink" href="mailto:hello@swachta.org">Plan a pilot <span aria-hidden="true">↗</span></MagneticLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-dark">
        <div className="container site-footer__top">
          <a className="wordmark wordmark--light" href="#top" aria-label="Swachta home"><span className="wordmark__symbol" aria-hidden="true"><i /><i /><i /></span><span>swachta</span></a>
          <p>Infrastructure for the work<br />that keeps places moving.</p>
          <nav aria-label="Footer navigation">{footerLinks.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</nav>
        </div>
        <div className="container site-footer__bottom"><span>© 2026 Swachta</span><span>Made for the everyday.</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  );
}
