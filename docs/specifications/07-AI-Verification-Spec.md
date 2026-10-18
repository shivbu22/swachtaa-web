# 07. AI Verification Specification

## 1. Purpose
Automatically decide whether a report is genuine, what kind of waste it shows, how severe it is, and whether it duplicates an open ticket, fast enough that the citizen sees progress within seconds, with a human fallback whenever confidence is low.

## 2. Pipeline
```
Upload
  → 1. Media sanity (format, size, corruption, malware scan)
  → 2. Privacy (face and licence-plate detection → blur; EXIF moved to a side table)
  → 3. Authenticity (time/geo plausibility, re-photo and screenshot detection, stock-image check)
  → 4. Classification (waste category, severity, is-waste vs not-waste)
  → 5. Duplicate detection (geo + time + perceptual hash)
  → 6. Decision (auto-accept / needs review / reject)
  → emit VERIFIED | NEEDS_REVIEW | REJECTED | DUPLICATE
```
Each stage is idempotent and stores its output in `tickets.verification` (JSONB) with a model version.

## 3. Waste taxonomy (global master list)
| Code | Description |
|---|---|
| `general` | Mixed household or street waste |
| `organic` | Food and garden waste |
| `recyclable` | Paper, plastic, metal, glass |
| `bulky` | Furniture, appliances, mattresses |
| `construction` | Rubble, debris |
| `hazardous` | Chemicals, medical, batteries, asbestos suspected |
| `ewaste` | Electronics |
| `dead_animal` | Carcass on a public way (optional per tenant) |
| `overflow_bin` | Bin or container overflow |
| `illegal_dump` | Large unauthorised dump site |
| `not_waste` | Not a valid report |

Tenants can disable codes and add local labels but cannot add unreviewed model classes. New classes go through the model-change process (section 9).

### Severity rubric (1-4)
| Level | Meaning |
|---|---|
| 1 | Minor litter |
| 2 | Single bag or small pile |
| 3 | Large pile or overflowing container |
| 4 | Hazard, blocked road or drain, public health risk, or very large dump |

## 4. Authenticity checks
| Check | Method | Outcome |
|---|---|---|
| Time plausibility | `captured_at` vs server time (tolerance 15 min) | Flag if off |
| Geo plausibility | GPS accuracy, speed since the last report, device attestation (Play Integrity / App Attest) | Flag impossible travel |
| Re-photo / screenshot | Moiré and UI-chrome detector, EXIF software tag | Flag |
| Reused image | Global perceptual-hash index across tenants | Reject exact reuse, flag near reuse |
| Reporter reputation | Score from the confirmed vs rejected history | Adjusts thresholds |

## 5. Duplicate detection
Candidate set: open tickets within `duplicate_radius_m` and `duplicate_window_hours` (tenant config). Score = weighted blend of distance, time gap, pHash similarity, and category match. Above 0.8 offers the user a "+1 support" option. Above 0.95 with the same reporter merges automatically.

## 6. Decision logic
```
if not_waste_conf ≥ 0.80                         → REJECTED (reason shown)
elif authenticity_flags ≥ 2                      → NEEDS_REVIEW
elif top_class_conf ≥ auto_accept_confidence     → VERIFIED
elif top_class_conf ≥ review_below_confidence    → VERIFIED with "needs_review_sample" = true (10% sampled)
else                                             → NEEDS_REVIEW
```
Thresholds are tenant-configurable (defaults 0.85 / 0.60). Hazardous severity 4 is **never** auto-rejected and is always fast-tracked to routing, with a review running in parallel.

## 7. Human-in-the-loop
- Review queue shows the photo, the model's top 3 guesses with confidence, and the authenticity flags.
- Reviewer actions: approve, correct category and severity, reject with a reason, flag the reporter.
- Target review SLA: 30 minutes.
- Every correction is stored as a labeled example, which becomes training data.

## 8. Providers and models
- **Phase 1 (MVP):** hosted multimodal vision model behind the `VisionProvider` interface. Structured JSON output with a fixed schema, temperature 0, and a strict timeout (8 s) with retry.
- **Phase 2:** fine-tuned lightweight classifier (for example a ViT or EfficientNet variant) trained on reviewed data. Hosted model remains as a fallback and arbiter.
- **Privacy models:** on-server face and plate detectors, with no raw images sent to third parties until anonymised, wherever the tenant's data policy requires it.

Provider response contract:
```json
{ "is_waste": true, "category": "general", "severity": 3,
  "confidence": 0.91, "alternatives": [ { "category": "overflow_bin", "confidence": 0.06 } ],
  "hazard_signals": [], "model_version": "v1.0" }
```

## 9. Data and model governance
| Item | Plan |
|---|---|
| Dataset | Seed with 200+ images, grow to 5-10k labeled images from reviewed tickets. Balanced across regions, lighting, and waste types |
| Labeling | Two-reviewer agreement on a 10% sample, with a gold set of 500 images |
| Evaluation | Held-out set per region group. Track precision/recall per class, and calibration |
| Bias monitoring | Accuracy per tenant and per environment type (urban, rural, night, rain). Alert on a gap above 10 points |
| Model release | Shadow mode for 1 week → 10% traffic → full. Rollback in one flag |
| Drift | Weekly confidence histogram and reviewer-disagreement rate |

## 10. Targets
| Metric | MVP target |
|---|---|
| Category accuracy (accepted tickets) | above 90% |
| Hazard recall (severity 4) | above 95% |
| False reject rate | below 2% |
| Duplicate precision | above 85% |
| p95 pipeline latency | under 20 s |
| Cost per verified ticket | under $0.02 |

## 11. Failure modes
| Failure | Behavior |
|---|---|
| Provider timeout or outage | Retry twice, then `NEEDS_REVIEW`, loop continues |
| Corrupt media | Ask the user to retake, ticket held as a draft |
| Adversarial or abusive content | Reject, increment abuse score, auto-flag the account after 3 strikes |
| Low-light or blurry photo | Prompt for a retake with specific guidance |

## 12. Privacy
Faces and plates are blurred before any storage of the display copy. EXIF (including device identifiers) is stripped from display media. Raw originals are kept for at most 30 days in a restricted bucket for audit and then deleted.
