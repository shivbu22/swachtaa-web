# 10. DevOps and Release Plan

## 1. Goals
Ship small changes safely and often, recover fast, and see problems before users do.

## 2. Repository and branching
- **Monorepo** (pnpm + Turborepo): `apps/api`, `apps/worker`, `apps/mobile`, `apps/admin`, `packages/shared` (types, validation, i18n), `infra/` (Terraform), `docs/`.
- **Trunk-based development:** short-lived feature branches, PRs into `main`, feature flags for unfinished work.
- Conventional Commits. Semantic versioning for the API and the mobile app.
- Protected `main`: PR review, passing CI, signed commits for release tags.

## 3. Environments
| Env | Purpose | Data | Deploy |
|---|---|---|---|
| local | Developer machines via Docker Compose (Postgres/PostGIS, Redis, MinIO, mailhog) | Seed data | Manual |
| dev | Integration sandbox | Synthetic | Auto on merge to `main` |
| staging | Production-like, load tests, UAT | Anonymised/synthetic | Auto on release candidate tag |
| production | Live | Real | Manual approval gate |

All provisioned from the same Terraform modules. Configuration through environment variables and the secret manager. No per-environment code branches.

## 4. CI pipeline (every PR)
1. Install and cache dependencies.
2. Lint, type-check, format check.
3. Unit tests with coverage gate.
4. Spin up Postgres/PostGIS and Redis containers → integration tests, including the RLS isolation suite.
5. OpenAPI generation, contract diff check (fail on breaking change).
6. SAST, dependency audit, secret scan, license check.
7. Build Docker images, container scan, SBOM.
8. Preview deployment for the admin web.

## 5. CD pipeline
```
merge to main → build & push images → deploy dev → smoke tests
tag vX.Y.Z-rc → deploy staging → e2e + load + security baseline
manual approval → production: DB migration (expand) → rolling deploy API/workers → smoke tests → flag rollout
```
- **Mobile:** EAS Build → internal track (TestFlight / Play Internal) → staged rollout 5% → 25% → 100%. OTA updates for JS-only fixes.
- **Database migrations:** expand/contract only. Backwards-compatible with the previous app version. Destructive changes ship in a later release.
- **Deploy strategy:** rolling or blue/green with health checks and automatic rollback on failed readiness.

## 6. Infrastructure (Terraform)
| Resource | Notes |
|---|---|
| Container platform | Managed containers (ECS Fargate / Cloud Run / equivalent), min 2 API tasks, autoscaling |
| Postgres | Managed, Multi-AZ, PostGIS enabled, PITR, encrypted, private subnet |
| Redis | Managed, private |
| Object storage | Private buckets: `raw` (30-day lifecycle), `display`, `exports`. Versioning on |
| CDN | Signed URLs for media |
| Networking | VPC, private subnets for data, NAT, WAF in front of the API |
| Secrets/KMS | Managed secret store, per-environment keys |
| DNS/TLS | Managed certificates, HSTS |
| Cost controls | Budgets and alerts per environment, tagging by tenant-agnostic service |

## 7. Observability
| Signal | Tooling | Examples |
|---|---|---|
| Errors | Sentry (API, worker, mobile, web) | Release health, crash-free rate |
| Traces | OpenTelemetry → Grafana Tempo or equivalent | Request → queue → worker spans with `ticket_id` |
| Metrics | Prometheus/Grafana | RPS, latency, queue depth, job failure rate, verification latency |
| Logs | Structured JSON, centralised, PII-scrubbed | Correlated by `request_id` |
| Business metrics | Dashboard from the analytics module | Tickets created, verified rate, SLA breach rate, time to resolve |

### SLOs and alerts
| SLO | Target | Alert |
|---|---|---|
| API availability | 99.5% monthly | Burn-rate alerts (fast and slow) |
| p95 latency | under 400 ms | Above 600 ms for 10 min |
| Verification p95 | under 20 s | Above 40 s for 10 min |
| Queue depth | under 500 jobs | Above 2,000 for 5 min |
| Job failure rate | under 1% | Above 5% for 5 min |
| SLA scheduler heartbeat | every 30 s | Missed for 2 min (page) |
| Crash-free sessions (mobile) | above 99% | Below 98.5% |

On-call: founder-led rotation for MVP, with a paging tool, escalation to a backup, and a runbook link in every alert.

## 8. Backup and disaster recovery
- Postgres PITR (RPO 15 min), daily snapshots retained 35 days, cross-region copy weekly.
- Object storage versioning and cross-region replication for display media.
- **Restore drill** monthly in staging. RTO target 2 hours.
- Infrastructure is fully reproducible from Terraform. Secrets are recoverable from the secret manager.

## 9. Release management
| Item | Rule |
|---|---|
| Cadence | Weekly API/admin releases, mobile every 2 weeks |
| Release notes | Auto-generated from commits, reviewed by product |
| Feature flags | Every user-visible feature behind a flag, per tenant where needed |
| Go/no-go checklist | Tests green, migrations reviewed, rollback plan, on-call aware, comms ready |
| Rollback | One command to the previous image. Forward-fix preferred for data changes. Flags off first |
| Hotfix | Branch from the release tag, fast-track CI, same gates, post-mortem if user-impacting |

## 10. Runbooks (write before launch)
1. API high error rate or latency.
2. Queue backlog or stuck workers.
3. Vision provider outage (switch to review-only mode).
4. Database failover and restore.
5. Notification provider failure (switch provider).
6. Tenant data-leak suspicion (isolate, audit, notify).
7. SLA scheduler stopped.
8. Mobile release regression (halt rollout, revert flag).
9. Secret or key rotation.
10. New tenant go-live support.

## 11. Cost model (MVP beta, indicative)
| Item | Monthly |
|---|---|
| Containers + DB + Redis + storage | $150-300 |
| Maps, SMS, push, email | $50-150 (scales with usage) |
| Vision model calls | about $0.01-0.02 per ticket |
| Monitoring and tooling | $0-100 on free/startup tiers |
| **Total (single tenant beta)** | **about $300-550** |

Review monthly. Set hard budget alerts at 80% and 100%.
