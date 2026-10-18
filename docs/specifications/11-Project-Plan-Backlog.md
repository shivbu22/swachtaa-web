# 11. Project Plan and Backlog

## 1. Delivery approach
Two-week sprints, 7 sprints plus a closed beta (about 16 weeks). One demoable increment per sprint. Weekly scope review. The MVP scope in the PRD is frozen. Anything new goes to the post-MVP list.

## 2. Team and roles
| Role | Owner | Notes |
|---|---|---|
| Product, architecture, delivery | Founder | Decides scope and priorities |
| Engineering | Founder + AI-assisted development; add 1 contract mobile/backend engineer if velocity lags | Buy rather than build auth, maps, SMS |
| Design | Founder with a design-system kit | Usability tests in sprint 2 |
| Field operations and pilot partner | Beta-tenant partner (NGO or operator) | Provides real handlers and supervisors |
| Legal and privacy | External counsel, one-time review | DPIA, privacy notice, terms |

## 3. Epics
| Epic | Description | Requirements |
|---|---|---|
| E0 | Foundations: repo, CI/CD, infra, environments | none |
| E1 | Identity and roles | FR-001 to FR-005 |
| E2 | Tenancy, regions, and config | FR-061, FR-070 to FR-073 |
| E3 | Reporting and media | FR-010 to FR-015 |
| E4 | Verification engine | FR-020 to FR-024 |
| E5 | Routing and SLA | FR-030 to FR-034 |
| E6 | Handler workflow | FR-040 to FR-043 |
| E7 | Notifications | FR-050 to FR-052 |
| E8 | Admin consoles and analytics | FR-060 to FR-063 |
| E9 | Hardening: security, performance, accessibility | NFRs |
| E10 | Beta launch and measurement | Success metrics |

## 4. Sprint plan
| Sprint | Weeks | Goal | Demo at end |
|---|---|---|---|
| 0 | 1-2 | Foundations, discovery sign-off | Repo, CI, staging up, "hello" API, ERD approved, clickable prototype started |
| 1 | 3-4 | Identity, tenancy, geo core | Login, create tenant, import boundary, resolve region from a point |
| 2 | 5-6 | Reporting loop (client + API) | Submit a photo report offline and online, ticket appears in the admin queue |
| 3 | 7-8 | Verification and duplicates | Auto-classification with review queue and duplicate suggestion |
| 4 | 9-10 | Routing, SLA, handler app | Ticket auto-assigned, handler resolves with proof |
| 5 | 11-12 | Notifications, confirmations, escalation, admin analytics | Full loop end to end with SLA breach escalation |
| 6 | 13-14 | Hardening: security, load, accessibility, i18n, second-tenant test | Pen-test fixes, load report, second tenant live in under 2 days |
| Beta | 15-16+ | Closed beta, measurement | Metrics report vs targets |

## 5. Prioritised backlog (top items)
Estimates in ideal days. Priority order within each sprint.

### Sprint 0
| Story | Est |
|---|---|
| Monorepo, linting, type-check, commit conventions | 1 |
| CI pipeline with Postgres/PostGIS containers | 2 |
| Terraform: dev and staging environments | 3 |
| Docker Compose local stack and seed script | 1 |
| Choose and configure auth provider, maps, SMS, push, vision providers | 2 |
| Finalise PRD, ERD, API contract, UX prototype | 4 |

### Sprint 1
| Story | Est |
|---|---|
| Auth: OTP, social login, refresh rotation | 3 |
| Roles, memberships, route guards | 2 |
| Tenant model, RLS policies, RLS test suite | 3 |
| Region import (GeoJSON), validation, map preview | 3 |
| Point-in-polygon resolution service | 1 |
| Tenant config schema, validation, versioning | 2 |

### Sprint 2
| Story | Est |
|---|---|
| Signed upload flow and media service | 2 |
| Create-ticket API with idempotency | 2 |
| Camera and report flow (mobile) with offline queue | 4 |
| Image processing: strip EXIF, thumbnails, face/plate blur | 3 |
| My reports list and ticket detail | 2 |
| Admin queue (basic) | 2 |

### Sprint 3
| Story | Est |
|---|---|
| `VisionProvider` interface and the first provider | 2 |
| Verification pipeline and thresholds | 3 |
| Authenticity checks (time, geo, reuse) | 3 |
| Duplicate detection and "support" action | 3 |
| Review queue UI and decisions | 3 |

### Sprint 4
| Story | Est |
|---|---|
| Authority and team management | 2 |
| Routing engine (authority → team → handler) | 4 |
| SLA policy model and scheduler | 3 |
| Handler app: tasks, accept/decline, start, resolve with proof | 4 |
| Location heartbeat and proximity ranking | 1 |

### Sprint 5
| Story | Est |
|---|---|
| Notification service: push, email, SMS adapters, templates | 4 |
| Citizen confirm, reopen, rating, auto-confirm | 2 |
| Escalation engine and chain config | 2 |
| Admin analytics: KPIs, heatmap, exports | 3 |
| Webhooks | 2 |

### Sprint 6
| Story | Est |
|---|---|
| Authorization test sweep across all endpoints | 2 |
| Pen-test or OWASP self-test and fixes | 3 |
| Load test and tuning | 2 |
| Accessibility and RTL pass, two additional languages | 3 |
| Go-live checklist automation and second-tenant onboarding trial | 3 |
| Runbooks, dashboards, alerts, restore drill | 2 |

## 6. Definition of Ready
Story has acceptance criteria, linked requirement IDs, a UX reference if user-facing, an API contract if it touches the API, and an estimate of 3 days or less.

## 7. Definition of Done
Code reviewed and merged. Tests written and passing in CI. Migrations safe and reversible via expand/contract. Telemetry added. Strings externalized. Accessibility checked. Docs updated. Deployed to staging behind a flag. Product sign-off against the acceptance criteria.

## 8. Milestones and gates
| Milestone | Date target | Gate |
|---|---|---|
| M0 Docs approved, foundations ready | Week 2 | PRD and architecture signed off |
| M1 Walking skeleton | Week 6 | Report → admin queue works on staging |
| M2 Verified loop | Week 8 | Auto-verification and review operational |
| M3 Full loop | Week 12 | Report → Resolve → Confirm with SLA escalation |
| M4 Release candidate | Week 14 | QA exit criteria met |
| M5 Beta live | Week 15 | First tenant live |
| M6 MVP proven | Week 20 | Success metrics hit and second-city test passed |

## 9. Risk register
| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R1 | Authorities won't adopt | High | High | Start with NGOs and private operators, show SLA data to win government | Founder |
| R2 | Fake or duplicate reports | Medium | Medium | Authenticity checks, reputation, review queue | Founder |
| R3 | AI accuracy below target | Medium | High | Human review fallback, collect labels early, shadow-test models | Founder |
| R4 | Privacy or legal problem in a new country | Medium | High | Country launch checklist, DPIA, counsel review | Founder |
| R5 | Scope creep | High | Medium | Frozen MVP, weekly scope review | Founder |
| R6 | Single-person bandwidth | High | High | Managed services, contract help, ruthless prioritisation | Founder |
| R7 | Vendor outage or price jump | Low | Medium | Provider interfaces, fallback providers | Founder |
| R8 | Low-end device and network issues | Medium | Medium | Offline queue, compression, device matrix testing | Founder |
| R9 | Cross-tenant data leak | Low | Critical | RLS, automated isolation tests, pen-test | Founder |
| R10 | Cost overrun | Medium | Medium | Budgets and alerts, usage caps on AI and SMS | Founder |

## 10. Post-MVP roadmap (not in scope now)
1. Recyclables marketplace and household subscriptions (billing, payouts).
2. Route optimisation for collection fleets.
3. Predictive hotspot modelling.
4. Public transparency portal and open-data API.
5. IoT bin sensors and fill-level routing.
6. Gamification and community clean-up events.
7. Enterprise tenants: SSO, dedicated databases, data residency stacks.

## 11. Decisions needed from the founder before Sprint 0 ends
| Decision | Options | Recommendation |
|---|---|---|
| Beta tenant | Which partner (NGO, operator, municipality) goes first | Pick the partner with real handlers who will use the app |
| Launch languages | EN + two | Choose from the beta tenant's needs |
| Auth provider | Auth0, Clerk, Cognito | Pick the one with the best phone-OTP coverage for the beta region |
| Maps provider | Mapbox, Google | Mapbox for cost, Google for coverage |
| Contract engineer | Yes or no | Yes, if velocity is under plan after Sprint 1 |
| Legal counsel | Retain for DPIA, terms, privacy | Yes, one-time engagement |
