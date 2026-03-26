---
name: texas-sfr
description: "Texas state law base layer for single-family residential plan review. Covers Texas 89th Legislature (2025) statutes — SB 15, SB 840, HB 24 — building code adoption, and preemption rules. Loaded by Texas city-level review skills during state law verification. This is a reference layer, not a standalone reviewer."
---

# Texas SFR — State Law Base Layer

This skill is the Texas state-level foundation for residential plan review. It is not a standalone plan reviewer — it is loaded by **city-level review skills** during their state law verification phase (typically Phase 3B). City skills load this layer first, then apply their local amendments on top.

**Pattern:** `texas-sfr` (state layer) + `austin-sfr` (city layer) → full Austin review
This mirrors how CA works: `california-adu` (state) + `buena-park-adu` (city) → full Buena Park review.

---

## What This Layer Covers

| Statute | Topic | Effective |
|---------|-------|-----------|
| SB 15 (2025) | Lot size, density, small-lot setbacks, parking preemption | Sept 1, 2025 |
| SB 840 (2025) | By-right multifamily/mixed-use in commercial zones | Sept 1, 2025 |
| HB 24 (2025) | Zoning change procedures (legislative context only) | Sept 1, 2025 |
| Tex. Gov't Code Ch. 214 | IRC/IBC adoption by reference | Ongoing |
| Texas Energy Code | IECC adoption | Ongoing |
| Texas Accessibility Standards (TAS) | Accessibility for new construction | Ongoing |

---

## Preemption Principle

Texas state law sets a **floor** — it tells municipalities the most restrictive they can be.

- **City more restrictive than state floor** → state law **preempts**; do not cite the local rule as enforceable
- **City more permissive than state floor** → city rule governs
- **Do not issue a correction based on a local rule that state law has preempted**

See `references/preemption-guide.md` for the full lookup table.

---

## How City Skills Use This Layer

In Phase 3 (state law verification), a Texas city review skill should:

1. Load `references/texas-state-law.md` — verify each FAIL/UNCLEAR finding against applicable Texas statutes
2. Load `references/texas-building-codes.md` — confirm IRC/IBC edition and energy code baseline
3. Load `references/preemption-guide.md` — check whether any local provision being cited is preempted
4. Load the city's own `local-amendments.md` — apply city-specific rules on top

---

## Reference Files

| File | Contents |
|------|----------|
| `references/texas-state-law.md` | SB 15, SB 840, HB 24 — full statute content with interaction tables |
| `references/texas-building-codes.md` | IRC/IBC/TAS/Energy Code adoption, editions, and city amendment authority |
| `references/preemption-guide.md` | Quick-reference preemption lookup table for plan checkers |

---

## Applicability Notes

- **SB 15 effective date:** September 1, 2025. For permits submitted before that date, SB 15 does not apply.
- **Qualifying municipalities for SB 15:** Population >150,000 in a county with population >300,000. Austin qualifies. Verify for smaller cities.
- **SB 840** applies to new development and conversion permits filed on or after September 1, 2025 in commercially-zoned areas.
- **HB 24** governs the zoning change *process*, not development standards — not applicable during permit plan review.

---

## Onboarded Texas Cities

When a city is onboarded, add it here:

| City | Slug | Path |
|------|------|------|
| Austin | `austin-sfr` | *(pending — city layer in development)* |
