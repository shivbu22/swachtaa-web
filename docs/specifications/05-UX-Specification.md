# 05. UX Specification

## 1. Design principles
1. **Three taps to report.** Open → photograph → send.
2. **Honest status.** The user always knows what happens next and who owns it.
3. **Works anywhere.** Low bandwidth, low-end devices, any language, any script direction.
4. **Dignity.** Language is respectful toward workers and communities. No shaming imagery.
5. **Accessible by default.** WCAG 2.1 AA.

## 2. Surfaces
| Surface | Users | Platform |
|---|---|---|
| Citizen app | Reporters, households | iOS / Android |
| Handler app (role mode of the same app) | Field workers | iOS / Android |
| Admin web console | Supervisors, tenant admins | Desktop web, responsive |
| Platform console | Swachta staff | Desktop web |

## 3. Primary flows

### 3.1 Report waste (citizen)
`Home → Camera → Review (photos, auto-location pin, optional note, category suggestion) → Submit → Status screen`
- Camera opens directly from the center **Report** button.
- Location auto-fills. If accuracy is poor (over 50 m), show the map pin to adjust.
- Offline: save as a draft, show "Will send when online", and retry automatically.
- Duplicate found: "Someone already reported this. Add your support?" with **Support** / **This is different**.

### 3.2 Track and confirm
`Status screen: timeline (Reported → Verified → Assigned → In progress → Resolved)` → on resolve, before/after slider, **Confirmed** / **Not fixed** with a reason and 1-5 rating.

### 3.3 Handler task
`Task list (sorted by SLA) → Task detail (map, photos, notes) → Accept → Navigate → Start → Capture after-photo → Resolve`
- Large touch targets, usable with gloves, high-contrast mode, one-hand layout.
- Declining requires a reason chip (too far, wrong category, unsafe, off duty).

### 3.4 Supervisor queue
`Queue (priority, SLA countdown, filters) → Ticket drawer (media, timeline, actions: reassign / merge / close / escalate) → Map and heatmap toggle`

### 3.5 Tenant onboarding (admin)
`Create tenant → Upload boundaries → Define authorities → Enable categories → Set SLAs and escalations → Invite staff → Run go-live checklist → Activate`

## 4. Screen inventory (MVP)

**Citizen:** Welcome/language · Sign-in/OTP · Home map feed · Camera · Report review · Submit result · My reports · Ticket detail · Confirm/reopen · Notifications · Settings (language, privacy, delete account).
**Handler:** Task list · Task detail · Navigation handoff · Proof capture · Day summary.
**Admin:** Dashboard · Queue · Ticket detail · Review queue (AI) · Map/heatmap · Authorities & teams · Regions · SLA & escalation · Categories · Users & roles · Reports/export · Audit log.
**Platform:** Tenants · Tenant health · Flags · Abuse queue.

## 5. Wireframes (low-fidelity)

**Citizen Home**
```
┌─────────────────────────────┐
│ ☰   Swachta        🔔  ⚙   │
├─────────────────────────────┤
│                             │
│        [ MAP: nearby        │
│          open tickets ]     │
│                             │
├─────────────────────────────┤
│ Your reports (2)            │
│ ● Overflowing bin  ASSIGNED │
│ ● Dump site        RESOLVED │
├─────────────────────────────┤
│        ( 📷 REPORT )        │
└─────────────────────────────┘
```

**Report review**
```
┌─────────────────────────────┐
│ ←  Review report            │
│ [photo][photo][ + ]         │
│ 📍 Location set (±8 m) Edit │
│ Category: General waste ▾   │
│ (suggested)                 │
│ Note (optional)             │
│ ┌─────────────────────────┐ │
│ └─────────────────────────┘ │
│ ☑ Blur faces and plates     │
│        [  SUBMIT  ]         │
└─────────────────────────────┘
```

**Ticket status**
```
┌─────────────────────────────┐
│ ←  Report #A1B2             │
│ ✔ Reported      08:15       │
│ ✔ Verified      08:15       │
│ ● Assigned to City Sanitation│
│ ○ In progress               │
│ ○ Resolved                  │
│ Due by: tomorrow 08:15      │
│ [photo]            [Support]│
└─────────────────────────────┘
```

**Supervisor queue (web)**
```
┌─────────┬───────────────────────────────┬──────────────┐
│ Filters │ # | Cat | Sev | SLA  | Status  │ Ticket drawer│
│ status  │ 12  gen  3   2h14m   ASSIGNED │ photos       │
│ category│ 13  haz  4   BREACH  ESCALATED│ timeline     │
│ team    │ ...                           │ [Reassign]   │
└─────────┴───────────────────────────────┴──────────────┘
```

## 6. Design system
| Token | Value |
|---|---|
| Color primary | Deep green `#1B7F5C`. Accent amber `#F2A900`. Danger `#C62828`. Success `#2E7D32` |
| Neutrals | 10-step gray scale, light and dark themes |
| Type | System font stack with a Noto fallback for full script coverage (Latin, Devanagari, Arabic, CJK) |
| Spacing | 4-pt grid |
| Radius | 12 px cards, 999 px chips |
| Icons | One outline set, 24 px |
| Motion | 150-250 ms ease-out, respects reduced-motion |

Status colors always pair with an icon and text, never color alone.

## 7. Internationalization
- ICU message format, with plural and gender rules per locale.
- Logical CSS properties and mirrored layouts for RTL (Arabic, Hebrew, Urdu).
- Launch languages: English plus two chosen by the first tenants. Machine translation can seed strings, with a human review before release.
- Never concatenate strings. Allow 40% text expansion. Locale-aware dates, numbers, and distance units (km/mi).

## 8. Accessibility
Screen-reader labels for every control and the camera flow. Minimum touch target 44×44 pt. Contrast 4.5:1 for text. Dynamic type up to 200%. Voice-guided reporting is a post-MVP stretch.

## 9. Content and tone
Short, active, respectful. Say "Waste team", not "garbage men". Error messages say what happened and what to do next. Every empty state has a next action.

## 10. States to design for each screen
Loading · Empty · Offline · Error · Permission denied (camera, location) · Low accuracy · Rate-limited · Success.

## 11. Usability test plan
10 citizens, 3 handlers, 2 supervisors. Tasks: report in under 30 s, find a report's status, confirm a resolution, accept and resolve a task. Pass criteria: at least 90% task success, SUS score at least 75.
