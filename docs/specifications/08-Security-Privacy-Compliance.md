# 08. Security, Privacy and Compliance

## 1. Security principles
Least privilege · Defence in depth · Secure by default · Tenant isolation at the database · Everything audited · No secrets in code.

## 2. Roles and permissions matrix
| Capability | Anonymous | Citizen | Handler | Supervisor | Tenant admin | Platform admin |
|---|---|---|---|---|---|---|
| Create report | ✔ (if enabled) | ✔ | ✔ | ✔ | ✔ | n/a |
| View own tickets | device only | ✔ | ✔ | ✔ | ✔ | audited |
| View public map feed (anonymised) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| View assigned tasks | | | ✔ | ✔ | ✔ | |
| View tenant queue | | | | ✔ | ✔ | audited |
| Reassign / merge / close | | | | ✔ | ✔ | |
| Edit tenant config | | | | | ✔ | audited |
| Manage tenants | | | | | | ✔ |
| Access raw media | | | | | | break-glass, audited |

Authorization is enforced in three layers: route guards (role), service rules (ownership), and database RLS (tenant).

## 3. Authentication and sessions
- Phone OTP, email magic link, and Google/Apple sign-in through a managed identity provider.
- Access token 15 minutes, refresh token 30 days with rotation and reuse detection.
- OTP: 6 digits, 5-minute expiry, rate limited (5 per hour per number), SIM-swap risk accepted for MVP, mitigated by device binding.
- MFA mandatory for supervisor, tenant admin, and platform admin roles.
- Mobile: tokens in Keychain/Keystore. Certificate pinning on the API host. Jailbreak/root signals feed the risk score.

## 4. Threat model (STRIDE summary)
| Threat | Example | Control |
|---|---|---|
| Spoofing | Fake reporter, fake handler | Device attestation, OTP, MFA for staff, signed webhooks |
| Tampering | Edited photo, altered ticket | Server-side EXIF/geo checks, signed upload URLs, append-only events |
| Repudiation | "I never closed that" | Immutable `ticket_events` and `audit_log` with actor and IP |
| Information disclosure | Cross-tenant leak, exposed media | RLS, private buckets, signed URLs, PII minimisation |
| Denial of service | Report flooding | Rate limits, WAF, queue backpressure, reputation-weighted limits |
| Elevation of privilege | Citizen calls admin API | Role guards, deny by default, tests on every route |
| Abuse | Fake reports to harass | Reputation, review queue, reporter flagging, appeal path |
| Supply chain | Malicious dependency | Lockfiles, SCA scanning, pinned versions, SBOM |

## 5. Application security controls
- OWASP ASVS Level 2 as the target. OWASP API Top 10 reviewed per release.
- Input validation at the edge (schema) and the service layer. Parameterised queries only.
- File upload: type sniffing, size caps, re-encode images, malware scan, no execution paths.
- Output encoding and a strict CSP on the admin web. CSRF protection for cookie sessions.
- Secrets in a managed secret store. Rotation every 90 days. No secrets in logs.
- Dependency and container scanning in CI. Block on critical findings.
- Infrastructure: private subnets for data stores, security groups by least privilege, TLS 1.2+ everywhere, encryption at rest (KMS), WAF in front of the API.

## 6. Data classification
| Class | Examples | Handling |
|---|---|---|
| Restricted | Raw media with EXIF, phone numbers, precise location history | Encrypted, access-logged, minimal retention |
| Confidential | Tenant config, tickets, handler locations | Tenant-isolated, role-gated |
| Internal | Metrics, logs (scrubbed) | Staff only |
| Public | Anonymised map feed, aggregate statistics | Open |

## 7. Privacy by design
- **Data minimisation:** collect only what routing and verification need. Anonymous reporting supported.
- **Faces and plates:** blurred before display storage. Reporter identity is never shown to other citizens.
- **Location:** precise location used for routing. Public map shows coarsened locations for sensitive categories.
- **Handler tracking:** location collected only while on duty, with visible indicators, and retained for 30 days.
- **Consent:** explicit consent screens (privacy, location, camera, notifications) with the version and timestamp stored.
- **Children:** the app is not directed to children. Users under the local digital-consent age require guardian consent where the law demands it.

## 8. Regulatory mapping
| Regime | Key obligations | How Swachta meets them |
|---|---|---|
| GDPR (EU/UK) | Lawful basis, DSAR, erasure, DPIA, breach notice in 72 h, SCCs for transfers | Consent and legitimate-interest records, `/me/export`, `/me` delete, DPIA before first EU tenant, EU data region |
| CCPA/CPRA (US-CA) | Notice, opt-out of sale, access, deletion | No sale of data, privacy notice, DSAR flows |
| India DPDP Act | Consent, notice, grievance officer, breach reporting | Itemised consent, grievance contact in the app, localisation option |
| Other (e.g., LGPD, PDPA, POPIA) | Similar rights | Handled by the same DSAR and consent framework, with legal review per new country |
| Accessibility (e.g., EAA, ADA) | WCAG | WCAG 2.1 AA target |
| Public-sector procurement | Security attestations | SOC 2 Type I as a post-MVP goal, ISO 27001 roadmap |

A **country launch checklist** (legal review, data region, language, consent text, SMS sender registration, and local authority agreement) gates every new tenant in a new country.

## 9. Data subject rights process
Access, export, correction, deletion, objection. Verify identity, execute within 30 days, log every request. Deletion removes PII and nulls the reporter on tickets, keeping anonymised operational records.

## 10. Logging, monitoring, incident response
- Structured logs, PII-scrubbed. Security events (login failures, role changes, config edits, break-glass access) alert in real time.
- Severity levels SEV1-SEV4 with owners and response targets (SEV1: acknowledge in 15 min).
- Incident playbook: detect → contain → eradicate → recover → notify (regulators and tenants as required) → post-mortem within 5 working days.
- Breach notification templates prepared per regime.

## 11. Pre-launch security checklist
- [ ] Threat model reviewed and signed off
- [ ] RLS tests prove no cross-tenant reads or writes
- [ ] Automated authorization tests cover every endpoint and role
- [ ] SAST, SCA, secret scan, and container scan clean of critical/high issues
- [ ] Independent penetration test, or a structured self-test on the OWASP checklist
- [ ] Backup restore drill completed
- [ ] DPIA and privacy notice published
- [ ] Rate limiting and WAF rules active
- [ ] Break-glass access procedure tested and alerting
- [ ] Incident contacts and runbook distributed
