# 06. Tenant Configuration Specification

Goal: any city, municipality or NGO anywhere goes live **through configuration only**.

## 1. What is configurable
| Area | Examples |
|---|---|
| Identity | Name, slug, country, default locale, time zone, currency |
| Geography | Boundary polygons, region hierarchy, zones |
| Authorities | Municipal, private, NGO bodies and the regions each covers |
| Waste taxonomy | Enabled categories, local labels, severity rubric |
| SLA | Response and resolution times per category and severity, business hours |
| Escalation | Ordered chain of roles and delays |
| Verification | Confidence thresholds, auto-approve rules, human-review rules |
| Reporting | Duplicate radius and window, anonymous reporting on or off, max photos |
| Notifications | Channels enabled, SMS provider, quiet hours, templates per locale |
| Branding | Logo, name display, primary color |
| Compliance | Data region, retention overrides, consent text, legal links |
| Integrations | Webhooks, SSO, maps and SMS provider overrides |

## 2. Config schema (JSON Schema, abridged)
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["schema_version", "locale", "time_zone", "sla", "verification"],
  "properties": {
    "schema_version": { "type": "integer", "const": 1 },
    "locale": {
      "type": "object",
      "properties": {
        "default": { "type": "string" },
        "supported": { "type": "array", "items": { "type": "string" } },
        "units": { "enum": ["metric", "imperial"] }
      }
    },
    "time_zone": { "type": "string" },
    "reporting": {
      "type": "object",
      "properties": {
        "allow_anonymous": { "type": "boolean", "default": true },
        "max_photos": { "type": "integer", "minimum": 1, "maximum": 5, "default": 5 },
        "duplicate_radius_m": { "type": "integer", "default": 30 },
        "duplicate_window_hours": { "type": "integer", "default": 48 },
        "auto_confirm_after_hours": { "type": "integer", "default": 72 }
      }
    },
    "verification": {
      "type": "object",
      "properties": {
        "auto_accept_confidence": { "type": "number", "default": 0.85 },
        "review_below_confidence": { "type": "number", "default": 0.60 },
        "require_before_after_geo_match_m": { "type": "integer", "default": 50 }
      }
    },
    "sla": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["respond_minutes", "resolve_minutes"],
        "properties": {
          "category": { "type": "string" },
          "severity": { "type": "integer" },
          "respond_minutes": { "type": "integer" },
          "resolve_minutes": { "type": "integer" },
          "business_hours": { "type": ["object", "null"] },
          "escalation": {
            "type": "array",
            "items": { "type": "object", "properties": { "after_minutes": { "type": "integer" }, "notify_role": { "type": "string" } } }
          }
        }
      }
    },
    "notifications": {
      "type": "object",
      "properties": {
        "channels": { "type": "array", "items": { "enum": ["push", "email", "sms"] } },
        "quiet_hours": { "type": ["object", "null"] }
      }
    },
    "branding": { "type": "object" },
    "compliance": { "type": "object", "properties": { "data_region": { "type": "string" }, "retention_days_media": { "type": "integer" } } }
  }
}
```

## 3. Example (generic city)
```json
{
  "schema_version": 1,
  "locale": { "default": "en", "supported": ["en", "es", "ar"], "units": "metric" },
  "time_zone": "Europe/Madrid",
  "reporting": { "allow_anonymous": true, "max_photos": 4, "duplicate_radius_m": 30, "duplicate_window_hours": 48, "auto_confirm_after_hours": 72 },
  "verification": { "auto_accept_confidence": 0.85, "review_below_confidence": 0.6, "require_before_after_geo_match_m": 50 },
  "sla": [
    { "category": "general", "severity": 3, "respond_minutes": 120, "resolve_minutes": 1440,
      "escalation": [ { "after_minutes": 1440, "notify_role": "supervisor" }, { "after_minutes": 2880, "notify_role": "tenant_admin" } ] },
    { "category": "hazardous", "severity": 4, "respond_minutes": 30, "resolve_minutes": 240,
      "escalation": [ { "after_minutes": 240, "notify_role": "supervisor" } ] }
  ],
  "notifications": { "channels": ["push", "email"] },
  "compliance": { "data_region": "eu", "retention_days_media": 30 }
}
```

## 4. Rules
- Config is **validated** on save (schema + semantic checks such as every enabled category having an SLA, and every SLA chain role existing).
- Config is **versioned**. Each save creates a new version with author and diff. Rollback is one click.
- Changes apply to **new** tickets only. Open tickets keep the SLA they were created under unless a supervisor re-applies.
- Config is cached in Redis and invalidated on save.
- Defaults come from a global base template, and tenants override only what they need.

## 5. Tenant onboarding runbook (target: under 2 days)
| Step | Owner | Output |
|---|---|---|
| 1. Discovery call: authorities, boundaries, languages, SLAs | Platform | Intake form completed |
| 2. Create tenant (status `draft`) | Platform | Tenant ID |
| 3. Import boundary GeoJSON, review in the map preview | Tenant admin | Regions valid, no gaps or invalid geometry |
| 4. Create authorities and map them to regions | Tenant admin | Coverage map with no uncovered areas |
| 5. Enable categories and add local labels | Tenant admin | Taxonomy set |
| 6. Set SLA and escalation | Tenant admin | Policies validated |
| 7. Invite supervisors and handlers | Tenant admin | Memberships active |
| 8. Run **go-live checklist** (automated) | System | Pass/fail report |
| 9. Test ticket end to end | Tenant admin + Platform | Report → Resolve → Confirm succeeds |
| 10. Activate | Platform | Tenant `active` |

## 6. Go-live checklist (automated)
- Boundary geometry valid (`ST_IsValid`), no self-overlap, SRID 4326.
- At least one authority covers every region, or the gaps are acknowledged.
- At least one enabled category, each with an SLA and a team able to handle it.
- At least one supervisor and one handler active.
- Default locale strings complete (no missing keys).
- Notification channels configured and a test message delivered.
- A synthetic test ticket routes to the expected authority.

## 7. Governance
Only `tenant_admin` edits tenant config. All edits write to `audit_log`. The platform team can lock fields (for example, retention minimums required by law).
