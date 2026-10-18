# Swachta: Pre-Development Documentation Set

**Product:** Swachta, a global, location-agnostic civic-tech platform for reporting, verifying, routing and resolving solid-waste issues.
**Version:** 1.0 (pre-build baseline) **Owner:** Shiv (Founder / Product) **Status:** Approved for development

## Document map

| # | Document | Answers | Build step |
|---|---|---|---|
| 01 | Product Requirements (PRD) | What are we building, for whom, and how do we know it works? | 1 Discovery |
| 02 | System Architecture | How is it structured and why? | 2 Architecture |
| 03 | Database Design | What is stored and how is tenant data isolated? | 3 System/DB |
| 04 | API Specification | How do clients talk to the backend? | 3 System/DB |
| 05 | UX Specification | What does each user see and do? | 4 UI/UX |
| 06 | Tenant Configuration Spec | How does a new city go live without code? | 3 / 5 |
| 07 | AI Verification Spec | How are reports verified automatically? | 5 Implementation |
| 08 | Security, Privacy & Compliance | How is it safe and lawful worldwide? | 6 QA/Security |
| 09 | QA & Test Plan | How do we prove it works? | 6 QA/Security |
| 10 | DevOps & Release Plan | How is it built, shipped and monitored? | 7 DevOps |
| 11 | Project Plan & Backlog | Who does what, when? | All |

## Reading order for a new developer
01 → 02 → 03 → 04 → 06 → 07 → 05 → 08 → 09 → 10 → 11

## Global design rules (apply to every document)
1. **No hard-coded geography.** Country, city, authority, language, currency, waste taxonomy and SLA are configuration.
2. **Every row belongs to a tenant** (`tenant_id`) and is isolated by row-level security.
3. **Modular monolith first.** Split services only when a measured need appears.
4. **Money in minor units + ISO 4217 code. Time in UTC + IANA zone. Text in UTF-8 with ICU messages.**
5. **Privacy by default.** Minimal PII, auto-blur of faces and plates, deletion on request.
6. **Everything observable.** Every ticket state change is an immutable event.

## Glossary
- **Tenant:** one city, municipality, NGO or operator running on the platform.
- **Region:** a node in the geographic hierarchy (country → region → city → zone). Authorities own polygons.
- **Authority:** the body responsible for resolving a ticket (municipality, private collector, NGO).
- **Handler:** a field worker or crew who performs pickups and cleanups.
- **Ticket:** a report or request moving through the Report → Verify → Route → Resolve → Confirm loop.
- **SLA policy:** time limits and escalation rules for a ticket type.
