# 04. API Specification (v1)

**Style:** REST over HTTPS, JSON, OpenAPI 3.1 generated from code. Base URL: `https://api.<domain>/v1`.

## 1. Conventions
| Topic | Rule |
|---|---|
| Auth | `Authorization: Bearer <JWT>`. Claims: `sub`, `tid` (active tenant), `roles`, `locale` |
| Tenant | `X-Tenant-Id` header selects the active tenant (validated against membership). Anonymous report endpoints resolve the tenant by geo |
| Locale | `Accept-Language`. Responses return localized labels where applicable |
| IDs | UUID strings |
| Time | ISO 8601 UTC |
| Money | `{ "amount": 1250, "currency": "USD" }` in minor units |
| Pagination | Cursor: `?limit=25&cursor=...` → `{ data: [], next_cursor }` |
| Idempotency | `Idempotency-Key` header required on all `POST` that create resources |
| Versioning | URL major version. Additive changes are non-breaking |
| Rate limits | Per user and per IP, `429` with `Retry-After`. Report creation: 20/hour per user |

## 2. Error format
```json
{
  "error": {
    "code": "TICKET_DUPLICATE",
    "message": "A similar report already exists nearby.",
    "details": { "duplicate_of": "018f..." },
    "request_id": "req_9f2..."
  }
}
```
Standard codes: `400 VALIDATION_FAILED`, `401 UNAUTHENTICATED`, `403 FORBIDDEN`, `404 NOT_FOUND`, `409 CONFLICT / INVALID_STATE_TRANSITION`, `413 MEDIA_TOO_LARGE`, `422 UNPROCESSABLE`, `429 RATE_LIMITED`, `5xx INTERNAL`.

## 3. Endpoints

### Auth and profile
| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/otp/request` | Send phone/email OTP |
| POST | `/auth/otp/verify` | Exchange OTP for tokens |
| POST | `/auth/anonymous` | Issue an anonymous device token |
| POST | `/auth/refresh` | Refresh the access token |
| GET / PATCH | `/me` | Profile, locale, notification prefs |
| GET | `/me/memberships` | Tenants and roles |
| POST | `/me/export` | Request data export |
| DELETE | `/me` | Request account deletion |

### Reporting
| Method | Path | Purpose |
|---|---|---|
| POST | `/media/upload-urls` | Get signed upload URLs for N images |
| POST | `/tickets` | Create a report or pickup request |
| GET | `/tickets/{id}` | Ticket detail with timeline |
| GET | `/tickets` | List (own, or queue for staff). Filters: `status`, `category`, `bbox`, `since` |
| POST | `/tickets/{id}/plus-one` | Support an existing ticket (duplicate) |
| POST | `/tickets/{id}/confirm` | Citizen confirms resolution (+ rating) |
| POST | `/tickets/{id}/reopen` | Citizen reopens with a reason |
| GET | `/tickets/nearby` | Map feed for a bounding box |

### Handler
| Method | Path | Purpose |
|---|---|---|
| GET | `/handler/tasks` | My assignments |
| POST | `/handler/tasks/{id}/accept` | Accept |
| POST | `/handler/tasks/{id}/decline` | Decline with reason |
| POST | `/handler/tasks/{id}/start` | Start |
| POST | `/handler/tasks/{id}/resolve` | Resolve with after-photo keys |
| PUT | `/handler/location` | Heartbeat location |

### Supervisor / tenant admin
| Method | Path | Purpose |
|---|---|---|
| GET | `/admin/queue` | Prioritised queue with SLA flags |
| POST | `/admin/tickets/{id}/reassign` | Reassign team or handler |
| POST | `/admin/tickets/{id}/merge` | Merge duplicates |
| POST | `/admin/tickets/{id}/close` | Close with reason |
| GET | `/admin/analytics/summary` | KPIs for the period |
| GET | `/admin/analytics/heatmap` | Aggregated geo cells |
| GET / PUT | `/admin/config` | Read or update tenant config (validated, versioned) |
| POST | `/admin/regions/import` | Upload GeoJSON boundary file |
| CRUD | `/admin/authorities`, `/admin/teams`, `/admin/users` | Org management |
| GET | `/admin/review-queue` | Tickets in `NEEDS_REVIEW` |
| POST | `/admin/review-queue/{id}/decision` | Approve, correct category, or reject |

### Platform admin
| Method | Path | Purpose |
|---|---|---|
| CRUD | `/platform/tenants` | Create and manage tenants |
| POST | `/platform/tenants/{id}/activate` | Run go-live checks and activate |
| GET | `/platform/health` | System and queue health |
| POST | `/platform/flags` | Feature flags |

## 4. Key payloads

**Upload URLs**
```http
POST /media/upload-urls
{ "count": 2, "content_type": "image/jpeg" }
→ 200 { "uploads": [ { "key": "tmp/ab12.jpg", "url": "https://...signed...", "expires_in": 600 } ] }
```

**Create ticket**
```http
POST /tickets
Idempotency-Key: 6b1c...
{
  "kind": "report",
  "location": { "lat": 28.6692, "lng": 77.4538, "accuracy_m": 8.5 },
  "captured_at": "2026-10-03T08:15:00Z",
  "media_keys": ["tmp/ab12.jpg", "tmp/ab13.jpg"],
  "category_hint": "general",
  "note": "Overflowing bin near market gate"
}
→ 201
{
  "id": "018f...",
  "status": "VERIFYING",
  "tenant_id": "018e...",
  "sla_due_at": null,
  "duplicate_candidates": []
}
```

**Ticket detail (excerpt)**
```json
{
  "id": "018f...", "status": "ASSIGNED", "category": { "code": "general", "label": "General waste" },
  "severity": 3, "authority": { "id": "...", "name": "City Sanitation Dept" },
  "sla_due_at": "2026-10-04T08:15:00Z",
  "media": [ { "phase": "before", "url": "https://cdn/...signed" } ],
  "timeline": [ { "type": "CREATED", "at": "..." }, { "type": "VERIFIED", "at": "..." }, { "type": "ASSIGNED", "at": "..." } ]
}
```

## 5. Webhooks (tenant-configurable)
Events: `ticket.created`, `ticket.verified`, `ticket.assigned`, `ticket.resolved`, `ticket.confirmed`, `sla.breached`, `ticket.escalated`.
Delivery: HTTPS `POST`, signed with `X-Swachta-Signature` (HMAC-SHA256), retries over 24 h with backoff, replay endpoint in the admin console.

## 6. Realtime
Server-sent events or WebSocket channel `tickets:{id}` for live status and `tenant:{id}:queue` for the supervisor queue. Mobile falls back to push and polling.

## 7. Security notes
- All media is private. Clients use short-lived signed URLs (10 minutes).
- Admin endpoints require the `tenant_admin` or `supervisor` role plus tenant match. All writes are audited.
- Input limits: max 5 images per ticket, 10 MB each, `image/jpeg|png|heic|webp` only. Server-side content sniffing.
