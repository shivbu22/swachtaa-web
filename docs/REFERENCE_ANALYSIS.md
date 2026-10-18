# Reference analysis and design lock

## Reference status

### Supplied references

- Visual reference: `https://www.youtube.com/watch?v=xnPo23x7bOc`
- Interaction reference: `https://evanfasquelle.com/playground`

### Retrieval notes

- YouTube returned player bootstrap metadata but not the actual video frames or transcript through the available fetch path. No frame-by-frame claims are made here.
- The playground URL returned `404 Not Found` through the available fetch path. The interaction reference is therefore treated as a requested interaction principle, not as a verified visual source.
- The detailed Swachta product documentation in `C:\Users\ahiva\Downloads\2` is the authoritative product source for content, tone, accessibility, and system constraints.

## Product-grounded observations

The source documentation establishes a clear loop:

```text
Report → Verify → Route → Resolve → Confirm
```

The most important experience principle is honest status: the person who reports should understand what happens next and who owns the work. The site should make that loop felt spatially rather than explain it as a list of backend features.

The UX specification also establishes:

- three taps to report
- respectful language toward workers and communities
- low-bandwidth and low-end-device support
- WCAG 2.1 AA
- deep green primary, amber accent, restrained status colors
- status never communicated by color alone

## Adapted visual direction

### Primary thesis

**A civic operating system seen from ground level.**

Use a quiet, cinematic dark-green canvas for the hero and operations moment. Move into warm paper sections for legibility and warmth. Keep the only saturated signal amber, used for action, progress, and a few small status markers.

### Preserve

1. A full-bleed first impression with a strong visual horizon.
2. Large, direct sans-serif typography with wide breathing room.
3. Motion that feels like camera movement through a system, not a component demo.
4. A clear transition from story to proof: the loop becomes an operational preview.
5. Layered depth through image crop, thin rules, offset cards, and pointer response.

### Borrow only

1. Scroll-linked spatial reveals where the next layer enters before the current layer fully leaves.
2. Pointer position as a restrained depth cue on desktop, with no equivalent requirement on touch devices.

### Reject

- cloned branding, logos, copy, or media from either reference
- decorative WebGL when DOM/CSS can express the idea
- autoplay media that delays the message
- long scroll hijacks without a clear narrative payoff
- generic three-card feature grids
- invented platform metrics presented as live facts
- shaming imagery or language about waste workers or communities

## Token commitments

| Token | Commitment | Role |
|---|---|---|
| Ink green | `#123c34` | hero and dark narrative surfaces |
| Moss green | `#1b7f5c` | product accent and small status moments |
| Amber | `#f2a900` | primary action, active signal, progress cue |
| Paper | `#f3efe7` | readable light sections |
| Charcoal | `#10201d` | primary text on light surfaces |
| Hairline | `rgba(16, 32, 29, 0.16)` | structural separation |
| Radius | 12px base | product preview cards and controls |
| Display type | strong sans, tight tracking | hero and section headlines |
| Body type | system sans with readable measure | paragraphs and UI labels |

## Media strategy

Use landscape documentary-style images as contextual anchors rather than as decorative wallpaper. Remote Unsplash images may be replaced with local licensed media later. The core story remains readable if media fails. Every image has stable dimensions, `alt` text, and an explicit object position.

## Section rhythm

1. `Hero`: dark, visual, direct, one primary action.
2. `Intro`: warm paper and one clear sentence about the loop.
3. `Loop`: five-step horizontal-to-stacked story with one active step at a time.
4. `Signal`: dark operations preview showing how a report becomes owned work.
5. `Field notes`: asymmetric content and one supporting image.
6. `Partner CTA`: a strong action for pilot partners.
7. `Footer`: concise, accessible, and practical.

This avoids repeating the same split layout and keeps the single marquee-like signal moment inside the loop section only.

## Motion decision ledger

| Decision | Source | Role | Reason |
|---|---|---|---|
| Hero content rises in before the visual settles | cinematic reference intent + hierarchy | hierarchy | establishes the promise before secondary detail |
| Loop steps scrub along a horizontal track on desktop | interaction reference intent | storytelling | makes the workflow feel sequential and connected |
| Loop becomes vertical cards on mobile | UX and performance requirements | continuity | preserves meaning without hijacking touch scroll |
| Images drift slightly on scroll | cinematic intent | depth | makes the page feel spatial without WebGL |
| Primary buttons shift a few pixels toward the pointer | premium interaction intent | feedback | adds tactility without moving the hit target |
| Reduced motion removes transforms and smooth-scroll interpolation | accessibility constraint | access | essential content remains immediately available |

## Content decisions

Use Swachta's real product language from the PRD and UX spec:

- report
- verify
- route
- resolve
- confirm
- waste team
- operator
- pilot city

Do not use “garbage men”, shame-based language, or fake exact performance statistics. If the preview needs numbers, label them as an interface example rather than claiming they are production data.
