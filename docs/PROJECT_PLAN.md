# Swachta web experience — project plan

## Product context

Swachta is a location-agnostic civic-tech platform for reporting, verifying, routing, and resolving solid-waste issues. The project brief is in `C:\Users\ahiva\Downloads\2`, especially:

- `01-PRD.md`
- `02-System-Architecture.md`
- `05-UX-Specification.md`
- `06-Tenant-Configuration-Spec.md`
- `11-Project-Plan-Backlog.md`

## First useful result

Ship a polished, original public-facing web experience that explains the Swachta loop in one scroll journey:

`Report → Verify → Route → Resolve → Confirm`

The site is a marketing/product narrative for the future Swachta platform. It is not a replacement for the mobile citizen/handler apps or the admin console described in the pre-development specification.

## Audience

- pilot-city operators and NGO partners
- civic and municipal decision makers
- field teams and collection partners
- citizens who need to understand what happens after a report

## Experience thesis

Treat civic operations as a living system rather than a dashboard. A dark green field, warm paper surfaces, documentary landscape imagery, and a single amber signal create a calm but urgent atmosphere. Scroll moves the visitor through the operational loop; pointer movement adds quiet depth rather than visual noise.

## Scope

### P0 — required

- Next.js app with a single public route
- sticky navigation with mobile menu
- preloader that can be skipped and respects reduced motion
- full-screen hero with the Swachta promise
- product explanation and civic loop
- responsive product preview / operations snapshot
- impact, process, and partner CTA sections
- footer with clear navigation and accessibility basics

### P1 — required after structure

- Lenis smooth scrolling on capable desktop devices
- GSAP entrance, reveal, and scrubbed section transitions
- pointer response and magnetic primary actions on desktop
- hover and focus states for the operational loop and cards
- section progress indicator
- mobile fallbacks that preserve document flow

### P2 — optional if it stays stable

- lightweight canvas-like signal field built with DOM/CSS primitives
- richer card hover depth
- ambient image drift

### Explicit non-goals for this slice

- real authentication, OTP, or account creation
- real camera upload or GPS capture
- real map provider, backend API, AI verification, or notifications
- tenant administration, handler tasks, or database persistence
- pretending that static preview metrics are production data

## Architecture

- Next.js App Router
- React + TypeScript
- native CSS with CSS variables for the art-directed landing page
- GSAP + ScrollTrigger for page-level motion
- Lenis as the single smooth-scroll layer
- no R3F or Motion in the first slice because the brief can be expressed with DOM, CSS, and image media without adding WebGL cost
- client boundaries only for navigation, preloader, pointer interactions, and animation setup

## Proposed route structure

- `/` — cinematic Swachta overview
- future `/report`, `/track`, and `/console` routes should be added only when real flows exist

## Milestones

1. create project foundation and document decisions
2. implement static page journey and responsive CSS
3. add Lenis and GSAP animations with cleanup
4. add interaction polish and reduced-motion behavior
5. run build, typecheck, lint, and app smoke checks
6. write final report with actual evidence and limitations

## Verification commands

Run from `C:\Users\ahiva\OneDrive\Desktop\Swachtaa`:

```text
npm run lint
npm run typecheck
npm run build
npm run dev
```

If a command is not configured, record it as not configured instead of substituting a fake check.

## Acceptance criteria

- the app starts and the root route renders
- hero, navigation, loop, preview, and CTA sections are present
- the primary CTA is keyboard reachable and visibly focused
- mobile navigation opens, closes, and does not create horizontal overflow
- smooth scroll and GSAP animations clean up on unmount
- `prefers-reduced-motion` disables non-essential choreography
- remote or missing media cannot remove the core message
- production build succeeds
- no unverified claim is presented as a live platform metric
