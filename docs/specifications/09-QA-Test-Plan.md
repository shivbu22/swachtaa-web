# 09. QA and Test Plan

## 1. Objectives
Prove that every Must requirement in the PRD works, that tenants can never see each other's data, and that the system holds up under realistic load, poor networks, and hostile input.

## 2. Test strategy (pyramid)
| Layer | Share | Tools | Runs |
|---|---|---|---|
| Unit | ~60% | Jest | Every commit |
| Integration (API + DB + queue) | ~25% | Jest + Testcontainers (Postgres/PostGIS, Redis) | Every PR |
| Contract (API ↔ clients) | ~5% | OpenAPI schema checks, Pact | Every PR |
| End-to-end (mobile) | ~7% | Detox or Maestro | Nightly and before release |
| End-to-end (web admin) | | Playwright | Nightly and before release |
| Non-functional (load, security, a11y) | ~3% | k6, ZAP, axe | Weekly and before release |

## 3. Scope by module
| Module | Focus |
|---|---|
| Identity | OTP flows, token rotation, role guards, anonymous upgrade |
| Tenancy | **RLS isolation**, tenant resolution order, config validation |
| Geo | Point-in-polygon, overlaps, boundary edges, invalid geometry, antimeridian and polar edge cases |
| Tickets | State machine legality, idempotency, concurrent updates |
| Verification | Provider contract, thresholds, fallbacks, duplicate scoring |
| Routing and SLA | Authority resolution, handler ranking, timers, escalation, business hours, DST changes |
| Media | Upload limits, content sniffing, anonymisation, signed URL expiry |
| Notifications | Template rendering per locale, channel fallback, quiet hours |
| Admin | Config edits, audit log, exports |
| i18n | Missing keys, plurals, RTL mirroring, long strings |

## 4. Critical test cases (must automate)
| ID | Scenario | Expected |
|---|---|---|
| T-001 | User of tenant A requests a ticket of tenant B by ID | 404, no data leak |
| T-002 | SQL session without `app.tenant_id` queries tickets | Zero rows |
| T-003 | Create ticket with the same `Idempotency-Key` twice | One ticket, same response |
| T-004 | Illegal transition `NEW → RESOLVED` | 409 `INVALID_STATE_TRANSITION` |
| T-005 | Point inside two overlapping authority polygons | Deterministic single authority per the priority rule |
| T-006 | Point outside all tenant polygons | Ticket `UNSERVED`, user informed |
| T-007 | Vision provider times out | Ticket `NEEDS_REVIEW`, loop continues |
| T-008 | Duplicate within 30 m and 48 h, matching pHash | Duplicate offered |
| T-009 | SLA breach | Escalation event within 60 s, next level notified |
| T-010 | SLA across a DST change | Due time correct in the tenant time zone |
| T-011 | Offline report, connectivity restored | Auto-upload, exactly one ticket |
| T-012 | Upload of a `.exe` renamed `.jpg` | Rejected by content sniffing |
| T-013 | Handler resolves from 2 km away | Proof rejected (geo mismatch) |
| T-014 | Citizen deletes account | PII removed within the SLA, tickets anonymised |
| T-015 | New tenant created from config only | Passes the go-live checklist, end-to-end ticket succeeds with no deploy |
| T-016 | Arabic locale | Layout mirrored, no truncation, correct numerals and dates |
| T-017 | Citizen calls an admin endpoint | 403 |
| T-018 | Rate limit exceeded on report creation | 429 with `Retry-After` |
| T-019 | Revoked refresh token reused | Session family revoked |
| T-020 | Config change | New tickets use the new SLA, open tickets keep the old one |

## 5. Performance and load
| Scenario | Target |
|---|---|
| Steady state | 50 req/s mixed traffic, p95 under 400 ms |
| Report burst | 200 reports/min for 10 min, zero data loss, verification p95 under 20 s |
| Map feed | 1,000 concurrent viewers, p95 under 600 ms |
| Queue recovery | Backlog of 10k jobs drains in under 15 min |
| Soak | 24 h with no memory growth or error-rate drift |

Run in staging with production-sized data (synthetic, 1M tickets). Record results per release.

## 6. Security testing
SAST and dependency scans in CI. DAST (ZAP baseline) weekly. Manual authorization tests per role per endpoint. Penetration test before the first external tenant. Findings follow a fix SLA: critical 48 h, high 7 days, medium 30 days.

## 7. Mobile and device matrix
| Platform | Coverage |
|---|---|
| iOS | Latest, latest-1, and iOS 15. iPhone SE and a large model |
| Android | 8, 11, 14. Low-end (2 GB RAM), mid, flagship. Samsung, Xiaomi, and a stock Android device |
| Network | Offline, 2G/3G throttled, flaky Wi-Fi, switching networks mid-upload |
| Permissions | Camera and location denied, "approximate only" location, background restrictions |

## 8. Accessibility and localisation testing
axe on web. VoiceOver and TalkBack passes on the core flows. Pseudo-localisation build to catch hard-coded strings. Manual review by native speakers for each launch language.

## 9. Test data and environments
- Synthetic tenants in three shapes: dense city, sparse rural, multi-authority metro.
- A labeled image set covering all waste classes, night, rain, and occluded cases.
- Staging uses anonymised or synthetic data only. No production data.

## 10. Defect management
| Severity | Definition | Fix target |
|---|---|---|
| Sev-1 | Data leak, data loss, total outage, security breach | Immediate, release blocker |
| Sev-2 | Core loop broken for many users, no workaround | 24 h, release blocker |
| Sev-3 | Feature degraded, workaround exists | Current sprint |
| Sev-4 | Cosmetic or minor | Backlog |

## 11. User acceptance testing (closed beta)
100-300 real users and at least 3 handlers and 2 supervisors on one tenant. Weekly feedback loop. Measure all success metrics from the PRD. UAT sign-off requires every Must requirement verified in production-like conditions.

## 12. Entry and exit criteria
**Entry to QA phase:** feature-complete for all Must requirements, API contract frozen, staging environment stable.
**Exit (release candidate):** 100% of critical test cases pass, no open Sev-1/Sev-2, unit coverage at least 80% on core modules, load and security targets met, accessibility checks clean on core flows, rollback rehearsed.
