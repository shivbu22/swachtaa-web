# 01. Product Requirements Document (PRD)

## 1. Vision and problem
Waste problems go unresolved because reporting is fragmented, unverified, and unrouted. Citizens don't know who is responsible, authorities can't prioritise unverified complaints, and nobody can prove resolution.

**Vision:** one platform where anyone, anywhere, can report waste, have it verified automatically, routed to the right responsible party under a clock, and confirmed as resolved.

## 2. Goals and non-goals
**Goals (MVP)**
- G1. Close the loop: Report → Verify → Route → Resolve → Confirm.
- G2. Prove the platform is location-agnostic: a new city goes live through configuration only.
- G3. Cut report-to-resolution time by at least 40% versus the tenant's baseline.
- G4. Reach above 90% accuracy on automated verification.

**Non-goals (post-MVP)**
Recyclables marketplace, subscription billing at scale, gamification and rewards, predictive routing, IoT bin sensors, public open-data portal, native desktop apps.

## 3. Users and personas
| Persona | Description | Primary need |
|---|---|---|
| Citizen Reporter | Anyone with a phone | Report fast, see progress, trust resolution |
| Household Requestor | Resident wanting a scheduled or on-demand pickup | Book and track a pickup |
| Field Handler | Collector, crew member, NGO volunteer | Clear task list, navigation, easy proof upload |
| Authority Supervisor | Municipal or operator supervisor | Prioritised queue, SLA visibility, team workload |
| Tenant Admin | Configures one city or organisation | Boundaries, authorities, SLAs, users |
| Platform Admin | Swachta staff | Tenants, health, abuse, support |

## 4. Core user journey
1. Citizen opens the app, taps **Report**, photographs the waste.
2. App captures GPS, time, and device attestation, then uploads the media.
3. Verification engine classifies waste type and severity, checks authenticity, and detects duplicates.
4. Routing engine resolves the responsible authority from the geo polygon and the tenant rules, and creates an assignment with an SLA clock.
5. Handler accepts, navigates, resolves, and uploads an after-photo.
6. Citizen confirms or reopens. Unconfirmed tickets auto-confirm after the configured window.
7. Missed SLAs escalate up the tenant's escalation chain.

## 5. Functional requirements
Priority: **M** = Must, **S** = Should, **C** = Could.

### 5.1 Accounts and access
| ID | Requirement | P |
|---|---|---|
| FR-001 | Sign-up/login via phone OTP, email magic link, and Google/Apple | M |
| FR-002 | Anonymous reporting with a device token, upgradeable to an account | S |
| FR-003 | Role-based access: citizen, handler, supervisor, tenant admin, platform admin | M |
| FR-004 | A user may belong to multiple tenants with different roles | S |
| FR-005 | Account deletion and data export self-service | M |

### 5.2 Reporting
| ID | Requirement | P |
|---|---|---|
| FR-010 | Create a report with 1-5 photos, optional note, optional category | M |
| FR-011 | Capture GPS with accuracy value. Allow manual pin adjustment | M |
| FR-012 | Offline capture with queued upload and retry | M |
| FR-013 | Show the user a duplicate suggestion and let them "+1" an existing ticket | S |
| FR-014 | Request a pickup (household): bulky, general, hazardous | S |
| FR-015 | Anonymize faces and licence plates in stored media | M |

### 5.3 Verification
| ID | Requirement | P |
|---|---|---|
| FR-020 | Classify waste category and severity (1-4) per photo | M |
| FR-021 | Validate image authenticity: EXIF/time/geo plausibility, re-photo detection | M |
| FR-022 | Detect duplicates by geo-radius, time window, and perceptual hash | M |
| FR-023 | Low-confidence results go to a human review queue | M |
| FR-024 | Reject out-of-scope or abusive content with a reason shown to the user | M |

### 5.4 Routing and SLA
| ID | Requirement | P |
|---|---|---|
| FR-030 | Resolve the authority by point-in-polygon against tenant regions | M |
| FR-031 | Assign to a team or handler by category, capacity, and proximity | M |
| FR-032 | SLA timers per category and severity with business-hours support | M |
| FR-033 | Auto-escalate on breach through a configurable chain | M |
| FR-034 | Manual reassign, merge, and close by a supervisor | M |

### 5.5 Resolution
| ID | Requirement | P |
|---|---|---|
| FR-040 | Handler accepts or declines (with reason), starts, and resolves a task | M |
| FR-041 | Proof of resolution: after-photo with geo and time check | M |
| FR-042 | Citizen confirms or reopens within the window, with rating | M |
| FR-043 | Handler turn-by-turn handoff to the device maps app | S |

### 5.6 Notifications
| ID | Requirement | P |
|---|---|---|
| FR-050 | Push, email, and SMS (SMS configurable per tenant) on every state change | M |
| FR-051 | Per-user notification preferences | S |
| FR-052 | Localised templates, with the user's language chosen automatically | M |

### 5.7 Admin and analytics
| ID | Requirement | P |
|---|---|---|
| FR-060 | Tenant console: map and heatmap, ticket queue, SLA dashboard, exports (CSV) | M |
| FR-061 | Tenant configuration UI for boundaries, authorities, categories, SLA, escalation | M |
| FR-062 | Platform console: tenant list, feature flags, abuse queue, health | M |
| FR-063 | Immutable audit log of admin actions | M |

### 5.8 Global readiness
| ID | Requirement | P |
|---|---|---|
| FR-070 | All UI strings externalized, with at least 3 languages (EN + 2) and RTL support | M |
| FR-071 | Locale-aware units, dates, numbers, currency | M |
| FR-072 | New tenant onboarding via config only, with no deploy | M |
| FR-073 | Region-pinned data storage option per tenant | S |

## 6. Non-functional requirements
| Area | Target |
|---|---|
| Availability | 99.5% monthly for API (MVP) |
| Performance | p95 API under 400 ms. Report submission to first status under 10 s on 4G |
| Verification latency | p95 under 20 s from upload |
| Scale (MVP) | 50k MAU, 5k tickets/day, 20 tenants |
| Mobile | iOS 15+, Android 8+. Works on low-end devices and 2G/3G with retries |
| Accessibility | WCAG 2.1 AA |
| Privacy | GDPR, CCPA, India DPDP-ready |
| Observability | Every request traced. Every state change evented |

## 7. Key acceptance criteria (examples)
- **FR-010/011:** Given a user with GPS on, when they submit a photo, then a ticket is created with lat/lng, accuracy, timestamp and media, and the user sees `NEW → VERIFYING` within 3 s.
- **FR-022:** Given an open ticket within 30 m and 48 h with matching perceptual hash, a new report is offered as a duplicate and not created as a separate ticket unless the user declines.
- **FR-030:** Given a point inside two overlapping authority polygons, the tenant's priority rule selects exactly one authority, deterministically.
- **FR-033:** Given an SLA breach, then within 60 s an escalation event is created and the next level is notified.
- **FR-072:** Given a boundary file, authority list, and SLA config, a tenant admin can take a new city live in under 2 days with zero code changes.

## 8. Success metrics
| Metric | Target |
|---|---|
| Report-to-resolution time | at least 40% faster than baseline |
| Verification accuracy (category) | above 90% |
| Citizen-confirmed resolutions | above 70% |
| Week-4 repeat reporters | above 25% |
| Handler task closure in app | above 60% |
| New-city onboarding time | under 2 days, zero code |

## 9. Assumptions, dependencies, risks
- Assumes at least one operator or NGO per beta tenant will use the handler app.
- Depends on a maps/geocoding provider, an SMS provider, a push provider, and a hosted vision model.
- Top risks are authority adoption, fake reports, and privacy. Mitigations are in 08 and 11.

## 10. Release criteria (MVP exit)
All Must requirements pass, zero open Sev-1/Sev-2 bugs, success metrics measured on at least 100 beta users and 300 tickets, and the second-city onboarding test passed.
