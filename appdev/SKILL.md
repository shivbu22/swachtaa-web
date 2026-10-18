---
name: appdev
description: Build original, cinematic, highly interactive web experiences with a research-first workflow, reusable motion architecture, responsive behavior, and verified production checks.
---

# Appdev

Build a polished, original web experience from the current project workspace. Use this skill for cinematic landing pages, creative studio sites, immersive portfolios, environmental storytelling, interactive brand experiences, and other motion-led interfaces.

The goal is not to clone a reference. The goal is to understand the interaction principles behind strong references and reinterpret them as a distinct, usable, accessible product.

## Core outcome

Deliver a working application that:

- starts successfully in the intended project directory
- has a coherent visual identity and information architecture
- feels premium within the first viewport
- uses motion to communicate hierarchy, continuity, feedback, or state change
- works at desktop, tablet, and mobile widths
- respects reduced-motion preferences
- has no obvious broken assets, horizontal overflow, or console errors
- passes the project's real typecheck, lint, test, and production build checks when available
- documents design decisions, reference findings, architecture, verification, and limitations

Never claim that a check passed unless the command was actually run and returned success.

## Design read

Before implementation, write one sentence that names the page type, audience, visual language, and technical direction.

Use this format:

> Reading this as: [page type] for [audience], with a [visual language] direction, leaning toward [layout, typography, and motion system].

For an immersive cinematic experience, start with these dials and adjust only when the brief or references justify it:

- `DESIGN_VARIANCE: 8` — asymmetric composition, editorial rhythm, and non-repetitive layouts
- `MOTION_INTENSITY: 7` — cinematic but controlled transitions and scroll-linked storytelling
- `VISUAL_DENSITY: 4` — generous whitespace with a few high-information moments

Every major design decision must trace to one of these sources:

1. the user brief
2. a documented reference finding
3. an accessibility or performance constraint
4. a deliberate product or storytelling decision

Do not default to a centered hero, generic purple gradients, Inter with slate text, six identical cards, or decorative animation with no user-facing purpose.

## Engineering loop

Follow this loop throughout the task:

```text
PLAN
→ IMPLEMENT
→ RUN
→ VERIFY
→ REVIEW
→ FIX
→ VERIFY AGAIN
```

Use small milestones. After every meaningful milestone:

1. run the relevant application command
2. inspect the result or command output
3. check for runtime, layout, interaction, and accessibility problems
4. fix discovered issues
5. run the same check again
6. record the actual result in project documentation when useful

Do not wait until the end to discover that the animation lifecycle, layout, or build is broken.

## Phase 1: inspect before building

Find the actual application root before changing files. Inspect:

- repository status and existing work
- `package.json` and package manager lockfile
- app routes and entry points
- components and shared layouts
- global styles, Tailwind configuration, CSS variables, and fonts
- public assets, image dimensions, and media formats
- environment configuration
- TypeScript, lint, test, and build configuration
- existing README, project notes, and repository instructions

If the target directory is empty, choose a minimal stack based on the intended first user flow. Do not install a starter kit only to fill the directory.

Confirm the available runtime before using it. Report missing runtimes or unavailable browser tooling as verification gaps instead of hiding them.

Keep unrelated user changes intact. Do not reset, delete, or overwrite files that are outside the requested scope.

## Phase 2: research references

Study the supplied references for principles, not for literal copying.

Default interaction references for this skill:

- Visual reference: `https://www.youtube.com/watch?v=xnPo23x7bOc`
- Interaction reference: `https://evanfasquelle.com/playground`

Use available web or repository research tools. Inspect several reference angles when possible, including:

- editorial or art-directed web layouts
- interactive studio and portfolio experiences
- scroll-driven storytelling patterns
- premium product or brand marketing pages
- responsive interaction and mobile degradation patterns

Research should answer:

- what is the first visual promise?
- how does the experience establish spatial depth?
- what interaction is the primary user gesture?
- what is revealed by scroll, pointer movement, hover, or click?
- where does the experience slow down or create visual silence?
- how are controls exposed without competing with the story?
- how does the design degrade when WebGL, hover, or smooth scrolling is unavailable?

If a reference cannot be retrieved, record that limitation and use only the accessible material plus general interaction principles. Do not invent a frame-by-frame analysis.

Before implementation, create:

- `docs/PROJECT_PLAN.md`
- `docs/REFERENCE_ANALYSIS.md`

`docs/PROJECT_PLAN.md` must include:

- user-visible goal
- assumptions
- scope and non-goals
- milestones ordered by priority
- proposed routes and section structure
- planned dependencies
- exact check commands
- known constraints and verification gaps

`docs/REFERENCE_ANALYSIS.md` must include:

- reference URLs
- retrieval status
- concrete interaction observations
- visual observations
- responsive observations
- principles to adapt
- traits to reject because they would become imitation or weaken usability
- a reference lock and decision ledger

Use a reference lock like this:

```text
Primary direction: one dominant visual and interaction thesis.
Preserve: three to five traits that must survive the adaptation.
Borrow only: one or two narrow interaction details from secondary references.
Media strategy: real, generated, stock, existing, or code-native assets with defined roles.
Reject: generic defaults, copied branding, copied assets, and unexplained effects.
Token commitments: background, text, accent, border, radius, type scale, and motion rules.
```

Use a decision ledger with these columns:

| Decision | Source | Role | Reason |
|---|---|---|---|
| Typography | brief, research, or craft rule | display or body | why it supports the audience |
| Palette | brief or reference synthesis | background, text, or accent | why the contrast and mood work |
| Motion | interaction observation | hierarchy, continuity, feedback, or state | what the motion communicates |
| Media | asset strategy | hero, story, showcase, or support | why this media belongs here |

## Phase 3: architecture

Prefer this stack when it fits the project:

- Next.js
- React
- TypeScript
- Tailwind CSS or maintainable native CSS
- GSAP and ScrollTrigger for cinematic sequences
- Lenis for smooth scrolling when it improves the experience
- React Three Fiber, Drei, and Three.js only for real 3D requirements
- Motion only for small component-level interactions where GSAP would be unnecessary

Before importing any third-party package, inspect `package.json`. If a package is missing, add it deliberately and record why it is needed. Do not add duplicate animation, scrolling, or icon systems.

Use a structure close to:

```text
app/
  layout.tsx
  page.tsx
components/
  Navigation.tsx
  Preloader.tsx
  Hero.tsx
  Intro.tsx
  InteractiveVisual.tsx
  StorySection.tsx
  Showcase.tsx
  InteractiveCard.tsx
  Gallery.tsx
  Process.tsx
  CTA.tsx
  Footer.tsx
hooks/
  useLenis.ts
  useReducedMotion.ts
  useMediaQuery.ts
  useMagnetic.ts
lib/
  constants.ts
  media.ts
  utils.ts
animations/
  hero.ts
  scroll.ts
  transitions.ts
  cursor.ts
three/
  Scene.tsx
  Camera.tsx
  Model.tsx
  Effects.tsx
public/
  images/
  models/
  fonts/
docs/
  PROJECT_PLAN.md
  REFERENCE_ANALYSIS.md
  FINAL_REPORT.md
```

Keep components small and named after their visible responsibility. Isolate browser-only behavior behind client components and hooks. Keep static composition outside unnecessary client boundaries.

Use one authoritative scroll system. If Lenis is enabled, connect it to GSAP's ticker and ScrollTrigger refresh lifecycle. Do not combine Lenis with Locomotive Scroll or another smooth-scroll system.

Use one authoritative animation responsibility per behavior:

- GSAP: page-level timelines, ScrollTrigger, pinned scenes, text sequencing, clip-path transitions, and scroll-linked visual changes
- Motion: small local springs, menus, dialogs, hover states, and layout transitions where no page-level timeline is needed
- CSS: simple opacity, color, transform, focus, and reduced-motion fallbacks
- R3F: 3D scene state, camera movement, object interaction, and shader work

Clean up timelines, ScrollTriggers, event listeners, RAF loops, Lenis instances, and WebGL resources on unmount. Scope GSAP work with `gsap.context` or an equivalent cleanup pattern.

## Information architecture

Start from this journey and change it only when the references or product story justify a better flow:

1. preloader
2. navigation
3. full-screen hero
4. concise intro or manifesto
5. interactive visual section
6. scroll-driven story
7. showcase or feature scene
8. interactive cards or gallery
9. about or process
10. CTA
11. footer

Each section needs one job. Keep visible copy concise:

- headline: preferably eight words or fewer
- supporting paragraph: preferably twenty-five words or fewer
- one primary action per intent
- no filler labels above every section
- no invented precise statistics

Use different composition families across the page. Avoid repeating the same split image-and-text layout, the same card treatment, or the same eyebrow label rhythm.

The hero must fit within the initial viewport on desktop. It should show the headline, short supporting copy, and primary action without requiring a scroll to discover the purpose of the page.

## Visual direction

Prefer a disciplined, art-directed system over a collection of effects.

Define tokens before styling components:

- page background and tonal variants
- primary and secondary text
- one accent color
- border color and opacity
- one radius scale with explicit exceptions only when justified
- display, body, and mono typography roles
- spacing rhythm
- motion duration and easing ranges
- focus ring color and thickness

Use premium typography with a clear hierarchy. Prefer a distinctive sans display face or a justified editorial face rather than defaulting to Inter. Use `next/font` or local `@font-face`; do not load Google Fonts through a raw `<link>` in production.

Choose real visual assets whenever they materially improve the design. Use assets with defined art direction and stable dimensions. If an asset is unavailable, use an intentional placeholder with a clear role and accessible alternative text instead of a fake dashboard, fake product screenshot, or decorative rectangle pretending to be content.

Use one theme across the page. A deliberate single theme transition can be used as a storytelling device, but random light and dark section changes are not acceptable.

## Motion rules

Before adding an animation, answer:

> What does this animation communicate?

Valid reasons include:

- hierarchy: it directs attention to the next important element
- storytelling: it reveals content in the order the story is understood
- continuity: it shows that two states or spaces are connected
- feedback: it acknowledges a hover, click, drag, or focus
- state: it shows that something changed

Use transforms and opacity wherever possible. Avoid animating layout properties when a transform, clip-path, or opacity transition can express the same idea.

Implement the cinematic layer in this order:

1. preloader and initial entrance
2. hero reveal
3. text sequencing
4. image or visual reveal
5. subtle parallax
6. section scroll reveals
7. pinned or scrubbed story scene
8. horizontal storytelling only when it improves comprehension
9. cursor and magnetic interactions
10. camera or object movement
11. shaders and post-processing only when they add meaning

A pinned or horizontal scene must have a clear start and end. Prefer `start: "top top"` for a true pinned storytelling scene. Never trap users in a long scroll hijack without a visible narrative payoff or mobile alternative.

Use one custom desktop cursor only if it improves the interaction. Keep the native cursor on touch devices. Make hover effects available through focus and keyboard state where the interaction is essential.

Magnetic buttons and tilt effects must not rely on React state for continuous pointer values. Use motion values, refs, or direct transform updates outside the React render cycle. Clamp movement so controls remain usable and do not move away from the pointer.

Respect `prefers-reduced-motion: reduce` by:

- disabling smooth scrolling when appropriate
- skipping non-essential entrance choreography
- removing large transform distance and pinned scenes
- keeping essential content visible immediately
- retaining short state changes and focus feedback

## Interactive visual and 3D rules

Use R3F only when DOM and CSS cannot express the required visual. A 3D scene must earn its cost by supporting the narrative or interaction.

When using 3D:

- lazy load the scene or heavy model
- use GLTF or GLB assets with sensible geometry and texture sizes
- avoid rendering hidden scenes
- cap pixel ratio and particle count on smaller devices
- prefer a single scene over multiple duplicate canvases
- dispose of geometries, materials, textures, and render targets
- pause or reduce work when the scene is outside the viewport
- provide a meaningful non-WebGL or reduced-complexity fallback
- keep critical copy and navigation in the DOM
- avoid post-processing until the base scene is stable

Support camera animation, lights, environment, object interaction, scroll control, and particles only when each has a specific role. Do not add a model, shader, bloom, or depth-of-field effect merely because it is available.

## Responsive behavior

Desktop can carry the highest visual fidelity. Tablet should reduce complexity without breaking the story. Mobile should prioritize readability, touch targets, content order, and performance.

For mobile:

- remove the custom cursor
- simplify or replace WebGL
- reduce particle counts and texture sizes
- shorten animation distances and durations
- avoid long pinned scenes when they harm usability
- replace horizontal hijacks with stacked or swipeable content when appropriate
- maintain visible CTAs and normal document flow
- preserve focus, keyboard, and screen-reader semantics

Declare the mobile fallback for every multi-column or pinned section inside the component implementation. Do not assume that a desktop layout will collapse well by accident.

Test at minimum:

- 1440px or wider
- 1280px
- 1024px
- 430px
- 390px

Check for horizontal overflow at every tested width.

## Accessibility

Build semantics into the first implementation:

- one meaningful `h1`
- logical heading order
- semantic `nav`, `main`, `section`, and `footer`
- descriptive link and button labels
- visible focus styles
- keyboard-accessible navigation and interactive cards
- touch targets large enough for mobile use
- alt text for meaningful images
- empty alt text for decorative images
- no essential information conveyed only through color or hover
- pause or avoid motion that could be distracting
- correct button versus link semantics
- skip link when navigation or animation could otherwise delay access to main content

Verify navigation with keyboard focus and activation. Verify that essential copy remains available when JavaScript, WebGL, hover, or smooth scrolling is unavailable.

## Verification checklist

Run the real project checks from the application root. Use the project's scripts when present:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

If a command does not exist, record it as not configured rather than creating a fake no-op script.

Run the application and inspect it at the target route. If browser automation is available, capture or inspect the page at the required desktop and mobile widths. If browser automation is not available, use the strongest local checks available and record the gap.

Verify:

- application starts successfully
- main route renders
- preloader completes without trapping the page
- navigation links work and close mobile menus
- hero copy, CTA, and visual load correctly
- smooth scrolling does not fight native scroll
- ScrollTrigger scenes start and end at the intended positions
- hover and focus states work
- magnetic buttons do not move outside their hit area
- cards and gallery interactions work by keyboard and touch
- images and fonts load without 404s
- 3D fallback renders without WebGL
- reduced motion disables non-essential choreography
- there is no horizontal overflow
- there are no obvious console errors
- production build succeeds

Do not hide console errors, disable checks, or lower quality gates merely to make the output appear clean.

## Final report

After implementation, create `docs/FINAL_REPORT.md` with:

1. implemented features
2. information architecture
3. component and animation architecture
4. dependencies and why each exists
5. asset strategy
6. responsive and mobile behavior
7. accessibility behavior
8. performance findings
9. exact checks that were run and their results
10. known limitations and verification gaps
11. future improvements in priority order

Use concrete evidence. Distinguish between verified behavior, observed behavior, and work that could not be tested because tooling or assets were unavailable.

## Definition of done

The task is complete only when:

- the project starts
- the main route works
- the planned foundation and core content are present
- the intended motion system runs without lifecycle errors
- the main interactions work on desktop and mobile
- the page degrades cleanly without heavy browser capabilities
- accessibility basics are present
- no obvious broken asset or overflow remains
- the production build succeeds when the project provides one
- `docs/PROJECT_PLAN.md`, `docs/REFERENCE_ANALYSIS.md`, and `docs/FINAL_REPORT.md` describe the real implementation and checks

If a P3 feature such as shaders or post-processing is not required to make the MVP successful, do not delay the MVP for it. Record it as a future improvement instead.
