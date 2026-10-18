# Swachta web experience — final report

## 1. Implemented features

Built an original cinematic single-page Swachta experience at `/` based on the product documentation in `C:\Users\ahiva\Downloads\2`.

Implemented:

- full-screen hero with the Swachta promise: “Make every report move.”
- fixed responsive navigation with desktop links, mobile dialog menu, Escape handling, focus return, and skip link
- reduced-motion-aware preloader
- editorial intro section explaining the civic operations gap
- five-step scroll story: Report → Verify → Route → Resolve → Confirm
- desktop pinned/horizontal loop scene with a stacked mobile fallback
- local interactive operator sandbox with three synthetic tickets
- operator sandbox stage timeline with keyboard-accessible buttons
- synthetic workflow advancement through all five stages and reset behavior
- explicit “Local example” / “Synthetic area” labels so the prototype is not presented as a live service
- asymmetric “approach” section with local supporting imagery
- example operator queue / signal panel
- partner CTA section and accessible footer
- magnetic pointer response for desktop CTAs
- Lenis smooth scroll on fine-pointer devices
- GSAP entrance, reveal, parallax, and pinned section animations
- `prefers-reduced-motion` behavior that skips the preloader, removes non-essential choreography, and keeps core content available
- bundled local JPEG media so runtime does not depend on Unsplash availability
- self-contained copies of the supplied product specification files under `docs/specifications/`

## 2. Architecture

### Framework and styling

- Next.js 16 App Router
- React 19
- TypeScript
- native CSS with shared CSS variables and responsive breakpoints
- CSS Modules for the operator sandbox

### Motion

- `animations/site.ts` owns GSAP and ScrollTrigger page-level animation setup
- `hooks/useSiteMotion.ts` owns Lenis lifecycle, GSAP ticker integration, reduced-motion detection, and cleanup
- `hooks/usePointerGlow.ts` owns desktop pointer ambient light positioning
- `components/MagneticLink.tsx` owns bounded magnetic CTA motion without React state re-renders
- all GSAP animation setup is scoped and reverted on unmount

### Components

- `components/SwachtaExperience.tsx` — page composition and content
- `components/SiteNavigation.tsx` — navigation, mobile dialog, focus handling
- `components/Preloader.tsx` — initial loading transition
- `components/WorkflowDemo.tsx` — synthetic interactive operator workflow
- `components/MagneticLink.tsx` — pointer-responsive links
- `lib/content.ts` — repeated narrative and footer content

### Media

- `public/images/hero.jpg`
- `public/images/field.jpg`
- additional supporting media downloaded into `public/images/forest.jpg` and `public/images/coast.jpg` for future use

The current page uses local media through `next/image` so the core experience does not depend on remote image optimization at runtime.

## 3. Dependencies

Runtime:

- `next`
- `react`
- `react-dom`
- `gsap`
- `lenis`

Development and verification:

- `typescript`
- `eslint`
- `eslint-config-next`
- `@playwright/test`
- `@axe-core/playwright`
- React / Node type packages

R3F, Drei, Three.js, Motion, and a map provider were intentionally not added. The first web slice achieves the visual and interaction goals with DOM, CSS, GSAP, and Lenis while avoiding unnecessary WebGL cost.

## 4. Verification performed

### Passing checks

Run from `C:\Users\ahiva\OneDrive\Desktop\Swachtaa`:

```text
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev --audit-level=high
```

Observed results:

- ESLint: passed with no warnings
- TypeScript: passed
- production build: passed
- route output: `/` statically prerendered successfully
- production dependency audit: 0 vulnerabilities

Production smoke check:

```text
npm run start -- --hostname 127.0.0.1
curl http://127.0.0.1:3000/
curl http://127.0.0.1:3000/images/hero.jpg
curl http://127.0.0.1:3000/images/field.jpg
```

Observed results:

- route returned HTTP 200
- both local images returned HTTP 200
- response contained “Make every”, “A report is only the beginning”, and “Plan a pilot” markers

### Browser verification gap

A Playwright smoke suite was added at `tests/smoke.spec.ts` and covers:

- desktop content and horizontal overflow
- operator sandbox progression and reset
- mobile navigation open/close with Escape
- reduced motion hero visibility
- axe accessibility scan excluding color-contrast for this first automated pass

The suite was run, but browser launch is blocked in the current environment because the Playwright Chromium binary cannot find the system library `libnspr4.so`. The attempt to install OS packages failed because `sudo` requires interactive authentication. The test result is therefore **blocked by environment**, not treated as a pass.

The Playwright browser download itself completed successfully. To finish browser verification in an environment with OS package installation access, run:

```text
sudo apt-get update
sudo npx playwright install --with-deps chromium
npm run test:e2e
```

The project keeps the test suite and exact failure evidence available rather than hiding or replacing the failed check.

## 5. Known limitations

- This is the public-facing narrative / product story slice, not the full Swachta mobile, API, database, or admin-console MVP.
- Report capture, GPS, authentication, AI verification, routing, notifications, tenant configuration, and persistence are represented as product narrative or local example UI only.
- The operator sandbox uses synthetic examples and intentionally does not call a service.
- Full visual screenshot comparison could not be performed because browser launch dependencies are missing in the current environment.
- Full axe coverage with browser execution is blocked for the same reason.
- The full development audit still reports five high-severity advisories in development tooling (`eslint-config-next` / its transitive linting graph). Production dependencies are clean. The available automatic remediation proposes a semver-major move to an older `eslint-config-next` version, so no breaking force-fix was applied.
- The page uses system sans / mono stacks instead of adding a font binary. This avoids another external runtime dependency and preserves the layout direction; a production brand pass can add licensed Swachta fonts later.

## 6. Mobile behavior

At tablet and mobile widths:

- navigation becomes a full-screen menu dialog
- custom pointer effects are not used on coarse pointers
- the horizontal loop becomes a normal stacked sequence
- the operator sandbox stacks queue and detail panels
- cards and buttons remain touch-sized
- dense queue metadata collapses before the 390px width target
- reduced motion removes the preloader and expensive scroll choreography
- local images retain stable dimensions through `next/image`

Targeted widths are covered in the project plan and Playwright configuration: 1440px, 1280px, 1024px, 390px, and 430px.

## 7. Performance findings

- hero and field images are local and approximately 440 KB and 330 KB after the final media update
- only GSAP and Lenis are used for motion; no WebGL canvas is mounted
- pointer motion is updated through DOM CSS variables rather than React state
- Lenis is disabled for reduced-motion and coarse-pointer environments
- heavy visual behavior is limited to the pinned desktop loop and scroll reveals
- production build completes and the route is statically prerendered
- production dependency audit is clean

## 8. Future improvements

### P0

1. Install the missing browser OS libraries and run the Playwright / axe suite.
2. Perform screenshot review at desktop and mobile breakpoints.
3. Add a real legal/privacy route and confirm the final contact destination.

### P1

1. Replace the synthetic operator sandbox with a typed API contract once the backend exists.
2. Add the real report flow in the mobile app and link the web CTA to the pilot intake flow.
3. Add tenant-driven copy and branding from the configuration model in `docs/specifications/06-Tenant-Configuration-Spec.md`.
4. Add true i18n and RTL behavior before the first country launch.

### P2

1. Add status-aware map or geographic context after a real maps provider is selected.
2. Add real before/after proof media to the operator and resolution story.
3. Run performance profiling on low-end mobile devices and throttled networks.

### P3

1. Consider an optional low-cost R3F or canvas signal field only if user testing shows that it improves comprehension.
2. Add richer media transitions and post-processing only after the base product loop has real content.
